import { useEffect, useMemo, useState } from "react";
import { useSearchParams } from "react-router-dom";
import {
  Camera,
  ChefHat,
  Compass,
  Leaf,
  LoaderCircle,
  Map,
  MoonStar,
  Palette,
  RefreshCw,
  Route,
  Search,
  Sparkles,
  Users,
  Waves,
} from "lucide-react";
import { getTravelParams, useTravelSearch } from "../search/SearchContext";
import { useExperiences } from "../../lib/hooks";
import type { ExperienceCategory } from "../../services";
import images from "../../assets/images";
import ExperienceCard from "./ExperienceCard";
import ExperienceWishlistButton from "./ExperienceWishlistButton";
import { useTranslation } from "react-i18next";

const categories: Array<{
  value: ExperienceCategory | "all";
  labelKey: string;
  icon: typeof Compass;
}> = [
  { value: "all", labelKey: "all", icon: Compass },
  { value: "local-flavors", labelKey: "flavors", icon: ChefHat },
  { value: "nature", labelKey: "nature", icon: Leaf },
  { value: "creative", labelKey: "creative", icon: Palette },
  { value: "hidden-gems", labelKey: "gems", icon: Map },
  { value: "night", labelKey: "night", icon: MoonStar },
  { value: "family", labelKey: "family", icon: Users },
  { value: "wellness", labelKey: "wellness", icon: Waves },
  { value: "culture", labelKey: "culture", icon: Camera },
];

