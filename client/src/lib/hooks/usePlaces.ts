import { createContext, useCallback, useContext, useEffect, useState } from 'react'
import { apiBaseUrl, getErrorMessage, placesService, type Place } from '../../services'

export interface PlacesContextValue {
  places: Place[]
  loading: boolean
  error: string | null
  setPlaces: (places: Place[]) => void
  refresh: () => Promise<void>
  search: (query: string) => Promise<void>
}

export const PlacesContext = createContext<PlacesContextValue | null>(null)

const normalizePlaces = (data: Place[]) => {
  const apiRoot = apiBaseUrl.replace(/\/api\/v1\/?$/, '')
  return data.map((place) => ({
    ...place,
    photos: place.photos.map((photo) => ({
      ...photo,
      main: photo.main.startsWith('http') ? photo.main : `${apiRoot}${photo.main}`,
      thumbnails: photo.thumbnails.map((item) => item.startsWith('http') ? item : `${apiRoot}${item}`),
    })),
  }))
}

export const usePlacesController = (): PlacesContextValue => {
  const [places, setPlaces] = useState<Place[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  const load = useCallback(async (request: () => Promise<Place[]>) => {
    try {
      setLoading(true)
      setError(null)
      setPlaces(normalizePlaces(await request()))
    } catch (cause) {
      setError(getErrorMessage(cause, 'Could not load places'))
    } finally {
      setLoading(false)
    }
  }, [])

  const refresh = useCallback(() => load(placesService.list), [load])
  const search = useCallback((query: string) => query.trim()
    ? load(() => placesService.search(query.trim()))
    : refresh(), [load, refresh])

  useEffect(() => { void refresh() }, [refresh])
  return { places, loading, error, setPlaces, refresh, search }
}

export const usePlaces = () => {
  const context = useContext(PlacesContext)
  if (!context) throw new Error('usePlaces must be used inside PlacesProvider')
  return context
}
