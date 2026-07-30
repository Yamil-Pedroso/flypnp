import { createHash } from "crypto";
import type { NextFunction, Request, Response } from "express";
import { RateLimitBucket } from "../models/RateLimitBucket";
import CustomError from "../utils/customError";

interface RateLimitOptions {
  scope: string;
  windowMs: number;
  max: number;
}

const incrementBucket = async (key: string, expiresAt: Date) => {
  try {
    return await RateLimitBucket.findOneAndUpdate(
      { key },
      {
        $inc: { count: 1 },
        $setOnInsert: { expiresAt },
      },
      { upsert: true, new: true, setDefaultsOnInsert: true },
    );
  } catch (error) {
    if ((error as Error & { code?: number }).code !== 11000) throw error;
    return RateLimitBucket.findOneAndUpdate(
      { key },
      { $inc: { count: 1 } },
      { new: true },
    );
  }
};

export const rateLimit = ({ scope, windowMs, max }: RateLimitOptions) =>
  async (req: Request, res: Response, next: NextFunction) => {
    try {
      const now = Date.now();
      const windowNumber = Math.floor(now / windowMs);
      const identity = req.user?.id ?? req.ip ?? req.socket.remoteAddress ?? "unknown";
      const key = createHash("sha256")
        .update(`${scope}:${identity}:${windowNumber}`)
        .digest("hex");
      const resetAt = (windowNumber + 1) * windowMs;
      const bucket = await incrementBucket(key, new Date(resetAt + windowMs));
      const count = bucket?.count ?? max + 1;

      res.setHeader("RateLimit-Limit", String(max));
      res.setHeader("RateLimit-Remaining", String(Math.max(0, max - count)));
      res.setHeader("RateLimit-Reset", String(Math.ceil(resetAt / 1000)));

      if (count > max) {
        res.setHeader("Retry-After", String(Math.max(1, Math.ceil((resetAt - now) / 1000))));
        throw new CustomError("Too many requests. Please try again later.", 429);
      }

      next();
    } catch (error) {
      next(error);
    }
  };
