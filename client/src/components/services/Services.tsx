import { useCallback, useEffect, useMemo, useState, type FormEvent } from "react";
import {
  ArrowRight,
  BadgeCheck,
  CalendarDays,
  Check,
  ChevronRight,
  Clock3,
  CreditCard,
  LoaderCircle,
  MapPin,
  RefreshCw,
  ShieldCheck,
  Sparkles,
  Trash2,
  UserRoundCheck,
  Users,
} from "lucide-react";
import { toast } from "sonner";
import { Link, useLocation } from "react-router-dom";
import { getErrorMessage, travelServicesService, type ServiceRequest, type ServiceRequestInput, type TravelServiceType } from "../../services";
import { useAuth } from "../../lib/hooks";
import { CONTACT_GMAIL_COMPOSE_URL } from "../../config/contact";
import { getServicePaymentPath } from "../../lib/payment";
import ServiceIcon from "./ServiceIcon";

const serviceCatalog = [
  {
    id: "airport-transfer" as const,
    eyebrow: "Arrive with ease",
    name: "Airport Transfer",
    shortName: "Transfer",
    description: "A trusted local driver meets you at the airport and takes you directly to your stay.",
    price: "From CHF 45",
    accent: "bg-sky-400",
    soft: "bg-sky-50 text-sky-700",
    glow: "bg-sky-400/20",
    features: ["Flight-aware pickup", "Meet & greet", "Room for your luggage"],
  },
  {
    id: "pet-care" as const,
    eyebrow: "Care while you explore",
    name: "Pet Care",
    shortName: "Pet care",
    description: "Verified local carers look after your companion at your stay or nearby while you enjoy the city.",
    price: "From CHF 30 / hour",
    accent: "bg-amber-300",
    soft: "bg-amber-50 text-amber-800",
    glow: "bg-amber-300/20",
    features: ["Trusted local carers", "Dogs, cats & small pets", "Updates during every visit"],
  },
  {
    id: "local-guide" as const,
    eyebrow: "See it like a local",
    name: "Local Guide",
    shortName: "Local guide",
    description: "Book a private local who shapes the route around your pace, language and interests.",
    price: "From CHF 70",
    accent: "bg-emerald-400",
    soft: "bg-emerald-50 text-emerald-800",
    glow: "bg-emerald-400/20",
    features: ["Private tailored route", "Your preferred language", "Flexible meeting point"],
  },
] as const;

const labels: Record<TravelServiceType, string> = {
  "airport-transfer": "Airport Transfer",
  "pet-care": "Pet Care",
  "local-guide": "Local Guide",
};

const today = () => {
  const date = new Date();
  date.setMinutes(date.getMinutes() - date.getTimezoneOffset());
  return date.toISOString().slice(0, 10);
};

const emptyForm = (serviceType: TravelServiceType): ServiceRequestInput => ({
  serviceType,
  destination: "",
  date: "",
  time: "",
  participants: 1,
  notes: "",
  details: serviceType === "pet-care"
    ? { petType: "Dog", petCount: 1 }
    : serviceType === "local-guide"
      ? { language: "English", interests: "" }
      : { pickup: "", dropoff: "", flightNumber: "" },
});

