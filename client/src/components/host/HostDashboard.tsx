import { useCallback, useEffect, useMemo, useState } from "react";
import { Link } from "react-router-dom";
import { LoaderCircle, RefreshCw, ShieldAlert } from "lucide-react";
import { toast } from "sonner";
import { useAuth } from "../../lib/hooks";
import { bookingsService, getErrorMessage, placesService, type HostBooking, type Place } from "../../services";
import HostBookings from "./HostBookings";
import HostHero from "./HostHero";
import HostListings from "./HostListings";
import HostStats from "./HostStats";

const HostDashboard = () => {
  const { user } = useAuth();
  const [places, setPlaces] = useState<Place[]>([]);
  const [bookings, setBookings] = useState<HostBooking[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [deletingId, setDeletingId] = useState<string | null>(null);
  const userId = user?._id;

  const loadDashboard = useCallback(async () => {
    if (!userId) {
      setLoading(false);
      return;
    }
    try {
      setLoading(true);
      setError("");
      const [ownedPlaces, hostBookings] = await Promise.all([
        placesService.listOwned(),
        bookingsService.listForHost(),
      ]);
      setPlaces(ownedPlaces);
      setBookings(hostBookings);
    } catch (cause) {
      setError(getErrorMessage(cause, "Could not load your host dashboard"));
    } finally {
      setLoading(false);
    }
  }, [userId]);

  useEffect(() => { void loadDashboard(); }, [loadDashboard]);

  const upcomingBookings = useMemo(() => bookings.filter((booking) =>
    booking.status === "confirmed" && new Date(booking.checkOut) >= new Date(),
  ), [bookings]);
  const grossBookingValue = useMemo(() => bookings
    .filter((booking) => booking.status === "confirmed")
    .reduce((total, booking) => total + booking.price, 0), [bookings]);

  const removePlace = async (place: Place) => {
    if (!window.confirm(`Remove "${place.title}"? This is only possible when it has no reservations.`)) return;
    try {
      setDeletingId(place._id);
      await placesService.remove(place._id);
      setPlaces((current) => current.filter((item) => item._id !== place._id));
      toast.success("Listing removed");
    } catch (cause) {
      toast.error(getErrorMessage(cause, "Could not remove this listing"));
    } finally {
      setDeletingId(null);
    }
  };

  if (!user) {
    return (
      <main className="grid min-h-[70vh] place-items-center bg-[#f6f8f6] px-4">
        <div className="max-w-lg rounded-[2rem] border border-slate-200 bg-white p-8 text-center shadow-xl shadow-slate-900/5">
          <ShieldAlert className="mx-auto size-10 text-rose-500" />
          <h1 className="mt-5 text-2xl font-semibold text-slate-950">Log in to host your home</h1>
          <p className="mt-2 text-slate-500">Use the user menu to log in, then return here to create and manage your listings.</p>
          <Link to="/" className="mt-6 inline-flex rounded-full bg-slate-950 px-5 py-3 text-sm font-bold text-white">Back to Flypnp</Link>
        </div>
      </main>
    );
  }

  return (
    <main className="min-h-screen bg-[#f6f8f6] pb-16">
      <div className="mx-auto w-full max-w-7xl space-y-6 px-4 pt-7 sm:px-6 sm:pt-10 lg:px-8">
        <HostHero firstName={user.name.split(" ")[0]} />
        {loading ? (
          <div className="grid min-h-64 place-items-center rounded-[1.75rem] border border-slate-200 bg-white"><span className="inline-flex items-center gap-2 text-sm font-semibold text-slate-500"><LoaderCircle className="size-5 animate-spin" />Loading your hosting workspace…</span></div>
        ) : error ? (
          <div role="alert" className="rounded-[1.75rem] border border-rose-100 bg-rose-50 px-6 py-12 text-center"><RefreshCw className="mx-auto size-8 text-rose-500" /><h2 className="mt-4 text-xl font-semibold text-slate-950">We couldn't load your host dashboard</h2><p className="mt-2 text-slate-600">{error}</p><button type="button" onClick={() => void loadDashboard()} className="mt-5 rounded-full bg-slate-950 px-5 py-2.5 text-sm font-bold text-white">Try again</button></div>
        ) : (
          <>
            <HostStats listings={places.length} upcomingBookings={upcomingBookings.length} grossBookingValue={grossBookingValue} />
            <div className="grid gap-6 xl:grid-cols-[1.2fr_0.8fr] xl:items-start">
              <HostListings places={places} deletingId={deletingId} onDelete={(place) => void removePlace(place)} />
              <HostBookings bookings={bookings} />
            </div>
          </>
        )}
      </div>
    </main>
  );
};

export default HostDashboard;
