import { http } from './http'
import type { ApiResponse, Booking, BookingInput, HostBooking } from './types'

export const bookingsService = {
  async list() {
    return (await http.get<ApiResponse<Booking[]> & { count: number }>('/user-bookings')).data.data
  },
  async create(input: BookingInput) {
    return (await http.post<ApiResponse<Booking>>('/create-booking', input)).data.data
  },
  async get(id: string) {
    return (await http.get<ApiResponse<Booking>>(`/booking-details/${id}`)).data.data
  },
  async update(id: string, input: Partial<BookingInput> & { status?: Booking['status'] }) {
    return (await http.put<ApiResponse<Booking>>(`/update-booking/${id}`, input)).data.data
  },
  async remove(id: string) {
    await http.delete(`/delete-booking/${id}`)
  },
  async listForHost() {
    return (await http.get<ApiResponse<HostBooking[]> & { count: number }>('/host-bookings')).data.data
  },
}
