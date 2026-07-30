import type { Request, Response } from "express";
import type { HydratedDocument } from "mongoose";
import { stripe } from "../config/stripe";
import { GiftCard, type IGiftCard } from "../models/GiftCard";
import { Wallet } from "../models/Wallet";
import { WalletTransaction } from "../models/WalletTransaction";
import {
  activateGiftCard,
  createGiftCardCode,
  decryptGiftCardCode,
  encryptGiftCardCode,
  hashGiftCardCode,
  redeemGiftCard,
} from "../services/giftCardService";
import CustomError from "../utils/customError";

const getCustomerId = async (req: Request) => {
  if (req.user!.stripeCustomerId) return req.user!.stripeCustomerId;
  const customer = await stripe.customers.create({
    email: req.user!.email,
    name: req.user!.name,
    metadata: { userId: req.user!.id },
  });
  req.user!.stripeCustomerId = customer.id;
  await req.user!.save();
  return customer.id;
};

const giftCardView = (card: HydratedDocument<IGiftCard>) => ({
  _id: card.id,
  recipientName: card.recipientName,
  recipientEmail: card.recipientEmail,
  message: card.message,
  amount: card.amount,
  currency: card.currency,
  status: card.status,
  codeLast4: card.codeLast4,
  activatedAt: card.activatedAt,
  redeemedAt: card.redeemedAt,
  createdAt: card.get("createdAt"),
});

export const createGiftCardPurchase = async (req: Request, res: Response) => {
  const amountFrancs = Number(req.body.amount);
  const amount = Math.round(amountFrancs * 100);
  const recipientName = String(req.body.recipientName ?? "").trim();
  const recipientEmail = String(req.body.recipientEmail ?? "").trim().toLowerCase();
  const message = String(req.body.message ?? "").trim();
  if (!Number.isFinite(amountFrancs) || amount < 2500 || amount > 200000) {
    throw new CustomError("Gift card amount must be between 25 and 2,000 CHF", 400);
  }
  if (!recipientName || recipientName.length > 120) {
    throw new CustomError("A valid recipient name is required", 400);
  }
  if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(recipientEmail)) {
    throw new CustomError("A valid recipient email is required", 400);
  }
  if (message.length > 500) throw new CustomError("The message is too long", 400);

  const code = createGiftCardCode();
  const customerId = await getCustomerId(req);
  const purchaseKey = String(req.body.purchaseKey ?? "").trim();
  if (!/^[a-zA-Z0-9_-]{12,80}$/.test(purchaseKey)) {
    throw new CustomError("A valid purchase key is required", 400);
  }
  const existing = await GiftCard.findOne({
    purchaser: req.user!._id,
    purchaseKey,
  });
  if (existing) {
    const intent = await stripe.paymentIntents.retrieve(existing.stripePaymentIntentId);
    return res.status(200).json({
      success: true,
      data: giftCardView(existing),
      clientSecret: intent.client_secret,
      alreadyPaid: intent.status === "succeeded",
    });
  }

  const intent = await stripe.paymentIntents.create({
    amount,
    currency: "chf",
    customer: customerId,
    automatic_payment_methods: { enabled: true },
    metadata: {
      kind: "gift_card",
      purchaserId: req.user!.id,
      purchaseKey,
    },
  }, { idempotencyKey: `flypnp-gift-card-${req.user!.id}-${purchaseKey}` });

  const card = await GiftCard.create({
    purchaser: req.user!._id,
    recipientName,
    recipientEmail,
    message: message || undefined,
    amount,
    currency: "chf",
    stripePaymentIntentId: intent.id,
    purchaseKey,
    codeHash: hashGiftCardCode(code),
    codeEncrypted: encryptGiftCardCode(code),
    codeLast4: code.slice(-4),
  });
  res.status(201).json({
    success: true,
    data: giftCardView(card),
    clientSecret: intent.client_secret,
    alreadyPaid: false,
  });
};

export const confirmGiftCardPurchase = async (req: Request, res: Response) => {
  const card = await GiftCard.findOne({
    _id: req.params.id,
    purchaser: req.user!._id,
  }).select("+codeEncrypted");
  if (!card) throw new CustomError("Gift card purchase not found", 404);
  const intent = await stripe.paymentIntents.retrieve(card.stripePaymentIntentId);
  if (intent.status !== "succeeded") {
    throw new CustomError("Stripe has not confirmed this gift card payment", 409);
  }
  const activeCard = await activateGiftCard(intent);
  if (!activeCard) throw new CustomError("Gift card could not be activated", 409);
  res.json({
    success: true,
    data: giftCardView(activeCard),
    code: decryptGiftCardCode(card.codeEncrypted),
  });
};

export const getGiftCardSummary = async (req: Request, res: Response) => {
  const [wallet, transactions, purchases] = await Promise.all([
    Wallet.findOne({ user: req.user!._id }),
    WalletTransaction.find({ user: req.user!._id }).sort({ createdAt: -1 }).limit(30),
    GiftCard.find({ purchaser: req.user!._id }).sort({ createdAt: -1 }).limit(20),
  ]);
  res.json({
    success: true,
    data: {
      balance: wallet?.balance ?? 0,
      currency: "chf",
      transactions,
      purchases: purchases.map(giftCardView),
    },
  });
};

export const redeemGiftCardCode = async (req: Request, res: Response) => {
  const code = String(req.body.code ?? "");
  if (code.replace(/[^a-zA-Z0-9]/g, "").length < 12) {
    throw new CustomError("Enter a valid gift card code", 400);
  }
  const { card, wallet } = await redeemGiftCard(req.user!.id, code);
  res.json({
    success: true,
    data: {
      balance: wallet.balance,
      amount: card.amount,
      currency: wallet.currency,
    },
  });
};
