import type { Request, Response } from "express";
import { isValidObjectId } from "mongoose";
import { Notification } from "../models/Notification";
import { User } from "../models/User";
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
