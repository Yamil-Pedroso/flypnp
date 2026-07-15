import { useState } from "react";
import { useParams } from "react-router-dom";
import { usePlaces } from "../../../lib/hooks";
import { IoShareSocial } from "react-icons/io5";
import { FaRegHeart } from "react-icons/fa6";
import ReserveBox from "./ReserveBox";
import ShowAllPhotos from "./ShowAllPhotos";
import { GiOlive } from "react-icons/gi";
import { FaStar } from "react-icons/fa";
import { BsAwardFill } from "react-icons/bs";
import {
  MdOutlineBedroomParent,
  MdOutlineHouse,
  MdOutlineBathroom,
} from "react-icons/md";

const PlaceDetails = () => {
  const { id, category } = useParams<{ id: string; category: string }>();
  const { places, loading } = usePlaces();
  const [reserveBoxVisible, setReserveBoxVisible] = useState(false);

  const handleClickReserveBox = () => {
    setReserveBoxVisible(!reserveBoxVisible);
  };

  if (loading) {
    return <div className="mx-auto h-96 w-full max-w-7xl animate-pulse rounded-3xl bg-slate-200" aria-label="Loading place" />;
  }

  const place = places.find(
    (place) => place._id === id && place.category === category
  );

  if (!place) {
    return <div className="mx-auto max-w-7xl px-4 py-20 text-center"><h1 className="text-2xl font-semibold">Place not found</h1></div>;
  }

  const mainPhoto = place.photos[0]?.main || "";
  const thumbnails = place.photos[0]?.thumbnails || [];

  return (
    <main className="mx-auto w-full max-w-7xl px-4 py-8 sm:px-6 lg:px-8">
      <div className="mb-5 flex items-start justify-between gap-4">
        <div><p className="text-sm font-medium text-emerald-700">{place.address}</p><h1 className="mt-1 text-3xl font-semibold tracking-tight text-slate-950">{place.title}</h1></div>
        <div className="flex gap-2">
          <button type="button" className="flex items-center gap-2 rounded-full px-3 py-2 text-sm font-medium text-slate-700 transition hover:bg-slate-100"><IoShareSocial /><span className="hidden sm:inline">Share</span></button>
          <button type="button" className="flex items-center gap-2 rounded-full px-3 py-2 text-sm font-medium text-slate-700 transition hover:bg-rose-50 hover:text-rose-600"><FaRegHeart /><span className="hidden sm:inline">Save</span></button>
        </div>
      </div>
      <div className="relative grid h-72 grid-cols-1 gap-1 overflow-hidden rounded-3xl sm:h-[30rem] lg:grid-cols-2">
        <img src={mainPhoto} alt={place.title} className="size-full object-cover" />
        <div className="relative hidden grid-cols-2 gap-1 lg:grid">
          <ShowAllPhotos />
          {thumbnails.slice(0, 4).map((photo, index) => (
            <img key={photo} src={photo} alt={`${place.title} view ${index + 2}`} className="size-full min-h-0 object-cover" />
          ))}
        </div>
      </div>
      <div className="grid gap-10 pt-8 lg:grid-cols-[minmax(0,1fr)_23rem]">
        <section className="min-w-0">
          <div className="flex items-start justify-between gap-5 border-b border-slate-200 pb-7">
            <div>
              <h2 className="text-2xl font-semibold text-slate-950">{place.description}</h2>
              <p className="mt-2 text-slate-500">{place.perks.join(" · ")}</p>
            </div>
            <button type="button" onClick={handleClickReserveBox} className="shrink-0 rounded-full bg-slate-900 px-4 py-2 text-sm font-semibold text-white lg:hidden">Reserve</button>
          </div>

          <div className="my-7 flex flex-col items-center justify-between gap-5 rounded-2xl border border-slate-200 p-5 sm:flex-row">
            <div className="flex items-center gap-3">
              <div className="flex items-center text-slate-800"><GiOlive size={36} /><p className="mx-2 text-lg font-semibold">Guest favorite</p><GiOlive size={36} className="rotate-90" /></div>
              <p className="hidden max-w-52 text-sm font-medium text-slate-600 sm:block">One of the most booked places in the world</p>
            </div>
            <div className="flex items-center gap-5 text-sm font-semibold">
              <div className="flex items-center gap-1"><span>{place.rating}</span><FaStar /></div>
              <p>{place.reviews} <span className="font-normal text-rose-600 underline">reviews</span></p>
            </div>
          </div>

          <div className="flex items-center gap-4 border-b border-slate-200 pb-7">
            <div className="relative size-14 shrink-0 overflow-hidden rounded-full">
              <BsAwardFill size={22} className="absolute bottom-0 right-0 z-10 text-rose-500" />
              <img src="https://images.unsplash.com/photo-1438761681033-6461ffad8d80?q=80&w=3570&auto=format&fit=crop" alt="Host Jane" className="size-full object-cover" />
            </div>
            <div><p className="font-semibold text-slate-950">Stay with Jane</p><p className="text-sm text-slate-500">Superhost · 4 years hosting</p></div>
          </div>

          <div className="space-y-6 py-7">
            {[
              { icon: MdOutlineBedroomParent, title: 'Room in a chalet', text: 'Your own room in the home, plus access to shared spaces.' },
              { icon: MdOutlineHouse, title: 'Shared common spaces', text: "You'll share part of the home with the host and other guests." },
              { icon: MdOutlineBathroom, title: 'Shared bathroom', text: "You'll share a bathroom with the host and other guests in the home." },
              { icon: BsAwardFill, title: 'Jane is a Superhost', text: 'Experienced, highly rated hosts committed to providing great stays.' },
            ].map(({ icon: Icon, title, text }) => (
              <div key={title} className="flex items-start gap-4"><Icon size={25} className="mt-0.5 shrink-0 text-slate-700" /><div><h3 className="font-semibold text-slate-900">{title}</h3><p className="mt-1 text-sm leading-6 text-slate-500">{text}</p></div></div>
            ))}
          </div>
        </section>

        <aside className={`${reserveBoxVisible ? 'block' : 'hidden'} lg:block`}>
          <div className="sticky top-48"><ReserveBox /></div>
        </aside>
      </div>
    </main>
  );
};

export default PlaceDetails;
