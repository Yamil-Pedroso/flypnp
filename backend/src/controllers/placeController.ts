import type { Request, Response } from "express";
import { isValidObjectId } from "mongoose";
import { Place } from "../models/Place";
import { Booking } from "../models/Booking";
import CustomError from "../utils/customError";
import { geocodeAddress } from "../services/geocodingService";

const categories = new Set(["trending", "beachFront", "iconicCities"]);

const parsePlaceInput = (body: Record<string, unknown>, partial = false) => {
  const value = {
    title: body.title === undefined ? undefined : String(body.title).trim(),
    address: body.address === undefined ? undefined : String(body.address).trim(),
    photos: body.photos ?? body.addedPhotos,
    category: body.category === undefined ? undefined : String(body.category),
    description: body.description === undefined ? undefined : String(body.description).trim(),
    perks: body.perks,
    extraInfo: body.extraInfo === undefined ? undefined : String(body.extraInfo).trim(),
    maxGuests: body.maxGuests === undefined ? undefined : Number(body.maxGuests),
    price: body.price === undefined ? undefined : Number(body.price),
  };

  if (!partial) {
    const required = [value.title, value.address, value.description, value.extraInfo];
    if (required.some((field) => !field) || !Array.isArray(value.photos)) {
      throw new CustomError("Missing required place fields", 400);
    }
  }

  if (value.category !== undefined && !categories.has(value.category)) {
    throw new CustomError("Invalid place category", 400);
  }
  if (value.maxGuests !== undefined && (!Number.isInteger(value.maxGuests) || value.maxGuests < 1)) {
    throw new CustomError("maxGuests must be a positive integer", 400);
  }
  if (value.price !== undefined && (!Number.isFinite(value.price) || value.price <= 0)) {
    throw new CustomError("price must be greater than zero", 400);
  }
  if (value.perks !== undefined && !Array.isArray(value.perks)) {
    throw new CustomError("perks must be an array", 400);
  }
  if (value.photos !== undefined && !Array.isArray(value.photos)) {
    throw new CustomError("photos must be an array", 400);
  }

  return Object.fromEntries(Object.entries(value).filter(([, item]) => item !== undefined));
};

const escapeRegex = (value: string) => value.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");

const resolveAddress = async (address: string) => {
  try {
    const result = await geocodeAddress(address);
    if (!result) throw new CustomError("We could not locate this address. Add a street, city and country.", 422);
    return {
      country: result.country,
      countryCode: result.countryCode,
      latitude: result.latitude,
      longitude: result.longitude,
      geocodedAddress: result.formattedAddress,
      geocodedAt: new Date(),
      location: { type: "Point" as const, coordinates: [result.longitude, result.latitude] },
    };
  } catch (error) {
    if (error instanceof CustomError) throw error;
    throw new CustomError("Address verification is temporarily unavailable. Please try again.", 503);
  }
};

export const geocodePlaceAddress = async (req: Request, res: Response) => {
  const address = String(req.body.address ?? "").trim();
  if (address.length < 5) throw new CustomError("Enter a complete address", 400);
  const coordinates = await resolveAddress(address);
  res.status(200).json({ success: true, data: coordinates });
};

export const addPlace = async (req: Request, res: Response) => {
  const input = parsePlaceInput(req.body);
  const coordinates = await resolveAddress(String(input.address));
  const place = await Place.create({
    ...input,
    ...coordinates,
    owner: req.user!._id,
    rating: 0,
    reviews: 0,
  });
  res.status(201).json({ success: true, data: place });
};

export const getUserPlaces = async (req: Request, res: Response) => {
  const places = await Place.find({ owner: req.user!._id });
  res.status(200).json({ success: true, data: places });
};

export const updatePlace = async (req: Request, res: Response) => {
  const place = await Place.findById(req.params.id);
  if (!place) throw new CustomError("Place not found", 404);
  if (place.owner?.toString() !== req.user!.id && !req.user!.isAdmin) {
    throw new CustomError("You cannot update this place", 403);
  }

  const input = parsePlaceInput(req.body, true);
  const address = typeof input.address === "string" ? input.address : place.address;
  const addressChanged = address !== place.address;
  const missingCoordinates = !Number.isFinite(place.latitude) || !Number.isFinite(place.longitude);
  const coordinates = addressChanged || missingCoordinates ? await resolveAddress(address) : {};
  place.set({ ...input, ...coordinates });
  await place.save();
  res.status(200).json({ success: true, data: place });
};

export const getAllPlaces = async (_req: Request, res: Response) => {
  const places = await Place.find();
  res.status(200).json({ success: true, data: places });
};

export const getSinglePlace = async (req: Request, res: Response) => {
  if (!isValidObjectId(req.params.id)) throw new CustomError("Invalid place id", 400);
  const place = await Place.findById(req.params.id);
  if (!place) throw new CustomError("Place not found", 404);
  res.status(200).json({ success: true, data: place });
};

export const searchPlaces = async (req: Request, res: Response) => {
  const searchWord = String(req.params.key ?? "").trim();
  const places = searchWord
    ? await Place.find({ address: { $regex: escapeRegex(searchWord), $options: "i" } })
    : await Place.find();
  res.status(200).json({ success: true, data: places });
};

export const deletePlace = async (req: Request, res: Response) => {
  const place = await Place.findById(req.params.id);
  if (!place) throw new CustomError("Place not found", 404);
  if (place.owner?.toString() !== req.user!.id && !req.user!.isAdmin) {
    throw new CustomError("You cannot delete this place", 403);
  }
  if (await Booking.exists({ place: place._id })) {
    throw new CustomError("Listings with reservation history cannot be deleted", 409);
  }

  await place.deleteOne();
  res.status(200).json({ success: true, message: "Place deleted successfully" });
};
