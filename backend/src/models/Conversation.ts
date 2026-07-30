import { Schema, model, Types } from "mongoose";

interface IConversation {
  booking: Types.ObjectId;
  guest: Types.ObjectId;
  host: Types.ObjectId;
  lastMessageText: string;
  lastMessageAt: Date;
  lastMessageSender?: Types.ObjectId;
}

const conversationSchema = new Schema<IConversation>(
  {
    booking: {
      type: Schema.Types.ObjectId,
      ref: "Booking",
      required: true,
      unique: true,
      index: true,
    },
    guest: {
      type: Schema.Types.ObjectId,
      ref: "User",
      required: true,
      index: true,
    },
    host: {
      type: Schema.Types.ObjectId,
      ref: "User",
      required: true,
      index: true,
    },
    lastMessageText: { type: String, default: "" },
    lastMessageAt: { type: Date, default: Date.now, index: true },
    lastMessageSender: { type: Schema.Types.ObjectId, ref: "User" },
  },
  { timestamps: true },
);

conversationSchema.index({ guest: 1, lastMessageAt: -1 });
conversationSchema.index({ host: 1, lastMessageAt: -1 });

const Conversation = model<IConversation>("Conversation", conversationSchema);

export { Conversation, IConversation };
