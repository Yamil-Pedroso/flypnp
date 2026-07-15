import { http } from './http'
import type { ApiResponse, Place } from './types'

export const placesService = {
  async list() {
    return (await http.get<ApiResponse<Place[]>>('/all-places')).data.data
  },
  async get(id: string) {
    return (await http.get<ApiResponse<Place>>(`/single-place/${id}`)).data.data
  },
  async search(query: string) {
    return (await http.get<ApiResponse<Place[]>>(`/search/${encodeURIComponent(query)}`)).data.data
  },
}
