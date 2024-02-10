import { createContext } from 'react'

import { useProvidePlaces } from '../../hooks'

const initialState = {
  places: [],
  setPlaces: () => {},
  loading: true,
  setLoading: () => {},
}

export const PlacesContext = createContext(initialState)

export const PlacesProvider = ({ children }: any) => {
  const allPlaces = useProvidePlaces()

  return (
    <PlacesContext.Provider value={allPlaces as any}>
      {children}
    </PlacesContext.Provider>
  )
}
