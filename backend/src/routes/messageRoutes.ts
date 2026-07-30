import { Router } from "express";
import {
  createConversation,
  getConversations,
  getMessages,
  markConversationRead,
  sendMessage,
  streamMessageEvents,
  updateTypingStatus,
} from "../controllers/messageController";
import { isLoggedIn } from "../middlewares/user";
import { rateLimit } from "../middlewares/rateLimit";
import asyncHandler from "../utils/asyncHandler";

const router = Router();

router.post("/conversations", isLoggedIn, asyncHandler(createConversation));
router.get("/conversations", isLoggedIn, asyncHandler(getConversations));
router.get(
  "/conversations/:id/messages",
  isLoggedIn,
  asyncHandler(getMessages),
);
router.post(
  "/conversations/:id/messages",
  isLoggedIn,
  rateLimit({ scope: "message:send", windowMs: 60_000, max: 60 }),
  asyncHandler(sendMessage),
);
router.patch(
  "/conversations/:id/read",
  isLoggedIn,
  asyncHandler(markConversationRead),
);
router.post(
  "/conversations/:id/typing",
  isLoggedIn,
  rateLimit({ scope: "message:typing", windowMs: 60_000, max: 120 }),
  asyncHandler(updateTypingStatus),
);
router.get("/messages/events", isLoggedIn, asyncHandler(streamMessageEvents));

export default router;
