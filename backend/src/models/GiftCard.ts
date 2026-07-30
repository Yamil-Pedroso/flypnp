import { Schema, model, Types } from "mongoose";

export type GiftCardStatus = "pending" | "active" | "redeemed" | "cancelled";

export interface IGiftCard {
  purchaser: Types.ObjectId;
  recipientName: string;
  recipientEmail: string;
  message?: string;
  amount: number;
  currency: "chf";
  status: GiftCardStatus;
  stripePaymentIntentId: string;
  purchaseKey: string;
  codeHash: string;
  codeEncrypted: string;
  codeLast4: string;
  redeemedBy?: Types.ObjectId;
  activatedAt?: Date;
  redeemedAt?: Date;
}

const giftCardSchema = new Schema<IGiftCard>({
  purchaser: { type: Schema.Types.ObjectId, ref: "User", required: true, index: true },
  recipientName: { type: String, trim: true, maxlength: 120, required: true },
  recipientEmail: { type: String, trim: true, lowercase: true, maxlength: 160, required: true },
  message: { type: String, trim: true, maxlength: 500 },
  amount: { type: Number, min: 2500, max: 200000, required: true },
  currency: { type: String, enum: ["chf"], default: "chf" },
  status: {
    type: String,
    enum: ["pending", "active", "redeemed", "cancelled"],
    default: "pending",
    index: true,
  },
  stripePaymentIntentId: { type: String, required: true, unique: true },
  purchaseKey: { type: String, required: true },
  codeHash: { type: String, required: true, unique: true, select: false },
  codeEncrypted: { type: String, required: true, select: false },
  codeLast4: { type: String, required: true },
  redeemedBy: { type: Schema.Types.ObjectId, ref: "User" },
  activatedAt: Date,
  redeemedAt: Date,
}, { timestamps: true });

giftCardSchema.index({ recipientEmail: 1, status: 1 });
giftCardSchema.index({ purchaser: 1, purchaseKey: 1 }, { unique: true });

export const GiftCard = model<IGiftCard>("GiftCard", giftCardSchema);
