import { Link, useLocation } from "react-router-dom";

const NavbarMenu = () => {
  const location = useLocation();
  const active = location.pathname.startsWith("/experiences") ? "Experiences" : "Stays";

  return (
      <nav aria-label="Primary navigation" className="hidden items-center gap-1 md:flex">
        <Link to={`/${location.search}`} className={`rounded-full px-4 py-2 text-sm font-medium transition ${active === "Stays" ? "bg-slate-100 text-slate-950" : "text-slate-500 hover:bg-slate-50 hover:text-slate-900"}`}>Stays</Link>
        <Link to={`/experiences${location.search}`} className={`rounded-full px-4 py-2 text-sm font-medium transition ${active === "Experiences" ? "bg-slate-100 text-slate-950" : "text-slate-500 hover:bg-slate-50 hover:text-slate-900"}`}>Experiences</Link>
        <button type="button" className="rounded-full px-4 py-2 text-sm font-medium text-slate-400 transition hover:bg-slate-50 hover:text-slate-700">Services</button>
      </nav>
  );
};

export default NavbarMenu;
