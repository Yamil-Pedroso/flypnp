import { useState } from "react";
import { Link } from "react-router-dom";
import { AnimatePresence, motion } from "framer-motion";
import { toast } from "sonner";
import {
  AlertTriangle,
  CalendarCheck,
  CircleDollarSign,
  Compass,
  CreditCard,
  LoaderCircle,
  RefreshCw,
  Sparkles,
  Trash2,
  Users,
  X,
} from "lucide-react";
import { useBooking } from "../../lib/hooks";
import { getBookingPaymentPath } from "../../lib/payment";
import { getErrorMessage, type Booking } from "../../services";

type Filter = "all" | "pending" | "confirmed";

const formatDate = (date: string) =>
  new Intl.DateTimeFormat("en", {
    day: "numeric",
    month: "short",
    year: "numeric",
  }).format(new Date(date));

const getGuestCount = (booking: Booking) => {
  const { adults, children, infants } = booking.numOfGuests;
  return adults + children + infants;
};

const statusConfig = {
  pending: {
    label: "Pending",
    dot: "bg-amber-400",
    badge: "bg-amber-50 text-amber-700 ring-amber-600/20",
  },
  confirmed: {
    label: "Confirmed",
    dot: "bg-emerald-400",
    badge: "bg-emerald-50 text-emerald-700 ring-emerald-600/20",
  },
  cancelled: {
    label: "Cancelled",
    dot: "bg-rose-400",
    badge: "bg-rose-50 text-rose-700 ring-rose-600/20",
  },
} as const;

