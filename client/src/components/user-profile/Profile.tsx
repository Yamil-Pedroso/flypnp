import { useEffect, useState, type ChangeEvent } from "react";
import { Link, Navigate, useNavigate, useParams } from "react-router-dom";
import {
  ArrowUpRight,
  CalendarDays,
  Camera,
  Clock3,
  Heart,
  LogOut,
  MapPin,
  Pencil,
  Plane,
  ShieldCheck,
} from "lucide-react";
import {
  FaAward,
  FaGithub,
  FaLinkedin,
  FaSquareGitlab,
} from "react-icons/fa6";
import { GrAchievement } from "react-icons/gr";
import { GiAchievement } from "react-icons/gi";
import { RiAwardFill } from "react-icons/ri";
import { CgWebsite } from "react-icons/cg";
import { trending } from "../../data/trending";
import { useAuth, useWishlist } from "../../lib/hooks";
import UpdateProfile from "../user-auth/UpdateProfile";
import { useTranslation } from "react-i18next";

const quickLinks = [
  { labelKey: "wishlist", descriptionKey: "savedPlaces", to: "/wishlist", icon: Heart, color: "bg-rose-50 text-rose-600" },
  { labelKey: "trips", descriptionKey: "upcomingStays", to: "/trips", icon: Plane, color: "bg-sky-50 text-sky-600" },
  { labelKey: "bookings", descriptionKey: "travelHistory", to: "/bookings", icon: CalendarDays, color: "bg-emerald-50 text-emerald-700" },
];

const achievements = [GrAchievement, GiAchievement, FaAward, RiAwardFill];
const socialIcons = [FaGithub, FaSquareGitlab, FaLinkedin, CgWebsite];

