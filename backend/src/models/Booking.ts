import { Schema, model, Types } from "mongoose";

interface IBooking {
    user: Types.ObjectId;
    place: Types.ObjectId;
    checkIn: Date;
    checkOut: Date;
    numOfGuests: number;
    name: string;
    phone: string;
    price: number;
}

const bookingSchema = new Schema<IBooking>({
    user: { type: Schema.Types.ObjectId, ref: "User", required: true },
    place: { type: Schema.Types.ObjectId, ref: "Place", required: true },
    checkIn: { type: Date, required: true },
    checkOut: { type: Date, required: true },
    numOfGuests: { type: Number, required: true },
    name: { type: String, required: true },
    phone: { type: String, required: true },
    price: { type: Number, required: true },
}, {
    timestamps: true,
});

const Booking = model<IBooking>("Booking", bookingSchema);

export { Booking, IBooking }
