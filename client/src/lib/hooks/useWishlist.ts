import { createContext, useCallback, useContext, useEffect, useState } from 'react'
import { getErrorMessage, wishlistService, type WishlistItem } from '../../services'
import { useAuth } from './useAuth'

export interface WishlistContextValue {
  wishlist: WishlistItem[]
  loading: boolean
  error: string | null
  refresh: () => Promise<void>
  addWishlist: (placeId: string, title?: string, picture?: string) => Promise<void>
  deleteWishlist: (placeId: string) => Promise<void>
}

export const WishlistContext = createContext<WishlistContextValue | null>(null)

export const useWishlistController = (): WishlistContextValue => {
  const { user } = useAuth()
  const [wishlist, setWishlist] = useState<WishlistItem[]>([])
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const refresh = useCallback(async () => {
    if (!user) return setWishlist([])
    try { setLoading(true); setWishlist(await wishlistService.list()); setError(null) }
    catch (cause) { setError(getErrorMessage(cause, 'Could not load wishlist')) }
    finally { setLoading(false) }
  }, [user])
  useEffect(() => { void refresh() }, [refresh])
  return {
    wishlist, loading, error, refresh,
    async addWishlist(placeId) {
      const item = await wishlistService.add(placeId)
      setWishlist((current) => current.some((wish) => wish.place === placeId) ? current : [...current, item])
    },
    async deleteWishlist(placeId) {
      await wishlistService.remove(placeId)
      setWishlist((current) => current.filter((wish) => wish.place !== placeId))
    },
  }
}

export const useWishlist = () => {
  const context = useContext(WishlistContext)
  if (!context) throw new Error('useWishlist must be used inside WishlistProvider')
  return context
}
