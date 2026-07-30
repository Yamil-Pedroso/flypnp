import type { Request, Response } from "express";
import { beforeEach, describe, expect, it, vi } from "vitest";

vi.mock("../models/Booking", () => ({
  Booking: { findById: vi.fn() },
}));
vi.mock("../models/Place", () => ({
  Place: { findById: vi.fn() },
}));
vi.mock("../models/Conversation", () => ({
  Conversation: {
    findOne: vi.fn(),
    findOneAndUpdate: vi.fn(),
    findById: vi.fn(),
    find: vi.fn(),
  },
}));
vi.mock("../models/Message", () => ({
  Message: {
    aggregate: vi.fn(),
    countDocuments: vi.fn(),
    create: vi.fn(),
    find: vi.fn(),
    findById: vi.fn(),
    updateMany: vi.fn(),
  },
}));
vi.mock("../services/messageRealtimeService", () => ({
  publishMessageEvent: vi.fn(),
  subscribeToMessages: vi.fn(),
}));

import { Booking } from "../models/Booking";
import { Conversation } from "../models/Conversation";
import { Message } from "../models/Message";
import { Place } from "../models/Place";
import {
  createConversation,
  getMessages,
  sendMessage,
  updateTypingStatus,
} from "../controllers/messageController";
import { publishMessageEvent } from "../services/messageRealtimeService";

const responseMock = () => {
  const response = { status: vi.fn(), json: vi.fn(), send: vi.fn() };
  response.status.mockReturnValue(response);
  return response as unknown as Response;
};

const requestMock = (
  userId: string,
  body: Record<string, unknown> = {},
  params: Record<string, string> = {},
) =>
  ({
    user: { _id: userId, id: userId, name: "User", isAdmin: false },
    body,
    params,
  }) as unknown as Request;

