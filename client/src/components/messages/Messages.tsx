import {
  useEffect,
  useMemo,
  useRef,
  useState,
  type FormEvent,
} from "react";
import { Link, useSearchParams } from "react-router-dom";
import { AnimatePresence, motion, useReducedMotion } from "framer-motion";
import { toast } from "sonner";
import {
  ArrowLeft,
  ArrowUpRight,
  CalendarDays,
  ChevronRight,
  CircleUserRound,
  House,
  Inbox,
  LoaderCircle,
  MapPin,
  MessageCircle,
  RefreshCw,
  Search,
  Send,
  ShieldCheck,
  Smile,
  Users,
} from "lucide-react";
import { useAuth, useMessages } from "../../lib/hooks";
import { getErrorMessage, type MessageConversation } from "../../services";

type ConversationFilter = "all" | "unread" | "hosting" | "travelling";

const filters: { id: ConversationFilter; label: string }[] = [
  { id: "all", label: "All" },
  { id: "unread", label: "Unread" },
  { id: "hosting", label: "Hosting" },
  { id: "travelling", label: "Travelling" },
];

const emojiCategories = [
  {
    id: "smileys",
    label: "Smileys",
    icon: "😀",
    emojis: [
      "😀", "😃", "😄", "😁", "😆", "😅", "😂", "🤣", "😊", "😇",
      "🙂", "🙃", "😉", "😌", "😍", "🥰", "😘", "😋", "😛", "😝",
      "😜", "🤪", "🤨", "🧐", "🤓", "😎", "🥳", "😏", "😒", "😞",
      "😔", "😟", "😕", "🙁", "☹️", "😣", "😖", "😫", "😩", "🥺",
      "😢", "😭", "😤", "😠", "😡", "🤬", "🤯", "😳", "🥵", "🥶",
      "😱", "😨", "😰", "😥", "😓", "🤗", "🤔", "🫣", "🤭", "🫢",
      "🫡", "🤫", "🫠", "😶", "😐", "😑", "😬", "🙄", "😯", "😮",
      "😲", "🥱", "😴", "🤤", "😪", "😵", "🤐", "🤢", "🤮", "🤧",
      "😷", "🤒", "🤕", "👻", "💩", "🤖", "🎃", "😺", "😸", "😹",
    ],
  },
  {
    id: "gestures",
    label: "Gestures",
    icon: "👋",
    emojis: [
      "👋", "🤚", "🖐️", "✋", "🖖", "👌", "🤌", "🤏", "✌️", "🤞",
      "🫰", "🤟", "🤘", "🤙", "👈", "👉", "👆", "👇", "☝️", "👍",
      "👎", "✊", "👊", "🤛", "🤜", "👏", "🙌", "🫶", "👐", "🤲",
      "🤝", "🙏", "✍️", "💅", "🤳", "💪", "🦾", "🦵", "🦶", "👂",
      "👃", "🧠", "🫀", "🫁", "🦷", "👀", "👁️", "👅", "👄", "🫂",
      "👶", "🧒", "👦", "👧", "🧑", "👨", "👩", "🧔", "👵", "👴",
      "🙋", "🙆", "🙅", "🤷", "🤦", "🧘", "🏃", "🚶", "💃", "🕺",
    ],
  },
  {
    id: "travel",
    label: "Travel",
    icon: "✈️",
    emojis: [
      "✈️", "🛫", "🛬", "🚁", "🚀", "🛸", "🚗", "🚕", "🚌", "🚎",
      "🏎️", "🚓", "🚑", "🚒", "🚐", "🛻", "🚚", "🚲", "🛴", "🏍️",
      "🚆", "🚄", "🚇", "🚊", "🚉", "🚢", "⛵", "🛥️", "🚤", "⚓",
      "🗺️", "🧭", "🧳", "🎒", "📍", "🚏", "⛽", "🚦", "🛣️", "🌍",
      "🌎", "🌏", "🏠", "🏡", "🏨", "🏕️", "⛺", "🏖️", "🏝️", "🏔️",
      "🗻", "🏙️", "🌆", "🌇", "🌉", "🗽", "🗼", "🏰", "🏯", "🕌",
      "⛪", "🛕", "🕍", "⛩️", "🕋", "⛲", "🎡", "🎢", "🎠", "🛎️",
    ],
  },
  {
    id: "food",
    label: "Food",
    icon: "🍽️",
    emojis: [
      "🍏", "🍎", "🍐", "🍊", "🍋", "🍌", "🍉", "🍇", "🍓", "🫐",
      "🍈", "🍒", "🍑", "🥭", "🍍", "🥥", "🥝", "🍅", "🥑", "🥦",
      "🥬", "🥒", "🌶️", "🫑", "🌽", "🥕", "🫒", "🧄", "🧅", "🥔",
      "🍞", "🥐", "🥖", "🫓", "🥨", "🧀", "🥚", "🍳", "🥞", "🧇",
      "🥓", "🍔", "🍟", "🍕", "🌭", "🥪", "🌮", "🌯", "🫔", "🥗",
      "🍝", "🍜", "🍲", "🍛", "🍣", "🍱", "🥟", "🍤", "🍙", "🍚",
      "🍦", "🍩", "🍪", "🎂", "🍰", "🧁", "🍫", "🍿", "☕", "🫖",
      "🍵", "🥤", "🧋", "🍺", "🍻", "🥂", "🍷", "🍸", "🍹", "🍽️",
    ],
  },
  {
    id: "nature",
    label: "Nature",
    icon: "🌿",
    emojis: [
      "🐶", "🐱", "🐭", "🐹", "🐰", "🦊", "🐻", "🐼", "🐨", "🐯",
      "🦁", "🐮", "🐷", "🐸", "🐵", "🐔", "🐧", "🐦", "🦉", "🦋",
      "🐝", "🐞", "🐢", "🐍", "🦎", "🐙", "🦀", "🐬", "🐳", "🐠",
      "🐾", "🌵", "🎄", "🌲", "🌳", "🌴", "🪴", "🌱", "🌿", "☘️",
      "🍀", "🎍", "🍃", "🍂", "🍁", "🌾", "🌺", "🌻", "🌹", "🌷",
      "🌼", "🌸", "💐", "🍄", "🌞", "🌝", "🌙", "⭐", "🌟", "✨",
      "⚡", "🔥", "🌈", "☀️", "⛅", "☁️", "🌧️", "⛈️", "❄️", "☃️",
      "💧", "🌊", "🌋", "🏞️", "🌅", "🌄", "🌌", "🌠", "☄️", "🌬️",
    ],
  },
  {
    id: "symbols",
    label: "Symbols",
    icon: "❤️",
    emojis: [
      "❤️", "🧡", "💛", "💚", "💙", "💜", "🖤", "🤍", "🤎", "💔",
      "❣️", "💕", "💞", "💓", "💗", "💖", "💘", "💝", "💟", "✅",
      "❌", "⭕", "❗", "❓", "‼️", "⁉️", "💯", "🔔", "🔕", "🔒",
      "🔓", "🔑", "🗝️", "🛏️", "🛁", "🚿", "🧹", "🧺", "🧻", "🧼",
      "📱", "💻", "📷", "📸", "☎️", "📧", "💬", "🗨️", "📅", "⏰",
      "⌛", "💡", "🔦", "🎁", "🎈", "🎉", "🎊", "🏆", "🥇", "⭐",
      "💰", "💳", "🧾", "⚠️", "♻️", "▶️", "⏸️", "⬆️", "⬇️", "➡️",
      "⬅️", "↩️", "🔄", "➕", "➖", "✔️", "➗", "©️", "™️", "ℹ️",
    ],
  },
] as const;

