import { Router } from 'express';
import { isLoggedIn } from '../middlewares/user';
import asyncHandler from '../utils/asyncHandler';

const router = Router();

import {
    createBookings,
    getUserBookings,
    getBookingDetails,
    updateBooking,
    deleteBooking,
} from '../controllers/bookingController';

router.post('/create-booking', isLoggedIn, asyncHandler(createBookings));
router.get('/user-bookings', isLoggedIn, asyncHandler(getUserBookings));
router.get('/booking-details/:id', isLoggedIn, asyncHandler(getBookingDetails));
router.put('/update-booking/:id', isLoggedIn, asyncHandler(updateBooking));
router.delete('/delete-booking/:id', isLoggedIn, asyncHandler(deleteBooking));

export default router;
