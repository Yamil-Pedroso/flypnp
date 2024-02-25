import { Schema, model, Types } from "mongoose";

interface IWishList {
    owner: Types.ObjectId;
    place: Types.ObjectId;
    title: string;
}

const wishListSchema = new Schema<IWishList>({
    owner: { type: Schema.Types.ObjectId, ref: "User", required: true },
    place: { type: Schema.Types.ObjectId, ref: "Place", required: true },
    title: { type: String, required: true },
}, {
    timestamps: true,
});

const WishList = model<IWishList>("WishList", wishListSchema);

export { WishList, IWishList }
