/* eslint-disable @typescript-eslint/no-explicit-any */
import { useState } from 'react'
import { usePayment } from '../../../hooks'
import { loadStripe } from '@stripe/stripe-js'
import {
  CardElement,
  Elements,
  useStripe,
  useElements,
} from '@stripe/react-stripe-js'

const stripePromise = loadStripe(import.meta.env.VITE_STRIPE_PUBLIC_KEY)

interface CheckoutFormProps {
  onSuccessfulCheckout: () => void
  clientSecret?: string | undefined
  handlePayment: () => Promise<void>
}

const CheckoutForm = ({
  onSuccessfulCheckout,
  clientSecret,
  handlePayment,
}: CheckoutFormProps) => {
  const stripe = useStripe()
  const elements = useElements()
  const [error, setError] = useState(null)
  const [isLoading, setLoading] = useState(false)

  const handleSubmit = async (e: any) => {
    e.preventDefault()
    if (!stripe || !elements || !clientSecret) {
      console.log(
        'Stripe.js has not been loaded yet, or clientSecret is missing.',
      )
      return
    }

    setLoading(true)
    await handlePayment()
    const cardElement = elements.getElement(CardElement) as any

    const result = (await stripe.confirmCardPayment(clientSecret, {
      payment_method: {
        card: cardElement,
      },
    })) as any

    setLoading(false)

    if (result.error) {
      setError(result.error.message)
      console.log(result.error.message)
    } else {
      if (result.paymentIntent.status === 'succeeded') {
        console.log('Payment succeeded!')
        onSuccessfulCheckout()
      }
    }
  }

  return (
    <form onSubmit={handleSubmit}>
      <CardElement />
      <button disabled={isLoading || !stripe || !elements}>
        {isLoading ? 'Processing...' : 'Pay'}
      </button>
      {error && <div>{error}</div>}
    </form>
  )
}

const MyStripeForm = () => {
  const { clientSecret, createPayment } = usePayment()

  const handlePayment = async () => {
    await createPayment({
      amount: 3000,
      currency: 'chf',
    } as any)
  }

  return (
    <Elements stripe={stripePromise} options={{ clientSecret }}>
      <CheckoutForm
        handlePayment={handlePayment}
        clientSecret={clientSecret}
        onSuccessfulCheckout={() => console.log('Payment successful!')}
      />
    </Elements>
  )
}

export default MyStripeForm
