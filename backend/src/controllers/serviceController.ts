import type { Request, Response } from "express";
import { ServiceRequest, type ServiceType } from "../models/ServiceRequest";
import { Payment } from "../models/Payment";
import { stripe } from "../config/stripe";
import { notifyUser } from "../services/notificationService";
import CustomError from "../utils/customError";
import { serviceRequestView } from "../utils/serviceRequestView";

const serviceTypes = new Set<ServiceType>(["airport-transfer", "pet-care", "local-guide"]);
const serviceNames: Record<ServiceType, string> = {
  "airport-transfer": "Airport Transfer",
  "pet-care": "Pet Care",
  "local-guide": "Local Guide",
};

const requiredText = (value: unknown, label: string, maxLength = 200) => {
  const text = String(value ?? "").trim();
  if (!text) throw new CustomError(`${label} is required`, 400);
  if (text.length > maxLength) throw new CustomError(`${label} is too long`, 400);
  return text;
};

const optionalText = (value: unknown, maxLength: number) => {
  const text = String(value ?? "").trim();
  if (text.length > maxLength) throw new CustomError("One of the supplied fields is too long", 400);
  return text || undefined;
};

const parseDate = (value: unknown) => {
  const raw = String(value ?? "");
  if (!/^\d{4}-\d{2}-\d{2}$/.test(raw)) {
    throw new CustomError("date must use YYYY-MM-DD", 400);
  }
  const date = new Date(`${raw}T00:00:00.000Z`);
  const today = new Date();
  today.setUTCHours(0, 0, 0, 0);
  if (Number.isNaN(date.getTime()) || date < today) {
    throw new CustomError("Service date cannot be in the past", 400);
  }
  return date;
};

const parseCount = (value: unknown, label: string, maximum: number) => {
  const count = Number(value);
  if (!Number.isInteger(count) || count < 1 || count > maximum) {
    throw new CustomError(`${label} must be between 1 and ${maximum}`, 400);
  }
  return count;
};

export const createServiceRequest = async (req: Request, res: Response) => {
  const serviceType = String(req.body.serviceType ?? "") as ServiceType;
  if (!serviceTypes.has(serviceType)) throw new CustomError("Invalid service type", 400);

  const time = requiredText(req.body.time, "time", 5);
  if (!/^([01]\d|2[0-3]):[0-5]\d$/.test(time)) {
    throw new CustomError("time must use HH:mm", 400);
  }

  const rawDetails = req.body.details ?? {};
  const details: IServiceDetails = {};
  if (serviceType === "airport-transfer") {
    details.pickup = requiredText(rawDetails.pickup, "pickup");
    details.dropoff = requiredText(rawDetails.dropoff, "dropoff");
    details.flightNumber = optionalText(rawDetails.flightNumber, 30);
  }
  if (serviceType === "pet-care") {
    details.petType = requiredText(rawDetails.petType, "pet type", 60);
    details.petCount = parseCount(rawDetails.petCount, "pet count", 10);
  }
  if (serviceType === "local-guide") {
    details.language = requiredText(rawDetails.language, "language", 60);
    details.interests = optionalText(rawDetails.interests, 300);
  }

  const serviceRequest = await ServiceRequest.create({
    owner: req.user!._id,
    serviceType,
    destination: requiredText(req.body.destination, "destination", 160),
    date: parseDate(req.body.date),
    time,
    participants: parseCount(req.body.participants, "participants", 20),
    notes: optionalText(req.body.notes, 1000),
    details,
    status: "requested",
  });

  res.status(201).json({ success: true, data: serviceRequest });
};

interface IServiceDetails {
  pickup?: string;
  dropoff?: string;
  flightNumber?: string;
  petType?: string;
  petCount?: number;
  language?: string;
  interests?: string;
}

export const getUserServiceRequests = async (req: Request, res: Response) => {
  const requests = await ServiceRequest.find({
    owner: req.user!._id,
    status: { $ne: "cancelled" },
  }).sort({ date: 1, createdAt: -1 });
  const data = requests.map((request) => serviceRequestView(request));
  res.status(200).json({ success: true, count: data.length, data });
};

