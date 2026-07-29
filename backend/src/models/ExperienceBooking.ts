import { Schema, model, Types } from "mongoose";

export interface IExperienceBooking {
  owner: Types.ObjectId;
  experience: Types.ObjectId;
  date: Date;
  startTime: string;
  participants: number;
  status: "pending" | "confirmed" | "cancelled";
  name: string;
  price: number;
  archivedAt?: Date;
}

const experienceBookingSchema = new Schema<IExperienceBooking>({
  owner: { type: Schema.Types.ObjectId, ref: "User", required: true },
  experience: { type: Schema.Types.ObjectId, ref: "Experience", required: true },
  date: { type: Date, required: true },
  startTime: { type: String, required: true },
  participants: { type: Number, min: 1, required: true },
  status: {
    type: String,
    enum: ["pending", "confirmed", "cancelled"],
    default: "pending",
  },
  name: { type: String, required: true },
  price: { type: Number, min: 1, required: true },
  archivedAt: { type: Date },
}, { timestamps: true });

experienceBookingSchema.index({ experience: 1, date: 1, startTime: 1, status: 1 });
experienceBookingSchema.index({ owner: 1, archivedAt: 1 });

const ExperienceBooking = model<IExperienceBooking>("ExperienceBooking", experienceBookingSchema);

export { ExperienceBooking };
