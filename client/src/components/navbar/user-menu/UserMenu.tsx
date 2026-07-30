import { useState, useEffect, useRef, type MouseEvent as ReactMouseEvent } from "react";
import { createPortal } from "react-dom";
import { Link } from "react-router-dom";
import { AnimatePresence, motion } from "framer-motion";
import { FaHouseUser } from "react-icons/fa6";
import { RiMenuUnfoldLine } from "react-icons/ri";
import { TbWorld } from "react-icons/tb";
import { Check, Languages, Sparkles, X } from "lucide-react";
import { useAuth, useNotifications } from "../../../lib/hooks";
import Login from "../../user-auth/Login";
import Register from "../../user-auth/Register";

const languages = [
  { code: "de", name: "Deutsch", englishName: "German", mark: "DE" },
  { code: "en", name: "English", englishName: "English", mark: "EN" },
  { code: "es", name: "Español", englishName: "Spanish", mark: "ES" },
  { code: "it", name: "Italiano", englishName: "Italian", mark: "IT" },
  { code: "fr", name: "Français", englishName: "French", mark: "FR" },
] as const;

const UserMenu = () => {
  const [menuOpen, setMenuOpen] = useState(false);
  const [userLoginOpen, setUserLoginOpen] = useState(false);
  const [userRegisterOpen, setUserRegisterOpen] = useState(false);
  const [userMenuOpen, setUserMenuOpen] = useState(false);
  const [selectedLanguage, setSelectedLanguage] = useState("en");
  const { user, logout } = useAuth();
  const { notifications } = useNotifications();
  const unreadNotifications = notifications.filter((notification) => !notification.read).length;
  const menuRef = useRef<HTMLDivElement>(null);

  const handleMenuIconClick = () => setMenuOpen(!menuOpen);
  const handleMenuLoginIconClick = () => {
    setUserLoginOpen(!userLoginOpen);
    setUserRegisterOpen(false);
  };
  const handleMenuRegisterIconClick = () => {
    setUserRegisterOpen(!userRegisterOpen);
    setUserLoginOpen(false);
  };
  const handleUserMenuIconClick = () => setUserMenuOpen(!userMenuOpen);

  const clickOutside = (e: PointerEvent) => {
    if (menuRef.current && !menuRef.current.contains(e.target as Node)) {
      setUserMenuOpen(false);
    }
  };

  useEffect(() => {
    document.addEventListener("click", clickOutside);
    return () => document.removeEventListener("click", clickOutside);
  }, []);

  useEffect(() => {
    if (!menuOpen && !userLoginOpen && !userRegisterOpen) return;
    const previousOverflow = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    const closeOnEscape = (event: KeyboardEvent) => {
      if (event.key === "Escape") {
        setMenuOpen(false);
        setUserLoginOpen(false);
        setUserRegisterOpen(false);
      }
    };
    document.addEventListener("keydown", closeOnEscape);
    return () => {
      document.body.style.overflow = previousOverflow;
      document.removeEventListener("keydown", closeOnEscape);
    };
  }, [menuOpen, userLoginOpen, userRegisterOpen]);

  const handleLogout = async (e: ReactMouseEvent<HTMLAnchorElement>) => {
    e.preventDefault();
    await logout();
    setUserMenuOpen(false);
  };

  return (
    <div ref={menuRef} className="user-menu-wrapper relative flex items-center gap-2 sm:gap-3">
      <button type="button" onClick={handleMenuIconClick} aria-label="Language and currency" className="hidden size-10 items-center justify-center rounded-full text-slate-600 transition hover:bg-slate-100 sm:flex">
        <TbWorld className="text-xl" />
      </button>

      {createPortal(
        <AnimatePresence>
          {menuOpen && (
            <motion.div data-testid="language-modal-backdrop" onClick={() => setMenuOpen(false)} className="fixed inset-0 z-[200] grid place-items-center overflow-y-auto bg-slate-950/65 p-4 backdrop-blur-md sm:p-6" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} transition={{ duration: 0.2 }}>
              <motion.div onClick={(event) => event.stopPropagation()} role="dialog" aria-modal="true" aria-labelledby="language-modal-title" initial={{ opacity: 0, y: 24, scale: 0.96 }} animate={{ opacity: 1, y: 0, scale: 1 }} exit={{ opacity: 0, y: 14, scale: 0.97 }} transition={{ type: "spring", stiffness: 340, damping: 28, mass: 0.85 }} className="relative my-auto w-full max-w-3xl overflow-hidden rounded-[2rem] bg-white shadow-[0_35px_100px_-30px_rgba(0,0,0,0.7)]">
                <div className="relative overflow-hidden bg-slate-950 px-6 py-7 text-white sm:px-8 sm:py-8">
                  <div className="absolute -right-12 -top-20 size-56 rounded-full bg-emerald-500/20 blur-3xl" />
                  <div className="absolute -bottom-24 left-1/3 size-52 rounded-full bg-sky-500/15 blur-3xl" />
                  <button type="button" onClick={() => setMenuOpen(false)} aria-label="Close language settings" className="absolute right-5 top-5 z-10 grid size-10 place-items-center rounded-full bg-white/10 text-white transition hover:rotate-90 hover:bg-white hover:text-slate-950"><X className="size-5" /></button>
                  <div className="relative pr-14">
                    <span className="inline-flex items-center gap-2 rounded-full bg-white/10 px-3 py-1.5 text-xs font-bold uppercase tracking-[0.16em] text-emerald-300 ring-1 ring-white/10"><Sparkles className="size-3.5" /> Make Flypnp yours</span>
                    <div className="mt-5 flex items-center gap-4"><span className="grid size-12 shrink-0 place-items-center rounded-2xl bg-emerald-400 text-slate-950"><Languages className="size-6" /></span><div><h2 id="language-modal-title" className="text-2xl font-semibold tracking-tight sm:text-3xl">Choose your language</h2><p className="mt-1 text-sm text-slate-300">Select how you’d like to experience Flypnp.</p></div></div>
                  </div>
                </div>

                <div className="p-5 sm:p-8">
                  <div role="radiogroup" aria-label="Available languages" className="grid gap-3 sm:grid-cols-2">
                    {languages.map((language) => {
                      const selected = selectedLanguage === language.code;
                      return (
                        <button key={language.code} type="button" role="radio" aria-checked={selected} onClick={() => setSelectedLanguage(language.code)} className={`group flex items-center gap-4 rounded-2xl border p-4 text-left transition-all duration-200 ${selected ? "border-slate-950 bg-slate-950 text-white shadow-lg shadow-slate-950/15" : "border-slate-200 bg-white text-slate-950 hover:-translate-y-0.5 hover:border-emerald-300 hover:shadow-md"}`}>
                          <span className={`grid size-11 shrink-0 place-items-center rounded-xl text-xs font-black tracking-wider ${selected ? "bg-emerald-400 text-slate-950" : "bg-slate-100 text-slate-600 group-hover:bg-emerald-50 group-hover:text-emerald-700"}`}>{language.mark}</span>
                          <span className="min-w-0 flex-1"><span className="block font-semibold">{language.name}</span><span className={`mt-0.5 block text-xs ${selected ? "text-slate-300" : "text-slate-500"}`}>{language.englishName}</span></span>
                          <span className={`grid size-7 shrink-0 place-items-center rounded-full transition ${selected ? "bg-emerald-400 text-slate-950" : "border border-slate-200 text-transparent"}`}><Check className="size-4" /></span>
                        </button>
                      );
                    })}
                  </div>

                  <div className="mt-6 flex flex-col gap-4 border-t border-slate-100 pt-5 sm:flex-row sm:items-center sm:justify-between">
                    <p className="max-w-md text-xs leading-5 text-slate-500">Language translation will be enabled in a future update. Your selection is ready for that integration.</p>
                    <button type="button" onClick={() => setMenuOpen(false)} className="shrink-0 rounded-full bg-rose-500 px-6 py-3 text-sm font-bold text-white shadow-lg shadow-rose-500/20 transition hover:-translate-y-0.5 hover:bg-rose-600">Done</button>
                  </div>
                </div>
              </motion.div>
            </motion.div>
          )}
        </AnimatePresence>,
        document.body,
      )}

      <div className="relative">
        <button
          type="button"
          aria-label="Open user menu"
          aria-expanded={userMenuOpen}
          onClick={handleUserMenuIconClick}
          className="relative flex h-11 items-center gap-2 rounded-full border border-slate-200 bg-white px-3 shadow-sm transition hover:shadow-md sm:h-12"
        >
          <RiMenuUnfoldLine className="text-xl" />
          {user ? (
            <div className="relative w-10 h-10 rounded-full overflow-hidden">
              <img
                src={user.avatar}
                alt="user-avatar"
                className="w-full h-full object-cover"
              />
            </div>
          ) : (
            <FaHouseUser className="text-xl text-gray-600" />
          )}
          {user && unreadNotifications > 0 && (
            <span className="absolute -right-1 -top-1 flex size-5 items-center justify-center rounded-full bg-emerald-600 text-xs text-white">{unreadNotifications}</span>
          )}
        </button>

        {userMenuOpen && (
          <div className="absolute right-0 top-14 w-72 bg-white rounded-lg shadow-md z-50">
            <ul className="p-3 space-y-2">
              {user ? (
                <>
                  <li>
                    <Link
                      to="/notifications"
                      className="block hover:bg-[#f94a52] hover:text-white px-4 py-2 rounded"
                    >
                      Notis
                    </Link>
                  </li>
                  <li>
                    <Link
                      to="/profile"
                      className="block hover:bg-[#f94a52] hover:text-white px-4 py-2 rounded"
                    >
                      Profile
                    </Link>
                  </li>
                  <li>
                    <Link
                      to="/trips"
                      className="block hover:bg-[#f94a52] hover:text-white px-4 py-2 rounded"
                    >
                      Trips
                    </Link>
                  </li>
                  <li>
                    <Link
                      to="/wishlist"
                      className="block hover:bg-[#f94a52] hover:text-white px-4 py-2 rounded"
                    >
                      Wishlists
                    </Link>
                  </li>
                  <li>
                    <Link
                      to="/services"
                      className="block rounded px-4 py-2 hover:bg-[#f94a52] hover:text-white"
                    >
                      Services
                    </Link>
                  </li>
                  {user.isAdmin && (
                    <li>
                      <Link
                        to="/admin/services"
                        className="block rounded bg-emerald-50 px-4 py-2 font-semibold text-emerald-800 hover:bg-emerald-600 hover:text-white"
                      >
                        Service operations
                      </Link>
                    </li>
                  )}
                  <li>
                    <hr className="my-2 border-t border-gray-200" />
                  </li>
                  <li>
                    <Link
                      to="/host"
                      className="block hover:bg-[#f94a52] hover:text-white px-4 py-2 rounded"
                    >
                      List your home
                    </Link>
                  </li>
                  <li>
                    <a
                      href="#"
                      className="block hover:bg-[#f94a52] hover:text-white px-4 py-2 rounded"
                    >
                      Messages
                    </a>
                  </li>
                  <li>
                    <hr className="my-2 border-t border-gray-200" />
                  </li>
                  <li>
                    <a
                      href="#"
                      className="block hover:bg-[#f94a52] hover:text-white px-4 py-2 rounded"
                    >
                      Gift cards
                    </a>
                  </li>
                  <li>
                    <a
                      href="#"
                      className="block hover:bg-[#f94a52] hover:text-white px-4 py-2 rounded"
                    >
                      Help Center
                    </a>
                  </li>
                  <li>
                    <a
                      href="#"
                      onClick={handleLogout}
                      className="block hover:bg-[#f94a52] hover:text-white px-4 py-2 rounded"
                    >
                      Logout
                    </a>
                  </li>
                </>
              ) : (
                <>
                  <li onClick={handleMenuLoginIconClick}>
                    <a
                      href="#"
                      className="block hover:bg-[#f94a52] hover:text-white px-4 py-2 rounded"
                    >
                      Login
                    </a>
                  </li>
                  <li onClick={handleMenuRegisterIconClick}>
                    <a
                      href="#"
                      className="block hover:bg-[#f94a52] hover:text-white px-4 py-2 rounded"
                    >
                      Sign up
                    </a>
                  </li>
                  <li>
                    <hr className="my-2 border-t border-gray-200" />
                  </li>
                  <li>
                    <a
                      href="/register"
                      className="block hover:bg-[#f94a52] hover:text-white px-4 py-2 rounded"
                    >
                      Gift cards
                    </a>
                  </li>
                  <li>
                    <a
                      href="/register"
                      className="block hover:bg-[#f94a52] hover:text-white px-4 py-2 rounded"
                    >
                      Flypnp your home
                    </a>
                  </li>
                  <li>
                    <a
                      href="/register"
                      className="block hover:bg-[#f94a52] hover:text-white px-4 py-2 rounded"
                    >
                      Help center
                    </a>
                  </li>
                </>
              )}
            </ul>
          </div>
        )}
      </div>

      {createPortal(
        <AnimatePresence>
          {userLoginOpen && (
            <motion.div className="fixed inset-0 z-[210] grid place-items-center overflow-y-auto bg-slate-950/70 p-4 backdrop-blur-md sm:p-6" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} transition={{ duration: 0.2 }}>
              <motion.div className="my-auto w-full max-w-lg" initial={{ opacity: 0, y: 24, scale: 0.97 }} animate={{ opacity: 1, y: 0, scale: 1 }} exit={{ opacity: 0, y: 14, scale: 0.98 }} transition={{ type: "spring", stiffness: 340, damping: 28, mass: 0.85 }}>
                <Login
                  closeUserForm={handleMenuLoginIconClick}
                  changeToRegister={handleMenuRegisterIconClick}
                />
              </motion.div>
            </motion.div>
          )}
        </AnimatePresence>,
        document.body,
      )}

      {createPortal(
        <AnimatePresence>
          {userRegisterOpen && (
            <motion.div className="fixed inset-0 z-[210] grid place-items-center overflow-y-auto bg-slate-950/70 p-3 backdrop-blur-md sm:p-6" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} transition={{ duration: 0.2 }}>
              <motion.div className="my-auto w-full max-w-lg" initial={{ opacity: 0, y: 24, scale: 0.97 }} animate={{ opacity: 1, y: 0, scale: 1 }} exit={{ opacity: 0, y: 14, scale: 0.98 }} transition={{ type: "spring", stiffness: 340, damping: 28, mass: 0.85 }}>
                <Register
                  closeUserForm={handleMenuRegisterIconClick}
                  changeToLogin={handleMenuLoginIconClick}
                />
              </motion.div>
            </motion.div>
          )}
        </AnimatePresence>,
        document.body,
      )}
    </div>
  );
};

export default UserMenu;
