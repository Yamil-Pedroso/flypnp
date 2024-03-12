import { createContext } from 'react'
interface Photo {
  main: string
  thumbnails: string[]
}

import { useProvidePayment } from '../../hooks'
interface Place {
  _id: string
  title: string
  address: string
  photos: Photo[]
  category: string
  description: string
  perks: string[]
  extraInfo: string
  maxGuests: number
  rating: number
  reviews: number
  price: number
}

interface Booking {
  owner: string
  place: Place
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
interface Payment {
  user: string
  booking: Booking
  amount: number
  currency: string
  status: string
  stripeId: string
  paymentMethod: string
  paymentDate: Date
}

interface PaymentContextType {
  payments: Payment[]
  clientSecret: string | undefined
  getPayments: () => Promise<void>
  getSinglePayment: (id: string) => Promise<void>
  paymentDetailsWithPlace: (id: string) => Promise<void>
  createPayment: (
    payment: Payment,
  ) => Promise<{
    success: boolean

    message?: string
    error?: string
  }>
  loading: boolean
  setLoading: (loading: boolean) => void
}

const initialState: PaymentContextType = {
  payments: [],
  clientSecret: undefined,
  getPayments: async () => {},
  getSinglePayment: async () => {},
  paymentDetailsWithPlace: async () => {},
  createPayment: async () => ({ success: false }),
  loading: true,
  setLoading: () => {},
}

export const PaymentContext = createContext<PaymentContextType>(initialState)

interface PaymentProviderProps {
  children: React.ReactNode
}

export const PaymentProvider = ({ children }: PaymentProviderProps) => {
  const allPayments = useProvidePayment() as any

  return (
    <PaymentContext.Provider value={allPayments}>
      {children}
    </PaymentContext.Provider>
  )
}

export default PaymentProvider
