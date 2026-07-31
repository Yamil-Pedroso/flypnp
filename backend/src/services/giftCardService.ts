import {
  createCipheriv,
  createDecipheriv,
  createHash,
  randomBytes,
} from "crypto";
import type Stripe from "stripe";
import { GiftCard } from "../models/GiftCard";
import { User } from "../models/User";
import { Wallet } from "../models/Wallet";
import { WalletTransaction } from "../models/WalletTransaction";
import { notifyUser, queueTransactionalEmail } from "./notificationService";
import CustomError from "../utils/customError";
import { requireEnv } from "../config/env";

const encryptionKey = () =>
  createHash("sha256").update(requireEnv("JWT_SECRET")).digest();
const normalizeCode = (value: string) =>
  value.toUpperCase().replace(/[^A-Z0-9]/g, "");

export const hashGiftCardCode = (value: string) =>
  createHash("sha256").update(normalizeCode(value)).digest("hex");

export const createGiftCardCode = () => {
  const raw = randomBytes(10).toString("hex").toUpperCase();
  return `FLY-${raw.slice(0, 5)}-${raw.slice(5, 10)}-${raw.slice(10, 15)}-${raw.slice(15)}`;
};

export const encryptGiftCardCode = (code: string) => {
  const iv = randomBytes(12);
  const cipher = createCipheriv("aes-256-gcm", encryptionKey(), iv);
  const encrypted = Buffer.concat([
    cipher.update(code, "utf8"),
    cipher.final(),
  ]);
  return [iv, cipher.getAuthTag(), encrypted]
    .map((part) => part.toString("base64url"))
    .join(".");
};

export const decryptGiftCardCode = (value: string) => {
  const [iv, tag, encrypted] = value
    .split(".")
    .map((part) => Buffer.from(part, "base64url"));
  const decipher = createDecipheriv("aes-256-gcm", encryptionKey(), iv);
  decipher.setAuthTag(tag);
  return Buffer.concat([decipher.update(encrypted), decipher.final()]).toString(
    "utf8",
  );
};

export const activateGiftCard = async (intent: Stripe.PaymentIntent) => {
  const card = await GiftCard.findOneAndUpdate(
    { stripePaymentIntentId: intent.id, status: "pending" },
    { status: "active", activatedAt: new Date() },
    { returnDocument: "after" },
  ).select("+codeEncrypted");
  if (!card) return GiftCard.findOne({ stripePaymentIntentId: intent.id });

  const code = decryptGiftCardCode(card.codeEncrypted);
  const recipient = await User.findOne({ email: card.recipientEmail }).select(
    "_id",
  );
  const recipientId = recipient?._id.toString();
  const purchaserId = card.purchaser.toString();
  const message = `${card.recipientName}, your ${Math.round(card.amount / 100)} CHF gift card is ready. Code: ${code}`;

  if (recipientId) {
    await notifyUser({
      userId: recipientId,
      type: "general",
      title: "Your Flypnp gift card is ready",
      message,
      actionUrl: "/gift-cards",
      dedupeKey: `gift-card-active:${card.id}:${recipientId}`,
      emailSubject: "Your Flypnp gift card",
      emailText: `${message}${card.message ? ` Message: ${card.message}` : ""}`,
    });
  } else {
    await queueTransactionalEmail({
      recipient: card.recipientEmail,
      recipientName: card.recipientName,
      subject: "Your Flypnp gift card",
      title: "Your Flypnp gift card is ready",
      message: `${message}${card.message ? ` Message: ${card.message}` : ""}`,
      actionPath: "/gift-cards",
      dedupeKey: `gift-card-external:${card.id}`,
    });
  }
  if (recipientId !== purchaserId) {
    await notifyUser({
      userId: purchaserId,
      type: "general",
      title: "Gift card delivered",
      message: `Your ${Math.round(card.amount / 100)} CHF gift card for ${card.recipientName} is active.`,
      actionUrl: "/gift-cards",
      dedupeKey: `gift-card-purchaser:${card.id}`,
      emailSubject: "Your Flypnp gift card was delivered",
      emailText: `The gift card for ${card.recipientName} is active and ready to redeem.`,
    });
  }
  return card;
};

export const cancelGiftCard = (intentId: string) =>
  GiftCard.findOneAndUpdate(
    { stripePaymentIntentId: intentId, status: "pending" },
    { status: "cancelled" },
    { returnDocument: "after" },
  );

export const redeemGiftCard = async (userId: string, code: string) => {
  const codeHash = hashGiftCardCode(code);
  const card = await GiftCard.findOneAndUpdate(
    { codeHash, status: "active", redeemedBy: { $exists: false } },
    { status: "redeemed", redeemedBy: userId, redeemedAt: new Date() },
    { returnDocument: "after" },
  );
  if (!card)
    throw new CustomError(
      "This gift card is invalid or has already been redeemed",
      409,
    );

  const adjustmentKey = `gift-card-redemption:${card.id}`;
  try {
    const wallet = await Wallet.findOneAndUpdate(
      { user: userId, appliedKeys: { $ne: adjustmentKey } },
      {
        $inc: { balance: card.amount },
        $push: { appliedKeys: adjustmentKey },
        $setOnInsert: { currency: "chf" },
      },
      { returnDocument: "after", upsert: true },
    );
    await WalletTransaction.create({
      user: userId,
      type: "gift_card_redemption",
      amount: card.amount,
      currency: "chf",
      giftCard: card._id,
      description: `Gift card •••• ${card.codeLast4} redeemed`,
      idempotencyKey: adjustmentKey,
    });
    return { card, wallet };
  } catch (cause) {
    if ((cause as Error & { code?: number }).code === 11000) {
      const wallet = await Wallet.findOne({ user: userId });
      if (wallet) return { card, wallet };
    }
    await Wallet.updateOne(
      {
        user: userId,
        appliedKeys: adjustmentKey,
        $nor: [{ appliedKeys: `${adjustmentKey}:rollback` }],
      },
      {
        $inc: { balance: -card.amount },
        $push: { appliedKeys: `${adjustmentKey}:rollback` },
      },
    );
    await GiftCard.updateOne(
      { _id: card._id, redeemedBy: userId },
      { $set: { status: "active" }, $unset: { redeemedBy: 1, redeemedAt: 1 } },
    );
    throw cause;
  }
};
