import { useMemo, useState } from "react";
import { Link } from "react-router-dom";
import { AnimatePresence, motion } from "framer-motion";
import {
  ArrowRight,
  Bell,
  CalendarDays,
  ChevronDown,
  Gift,
  Heart,
  HelpCircle,
  Home,
  LifeBuoy,
  MessageSquareText,
  Search,
  Sparkles,
  WalletCards,
} from "lucide-react";
import { categories } from "../../types/helpCenter.types";
import { CONTACT_GMAIL_COMPOSE_URL } from "../../config/contact";

const quickLinks = [
  { label: "Gift cards", href: "/gift-cards", icon: WalletCards },
  { label: "Trips", href: "/trips", icon: CalendarDays },
  { label: "Wishlists", href: "/wishlist", icon: Heart },
  { label: "Notifications", href: "/notifications", icon: Bell },
  { label: "Messages", href: "/messages", icon: MessageSquareText },
  { label: "List your home", href: "/host", icon: Home },
];

const contactOptions = [
  {
    title: "Email us",
    description: "Talk to us about any booking or account question.",
    href: CONTACT_GMAIL_COMPOSE_URL,
    icon: MessageSquareText,
    external: true,
  },
  {
    title: "Gift card help",
    description: "Buy, redeem or track a gift card code.",
    href: "/gift-cards",
    icon: Gift,
    external: false,
  },
  {
    title: "Check notifications",
    description: "Find updates about your bookings and gift cards.",
    href: "/notifications",
    icon: Bell,
    external: false,
  },
];

const normalize = (value: string) => value.toLowerCase();

