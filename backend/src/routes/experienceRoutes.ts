import { Router } from "express";
import { isLoggedIn } from "../middlewares/user";
import asyncHandler from "../utils/asyncHandler";
import {
  createExperienceBooking,
  deleteExperienceBooking,
  getExperience,
  getExperienceBooking,
  getExperiences,
  getUserExperienceBookings,
} from "../controllers/experienceController";

const router = Router();

router.get("/experiences", asyncHandler(getExperiences));
router.get("/experiences/:idOrSlug", asyncHandler(getExperience));
router.post("/experience-bookings", isLoggedIn, asyncHandler(createExperienceBooking));
router.get("/experience-bookings", isLoggedIn, asyncHandler(getUserExperienceBookings));
router.get("/experience-bookings/:id", isLoggedIn, asyncHandler(getExperienceBooking));
router.delete("/experience-bookings/:id", isLoggedIn, asyncHandler(deleteExperienceBooking));

export default router;
