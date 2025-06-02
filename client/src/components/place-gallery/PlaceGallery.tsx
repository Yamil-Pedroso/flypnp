import { useState, useRef, useEffect } from "react";
import Trending from "./trending/Trending";
import Beachfront from "./beachfront/BeachFront";
import IconicCities from "./iconic-cities/IconicCities";
import { ToastContainer } from "react-toastify";
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

type ComponentType = {
  icon: JSX.Element;
  component: JSX.Element;
};

const PlaceGallery = () => {
  const [underlineStyle, setUnderlineStyle] = useState({ left: 0, width: 0 });
  const [activeComponent, setActiveComponent] =
    useState<keyof typeof components>("trending");
  const menuRef = useRef<HTMLDivElement>(null);

  const components: Record<string, ComponentType> = {
    trending: { icon: <FaFireAlt size={32} />, component: <Trending /> },
    beachfront: {
      icon: <FaUmbrellaBeach size={32} />,
      component: <Beachfront />,
    },
    iconicCities: {
      icon: <FaTreeCity size={32} />,
      component: <IconicCities />,
    },
    tinyHomes: {
      icon: <FaLaptopHouse size={32} />,
      component: <IconicCities />,
    },
    mansions: {
      icon: <GiFamilyHouse size={32} />,
      component: <IconicCities />,
    },
    huts: { icon: <FaShuttleVan size={32} />, component: <IconicCities /> },
    ski: { icon: <FaSkiing size={32} />, component: <IconicCities /> },
    amazingViews: {
      icon: <AiFillPicture size={32} />,
      component: <IconicCities />,
    },
    luxe: { icon: <MdFoodBank size={32} />, component: <IconicCities /> },
    design: {
      icon: <PiWarehouseFill size={32} />,
      component: <IconicCities />,
    },
    tropical: {
      icon: <GiTropicalFish size={32} />,
      component: <IconicCities />,
    },
    historicalHomes: {
      icon: <MdCastle size={32} />,
      component: <IconicCities />,
    },
    surfing: {
      icon: <MdOutlineSurfing size={32} />,
      component: <IconicCities />,
    },
    caves: { icon: <GiCaveEntrance size={32} />, component: <IconicCities /> },
    camping: { icon: <GiCampingTent size={32} />, component: <IconicCities /> },
  };

  const handleClick = (
    component: keyof typeof components,
    e: React.MouseEvent<HTMLButtonElement>
  ) => {
    setActiveComponent(component);
    const buttonRect = e.currentTarget.getBoundingClientRect();
    const containerRect = menuRef.current?.getBoundingClientRect();
    if (containerRect) {
      setUnderlineStyle({
        left: buttonRect.left - containerRect.left,
        width: buttonRect.width,
      });
    }
  };

  useEffect(() => {
    const initialButton = document.querySelector(
      `button[data-key="${activeComponent}"]`
    );
    if (initialButton && menuRef.current) {
      const buttonRect = initialButton.getBoundingClientRect();
      const containerRect = menuRef.current.getBoundingClientRect();
      setUnderlineStyle({
        left: buttonRect.left - containerRect.left,
        width: buttonRect.width,
      });
    }
  }, [activeComponent]);

  return (
    <div className="mt-[-2rem] border-t border-gray-300">
      <div className="place-gallery-wrapper">
        <div
          ref={menuRef}
          className="flex justify-center gap-4 mt-8 px-4 overflow-x-auto relative flex-wrap"
        >
          {Object.keys(components).map((key) => (
            <button
              key={key}
              data-key={key}
              className={`flex flex-col items-center px-4 py-2 transition-all duration-300 bg-white rounded-md shadow-md hover:shadow-lg border border-transparent ${
                activeComponent === key
                  ? "text-[#f94a51] font-semibold border-gray-400"
                  : "text-gray-500"
              }`}
              onClick={(e) => handleClick(key as keyof typeof components, e)}
            >
              <div className="flex items-center justify-center">
                {components[key as keyof typeof components].icon}
              </div>
              <p className="mt-1 text-sm capitalize">
                {key.replace(/([A-Z])/g, " $1")}
              </p>
            </button>
          ))}
          <div
            className="absolute bottom-0 h-[2px] bg-gray-800 transition-all duration-300"
            style={{ left: underlineStyle.left, width: underlineStyle.width }}
          ></div>
        </div>

        <div className="mt-6">
          {activeComponent && components[activeComponent].component}
        </div>
      </div>
      <ToastContainer />
    </div>
  );
};

export default PlaceGallery;
