// Tailwind-based SearchDestination Component
import { useState, useEffect } from "react";
import images from "../../../assets/images";
import { useTranslation } from "react-i18next";

interface SearchDestinationProps {
  img?: string;
  titleKey: string;
}

const searchDestinationData: SearchDestinationProps[] = [
  {
    img: images.map1,
    titleKey: "destinationExtra.flexible",
  },
  {
    img: images.map2,
    titleKey: "regions.southeastAsia",
  },
  {
    img: images.map3,
    titleKey: "regions.germany",
  },
  {
    img: images.map4,
    titleKey: "regions.unitedStates",
  },
  {
    img: images.map5,
    titleKey: "regions.italy",
  },
  {
    img: images.map6,
    titleKey: "regions.africa",
  },
];

const SearchDestination = () => {
  const [bgWhiteActive, setBgWhiteActive] = useState(false);
  const { t } = useTranslation("search");

  const handleBgWhiteActive = (e: React.MouseEvent<HTMLElement>) => {
    e.stopPropagation();
    setBgWhiteActive(!bgWhiteActive);
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

  const handleInnerClick = (e: React.MouseEvent<HTMLElement>) => {
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
              {t("where")}
            </label>
            <input
              type="text"
              placeholder={t("searchDestinations")}
              className="text-white bg-neutral-800 placeholder:text-neutral-400 border-none outline-none w-48 text-base"
            />
          </div>
        ) : (
          <div className="ml-6" onClick={handleBgWhiteActive}>
            <p className="text-sm">{t("where")}</p>
            <p className="text-neutral-500">{t("searchDestinations")}</p>
          </div>
        )}
      </div>
      {bgWhiteActive && (
        <div className="absolute top-20 w-[32rem] h-[30rem] bg-white rounded-2xl shadow-lg z-50 overflow-hidden">
          <p className="pt-11 pl-6 ml-3 text-xs font-bold text-neutral-700">
            {t("destinationExtra.searchByRegion")}
          </p>
          <div className="mt-9 flex justify-center items-center flex-wrap">
            {searchDestinationData.map((item, index) => (
              <div
                key={index}
                className="flex flex-col justify-center items-center pb-6 mx-2"
              >
                <img
                  src={item.img}
                  alt={t("destinationExtra.mapRepresenting", { region: t(item.titleKey) })}
                  className="w-[8.5rem] h-[8.3rem] rounded-lg border border-gray-300"
                />
                <p className="mt-1 text-sm text-neutral-500">{t(item.titleKey)}</p>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};

export default SearchDestination;
