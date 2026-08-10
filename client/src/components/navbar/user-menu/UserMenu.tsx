import {
  useState,
  useEffect,
  useRef,
  type MouseEvent as ReactMouseEvent,
} from "react";
import { createPortal } from "react-dom";
import { Link, useLocation, useNavigate } from "react-router-dom";
import { AnimatePresence, motion } from "framer-motion";
import { FaHouseUser } from "react-icons/fa6";
import { RiMenuUnfoldLine } from "react-icons/ri";
import { Sparkles } from "lucide-react";
import { useAuth, useMessages, useNotifications } from "../../../lib/hooks";
import Login from "../../user-auth/Login";
import Register from "../../user-auth/Register";
import { toast } from "sonner";
import SwitchLang from "../languages/SwitchLang";
import { useTranslation } from "react-i18next";

const UserMenu = () => {
  const [menuOpen, setMenuOpen] = useState(false);
  const [userLoginOpen, setUserLoginOpen] = useState(false);
  const [userRegisterOpen, setUserRegisterOpen] = useState(false);
  const [userMenuOpen, setUserMenuOpen] = useState(false);
  const [demoLoading, setDemoLoading] = useState(false);
  const { t } = useTranslation("navbar");
  const { user, logout, demoLogin } = useAuth();
  const { notifications } = useNotifications();
  const { unreadTotal: unreadMessages } = useMessages();
  const location = useLocation();
  const navigate = useNavigate();
  const unreadNotifications = notifications.filter(
    (notification) => !notification.read,
  ).length;
  const unreadTotal = unreadNotifications + unreadMessages;
  const menuRef = useRef<HTMLDivElement>(null);

  const handleMenuLoginIconClick = () => {
    setUserLoginOpen(!userLoginOpen);
    setUserRegisterOpen(false);
  };
  const handleMenuRegisterIconClick = () => {
    setUserRegisterOpen(!userRegisterOpen);
    setUserLoginOpen(false);
  };
  const handleUserMenuIconClick = () => setUserMenuOpen(!userMenuOpen);

  const handleDemoLogin = async () => {
    if (demoLoading) return;
    setDemoLoading(true);
    const result = await demoLogin();
    setDemoLoading(false);
    if (result.success) {
      setUserMenuOpen(false);
      toast.success(t("welcomeDemo"));
    } else {
      toast.error(
        result.message ?? t("demoUnavailable"),
      );
    }
  };

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
    const routeState = location.state as {
      authRequired?: boolean;
      returnTo?: string;
    } | null;
    if (user || !routeState?.authRequired) return;
    if (routeState.returnTo)
      sessionStorage.setItem("flypnp:returnTo", routeState.returnTo);
    setUserMenuOpen(false);
    setUserRegisterOpen(false);
    setUserLoginOpen(true);
    navigate(`${location.pathname}${location.search}`, {
      replace: true,
      state: null,
    });
  }, [location.pathname, location.search, location.state, navigate, user]);

  useEffect(() => {
    if (!user) return;
    const returnTo = sessionStorage.getItem("flypnp:returnTo");
    if (!returnTo) return;
    sessionStorage.removeItem("flypnp:returnTo");
    navigate(returnTo, { replace: true });
  }, [navigate, user]);

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
    <div
      ref={menuRef}
      className="flex relative gap-2 items-center user-menu-wrapper sm:gap-3"
    >
      {!user && (
        <button
          type="button"
          onClick={() => void handleDemoLogin()}
          disabled={demoLoading}
          className="hidden items-center gap-2 rounded-full bg-slate-950 px-4 py-2.5 text-sm font-bold text-white shadow-sm transition hover:-translate-y-0.5 hover:bg-emerald-700 disabled:cursor-wait disabled:opacity-70 sm:inline-flex"
        >
          <Sparkles className="text-emerald-300 size-4" />
          {demoLoading ? t("entering") : t("tryDemo")}
        </button>
      )}

      <SwitchLang />

      <div className="relative">
        <button
          type="button"
          aria-label={t("openUserMenu")}
          aria-expanded={userMenuOpen}
          onClick={handleUserMenuIconClick}
          className="flex relative gap-2 items-center px-3 h-11 bg-white rounded-full border shadow-sm transition border-slate-200 hover:shadow-md sm:h-12"
        >
          <RiMenuUnfoldLine className="text-xl" />
          {user ? (
            <div className="overflow-hidden relative w-10 h-10 rounded-full">
              <img
                src={user.avatar}
                alt={t("userAvatar")}
                className="object-cover w-full h-full"
              />
            </div>
          ) : (
            <FaHouseUser className="text-xl text-gray-600" />
          )}
          {user && unreadTotal > 0 && (
            <span className="flex absolute -top-1 -right-1 justify-center items-center text-xs text-white bg-emerald-600 rounded-full size-5">
              {unreadTotal > 9 ? "9+" : unreadTotal}
            </span>
          )}
        </button>

        {userMenuOpen && (
          <div className="absolute right-0 top-14 z-50 w-72 bg-white rounded-lg shadow-md">
            <ul className="p-3 space-y-2">
              {user ? (
                <>
                  <li>
                    <Link
                      to="/notifications"
                      className="block hover:bg-[#f94a52] hover:text-white px-4 py-2 rounded"
                    >
                      {t("notifications")}
                    </Link>
                  </li>
                  <li>
                    <Link
                      to="/profile"
                      className="block hover:bg-[#f94a52] hover:text-white px-4 py-2 rounded"
                    >
                      {t("profile")}
                    </Link>
                  </li>
                  <li>
                    <Link
                      to="/trips"
                      className="block hover:bg-[#f94a52] hover:text-white px-4 py-2 rounded"
                    >
                      {t("trips")}
                    </Link>
                  </li>
                  <li>
                    <Link
                      to="/wishlist"
                      className="block hover:bg-[#f94a52] hover:text-white px-4 py-2 rounded"
                    >
                      {t("wishlists")}
                    </Link>
                  </li>
                  <li>
                    <Link
                      to="/services"
                      className="block rounded px-4 py-2 hover:bg-[#f94a52] hover:text-white"
                    >
                      {t("services")}
                    </Link>
                  </li>
                  {user.isAdmin && (
                    <li>
                      <Link
                        to="/admin/services"
                        className="block px-4 py-2 font-semibold text-emerald-800 bg-emerald-50 rounded hover:bg-emerald-600 hover:text-white"
                      >
                        {t("serviceOperations")}
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
                      {t("listHome")}
                    </Link>
                  </li>
                  <li>
                    <Link
                      to="/messages"
                      onClick={() => setUserMenuOpen(false)}
                      className="block hover:bg-[#f94a52] hover:text-white px-4 py-2 rounded"
                    >
                      <span className="flex gap-3 justify-between items-center">
                        {t("messages")}
                        {unreadMessages > 0 && (
                          <span className="grid min-w-5 place-items-center rounded-full bg-rose-500 px-1.5 py-0.5 text-xs font-bold text-white">
                            {unreadMessages}
                          </span>
                        )}
                      </span>
                    </Link>
                  </li>
                  <li>
                    <hr className="my-2 border-t border-gray-200" />
                  </li>
                  <li>
                    <Link
                      to="/gift-cards"
                      onClick={() => setUserMenuOpen(false)}
                      className="block hover:bg-[#f94a52] hover:text-white px-4 py-2 rounded"
                    >
                      {t("giftCards")}
                    </Link>
                  </li>
                  <li>
                    <Link
                      to="/help"
                      onClick={() => setUserMenuOpen(false)}
                      className="block hover:bg-[#f94a52] hover:text-white px-4 py-2 rounded"
                    >
                      {t("helpCenter")}
                    </Link>
                  </li>
                  <li>
                    <a
                      href="#"
                      onClick={handleLogout}
                      className="block hover:bg-[#f94a52] hover:text-white px-4 py-2 rounded"
                    >
                      {t("logout")}
                    </a>
                  </li>
                </>
              ) : (
                <>
                  <li>
                    <button
                      type="button"
                      onClick={() => void handleDemoLogin()}
                      disabled={demoLoading}
                      className="flex gap-2 items-center px-4 py-2 w-full font-semibold text-left text-white rounded transition bg-slate-950 hover:bg-emerald-700 disabled:cursor-wait disabled:opacity-70 sm:hidden"
                    >
                      <Sparkles className="text-emerald-300 size-4" />
                      {demoLoading ? t("enteringDemo") : t("tryDemo")}
                    </button>
                  </li>
                  <li>
                    <button
                      type="button"
                      onClick={handleMenuLoginIconClick}
                      className="block hover:bg-[#f94a52] hover:text-white px-4 py-2 rounded"
                    >
                      {t("login")}
                    </button>
                  </li>
                  <li>
                    <button
                      type="button"
                      onClick={handleMenuRegisterIconClick}
                      className="block hover:bg-[#f94a52] hover:text-white px-4 py-2 rounded"
                    >
                      {t("signUp")}
                    </button>
                  </li>
                  <li>
                    <hr className="my-2 border-t border-gray-200" />
                  </li>
                  <li>
                    <Link
                      to="/gift-cards"
                      onClick={() => setUserMenuOpen(false)}
                      className="block hover:bg-[#f94a52] hover:text-white px-4 py-2 rounded"
                    >
                      {t("giftCards")}
                    </Link>
                  </li>
                  <li>
                    <button
                      type="button"
                      onClick={handleMenuRegisterIconClick}
                      className="block w-full px-4 py-2 text-left hover:bg-[#f94a52] hover:text-white rounded"
                    >
                      {t("flypnpHomeAction")}
                    </button>
                  </li>
                  <li>
                    <Link
                      to="/help"
                      onClick={() => setUserMenuOpen(false)}
                      className="block hover:bg-[#f94a52] hover:text-white px-4 py-2 rounded"
                    >
                      {t("helpCenter")}
                    </Link>
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
            <motion.div
              className="fixed inset-0 z-[210] grid place-items-center overflow-y-auto bg-slate-950/70 p-4 backdrop-blur-md sm:p-6"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.2 }}
            >
              <motion.div
                className="my-auto w-full max-w-lg"
                initial={{ opacity: 0, y: 24, scale: 0.97 }}
                animate={{ opacity: 1, y: 0, scale: 1 }}
                exit={{ opacity: 0, y: 14, scale: 0.98 }}
                transition={{
                  type: "spring",
                  stiffness: 340,
                  damping: 28,
                  mass: 0.85,
                }}
              >
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
            <motion.div
              className="fixed inset-0 z-[210] grid place-items-center overflow-y-auto bg-slate-950/70 p-3 backdrop-blur-md sm:p-6"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.2 }}
            >
              <motion.div
                className="my-auto w-full max-w-lg"
                initial={{ opacity: 0, y: 24, scale: 0.97 }}
                animate={{ opacity: 1, y: 0, scale: 1 }}
                exit={{ opacity: 0, y: 14, scale: 0.98 }}
                transition={{
                  type: "spring",
                  stiffness: 340,
                  damping: 28,
                  mass: 0.85,
                }}
              >
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
