import { Schema, model, Types } from "mongoose";

export type WalletTransactionType = "gift_card_redemption" | "booking_payment" | "payment_refund";

export interface IWalletTransaction {
  user: Types.ObjectId;
  type: WalletTransactionType;
  amount: number;
  currency: "chf";
  giftCard?: Types.ObjectId;
  payment?: Types.ObjectId;
  description: string;
  idempotencyKey: string;
}

const walletTransactionSchema = new Schema<IWalletTransaction>({
  user: { type: Schema.Types.ObjectId, ref: "User", required: true, index: true },
  type: {
    type: String,
    enum: ["gift_card_redemption", "booking_payment", "payment_refund"],
    required: true,
  },
  amount: { type: Number, required: true },
  currency: { type: String, enum: ["chf"], default: "chf" },
  giftCard: { type: Schema.Types.ObjectId, ref: "GiftCard" },
  payment: { type: Schema.Types.ObjectId, ref: "Payment" },
  description: { type: String, trim: true, maxlength: 240, required: true },
  idempotencyKey: { type: String, required: true, unique: true },
}, { timestamps: true });

walletTransactionSchema.index({ user: 1, createdAt: -1 });

export const WalletTransaction = model<IWalletTransaction>("WalletTransaction", walletTransactionSchema);
