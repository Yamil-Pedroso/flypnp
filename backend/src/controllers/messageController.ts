import type { Request, Response } from "express";
import { Types } from "mongoose";
import { Booking } from "../models/Booking";
import { Conversation } from "../models/Conversation";
import { Message } from "../models/Message";
import { Place } from "../models/Place";
import {
  publishMessageEvent,
  subscribeToMessages,
} from "../services/messageRealtimeService";
import CustomError from "../utils/customError";

interface ParticipantView {
  _id: Types.ObjectId;
  name: string;
  avatar: string;
}

interface PlaceView {
  _id: Types.ObjectId;
  title: string;
  address: string;
  category: string;
  photos: Array<{ main: string; thumbnails: string[] }>;
}

interface BookingView {
  _id: Types.ObjectId;
  checkIn: Date;
  checkOut: Date;
  numOfGuests: {
    adults: number;
    children: number;
    infants: number;
    pets: number;
  };
  status: "pending" | "confirmed" | "cancelled";
  place: PlaceView;
}

interface PopulatedConversation {
  _id: Types.ObjectId;
  booking: BookingView;
  guest: ParticipantView;
  host: ParticipantView;
  lastMessageText: string;
  lastMessageAt: Date;
  lastMessageSender?: Types.ObjectId;
  createdAt: Date;
  updatedAt: Date;
}

interface PopulatedMessage {
  _id: Types.ObjectId;
  conversation: Types.ObjectId;
  sender: ParticipantView;
  body: string;
  readBy: Types.ObjectId[];
  createdAt: Date;
  updatedAt: Date;
}

const conversationPopulation = [
  { path: "guest", select: "name avatar" },
  { path: "host", select: "name avatar" },
  {
    path: "booking",
    select: "place checkIn checkOut numOfGuests status",
    populate: {
      path: "place",
      select: "title address category photos",
    },
  },
];

const idString = (value: unknown) => String(value);

const getParticipantIds = (conversation: {
  guest: unknown;
  host: unknown;
}) => [idString(conversation.guest), idString(conversation.host)];

const findConversationForUser = async (
  conversationId: string,
  userId: string,
) => {
  if (!Types.ObjectId.isValid(conversationId)) {
    throw new CustomError("Conversation not found", 404);
  }
  const conversation = await Conversation.findOne({
    _id: conversationId,
    $or: [{ guest: userId }, { host: userId }],
  });
  if (!conversation) throw new CustomError("Conversation not found", 404);
  return conversation;
};

const serializeMessage = (message: PopulatedMessage) => ({
  _id: idString(message._id),
  conversation: idString(message.conversation),
  sender: {
    _id: idString(message.sender._id),
    name: message.sender.name,
    avatar: message.sender.avatar,
  },
  body: message.body,
  readBy: message.readBy.map(idString),
  createdAt: message.createdAt,
  updatedAt: message.updatedAt,
});

const serializeConversation = (
  conversation: PopulatedConversation,
  userId: string,
  unreadCount: number,
) => {
  const hosting = idString(conversation.host._id) === userId;
  const otherParticipant = hosting ? conversation.guest : conversation.host;
  const booking = conversation.booking;
  const place = booking.place;

  return {
    _id: idString(conversation._id),
    kind: hosting ? "hosting" : "travelling",
    otherParticipant: {
      _id: idString(otherParticipant._id),
      name: otherParticipant.name,
      avatar: otherParticipant.avatar,
    },
    unreadCount,
    lastMessageText: conversation.lastMessageText,
    lastMessageAt: conversation.lastMessageAt,
    lastMessageSender: conversation.lastMessageSender
      ? idString(conversation.lastMessageSender)
      : undefined,
    booking: {
      _id: idString(booking._id),
      checkIn: booking.checkIn,
      checkOut: booking.checkOut,
      numOfGuests: booking.numOfGuests,
      status: booking.status,
      place: {
        _id: idString(place._id),
        title: place.title,
        address: place.address,
        category: place.category,
        photos: place.photos,
      },
    },
    createdAt: conversation.createdAt,
    updatedAt: conversation.updatedAt,
  };
};

