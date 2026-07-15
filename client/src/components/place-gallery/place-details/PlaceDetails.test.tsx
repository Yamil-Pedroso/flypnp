import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { MemoryRouter, Route, Routes } from "react-router-dom";
import { describe, expect, it, vi } from "vitest";
import PlaceDetails from "./PlaceDetails";

vi.mock("../../../lib/hooks", () => ({
  usePlaces: () => ({
    places: [{
      _id: "place-1",
      title: "Alpine hideaway",
      address: "Zermatt, Switzerland",
      photos: [{ main: "/main.jpg", thumbnails: ["/one.jpg", "/two.jpg"] }],
      category: "trending",
      description: "A warm chalet framed by quiet mountain views.",
      perks: ["Mountain view", "Breakfast", "Fireplace"],
      extraInfo: "",
      maxGuests: 4,
      rating: 4.96,
      reviews: 128,
      price: 250,
    }],
    loading: false,
    error: null,
    refresh: vi.fn(),
  }),
}));

vi.mock("./ReserveBox", () => ({
  default: () => <div data-testid="reserve-box">Reservation details</div>,
}));

describe("PlaceDetails", () => {
  it("keeps the place composition and opens the mobile reservation sheet", async () => {
    const user = userEvent.setup();
    render(
      <MemoryRouter initialEntries={["/place/trending/place-1"]}>
        <Routes>
          <Route path="/place/:category/:id" element={<PlaceDetails />} />
        </Routes>
      </MemoryRouter>,
    );

    expect(screen.getByRole("heading", { name: "Alpine hideaway" })).toBeInTheDocument();
    expect(screen.getByRole("button", { name: "Show all 3 photos" })).toBeInTheDocument();
    expect(screen.getByRole("link", { name: "Reserve" })).toHaveAttribute("href", "#reservation");
    expect(screen.getByRole("heading", { name: "A warm chalet framed by quiet mountain views." })).toBeInTheDocument();
    expect(screen.getAllByTestId("reserve-box")).toHaveLength(1);

    await user.click(screen.getByRole("button", { name: "Reserve" }));
    expect(screen.getByRole("dialog", { name: "Reserve this place" })).toBeInTheDocument();
    expect(screen.getAllByTestId("reserve-box")).toHaveLength(2);

    await user.click(screen.getByRole("button", { name: "Close reservation" }));
    expect(screen.queryByRole("dialog", { name: "Reserve this place" })).not.toBeInTheDocument();
  });
});
