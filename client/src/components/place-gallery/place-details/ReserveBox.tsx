/* eslint-disable @typescript-eslint/no-explicit-any */
import { useNavigate } from 'react-router-dom'
import { useState } from 'react'
import { useParams } from 'react-router-dom'
import { usePlaces } from '../../../../hooks'
import { useBooking } from '../../../../hooks'
import { useAuth } from '../../../../hooks'
import { FaChevronDown, FaChevronUp } from 'react-icons/fa'
import MyCalendar from '../../common/calendar/Calendar'

const ReserveBox = () => {
  const [clickArrow, setClickArrow] = useState(false)
  const [clickCheckIn, setClickCheckIn] = useState(false)
  const { places, loading } = usePlaces()
  const { id, category } = useParams()
  const [checkInDate, setCheckInDate] = useState('2024-02-23') // setStates to play with the data dynamically
  const [checkOutDate, setCheckOutDate] = useState('2024-03-19') // setStates to play with the data dynamically
  const [guests, setGuests] = useState(1) // setStates to play with the data dynamically
  const { user } = useAuth() as any
  const { bookings } = useBooking() as any
  //console.log('places', places[0]._id)

  const navigate = useNavigate()

  const handleCheckInClick = () => {
    setClickCheckIn(!clickCheckIn)
  }

  if (loading) {
    return <div>Loading...</div>
  }

  const place = places.find(
    (place) => place._id === id && place.category === category,
  )

  if (!place) {
    return <div>Image not found</div>
  }

  const mainPhoto = place.photos[0]?.main || ''

  const handleReserveClick = () => {
    navigate(
      `/my-payment?checkIn=${checkInDate}&checkOut=${checkOutDate}&guests=${guests}&price=${place.price}&photo=${mainPhoto}&title=${place.title}&description=${place.description}&rating=${place.rating}&user=${user._id}&place=${place._id}`,
    )
  }

  return (
    <div className="reserve-box-container">
      <div className="price-wrapper">
        <span>{place.price} CHF</span>
        <span>/ night</span>
      </div>

      <div className="check-in-out-guests-wrapper">
        <div className="check-in-out-guests-box">
          <button onClick={handleCheckInClick}>
            <span>CHECK-IN</span>
            <p>2/23/2024</p>
          </button>
          <div className="vertical-line"></div>
          <button>
            <span>CHECK-OUT</span>
            <p>3/19/2024</p>
          </button>
        </div>

        <div className="horizontal-line"></div>

        <div className="guests-box">
          <div className="dropdown-guests-wrapper">
            <div>
              <p>Guests</p>
              <p>1 guest</p>
            </div>
            <div className="arrow-down-up">
              <span onClick={() => {}}>
                {clickArrow ? <FaChevronUp /> : <FaChevronDown />}
              </span>
            </div>
          </div>
        </div>
      </div>

      <button onClick={handleReserveClick} className="reserve-button">
        Reserve
      </button>

      {clickCheckIn && <MyCalendar className="calendar" />}
    </div>
  )
}

export default ReserveBox
