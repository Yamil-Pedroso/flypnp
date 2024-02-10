import { useState, useEffect } from 'react'
import { iconicCities } from '../../../data/iconicCities'
import PlaceCard from '../../place-card/PlaceCard'

const IconicCities = () => {
  const [iconicCityPlaces, setIconicCityPlaces] = useState([])
  useEffect(() => {
    setIconicCityPlaces(iconicCities as any)
  }, [])

  return (
    <div style={{ display: 'flex', flexWrap: 'wrap' }}>
      {iconicCityPlaces.map((place, idx) => (
        <PlaceCard key={idx} place={place} />
      ))}
    </div>
  )
}

export default IconicCities
