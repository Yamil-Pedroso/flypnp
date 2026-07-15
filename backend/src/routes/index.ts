import { unlink } from "fs/promises";
import { Router } from "express";
import { v2 as cloudinary } from "cloudinary";
import multer from "multer";
import user from "./userRoutes";
import place from "./placeRoutes";
import booking from "./bookingRoutes";
import notification from "./notificationRoutes";
import wishlist from "./wishlistRoutes";
import payment from "./paymentRoutes";
import { isLoggedIn } from "../middlewares/user";
import asyncHandler from "../utils/asyncHandler";
import CustomError from "../utils/customError";

const router = Router();

const upload = multer({
  dest: "/tmp",
  limits: { files: 10, fileSize: 8 * 1024 * 1024 },
  fileFilter: (_req, file, callback) => {
    callback(null, file.mimetype.startsWith("image/"));
  },
});

const isSafeRemoteUrl = (value: unknown) => {
  try {
    const url = new URL(String(value));
    if (!['http:', 'https:'].includes(url.protocol)) return false;
    const hostname = url.hostname.toLowerCase();
    return !(
      hostname === 'localhost' ||
      hostname === '::1' ||
      hostname.endsWith('.local') ||
      /^127\./.test(hostname) ||
      /^10\./.test(hostname) ||
      /^192\.168\./.test(hostname) ||
      /^169\.254\./.test(hostname) ||
      /^172\.(1[6-9]|2\d|3[01])\./.test(hostname)
    );
  } catch {
    return false;
  }
};

router.get('/', (_req, res) => {
  res.json({ success: true, service: 'flypnp-api-v1' });
});

router.post(
  '/upload-from-link',
  isLoggedIn,
  asyncHandler(async (req, res) => {
    if (!isSafeRemoteUrl(req.body.imageUrl)) {
      throw new CustomError('A valid public image URL is required', 400);
    }
    const result = await cloudinary.uploader.upload(String(req.body.imageUrl), {
      folder: 'Flypnp/Places',
      resource_type: 'image',
    });
    res.status(201).json({ success: true, url: result.secure_url });
  })
);

router.post(
  '/upload',
  isLoggedIn,
  upload.array('images', 10),
  asyncHandler(async (req, res) => {
    const files = (req.files as Express.Multer.File[] | undefined) ?? [];
    if (files.length === 0) throw new CustomError('At least one image is required', 400);

    try {
      const images = await Promise.all(
        files.map(async (file) => {
          const result = await cloudinary.uploader.upload(file.path, {
            folder: 'Flypnp/Places',
            resource_type: 'image',
          });
          return result.secure_url;
        })
      );
      res.status(201).json({ success: true, images });
    } finally {
      await Promise.all(files.map((file) => unlink(file.path).catch(() => undefined)));
    }
  })
);

router.use('/', user);
router.use('/', place);
router.use('/', booking);
router.use('/', notification);
router.use('/', wishlist);
router.use('/', payment);

export default router;
