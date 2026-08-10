import { useState } from "react";
import { createPortal } from "react-dom";
import { AnimatePresence, motion } from "framer-motion";
import { TbWorld } from "react-icons/tb";
import { Check, Languages, Sparkles, X } from "lucide-react";
import { toast } from "sonner";
import { useTranslation } from "react-i18next";

const languages = [
  { code: "de", name: "Deutsch", mark: "DE" },
  { code: "en", name: "English", mark: "EN" },
  { code: "es", name: "Español", mark: "ES" },
  { code: "it", name: "Italiano", mark: "IT" },
  { code: "fr", name: "Français", mark: "FR" },
] as const;

const SwitchLang = () => {
  const { i18n } = useTranslation();
  const { t } = useTranslation("navbar");
  const [menuOpen, setMenuOpen] = useState(false);

  const handleMenuIconClick = () => {
    setMenuOpen(!menuOpen);
  };

  const handleLanguageChange = (language: (typeof languages)[number]) => {
    i18n.changeLanguage(language.code);

    toast.success(t("languageChangedTo") + " " + language.name);
  };

  return (
    <div>
      <button
        type="button"
        onClick={handleMenuIconClick}
        aria-label={t("languageAndCurrency")}
        className="hidden justify-center items-center rounded-full transition size-10 text-slate-600 hover:bg-slate-100 sm:flex"
      >
        <TbWorld className="text-xl" />
      </button>

      {createPortal(
        <AnimatePresence>
          {menuOpen && (
            <motion.div
              data-testid="language-modal-backdrop"
              onClick={() => setMenuOpen(false)}
              className="grid overflow-y-auto fixed inset-0 place-items-center p-4 backdrop-blur-md z-200 bg-slate-950/65 sm:p-6"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.2 }}
            >
              <motion.div
                onClick={(event) => event.stopPropagation()}
                role="dialog"
                aria-modal="true"
                aria-labelledby="language-modal-title"
                initial={{ opacity: 0, y: 24, scale: 0.96 }}
                animate={{ opacity: 1, y: 0, scale: 1 }}
                exit={{ opacity: 0, y: 14, scale: 0.97 }}
                transition={{
                  type: "spring",
                  stiffness: 340,
                  damping: 28,
                  mass: 0.85,
                }}
                className="relative my-auto w-full max-w-3xl overflow-hidden rounded-4xl bg-white shadow-[0_35px_100px_-30px_rgba(0,0,0,0.7)]"
              >
                <div className="overflow-hidden relative px-6 py-7 text-white bg-slate-950 sm:px-8 sm:py-8">
                  <div className="absolute -right-12 -top-20 rounded-full blur-3xl size-56 bg-emerald-500/20" />
                  <div className="absolute -bottom-24 left-1/3 rounded-full blur-3xl size-52 bg-sky-500/15" />
                  <button
                    type="button"
                    onClick={() => setMenuOpen(false)}
                    aria-label={t("closeLanguage")}
                    className="grid absolute top-5 right-5 z-10 place-items-center text-white rounded-full transition size-10 bg-white/10 hover:rotate-90 hover:bg-white hover:text-slate-950"
                  >
                    <X className="size-5" />
                  </button>
                  <div className="relative pr-14">
                    <span className="inline-flex items-center gap-2 rounded-full bg-white/10 px-3 py-1.5 text-xs font-bold uppercase tracking-[0.16em] text-emerald-300 ring-1 ring-white/10">
                      <Sparkles className="size-3.5" /> {t("makeYours")}
                    </span>
                    <div className="flex gap-4 items-center mt-5">
                      <span className="grid place-items-center bg-emerald-400 rounded-2xl size-12 shrink-0 text-slate-950">
                        <Languages className="size-6" />
                      </span>
                      <div>
                        <h2
                          id="language-modal-title"
                          className="text-2xl font-semibold tracking-tight sm:text-3xl"
                        >
                          {t("chooseLanguage")}
                        </h2>
                        <p className="mt-1 text-sm text-slate-300">
                          {t("chooseLanguageDescription")}
                        </p>
                      </div>
                    </div>
                  </div>
                </div>

                <div className="p-5 sm:p-8">
                  <div
                    role="radiogroup"
                    aria-label={t("availableLanguages")}
                    className="grid gap-3 sm:grid-cols-2"
                  >
                    {languages.map((language) => {
                      const selected = i18n.language === language.code;
                      return (
                        <button
                          key={language.code}
                          type="button"
                          role="radio"
                          aria-checked={selected}
                          onClick={() => handleLanguageChange(language)}
                          className={`group flex items-center gap-4 rounded-2xl border p-4 text-left transition-all duration-200 ${selected ? "border-slate-950 bg-slate-950 text-white shadow-lg shadow-slate-950/15" : "border-slate-200 bg-white text-slate-950 hover:-translate-y-0.5 hover:border-emerald-300 hover:shadow-md"}`}
                        >
                          <span
                            className={`grid size-11 shrink-0 place-items-center rounded-xl text-xs font-black tracking-wider ${selected ? "bg-emerald-400 text-slate-950" : "bg-slate-100 text-slate-600 group-hover:bg-emerald-50 group-hover:text-emerald-700"}`}
                          >
                            {language.mark}
                          </span>
                          <span className="flex-1 min-w-0">
                            <span className="block font-semibold">
                              {language.name}
                            </span>
                            <span
                              className={`mt-0.5 block text-xs ${selected ? "text-slate-300" : "text-slate-500"}`}
                            >
                              {t(`languageNames.${language.code}`)}
                            </span>
                          </span>
                          <span
                            className={`grid size-7 shrink-0 place-items-center rounded-full transition ${selected ? "bg-emerald-400 text-slate-950" : "text-transparent border border-slate-200"}`}
                          >
                            <Check className="size-4" />
                          </span>
                        </button>
                      );
                    })}
                  </div>

                  <div className="flex flex-col gap-4 pt-5 mt-6 border-t border-slate-100 sm:flex-row sm:items-center sm:justify-between">
                    <p className="max-w-md text-xs leading-5 text-slate-500">
                      {t("translationReady")}
                    </p>
                    <button
                      type="button"
                      onClick={() => setMenuOpen(false)}
                      className="shrink-0 rounded-full bg-rose-500 px-6 py-3 text-sm font-bold text-white shadow-lg shadow-rose-500/20 transition hover:-translate-y-0.5 hover:bg-rose-600"
                    >
                      {t("done")}
                    </button>
                  </div>
                </div>
              </motion.div>
            </motion.div>
          )}
        </AnimatePresence>,
        document.body,
      )}
    </div>
  );
};

export default SwitchLang;
