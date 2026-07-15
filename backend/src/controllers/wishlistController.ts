import type { Request, Response } from "express";
import { Place } from "../models/Place";
import { WishList } from "../models/WishList";
import CustomError from "../utils/customError";

export const addPlaceToWishlist = async (req: Request, res: Response) => {
  const place = await Place.findById(req.body.placeId);
  if (!place) throw new CustomError("Place not found", 404);

  const wishlist = await WishList.findOneAndUpdate(
    { owner: req.user!._id, place: place._id },
    {
      owner: req.user!._id,
      place: place._id,
      title: place.title,
      picture: place.photos[0]?.main ?? "",
    },
    { new: true, upsert: true, runValidators: true }
  );
  res.status(201).json({ success: true, data: wishlist });
};

export const getUserWishlist = async (req: Request, res: Response) => {
  const wishlist = await WishList.find({ owner: req.user!._id });
  res.status(200).json({ success: true, data: wishlist });
};

export const removePlaceFromWishlist = async (req: Request, res: Response) => {
  const deleted = await WishList.findOneAndDelete({
    owner: req.user!._id,
    place: req.params.placeId,
  });
  if (!deleted) throw new CustomError("Wishlist item not found", 404);
  res.status(200).json({ success: true, data: deleted });
};
