import { existsSync } from "fs";
import path from "path";
import dotenv from "dotenv";

const configPath = [
  process.env.CONFIG_PATH,
  path.resolve(process.cwd(), ".env"),
  path.resolve(process.cwd(), "src", "config", "config.env"),
].find((candidate): candidate is string => Boolean(candidate && existsSync(candidate)));

if (configPath) dotenv.config({ path: configPath, quiet: true });

export const requireEnv = (name: string) => {
  const value = process.env[name];
  if (!value) throw new Error(`${name} is required`);
  return value;
};

export const validateProductionEnv = () => {
  if (process.env.NODE_ENV !== "production") return;

  const required = [
    "MONGO_URI",
    "CLIENT_URL",
    "JWT_SECRET",
    "GOOGLE_CLIENT_ID",
    "STRIPE_SECRET_KEY",
    "STRIPE_WEBHOOK_SECRET",
    "STRIPE_SUCCESS_URL",
    "STRIPE_CANCEL_URL",
    "STRIPE_MODE",
    "RESEND_API_KEY",
    "EMAIL_FROM",
  ];
  const missing = required.filter((name) => !process.env[name]?.trim());
  if (missing.length) {
    throw new Error(`Missing production environment variables: ${missing.join(", ")}`);
  }

  const httpsValues = [
    ...(process.env.CLIENT_URL ?? "").split(","),
    process.env.STRIPE_SUCCESS_URL ?? "",
    process.env.STRIPE_CANCEL_URL ?? "",
  ].map((value) => value.trim());
  if (httpsValues.some((value) => !value.startsWith("https://"))) {
    throw new Error("Production client and Stripe return URLs must use HTTPS");
  }

  if (!["test", "live"].includes(process.env.STRIPE_MODE ?? "")) {
    throw new Error("STRIPE_MODE must be either test or live");
  }
  const expectedPrefix = process.env.STRIPE_MODE === "live" ? "sk_live_" : "sk_test_";
  if (!process.env.STRIPE_SECRET_KEY?.startsWith(expectedPrefix)) {
    throw new Error(`STRIPE_SECRET_KEY does not match STRIPE_MODE=${process.env.STRIPE_MODE}`);
  }
};
