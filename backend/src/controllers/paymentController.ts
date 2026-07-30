import type { Request, Response } from "express";
import type Stripe from "stripe";
import { Payment } from "../models/Payment";
import { Booking } from "../models/Booking";
import { ExperienceBooking } from "../models/ExperienceBooking";
import { ServiceRequest } from "../models/ServiceRequest";
import { stripe } from "../config/stripe";
import { requireEnv } from "../config/env";
import { notifyUser } from "../services/notificationService";
import CustomError from "../utils/customError";
import { serviceRequestView } from "../utils/serviceRequestView";

const serviceNames = {
  "airport-transfer": "Airport Transfer",
  "pet-care": "Pet Care",
  "local-guide": "Local Guide",
} as const;

const providerSummary = (serviceRequest: {
  provider?: { name?: string; email?: string; phone?: string };
}) => {
  const provider = serviceRequest.provider;
  if (!provider) return "Provider details are available in Trips.";
  return [
    `Provider: ${provider.name ?? "Assigned provider"}.`,
    provider.phone ? `Phone: ${provider.phone}.` : "",
    provider.email ? `Email: ${provider.email}.` : "",
  ].filter(Boolean).join(" ");
};

const sendServiceConfirmation = async (serviceRequest: {
  id: string;
  owner: { toString(): string };
  serviceType: keyof typeof serviceNames;
  provider?: { name?: string; email?: string; phone?: string };
}) => {
  const name = serviceNames[serviceRequest.serviceType];
  await notifyUser({
    userId: serviceRequest.owner.toString(),
    type: "service_confirmed",
    title: `${name} confirmed`,
    message: `Your ${name} is confirmed. Provider details are now available in Trips.`,
    actionUrl: "/trips",
    dedupeKey: `service-confirmed:${serviceRequest.id}`,
    emailSubject: `Your Flypnp ${name} is confirmed`,
    emailText: `Your ${name} is confirmed. ${providerSummary(serviceRequest)}`,
  });
};

interface PaymentResponseSource {
  toObject?: () => Record<string, unknown>;
  [key: string]: unknown;
}

