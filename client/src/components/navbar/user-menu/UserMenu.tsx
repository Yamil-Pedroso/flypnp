import { useState, useEffect, useRef, type MouseEvent as ReactMouseEvent } from "react";
import { Link } from "react-router-dom";
import { FaHouseUser } from "react-icons/fa6";
import { RiMenuUnfoldLine } from "react-icons/ri";
import { TbWorld } from "react-icons/tb";
import { IoCloseSharp } from "react-icons/io5";
import { useAuth, useNotifications } from "../../../lib/hooks";
import Login from "../../user-auth/Login";
import Register from "../../user-auth/Register";

const UserMenu = () => {
  const [menuOpen, setMenuOpen] = useState(false);
  const [userLoginOpen, setUserLoginOpen] = useState(false);
  const [userRegisterOpen, setUserRegisterOpen] = useState(false);
  const [userMenuOpen, setUserMenuOpen] = useState(false);
  const { user, logout } = useAuth();
  const { notifications } = useNotifications();
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

      {/* Translation Menu */}
      {menuOpen && (
        <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center animate-fadeInFromDown">
          <div className="relative mx-4 min-h-72 w-full max-w-4xl rounded-3xl bg-white p-6 shadow-2xl sm:p-8">
            <button type="button" onClick={handleMenuIconClick} aria-label="Close language settings" className="absolute right-4 top-4 flex size-10 items-center justify-center rounded-full hover:bg-slate-100">
              <IoCloseSharp className="text-2xl" />
            </button>
            <h2 className="text-xl font-semibold text-gray-800">
              Translation & Region & Currency
            </h2>
          </div>
        </div>
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
          {user && notifications.length > 0 && (
            <span className="absolute -right-1 -top-1 flex size-5 items-center justify-center rounded-full bg-emerald-600 text-xs text-white">{notifications.length}</span>
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
                    <hr className="my-2 border-t border-gray-200" />
                  </li>
                  <li>
                    <a
                      href="#"
                      className="block hover:bg-[#f94a52] hover:text-white px-4 py-2 rounded"
                    >
                      Flypnp our home
                    </a>
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

      {userLoginOpen && (
        <div className="fixed inset-0 bg-black bg-opacity-50 z-50 flex items-center justify-center animate-fadeInFromDown">
          <div className="w-full max-w-md">
            <Login
              closeUserForm={handleMenuLoginIconClick}
              changeToRegister={handleMenuRegisterIconClick}
            />
          </div>
        </div>
      )}

      {userRegisterOpen && (
        <div className="fixed inset-0 bg-black bg-opacity-50 z-50 flex items-center justify-center animate-fadeInFromDown">
          <div className="w-full max-w-md">
            <Register
              closeUserForm={handleMenuRegisterIconClick}
              changeToLogin={handleMenuLoginIconClick}
            />
          </div>
        </div>
      )}
    </div>
  );
};

export default UserMenu;
