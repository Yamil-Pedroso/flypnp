import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { MemoryRouter, Route, Routes, useLocation } from "react-router-dom";
import { describe, expect, it, vi } from "vitest";
import PlaceCard from "../place-card/PlaceCard";
import Search from "./Search";
import { SearchProvider } from "./SearchContext";

const searchMock = vi.hoisted(() => vi.fn());

vi.mock("../../lib/hooks", () => ({
  usePlaces: () => ({ search: searchMock, places: [{ address: "Zermatt, Switzerland" }] }),
}));

const place = {
  _id: "place-1",
  title: "Alpine hideaway",
  address: "Zermatt",
  photos: [{ main: "/alpine.jpg", thumbnails: [] }],
  category: "trending",
  description: "Mountain stay",
  perks: [],
  extraInfo: "",
  maxGuests: 4,
  rating: 4.9,
  reviews: 20,
  price: 250,
};

const LocationState = () => {
  const location = useLocation();
  return <output data-testid="location">{location.pathname}{location.search}</output>;
};

describe("travel search flow", () => {
  it("carries dates and every guest type from search to the selected place", async () => {
    const user = userEvent.setup();
    render(
      <MemoryRouter initialEntries={["/?destination=Zermatt&checkIn=2099-08-10&checkOut=2099-08-14&adults=1&children=1&infants=1&pets=1"]}>
        <SearchProvider>
          <Routes>
            <Route path="/" element={<><Search /><PlaceCard place={place} /></>} />
            <Route path="/place/:category/:id" element={<LocationState />} />
          </Routes>
        </SearchProvider>
      </MemoryRouter>,
    );

    await user.click(screen.getByRole("combobox", { name: "Where" }));
    expect(screen.getByTestId("destination-field")).toHaveClass("bg-slate-950", "text-white");
    expect(screen.getByRole("listbox", { name: "Suggested destinations" })).toBeInTheDocument();
    await user.click(screen.getByRole("option", { name: /Zermatt/ }));
    expect(screen.getByRole("combobox", { name: "Where" })).toHaveValue("Zermatt, Switzerland");

    const checkInButton = screen.getByRole("button", { name: "Check in" });
    await user.click(checkInButton);
    expect(checkInButton).toHaveClass("bg-slate-950", "text-white");
    expect(screen.getByRole("dialog", { name: "Choose dates" })).toBeInTheDocument();
    expect(screen.getByRole("button", { name: "Previous month" })).toBeInTheDocument();
    expect(screen.getByRole("button", { name: "Next month" })).toBeInTheDocument();
    await user.click(screen.getByRole("button", { name: "Close date picker" }));

    await user.click(screen.getByRole("link", { name: "View Alpine hideaway" }));
    const location = screen.getByTestId("location");
    expect(location).toHaveTextContent("/place/trending/place-1");
    expect(location).toHaveTextContent("checkIn=2099-08-10");
    expect(location).toHaveTextContent("checkOut=2099-08-14");
    expect(location).toHaveTextContent("adults=1");
    expect(location).toHaveTextContent("children=1");
    expect(location).toHaveTextContent("infants=1");
    expect(location).toHaveTextContent("pets=1");
  });
});
