import { useCallback, useEffect, useRef, useState } from "react";
import { CardElement, Elements, useElements, useStripe } from "@stripe/react-stripe-js";
import { loadStripe } from "@stripe/stripe-js";
import { motion } from "framer-motion";
import {
  ArrowDownLeft,
  ArrowUpRight,
  CheckCircle2,
  CreditCard,
  Gift,
  History,
  LoaderCircle,
  LockKeyhole,
  Mail,
  MessageSquareText,
  Sparkles,
  TicketCheck,
  WalletCards,
} from "lucide-react";
import { toast } from "sonner";
import {
  getErrorMessage,
  giftCardsService,
  type GiftCardSummary,
} from "../../services";
import { useAuth } from "../../lib/hooks";
import { useTranslation } from "react-i18next";

const stripePublicKey = import.meta.env.VITE_STRIPE_PUBLIC_KEY;
const stripePromise = stripePublicKey ? loadStripe(stripePublicKey) : null;
const amounts = [50, 100, 200];
const emptySummary: GiftCardSummary = {
  balance: 0,
  currency: "chf",
  transactions: [],
  purchases: [],
};

const money = (cents: number, locale: string) =>
  new Intl.NumberFormat(locale, { style: "currency", currency: "CHF" }).format(cents / 100);

interface PurchaseFormProps {
  onPurchased: (code: string) => Promise<void>;
  defaultName: string;
  defaultEmail: string;
}

