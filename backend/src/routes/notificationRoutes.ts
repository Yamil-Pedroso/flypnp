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
import { isLoggedIn } from '../middlewares/user';
import asyncHandler from '../utils/asyncHandler';

router.get('/notifications', isLoggedIn, isAdmin, asyncHandler(getAllNotifications));
router.post('/create-notification', isLoggedIn, isAdmin, asyncHandler(createNotification));
router.post('/send-notification', isLoggedIn, isAdmin, asyncHandler(sendNotification));
router.get('/user-notifications', isLoggedIn, asyncHandler(getAllUserNotifications));
router.get('/notification/:id', isLoggedIn, asyncHandler(getAllUserNotifications));
router.put('/mark-as-read/:id', isLoggedIn, asyncHandler(markNotificationAsRead));
router.delete('/delete-notification/:id', isLoggedIn, asyncHandler(deleteNotification));

export default router;
