import { WishlistContext, useWishlistController } from '../lib/hooks'

export const WishlistProvider = ({ children }: { children: React.ReactNode }) => {
  const value = useWishlistController()
  return <WishlistContext.Provider value={value}>{children}</WishlistContext.Provider>
}
