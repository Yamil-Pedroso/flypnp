import { Home, ShieldCheck, Sparkles } from "lucide-react";
import CreatePlaceButton from "./CreatePlaceButton";

const HostHero = ({ firstName }: { firstName: string }) => (
  <section className="relative isolate overflow-hidden rounded-[2rem] bg-slate-950 px-6 py-10 text-white shadow-xl shadow-slate-950/10 sm:px-10 sm:py-14 lg:px-14">
    <div className="absolute -right-24 -top-32 size-[28rem] rounded-full bg-emerald-400/20 blur-3xl" />
    <div className="absolute -bottom-32 left-1/3 size-80 rounded-full bg-rose-500/15 blur-3xl" />
    <div className="absolute right-[9%] top-1/2 hidden size-40 -translate-y-1/2 rotate-6 place-items-center rounded-[2.5rem] border border-white/10 bg-white/5 text-emerald-300 backdrop-blur lg:grid">
      <Home className="size-20" strokeWidth={1.4} />
    </div>
    <div className="relative max-w-3xl">
      <span className="inline-flex items-center gap-2 rounded-full bg-white/10 px-3 py-1.5 text-xs font-black uppercase tracking-[0.18em] text-emerald-300 ring-1 ring-white/10">
        <Sparkles className="size-3.5" /> Host on Flypnp
      </span>
      <h1 className="mt-5 text-4xl font-semibold leading-[1.04] tracking-[-0.045em] sm:text-6xl">
        Welcome, {firstName}.<br />Make every stay feel personal.
      </h1>
      <p className="mt-5 max-w-2xl text-base leading-7 text-slate-300 sm:text-lg">
        Publish thoughtful spaces, follow incoming reservations and keep your hosting work in one calm place.
      </p>
      <div className="mt-7 flex flex-wrap items-center gap-4">
        <CreatePlaceButton />
        <span className="inline-flex items-center gap-2 text-sm text-slate-300"><ShieldCheck className="size-4 text-emerald-300" /> You control every listing</span>
      </div>
    </div>
  </section>
);

export default HostHero;
