import { Router } from 'express';
import { isLoggedIn } from '../middlewares/user';
import asyncHandler from '../utils/asyncHandler';
import { rateLimit } from '../middlewares/rateLimit';

const router = Router();

import {
    addPlace,
    getUserPlaces,
    updatePlace,
    getAllPlaces,
    getSinglePlace,
    searchPlaces,
    deletePlace,
} from '../controllers/placeController';

router.post(
  '/add-places',
  isLoggedIn,
  rateLimit({ scope: 'host-listing:create', windowMs: 24 * 60 * 60_000, max: 20 }),
  asyncHandler(addPlace),
);
router.get('/user-places', isLoggedIn, asyncHandler(getUserPlaces));
router.put('/update-place/:id', isLoggedIn, asyncHandler(updatePlace));
router.delete('/delete-place/:id', isLoggedIn, asyncHandler(deletePlace));

// Public routes, not protected by the isLoggedIn middleware
router.get('/all-places', asyncHandler(getAllPlaces));
router.get('/single-place/:id', asyncHandler(getSinglePlace));
router.get('/search/:key', asyncHandler(searchPlaces));

export default router;
