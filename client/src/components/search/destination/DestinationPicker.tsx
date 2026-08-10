import { lazy, Suspense, useEffect, useMemo, useRef, useState } from "react";
import { createPortal } from "react-dom";
import { AnimatePresence, motion, useDragControls, useMotionValue } from "framer-motion";
import { ArrowLeft, Check, Globe2, GripHorizontal, MapPin, Maximize2, Minimize2, Search, X } from "lucide-react";
import * as portals from "react-reverse-portal";
import { usePlaces } from "../../../lib/hooks";
import { useTravelSearch } from "../SearchContext";
import { destinationRegions, type DestinationCountry, type DestinationRegion } from "./destinationRegions";
import { useTranslation } from "react-i18next";

const DestinationMap = lazy(() => import("./DestinationMap"));

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
  const [selectedRegion, setSelectedRegion] = useState<DestinationRegion | null>(null);
  const [selectedCountry, setSelectedCountry] = useState<DestinationCountry | null>(null);
  const [countryQuery, setCountryQuery] = useState("");
  const [isExpanded, setIsExpanded] = useState(false);
  const fieldRef = useRef<HTMLDivElement>(null);
  const dragBoundsRef = useRef<HTMLDivElement>(null);
  const modalRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);
  const dragControls = useDragControls();
  const modalX = useMotionValue(0);
  const modalY = useMotionValue(0);
  const { t } = useTranslation("search");
  const mapPortalNode = useMemo(() => portals.createHtmlPortalNode({
    attributes: {
      class: "block size-full min-h-0",
      "data-testid": "destination-map-portal",
    },
  }), []);

  const destinations = useMemo(() => {
    const unique = new Set([...places.map((place) => place.address), ...fallbackDestinations]);
    const query = destination.trim().toLowerCase();
    return Array.from(unique)
      .filter((address) => !query || address.toLowerCase().includes(query))
      .slice(0, 6);
  }, [destination, places]);

  const filteredCountries = useMemo(() => {
    if (!selectedRegion) return [];
    const query = countryQuery.trim().toLowerCase();
    return selectedRegion.countries.filter((country) => !query || country.name.toLowerCase().includes(query));
  }, [countryQuery, selectedRegion]);

  useEffect(() => {
    if (!open) return;
    const closeOnOutside = (event: PointerEvent) => {
      const target = event.target as Node;
      if (!fieldRef.current?.contains(target) && !modalRef.current?.contains(target)) setOpen(false);
    };
    const closeOnEscape = (event: KeyboardEvent) => {
      if (event.key !== "Escape") return;
      if (isExpanded) setIsExpanded(false);
      else setOpen(false);
    };
    document.addEventListener("pointerdown", closeOnOutside);
    document.addEventListener("keydown", closeOnEscape);
    document.body.style.overflow = "hidden";
    return () => {
      document.removeEventListener("pointerdown", closeOnOutside);
      document.removeEventListener("keydown", closeOnEscape);
      document.body.style.overflow = "";
    };
  }, [isExpanded, open]);

  useEffect(() => setActiveIndex(0), [destination]);

  useEffect(() => {
    if (!open || isExpanded) {
      modalX.set(0);
      modalY.set(0);
    }
  }, [isExpanded, modalX, modalY, open]);

  const selectDestination = (value: string) => {
    setDestination(value);
    setIsExpanded(false);
    setOpen(false);
  };

  const closeExplorer = () => {
    setIsExpanded(false);
    setOpen(false);
  };

  const chooseRegion = (region: DestinationRegion) => {
    setSelectedRegion(region);
    setSelectedCountry(null);
    setCountryQuery("");
  };

  const chooseCountry = (country: DestinationCountry) => {
    setSelectedCountry(country);
    setDestination(country.name);
  };

  const handleKeyDown = (event: React.KeyboardEvent<HTMLInputElement>) => {
    if (event.key === "ArrowDown") {
      event.preventDefault();
      setOpen(true);
      setActiveIndex((index) => Math.min(index + 1, destinations.length));
    } else if (event.key === "ArrowUp") {
      event.preventDefault();
      setActiveIndex((index) => Math.max(index - 1, 0));
    } else if (event.key === "Enter" && open && destinations.length > 0) {
      event.preventDefault();
      selectDestination(activeIndex === 0 ? destinations[0] : destinations[activeIndex - 1] ?? destination);
    }
  };

  const modal = (
    <AnimatePresence>
      {open && (
        <motion.div
          ref={dragBoundsRef}
          className={`fixed inset-0 z-[1200] flex justify-center bg-slate-950/40 ${isExpanded ? "items-stretch p-0" : "items-start p-3 pt-[max(2rem,5vh)] sm:p-6 sm:pt-[max(2rem,5vh)]"}`}
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.16 }}
          onMouseDown={(event) => { if (event.target === event.currentTarget) closeExplorer(); }}
        >
          <motion.div
            ref={modalRef}
            id="destination-options"
            role="dialog"
            aria-modal="true"
            aria-label={t("destination.explore")}
            drag={isExpanded ? false : true}
            dragControls={dragControls}
            dragConstraints={dragBoundsRef}
            dragElastic={0.04}
            dragListener={false}
            dragMomentum={false}
            style={{ x: modalX, y: modalY }}
            initial={{ opacity: 0, scale: 0.99 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.99 }}
            transition={{ duration: 0.2, ease: "easeOut" }}
            className={`flex w-full flex-col overflow-hidden bg-white text-slate-900 shadow-[0_30px_90px_rgba(15,23,42,0.34)] ${isExpanded ? "h-dvh max-h-none max-w-none rounded-none border-0" : `${selectedRegion ? "h-[90dvh]" : "max-h-[90dvh]"} max-w-6xl rounded-[1.75rem] border border-white/70`}`}
          >
            <header
              onPointerDown={(event) => {
                if (isExpanded || (event.target as HTMLElement).closest("button")) return;
                dragControls.start(event);
              }}
              className={`relative flex shrink-0 select-none items-center justify-between gap-4 border-b border-slate-100 px-4 py-3 sm:px-6 sm:py-4 ${isExpanded ? "cursor-default" : "cursor-grab active:cursor-grabbing"}`}
            >
              <div className="flex min-w-0 items-center gap-3">
                {selectedRegion ? (
                  <button type="button" onClick={() => { setSelectedRegion(null); setSelectedCountry(null); }} aria-label={t("destination.backRegions")} className="grid size-10 shrink-0 place-items-center rounded-full bg-slate-100 text-slate-700 transition hover:bg-slate-200"><ArrowLeft className="size-4.5" /></button>
                ) : <span className="grid size-10 shrink-0 place-items-center rounded-full bg-emerald-50 text-emerald-700"><Globe2 className="size-5" /></span>}
                <div className="min-w-0"><p className="text-xs font-bold uppercase tracking-[0.16em] text-emerald-700">{t("destination.eyebrow")}</p><h2 className="truncate text-lg font-bold sm:text-xl">{selectedRegion ? t("destination.exploreRegion", { region: t(`regionCards.${selectedRegion.id}.name`) }) : t("destination.chooseRegion")}</h2></div>
              </div>
              {!isExpanded && <span aria-hidden="true" className="pointer-events-none absolute left-1/2 top-1.5 hidden -translate-x-1/2 text-slate-300 md:block"><GripHorizontal className="size-5" /></span>}
              <div className="flex shrink-0 items-center gap-2">
                {selectedRegion && (
                  <button type="button" onClick={() => setIsExpanded((expanded) => !expanded)} aria-label={isExpanded ? t("destination.exitFullMap") : t("destination.openFullMap")} title={isExpanded ? t("destination.exitFull") : t("destination.full")} className="grid size-10 place-items-center rounded-full bg-slate-100 text-slate-600 transition hover:bg-slate-200 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-emerald-600">
                    {isExpanded ? <Minimize2 className="size-5" /> : <Maximize2 className="size-5" />}
                  </button>
                )}
                <button type="button" onClick={closeExplorer} aria-label={t("destination.close")} className="grid size-10 place-items-center rounded-full bg-slate-100 text-slate-600 transition hover:bg-slate-200 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-emerald-600"><X className="size-5" /></button>
              </div>
            </header>

            {!selectedRegion ? (
              <div className="min-h-0 flex-1 overflow-y-auto p-5 sm:p-6">
                <div className="grid grid-cols-2 gap-3 md:grid-cols-5">
                  {destinationRegions.map((region) => (
                    <button key={region.id} type="button" onClick={() => chooseRegion(region)} className="group overflow-hidden rounded-2xl border border-slate-200 bg-white text-left transition hover:-translate-y-0.5 hover:border-emerald-300 hover:shadow-lg focus-visible:outline-2 focus-visible:outline-emerald-600">
                      <div className="aspect-[4/3] overflow-hidden bg-slate-100"><img src={region.image} alt={t("destinationExtra.mapRepresenting", { region: t(`regionCards.${region.id}.name`) })} className="size-full object-cover transition duration-300 group-hover:scale-[1.03]" /></div>
                      <div className="p-3"><span className="block font-bold text-slate-950">{t(`regionCards.${region.id}.name`)}</span><span className="mt-0.5 hidden text-xs text-slate-500 sm:block">{t(`regionCards.${region.id}.eyebrow`)}</span></div>
                    </button>
                  ))}
                </div>

                <div className="mt-6 border-t border-slate-100 pt-5">
                  <div className="mb-2 flex items-center justify-between gap-3"><p className="text-xs font-bold uppercase tracking-[0.14em] text-slate-400">{t("destination.quick")}</p>{destination && <span className="text-xs text-slate-400">{t("destination.matching", { destination })}</span>}</div>
                  <div role="listbox" aria-label={t("destination.suggestions")} className="grid gap-2 sm:grid-cols-2 lg:grid-cols-3">
                    {destinations.map((address, index) => {
                      const selected = activeIndex === index + 1;
                      return <button key={address} type="button" role="option" aria-selected={selected} onMouseEnter={() => setActiveIndex(index + 1)} onClick={() => selectDestination(address)} className={`flex min-w-0 items-center gap-3 rounded-2xl p-3 text-left transition ${selected ? "bg-slate-100" : "hover:bg-slate-50"}`}><span className="grid size-10 shrink-0 place-items-center rounded-xl bg-emerald-50 text-emerald-700"><MapPin className="size-4.5" /></span><span className="truncate text-sm font-semibold">{address}</span></button>;
                    })}
                    {destination && destinations.length === 0 && <div className="col-span-full flex items-center gap-3 rounded-2xl bg-slate-50 p-4 text-sm text-slate-500"><Search className="size-5" />{t("destination.noMatch")}</div>}
                  </div>
                </div>
              </div>
            ) : (
              <div className={`grid min-h-0 flex-1 overflow-y-auto ${isExpanded ? "grid-rows-[auto_minmax(22rem,1fr)] lg:grid-cols-[minmax(18rem,22rem)_1fr] lg:grid-rows-1 lg:overflow-hidden" : "lg:h-[calc(90dvh-4.75rem)] lg:max-h-[44rem] lg:grid-cols-[19rem_1fr] lg:overflow-hidden"}`}>
                <aside className="border-b border-slate-100 p-4 lg:overflow-y-auto lg:border-b-0 lg:border-r">
                  <label className="flex items-center gap-2 rounded-xl border border-slate-200 bg-slate-50 px-3 py-2.5 focus-within:border-emerald-500 focus-within:ring-2 focus-within:ring-emerald-100"><Search className="size-4 text-slate-400" /><input value={countryQuery} onChange={(event) => setCountryQuery(event.target.value)} placeholder={t("destination.searchIn", { region: t(`regionCards.${selectedRegion.id}.name`) })} aria-label={t("destination.searchCountry", { region: t(`regionCards.${selectedRegion.id}.name`) })} className="min-w-0 flex-1 bg-transparent text-sm outline-none placeholder:text-slate-400" /></label>
                  <p className="px-1 pb-2 pt-4 text-xs font-bold uppercase tracking-[0.14em] text-slate-400">{t("destination.selectCountry")}</p>
                  <div className="space-y-1">
                    {filteredCountries.map((country) => (
                      <button key={country.name} type="button" onClick={() => chooseCountry(country)} className={`flex w-full items-center justify-between gap-3 rounded-xl px-3 py-3 text-left text-sm font-semibold transition ${selectedCountry?.name === country.name ? "bg-slate-950 text-white" : "hover:bg-slate-50"}`}><span>{country.name}</span>{selectedCountry?.name === country.name && <Check className="size-4 text-emerald-300" />}</button>
                    ))}
                    {filteredCountries.length === 0 && <p className="rounded-xl bg-slate-50 p-4 text-sm text-slate-500">{t("destination.noCountry")}</p>}
                  </div>
                  {selectedCountry && <button type="button" onClick={closeExplorer} className="mt-4 w-full rounded-full bg-emerald-600 px-4 py-2.5 text-sm font-bold text-white transition hover:bg-emerald-700">{t("destinationExtra.useCountry", { country: selectedCountry.name })}</button>}
                </aside>
                <div className={`min-h-[22rem] overflow-hidden bg-slate-100 ${isExpanded ? "h-full" : "h-[25rem] lg:h-full"}`}>
                  <portals.OutPortal node={mapPortalNode} />
                </div>
              </div>
            )}
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );

  return (
    <>
      {selectedRegion && (
        <portals.InPortal node={mapPortalNode}>
          <Suspense fallback={<div className="grid size-full min-h-[22rem] place-items-center bg-slate-100 text-sm font-semibold text-slate-500">{t("destination.loadingMap")}</div>}>
            <DestinationMap region={selectedRegion} country={selectedCountry} places={places} expanded={isExpanded} onChoosePlace={(place) => selectDestination(place.address)} />
          </Suspense>
        </portals.InPortal>
      )}
      <div ref={fieldRef} className="relative min-w-0">
        <div data-testid="destination-field" className={`flex min-w-0 items-center gap-3 rounded-xl px-3 py-2 transition-all duration-300 md:rounded-full ${open ? "bg-slate-950 text-white shadow-lg shadow-slate-950/20" : "hover:bg-slate-50"}`}>
          <MapPin className={`size-5 shrink-0 transition-colors ${open ? "text-emerald-300" : "text-emerald-600"}`} aria-hidden="true" />
          <label className="min-w-0 flex-1">
            <span className={`hidden text-xs font-semibold md:block ${open ? "text-white" : "text-slate-900"}`}>{t("where")}</span>
            <input ref={inputRef} role="combobox" aria-label={t("where")} aria-expanded={open} aria-controls="destination-options" aria-haspopup="dialog" value={destination} onFocus={() => setOpen(true)} onClick={() => setOpen(true)} onChange={(event) => { setDestination(event.target.value); setOpen(true); }} onKeyDown={handleKeyDown} className={`w-full bg-transparent text-sm outline-none ${open ? "text-white placeholder:text-slate-300" : "text-slate-900 placeholder:text-slate-500"}`} placeholder={t("searchDestinations")} />
          </label>
          {destination && <button type="button" aria-label={t("destination.clear")} onClick={() => { setDestination(""); setSelectedCountry(null); inputRef.current?.focus(); }} className={`grid size-7 shrink-0 place-items-center rounded-full transition ${open ? "bg-white/10 text-white hover:bg-white/20" : "bg-slate-100 text-slate-500 hover:bg-slate-200"}`}><X className="size-3.5" /></button>}
        </div>
        {typeof document !== "undefined" && createPortal(modal, document.body)}
      </div>
    </>
  );
};

export default DestinationPicker;
