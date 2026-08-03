import { Schema, model, Types } from "mongoose";

interface Photo {
    main: string;
    thumbnails: string[];
}
interface IPlace {
    owner?: Types.ObjectId;
    title: string;
    address: string;
    country?: string;
    countryCode?: string;
    latitude?: number;
    longitude?: number;
    geocodedAddress?: string;
    geocodedAt?: Date;
    location?: {
        type: "Point";
        coordinates: [number, number];
    };
    photos: Photo[];
    category: string;
    description: string;
    perks: string[];
    extraInfo: string;
    maxGuests: number;
    rating: number;
    reviews: number;
    price: number;
}

const photoSchema = new Schema<Photo>({
    main: { type: String, required: true },
    thumbnails: { type: [String], required: true },
  });

const placeSchema = new Schema<IPlace>({
    owner: { type: Schema.Types.ObjectId, ref: "User", required: false },
    title: { type: String, required: true },
    address: { type: String, required: true },
    country: { type: String, trim: true },
    countryCode: { type: String, trim: true, uppercase: true },
    latitude: { type: Number, min: -90, max: 90 },
    longitude: { type: Number, min: -180, max: 180 },
    geocodedAddress: { type: String, trim: true },
    geocodedAt: { type: Date },
    location: {
        type: { type: String, enum: ["Point"] },
        coordinates: { type: [Number] },
    },
    photos: { type: [photoSchema], required: true },
    category: { type: String, required: true, enum: ['trending', 'beachFront', 'iconicCities'] },
    description: { type: String, required: true },
    perks: { type: [String], required: true },
    extraInfo: { type: String, required: true },
    maxGuests: { type: Number, required: true },
    rating: { type: Number, min: 0, max: 5, default: 0 },
    reviews: { type: Number, min: 0, default: 0 },
    price: { type: Number, required: true },
}, {
    timestamps: true,
});

placeSchema.index({ location: "2dsphere" }, { sparse: true });

const Place = model<IPlace>("Place", placeSchema);

export { Place, IPlace }