export const getAllServiceRequests = async (_req: Request, res: Response) => {
  const requests = await ServiceRequest.find()
    .populate("owner", "name email avatar")
    .sort({ createdAt: -1 });
  res.status(200).json({ success: true, count: requests.length, data: requests });
};

export const quoteServiceRequest = async (req: Request, res: Response) => {
  const serviceRequest = await ServiceRequest.findById(req.params.id);
  if (!serviceRequest) throw new CustomError("Service request not found", 404);
  if (!["requested", "quoted"].includes(serviceRequest.status)) {
    throw new CustomError("Only active requests can be quoted", 409);
  }

  const pendingPayment = await Payment.findOne({
    serviceRequest: serviceRequest._id,
    status: { $in: ["pending", "failed", "confirmed"] },
  });
  if (pendingPayment) {
    throw new CustomError("This quote already has an active payment", 409);
  }

  const quotePrice = Number(req.body.quotePrice);
  if (!Number.isFinite(quotePrice) || quotePrice < 1 || quotePrice > 100_000) {
    throw new CustomError("quotePrice must be between 1 and 100000", 400);
  }
  const providerName = requiredText(req.body.provider?.name, "provider name", 120);
  const providerEmail = optionalText(req.body.provider?.email, 160);
  const providerPhone = optionalText(req.body.provider?.phone, 40);
  if (!providerEmail && !providerPhone) {
    throw new CustomError("Provide an email or phone number for the provider", 400);
  }

  serviceRequest.quotePrice = Math.round(quotePrice * 100) / 100;
  serviceRequest.provider = {
    name: providerName,
    email: providerEmail,
    phone: providerPhone,
  };
  serviceRequest.adminMessage = optionalText(req.body.adminMessage, 1000);
  serviceRequest.quotedAt = new Date();
  serviceRequest.status = "quoted";
  await serviceRequest.save();

  const name = serviceNames[serviceRequest.serviceType];
  await notifyUser({
    userId: serviceRequest.owner.toString(),
    type: "service_quote",
    title: `${name} quote ready`,
    message: `Your ${name} request is ready to review and pay.`,
    actionUrl: "/services",
    dedupeKey: `service-quote:${serviceRequest.id}:${serviceRequest.quotedAt.toISOString()}`,
    emailSubject: `Your Flypnp ${name} quote is ready`,
    emailText: `Your ${name} request has been reviewed. Sign in to Flypnp to review the quote and complete payment.`,
  });

  res.status(200).json({ success: true, data: serviceRequest });
};

export const cancelServiceRequest = async (req: Request, res: Response) => {
  const serviceRequest = await ServiceRequest.findById(req.params.id);
  if (!serviceRequest) throw new CustomError("Service request not found", 404);
  if (serviceRequest.owner.toString() !== req.user!.id && !req.user!.isAdmin) {
    throw new CustomError("You cannot cancel this service request", 403);
  }
  if (serviceRequest.status === "cancelled") {
    throw new CustomError("Service request is already cancelled", 409);
  }
  if (serviceRequest.status === "confirmed") {
    throw new CustomError("Contact support to cancel a confirmed service", 409);
  }

  const payment = await Payment.findOne({
    serviceRequest: serviceRequest._id,
    status: { $in: ["pending", "failed"] },
  });
  if (payment) {
    if (payment.status === "pending") await stripe.paymentIntents.cancel(payment.stripeId);
    payment.status = "cancelled";
    await payment.save();
  }
  serviceRequest.status = "cancelled";
  await serviceRequest.save();
  if (req.user!.isAdmin) {
    const name = serviceNames[serviceRequest.serviceType];
    await notifyUser({
      userId: serviceRequest.owner.toString(),
      type: "service_cancelled",
      title: `${name} request cancelled`,
      message: `Your ${name} request was cancelled by the Flypnp operations team. Contact support if you need help.`,
      actionUrl: "/services",
      dedupeKey: `service-cancelled:${serviceRequest.id}`,
      emailSubject: `Update about your Flypnp ${name} request`,
      emailText: `Your ${name} request was cancelled by the Flypnp operations team. Contact support if you need help.`,
    });
  }
  res.status(200).json({ success: true, message: "Service request cancelled" });
};
