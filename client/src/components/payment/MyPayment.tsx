/* eslint-disable @typescript-eslint/no-explicit-any */
import { useState } from 'react'
import { PaymentContainer } from './styles'
import { useLocation } from 'react-router-dom'
import { FaCcVisa, FaPaypal, FaCcMastercard, FaGooglePay } from 'react-icons/fa'
import { GrAmex } from 'react-icons/gr'
import TestStripePayment from './TestStripePayment'
//import MyStripeForm from './StripeForm'
//import { usePayment } from '../../../hooks'
//import { BsCreditCardFill } from 'react-icons/bs'
//import { IoIosLock } from 'react-icons/io'

//interface Place {
//  _id: string
//  title: string
//  address: string
//  photos: string[]
//  category: string
//  description: string
//  perks: string[]
//  extraInfo: string
//  maxGuests: number
//  rating: number
//  reviews: number
//  price: number
//}

interface MyPaymentProps {
  myPrice: string
}

const MyPayment = ({ myPrice }: MyPaymentProps) => {
  const location = useLocation()
  //const { paymentDetailsWithPlace } = usePayment()
  //const [placeDetails, setPlaceDetails] = useState<Place | null>(null)

  //useEffect(() => {
  //  // Supongamos que este es el ID dinámico de tu lugar
  //  const placeId = 'PLACE_ID'
  //  paymentDetailsWithPlace(placeId).then(setPlaceDetails as any)
  //}, [paymentDetailsWithPlace])
  //
  //const onSuccessfulCheckout = () => {
  //  // Aquí manejas lo que sucede después de un pago exitoso
  //  console.log('Pago realizado con éxito')
  //}

  const useQuery = new URLSearchParams(location.search)
  const user = useQuery.get('user')
  const booking = useQuery.get('booking')
  const checkIn = useQuery.get('checkIn')
  const checkOut = useQuery.get('checkOut')
  const guests = useQuery.get('guests')
  const price = useQuery.get('price')
  const photo = useQuery.get('photo') as string
  const title = useQuery.get('title')
  const description = useQuery.get('description')
  const rating = useQuery.get('rating')

  console.log('booking', booking)

  return (
    <PaymentContainer>
      <div className="left-cont">
        <h2>Your trip</h2>
        <div className="date-guests-wrapper">
          <div className="dates-cont">
            <div className="dates-wapper">
              <p>Dates</p>
              <p>
                {checkIn} - {checkOut}
              </p>
            </div>
            <div className="edit-wrapper">Edit</div>
          </div>
          <div className="guests-cont">
            <div className="guests-wapper">
              <p>Guests</p>
              <p>{guests} guests</p>
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
          <TestStripePayment />
          {/*<form>
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
  </form>*/}
        </div>
      </div>

      <hr />

      <div className="right-cont">
        <div className="place-rating-wrapper">
          <img src={photo} alt="" width={200} />
          <div className="place-desc">
            <h2>{title}</h2>
            <p>{description}</p>
            <p>{rating}</p>
          </div>
        </div>
        <hr />
        <div className="price-details-wrapper">
          <div className="price-in-nights">
            <p>
              <span>nights</span>
            </p>
            <p></p>
          </div>
          <div className="service-fee">{Number(price) * 0.1}</div>
        </div>
        <hr />
        <div className="total-price-wrapper">
          <p>Total</p>
          <p>
            {Number(price) + Number(price) * 0.1}
            CHF
          </p>
        </div>
      </div>
    </PaymentContainer>
  )
}

export default MyPayment
