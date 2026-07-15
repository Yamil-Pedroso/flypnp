import { useEffect, useRef, useState, type ComponentType } from "react";
import { FaBaby, FaMinus, FaPlus, FaUser } from "react-icons/fa";
import { MdChildCare, MdPets } from "react-icons/md";
import { Users } from "lucide-react";

type GuestType = "adults" | "children" | "infants" | "pets";

type GuestOption = {
  type: GuestType;
  label: string;
  description: string;
  icon: ComponentType<{ className?: string }>;
  max: number;
};

const guestOptions: GuestOption[] = [
  { type: "adults", label: "Adults", description: "Age 13 or above", icon: FaUser, max: 16 },
  { type: "children", label: "Children", description: "Ages 2–12", icon: MdChildCare, max: 15 },
  { type: "infants", label: "Infants", description: "Under 2", icon: FaBaby, max: 5 },
  { type: "pets", label: "Pets", description: "Bringing a furry friend?", icon: MdPets, max: 5 },
];

const AddGuests = () => {
  const [open, setOpen] = useState(false);
  const [guests, setGuests] = useState<Record<GuestType, number>>({
    adults: 0,
    children: 0,
    infants: 0,
    pets: 0,
  });
  const wrapperRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const closeOnOutsideClick = (event: PointerEvent) => {
      if (wrapperRef.current && !wrapperRef.current.contains(event.target as Node)) {
        setOpen(false);
      }
    };
    document.addEventListener("pointerdown", closeOnOutsideClick);
    return () => document.removeEventListener("pointerdown", closeOnOutsideClick);
  }, []);

  const updateGuest = (type: GuestType, change: -1 | 1) => {
    setGuests((current) => {
      const option = guestOptions.find((item) => item.type === type);
      if (!option) return current;

      const nextValue = current[type] + change;
      if (nextValue < 0 || nextValue > option.max) return current;

      if (type === "adults" && nextValue === 0 && (current.children || current.infants || current.pets)) {
        return current;
      }

      const next = { ...current, [type]: nextValue };
      if (type !== "adults" && nextValue > 0 && current.adults === 0) next.adults = 1;
      return next;
    });
  };

  const primaryGuests = guests.adults + guests.children;
  const totalGuests = primaryGuests + guests.infants;
  const summary = primaryGuests
    ? `${primaryGuests} guest${primaryGuests === 1 ? "" : "s"}${guests.infants ? `, ${guests.infants} infant${guests.infants === 1 ? "" : "s"}` : ""}${guests.pets ? `, ${guests.pets} pet${guests.pets === 1 ? "" : "s"}` : ""}`
    : "Add guests";

  return (
    <div ref={wrapperRef} className="relative block h-full md:border-l md:border-slate-100">
      <button
        type="button"
        aria-expanded={open}
        aria-haspopup="dialog"
        aria-label="Open guest selector"
        onClick={() => setOpen((current) => !current)}
        className={`flex size-11 items-center justify-center gap-2 rounded-xl text-left transition md:h-full md:w-full md:justify-start md:rounded-full md:px-4 ${open ? "bg-slate-900 text-white shadow-lg" : "hover:bg-slate-50"}`}
      >
        <Users className={`size-4 shrink-0 ${open ? "text-emerald-300" : "text-slate-400"}`} aria-hidden="true" />
        <span className="hidden min-w-0 md:block">
          <span className="block text-xs font-semibold">Guests</span>
          <span className={`block max-w-28 truncate text-xs ${open ? "text-slate-200" : "text-slate-500"}`}>{summary}</span>
        </span>
      </button>

      {open && (
        <div role="dialog" aria-label="Choose guests" className="absolute right-0 top-[calc(100%+1rem)] z-[70] w-[min(27rem,calc(100vw-2rem))] overflow-hidden rounded-3xl border border-slate-200 bg-white text-slate-900 shadow-2xl">
          <div className="flex items-center justify-between bg-slate-900 px-5 py-4 text-white">
            <div><p className="font-semibold">Who’s coming?</p><p className="text-xs text-slate-300">Build your travel crew</p></div>
            <div className="flex min-h-8 max-w-44 flex-wrap justify-end gap-1" aria-label={`${totalGuests} travelers selected`}>
              {guestOptions.map(({ type, icon: Icon }) =>
                Array.from({ length: Math.min(guests[type], 4) }, (_, index) => (
                  <span key={`${type}-${index}`} className="flex size-7 animate-bounce items-center justify-center rounded-full bg-emerald-500/20 text-emerald-300"><Icon className="size-3.5" /></span>
                )),
              )}
            </div>
          </div>

          <div className="px-5">
            {guestOptions.map(({ type, label, description, icon: Icon, max }) => {
              const cannotRemoveAdult = type === "adults" && guests.adults === 1 && Boolean(guests.children || guests.infants || guests.pets);
              const minusDisabled = guests[type] === 0 || cannotRemoveAdult;
              const plusDisabled = guests[type] >= max;
              return (
                <div key={type} className="flex items-center justify-between border-b border-slate-100 py-4 last:border-0">
                  <div className="flex items-center gap-3">
                    <span className="flex size-10 items-center justify-center rounded-full bg-emerald-50 text-emerald-700"><Icon className="size-5" /></span>
                    <div><p className="font-semibold">{label}</p><p className="text-sm text-slate-500">{description}</p></div>
                  </div>
                  <div className="flex items-center gap-3">
                    <button type="button" aria-label={`Decrease ${label}`} disabled={minusDisabled} onClick={() => updateGuest(type, -1)} className="flex size-9 items-center justify-center rounded-full border border-slate-300 text-slate-600 transition hover:border-slate-900 hover:text-slate-900 disabled:cursor-not-allowed disabled:border-slate-200 disabled:text-slate-300"><FaMinus className="size-3" /></button>
                    <output aria-label={`${label} count`} className="w-5 text-center font-medium tabular-nums">{guests[type]}</output>
                    <button type="button" aria-label={`Increase ${label}`} disabled={plusDisabled} onClick={() => updateGuest(type, 1)} className="flex size-9 items-center justify-center rounded-full border border-slate-300 text-slate-600 transition hover:border-emerald-600 hover:text-emerald-700 disabled:cursor-not-allowed disabled:border-slate-200 disabled:text-slate-300"><FaPlus className="size-3" /></button>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      )}
    </div>
  );
};

export default AddGuests;
