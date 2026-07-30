import { Schema, model } from "mongoose";

export type EmailDeliveryStatus = "pending" | "processing" | "sent" | "failed";

export interface IEmailDelivery {
  recipient: string;
  subject: string;
  text: string;
  html: string;
  dedupeKey: string;
  status: EmailDeliveryStatus;
  attempts: number;
  nextAttemptAt: Date;
  lockedAt?: Date;
  sentAt?: Date;
  providerMessageId?: string;
  lastError?: string;
}

const emailDeliverySchema = new Schema<IEmailDelivery>({
  recipient: { type: String, required: true, trim: true, lowercase: true, select: false },
  subject: { type: String, required: true, maxlength: 200 },
  text: { type: String, required: true, maxlength: 10_000, select: false },
  html: { type: String, required: true, maxlength: 30_000, select: false },
  dedupeKey: { type: String, required: true, unique: true, maxlength: 256 },
  status: {
    type: String,
    enum: ["pending", "processing", "sent", "failed"],
    default: "pending",
    index: true,
  },
  attempts: { type: Number, default: 0, min: 0 },
  nextAttemptAt: { type: Date, default: Date.now, index: true },
  lockedAt: Date,
  sentAt: Date,
  providerMessageId: String,
  lastError: { type: String, maxlength: 1000 },
}, { timestamps: true });

emailDeliverySchema.index({ status: 1, nextAttemptAt: 1 });

const EmailDelivery = model<IEmailDelivery>("EmailDelivery", emailDeliverySchema);

export { EmailDelivery };
