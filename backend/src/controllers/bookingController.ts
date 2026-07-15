import type { Request, Response } from "express";
import { Booking } from "../models/Booking";
import { Place } from "../models/Place";
import { Payment } from "../models/Payment";
import { stripe } from "../config/stripe";
import CustomError from "../utils/customError";

const DAY_MS = 24 * 60 * 60 * 1000;

const parseDates = (checkInValue: unknown, checkOutValue: unknown) => {
  const checkIn = new Date(String(checkInValue));
  const checkOut = new Date(String(checkOutValue));
  if (Number.isNaN(checkIn.getTime()) || Number.isNaN(checkOut.getTime()) || checkOut <= checkIn) {
    throw new CustomError("checkOut must be after checkIn", 400);
  }
  const today = new Date();
  today.setUTCHours(0, 0, 0, 0);
  if (checkIn < today) {
    throw new CustomError("checkIn cannot be in the past", 400);
  }
  return { checkIn, checkOut, nights: Math.ceil((checkOut.getTime() - checkIn.getTime()) / DAY_MS) };
};

const parseGuests = (value: unknown) => {
  const guests = (value ?? {}) as Record<string, unknown>;
  const parsed = {
    adults: Number(guests.adults ?? 0),
    children: Number(guests.children ?? 0),
    infants: Number(guests.infants ?? 0),
    pets: Number(guests.pets ?? 0),
  };
  if (!Number.isInteger(parsed.adults) || parsed.adults < 1) {
    throw new CustomError("At least one adult is required", 400);
  }
  if (Object.values(parsed).some((count) => !Number.isInteger(count) || count < 0)) {
    throw new CustomError("Guest counts must be non-negative integers", 400);
  }
  return parsed;
};

const assertBookingOwner = (ownerId: string, req: Request) => {
  if (ownerId !== req.user!.id && !req.user!.isAdmin) {
    throw new CustomError("You cannot access this booking", 403);
  }
};

const hasOverlappingBooking = async (
  placeId: string,
  checkIn: Date,
  checkOut: Date,
  excludedBookingId?: string
) => {
  return Booking.exists({
    _id: excludedBookingId ? { $ne: excludedBookingId } : { $exists: true },
    place: placeId,
    status: { $ne: "cancelled" },
    checkIn: { $lt: checkOut },
    checkOut: { $gt: checkIn },
  });
};

export const createBookings = async (req: Request, res: Response) => {
  const place = await Place.findById(req.body.place);
  if (!place) throw new CustomError("Place not found", 404);

  const dates = parseDates(req.body.checkIn, req.body.checkOut);
  const numOfGuests = parseGuests(req.body.numOfGuests);
  if (numOfGuests.adults + numOfGuests.children > place.maxGuests) {
    throw new CustomError("The number of guests exceeds this place's capacity", 400);
  }
  if (await hasOverlappingBooking(place.id, dates.checkIn, dates.checkOut)) {
    throw new CustomError("This place is unavailable for the selected dates", 409);
  }

  const booking = await Booking.create({
    owner: req.user!._id,
    place: place._id,
    checkIn: dates.checkIn,
    checkOut: dates.checkOut,
    numOfGuests,
    status: "pending",
    extraInfo: String(req.body.extraInfo ?? "").trim(),
    name: req.user!.name,
    price: place.price * dates.nights,
  });

  res.status(201).json({ success: true, data: booking });
};

export const getUserBookings = async (req: Request, res: Response) => {
  const bookings = await Booking.find({
    owner: req.user!._id,
    archivedAt: { $exists: false },
  }).populate("place");
  res.status(200).json({ success: true, count: bookings.length, data: bookings });
};

export const getBookingDetails = async (req: Request, res: Response) => {
  const booking = await Booking.findById(req.params.id).populate("place");
  if (!booking) throw new CustomError("Booking not found", 404);
  assertBookingOwner(booking.owner.toString(), req);
  res.status(200).json({ success: true, data: booking });
};

export const updateBooking = async (req: Request, res: Response) => {
  const booking = await Booking.findById(req.params.id);
  if (!booking) throw new CustomError("Booking not found", 404);
  assertBookingOwner(booking.owner.toString(), req);

  if (req.body.status === "cancelled") {
    booking.status = "cancelled";
  } else if (req.body.status !== undefined && !req.user!.isAdmin) {
    throw new CustomError("Only cancellation is allowed", 403);
  } else if (req.body.status !== undefined) {
    booking.status = req.body.status;
  }

  const checkIn = req.body.checkIn ?? booking.checkIn;
  const checkOut = req.body.checkOut ?? booking.checkOut;
  const dates = parseDates(checkIn, checkOut);
  const numOfGuests = req.body.numOfGuests
    ? parseGuests(req.body.numOfGuests)
    : booking.numOfGuests;
  const place = await Place.findById(booking.place);
  if (!place) throw new CustomError("Place not found", 404);
  if (numOfGuests.adults + numOfGuests.children > place.maxGuests) {
    throw new CustomError("The number of guests exceeds this place's capacity", 400);
  }
  if (
    booking.status !== "cancelled" &&
    (await hasOverlappingBooking(place.id, dates.checkIn, dates.checkOut, booking.id))
  ) {
    throw new CustomError("This place is unavailable for the selected dates", 409);
  }

  booking.checkIn = dates.checkIn;
  booking.checkOut = dates.checkOut;
  booking.numOfGuests = numOfGuests;
  booking.extraInfo = String(req.body.extraInfo ?? booking.extraInfo ?? "").trim();
  booking.price = place.price * dates.nights;
  await booking.save();

  res.status(200).json({ success: true, data: booking });
};

export const deleteBooking = async (req: Request, res: Response) => {
  const booking = await Booking.findById(req.params.id);
  if (!booking) throw new CustomError("Booking not found", 404);
  assertBookingOwner(booking.owner.toString(), req);
  if (booking.status === "pending") {
    const payment = await Payment.findOne({
      booking: booking._id,
      status: { $in: ["pending", "failed"] },
    });
    if (payment) {
      await stripe.paymentIntents.cancel(payment.stripeId);
      payment.status = "cancelled";
      await payment.save();
    }
    booking.status = "cancelled";
  }
  booking.archivedAt = new Date();
  await booking.save();
  res.status(200).json({ success: true, message: "Booking removed from trips" });
};
