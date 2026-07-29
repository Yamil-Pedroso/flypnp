import { http } from './http'
import type { ApiResponse, WishlistItem } from './types'

export const wishlistService = {
  async list() {
    return (await http.get<ApiResponse<WishlistItem[]>>('/user-wishlist')).data.data
  },
  async add(itemId: string, itemType: 'place' | 'experience' = 'place') {
    const body = itemType === 'experience' ? { experienceId: itemId } : { placeId: itemId }
    return (await http.post<ApiResponse<WishlistItem>>('/add-place', body)).data.data
  },
  async remove(itemId: string, itemType: 'place' | 'experience' = 'place') {
    await http.delete(`/remove-place/${itemId}?itemType=${itemType}`)
  },
}
