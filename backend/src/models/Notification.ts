import { Schema, model, Types } from "mongoose";

interface INotification {
    user: Types.ObjectId;
    message: string;
    //read: boolean;
}

const notificationSchema = new Schema<INotification>({
    user: { type: Schema.Types.ObjectId, required: true },
    message: { type: String, required: true },
    //read: { type: Boolean, required: true, default: false },
}, {
    timestamps: true,
});

const Notification = model<INotification>("Notification", notificationSchema);

export { Notification, INotification }
