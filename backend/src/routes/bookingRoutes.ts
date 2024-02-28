import { Router } from 'express';
import { isLoggedIn } from '../middlewares/user';

const router = Router();

import {
    createBookings,
    getUserBookings,
    getBookingDetails,
    updateBooking,
    deleteBooking,
} from '../controllers/bookingController';

router.post('/create-booking', isLoggedIn, createBookings);
router.get('/user-bookings', isLoggedIn, getUserBookings);
router.get('/booking-details/:id', isLoggedIn, getBookingDetails);
router.put('/update-booking/:id', isLoggedIn, updateBooking);
router.delete('/delete-booking/:id', isLoggedIn, deleteBooking);

export default router;
