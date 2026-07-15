import type { Request, Response } from "express";
import type Stripe from "stripe";
import { Payment } from "../models/Payment";
import { Booking } from "../models/Booking";
import { stripe } from "../config/stripe";
import { requireEnv } from "../config/env";
import CustomError from "../utils/customError";

const assertPaymentOwner = (userId: string, req: Request) => {
  if (userId !== req.user!.id && !req.user!.isAdmin) {
    throw new CustomError("You cannot access this payment", 403);
  }
};

const getPaymentReturnUrl = (kind: "success" | "cancel", paymentId?: string) => {
  const configured = kind === "success"
    ? process.env.STRIPE_SUCCESS_URL
    : process.env.STRIPE_CANCEL_URL;
  const baseUrl = configured ?? process.env.CLIENT_URL ?? "http://localhost:5173/";
  const url = new URL(kind === "success" ? "/succeeded-payment" : "/trips", baseUrl);
  if (paymentId) url.searchParams.set("payment", paymentId);
  return url.toString();
};

export const createPayment = async (req: Request, res: Response) => {
  const booking = await Booking.findById(req.body.bookingId);
  if (!booking) throw new CustomError("Booking not found", 404);
  if (booking.owner.toString() !== req.user!.id && !req.user!.isAdmin) {
    throw new CustomError("You cannot pay for this booking", 403);
  }
  if (booking.status !== "pending") {
    throw new CustomError("Only pending bookings can be paid", 409);
  }

  const currency = String(req.body.currency ?? "chf").toLowerCase();
  if (!/^[a-z]{3}$/.test(currency)) throw new CustomError("Invalid currency", 400);

  const amount = Math.round(booking.price * 1.1 * 100);
  const existingPayment = await Payment.findOne({
    booking: booking._id,
    user: req.user!._id,
    status: { $in: ["pending", "failed"] },
  });
  if (existingPayment) {
    const existingIntent = await stripe.paymentIntents.retrieve(existingPayment.stripeId);
    if (existingIntent.status === "canceled") {
      existingPayment.status = "cancelled";
      booking.status = "cancelled";
      await Promise.all([existingPayment.save(), booking.save()]);
      throw new CustomError("This payment was cancelled. Please create a new reservation", 409);
    }
    if (existingPayment.status === "failed") {
      existingPayment.status = "pending";
      await existingPayment.save();
    }
    return res.status(200).json({
      success: true,
      data: existingPayment,
      clientSecret: existingIntent.client_secret,
      successUrl: getPaymentReturnUrl("success", existingPayment.id),
      cancelUrl: getPaymentReturnUrl("cancel"),
      alreadyPaid: existingIntent.status === "succeeded",
    });
  }

  let customerId = req.user!.stripeCustomerId;
  if (!customerId) {
    const customer = await stripe.customers.create({
      email: req.user!.email,
      name: req.user!.name,
      metadata: { userId: req.user!.id },
    });
    customerId = customer.id;
    req.user!.stripeCustomerId = customerId;
    await req.user!.save();
  }

  const paymentIntent = await stripe.paymentIntents.create({
    amount,
    currency,
    customer: customerId,
    automatic_payment_methods: { enabled: true },
    metadata: {
      userId: req.user!.id,
      placeId: booking.place.toString(),
      bookingId: booking.id,
    },
  }, { idempotencyKey: `flypnp-booking-${booking.id}` });

  const payment = await Payment.create({
    user: req.user!._id,
    name: req.user!.name,
    place: booking.place,
    booking: booking._id,
    amount,
    currency,
    status: "pending",
    stripeId: paymentIntent.id,
    paymentMethod: "",
    paymentDate: new Date(),
  });

  res.status(201).json({
    success: true,
    data: payment,
    clientSecret: paymentIntent.client_secret,
    successUrl: getPaymentReturnUrl("success", payment.id),
    cancelUrl: getPaymentReturnUrl("cancel"),
    alreadyPaid: false,
  });
};

