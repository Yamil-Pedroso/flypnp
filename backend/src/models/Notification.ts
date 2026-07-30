import { Schema, model, Types } from "mongoose";

interface INotification {
    user: Types.ObjectId;
    type: "general" | "service_quote" | "service_confirmed" | "service_cancelled";
    title?: string;
    message: string;
    actionUrl?: string;
    dedupeKey?: string;
    read: boolean;
}

const notificationSchema = new Schema<INotification>({
    user: { type: Schema.Types.ObjectId, required: true },
    type: {
      type: String,
      enum: ["general", "service_quote", "service_confirmed", "service_cancelled"],
      default: "general",
    },
    title: { type: String, trim: true, maxlength: 160 },
    message: { type: String, required: true },
    actionUrl: { type: String, trim: true, maxlength: 500 },
    dedupeKey: { type: String, unique: true, sparse: true, select: false },
    read: { type: Boolean, default: false },
}, {
    timestamps: true,
});

const Notification = model<INotification>("Notification", notificationSchema);

export { Notification, INotification }
