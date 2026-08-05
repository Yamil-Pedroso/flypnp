import { useState, type ComponentType } from "react";
import { usePlaces } from "../../lib/hooks";
import PlaceCard from "../place-card/PlaceCard";
import { FaTreeCity, FaUmbrellaBeach } from "react-icons/fa6";
import {
  GiFamilyHouse,
  GiTropicalFish,
  GiCaveEntrance,
  GiCampingTent,
} from "react-icons/gi";
import {
  FaShuttleVan,
  FaSkiing,
  FaLaptopHouse,
  FaFireAlt,
} from "react-icons/fa";
import { AiFillPicture } from "react-icons/ai";
import { MdFoodBank, MdCastle, MdOutlineSurfing } from "react-icons/md";
import { PiWarehouseFill } from "react-icons/pi";

type Category = {
  key: string;
  label: string;
  icon: ComponentType<{ size?: number }>;
};

const categories: Category[] = [
  { key: "all", label: "Explore", icon: AiFillPicture },
  { key: "trending", label: "Trending", icon: FaFireAlt },
  { key: "beachFront", label: "Beachfront", icon: FaUmbrellaBeach },
  { key: "iconicCities", label: "Iconic cities", icon: FaTreeCity },
  { key: "tinyHomes", label: "Tiny homes", icon: FaLaptopHouse },
  { key: "mansions", label: "Mansions", icon: GiFamilyHouse },
  { key: "cabins", label: "Cabins", icon: FaShuttleVan },
  { key: "skiing", label: "Skiing", icon: FaSkiing },
  { key: "design", label: "Design", icon: PiWarehouseFill },
  { key: "tropical", label: "Tropical", icon: GiTropicalFish },
  { key: "castles", label: "Castles", icon: MdCastle },
  { key: "surfing", label: "Surfing", icon: MdOutlineSurfing },
  { key: "caves", label: "Caves", icon: GiCaveEntrance },
  { key: "camping", label: "Camping", icon: GiCampingTent },
  { key: "luxe", label: "Luxe", icon: MdFoodBank },
];

const PlaceGallery = () => {
  const [activeCategory, setActiveCategory] = useState("all");
  const { places, loading, error, refresh } = usePlaces();
  const visiblePlaces =
    activeCategory === "all"
      ? places
      : places.filter((place) => place.category === activeCategory);

  return (
    <section className="px-4 py-8 mx-auto max-w-7xl sm:px-6 lg:px-8">
      <div className="flex overflow-x-auto gap-2 px-4 pb-3 -mx-4 scrollbar-none snap-x sm:mx-0 sm:px-0">
        {categories.map(({ key, label, icon: Icon }) => (
          <button
            key={key}
            type="button"
            aria-pressed={activeCategory === key}
            className={`flex shrink-0 snap-start items-center gap-2 rounded-full border px-4 py-2.5 text-sm font-medium transition ${activeCategory === key ? "border-slate-900 bg-slate-900 text-white shadow-sm" : "border-slate-200 bg-white text-slate-600 hover:border-slate-400 hover:text-slate-950"}`}
            onClick={() => setActiveCategory(key)}
          >
            <Icon size={17} />
            <span>{label}</span>
          </button>
        ))}
      </div>

      {loading ? (
        <div
          className="grid grid-cols-1 gap-x-5 gap-y-8 pt-5 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4"
          aria-label="Loading stays"
        >
          {Array.from({ length: 8 }).map((_, index) => (
            <div
              key={index}
              className="h-80 rounded-3xl animate-pulse bg-slate-200"
            />
          ))}
        </div>
      ) : error ? (
        <div
          className="px-6 py-12 mt-5 text-center bg-rose-50 rounded-3xl border border-rose-100"
          role="alert"
        >
          <h2 className="text-xl font-semibold text-slate-900">
            We couldn’t load the stays
          </h2>
          <p className="mt-2 text-slate-600">
            Check that the backend is running and try again.
          </p>
          <button
            type="button"
            onClick={() => void refresh()}
            className="mt-5 rounded-full bg-slate-900 px-5 py-2.5 text-sm font-semibold text-white transition hover:bg-slate-700"
          >
            Try again
          </button>
        </div>
      ) : visiblePlaces.length ? (
        <div className="grid grid-cols-1 gap-x-5 gap-y-9 pt-5 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
          {visiblePlaces.map((place) => (
            <PlaceCard key={place._id} place={place} />
          ))}
        </div>
      ) : (
        <div className="px-6 py-16 mt-5 text-center bg-white rounded-3xl border border-dashed border-slate-300">
          <h2 className="text-xl font-semibold text-slate-900">
            No stays found here yet
          </h2>
          <p className="mt-2 text-slate-500">
            Try another category or clear your destination search.
          </p>
        </div>
      )}
    </section>
  );
};

export default PlaceGallery;
