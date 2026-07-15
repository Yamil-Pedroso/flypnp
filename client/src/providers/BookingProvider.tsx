import { BookingsContext, useBookingsController } from '../lib/hooks'

export const BookingProvider = ({ children }: { children: React.ReactNode }) => {
  const value = useBookingsController()
  return <BookingsContext.Provider value={value}>{children}</BookingsContext.Provider>
}
