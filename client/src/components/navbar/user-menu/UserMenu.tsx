/* eslint-disable @typescript-eslint/no-explicit-any */
import { useState, useEffect } from "react";
import { FaHouseUser } from "react-icons/fa6";
import { RiMenuUnfoldLine } from "react-icons/ri";
import { TbWorld } from "react-icons/tb";
import { IoCloseSharp } from "react-icons/io5";
import { useAuth } from "../../../../hooks";
import { useNotifications } from "../../../../hooks";
import Login from "../../user-auth/Login";
import Register from "../../user-auth/Register";

const UserMenu = () => {
  const [menuOpen, setMenuOpen] = useState(false);
  const [userLoginOpen, setUserLoginOpen] = useState(false);
  const [userRegisterOpen, setUserRegisterOpen] = useState(false);
  const [userMenuOpen, setUserMenuOpen] = useState(false);
  const auth = useAuth() as any;
  const { user, logout } = auth;
  const notis = useNotifications() as any;
  const { notifications } = notis;

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

  const clickOutside = (e: MouseEvent) => {
    const wrapper = document.querySelector(".user-menu-wrapper");
    if (wrapper && !wrapper.contains(e.target as Node)) {
      setUserMenuOpen(false);
    }
  };

  useEffect(() => {
    document.addEventListener("click", clickOutside);
    return () => document.removeEventListener("click", clickOutside);
  }, []);

  const hangleLogout = async (e: any) => {
    e.preventDefault();
    const response = await logout();
    console.log(response.success ? "logout success" : "logout failed");
  };

  return (
    <div className="flex items-center space-x-4 relative">
      <TbWorld
        onClick={handleMenuIconClick}
        className="text-xl text-gray-600 cursor-pointer"
      />

      {/* Translation Menu */}
      {menuOpen && (
        <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center animate-fadeInFromDown">
          <div className="relative w-[60rem] h-[40rem] bg-white rounded-lg p-6">
            <IoCloseSharp
              onClick={handleMenuIconClick}
              className="absolute top-4 right-4 text-2xl cursor-pointer"
            />
            <h2 className="text-xl font-semibold text-gray-800">
              Translation & Region & Currency
            </h2>
          </div>
        </div>
      )}

      <div className="relative">
        <div
          onClick={handleUserMenuIconClick}
          className="flex items-center gap-2 w-28 h-12 rounded-full shadow cursor-pointer px-3"
        >
          <RiMenuUnfoldLine className="text-xl" />
          {user ? (
            <div className="relative w-10 h-10 rounded-full overflow-hidden">
              {notifications.length > 0 && (
                <span className="absolute -top-1 right-1 w-5 h-5 bg-green-600 text-white text-xs rounded-full flex items-center justify-center">
                  {notifications.length}
                </span>
              )}
              <img
                src={user.avatar}
                alt="user-avatar"
                className="w-full h-full object-cover"
              />
            </div>
          ) : (
            <FaHouseUser className="text-xl text-gray-600" />
          )}
        </div>

        {userMenuOpen && (
          <div className="absolute right-0 top-14 w-72 bg-white rounded-lg shadow-md z-50">
            <ul className="p-3 space-y-2">
              {user ? (
                <>
                  <li>
                    <a
                      href="/notifications"
                      className="block hover:bg-[#f94a52] hover:text-white px-4 py-2 rounded"
                    >
                      Notis
                    </a>
                  </li>
                  <li>
                    <a
                      href="/profile"
                      className="block hover:bg-[#f94a52] hover:text-white px-4 py-2 rounded"
                    >
                      Profile
                    </a>
                  </li>
                  <li>
                    <a
                      href="/trips"
                      className="block hover:bg-[#f94a52] hover:text-white px-4 py-2 rounded"
                    >
                      Trips
                    </a>
                  </li>
                  <li>
                    <a
                      href="/wishlist"
                      className="block hover:bg-[#f94a52] hover:text-white px-4 py-2 rounded"
                    >
                      Wishlists
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
                      onClick={hangleLogout}
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
