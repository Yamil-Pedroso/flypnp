import { useEffect, useMemo, useState } from "react";
import { Link } from "react-router-dom";
import { AnimatePresence, motion } from "framer-motion";
import { toast } from "sonner";
import {
  ArrowUpRight,
  Compass,
  History,
  MapPin,
  PlaneTakeoff,
  RefreshCw,
  Sparkles,
  Users,
  CreditCard,
  AlertTriangle,
  LoaderCircle,
  Trash2,
  X,
  Ticket,
  Clock3,
  Phone,
  Mail,
  MessageCircle,
} from "lucide-react";
import { useBooking, useExperiences } from "../../lib/hooks";
import { getBookingPaymentPath, getExperiencePaymentPath, getServicePaymentPath } from "../../lib/payment";
import { isDateOnlyOnOrAfter, localDateKey } from "../../lib/date-only";
import { getErrorMessage, travelServicesService, type Booking, type ExperienceBooking, type ServiceRequest } from "../../services";
import emptyBoxDrawing from "../../assets/images/png/empty-box.png";
import images from "../../assets/images";
import { useTranslation } from "react-i18next";

type TripView = "upcoming" | "past";

const petCareImages = [images.pet1, images.pet2, images.pet3];

const formatDate = (date: string, locale: string) => new Intl.DateTimeFormat(locale, {
  day: "numeric",
  month: "short",
  year: "numeric",
}).format(new Date(date));

const getGuestCount = (booking: Booking) => {
  const { adults, children, infants } = booking.numOfGuests;
  return adults + children + infants;
};

const TripCard = ({ booking, past, onDelete }: { booking: Booking; past: boolean; onDelete: (booking: Booking) => void }) => {
  const { t, i18n } = useTranslation("bookings");
  const locale = i18n.resolvedLanguage ?? i18n.language;
  const photo = booking.place?.photos[0]?.main;
  const statusStyles = {
    pending: "bg-amber-50 text-amber-700",
    confirmed: "bg-emerald-50 text-emerald-700",
    cancelled: "bg-rose-50 text-rose-700",
  }[booking.status];

  return (
    <article className="group overflow-hidden rounded-[1.75rem] border border-slate-200/80 bg-white shadow-sm transition duration-300 hover:-translate-y-1 hover:shadow-xl">
      <div className="relative aspect-[16/10] overflow-hidden bg-slate-200">
        {photo ? <img src={photo} alt={booking.place.title} className={`size-full object-cover transition duration-700 group-hover:scale-105 ${past ? "saturate-[0.65]" : ""}`} /> : <div className="flex size-full items-center justify-center bg-emerald-50 text-emerald-700"><Compass className="size-10" /></div>}
        <div className="absolute inset-0 bg-gradient-to-t from-slate-950/55 via-transparent to-transparent" />
        <span className={`absolute left-4 top-4 rounded-full px-3 py-1.5 text-xs font-semibold capitalize shadow-sm ${statusStyles}`}>{t(`common.${booking.status}`)}</span>
        <button type="button" aria-label={t("trips.deleteStay", { title: booking.place.title })} onClick={() => onDelete(booking)} className="absolute right-4 top-4 grid size-9 place-items-center rounded-full bg-white/90 text-slate-700 shadow-sm backdrop-blur transition hover:scale-105 hover:bg-rose-500 hover:text-white"><Trash2 className="size-4" /></button>
        <div className="absolute inset-x-4 bottom-4 text-white">
          <p className="flex items-center gap-1.5 text-xs font-medium text-white/80"><MapPin className="size-3.5" />{booking.place.address}</p>
          <h2 className="mt-1 line-clamp-1 text-xl font-semibold">{booking.place.title}</h2>
        </div>
      </div>

      <div className="p-5">
        <div className="grid grid-cols-2 gap-4 text-sm">
          <div><p className="text-xs font-medium uppercase tracking-wide text-slate-400">{t("common.checkIn")}</p><p className="mt-1 font-semibold text-slate-800">{formatDate(booking.checkIn, locale)}</p></div>
          <div><p className="text-xs font-medium uppercase tracking-wide text-slate-400">{t("common.checkOut")}</p><p className="mt-1 font-semibold text-slate-800">{formatDate(booking.checkOut, locale)}</p></div>
        </div>
        <div className="mt-5 flex flex-wrap items-center justify-between gap-3 border-t border-slate-100 pt-4">
          <span className="flex items-center gap-2 text-sm text-slate-500"><Users className="size-4" />{t("trips.guests", { count: getGuestCount(booking) })}</span>
          <div className="flex flex-wrap items-center justify-end gap-3">
            {booking.place.owner && (
              <Link to={`/messages?booking=${booking._id}`} className="inline-flex items-center gap-1.5 text-sm font-semibold text-emerald-700 transition hover:text-emerald-900"><MessageCircle className="size-4" />{t("trips.messageHost")}</Link>
            )}
            {booking.status === "pending" && !past ? (
              <Link to={getBookingPaymentPath(booking)} className="inline-flex items-center gap-2 rounded-full bg-rose-500 px-4 py-2 text-sm font-bold text-white shadow-md shadow-rose-500/20 transition hover:-translate-y-0.5 hover:bg-rose-600"><CreditCard className="size-4" />{t("common.completePayment")}</Link>
            ) : (
              <Link to={`/place/${booking.place.category}/${booking.place._id}`} className="flex items-center gap-1.5 text-sm font-semibold text-slate-900 transition group-hover:text-emerald-700">{t(past ? "trips.viewStay" : "trips.tripDetails")}<ArrowUpRight className="size-4" /></Link>
            )}
          </div>
        </div>
      </div>
    </article>
  );
};

