import { useEffect, useState } from "react";
import { CardElement, Elements, useElements, useStripe } from "@stripe/react-stripe-js";
import { loadStripe } from "@stripe/stripe-js";
import { CheckCircle2, CreditCard, LoaderCircle, LockKeyhole } from "lucide-react";
import { useLocation, useNavigate } from "react-router-dom";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { getErrorMessage, paymentsService } from "../../services";
import { useBooking, useExperiences } from "../../lib/hooks";

interface CheckoutFormProps {
  onSuccessfulCheckout: () => void;
}

const stripePublicKey = import.meta.env.VITE_STRIPE_PUBLIC_KEY;
const stripePromise = stripePublicKey ? loadStripe(stripePublicKey) : null;

const cardOptions = {
  style: {
    base: {
      color: "#0f172a",
      fontFamily: "Inter, ui-sans-serif, system-ui, sans-serif",
      fontSize: "16px",
      fontSmoothing: "antialiased",
      "::placeholder": { color: "#94a3b8" },
    },
    invalid: { color: "#e11d48", iconColor: "#e11d48" },
  },
};

const CheckoutForm = ({ onSuccessfulCheckout }: CheckoutFormProps) => {
  const stripe = useStripe();
  const elements = useElements();
  const location = useLocation();
  const navigate = useNavigate();
  const { refresh: refreshBookings } = useBooking();
  const { refreshBookings: refreshExperienceBookings } = useExperiences();
  const [error, setError] = useState("");
  const [isLoading, setLoading] = useState(false);
  const [isPreparing, setPreparing] = useState(true);
  const [clientSecret, setClientSecret] = useState("");
  const [paymentId, setPaymentId] = useState("");
  const [successUrl, setSuccessUrl] = useState("");
  const [paymentStatus, setPaymentStatus] = useState<"pending" | "confirmed">("pending");
  const bookingId = new URLSearchParams(location.search).get("booking");
  const experienceBookingId = new URLSearchParams(location.search).get("experienceBooking");
  const serviceRequestId = new URLSearchParams(location.search).get("serviceRequest");

  useEffect(() => {
    let active = true;

    const preparePayment = async () => {
      if (!bookingId && !experienceBookingId && !serviceRequestId) {
        if (active) {
          setError("Missing booking details. Return to the listing and try again.");
          setPreparing(false);
        }
        return;
      }

      try {
        const data = await paymentsService.create({
          bookingId: bookingId ?? undefined,
          experienceBookingId: experienceBookingId ?? undefined,
          serviceRequestId: serviceRequestId ?? undefined,
          currency: "chf",
        });
        if (!data.success || !data.clientSecret) throw new Error("The secure payment session could not be created.");
        if (data.alreadyPaid) {
          await paymentsService.confirm(data.data._id);
          await Promise.all([refreshBookings(), refreshExperienceBookings()]);
          if (active) {
            const returnLocation = new URL(data.successUrl, window.location.origin);
            navigate(`${returnLocation.pathname}${returnLocation.search}`);
          }
          return;
        }
        if (active) {
          setClientSecret(data.clientSecret);
          setPaymentId(data.data._id);
          setSuccessUrl(data.successUrl);
        }
      } catch (cause) {
        if (active) setError(getErrorMessage(cause, "The secure payment session could not be created."));
      } finally {
        if (active) setPreparing(false);
      }
    };

    void preparePayment();
    return () => { active = false; };
  }, [bookingId, experienceBookingId, navigate, refreshBookings, refreshExperienceBookings, serviceRequestId]);

  const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    if (!stripe || !elements || !clientSecret || isLoading) return;

    const card = elements.getElement(CardElement);
    if (!card) {
      setError("Card details are not ready yet. Please try again.");
      return;
    }

    setLoading(true);
    setError("");

    try {
      const result = await stripe.confirmCardPayment(clientSecret, {
        payment_method: { card },
        return_url: successUrl,
      });
      if (result.error) {
        setError(result.error.message ?? "Payment failed. Please check your card details.");
      } else if (result.paymentIntent?.status === "succeeded") {
        if (!paymentId) throw new Error("Missing payment reference.");
        await paymentsService.confirm(paymentId);
        await Promise.all([refreshBookings(), refreshExperienceBookings()]);
        setPaymentStatus("confirmed");
        toast.success("Payment completed successfully.");
        onSuccessfulCheckout();
        const returnLocation = new URL(successUrl, window.location.origin);
        navigate(`${returnLocation.pathname}${returnLocation.search}`);
      }
    } catch (cause) {
      setError(getErrorMessage(cause, "The payment was received, but the booking could not be confirmed. Please try again."));
    } finally {
      setLoading(false);
    }
  };

  const buttonDisabled = !stripe || !clientSecret || !paymentId || !successUrl || isPreparing || isLoading;

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div>
        <label className="mb-2 flex items-center justify-between gap-3 text-sm font-semibold text-slate-800">
          <span className="flex items-center gap-2"><CreditCard className="size-4 text-emerald-700" /> Card information</span>
          <span className="flex items-center gap-1 text-[0.65rem] font-bold uppercase tracking-[0.12em] text-slate-400"><LockKeyhole className="size-3" /> Encrypted</span>
        </label>
        <div className={`rounded-2xl border bg-slate-50 px-4 py-4 transition ${error ? "border-rose-300 ring-4 ring-rose-50" : "border-slate-200 focus-within:border-emerald-500 focus-within:ring-4 focus-within:ring-emerald-50"}`}>
          <CardElement options={cardOptions} />
        </div>
      </div>

      {isPreparing && <p className="flex items-center gap-2 text-xs font-medium text-slate-500"><LoaderCircle className="size-3.5 animate-spin" /> Preparing your secure payment…</p>}
      {error && <p role="alert" className="rounded-xl bg-rose-50 px-3.5 py-3 text-sm font-medium leading-5 text-rose-700 ring-1 ring-rose-100">{error}</p>}
      {paymentStatus === "confirmed" && <p className="flex items-center gap-2 rounded-xl bg-emerald-50 px-3.5 py-3 text-sm font-semibold text-emerald-800"><CheckCircle2 className="size-4" /> Payment confirmed</p>}

      <button type="submit" disabled={buttonDisabled} className="flex w-full items-center justify-center gap-2 rounded-full bg-gradient-to-r from-rose-600 to-rose-500 px-5 py-3.5 text-sm font-bold text-white shadow-lg shadow-rose-500/20 transition hover:-translate-y-0.5 hover:shadow-xl disabled:cursor-not-allowed disabled:opacity-55 disabled:hover:translate-y-0">
        {isLoading ? <><LoaderCircle className="size-4 animate-spin" /> Processing payment…</> : <><LockKeyhole className="size-4" /> Confirm and pay</>}
      </button>
      <p className="text-center text-[0.7rem] leading-5 text-slate-400">By confirming, you agree to Flypnp's booking terms and cancellation policy.</p>
      <ToastContainer position="bottom-center" autoClose={3000} hideProgressBar theme="light" />
    </form>
  );
};

const MyStripeForm = () => {
  if (!stripePublicKey) {
    return (
      <p role="alert" className="rounded-xl bg-rose-50 px-4 py-3 text-sm font-medium text-rose-700">
        Secure payments are temporarily unavailable. Please contact Flypnp support.
      </p>
    );
  }

  return (
    <Elements stripe={stripePromise}>
      <CheckoutForm onSuccessfulCheckout={() => undefined} />
    </Elements>
  );
};

export default MyStripeForm;
