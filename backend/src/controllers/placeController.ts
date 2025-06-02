import { Request, Response, NextFunction } from "express";
import { Place } from "../models/Place";

const place = Place.findById("placeId");
console.log(place);

interface AuthenticatedRequest extends Request {
  user?: any;
}

// Add a new place to the database
export const addPlace = async (
  req: AuthenticatedRequest,
  res: Response,
  next: NextFunction
) => {
  try {
    const userData = req.user;
    const {
      title,
      address,
      photos,
      category,
      description,
      perks,
      extraInfo,
      maxGuests,
      rating,
      reviews,
      price,
    } = req.body;

    const place = await Place.create({
      owner: userData.id,
      title,
      address,
      photos,
      category,
      description,
      perks,
      extraInfo,
      maxGuests,
      rating,
      reviews,
      price,
    });

    res.status(201).json({ success: true, data: place });
  } catch (error: any) {
    console.error(error);
    res.status(500).json({
      message: "Internal server error",
      error: error.message,
    });
  }
};

// Return to the user all the places that he has added
export const getUserPlaces = async (
  req: AuthenticatedRequest,
  res: Response,
  next: NextFunction
) => {
  try {
    const userData = req.user;
    const { id } = userData;
    const places = await Place.find({ owner: id });

    res.status(200).json({ success: true, data: places });
  } catch (error: any) {
    res.status(500).json({
      message: "Internal server error",
      error: error.message,
    });
  }
};

// Update a place
export const updatePlace = async (
  req: AuthenticatedRequest,
  res: Response,
  next: NextFunction
) => {
  try {
    const userData = req.user;
    const userId = userData.id;
    const {
      id,
      title,
      address,
      addedPhotos,
      description,
      perks,
      extraInfo,
      maxGuests,
      rating,
      reviews,
      price,
    } = req.body;

    const place = (await Place.findById(id)) as any;
    if (userId === place?.owner.toString()) {
      place.set({
        title,
        address,
        photos: addedPhotos,
        description,
        perks,
        extraInfo,
        maxGuests,
        rating,
        reviews,
        price,
      });
      await place.save();
      res
        .status(200)
        .json({ success: "Place updated successfully", data: place });
    }
  } catch (error: any) {
    res.status(500).json({
      message: "Internal server error",
      error: error.message,
    });
  }
};

// Return all the places in the database
export const getAllPlaces = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const places = await Place.find();
    res.status(200).json({ success: true, data: places });
  } catch (error: any) {
    res.status(500).json({
      message: "Internal server error",
      error: error.message,
    });
  }
};

// Return a single place by its id
export const getSinglePlace = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const { id } = req.params;
    const place = await Place.findById(id);

    if (!place) {
      res.status(404).json({ success: false, message: "Place not found" });
    }

    res.status(200).json({ success: true, data: place });
  } catch (error: any) {
    res.status(500).json({
      message: "Internal server error",
      error: error.message,
    });
  }
};

// Search places in the database
export const searchPlaces = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const searchWord = req.query.key;

    if (searchWord === "") return res.status(200).json(await Place.find());

    const searchMatch = await Place.find({
      address: { $regex: searchWord, $options: "i" },
    });

    res.status(200).json({ success: true, data: searchMatch });
  } catch (error: any) {
    res.status(500).json({
      message: "Internal server error",
      error: error.message,
    });
  }
};

// Delete a place by its id
export const deletePlace = async (
  req: AuthenticatedRequest,
  res: Response,
  next: NextFunction
) => {
  try {
    const userData = req.user;
    const { id } = req.params;

    const place = await Place.findById(id);

    if (!place) {
      res.status(404).json({ success: false, message: "Place not found" });
    }
  } catch (error: any) {
    res.status(500).json({
      message: "Internal server error",
      error: error.message,
    });
  }
};
