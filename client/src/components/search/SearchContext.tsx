import { createContext, useContext, useState, type ReactNode } from "react";
import { useSearchParams } from "react-router-dom";
import type { GuestCount } from "../../services";
import type { SearchContextType } from "./SearchContextType";

const parseCount = (value: string | null) => {
  const count = Number(value);
  return Number.isInteger(count) && count >= 0 ? count : 0;
};

export const getTravelParams = (values: {
  destination?: string;
  checkIn: string;
  checkOut: string;
  guests: GuestCount;
}) => {
  const params = new URLSearchParams();
  if (values.destination?.trim()) params.set("destination", values.destination.trim());
  if (values.checkIn) params.set("checkIn", values.checkIn);
  if (values.checkOut) params.set("checkOut", values.checkOut);
  params.set("adults", String(values.guests.adults));
  params.set("children", String(values.guests.children));
  params.set("infants", String(values.guests.infants));
  params.set("pets", String(values.guests.pets));
  return params;
};

const SearchContext = createContext<SearchContextType | null>(null);

export const SearchProvider = ({ children }: { children: ReactNode }) => {
  const [initialParams] = useSearchParams();
  const [destination, setDestination] = useState(() => initialParams.get("destination") ?? "");
  const [checkIn, setCheckIn] = useState(() => initialParams.get("checkIn") ?? "");
  const [checkOut, setCheckOut] = useState(() => initialParams.get("checkOut") ?? "");
  const [guests, setGuests] = useState<GuestCount>(() => ({
    adults: parseCount(initialParams.get("adults")),
    children: parseCount(initialParams.get("children")),
    infants: parseCount(initialParams.get("infants")),
    pets: parseCount(initialParams.get("pets")),
  }));

  return (
    <SearchContext.Provider value={{ destination, setDestination, checkIn, setCheckIn, checkOut, setCheckOut, guests, setGuests }}>
      {children}
    </SearchContext.Provider>
  );
};

export const useTravelSearch = () => {
  const context = useContext(SearchContext);
  if (!context) throw new Error("useTravelSearch must be used inside SearchProvider");
  return context;
};
