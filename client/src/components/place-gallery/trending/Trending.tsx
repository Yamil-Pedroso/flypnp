/* eslint-disable @typescript-eslint/no-explicit-any */
import { useState, useEffect } from 'react'
import { trending } from '../../../data/trending'
import PlaceCard from '../../place-card/PlaceCard'

const Trending = () => {
  const [trendingPlaces, setTrendingPlaces] = useState([])

  useEffect(() => {
    setTrendingPlaces(trending as any)
  }, [])
  return (
    <div
      style={{
        display: 'flex',
        justifyContent: 'center',
        flexWrap: 'wrap',
        marginTop: '1.5rem',
      }}
    >
      {trendingPlaces.map((place, idx) => (
        <PlaceCard key={idx} place={place} />
      ))}
    </div>
  )
}

export default Trending
