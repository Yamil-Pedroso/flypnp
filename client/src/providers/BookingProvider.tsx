import { createContext } from 'react'

import { useProvideBooking } from '../../hooks'

interface Booking {
  owner: string
  place: string
  checkIn: Date
  checkOut: Date
  numOfGuests: {
    adults: number
    children: number
    infants: number
    pets: number
  }
  extraInfo: string
  status: string
  name: string
  phone: string
  price: number
}

interface BookingContextType {
  bookings: Booking[]
  getBookings: () => Promise<void>
  addBooking: (booking: Booking) => Promise<void>
  deleteBooking: (id: string) => Promise<void>
  getBookingDetails: (id: string) => Promise<void>
  updateBooking: (id: string, booking: Booking) => Promise<void>
  loading: boolean
  setLoading: (loading: boolean) => void
}

const initialState: BookingContextType = {
  bookings: [],
  getBookings: async () => {},
  addBooking: async () => {},
  deleteBooking: async () => {},
  updateBooking: async () => {},
  getBookingDetails: async () => {},
  loading: true,
  setLoading: () => {},
}

export const BookingContext = createContext<BookingContextType>(initialState)

interface BookingProviderProps {
  children: React.ReactNode
}

export const BookingProvider = ({ children }: BookingProviderProps) => {
  const allBookings = useProvideBooking()

  return (
    <BookingContext.Provider value={allBookings}>
      {children}
    </BookingContext.Provider>
  )
}

export default BookingProvider
