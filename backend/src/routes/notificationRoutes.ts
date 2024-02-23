import express from 'express';
import { Router } from 'express';


const router = Router();

import {
    getAllNotifications,
    getAllUserNotifications,
    markNotificationAsRead,
    sendNotification,
    createNotification,
    deleteNotification
} from '../controllers/notificationController';
import isAdmin from '../middlewares/admin';

router.get('/notifications', getAllNotifications);
router.post('/create-notification', createNotification);
router.post('/send-notification', sendNotification);
router.get('/notification/:id',  getAllUserNotifications);
router.put('/mark-as-read/:id',  markNotificationAsRead);
router.delete('/delete-notification/:id',  deleteNotification);

export default router;
