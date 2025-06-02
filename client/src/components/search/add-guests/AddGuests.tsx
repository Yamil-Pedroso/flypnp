import { useState, useEffect } from "react";
import {
  FaPlusCircle,
  FaMinusCircle,
  FaSearch,
  FaUser,
  FaBaby,
} from "react-icons/fa";
import { MdPets, MdChildCare } from "react-icons/md";

const AddGuests = () => {
  const [bgWhiteActive, setBgWhiteActive] = useState(false);
  const [adult, setAdult] = useState(0);
  const [children, setChildren] = useState(0);
  const [infants, setInfants] = useState(0);
  const [pets, setPets] = useState(0);
  const [clickMainContainer, setClickMainContainer] = useState(false);

  const handleClickAdults = (count: number) => {
    if ((children > 0 || infants > 0 || pets > 0) && count < 1) return;
    if (count >= 0 && count <= 16) setAdult(count);
  };

  const handleClickChildren = (count: number) => {
    if (count < 0) return;
    if (adult === 0 && children === 0) {
      setAdult(1);
      setChildren(1);
    } else if (count <= 15) {
      setChildren(count);
    }
  };

  const handleClickInfants = (count: number) => {
    if (count < 0) return;
    if (adult === 0 && infants === 0) {
      setAdult(1);
      setInfants(1);
    } else if (count <= 5) {
      setInfants(count);
    }
  };

  const handleClickPets = (count: number) => {
    if (count < 0) return;
    if (adult === 0 && pets === 0) {
      setAdult(1);
      setPets(1);
    } else if (count <= 5) {
      setPets(count);
    }
  };

  const handleBgWhiteActive = (e: any) => {
    e.stopPropagation();
    setBgWhiteActive(!bgWhiteActive);
    handleGrowSearchIcon();
  };

  const clickOutside = (e: any) => {
    const wrapper = document.querySelector(".add-guests-wrapper");
    const headerGuests = document.querySelector(
      ".header-guests, .header-guests-two"
    ) as HTMLElement;
    if (
      wrapper &&
      !wrapper.contains(e.target) &&
      !headerGuests.contains(e.target)
    ) {
      setBgWhiteActive(false);
    }
    const searchIconWrapper = document.querySelector(".search-guests-wrapper");
    if (searchIconWrapper) {
      searchIconWrapper.classList.remove("search-wrapper-ready");
    }
  };

  const handleGrowSearchIcon = () => {
    const searchIconWrapper = document.querySelector(".search-guests-wrapper");
    if (searchIconWrapper) {
      searchIconWrapper.classList.add("search-wrapper-ready");
    }
  };

  useEffect(() => {
    document.addEventListener("click", clickOutside);
    return () => {
      document.removeEventListener("click", clickOutside);
    };
  }, []);

  const handleDropdownClick = (e: any) => e.stopPropagation();

  return (
    <div
      className="relative flex items-center bg-white text-gray-900 w-[22rem] h-full rounded-full"
      onClick={handleBgWhiteActive}
    >
      <div
        className="add-guests-wrapper flex justify-between items-center w-full h-full relative hover:bg-gray-300 rounded-full cursor-pointer"
        onClick={handleDropdownClick}
      >
        <div
          className={`flex flex-col justify-center h-full px-4 rounded-full ${
            bgWhiteActive ? "bg-neutral-800 text-white shadow-md" : ""
          }`}
        >
          <p className="text-sm">Who</p>
          <p className="text-base text-gray-400">
            {adult + children > 0
              ? `${adult + children} guests${
                  infants > 0 || pets > 0
                    ? `, ${
                        infants
                          ? `${infants} infant${infants > 1 ? "s" : ""}`
                          : ""
                      }${infants && pets ? ", " : ""}${
                        pets ? `${pets} pet${pets > 1 ? "s" : ""}` : ""
                      }`
                    : ""
                }`
              : "Add guests"}
          </p>
        </div>

        <div
          className={`absolute top-[5rem] right-0 z-50 bg-white rounded-2xl shadow-lg p-6 pt-4 w-[27rem] ${
            bgWhiteActive ? "block" : "hidden"
          }`}
        >
          {[
            {
              label: "Adults",
              sub: "Age 13 or above",
              count: adult,
              setter: setAdult,
              handler: handleClickAdults,
              disableMinus:
                adult === 0 && (children > 0 || infants > 0 || pets > 0),
            },
            {
              label: "Children",
              sub: "Age 2-12",
              count: children,
              setter: setChildren,
              handler: handleClickChildren,
              disableMinus: children === 0,
            },
            {
              label: "Infants",
              sub: "Under 2",
              count: infants,
              setter: setInfants,
              handler: handleClickInfants,
              disableMinus: infants === 0,
            },
            {
              label: "Pets",
              sub: "Bringing a service animal?",
              count: pets,
              setter: setPets,
              handler: handleClickPets,
              disableMinus: pets === 0,
              isLink: true,
            },
          ].map(({ label, sub, count, handler, disableMinus, isLink }, i) => (
            <div
              key={i}
              className="flex justify-between items-center border-b py-4"
            >
              <div>
                <p className="text-lg font-medium">{label}</p>
                {isLink ? (
                  <a href="#" className="text-gray-400 text-sm">
                    {sub}
                  </a>
                ) : (
                  <span className="text-gray-400 text-sm">{sub}</span>
                )}
              </div>
              <div className="flex items-center">
                <FaMinusCircle
                  onClick={() => handler(count - 1)}
                  className={`text-2xl ${
                    disableMinus
                      ? "text-gray-300 cursor-not-allowed"
                      : "text-gray-400 cursor-pointer"
                  }`}
                />
                <span className="mx-4 text-gray-500 text-lg">{count}</span>
                <FaPlusCircle
                  onClick={() => handler(count + 1)}
                  className="text-2xl text-gray-400 cursor-pointer"
                />
              </div>
            </div>
          ))}
        </div>

        {bgWhiteActive && adult > 0 && (
          <div className="absolute top-[5.2rem] left-[17.6rem] bg-neutral-800 text-white p-4 rounded-lg z-50 flex flex-col animate-bounce">
            {[
              { count: adult, icon: FaUser },
              { count: children, icon: MdChildCare },
              { count: infants, icon: FaBaby },
              { count: pets, icon: MdPets },
            ].map(({ count, icon: Icon }, idx) =>
              count > 0 ? (
                <div key={idx} className="flex mb-1">
                  {Array.from({ length: Math.min(count, 5) }, (_, i) => (
                    <Icon key={i} size={24} className="mr-1" />
                  ))}
                  {count > 5 && <span className="ml-1 text-lg">+</span>}
                </div>
              ) : null
            )}
          </div>
        )}
      </div>

      <div
        className={`search-guests-wrapper absolute right-0 mr-1 w-14 h-14 rounded-full bg-green-600 flex justify-center items-center transition-all duration-300 ${
          clickMainContainer ? "w-[7rem] rounded-full bg-green-700" : ""
        }`}
      >
        <FaSearch className="text-white text-xl" />
        {clickMainContainer && (
          <p className="text-white text-sm ml-2">Search</p>
        )}
      </div>
    </div>
  );
};

export default AddGuests;
