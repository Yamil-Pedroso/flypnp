import { useLocation, useNavigate } from "react-router-dom";
import {
  ArrowLeft,
  CalendarDays,
  Check,
  LockKeyhole,
  PawPrint,
  ShieldCheck,
  Sparkles,
  Star,
  Users,
} from "lucide-react";
import { FaCcMastercard, FaCcVisa, FaGooglePay, FaPaypal } from "react-icons/fa";
import { GrAmex } from "react-icons/gr";
import TestStripePayment from "./TestStripePayment";

const formatDate = (value: string | null) => {
  if (!value) return "Not selected";
  const date = new Date(`${value}T00:00:00`);
  if (Number.isNaN(date.getTime())) return value;
  return new Intl.DateTimeFormat("en", { month: "short", day: "numeric", year: "numeric" }).format(date);
};

const MyPayment = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const query = new URLSearchParams(location.search);
  const checkIn = query.get("checkIn");
  const checkOut = query.get("checkOut");
  const guests = Number(query.get("guests") || 0);
  const infants = Number(query.get("infants") || 0);
  const pets = Number(query.get("pets") || 0);
  const price = Number(query.get("price") || 0);
  const photo = query.get("photo") || "";
  const title = query.get("title") || "Your Flypnp stay";
  const description = query.get("description") || "A memorable stay is waiting for you.";
  const rating = query.get("rating");
  const startTime = query.get("startTime");
  const isExperience = query.get("productType") === "experience";
  const isService = query.get("productType") === "service";
  const productLabel = isService ? "service" : isExperience ? "experience" : "trip";
  const serviceFee = price * 0.1;
  const total = price + serviceFee;
  const guestSummary = [
    `${guests} guest${guests === 1 ? "" : "s"}`,
    infants ? `${infants} infant${infants === 1 ? "" : "s"}` : "",
    pets ? `${pets} pet${pets === 1 ? "" : "s"}` : "",
  ].filter(Boolean).join(", ");

  return (
    <main className="min-h-screen bg-[#f7f9f8] pb-16">
      <div className="mx-auto w-full max-w-6xl px-4 py-6 sm:px-6 sm:py-10 lg:px-8">
        <header className="mb-8 flex items-center justify-between gap-4">
          <button type="button" onClick={() => navigate(-1)} className="group inline-flex items-center gap-2 rounded-full border border-slate-200 bg-white px-4 py-2.5 text-sm font-semibold text-slate-700 shadow-sm transition hover:-translate-y-0.5 hover:text-slate-950 hover:shadow-md">
            <ArrowLeft className="size-4 transition group-hover:-translate-x-0.5" /> Back
          </button>
          <div className="inline-flex items-center gap-2 rounded-full bg-emerald-50 px-3.5 py-2 text-xs font-bold text-emerald-800 ring-1 ring-emerald-100">
            <LockKeyhole className="size-3.5" /> Secure checkout
          </div>
        </header>

        <div className="mb-9 max-w-2xl">
          <span className="inline-flex items-center gap-2 text-xs font-bold uppercase tracking-[0.2em] text-emerald-700"><Sparkles className="size-4" /> Almost there</span>
          <h1 className="mt-3 text-3xl font-semibold tracking-[-0.04em] text-slate-950 sm:text-5xl">Confirm and pay</h1>
          <p className="mt-3 max-w-xl text-sm leading-6 text-slate-600 sm:text-base">Review the details, enter your card securely and get ready for your next story.</p>
        </div>

        <div className="grid items-start gap-8 lg:grid-cols-[minmax(0,1fr)_25rem] lg:gap-12">
          <section className="min-w-0 space-y-7">
            <div className="rounded-[1.75rem] border border-slate-200 bg-white p-5 shadow-sm sm:p-7">
              <div className="flex items-center justify-between gap-4">
                <div><p className="text-xs font-bold uppercase tracking-[0.16em] text-emerald-700">Step 1</p><h2 className="mt-1 text-xl font-semibold text-slate-950">Your {productLabel}</h2></div>
                <span className="grid size-9 place-items-center rounded-full bg-emerald-50 text-emerald-700"><Check className="size-4" /></span>
              </div>

              <div className="mt-6 grid gap-3 sm:grid-cols-2">
                <article className="rounded-2xl border border-slate-200 bg-slate-50/70 p-4">
                  <div className="flex items-start gap-3"><span className="grid size-10 shrink-0 place-items-center rounded-xl bg-white text-emerald-700 shadow-sm"><CalendarDays className="size-5" /></span><div><p className="text-xs font-bold uppercase tracking-[0.12em] text-slate-400">{isExperience || isService ? "Date & time" : "Dates"}</p><p className="mt-1 text-sm font-semibold text-slate-950">{formatDate(checkIn)}</p><p className="mt-0.5 text-xs text-slate-500">{isExperience || isService ? `Starts at ${startTime ?? "selected time"}` : `to ${formatDate(checkOut)}`}</p></div></div>
                  <button type="button" onClick={() => navigate(-1)} className="mt-4 text-xs font-bold text-rose-600 underline decoration-rose-200 underline-offset-4">Edit {isExperience || isService ? "selection" : "dates"}</button>
                </article>
                <article className="rounded-2xl border border-slate-200 bg-slate-50/70 p-4">
                  <div className="flex items-start gap-3"><span className="grid size-10 shrink-0 place-items-center rounded-xl bg-white text-emerald-700 shadow-sm"><Users className="size-5" /></span><div><p className="text-xs font-bold uppercase tracking-[0.12em] text-slate-400">Travelers</p><p className="mt-1 text-sm font-semibold text-slate-950">{guestSummary}</p>{pets > 0 && <p className="mt-0.5 flex items-center gap-1 text-xs text-slate-500"><PawPrint className="size-3" /> Pet-friendly trip</p>}</div></div>
                  <button type="button" onClick={() => navigate(-1)} className="mt-4 text-xs font-bold text-rose-600 underline decoration-rose-200 underline-offset-4">Edit guests</button>
                </article>
              </div>
            </div>

            <div className="rounded-[1.75rem] border border-slate-200 bg-white p-5 shadow-sm sm:p-7">
              <div className="flex flex-wrap items-center justify-between gap-4">
                <div><p className="text-xs font-bold uppercase tracking-[0.16em] text-emerald-700">Step 2</p><h2 className="mt-1 text-xl font-semibold text-slate-950">Pay with</h2></div>
                <div className="flex items-center gap-2 text-slate-500" aria-label="Accepted payment methods"><FaCcVisa size={24} /><FaCcMastercard size={24} /><GrAmex size={28} /><FaPaypal size={22} /><FaGooglePay size={30} /></div>
              </div>
              <div className="mt-6"><TestStripePayment /></div>
            </div>

            <div className="flex items-start gap-3 rounded-2xl bg-slate-950 p-5 text-white">
              <ShieldCheck className="mt-0.5 size-5 shrink-0 text-emerald-300" />
              <div><p className="text-sm font-semibold">Protected payment</p><p className="mt-1 text-xs leading-5 text-slate-400">Your card details are encrypted and handled securely by Stripe. Flypnp never stores your card number.</p></div>
            </div>
          </section>

          <aside className="order-first lg:order-none">
            <div className="overflow-hidden rounded-[1.75rem] border border-slate-200 bg-white shadow-[0_28px_70px_-40px_rgba(15,23,42,0.55)] lg:sticky lg:top-32">
              <div className="relative h-52 overflow-hidden sm:h-64 lg:h-52">
                {photo ? <img src={photo} alt={title} className="size-full object-cover" /> : <div className="size-full bg-gradient-to-br from-emerald-100 to-slate-200" />}
                <div className="absolute inset-0 bg-gradient-to-t from-slate-950/70 via-transparent to-transparent" />
                {rating && <span className="absolute bottom-4 left-4 inline-flex items-center gap-1.5 rounded-full bg-white/95 px-3 py-1.5 text-xs font-bold text-slate-950 shadow-lg backdrop-blur"><Star className="size-3.5 fill-amber-400 text-amber-400" /> {rating}</span>}
              </div>
              <div className="p-5 sm:p-6">
                <p className="text-xs font-bold uppercase tracking-[0.16em] text-emerald-700">Your {isService ? "service" : isExperience ? "experience" : "stay"}</p>
                <h2 className="mt-2 text-xl font-semibold tracking-tight text-slate-950">{title}</h2>
                <p className="mt-2 line-clamp-2 text-sm leading-6 text-slate-500">{description}</p>

                <div className="mt-6 space-y-3 border-t border-slate-200 pt-5 text-sm">
                  <div className="flex justify-between gap-4 text-slate-600"><span>{isService ? "Quoted price" : isExperience ? "Experience price" : "Stay price"}</span><span className="font-medium tabular-nums text-slate-900">{price.toFixed(2)} CHF</span></div>
                  <div className="flex justify-between gap-4 text-slate-600"><span className="underline decoration-slate-300 underline-offset-4">Service fee</span><span className="font-medium tabular-nums text-slate-900">{serviceFee.toFixed(2)} CHF</span></div>
                  <div className="flex justify-between gap-4 border-t border-slate-200 pt-4 text-base font-semibold text-slate-950"><span>Total</span><span className="tabular-nums">{total.toFixed(2)} CHF</span></div>
                </div>
                <p className="mt-4 flex items-center gap-2 text-xs text-slate-500"><LockKeyhole className="size-3.5" /> You won't be charged until you confirm.</p>
              </div>
            </div>
          </aside>
        </div>
      </div>
    </main>
  );
};

export default MyPayment;