type EmojiCategoryId = (typeof emojiCategories)[number]["id"];

const initials = (name: string) =>
  name
    .split(/\s+/)
    .filter(Boolean)
    .slice(0, 2)
    .map((part) => part[0]?.toUpperCase())
    .join("");

const formatRelativeTime = (value: string) => {
  const date = new Date(value);
  const now = new Date();
  if (Number.isNaN(date.getTime())) return "";
  if (date.toDateString() === now.toDateString()) {
    return new Intl.DateTimeFormat("en", {
      hour: "2-digit",
      minute: "2-digit",
    }).format(date);
  }
  const yesterday = new Date(now);
  yesterday.setDate(now.getDate() - 1);
  if (date.toDateString() === yesterday.toDateString()) return "Yesterday";
  return new Intl.DateTimeFormat("en", {
    day: "numeric",
    month: "short",
  }).format(date);
};

const formatMessageTime = (value: string) =>
  new Intl.DateTimeFormat("en", {
    hour: "2-digit",
    minute: "2-digit",
  }).format(new Date(value));

const formatStayDates = (conversation: MessageConversation) => {
  const checkIn = new Date(conversation.booking.checkIn);
  const checkOut = new Date(conversation.booking.checkOut);
  const start = new Intl.DateTimeFormat("en", {
    day: "numeric",
    month: "short",
  }).format(checkIn);
  const end = new Intl.DateTimeFormat("en", {
    day: "numeric",
    month: "short",
  }).format(checkOut);
  return `${start} – ${end}`;
};

const guestCount = (conversation: MessageConversation) => {
  const { adults, children, infants } = conversation.booking.numOfGuests;
  return adults + children + infants;
};

