import { randomBytes } from "crypto";
import { unlink } from "fs/promises";
import type { Request, Response } from "express";
import { v2 as cloudinary } from "cloudinary";
import { User } from "../models/User";
import cookieToken from "../utils/cookieToken";
import CustomError from "../utils/customError";

const DEFAULT_AVATAR =
  "https://res.cloudinary.com/ddgf7ijdc/image/upload/v1706787809/yami_lil00v.jpg";

const normalizeEmail = (email: unknown) => String(email ?? "").trim().toLowerCase();
const isValidEmail = (email: string) => /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);

const uploadAvatarFile = async (file?: Express.Multer.File) => {
  if (!file) return undefined;

  try {
    const result = await cloudinary.uploader.upload(file.path, {
      folder: "userAvatars/Avatars",
      resource_type: "image",
    });
    return result.secure_url;
  } finally {
    await unlink(file.path).catch(() => undefined);
  }
};

const canManageUser = (req: Request, userId: string) =>
  Boolean(req.user && (req.user.id === userId || req.user.isAdmin));

const paramValue = (value: string | string[]) => Array.isArray(value) ? value[0] : value;

export const registerUser = async (req: Request, res: Response) => {
  const name = String(req.body.name ?? "").trim();
  const email = normalizeEmail(req.body.email);
  const password = String(req.body.password ?? "");

  if (!name || !isValidEmail(email) || password.length < 6) {
    throw new CustomError("A valid name, email and password are required", 400);
  }

  if (await User.exists({ email })) {
    throw new CustomError("User already exists", 409);
  }

  const avatar = (await uploadAvatarFile(req.file)) ?? DEFAULT_AVATAR;
  const user = await User.create({ name, email, password, avatar });
  cookieToken(user, res);
};

export const loginUser = async (req: Request, res: Response) => {
  const email = normalizeEmail(req.body.email);
  const password = String(req.body.password ?? "");

  if (!email || !password) {
    throw new CustomError("Email and password are required", 400);
  }

  const user = await User.findOne({ email });
  if (!user || !(await user.isValidatedPassword(password))) {
    throw new CustomError("Invalid credentials", 401);
  }

  cookieToken(user, res);
};

interface GoogleTokenInfo {
  aud?: string;
  email?: string;
  email_verified?: string;
  given_name?: string;
  family_name?: string;
  name?: string;
  picture?: string;
}

export const googleLogin = async (req: Request, res: Response) => {
  const credential = String(req.body.credential ?? "");
  const googleClientId = process.env.GOOGLE_CLIENT_ID;

  if (!credential || !googleClientId) {
    throw new CustomError("Google login is not configured", 503);
  }

  const tokenResponse = await fetch(
    `https://oauth2.googleapis.com/tokeninfo?id_token=${encodeURIComponent(credential)}`
  );
  if (!tokenResponse.ok) {
    throw new CustomError("Invalid Google credential", 401);
  }

  const profile = (await tokenResponse.json()) as GoogleTokenInfo;
  const email = normalizeEmail(profile.email);
  if (profile.aud !== googleClientId || profile.email_verified !== "true" || !email) {
    throw new CustomError("Invalid Google credential", 401);
  }

  let user = await User.findOne({ email });
  if (!user) {
    const name =
      profile.name ??
      [profile.given_name, profile.family_name].filter(Boolean).join(" ") ??
      "Flypnp user";
    user = await User.create({
      name,
      email,
      password: randomBytes(24).toString("hex"),
      avatar: profile.picture ?? DEFAULT_AVATAR,
    });
  }

  cookieToken(user, res);
};

export const uploadAvatar = async (req: Request, res: Response) => {
  if (!req.file) {
    throw new CustomError("An image file is required", 400);
  }

  const url = await uploadAvatarFile(req.file);
  res.status(200).json({ success: true, url });
};

export const updateUser = async (req: Request, res: Response) => {
  const userId = paramValue(req.params.id);
  if (!canManageUser(req, userId)) {
    throw new CustomError("You cannot update this user", 403);
  }

  const user = await User.findById(userId);
  if (!user) throw new CustomError("User not found", 404);

  const name = req.body.name === undefined ? undefined : String(req.body.name).trim();
  const password = req.body.password === undefined ? undefined : String(req.body.password);
  if (name !== undefined && !name) throw new CustomError("Name cannot be empty", 400);
  if (password !== undefined && password.length < 6) {
    throw new CustomError("Password must contain at least 6 characters", 400);
  }

  if (req.file) user.avatar = (await uploadAvatarFile(req.file)) ?? user.avatar;
  if (name !== undefined) user.name = name;
  if (password !== undefined) user.password = password;

  await user.save();
  cookieToken(user, res);
};

export const logoutUser = async (_req: Request, res: Response) => {
  res.clearCookie("token", {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: "lax",
  });
  res.status(200).json({ success: true });
};

export const getUsers = async (_req: Request, res: Response) => {
  const users = await User.find().select("-password");
  res.status(200).json({ success: true, data: users });
};

export const deleteUser = async (req: Request, res: Response) => {
  const userId = paramValue(req.params.id);
  if (!canManageUser(req, userId)) {
    throw new CustomError("You cannot delete this user", 403);
  }

  const deletedUser = await User.findByIdAndDelete(userId);
  if (!deletedUser) throw new CustomError("User not found", 404);

  res.status(200).json({ success: true, message: "User deleted successfully" });
};
