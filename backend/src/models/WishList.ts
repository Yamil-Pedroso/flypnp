import { Schema, model, Types } from "mongoose";

interface IWishList {
    owner: Types.ObjectId;
    place?: Types.ObjectId;
    experience?: Types.ObjectId;
    itemType: "place" | "experience";
    category?: string;
    title: string;
    picture: string;
}

const wishListSchema = new Schema<IWishList>({
    owner: { type: Schema.Types.ObjectId, ref: "User", required: true },
    place: { type: Schema.Types.ObjectId, ref: "Place" },
    experience: { type: Schema.Types.ObjectId, ref: "Experience" },
    itemType: { type: String, enum: ["place", "experience"], default: "place", required: true },
    category: { type: String },
    title: { type: String, required: true },
    picture: { type: String, required: true },
}, {
    timestamps: true,
});

wishListSchema.index(
    { owner: 1, place: 1 },
    { unique: true, partialFilterExpression: { place: { $exists: true } } },
);
wishListSchema.index(
    { owner: 1, experience: 1 },
    { unique: true, partialFilterExpression: { experience: { $exists: true } } },
);

const WishList = model<IWishList>("WishList", wishListSchema);

export { WishList, IWishList }
