import { useState, type FormEvent } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { Search as SearchIcon } from "lucide-react";
import { usePlaces } from "../../lib/hooks";
import AddGuests from "./add-guests/AddGuests";
import { getTravelParams, useTravelSearch } from "./SearchContext";
import DateRangePicker from "./date-range/DateRangePicker";
import DestinationPicker from "./destination/DestinationPicker";
import { useTranslation } from "react-i18next";

const Search = () => {
  const { destination, checkIn, checkOut, guests } = useTravelSearch();
  const [validationError, setValidationError] = useState("");
  const { search } = usePlaces();
  const navigate = useNavigate();
  const location = useLocation();
  const experienceMode = location.pathname.startsWith("/experiences");
  const { t } = useTranslation("search");

  const handleSubmit = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    if (
      !experienceMode &&
      ((checkIn && !checkOut) || (!checkIn && checkOut))
    ) {
      setValidationError(t("validation.chooseBothDates"));
      return;
    }
    if (!experienceMode && checkIn && checkOut && checkOut <= checkIn) {
      setValidationError(t("validation.checkoutAfter"));
      return;
    }
    setValidationError("");
    if (experienceMode) {
      navigate(`/experiences?${getTravelParams({ destination, checkIn, checkOut: "", guests }).toString()}`);
    } else {
      void search(destination);
      navigate(`/?${getTravelParams({ destination, checkIn, checkOut, guests }).toString()}`);
    }
  };

  return (
    <div className="mx-auto w-full max-w-5xl pb-4 pt-3 md:pt-4">
      <form
        aria-label={experienceMode ? t("searchExperiences") : t("searchStays")}
        onSubmit={handleSubmit}
        className="relative grid grid-cols-[1fr_auto_auto] items-center gap-1 rounded-2xl border border-slate-200 bg-white p-2 shadow-[0_12px_35px_rgba(15,23,42,0.10)] md:grid-cols-[1.4fr_1fr_1fr_0.8fr_auto] md:rounded-full"
      >
        <DestinationPicker />

        <DateRangePicker />

        <AddGuests />

        <button type="submit" className="flex size-11 items-center justify-center rounded-xl bg-emerald-600 text-white transition hover:bg-emerald-700 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-emerald-600 md:rounded-full" aria-label={t("search")}>
          <SearchIcon className="size-5" aria-hidden="true" />
        </button>
      </form>
      {validationError && <p role="alert" className="mt-2 px-4 text-xs font-semibold text-rose-600">{validationError}</p>}
    </div>
  );
};

export default Search;