const MyBookings = () => {
  const { bookings, loading, error, refresh, deleteBooking } = useBooking();
  const [filter, setFilter] = useState<Filter>("all");
  const [bookingToDelete, setBookingToDelete] = useState<Booking | null>(null);
  const [deleting, setDeleting] = useState(false);
  const [deleteError, setDeleteError] = useState("");

  const pending = bookings.filter((b) => b.status === "pending");
  const confirmed = bookings.filter((b) => b.status === "confirmed");
  const visible =
    filter === "pending" ? pending : filter === "confirmed" ? confirmed : bookings;

  const requestDelete = (booking: Booking) => {
    setDeleteError("");
    setBookingToDelete(booking);
  };

  const confirmDelete = async () => {
    if (!bookingToDelete || deleting) return;
    try {
      setDeleting(true);
      setDeleteError("");
      await deleteBooking(bookingToDelete._id);
      toast.success("Successfully deleted the booking", { icon: <Trash2 className="size-4" /> });
      setBookingToDelete(null);
    } catch (cause) {
      setDeleteError(
        getErrorMessage(cause, "We couldn't remove this booking. Please try again.")
      );
    } finally {
      setDeleting(false);
    }
  };

  return (
    <main className="min-h-screen bg-[#f6f8f6] pb-16">
      <div className="mx-auto w-full max-w-7xl px-4 pt-8 sm:px-6 sm:pt-12 lg:px-8">
        {/* Hero */}
        <section className="relative isolate overflow-hidden rounded-[2rem] bg-slate-950 px-6 py-9 text-white shadow-xl shadow-slate-950/10 sm:px-10 sm:py-12 lg:px-14">
          <div className="absolute -right-16 -top-24 size-72 rounded-full bg-rose-500/15 blur-3xl" />
          <div className="absolute -bottom-24 left-40 size-64 rounded-full bg-emerald-500/15 blur-3xl" />
          <div className="relative grid gap-8 lg:grid-cols-[1fr_auto] lg:items-end">
            <div className="max-w-2xl">
              <div className="flex items-center gap-2 text-rose-200">
                <CalendarCheck className="size-5" />
                <span className="text-xs font-semibold uppercase tracking-[0.18em]">
                  Booking manager
                </span>
              </div>
              <h1 className="mt-4 text-4xl font-semibold tracking-tight sm:text-5xl">
                Every stay, one place.
              </h1>
              <p className="mt-4 max-w-xl leading-7 text-slate-300">
                Track pending payments, confirmed reservations and past visits — all
                organised so you never lose sight of what matters.
              </p>
            </div>
            <div className="flex gap-3">
              <div className="min-w-24 rounded-2xl border border-white/10 bg-white/10 px-4 py-3 backdrop-blur">
                <p className="text-2xl font-semibold">{pending.length}</p>
                <p className="text-xs text-slate-300">Pending</p>
              </div>
              <div className="min-w-24 rounded-2xl border border-white/10 bg-white/10 px-4 py-3 backdrop-blur">
                <p className="text-2xl font-semibold">{confirmed.length}</p>
                <p className="text-xs text-slate-300">Confirmed</p>
              </div>
              <div className="min-w-24 rounded-2xl border border-white/10 bg-white/10 px-4 py-3 backdrop-blur">
                <p className="text-2xl font-semibold">{bookings.length}</p>
                <p className="text-xs text-slate-300">Total</p>
              </div>
            </div>
          </div>
        </section>

        {/* Filters + Content */}
        <section className="pt-8 sm:pt-10">
          <div className="flex flex-col gap-5 sm:flex-row sm:items-end sm:justify-between">
            <div>
              <p className="text-sm font-semibold uppercase tracking-[0.16em] text-emerald-700">
                Reservation overview
              </p>
              <h2 className="mt-1 text-3xl font-semibold tracking-tight text-slate-950">
                My bookings
              </h2>
            </div>
            <div
              className="flex w-fit rounded-full border border-slate-200 bg-white p-1 shadow-sm"
              role="tablist"
              aria-label="Booking filters"
            >
              {(
                [
                  { key: "all", label: "All", count: bookings.length },
                  { key: "pending", label: "Pending", count: pending.length },
                  {
                    key: "confirmed",
                    label: "Confirmed",
                    count: confirmed.length,
                  },
                ] as const
              ).map(({ key, label, count }) => (
                <button
                  key={key}
                  type="button"
                  role="tab"
                  aria-selected={filter === key}
                  onClick={() => setFilter(key)}
                  className={`flex items-center gap-2 rounded-full px-4 py-2 text-sm font-semibold transition ${
                    filter === key
                      ? "bg-slate-900 text-white"
                      : "text-slate-500 hover:text-slate-900"
                  }`}
                >
                  {label}{" "}
                  <span className="opacity-60">{count}</span>
                </button>
              ))}
            </div>
          </div>

          {loading ? (
            <div
              className="mt-7 grid gap-6 md:grid-cols-2 xl:grid-cols-3"
              aria-label="Loading bookings"
            >
              {Array.from({ length: 3 }).map((_, i) => (
                <div
                  key={i}
                  className="h-[28rem] animate-pulse rounded-[1.75rem] bg-slate-200"
                />
              ))}
            </div>
          ) : error ? (
            <div
              className="mt-7 rounded-[1.75rem] border border-rose-100 bg-rose-50 px-6 py-12 text-center"
              role="alert"
            >
              <RefreshCw className="mx-auto size-8 text-rose-500" />
              <h3 className="mt-4 text-xl font-semibold text-slate-950">
                We couldn't load your bookings
              </h3>
              <p className="mt-2 text-slate-600">
                Please check the connection and try again.
              </p>
              <button
                type="button"
                onClick={() => void refresh()}
                className="mt-5 rounded-full bg-slate-900 px-5 py-2.5 text-sm font-semibold text-white transition hover:bg-slate-700"
              >
                Try again
              </button>
            </div>
          ) : visible.length > 0 ? (
            <div className="mt-7 grid gap-6 md:grid-cols-2 xl:grid-cols-3">
              <AnimatePresence mode="popLayout">
                {visible.map((booking, index) => {
                  const photo = booking.place?.photos[0]?.main;
                  const status = statusConfig[booking.status] ?? statusConfig.pending;

                  return (
                    <motion.article
                      key={booking._id}
                      layout
                      initial={{ opacity: 0, y: 20 }}
                      animate={{ opacity: 1, y: 0 }}
                      exit={{ opacity: 0, scale: 0.95 }}
                      transition={{
                        duration: 0.3,
                        delay: Math.min(index * 0.04, 0.2),
                      }}
                      className="group overflow-hidden rounded-[1.75rem] border border-slate-200/80 bg-white shadow-sm transition duration-300 hover:-translate-y-1 hover:shadow-xl"
                    >
                      {/* Image */}
                      <div className="relative aspect-[16/10] overflow-hidden bg-slate-200">
                        {photo ? (
                          <img
                            src={photo}
                            alt={booking.place.title}
                            className="size-full object-cover transition duration-700 group-hover:scale-105"
                          />
                        ) : (
                          <div className="flex size-full items-center justify-center bg-emerald-50 text-emerald-700">
                            <Compass className="size-10" />
                          </div>
                        )}
                        <div className="absolute inset-0 bg-gradient-to-t from-slate-950/55 via-transparent to-transparent" />
                        <span
                          className={`absolute left-4 top-4 inline-flex items-center gap-1.5 rounded-full px-3 py-1.5 text-xs font-semibold ring-1 ring-inset ${status.badge}`}
                        >
                          <span className={`size-1.5 rounded-full ${status.dot}`} />
                          {status.label}
                        </span>
                        <button
                          type="button"
                          aria-label={`Delete booking ${booking.place.title}`}
                          onClick={() => requestDelete(booking)}
                          className="absolute right-4 top-4 grid size-9 place-items-center rounded-full bg-white/90 text-slate-700 shadow-sm backdrop-blur transition hover:scale-105 hover:bg-rose-500 hover:text-white"
                        >
                          <Trash2 className="size-4" />
                        </button>
                        <div className="absolute inset-x-4 bottom-4 text-white">
                          <p className="flex items-center gap-1.5 text-xs font-medium text-white/80">
                            <Compass className="size-3.5" />
                            {booking.place.address}
                          </p>
                          <h2 className="mt-1 line-clamp-1 text-xl font-semibold">
                            {booking.place.title}
                          </h2>
                        </div>
                      </div>

                      {/* Details */}
                      <div className="p-5">
                        <div className="grid grid-cols-2 gap-4 text-sm">
                          <div>
                            <p className="text-xs font-medium uppercase tracking-wide text-slate-400">
                              Check in
                            </p>
                            <p className="mt-1 font-semibold text-slate-800">
                              {formatDate(booking.checkIn)}
                            </p>
                          </div>
                          <div>
                            <p className="text-xs font-medium uppercase tracking-wide text-slate-400">
                              Check out
                            </p>
                            <p className="mt-1 font-semibold text-slate-800">
                              {formatDate(booking.checkOut)}
                            </p>
                          </div>
                          <div>
                            <p className="text-xs font-medium uppercase tracking-wide text-slate-400">
                              Guests
                            </p>
                            <p className="mt-1 flex items-center gap-1.5 font-semibold text-slate-800">
                              <Users className="size-3.5 text-slate-400" />
                              {getGuestCount(booking)}
                            </p>
                          </div>
                          <div>
                            <p className="text-xs font-medium uppercase tracking-wide text-slate-400">
                              Total
                            </p>
                            <p className="mt-1 flex items-center gap-1.5 font-semibold text-slate-800">
                              <CircleDollarSign className="size-3.5 text-slate-400" />
                              CHF {booking.price}
                            </p>
                          </div>
                        </div>

                        <div className="mt-5 border-t border-slate-100 pt-4">
                          {booking.status === "pending" ? (
                            <Link
                              to={getBookingPaymentPath(booking)}
                              className="flex w-full items-center justify-center gap-2 rounded-full bg-rose-500 px-5 py-3 text-sm font-bold text-white shadow-lg shadow-rose-500/20 transition hover:-translate-y-0.5 hover:bg-rose-600"
                            >
                              <CreditCard className="size-4" />
                              Complete payment
                            </Link>
                          ) : (
                            <Link
                              to={`/place/${booking.place.category}/${booking.place._id}`}
                              className="flex w-full items-center justify-center gap-2 rounded-full border border-slate-200 bg-white px-5 py-3 text-sm font-semibold text-slate-700 transition hover:border-slate-950 hover:text-slate-950"
                            >
                              View stay details
                            </Link>
                          )}
                        </div>
                      </div>
                    </motion.article>
                  );
                })}
              </AnimatePresence>
            </div>
          ) : (
            <div className="relative mt-7 overflow-hidden rounded-[2rem] border border-slate-200 bg-white px-6 py-14 text-center shadow-sm sm:px-10 sm:py-20">
              <div className="absolute left-1/2 top-0 h-px w-2/3 -translate-x-1/2 bg-gradient-to-r from-transparent via-rose-300 to-transparent" />
              <Sparkles className="absolute left-[18%] top-20 size-5 text-amber-400" />
              <Sparkles className="absolute right-[19%] top-32 size-4 text-rose-400" />
              <div className="mx-auto flex size-20 items-center justify-center rounded-full bg-rose-50 text-rose-500">
                <CalendarCheck className="size-9" />
              </div>
              <h3 className="mt-6 text-2xl font-semibold tracking-tight text-slate-950">
                {filter === "all"
                  ? "No bookings yet"
                  : `No ${filter} bookings`}
              </h3>
              <p className="mx-auto mt-3 max-w-lg leading-7 text-slate-500">
                {filter === "all"
                  ? "Your future getaways will appear here once you reserve a stay."
                  : "Try switching to a different filter or explore new places to stay."}
              </p>
              <Link
                to="/"
                className="mt-7 inline-flex items-center gap-2 rounded-full bg-rose-500 px-6 py-3 text-sm font-semibold text-white shadow-lg shadow-rose-500/20 transition hover:-translate-y-0.5 hover:bg-rose-600"
              >
                <Compass className="size-4" />
                Discover stays
              </Link>
            </div>
          )}
        </section>
      </div>

      {/* Delete confirmation modal */}
      <AnimatePresence>
        {bookingToDelete && (
          <motion.div
            className="fixed inset-0 z-[100] grid place-items-center bg-slate-950/60 p-4 backdrop-blur-sm"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
          >
            <button
              type="button"
              aria-label="Close delete overlay"
              onClick={() => !deleting && setBookingToDelete(null)}
              className="absolute inset-0 cursor-default"
            />
            <motion.div
              role="dialog"
              aria-modal="true"
              aria-label="Delete booking"
              initial={{ opacity: 0, y: 18, scale: 0.96 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              exit={{ opacity: 0, y: 12, scale: 0.97 }}
              transition={{ type: "spring", stiffness: 360, damping: 28 }}
              className="relative w-full max-w-md rounded-[1.75rem] bg-white p-6 shadow-2xl sm:p-7"
            >
              <button
                type="button"
                aria-label="Close delete confirmation"
                disabled={deleting}
                onClick={() => setBookingToDelete(null)}
                className="absolute right-4 top-4 grid size-9 place-items-center rounded-full bg-slate-100 text-slate-600 transition hover:bg-slate-950 hover:text-white disabled:opacity-50"
              >
                <X className="size-4" />
              </button>
              <span className="grid size-12 place-items-center rounded-2xl bg-rose-50 text-rose-600">
                <AlertTriangle className="size-6" />
              </span>
              <h2 className="mt-5 text-2xl font-semibold tracking-tight text-slate-950">
                Remove this booking?
              </h2>
              <p className="mt-2 pr-5 text-sm leading-6 text-slate-600">
                <span className="font-semibold text-slate-900">
                  {bookingToDelete.place.title}
                </span>{" "}
                will be removed from your bookings.{" "}
                {bookingToDelete.status === "pending"
                  ? "The pending reservation will also be cancelled."
                  : "Its confirmed payment record will remain protected."}
              </p>
              {deleteError && (
                <p
                  role="alert"
                  className="mt-4 rounded-xl bg-rose-50 px-3.5 py-3 text-sm font-medium text-rose-700"
                >
                  {deleteError}
                </p>
              )}
              <div className="mt-6 flex flex-col-reverse gap-3 sm:flex-row sm:justify-end">
                <button
                  type="button"
                  disabled={deleting}
                  onClick={() => setBookingToDelete(null)}
                  className="rounded-full border border-slate-300 px-5 py-2.5 text-sm font-semibold text-slate-700 transition hover:border-slate-950 disabled:opacity-50"
                >
                  Keep booking
                </button>
                <button
                  type="button"
                  disabled={deleting}
                  onClick={() => void confirmDelete()}
                  className="inline-flex items-center justify-center gap-2 rounded-full bg-rose-500 px-5 py-2.5 text-sm font-bold text-white shadow-lg shadow-rose-500/20 transition hover:bg-rose-600 disabled:cursor-wait disabled:opacity-60"
                >
                  {deleting ? (
                    <>
                      <LoaderCircle className="size-4 animate-spin" />
                      Removing…
                    </>
                  ) : (
                    <>
                      <Trash2 className="size-4" />
                      Remove booking
                    </>
                  )}
                </button>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </main>
  );
};

export default MyBookings;
