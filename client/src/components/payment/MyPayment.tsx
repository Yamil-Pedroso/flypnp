/* eslint-disable @typescript-eslint/no-explicit-any */
import { useEffect, useState } from 'react'
import { PaymentContainer } from './styles'
import { FaCcVisa, FaPaypal, FaCcMastercard, FaGooglePay } from 'react-icons/fa'
import { GrAmex } from 'react-icons/gr'
import { BsCreditCardFill } from 'react-icons/bs'
import { IoIosLock } from 'react-icons/io'
import { usePayment } from '../../../hooks'

interface Place {
  _id: string
  title: string
  address: string
  photos: string[]
  category: string
  description: string
  perks: string[]
  extraInfo: string
  maxGuests: number
  rating: number
  reviews: number
  price: number
}

const MyPayment = () => {
  const { paymentDetailsWithPlace } = usePayment()
  const [placeDetails, setPlaceDetails] = useState<Place | null>(null) as any

  const paymentId = '' // must be dynamic

  useEffect(() => {
    const fetchPlaceDetails = async () => {
      const details = await paymentDetailsWithPlace(paymentId)
      setPlaceDetails(details)
    }

    fetchPlaceDetails()
  }, [paymentDetailsWithPlace, paymentId])

  if (!placeDetails) {
    return <div>Loading place details...</div>
  }

  return (
    <PaymentContainer>
      <div className="left-cont">
        <h2>Your trip</h2>
        <div className="date-guests-wrapper">
          <div className="dates-cont">
            <div className="dates-wapper">
              <p>Dates</p>
              <p>MM/DD/YYYY</p>
            </div>
            <div className="edit-wrapper">Edit</div>
          </div>
          <div className="guests-cont">
            <div className="guests-wapper">
              <p>Guests</p>
              <p>Number of guests</p>
            </div>
            <div className="edit-wrapper">Edit</div>
          </div>
        </div>
        <hr />
        <div className="payment-form">
          <div className="payment-header">
            <h2>Pay with</h2>
            <div className="pay-mode-wrapper">
              <FaCcVisa size="18" />
              <FaPaypal size="18" />
              <FaCcMastercard size="18" />
              <GrAmex size="28" />
              <FaGooglePay size="28" />
            </div>
          </div>
          <form>
            <div className="input-wrapper credit-card">
              <BsCreditCardFill size="18" className="credit-card-icon" />
              <input
                type="email"
                id="email"
                placeholder="Credit or debit card"
              />
            </div>
            <div className="input-wrapper">
              <div className="card-number">
                <input type="text" id="card" placeholder="Card number" />
                <IoIosLock size="19" className="lock-icon" />
              </div>
              <div className="exp-cvv-wrapper">
                <input type="text" id="expiry" placeholder="MM/YY" />
                <input type="text" id="cvv" placeholder="CVV" />
              </div>
            </div>
            <div className="input-wrapper">
              <h3>Billing address</h3>

              <div className="billing-address-wrapper">
                <input type="text" id="address" placeholder="Street address" />
                <input
                  type="text"
                  id="city"
                  placeholder="Apt or suite number"
                />
                <div>
                  <input type="text" id="zip" placeholder="City" />
                  <div className="state-zip-wrapper">
                    <input type="text" id="state" placeholder="State" />
                    <input type="text" id="zip" placeholder="Zip code" />
                  </div>
                </div>
                <div>
                  <input
                    type="text"
                    id="country"
                    placeholder="Country/region"
                  />
                </div>
              </div>
            </div>

            <button type="submit">Pay</button>
          </form>
        </div>
      </div>

      <hr />

      <div className="right-cont">
        <div className="place-rating-wrapper">
          <div className="place-desc">
            <img
              src={placeDetails.photos[0].main}
              alt={placeDetails.title}
              width={200}
            />
            <h2>{placeDetails.title}</h2>
            <p>{placeDetails.rating}</p>
          </div>
        </div>
        <hr />
        <div className="price-details-wrapper">
          <div className="price-in-nights">
            <p>
              {placeDetails.price} x 3 nights
              <span>3 nights</span>
            </p>
            <p>{placeDetails.price * 3}</p>
          </div>
          <div className="service-fee">{placeDetails.price * 0.1}</div>
        </div>
        <hr />
        <div className="total-price-wrapper">
          <p>Total</p>
          <p>{placeDetails.price * 0.1 + placeDetails.price}</p>
        </div>
      </div>
    </PaymentContainer>
  )
}

export default MyPayment
