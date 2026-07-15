import { createContext, useCallback, useContext, useEffect, useState } from 'react'
import { bookingsService, getErrorMessage, type Booking, type BookingInput } from '../../services'
import { useAuth } from './useAuth'

export interface BookingsContextValue {
  bookings: Booking[]
  loading: boolean
  error: string | null
  refresh: () => Promise<void>
  addBooking: (input: BookingInput) => Promise<Booking>
  getBookingDetails: (id: string) => Promise<Booking>
  updateBooking: (id: string, input: Partial<BookingInput> & { status?: Booking['status'] }) => Promise<Booking>
  deleteBooking: (id: string) => Promise<void>
}

export const BookingsContext = createContext<BookingsContextValue | null>(null)

export const useBookingsController = (): BookingsContextValue => {
  const { user } = useAuth()
  const [bookings, setBookings] = useState<Booking[]>([])
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)

  const refresh = useCallback(async () => {
    if (!user) return setBookings([])
    try { setLoading(true); setBookings(await bookingsService.list()); setError(null) }
    catch (cause) { setError(getErrorMessage(cause, 'Could not load bookings')) }
    finally { setLoading(false) }
  }, [user])
  useEffect(() => { void refresh() }, [refresh])

  return {
    bookings, loading, error, refresh,
    async addBooking(input) {
      const booking = await bookingsService.create(input)
      setBookings((current) => [...current, booking])
      return booking
    },
    getBookingDetails: bookingsService.get,
    updateBooking: async (id, input) => {
      const booking = await bookingsService.update(id, input)
      setBookings((current) => current.map((item) => item._id === id ? booking : item))
      return booking
    },
    async deleteBooking(id) {
      await bookingsService.remove(id)
      setBookings((current) => current.filter((item) => item._id !== id))
    },
  }
}

export const useBooking = () => {
  const context = useContext(BookingsContext)
  if (!context) throw new Error('useBooking must be used inside BookingProvider')
  return context
}
