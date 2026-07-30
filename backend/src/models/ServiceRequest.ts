import { Schema, model, Types } from "mongoose";

export type ServiceType = "airport-transfer" | "pet-care" | "local-guide";

export interface IServiceRequest {
  owner: Types.ObjectId;
  serviceType: ServiceType;
  destination: string;
  date: Date;
  time: string;
  participants: number;
  notes?: string;
  details: {
    pickup?: string;
    dropoff?: string;
    flightNumber?: string;
    petType?: string;
    petCount?: number;
    language?: string;
    interests?: string;
  };
  quotePrice?: number;
  provider?: {
    name: string;
    email?: string;
    phone?: string;
  };
  adminMessage?: string;
  quotedAt?: Date;
  confirmedAt?: Date;
  status: "requested" | "quoted" | "confirmed" | "cancelled";
}

const serviceRequestSchema = new Schema<IServiceRequest>({
  owner: { type: Schema.Types.ObjectId, ref: "User", required: true },
  serviceType: {
    type: String,
    enum: ["airport-transfer", "pet-care", "local-guide"],
    required: true,
  },
  destination: { type: String, trim: true, maxlength: 160, required: true },
  date: { type: Date, required: true },
  time: {
    type: String,
    match: /^([01]\d|2[0-3]):[0-5]\d$/,
    required: true,
  },
  participants: { type: Number, min: 1, max: 20, required: true },
  notes: { type: String, trim: true, maxlength: 1000 },
  details: {
    pickup: { type: String, trim: true, maxlength: 200 },
    dropoff: { type: String, trim: true, maxlength: 200 },
    flightNumber: { type: String, trim: true, maxlength: 30 },
    petType: { type: String, trim: true, maxlength: 60 },
    petCount: { type: Number, min: 1, max: 10 },
    language: { type: String, trim: true, maxlength: 60 },
    interests: { type: String, trim: true, maxlength: 300 },
  },
  quotePrice: { type: Number, min: 1 },
  provider: {
    name: { type: String, trim: true, maxlength: 120 },
    email: { type: String, trim: true, lowercase: true, maxlength: 160 },
    phone: { type: String, trim: true, maxlength: 40 },
  },
  adminMessage: { type: String, trim: true, maxlength: 1000 },
  quotedAt: { type: Date },
  confirmedAt: { type: Date },
  status: {
    type: String,
    enum: ["requested", "quoted", "confirmed", "cancelled"],
    default: "requested",
  },
}, { timestamps: true });

serviceRequestSchema.index({ owner: 1, date: 1, status: 1 });

const ServiceRequest = model<IServiceRequest>("ServiceRequest", serviceRequestSchema);

export { ServiceRequest };
