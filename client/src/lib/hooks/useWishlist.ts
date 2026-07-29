import { createContext, useCallback, useContext, useEffect, useState } from 'react'
import { getErrorMessage, wishlistService, type WishlistItem } from '../../services'
import { useAuth } from './useAuth'

export interface WishlistContextValue {
  wishlist: WishlistItem[]
  loading: boolean
  error: string | null
  refresh: () => Promise<void>
  addWishlist: (itemId: string, title?: string, picture?: string, itemType?: 'place' | 'experience') => Promise<void>
  deleteWishlist: (itemId: string, itemType?: 'place' | 'experience') => Promise<void>
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
    async addWishlist(itemId, _title, _picture, itemType = 'place') {
      const item = await wishlistService.add(itemId, itemType)
      setWishlist((current) => current.some((wish) => (itemType === 'experience' ? wish.experience : wish.place) === itemId) ? current : [...current, item])
    },
    async deleteWishlist(itemId, itemType = 'place') {
      await wishlistService.remove(itemId, itemType)
      setWishlist((current) => current.filter((wish) => (itemType === 'experience' ? wish.experience : wish.place) !== itemId))
    },
  }
}

export const useWishlist = () => {
  const context = useContext(WishlistContext)
  if (!context) throw new Error('useWishlist must be used inside WishlistProvider')
  return context
}
