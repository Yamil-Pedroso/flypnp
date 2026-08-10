import { useCallback, useEffect, useMemo, useState, type FormEvent } from "react";
import { Link } from "react-router-dom";
import {
  ArrowLeft,
  BadgeCheck,
  CalendarDays,
  CheckCircle2,
  Clock3,
  DollarSign,
  LoaderCircle,
  Mail,
  MapPin,
  Phone,
  RefreshCw,
  Send,
  ShieldAlert,
  Trash2,
  UserRound,
  Users,
  X,
} from "lucide-react";
import { toast } from "sonner";
import { useAuth } from "../../lib/hooks";
import { getErrorMessage, travelServicesService, type ServiceRequest } from "../../services";
import { useTranslation } from "react-i18next";

type AdminFilter = "all" | ServiceRequest["status"];

const emptyQuote = {
  quotePrice: "",
  providerName: "",
  providerEmail: "",
  providerPhone: "",
  adminMessage: "",
};

const AdminServices = () => {
  const { t, i18n } = useTranslation("services");
  const serviceName = (type: ServiceRequest["serviceType"]) => t(`names.${type === "airport-transfer" ? "airport" : type === "pet-care" ? "pet" : "guide"}`);
  const { user } = useAuth();
  const [requests, setRequests] = useState<ServiceRequest[]>([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState<AdminFilter>("requested");
  const [selected, setSelected] = useState<ServiceRequest | null>(null);
  const [quote, setQuote] = useState(emptyQuote);
  const [saving, setSaving] = useState(false);
  const [cancellingId, setCancellingId] = useState<string | null>(null);

  const loadRequests = useCallback(async () => {
    if (!user?.isAdmin) {
      setLoading(false);
      return;
    }
    try {
      setLoading(true);
      setRequests(await travelServicesService.listAllRequests());
    } catch (cause) {
      toast.error(getErrorMessage(cause, t("admin.loadError")));
    } finally {
      setLoading(false);
    }
  }, [t, user?.isAdmin]);

  useEffect(() => { void loadRequests(); }, [loadRequests]);

  const visibleRequests = useMemo(
    () => filter === "all" ? requests : requests.filter((request) => request.status === filter),
    [filter, requests],
  );

  const openQuote = (request: ServiceRequest) => {
    setSelected(request);
    setQuote({
      quotePrice: request.quotePrice ? String(request.quotePrice) : "",
      providerName: request.provider?.name ?? "",
      providerEmail: request.provider?.email ?? "",
      providerPhone: request.provider?.phone ?? "",
      adminMessage: request.adminMessage ?? "",
    });
  };

  const submitQuote = async (event: FormEvent) => {
    event.preventDefault();
    if (!selected) return;
    try {
      setSaving(true);
      const updated = await travelServicesService.quoteRequest(selected._id, {
        quotePrice: Number(quote.quotePrice),
        provider: {
          name: quote.providerName,
          email: quote.providerEmail || undefined,
          phone: quote.providerPhone || undefined,
        },
        adminMessage: quote.adminMessage || undefined,
      });
      setRequests((current) => current.map((request) => request._id === updated._id ? { ...updated, owner: request.owner } : request));
      setSelected(null);
      toast.success(t("admin.quoteSent"));
    } catch (cause) {
      toast.error(getErrorMessage(cause, t("admin.quoteError")));
    } finally {
      setSaving(false);
    }
  };

  const cancelRequest = async (request: ServiceRequest) => {
    try {
      setCancellingId(request._id);
      await travelServicesService.cancelRequest(request._id);
      setRequests((current) => current.map((item) => item._id === request._id ? { ...item, status: "cancelled" } : item));
      toast.success(t("page.cancelled"));
    } catch (cause) {
      toast.error(getErrorMessage(cause, t("admin.cancelError")));
    } finally {
      setCancellingId(null);
    }
  };

  if (!user?.isAdmin) {
    return (
      <main className="grid min-h-[70vh] place-items-center bg-[#f7f9f8] px-4">
        <div className="max-w-lg rounded-[2rem] border border-rose-100 bg-white p-8 text-center shadow-xl shadow-slate-900/5">
          <ShieldAlert className="mx-auto size-10 text-rose-500" />
          <h1 className="mt-5 text-2xl font-semibold text-slate-950">{t("admin.access")}</h1>
          <p className="mt-2 text-slate-500">{t("admin.accessText")}</p>
          <Link to="/services" className="mt-6 inline-flex items-center gap-2 rounded-full bg-slate-950 px-5 py-3 text-sm font-bold text-white"><ArrowLeft className="size-4" />{t("admin.back")}</Link>
        </div>
      </main>
    );
  }

  const counts = {
    requested: requests.filter((request) => request.status === "requested").length,
    quoted: requests.filter((request) => request.status === "quoted").length,
    confirmed: requests.filter((request) => request.status === "confirmed").length,
  };

  return (
    <main className="min-h-screen bg-[#f5f7f6] pb-16">
      <section className="bg-slate-950 text-white">
        <div className="mx-auto max-w-7xl px-4 py-10 sm:px-6 sm:py-14 lg:px-8">
          <Link to="/services" className="inline-flex items-center gap-2 text-sm font-semibold text-slate-400 transition hover:text-white"><ArrowLeft className="size-4" />{t("admin.services")}</Link>
          <div className="mt-6 grid gap-8 lg:grid-cols-[1fr_auto] lg:items-end">
            <div><p className="text-xs font-black uppercase tracking-[0.18em] text-emerald-300">{t("admin.desk")}</p><h1 className="mt-3 text-4xl font-semibold tracking-tight sm:text-5xl">{t("admin.title")}</h1><p className="mt-3 max-w-2xl leading-7 text-slate-300">{t("admin.subtitle")}</p></div>
            <div className="grid grid-cols-3 gap-2">
              {[[t("admin.new"), counts.requested], [t("admin.quoted"), counts.quoted], [t("admin.confirmed"), counts.confirmed]].map(([label, count]) => <div key={label} className="min-w-24 rounded-2xl bg-white/10 px-4 py-3 text-center ring-1 ring-white/10"><p className="text-2xl font-semibold">{count}</p><p className="mt-1 text-xs text-slate-400">{label}</p></div>)}
            </div>
          </div>
        </div>
      </section>

      <section className="mx-auto max-w-7xl px-4 py-8 sm:px-6 lg:px-8">
        <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
          <div className="flex gap-2 overflow-x-auto pb-1">
            {(["requested", "quoted", "confirmed", "cancelled", "all"] as const).map((status) => <button key={status} type="button" onClick={() => setFilter(status)} className={`shrink-0 rounded-full px-4 py-2.5 text-xs font-bold capitalize transition ${filter === status ? "bg-slate-950 text-white" : "bg-white text-slate-500 ring-1 ring-slate-200 hover:text-slate-950"}`}>{t(`status.${status}`)}</button>)}
          </div>
          <button type="button" onClick={() => void loadRequests()} className="inline-flex w-fit items-center gap-2 rounded-full bg-white px-4 py-2.5 text-xs font-bold text-slate-600 ring-1 ring-slate-200 transition hover:text-emerald-700"><RefreshCw className="size-3.5" />{t("admin.refresh")}</button>
        </div>

        {loading ? (
          <div className="mt-7 grid min-h-72 place-items-center rounded-[2rem] border border-slate-200 bg-white"><LoaderCircle className="size-7 animate-spin text-emerald-600" /></div>
        ) : visibleRequests.length === 0 ? (
          <div className="mt-7 rounded-[2rem] border border-dashed border-slate-300 bg-white px-6 py-16 text-center"><CheckCircle2 className="mx-auto size-10 text-emerald-600" /><h2 className="mt-4 text-xl font-semibold text-slate-950">{t("admin.empty")}</h2><p className="mt-2 text-sm text-slate-500">{t("admin.emptyText")}</p></div>
        ) : (
          <div className="mt-7 grid gap-5 lg:grid-cols-2">
            {visibleRequests.map((request) => {
              const owner = typeof request.owner === "string" ? null : request.owner;
              const canQuote = request.status === "requested" || request.status === "quoted";
              return (
                <article key={request._id} className="rounded-[1.75rem] border border-slate-200 bg-white p-5 shadow-sm sm:p-6">
                  <div className="flex items-start justify-between gap-4">
                    <div><span className="rounded-full bg-emerald-50 px-3 py-1.5 text-[0.65rem] font-black uppercase tracking-[0.12em] text-emerald-700">{serviceName(request.serviceType)}</span><h2 className="mt-3 text-xl font-semibold text-slate-950">{request.destination}</h2></div>
                    <span className={`rounded-full px-3 py-1.5 text-xs font-bold capitalize ${request.status === "confirmed" ? "bg-emerald-100 text-emerald-800" : request.status === "quoted" ? "bg-sky-100 text-sky-800" : request.status === "cancelled" ? "bg-rose-100 text-rose-800" : "bg-amber-100 text-amber-800"}`}>{t(`status.${request.status}`)}</span>
                  </div>
                  <div className="mt-5 grid grid-cols-2 gap-3 rounded-2xl bg-slate-50 p-4 text-sm">
                    <p className="flex items-center gap-2 text-slate-600"><CalendarDays className="size-4 text-slate-400" />{new Date(request.date).toLocaleDateString(i18n.resolvedLanguage ?? i18n.language)}</p>
                    <p className="flex items-center gap-2 text-slate-600"><Clock3 className="size-4 text-slate-400" />{request.time}</p>
                    <p className="flex items-center gap-2 text-slate-600"><Users className="size-4 text-slate-400" />{request.participants}</p>
                    <p className="flex items-center gap-2 text-slate-600"><MapPin className="size-4 text-slate-400" />{request.destination}</p>
                  </div>
                  <div className="mt-4 flex items-center gap-3 border-t border-slate-100 pt-4">
                    {owner?.avatar ? <img src={owner.avatar} alt="" className="size-10 rounded-full object-cover" /> : <span className="grid size-10 place-items-center rounded-full bg-slate-100 text-slate-500"><UserRound className="size-4" /></span>}
                    <div className="min-w-0 flex-1"><p className="truncate text-sm font-semibold text-slate-950">{owner?.name ?? t("admin.traveler")}</p><p className="truncate text-xs text-slate-500">{owner?.email}</p></div>
                    {request.quotePrice && <p className="text-lg font-bold text-slate-950">CHF {request.quotePrice.toFixed(2)}</p>}
                  </div>
                  {request.provider?.name && <p className="mt-4 rounded-xl bg-emerald-50 px-3.5 py-3 text-xs text-emerald-800"><span className="font-bold">{t("admin.assigned")}</span> {request.provider.name}</p>}
                  <div className="mt-5 flex flex-wrap justify-end gap-2">
                    {canQuote && <button type="button" onClick={() => openQuote(request)} className="inline-flex items-center gap-2 rounded-full bg-slate-950 px-4 py-2.5 text-xs font-bold text-white transition hover:bg-emerald-700"><DollarSign className="size-4" />{t(request.status === "quoted" ? "admin.editQuote" : "admin.prepareQuote")}</button>}
                    {canQuote && <button type="button" disabled={cancellingId === request._id} onClick={() => void cancelRequest(request)} className="inline-flex items-center gap-2 rounded-full px-4 py-2.5 text-xs font-bold text-rose-600 transition hover:bg-rose-50 disabled:opacity-40">{cancellingId === request._id ? <LoaderCircle className="size-4 animate-spin" /> : <Trash2 className="size-4" />}{t("admin.cancel")}</button>}
                  </div>
                </article>
              );
            })}
          </div>
        )}
      </section>

      {selected && (
        <div className="fixed inset-0 z-[200] grid place-items-center overflow-y-auto bg-slate-950/65 p-4 backdrop-blur-sm">
          <button type="button" aria-label={t("admin.closeEditor")} onClick={() => !saving && setSelected(null)} className="absolute inset-0 cursor-default" />
          <form onSubmit={submitQuote} className="relative my-auto w-full max-w-2xl overflow-hidden rounded-[2rem] bg-white shadow-2xl">
            <div className="relative bg-slate-950 px-6 py-6 text-white sm:px-8">
              <button type="button" onClick={() => setSelected(null)} aria-label={t("admin.close")} className="absolute right-5 top-5 grid size-9 place-items-center rounded-full bg-white/10 transition hover:bg-white hover:text-slate-950"><X className="size-4" /></button>
              <p className="text-xs font-black uppercase tracking-[0.16em] text-emerald-300">{t("admin.prepareQuote")}</p><h2 className="mt-2 pr-12 text-2xl font-semibold">{serviceName(selected.serviceType)}</h2><p className="mt-1 text-sm text-slate-400">{selected.destination}</p>
            </div>
            <div className="grid gap-5 p-6 sm:grid-cols-2 sm:p-8">
              <label className="grid gap-2 text-sm font-semibold text-slate-800">{t("admin.price")}<span className="relative"><DollarSign className="absolute left-4 top-1/2 size-4 -translate-y-1/2 text-slate-400" /><input required type="number" min={1} max={100000} step="0.01" value={quote.quotePrice} onChange={(event) => setQuote((current) => ({ ...current, quotePrice: event.target.value }))} className="w-full rounded-2xl border border-slate-200 py-3.5 pl-11 pr-4 font-normal outline-none focus:border-emerald-500 focus:ring-4 focus:ring-emerald-100" /></span></label>
              <label className="grid gap-2 text-sm font-semibold text-slate-800">{t("admin.providerName")}<span className="relative"><BadgeCheck className="absolute left-4 top-1/2 size-4 -translate-y-1/2 text-slate-400" /><input required value={quote.providerName} onChange={(event) => setQuote((current) => ({ ...current, providerName: event.target.value }))} placeholder={t("admin.providerPlaceholder")} className="w-full rounded-2xl border border-slate-200 py-3.5 pl-11 pr-4 font-normal outline-none focus:border-emerald-500 focus:ring-4 focus:ring-emerald-100" /></span></label>
              <label className="grid gap-2 text-sm font-semibold text-slate-800">{t("admin.providerEmail")}<span className="relative"><Mail className="absolute left-4 top-1/2 size-4 -translate-y-1/2 text-slate-400" /><input type="email" value={quote.providerEmail} onChange={(event) => setQuote((current) => ({ ...current, providerEmail: event.target.value }))} placeholder="dispatch@example.com" className="w-full rounded-2xl border border-slate-200 py-3.5 pl-11 pr-4 font-normal outline-none focus:border-emerald-500 focus:ring-4 focus:ring-emerald-100" /></span></label>
              <label className="grid gap-2 text-sm font-semibold text-slate-800">{t("admin.providerPhone")}<span className="relative"><Phone className="absolute left-4 top-1/2 size-4 -translate-y-1/2 text-slate-400" /><input type="tel" value={quote.providerPhone} onChange={(event) => setQuote((current) => ({ ...current, providerPhone: event.target.value }))} placeholder="+41 44 000 00 00" className="w-full rounded-2xl border border-slate-200 py-3.5 pl-11 pr-4 font-normal outline-none focus:border-emerald-500 focus:ring-4 focus:ring-emerald-100" /></span></label>
              <label className="grid gap-2 text-sm font-semibold text-slate-800 sm:col-span-2">{t("admin.message")}<textarea rows={4} maxLength={1000} value={quote.adminMessage} onChange={(event) => setQuote((current) => ({ ...current, adminMessage: event.target.value }))} placeholder={t("admin.messagePlaceholder")} className="resize-none rounded-2xl border border-slate-200 px-4 py-3.5 font-normal leading-6 outline-none focus:border-emerald-500 focus:ring-4 focus:ring-emerald-100" /></label>
              <p className="text-xs leading-5 text-slate-500 sm:col-span-2">{t("admin.contactHint")}</p>
              <div className="flex justify-end gap-3 border-t border-slate-100 pt-5 sm:col-span-2"><button type="button" disabled={saving} onClick={() => setSelected(null)} className="rounded-full px-5 py-3 text-sm font-semibold text-slate-600 hover:bg-slate-100">{t("admin.cancel")}</button><button type="submit" disabled={saving} className="inline-flex items-center gap-2 rounded-full bg-rose-500 px-6 py-3 text-sm font-bold text-white shadow-lg shadow-rose-500/20 transition hover:bg-rose-600 disabled:opacity-50">{saving ? <LoaderCircle className="size-4 animate-spin" /> : <Send className="size-4" />}{t("admin.sendQuote")}</button></div>
            </div>
          </form>
        </div>
      )}
    </main>
  );
};

export default AdminServices;
