import express from 'express';
import { Router } from 'express';

const router = Router();

import {
    createPayment,
    getPayments,
    getSinglePayment,
    updatePayment,
    deletePayment,
    getPaymentDetailsWithPlace
} from '../controllers/paymentController';
import { isLoggedIn } from '../middlewares/user';

router.post('/create-payment', isLoggedIn, createPayment);
router.get('/payments', isLoggedIn, getPayments);
router.get('/payment/:id', isLoggedIn, getSinglePayment);
router.get('/payment/:id/details-with-place', isLoggedIn, getPaymentDetailsWithPlace);
router.put('/update-payment/:id', isLoggedIn, updatePayment);
router.delete('/delete-payment/:id', isLoggedIn, deletePayment);

export default router;
