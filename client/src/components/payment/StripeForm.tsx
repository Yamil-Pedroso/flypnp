import { useState, useEffect } from "react";
import { usePayment } from "../../../hooks";
import { loadStripe } from "@stripe/stripe-js";
import {
  CardElement,
  Elements,
  useStripe,
  useElements,
} from "@stripe/react-stripe-js";

interface CheckoutFormProps {
  onSuccessfulCheckout: () => void;
  clientSecret: string;
}

const stripePromise = loadStripe(import.meta.env.TRIPE_PUBLIC_KEY);

const CheckoutForm = ({
  onSuccessfulCheckout,
  clientSecret,
}: CheckoutFormProps) => {
  const stripe = useStripe();
  const elements = useElements();
  const [error, setError] = useState<string | null>(null);
  const [isLoading, setLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!stripe || !elements) return;

    setLoading(true);
    const cardElement = elements.getElement(CardElement);

    const result = await stripe.confirmCardPayment(clientSecret, {
      payment_method: { card: cardElement! },
    });

    setLoading(false);

    if (result.error) {
      setError(result.error.message || "An error occurred");
    } else if (result.paymentIntent?.status === "succeeded") {
      onSuccessfulCheckout();
    }
  };

  return (
    <form onSubmit={handleSubmit} className="mt-4 space-y-4">
      <div className="p-4 border rounded-md shadow-sm bg-white">
        <CardElement options={{ style: { base: { fontSize: "16px" } } }} />
      </div>
      {error && <div className="text-red-500 text-sm">{error}</div>}
      <button
        type="submit"
        disabled={isLoading || !stripe}
        className="w-full bg-pink-600 text-white py-2 rounded-md hover:opacity-90 disabled:opacity-50"
      >
        {isLoading ? "Processing..." : "Pay"}
      </button>
    </form>
  );
};

const MyStripeForm = () => {
  const { clientSecret, createPayment } = usePayment() as any;
  const [isClientSecretReady, setIsClientSecretReady] = useState(false);

  useEffect(() => {
    const preparePayment = async () => {
      await createPayment({ amount: 3000, currency: "chf" });
      setIsClientSecretReady(true);
    };

    if (!clientSecret) {
      preparePayment();
    }
  }, [clientSecret, createPayment]);

  if (!isClientSecretReady)
    return <div className="text-center py-8">Loading payment details...</div>;

  return (
    <div className="max-w-2xl mx-auto p-4 bg-gray-50 rounded-lg shadow-md">
      <h2 className="text-xl font-semibold mb-4">Complete your payment</h2>
      <Elements stripe={stripePromise} options={{ clientSecret }}>
        <CheckoutForm
          clientSecret={clientSecret}
          onSuccessfulCheckout={() => console.log("Payment successful!")}
        />
      </Elements>
    </div>
  );
};

export default MyStripeForm;
