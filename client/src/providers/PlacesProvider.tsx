/* eslint-disable @typescript-eslint/no-explicit-any */
import { createContext } from 'react'

import { useProvidePlaces } from '../../hooks'

interface Photo {
  main: string
  thumbnails: string[]
}
export interface Place {
  _id: string
  title: string
  address: string
  photos: Photo[]
  category: string
  description: string
  perks: string[]
  extraInfo: string
  maxGuests: number
  rating: number
  reviews: number
  price: number
}

interface PlacesContextType {
  places: Place[]
  setPlaces: (places: Place[]) => void
  loading: boolean
  setLoading: (loading: boolean) => void
}

const initialState: PlacesContextType = {
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
