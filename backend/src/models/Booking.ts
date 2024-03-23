import { Schema, model, Types } from "mongoose";

interface IBooking {
    owner: Types.ObjectId;
    place: Types.ObjectId;
    checkIn: Date;
    checkOut: Date;
    numOfGuests: {
        adults: number;
        children: number;
        infants: number;
        pets: number;
    }
    status: string;
    extraInfo: string;
    name: string;
    price: number;
}

const bookingSchema = new Schema<IBooking>({
    owner: { type: Schema.Types.ObjectId, ref: "User", required: true },
    place: { type: Schema.Types.ObjectId, ref: "Place", required: true },
    checkIn: { type: Date, required: true },
    checkOut: { type: Date, required: true },
    numOfGuests: {
        adults: { type: Number, required: true },
        children: { type: Number, default: 0 },
        infants: { type: Number, default: 0 },
        pets: { type: Number, default: 0 },
    },
    status: {
        type: String,
        enum: ["pending", "confirmed", "cancelled"],
        default: "pending",
    },
    extraInfo: { type: String },
    name: { type: String, required: true },
    price: { type: Number, required: true },
}, {
    timestamps: true,
});

const Booking = model<IBooking>("Booking", bookingSchema);

export { Booking, IBooking }
