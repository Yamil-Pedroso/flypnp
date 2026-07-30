import { Router } from "express";
import { isLoggedIn } from "../middlewares/user";
import isAdmin from "../middlewares/admin";
import { rateLimit } from "../middlewares/rateLimit";
import asyncHandler from "../utils/asyncHandler";
import {
  cancelServiceRequest,
  createServiceRequest,
  getAllServiceRequests,
  getUserServiceRequests,
  quoteServiceRequest,
} from "../controllers/serviceController";

const router = Router();

router.post(
  "/service-requests",
  isLoggedIn,
  rateLimit({ scope: "service-request:create", windowMs: 60 * 60_000, max: 10 }),
  asyncHandler(createServiceRequest),
);
router.get("/service-requests", isLoggedIn, asyncHandler(getUserServiceRequests));
router.delete("/service-requests/:id", isLoggedIn, asyncHandler(cancelServiceRequest));
router.get("/admin/service-requests", isLoggedIn, isAdmin, asyncHandler(getAllServiceRequests));
router.patch(
  "/admin/service-requests/:id/quote",
  isLoggedIn,
  isAdmin,
  rateLimit({ scope: "service-request:quote", windowMs: 60 * 60_000, max: 100 }),
  asyncHandler(quoteServiceRequest),
);

export default router;
