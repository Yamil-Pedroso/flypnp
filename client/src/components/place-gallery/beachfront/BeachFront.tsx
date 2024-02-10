import { useState, useEffect } from 'react'
import { beachFront } from '../../../data/beachFront'
import PlaceCard from '../../place-card/PlaceCard'

const BeachFront = () => {
  const [beachFrontPlaces, setBeachFrontPlaces] = useState([])

  useEffect(() => {
    setBeachFrontPlaces(beachFront as any)
  }, [])

  return (
    <div style={{ display: 'flex', flexWrap: 'wrap' }}>
      {beachFrontPlaces.map((place, idx) => (
        <PlaceCard key={idx} place={place} />
      ))}
    </div>
  )
}

export default BeachFront