const populateConversation = async (conversationId: string) => {
  const conversation = await Conversation.findById(conversationId)
    .populate(conversationPopulation)
    .lean();
  if (!conversation) throw new CustomError("Conversation not found", 404);
  return conversation as unknown as PopulatedConversation;
};

export const createConversation = async (req: Request, res: Response) => {
  const bookingId = String(req.body.bookingId ?? "");
  if (!Types.ObjectId.isValid(bookingId)) {
    throw new CustomError("A valid booking is required", 400);
  }

  const booking = await Booking.findById(bookingId);
  if (!booking) throw new CustomError("Booking not found", 404);

  const place = await Place.findById(booking.place).select("owner");
  if (!place?.owner) {
    throw new CustomError("This listing does not have a host", 409);
  }

  const guestId = idString(booking.owner);
  const hostId = idString(place.owner);
  const userId = req.user!.id;
  if (userId !== guestId && userId !== hostId) {
    throw new CustomError("You cannot message about this booking", 403);
  }
  if (guestId === hostId) {
    throw new CustomError("You cannot start a conversation with yourself", 409);
  }

  const conversation = await Conversation.findOneAndUpdate(
    { booking: booking._id },
    {
      $setOnInsert: {
        booking: booking._id,
        guest: booking.owner,
        host: place.owner,
        lastMessageAt: new Date(),
      },
    },
    { new: true, upsert: true, setDefaultsOnInsert: true },
  );

  const populated = await populateConversation(conversation.id);
  const unreadCount = await Message.countDocuments({
    conversation: conversation._id,
    sender: { $ne: req.user!._id },
    readBy: { $ne: req.user!._id },
  });

  publishMessageEvent([guestId, hostId], {
    type: "conversation.updated",
    conversationId: conversation.id,
  });
  res
    .status(201)
    .json({
      success: true,
      data: serializeConversation(populated, userId, unreadCount),
    });
};

export const getConversations = async (req: Request, res: Response) => {
  const userId = req.user!.id;
  const conversations = (await Conversation.find({
    $or: [{ guest: req.user!._id }, { host: req.user!._id }],
  })
    .populate(conversationPopulation)
    .sort({ lastMessageAt: -1 })
    .lean()) as unknown as PopulatedConversation[];

  const conversationIds = conversations.map(
    (conversation) => conversation._id,
  );
  const unreadRows =
    conversationIds.length === 0
      ? []
      : await Message.aggregate<{ _id: Types.ObjectId; count: number }>([
          {
            $match: {
              conversation: { $in: conversationIds },
              sender: { $ne: req.user!._id },
              readBy: { $ne: req.user!._id },
            },
          },
          { $group: { _id: "$conversation", count: { $sum: 1 } } },
        ]);
  const unreadByConversation = new Map(
    unreadRows.map((row) => [idString(row._id), row.count]),
  );

  res.status(200).json({
    success: true,
    count: conversations.length,
    data: conversations.map((conversation) =>
      serializeConversation(
        conversation,
        userId,
        unreadByConversation.get(idString(conversation._id)) ?? 0,
      ),
    ),
  });
};

