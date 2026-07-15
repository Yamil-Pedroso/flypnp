import { useState, type FormEvent } from "react";
import { CalendarDays, MapPin, Search as SearchIcon } from "lucide-react";
import { usePlaces } from "../../lib/hooks";
import AddGuests from "./add-guests/AddGuests";

const Search = () => {
  const [destination, setDestination] = useState("");
  const [checkIn, setCheckIn] = useState("");
  const [checkOut, setCheckOut] = useState("");
  const { search } = usePlaces();

  const handleSubmit = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    void search(destination);
  };

  return (
    <div className="mx-auto w-full max-w-5xl pb-4 pt-3 md:pt-4">
      <form
        aria-label="Search stays"
        onSubmit={handleSubmit}
        className="grid grid-cols-[1fr_auto_auto] items-center gap-1 rounded-2xl border border-slate-200 bg-white p-2 shadow-[0_12px_35px_rgba(15,23,42,0.10)] md:grid-cols-[1.4fr_1fr_1fr_0.8fr_auto] md:rounded-full"
      >
        <label className="flex min-w-0 items-center gap-3 rounded-xl px-3 py-2 transition hover:bg-slate-50 md:rounded-full">
          <MapPin className="size-5 shrink-0 text-emerald-600" aria-hidden="true" />
          <span className="min-w-0 flex-1">
            <span className="hidden text-xs font-semibold text-slate-900 md:block">Where</span>
            <input
              value={destination}
              onChange={(event) => setDestination(event.target.value)}
              className="w-full bg-transparent text-sm text-slate-900 outline-none placeholder:text-slate-500"
              placeholder="Search destinations"
            />
          </span>
        </label>

        <label className="hidden items-center gap-2 border-l border-slate-100 px-4 md:flex">
          <CalendarDays className="size-4 shrink-0 text-slate-400" aria-hidden="true" />
          <span className="min-w-0">
            <span className="block text-xs font-semibold">Check in</span>
            <input type="date" value={checkIn} onChange={(event) => setCheckIn(event.target.value)} className="w-full bg-transparent text-xs text-slate-500 outline-none" />
          </span>
        </label>

        <label className="hidden items-center gap-2 border-l border-slate-100 px-4 md:flex">
          <CalendarDays className="size-4 shrink-0 text-slate-400" aria-hidden="true" />
          <span className="min-w-0">
            <span className="block text-xs font-semibold">Check out</span>
            <input type="date" value={checkOut} onChange={(event) => setCheckOut(event.target.value)} className="w-full bg-transparent text-xs text-slate-500 outline-none" />
          </span>
        </label>

        <AddGuests />

        <button type="submit" className="flex size-11 items-center justify-center rounded-xl bg-emerald-600 text-white transition hover:bg-emerald-700 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-emerald-600 md:rounded-full" aria-label="Search">
          <SearchIcon className="size-5" aria-hidden="true" />
        </button>
      </form>
    </div>
  );
};

export default Search;
