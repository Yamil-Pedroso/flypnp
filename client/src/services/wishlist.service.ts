import { http } from './http'
import type { ApiResponse, WishlistItem } from './types'

export const wishlistService = {
  async list() {
    return (await http.get<ApiResponse<WishlistItem[]>>('/user-wishlist')).data.data
  },
  async add(placeId: string) {
    return (await http.post<ApiResponse<WishlistItem>>('/add-place', { placeId })).data.data
  },
  async remove(placeId: string) {
    await http.delete(`/remove-place/${placeId}`)
  },
}