export const confirmPayment = async (req: Request, res: Response) => {
  const payment = await Payment.findById(req.params.id);
  if (!payment) throw new CustomError("Payment not found", 404);
  assertPaymentOwner(payment.user.toString(), req);
  if (!payment.booking) throw new CustomError("This payment is not linked to a booking", 409);

  const intent = await stripe.paymentIntents.retrieve(payment.stripeId);
  if (intent.status !== "succeeded") {
    throw new CustomError("Stripe has not confirmed this payment", 409);
  }

  const booking = await Booking.findById(payment.booking);
  if (!booking) throw new CustomError("Booking not found", 404);
  if (booking.owner.toString() !== req.user!.id && !req.user!.isAdmin) {
    throw new CustomError("You cannot confirm this booking", 403);
  }

  payment.status = "confirmed";
  payment.paymentMethod = String(intent.payment_method ?? "");
  booking.status = "confirmed";
  await Promise.all([payment.save(), booking.save()]);

  res.status(200).json({ success: true, data: payment });
};

export const handleStripeWebhook = async (req: Request, res: Response) => {
  const signature = req.headers["stripe-signature"];
  if (typeof signature !== "string") {
    throw new CustomError("Missing Stripe signature", 400);
  }

  let event;
  try {
    event = stripe.webhooks.constructEvent(
      req.body,
      signature,
      requireEnv("STRIPE_WEBHOOK_SECRET")
    );
  } catch {
    throw new CustomError("Invalid Stripe signature", 400);
  }

  if (event.type.startsWith("payment_intent.")) {
    const intent = event.data.object as Stripe.PaymentIntent;
    const statuses: Record<string, "confirmed" | "cancelled" | "failed"> = {
      "payment_intent.succeeded": "confirmed",
      "payment_intent.canceled": "cancelled",
      "payment_intent.payment_failed": "failed",
    };
    const status = statuses[event.type];
    if (status) {
      const payment = await Payment.findOneAndUpdate(
        { stripeId: intent.id },
        { status, paymentMethod: String(intent.payment_method ?? "") },
        { new: true }
      );
      if (payment?.booking && (status === "confirmed" || status === "cancelled")) {
        await Booking.findByIdAndUpdate(payment.booking, { status });
      }
    }
  }

  res.status(200).json({ received: true });
};

export const getPaymentDetailsWithPlace = async (req: Request, res: Response) => {
  const payment = await Payment.findById(req.params.id).populate("place");
  if (!payment) throw new CustomError("Payment not found", 404);
  assertPaymentOwner(payment.user.toString(), req);
  res.status(200).json({ success: true, data: payment.place });
};

export const getPayments = async (req: Request, res: Response) => {
  const query = req.user!.isAdmin ? {} : { user: req.user!._id };
  const payments = await Payment.find(query).populate("place");
  res.status(200).json({ success: true, count: payments.length, data: payments });
};

export const getSinglePayment = async (req: Request, res: Response) => {
  const payment = await Payment.findById(req.params.id).populate("place");
  if (!payment) throw new CustomError("Payment not found", 404);
  assertPaymentOwner(payment.user.toString(), req);
  res.status(200).json({ success: true, data: payment });
};

export const updatePayment = async (req: Request, res: Response) => {
  const payment = await Payment.findById(req.params.id);
  if (!payment) throw new CustomError("Payment not found", 404);
  assertPaymentOwner(payment.user.toString(), req);

  if (req.body.status !== "cancelled") {
    throw new CustomError("Only payment cancellation is allowed from this endpoint", 400);
  }
  if (payment.status === "pending") {
    await stripe.paymentIntents.cancel(payment.stripeId);
    payment.status = "cancelled";
    if (payment.booking) {
      await Booking.findByIdAndUpdate(payment.booking, { status: "cancelled" });
    }
    await payment.save();
  }
  res.status(200).json({ success: true, data: payment });
};

export const deletePayment = async (req: Request, res: Response) => {
  const payment = await Payment.findByIdAndDelete(req.params.id);
  if (!payment) throw new CustomError("Payment not found", 404);
  res.status(200).json({ success: true });
};
