import express from 'express';
import { Router } from 'express';
import multer from 'multer';

const router = Router();

// Multer config
const upload = multer({ dest: '/tmp' });
const storage = multer.memoryStorage();

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

router.post('/register', upload.single('avatar'), registerUser);
router.post('/login', loginUser);
router.get('/users', getUsers);
router.get('/logout', logoutUser);
router.post('/google-login', googleLogin);
router.post('/upload-avatar', upload.single('avatar'), uploadAvatar);
router.put('/update/:id', upload.single('avatar'), updateUser);
router.delete('/delete/:id', deleteUser);

export default router;