const PurchaseForm = ({ onPurchased, defaultName, defaultEmail }: PurchaseFormProps) => {
  const { t } = useTranslation("commerce");
  const stripe = useStripe();
  const elements = useElements();
  const [amount, setAmount] = useState(100);
  const [customAmount, setCustomAmount] = useState("");
  const [recipientName, setRecipientName] = useState(defaultName);
  const [recipientEmail, setRecipientEmail] = useState(defaultEmail);
  const [message, setMessage] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const purchaseKey = useRef(crypto.randomUUID().replaceAll("-", ""));
  const selectedAmount = customAmount ? Number(customAmount) : amount;

  const submit = async (event: React.FormEvent) => {
    event.preventDefault();
    const card = elements?.getElement(CardElement);
    if (!stripe || !card || loading) return;
    if (selectedAmount < 25 || selectedAmount > 2000) {
      setError(t("gift.amountError"));
      return;
    }
    setLoading(true);
    setError("");
    try {
      const purchase = await giftCardsService.purchase({
        amount: selectedAmount,
        recipientName,
        recipientEmail,
        message,
        purchaseKey: purchaseKey.current,
      });
      if (!purchase.clientSecret) throw new Error(t("payment.sessionError"));
      const result = await stripe.confirmCardPayment(purchase.clientSecret, {
        payment_method: { card },
      });
      if (result.error) throw new Error(result.error.message ?? t("gift.paymentFailed"));
      if (result.paymentIntent?.status !== "succeeded") {
        throw new Error(t("gift.notConfirmed"));
      }
      const confirmed = await giftCardsService.confirm(purchase.data._id);
      await onPurchased(confirmed.code);
      purchaseKey.current = crypto.randomUUID().replaceAll("-", "");
      setMessage("");
      toast.success(t("gift.purchased"));
    } catch (cause) {
      setError(getErrorMessage(cause, t("gift.purchaseError")));
    } finally {
      setLoading(false);
    }
  };

  return (
    <form onSubmit={submit} className="space-y-5">
      <div>
        <label className="text-sm font-semibold text-slate-800">{t("gift.amount")}</label>
        <div className="mt-2 grid grid-cols-3 gap-2">
          {amounts.map((value) => (
            <button
              key={value}
              type="button"
              onClick={() => { setAmount(value); setCustomAmount(""); }}
              className={`rounded-2xl border px-3 py-3 text-sm font-bold transition ${
                !customAmount && amount === value
                  ? "border-emerald-600 bg-emerald-600 text-white shadow-md"
                  : "border-slate-200 bg-white text-slate-700 hover:border-emerald-300"
              }`}
            >
              {value} CHF
            </button>
          ))}
        </div>
        <input
          type="number"
          min="25"
          max="2000"
          step="1"
          value={customAmount}
          onChange={(event) => setCustomAmount(event.target.value)}
          placeholder={t("gift.custom")}
          className="mt-2 w-full rounded-2xl border border-slate-200 px-4 py-3 text-sm outline-none transition focus:border-emerald-500 focus:ring-4 focus:ring-emerald-50"
        />
      </div>

      <div className="grid gap-4 sm:grid-cols-2">
        <label className="text-sm font-semibold text-slate-800">
          {t("gift.recipient")}
          <input required maxLength={120} value={recipientName} onChange={(event) => setRecipientName(event.target.value)} className="mt-2 w-full rounded-2xl border border-slate-200 px-4 py-3 font-normal outline-none focus:border-emerald-500 focus:ring-4 focus:ring-emerald-50" />
        </label>
        <label className="text-sm font-semibold text-slate-800">
          {t("gift.email")}
          <span className="relative mt-2 block">
            <Mail className="absolute left-4 top-3.5 size-4 text-slate-400" />
            <input required type="email" value={recipientEmail} onChange={(event) => setRecipientEmail(event.target.value)} className="w-full rounded-2xl border border-slate-200 py-3 pl-11 pr-4 font-normal outline-none focus:border-emerald-500 focus:ring-4 focus:ring-emerald-50" />
          </span>
        </label>
      </div>
      <label className="text-sm font-semibold text-slate-800">
        {t("gift.message")} <span className="font-normal text-slate-400">{t("gift.optional")}</span>
        <span className="relative mt-2 block">
          <MessageSquareText className="absolute left-4 top-3.5 size-4 text-slate-400" />
          <textarea maxLength={500} rows={3} value={message} onChange={(event) => setMessage(event.target.value)} placeholder={t("gift.messagePlaceholder")} className="w-full resize-none rounded-2xl border border-slate-200 py-3 pl-11 pr-4 font-normal outline-none focus:border-emerald-500 focus:ring-4 focus:ring-emerald-50" />
        </span>
      </label>

      <div>
        <div className="mb-2 flex items-center justify-between text-sm font-semibold text-slate-800">
          <span className="flex items-center gap-2"><CreditCard className="size-4 text-emerald-700" /> {t("gift.card")}</span>
          <span className="flex items-center gap-1 text-[0.65rem] uppercase tracking-wider text-slate-400"><LockKeyhole className="size-3" /> {t("gift.stripeReady")}</span>
        </div>
        <div className="rounded-2xl border border-slate-200 bg-slate-50 px-4 py-4 focus-within:border-emerald-500 focus-within:ring-4 focus-within:ring-emerald-50">
          <CardElement options={{ style: { base: { color: "#0f172a", fontSize: "16px", "::placeholder": { color: "#94a3b8" } } } }} />
        </div>
      </div>
      {error && <p role="alert" className="rounded-xl bg-rose-50 px-4 py-3 text-sm font-medium text-rose-700">{error}</p>}
      <button disabled={!stripe || loading} className="flex w-full items-center justify-center gap-2 rounded-full bg-gradient-to-r from-rose-600 to-rose-500 px-5 py-3.5 text-sm font-bold text-white shadow-lg shadow-rose-500/20 transition hover:-translate-y-0.5 disabled:cursor-not-allowed disabled:opacity-50">
        {loading ? <><LoaderCircle className="size-4 animate-spin" /> {t("gift.processing")}</> : <><Gift className="size-4" /> {t("gift.buy", { amount: Number.isFinite(selectedAmount) ? selectedAmount : 0 })}</>}
      </button>
    </form>
  );
};