const ExperienceTripCard = ({ booking, past, onDelete }: { booking: ExperienceBooking; past: boolean; onDelete: (booking: ExperienceBooking) => void }) => {
  const { t, i18n } = useTranslation("bookings");
  const locale = i18n.resolvedLanguage ?? i18n.language;
  const { experience } = booking;
  const statusStyles = {
    pending: "bg-amber-50 text-amber-700",
    confirmed: "bg-emerald-50 text-emerald-700",
    cancelled: "bg-rose-50 text-rose-700",
  }[booking.status];
  return (
    <article className="group overflow-hidden rounded-[1.75rem] border border-emerald-200/70 bg-white shadow-sm transition duration-300 hover:-translate-y-1 hover:shadow-xl">
      <div className="relative aspect-[16/10] overflow-hidden bg-slate-200">
        <img src={experience.images[0]} alt={experience.title} className={`size-full object-cover transition duration-700 group-hover:scale-105 ${past ? "saturate-[0.65]" : ""}`} />
        <div className="absolute inset-0 bg-gradient-to-t from-slate-950/70 via-transparent to-transparent" />
        <span className="absolute left-4 top-4 inline-flex items-center gap-1.5 rounded-full bg-emerald-400 px-3 py-1.5 text-xs font-black uppercase tracking-wide text-slate-950 shadow-sm"><Ticket className="size-3.5" />{t("trips.experience")}</span>
        <span className={`absolute left-4 top-14 rounded-full px-3 py-1.5 text-xs font-semibold capitalize shadow-sm ${statusStyles}`}>{t(`common.${booking.status}`)}</span>
        <button type="button" aria-label={t("trips.deleteExperience", { title: experience.title })} onClick={() => onDelete(booking)} className="absolute right-4 top-4 grid size-9 place-items-center rounded-full bg-white/90 text-slate-700 shadow-sm backdrop-blur transition hover:scale-105 hover:bg-rose-500 hover:text-white"><Trash2 className="size-4" /></button>
        <div className="absolute inset-x-4 bottom-4 text-white"><p className="flex items-center gap-1.5 text-xs font-medium text-white/80"><MapPin className="size-3.5" />{experience.city}, {experience.country}</p><h2 className="mt-1 line-clamp-1 text-xl font-semibold">{experience.title}</h2></div>
      </div>
      <div className="p-5">
        <div className="grid grid-cols-2 gap-4 text-sm">
          <div><p className="text-xs font-medium uppercase tracking-wide text-slate-400">{t("common.date")}</p><p className="mt-1 font-semibold text-slate-800">{formatDate(booking.date, locale)}</p></div>
          <div><p className="text-xs font-medium uppercase tracking-wide text-slate-400">{t("common.starts")}</p><p className="mt-1 flex items-center gap-1.5 font-semibold text-slate-800"><Clock3 className="size-4 text-emerald-600" />{booking.startTime}</p></div>
        </div>
        <div className="mt-5 flex flex-wrap items-center justify-between gap-3 border-t border-slate-100 pt-4">
          <span className="flex items-center gap-2 text-sm text-slate-500"><Users className="size-4" />{t("trips.participants", { count: booking.participants })}</span>
          {booking.status === "pending" && !past ? (
            <Link to={getExperiencePaymentPath(booking)} className="inline-flex items-center gap-2 rounded-full bg-rose-500 px-4 py-2 text-sm font-bold text-white shadow-md shadow-rose-500/20 transition hover:-translate-y-0.5 hover:bg-rose-600"><CreditCard className="size-4" />{t("common.completePayment")}</Link>
          ) : (
            <Link to={`/experiences/${experience.slug}`} className="flex items-center gap-1.5 text-sm font-semibold text-slate-900 transition group-hover:text-emerald-700">{t(past ? "trips.viewMemory" : "trips.experienceDetails")}<ArrowUpRight className="size-4" /></Link>
          )}
        </div>
      </div>
    </article>
  );
};

