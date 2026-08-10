import { CalendarCheck, CircleDollarSign, Home } from "lucide-react";
import { useTranslation } from "react-i18next";

interface HostStatsProps {
  listings: number;
  upcomingBookings: number;
  grossBookingValue: number;
}

const HostStats = ({ listings, upcomingBookings, grossBookingValue }: HostStatsProps) => {
  const { t } = useTranslation("places");
  const stats = [
    { label: t("host.stats.listings"), value: String(listings), icon: Home, color: "bg-sky-50 text-sky-700" },
    { label: t("host.stats.stays"), value: String(upcomingBookings), icon: CalendarCheck, color: "bg-emerald-50 text-emerald-700" },
    { label: t("host.stats.value"), value: `${grossBookingValue.toFixed(0)} CHF`, icon: CircleDollarSign, color: "bg-amber-50 text-amber-700" },
  ];

  return (
    <section className="grid gap-4 md:grid-cols-3" aria-label={t("host.stats.overview")}>
      {stats.map(({ label, value, icon: Icon, color }) => (
        <article key={label} className="flex items-center gap-4 rounded-[1.5rem] border border-slate-200 bg-white p-5 shadow-sm">
          <span className={`grid size-12 shrink-0 place-items-center rounded-2xl ${color}`}><Icon className="size-5" /></span>
          <div><p className="text-2xl font-semibold tracking-tight text-slate-950">{value}</p><p className="mt-0.5 text-sm text-slate-500">{label}</p></div>
        </article>
      ))}
    </section>
  );
};

export default HostStats;