describe("booking conversations", () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it("allows only the booking guest or listing host to create a conversation", async () => {
    vi.mocked(Booking.findById).mockResolvedValue({
      _id: "507f1f77bcf86cd799439011",
      owner: { toString: () => "507f191e810c19729de860ea" },
      place: "507f1f77bcf86cd799439012",
    } as never);
    vi.mocked(Place.findById).mockReturnValue({
      select: vi.fn().mockResolvedValue({
        owner: { toString: () => "507f191e810c19729de860eb" },
      }),
    } as never);

    await expect(
      createConversation(
        requestMock("507f191e810c19729de860ec", {
          bookingId: "507f1f77bcf86cd799439011",
        }),
        responseMock(),
      ),
    ).rejects.toThrow("You cannot message about this booking");
    expect(Conversation.findOneAndUpdate).not.toHaveBeenCalled();
  });

  it("persists a message, updates the conversation and publishes it live", async () => {
    const save = vi.fn();
    const conversation = {
      _id: "507f1f77bcf86cd799439021",
      id: "507f1f77bcf86cd799439021",
      guest: "507f191e810c19729de860ea",
      host: "507f191e810c19729de860eb",
      lastMessageText: "",
      lastMessageAt: new Date(0),
      lastMessageSender: undefined as unknown,
      save,
    };
    vi.mocked(Conversation.findOne).mockResolvedValue(conversation as never);
    vi.mocked(Message.create).mockResolvedValue({
      _id: "507f1f77bcf86cd799439022",
      createdAt: new Date("2026-07-30T12:00:00.000Z"),
    } as never);
    vi.mocked(Message.findById).mockReturnValue({
      populate: vi.fn().mockReturnValue({
        lean: vi.fn().mockResolvedValue({
          _id: "507f1f77bcf86cd799439022",
          conversation: "507f1f77bcf86cd799439021",
          sender: {
            _id: "507f191e810c19729de860ea",
            name: "Guest",
            avatar: "",
          },
          body: "We will arrive at five.",
          readBy: ["507f191e810c19729de860ea"],
          createdAt: new Date("2026-07-30T12:00:00.000Z"),
          updatedAt: new Date("2026-07-30T12:00:00.000Z"),
        }),
      }),
    } as never);
    const response = responseMock();

    await sendMessage(
      requestMock(
        "507f191e810c19729de860ea",
        { body: "  We will arrive at five.  " },
        { id: "507f1f77bcf86cd799439021" },
      ),
      response,
    );

    expect(Message.create).toHaveBeenCalledWith(
      expect.objectContaining({
        body: "We will arrive at five.",
        readBy: ["507f191e810c19729de860ea"],
      }),
    );
    expect(conversation.lastMessageText).toBe("We will arrive at five.");
    expect(save).toHaveBeenCalled();
    expect(publishMessageEvent).toHaveBeenCalledWith(
      [
        "507f191e810c19729de860ea",
        "507f191e810c19729de860eb",
      ],
      expect.objectContaining({ type: "message.created" }),
    );
    expect(response.status).toHaveBeenCalledWith(201);
  });

  it("publishes typing only to the other conversation participant", async () => {
    vi.mocked(Conversation.findOne).mockResolvedValue({
      _id: "507f1f77bcf86cd799439021",
      id: "507f1f77bcf86cd799439021",
      guest: "507f191e810c19729de860ea",
      host: "507f191e810c19729de860eb",
    } as never);
    const response = responseMock();

    await updateTypingStatus(
      requestMock(
        "507f191e810c19729de860ea",
        { typing: true },
        { id: "507f1f77bcf86cd799439021" },
      ),
      response,
    );

    expect(publishMessageEvent).toHaveBeenCalledWith(
      ["507f191e810c19729de860eb"],
      {
        type: "typing.started",
        conversationId: "507f1f77bcf86cd799439021",
        userId: "507f191e810c19729de860ea",
      },
    );
    expect(response.status).toHaveBeenCalledWith(204);
    expect(response.send).toHaveBeenCalled();
  });

  it("paginates messages with a stable date and id cursor", async () => {
    vi.mocked(Conversation.findOne).mockResolvedValue({
      _id: "507f1f77bcf86cd799439021",
      id: "507f1f77bcf86cd799439021",
      guest: "507f191e810c19729de860ea",
      host: "507f191e810c19729de860eb",
    } as never);
    const lean = vi.fn().mockResolvedValue([
      {
        _id: "507f1f77bcf86cd799439033",
        conversation: "507f1f77bcf86cd799439021",
        sender: { _id: "507f191e810c19729de860eb", name: "Host", avatar: "" },
        body: "Newest",
        readBy: [],
        createdAt: new Date("2026-07-30T12:03:00.000Z"),
        updatedAt: new Date("2026-07-30T12:03:00.000Z"),
      },
      {
        _id: "507f1f77bcf86cd799439032",
        conversation: "507f1f77bcf86cd799439021",
        sender: { _id: "507f191e810c19729de860eb", name: "Host", avatar: "" },
        body: "Middle",
        readBy: [],
        createdAt: new Date("2026-07-30T12:02:00.000Z"),
        updatedAt: new Date("2026-07-30T12:02:00.000Z"),
      },
      {
        _id: "507f1f77bcf86cd799439031",
        conversation: "507f1f77bcf86cd799439021",
        sender: { _id: "507f191e810c19729de860eb", name: "Host", avatar: "" },
        body: "Older lookahead",
        readBy: [],
        createdAt: new Date("2026-07-30T12:01:00.000Z"),
        updatedAt: new Date("2026-07-30T12:01:00.000Z"),
      },
    ]);
    const limit = vi.fn().mockReturnValue({ lean });
    const sort = vi.fn().mockReturnValue({ limit });
    const populate = vi.fn().mockReturnValue({ sort });
    vi.mocked(Message.find).mockReturnValue({ populate } as never);
    const response = responseMock();
    const request = {
      user: {
        _id: "507f191e810c19729de860ea",
        id: "507f191e810c19729de860ea",
      },
      params: { id: "507f1f77bcf86cd799439021" },
      query: {
        limit: "2",
        before: "2026-07-30T12:04:00.000Z",
        beforeId: "507f1f77bcf86cd799439034",
      },
    } as unknown as Request;

    await getMessages(request, response);

    expect(Message.find).toHaveBeenCalledWith(
      expect.objectContaining({
        conversation: "507f1f77bcf86cd799439021",
        $or: expect.any(Array),
      }),
    );
    expect(sort).toHaveBeenCalledWith({ createdAt: -1, _id: -1 });
    expect(limit).toHaveBeenCalledWith(3);
    expect(response.json).toHaveBeenCalledWith(
      expect.objectContaining({
        hasMore: true,
        data: [
          expect.objectContaining({ body: "Middle" }),
          expect.objectContaining({ body: "Newest" }),
        ],
        nextCursor: {
          before: "2026-07-30T12:02:00.000Z",
          beforeId: "507f1f77bcf86cd799439032",
        },
      }),
    );
  });
});
