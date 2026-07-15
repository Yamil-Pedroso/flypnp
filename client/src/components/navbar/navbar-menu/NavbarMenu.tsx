import { useState } from "react";

const NavbarMenu = () => {
  const [active, setActive] = useState("Stays");

  const handleClick = (name: string) => {
    setActive(name);
  };

  return (
      <nav aria-label="Primary navigation" className="hidden items-center gap-1 md:flex">
        {["Stays", "Experiences", "Services"].map((menu) => (
          <button key={menu} type="button" onClick={() => handleClick(menu)} className={`rounded-full px-4 py-2 text-sm font-medium transition ${active === menu ? "bg-slate-100 text-slate-950" : "text-slate-500 hover:bg-slate-50 hover:text-slate-900"}`}>
            {menu}
          </button>
        ))}
      </nav>
  );
};

export default NavbarMenu;