const GiftCards = () => {
  const { t, i18n } = useTranslation("commerce");
  const locale = i18n.resolvedLanguage ?? i18n.language;
  const { user, loading: authLoading } = useAuth();
  const [summary, setSummary] = useState<GiftCardSummary>(emptySummary);
  const [loading, setLoading] = useState(true);
  const [redeemCode, setRedeemCode] = useState("");
  const [redeeming, setRedeeming] = useState(false);
  const [newCode, setNewCode] = useState("");

  const refresh = useCallback(async () => {
    if (!user) return;
    try {
      setSummary(await giftCardsService.summary());
    } catch (cause) {
      toast.error(getErrorMessage(cause, t("gift.loadError")));
    } finally {
      setLoading(false);
    }
  }, [t, user]);

  useEffect(() => { void refresh(); }, [refresh]);

  const redeem = async (event: React.FormEvent) => {
    event.preventDefault();
    if (!redeemCode.trim() || redeeming) return;
    setRedeeming(true);
    try {
      const result = await giftCardsService.redeem(redeemCode);
      setRedeemCode("");
      await refresh();
      toast.success(t("gift.redeemed", { amount: money(result.amount, locale) }));
    } catch (cause) {
      toast.error(getErrorMessage(cause, t("gift.redeemError")));
    } finally {
      setRedeeming(false);
    }
  };

  if (authLoading) return <div className="grid min-h-[60vh] place-items-center"><LoaderCircle className="size-7 animate-spin text-emerald-600" /></div>;
  if (!user) {
    return (
      <main className="grid min-h-[70vh] place-items-center bg-slate-50 px-4">
        <div className="max-w-md rounded-[2rem] bg-white p-8 text-center shadow-xl ring-1 ring-slate-200">
          <Gift className="mx-auto size-12 text-rose-500" />
          <h1 className="mt-4 text-3xl font-semibold text-slate-950">{t("gift.title")}</h1>
          <p className="mt-3 text-sm leading-6 text-slate-500">{t("gift.login")}</p>
        </div>
      </main>
    );
  }

  return (
    <main className="min-h-screen bg-[#f7f9f8] pb-20">
      <section className="relative overflow-hidden bg-slate-950 px-4 py-16 text-white sm:px-6 sm:py-20">
        <div className="absolute -right-24 -top-28 size-96 rounded-full bg-rose-500/20 blur-3xl" />
        <div className="absolute -bottom-36 left-1/4 size-96 rounded-full bg-emerald-400/15 blur-3xl" />
        <motion.div initial={{ opacity: 0, y: 18 }} animate={{ opacity: 1, y: 0 }} className="relative mx-auto max-w-6xl">
          <span className="inline-flex items-center gap-2 rounded-full bg-white/10 px-3 py-1.5 text-xs font-bold uppercase tracking-[0.16em] text-emerald-300"><Sparkles className="size-3.5" /> {t("gift.badge")}</span>
          <div className="mt-6 grid items-end gap-8 lg:grid-cols-[1fr_auto]">
            <div><h1 className="max-w-3xl text-4xl font-semibold tracking-[-0.05em] sm:text-6xl">{t("gift.heroTitle")}</h1><p className="mt-4 max-w-xl text-sm leading-6 text-slate-300 sm:text-base">{t("gift.heroText")}</p></div>
            <div className="min-w-64 rounded-[1.75rem] bg-white/10 p-5 ring-1 ring-white/15 backdrop-blur">
              <p className="flex items-center gap-2 text-xs font-bold uppercase tracking-wider text-slate-300"><WalletCards className="size-4 text-emerald-300" /> {t("gift.balance")}</p>
              <p className="mt-2 text-4xl font-semibold tabular-nums">{loading ? "—" : money(summary.balance, locale)}</p>
              <p className="mt-2 text-xs text-slate-400">{t("gift.auto")}</p>
            </div>
          </div>
        </motion.div>
      </section>

      <div className="mx-auto grid max-w-6xl gap-8 px-4 py-10 sm:px-6 lg:grid-cols-[minmax(0,1.35fr)_minmax(20rem,.65fr)]">
        <section className="rounded-[2rem] border border-slate-200 bg-white p-5 shadow-sm sm:p-8">
          <div className="mb-7"><p className="text-xs font-bold uppercase tracking-[0.16em] text-emerald-700">{t("gift.buyGift")}</p><h2 className="mt-1 text-2xl font-semibold text-slate-950">{t("gift.create")}</h2></div>
          {stripePromise ? (
            <Elements stripe={stripePromise}>
              <PurchaseForm
                defaultName={user.name}
                defaultEmail={user.email}
                onPurchased={async (code) => { setNewCode(code); await refresh(); }}
              />
            </Elements>
          ) : <p role="alert" className="rounded-xl bg-rose-50 p-4 text-sm text-rose-700">{t("gift.notConfigured")}</p>}
          {newCode && (
            <div className="mt-6 rounded-2xl border border-emerald-200 bg-emerald-50 p-5">
              <p className="flex items-center gap-2 font-semibold text-emerald-900"><CheckCircle2 className="size-5" /> {t("gift.activated")}</p>
              <p className="mt-2 text-sm text-emerald-800">{t("gift.share")}</p>
              <button type="button" onClick={() => { void navigator.clipboard.writeText(newCode); toast.success(t("gift.copied")); }} className="mt-3 w-full rounded-xl bg-white px-4 py-3 font-mono text-sm font-bold tracking-wider text-slate-950 ring-1 ring-emerald-200">{newCode}</button>
            </div>
          )}
        </section>

        <aside className="space-y-6">
          <section className="rounded-[2rem] border border-slate-200 bg-white p-5 shadow-sm sm:p-6">
            <span className="grid size-11 place-items-center rounded-2xl bg-emerald-50 text-emerald-700"><TicketCheck className="size-5" /></span>
            <h2 className="mt-4 text-xl font-semibold text-slate-950">{t("gift.redeem")}</h2>
            <p className="mt-2 text-sm leading-6 text-slate-500">{t("gift.redeemText")}</p>
            <form onSubmit={redeem} className="mt-5 space-y-3">
              <input value={redeemCode} onChange={(event) => setRedeemCode(event.target.value.toUpperCase())} placeholder="FLY-XXXXX-XXXXX-XXXXX-XXXXX" className="w-full rounded-2xl border border-slate-200 px-4 py-3 font-mono text-sm uppercase outline-none focus:border-emerald-500 focus:ring-4 focus:ring-emerald-50" />
              <button disabled={redeeming || !redeemCode.trim()} className="flex w-full items-center justify-center gap-2 rounded-full bg-slate-950 px-5 py-3 text-sm font-bold text-white disabled:opacity-50">{redeeming && <LoaderCircle className="size-4 animate-spin" />} {t("gift.redeemButton")}</button>
            </form>
          </section>

          <section className="rounded-[2rem] border border-slate-200 bg-white p-5 shadow-sm sm:p-6">
            <h2 className="flex items-center gap-2 text-lg font-semibold text-slate-950"><History className="size-5 text-emerald-700" /> {t("gift.activity")}</h2>
            <div className="mt-4 space-y-3">
              {!loading && summary.transactions.length === 0 && <p className="rounded-xl bg-slate-50 p-4 text-sm text-slate-500">{t("gift.noActivity")}</p>}
              {summary.transactions.slice(0, 6).map((transaction) => (
                <div key={transaction._id} className="flex items-center gap-3 border-b border-slate-100 pb-3 last:border-0 last:pb-0">
                  <span className={`grid size-9 shrink-0 place-items-center rounded-full ${transaction.amount > 0 ? "bg-emerald-50 text-emerald-700" : "bg-rose-50 text-rose-600"}`}>{transaction.amount > 0 ? <ArrowDownLeft className="size-4" /> : <ArrowUpRight className="size-4" />}</span>
                  <div className="min-w-0 flex-1"><p className="truncate text-xs font-semibold text-slate-800">{transaction.description}</p><p className="mt-0.5 text-[0.68rem] text-slate-400">{new Date(transaction.createdAt).toLocaleDateString(locale)}</p></div>
                  <span className={`text-sm font-bold tabular-nums ${transaction.amount > 0 ? "text-emerald-700" : "text-slate-800"}`}>{transaction.amount > 0 ? "+" : ""}{money(transaction.amount, locale)}</span>
                </div>
              ))}
            </div>
          </section>
        </aside>
      </div>
    </main>
  );
};

export default GiftCards;
