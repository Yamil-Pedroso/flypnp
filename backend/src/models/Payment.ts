import { Schema, model, Types } from "mongoose";

interface IPayment {
    user: Types.ObjectId;
    booking: Types.ObjectId;
    amount: number;
    currency: string;
    status: string;
    stripeId: string;
    paymentMethod: string;
    paymentDate: Date;
    clientSecret?: string;
}

const paymentSchema = new Schema<IPayment>({
    user: { type: Schema.Types.ObjectId, ref: "User", required: true },
    booking: { type: Schema.Types.ObjectId, ref: "Booking", required: true },
    amount: { type: Number, required: true },
    currency: { type: String, required: true, default: "chf" },
    clientSecret: { type: String },
    status: {
        type: String,
        enum: ["pending", "confirmed", "cancelled"],
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
