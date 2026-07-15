import { PlacesContext, usePlacesController } from '../lib/hooks'

export const PlacesProvider = ({ children }: { children: React.ReactNode }) => {
  const value = usePlacesController()
  return <PlacesContext.Provider value={value}>{children}</PlacesContext.Provider>
}
