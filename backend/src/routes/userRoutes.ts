import express from 'express';
import { Router } from 'express';
import multer from 'multer';

const router = Router();

// Multer config
const storage = multer.memoryStorage();
const upload = multer({ storage: storage });

import {
    registerUser,
    loginUser,
    logoutUser,
    getUsers,
    deleteUser,
    googleLogin,
    uploadAvatar,
    updateUser,
} from '../controllers/userController';

router.post('/register', registerUser);
router.post('/login', loginUser);
router.get('/users', getUsers);
router.get('/logout', logoutUser);
router.post('/google-login', googleLogin);
router.post('/upload-avatar', upload.single('file'), uploadAvatar);
router.put('/update', updateUser);
router.delete('/delete/:id', deleteUser);

export default router;
