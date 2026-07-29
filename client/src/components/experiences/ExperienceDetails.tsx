import { useEffect, useMemo, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import {
  ArrowLeft,
  Award,
  Check,
  Clock3,
  Compass,
  Globe2,
  LoaderCircle,
  MapPin,
  Route,
  ShieldCheck,
  Sparkles,
  Star,
  Users,
  X,
} from "lucide-react";
import { toast } from "sonner";
import { useAuth, useExperiences } from "../../lib/hooks";
import { getExperiencePaymentPath } from "../../lib/payment";
import { getErrorMessage, type Experience } from "../../services";
import { useTravelSearch } from "../search/SearchContext";

const formatDuration = (minutes: number) => {
  const hours = Math.floor(minutes / 60);
  const remaining = minutes % 60;
  return `${hours ? `${hours} hr` : ""}${remaining ? ` ${remaining} min` : ""}`.trim();
};

const toDateInput = (date: Date) => {
  const year = date.getFullYear();
  const month = String(date.getMonth() + 1).padStart(2, "0");
  const day = String(date.getDate()).padStart(2, "0");
  return `${year}-${month}-${day}`;
};

const nextAvailableDate = (availableDays: number[], preferred?: string) => {
  const candidate = preferred ? new Date(`${preferred}T12:00:00`) : new Date();
  if (Number.isNaN(candidate.getTime()) || candidate < new Date()) {
    candidate.setTime(Date.now());
  }
  for (let offset = 0; offset < 14; offset += 1) {
    const next = new Date(candidate);
    next.setDate(candidate.getDate() + offset);
    if (availableDays.includes(next.getDay())) return toDateInput(next);
  }
  return toDateInput(candidate);
};

const ReserveExperience = ({
  experience,
  onReserved,
}: {
  experience: Experience;
  onReserved?: () => void;
}) => {
  const { user } = useAuth();
  const { checkIn, guests } = useTravelSearch();
  const { createBooking } = useExperiences();
  const navigate = useNavigate();
  const initialParticipants = Math.min(
    experience.maxGuests,
    Math.max(1, guests.adults + guests.children),
  );
  const [date, setDate] = useState(() => nextAvailableDate(experience.availableDays, checkIn));
  const [startTime, setStartTime] = useState(experience.startTimes[0] ?? "");
  const [participants, setParticipants] = useState(initialParticipants);
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState("");
  const total = experience.price * participants;

  const reserve = async () => {
    if (!user) {
      setError("Log in from the user menu to reserve this experience.");
      return;
    }
    try {
      setSubmitting(true);
      setError("");
      const booking = await createBooking({
        experienceId: experience._id,
        date,
        startTime,
        participants,
      });
      toast.success("Your experience is ready for payment.");
      onReserved?.();
      navigate(getExperiencePaymentPath(booking));
    } catch (cause) {
      setError(getErrorMessage(cause, "We couldn't reserve this experience."));
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="rounded-[1.75rem] border border-slate-200 bg-white p-5 shadow-[0_24px_65px_-38px_rgba(15,23,42,0.55)] sm:p-6">
      <div className="flex items-end justify-between gap-4">
        <p className="text-2xl font-semibold text-slate-950">CHF {experience.price} <span className="text-sm font-normal text-slate-500">/ person</span></p>
        <p className="inline-flex items-center gap-1 text-sm font-semibold text-slate-800"><Star className="size-4 fill-amber-400 text-amber-400" />{experience.rating}</p>
      </div>

      <div className="mt-5 grid gap-3">
        <label className="grid gap-1.5 text-xs font-black uppercase tracking-[0.12em] text-slate-500">
          Date
          <input type="date" value={date} min={toDateInput(new Date())} onChange={(event) => setDate(event.target.value)} className="rounded-2xl border border-slate-200 bg-slate-50 px-4 py-3 text-sm font-semibold normal-case tracking-normal text-slate-950 outline-none focus:border-emerald-500 focus:ring-4 focus:ring-emerald-50" />
        </label>
        <label className="grid gap-1.5 text-xs font-black uppercase tracking-[0.12em] text-slate-500">
          Start time
          <select value={startTime} onChange={(event) => setStartTime(event.target.value)} className="rounded-2xl border border-slate-200 bg-slate-50 px-4 py-3 text-sm font-semibold normal-case tracking-normal text-slate-950 outline-none focus:border-emerald-500 focus:ring-4 focus:ring-emerald-50">
            {experience.startTimes.map((time) => <option key={time}>{time}</option>)}
          </select>
        </label>
        <div className="flex items-center justify-between rounded-2xl border border-slate-200 bg-slate-50 px-4 py-3">
          <div><p className="text-xs font-black uppercase tracking-[0.12em] text-slate-500">Participants</p><p className="mt-1 text-sm text-slate-600">Maximum {experience.maxGuests}</p></div>
          <div className="flex items-center gap-3">
            <button type="button" aria-label="Remove participant" disabled={participants <= 1} onClick={() => setParticipants((count) => Math.max(1, count - 1))} className="grid size-8 place-items-center rounded-full border border-slate-300 bg-white font-bold disabled:opacity-30">−</button>
            <span className="w-5 text-center font-bold">{participants}</span>
            <button type="button" aria-label="Add participant" disabled={participants >= experience.maxGuests} onClick={() => setParticipants((count) => Math.min(experience.maxGuests, count + 1))} className="grid size-8 place-items-center rounded-full border border-slate-300 bg-white font-bold disabled:opacity-30">+</button>
          </div>
        </div>
      </div>

      <button type="button" disabled={submitting} onClick={() => void reserve()} className="mt-5 flex w-full items-center justify-center gap-2 rounded-full bg-rose-500 px-5 py-3.5 text-sm font-bold text-white shadow-lg shadow-rose-500/20 transition hover:-translate-y-0.5 hover:bg-rose-600 disabled:cursor-wait disabled:opacity-60">
        {submitting ? <><LoaderCircle className="size-4 animate-spin" />Reserving…</> : "Reserve experience"}
      </button>
      {error && <p role="alert" className="mt-3 rounded-xl bg-rose-50 px-3.5 py-3 text-sm font-medium leading-5 text-rose-700">{error}</p>}

      <div className="mt-5 space-y-2.5 border-t border-slate-100 pt-4 text-sm">
        <div className="flex justify-between text-slate-600"><span>CHF {experience.price} × {participants}</span><span className="font-medium text-slate-900">CHF {total}</span></div>
        <div className="flex justify-between font-semibold text-slate-950"><span>Total before fees</span><span>CHF {total}</span></div>
      </div>
      <p className="mt-4 flex items-center justify-center gap-1.5 text-xs text-slate-400"><ShieldCheck className="size-3.5" />You won&apos;t be charged yet</p>
    </div>
  );
};

const ExperienceDetails = () => {
  const { slug } = useParams<{ slug: string }>();
  const navigate = useNavigate();
  const { experiences, getExperience } = useExperiences();
  const [experience, setExperience] = useState<Experience | null>(
    () => experiences.find((item) => item.slug === slug) ?? null,
  );
  const [loading, setLoading] = useState(!experience);
  const [error, setError] = useState("");
  const [mobileReserveOpen, setMobileReserveOpen] = useState(false);

  useEffect(() => {
    if (!slug || experience?.slug === slug) return;
    let active = true;
    setLoading(true);
    getExperience(slug)
      .then((value) => { if (active) setExperience(value); })
      .catch((cause) => { if (active) setError(getErrorMessage(cause, "Experience not found")); })
      .finally(() => { if (active) setLoading(false); });
    return () => { active = false; };
  }, [experience?.slug, getExperience, slug]);

  const gallery = useMemo(() => experience?.images.slice(0, 3) ?? [], [experience]);

  if (loading) {
    return <main className="flex min-h-[60vh] items-center justify-center bg-[#fbfcfb]"><p className="flex items-center gap-2 text-sm font-semibold text-slate-500"><LoaderCircle className="size-5 animate-spin text-emerald-600" />Loading this story…</p></main>;
  }
  if (error || !experience) {
    return <main className="flex min-h-[60vh] items-center justify-center bg-[#fbfcfb] px-4 text-center"><div className="max-w-lg rounded-[2rem] border border-rose-100 bg-rose-50 p-8"><Compass className="mx-auto size-9 text-rose-500" /><h1 className="mt-4 text-2xl font-semibold text-slate-950">Experience not found</h1><p className="mt-2 text-slate-600">{error}</p><button onClick={() => navigate("/experiences")} className="mt-5 rounded-full bg-slate-950 px-5 py-2.5 text-sm font-bold text-white">Browse experiences</button></div></main>;
  }

  return (
    <main className="min-h-screen bg-[#fbfcfb] pb-28 lg:pb-16">
      <div className="mx-auto w-full max-w-7xl px-4 py-6 sm:px-6 sm:py-8 lg:px-8">
        <button type="button" onClick={() => navigate(-1)} className="mb-5 inline-flex items-center gap-2 rounded-full border border-slate-200 bg-white px-4 py-2.5 text-sm font-semibold text-slate-700 shadow-sm transition hover:-translate-y-0.5 hover:shadow-md"><ArrowLeft className="size-4" />Back to experiences</button>

        <header className="mb-5">
          <div className="flex flex-wrap items-center gap-3 text-sm text-slate-600">
            <span className="inline-flex items-center gap-1 font-bold text-slate-950"><Star className="size-4 fill-amber-400 text-amber-400" />{experience.rating}</span>
            <span className="font-medium underline decoration-slate-300 underline-offset-4">{experience.reviews} reviews</span>
            <span className="inline-flex items-center gap-1"><MapPin className="size-4 text-emerald-600" />{experience.city}, {experience.country}</span>
          </div>
          <h1 className="mt-3 max-w-4xl text-3xl font-semibold tracking-[-0.04em] text-slate-950 sm:text-5xl">{experience.title}</h1>
        </header>

        <section className="grid h-80 grid-cols-1 gap-1 overflow-hidden rounded-[2rem] bg-slate-200 shadow-[0_24px_70px_-38px_rgba(15,23,42,0.55)] sm:h-[32rem] lg:grid-cols-[1.25fr_0.75fr]">
          <div className="relative overflow-hidden"><img src={gallery[0]} alt={experience.title} className="size-full object-cover" /><div className="absolute inset-0 bg-gradient-to-t from-slate-950/35 via-transparent to-transparent" /><span className="absolute left-5 top-5 inline-flex items-center gap-2 rounded-full bg-slate-950/80 px-3.5 py-2 text-xs font-bold text-white backdrop-blur"><Sparkles className="size-4 text-emerald-300" />Flypnp Moment</span></div>
          <div className="hidden grid-rows-2 gap-1 lg:grid">{gallery.slice(1).map((photo, index) => <img key={photo} src={photo} alt={`${experience.title} view ${index + 2}`} className="size-full min-h-0 object-cover" />)}</div>
        </section>

        <div className="grid gap-10 pt-9 lg:grid-cols-[minmax(0,1fr)_23rem] lg:gap-14">
          <section className="min-w-0">
            <div className="flex flex-wrap gap-2">
              {[
                [Clock3, formatDuration(experience.durationMinutes)],
                [Users, `Up to ${experience.maxGuests} people`],
                [Globe2, experience.languages.join(" · ")],
                [experience.kind === "local-path" ? Route : Compass, experience.kind === "local-path" ? "Local Path" : "Small-group moment"],
              ].map(([Icon, label]) => {
                const ItemIcon = Icon as typeof Clock3;
                return <span key={String(label)} className="inline-flex items-center gap-2 rounded-full border border-slate-200 bg-white px-3.5 py-2 text-sm font-semibold text-slate-600 shadow-sm"><ItemIcon className="size-4 text-emerald-700" />{String(label)}</span>;
              })}
            </div>

            <div className="border-b border-slate-200 py-9">
              <p className="text-xs font-black uppercase tracking-[0.18em] text-emerald-700">The story</p>
              <h2 className="mt-3 text-2xl font-semibold leading-tight tracking-tight text-slate-950 sm:text-3xl">{experience.summary}</h2>
              <p className="mt-5 max-w-3xl leading-7 text-slate-600">{experience.description}</p>
            </div>

            <div className="border-b border-slate-200 py-9">
              <p className="text-xs font-black uppercase tracking-[0.18em] text-emerald-700">Your path</p>
              <div className="mt-6 grid gap-4">
                {experience.highlights.map((highlight, index) => (
                  <div key={highlight} className="flex gap-4 rounded-2xl bg-white p-5 ring-1 ring-slate-200">
                    <span className="grid size-9 shrink-0 place-items-center rounded-full bg-slate-950 text-sm font-bold text-white">{index + 1}</span>
                    <div><p className="font-semibold text-slate-950">{highlight}</p><p className="mt-1 text-sm text-slate-500">A thoughtful stop hosted by {experience.host.name}.</p></div>
                  </div>
                ))}
              </div>
            </div>

            <div className="border-b border-slate-200 py-9">
              <div className="flex items-center gap-5">
                <div className="relative size-20 shrink-0"><img src={experience.host.avatar} alt={experience.host.name} className="size-full rounded-full object-cover ring-4 ring-white shadow-lg" /><span className="absolute -bottom-1 -right-1 grid size-8 place-items-center rounded-full bg-emerald-500 text-slate-950 ring-2 ring-white"><Award className="size-4" /></span></div>
                <div><p className="text-xs font-black uppercase tracking-[0.18em] text-emerald-700">Your local storyteller</p><h2 className="mt-1 text-2xl font-semibold text-slate-950">Hosted by {experience.host.name}</h2><p className="mt-1 text-sm text-slate-500">{experience.host.yearsHosting} years sharing local stories</p></div>
              </div>
              <p className="mt-5 max-w-2xl leading-7 text-slate-600">{experience.host.bio}</p>
            </div>

            <div className="grid gap-5 py-9 sm:grid-cols-2">
              <article className="rounded-[1.5rem] border border-slate-200 bg-white p-6"><span className="grid size-10 place-items-center rounded-xl bg-emerald-50 text-emerald-700"><Check className="size-5" /></span><h3 className="mt-4 text-lg font-semibold text-slate-950">What&apos;s included</h3><ul className="mt-3 space-y-2 text-sm text-slate-600">{experience.included.map((item) => <li key={item} className="flex gap-2"><span className="text-emerald-600">•</span>{item}</li>)}</ul></article>
              <article className="rounded-[1.5rem] border border-slate-200 bg-white p-6"><span className="grid size-10 place-items-center rounded-xl bg-amber-50 text-amber-700"><Compass className="size-5" /></span><h3 className="mt-4 text-lg font-semibold text-slate-950">What to bring</h3><ul className="mt-3 space-y-2 text-sm text-slate-600">{experience.bring.map((item) => <li key={item} className="flex gap-2"><span className="text-amber-600">•</span>{item}</li>)}</ul></article>
            </div>

            <div className="rounded-[1.75rem] bg-slate-950 p-6 text-white sm:p-8">
              <div className="flex gap-4"><span className="grid size-12 shrink-0 place-items-center rounded-2xl bg-emerald-400 text-slate-950"><MapPin className="size-6" /></span><div><p className="text-xs font-black uppercase tracking-[0.18em] text-emerald-300">Meeting point</p><h3 className="mt-2 text-xl font-semibold">{experience.meetingPoint}</h3><p className="mt-2 text-sm leading-6 text-slate-400">The exact meeting instructions will appear in Trips after payment.</p></div></div>
            </div>
          </section>

          <aside className="hidden lg:block"><div className="sticky top-32"><ReserveExperience experience={experience} /></div></aside>
        </div>
      </div>

      <div className="fixed inset-x-0 bottom-0 z-40 border-t border-slate-200 bg-white/95 px-4 py-3 shadow-[0_-12px_35px_-25px_rgba(15,23,42,0.55)] backdrop-blur-xl lg:hidden">
        <div className="mx-auto flex max-w-7xl items-center justify-between gap-4"><div><p className="text-lg font-semibold text-slate-950">CHF {experience.price} <span className="text-sm font-normal text-slate-500">/ person</span></p><p className="mt-0.5 flex items-center gap-1 text-xs font-semibold text-slate-700"><Star className="size-3.5 fill-amber-400 text-amber-400" />{experience.rating} · {formatDuration(experience.durationMinutes)}</p></div><button type="button" onClick={() => setMobileReserveOpen(true)} className="rounded-full bg-rose-500 px-7 py-3 text-sm font-bold text-white shadow-lg shadow-rose-500/20">Reserve</button></div>
      </div>

      {mobileReserveOpen && (
        <div className="fixed inset-0 z-[100] flex items-end bg-slate-950/65 backdrop-blur-sm lg:hidden" role="dialog" aria-modal="true" aria-label="Reserve experience">
          <button type="button" aria-label="Close reservation overlay" onClick={() => setMobileReserveOpen(false)} className="absolute inset-0" />
          <div className="relative max-h-[92vh] w-full overflow-y-auto rounded-t-[2rem] bg-[#fbfcfb] p-4 pb-8 sm:mx-auto sm:mb-4 sm:max-w-md sm:rounded-[2rem]">
            <div className="mb-3 flex justify-end"><button type="button" aria-label="Close reservation" onClick={() => setMobileReserveOpen(false)} className="grid size-9 place-items-center rounded-full bg-white text-slate-700 shadow-sm ring-1 ring-slate-200"><X className="size-5" /></button></div>
            <ReserveExperience experience={experience} onReserved={() => setMobileReserveOpen(false)} />
          </div>
        </div>
      )}
    </main>
  );
};

export default ExperienceDetails;
