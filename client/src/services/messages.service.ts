import { apiBaseUrl, http } from "./http";
import type {
  ApiResponse,
  ConversationMessage,
  MessageCursor,
  MessageConversation,
  MessagePage,
  MessageRealtimeEvent,
} from "./types";

const eventStreamUrl = () => {
  const base = apiBaseUrl.replace(/\/$/, "");
  return new URL(`${base}/messages/events`, window.location.origin).toString();
};

const isMessageEvent = (value: unknown): value is MessageRealtimeEvent => {
  if (!value || typeof value !== "object") return false;
  const candidate = value as Partial<MessageRealtimeEvent>;
  return (
    typeof candidate.conversationId === "string" &&
    [
      "conversation.updated",
      "message.created",
      "messages.read",
      "typing.started",
      "typing.stopped",
    ].includes(
      String(candidate.type),
    )
  );
};

export const messagesService = {
  async listConversations() {
    return (
      await http.get<ApiResponse<MessageConversation[]> & { count: number }>(
        "/conversations",
      )
    ).data.data;
  },

  async createConversation(bookingId: string) {
    return (
      await http.post<ApiResponse<MessageConversation>>("/conversations", {
        bookingId,
      })
    ).data.data;
  },

  async listMessages(
    conversationId: string,
    cursor?: MessageCursor,
  ): Promise<MessagePage> {
    const response = await http.get<
      ApiResponse<ConversationMessage[]> & {
        hasMore: boolean;
        nextCursor: MessageCursor | null;
      }
    >(`/conversations/${conversationId}/messages`, {
      params: { limit: 50, ...cursor },
    });
    return {
      messages: response.data.data,
      hasMore: response.data.hasMore,
      nextCursor: response.data.nextCursor,
    };
  },

  async sendMessage(conversationId: string, body: string) {
    return (
      await http.post<ApiResponse<ConversationMessage>>(
        `/conversations/${conversationId}/messages`,
        { body },
      )
    ).data.data;
  },

  async markRead(conversationId: string) {
    await http.patch(`/conversations/${conversationId}/read`);
  },

  async setTyping(conversationId: string, typing: boolean) {
    await http.post(`/conversations/${conversationId}/typing`, { typing });
  },

  async subscribe(
    onEvent: (event: MessageRealtimeEvent) => void,
    signal: AbortSignal,
  ) {
    const token = localStorage.getItem("token");
    const response = await fetch(eventStreamUrl(), {
      headers: {
        Accept: "text/event-stream",
        ...(token ? { Authorization: `Bearer ${token}` } : {}),
      },
      credentials: "include",
      cache: "no-store",
      signal,
    });
    if (!response.ok || !response.body) {
      throw new Error("Could not connect to message updates");
    }

    const reader = response.body.getReader();
    const decoder = new TextDecoder();
    let buffer = "";

    while (!signal.aborted) {
      const { done, value } = await reader.read();
      if (done) break;
      buffer += decoder.decode(value, { stream: true }).replace(/\r\n/g, "\n");
      const blocks = buffer.split("\n\n");
      buffer = blocks.pop() ?? "";

      for (const block of blocks) {
        const data = block
          .split("\n")
          .filter((line) => line.startsWith("data:"))
          .map((line) => line.slice(5).trimStart())
          .join("\n");
        if (!data) continue;
        try {
          const parsed: unknown = JSON.parse(data);
          if (isMessageEvent(parsed)) onEvent(parsed);
        } catch {
          // Ignore malformed frames and keep the stream alive.
        }
      }
    }
  },
};
