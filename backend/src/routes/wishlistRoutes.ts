import { Router } from 'express';
import { isLoggedIn } from '../middlewares/user';
import asyncHandler from '../utils/asyncHandler';

const router = Router();

import {
    addPlaceToWishlist,
    getUserWishlist,
    removePlaceFromWishlist,
} from '../controllers/wishlistController';

router.post('/add-place', isLoggedIn, asyncHandler(addPlaceToWishlist));
router.get('/user-wishlist', isLoggedIn, asyncHandler(getUserWishlist));
router.delete('/remove-place/:placeId', isLoggedIn, asyncHandler(removePlaceFromWishlist));

export default router;
