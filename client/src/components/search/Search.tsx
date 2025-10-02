import { useState, useEffect } from "react";
import SearchDestination from "./search-destination/SearchDestination";
import CheckInCheckOut from "./check-in-out/CheckInCheckOut";
import AddGuests from "./add-guests/AddGuests";
import "./search.css";

interface SearchProps {
  menuClick: boolean;
}

const Search = ({ menuClick }: SearchProps) => {
  const [clickMainContainer, setClickMainContainer] = useState(false);

  console.log("click main container", clickMainContainer);

  const handleClickedMainContainer = () => {
    setClickMainContainer(true);
    const el = document.querySelector(".search-guests-wrapper");
    if (el) el.classList.add("search-wrapper-ready");
  };

  useEffect(() => {}, []);

  return (
    <div className="search-container" onClick={handleClickedMainContainer}>
      <SearchDestination />
      <CheckInCheckOut menuClick={menuClick} />
      <AddGuests />
    </div>
  );
};

export default Search;