const HelpCenter = () => {
  const [query, setQuery] = useState("");
  const [openFaq, setOpenFaq] = useState<string | null>(null);

  const filtered = useMemo(() => {
    const terms = normalize(query).trim().split(/\s+/).filter(Boolean);
    if (terms.length === 0) return categories;
    return categories
      .map((category) => ({
        ...category,
        faqs: category.faqs.filter((faq) => {
          const haystack = normalize(
            `${category.label} ${faq.question} ${faq.answer}`,
          );
          return terms.every((term) => haystack.includes(term));
        }),
      }))
      .filter((category) => category.faqs.length > 0);
  }, [query]);

  const totalMatches = filtered.reduce(
    (count, category) => count + category.faqs.length,
    0,
  );

  return (
    <main className="min-h-screen bg-[#f7f9f8] pb-20">
      <section className="overflow-hidden relative px-4 py-16 text-white bg-slate-950 sm:px-6 sm:py-20">
        <div className="absolute -right-24 -top-28 rounded-full blur-3xl size-96 bg-rose-500/20" />
        <div className="absolute -bottom-36 left-1/4 rounded-full blur-3xl size-96 bg-emerald-400/15" />
        <motion.div
          initial={{ opacity: 0, y: 18 }}
          animate={{ opacity: 1, y: 0 }}
          className="relative mx-auto max-w-6xl"
        >
          <span className="inline-flex items-center gap-2 rounded-full bg-white/10 px-3 py-1.5 text-xs font-bold uppercase tracking-[0.16em] text-emerald-300 ring-1 ring-white/10">
            <LifeBuoy className="size-3.5" /> We&apos;re here to help
          </span>
          <h1 className="mt-6 max-w-3xl text-4xl font-semibold tracking-[-0.05em] sm:text-6xl">
            How can we help?
          </h1>
          <p className="mt-4 max-w-xl text-sm leading-6 text-slate-300 sm:text-base">
            Answers about bookings, gift cards, your balance and more. Search
            below or browse the topics.
          </p>
          <div className="relative mt-8 max-w-xl">
            <Search className="absolute left-5 top-1/2 -translate-y-1/2 size-5 text-slate-400" />
            <input
              value={query}
              onChange={(event) => {
                setQuery(event.target.value);
                setOpenFaq(null);
              }}
              placeholder="Search for answers…"
              aria-label="Search the help center"
              className="py-4 pr-14 pl-12 w-full text-sm text-white rounded-full border backdrop-blur outline-none border-white/15 bg-white/10 placeholder:text-slate-400 focus:border-emerald-400 focus:ring-4 focus:ring-emerald-400/20"
            />
            {query && (
              <span className="absolute right-5 top-1/2 text-xs font-semibold -translate-y-1/2 text-slate-300">
                {totalMatches === 1 ? "1 result" : `${totalMatches} results`}
              </span>
            )}
          </div>
        </motion.div>
      </section>

      <div className="px-4 py-10 mx-auto max-w-6xl sm:px-6">
        <nav aria-label="Quick links" className="flex flex-wrap gap-2.5">
          {quickLinks.map((link) => (
            <Link
              key={link.href}
              to={link.href}
              className="inline-flex items-center gap-2 rounded-full border border-slate-200 bg-white px-4 py-2.5 text-xs font-semibold text-slate-700 shadow-sm transition hover:-translate-y-0.5 hover:border-emerald-300 hover:text-emerald-800 hover:shadow-md"
            >
              <link.icon className="text-emerald-700 size-4" />
              {link.label}
            </Link>
          ))}
        </nav>

        <div className="mt-10 grid gap-6 lg:grid-cols-[minmax(0,1.35fr)_minmax(18rem,.65fr)]">
          <section className="space-y-6">
            {filtered.map((category, categoryIndex) => (
              <article
                key={category.id}
                className="rounded-[2rem] border border-slate-200 bg-white p-5 shadow-sm sm:p-7"
              >
                <div className="flex gap-3 items-center mb-5">
                  <span className="grid place-items-center text-emerald-700 bg-emerald-50 rounded-2xl size-11 shrink-0">
                    <category.icon className="size-5" />
                  </span>
                  <div>
                    <p className="text-xs font-bold uppercase tracking-[0.16em] text-emerald-700">
                      Topic {String(categoryIndex + 1).padStart(2, "0")}
                    </p>
                    <h2 className="text-lg font-semibold text-slate-950">
                      {category.label}
                    </h2>
                  </div>
                </div>
                <div className="divide-y divide-slate-100">
                  {category.faqs.map((faq) => {
                    const faqKey = `${category.id}:${faq.question}`;
                    const isOpen = openFaq === faqKey;
                    return (
                      <div key={faqKey}>
                        <button
                          type="button"
                          onClick={() => setOpenFaq(isOpen ? null : faqKey)}
                          aria-expanded={isOpen}
                          className="flex gap-4 justify-between items-center py-4 w-full text-left"
                        >
                          <span className="flex gap-3 items-center text-sm font-semibold text-slate-800">
                            <HelpCircle className="size-4 shrink-0 text-slate-300" />
                            {faq.question}
                          </span>
                          <ChevronDown
                            className={`size-4 shrink-0 text-slate-400 transition-transform duration-200 ${isOpen ? "text-emerald-700 rotate-180" : ""}`}
                          />
                        </button>
                        <AnimatePresence initial={false}>
                          {isOpen && (
                            <motion.div
                              initial={{ height: 0, opacity: 0 }}
                              animate={{ height: "auto", opacity: 1 }}
                              exit={{ height: 0, opacity: 0 }}
                              transition={{ duration: 0.2 }}
                              className="overflow-hidden"
                            >
                              <p className="pb-5 pl-7 text-sm leading-6 text-slate-600">
                                {faq.answer}
                              </p>
                            </motion.div>
                          )}
                        </AnimatePresence>
                      </div>
                    );
                  })}
                </div>
              </article>
            ))}
            {filtered.length === 0 && (
              <div className="rounded-[2rem] border border-slate-200 bg-white p-10 text-center shadow-sm">
                <Search className="mx-auto size-10 text-slate-300" />
                <h2 className="mt-4 text-lg font-semibold text-slate-950">
                  No results for “{query}”
                </h2>
                <p className="mx-auto mt-2 max-w-sm text-sm leading-6 text-slate-500">
                  Try different keywords, or reach out and we&apos;ll point you
                  in the right direction.
                </p>
                <button
                  type="button"
                  onClick={() => {
                    setQuery("");
                    setOpenFaq(null);
                  }}
                  className="mt-6 rounded-full bg-slate-950 px-5 py-2.5 text-xs font-bold text-white transition hover:bg-emerald-700"
                >
                  Clear search
                </button>
              </div>
            )}
          </section>

          <aside className="space-y-6">
            <section className="rounded-[2rem] border border-slate-200 bg-white p-5 shadow-sm sm:p-6">
              <span className="grid place-items-center text-rose-600 bg-rose-50 rounded-2xl size-11">
                <MessageSquareText className="size-5" />
              </span>
              <h2 className="mt-4 text-xl font-semibold text-slate-950">
                Still need help?
              </h2>
              <p className="mt-2 text-sm leading-6 text-slate-500">
                Contact us and we&apos;ll get back to you as soon as we can.
              </p>
              <div className="mt-5 space-y-3">
                {contactOptions.map((option) => (
                  <Link
                    key={option.title}
                    to={option.href}
                    target={option.external ? "_blank" : undefined}
                    rel={option.external ? "noreferrer" : undefined}
                    className="group flex items-center gap-3 rounded-2xl border border-slate-200 p-4 transition hover:-translate-y-0.5 hover:border-emerald-300 hover:shadow-md"
                  >
                    <span className="grid place-items-center rounded-xl transition size-10 shrink-0 bg-slate-50 text-slate-600 group-hover:bg-emerald-50 group-hover:text-emerald-700">
                      <option.icon className="size-5" />
                    </span>
                    <span className="flex-1 min-w-0">
                      <span className="block text-sm font-semibold text-slate-900">
                        {option.title}
                      </span>
                      <span className="mt-0.5 block text-xs text-slate-500">
                        {option.description}
                      </span>
                    </span>
                    <ArrowRight className="size-4 shrink-0 text-slate-300 transition group-hover:translate-x-0.5 group-hover:text-emerald-600" />
                  </Link>
                ))}
              </div>
            </section>

            <section className="overflow-hidden rounded-[2rem] bg-slate-950 p-6 text-white shadow-sm">
              <div className="absolute -right-10 -top-14 rounded-full blur-3xl size-44 bg-emerald-400/20" />
              <Sparkles className="text-emerald-300 size-6" />
              <h2 className="mt-4 text-xl font-semibold">New to Flypnp?</h2>
              <p className="mt-2 text-sm leading-6 text-slate-300">
                The core experience is ready — explore the app and start
                planning your next adventure.
              </p>
              <Link
                to="/"
                className="mt-6 inline-flex items-center gap-2 rounded-full bg-white px-5 py-2.5 text-xs font-bold text-slate-950 transition hover:bg-emerald-400"
              >
                Explore places <ArrowRight className="size-4" />
              </Link>
            </section>
          </aside>
        </div>
      </div>
    </main>
  );
};

export default HelpCenter;
