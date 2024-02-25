import { createContext } from 'react'

import { useProvideWishlist } from '../../hooks'

interface Wishlist {
  id: string
  placeId: string
  title: string
}

interface WishlistContextType {
  wishlist: Wishlist[]
  deleteWishlist: (id: string) => Promise<void>
  addWishlist: (
    placeId: string,
    title: string,
    picture: string,
  ) => Promise<void>
  setWishlist: (wishlist: Wishlist[]) => void
  loading: boolean
  setLoading: (loading: boolean) => void
}

const initialState: WishlistContextType = {
  wishlist: [],
  deleteWishlist: async () => {},
  setWishlist: () => {},
  addWishlist: async () => {},
  loading: true,
  setLoading: () => {},
}

export const WishlistContext = createContext<WishlistContextType>(initialState)

interface WishlistProviderProps {
  children: React.ReactNode
}

export const WishlistProvider = ({ children }: WishlistProviderProps) => {
  const allWishlist = useProvideWishlist()

  return (
    <WishlistContext.Provider value={allWishlist}>
      {children}
    </WishlistContext.Provider>
  )
}
