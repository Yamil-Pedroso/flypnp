import { Request, Response, NextFunction } from 'express';
import { WishList } from '../models/WishList';

interface AuthenticatedRequest extends Request {
    user?: any;
}

// Add a new place to the wishlist
export const addPlaceToWishlist = async (req: AuthenticatedRequest, res: Response, next: NextFunction) => {
    try {
        const userData = req.user;
        const { placeId, title } = req.body;

        if (!req.user) {
            return res.status(401).json({ message: "User not authenticated" });
        }

        const wishlist = await WishList.create({
            owner: userData.id,
            place: placeId,
            title,
        });

        res.status(201).json({ success: true, data: wishlist });
    } catch (error: any) {
        console.error(error);
        res.status(500).json({
            message: 'Internal server error',
            error: error.message,
        });
    }
}

// Return to the user all the places that he has added to his wishlist
export const getUserWishlist = async (req: AuthenticatedRequest, res: Response, next: NextFunction) => {
    try {
        const userData = req.user;
        const { id } = userData;
        const wishlist = await WishList.find({ owner: id });

        res.status(200).json({ success: true, data: wishlist });
    } catch (error: any) {
        res.status(500).json({
            message: 'Internal server error',
            error: error.message,
          })
    }
}

// Remove a place from the wishlist
export const removePlaceFromWishlist = async (req: AuthenticatedRequest, res: Response, next: NextFunction) => {
    try {
        const { placeId } = req.params;
        const userId = req.user.id;

        const deletedWishList = await WishList.findOneAndDelete({
            owner: userId,
            place: placeId
        });

        if (deletedWishList) {
            res.status(200).json({ success: true, message: "Place removed from wishlist successfully", data: deletedWishList });
        } else {
            res.status(404).json({ success: false, message: "Wishlist item not found" });
        }
    } catch (error: any) {
        res.status(500).json({
            message: 'Internal server error',
            error: error.message,
        });
    }
};
