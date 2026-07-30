# Mensajería entre anfitrión y huésped

Flypnp tiene un chat privado asociado a una reserva. Los únicos participantes
son:

- El huésped que creó la reserva.
- El usuario propietario de la vivienda reservada.

Una conversación no se crea desde una wishlist. Se crea cuando uno de los dos
participantes abre el chat de una reserva existente, aunque la reserva todavía
esté pendiente de pago.

## Flujo de usuario

1. El anfitrión publica una vivienda desde **List your home**.
2. Flypnp guarda al usuario autenticado como `owner` de la vivienda.
3. Otro usuario reserva esa vivienda. La reserva aparece inicialmente con
   estado `pending`.
4. El huésped abre **Trips → Message host**, o el anfitrión abre
   **Host dashboard → Message guest**.
5. La API crea una conversación para la reserva, o devuelve la existente.
6. Ambos participantes intercambian mensajes desde `/messages`.
7. Los mensajes nuevos y contadores de no leídos se actualizan sin recargar.

Las viviendas seed antiguas que no tienen `owner` no pueden generar una
conversación real. Para probar el flujo debe utilizarse una vivienda creada
desde **List your home**.

## Arquitectura

El chat no utiliza WebSocket. Combina:

- **MongoDB** para conservar conversaciones y mensajes.
- **HTTP REST** para crear conversaciones, cargar mensajes, enviar mensajes y
  marcar mensajes como leídos.
- **Server-Sent Events (SSE)** para recibir actualizaciones del servidor en
  tiempo real, incluyendo mensajes e indicadores de escritura.

El navegador siempre envía un mensaje mediante un `POST`. Después de guardarlo,
el backend publica un evento SSE para los dos participantes. De este modo, el
otro navegador recibe el mensaje sin consultar continuamente la API.

```text
Navegador A ── POST mensaje ──> Express ── guarda ──> MongoDB
                                   │
                                   └── evento SSE ──> Navegadores A y B
```

SSE se utiliza porque las actualizaciones espontáneas viajan principalmente
desde el servidor hacia el navegador. El envío en sentido contrario conserva
las ventajas de una petición HTTP normal: autenticación, validación, respuestas
de error y rate limiting.

## Persistencia en MongoDB

### Conversation

Una conversación contiene:

- `booking`: reserva relacionada. Es única, por lo que sólo existe una
  conversación por reserva.
- `guest`: usuario que creó la reserva.
- `host`: propietario de la vivienda.
- `lastMessageText`: texto utilizado como vista previa en la bandeja.
- `lastMessageAt`: fecha usada para ordenar las conversaciones.
- `lastMessageSender`: autor del último mensaje.

El modelo está en
`backend/src/models/Conversation.ts`.

### Message

Cada mensaje contiene:

- `conversation`: conversación a la que pertenece.
- `sender`: usuario que lo envió.
- `body`: texto, con un máximo de 2.000 caracteres.
- `readBy`: usuarios que ya lo han leído.
- `createdAt` y `updatedAt`: fechas generadas por Mongoose.

El modelo está en `backend/src/models/Message.ts`.

El estado “está escribiendo” no se guarda en MongoDB. Es información efímera
que se publica directamente por SSE y desaparece al dejar de escribir.

## Autorización y seguridad

Todos los endpoints requieren autenticación.

Al crear una conversación, el backend obtiene los participantes directamente
de la reserva y de la propiedad guardadas en MongoDB:

- `booking.owner` determina el huésped.
- `place.owner` determina el anfitrión.

El navegador no puede elegir arbitrariamente los participantes. Para cada
lectura, envío o cambio de estado, el backend vuelve a comprobar que el usuario
autenticado sea el huésped o el anfitrión de esa conversación.

Otras protecciones:

- Validación de identificadores MongoDB.
- Mensajes vacíos rechazados.
- Longitud máxima de 2.000 caracteres.
- Máximo de 60 envíos por minuto y usuario.
- React escapa el contenido textual al renderizarlo.
- Una conversación no puede reasignarse a otra reserva.

La lógica está centralizada en
`backend/src/controllers/messageController.ts`.

## API

Todos los endpoints están bajo `/api/v1`.

| Método | Ruta | Función |
| --- | --- | --- |
| `POST` | `/conversations` | Crea o recupera la conversación de `bookingId`. |
| `GET` | `/conversations` | Lista conversaciones y contadores no leídos. |
| `GET` | `/conversations/:id/messages` | Carga una página del historial mediante cursor. |
| `POST` | `/conversations/:id/messages` | Valida, guarda y publica un mensaje. |
| `PATCH` | `/conversations/:id/read` | Añade al usuario actual a `readBy`. |
| `POST` | `/conversations/:id/typing` | Publica el inicio o fin de escritura. |
| `GET` | `/messages/events` | Mantiene abierto el stream SSE autenticado. |

Las rutas están definidas en
`backend/src/routes/messageRoutes.ts`.

## Actualizaciones en tiempo real con SSE

El backend conserva temporalmente las respuestas SSE abiertas, agrupadas por
identificador de usuario. Publica cinco tipos de evento:

