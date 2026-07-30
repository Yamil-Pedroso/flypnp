import { Schema, model } from "mongoose";

interface IRateLimitBucket {
  key: string;
  count: number;
  expiresAt: Date;
}

const rateLimitBucketSchema = new Schema<IRateLimitBucket>({
  key: { type: String, required: true, unique: true },
  count: { type: Number, required: true, default: 0 },
  expiresAt: { type: Date, required: true },
}, { versionKey: false });

rateLimitBucketSchema.index({ expiresAt: 1 }, { expireAfterSeconds: 0 });

const RateLimitBucket = model<IRateLimitBucket>("RateLimitBucket", rateLimitBucketSchema);

export { RateLimitBucket };
