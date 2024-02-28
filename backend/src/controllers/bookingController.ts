import { Request, Response, NextFunction } from 'express';
import { Booking, IBooking } from '../models/Booking';

interface AuthenticatedRequest extends Request {
    user?: any;
}

// Book a place
export const createBookings = async (req: AuthenticatedRequest, res: Response, next: NextFunction) => {
    try {
        const userData = req.user;
        const { place, checkIn, checkOut,numOfGuests, extraInfo, status, name, phone, price } = req.body;

        const booking: IBooking = {
            owner: userData.id,
            place,
            checkIn,
            checkOut,
            numOfGuests,
            status,
            extraInfo,
            name,
            phone,
            price,
        };

        await Booking.create(booking);

        res.status(201).json({ success: true, data: booking });
    } catch (error: any) {
        res.status(500).json({
            message: 'Internal server error',
            error: error.message,
          })
    }
}

// Return to the user all the bookings that he has made
export const getUserBookings = async (req: AuthenticatedRequest, res: Response, next: NextFunction) => {
    const qtyUserBookings = await Booking.find().countDocuments();
    try {
        const userData = req.user;
        if(!userData){
            return res.status(401).json({ message: 'You are not authorized to access this route' });
        }

        const { owner } = userData;
        const bookings = await Booking.find({ user: owner }).populate('place');


        res.status(200).json({ success: true, bookings: qtyUserBookings, data: bookings });
    } catch (error: any) {
        res.status(500).json({
            message: 'Internal server error',
            error: error.message,
          })
    }
}

// Return to the user a simple booking details
export const getBookingDetails = async (req: AuthenticatedRequest, res: Response, next: NextFunction) => {
    try {
        const userData = req.user;
        const { id } = req.params;
        const booking = await Booking.findById(id).populate('place') as IBooking;

        if (booking.owner.toString() !== userData.id) {
            return res.status(401).json({ message: 'You are not authorized to access this route' });
        }

        res.status(200).json({ success: true, data: booking });
    } catch (error: any) {
        res.status(500).json({
            message: 'Internal server error',
            error: error.message,
          })
    }
}

// Update a booking
export const updateBooking = async (req: AuthenticatedRequest, res: Response, next: NextFunction) => {
    try {
        const userData = req.user;
        const { id } = req.params;
        const { checkIn, checkOut, numOfGuests, name, status, extraInfo, phone, price } = req.body;

        const booking = await Booking.findById(id) as IBooking;

        if (booking.owner.toString() !== userData.id) {
            return res.status(401).json({ message: 'You are not authorized to access this route' });
        }

        await Booking.findByIdAndUpdate(id, { checkIn, checkOut, numOfGuests, status, extraInfo, name, phone, price });

        res.status(200).json({ success: true, data: booking });
    } catch (error: any) {
        res.status(500).json({
            message: 'Internal server error',
            error: error.message,
          })
    }
}

// Delete a booking
export const deleteBooking = async (req: AuthenticatedRequest, res: Response, next: NextFunction) => {
    try {
        const userData = req.user;
        const { id } = req.params;

        const booking = await Booking.findById(id) as IBooking;

        if (booking.owner.toString() !== userData.id) {
            return res.status(401).json({ message: 'You are not authorized to access this route' });
        }

        await Booking.findByIdAndDelete(id);

        res.status(200).json({ success: true, data: {} });
    } catch (error: any) {
        res.status(500).json({
            message: 'Internal server error',
            error: error.message,
          })
    }
}
