import type { Request, Response } from "express";
import { isValidObjectId } from "mongoose";
import { Experience } from "../models/Experience";
import { ExperienceBooking } from "../models/ExperienceBooking";
import { Payment } from "../models/Payment";
import { stripe } from "../config/stripe";
import CustomError from "../utils/customError";

const categories = new Set([
  "local-flavors",
  "nature",
  "creative",
  "hidden-gems",
  "night",
  "family",
  "wellness",
  "culture",
]);

const escapeRegex = (value: string) => value.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");

const parsePositiveInteger = (value: unknown, label: string) => {
  const parsed = Number(value);
  if (!Number.isInteger(parsed) || parsed < 1) {
    throw new CustomError(`${label} must be a positive integer`, 400);
  }
  return parsed;
};

const parseDate = (value: unknown) => {
  const raw = String(value ?? "");
  if (!/^\d{4}-\d{2}-\d{2}$/.test(raw)) {
    throw new CustomError("date must use YYYY-MM-DD", 400);
  }
  const date = new Date(`${raw}T00:00:00.000Z`);
  if (Number.isNaN(date.getTime())) throw new CustomError("Invalid experience date", 400);
  const today = new Date();
  today.setUTCHours(0, 0, 0, 0);
  if (date < today) throw new CustomError("Experience date cannot be in the past", 400);
  return date;
};

export const getExperiences = async (req: Request, res: Response) => {
  const query: Record<string, unknown> = {};
  const destination = String(req.query.destination ?? "").trim();
  const category = String(req.query.category ?? "").trim();
  const kind = String(req.query.kind ?? "").trim();
  const guests = req.query.guests === undefined ? undefined : parsePositiveInteger(req.query.guests, "guests");

  if (destination) {
    const matcher = { $regex: escapeRegex(destination), $options: "i" };
    query.$or = [{ city: matcher }, { country: matcher }, { address: matcher }, { title: matcher }];
  }
  if (category && category !== "all") {
    if (!categories.has(category)) throw new CustomError("Invalid experience category", 400);
    query.category = category;
  }
  if (kind) {
    if (!["moment", "local-path"].includes(kind)) throw new CustomError("Invalid experience kind", 400);
    query.kind = kind;
  }
  if (guests !== undefined) query.maxGuests = { $gte: guests };

  const dateValue = String(req.query.date ?? "").trim();
  if (dateValue) query.availableDays = parseDate(dateValue).getUTCDay();

  const experiences = await Experience.find(query).sort({ featured: -1, rating: -1, reviews: -1 });
  res.status(200).json({ success: true, count: experiences.length, data: experiences });
};

export const getExperience = async (req: Request, res: Response) => {
  const key = String(req.params.idOrSlug);
  const experience = isValidObjectId(key)
    ? await Experience.findById(key)
    : await Experience.findOne({ slug: key.toLowerCase() });
  if (!experience) throw new CustomError("Experience not found", 404);
  res.status(200).json({ success: true, data: experience });
};

export const createExperienceBooking = async (req: Request, res: Response) => {
  const experience = await Experience.findById(req.body.experienceId);
  if (!experience) throw new CustomError("Experience not found", 404);

  const date = parseDate(req.body.date);
  const participants = parsePositiveInteger(req.body.participants, "participants");
  const startTime = String(req.body.startTime ?? "").trim();
  if (!experience.availableDays.includes(date.getUTCDay())) {
    throw new CustomError("This experience is not available on the selected day", 409);
  }
  if (!experience.startTimes.includes(startTime)) {
    throw new CustomError("Invalid start time for this experience", 400);
  }
  if (participants > experience.maxGuests) {
    throw new CustomError("The number of participants exceeds this experience's capacity", 400);
  }

  const existingBookings = await ExperienceBooking.find({
    experience: experience._id,
    date,
    startTime,
    status: { $ne: "cancelled" },
  });
  const occupiedSeats = existingBookings.reduce((total, booking) => total + booking.participants, 0);
  if (occupiedSeats + participants > experience.maxGuests) {
    throw new CustomError("Not enough seats are available for this time", 409);
  }

  const booking = await ExperienceBooking.create({
    owner: req.user!._id,
    experience: experience._id,
    date,
    startTime,
    participants,
    status: "pending",
    name: req.user!.name,
    price: experience.price * participants,
  });
  await booking.populate("experience");

  res.status(201).json({ success: true, data: booking });
};

export const getUserExperienceBookings = async (req: Request, res: Response) => {
  const bookings = await ExperienceBooking.find({
    owner: req.user!._id,
    archivedAt: { $exists: false },
  }).populate("experience");
  res.status(200).json({ success: true, count: bookings.length, data: bookings });
};

export const getExperienceBooking = async (req: Request, res: Response) => {
  const booking = await ExperienceBooking.findById(req.params.id).populate("experience");
  if (!booking) throw new CustomError("Experience booking not found", 404);
  if (booking.owner.toString() !== req.user!.id && !req.user!.isAdmin) {
    throw new CustomError("You cannot access this experience booking", 403);
  }
  res.status(200).json({ success: true, data: booking });
};

export const deleteExperienceBooking = async (req: Request, res: Response) => {
  const booking = await ExperienceBooking.findById(req.params.id);
  if (!booking) throw new CustomError("Experience booking not found", 404);
  if (booking.owner.toString() !== req.user!.id && !req.user!.isAdmin) {
    throw new CustomError("You cannot remove this experience booking", 403);
  }

  if (booking.status === "pending") {
    const payment = await Payment.findOne({
      experienceBooking: booking._id,
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
  res.status(200).json({ success: true, message: "Experience removed from trips" });
};
