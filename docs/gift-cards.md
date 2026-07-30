# Gift cards

Este documento explica cómo funciona la funcionalidad de tarjetas regalo de
Flypnp, desde el componente React hasta Stripe, MongoDB y el checkout de una
reserva.

## Qué representa una Gift card

Una Gift card es saldo prepago de Flypnp. Una persona compra una tarjeta por un
importe determinado y recibe un código. Otro usuario puede canjear ese código y
el importe pasa a su cartera de Flypnp.

Stripe solamente procesa el dinero de la compra. Flypnp mantiene en MongoDB:

- la tarjeta regalo;
- su estado;
- el código protegido;
- quién la compró;
- quién la canjeó;
- el saldo disponible del usuario;
- el historial de movimientos.

Todos los importes del backend se guardan como céntimos enteros. Por ejemplo,
`100 CHF` se almacena como `10000`. Esto evita errores de precisión con números
decimales.

## Archivos principales

### Frontend

- `client/src/components/gift-cards/GiftCards.tsx`: interfaz completa.
- `client/src/pages/GiftCardsPage.tsx`: página utilizada por React Router.
- `client/src/services/gift-cards.service.ts`: peticiones HTTP al backend.
- `client/src/services/types.ts`: tipos de tarjetas, cartera y movimientos.
- `client/src/components/payment/TestStripePayment.tsx`: aplica el saldo durante
  el pago de una reserva.
- `client/src/components/navbar/user-menu/UserMenu.tsx`: enlace del menú.

### Backend

- `backend/src/controllers/giftCardController.ts`: endpoints de compra, consulta,
  confirmación y canje.
- `backend/src/services/giftCardService.ts`: generación, cifrado, activación y
  canje de códigos.
- `backend/src/models/GiftCard.ts`: documento de la tarjeta.
- `backend/src/models/Wallet.ts`: saldo actual del usuario.
- `backend/src/models/WalletTransaction.ts`: historial contable.
- `backend/src/controllers/paymentController.ts`: webhook y aplicación del saldo
  al checkout.
- `backend/src/routes/giftCardRoutes.ts`: rutas protegidas.

## Entrada desde el menú

`UserMenu.tsx` contiene un `Link` hacia:

```text
/gift-cards
```

`App.tsx` relaciona esa URL con `GiftCardsPage`, que renderiza el componente
`GiftCards`.

Si el visitante no ha iniciado sesión, la página explica que debe autenticarse.
Las operaciones del backend también utilizan `isLoggedIn`, por lo que ocultar
controles en React no es la única protección.

## Estructura del componente React

`GiftCards.tsx` contiene dos componentes:

### `GiftCards`

Es el componente principal. Sus responsabilidades son:

- comprobar el usuario mediante `useAuth`;
- cargar saldo, compras y movimientos;
- mostrar el encabezado y el saldo disponible;
- mostrar el formulario para canjear códigos;
- envolver el formulario de compra con `Elements` de Stripe;
- refrescar los datos después de comprar o canjear.

Estados importantes:

| Estado | Utilidad |
| --- | --- |
| `summary` | Saldo, compras e historial obtenidos del backend. |
| `loading` | Indica que se está cargando la cartera. |
| `redeemCode` | Código escrito por el usuario. |
| `redeeming` | Evita enviar dos canjes simultáneos. |
| `newCode` | Código revelado al comprador después del pago. |

La función `refresh()` llama a:

```text
GET /api/v1/gift-cards
```

La función `redeem()` llama a:

```text
POST /api/v1/gift-cards/redeem
```

Cuando el canje termina correctamente, vuelve a ejecutar `refresh()` para que el
nuevo saldo aparezca inmediatamente.

### `PurchaseForm`

Gestiona la compra y vive dentro de `<Elements stripe={stripePromise}>`. De esta
forma puede utilizar:

- `useStripe()` para confirmar el PaymentIntent;
- `useElements()` para acceder al campo seguro `CardElement`.

Estados importantes:

| Estado | Utilidad |
| --- | --- |
| `amount` | Uno de los importes rápidos: 50, 100 o 200 CHF. |
| `customAmount` | Importe personalizado entre 25 y 2.000 CHF. |
| `recipientName` | Nombre de la persona que recibirá la tarjeta. |
| `recipientEmail` | Email de entrega. |
| `message` | Dedicatoria opcional. |
| `loading` | Bloquea el botón mientras Stripe procesa el pago. |
| `error` | Mensaje seguro mostrado al usuario. |
| `purchaseKey` | Clave idempotente conservada entre reintentos. |

`purchaseKey` utiliza `useRef`. Si Stripe rechaza temporalmente el pago y el
usuario vuelve a intentarlo, el frontend conserva la misma compra en lugar de
crear cargos duplicados.

## Flujo completo de compra

1. El usuario completa el formulario y pulsa `Buy gift card`.
2. `giftCardsService.purchase()` envía importe, destinatario, mensaje y
   `purchaseKey`.
3. El backend valida los datos y nunca confía en un importe fuera del rango
   permitido.
4. El backend crea un Stripe PaymentIntent en CHF con:

   ```text
   metadata.kind=gift_card
   ```

5. El backend crea la Gift card en estado `pending`.
6. El frontend recibe `clientSecret`.
7. `stripe.confirmCardPayment()` envía los datos de tarjeta directamente a
   Stripe. Flypnp no recibe ni almacena el número de la tarjeta.
8. Si Stripe confirma el pago, el frontend solicita la confirmación al servidor.
9. El servidor consulta Stripe otra vez. No acepta como prueba lo que diga el
   navegador.
10. La tarjeta cambia a `active` y se entrega el código.
11. El webhook realiza la misma activación si el usuario cierra el navegador
    antes de terminar el paso síncrono.