const Profile = () => {
  const { user, logout, updateUser } = useAuth();
  const { wishlist } = useWishlist();
  const { t, i18n } = useTranslation("auth", { keyPrefix: "profile" });
  const [userAvatar, setUserAvatar] = useState(user?.avatar);
  const [userUpdateProfileOpen, setUserUpdateProfileOpen] = useState(false);
  const [time, setTime] = useState(new Date());
  const navigate = useNavigate();
  let { subpage } = useParams();
  if (!subpage) subpage = "profile";

  useEffect(() => {
    const intervalId = window.setInterval(() => setTime(new Date()), 1000);
    return () => window.clearInterval(intervalId);
  }, []);

  const toggleUpdateProfile = () => setUserUpdateProfileOpen((open) => !open);

  const handleLogout = async () => {
    const response = await logout();
    if (response.success) navigate("/");
  };

  const handleAvatarChange = async (event: ChangeEvent<HTMLInputElement>) => {
    if (!user) return;
    const file = event.target.files?.[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onloadend = () => setUserAvatar(reader.result as string);
    reader.readAsDataURL(file);

    const formData = new FormData();
    formData.append("avatar", file);
    await updateUser(formData, user._id);
  };

  if (!user) return <Navigate to="/profile" />;

  const avatar = userAvatar || user.avatar;
  const firstName = user.name.split(" ")[0];

  return (
    <main className="min-h-screen bg-[#f6f8f6] pb-16">
      {subpage === "profile" && (
        <div className="mx-auto w-full max-w-7xl px-4 pt-6 sm:px-6 sm:pt-8 lg:px-8">
          <section className="relative isolate h-64 overflow-hidden rounded-[2rem] bg-slate-950 sm:h-72 lg:h-80">
            <img
              src="https://images.unsplash.com/photo-1519681393784-d120267933ba?auto=format&fit=crop&w=1800&q=85"
              alt={t("mountainAlt")}
              className="absolute inset-0 size-full object-cover opacity-70"
            />
            <div className="absolute inset-0 bg-gradient-to-r from-slate-950/90 via-slate-900/45 to-transparent" />
            <div className="relative flex h-full flex-col justify-between p-6 text-white sm:p-8 lg:p-10">
              <div className="flex items-center justify-between">
                <span className="rounded-full border border-white/20 bg-white/10 px-3 py-1.5 text-xs font-semibold uppercase tracking-[0.16em] backdrop-blur">{t("journal")}</span>
                <div className="flex items-center gap-2 rounded-full border border-white/15 bg-slate-950/35 px-3 py-2 text-xs backdrop-blur">
                  <Clock3 className="size-4 text-emerald-300" />
                  <span>Zurich · {time.toLocaleTimeString(i18n.resolvedLanguage, { hour: "2-digit", minute: "2-digit" })}</span>
                </div>
              </div>
              <div className="max-w-xl pb-4 lg:pb-8">
                <p className="text-sm font-medium text-emerald-300">{t("welcome", { name: firstName })}</p>
                <h1 className="mt-2 text-3xl font-semibold tracking-tight sm:text-5xl">{t("title")}</h1>
                <p className="mt-3 max-w-lg text-sm leading-6 text-slate-200 sm:text-base">{t("description")}</p>
              </div>
            </div>
          </section>

          <div className="relative z-10 -mt-6 grid gap-6 lg:-mt-10 lg:grid-cols-[19rem_minmax(0,1fr)] lg:items-start">
            <aside className="rounded-[1.75rem] border border-white/80 bg-white p-5 shadow-[0_20px_60px_rgba(15,23,42,0.10)] sm:p-6">
              <div className="flex items-center gap-4 lg:flex-col lg:text-center">
                <div className="relative shrink-0">
                  <div className="size-24 overflow-hidden rounded-full border-4 border-white bg-slate-100 shadow-lg sm:size-28 lg:size-36">
                    {avatar ? <img src={avatar} alt={t("avatarAlt", { name: user.name })} className="size-full object-cover" /> : <span className="flex size-full items-center justify-center bg-emerald-100 text-4xl font-semibold text-emerald-800">{firstName.charAt(0).toUpperCase()}</span>}
                  </div>
                  <button type="button" onClick={() => document.getElementById("avatar-file")?.click()} aria-label={t("changePicture")} className="absolute bottom-0 right-0 flex size-10 items-center justify-center rounded-full border-4 border-white bg-slate-900 text-white shadow-md transition hover:scale-105 hover:bg-emerald-700">
                    <Camera className="size-4" />
                  </button>
                  <input type="file" id="avatar-file" accept="image/*" className="hidden" onChange={handleAvatarChange} />
                </div>
                <div className="min-w-0 lg:mt-3">
                  <h2 className="truncate text-2xl font-semibold tracking-tight text-slate-950">{user.name}</h2>
                  <p className="mt-1 text-sm text-slate-500">{t("guestType")}</p>
                  <span className="mt-3 inline-flex items-center gap-1.5 rounded-full bg-emerald-50 px-3 py-1 text-xs font-semibold text-emerald-700"><ShieldCheck className="size-4" />{t("verified")}</span>
                </div>
              </div>

              <div className="mt-6 grid grid-cols-3 divide-x divide-slate-100 rounded-2xl bg-slate-50 py-4 text-center">
                <div><p className="text-xl font-semibold text-slate-950">{wishlist.length}</p><p className="mt-0.5 text-xs text-slate-500">{t("saved")}</p></div>
                <div><p className="text-xl font-semibold text-slate-950">20</p><p className="mt-0.5 text-xs text-slate-500">{t("reviews")}</p></div>
                <div><p className="text-xl font-semibold text-slate-950">4</p><p className="mt-0.5 text-xs text-slate-500">{t("trips")}</p></div>
              </div>

              <div className="mt-6 space-y-2">
                <button type="button" onClick={toggleUpdateProfile} className="flex w-full items-center justify-center gap-2 rounded-xl bg-slate-900 px-4 py-3 text-sm font-semibold text-white transition hover:bg-emerald-700"><Pencil className="size-4" />{t("edit")}</button>
                <button type="button" onClick={handleLogout} className="flex w-full items-center justify-center gap-2 rounded-xl px-4 py-3 text-sm font-semibold text-slate-600 transition hover:bg-rose-50 hover:text-rose-600"><LogOut className="size-4" />{t("logout")}</button>
              </div>
            </aside>

            <div className="space-y-6">
              <section className="grid gap-3 sm:grid-cols-3">
                {quickLinks.map(({ labelKey, descriptionKey, to, icon: Icon, color }) => (
                  <Link key={labelKey} to={to} className="group flex items-center gap-3 rounded-2xl border border-slate-200/80 bg-white p-4 shadow-sm transition hover:-translate-y-0.5 hover:border-slate-300 hover:shadow-md">
                    <span className={`flex size-11 shrink-0 items-center justify-center rounded-xl ${color}`}><Icon className="size-5" /></span>
                    <span className="min-w-0 flex-1"><span className="block font-semibold text-slate-900">{t(labelKey)}</span><span className="block truncate text-xs text-slate-500">{t(descriptionKey)}</span></span>
                    <ArrowUpRight className="size-4 text-slate-300 transition group-hover:text-slate-700" />
                  </Link>
                ))}
              </section>

              <section className="rounded-[1.75rem] border border-slate-200/80 bg-white p-5 shadow-sm sm:p-6">
                <div className="flex items-end justify-between gap-4">
                  <div><p className="text-xs font-semibold uppercase tracking-[0.16em] text-emerald-700">{t("inspiration")}</p><h2 className="mt-1 text-2xl font-semibold tracking-tight text-slate-950">{t("collections")}</h2></div>
                  <Link to="/wishlist" className="text-sm font-semibold text-slate-500 transition hover:text-slate-950">{t("viewAll")}</Link>
                </div>
                <div className="scrollbar-none mt-5 flex snap-x gap-4 overflow-x-auto pb-2">
                  {trending.slice(0, 5).map((place) => (
                    <Link key={place.id} to={`/place/${place.category}/${place.id}`} className="group relative aspect-[4/5] w-36 shrink-0 snap-start overflow-hidden rounded-2xl bg-slate-100 sm:w-40">
                      {place.photos?.[0] && <img src={place.photos[0] as string} alt={place.title} className="size-full object-cover transition duration-500 group-hover:scale-105" />}
                      <div className="absolute inset-0 bg-gradient-to-t from-slate-950/75 via-transparent to-transparent" />
                      <p className="absolute inset-x-3 bottom-3 line-clamp-2 text-sm font-semibold text-white">{place.title}</p>
                    </Link>
                  ))}
                </div>
              </section>

              <div className="grid gap-6 xl:grid-cols-[1.1fr_0.9fr]">
                <section className="overflow-hidden rounded-[1.75rem] border border-slate-200/80 bg-white shadow-sm">
                  <div className="p-5 pb-4 sm:p-6"><p className="text-xs font-semibold uppercase tracking-[0.16em] text-rose-600">{t("topPick")}</p><h2 className="mt-1 text-2xl font-semibold tracking-tight text-slate-950">{t("favorite")}</h2></div>
                  {trending.slice(7, 8).map((place) => (
                    <Link key={place.id} to={`/place/${place.category}/${place.id}`} className="group grid sm:grid-cols-[11rem_1fr]">
                      <div className="aspect-[4/3] overflow-hidden bg-slate-100 sm:aspect-auto sm:min-h-48">{place.photos?.[0] && <img src={place.photos[0] as string} alt={place.title} className="size-full object-cover transition duration-500 group-hover:scale-105" />}</div>
                      <div className="flex flex-col justify-center p-5"><div className="flex items-start justify-between gap-3"><h3 className="text-lg font-semibold text-slate-950">{place.title}</h3><ArrowUpRight className="size-5 shrink-0 text-slate-400" /></div><p className="mt-2 line-clamp-3 text-sm leading-6 text-slate-500">{t("favoriteDescription")}</p><span className="mt-4 text-sm font-semibold text-emerald-700">{t("exploreStay")}</span></div>
                    </Link>
                  ))}
                </section>

                <section className="rounded-[1.75rem] bg-slate-950 p-5 text-white shadow-sm sm:p-6">
                  <div className="flex items-center gap-2 text-emerald-300"><MapPin className="size-4" /><span className="text-xs font-semibold uppercase tracking-[0.14em]">{t("location")}</span></div>
                  <h2 className="mt-4 text-2xl font-semibold tracking-tight">{t("about")}</h2>
                  <p className="mt-3 text-sm leading-6 text-slate-300">{t("bio")}</p>

                  <p className="mt-6 text-xs font-semibold uppercase tracking-[0.14em] text-slate-400">{t("achievements")}</p>
                  <div className="mt-3 flex gap-2">
                    {achievements.map((Icon, index) => <span key={index} className="flex size-10 items-center justify-center rounded-xl bg-white/10 text-amber-300 transition hover:-translate-y-0.5 hover:bg-white/15"><Icon size={20} /></span>)}
                  </div>

                  <div className="mt-6 flex items-center justify-between border-t border-white/10 pt-5">
                    <div><p className="text-xs text-slate-400">{t("localTime")}</p><p className="mt-1 font-medium">{time.toLocaleTimeString(i18n.resolvedLanguage, { hour: "2-digit", minute: "2-digit" })}</p></div>
                    <div className="flex gap-2">
                      {socialIcons.map((Icon, index) => <button type="button" key={index} aria-label={t("socialLabel", { number: index + 1 })} className="flex size-9 items-center justify-center rounded-full bg-white/10 text-slate-300 transition hover:bg-emerald-500 hover:text-white"><Icon size={16} /></button>)}
                    </div>
                  </div>
                </section>
              </div>
            </div>
          </div>
        </div>
      )}

      {userUpdateProfileOpen && (
        <div className="fixed inset-0 z-[1000] flex items-center justify-center bg-slate-950/60 p-4 backdrop-blur-sm" role="dialog" aria-modal="true" aria-label={t("editDialog")}>
          <div className="w-full max-w-md"><UpdateProfile closeUserForm={toggleUpdateProfile} /></div>
        </div>
      )}
    </main>
  );
};

export default Profile;
