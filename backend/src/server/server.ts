import "../config/env";
import express from "express";
import { Request, Response } from "express";
import cors from "cors";
import path from "path";
import morgan from "morgan";
import cookieParser from "cookie-parser";
import helmet from "helmet";
import { v2 as cloudinary } from "cloudinary";
import connectDB from "../config/db";
import routes from "../routes";
import { errorHandler, notFound } from "../middlewares/error";
import asyncHandler from "../utils/asyncHandler";
import { handleStripeWebhook } from "../controllers/paymentController";
import CustomError from "../utils/customError";
import { validateProductionEnv } from "../config/env";
import { startEmailDeliveryWorker } from "../services/notificationService";

const PORT = Number(process.env.PORT) || 8080;

// Cloudinary config
cloudinary.config({
  cloud_name: process.env.CLOUD_NAME,
  api_key: process.env.CLOUD_API_KEY,
  api_secret: process.env.CLOUD_API_SECRET,
});

const app = express();
app.use(morgan("dev"));
app.post(
  "/api/v1/stripe/webhook",
  express.raw({ type: "application/json", limit: "1mb" }),
  asyncHandler(handleStripeWebhook)
);
app.use(express.json({ limit: "1mb" }));
app.use(express.urlencoded({ extended: true, limit: "1mb" }));

const allowedOrigins = (process.env.CLIENT_URL ?? "")
  .split(",")
  .map((origin) => origin.trim())
  .filter(Boolean);
app.use(cors({
  origin(origin, callback) {
    if (!origin || allowedOrigins.includes(origin)) return callback(null, true);
    callback(new CustomError("Origin is not allowed by CORS", 403));
  },
  credentials: true,
}));

app.use(helmet({ crossOriginResourcePolicy: { policy: "cross-origin" } }));

// Handle cookies
app.use(cookieParser());
app.use("/api/v1", routes);
app.use("/api/v1", notFound);

app.get("/health", (_req: Request, res: Response) => {
  res.json({ success: true, service: "flypnp-api" });
});

app.use(express.static(path.join(__dirname, "../../", "public")));

app.get("/", (req: Request, res: Response) => {
  res.json({ success: true, service: "flypnp-api" });
});

app.get("/{*splat}", (_req: Request, res: Response) => {
  res.sendFile(path.join(__dirname, "../../", "public", "index.html"));
});

app.use(errorHandler);

const startServer = async () => {
  validateProductionEnv();
  await connectDB();
  startEmailDeliveryWorker();
  app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}.`);
  });
};

if (require.main === module) {
  void startServer().catch((error) => {
    console.error(error);
    process.exitCode = 1;
  });
}

export { app, startServer };
