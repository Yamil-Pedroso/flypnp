import type { Request, Response } from "express";
import { isValidObjectId } from "mongoose";
import { Notification } from "../models/Notification";
import { EmailDelivery, type EmailDeliveryStatus } from "../models/EmailDelivery";
import { User } from "../models/User";
import { processEmailDeliveries } from "../services/notificationService";
import CustomError from "../utils/customError";

const canAccessUser = (req: Request, userId: string) =>
  req.user!.id === userId || req.user!.isAdmin;

const paramValue = (value: string | string[] | undefined) =>
  Array.isArray(value) ? value[0] : value;

export const getAllNotifications = async (_req: Request, res: Response) => {
  const notifications = await Notification.find();
  res.status(200).json({ success: true, data: notifications });
};

export const getAllUserNotifications = async (req: Request, res: Response) => {
  const userId = paramValue(req.params.id) || req.user!.id;
  if (!canAccessUser(req, userId)) {
    throw new CustomError("You cannot access these notifications", 403);
  }
  const notifications = await Notification.find({ user: userId }).sort({ createdAt: -1 });
  res.status(200).json(notifications);
};

export const createNotification = async (req: Request, res: Response) => {
  const userId = String(req.body.userId ?? "");
  const message = String(req.body.message ?? "").trim();
  if (!isValidObjectId(userId) || !message) {
    throw new CustomError("A valid userId and message are required", 400);
  }
  if (!(await User.exists({ _id: userId }))) throw new CustomError("User not found", 404);

  const notification = await Notification.create({ user: userId, message, read: false });
  res.status(201).json({ success: true, data: notification });
};

export const sendNotification = createNotification;

export const markNotificationAsRead = async (req: Request, res: Response) => {
  const notification = await Notification.findById(req.params.id);
  if (!notification) throw new CustomError("Notification not found", 404);
  if (!canAccessUser(req, notification.user.toString())) {
    throw new CustomError("You cannot update this notification", 403);
  }
  notification.read = true;
  await notification.save();
  res.status(200).json({ success: true, data: notification });
};

export const deleteNotification = async (req: Request, res: Response) => {
  const notification = await Notification.findById(req.params.id);
  if (!notification) throw new CustomError("Notification not found", 404);
  if (!canAccessUser(req, notification.user.toString())) {
    throw new CustomError("You cannot delete this notification", 403);
  }
  await notification.deleteOne();
  res.status(200).json({ success: true });
};

export const getEmailDeliveries = async (req: Request, res: Response) => {
  const requestedStatus = String(req.query.status ?? "");
  const allowedStatuses = new Set(["pending", "processing", "sent", "failed"]);
  const query: { status?: EmailDeliveryStatus } = {};
  if (allowedStatuses.has(requestedStatus)) query.status = requestedStatus as EmailDeliveryStatus;
  const deliveries = await EmailDelivery.find(query)
    .select("+recipient")
    .sort({ createdAt: -1 })
    .limit(200);
  res.status(200).json({ success: true, count: deliveries.length, data: deliveries });
};

export const retryEmailDelivery = async (req: Request, res: Response) => {
  const delivery = await EmailDelivery.findById(req.params.id);
  if (!delivery) throw new CustomError("Email delivery not found", 404);
  if (delivery.status === "sent") {
    throw new CustomError("A sent email cannot be retried", 409);
  }
  delivery.status = "pending";
  delivery.attempts = 0;
  delivery.nextAttemptAt = new Date();
  delivery.lockedAt = undefined;
  delivery.lastError = undefined;
  await delivery.save();
  void processEmailDeliveries(1).catch(console.error);
  res.status(200).json({ success: true, data: delivery });
};
