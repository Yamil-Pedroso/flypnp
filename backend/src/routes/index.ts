import express, { Router } from 'express';
import { v2 as cloudinary } from 'cloudinary';
import multer from 'multer';
import user from './userRoutes';
import place from './placeRoutes';
import booking from './bookingRoutes';
import notification  from './notificationRoutes';
import wishlist from './wishlistRoutes';

const router = Router();

// Multer config
const storage = multer({
	dest: '/tmp'
});

router.get('/', (req, res) => {
	res.send('Hi, we are the backend of a New Airbnb!');
});

// Upload image using image URL
router.post('/upload-from-link', async (req, res) => {
	try {
		const { imageUrl } = req.body;
		let result = await cloudinary.uploader.upload(imageUrl, {
			folder: 'NewAirbnb/Places'
		});
		res.json({ url: result.secure_url });
	} catch (error) {
		console.log(error);
		res.status(500).send('Server error');
	}
});

// Upload image from local storage
router.post('/upload', storage.array('images', 100), async (req, res) => {
	try {
		if (req.files && Array.isArray(req.files)) {
            let imageArray: string[] = [];

		for (let index = 0; index < req.files.length; index++) {
			let { path } = req.files[index];
			let result = await cloudinary.uploader.upload(path, {
				folder: 'NewAirbnb/Places'
			});
			imageArray.push(result.secure_url);
		}
        res.status(200).json({ images: imageArray });
        }
	} catch (error) {
		console.log(error);
		res.status(500).send('Server error');
	}
});

router.use('/', user);
router.use('/', place);
router.use('/', booking);
router.use('/', notification);
router.use('/', wishlist);

export default router;
