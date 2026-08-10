import { useEffect, useRef, useState } from "react";
import { ChevronDown } from "lucide-react";
import { Link, useLocation } from "react-router-dom";
import ServiceIcon from "../../services/ServiceIcon";
import { useTranslation } from "react-i18next";

const serviceLinks = [
  {
    to: "/services#airport-transfer",
    type: "airport-transfer" as const,
    labelKey: "airportTransfer",
    descriptionKey: "airportTransferDescription",
    color: "bg-sky-50 text-sky-700",
  },
  {
    to: "/services#pet-care",
    type: "pet-care" as const,
    labelKey: "petCare",
    descriptionKey: "petCareDescription",
    color: "bg-amber-50 text-amber-700",
  },
  {
    to: "/services#local-guide",
    type: "local-guide" as const,
    labelKey: "localGuide",
    descriptionKey: "localGuideDescription",
    color: "bg-emerald-50 text-emerald-700",
  },
] as const;

const NavbarMenu = () => {
  const { t } = useTranslation("navbar");

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
      if (!menuRef.current?.contains(event.target as Node))
        setServicesOpen(false);
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
    <nav
      aria-label={t("primaryNavigation")}
      className="hidden gap-1 items-center md:flex"
    >
      <Link
        to={`/${location.search}`}
        className={`rounded-full px-4 py-2 text-sm font-medium transition ${active === "Stays" ? "bg-slate-100 text-slate-950" : "text-slate-500 hover:bg-slate-50 hover:text-slate-900"}`}
      >
        {t("stays")}
      </Link>
      <Link
        to={`/experiences${location.search}`}
        className={`rounded-full px-4 py-2 text-sm font-medium transition ${active === "Experiences" ? "bg-slate-100 text-slate-950" : "text-slate-500 hover:bg-slate-50 hover:text-slate-900"}`}
      >
        {t("experiences")}
      </Link>
      <div ref={menuRef} className="relative">
        <button
          type="button"
          aria-expanded={servicesOpen}
          aria-haspopup="menu"
          onClick={() => setServicesOpen((open) => !open)}
          className={`inline-flex items-center gap-1 rounded-full px-4 py-2 text-sm font-medium transition ${active === "Services" ? "bg-slate-100 text-slate-950" : "text-slate-500 hover:bg-slate-50 hover:text-slate-900"}`}
        >
          {t("services")}{" "}
          <ChevronDown
            className={`size-3.5 transition ${servicesOpen ? "rotate-180" : ""}`}
          />
        </button>

        {servicesOpen && (
          <div
            role="menu"
            className="absolute left-1/2 top-[calc(100%+0.9rem)] z-50 w-80 -translate-x-1/2 overflow-hidden rounded-[1.5rem] border border-slate-200 bg-white p-2 shadow-2xl shadow-slate-950/15"
          >
            <div className="px-3 pt-2 pb-2">
              <p className="text-[0.65rem] font-black uppercase tracking-[0.16em] text-emerald-700">
                {t("makeTripEffortless")}
              </p>
            </div>
            {serviceLinks.map(({ to, type, labelKey, descriptionKey, color }) => (
              <Link
                key={to}
                to={to}
                role="menuitem"
                className="flex gap-3 items-center p-3 rounded-2xl transition group hover:bg-slate-50"
              >
                <span
                  className={`grid place-items-center rounded-xl size-11 shrink-0 ${color}`}
                >
                  <ServiceIcon serviceType={type} className="size-7" />
                </span>
                <span className="min-w-0">
                  <span className="block text-sm font-semibold text-slate-950">
                    {t(labelKey)}
                  </span>
                  <span className="mt-0.5 block text-xs text-slate-500">
                    {t(descriptionKey)}
                  </span>
                </span>
              </Link>
            ))}
            <Link
              to="/services"
              role="menuitem"
              className="block px-4 py-3 mt-1 text-xs font-bold text-center text-white rounded-2xl transition bg-slate-950 hover:bg-emerald-700"
            >
              {t("exploreServices")}
            </Link>
          </div>
        )}
      </div>
    </nav>
  );
};

export default NavbarMenu;
