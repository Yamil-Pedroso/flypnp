import { useEffect, useMemo, useRef, useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { Globe2, MapPin, Search, X } from "lucide-react";
import { usePlaces } from "../../../lib/hooks";
import { useTravelSearch } from "../SearchContext";

const fallbackDestinations = [
  "Koh Samui, Thailand",
  "Joshua Tree, United States",
  "Mayne Island, Canada",
  "Bali, Indonesia",
  "Paris, France",
];

const DestinationPicker = () => {
  const { destination, setDestination } = useTravelSearch();
  const { places } = usePlaces();
  const [open, setOpen] = useState(false);
  const [activeIndex, setActiveIndex] = useState(0);
  const panelRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);

  const destinations = useMemo(() => {
    const unique = new Set([...places.map((place) => place.address), ...fallbackDestinations]);
    const query = destination.trim().toLowerCase();
    return Array.from(unique)
      .filter((address) => !query || address.toLowerCase().includes(query))
      .slice(0, 7);
  }, [destination, places]);

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

  useEffect(() => setActiveIndex(0), [destination]);

  const selectDestination = (value: string) => {
    setDestination(value);
    setOpen(false);
  };

  const handleKeyDown = (event: React.KeyboardEvent<HTMLInputElement>) => {
    if (event.key === "ArrowDown") {
      event.preventDefault();
      setOpen(true);
      setActiveIndex((index) => Math.min(index + 1, destinations.length));
    } else if (event.key === "ArrowUp") {
      event.preventDefault();
      setActiveIndex((index) => Math.max(index - 1, 0));
    } else if (event.key === "Enter" && open) {
      event.preventDefault();
      selectDestination(activeIndex === 0 ? "" : destinations[activeIndex - 1] ?? destination);
    }
  };

  return (
    <div ref={panelRef} className="relative min-w-0">
      <div data-testid="destination-field" className={`flex min-w-0 items-center gap-3 rounded-xl px-3 py-2 transition-all duration-300 md:rounded-full ${open ? "bg-slate-950 text-white shadow-lg shadow-slate-950/20" : "hover:bg-slate-50"}`}>
        <MapPin className={`size-5 shrink-0 transition-colors ${open ? "text-emerald-300" : "text-emerald-600"}`} aria-hidden="true" />
        <label className="min-w-0 flex-1">
          <span className={`hidden text-xs font-semibold md:block ${open ? "text-white" : "text-slate-900"}`}>Where</span>
          <input
            ref={inputRef}
            role="combobox"
            aria-label="Where"
            aria-expanded={open}
            aria-controls="destination-options"
            aria-autocomplete="list"
            value={destination}
            onFocus={() => setOpen(true)}
            onClick={() => setOpen(true)}
            onChange={(event) => { setDestination(event.target.value); setOpen(true); }}
            onKeyDown={handleKeyDown}
            className={`w-full bg-transparent text-sm outline-none ${open ? "text-white placeholder:text-slate-300" : "text-slate-900 placeholder:text-slate-500"}`}
            placeholder="Search destinations"
          />
        </label>
        {destination && <button type="button" aria-label="Clear destination" onClick={() => { setDestination(""); inputRef.current?.focus(); }} className={`grid size-7 shrink-0 place-items-center rounded-full transition ${open ? "bg-white/10 text-white hover:bg-white/20" : "bg-slate-100 text-slate-500 hover:bg-slate-200"}`}><X className="size-3.5" /></button>}
      </div>

      <AnimatePresence>
        {open && (
          <motion.div
            id="destination-options"
            role="listbox"
            aria-label="Suggested destinations"
            initial={{ opacity: 0, y: -12, scale: 0.98 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: -8, scale: 0.985 }}
            transition={{ type: "spring", stiffness: 380, damping: 30, mass: 0.75 }}
            className="absolute left-0 top-[calc(100%+0.75rem)] z-[85] w-[min(25rem,calc(100vw-2rem))] overflow-hidden rounded-[1.75rem] border border-slate-200 bg-white p-2 text-slate-900 shadow-[0_28px_75px_-28px_rgba(15,23,42,0.55)]"
          >
            <div className="px-3 pb-2 pt-2"><p className="text-xs font-bold uppercase tracking-[0.16em] text-slate-400">Choose a destination</p></div>
            <button type="button" role="option" aria-selected={activeIndex === 0} onMouseEnter={() => setActiveIndex(0)} onClick={() => selectDestination("")} className={`flex w-full items-center gap-3 rounded-2xl p-3 text-left transition ${activeIndex === 0 ? "bg-slate-950 text-white" : "hover:bg-slate-50"}`}>
              <span className={`grid size-11 shrink-0 place-items-center rounded-xl ${activeIndex === 0 ? "bg-white/10 text-emerald-300" : "bg-emerald-50 text-emerald-700"}`}><Globe2 className="size-5" /></span>
              <span><span className="block text-sm font-semibold">Anywhere</span><span className={`mt-0.5 block text-xs ${activeIndex === 0 ? "text-slate-300" : "text-slate-500"}`}>Explore every Flypnp destination</span></span>
            </button>

            <div className="mt-1 max-h-72 overflow-y-auto">
              {destinations.map((address, index) => {
                const [city, ...region] = address.split(",");
                const selected = activeIndex === index + 1;
                return (
                  <button key={address} type="button" role="option" aria-selected={selected} onMouseEnter={() => setActiveIndex(index + 1)} onClick={() => selectDestination(address)} className={`flex w-full items-center gap-3 rounded-2xl p-3 text-left transition ${selected ? "bg-slate-100" : "hover:bg-slate-50"}`}>
                    <span className="grid size-11 shrink-0 place-items-center rounded-xl bg-slate-100 text-slate-700"><MapPin className="size-5" /></span>
                    <span className="min-w-0"><span className="block truncate text-sm font-semibold text-slate-950">{city}</span><span className="mt-0.5 block truncate text-xs text-slate-500">{region.join(",").trim() || "Featured destination"}</span></span>
                  </button>
                );
              })}
              {destination && destinations.length === 0 && <div className="flex items-center gap-3 rounded-2xl p-4 text-sm text-slate-500"><Search className="size-5" />Search for “{destination}”</div>}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

export default DestinationPicker;
