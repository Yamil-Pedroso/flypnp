import { Schema, model, Types } from "mongoose";

interface IPayment {
    user: Types.ObjectId;
    name: string;
    booking?: Types.ObjectId;
    experienceBooking?: Types.ObjectId;
    serviceRequest?: Types.ObjectId;
    place?: Types.ObjectId;
    experience?: Types.ObjectId;
    amount: number;
    currency: string;
    status: string;
    stripeId: string;
    paymentMethod: string;
    paymentDate: Date;
}

const paymentSchema = new Schema<IPayment>({
    user: { type: Schema.Types.ObjectId, ref: "User", required: true },
    name: { type: String, required: true },
    booking: { type: Schema.Types.ObjectId, ref: "Booking" },
    experienceBooking: { type: Schema.Types.ObjectId, ref: "ExperienceBooking" },
    serviceRequest: { type: Schema.Types.ObjectId, ref: "ServiceRequest" },
    place: { type: Schema.Types.ObjectId, ref: "Place" },
    experience: { type: Schema.Types.ObjectId, ref: "Experience" },
    amount: { type: Number, required: true },
    currency: { type: String, required: true, default: "chf" },
    status: {
        type: String,
        enum: ["pending", "confirmed", "cancelled", "failed"],
        default: "pending",
    },
    stripeId: { type: String },
    paymentMethod: { type: String },
    paymentDate: { type: Date, required: true },
}, {
    timestamps: true,
});

const Payment = model<IPayment>("Payment", paymentSchema);

export { Payment, IPayment }
