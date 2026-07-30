import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useRef,
  useState,
} from "react";
import {
  getErrorMessage,
  messagesService,
  type ConversationMessage,
  type MessageConversation,
  type MessageCursor,
  type MessageRealtimeEvent,
} from "../../services";
import { useAuth } from "./useAuth";

export interface MessagesContextValue {
  conversations: MessageConversation[];
  messagesByConversation: Record<string, ConversationMessage[]>;
  typingByConversation: Record<string, boolean>;
  hasMoreByConversation: Record<string, boolean>;
  loadingOlderByConversation: Record<string, boolean>;
  unreadTotal: number;
  loading: boolean;
  error: string | null;
  refresh: () => Promise<void>;
  createForBooking: (bookingId: string) => Promise<MessageConversation>;
  loadMessages: (conversationId: string) => Promise<ConversationMessage[]>;
  loadOlderMessages: (conversationId: string) => Promise<number>;
  sendMessage: (
    conversationId: string,
    body: string,
  ) => Promise<ConversationMessage>;
  markRead: (conversationId: string) => Promise<void>;
  setTyping: (conversationId: string, typing: boolean) => Promise<void>;
}

export const MessagesContext = createContext<MessagesContextValue | null>(null);

const mergeMessages = (...groups: ConversationMessage[][]) => {
  const unique = new Map<string, ConversationMessage>();
  groups.flat().forEach((message) => unique.set(message._id, message));
  return [...unique.values()].sort((left, right) => {
    const dateDifference =
      new Date(left.createdAt).getTime() - new Date(right.createdAt).getTime();
    return dateDifference || left._id.localeCompare(right._id);
  });
};

