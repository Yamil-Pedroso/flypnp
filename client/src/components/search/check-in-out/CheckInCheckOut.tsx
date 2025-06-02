import { useState, useEffect } from "react";
import CalendarComp from "../../common/calendar/CalendarComp";

interface CheckInCheckOutProps {
  menuClick: boolean;
}

const CheckInCheckOut = ({ menuClick }: CheckInCheckOutProps) => {
  const [bgWhiteActive, setBgWhiteActive] = useState(false);
  const [bgWhiteActiveTwo, setBgWhiteActiveTwo] = useState(false);

  const handleBgWhiteActive = (
    type: "check-in" | "check-out",
    e: React.MouseEvent<HTMLDivElement>
  ) => {
    e.stopPropagation();
    if (type === "check-in") {
      setBgWhiteActive(true);
      setBgWhiteActiveTwo(false);
    } else {
      setBgWhiteActive(false);
      setBgWhiteActiveTwo(true);
    }
    handleGrowSearchIcon();
  };

  useEffect(() => {
    const clickOutside = (e: MouseEvent) => {
      const wrapper = document.querySelector(".check-in-out-wrapper");
      if (wrapper && !wrapper.contains(e.target as Node)) {
        setBgWhiteActive(false);
        setBgWhiteActiveTwo(false);
        const searchIcon = document.querySelector(".search-wrapper");
        if (searchIcon) {
          searchIcon.classList.remove("search-wrapper-ready");
        }
      }
    };

    document.addEventListener("click", clickOutside);
    return () => {
      document.removeEventListener("click", clickOutside);
    };
  }, []);

  const handleGrowSearchIcon = () => {
    const searchIcon = document.querySelector(".search-guests-wrapper");
    if (searchIcon) {
      searchIcon.classList.add("search-wrapper-ready");
    }
  };

  const handleInnerClick = (e: React.MouseEvent<HTMLDivElement>) => {
    e.stopPropagation();
  };

  return (
    <div
      className="relative w-[25rem] h-full text-sm"
      onClick={handleInnerClick}
    >
      <div className="flex justify-around items-center w-full h-full bg-white text-[#2a2a2a] check-in-out-wrapper">
        <div className="w-[0.1rem] h-10 bg-[#dbdbdb]" />
        {menuClick ? (
          bgWhiteActive ? (
            <div className="w-full ml-6 flex flex-col justify-center hover:bg-[#dbdbdb] hover:rounded-full cursor-pointer">
              <p className="ml-6">Date</p>
              <p className="ml-6 text-[#909090] text-base">Check in</p>
            </div>
          ) : (
            <div className="w-full ml-6 flex flex-col justify-center hover:bg-[#dbdbdb] hover:rounded-full cursor-pointer">
              <p className="ml-6">Date</p>
              <p className="ml-6 text-[#909090] text-base">Add dates</p>
            </div>
          )
        ) : (
          <>
            <div
              className={`${
                bgWhiteActive
                  ? "bg-[#424242] text-white shadow-lg rounded-full"
                  : ""
              } w-full h-full flex flex-col justify-center cursor-pointer hover:bg-[#dbdbdb] hover:rounded-full`}
              onClick={(e) => handleBgWhiteActive("check-in", e)}
            >
              <p className="ml-6">Check in</p>
              <p className="ml-6 text-[#909090] text-base">Add dates</p>
            </div>
            <div className="w-[0.1rem] h-10 bg-[#dbdbdb]" />
            <div
              className={`${
                bgWhiteActiveTwo
                  ? "bg-[#424242] text-white shadow-lg rounded-full"
                  : ""
              } w-full h-full flex flex-col justify-center cursor-pointer hover:bg-[#dbdbdb] hover:rounded-full`}
              onClick={(e) => handleBgWhiteActive("check-out", e)}
            >
              <p className="ml-6">Check out</p>
              <p className="ml-6 text-[#909090] text-base">Add dates</p>
            </div>
          </>
        )}
        <div className="w-[0.1rem] h-10 bg-[#dbdbdb]" />
      </div>
      {(bgWhiteActive || bgWhiteActiveTwo) && (
        <div className="absolute top-20 right-[-17.5rem] w-[55rem] h-[35rem] bg-white shadow-lg rounded-[3rem] z-[999] flex justify-center items-center">
          <CalendarComp />
        </div>
      )}
    </div>
  );
};

export default CheckInCheckOut;
