import { Request, Response, NextFunction } from "express";
import jwt from "jsonwebtoken";
import { User, IUser } from "../models/User";

// Extend the Request interface to add the user property
interface AuthenticatedRequest extends Request {
    user?: IUser | null;

}

// Check if user is logged in based on the token and set the req.user to the user
export const isLoggedIn = async (req: AuthenticatedRequest, res: Response, next: NextFunction) => {
    const token = req.cookies.token || req.header("Authorization")?.replace("Bearer ", "");

    if (!token) {
        return res.status(401).json({
            success: false,
            message: "Login first to access this route",
        });
    }

    try {
        // Verify token
        const decoded = jwt.verify(token, process.env.JWT_SECRET!) as any;

        // Set the req.user to the user
        req.user = await User.findById(decoded.id);

        next();
    } catch (error) {
        console.log("JWT verification error:", error);
        return res.status(401).json({
            success: false,
            message: "Login first to access this route",
        });
    }
}
