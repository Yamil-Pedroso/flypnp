import { Router } from 'express';
import { isLoggedIn } from '../middlewares/user';

const router = Router();

import {
    addPlaceToWishlist,
    getUserWishlist,
    removePlaceFromWishlist,
} from '../controllers/wishlistController';

router.post('/add-place', isLoggedIn, addPlaceToWishlist);
router.get('/user-wishlist', isLoggedIn, getUserWishlist);
router.delete('/remove-place/:placeId', isLoggedIn, removePlaceFromWishlist);

export default router;
