import { Clock3, MapPin, Route, Star, Users } from "lucide-react";
import { Link } from "react-router-dom";
import type { Experience } from "../../services";
import ExperienceWishlistButton from "./ExperienceWishlistButton";

const formatDuration = (minutes: number) => {
  const hours = Math.floor(minutes / 60);
  const remaining = minutes % 60;
  return `${hours ? `${hours}h` : ""}${remaining ? ` ${remaining}m` : ""}`.trim();
};

const ExperienceCard = ({
  experience,
  query,
  featured = false,
}: {
  experience: Experience;
  query: string;
  featured?: boolean;
}) => (
  <article className={`group relative min-w-0 ${featured ? "md:first:col-span-2 xl:first:col-span-1" : ""}`}>
    <Link
      to={`/experiences/${experience.slug}${query ? `?${query}` : ""}`}
      className="block"
      aria-label={`View experience ${experience.title}`}
    >
      <div className={`relative overflow-hidden rounded-[1.75rem] bg-slate-200 ${featured ? "aspect-[16/11]" : "aspect-[4/3]"}`}>
        <img
          src={experience.images[0]}
          alt={experience.title}
          className="size-full object-cover transition duration-700 group-hover:scale-105"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-slate-950/75 via-slate-950/5 to-transparent" />
        <div className="absolute left-4 top-4 flex flex-wrap gap-2">
          {experience.kind === "local-path" && (
            <span className="inline-flex items-center gap-1.5 rounded-full bg-emerald-400 px-3 py-1.5 text-[0.68rem] font-black uppercase tracking-[0.12em] text-slate-950 shadow-lg">
              <Route className="size-3.5" /> Local Path
            </span>
          )}
          {experience.featured && (
            <span className="rounded-full bg-white/95 px-3 py-1.5 text-[0.68rem] font-black uppercase tracking-[0.12em] text-slate-950 shadow-lg">
              Guest favorite
            </span>
          )}
        </div>
        <div className="absolute inset-x-4 bottom-4 text-white sm:inset-x-5 sm:bottom-5">
          <p className="flex items-center gap-1.5 text-xs font-semibold text-white/80">
            <MapPin className="size-3.5" /> {experience.city}, {experience.country}
          </p>
          <h3 className="mt-1.5 line-clamp-2 text-xl font-semibold leading-tight tracking-tight sm:text-2xl">
            {experience.title}
          </h3>
        </div>
      </div>

      <div className="px-1 pt-3.5">
        <p className="line-clamp-2 text-sm leading-6 text-slate-500">{experience.summary}</p>
        <div className="mt-3 flex flex-wrap items-center gap-x-4 gap-y-2 text-xs font-medium text-slate-500">
          <span className="inline-flex items-center gap-1.5"><Clock3 className="size-3.5" />{formatDuration(experience.durationMinutes)}</span>
          <span className="inline-flex items-center gap-1.5"><Users className="size-3.5" />Up to {experience.maxGuests}</span>
          <span className="inline-flex items-center gap-1.5 text-slate-900"><Star className="size-3.5 fill-amber-400 text-amber-400" />{experience.rating} <span className="text-slate-400">({experience.reviews})</span></span>
        </div>
        <p className="mt-3 text-sm text-slate-600">
          From <span className="font-bold text-slate-950">CHF {experience.price}</span> / person
        </p>
      </div>
    </Link>
    <ExperienceWishlistButton experience={experience} className="absolute right-4 top-4" />
  </article>
);

export default ExperienceCard;
