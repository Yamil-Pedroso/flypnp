/* eslint-disable @typescript-eslint/no-explicit-any */
import { useState, useEffect } from 'react'
import { usePayment } from '../../../hooks'
import { loadStripe } from '@stripe/stripe-js'
import {
  CardElement,
  Elements,
  useStripe,
  useElements,
} from '@stripe/react-stripe-js'

interface CheckoutFormProps {
  onSuccessfulCheckout: () => void
  clientSecret: string
}

const stripePromise = loadStripe(import.meta.env.VITE_STRIPE_PUBLIC_KEY)

const CheckoutForm = ({
  onSuccessfulCheckout,
  clientSecret,
}: CheckoutFormProps) => {
  const stripe = useStripe()
  const elements = useElements()
  const [error, setError] = useState(null) as any
  const [isLoading, setLoading] = useState(false)

  const handleSubmit = async (e) => {
    e.preventDefault()
    if (!stripe || !elements) {
      // Manejo de errores: Stripe.js aún no se ha cargado.
      return
    }

    setLoading(true)

    const cardElement = elements.getElement(CardElement)

    const result = await stripe.confirmCardPayment(clientSecret, {
      payment_method: {
        card: cardElement,
        // Agregar información adicional aquí si es necesario
      },
    } as any)

    setLoading(false)

    if (result.error) {
      setError(result.error.message)
    } else if (
      result.paymentIntent &&
      result.paymentIntent.status === 'succeeded'
    ) {
      onSuccessfulCheckout()
    }
  }

  return (
    <form onSubmit={handleSubmit}>
      <CardElement />
      <button disabled={isLoading || !stripe}>Pay</button>
      {error && <div>{error}</div>}
    </form>
  )
}

const MyStripeForm = () => {
  const { clientSecret, createPayment } = usePayment() as any
  const [isClientSecretReady, setIsClientSecretReady] = useState(false)

  useEffect(() => {
    const preparePayment = async () => {
      await createPayment({
        amount: 3000,
        currency: 'chf',
      } as any)
      setIsClientSecretReady(true)
    }

    if (!clientSecret) {
      preparePayment()
    }
  }, [clientSecret, createPayment])

  if (!isClientSecretReady) {
    return <div>Loading...</div> // O cualquier otro indicador de carga
  }

  return (
    <Elements stripe={stripePromise} options={{ clientSecret }}>
      <CheckoutForm
        clientSecret={clientSecret}
        onSuccessfulCheckout={() => console.log('Payment successful!')}
      />
    </Elements>
  )
}

export default MyStripeForm
