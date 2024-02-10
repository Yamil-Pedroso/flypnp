import { useState, useEffect } from 'react'
import { trending } from '../../../data/trending'
import PlaceCard from '../../place-card/PlaceCard'

interface ITrending {
  title: string
  address: string
  photo: string[]
  description: string
  perks: string[]
  extraInfo: string
  maxGuests: number
  rating: number
  price: number
}

const Trending = () => {
  const [trendingPlaces, setTrendingPlaces] = useState([])

  useEffect(() => {
    setTrendingPlaces(trending as any)
  }, [])
  return (
    <div style={{ display: 'flex', flexWrap: 'wrap' }}>
      {trendingPlaces.map((place, idx) => (
        <PlaceCard key={idx} place={place} />
      ))}
    </div>
  )
}

export default Trending
