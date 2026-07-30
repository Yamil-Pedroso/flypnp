import { Router } from "express";
import {
  confirmGiftCardPurchase,
  createGiftCardPurchase,
  getGiftCardSummary,
  redeemGiftCardCode,
} from "../controllers/giftCardController";
import { isLoggedIn } from "../middlewares/user";
import { rateLimit } from "../middlewares/rateLimit";
import asyncHandler from "../utils/asyncHandler";

const router = Router();

router.get("/gift-cards", isLoggedIn, asyncHandler(getGiftCardSummary));
router.post(
  "/gift-cards/purchase",
  isLoggedIn,
  rateLimit({ scope: "gift-card:purchase", windowMs: 60 * 60_000, max: 20 }),
  asyncHandler(createGiftCardPurchase),
);
router.post("/gift-cards/:id/confirm", isLoggedIn, asyncHandler(confirmGiftCardPurchase));
router.post(
  "/gift-cards/redeem",
  isLoggedIn,
  rateLimit({ scope: "gift-card:redeem", windowMs: 15 * 60_000, max: 10 }),
  asyncHandler(redeemGiftCardCode),
);

export default router;
