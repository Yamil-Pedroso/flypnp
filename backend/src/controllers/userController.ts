import { Request, Response, NextFunction } from 'express';
import { User, IUser }from '../models/User';
import users from '../data/users';
import cookieToken from '../utils/cookieToken';
import customError from '../utils/customError';
import bcrypt from 'bcryptjs';
import { v2 as cloudinary } from 'cloudinary';
import { UploadedFile } from 'express-fileupload';

// Register user
export const registerUser = async (req: Request, res: Response, next: NextFunction) => {
    try {
        const { name, email, password } = req.body;

        if (!name || !email || !password) {
            throw new customError('Please fill in all fields', 400);
        }

        // Check for existing user
        let user = await User.findOne({ email });

        if (user) {
            throw new customError('User already exists', 400);
        }

        user = new User ({
            name,
            email,
            password,
        });

        user = await User.create(user);

        // After creating the user, we need to send the token to the client
        cookieToken(user, res);

    } catch (error: any) {
        next(new customError(error.message, 500));
    }
};

// Login user
export const loginUser = async (req: Request, res: Response, next: NextFunction) => {
    try {
        const { email, password } = req.body;

        if (!email || !password) {
            throw new customError('Please fill in all fields', 400);
        }

        // Check for existing user
        const user = await User.findOne({ email });

        if (!user) {
            throw new customError('Invalid credentials', 401);
        }

        // Check if password matches
        const isMatch = await (user as IUser).isValidatedPassword(password);

        if (!isMatch) {
            throw new customError('Invalid credentials', 401);
        }

        // After creating the user, we need to send the token to the client
        cookieToken(user, res);

    } catch (error: any) {
        next(new customError(error.message, 500));
    }
};

// Google login
export const googleLogin = async (req: Request, res: Response, next: NextFunction) => {
    try {
        const { name, email } = req.body;

        if (!name || !email) {
            throw new customError('Please fill in all fields', 400);
        }

        // Check for existing user
        let user = await User.findOne({ email });

        if (!user) {
            user = new User ({
                name,
                email,
                password: await bcrypt.hash(Math.random().toString(36).slice(-8), 10),
            });

            user = await User.create(user);
        }

        // After creating the user, we need to send the token to the client
        cookieToken(user, res);

    } catch (error: any) {
        next(new customError(error.message, 500));
    }
};

// Upload user avatar
export const uploadAvatar = async (req: Request, res: Response, next: NextFunction) => {
    try {
        const fileBuffer = req.file?.buffer as any;

        if (!fileBuffer) {
            throw new customError('No file uploaded', 400);
        }

        const result = await cloudinary.uploader.upload(fileBuffer, {
            folder: 'NewAirbnb/Avatars',
        });

        res.status(200).json({ url: result.secure_url });

    } catch (error: any) {
        next(new customError(error.message, 500));
    }
};

// Update user
export const updateUser = async (req: Request, res: Response, next: NextFunction) => {
    try {
        const { name, email, password, avatar } = req.body;
        const user = await User.findById(req.params.id);

        if (!user) {
            throw new customError('User not found', 404);
        }

         user.name = name
         if (avatar && !password) {
            user.avatar = avatar;
         } else if (password && !avatar) {
            user.password = password;
         } else {
            user.avatar = avatar;
            user.password = password;
         }
         const updatedUser = await user.save();
         cookieToken(updatedUser, res);
    } catch (error: any) {
        next(new customError(error.message, 500));
    }
};

// Logout user
export const logoutUser = async (req: Request, res: Response, next: NextFunction) => {
    try {
        res.cookie('token', null, {
            expires: new Date(Date.now() + 10 * 1000),
            httpOnly: true,
            secure: true,
            sameSite: 'none',
        });
        res.status(200).json({ success: true, data: {} });
    } catch (error: any) {
        next(new customError(error.message, 500));
    }
};

// Get all users
export const getUsers = async (req: Request, res: Response) => {
	try {
		const allUsers = await User.find();
        res.json(allUsers);
	} catch (error: any) {
		res.status(500).json({ msg: error.message });
	}
};
