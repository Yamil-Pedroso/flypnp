import { render, screen, waitFor } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { MemoryRouter, Route, Routes, useLocation } from "react-router-dom";
import { beforeEach, describe, expect, it, vi } from "vitest";
import ReserveBox from "./ReserveBox";
import { SearchProvider } from "../../search/SearchContext";

const reserveMocks = vi.hoisted(() => ({
  addBooking: vi.fn().mockResolvedValue({ _id: "booking-1", price: 750 }),
}));

vi.mock("../../../lib/hooks", () => ({
  usePlaces: () => ({
    places: [{
      _id: "place-1",
      title: "Alpine hideaway & spa",
      address: "Zermatt, Switzerland",
      photos: [{ main: "/main photo.jpg", thumbnails: [] }],
      category: "trending",
      description: "A warm chalet with mountain views.",
      perks: [],
      extraInfo: "",
      maxGuests: 4,
      rating: 4.96,
      reviews: 128,
      price: 250,
    }],
    loading: false,
  }),
  useAuth: () => ({
    user: { _id: "user-1", name: "Yami", email: "yami@example.com", avatar: "", isAdmin: false },
  }),
  useBooking: () => ({ addBooking: reserveMocks.addBooking }),
}));

const PaymentTarget = () => {
  const location = useLocation();
  return <div data-testid="payment-target">{location.search}</div>;
};

describe("ReserveBox", () => {
  beforeEach(() => {
    reserveMocks.addBooking.mockReset().mockResolvedValue({ _id: "booking-1", price: 750 });
  });

  it("creates the booking and takes the guest to payment", async () => {
    const user = userEvent.setup();
    render(
      <MemoryRouter initialEntries={["/place/trending/place-1?checkIn=2026-08-23&checkOut=2026-08-26&adults=1&children=0&infants=0&pets=0"]}>
        <SearchProvider>
        <Routes>
          <Route path="/place/:category/:id" element={<ReserveBox />} />
          <Route path="/my-payment" element={<PaymentTarget />} />
        </Routes>
        </SearchProvider>
      </MemoryRouter>,
    );

    await user.click(screen.getByRole("button", { name: "Reserve" }));

    await waitFor(() => expect(reserveMocks.addBooking).toHaveBeenCalledWith(expect.objectContaining({
      place: "place-1",
      checkIn: "2026-08-23",
      checkOut: "2026-08-26",
      numOfGuests: { adults: 1, children: 0, infants: 0, pets: 0 },
    })));
    const query = screen.getByTestId("payment-target").textContent ?? "";
    expect(query).toContain("title=Alpine+hideaway+%26+spa");
    expect(query).toContain("place=place-1");
    expect(query).toContain("booking=booking-1");
    expect(query).toContain("price=750");
    expect(query).toContain("user=user-1");
  });

  it("shows the backend reason when the reservation is rejected", async () => {
    reserveMocks.addBooking.mockRejectedValueOnce(new Error("This place is unavailable for the selected dates"));
    const user = userEvent.setup();
    render(
      <MemoryRouter initialEntries={["/place/trending/place-1?checkIn=2026-08-23&checkOut=2026-08-26&adults=1&children=0&infants=0&pets=0"]}>
        <SearchProvider>
        <Routes><Route path="/place/:category/:id" element={<ReserveBox />} /></Routes>
        </SearchProvider>
      </MemoryRouter>,
    );

    await user.click(screen.getByRole("button", { name: "Reserve" }));
    expect(await screen.findByRole("alert")).toHaveTextContent("This place is unavailable for the selected dates");
  });
});
