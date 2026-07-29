import { http } from './http'
import type {
  ApiResponse,
  Experience,
  ExperienceBooking,
  ExperienceFilters,
} from './types'

export const experiencesService = {
  async list(filters: ExperienceFilters = {}) {
    const params = new URLSearchParams()
    if (filters.destination?.trim()) params.set('destination', filters.destination.trim())
    if (filters.category && filters.category !== 'all') params.set('category', filters.category)
    if (filters.date) params.set('date', filters.date)
    if (filters.guests && filters.guests > 0) params.set('guests', String(filters.guests))
    if (filters.kind) params.set('kind', filters.kind)
    return (await http.get<ApiResponse<Experience[]> & { count: number }>(
      `/experiences${params.size ? `?${params.toString()}` : ''}`,
    )).data.data
  },
  async get(idOrSlug: string) {
    return (await http.get<ApiResponse<Experience>>(
      `/experiences/${encodeURIComponent(idOrSlug)}`,
    )).data.data
  },
  async listBookings() {
    return (await http.get<ApiResponse<ExperienceBooking[]> & { count: number }>(
      '/experience-bookings',
    )).data.data
  },
  async createBooking(input: {
    experienceId: string
    date: string
    startTime: string
    participants: number
  }) {
    return (await http.post<ApiResponse<ExperienceBooking>>(
      '/experience-bookings',
      input,
    )).data.data
  },
  async getBooking(id: string) {
    return (await http.get<ApiResponse<ExperienceBooking>>(
      `/experience-bookings/${id}`,
    )).data.data
  },
  async removeBooking(id: string) {
    await http.delete(`/experience-bookings/${id}`)
  },
}
