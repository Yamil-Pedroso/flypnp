import { Schema, model, Types } from "mongoose";

interface IPlace {
    owner: Types.ObjectId;
    title: string;
    address: string;
    photos: string[];
    description: string;
    perks: string[];
    extraInfo: string;
    maxGuests: number;
    price: number;
}

const placeSchema = new Schema<IPlace>({
    owner: { type: Schema.Types.ObjectId, ref: "user", required: true },
    title: { type: String, required: true },
    address: { type: String, required: true },
    photos: { type: [String], required: true },
    description: { type: String, required: true },
    perks: { type: [String], required: true },
    extraInfo: { type: String, required: true },
    maxGuests: { type: Number, required: true },
    price: { type: Number, required: true },
}, {
    timestamps: true,
});

const Place = model<IPlace>("Place", placeSchema);

export { Place, IPlace }
