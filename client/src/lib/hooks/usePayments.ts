import { createContext, useCallback, useContext, useEffect, useState } from 'react'
import { getErrorMessage, paymentsService, type Payment, type Place } from '../../services'
import { useAuth } from './useAuth'

export interface PaymentsContextValue {
  payments: Payment[]
  clientSecret?: string
  loading: boolean
  error: string | null
  refresh: () => Promise<void>
  createPayment: (input: { bookingId?: string; experienceBookingId?: string; currency?: string }) => Promise<{ success: boolean; clientSecret?: string; message?: string }>
  getSinglePayment: (id: string) => Promise<Payment>
  paymentDetailsWithPlace: (id: string) => Promise<Place>
  cancelPayment: (id: string) => Promise<void>
}

export const PaymentsContext = createContext<PaymentsContextValue | null>(null)

export const usePaymentsController = (): PaymentsContextValue => {
  const { user } = useAuth()
  const [payments, setPayments] = useState<Payment[]>([])
  const [clientSecret, setClientSecret] = useState<string>()
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const refresh = useCallback(async () => {
    if (!user) return setPayments([])
    try { setLoading(true); setPayments(await paymentsService.list()); setError(null) }
    catch (cause) { setError(getErrorMessage(cause, 'Could not load payments')) }
    finally { setLoading(false) }
  }, [user])
  useEffect(() => { void refresh() }, [refresh])
  return {
    payments, clientSecret, loading, error, refresh,
    async createPayment(input) {
      try {
        const response = await paymentsService.create(input)
        setClientSecret(response.clientSecret)
        setPayments((current) => [...current, response.data])
        return { success: true, clientSecret: response.clientSecret }
      } catch (cause) {
        const message = getErrorMessage(cause, 'Could not create payment')
        setError(message)
        return { success: false, message }
      }
    },
    getSinglePayment: paymentsService.get,
    paymentDetailsWithPlace: paymentsService.getPlace,
    async cancelPayment(id) {
      const payment = await paymentsService.cancel(id)
      setPayments((current) => current.map((item) => item._id === id ? payment : item))
    },
  }
}

export const usePayment = () => {
  const context = useContext(PaymentsContext)
  if (!context) throw new Error('usePayment must be used inside PaymentProvider')
  return context
}
