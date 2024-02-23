import { useState } from 'react'
import { Link } from 'react-router-dom'
import { Container, PlaceCardWrapper, PlaceCardImageWrapper } from './styles'
import { MdStar } from 'react-icons/md'
import { MdStarBorder } from 'react-icons/md'
import { MdStarHalf } from 'react-icons/md'
import { FaHeart } from 'react-icons/fa'
import { IoCloseSharp } from 'react-icons/io5'
import { FaRegHeart } from 'react-icons/fa'
import CreateWishListBox from '../wishlist/create/CreateWishListBox'

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
  const [showCreateWishList, setShowCreateWishList] = useState(false)
  const [isFavorited, setIsFavorited] = useState(false)
  const { place } = props
  const { title, address, photos, rating, price } = place

  const handleClickCreateWishList = () => {
    setShowCreateWishList(!showCreateWishList)
  }

  return (
    <Container>
      <div className={`overlay ${showCreateWishList && 'show'}`}>
        <CreateWishListBox
          closeCreateWishList={handleClickCreateWishList}
          className="wishlist-box"
        />
      </div>
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
              onClick={() => handleClickCreateWishList()}
            >
              <FaRegHeart />
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
    </Container>
  )
}

export default PlaceCard