- `conversation.updated`: se creó o actualizó una conversación.
- `message.created`: se guardó un nuevo mensaje.
- `messages.read`: un participante leyó los mensajes pendientes.
- `typing.started`: el otro participante comenzó a escribir.
- `typing.stopped`: el otro participante dejó de escribir o envió el mensaje.

Los eventos de escritura sólo se envían al otro participante; el navegador que
escribe no necesita recibir de vuelta su propio estado.

El stream:

- Envía un evento inicial de conexión.
- Envía un keep-alive cada 25 segundos.
- Desactiva el buffering mediante `X-Accel-Buffering: no`.
- Elimina la conexión cuando el navegador se desconecta.

La implementación está en
`backend/src/services/messageRealtimeService.ts`.

## Implementación frontend

### Servicio HTTP y lector SSE

`client/src/services/messages.service.ts`:

- Ejecuta las llamadas REST.
- Abre el stream mediante `fetch`.
- Añade el JWT en `Authorization`.
- Lee los bloques del stream y convierte su contenido JSON en eventos.

Se utiliza `fetch` en lugar de `EventSource` para poder adjuntar el JWT en la
cabecera de autorización.

### Estado global

`client/src/lib/hooks/useMessages.ts`:

- Mantiene conversaciones y mensajes por conversación.
- Mantiene el estado de escritura por conversación.
- Calcula el total de no leídos.
- Fusiona mensajes sin duplicarlos.
- Refresca la bandeja al recibir un evento.
- Marca mensajes como leídos de forma optimista.
- Reconecta el stream SSE después de dos segundos si la conexión se interrumpe.
- Apaga el indicador de escritura automáticamente después de 3,5 segundos si
  no llega el evento de finalización.
- Conserva el cursor y el estado de paginación de cada conversación.

`MessagesProvider` está montado dentro de `UserProvider`, por lo que sólo abre
la conexión cuando existe un usuario autenticado.

### Interfaz

`client/src/components/messages/Messages.tsx` implementa:

- Bandeja responsive.
- Filtros `All`, `Unread`, `Hosting` y `Travelling`.
- Búsqueda por usuario, vivienda o dirección.
- Contexto de la reserva.
- Envío con Enter y salto de línea con Shift+Enter.
- Selector con cientos de emojis, accesible mediante teclado y organizado en
  `Smileys`, `Gestures`, `Travel`, `Food`, `Nature` y `Symbols`.
- Indicador animado de tres puntos mientras el otro participante escribe.
- Entrada suave de mensajes nuevos, respetando la preferencia del sistema para
  reducir el movimiento.
- Carga automática de mensajes anteriores al llegar al inicio del scroll.
- Botón alternativo **Load older messages** y marcador
  **Beginning of conversation**.
- Conservación de la posición visual al insertar mensajes antiguos.
- Contadores de no leídos.
- Acceso diferenciado para anfitrión y huésped.

Los puntos de entrada están en:

- `Trips → Message host`.
- `Host dashboard → Message guest`.
- Menú de usuario → `Messages`.

## Prueba en development

Utiliza dos navegadores o dos perfiles distintos para mantener sesiones
separadas:

1. Inicia MongoDB, backend y frontend.
2. La cuenta A crea una vivienda.
3. La cuenta B reserva esa vivienda.
4. La cuenta B abre **Trips → Message host**.
5. La cuenta A abre **Host dashboard → Message guest**.
6. Envía mensajes en ambos sentidos y comprueba que aparecen sin recargar.
7. Escribe sin enviar y comprueba que el otro navegador muestra tres puntos
   animados; al pausar, deben desaparecer.
8. Abre el selector de emojis, inserta varios y envía el mensaje.
9. Cierra una bandeja, envía otro mensaje y comprueba el badge de no leídos.
10. Intenta acceder con una tercera cuenta para verificar el rechazo del
   backend.

El chat también funciona con una reserva `pending`. No es necesario completar
el pago de Stripe para probarlo.

## Conversaciones extensas

La interfaz no descarga el historial completo. Al abrir una conversación carga
los 50 mensajes más recientes. Si existen mensajes anteriores, el backend
devuelve un cursor formado por:

- La fecha del mensaje más antiguo de la página.
- Su identificador MongoDB.

La combinación evita perder o repetir mensajes cuando varios fueron creados en
el mismo milisegundo. Las consultas se ordenan por `createdAt` y `_id`, apoyadas
por un índice compuesto en el modelo `Message`.

Al llegar cerca de la parte superior, el frontend solicita otros 50 mensajes y
los inserta antes de los actuales. Antes de la petición conserva la altura y
posición del contenedor; después compensa la nueva altura para que la pantalla
no salte. El usuario también puede iniciar la carga manualmente mediante el
botón situado al comienzo del historial.

Los mensajes nuevos recibidos por SSE se fusionan por `_id`, se ordenan y no se
duplican aunque la respuesta HTTP y el evento en tiempo real lleguen casi al
mismo tiempo.

## Staging y escalado

El staging debe permitir respuestas HTTP de larga duración para SSE.

El hub de eventos actual vive en memoria dentro del proceso backend. Para
development y un staging con una sola instancia es suficiente. Si el backend se
escala horizontalmente a varias instancias, debe utilizarse un broker compartido
como Redis para que una instancia pueda publicar eventos a conexiones abiertas
en otra instancia.