const Experiences = () => {
  const { t } = useTranslation("experiences");
  const [searchParams, setSearchParams] = useSearchParams();
  const { destination, setDestination, checkIn, setCheckIn, guests } = useTravelSearch();
  const { experiences, loading, error, refresh } = useExperiences();
  const [category, setCategory] = useState<ExperienceCategory | "all">(
    (searchParams.get("category") as ExperienceCategory | null) ?? "all",
  );
  const [kind, setKind] = useState<"all" | "moment" | "local-path">(
    (searchParams.get("kind") as "moment" | "local-path" | null) ?? "all",
  );
  const participantCount = Math.max(1, guests.adults + guests.children);
  const filterQuery = searchParams.toString();

  useEffect(() => {
    const params = new URLSearchParams(filterQuery);
    const adults = Number(params.get("adults") ?? 1);
    const children = Number(params.get("children") ?? 0);

    void refresh({
      destination: params.get("destination") ?? undefined,
      category:
        (params.get("category") as ExperienceCategory | null) ?? undefined,
      kind:
        (params.get("kind") as "moment" | "local-path" | null) ?? undefined,
      date: params.get("checkIn") ?? undefined,
      guests: Math.max(1, adults + children),
    });
  }, [filterQuery, refresh]);

  const applyFilters = (
    nextCategory = category,
    nextKind = kind,
  ) => {
    const params = getTravelParams({
      destination,
      checkIn,
      checkOut: "",
      guests,
    });
    if (nextCategory !== "all") params.set("category", nextCategory);
    if (nextKind !== "all") params.set("kind", nextKind);
    setSearchParams(params);
  };

  const selectCategory = (value: ExperienceCategory | "all") => {
    setCategory(value);
    applyFilters(value, kind);
  };

  const selectKind = (value: "all" | "moment" | "local-path") => {
    setKind(value);
    applyFilters(category, value);
  };

  const query = useMemo(() => {
    const params = getTravelParams({ destination, checkIn, checkOut: "", guests });
    return params.toString();
  }, [destination, checkIn, guests]);
  const featured = experiences.filter((experience) => experience.featured).slice(0, 3);
  const localPaths = experiences.filter((experience) => experience.kind === "local-path");

  return (
    <main className="min-h-screen bg-[#f8faf8] pb-20">
      <section className="mx-auto max-w-7xl px-4 pt-7 sm:px-6 sm:pt-10 lg:px-8">
        <div className="relative isolate overflow-hidden rounded-[2rem] bg-slate-950 px-6 py-10 text-white sm:px-10 sm:py-14 lg:px-14 lg:py-16">
          <div className="absolute -right-24 -top-32 size-[28rem] rounded-full bg-emerald-400/20 blur-3xl" />
          <div className="absolute -bottom-36 left-1/4 size-80 rounded-full bg-rose-500/15 blur-3xl" />
          <div className="absolute right-[18%] top-12 hidden size-[6.5rem] rotate-6 place-items-center rounded-[2rem] border border-white/10 bg-white/5 backdrop-blur lg:grid">
            <span
              aria-hidden="true"
              className="block size-24 bg-emerald-300/70"
              style={{
                WebkitMask: `url("${images.foot}") center / contain no-repeat`,
                mask: `url("${images.foot}") center / contain no-repeat`,
              }}
            />
          </div>
          <div className="relative max-w-3xl">
            <span className="inline-flex items-center gap-2 rounded-full bg-white/10 px-3 py-1.5 text-xs font-bold uppercase tracking-[0.18em] text-emerald-300 ring-1 ring-white/10">
              <Sparkles className="size-3.5" /> {t("listing.badge")}
            </span>
            <h1 className="mt-6 text-4xl font-semibold leading-[1.03] tracking-[-0.045em] sm:text-6xl">
              {t("listing.title")}
            </h1>
            <p className="mt-5 max-w-2xl text-base leading-7 text-slate-300 sm:text-lg">
              {t("listing.subtitle")}
            </p>
          </div>

          <form
            aria-label={t("listing.searchLabel")}
            onSubmit={(event) => { event.preventDefault(); applyFilters(); }}
            className="relative mt-9 grid gap-2 rounded-[1.5rem] bg-white p-2 text-slate-950 shadow-2xl sm:grid-cols-[1.35fr_0.85fr_auto] sm:rounded-full"
          >
            <label className="flex min-w-0 items-center gap-3 rounded-2xl px-4 py-3 transition focus-within:bg-slate-50 sm:rounded-full">
              <Map className="size-5 shrink-0 text-emerald-700" />
              <span className="min-w-0 flex-1">
                <span className="block text-[0.65rem] font-black uppercase tracking-[0.13em] text-slate-400">{t("listing.where")}</span>
                <input value={destination} onChange={(event) => setDestination(event.target.value)} placeholder={t("listing.destination")} className="mt-0.5 w-full bg-transparent text-sm font-semibold outline-none placeholder:font-normal placeholder:text-slate-400" />
              </span>
            </label>
            <label className="flex items-center gap-3 rounded-2xl border-t border-slate-100 px-4 py-3 transition focus-within:bg-slate-50 sm:rounded-full sm:border-l sm:border-t-0">
              <Compass className="size-5 shrink-0 text-emerald-700" />
              <span className="min-w-0 flex-1">
                <span className="block text-[0.65rem] font-black uppercase tracking-[0.13em] text-slate-400">{t("listing.date")}</span>
                <input type="date" value={checkIn} onChange={(event) => setCheckIn(event.target.value)} className="mt-0.5 w-full bg-transparent text-sm font-semibold outline-none" />
              </span>
            </label>
            <button type="submit" className="inline-flex items-center justify-center gap-2 rounded-full bg-rose-500 px-6 py-3.5 text-sm font-bold text-white shadow-lg shadow-rose-500/20 transition hover:-translate-y-0.5 hover:bg-rose-600">
              <Search className="size-4" /> {t("listing.explore")}
            </button>
          </form>
          <p className="relative mt-3 px-2 text-xs text-slate-400">{t("listing.participants", { count: participantCount })} · {t("listing.guestHint")}</p>
        </div>
      </section>

      <section className="mx-auto max-w-7xl px-4 pt-8 sm:px-6 sm:pt-10 lg:px-8">
        <div className="flex gap-2 overflow-x-auto pb-2" aria-label={t("listing.categoryLabel")}>
          {categories.map(({ value, labelKey, icon: Icon }) => (
            <button key={value} type="button" onClick={() => selectCategory(value)} aria-pressed={category === value} className={`inline-flex shrink-0 items-center gap-2 rounded-full border px-4 py-2.5 text-sm font-semibold transition ${category === value ? "border-slate-950 bg-slate-950 text-white shadow-md" : "border-slate-200 bg-white text-slate-600 hover:border-emerald-300 hover:text-emerald-800"}`}>
              <Icon className="size-4" />{t(`categories.${labelKey}`)}
            </button>
          ))}
        </div>
        <div className="mt-4 flex items-center gap-2">
          {([
            ["all", "listing.everything", Compass],
            ["moment", "listing.moments", Sparkles],
            ["local-path", "listing.paths", Route],
          ] as const).map(([value, labelKey, Icon]) => (
            <button key={value} type="button" onClick={() => selectKind(value)} className={`inline-flex items-center gap-1.5 rounded-full px-3.5 py-2 text-xs font-bold transition ${kind === value ? "bg-emerald-100 text-emerald-900" : "text-slate-500 hover:bg-white hover:text-slate-900"}`}>
              <Icon className="size-3.5" />{t(labelKey)}
            </button>
          ))}
        </div>
      </section>

      {loading ? (
        <section className="mx-auto flex min-h-80 max-w-7xl items-center justify-center px-4">
          <p className="flex items-center gap-2 text-sm font-semibold text-slate-500"><LoaderCircle className="size-5 animate-spin text-emerald-600" />{t("listing.loading")}</p>
        </section>
      ) : error ? (
        <section className="mx-auto max-w-3xl px-4 py-16 text-center">
          <div className="rounded-[2rem] border border-rose-100 bg-rose-50 p-8">
            <RefreshCw className="mx-auto size-8 text-rose-500" />
            <h2 className="mt-4 text-2xl font-semibold text-slate-950">{t("listing.loadTitle")}</h2>
            <p className="mt-2 text-sm text-slate-600">{t("listing.loadText")}</p>
            <button type="button" onClick={() => void refresh()} className="mt-5 rounded-full bg-slate-950 px-5 py-2.5 text-sm font-bold text-white">{t("listing.retry")}</button>
          </div>
        </section>
      ) : experiences.length === 0 ? (
        <section className="mx-auto max-w-4xl px-4 py-16 text-center">
          <div className="rounded-[2rem] border border-slate-200 bg-white p-10 shadow-sm">
            <Compass className="mx-auto size-10 text-emerald-600" />
            <h2 className="mt-5 text-2xl font-semibold text-slate-950">{t("listing.emptyTitle")}</h2>
            <p className="mt-2 text-slate-500">{t("listing.emptyText")}</p>
          </div>
        </section>
      ) : (
        <>
          {featured.length > 0 && (
            <section className="mx-auto max-w-7xl px-4 pt-12 sm:px-6 lg:px-8">
              <div className="flex items-end justify-between gap-4">
                <div><p className="text-xs font-black uppercase tracking-[0.18em] text-emerald-700">{t("listing.handpicked")}</p><h2 className="mt-2 text-3xl font-semibold tracking-tight text-slate-950 sm:text-4xl">{t("listing.worthJoining")}</h2></div>
              </div>
              <div className="mt-7 grid gap-x-6 gap-y-10 md:grid-cols-2 xl:grid-cols-3">
                {featured.map((experience) => <ExperienceCard key={experience._id} experience={experience} query={query} featured />)}
              </div>
            </section>
          )}

          {localPaths.length > 0 && kind === "all" && (
            <section className="mx-auto max-w-7xl px-4 pt-16 sm:px-6 lg:px-8">
              <div className="overflow-hidden rounded-[2rem] bg-emerald-950 px-6 py-9 text-white sm:px-10 sm:py-11">
                <div className="grid gap-8 lg:grid-cols-[0.7fr_1.3fr] lg:items-end">
                  <div>
                    <span className="inline-flex items-center gap-2 text-xs font-black uppercase tracking-[0.18em] text-emerald-300"><Route className="size-4" />{t("listing.exclusive")}</span>
                    <h2 className="mt-3 text-3xl font-semibold tracking-tight sm:text-4xl">{t("listing.pathTitle")}</h2>
                    <p className="mt-3 max-w-md text-sm leading-6 text-emerald-100/70">{t("listing.pathText")}</p>
                  </div>
                  <div className="grid gap-4 sm:grid-cols-2">
                    {localPaths.slice(0, 2).map((experience) => (
                      <div key={experience._id} className="group relative">
                        <a href={`/experiences/${experience.slug}?${query}`} className="flex items-center gap-4 rounded-2xl bg-white/10 p-3 pr-14 ring-1 ring-white/10 transition hover:-translate-y-0.5 hover:bg-white/15">
                          <img src={experience.images[0]} alt="" className="size-20 shrink-0 rounded-xl object-cover" />
                          <div className="min-w-0"><p className="text-xs font-bold text-emerald-300">{experience.city}</p><p className="mt-1 line-clamp-2 text-sm font-semibold">{experience.title}</p></div>
                        </a>
                        <ExperienceWishlistButton experience={experience} className="absolute right-3 top-3" />
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            </section>
          )}

          <section className="mx-auto max-w-7xl px-4 pt-16 sm:px-6 lg:px-8">
            <div className="flex items-end justify-between gap-4">
              <div><p className="text-xs font-black uppercase tracking-[0.18em] text-emerald-700">{t("listing.pace")}</p><h2 className="mt-2 text-3xl font-semibold tracking-tight text-slate-950">{t("listing.allAvailable")}</h2></div>
              <span className="hidden text-sm font-semibold text-slate-400 sm:block">{t("listing.results", { count: experiences.length })}</span>
            </div>
            <div className="mt-7 grid gap-x-6 gap-y-10 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
              {experiences.map((experience) => <ExperienceCard key={experience._id} experience={experience} query={query} />)}
            </div>
          </section>
        </>
      )}
    </main>
  );
};

export default Experiences;
