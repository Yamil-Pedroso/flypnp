import { useState, useEffect } from 'react'
import { loadStripe } from '@stripe/stripe-js'
import { useLocation, useNavigate } from 'react-router-dom'
import {
  CardElement,
  Elements,
  useStripe,
  useElements,
} from '@stripe/react-stripe-js'
import { ToastContainer, toast } from 'react-toastify'
import 'react-toastify/dist/ReactToastify.css'
//import { usePayment } from '../../../hooks'
import axiosInstance from '../../../src/utils/axios'

interface CheckoutFormProps {
  onSuccessfulCheckout: () => void
  status?: 'pending' | 'confirmed'
}

const stripePromise = loadStripe(import.meta.env.VITE_STRIPE_PUBLIC_KEY)

const CheckoutForm = ({ onSuccessfulCheckout }: CheckoutFormProps) => {
  //const { clientSecret, createPayment } = usePayment() as any
  const stripe = useStripe()
  const elements = useElements()
  const [error, setError] = useState('') as any
  const [isLoading, setLoading] = useState(false)
  const [clientSecret, setClientSecret] = useState('') as any
  const [paymentStatus, setPaymentStatus] = useState('pending') as any
  const location = useLocation()
  const navigate = useNavigate()
  const notify = () => toast('You have made the payment successfully!')

  //useEffect(() => {
  //  const getClientSecret = async () => {
  //    const response = await createPayment()
  //    return response.clientSecret
  //  }
  //  getClientSecret()
  //}, [])

  interface Name {
    name: string
  }

  const useQuery = new URLSearchParams(location.search)
  const user = (useQuery.get('user') as unknown) as Name
  //const booking = useQuery.get('booking')
  const price = useQuery.get('price')
  const place = useQuery.get('place')

  useEffect(() => {
    const createPaymentClientSecret = async () => {
      try {
        const response = await axiosInstance.post('/create-payment', {
          user: user,
          name: user.name,
          placeId: place,
          amount: price,
          currency: 'chf',
          status: 'confirmed',
          stripeId: 'pi_3OqDGhBO47rgKbjy0Gwl6Gui',
          paymentMethod: 'pm_1OqDGgBO47rgKbjyySEck3dX',
          paymentDate: '2023-03-15T00:00:00.000Z',
        })

        const data = response.data

        if (data.success && data.clientSecret) {
          setClientSecret(data.clientSecret)
          return { success: true, clientSecret: data.clientSecret }
        } else {
          console.error('Failed to retrieve client secret')
          return { success: false, message: 'Failed to retrieve client secret' }
        }
      } catch (error) {
        console.error('Failed to retrieve client secret')
        return { success: false, message: 'Failed to retrieve client secret' }
      }
    }

    createPaymentClientSecret()
  }, [user.name, place, price, user])

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault()
    if (!stripe || !elements || !clientSecret) {
      return
    }
    setLoading(true)

    const result = await stripe.confirmCardPayment(clientSecret, {
      payment_method: {
        card: elements.getElement(CardElement),
      },
    } as any)

    setLoading(false)

    if (result.error) {
      setError(result.error.message)
    } else if (result.paymentIntent.status === 'succeeded') {
      setError('')
      notify()
      setPaymentStatus('confirmed')
      onSuccessfulCheckout()
      navigate('/succeeded-payment')
    }
  }

  return (
    <form onSubmit={handleSubmit}>
      <CardElement />
      <button
        style={{
          marginTop: '20px',
          padding: '10px 20px',
          backgroundColor: '#2a2a2a',
          color: 'white',
          border: 'none',
          borderRadius: '5px',
          cursor: 'pointer',
        }}
        disabled={isLoading}
      >
        Pay
      </button>
      <p
        style={{
          marginTop: '10px',
          color: paymentStatus === 'confirmed' ? 'green' : '#2a2a2a',
        }}
      >
        {paymentStatus === 'pending'
          ? 'Payment pending'
          : paymentStatus === 'confirmed'
          ? 'Payment confirmed'
          : ''}
      </p>
      {error && <div>{error}</div>}
      <ToastContainer />
    </form>
  )
}

const MyStripeForm = () => {
  return (
    <Elements stripe={stripePromise}>
      <CheckoutForm
        onSuccessfulCheckout={() => console.log('Payment successful!')}
      />
    </Elements>
  )
}

export default MyStripeForm