export const useMessagesController = (): MessagesContextValue => {
  const { user } = useAuth();
  const [conversations, setConversations] = useState<MessageConversation[]>([]);
  const [messagesByConversation, setMessagesByConversation] = useState<
    Record<string, ConversationMessage[]>
  >({});
  const [typingByConversation, setTypingByConversation] = useState<
    Record<string, boolean>
  >({});
  const [hasMoreByConversation, setHasMoreByConversation] = useState<
    Record<string, boolean>
  >({});
  const [loadingOlderByConversation, setLoadingOlderByConversation] = useState<
    Record<string, boolean>
  >({});
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const loadedOnce = useRef(false);
  const typingTimeouts = useRef<Record<string, number>>({});
  const cursors = useRef<Record<string, MessageCursor | null>>({});
  const loadingOlder = useRef(new Set<string>());

  const refresh = useCallback(async () => {
    if (!user) {
      setConversations([]);
      setMessagesByConversation({});
      setTypingByConversation({});
      setHasMoreByConversation({});
      setLoadingOlderByConversation({});
      cursors.current = {};
      loadingOlder.current.clear();
      loadedOnce.current = false;
      return;
    }
    try {
      if (!loadedOnce.current) setLoading(true);
      setConversations(await messagesService.listConversations());
      loadedOnce.current = true;
      setError(null);
    } catch (cause) {
      setError(getErrorMessage(cause, "Could not load conversations"));
    } finally {
      setLoading(false);
    }
  }, [user]);

  useEffect(() => {
    void refresh();
  }, [refresh]);

  useEffect(() => {
    if (!user) return;
    const controller = new AbortController();
    let active = true;

    const onEvent = (event: MessageRealtimeEvent) => {
      if (
        event.type === "typing.started" ||
        event.type === "typing.stopped"
      ) {
        const typing = event.type === "typing.started";
        window.clearTimeout(typingTimeouts.current[event.conversationId]);
        setTypingByConversation((current) => ({
          ...current,
          [event.conversationId]: typing,
        }));
        if (typing) {
          typingTimeouts.current[event.conversationId] = window.setTimeout(
            () =>
              setTypingByConversation((current) => ({
                ...current,
                [event.conversationId]: false,
              })),
            3_500,
          );
        }
        return;
      }
      if (event.type === "message.created" && event.message) {
        window.clearTimeout(typingTimeouts.current[event.conversationId]);
        setTypingByConversation((current) => ({
          ...current,
          [event.conversationId]: false,
        }));
        setMessagesByConversation((current) => ({
          ...current,
          [event.conversationId]: mergeMessages(
            current[event.conversationId] ?? [],
            [event.message!],
          ),
        }));
      }
      void refresh();
    };

    const connect = async () => {
      while (active && !controller.signal.aborted) {
        try {
          await messagesService.subscribe(onEvent, controller.signal);
        } catch {
          if (controller.signal.aborted) return;
        }
        if (!active || controller.signal.aborted) return;
        await new Promise((resolve) => window.setTimeout(resolve, 2_000));
      }
    };

    void connect();
    return () => {
      active = false;
      controller.abort();
      Object.values(typingTimeouts.current).forEach(window.clearTimeout);
      typingTimeouts.current = {};
    };
  }, [refresh, user]);

  const unreadTotal = useMemo(
    () =>
      conversations.reduce(
        (total, conversation) => total + conversation.unreadCount,
        0,
      ),
    [conversations],
  );

  const createForBooking = useCallback(async (bookingId: string) => {
    const conversation = await messagesService.createConversation(bookingId);
    setConversations((current) => {
      const withoutCurrent = current.filter(
        (item) => item._id !== conversation._id,
      );
      return [conversation, ...withoutCurrent];
    });
    return conversation;
  }, []);

  const loadMessages = useCallback(async (conversationId: string) => {
    if (conversationId in cursors.current) return [];
    const page = await messagesService.listMessages(conversationId);
    setMessagesByConversation((current) => ({
      ...current,
      [conversationId]: mergeMessages(
        page.messages,
        current[conversationId] ?? [],
      ),
    }));
    cursors.current[conversationId] = page.nextCursor;
    setHasMoreByConversation((current) => ({
      ...current,
      [conversationId]: page.hasMore,
    }));
    return page.messages;
  }, []);

  const loadOlderMessages = useCallback(async (conversationId: string) => {
    const cursor = cursors.current[conversationId];
    if (!cursor || loadingOlder.current.has(conversationId)) return 0;
    loadingOlder.current.add(conversationId);
    setLoadingOlderByConversation((current) => ({
      ...current,
      [conversationId]: true,
    }));
    try {
      const page = await messagesService.listMessages(conversationId, cursor);
      setMessagesByConversation((current) => ({
        ...current,
        [conversationId]: mergeMessages(
          page.messages,
          current[conversationId] ?? [],
        ),
      }));
      cursors.current[conversationId] = page.nextCursor;
      setHasMoreByConversation((current) => ({
        ...current,
        [conversationId]: page.hasMore,
      }));
      return page.messages.length;
    } finally {
      loadingOlder.current.delete(conversationId);
      setLoadingOlderByConversation((current) => ({
        ...current,
        [conversationId]: false,
      }));
    }
  }, []);

  const sendMessage = useCallback(
    async (conversationId: string, body: string) => {
      const message = await messagesService.sendMessage(conversationId, body);
      setMessagesByConversation((current) => ({
        ...current,
        [conversationId]: mergeMessages(
          current[conversationId] ?? [],
          [message],
        ),
      }));
      void refresh();
      return message;
    },
    [refresh],
  );

  const markRead = useCallback(async (conversationId: string) => {
    setConversations((current) =>
      current.map((conversation) =>
        conversation._id === conversationId
          ? { ...conversation, unreadCount: 0 }
          : conversation,
      ),
    );
    await messagesService.markRead(conversationId);
  }, []);

  const setTyping = useCallback(
    async (conversationId: string, typing: boolean) => {
      await messagesService.setTyping(conversationId, typing);
    },
    [],
  );

  return {
    conversations,
    messagesByConversation,
    typingByConversation,
    hasMoreByConversation,
    loadingOlderByConversation,
    unreadTotal,
    loading,
    error,
    refresh,
    createForBooking,
    loadMessages,
    loadOlderMessages,
    sendMessage,
    markRead,
    setTyping,
  };
};

export const useMessages = () => {
  const context = useContext(MessagesContext);
  if (!context) {
    throw new Error("useMessages must be used inside MessagesProvider");
  }
  return context;
};
