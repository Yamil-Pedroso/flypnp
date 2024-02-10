import express from 'express';
import { Router } from 'express';
import { isLoggedIn } from '../middlewares/user';

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

router.post('/add-places', isLoggedIn, addPlace);
router.get('/user-places', isLoggedIn, getUserPlaces);
router.put('/update-place/:id', isLoggedIn, updatePlace);
router.delete('/delete-place/:id', isLoggedIn, deletePlace);

// Public routes, not protected by the isLoggedIn middleware
router.get('/all-places', getAllPlaces);
router.get('/single-place/:id', getSinglePlace);
router.get('/search/:key', searchPlaces);

export default router;
