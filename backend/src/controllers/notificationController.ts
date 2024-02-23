import { Request, Response } from 'express';
import { Notification } from '../models/Notification';
import mongoose from 'mongoose';

interface AuthenticatedRequest extends Request {
    user?: any;
}


export const getAllNotifications = async (req: Request, res: Response)=> {
    try {
        const notifications = await Notification.find();
        res.json(notifications);
    } catch (error: any) {
        res.status(500).json({ message: error.message });
    }
};

export const getAllUserNotifications = async (req: AuthenticatedRequest, res: Response)=> {
    try {
        const notifications = await Notification.find({ user: req.params.id });
        res.json(notifications);
    } catch (error: any) {
        res.status(500).json({ message: error.message });
    }
};

export const createNotification = async (req: AuthenticatedRequest, res: Response)=> {
    try {
        const { userId, message } = req.body;

        const notis = new Notification({
            user: userId,
            message,
        });

        await Notification.create(notis);

        res.status(201).json({ succes: true, message: 'Notification created' });
    } catch (error: any) {
        res.status(500).json({ message: error.message });
    }
};

export const markNotificationAsRead = async (req: AuthenticatedRequest, res: Response)=> {
    try {
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

export const sendNotification = async (req: Request, res: Response)=> {
    try {
        const { userId, message } = req.body;

        if (!mongoose.Types.ObjectId.isValid(userId)) {
            return res.status(400).json({ message: 'El ID de usuario proporcionado no es válido' });
        }

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

export const deleteNotification = async (req: AuthenticatedRequest, res: Response)=> {
    try {
        const notificationId = req.params.id;
        const notification = await Notification.findByIdAndDelete(notificationId);
        if (!notification) {
            res.status(404).json({ message: 'Notification not found' });
            return;
        }
        res.json({success: true, message: 'Notification deleted' });
    } catch (error: any) {
        res.status(500).json({ message: error.message });
    }
};
