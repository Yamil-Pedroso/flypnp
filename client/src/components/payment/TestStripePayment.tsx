import { useState, useEffect } from 'react'
import { loadStripe } from '@stripe/stripe-js'
import {
  CardElement,
  Elements,
  useStripe,
  useElements,
} from '@stripe/react-stripe-js'
import axiosInstance from '../../utils/axios'
import { ToastContainer, toast } from 'react-toastify'
import 'react-toastify/dist/ReactToastify.css'

interface CheckoutFormProps {
  onSuccessfulCheckout: () => void
}

const stripePromise = loadStripe(import.meta.env.VITE_STRIPE_PUBLIC_KEY)

const CheckoutForm = ({ onSuccessfulCheckout }: CheckoutFormProps) => {
  const stripe = useStripe()
  const elements = useElements()
  const [error, setError] = useState('') as any
  const [isLoading, setLoading] = useState(false)
  const [clientSecret, setClientSecret] = useState('')
  const notify = () => toast('You have made the payment successfully!')

  useEffect(() => {
    const createPaymentIntent = async () => {
      try {
        const { data } = await axiosInstance.post('/create-payment', {
          user: '65e3a4f63c8b22f5c8b5f69c',
          bookingId: '65e440a55475a2eca6ebe911',
          amount: 800,
          currency: 'chf',
          status: 'pending',
          stripeId: 'pi_3OqDGhBO47rgKbjy0Gwl6Gui',
          paymentMethod: 'pm_1OqDGgBO47rgKbjyySEck3dX',
          paymentDate: '2023-03-15T00:00:00.000Z',
        })
        setClientSecret(data.clientSecret)
      } catch (error) {
        console.log(error)
        // Manejar errores aquí
      }
    }

    createPaymentIntent()
  }, [])

  const handleSubmit = async (e: any) => {
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
      onSuccessfulCheckout()
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
