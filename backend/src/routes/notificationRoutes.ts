import express from 'express';
import { Router } from 'express';


const router = Router();

import {
    getAllNotifications,
    markNotificationAsRead,
    sendNotification,
} from '../controllers/notificationController';
import isAdmin from '../middlewares/admin';

router.post('/send-notification', sendNotification);
router.get('/notifications',  getAllNotifications);
router.put('/mark-as-read/:id',  markNotificationAsRead);

export default router;
