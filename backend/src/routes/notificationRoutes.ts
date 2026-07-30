import { Router } from 'express';


const router = Router();

import {
    getAllNotifications,
    getAllUserNotifications,
    markNotificationAsRead,
    sendNotification,
    createNotification,
    deleteNotification,
    getEmailDeliveries,
    retryEmailDelivery,
} from '../controllers/notificationController';
import isAdmin from '../middlewares/admin';
import { isLoggedIn } from '../middlewares/user';
import asyncHandler from '../utils/asyncHandler';

router.get('/notifications', isLoggedIn, isAdmin, asyncHandler(getAllNotifications));
router.post('/create-notification', isLoggedIn, isAdmin, asyncHandler(createNotification));
router.post('/send-notification', isLoggedIn, isAdmin, asyncHandler(sendNotification));
router.get('/user-notifications', isLoggedIn, asyncHandler(getAllUserNotifications));
router.get('/notification/:id', isLoggedIn, asyncHandler(getAllUserNotifications));
router.put('/mark-as-read/:id', isLoggedIn, asyncHandler(markNotificationAsRead));
router.delete('/delete-notification/:id', isLoggedIn, asyncHandler(deleteNotification));
router.get('/admin/email-deliveries', isLoggedIn, isAdmin, asyncHandler(getEmailDeliveries));
router.patch('/admin/email-deliveries/:id/retry', isLoggedIn, isAdmin, asyncHandler(retryEmailDelivery));

export default router;
