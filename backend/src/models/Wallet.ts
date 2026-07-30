import { Schema, model, Types } from "mongoose";

export interface IWallet {
  user: Types.ObjectId;
  balance: number;
  currency: "chf";
  appliedKeys: string[];
}

const walletSchema = new Schema<IWallet>({
  user: { type: Schema.Types.ObjectId, ref: "User", required: true, unique: true },
  balance: { type: Number, min: 0, default: 0, required: true },
  currency: { type: String, enum: ["chf"], default: "chf" },
  appliedKeys: { type: [String], default: [], select: false },
}, { timestamps: true });

export const Wallet = model<IWallet>("Wallet", walletSchema);
