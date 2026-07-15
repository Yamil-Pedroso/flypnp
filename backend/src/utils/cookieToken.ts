import type { Response } from "express";
import type { HydratedDocument } from "mongoose";
import type { IUser } from "../models/User";

const cookieToken = (user: HydratedDocument<IUser>, res: Response) => {
  const token = user.getSignedJwtToken();

  const cookiesExpireDays = Number(process.env.JWT_COOKIE_EXPIRE) || 7; // fallback de 7 días

  const options = {
    expires: new Date(Date.now() + cookiesExpireDays * 24 * 60 * 60 * 1000),
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: "lax" as const,
  };

  const safeUser = user.toObject();
  const { password: _password, stripeCustomerId: _stripeCustomerId, ...userWithoutPassword } = safeUser;

  res.status(200).cookie("token", token, options).json({
    success: true,
    token,
    user: userWithoutPassword,
  });
};

export default cookieToken;
