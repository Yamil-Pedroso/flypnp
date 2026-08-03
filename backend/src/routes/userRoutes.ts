import { Router } from "express";
import multer from "multer";
import { isLoggedIn } from "../middlewares/user";
import isAdmin from "../middlewares/admin";
import asyncHandler from "../utils/asyncHandler";
import { rateLimit } from "../middlewares/rateLimit";

const router = Router();

// Multer config
const upload = multer({
  dest: "/tmp",
  limits: { fileSize: 5 * 1024 * 1024, files: 1 },
  fileFilter: (_req, file, callback) => {
    callback(null, file.mimetype.startsWith("image/"));
  },
});

import {
  registerUser,
  loginUser,
  loginDemoUser,
  logoutUser,
  getUsers,
  deleteUser,
  googleLogin,
  uploadAvatar,
  updateUser,
} from "../controllers/userController";

router.post("/register", upload.single("avatar"), asyncHandler(registerUser));
router.post("/login", asyncHandler(loginUser));
router.post(
  "/demo-login",
  rateLimit({ scope: "auth:demo", windowMs: 15 * 60_000, max: 30 }),
  asyncHandler(loginDemoUser),
);
router.post("/google-login", asyncHandler(googleLogin));
router.post("/upload-avatar", isLoggedIn, upload.single("avatar"), asyncHandler(uploadAvatar));
router.get("/logout", asyncHandler(logoutUser));
router.get("/users", isLoggedIn, isAdmin, asyncHandler(getUsers));
router.put("/update/:id", isLoggedIn, upload.single("avatar"), asyncHandler(updateUser));
router.delete("/delete/:id", isLoggedIn, asyncHandler(deleteUser));

export default router;
