import { Request, Response, NextFunction } from 'express';
import { Payment, IPayment } from '../models/Payment';
import { stripe, customerId } from '../config/stripe';

interface AuthenticatedRequest extends Request {
    user?: any;
}

// Create a payment
export const createPayment = async (req: AuthenticatedRequest, res: Response, next: NextFunction) => {
    try {
        const userData = req.user;
        const { placeId, amount, currency, status, stripeId, paymentMethod, paymentDate } = req.body;

        const paymentIntent = await stripe.paymentIntents.create({
            amount,
            currency: currency || 'chf',
            customer: customerId,
            payment_method: paymentMethod,
            confirmation_method: 'automatic',
            confirm: false,
            //return_url: 'https://yampe-webdeveloper.netlify.app/',
        }) as any;

        const payment: IPayment = {
            user: userData.id,
            place: placeId,
            amount,
            currency,
            status,
            stripeId: paymentIntent.id,
            paymentMethod,
            paymentDate,
        };

        await Payment.create(payment);

        res.status(201).json({ success: true, data: payment, clientSecret: paymentIntent.client_secret });
    } catch (error: any) {
        console.error('Error to create payment:', error);
        res.status(500).json({
            message: 'Internal server error',
            error: error.message,
        });
    }
}

// Get Place data
// En tu controller de Payment, modifica o crea un endpoint que siga este principio
export const getPaymentDetailsWithPlace = async (req: AuthenticatedRequest, res: Response) => {
    try {
        const paymentId = req.params.id;
        const payment = await Payment.findById(paymentId).populate({
            path: 'booking',
            populate: {
                path: 'place'
            }
        }) as any;

        if (!payment) {
            return res.status(404).json({ message: 'Payment not found' });
        }

        const place = payment.booking.place;

        res.status(200).json({ success: true, data: place  });

    } catch (error: any) {
        console.error('Error fetching payment details with place:', error);
        res.status(500).json({ message: 'Internal server error', error: error.message });
    }
};


// Get all payments
export const getPayments = async (req: AuthenticatedRequest, res: Response, next: NextFunction) => {
    const paymentQuantity = await Payment.countDocuments();

    try {
        const payments = await Payment.find().populate('clientSecret');

        res.status(200).json({ success: true, qt: paymentQuantity, data: payments });
    } catch (error: any) {
        console.error('Error to get payments:', error);
        res.status(500).json({
            message: 'Internal server error',
            error: error.message,
        });
    }
}

// Get a payment
export const getSinglePayment = async (req: AuthenticatedRequest, res: Response, next: NextFunction) => {
    try {
        const paymentId = req.params.id;
        const payment = await Payment.findById(paymentId);

        res.status(200).json({ success: true, data: payment });
    } catch (error: any) {
        console.error('Error to get payment:', error);
        res.status(500).json({
            message: 'Internal server error',
            error: error.message,
        });
    }
}

// Update a payment
export const updatePayment = async (req: AuthenticatedRequest, res: Response, next: NextFunction) => {
    try {
        const paymentId = req.params.id;
        const updatedPaymentData = req.body;

        const updatedPayment = await Payment.findByIdAndUpdate(paymentId, updatedPaymentData, {
            new: true,
            runValidators: true,

        });

        res.status(200).json({ success: true, data: updatedPayment });
    } catch (error: any) {
        console.error('Error to update payment:', error);
        res.status(500).json({
            message: 'Internal server error',
            error: error.message,
        });
    }
}

// Delete a payment
export const deletePayment = async (req: AuthenticatedRequest, res: Response, next: NextFunction) => {
    try {
        const paymentId = req.params.id;

        await Payment.findByIdAndDelete(paymentId);

        res.status(200).json({ success: true, message: 'Payment deleted successfully' });
    } catch (error: any) {
        console.error('Error to delete payment:', error);
        res.status(500).json({
            message: 'Internal server error',
            error: error.message,
        });
    }
}
