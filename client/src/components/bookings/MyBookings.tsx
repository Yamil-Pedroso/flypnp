import { useBooking } from '../../lib/hooks'

const MyBookings = () => {
  const { bookings } = useBooking()

  const getStatusClass = (status: string) => {
    switch (status) {
      case 'pending':
        return 'bg-amber-50 text-amber-700 ring-amber-600/20'
      case 'confirmed':
        return 'bg-emerald-50 text-emerald-700 ring-emerald-600/20'
      case 'deleted':
        return 'bg-rose-50 text-rose-700 ring-rose-600/20'
      default:
        return 'bg-slate-50 text-slate-700 ring-slate-600/20'
    }
  }

  return (
    <main className="mx-auto w-full max-w-6xl px-4 py-10 sm:px-6 lg:px-8">
      <h1 className="text-3xl font-semibold tracking-tight text-slate-950">My bookings</h1>
      <div className="mt-8 grid gap-6 md:grid-cols-2">
        {bookings.map((booking) => (
          <article key={booking._id} className="overflow-hidden rounded-3xl border border-slate-200 bg-white shadow-sm">
            <img src={booking.place.photos[0]?.main} alt={booking.place.title} className="aspect-[16/9] w-full object-cover" />
            <div className="p-5">
              <div className="flex items-start justify-between gap-4">
                <div><h2 className="text-lg font-semibold text-slate-950">{booking.place.title}</h2><p className="mt-1 text-sm text-slate-500">{booking.place.address}</p></div>
                <span className={`rounded-full px-2.5 py-1 text-xs font-semibold capitalize ring-1 ring-inset ${getStatusClass(booking.status)}`}>{booking.status}</span>
              </div>
              <div className="mt-5 grid grid-cols-2 gap-4 border-t border-slate-100 pt-4 text-sm">
                <div><p className="text-slate-400">Check in</p><p className="font-medium text-slate-800">{new Date(booking.checkIn).toLocaleDateString()}</p></div>
                <div><p className="text-slate-400">Check out</p><p className="font-medium text-slate-800">{new Date(booking.checkOut).toLocaleDateString()}</p></div>
                <div><p className="text-slate-400">Guests</p><p className="font-medium text-slate-800">{booking.numOfGuests.adults + booking.numOfGuests.children}</p></div>
                <div><p className="text-slate-400">Total</p><p className="font-medium text-slate-800">CHF {booking.price}</p></div>
              </div>
            </div>
          </article>
        ))}
      </div>
    </main>
  )
}

export default MyBookings
