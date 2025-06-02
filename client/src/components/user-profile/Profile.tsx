/* eslint-disable @typescript-eslint/no-explicit-any */
import { useState, useEffect } from "react";
import { Navigate, useParams, useNavigate, Link } from "react-router-dom";
import { trending } from "../../data/trending";
import UpdateProfile from "../user-auth/UpdateProfile";
//import { Avatar, AvatarFallback, AvatarImage } from "./user-avatar/Avatar";
import {
  FaCheck,
  FaAward,
  FaGithub,
  FaLinkedin,
  FaSquareGitlab,
} from "react-icons/fa6";
import { TiCamera } from "react-icons/ti";
import { GrAchievement } from "react-icons/gr";
import { GiAchievement } from "react-icons/gi";
import { RiAwardFill } from "react-icons/ri";
import { CgWebsite } from "react-icons/cg";
import { useAuth, useWishlist } from "../../../hooks";
import { LogOut } from "lucide-react";

const Profile = () => {
  const auth = useAuth() as any;
  const { user, logout, updateUser } = auth;
  const { wishlist } = useWishlist();
  const [userAvatar, setUserAvatar] = useState(user?.avatar);
  const [userUpdateProfileOpen, setUserUpdateProfileOpen] = useState(false);
  const [redirect, setRedirect] = useState(null);
  const [time, setTime] = useState(new Date());
  const navigate = useNavigate();

  const handleClickBtnUpdateProfileToOpen = () => {
    setUserUpdateProfileOpen(!userUpdateProfileOpen);
  };

  useEffect(() => {
    const update = () => setTime(new Date());
    const intervalId = setInterval(update, 1000);
    return () => clearInterval(intervalId);
  }, []);

  let { subpage } = useParams();
  if (!subpage) subpage = "profile";

  const handleLogout = async () => {
    const response = await logout();
    if (response.success) navigate("/");
  };

  if (!user && !redirect) return <Navigate to="/profile" />;

  const handleAvatarChange = async (e: any) => {
    const file = e.target.files[0];
    const reader = new FileReader();
    reader.onloadend = () => setUserAvatar(reader.result as string);
    reader.readAsDataURL(file);

    const formData = new FormData();
    formData.append("avatar", file);
    await updateUser(formData, user._id);
  };

  return (
    <div className="flex flex-col items-center p-5">
      {subpage === "profile" && (
        <div className="flex justify-between p-16 w-full max-w-[90rem] bg-white shadow-2xl rounded-xl">
          <div>
            <div className="flex flex-col relative items-center">
              <div className="absolute top-[3rem] left-[1rem] -translate-x-1/2 w-12 h-12 bg-gray-700 text-white rounded-full flex items-center justify-center shadow-xl z-10">
                <TiCamera
                  onClick={() =>
                    document.getElementById("avatar-file")?.click()
                  }
                  size={22}
                  className="cursor-pointer"
                />
                <input
                  type="file"
                  id="avatar-file"
                  accept="image/*"
                  className="hidden"
                  onChange={handleAvatarChange}
                />
              </div>

              {/* Contenedor del avatar redondo */}
              <div className="border-[3px] border-[#b19899] w-52 h-52 rounded-full overflow-hidden shadow-md mt-8">
                <img
                  src={userAvatar || user.avatar}
                  alt="avatar"
                  className="object-cover w-full h-full"
                />
              </div>

              {/* Nombre y rol */}
              <div className="flex flex-col mt-4 text-center gap-1">
                <p className="text-xl font-light text-gray-600">{user.name}</p>
                <span className="text-sm font-bold text-gray-800">Guest</span>
              </div>
            </div>

            <div className="flex justify-between mt-4 p-4 border-y gap-4">
              <div className="flex flex-col items-center">
                <span className="text-lg font-semibold text-gray-700">
                  {wishlist.length}
                </span>
                <span className="text-sm text-gray-500">Places</span>
              </div>
              <div className="flex flex-col items-center">
                <span className="text-lg font-semibold text-gray-700">20</span>
                <span className="text-sm text-gray-500">Reviews</span>
              </div>
              <div className="flex flex-col items-center">
                <span className="text-lg font-semibold text-gray-700">4</span>
                <span className="text-sm text-gray-500">Booked</span>
              </div>
            </div>

            <div className="flex items-center gap-2 text-green-600 font-bold text-base mt-4">
              <FaCheck /> <span>Verified email</span>
            </div>

            <div className="mt-4">
              <a
                href="#"
                onClick={handleClickBtnUpdateProfileToOpen}
                className="text-gray-500 text-base"
              >
                Edit profile
              </a>

              <button
                onClick={handleLogout}
                className="mt-10 flex items-center justify-center gap-3 bg-white text-gray-800 border-4 border-gray-800 px-8 py-2 text-base font-semibold rounded-lg hover:bg-gray-800 hover:text-white transition-all"
              >
                <LogOut /> Logout
              </button>
            </div>
          </div>

          <div className="ml-8 w-full max-w-5xl">
            {/* Imagen grande con texto */}
            <div className="relative w-full h-60 rounded-xl overflow-hidden shadow-md">
              <p className="absolute bottom-0 w-full text-white text-center text-4xl font-extrabold bg-black/30 py-2">
                JOURNEY
              </p>
              <img
                src="https://images.unsplash.com/photo-1519681393784-d120267933ba"
                alt="user"
                className="object-cover w-full h-full"
              />
            </div>

            {/* Contenido en columnas */}
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mt-8">
              {/* Place collections */}
              <div className="bg-white rounded-xl shadow-xl p-4">
                <p className="text-sm text-gray-500 mb-2">Place collections</p>
                <div className="flex gap-4 flex-wrap">
                  {trending.slice(0, 5).map((place) => (
                    <Link
                      key={place.id}
                      to={`/place/${place.category}/${place.id}`}
                      className="w-20 h-20 rounded-full overflow-hidden border border-gray-200"
                    >
                      {place.photos?.[0] && (
                        <img
                          src={place.photos[0] as string}
                          alt={place.title}
                          className="w-full h-full object-cover"
                        />
                      )}
                    </Link>
                  ))}
                </div>
              </div>

              {/* Favorite place */}
              <div className="bg-white rounded-xl shadow-xl p-4">
                <p className="text-sm text-gray-500 mb-2">Favorite place</p>
                {trending.slice(7, 8).map((place) => (
                  <div
                    key={place.id}
                    className="flex flex-col gap-4 items-center"
                  >
                    <Link
                      to={`/place/${place.category}/${place.id}`}
                      className="w-32 h-32 rounded-full overflow-hidden border"
                    >
                      {place.photos?.[0] && (
                        <img
                          src={place.photos[0] as string}
                          alt={place.title}
                          className="w-full h-full object-cover"
                        />
                      )}
                    </Link>

                    <div className="flex flex-col items-center w-64">
                      <Link
                        to={`/place/${place.category}/${place.id}`}
                        className="text-lg font-bold text-gray-800 text-center"
                      >
                        {place.title}
                      </Link>
                      <button className="flex justify-center items-center mt-4 w-28 py-1 bg-gray-800 text-white text-sm font-bold rounded-md hover:bg-white hover:text-gray-800 border-2 border-gray-800 transition-all">
                        Explore
                      </button>
                    </div>
                  </div>
                ))}
              </div>

              {/* Biography & Links */}
              <div className="bg-white rounded-xl shadow-xl p-6">
                <h2 className="text-sm text-gray-400 mb-1">BIOGRAPHY</h2>
                <p className="text-sm text-gray-500 mb-4">
                  Lorem ipsum dolor sit amet, consectetur adipiscing elit. Sed
                  do eiusmod tempor incididunt ut labore.
                </p>

                <h2 className="text-sm text-gray-400 mb-1">WEBSITE</h2>
                <p className="text-sm text-gray-500 mb-4">www.journey.com</p>

                <h2 className="text-sm text-gray-400 mb-1">ACHIEVEMENTS</h2>
                <div className="flex gap-2 mb-4">
                  {[GrAchievement, GiAchievement, FaAward, RiAwardFill].map(
                    (Icon, i) => (
                      <Icon
                        key={i}
                        size={24}
                        className="text-gray-800 cursor-pointer hover:text-pink-500"
                      />
                    )
                  )}
                </div>

                <p className="text-sm text-gray-400 mb-1">
                  ZURICH, SWITZERLAND
                </p>
                <p className="text-sm text-gray-500">
                  {time.toLocaleTimeString()}
                </p>

                <div className="flex gap-4 mt-4">
                  {[FaGithub, FaSquareGitlab, FaLinkedin, CgWebsite].map(
                    (Icon, i) => (
                      <div
                        key={i}
                        className="w-10 h-10 bg-gray-800 text-white rounded-full flex items-center justify-center hover:bg-pink-400 transition-all cursor-pointer"
                      >
                        <Icon size={20} />
                      </div>
                    )
                  )}
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      <div
        className={`fixed inset-0 z-[1000] bg-black/50 flex items-center justify-center ${
          userUpdateProfileOpen ? "flex" : "hidden"
        }`}
      >
        <div className="bg-white p-8 rounded-xl shadow-2xl animate-slideInUp">
          <UpdateProfile closeUserForm={handleClickBtnUpdateProfileToOpen} />
        </div>
      </div>
    </div>
  );
};

export default Profile;