const paymentView = (payment: unknown, revealProviderContacts: boolean) => {
  const source = payment as PaymentResponseSource;
  const value = typeof source.toObject === "function" ? source.toObject() : { ...source };
  const serviceRequest = value.serviceRequest;
  if (serviceRequest && typeof serviceRequest === "object") {
    value.serviceRequest = serviceRequestView(
      serviceRequest,
      revealProviderContacts,
    );
  }
  return value;
};

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
  const bookingId = req.body.bookingId ? String(req.body.bookingId) : "";
  const experienceBookingId = req.body.experienceBookingId ? String(req.body.experienceBookingId) : "";
  const serviceRequestId = req.body.serviceRequestId ? String(req.body.serviceRequestId) : "";
  if ([bookingId, experienceBookingId, serviceRequestId].filter(Boolean).length !== 1) {
    throw new CustomError("Provide one booking to pay", 400);
  }

  const booking = bookingId ? await Booking.findById(bookingId) : null;
  const experienceBooking = experienceBookingId
    ? await ExperienceBooking.findById(experienceBookingId)
    : null;
  const serviceRequest = serviceRequestId
    ? await ServiceRequest.findById(serviceRequestId)
    : null;
  const payable = booking ?? experienceBooking ?? serviceRequest;
  if (!payable) {
    throw new CustomError(
      bookingId ? "Booking not found" : experienceBookingId ? "Experience booking not found" : "Service request not found",
      404,
    );
  }
  if (payable.owner.toString() !== req.user!.id && !req.user!.isAdmin) {
    throw new CustomError("You cannot pay for this booking", 403);
  }
  if (serviceRequest ? serviceRequest.status !== "quoted" : payable.status !== "pending") {
    throw new CustomError(serviceRequest ? "Only quoted services can be paid" : "Only pending bookings can be paid", 409);
  }
  if (serviceRequest && !serviceRequest.quotePrice) {
    throw new CustomError("This service does not have a valid quote", 409);
  }

  const currency = String(req.body.currency ?? "chf").toLowerCase();
  if (currency !== "chf") throw new CustomError("Only CHF payments are supported", 400);

  const basePrice = booking
    ? booking.price
    : experienceBooking
      ? experienceBooking.price
      : serviceRequest!.quotePrice!;
  const amount = Math.round(basePrice * 1.1 * 100);
  const paymentLink = booking
    ? { booking: booking._id }
    : experienceBooking
      ? { experienceBooking: experienceBooking._id }
      : { serviceRequest: serviceRequest!._id };
  const existingPayment = await Payment.findOne({
    ...paymentLink,
    user: req.user!._id,
    status: { $in: ["pending", "failed"] },
  });
  if (existingPayment) {
    const existingIntent = await stripe.paymentIntents.retrieve(existingPayment.stripeId);
    if (existingIntent.status === "canceled") {
      existingPayment.status = "cancelled";
      payable.status = "cancelled";
      await Promise.all([existingPayment.save(), payable.save()]);
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
      ...(booking ? {
        placeId: booking.place.toString(),
        bookingId: booking.id,
      } : experienceBooking ? {
        experienceId: experienceBooking!.experience.toString(),
        experienceBookingId: experienceBooking!.id,
      } : {
        serviceRequestId: serviceRequest!.id,
        serviceType: serviceRequest!.serviceType,
      }),
    },
  }, {
    idempotencyKey: booking
      ? `flypnp-booking-${booking.id}`
      : experienceBooking
        ? `flypnp-experience-${experienceBooking.id}`
        : `flypnp-service-${serviceRequest!.id}`,
  });

  const payment = await Payment.create({
    user: req.user!._id,
    name: req.user!.name,
    ...(booking ? {
      place: booking.place,
      booking: booking._id,
    } : experienceBooking ? {
      experience: experienceBooking!.experience,
      experienceBooking: experienceBooking!._id,
    } : {
      serviceRequest: serviceRequest!._id,
    }),
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
  if (!payment.booking && !payment.experienceBooking && !payment.serviceRequest) {
    throw new CustomError("This payment is not linked to a booking", 409);
  }

  const intent = await stripe.paymentIntents.retrieve(payment.stripeId);
  if (intent.status !== "succeeded") {
    throw new CustomError("Stripe has not confirmed this payment", 409);
  }

  const booking = payment.booking ? await Booking.findById(payment.booking) : null;
  const experienceBooking = payment.experienceBooking
    ? await ExperienceBooking.findById(payment.experienceBooking)
    : null;
  const serviceRequest = payment.serviceRequest
    ? await ServiceRequest.findById(payment.serviceRequest)
    : null;
  const payable = booking ?? experienceBooking ?? serviceRequest;
  if (!payable) throw new CustomError("Booking not found", 404);
  if (payable.owner.toString() !== req.user!.id && !req.user!.isAdmin) {
    throw new CustomError("You cannot confirm this booking", 403);
  }

  payment.status = "confirmed";
  payment.paymentMethod = String(intent.payment_method ?? "");
  const shouldNotifyServiceConfirmation = Boolean(serviceRequest && serviceRequest.status !== "confirmed");
  payable.status = "confirmed";
  if (serviceRequest) serviceRequest.confirmedAt = new Date();
  await Promise.all([payment.save(), payable.save()]);
  if (serviceRequest && shouldNotifyServiceConfirmation) {
    await sendServiceConfirmation(serviceRequest);
  }

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
      if (payment?.experienceBooking && (status === "confirmed" || status === "cancelled")) {
        await ExperienceBooking.findByIdAndUpdate(payment.experienceBooking, { status });
      }
      if (payment?.serviceRequest && (status === "confirmed" || status === "cancelled")) {
        const serviceRequest = await ServiceRequest.findOneAndUpdate(
          { _id: payment.serviceRequest, status: { $ne: status } },
          {
            status,
            ...(status === "confirmed" ? { confirmedAt: new Date() } : {}),
          },
          { new: true },
        );
        if (serviceRequest && status === "confirmed") {
          await sendServiceConfirmation(serviceRequest);
        }
      }
    }
  }

  res.status(200).json({ received: true });
};

export const getPaymentDetailsWithPlace = async (req: Request, res: Response) => {
  const payment = await Payment.findById(req.params.id).populate("place");
  if (!payment) throw new CustomError("Payment not found", 404);
  assertPaymentOwner(payment.user.toString(), req);
  if (!payment.place) throw new CustomError("This payment is not linked to a stay", 409);
  res.status(200).json({ success: true, data: payment.place });
};

export const getPayments = async (req: Request, res: Response) => {
  const query = req.user!.isAdmin ? {} : { user: req.user!._id };
  const payments = await Payment.find(query).populate("place").populate("experience").populate("serviceRequest");
  const data = payments.map((payment) => paymentView(payment, Boolean(req.user!.isAdmin)));
  res.status(200).json({ success: true, count: data.length, data });
};

export const getSinglePayment = async (req: Request, res: Response) => {
  const payment = await Payment.findById(req.params.id).populate("place").populate("experience").populate("serviceRequest");
  if (!payment) throw new CustomError("Payment not found", 404);
  assertPaymentOwner(payment.user.toString(), req);
  res.status(200).json({ success: true, data: paymentView(payment, Boolean(req.user!.isAdmin)) });
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
    if (payment.experienceBooking) {
      await ExperienceBooking.findByIdAndUpdate(payment.experienceBooking, { status: "cancelled" });
    }
    if (payment.serviceRequest) {
      await ServiceRequest.findByIdAndUpdate(payment.serviceRequest, { status: "cancelled" });
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
