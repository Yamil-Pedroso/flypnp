import { Schema, model, Types } from "mongoose";

interface IMessage {
  conversation: Types.ObjectId;
  sender: Types.ObjectId;
  body: string;
  readBy: Types.ObjectId[];
  createdAt: Date;
  updatedAt: Date;
}

const messageSchema = new Schema<IMessage>(
  {
    conversation: {
      type: Schema.Types.ObjectId,
      ref: "Conversation",
      required: true,
      index: true,
    },
    sender: {
      type: Schema.Types.ObjectId,
      ref: "User",
      required: true,
      index: true,
    },
    body: {
      type: String,
      required: true,
      trim: true,
      minlength: 1,
      maxlength: 2000,
    },
    readBy: [{ type: Schema.Types.ObjectId, ref: "User" }],
  },
  { timestamps: true },
);

messageSchema.index({ conversation: 1, createdAt: -1, _id: -1 });

const Message = model<IMessage>("Message", messageSchema);

export { Message, IMessage };