La confirmación directa mejora la experiencia de desarrollo, mientras que el
webhook garantiza que el sistema termine el proceso aunque el cliente se
desconecte.

## Protección del código

El código tiene un formato similar a:

```text
FLY-12ABC-34DEF-56ABC-78DEF
```

El servidor lo genera con aleatoriedad criptográfica. MongoDB guarda dos
representaciones:

- `codeHash`: permite localizar la tarjeta durante el canje sin comparar el
  código en texto plano;
- `codeEncrypted`: permite entregarlo al destinatario autorizado después de que
  Stripe confirme el pago.

El cifrado utiliza AES-256-GCM con una clave derivada de `JWT_SECRET`. Los
endpoints de listados nunca devuelven estas propiedades.

## Entrega al destinatario

Cuando la tarjeta se activa:

- si el email pertenece a un usuario registrado, recibe una notificación dentro
  de Flypnp;
- si Resend está configurado, también se encola un email;
- si el destinatario todavía no está registrado, se envía directamente al email
  indicado cuando Resend está disponible;
- el comprador puede ver y copiar el código después de confirmar la compra.

La cola de emails utiliza una clave de deduplicación. Un reintento del webhook no
debe enviar repetidamente la misma tarjeta.

## Flujo de canje

1. El usuario escribe el código en `GiftCards`.
2. El backend normaliza mayúsculas y separadores.
3. Calcula el hash y busca una tarjeta `active`.
4. `findOneAndUpdate` cambia la tarjeta a `redeemed` solamente si todavía no fue
   canjeada.
5. El importe se añade a `Wallet`.
6. Se crea un movimiento positivo `gift_card_redemption`.

La actualización condicional impide que dos navegadores canjeen el mismo código
al mismo tiempo.

## Cartera y movimientos

`Wallet` contiene el saldo actual en céntimos. `WalletTransaction` explica por
qué cambió.

Tipos de movimiento:

| Tipo | Significado |
| --- | --- |
| `gift_card_redemption` | Entrada de saldo al canjear una tarjeta. |
| `booking_payment` | Saldo gastado durante una reserva. |
| `payment_refund` | Saldo devuelto por cancelar un pago pendiente. |

La cartera guarda claves de ajuste idempotentes. Así, si Stripe repite un
webhook, Flypnp no aplica dos veces el mismo movimiento.

## Aplicación en el checkout

`TestStripePayment.tsx` consulta el saldo antes de crear el pago de la reserva y
envía:

```json
{
  "useGiftBalance": true
}
```

El backend calcula los importes, no el navegador:

```text
importe total = precio de la reserva + comisión
saldo aplicado = mínimo entre saldo disponible e importe total
importe Stripe = importe total - saldo aplicado
```

Ejemplo:

```text
Reserva total:       550 CHF
Saldo Gift cards:    100 CHF
Cobro de Stripe:     450 CHF
```

Si el saldo cubre todo, la reserva se confirma con `paymentMethod=gift_card` y
no se crea un nuevo cargo de tarjeta. Si queda una parte, Stripe solamente cobra
esa diferencia.

Si se cancela un PaymentIntent pendiente que ya había reservado saldo, el
backend crea un `payment_refund` y devuelve el importe una sola vez.

## Endpoints

| Método | Ruta | Función |
| --- | --- | --- |
| `GET` | `/api/v1/gift-cards` | Consultar saldo, compras y movimientos. |
| `POST` | `/api/v1/gift-cards/purchase` | Crear compra y PaymentIntent. |
| `POST` | `/api/v1/gift-cards/:id/confirm` | Verificar Stripe y activar. |
| `POST` | `/api/v1/gift-cards/redeem` | Canjear un código. |
| `POST` | `/api/v1/stripe/webhook` | Procesar eventos firmados de Stripe. |

Los endpoints de compra y canje tienen rate limiting.

## Configuración del webhook

Se utiliza el webhook de Stripe que ya existe:

```text
POST /api/v1/stripe/webhook
```

En Stripe Workbench o Dashboard, el webhook de staging debe escuchar:

- `payment_intent.succeeded`;
- `payment_intent.payment_failed`;
- `payment_intent.canceled`.

El handler diferencia una Gift card de una reserva mediante
`intent.metadata.kind`.

Para development, usando el puerto actual del backend:

```bash
stripe listen --forward-to localhost:3010/api/v1/stripe/webhook
```

El comando muestra un secreto `whsec_...`. Debe guardarse como
`STRIPE_WEBHOOK_SECRET` y después reiniciarse el backend.

El endpoint recibe el body original con `express.raw()` antes de
`express.json()`. Esto es necesario para que Stripe pueda verificar la firma.

## Prueba completa en development o staging

Usar claves de prueba de Stripe y esta tarjeta:

```text
4242 4242 4242 4242
```

Se puede indicar cualquier fecha futura y cualquier CVC.

Escenario recomendado con dos usuarios:

1. Entrar como usuario A.
2. Comprar una tarjeta para el email del usuario B.
3. Confirmar que aparece como `active`.
4. Copiar el código.
5. Entrar en otro navegador como usuario B.
6. Canjearlo y comprobar el nuevo saldo.
7. Crear una reserva pendiente.
8. Abrir el checkout y comprobar que se descuenta el saldo.
9. Probar una reserva cubierta completamente por saldo.
10. Probar otra cubierta parcialmente por saldo y Stripe.
11. Repetir el webhook o el canje para comprobar que no duplica el dinero.

Antes de utilizar dinero real todavía deben definirse las políticas legales y
contables de caducidad, devoluciones, monedas y países admitidos. Production
también requiere HTTPS, claves live de Stripe y un webhook live independiente
del webhook de staging.
