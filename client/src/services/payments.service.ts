import { http } from './http'
import type { ApiResponse, Payment, Place } from './types'

export const paymentsService = {
  async list() {
    return (await http.get<ApiResponse<Payment[]> & { count: number }>('/payments')).data.data
  },
  async create(input: { bookingId: string; currency?: string }) {
    return (await http.post<ApiResponse<Payment> & {
      clientSecret: string
      successUrl: string
      cancelUrl: string
      alreadyPaid: boolean
    }>('/create-payment', input)).data
  },
  async confirm(id: string) {
    return (await http.post<ApiResponse<Payment>>(`/payment/${id}/confirm`)).data.data
  },
  async get(id: string) {
    return (await http.get<ApiResponse<Payment>>(`/payment/${id}`)).data.data
  },
  async getPlace(id: string) {
    return (await http.get<ApiResponse<Place>>(`/payment/${id}/details-with-place`)).data.data
  },
  async cancel(id: string) {
    return (await http.put<ApiResponse<Payment>>(`/update-payment/${id}`, { status: 'cancelled' })).data.data
  },
}
