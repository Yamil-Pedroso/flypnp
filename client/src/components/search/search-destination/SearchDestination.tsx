// Tailwind-based SearchDestination Component
import { useState, useEffect } from "react";
import images from "../../../assets/images";

interface SearchDestinationProps {
  img?: string;
  title: string;
}

const searchDestinationData: SearchDestinationProps[] = [
  {
    img: images.map1,
    title: "I'm flexible",
  },
  {
    img: images.map2,
    title: "Southeast Asia",
  },
  {
    img: images.map3,
    title: "Germany",
  },
  {
    img: images.map4,
    title: "United States",
  },
  {
    img: images.map5,
    title: "Italy",
  },
  {
    img: images.map6,
    title: "Africa",
  },
];

const SearchDestination = () => {
  const [bgWhiteActive, setBgWhiteActive] = useState(false);
  const [defaultSearchDest, setDefaultSearchDest] = useState<boolean>(true);

  const handleBgWhiteActive = (e: any) => {
    e.stopPropagation();
    setBgWhiteActive(!bgWhiteActive);
    setDefaultSearchDest(false);
    handleGrowSearchIcon();
  };

  const clickOutside = (e: MouseEvent) => {
    const wrapper = document.querySelector(".search-dest-wrapper");
    const searchIcon = document.querySelector(".search-wrapper");
    if (wrapper && !wrapper.contains(e.target as Node)) {
      setBgWhiteActive(false);
      if (searchIcon) {
        searchIcon.classList.remove("search-wrapper-ready");
      }
    }
  };

  const handleGrowSearchIcon = () => {
    const searchIcon = document.querySelector(".search-guests-wrapper");
    if (searchIcon) {
      searchIcon.classList.add("search-wrapper-ready");
    }
  };

  useEffect(() => {
    document.addEventListener("click", clickOutside);
    return () => {
      document.removeEventListener("click", clickOutside);
    };
  }, []);

  const handleInnerClick = (e: any) => {
    e.stopPropagation();
  };

  return (
    <div
      onClick={handleInnerClick}
      className="relative w-[22rem] h-full bg-white flex items-center rounded-full"
    >
      <div className="search-dest-wrapper w-full h-full flex justify-between items-center relative hover:bg-neutral-300 rounded-full cursor-pointer">
        {bgWhiteActive ? (
          <div className="flex flex-col justify-center w-full h-full bg-neutral-800 rounded-full shadow-md px-6">
            <label htmlFor="" className="text-white text-sm">
              Where
            </label>
            <input
              type="text"
              placeholder="Search destinations"
              className="text-white bg-neutral-800 placeholder:text-neutral-400 border-none outline-none w-48 text-base"
            />
          </div>
        ) : (
          <div className="ml-6" onClick={handleBgWhiteActive}>
            <p className="text-sm">Where</p>
            <p className="text-neutral-500">Search destinations</p>
          </div>
        )}
      </div>
      {bgWhiteActive && (
        <div className="absolute top-20 w-[32rem] h-[30rem] bg-white rounded-2xl shadow-lg z-50 overflow-hidden">
          <p className="pt-11 pl-6 ml-3 text-xs font-bold text-neutral-700">
            Search by region
          </p>
          <div className="mt-9 flex justify-center items-center flex-wrap">
            {searchDestinationData.map((item, index) => (
              <div
                key={index}
                className="flex flex-col justify-center items-center pb-6 mx-2"
              >
                <img
                  src={item.img}
                  alt="map"
                  className="w-[8.5rem] h-[8.3rem] rounded-lg border border-gray-300"
                />
                <p className="mt-1 text-sm text-neutral-500">{item.title}</p>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};

export default SearchDestination;
