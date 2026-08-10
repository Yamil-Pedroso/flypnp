import { ArrowUpRight, Home, MapPin, Pencil, Trash2, Users } from "lucide-react";
import { Link } from "react-router-dom";
import type { Place } from "../../services";
import CreatePlaceButton from "./CreatePlaceButton";
import { useTranslation } from "react-i18next";

interface HostListingsProps {
  places: Place[];
  deletingId: string | null;
  onDelete: (place: Place) => void;
}

const HostListings = ({ places, deletingId, onDelete }: HostListingsProps) => {
  const { t } = useTranslation("places");
  return (
  <section className="rounded-[1.75rem] border border-slate-200 bg-white p-5 shadow-sm sm:p-6">
    <div className="flex flex-wrap items-end justify-between gap-4">
      <div><p className="text-xs font-black uppercase tracking-[0.16em] text-emerald-700">{t("host.portfolio")}</p><h2 className="mt-1 text-2xl font-semibold tracking-tight text-slate-950">{t("host.listings")}</h2></div>
      <CreatePlaceButton compact />
    </div>

    {places.length === 0 ? (
      <div className="mt-6 rounded-[1.5rem] border border-dashed border-slate-300 bg-slate-50 px-6 py-12 text-center">
        <Home className="mx-auto size-9 text-slate-400" />
        <h3 className="mt-4 text-lg font-semibold text-slate-950">{t("host.firstTitle")}</h3>
        <p className="mx-auto mt-2 max-w-md text-sm leading-6 text-slate-500">{t("host.firstText")}</p>
        <div className="mt-5"><CreatePlaceButton /></div>
      </div>
    ) : (
      <div className="mt-6 grid gap-5 md:grid-cols-2">
        {places.map((place) => (
          <article key={place._id} className="overflow-hidden rounded-[1.5rem] border border-slate-200 bg-white">
            <div className="relative aspect-[16/9] overflow-hidden bg-slate-100">
              {place.photos[0]?.main ? <img src={place.photos[0].main} alt={place.title} className="size-full object-cover" /> : <span className="grid size-full place-items-center text-slate-400"><Home className="size-10" /></span>}
              <span className="absolute left-4 top-4 rounded-full bg-white/90 px-3 py-1.5 text-xs font-bold text-emerald-700 shadow-sm backdrop-blur">{t("host.published")}</span>
            </div>
            <div className="p-5">
              <div className="flex items-start justify-between gap-4">
                <div className="min-w-0"><h3 className="truncate text-lg font-semibold text-slate-950">{place.title}</h3><p className="mt-1 flex items-center gap-1.5 text-xs text-slate-500"><MapPin className="size-3.5" />{place.address}</p></div>
                <p className="shrink-0 text-sm font-semibold text-slate-950">{place.price} CHF <span className="font-normal text-slate-400">{t("host.perNight")}</span></p>
              </div>
              <p className="mt-4 flex items-center gap-1.5 text-xs text-slate-500"><Users className="size-3.5" />{t("host.upTo", { count: place.maxGuests })}</p>
              <div className="mt-5 flex flex-wrap items-center gap-2 border-t border-slate-100 pt-4">
                <Link to={`/host/listings/${place._id}/edit`} className="inline-flex items-center gap-1.5 rounded-full bg-slate-950 px-3.5 py-2 text-xs font-bold text-white"><Pencil className="size-3.5" />{t("host.edit")}</Link>
                <Link to={`/place/${place.category}/${place._id}`} className="inline-flex items-center gap-1.5 rounded-full px-3.5 py-2 text-xs font-bold text-slate-600 transition hover:bg-slate-100"><ArrowUpRight className="size-3.5" />{t("host.view")}</Link>
                <button type="button" disabled={deletingId === place._id} onClick={() => onDelete(place)} className="ml-auto inline-flex items-center gap-1.5 rounded-full px-3.5 py-2 text-xs font-bold text-rose-600 transition hover:bg-rose-50 disabled:opacity-50"><Trash2 className="size-3.5" />{t(deletingId === place._id ? "host.removing" : "host.remove")}</button>
              </div>
            </div>
          </article>
        ))}
      </div>
    )}
  </section>
  );
};

export default HostListings;
