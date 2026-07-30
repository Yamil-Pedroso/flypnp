import { useEffect, useRef, useState } from "react";
import { ChevronDown } from "lucide-react";
import { Link, useLocation } from "react-router-dom";
import ServiceIcon from "../../services/ServiceIcon";

const serviceLinks = [
  { to: "/services#airport-transfer", type: "airport-transfer" as const, label: "Airport Transfer", description: "Door-to-door arrival", color: "bg-sky-50 text-sky-700" },
  { to: "/services#pet-care", type: "pet-care" as const, label: "Pet Care", description: "Trusted care nearby", color: "bg-amber-50 text-amber-700" },
  { to: "/services#local-guide", type: "local-guide" as const, label: "Local Guide", description: "Private local routes", color: "bg-emerald-50 text-emerald-700" },
] as const;

const NavbarMenu = () => {
  const location = useLocation();
  const [servicesOpen, setServicesOpen] = useState(false);
  const menuRef = useRef<HTMLDivElement>(null);
  const active = location.pathname.startsWith("/services")
    ? "Services"
    : location.pathname.startsWith("/experiences")
      ? "Experiences"
      : "Stays";

  useEffect(() => setServicesOpen(false), [location.pathname, location.hash]);

  useEffect(() => {
    if (!servicesOpen) return;
    const closeOnOutsideClick = (event: PointerEvent) => {
      if (!menuRef.current?.contains(event.target as Node)) setServicesOpen(false);
    };
    const closeOnEscape = (event: KeyboardEvent) => {
      if (event.key === "Escape") setServicesOpen(false);
    };
    document.addEventListener("pointerdown", closeOnOutsideClick);
    document.addEventListener("keydown", closeOnEscape);
    return () => {
      document.removeEventListener("pointerdown", closeOnOutsideClick);
      document.removeEventListener("keydown", closeOnEscape);
    };
  }, [servicesOpen]);

  return (
    <nav aria-label="Primary navigation" className="hidden items-center gap-1 md:flex">
      <Link to={`/${location.search}`} className={`rounded-full px-4 py-2 text-sm font-medium transition ${active === "Stays" ? "bg-slate-100 text-slate-950" : "text-slate-500 hover:bg-slate-50 hover:text-slate-900"}`}>Stays</Link>
      <Link to={`/experiences${location.search}`} className={`rounded-full px-4 py-2 text-sm font-medium transition ${active === "Experiences" ? "bg-slate-100 text-slate-950" : "text-slate-500 hover:bg-slate-50 hover:text-slate-900"}`}>Experiences</Link>
      <div ref={menuRef} className="relative">
        <button
          type="button"
          aria-expanded={servicesOpen}
          aria-haspopup="menu"
          onClick={() => setServicesOpen((open) => !open)}
          className={`inline-flex items-center gap-1 rounded-full px-4 py-2 text-sm font-medium transition ${active === "Services" ? "bg-slate-100 text-slate-950" : "text-slate-500 hover:bg-slate-50 hover:text-slate-900"}`}
        >
          Services <ChevronDown className={`size-3.5 transition ${servicesOpen ? "rotate-180" : ""}`} />
        </button>

        {servicesOpen && (
          <div role="menu" className="absolute left-1/2 top-[calc(100%+0.9rem)] z-50 w-80 -translate-x-1/2 overflow-hidden rounded-[1.5rem] border border-slate-200 bg-white p-2 shadow-2xl shadow-slate-950/15">
            <div className="px-3 pb-2 pt-2">
              <p className="text-[0.65rem] font-black uppercase tracking-[0.16em] text-emerald-700">Make your trip effortless</p>
            </div>
            {serviceLinks.map(({ to, type, label, description, color }) => (
              <Link key={to} to={to} role="menuitem" className="group flex items-center gap-3 rounded-2xl p-3 transition hover:bg-slate-50">
                <span className={`grid size-11 shrink-0 place-items-center rounded-xl ${color}`}><ServiceIcon serviceType={type} className="size-7" /></span>
                <span className="min-w-0"><span className="block text-sm font-semibold text-slate-950">{label}</span><span className="mt-0.5 block text-xs text-slate-500">{description}</span></span>
              </Link>
            ))}
            <Link to="/services" role="menuitem" className="mt-1 block rounded-2xl bg-slate-950 px-4 py-3 text-center text-xs font-bold text-white transition hover:bg-emerald-700">Explore all services</Link>
          </div>
        )}
      </div>
    </nav>
  );
};

export default NavbarMenu;
