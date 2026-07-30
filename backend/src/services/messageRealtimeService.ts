import type { Response } from "express";

interface RealtimeEvent {
  type:
    | "conversation.updated"
    | "message.created"
    | "messages.read"
    | "typing.started"
    | "typing.stopped";
  conversationId: string;
  message?: unknown;
  userId?: string;
}

const clients = new Map<string, Set<Response>>();

const writeEvent = (response: Response, event: string, data: unknown) => {
  response.write(`event: ${event}\n`);
  response.write(`data: ${JSON.stringify(data)}\n\n`);
};

export const subscribeToMessages = (userId: string, response: Response) => {
  const userClients = clients.get(userId) ?? new Set<Response>();
  userClients.add(response);
  clients.set(userId, userClients);
  writeEvent(response, "connected", { connected: true });

  const heartbeat = setInterval(() => {
    response.write(": keep-alive\n\n");
  }, 25_000);

  return () => {
    clearInterval(heartbeat);
    userClients.delete(response);
    if (userClients.size === 0) clients.delete(userId);
  };
};

export const publishMessageEvent = (
  userIds: string[],
  event: RealtimeEvent,
) => {
  for (const userId of new Set(userIds)) {
    for (const response of clients.get(userId) ?? []) {
      writeEvent(response, event.type, event);
    }
  }
};
