import { Schema, model, Types } from "mongoose";

interface Photo {
    main: string;
    thumbnails: string[];
}
interface IPlace {
    title: string;
    address: string;
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
    title: { type: String, required: true },
    address: { type: String, required: true },
    photos: { type: [photoSchema], required: true },
    category: { type: String, required: true, enum: ['trending', 'beachFront', 'iconicCities'] },
    description: { type: String, required: true },
    perks: { type: [String], required: true },
    extraInfo: { type: String, required: true },
    maxGuests: { type: Number, required: true },
    rating: { type: Number, required: true },
    reviews: { type: Number, required: true },
    price: { type: Number, required: true },
}, {
    timestamps: true,
});

const Place = model<IPlace>("Place", placeSchema);

export { Place, IPlace }
