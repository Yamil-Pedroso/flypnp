import { Request, Response, NextFunction } from "express";
import jwt from "jsonwebtoken";
import { User } from "../models/User";
import { requireEnv } from "../config/env";

// Check if user is logged in based on the token and set the req.user to the user
export const isLoggedIn = async (req: Request, res: Response, next: NextFunction) => {
    const token = req.header("Authorization")?.replace("Bearer ", "") || req.cookies.token;

    if (!token) {
        return res.status(401).json({
            success: false,
            message: "Login first to access this route",
        });
    }

    try {
        // Verify token
        const decoded = jwt.verify(token, requireEnv("JWT_SECRET"));
        if (typeof decoded === "string" || typeof decoded.id !== "string") {
            throw new Error("Invalid token payload");
        }
        const user = await User.findById(decoded.id);
        if (!user) {
            return res.status(401).json({
                success: false,
                message: "The user associated with this token no longer exists",
            });
        }

        req.user = user;

        next();
    } catch (error) {
        return res.status(401).json({
            success: false,
            message: "Login first to access this route",
        });
    }
}
