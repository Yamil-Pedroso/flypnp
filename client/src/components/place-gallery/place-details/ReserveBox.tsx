import { useState } from "react";
import { useNavigate, useParams, useSearchParams } from "react-router-dom";
import {
  CalendarDays,
  ChevronDown,
  ChevronUp,
  Minus,
  Plus,
  ShieldCheck,
  Star,
  X,
} from "lucide-react";
import { useAuth, useBooking, usePlaces } from "../../../lib/hooks";
import { getErrorMessage, type GuestCount } from "../../../services";
import MyCalendar from "../../common/calendar/Calendar";
import { useTravelSearch } from "../../search/SearchContext";
import { useTranslation } from "react-i18next";

type CounterProps = {
  label: string;
  note: string;
  value: number;
  maximum: number;
  onChange: (count: number) => void;
};

const GuestCounter = ({ label, note, value, maximum, onChange }: CounterProps) => {
  const { t } = useTranslation("places");
  return (
  <div className="flex items-center justify-between gap-5 border-b border-slate-100 py-3.5 last:border-0">
    <div>
      <p className="text-sm font-semibold text-slate-950">{label}</p>
      <p className="mt-0.5 text-xs text-slate-500">{note}</p>
    </div>
    <div className="flex items-center gap-3">
      <button type="button" aria-label={t("reservation.remove", { label })} disabled={value === 0} onClick={() => onChange(value - 1)} className="grid size-8 place-items-center rounded-full border border-slate-300 text-slate-700 transition hover:border-slate-950 disabled:cursor-not-allowed disabled:border-slate-200 disabled:text-slate-300"><Minus className="size-4" /></button>
      <span className="w-5 text-center text-sm font-semibold tabular-nums text-slate-950">{value}</span>
      <button type="button" aria-label={t("reservation.add", { label })} disabled={value === maximum} onClick={() => onChange(value + 1)} className="grid size-8 place-items-center rounded-full border border-slate-300 text-slate-700 transition hover:border-slate-950 disabled:cursor-not-allowed disabled:border-slate-200 disabled:text-slate-300"><Plus className="size-4" /></button>
    </div>
  </div>
  );
};

const parseCount = (value: string | null) => {
  const count = Number(value);
  return Number.isInteger(count) && count >= 0 ? count : 0;
};

const formatSelectedDate = (value: string, locale: string, emptyLabel: string) => {
  if (!value) return emptyLabel;
  return new Intl.DateTimeFormat(locale, { month: "short", day: "numeric", year: "numeric" }).format(new Date(`${value}T00:00:00`));
};

