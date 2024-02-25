/* eslint-disable @typescript-eslint/no-explicit-any */
import { useState, useEffect } from 'react'
import { usePlaces } from '../../../../hooks'
import PlaceCard from '../../place-card/PlaceCard'
import { Place } from '../../../providers/PlacesProvider'

const BeachFront = () => {
  const [beachFrontPlaces, setBeachFrontPlaces] = useState<Place[]>([])
  const { places, loading } = usePlaces()

  useEffect(() => {
    if (!loading && Array.isArray(places)) {
      const beachFrontPlaces = places.filter(
        (place) => place.category === 'beachFront',
      )
      setBeachFrontPlaces(beachFrontPlaces)
    }
  }, [places, loading])

  if (loading) {
    return <div>Loading...</div>
  }

  return (
    <div
      style={{
        display: 'flex',
        justifyContent: 'center',
        flexWrap: 'wrap',
        marginTop: '1.5rem',
      }}
    >
      {beachFrontPlaces.map((place: any, idx: number) => (
        <PlaceCard key={idx} place={place} />
      ))}
    </div>
  )
}

export default BeachFront
