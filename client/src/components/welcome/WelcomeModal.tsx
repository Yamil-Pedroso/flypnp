import { useEffect, useState } from "react";
import { createPortal } from "react-dom";
import { AnimatePresence, motion } from "framer-motion";
import { Compass, Sparkles, X } from "lucide-react";
import { useAuth } from "../../lib/hooks";
import { useTranslation } from "react-i18next";

const welcomeSeenKey = "flypnp:welcome-seen";

const WelcomeModal = () => {
  const { authenticationEvent } = useAuth();
  const [open, setOpen] = useState(false);
  const [welcomeName, setWelcomeName] = useState<string | null>(null);
  const { t } = useTranslation("app", { keyPrefix: "welcome" });

  useEffect(() => {
    if (localStorage.getItem(welcomeSeenKey)) return;
    localStorage.setItem(welcomeSeenKey, "true");
    setWelcomeName(null);
    setOpen(true);
  }, []);

  useEffect(() => {
    if (!authenticationEvent) return;
    setWelcomeName(authenticationEvent.user.name);
    setOpen(true);
  }, [authenticationEvent]);

  useEffect(() => {
    if (!open) return;
    const previousOverflow = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    const closeOnEscape = (event: KeyboardEvent) => {
      if (event.key === "Escape") setOpen(false);
    };
    document.addEventListener("keydown", closeOnEscape);
    return () => {
      document.body.style.overflow = previousOverflow;
      document.removeEventListener("keydown", closeOnEscape);
    };
  }, [open]);

  const firstName = welcomeName?.trim().split(/\s+/)[0];

  return createPortal(
    <AnimatePresence>
      {open && (
        <motion.div
          data-testid="welcome-modal-backdrop"
          onClick={() => setOpen(false)}
          className="fixed inset-0 z-[250] grid place-items-center overflow-y-auto bg-slate-950/75 p-4 backdrop-blur-md sm:p-6"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.22 }}
        >
          <motion.div
            role="dialog"
            aria-modal="true"
            aria-labelledby="welcome-modal-title"
            onClick={(event) => event.stopPropagation()}
            className="relative my-auto w-full max-w-xl overflow-hidden rounded-[2rem] border border-white/10 bg-white shadow-[0_40px_120px_-30px_rgba(0,0,0,0.8)]"
            initial={{ opacity: 0, y: 28, scale: 0.96 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 16, scale: 0.98 }}
            transition={{ type: "spring", stiffness: 320, damping: 27, mass: 0.9 }}
          >
            <div className="relative overflow-hidden bg-slate-950 px-6 pb-10 pt-7 text-white sm:px-9 sm:pb-12 sm:pt-9">
              <div className="pointer-events-none absolute -right-20 -top-24 size-72 rounded-full bg-emerald-400/20 blur-3xl" />
              <div className="pointer-events-none absolute -bottom-28 -left-16 size-64 rounded-full bg-rose-500/20 blur-3xl" />
              <button type="button" onClick={() => setOpen(false)} aria-label={t("close")} className="absolute right-5 top-5 z-10 grid size-10 place-items-center rounded-full bg-white/10 text-white transition hover:rotate-90 hover:bg-white hover:text-slate-950">
                <X className="size-5" />
              </button>

              <div className="relative pr-12">
                <span className="inline-flex items-center gap-2 rounded-full bg-white/10 px-3 py-1.5 text-xs font-bold uppercase tracking-[0.17em] text-emerald-300 ring-1 ring-white/10">
                  <Sparkles className="size-3.5" /> {t("eyebrow")}
                </span>
                <div className="mt-7 grid size-16 place-items-center rounded-2xl bg-emerald-400 text-slate-950 shadow-lg shadow-emerald-400/20">
                  <Compass className="size-8" />
                </div>
                <h1 id="welcome-modal-title" className="mt-6 text-3xl font-semibold tracking-tight sm:text-4xl">
                  {firstName ? t("titleWithName", { name: firstName }) : t("title")}
                </h1>
                <p className="mt-3 max-w-md text-sm leading-6 text-slate-300 sm:text-base">
                  {firstName
                    ? t("returningDescription")
                    : t("newDescription")}
                </p>
              </div>
            </div>

            <div className="border-t border-slate-100 bg-slate-50/50 px-6 py-4 sm:px-9">
              <div className="flex items-center gap-3">
                <div className="h-2 flex-1 overflow-hidden rounded-full bg-slate-200">
                  <div className="h-full w-[75%] rounded-full bg-emerald-500" />
                </div>
                <span className="text-xs font-semibold text-slate-500">75%</span>
              </div>
              <p className="mt-2 text-xs leading-5 text-slate-400">
                {t("progress")}
              </p>
            </div>

            <div className="flex items-center justify-end bg-white px-6 py-5 sm:px-9 sm:py-6">
              <button type="button" onClick={() => setOpen(false)} className="rounded-full bg-rose-500 px-7 py-3.5 text-sm font-bold text-white shadow-lg shadow-rose-500/20 transition hover:-translate-y-0.5 hover:bg-rose-600">
                {t("start")}
              </button>
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>,
    document.body,
  );
};

export default WelcomeModal;
