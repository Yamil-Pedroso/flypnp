import { Router } from 'express';

const router = Router();

import {
    createPayment,
    getPayments,
    getSinglePayment,
    updatePayment,
    deletePayment,
    getPaymentDetailsWithPlace,
    confirmPayment,
} from '../controllers/paymentController';
import { isLoggedIn } from '../middlewares/user';
import isAdmin from '../middlewares/admin';
import asyncHandler from '../utils/asyncHandler';

router.post('/create-payment', isLoggedIn, asyncHandler(createPayment));
router.post('/payment/:id/confirm', isLoggedIn, asyncHandler(confirmPayment));
router.get('/payments', isLoggedIn, asyncHandler(getPayments));
router.get('/payment/:id', isLoggedIn, asyncHandler(getSinglePayment));
router.get('/payment/:id/details-with-place', isLoggedIn, asyncHandler(getPaymentDetailsWithPlace));
router.put('/update-payment/:id', isLoggedIn, asyncHandler(updatePayment));
router.delete('/delete-payment/:id', isLoggedIn, isAdmin, asyncHandler(deletePayment));

export default router;
