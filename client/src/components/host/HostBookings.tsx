import { CalendarDays, Mail, UserRound, Users } from "lucide-react";
import type { HostBooking } from "../../services";

const formatDate = (value: string) => new Intl.DateTimeFormat("en", {
  day: "numeric",
  month: "short",
  year: "numeric",
}).format(new Date(value));

const HostBookings = ({ bookings }: { bookings: HostBooking[] }) => (
  <section className="rounded-[1.75rem] border border-slate-200 bg-white p-5 shadow-sm sm:p-6">
    <div><p className="text-xs font-black uppercase tracking-[0.16em] text-rose-600">Guest activity</p><h2 className="mt-1 text-2xl font-semibold tracking-tight text-slate-950">Recent reservations</h2></div>
    {bookings.length === 0 ? (
      <div className="mt-6 rounded-[1.5rem] bg-slate-50 px-6 py-10 text-center">
        <CalendarDays className="mx-auto size-8 text-slate-400" />
        <h3 className="mt-3 font-semibold text-slate-900">No reservations yet</h3>
        <p className="mt-1 text-sm text-slate-500">New guest bookings for your listings will appear here.</p>
      </div>
    ) : (
      <div className="mt-6 space-y-3">
        {bookings.slice(0, 6).map((booking) => {
          const guest = typeof booking.owner === "string" ? null : booking.owner;
          const guests = booking.numOfGuests.adults + booking.numOfGuests.children;
          const statusClass = booking.status === "confirmed" ? "bg-emerald-50 text-emerald-700" : booking.status === "pending" ? "bg-amber-50 text-amber-700" : "bg-rose-50 text-rose-700";
          return (
            <article key={booking._id} className="rounded-2xl border border-slate-200 p-4">
              <div className="flex items-start gap-3">
                {guest?.avatar ? <img src={guest.avatar} alt="" className="size-11 rounded-full object-cover" /> : <span className="grid size-11 shrink-0 place-items-center rounded-full bg-slate-100 text-slate-500"><UserRound className="size-4" /></span>}
                <div className="min-w-0 flex-1">
                  <div className="flex flex-wrap items-start justify-between gap-2">
                    <div><h3 className="font-semibold text-slate-950">{booking.place.title}</h3><p className="mt-0.5 text-xs text-slate-500">{guest?.name ?? booking.name}</p></div>
                    <span className={`rounded-full px-2.5 py-1 text-[0.65rem] font-bold capitalize ${statusClass}`}>{booking.status}</span>
                  </div>
                  <div className="mt-3 flex flex-wrap gap-x-4 gap-y-2 text-xs text-slate-500">
                    <span className="inline-flex items-center gap-1.5"><CalendarDays className="size-3.5" />{formatDate(booking.checkIn)} – {formatDate(booking.checkOut)}</span>
                    <span className="inline-flex items-center gap-1.5"><Users className="size-3.5" />{guests} guest{guests === 1 ? "" : "s"}</span>
                    {guest?.email && <a href={`mailto:${guest.email}`} className="inline-flex items-center gap-1.5 text-emerald-700"><Mail className="size-3.5" />Email guest</a>}
                  </div>
                </div>
              </div>
            </article>
          );
        })}
      </div>
    )}
  </section>
);

export default HostBookings;
