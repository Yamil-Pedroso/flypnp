import { useEffect, useRef, useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { CalendarDays, X } from "lucide-react";
import MyCalendar from "../../common/calendar/Calendar";
import { useTravelSearch } from "../SearchContext";
import { useTranslation } from "react-i18next";

type ActiveField = "checkIn" | "checkOut";

const formatDate = (value: string, locale: string | undefined, emptyLabel: string) => {
  if (!value) return emptyLabel;
  return new Intl.DateTimeFormat(locale, { month: "short", day: "numeric" }).format(new Date(`${value}T00:00:00`));
};

const DateField = ({ label, value, active, onClick, locale, emptyLabel }: {
  label: string;
  value: string;
  active: boolean;
  onClick: () => void;
  locale?: string;
  emptyLabel: string;
}) => (
  <button
    type="button"
    aria-label={label}
    aria-expanded={active}
    onClick={onClick}
    className={`hidden min-w-0 items-center gap-2 rounded-full border-l px-4 py-2.5 text-left transition-all duration-300 md:flex ${active ? "border-transparent bg-slate-950 text-white shadow-lg shadow-slate-950/20" : "border-slate-100 text-slate-900 hover:border-transparent hover:bg-slate-100"}`}
  >
    <CalendarDays className={`size-4 shrink-0 transition-colors ${active ? "text-emerald-300" : "text-slate-400"}`} aria-hidden="true" />
    <span className="min-w-0">
      <span className="block text-xs font-semibold">{label}</span>
      <span className={`block truncate text-xs ${active ? "text-white" : value ? "text-slate-700" : "text-slate-500"}`}>{formatDate(value, locale, emptyLabel)}</span>
    </span>
  </button>
);

const DateRangePicker = () => {
  const { checkIn, setCheckIn, checkOut, setCheckOut } = useTravelSearch();
  const [open, setOpen] = useState(false);
  const [activeField, setActiveField] = useState<ActiveField>("checkIn");
  const panelRef = useRef<HTMLDivElement>(null);
  const { t, i18n } = useTranslation("search");

  useEffect(() => {
    if (!open) return;
    const closeOnOutside = (event: PointerEvent) => {
      if (panelRef.current && !panelRef.current.contains(event.target as Node)) setOpen(false);
    };
    const closeOnEscape = (event: KeyboardEvent) => {
      if (event.key === "Escape") setOpen(false);
    };
    document.addEventListener("pointerdown", closeOnOutside);
    document.addEventListener("keydown", closeOnEscape);
    return () => {
      document.removeEventListener("pointerdown", closeOnOutside);
      document.removeEventListener("keydown", closeOnEscape);
    };
  }, [open]);

  const activate = (field: ActiveField) => {
    setActiveField(field);
    setOpen(true);
  };

  const updateRange = (nextCheckIn: string, nextCheckOut: string) => {
    setCheckIn(nextCheckIn);
    setCheckOut(nextCheckOut);
    if (nextCheckIn && !nextCheckOut) {
      setActiveField("checkOut");
      return;
    }
    if (nextCheckOut) {
      setActiveField("checkOut");
      setOpen(false);
    }
  };

  return (
    <>
      <DateField label={t("checkIn")} value={checkIn} active={open && activeField === "checkIn"} onClick={() => activate("checkIn")} locale={i18n.resolvedLanguage} emptyLabel={t("addDates")} />
      <DateField label={t("checkOut")} value={checkOut} active={open && activeField === "checkOut"} onClick={() => activate("checkOut")} locale={i18n.resolvedLanguage} emptyLabel={t("addDates")} />

      <AnimatePresence>
        {open && (
          <motion.div
            ref={panelRef}
            role="dialog"
            aria-label={t("chooseDates")}
            initial={{ opacity: 0, y: -14, scale: 0.98 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: -10, scale: 0.985 }}
            transition={{ type: "spring", stiffness: 360, damping: 30, mass: 0.8 }}
            className="absolute left-1/2 top-[calc(100%+0.75rem)] z-[80] w-[min(50rem,calc(100vw-2rem))] -translate-x-1/2 overflow-hidden rounded-[2rem] border border-slate-200 bg-white shadow-[0_30px_80px_-30px_rgba(15,23,42,0.55)]"
          >
            <div className="flex items-center justify-between border-b border-slate-100 px-6 py-4">
              <div><p className="font-semibold text-slate-950">{t("chooseDatesTitle")}</p><p className="mt-0.5 text-xs text-slate-500">{t("chooseDatesDescription")}</p></div>
              <button type="button" aria-label={t("closeDates")} onClick={() => setOpen(false)} className="grid size-9 place-items-center rounded-full bg-slate-100 text-slate-600 transition hover:bg-slate-950 hover:text-white"><X className="size-4" /></button>
            </div>
            <MyCalendar checkIn={checkIn} checkOut={checkOut} onDateChange={updateRange} />
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
};

export default DateRangePicker;
