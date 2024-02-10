import { Request, Response } from 'express';
import { Notification } from '../models/Notification';
import mongoose from 'mongoose';

const notificatinsArr = [
    {
        _id: '1',
        text: 'Notification 1',
    },
    {
        _id: '2',
        text: 'Notification 2',
    },
    {
        _id: '3',
        text: 'Notification 3',
    },
    {
        _id: '4',
        text: 'Notification 4',
    },
    {
        _id: '5',
        text: 'Notification 5',
    },
    {
        _id: '6',
        text: 'Notification 6',
    },
    {
        _id: '7',
        text: 'Notification 7',
    },
    {
        _id: '8',
        text: 'Notification 8',
    },
    {
        _id: '9',
        text: 'Notification 9',
    },
    {
        _id: '10',
        text: 'Notification 10',
    },
    {
        _id: '11',
        text: 'Notification 11',
    },
    {
        _id: '12',
        text: 'Notification 12',
    },
    {
        _id: '13',
        text: 'Notification 13',
    },
    {
        _id: '14',
        text: 'Notification 14',
    },
    {
        _id: '15',
        text: 'Notification 15',
    },
    {
        _id: '16',
        text: 'Notification 16',
    },
    {
        _id: '17',
        text: 'Notification 17',
    },
    {
        _id: '18',
        text: 'Notification 18',
    },
    {
        _id: '19',
        text: 'Notification 19',
    },
    {
        _id: '20',
        text: 'Notification 20',
    },
    {
        _id: '21',
        text: 'Notification 21',
    },
    {
        _id: '22',
        text: 'Notification 22',
    },
    {
        _id: '23',
        text: 'Notification 23',
    },
    {
        _id: '24',
        text: 'Notification 24',
    },
    {
        _id: '25',
        text: 'Notification 25',
    },
    {
        _id: '26',
        text: 'Notification 26',
    },
    {
        _id: '27',
        text: 'Notification 27',
    },
    {
        _id: '28',
        text: 'Notification 28',
    },
    {
        _id: '29',
        text: 'Notification 29',
    },
]

interface AuthenticatedRequest extends Request {
    user?: any;
}

// Controlador para obtener todas las notificaciones de un usuario
export const getAllNotifications = async (req: AuthenticatedRequest, res: Response)=> {
    try {
        // Verificar si el usuario que realiza la solicitud es administrador
        //if (!req.user) {
        //    // Si el usuario no es administrador, enviar una respuesta de error
        //    return res.status(403).json({ message: 'Acceso no autorizado' });
        //}

        // Obtener todas las notificaciones
        const notifications = notificatinsArr;
        //const notifications = await Notification.find().sort({ createdAt: -1 });
        res.json(notifications);
    } catch (error: any) {
        res.status(500).json({ message: error.message });
    }
};

// Marcar una notificación como leída
export const markNotificationAsRead = async (req: AuthenticatedRequest, res: Response)=> {
    try {
        // Verificar si el usuario que realiza la solicitud es administrador
        //if (!req.user) {
        //    // Si el usuario no es administrador, enviar una respuesta de error
        //    return res.status(403).json({ message: 'Acceso no autorizado' });
        //}

        const notificationId = req.params.id;
        const notification = await Notification.findByIdAndUpdate(notificationId, { read: true });
        if (!notification) {
            res.status(404).json({ message: 'Notification not found' });
            return;
        }
        res.json({ message: 'Notification marked as read' });
    } catch (error: any) {
        res.status(500).json({ message: error.message });
    }
};

// Controlador para enviar notificaciones a los usuarios
export const sendNotification = async (req: Request, res: Response)=> {
    try {
        const { userId, message } = req.body;

        // Verificar si el userId es un ObjectId válido antes de crear la notificación
        if (!mongoose.Types.ObjectId.isValid(userId)) {
            return res.status(400).json({ message: 'El ID de usuario proporcionado no es válido' });
        }

        // Crear una nueva notificación para el usuario
        const newNotification = new Notification({
            user: userId,
            message: message,
            //read: false, // Agregar el campo "read" con un valor predeterminado si es necesario
        });

        await newNotification.save();

        res.status(201).json({ message: 'Notificación enviada exitosamente' });
    } catch (error: any) {
        res.status(500).json({ message: error.message });
    }
};
