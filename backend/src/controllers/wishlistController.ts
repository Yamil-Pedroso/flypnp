import type { Request, Response } from "express";
import { Place } from "../models/Place";
import { Experience } from "../models/Experience";
import { WishList } from "../models/WishList";
import CustomError from "../utils/customError";

export const addPlaceToWishlist = async (req: Request, res: Response) => {
  const experienceId = req.body.experienceId ? String(req.body.experienceId) : "";
  const placeId = req.body.placeId ? String(req.body.placeId) : "";
  if ((!placeId && !experienceId) || (placeId && experienceId)) {
    throw new CustomError("Provide either a place or an experience", 400);
  }

  const item = experienceId
    ? await Experience.findById(experienceId)
    : await Place.findById(placeId);
  if (!item) throw new CustomError(experienceId ? "Experience not found" : "Place not found", 404);

  const itemType = experienceId ? "experience" : "place";
  const itemKey = itemType === "experience" ? "experience" : "place";
  const picture = itemType === "experience"
    ? ("images" in item ? item.images[0] ?? "" : "")
    : ("photos" in item ? item.photos[0]?.main ?? "" : "");
  const category = itemType === "place" && "category" in item ? item.category : undefined;

  const wishlist = await WishList.findOneAndUpdate(
    { owner: req.user!._id, [itemKey]: item._id },
    {
      owner: req.user!._id,
      [itemKey]: item._id,
      itemType,
      ...(category ? { category } : {}),
      title: item.title,
      picture,
    },
    { new: true, upsert: true, runValidators: true },
  );
  res.status(201).json({ success: true, data: wishlist });
};

export const getUserWishlist = async (req: Request, res: Response) => {
  const wishlist = await WishList.find({ owner: req.user!._id }).lean();
  const placesMissingCategory = wishlist
    .filter((item) => item.itemType === "place" && item.place && !item.category)
    .map((item) => item.place!);
  const places = placesMissingCategory.length
    ? await Place.find({ _id: { $in: placesMissingCategory } }).select("category").lean()
    : [];
  const categories = new Map(places.map((place) => [String(place._id), place.category]));
  const data = wishlist.map((item) => item.category || !item.place
    ? item
    : { ...item, category: categories.get(String(item.place)) });
  res.status(200).json({ success: true, data });
};

export const removePlaceFromWishlist = async (req: Request, res: Response) => {
  const itemType = req.query.itemType === "experience" ? "experience" : "place";
  const deleted = await WishList.findOneAndDelete({
    owner: req.user!._id,
    [itemType]: req.params.placeId,
  });
  if (!deleted) throw new CustomError("Wishlist item not found", 404);
  res.status(200).json({ success: true, data: deleted });
};
