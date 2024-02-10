import { useState } from 'react'
import { Link, useParams } from 'react-router-dom'
import { PlaceCardWrapper, PlaceCardImageWrapper } from './styles'
import { MdStar } from 'react-icons/md'
import { MdStarBorder } from 'react-icons/md'
import { MdStarHalf } from 'react-icons/md'
import { FaHeart } from 'react-icons/fa'
import { FaRegHeart } from 'react-icons/fa'

interface PlaceCardProps {
  place: {
    id: number
    category: string
    placeId?: number
    title: string
    address: string
    photos: string[]
    description?: string
    perks?: string[]
    extraInfo?: string
    maxGuests?: number
    rating: number
    price: number
  }
}

const PlaceCard = (props: PlaceCardProps) => {
  const [isFavorited, setIsFavorited] = useState(false)
  const { place } = props
  const { title, address, photos, rating, price } = place

  return (
    <>
      <PlaceCardWrapper>
        {photos?.[0] && (
          <PlaceCardImageWrapper>
            <Link to={`/place/${place.category}/${place.id}`}>
              <img
                src={`${photos?.[0]}`}
                className=""
                alt="place"
                width="300"
              />
            </Link>
            <div
              className="favorite-heart"
              onClick={() => setIsFavorited(!isFavorited)}
            >
              {isFavorited ? (
                <FaHeart style={{ color: 'red' }} />
              ) : (
                <FaRegHeart />
              )}
            </div>
          </PlaceCardImageWrapper>
        )}
        <div className="content-wrapper">
          <p className="">{title}</p>
          <p className="">{address}</p>
          <p className="">
            {rating === 5 ? (
              <div style={{ color: '#ff8c91' }}>
                <MdStar />
                <MdStar />
                <MdStar />
                <MdStar />
                <MdStar />
                {rating}
              </div>
            ) : rating === 4.5 ? (
              <>
                <MdStar />
                <MdStar />
                <MdStar />
                <MdStar />
                <MdStarHalf />
                {rating}
              </>
            ) : rating === 4 ? (
              <>
                <MdStar />
                <MdStar />
                <MdStar />
                <MdStar />
                <MdStarBorder />
              </>
            ) : rating === 3.5 ? (
              <>
                <MdStar />
                <MdStar />
                <MdStar />
                <MdStarHalf />
                <MdStarBorder />
              </>
            ) : rating === 3 ? (
              <>
                <MdStar />
                <MdStar />
                <MdStar />
                <MdStarBorder />
                <MdStarBorder />
              </>
            ) : rating === 2.5 ? (
              <>
                <MdStar />
                <MdStar />
                <MdStarHalf />
                <MdStarBorder />
                <MdStarBorder />
              </>
            ) : rating === 2 ? (
              <>
                <MdStar />
                <MdStar />
                <MdStarBorder />
                <MdStarBorder />
                <MdStarBorder />
              </>
            ) : rating === 1.5 ? (
              <>
                <MdStar />
                <MdStarHalf />
                <MdStarBorder />
                <MdStarBorder />
                <MdStarBorder />
              </>
            ) : rating === 1 ? (
              <>
                <MdStar />
                <MdStarBorder />
                <MdStarBorder />
                <MdStarBorder />
                <MdStarBorder />
              </>
            ) : (
              <>
                <MdStarBorder />
                <MdStarBorder />
                <MdStarBorder />
                <MdStarBorder />
                <MdStarBorder />
              </>
            )}
          </p>
          <div className="">
            <span className="">CHF{price} </span>
            per night
          </div>
        </div>
      </PlaceCardWrapper>
    </>
  )
}

export default PlaceCard
