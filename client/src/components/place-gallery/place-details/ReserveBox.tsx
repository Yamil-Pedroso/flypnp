/* eslint-disable @typescript-eslint/no-explicit-any */
import { useState } from 'react'
import { useParams } from 'react-router-dom'
import { trending } from '../../../data/trending'
import { iconicCities } from '../../../data/iconicCities'
import { beachFront } from '../../../data/beachFront'
import { FaChevronDown, FaChevronUp } from 'react-icons/fa'

const ReserveBox = () => {
  const [clickArrow, setClickArrow] = useState(false)
  const { id, category } = useParams()

  const handleArrowClick = () => {
    setClickArrow(!clickArrow)
  }

  let dataSource = [] as any
  switch (category) {
    case 'trending':
      dataSource = trending
      break
    case 'iconicCities':
      dataSource = iconicCities
      break
    case 'beachFront':
      dataSource = beachFront
      break
    default:
      dataSource = []
  }

  const place = dataSource.find((place: any) => place.id === Number(id))

  if (!place) {
    return <div>Image not found</div>
  }

  return (
    <div className="reserve-box-container">
      <div className="price-wrapper">
        <span>{place.price} CHF</span>
        <span>/ night</span>
      </div>

      <div className="check-in-out-guests-wrapper">
        <div className="check-in-out-guests-box">
          <div>
            <span>CHECK-IN</span>
            <p>2/23/2024</p>
          </div>
          <div className="vertical-line"></div>
          <div>
            <span>CHECK-OUT</span>
            <p>3/19/2024</p>
          </div>
        </div>

        <div className="horizontal-line"></div>

        <div className="guests-box">
          <div className="dropdown-guests-wrapper">
            <div>
              <p>Guests</p>
              <p>1 guest</p>
            </div>
            <div className="arrow-down-up">
              <span onClick={handleArrowClick}>
                {clickArrow ? <FaChevronUp /> : <FaChevronDown />}
              </span>
            </div>
          </div>
        </div>
      </div>
      <button>Reserve</button>
    </div>
  )
}

export default ReserveBox