const Services = () => {
  const { user } = useAuth();
  const location = useLocation();
  const [selected, setSelected] = useState<TravelServiceType>("airport-transfer");
  const [form, setForm] = useState<ServiceRequestInput>(() => emptyForm("airport-transfer"));
  const [requests, setRequests] = useState<ServiceRequest[]>([]);
  const [loadingRequests, setLoadingRequests] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [cancellingId, setCancellingId] = useState<string | null>(null);

  const selectedService = useMemo(
    () => serviceCatalog.find((service) => service.id === selected) ?? serviceCatalog[0],
    [selected],
  );

  useEffect(() => {
    const requestedService = location.hash.slice(1) as TravelServiceType;
    if (!serviceCatalog.some((service) => service.id === requestedService)) return;
    setSelected(requestedService);
    setForm(emptyForm(requestedService));
  }, [location.hash]);

  const loadUserRequests = useCallback(async () => {
    if (!user) {
      setRequests([]);
      setLoadingRequests(false);
      return;
    }
    try {
      setLoadingRequests(true);
      setRequests(await travelServicesService.listRequests());
    } catch (cause) {
      toast.error(getErrorMessage(cause, "Could not load your service requests"));
    } finally {
      setLoadingRequests(false);
    }
  }, [user]);

  useEffect(() => { void loadUserRequests(); }, [loadUserRequests]);

  const chooseService = (serviceType: TravelServiceType, scroll = false) => {
    setSelected(serviceType);
    setForm(emptyForm(serviceType));
    if (scroll) {
      window.setTimeout(() => {
        const requestSection = document.querySelector<HTMLElement>("#request-service");
        requestSection?.scrollIntoView?.({ behavior: "smooth", block: "start" });
      }, 0);
    }
  };

  const setDetail = (key: string, value: string | number) => {
    setForm((current) => ({ ...current, details: { ...current.details, [key]: value } }));
  };

  const submitRequest = async (event: FormEvent) => {
    event.preventDefault();
    if (!user) {
      toast.error("Log in from the user menu to request a service.");
      return;
    }
    try {
      setSubmitting(true);
      const created = await travelServicesService.createRequest(form);
      setRequests((current) => [...current, created].sort((a, b) => a.date.localeCompare(b.date)));
      setForm(emptyForm(selected));
      toast.success(`${labels[selected]} requested. We’ll confirm availability soon.`);
    } catch (cause) {
      toast.error(getErrorMessage(cause, "Could not send your request"));
    } finally {
      setSubmitting(false);
    }
  };

  const cancelRequest = async (request: ServiceRequest) => {
    try {
      setCancellingId(request._id);
      await travelServicesService.cancelRequest(request._id);
      setRequests((current) => current.filter((item) => item._id !== request._id));
      toast.success("Service request cancelled");
    } catch (cause) {
      toast.error(getErrorMessage(cause, "Could not cancel the request"));
    } finally {
      setCancellingId(null);
    }
  };

  return (
    <main className="min-h-screen bg-[#f7f9f7]">
      <section className="mx-auto max-w-7xl px-4 pt-7 sm:px-6 sm:pt-10 lg:px-8">
        <div className="relative isolate overflow-hidden rounded-[2rem] bg-slate-950 px-6 py-12 text-white sm:px-10 sm:py-16 lg:px-14 lg:py-20">
          <div className="absolute -right-20 -top-36 size-[30rem] rounded-full bg-emerald-400/20 blur-3xl" />
          <div className="absolute -bottom-44 left-[28%] size-96 rounded-full bg-sky-400/15 blur-3xl" />
          <div className="absolute right-10 top-10 hidden gap-3 lg:flex">
            {(["airport-transfer", "pet-care", "local-guide"] as const).map((serviceType) => (
              <span key={serviceType} className="grid size-16 rotate-3 place-items-center rounded-2xl border border-white/10 bg-white/5 text-emerald-300 backdrop-blur">
                <ServiceIcon serviceType={serviceType} className="size-9" />
              </span>
            ))}
          </div>
          <div className="relative max-w-3xl">
            <span className="inline-flex items-center gap-2 rounded-full bg-white/10 px-3.5 py-2 text-xs font-black uppercase tracking-[0.18em] text-emerald-300 ring-1 ring-white/10">
              <Sparkles className="size-3.5" /> Travel, looked after
            </span>
            <h1 className="mt-6 text-4xl font-semibold leading-[1.02] tracking-[-0.045em] sm:text-6xl">The thoughtful extras<br />that make a trip flow.</h1>
            <p className="mt-5 max-w-2xl text-base leading-7 text-slate-300 sm:text-lg">From the airport to your front door, trusted pet care and a city seen through local eyes.</p>
            <a href="#services" className="mt-8 inline-flex items-center gap-2 rounded-full bg-emerald-400 px-6 py-3.5 text-sm font-black text-slate-950 transition hover:-translate-y-0.5 hover:bg-emerald-300">
              Explore services <ArrowRight className="size-4" />
            </a>
          </div>
        </div>
      </section>

      <section id="services" className="scroll-mt-32 mx-auto max-w-7xl px-4 py-16 sm:px-6 sm:py-20 lg:px-8">
        <div className="max-w-2xl">
          <p className="text-xs font-black uppercase tracking-[0.18em] text-emerald-700">Three ways we can help</p>
          <h2 className="mt-3 text-3xl font-semibold tracking-tight text-slate-950 sm:text-4xl">Choose what your trip needs.</h2>
          <p className="mt-3 leading-7 text-slate-500">Every request is reviewed by a local partner before it is confirmed.</p>
        </div>

        <div className="mt-8 grid gap-5 lg:grid-cols-3">
          {serviceCatalog.map((service) => {
            return (
              <article key={service.id} id={service.id} className="group relative flex scroll-mt-36 flex-col overflow-hidden rounded-[1.75rem] border border-slate-200 bg-white p-6 shadow-sm transition hover:-translate-y-1 hover:shadow-xl hover:shadow-slate-900/5 sm:p-7">
                <div className={`absolute -right-16 -top-20 size-52 rounded-full ${service.glow} blur-3xl transition group-hover:scale-125`} />
                <div className="relative">
                  <span className={`grid size-14 place-items-center rounded-2xl ${service.accent} text-slate-950 shadow-sm`}><ServiceIcon serviceType={service.id} className="size-9" /></span>
                  <p className="mt-6 text-xs font-black uppercase tracking-[0.16em] text-slate-400">{service.eyebrow}</p>
                  <h3 className="mt-2 text-2xl font-semibold text-slate-950">{service.name}</h3>
                  <p className="mt-3 min-h-20 text-sm leading-6 text-slate-500">{service.description}</p>
                  <ul className="mt-5 space-y-2.5 text-sm text-slate-700">
                    {service.features.map((feature) => <li key={feature} className="flex items-center gap-2"><Check className="size-4 text-emerald-600" />{feature}</li>)}
                  </ul>
                </div>
                <div className="relative mt-7 flex items-center justify-between gap-4 border-t border-slate-100 pt-5">
                  <span className="text-sm font-bold text-slate-950">{service.price}</span>
                  <button type="button" onClick={() => chooseService(service.id, true)} className="inline-flex items-center gap-1.5 rounded-full bg-slate-950 px-4 py-2.5 text-xs font-bold text-white transition hover:bg-emerald-700">
                    Request <ChevronRight className="size-3.5" />
                  </button>
                </div>
              </article>
            );
          })}
        </div>
      </section>

      <section id="request-service" className="scroll-mt-24 bg-white py-16 sm:py-20">
        <div className="mx-auto grid max-w-7xl gap-10 px-4 sm:px-6 lg:grid-cols-[0.78fr_1.22fr] lg:items-start lg:px-8">
          <div className="lg:sticky lg:top-36">
            <div className={`w-fit rounded-2xl p-3.5 ${selectedService.soft}`}><ServiceIcon serviceType={selectedService.id} className="size-9" /></div>
            <p className="mt-6 text-xs font-black uppercase tracking-[0.18em] text-emerald-700">Request to book</p>
            <h2 className="mt-2 text-3xl font-semibold tracking-tight text-slate-950 sm:text-4xl">{selectedService.name}</h2>
            <p className="mt-4 max-w-md leading-7 text-slate-500">{selectedService.description}</p>
            <div className="mt-7 space-y-4">
              <div className="flex gap-3"><ShieldCheck className="mt-0.5 size-5 shrink-0 text-emerald-600" /><div><p className="text-sm font-semibold text-slate-950">Trusted local partners</p><p className="mt-1 text-xs leading-5 text-slate-500">Every provider is reviewed before joining Flypnp.</p></div></div>
              <div className="flex gap-3"><BadgeCheck className="mt-0.5 size-5 shrink-0 text-emerald-600" /><div><p className="text-sm font-semibold text-slate-950">No charge today</p><p className="mt-1 text-xs leading-5 text-slate-500">We confirm availability and the final price first.</p></div></div>
            </div>
          </div>

          <div className="overflow-hidden rounded-[2rem] border border-slate-200 bg-[#f8faf8] shadow-xl shadow-slate-900/5">
            <div className="flex gap-2 overflow-x-auto border-b border-slate-200 bg-white p-3 sm:p-4">
              {serviceCatalog.map((service) => {
                return <button key={service.id} type="button" onClick={() => chooseService(service.id)} className={`inline-flex shrink-0 items-center gap-2 rounded-full px-4 py-2.5 text-xs font-bold transition ${selected === service.id ? "bg-slate-950 text-white" : "text-slate-500 hover:bg-slate-100 hover:text-slate-900"}`}><ServiceIcon serviceType={service.id} className="size-5" />{service.shortName}</button>;
              })}
            </div>

            <form onSubmit={submitRequest} className="grid gap-5 p-5 sm:grid-cols-2 sm:p-7 lg:p-8">
              <label className="grid gap-2 text-sm font-semibold text-slate-800 sm:col-span-2">
                Destination
                <span className="relative"><MapPin className="absolute left-4 top-1/2 size-4 -translate-y-1/2 text-slate-400" /><input required value={form.destination} onChange={(event) => setForm((current) => ({ ...current, destination: event.target.value }))} placeholder="City, neighborhood or accommodation" className="w-full rounded-2xl border border-slate-200 bg-white py-3.5 pl-11 pr-4 font-normal outline-none transition focus:border-emerald-500 focus:ring-4 focus:ring-emerald-100" /></span>
              </label>
              <label className="grid gap-2 text-sm font-semibold text-slate-800">
                Date
                <span className="relative"><CalendarDays className="pointer-events-none absolute left-4 top-1/2 size-4 -translate-y-1/2 text-slate-400" /><input required type="date" min={today()} value={form.date} onChange={(event) => setForm((current) => ({ ...current, date: event.target.value }))} className="w-full rounded-2xl border border-slate-200 bg-white py-3.5 pl-11 pr-4 font-normal outline-none transition focus:border-emerald-500 focus:ring-4 focus:ring-emerald-100" /></span>
              </label>
              <label className="grid gap-2 text-sm font-semibold text-slate-800">
                Preferred time
                <span className="relative"><Clock3 className="pointer-events-none absolute left-4 top-1/2 size-4 -translate-y-1/2 text-slate-400" /><input required type="time" value={form.time} onChange={(event) => setForm((current) => ({ ...current, time: event.target.value }))} className="w-full rounded-2xl border border-slate-200 bg-white py-3.5 pl-11 pr-4 font-normal outline-none transition focus:border-emerald-500 focus:ring-4 focus:ring-emerald-100" /></span>
              </label>

              {selected === "airport-transfer" && (
                <>
                  <label className="grid gap-2 text-sm font-semibold text-slate-800"><span>Pickup point</span><input required value={form.details.pickup ?? ""} onChange={(event) => setDetail("pickup", event.target.value)} placeholder="Zurich Airport, Terminal 2" className="rounded-2xl border border-slate-200 bg-white px-4 py-3.5 font-normal outline-none transition focus:border-sky-500 focus:ring-4 focus:ring-sky-100" /></label>
                  <label className="grid gap-2 text-sm font-semibold text-slate-800"><span>Drop-off point</span><input required value={form.details.dropoff ?? ""} onChange={(event) => setDetail("dropoff", event.target.value)} placeholder="Your stay or address" className="rounded-2xl border border-slate-200 bg-white px-4 py-3.5 font-normal outline-none transition focus:border-sky-500 focus:ring-4 focus:ring-sky-100" /></label>
                  <label className="grid gap-2 text-sm font-semibold text-slate-800"><span>Passengers</span><input required type="number" min={1} max={20} value={form.participants} onChange={(event) => setForm((current) => ({ ...current, participants: Number(event.target.value) }))} className="rounded-2xl border border-slate-200 bg-white px-4 py-3.5 font-normal outline-none transition focus:border-sky-500 focus:ring-4 focus:ring-sky-100" /></label>
                  <label className="grid gap-2 text-sm font-semibold text-slate-800"><span>Flight number <span className="font-normal text-slate-400">(optional)</span></span><input value={form.details.flightNumber ?? ""} onChange={(event) => setDetail("flightNumber", event.target.value)} placeholder="LX 1234" className="rounded-2xl border border-slate-200 bg-white px-4 py-3.5 font-normal uppercase outline-none transition focus:border-sky-500 focus:ring-4 focus:ring-sky-100" /></label>
                </>
              )}

              {selected === "pet-care" && (
                <>
                  <label className="grid gap-2 text-sm font-semibold text-slate-800"><span>Pet type</span><select value={form.details.petType ?? "Dog"} onChange={(event) => setDetail("petType", event.target.value)} className="rounded-2xl border border-slate-200 bg-white px-4 py-3.5 font-normal outline-none transition focus:border-amber-500 focus:ring-4 focus:ring-amber-100"><option>Dog</option><option>Cat</option><option>Small pet</option><option>Other</option></select></label>
                  <label className="grid gap-2 text-sm font-semibold text-slate-800"><span>Number of pets</span><input required type="number" min={1} max={10} value={form.details.petCount ?? 1} onChange={(event) => setDetail("petCount", Number(event.target.value))} className="rounded-2xl border border-slate-200 bg-white px-4 py-3.5 font-normal outline-none transition focus:border-amber-500 focus:ring-4 focus:ring-amber-100" /></label>
                  <label className="grid gap-2 text-sm font-semibold text-slate-800 sm:col-span-2"><span>People in your party</span><input required type="number" min={1} max={20} value={form.participants} onChange={(event) => setForm((current) => ({ ...current, participants: Number(event.target.value) }))} className="rounded-2xl border border-slate-200 bg-white px-4 py-3.5 font-normal outline-none transition focus:border-amber-500 focus:ring-4 focus:ring-amber-100" /></label>
                </>
              )}

              {selected === "local-guide" && (
                <>
                  <label className="grid gap-2 text-sm font-semibold text-slate-800"><span>Group size</span><input required type="number" min={1} max={20} value={form.participants} onChange={(event) => setForm((current) => ({ ...current, participants: Number(event.target.value) }))} className="rounded-2xl border border-slate-200 bg-white px-4 py-3.5 font-normal outline-none transition focus:border-emerald-500 focus:ring-4 focus:ring-emerald-100" /></label>
                  <label className="grid gap-2 text-sm font-semibold text-slate-800"><span>Preferred language</span><select value={form.details.language ?? "English"} onChange={(event) => setDetail("language", event.target.value)} className="rounded-2xl border border-slate-200 bg-white px-4 py-3.5 font-normal outline-none transition focus:border-emerald-500 focus:ring-4 focus:ring-emerald-100"><option>English</option><option>German</option><option>French</option><option>Italian</option><option>Spanish</option></select></label>
                  <label className="grid gap-2 text-sm font-semibold text-slate-800 sm:col-span-2"><span>What would you love to discover?</span><input value={form.details.interests ?? ""} onChange={(event) => setDetail("interests", event.target.value)} placeholder="Food, architecture, photography, hidden places…" className="rounded-2xl border border-slate-200 bg-white px-4 py-3.5 font-normal outline-none transition focus:border-emerald-500 focus:ring-4 focus:ring-emerald-100" /></label>
                </>
              )}

              <label className="grid gap-2 text-sm font-semibold text-slate-800 sm:col-span-2">
                Anything else we should know? <span className="font-normal text-slate-400">(optional)</span>
                <textarea value={form.notes ?? ""} onChange={(event) => setForm((current) => ({ ...current, notes: event.target.value }))} maxLength={1000} rows={4} placeholder="Accessibility needs, luggage, pet routine or any special request…" className="resize-none rounded-2xl border border-slate-200 bg-white px-4 py-3.5 font-normal leading-6 outline-none transition focus:border-emerald-500 focus:ring-4 focus:ring-emerald-100" />
              </label>
              <div className="flex flex-col gap-3 border-t border-slate-200 pt-5 sm:col-span-2 sm:flex-row sm:items-center sm:justify-between">
                <p className="text-xs leading-5 text-slate-500">{user ? `Requesting as ${user.name}` : "Log in from the user menu before sending your request."}</p>
                <button type="submit" disabled={submitting} className="inline-flex items-center justify-center gap-2 rounded-full bg-rose-500 px-7 py-3.5 text-sm font-black text-white shadow-lg shadow-rose-500/20 transition hover:-translate-y-0.5 hover:bg-rose-600 disabled:cursor-not-allowed disabled:opacity-60">
                  {submitting ? <><LoaderCircle className="size-4 animate-spin" />Sending…</> : <>Request to book <ArrowRight className="size-4" /></>}
                </button>
              </div>
            </form>
          </div>
        </div>
      </section>

      {user && (
        <section className="mx-auto max-w-7xl px-4 py-16 sm:px-6 sm:py-20 lg:px-8">
          <div className="flex items-end justify-between gap-4">
            <div><p className="text-xs font-black uppercase tracking-[0.18em] text-emerald-700">Your arrangements</p><h2 className="mt-2 text-3xl font-semibold tracking-tight text-slate-950">Service requests</h2></div>
            <button type="button" onClick={() => void loadUserRequests()} disabled={loadingRequests} className="inline-flex items-center gap-2 rounded-full bg-white px-4 py-2.5 text-xs font-bold text-slate-500 ring-1 ring-slate-200 transition hover:text-emerald-700 disabled:opacity-50"><RefreshCw className={`size-3.5 ${loadingRequests ? "animate-spin" : ""}`} />Refresh · {requests.length}</button>
          </div>
          {loadingRequests ? (
            <div className="mt-7 flex min-h-36 items-center justify-center rounded-[1.75rem] border border-slate-200 bg-white"><LoaderCircle className="size-6 animate-spin text-emerald-600" /></div>
          ) : requests.length === 0 ? (
            <div className="mt-7 rounded-[1.75rem] border border-dashed border-slate-300 bg-white px-6 py-12 text-center"><UserRoundCheck className="mx-auto size-9 text-emerald-600" /><h3 className="mt-4 text-xl font-semibold text-slate-950">Nothing to coordinate yet</h3><p className="mt-2 text-sm text-slate-500">Your service requests will appear here.</p></div>
          ) : (
            <div className="mt-7 grid gap-4 lg:grid-cols-2">
              {requests.map((request) => {
                const service = serviceCatalog.find((item) => item.id === request.serviceType) ?? serviceCatalog[0];
                const statusStyle = {
                  requested: "bg-amber-50 text-amber-700",
                  quoted: "bg-sky-50 text-sky-700",
                  confirmed: "bg-emerald-50 text-emerald-700",
                  cancelled: "bg-rose-50 text-rose-700",
                }[request.status];
                return (
                  <article key={request._id} className="rounded-[1.5rem] border border-slate-200 bg-white p-5 shadow-sm">
                    <div className="flex gap-4 sm:items-center">
                      <span className={`grid size-12 shrink-0 place-items-center rounded-2xl ${service.soft}`}><ServiceIcon serviceType={request.serviceType} className="size-7" /></span>
                      <div className="min-w-0 flex-1">
                        <div className="flex flex-wrap items-center gap-2"><h3 className="font-semibold text-slate-950">{labels[request.serviceType]}</h3><span className={`rounded-full px-2.5 py-1 text-[0.65rem] font-black uppercase tracking-wider ${statusStyle}`}>{request.status}</span></div>
                        <p className="mt-1 truncate text-sm text-slate-500">{request.destination}</p>
                        <p className="mt-2 flex flex-wrap gap-x-3 gap-y-1 text-xs font-medium text-slate-600"><span className="inline-flex items-center gap-1"><CalendarDays className="size-3.5" />{new Date(request.date).toLocaleDateString()}</span><span className="inline-flex items-center gap-1"><Clock3 className="size-3.5" />{request.time}</span><span className="inline-flex items-center gap-1"><Users className="size-3.5" />{request.participants}</span></p>
                      </div>
                      {request.status !== "confirmed" && <button type="button" disabled={cancellingId === request._id} onClick={() => void cancelRequest(request)} aria-label={`Cancel ${labels[request.serviceType]} request`} className="grid size-10 shrink-0 place-items-center rounded-full text-slate-400 transition hover:bg-rose-50 hover:text-rose-600 disabled:opacity-40">{cancellingId === request._id ? <LoaderCircle className="size-4 animate-spin" /> : <Trash2 className="size-4" />}</button>}
                    </div>
                    {(request.status === "quoted" || request.status === "confirmed") && (
                      <div className="mt-4 flex flex-col gap-3 rounded-2xl bg-slate-50 p-4 sm:flex-row sm:items-center sm:justify-between">
                        <div>
                          <p className="text-xs font-bold uppercase tracking-[0.12em] text-slate-400">{request.status === "quoted" ? "Your quote" : "Confirmed provider"}</p>
                          <p className="mt-1 font-semibold text-slate-950">{request.provider?.name}</p>
                          {request.adminMessage && <p className="mt-1 text-xs leading-5 text-slate-500">{request.adminMessage}</p>}
                        </div>
                        {request.status === "quoted" && request.quotePrice ? (
                          <div className="flex shrink-0 items-center justify-between gap-4 sm:flex-col sm:items-end sm:gap-2">
                            <p className="text-lg font-bold text-slate-950">CHF {request.quotePrice.toFixed(2)}</p>
                            <Link to={getServicePaymentPath(request)} className="inline-flex items-center gap-2 rounded-full bg-rose-500 px-4 py-2.5 text-xs font-bold text-white transition hover:bg-rose-600"><CreditCard className="size-4" />Review & pay</Link>
                          </div>
                        ) : (
                          <Link to="/trips" className="shrink-0 rounded-full bg-emerald-700 px-4 py-2.5 text-center text-xs font-bold text-white transition hover:bg-emerald-800">View in Trips</Link>
                        )}
                      </div>
                    )}
                  </article>
                );
              })}
            </div>
          )}
        </section>
      )}

      <section className="bg-emerald-950 px-4 py-14 text-white sm:px-6 sm:py-16">
        <div className="mx-auto grid max-w-7xl gap-8 lg:grid-cols-[1fr_auto] lg:items-center">
          <div><p className="text-xs font-black uppercase tracking-[0.18em] text-emerald-300">A human is always nearby</p><h2 className="mt-3 max-w-3xl text-3xl font-semibold tracking-tight sm:text-4xl">One request. A local partner takes care of the details.</h2></div>
          <a href={CONTACT_GMAIL_COMPOSE_URL} target="_blank" rel="noreferrer" className="inline-flex w-fit items-center gap-2 rounded-full bg-white px-6 py-3.5 text-sm font-black text-emerald-950 transition hover:-translate-y-0.5">Need something else? Contact us <ArrowRight className="size-4" /></a>
        </div>
      </section>
    </main>
  );
};

export default Services;
