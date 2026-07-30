import { render, screen, waitFor } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { MemoryRouter } from "react-router-dom";
import { beforeEach, describe, expect, it, vi } from "vitest";
import Messages from "./Messages";

const sendMessage = vi.fn();
const loadMessages = vi.fn();
const markRead = vi.fn();
const setTyping = vi.fn();
const loadOlderMessages = vi.fn();

const conversations = [
  {
    _id: "conversation-1",
    kind: "travelling" as const,
    otherParticipant: { _id: "host-1", name: "Maria", avatar: "" },
    unreadCount: 2,
    lastMessageText: "Everything is ready.",
    lastMessageAt: "2026-07-30T10:42:00.000Z",
    booking: {
      _id: "booking-1",
      checkIn: "2026-08-12T00:00:00.000Z",
      checkOut: "2026-08-16T00:00:00.000Z",
      numOfGuests: { adults: 2, children: 0, infants: 0, pets: 0 },
      status: "confirmed" as const,
      place: {
        _id: "place-1",
        title: "Alpine cabin",
        address: "Interlaken",
        category: "trending",
        photos: [],
      },
    },
    createdAt: "2026-07-30T10:00:00.000Z",
    updatedAt: "2026-07-30T10:42:00.000Z",
  },
  {
    _id: "conversation-2",
    kind: "hosting" as const,
    otherParticipant: { _id: "guest-1", name: "Sofia", avatar: "" },
    unreadCount: 0,
    lastMessageText: "Thank you!",
    lastMessageAt: "2026-07-29T10:42:00.000Z",
    booking: {
      _id: "booking-2",
      checkIn: "2026-09-03T00:00:00.000Z",
      checkOut: "2026-09-06T00:00:00.000Z",
      numOfGuests: { adults: 1, children: 0, infants: 0, pets: 0 },
      status: "pending" as const,
      place: {
        _id: "place-2",
        title: "City loft",
        address: "Zürich",
        category: "iconicCities",
        photos: [],
      },
    },
    createdAt: "2026-07-29T10:00:00.000Z",
    updatedAt: "2026-07-29T10:42:00.000Z",
  },
];

vi.mock("../../lib/hooks", () => ({
  useAuth: () => ({
    user: {
      _id: "traveller-1",
      name: "Yami",
      email: "yami@example.com",
      avatar: "",
      isAdmin: false,
    },
    loading: false,
  }),
  useMessages: () => ({
    conversations,
    messagesByConversation: {
      "conversation-1": [
        {
          _id: "message-1",
          conversation: "conversation-1",
          sender: { _id: "host-1", name: "Maria", avatar: "" },
          body: "Everything is ready.",
          readBy: ["host-1"],
          createdAt: "2026-07-30T10:42:00.000Z",
          updatedAt: "2026-07-30T10:42:00.000Z",
        },
      ],
    },
    typingByConversation: {},
    hasMoreByConversation: { "conversation-1": true },
    loadingOlderByConversation: {},
    unreadTotal: 2,
    loading: false,
    error: null,
    refresh: vi.fn(),
    createForBooking: vi.fn(),
    loadMessages,
    loadOlderMessages,
    sendMessage,
    markRead,
    setTyping,
  }),
}));

describe("Messages", () => {
  beforeEach(() => {
    vi.clearAllMocks();
    loadMessages.mockResolvedValue([]);
    markRead.mockResolvedValue(undefined);
    sendMessage.mockResolvedValue({});
    setTyping.mockResolvedValue(undefined);
    loadOlderMessages.mockResolvedValue(1);
  });

  it("filters unread conversations and sends through the message API", async () => {
    const user = userEvent.setup();
    render(
      <MemoryRouter>
        <Messages />
      </MemoryRouter>,
    );

    expect(screen.getByRole("heading", { name: "Messages" })).toBeInTheDocument();
    await waitFor(() =>
      expect(loadMessages).toHaveBeenCalledWith("conversation-1"),
    );
    await user.click(
      screen.getByRole("button", { name: "Load older messages" }),
    );
    expect(loadOlderMessages).toHaveBeenCalledWith("conversation-1");

    await user.click(screen.getByRole("button", { name: "Unread" }));
    expect(screen.getAllByText("Maria")).not.toHaveLength(0);
    expect(screen.queryByText("Sofia")).not.toBeInTheDocument();

    const composer = screen.getByRole("textbox", { name: "Write a message" });
    await user.click(screen.getByRole("button", { name: "Open emoji picker" }));
    await user.click(screen.getByRole("button", { name: "Add 😊" }));
    expect(composer).toHaveValue("😊");
    await user.click(screen.getByRole("tab", { name: "Travel" }));
    await user.click(screen.getByRole("button", { name: "Add ✈️" }));
    expect(composer).toHaveValue("😊✈️");
    expect(screen.getByRole("dialog", { name: "Emoji picker" })).toBeInTheDocument();
    await user.click(screen.getByRole("heading", { name: "Messages" }));
    expect(screen.queryByRole("dialog", { name: "Emoji picker" })).not.toBeInTheDocument();
    await user.clear(composer);
    await user.type(composer, "Thanks, that sounds great!");
    await user.click(screen.getByRole("button", { name: "Send message" }));

    await waitFor(() =>
      expect(sendMessage).toHaveBeenCalledWith(
        "conversation-1",
        "Thanks, that sounds great!",
      ),
    );
    expect(composer).toHaveValue("");
    expect(setTyping).toHaveBeenCalledWith("conversation-1", true);
  });
});