const Messages = () => {
  const reduceMotion = useReducedMotion();
  const { user, loading: authLoading } = useAuth();
  const {
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
  } = useMessages();
  const [searchParams] = useSearchParams();
  const bookingId = searchParams.get("booking");
  const bookingHandled = useRef<string | null>(null);
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const messagesScrollRef = useRef<HTMLDivElement>(null);
  const textareaRef = useRef<HTMLTextAreaElement>(null);
  const emojiPanelRef = useRef<HTMLDivElement>(null);
  const emojiButtonRef = useRef<HTMLButtonElement>(null);
  const typingStopTimer = useRef<number | null>(null);
  const typingActive = useRef(false);
  const preservingOlderScroll = useRef(false);
  const stickToBottom = useRef(true);
  const [selectedId, setSelectedId] = useState("");
  const [filter, setFilter] = useState<ConversationFilter>("all");
  const [query, setQuery] = useState("");
  const [draft, setDraft] = useState("");
  const [emojiOpen, setEmojiOpen] = useState(false);
  const [activeEmojiCategory, setActiveEmojiCategory] =
    useState<EmojiCategoryId>("smileys");
  const [mobileChatOpen, setMobileChatOpen] = useState(false);
  const [openingConversation, setOpeningConversation] = useState(false);
  const [sending, setSending] = useState(false);
  const [prependingHistory, setPrependingHistory] = useState(false);
  const selectedEmojiCategory =
    emojiCategories.find(
      (category) => category.id === activeEmojiCategory,
    ) ?? emojiCategories[0];

  useEffect(() => {
    if (!bookingId || !user || bookingHandled.current === bookingId) return;
    bookingHandled.current = bookingId;
    setOpeningConversation(true);
    createForBooking(bookingId)
      .then((conversation) => {
        setSelectedId(conversation._id);
        setMobileChatOpen(true);
      })
      .catch((cause) => {
        bookingHandled.current = null;
        toast.error(
          getErrorMessage(cause, "Could not open this conversation"),
        );
      })
      .finally(() => setOpeningConversation(false));
  }, [bookingId, createForBooking, user]);

  useEffect(() => {
    if (!selectedId && conversations[0]) {
      setSelectedId(conversations[0]._id);
    }
  }, [conversations, selectedId]);

  const selectedConversation =
    conversations.find((conversation) => conversation._id === selectedId) ??
    null;
  const messages = selectedConversation
    ? messagesByConversation[selectedConversation._id] ?? []
    : [];
  const otherParticipantTyping = selectedConversation
    ? Boolean(typingByConversation[selectedConversation._id])
    : false;
  const hasMoreMessages = selectedConversation
    ? Boolean(hasMoreByConversation[selectedConversation._id])
    : false;
  const loadingOlderMessages = selectedConversation
    ? Boolean(loadingOlderByConversation[selectedConversation._id])
    : false;

  useEffect(() => {
    if (!preservingOlderScroll.current && stickToBottom.current) {
      messagesEndRef.current?.scrollIntoView?.({ block: "end" });
    }
  }, [messages.length, otherParticipantTyping, selectedId]);

  useEffect(() => {
    if (!selectedId) return;
    void loadMessages(selectedId).catch((cause) => {
      toast.error(getErrorMessage(cause, "Could not load messages"));
    });
  }, [loadMessages, selectedId]);

  useEffect(() => {
    if (!selectedConversation?.unreadCount) return;
    void markRead(selectedConversation._id).catch(() => undefined);
  }, [markRead, selectedConversation]);

  useEffect(() => {
    stickToBottom.current = true;
    window.requestAnimationFrame(() => {
      messagesEndRef.current?.scrollIntoView?.({ block: "end" });
    });
    setDraft("");
    setEmojiOpen(false);
    return () => {
      if (typingStopTimer.current !== null) {
        window.clearTimeout(typingStopTimer.current);
        typingStopTimer.current = null;
      }
      if (typingActive.current && selectedId) {
        void setTyping(selectedId, false).catch(() => undefined);
      }
      typingActive.current = false;
    };
  }, [selectedId, setTyping]);

  useEffect(() => {
    if (!emojiOpen) return;
    const closeOnOutsideClick = (event: PointerEvent) => {
      const target = event.target as Node;
      if (
        emojiPanelRef.current?.contains(target) ||
        emojiButtonRef.current?.contains(target)
      ) {
        return;
      }
      setEmojiOpen(false);
    };
    const closeOnEscape = (event: KeyboardEvent) => {
      if (event.key === "Escape") setEmojiOpen(false);
    };
    document.addEventListener("pointerdown", closeOnOutsideClick);
    document.addEventListener("keydown", closeOnEscape);
    return () => {
      document.removeEventListener("pointerdown", closeOnOutsideClick);
      document.removeEventListener("keydown", closeOnEscape);
    };
  }, [emojiOpen]);

  const visibleConversations = useMemo(() => {
    const normalizedQuery = query.trim().toLowerCase();
    return conversations.filter((conversation) => {
      const matchesFilter =
        filter === "all" ||
        (filter === "unread" && conversation.unreadCount > 0) ||
        conversation.kind === filter;
      const matchesQuery =
        !normalizedQuery ||
        conversation.otherParticipant.name
          .toLowerCase()
          .includes(normalizedQuery) ||
        conversation.booking.place.title
          .toLowerCase()
          .includes(normalizedQuery) ||
        conversation.booking.place.address
          .toLowerCase()
          .includes(normalizedQuery);
      return matchesFilter && matchesQuery;
    });
  }, [conversations, filter, query]);

  const selectConversation = (id: string) => {
    setSelectedId(id);
    setMobileChatOpen(true);
  };

  const handleLoadOlderMessages = async () => {
    if (
      !selectedConversation ||
      !hasMoreMessages ||
      loadingOlderMessages
    ) {
      return;
    }
    const container = messagesScrollRef.current;
    const previousHeight = container?.scrollHeight ?? 0;
    const previousTop = container?.scrollTop ?? 0;
    preservingOlderScroll.current = true;
    setPrependingHistory(true);
    try {
      await loadOlderMessages(selectedConversation._id);
      window.requestAnimationFrame(() => {
        const currentContainer = messagesScrollRef.current;
        if (currentContainer) {
          currentContainer.scrollTop =
            previousTop + (currentContainer.scrollHeight - previousHeight);
        }
        preservingOlderScroll.current = false;
        setPrependingHistory(false);
      });
    } catch (cause) {
      preservingOlderScroll.current = false;
      setPrependingHistory(false);
      toast.error(getErrorMessage(cause, "Could not load older messages"));
    }
  };

  const stopTyping = (conversationId: string) => {
    if (typingStopTimer.current !== null) {
      window.clearTimeout(typingStopTimer.current);
      typingStopTimer.current = null;
    }
    if (!typingActive.current) return;
    typingActive.current = false;
    void setTyping(conversationId, false).catch(() => undefined);
  };

  const updateDraft = (value: string) => {
    setDraft(value);
    if (!selectedConversation) return;
    const conversationId = selectedConversation._id;
    if (!value.trim()) {
      stopTyping(conversationId);
      return;
    }
    if (!typingActive.current) {
      typingActive.current = true;
      void setTyping(conversationId, true).catch(() => undefined);
    }
    if (typingStopTimer.current !== null) {
      window.clearTimeout(typingStopTimer.current);
    }
    typingStopTimer.current = window.setTimeout(() => {
      typingStopTimer.current = null;
      stopTyping(conversationId);
    }, 1_400);
  };

  const addEmoji = (emoji: string) => {
    if (draft.length + emoji.length > 2000) return;
    const textarea = textareaRef.current;
    const start = textarea?.selectionStart ?? draft.length;
    const end = textarea?.selectionEnd ?? draft.length;
    const next = `${draft.slice(0, start)}${emoji}${draft.slice(end)}`;
    updateDraft(next);
    window.requestAnimationFrame(() => {
      textareaRef.current?.focus();
      const cursor = start + emoji.length;
      textareaRef.current?.setSelectionRange(cursor, cursor);
    });
  };

  const handleSend = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    const body = draft.trim();
    if (!body || !selectedConversation || sending) return;
    stopTyping(selectedConversation._id);
    try {
      setSending(true);
      await sendMessage(selectedConversation._id, body);
      setDraft("");
    } catch (cause) {
      toast.error(getErrorMessage(cause, "Could not send your message"));
    } finally {
      setSending(false);
    }
  };

  if (authLoading) {
    return (
      <main className="mx-auto grid min-h-[32rem] max-w-7xl place-items-center px-4">
        <LoaderCircle className="size-9 animate-spin text-rose-500" />
      </main>
    );
  }

  if (!user) {
    return (
      <main className="mx-auto grid min-h-[34rem] max-w-4xl place-items-center px-4 py-12">
        <section className="w-full rounded-[2rem] border border-slate-200 bg-white p-8 text-center shadow-xl shadow-slate-200/60 sm:p-12">
          <span className="mx-auto grid size-16 place-items-center rounded-2xl bg-rose-50 text-rose-500">
            <MessageCircle className="size-8" />
          </span>
          <h1 className="mt-6 text-3xl font-semibold tracking-tight text-slate-950">
            Sign in to view your messages
          </h1>
          <p className="mx-auto mt-3 max-w-md text-sm leading-6 text-slate-500">
            Your private conversations with hosts and guests will appear here.
          </p>
          <Link
            to="/"
            className="mt-7 inline-flex rounded-full bg-slate-950 px-6 py-3 text-sm font-bold text-white transition hover:bg-emerald-700"
          >
            Return home
          </Link>
        </section>
      </main>
    );
  }

  return (
    <main className="bg-gradient-to-b from-slate-50 to-white px-3 py-6 sm:px-6 sm:py-10 lg:px-8">
      <div className="mx-auto max-w-7xl">
        <header className="mb-6 flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">
          <div>
            <div className="flex items-center gap-2 text-sm font-bold uppercase tracking-[0.16em] text-emerald-700">
              <Inbox className="size-4" />
              Your inbox
            </div>
            <h1 className="mt-2 text-3xl font-semibold tracking-tight text-slate-950 sm:text-4xl">
              Messages
            </h1>
            <p className="mt-2 text-sm text-slate-500">
              Keep every stay organised in one private conversation.
            </p>
          </div>
          {unreadTotal > 0 && (
            <span className="inline-flex w-fit items-center gap-2 rounded-full bg-emerald-50 px-4 py-2 text-sm font-semibold text-emerald-700 ring-1 ring-emerald-100">
              <span className="size-2 rounded-full bg-emerald-500" />
              {unreadTotal} unread
            </span>
          )}
        </header>

        <section className="grid min-h-[38rem] overflow-hidden rounded-[1.75rem] border border-slate-200 bg-white shadow-[0_24px_80px_-34px_rgba(15,23,42,0.35)] md:h-[min(44rem,calc(100vh-10rem))] md:grid-cols-[23rem_minmax(0,1fr)]">
          <aside
            aria-label="Conversations"
            className={`${mobileChatOpen ? "hidden" : "flex"} min-h-[38rem] flex-col border-slate-200 md:flex md:min-h-0 md:border-r`}
          >
            <div className="border-b border-slate-100 p-4">
              <label className="relative block">
                <span className="sr-only">Search messages</span>
                <Search className="absolute left-3.5 top-1/2 size-4 -translate-y-1/2 text-slate-400" />
                <input
                  value={query}
                  onChange={(event) => setQuery(event.target.value)}
                  placeholder="Search messages"
                  className="w-full rounded-xl border border-slate-200 bg-slate-50 py-3 pl-10 pr-4 text-sm outline-none transition placeholder:text-slate-400 focus:border-emerald-400 focus:bg-white focus:ring-4 focus:ring-emerald-50"
                />
              </label>
              <div
                aria-label="Filter conversations"
                className="scrollbar-none mt-3 flex gap-2 overflow-x-auto"
              >
                {filters.map((item) => (
                  <button
                    key={item.id}
                    type="button"
                    aria-pressed={filter === item.id}
                    onClick={() => setFilter(item.id)}
                    className={`shrink-0 rounded-full px-3.5 py-2 text-xs font-bold transition ${
                      filter === item.id
                        ? "bg-slate-950 text-white"
                        : "bg-slate-100 text-slate-600 hover:bg-slate-200"
                    }`}
                  >
                    {item.label}
                  </button>
                ))}
              </div>
            </div>

            <div className="scrollbar-none flex-1 overflow-y-auto p-2">
              {loading || openingConversation ? (
                <div className="grid h-full min-h-64 place-items-center">
                  <span className="inline-flex items-center gap-2 text-sm font-semibold text-slate-500">
                    <LoaderCircle className="size-5 animate-spin" />
                    Loading conversations…
                  </span>
                </div>
              ) : error ? (
                <div className="grid h-full min-h-64 place-items-center px-6 text-center">
                  <div>
                    <RefreshCw className="mx-auto size-8 text-rose-400" />
                    <p className="mt-3 font-semibold text-slate-800">
                      Could not load conversations
                    </p>
                    <button
                      type="button"
                      onClick={() => void refresh()}
                      className="mt-4 rounded-full bg-slate-950 px-4 py-2 text-xs font-bold text-white"
                    >
                      Try again
                    </button>
                  </div>
                </div>
              ) : visibleConversations.length > 0 ? (
                visibleConversations.map((conversation) => (
                  <button
                    key={conversation._id}
                    type="button"
                    onClick={() => selectConversation(conversation._id)}
                    className={`group flex w-full items-start gap-3 rounded-2xl p-3 text-left transition ${
                      conversation._id === selectedConversation?._id
                        ? "bg-emerald-50"
                        : "hover:bg-slate-50"
                    }`}
                  >
                    {conversation.otherParticipant.avatar ? (
                      <img
                        src={conversation.otherParticipant.avatar}
                        alt=""
                        className="size-12 shrink-0 rounded-full object-cover shadow-sm"
                      />
                    ) : (
                      <span className="grid size-12 shrink-0 place-items-center rounded-full bg-gradient-to-br from-rose-400 to-orange-300 text-sm font-black text-white">
                        {initials(conversation.otherParticipant.name)}
                      </span>
                    )}
                    <span className="min-w-0 flex-1">
                      <span className="flex items-center justify-between gap-2">
                        <span className="truncate font-semibold text-slate-950">
                          {conversation.otherParticipant.name}
                        </span>
                        <span className="shrink-0 text-[0.7rem] text-slate-400">
                          {formatRelativeTime(conversation.lastMessageAt)}
                        </span>
                      </span>
                      <span className="mt-0.5 block truncate text-xs font-medium text-slate-500">
                        {conversation.booking.place.title}
                      </span>
                      <span className="mt-1 flex items-center gap-2">
                        <span
                          className={`min-w-0 flex-1 truncate text-sm ${
                            conversation.unreadCount > 0
                              ? "font-semibold text-slate-900"
                              : "text-slate-500"
                          }`}
                        >
                          {conversation.lastMessageText ||
                            "Start the conversation"}
                        </span>
                        {conversation.unreadCount > 0 && (
                          <span className="grid size-5 shrink-0 place-items-center rounded-full bg-rose-500 text-[0.65rem] font-black text-white">
                            {conversation.unreadCount}
                          </span>
                        )}
                      </span>
                    </span>
                    <ChevronRight className="mt-4 size-4 shrink-0 text-slate-300 md:hidden" />
                  </button>
                ))
              ) : (
                <div className="grid h-full min-h-64 place-items-center px-6 text-center">
                  <div>
                    <MessageCircle className="mx-auto size-9 text-slate-300" />
                    <p className="mt-3 font-semibold text-slate-700">
                      {conversations.length === 0
                        ? "No conversations yet"
                        : "No conversations found"}
                    </p>
                    <p className="mt-1 text-sm leading-6 text-slate-400">
                      {conversations.length === 0
                        ? "Open a reservation and message its host or guest."
                        : "Try another name or filter."}
                    </p>
                  </div>
                </div>
              )}
            </div>
          </aside>

          {selectedConversation ? (
            <article
              aria-label={`Conversation with ${selectedConversation.otherParticipant.name}`}
              className={`${mobileChatOpen ? "flex" : "hidden"} min-h-[38rem] min-w-0 flex-col md:flex md:min-h-0`}
            >
              <div className="flex items-center gap-3 border-b border-slate-100 px-4 py-3.5 sm:px-5">
                <button
                  type="button"
                  aria-label="Back to conversations"
                  onClick={() => setMobileChatOpen(false)}
                  className="grid size-9 shrink-0 place-items-center rounded-full text-slate-600 transition hover:bg-slate-100 md:hidden"
                >
                  <ArrowLeft className="size-5" />
                </button>
                {selectedConversation.otherParticipant.avatar ? (
                  <img
                    src={selectedConversation.otherParticipant.avatar}
                    alt=""
                    className="size-10 shrink-0 rounded-full object-cover"
                  />
                ) : (
                  <span className="grid size-10 shrink-0 place-items-center rounded-full bg-gradient-to-br from-rose-400 to-orange-300 text-xs font-black text-white">
                    {initials(selectedConversation.otherParticipant.name)}
                  </span>
                )}
                <div className="min-w-0 flex-1">
                  <h2 className="truncate font-semibold text-slate-950">
                    {selectedConversation.otherParticipant.name}
                  </h2>
                  <p className="flex items-center gap-1.5 text-xs text-emerald-700">
                    <ShieldCheck className="size-3.5" />
                    Private booking conversation
                  </p>
                </div>
                <Link
                  to={
                    selectedConversation.kind === "hosting" ? "/host" : "/trips"
                  }
                  className="hidden items-center gap-1.5 rounded-full border border-slate-200 px-3.5 py-2 text-xs font-bold text-slate-700 transition hover:border-slate-950 hover:bg-slate-950 hover:text-white sm:inline-flex"
                >
                  View booking
                  <ArrowUpRight className="size-3.5" />
                </Link>
              </div>

              <div className="border-b border-slate-100 bg-slate-50/80 p-3 sm:p-4">
                <div className="flex items-center gap-3 rounded-2xl border border-slate-200 bg-white p-3 shadow-sm">
                  {selectedConversation.booking.place.photos[0]?.main ? (
                    <img
                      src={selectedConversation.booking.place.photos[0].main}
                      alt=""
                      className="size-16 shrink-0 rounded-xl object-cover"
                    />
                  ) : (
                    <span className="grid size-16 shrink-0 place-items-center rounded-xl bg-emerald-50 text-emerald-700">
                      <House className="size-6" />
                    </span>
                  )}
                  <div className="min-w-0 flex-1">
                    <div className="flex flex-wrap items-center gap-2">
                      <p className="truncate text-sm font-bold text-slate-950">
                        {selectedConversation.booking.place.title}
                      </p>
                      <span
                        className={`rounded-full px-2 py-1 text-[0.65rem] font-black uppercase tracking-wide ${
                          selectedConversation.booking.status === "confirmed"
                            ? "bg-emerald-100 text-emerald-700"
                            : selectedConversation.booking.status === "pending"
                              ? "bg-amber-100 text-amber-700"
                              : "bg-rose-100 text-rose-700"
                        }`}
                      >
                        {selectedConversation.booking.status}
                      </span>
                    </div>
                    <p className="mt-1 flex items-center gap-1 text-xs text-slate-500">
                      <MapPin className="size-3" />
                      {selectedConversation.booking.place.address}
                    </p>
                    <div className="mt-1.5 flex flex-wrap gap-x-4 gap-y-1 text-xs font-medium text-slate-600">
                      <span className="flex items-center gap-1">
                        <CalendarDays className="size-3.5" />
                        {formatStayDates(selectedConversation)}
                      </span>
                      <span className="flex items-center gap-1">
                        <Users className="size-3.5" />
                        {guestCount(selectedConversation)} guests
                      </span>
                    </div>
                  </div>
                </div>
              </div>

              <div
                ref={messagesScrollRef}
                onScroll={(event) => {
                  const container = event.currentTarget;
                  stickToBottom.current =
                    container.scrollHeight -
                      container.scrollTop -
                      container.clientHeight <
                    120;
                  if (
                    container.scrollTop < 80 &&
                    hasMoreMessages &&
                    !loadingOlderMessages
                  ) {
                    void handleLoadOlderMessages();
                  }
                }}
                className="scrollbar-none flex-1 space-y-4 overflow-y-auto bg-white p-4 sm:p-6"
              >
                {messages.length > 0 && (
                  <div className="flex min-h-8 items-center justify-center">
                    {hasMoreMessages ? (
                      <button
                        type="button"
                        disabled={loadingOlderMessages}
                        onClick={() => void handleLoadOlderMessages()}
                        className="inline-flex items-center gap-2 rounded-full bg-slate-100 px-4 py-2 text-xs font-bold text-slate-600 transition hover:bg-emerald-50 hover:text-emerald-700 disabled:cursor-wait disabled:opacity-70"
                      >
                        {loadingOlderMessages && (
                          <LoaderCircle className="size-3.5 animate-spin" />
                        )}
                        {loadingOlderMessages
                          ? "Loading history…"
                          : "Load older messages"}
                      </button>
                    ) : (
                      <div className="flex w-full items-center gap-3 text-[0.65rem] font-bold uppercase tracking-[0.14em] text-slate-400">
                        <span className="h-px flex-1 bg-slate-100" />
                        Beginning of conversation
                        <span className="h-px flex-1 bg-slate-100" />
                      </div>
                    )}
                  </div>
                )}
                {messages.length === 0 && !otherParticipantTyping && (
                  <div className="grid h-full min-h-48 place-items-center text-center">
                    <div>
                      <MessageCircle className="mx-auto size-9 text-emerald-500" />
                      <p className="mt-3 font-semibold text-slate-800">
                        Start the conversation
                      </p>
                      <p className="mt-1 max-w-sm text-sm leading-6 text-slate-500">
                        Coordinate arrival, check-in and anything needed for
                        this stay.
                      </p>
                    </div>
                  </div>
                )}
                <AnimatePresence initial={false}>
                  {messages.map((message) => {
                    const mine = message.sender._id === user._id;
                    return (
                      <motion.div
                        layout={
                          prependingHistory ? false : "position"
                        }
                        key={message._id}
                        initial={
                          prependingHistory
                            ? { opacity: 1 }
                            : reduceMotion
                            ? { opacity: 0 }
                            : {
                                opacity: 0,
                                x: mine ? 14 : -14,
                                y: 10,
                                scale: 0.96,
                              }
                        }
                        animate={{ opacity: 1, x: 0, y: 0, scale: 1 }}
                        exit={
                          reduceMotion
                            ? { opacity: 0 }
                            : { opacity: 0, y: -6, scale: 0.98 }
                        }
                        transition={
                          prependingHistory
                            ? { duration: 0 }
                            : reduceMotion
                            ? { duration: 0.12 }
                            : {
                                type: "spring",
                                stiffness: 380,
                                damping: 28,
                                mass: 0.65,
                              }
                        }
                        className={`flex ${mine ? "justify-end" : "justify-start"}`}
                      >
                        <motion.div
                          whileHover={
                            reduceMotion ? undefined : { scale: 1.012 }
                          }
                          transition={{ duration: 0.15 }}
                          className={`max-w-[85%] rounded-2xl px-4 py-3 text-sm leading-6 shadow-sm sm:max-w-[70%] ${
                            mine
                              ? "rounded-br-md bg-slate-950 text-white shadow-slate-950/10"
                              : "rounded-bl-md bg-slate-100 text-slate-700 shadow-slate-200/60"
                          }`}
                        >
                          <p>{message.body}</p>
                          <p className="mt-1 text-[0.65rem] text-slate-400">
                            {formatMessageTime(message.createdAt)}
                          </p>
                        </motion.div>
                      </motion.div>
                    );
                  })}
                  {otherParticipantTyping && (
                    <motion.div
                      key="typing-indicator"
                      initial={
                        reduceMotion
                          ? { opacity: 0 }
                          : { opacity: 0, x: -10, y: 6, scale: 0.94 }
                      }
                      animate={{ opacity: 1, x: 0, y: 0, scale: 1 }}
                      exit={
                        reduceMotion
                          ? { opacity: 0 }
                          : { opacity: 0, x: -6, scale: 0.96 }
                      }
                      transition={{ duration: reduceMotion ? 0.1 : 0.22 }}
                      className="flex justify-start"
                      aria-label={`${selectedConversation.otherParticipant.name} is typing`}
                    >
                      <div className="flex items-center gap-1 rounded-2xl rounded-bl-md bg-slate-100 px-4 py-3 shadow-sm shadow-slate-200/60">
                        <span className="size-2 animate-bounce rounded-full bg-slate-400 [animation-delay:-0.3s]" />
                        <span className="size-2 animate-bounce rounded-full bg-slate-400 [animation-delay:-0.15s]" />
                        <span className="size-2 animate-bounce rounded-full bg-slate-400" />
                      </div>
                    </motion.div>
                  )}
                </AnimatePresence>
                <div ref={messagesEndRef} />
              </div>

              <form
                onSubmit={(event) => void handleSend(event)}
                className="relative border-t border-slate-100 bg-white p-3 sm:p-4"
              >
                {emojiOpen && (
                  <div
                    ref={emojiPanelRef}
                    role="dialog"
                    aria-label="Emoji picker"
                    className="absolute bottom-[5.5rem] left-3 z-20 w-[min(26rem,calc(100%-1.5rem))] overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-2xl sm:left-4"
                  >
                    <div className="flex items-center justify-between border-b border-slate-100 px-4 py-3">
                      <div>
                        <p className="text-sm font-bold text-slate-800">
                          Emojis
                        </p>
                        <p className="mt-0.5 text-[0.65rem] text-slate-400">
                          {selectedEmojiCategory.label} ·{" "}
                          {selectedEmojiCategory.emojis.length} options
                        </p>
                      </div>
                      <button
                        type="button"
                        onClick={() => setEmojiOpen(false)}
                        className="rounded-full px-2 py-1 text-xs font-semibold text-slate-500 hover:bg-slate-100"
                      >
                        Close
                      </button>
                    </div>
                    <div
                      role="tablist"
                      aria-label="Emoji categories"
                      className="grid grid-cols-6 border-b border-slate-100 bg-slate-50/80 p-1.5"
                    >
                      {emojiCategories.map((category) => (
                        <button
                          key={category.id}
                          type="button"
                          role="tab"
                          aria-selected={category.id === activeEmojiCategory}
                          aria-label={category.label}
                          title={category.label}
                          onClick={() => setActiveEmojiCategory(category.id)}
                          className={`flex flex-col items-center gap-0.5 rounded-lg px-1 py-1.5 transition ${
                            category.id === activeEmojiCategory
                              ? "bg-white text-slate-950 shadow-sm ring-1 ring-slate-200"
                              : "text-slate-500 hover:bg-white hover:text-slate-800"
                          }`}
                        >
                          <span className="text-lg leading-none">
                            {category.icon}
                          </span>
                          <span className="hidden text-[0.58rem] font-semibold sm:block">
                            {category.label}
                          </span>
                        </button>
                      ))}
                    </div>
                    <div
                      role="tabpanel"
                      aria-label={`${selectedEmojiCategory.label} emojis`}
                      className="scrollbar-none grid max-h-60 grid-cols-8 gap-1 overflow-y-auto p-3 sm:grid-cols-10"
                    >
                      {selectedEmojiCategory.emojis.map((emoji) => (
                        <button
                          key={`${selectedEmojiCategory.id}-${emoji}`}
                          type="button"
                          aria-label={`Add ${emoji}`}
                          onClick={() => addEmoji(emoji)}
                          className="grid aspect-square place-items-center rounded-lg text-xl transition hover:scale-110 hover:bg-emerald-50 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-emerald-500"
                        >
                          {emoji}
                        </button>
                      ))}
                    </div>
                  </div>
                )}
                <div className="flex items-end gap-2 rounded-2xl border border-slate-200 bg-slate-50 p-2 transition focus-within:border-emerald-400 focus-within:bg-white focus-within:ring-4 focus-within:ring-emerald-50">
                  <button
                    ref={emojiButtonRef}
                    type="button"
                    aria-label="Open emoji picker"
                    aria-expanded={emojiOpen}
                    onClick={() => setEmojiOpen((open) => !open)}
                    className="grid size-11 shrink-0 place-items-center rounded-xl text-slate-500 transition hover:bg-emerald-50 hover:text-emerald-700"
                  >
                    <Smile className="size-5" />
                  </button>
                  <label className="min-w-0 flex-1">
                    <span className="sr-only">Write a message</span>
                    <textarea
                      ref={textareaRef}
                      value={draft}
                      maxLength={2000}
                      onChange={(event) => updateDraft(event.target.value)}
                      onKeyDown={(event) => {
                        if (event.key === "Enter" && !event.shiftKey) {
                          event.preventDefault();
                          event.currentTarget.form?.requestSubmit();
                        }
                      }}
                      rows={1}
                      placeholder={`Message ${selectedConversation.otherParticipant.name}`}
                      className="max-h-28 min-h-11 w-full resize-none bg-transparent px-3 py-2.5 text-sm outline-none placeholder:text-slate-400"
                    />
                  </label>
                  <button
                    type="submit"
                    aria-label="Send message"
                    disabled={!draft.trim() || sending}
                    className="grid size-11 shrink-0 place-items-center rounded-xl bg-rose-500 text-white shadow-md shadow-rose-500/20 transition hover:bg-rose-600 disabled:cursor-not-allowed disabled:bg-slate-200 disabled:text-slate-400 disabled:shadow-none"
                  >
                    {sending ? (
                      <LoaderCircle className="size-4 animate-spin" />
                    ) : (
                      <Send className="size-4" />
                    )}
                  </button>
                </div>
                <p className="mt-2 hidden items-center justify-center gap-1.5 text-[0.68rem] text-slate-400 sm:flex">
                  <House className="size-3" />
                  Keep payments and important details inside Flypnp.
                </p>
              </form>
            </article>
          ) : (
            <div className="hidden min-h-[38rem] place-items-center bg-slate-50/50 px-8 text-center md:grid">
              <div>
                <MessageCircle className="mx-auto size-12 text-slate-300" />
                <h2 className="mt-4 text-xl font-semibold text-slate-800">
                  Select a conversation
                </h2>
                <p className="mt-2 max-w-sm text-sm leading-6 text-slate-500">
                  Messages are available from each guest or host reservation.
                </p>
              </div>
            </div>
          )}
        </section>

        <div className="mt-4 flex items-center justify-center gap-2 text-xs text-slate-400">
          <CircleUserRound className="size-4" />
          Signed in as {user.name}
        </div>
      </div>
    </main>
  );
};

export default Messages;
