import { http } from './http'
import type { ApiResponse, Place, PlaceInput } from './types'

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
  async listOwned() {
    return (await http.get<ApiResponse<Place[]>>('/user-places')).data.data
  },
  async create(input: PlaceInput) {
    return (await http.post<ApiResponse<Place>>('/add-places', input)).data.data
  },
  async update(id: string, input: Partial<PlaceInput>) {
    return (await http.put<ApiResponse<Place>>(`/update-place/${id}`, input)).data.data
  },
  async remove(id: string) {
    await http.delete(`/delete-place/${id}`)
  },
  async uploadImages(files: File[]) {
    const body = new FormData()
    files.forEach((file) => body.append('images', file))
    return (await http.post<{ success: boolean; images: string[] }>('/upload', body)).data.images
  },
  async uploadFromLink(imageUrl: string) {
    return (await http.post<{ success: boolean; url: string }>('/upload-from-link', { imageUrl })).data.url
  },
}