const ServiceTripCard = ({ request, past, onDelete, petCareImage }: { request: ServiceRequest; past: boolean; onDelete: (request: ServiceRequest) => void; petCareImage?: string }) => {
  const { t, i18n } = useTranslation("bookings");
  const { t: serviceT } = useTranslation("services");
  const locale = i18n.resolvedLanguage ?? i18n.language;
  const name = serviceT(`names.${request.serviceType === "airport-transfer" ? "airport" : request.serviceType === "pet-care" ? "pet" : "guide"}`);
  const service = {
    "airport-transfer": { gradient: "from-sky-950 to-sky-700" },
    "pet-care": { gradient: "from-amber-950 to-amber-700" },
    "local-guide": { gradient: "from-emerald-950 to-emerald-700" },
  }[request.serviceType];
  const statusStyles = {
    requested: "bg-amber-50 text-amber-700",
    quoted: "bg-sky-50 text-sky-700",
    confirmed: "bg-emerald-50 text-emerald-700",
    cancelled: "bg-rose-50 text-rose-700",
  }[request.status];
  const serviceImage = request.serviceType === "pet-care"
    ? petCareImage ?? images.pet1
    : request.serviceType === "airport-transfer"
      ? images.airportTransfer
      : images.localGuide;

  return (
    <article className="group overflow-hidden rounded-[1.75rem] border border-sky-200/70 bg-white shadow-sm transition duration-300 hover:-translate-y-1 hover:shadow-xl">
      <div className={`relative flex aspect-[16/10] items-center justify-center overflow-hidden bg-gradient-to-br ${service.gradient} ${past ? "saturate-[0.65]" : ""}`}>
        <img src={serviceImage} alt={t("trips.serviceAlt", { service: name, destination: request.destination })} className="size-full object-cover transition duration-700 group-hover:scale-105" />
        <div className="absolute inset-0 bg-gradient-to-t from-slate-950/70 via-transparent to-transparent" />
        <span className="absolute left-4 top-4 rounded-full bg-white/15 px-3 py-1.5 text-xs font-black uppercase tracking-wide text-white ring-1 ring-white/20 backdrop-blur">{t("trips.service")}</span>
        <span className={`absolute left-4 top-14 rounded-full px-3 py-1.5 text-xs font-semibold capitalize shadow-sm ${statusStyles}`}>{serviceT(`status.${request.status}`)}</span>
        {request.status !== "confirmed" && <button type="button" aria-label={t("trips.deleteService", { service: name })} onClick={() => onDelete(request)} className="absolute right-4 top-4 grid size-9 place-items-center rounded-full bg-white/90 text-slate-700 shadow-sm transition hover:scale-105 hover:bg-rose-500 hover:text-white"><Trash2 className="size-4" /></button>}
        <div className="absolute inset-x-4 bottom-4 text-white"><p className="flex items-center gap-1.5 text-xs font-medium text-white/75"><MapPin className="size-3.5" />{request.destination}</p><h2 className="mt-1 text-xl font-semibold">{name}</h2></div>
      </div>
      <div className="p-5">
        <div className="grid grid-cols-2 gap-4 text-sm">
          <div><p className="text-xs font-medium uppercase tracking-wide text-slate-400">{t("common.date")}</p><p className="mt-1 font-semibold text-slate-800">{formatDate(request.date, locale)}</p></div>
          <div><p className="text-xs font-medium uppercase tracking-wide text-slate-400">{t("common.time")}</p><p className="mt-1 flex items-center gap-1.5 font-semibold text-slate-800"><Clock3 className="size-4 text-emerald-600" />{request.time}</p></div>
        </div>
        {request.status === "confirmed" && request.provider && (
          <div className="mt-4 rounded-2xl bg-emerald-50 p-3.5 text-xs text-emerald-900">
            <p className="font-bold">{request.provider.name}</p>
            <div className="mt-2 flex flex-wrap gap-3 text-emerald-700">
              {request.provider.phone && <a href={`tel:${request.provider.phone}`} className="inline-flex items-center gap-1"><Phone className="size-3.5" />{request.provider.phone}</a>}
              {request.provider.email && <a href={`mailto:${request.provider.email}`} className="inline-flex items-center gap-1"><Mail className="size-3.5" />{request.provider.email}</a>}
            </div>
          </div>
        )}
        <div className="mt-5 flex flex-wrap items-center justify-between gap-3 border-t border-slate-100 pt-4">
          <span className="flex items-center gap-2 text-sm text-slate-500"><Users className="size-4" />{t("trips.travelers", { count: request.participants })}</span>
          {request.status === "quoted" && request.quotePrice ? (
            <Link to={getServicePaymentPath(request)} className="inline-flex items-center gap-2 rounded-full bg-rose-500 px-4 py-2 text-sm font-bold text-white shadow-md shadow-rose-500/20 transition hover:bg-rose-600"><CreditCard className="size-4" />{t("trips.pay", { price: request.quotePrice.toFixed(2) })}</Link>
          ) : request.status === "requested" ? (
            <Link to="/services" className="text-sm font-semibold text-slate-600 transition hover:text-emerald-700">{t("trips.awaiting")}</Link>
          ) : (
            <Link to="/services" className="flex items-center gap-1.5 text-sm font-semibold text-slate-900 transition hover:text-emerald-700">{t("trips.serviceDetails")}<ArrowUpRight className="size-4" /></Link>
          )}
        </div>
      </div>
    </article>
  );
};

