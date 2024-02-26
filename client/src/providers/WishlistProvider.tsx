import { createContext } from 'react'

import { useProvideWishlist } from '../../hooks'

interface Wishlist {
  picture: string | undefined
  id: string
  placeId: string
  place: string
  title: string
}

interface WishlistContextType {
  wishlist: Wishlist[]
  deleteWishlist: (placeId: string) => Promise<void>
  addWishlist: (
    placeId: string,
    title: string,
    picture: string,
  ) => Promise<void>
  loading: boolean
  setLoading: (loading: boolean) => void
}

const initialState: WishlistContextType = {
  wishlist: [],
  deleteWishlist: async () => {},
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