export const getMessages = async (req: Request, res: Response) => {
  const conversation = await findConversationForUser(
    String(req.params.id),
    req.user!.id,
  );
  const requestedLimit = Number(req.query.limit ?? 50);
  const limit = Number.isFinite(requestedLimit)
    ? Math.min(Math.max(Math.floor(requestedLimit), 1), 100)
    : 50;
  const before = req.query.before
    ? new Date(String(req.query.before))
    : undefined;
  const beforeId = req.query.beforeId
    ? String(req.query.beforeId)
    : undefined;
  if (before && Number.isNaN(before.getTime())) {
    throw new CustomError("Invalid message cursor", 400);
  }
  if (beforeId && (!before || !Types.ObjectId.isValid(beforeId))) {
    throw new CustomError("Invalid message cursor", 400);
  }

  const cursorFilter = before
    ? beforeId
      ? {
          $or: [
            { createdAt: { $lt: before } },
            {
              createdAt: before,
              _id: { $lt: new Types.ObjectId(beforeId) },
            },
          ],
        }
      : { createdAt: { $lt: before } }
    : {};

  const messages = (await Message.find({
    conversation: conversation._id,
    ...cursorFilter,
  })
    .populate("sender", "name avatar")
    .sort({ createdAt: -1, _id: -1 })
    .limit(limit + 1)
    .lean()) as unknown as PopulatedMessage[];
  const hasMore = messages.length > limit;
  const page = messages.slice(0, limit);
  const oldestMessage = page[page.length - 1];

  res.status(200).json({
    success: true,
    data: page.reverse().map(serializeMessage),
    hasMore,
    nextCursor:
      hasMore && oldestMessage
        ? {
            before: oldestMessage.createdAt.toISOString(),
            beforeId: idString(oldestMessage._id),
          }
        : null,
  });
};

export const sendMessage = async (req: Request, res: Response) => {
  const conversation = await findConversationForUser(
    String(req.params.id),
    req.user!.id,
  );
  const body = String(req.body.body ?? "").trim();
  if (!body) throw new CustomError("Message cannot be empty", 400);
  if (body.length > 2000) {
    throw new CustomError("Message cannot exceed 2000 characters", 400);
  }

  const created = await Message.create({
    conversation: conversation._id,
    sender: req.user!._id,
    body,
    readBy: [req.user!._id],
  });
  conversation.lastMessageText = body;
  conversation.lastMessageAt = created.createdAt;
  conversation.lastMessageSender = req.user!._id;
  await conversation.save();

  const populated = (await Message.findById(created._id)
    .populate("sender", "name avatar")
    .lean()) as unknown as PopulatedMessage;
  const message = serializeMessage(populated);
  const participantIds = getParticipantIds(conversation);
  publishMessageEvent(participantIds, {
    type: "message.created",
    conversationId: conversation.id,
    message,
  });

  res.status(201).json({ success: true, data: message });
};

export const markConversationRead = async (req: Request, res: Response) => {
  const conversation = await findConversationForUser(
    String(req.params.id),
    req.user!.id,
  );
  await Message.updateMany(
    {
      conversation: conversation._id,
      sender: { $ne: req.user!._id },
      readBy: { $ne: req.user!._id },
    },
    { $addToSet: { readBy: req.user!._id } },
  );

  publishMessageEvent(getParticipantIds(conversation), {
    type: "messages.read",
    conversationId: conversation.id,
  });
  res.status(200).json({ success: true });
};

export const updateTypingStatus = async (req: Request, res: Response) => {
  const conversation = await findConversationForUser(
    String(req.params.id),
    req.user!.id,
  );
  if (typeof req.body.typing !== "boolean") {
    throw new CustomError("typing must be a boolean", 400);
  }

  const recipients = getParticipantIds(conversation).filter(
    (participantId) => participantId !== req.user!.id,
  );
  publishMessageEvent(recipients, {
    type: req.body.typing ? "typing.started" : "typing.stopped",
    conversationId: conversation.id,
    userId: req.user!.id,
  });
  res.status(204).send();
};

export const streamMessageEvents = async (req: Request, res: Response) => {
  res.status(200);
  res.setHeader("Content-Type", "text/event-stream");
  res.setHeader("Cache-Control", "no-cache, no-transform");
  res.setHeader("Connection", "keep-alive");
  res.setHeader("X-Accel-Buffering", "no");
  res.flushHeaders();

  const unsubscribe = subscribeToMessages(req.user!.id, res);
  req.on("close", unsubscribe);
};