const Trips = () => {
  const { t } = useTranslation("bookings");
  const { t: serviceT } = useTranslation("services");
  const serviceName = (type: ServiceRequest["serviceType"]) => serviceT(`names.${type === "airport-transfer" ? "airport" : type === "pet-care" ? "pet" : "guide"}`);
  const { bookings, loading, error, refresh, deleteBooking } = useBooking();
  const { bookings: experienceBookings, bookingsLoading, deleteBooking: deleteExperienceBooking } = useExperiences();
  const [serviceRequests, setServiceRequests] = useState<ServiceRequest[]>([]);
  const [servicesLoading, setServicesLoading] = useState(true);
  const [view, setView] = useState<TripView>("upcoming");
  const [tripToDelete, setTripToDelete] = useState<
    { kind: "stay"; booking: Booking } | { kind: "experience"; booking: ExperienceBooking } | { kind: "service"; booking: ServiceRequest } | null
  >(null);
  const [deleting, setDeleting] = useState(false);
  const [deleteError, setDeleteError] = useState("");
  const now = new Date();
  const today = new Date();
  today.setHours(0, 0, 0, 0);
  const todayKey = localDateKey(today);
  const upcomingTrips = bookings.filter((booking) => new Date(booking.checkOut) >= now && booking.status !== "cancelled");
  const pastTrips = bookings.filter((booking) => new Date(booking.checkOut) < now || booking.status === "cancelled");
  const visibleTrips = view === "upcoming" ? upcomingTrips : pastTrips;
  const upcomingExperiences = experienceBookings.filter(
    (booking) =>
      new Date(booking.date) >= today && booking.status !== "cancelled",
  );
  const pastExperiences = experienceBookings.filter(
    (booking) =>
      new Date(booking.date) < today || booking.status === "cancelled",
  );
  const visibleExperiences = view === "upcoming" ? upcomingExperiences : pastExperiences;
  const upcomingServices = serviceRequests.filter((request) => isDateOnlyOnOrAfter(request.date, todayKey) && request.status !== "cancelled");
  const pastServices = serviceRequests.filter((request) => !isDateOnlyOnOrAfter(request.date, todayKey) || request.status === "cancelled");
  const visibleServices = view === "upcoming" ? upcomingServices : pastServices;
  const petCareImageByRequest = useMemo(() => {
    const requests = serviceRequests
      .filter((request) => request.serviceType === "pet-care")
      .map((request, listIndex) => ({ request, listIndex }))
      .sort((a, b) => {
        if (a.request.createdAt && b.request.createdAt) {
          return new Date(a.request.createdAt).getTime() - new Date(b.request.createdAt).getTime();
        }
        return a.listIndex - b.listIndex;
      });

    return new Map(requests.map(({ request }, index) => [request._id, petCareImages[index % petCareImages.length]]));
  }, [serviceRequests]);
  const upcomingCount = upcomingTrips.length + upcomingExperiences.length + upcomingServices.length;
  const pastCount = pastTrips.length + pastExperiences.length + pastServices.length;

  useEffect(() => {
    let active = true;
    setServicesLoading(true);
    travelServicesService.listRequests()
      .then((requests) => { if (active) setServiceRequests(requests); })
      .catch(() => undefined)
      .finally(() => { if (active) setServicesLoading(false); });
    return () => { active = false; };
  }, []);

  const requestDelete = (booking: Booking) => {
    setDeleteError("");
    setTripToDelete({ kind: "stay", booking });
  };

  const requestExperienceDelete = (booking: ExperienceBooking) => {
    setDeleteError("");
    setTripToDelete({ kind: "experience", booking });
  };

  const requestServiceDelete = (booking: ServiceRequest) => {
    setDeleteError("");
    setTripToDelete({ kind: "service", booking });
  };

  const confirmDelete = async () => {
    if (!tripToDelete || deleting) return;
    try {
      setDeleting(true);
      setDeleteError("");
      if (tripToDelete.kind === "stay") {
        await deleteBooking(tripToDelete.booking._id);
      } else if (tripToDelete.kind === "experience") {
        await deleteExperienceBooking(tripToDelete.booking._id);
      } else {
        await travelServicesService.cancelRequest(tripToDelete.booking._id);
        setServiceRequests((current) => current.filter((request) => request._id !== tripToDelete.booking._id));
      }
      toast.success(t("trips.deleted"), { icon: <Trash2 className="size-4" /> });
      setTripToDelete(null);
    } catch (cause) {
      setDeleteError(getErrorMessage(cause, t("trips.deleteError")));
    } finally {
      setDeleting(false);
    }
  };

  return (
    <main className="min-h-screen bg-[#f6f8f6] pb-16">
      <div className="mx-auto w-full max-w-7xl px-4 pt-8 sm:px-6 sm:pt-12 lg:px-8">
        <section className="relative isolate overflow-hidden rounded-[2rem] bg-slate-950 px-6 py-9 text-white sm:px-10 sm:py-12 lg:px-14">
          <div className="absolute -right-16 -top-24 size-72 rounded-full bg-emerald-500/20 blur-3xl" />
          <div className="absolute -bottom-24 right-40 size-64 rounded-full bg-sky-500/15 blur-3xl" />
          <div className="relative grid gap-8 lg:grid-cols-[1fr_auto] lg:items-end">
            <div className="max-w-2xl">
              <div className="flex items-center gap-2 text-emerald-300"><PlaneTakeoff className="size-5" /><span className="text-xs font-semibold uppercase tracking-[0.18em]">{t("trips.journal")}</span></div>
              <h1 className="mt-4 text-4xl font-semibold tracking-tight sm:text-5xl">{t("trips.title")}</h1>
              <p className="mt-4 max-w-xl leading-7 text-slate-300">{t("trips.subtitle")}</p>
            </div>
            <div className="flex gap-3">
              <div className="min-w-24 rounded-2xl border border-white/10 bg-white/10 px-4 py-3 backdrop-blur"><p className="text-2xl font-semibold">{upcomingCount}</p><p className="text-xs text-slate-300">{t("trips.upcoming")}</p></div>
              <div className="min-w-24 rounded-2xl border border-white/10 bg-white/10 px-4 py-3 backdrop-blur"><p className="text-2xl font-semibold">{pastCount}</p><p className="text-xs text-slate-300">{t("trips.memories")}</p></div>
            </div>
          </div>
        </section>

        <section className="pt-8 sm:pt-10">
          <div className="flex flex-col gap-5 sm:flex-row sm:items-end sm:justify-between">
            <div><p className="text-sm font-semibold uppercase tracking-[0.16em] text-emerald-700">{t("trips.plans")}</p><h2 className="mt-1 text-3xl font-semibold tracking-tight text-slate-950">{t("trips.yourTrips")}</h2></div>
            <div className="flex w-fit rounded-full border border-slate-200 bg-white p-1 shadow-sm" role="tablist" aria-label={t("trips.views")}>
              <button type="button" role="tab" aria-selected={view === "upcoming"} onClick={() => setView("upcoming")} className={`flex items-center gap-2 rounded-full px-4 py-2 text-sm font-semibold transition ${view === "upcoming" ? "bg-slate-900 text-white" : "text-slate-500 hover:text-slate-900"}`}><PlaneTakeoff className="size-4" />{t("trips.upcoming")} <span className="opacity-60">{upcomingCount}</span></button>
              <button type="button" role="tab" aria-selected={view === "past"} onClick={() => setView("past")} className={`flex items-center gap-2 rounded-full px-4 py-2 text-sm font-semibold transition ${view === "past" ? "bg-slate-900 text-white" : "text-slate-500 hover:text-slate-900"}`}><History className="size-4" />{t("trips.past")} <span className="opacity-60">{pastCount}</span></button>
            </div>
          </div>

          {loading || bookingsLoading || servicesLoading ? (
            <div className="mt-7 grid gap-6 md:grid-cols-2 xl:grid-cols-3" aria-label={t("trips.loading")}>{Array.from({ length: 3 }).map((_, index) => <div key={index} className="h-[28rem] animate-pulse rounded-[1.75rem] bg-slate-200" />)}</div>
          ) : error ? (
            <div className="mt-7 rounded-[1.75rem] border border-rose-100 bg-rose-50 px-6 py-12 text-center" role="alert"><RefreshCw className="mx-auto size-8 text-rose-500" /><h3 className="mt-4 text-xl font-semibold text-slate-950">{t("trips.loadTitle")}</h3><p className="mt-2 text-slate-600">{t("trips.loadText")}</p><button type="button" onClick={() => void refresh()} className="mt-5 rounded-full bg-slate-900 px-5 py-2.5 text-sm font-semibold text-white transition hover:bg-slate-700">{t("common.tryAgain")}</button></div>
          ) : visibleTrips.length || visibleExperiences.length || visibleServices.length ? (
            <div className="mt-7 grid gap-6 md:grid-cols-2 xl:grid-cols-3">
              {visibleTrips.map((booking) => <TripCard key={booking._id} booking={booking} past={view === "past"} onDelete={requestDelete} />)}
              {visibleExperiences.map((booking) => <ExperienceTripCard key={booking._id} booking={booking} past={view === "past"} onDelete={requestExperienceDelete} />)}
              {visibleServices.map((request) => <ServiceTripCard key={request._id} request={request} past={view === "past"} onDelete={requestServiceDelete} petCareImage={petCareImageByRequest.get(request._id)} />)}
            </div>
          ) : (
            <div className="relative mt-7 overflow-hidden rounded-[2rem] border border-slate-200 bg-white px-6 py-14 text-center shadow-sm sm:px-10 sm:py-20">
              <div className="absolute left-1/2 top-0 h-px w-2/3 -translate-x-1/2 bg-gradient-to-r from-transparent via-emerald-300 to-transparent" />
              <div className="relative mx-auto w-full max-w-sm">
                <div className="absolute inset-x-10 bottom-4 h-24 rounded-full bg-emerald-100/70 blur-3xl" />
                <img src={emptyBoxDrawing} alt={t("trips.emptyAlt")} className="relative mx-auto h-48 w-full object-contain sm:h-60" />
              </div>
              <Sparkles className="absolute left-[16%] top-20 size-5 text-amber-400 sm:left-[24%]" /><Sparkles className="absolute right-[17%] top-32 size-4 text-rose-400 sm:right-[25%]" />
              <h3 className="mt-4 text-2xl font-semibold tracking-tight text-slate-950">{t(view === "upcoming" ? "trips.emptyUpcoming" : "trips.emptyPast")}</h3>
              <p className="mx-auto mt-3 max-w-lg leading-7 text-slate-500">{t(view === "upcoming" ? "trips.emptyUpcomingText" : "trips.emptyPastText")}</p>
              {view === "upcoming" && <Link to="/" className="mt-7 inline-flex items-center gap-2 rounded-full bg-rose-500 px-6 py-3 text-sm font-semibold text-white shadow-lg shadow-rose-500/20 transition hover:-translate-y-0.5 hover:bg-rose-600"><Compass className="size-4" />{t("trips.explore")}</Link>}
            </div>
          )}
        </section>
      </div>

      <AnimatePresence>
        {tripToDelete && (
          <motion.div className="fixed inset-0 z-[100] grid place-items-center bg-slate-950/60 p-4 backdrop-blur-sm" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}>
            <button type="button" aria-label={t("trips.closeOverlay")} onClick={() => !deleting && setTripToDelete(null)} className="absolute inset-0 cursor-default" />
            <motion.div role="dialog" aria-modal="true" aria-label={t("trips.deleteDialog")} initial={{ opacity: 0, y: 18, scale: 0.96 }} animate={{ opacity: 1, y: 0, scale: 1 }} exit={{ opacity: 0, y: 12, scale: 0.97 }} transition={{ type: "spring", stiffness: 360, damping: 28 }} className="relative w-full max-w-md rounded-[1.75rem] bg-white p-6 shadow-2xl sm:p-7">
              <button type="button" aria-label={t("trips.closeDelete")} disabled={deleting} onClick={() => setTripToDelete(null)} className="absolute right-4 top-4 grid size-9 place-items-center rounded-full bg-slate-100 text-slate-600 transition hover:bg-slate-950 hover:text-white disabled:opacity-50"><X className="size-4" /></button>
              <span className="grid size-12 place-items-center rounded-2xl bg-rose-50 text-rose-600"><AlertTriangle className="size-6" /></span>
              <h2 className="mt-5 text-2xl font-semibold tracking-tight text-slate-950">{t("trips.removeTitle")}</h2>
              <p className="mt-2 pr-5 text-sm leading-6 text-slate-600">{t("trips.removeText", { title: tripToDelete.kind === "stay" ? tripToDelete.booking.place.title : tripToDelete.kind === "experience" ? tripToDelete.booking.experience.title : serviceName(tripToDelete.booking.serviceType) })} {"status" in tripToDelete.booking && (tripToDelete.booking.status === "pending" || tripToDelete.booking.status === "quoted" || tripToDelete.booking.status === "requested") ? t("trips.pendingCancelled") : t("trips.paymentProtected")}</p>
              {deleteError && <p role="alert" className="mt-4 rounded-xl bg-rose-50 px-3.5 py-3 text-sm font-medium text-rose-700">{deleteError}</p>}
              <div className="mt-6 flex flex-col-reverse gap-3 sm:flex-row sm:justify-end">
                <button type="button" disabled={deleting} onClick={() => setTripToDelete(null)} className="rounded-full border border-slate-300 px-5 py-2.5 text-sm font-semibold text-slate-700 transition hover:border-slate-950 disabled:opacity-50">{t("trips.keep")}</button>
                <button type="button" disabled={deleting} onClick={() => void confirmDelete()} className="inline-flex items-center justify-center gap-2 rounded-full bg-rose-500 px-5 py-2.5 text-sm font-bold text-white shadow-lg shadow-rose-500/20 transition hover:bg-rose-600 disabled:cursor-wait disabled:opacity-60">{deleting ? <><LoaderCircle className="size-4 animate-spin" />{t("common.remove")}</> : <><Trash2 className="size-4" />{t("trips.removeTrip")}</>}</button>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </main>
  );
};

export default Trips;
