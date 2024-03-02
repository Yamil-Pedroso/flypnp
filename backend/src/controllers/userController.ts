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
    console.log(req.body);
    console.log(req.file);
    try {
        const { name, email, password } = req.body;

        if (!name || !email || !password) {
            throw new customError('Please fill in all fields', 400);
        }

        let user = await User.findOne({ email });

        if (user) {
            throw new customError('User already exists', 400);
        }

        let myAvatar = 'https://res.cloudinary.com/ddgf7ijdc/image/upload/v1706787809/yami_lil00v.jpg';
        if (req.file) {

            const result = await cloudinary.uploader.upload(req.file.path, {
                folder: 'userAvatars/Avatars',
            });
            myAvatar = result.secure_url;
        }


        user = new User ({
            name,
            email,
            password,
            avatar: myAvatar,
        });

        user = await User.create(user);

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
    const { path } = req.file as any
  try {
    let result = await cloudinary.uploader.upload(path, {
      folder: 'userAvatart/Avatars',
    });
    res.status(200).json(result.secure_url)
  } catch (error) {
    res.status(500).json({
      error,
      message: 'Internal server error',
    });
  }
};

// Update user
export const updateUser = async (req: Request, res: Response, next: NextFunction) => {
    try {
        const user = await User.findById(req.params.id);

        if (!user) {
            throw new customError('User not found', 404);
        }

        if (req.file) {
            const avatarUrl = await cloudinary.uploader.upload(req.file.path, {
                folder: 'userAvatars/Avatars',
            }).then((result) => result.secure_url);

            user.avatar = avatarUrl;
        }

        if (req.body.name) user.name = req.body.name;
        if (req.body.password) {
            const salt = await bcrypt.genSalt(10);
            user.password = await bcrypt.hash(req.body.password, salt);
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

// Delete user
export const deleteUser = async (req: Request, res: Response, next: NextFunction) => {
    try {
        const userId = req.params.id; // Asume que el ID del usuario se pasa como parámetro de URL

        // Busca y elimina el usuario
        const deletedUser = await User.findByIdAndDelete(userId);

        // Si no se encuentra el usuario, devuelve un error 404
        if (!deletedUser) {
            return res.status(404).json({ success: false, message: "User not found" });
        }

        // Responde con éxito
        res.status(200).json({ success: true, message: "User deleted successfully" });
    } catch (error: any) {
        console.error(error);
        next(new customError(error.message, 500));
    }
};
