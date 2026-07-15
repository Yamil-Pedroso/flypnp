import type { Request, Response } from "express";
import type Stripe from "stripe";
import { Payment } from "../models/Payment";
import { Place } from "../models/Place";
import { stripe } from "../config/stripe";
import { requireEnv } from "../config/env";
import CustomError from "../utils/customError";

const assertPaymentOwner = (userId: string, req: Request) => {
  if (userId !== req.user!.id && !req.user!.isAdmin) {
    throw new CustomError("You cannot access this payment", 403);
  }
};

export const createPayment = async (req: Request, res: Response) => {
  const place = await Place.findById(req.body.placeId);
  if (!place) throw new CustomError("Place not found", 404);

  const currency = String(req.body.currency ?? "chf").toLowerCase();
  if (!/^[a-z]{3}$/.test(currency)) throw new CustomError("Invalid currency", 400);

  const amount = Math.round(place.price * 100);
  const paymentIntent = await stripe.paymentIntents.create({
    amount,
    currency,
    automatic_payment_methods: { enabled: true },
    metadata: {
      userId: req.user!.id,
      placeId: place.id,
    },
  });

  const payment = await Payment.create({
    user: req.user!._id,
    name: req.user!.name,
    place: place._id,
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
  });
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
      await Payment.findOneAndUpdate(
        { stripeId: intent.id },
        { status, paymentMethod: String(intent.payment_method ?? "") }
      );
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
    await payment.save();
  }
  res.status(200).json({ success: true, data: payment });
};

export const deletePayment = async (req: Request, res: Response) => {
  const payment = await Payment.findByIdAndDelete(req.params.id);
  if (!payment) throw new CustomError("Payment not found", 404);
  res.status(200).json({ success: true });
};
