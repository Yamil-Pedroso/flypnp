import { useEffect, useState } from "react";
import { Link, useSearchParams } from "react-router-dom";
import { getErrorMessage, paymentsService } from "../../services";
import { useBooking } from "../../lib/hooks";

const SucceededPayment = () => {
  const [searchParams] = useSearchParams();
  const { refresh } = useBooking();
  const [status, setStatus] = useState<"checking" | "confirmed" | "error">("checking");
  const [error, setError] = useState("");
  const paymentId = searchParams.get("payment");

  useEffect(() => {
    let active = true;
    const verify = async () => {
      if (!paymentId) {
        if (active) {
          setError("Missing payment reference.");
          setStatus("error");
        }
        return;
      }
      try {
        await paymentsService.confirm(paymentId);
        await refresh();
        if (active) setStatus("confirmed");
      } catch (cause) {
        if (active) {
          setError(getErrorMessage(cause, "We could not verify this payment yet."));
          setStatus("error");
        }
      }
    };
    void verify();
    return () => { active = false; };
  }, [paymentId, refresh]);

  return (
    <div className="flex min-h-screen flex-col items-center justify-center bg-gradient-to-br from-green-100 via-white to-blue-100 p-6 text-center">
      <div className="w-full max-w-lg rounded-2xl bg-white p-8 shadow-xl">
        <div className={`mb-4 text-6xl ${status === "error" ? "text-rose-600" : "text-green-600"}`}>{status === "checking" ? "…" : status === "confirmed" ? "✓" : "!"}</div>
        <h1 className="mb-2 text-3xl font-bold">{status === "checking" ? "Confirming payment…" : status === "confirmed" ? "Payment Successful!" : "Payment verification pending"}</h1>
        <p className="mb-6 text-gray-600">{status === "checking" ? "Stripe is confirming your payment and booking." : status === "confirmed" ? "Thank you for your payment. Your booking has been confirmed." : error}</p>
        <Link to="/trips" className="inline-block rounded-lg bg-green-600 px-6 py-2 text-white transition hover:bg-green-700">{status === "confirmed" ? "View my trips" : "Back to trips"}</Link>
      </div>
    </div>
  );
};

export default SucceededPayment;
