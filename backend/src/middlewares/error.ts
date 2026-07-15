import { unlink } from "fs/promises";
import type { NextFunction, Request, Response } from "express";
import multer from "multer";
import mongoose from "mongoose";
import CustomError from "../utils/customError";

export const notFound = (req: Request, res: Response) => {
  res.status(404).json({
    success: false,
    message: `Route not found: ${req.method} ${req.originalUrl}`,
  });
};

export const errorHandler = (
  error: Error,
  req: Request,
  res: Response,
  _next: NextFunction
) => {
  if (req.file) void unlink(req.file.path).catch(() => undefined);
  if (Array.isArray(req.files)) {
    for (const file of req.files) void unlink(file.path).catch(() => undefined);
  }

  let statusCode = error instanceof CustomError ? error.statusCode : 500;
  let message = error.message;
  if (error instanceof multer.MulterError || error instanceof mongoose.Error.ValidationError) {
    statusCode = 400;
  } else if (error instanceof mongoose.Error.CastError) {
    statusCode = 400;
    message = "Invalid resource id";
  } else if ((error as Error & { code?: number }).code === 11000) {
    statusCode = 409;
    message = "Resource already exists";
  }

  if (statusCode >= 500) {
    console.error(error);
  }

  res.status(statusCode).json({
    success: false,
    message: statusCode >= 500 ? "Internal server error" : message,
  });
};
