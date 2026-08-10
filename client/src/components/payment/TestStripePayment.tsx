import { useEffect, useState } from "react";
import { CardElement, Elements, useElements, useStripe } from "@stripe/react-stripe-js";
import { loadStripe } from "@stripe/stripe-js";
import { CheckCircle2, CreditCard, LoaderCircle, LockKeyhole } from "lucide-react";
import { useLocation, useNavigate } from "react-router-dom";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { getErrorMessage, giftCardsService, paymentsService } from "../../services";
import { useBooking, useExperiences } from "../../lib/hooks";
import { useTranslation } from "react-i18next";

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
  const { t } = useTranslation("commerce");
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
  const [giftCardAmount, setGiftCardAmount] = useState(0);
  const [stripeAmount, setStripeAmount] = useState(0);
  const bookingId = new URLSearchParams(location.search).get("booking");
  const experienceBookingId = new URLSearchParams(location.search).get("experienceBooking");
  const serviceRequestId = new URLSearchParams(location.search).get("serviceRequest");

  useEffect(() => {
    let active = true;

    const preparePayment = async () => {
      if (!bookingId && !experienceBookingId && !serviceRequestId) {
        if (active) {
          setError(t("payment.missing"));
          setPreparing(false);
        }
        return;
      }

      try {
        const wallet = await giftCardsService.summary().catch(() => null);
        const data = await paymentsService.create({
          bookingId: bookingId ?? undefined,
          experienceBookingId: experienceBookingId ?? undefined,
          serviceRequestId: serviceRequestId ?? undefined,
          currency: "chf",
          useGiftBalance: Boolean(wallet?.balance),
        });
        if (!data.success) throw new Error(t("payment.sessionError"));
        if (active) {
          setGiftCardAmount(data.giftCardAmount ?? 0);
          setStripeAmount(data.stripeAmount ?? data.data.amount);
        }
        if (data.alreadyPaid) {
          await paymentsService.confirm(data.data._id);
          await Promise.all([refreshBookings(), refreshExperienceBookings()]);
          if (active) {
            const returnLocation = new URL(data.successUrl, window.location.origin);
            navigate(`${returnLocation.pathname}${returnLocation.search}`);
          }
          return;
        }
        if (!data.clientSecret) throw new Error(t("payment.sessionError"));
        if (active) {
          setClientSecret(data.clientSecret);
          setPaymentId(data.data._id);
          setSuccessUrl(data.successUrl);
        }
      } catch (cause) {
        if (active) setError(getErrorMessage(cause, t("payment.sessionError")));
      } finally {
        if (active) setPreparing(false);
      }
    };

    void preparePayment();
    return () => { active = false; };
  }, [bookingId, experienceBookingId, navigate, refreshBookings, refreshExperienceBookings, serviceRequestId, t]);

  const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    if (!stripe || !elements || !clientSecret || isLoading) return;

    const card = elements.getElement(CardElement);
    if (!card) {
      setError(t("payment.cardNotReady"));
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
        setError(result.error.message ?? t("payment.failed"));
      } else if (result.paymentIntent?.status === "succeeded") {
        if (!paymentId) throw new Error(t("payment.missingReference"));
        await paymentsService.confirm(paymentId);
        await Promise.all([refreshBookings(), refreshExperienceBookings()]);
        setPaymentStatus("confirmed");
        toast.success(t("payment.completed"));
        onSuccessfulCheckout();
        const returnLocation = new URL(successUrl, window.location.origin);
        navigate(`${returnLocation.pathname}${returnLocation.search}`);
      }
    } catch (cause) {
      setError(getErrorMessage(cause, t("payment.confirmError")));
    } finally {
      setLoading(false);
    }
  };

  const buttonDisabled = !stripe || !clientSecret || !paymentId || !successUrl || isPreparing || isLoading;

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div>
        <label className="mb-2 flex items-center justify-between gap-3 text-sm font-semibold text-slate-800">
          <span className="flex items-center gap-2"><CreditCard className="size-4 text-emerald-700" /> {t("payment.card")}</span>
          <span className="flex items-center gap-1 text-[0.65rem] font-bold uppercase tracking-[0.12em] text-slate-400"><LockKeyhole className="size-3" /> {t("payment.encrypted")}</span>
        </label>
        <div className={`rounded-2xl border bg-slate-50 px-4 py-4 transition ${error ? "border-rose-300 ring-4 ring-rose-50" : "border-slate-200 focus-within:border-emerald-500 focus-within:ring-4 focus-within:ring-emerald-50"}`}>
          <CardElement options={cardOptions} />
        </div>
      </div>

      {giftCardAmount > 0 && (
        <div className="rounded-2xl border border-emerald-200 bg-emerald-50 p-4 text-sm">
          <p className="flex items-center justify-between gap-4 font-semibold text-emerald-900">
            <span>{t("payment.giftApplied")}</span>
            <span className="tabular-nums">−{(giftCardAmount / 100).toFixed(2)} CHF</span>
          </p>
          <p className="mt-1 text-xs text-emerald-700">{t("payment.stripeCharge", { amount: (stripeAmount / 100).toFixed(2) })}</p>
        </div>
      )}

      {isPreparing && <p className="flex items-center gap-2 text-xs font-medium text-slate-500"><LoaderCircle className="size-3.5 animate-spin" /> {t("payment.preparing")}</p>}
      {error && <p role="alert" className="rounded-xl bg-rose-50 px-3.5 py-3 text-sm font-medium leading-5 text-rose-700 ring-1 ring-rose-100">{error}</p>}
      {paymentStatus === "confirmed" && <p className="flex items-center gap-2 rounded-xl bg-emerald-50 px-3.5 py-3 text-sm font-semibold text-emerald-800"><CheckCircle2 className="size-4" /> {t("payment.confirmed")}</p>}

      <button type="submit" disabled={buttonDisabled} className="flex w-full items-center justify-center gap-2 rounded-full bg-gradient-to-r from-rose-600 to-rose-500 px-5 py-3.5 text-sm font-bold text-white shadow-lg shadow-rose-500/20 transition hover:-translate-y-0.5 hover:shadow-xl disabled:cursor-not-allowed disabled:opacity-55 disabled:hover:translate-y-0">
        {isLoading ? <><LoaderCircle className="size-4 animate-spin" /> {t("payment.processing")}</> : <><LockKeyhole className="size-4" /> {t("payment.confirm")}</>}
      </button>
      <p className="text-center text-[0.7rem] leading-5 text-slate-400">{t("payment.terms")}</p>
      <ToastContainer position="bottom-center" autoClose={3000} hideProgressBar theme="light" />
    </form>
  );
};

const MyStripeForm = () => {
  const { t } = useTranslation("commerce");
  if (!stripePublicKey) {
    return (
      <p role="alert" className="rounded-xl bg-rose-50 px-4 py-3 text-sm font-medium text-rose-700">
        {t("payment.unavailable")}
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
