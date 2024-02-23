/* eslint-disable @typescript-eslint/no-explicit-any */
import { useState, useEffect } from 'react'
import { iconicCities } from '../../../data/iconicCities'
import PlaceCard from '../../place-card/PlaceCard'

const IconicCities = () => {
  const [iconicCityPlaces, setIconicCityPlaces] = useState([])
  useEffect(() => {
    setIconicCityPlaces(iconicCities as any)
  }, [])

  return (
    <div style={{ display: 'flex', flexWrap: 'wrap', marginTop: '1.5rem' }}>
      {iconicCityPlaces.map((place, idx) => (
        <PlaceCard key={idx} place={place} />
      ))}
    </div>
  )
}

export default IconicCities