const ReserveBox = () => {
  const { t, i18n } = useTranslation("places");
  const navigate = useNavigate();
  const [searchParams, setSearchParams] = useSearchParams();
  const { id, category } = useParams();
  const { places, loading } = usePlaces();
  const { user } = useAuth();
  const { addBooking } = useBooking();
  const { setCheckIn: setTravelCheckIn, setCheckOut: setTravelCheckOut, setGuests: setTravelGuests } = useTravelSearch();
  const [guestPickerOpen, setGuestPickerOpen] = useState(false);
  const [calendarOpen, setCalendarOpen] = useState(false);
  const [checkInDate, setCheckInDate] = useState(() => searchParams.get("checkIn") ?? "");
  const [checkOutDate, setCheckOutDate] = useState(() => searchParams.get("checkOut") ?? "");
  const [guestCounts, setGuestCounts] = useState<GuestCount>(() => ({
    adults: parseCount(searchParams.get("adults")),
    children: parseCount(searchParams.get("children")),
    infants: parseCount(searchParams.get("infants")),
    pets: parseCount(searchParams.get("pets")),
  }));
  const [isReserving, setIsReserving] = useState(false);
  const [reservationError, setReservationError] = useState<string | null>(null);

  const place = places.find(
    (candidate) => candidate._id === id && candidate.category === category,
  );

  if (loading) return <div className="h-96 animate-pulse rounded-[1.75rem] bg-slate-200" aria-label={t("reservation.loading")} />;
  if (!place) return null;

  const mainPhoto = place.photos[0]?.main || "";
  const { adults: adult, children, infants, pets } = guestCounts;
  const guests = adult + children;
  const datesAreValid = Boolean(checkInDate && checkOutDate && checkOutDate > checkInDate);
  const nights = datesAreValid ? Math.round((new Date(`${checkOutDate}T00:00:00`).getTime() - new Date(`${checkInDate}T00:00:00`).getTime()) / 86_400_000) : 0;
  const subtotal = place.price * nights;
  const serviceFee = Math.round(subtotal * 0.1);
  const total = subtotal + serviceFee;

  const syncGuests = (next: GuestCount) => {
    setGuestCounts(next);
    setTravelGuests(next);
    const params = new URLSearchParams(searchParams);
    params.set("adults", String(next.adults));
    params.set("children", String(next.children));
    params.set("infants", String(next.infants));
    params.set("pets", String(next.pets));
    setSearchParams(params, { replace: true });
  };

  const handleClickAdults = (count: number) => {
    const hasDependents = children > 0 || infants > 0 || pets > 0;
    if (count < 1 && hasDependents) return;
    if (count === 0) {
      syncGuests({ adults: 0, children: 0, infants: 0, pets: 0 });
      return;
    }
    if (count >= 0 && count <= 16) syncGuests({ ...guestCounts, adults: count });
  };

  const handleClickChildren = (count: number) => {
    if (count < 0 || count > 15) return;
    syncGuests({ ...guestCounts, adults: count > 0 && adult === 0 ? 1 : adult, children: count });
  };

  const handleClickInfants = (count: number) => {
    if (count < 0 || count > 5) return;
    syncGuests({ ...guestCounts, adults: count > 0 && adult === 0 ? 1 : adult, infants: count });
  };

  const handleClickPets = (count: number) => {
    if (count < 0 || count > 5) return;
    syncGuests({ ...guestCounts, adults: count > 0 && adult === 0 ? 1 : adult, pets: count });
  };

  const handleDateChange = (nextCheckIn: string, nextCheckOut: string) => {
    setCheckInDate(nextCheckIn);
    setCheckOutDate(nextCheckOut);
    setTravelCheckIn(nextCheckIn);
    setTravelCheckOut(nextCheckOut);
    const params = new URLSearchParams(searchParams);
    if (nextCheckIn) params.set("checkIn", nextCheckIn); else params.delete("checkIn");
    if (nextCheckOut) params.set("checkOut", nextCheckOut); else params.delete("checkOut");
    setSearchParams(params, { replace: true });
    setReservationError(null);
    if (nextCheckOut) setCalendarOpen(false);
  };

  const handleReserveClick = async () => {
    if (!datesAreValid) {
      setReservationError(t("reservation.chooseDates"));
      setCalendarOpen(true);
      return;
    }
    if (adult < 1) {
      setReservationError(t("reservation.addAdult"));
      setGuestPickerOpen(true);
      return;
    }
    if (adult + children > place.maxGuests) {
      setReservationError(t("reservation.tooMany", { count: place.maxGuests }));
      setGuestPickerOpen(true);
      return;
    }
    if (!user) {
      navigate("/profile");
      return;
    }

    const bookingInput = {
      place: place._id,
      checkIn: checkInDate,
      checkOut: checkOutDate,
      numOfGuests: { adults: adult, children, infants, pets },
      extraInfo: "Lorem ipsum dolor sit amet, consectetur adipiscing elit.",
    };

    try {
      setIsReserving(true);
      setReservationError(null);
      const createdBooking = await addBooking(bookingInput);
      const paymentParams = new URLSearchParams({
        booking: createdBooking._id,
        checkIn: checkInDate,
        checkOut: checkOutDate,
        guests: String(adult + children),
        infants: String(infants),
        pets: String(pets),
        price: String(createdBooking.price),
        photo: mainPhoto,
        title: place.title,
        description: place.description,
        rating: String(place.rating),
        user: user._id,
        place: place._id,
      });
      navigate(`/my-payment?${paymentParams.toString()}`);
    } catch (error) {
      console.error("Error adding booking:", error);
      setReservationError(getErrorMessage(error, t("reservation.fallbackError")));
    } finally {
      setIsReserving(false);
    }
  };

  const guestSummary = guests > 0
    ? [t("reservation.guests", { count: guests }), infants ? t("reservation.infants", { count: infants }) : "", pets ? t("reservation.pets", { count: pets }) : ""].filter(Boolean).join(", ")
    : t("reservation.addGuests");

  return (
    <div className="relative w-full rounded-[1.75rem] border border-slate-200 bg-white p-5 shadow-[0_28px_70px_-38px_rgba(15,23,42,0.55)] sm:p-6">
      <div className="mb-5 flex items-end justify-between gap-4">
        <p className="text-2xl font-semibold tracking-tight text-slate-950">{place.price} CHF <span className="text-sm font-normal text-slate-500">/ {t("reservation.night")}</span></p>
        <p className="flex items-center gap-1 text-xs font-semibold text-slate-700"><Star className="size-3.5 fill-current" /> {place.rating}</p>
      </div>

      <div className="overflow-hidden rounded-2xl border border-slate-300 bg-white">
        <div className="grid grid-cols-2 divide-x divide-slate-200 border-b border-slate-200">
          <button type="button" onClick={() => setCalendarOpen((open) => !open)} className="px-3.5 py-3 text-left transition hover:bg-slate-50">
            <span className="flex items-center gap-1.5 text-[0.65rem] font-bold uppercase tracking-[0.12em] text-slate-500"><CalendarDays className="size-3.5" /> {t("reservation.checkIn")}</span>
            <span className="mt-1 block text-sm font-semibold text-slate-950">{formatSelectedDate(checkInDate, i18n.resolvedLanguage ?? i18n.language, t("reservation.addDate"))}</span>
          </button>
          <button type="button" onClick={() => setCalendarOpen((open) => !open)} className="px-3.5 py-3 text-left transition hover:bg-slate-50">
            <span className="flex items-center gap-1.5 text-[0.65rem] font-bold uppercase tracking-[0.12em] text-slate-500"><CalendarDays className="size-3.5" /> {t("reservation.checkOut")}</span>
            <span className="mt-1 block text-sm font-semibold text-slate-950">{formatSelectedDate(checkOutDate, i18n.resolvedLanguage ?? i18n.language, t("reservation.addDate"))}</span>
          </button>
        </div>
        <button type="button" aria-expanded={guestPickerOpen} onClick={() => setGuestPickerOpen((open) => !open)} className="flex w-full items-center justify-between gap-3 px-3.5 py-3 text-left transition hover:bg-slate-50">
          <span><span className="block text-[0.65rem] font-bold uppercase tracking-[0.12em] text-slate-500">{t("reservation.guestsLabel")}</span><span className="mt-1 block text-sm font-semibold text-slate-950">{guestSummary}</span></span>
          {guestPickerOpen ? <ChevronUp className="size-4 text-slate-500" /> : <ChevronDown className="size-4 text-slate-500" />}
        </button>
      </div>

      {guestPickerOpen && (
        <div className="absolute inset-x-3 top-[12.2rem] z-30 rounded-2xl border border-slate-200 bg-white p-4 shadow-2xl sm:inset-x-5">
          <GuestCounter label={t("reservation.adults")} note={t("reservation.adultNote")} value={adult} maximum={16} onChange={handleClickAdults} />
          <GuestCounter label={t("reservation.children")} note={t("reservation.childNote")} value={children} maximum={15} onChange={handleClickChildren} />
          <GuestCounter label={t("reservation.infants")} note={t("reservation.infantNote")} value={infants} maximum={5} onChange={handleClickInfants} />
          <GuestCounter label={t("reservation.pets")} note={t("reservation.petNote")} value={pets} maximum={5} onChange={handleClickPets} />
          <button type="button" onClick={() => setGuestPickerOpen(false)} className="mt-3 w-full rounded-full bg-slate-950 py-2.5 text-sm font-semibold text-white">{t("reservation.done")}</button>
        </div>
      )}

      <button type="button" onClick={handleReserveClick} disabled={isReserving} className="mt-4 w-full rounded-full bg-gradient-to-r from-rose-600 to-rose-500 py-3.5 text-sm font-bold text-white shadow-lg shadow-rose-500/20 transition hover:-translate-y-0.5 hover:shadow-xl active:translate-y-0 disabled:cursor-wait disabled:opacity-70">{t(isReserving ? "reservation.starting" : "reservation.reserve")}</button>
      <p className="mt-3 text-center text-xs text-slate-500">{t("reservation.noCharge")}</p>
      {reservationError && <p role="alert" className="mt-3 rounded-xl bg-rose-50 px-3 py-2 text-center text-xs font-medium text-rose-700">{reservationError}</p>}

      <div className="mt-5 space-y-3 text-sm text-slate-600">
        <div className="flex justify-between gap-4"><span className="underline decoration-slate-300 underline-offset-4">{nights ? t("reservation.nights", { price: place.price, count: nights }) : t("reservation.selectDates")}</span><span className="font-medium tabular-nums text-slate-800">{subtotal} CHF</span></div>
        <div className="flex justify-between gap-4"><span className="underline decoration-slate-300 underline-offset-4">{t("reservation.serviceFee")}</span><span className="font-medium tabular-nums text-slate-800">{serviceFee} CHF</span></div>
        <div className="flex justify-between gap-4 border-t border-slate-200 pt-4 font-semibold text-slate-950"><span>{t("reservation.total")}</span><span className="tabular-nums">{total} CHF</span></div>
      </div>

      <div className="mt-5 flex items-start gap-2.5 rounded-2xl bg-emerald-50 p-3 text-xs leading-5 text-emerald-900"><ShieldCheck className="mt-0.5 size-4 shrink-0" /><span>{t("reservation.protected")}</span></div>

      {calendarOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-950/50 p-3 backdrop-blur-sm lg:absolute lg:-right-8 lg:left-auto lg:top-28 lg:h-auto lg:w-[50rem] lg:items-start lg:bg-transparent lg:p-0 lg:backdrop-blur-none">
          <button type="button" aria-label={t("reservation.closeOverlay")} onClick={() => setCalendarOpen(false)} className="absolute inset-0 lg:hidden" />
          <div className="relative max-h-[85vh] w-full max-w-[50rem] overflow-auto rounded-[1.75rem] border border-slate-200 bg-white p-2 shadow-2xl">
            <button type="button" aria-label={t("reservation.closeCalendar")} onClick={() => setCalendarOpen(false)} className="absolute right-3 top-3 z-10 grid size-9 place-items-center rounded-full bg-slate-100 text-slate-700"><X className="size-4" /></button>
            <MyCalendar className="w-full" checkIn={checkInDate} checkOut={checkOutDate} onDateChange={handleDateChange} />
          </div>
        </div>
      )}
    </div>
  );
};

export default ReserveBox;
