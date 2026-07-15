import type { GuestCount } from "../../services";

export interface SearchContextType {
  destination: string;
  setDestination: (value: string) => void;
  checkIn: string;
  setCheckIn: (value: string) => void;
  checkOut: string;
  setCheckOut: (value: string) => void;
  guests: GuestCount;
  setGuests: (value: GuestCount | ((current: GuestCount) => GuestCount)) => void;
}
