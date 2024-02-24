/* eslint-disable @typescript-eslint/no-explicit-any */
import { useState, useEffect } from 'react'
import { usePlaces } from '../../../../hooks'
import PlaceCard from '../../place-card/PlaceCard'
import { Place } from '../../../providers/PlacesProvider'

const IconicCities = () => {
  const [iconicCityPlaces, setIconicCityPlaces] = useState<Place[]>([])
  const { places, loading } = usePlaces()

  useEffect(() => {
    if (!loading && Array.isArray(places)) {
      const iconicCityPlaces = places.filter(
        (place) => place.category === 'iconicCities',
      )
      setIconicCityPlaces(iconicCityPlaces)
      console.log('places is an array:', places)
    } else {
      console.log('places is not an array:', places)
    }
  }, [places, loading])

  if (loading) {
    return <div>Loading...</div>
  }

  return (
    <div style={{ display: 'flex', flexWrap: 'wrap', marginTop: '1.5rem' }}>
      {iconicCityPlaces.map((place: any, idx: number) => (
        <PlaceCard key={idx} place={place} />
      ))}
    </div>
  )
}

export default IconicCities
