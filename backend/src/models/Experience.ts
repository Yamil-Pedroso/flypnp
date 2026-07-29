import { Schema, model } from "mongoose";

export type ExperienceCategory =
  | "local-flavors"
  | "nature"
  | "creative"
  | "hidden-gems"
  | "night"
  | "family"
  | "wellness"
  | "culture";

export interface IExperience {
  slug: string;
  title: string;
  city: string;
  country: string;
  address: string;
  category: ExperienceCategory;
  kind: "moment" | "local-path";
  summary: string;
  description: string;
  images: string[];
  host: {
    name: string;
    avatar: string;
    bio: string;
    yearsHosting: number;
  };
  durationMinutes: number;
  languages: string[];
  maxGuests: number;
  price: number;
  rating: number;
  reviews: number;
  meetingPoint: string;
  included: string[];
  bring: string[];
  highlights: string[];
  availableDays: number[];
  startTimes: string[];
  featured: boolean;
}

const experienceSchema = new Schema<IExperience>({
  slug: { type: String, required: true, unique: true, trim: true, lowercase: true },
  title: { type: String, required: true, trim: true },
  city: { type: String, required: true, trim: true },
  country: { type: String, required: true, trim: true },
  address: { type: String, required: true, trim: true },
  category: {
    type: String,
    required: true,
    enum: ["local-flavors", "nature", "creative", "hidden-gems", "night", "family", "wellness", "culture"],
  },
  kind: { type: String, enum: ["moment", "local-path"], default: "moment" },
  summary: { type: String, required: true, trim: true },
  description: { type: String, required: true, trim: true },
  images: { type: [String], required: true },
  host: {
    name: { type: String, required: true },
    avatar: { type: String, required: true },
    bio: { type: String, required: true },
    yearsHosting: { type: Number, min: 0, required: true },
  },
  durationMinutes: { type: Number, min: 30, required: true },
  languages: { type: [String], required: true },
  maxGuests: { type: Number, min: 1, required: true },
  price: { type: Number, min: 1, required: true },
  rating: { type: Number, min: 0, max: 5, default: 0 },
  reviews: { type: Number, min: 0, default: 0 },
  meetingPoint: { type: String, required: true },
  included: { type: [String], default: [] },
  bring: { type: [String], default: [] },
  highlights: { type: [String], default: [] },
  availableDays: {
    type: [Number],
    validate: {
      validator: (days: number[]) => days.length > 0 && days.every((day) => Number.isInteger(day) && day >= 0 && day <= 6),
      message: "availableDays must contain weekdays from 0 to 6",
    },
  },
  startTimes: { type: [String], required: true },
  featured: { type: Boolean, default: false },
}, { timestamps: true });

experienceSchema.index({ city: "text", country: "text", title: "text", summary: "text" });
experienceSchema.index({ category: 1, kind: 1, featured: -1 });

const Experience = model<IExperience>("Experience", experienceSchema);

export { Experience };
