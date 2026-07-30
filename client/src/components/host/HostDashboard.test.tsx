import { render, screen } from "@testing-library/react";
import { MemoryRouter } from "react-router-dom";
import { describe, expect, it, vi } from "vitest";
import HostDashboard from "./HostDashboard";

const hostMocks = vi.hoisted(() => ({
  listOwned: vi.fn(),
  listForHost: vi.fn(),
}));

vi.mock("../../lib/hooks", () => ({
  useAuth: () => ({
    user: { _id: "host-1", name: "Ada Host", email: "ada@example.com", avatar: "", isAdmin: false },
  }),
}));

vi.mock("../../services", async (importOriginal) => {
  const original = await importOriginal<typeof import("../../services")>();
  return {
    ...original,
    placesService: {
      ...original.placesService,
      listOwned: hostMocks.listOwned,
    },
    bookingsService: {
      ...original.bookingsService,
      listForHost: hostMocks.listForHost,
    },
  };
});

describe("HostDashboard", () => {
  it("shows host listings, reservations and real portfolio totals", async () => {
    const place = {
      _id: "place-1",
      title: "Alpine home",
      address: "Zermatt, Switzerland",
      photos: [{ main: "/home.jpg", thumbnails: [] }],
      category: "trending",
      description: "Mountain home",
      perks: ["Wi-Fi"],
      extraInfo: "Quiet hours",
      maxGuests: 4,
      rating: 4.9,
      reviews: 10,
      price: 200,
    };
    hostMocks.listOwned.mockResolvedValueOnce([place]);
    hostMocks.listForHost.mockResolvedValueOnce([{
      _id: "booking-1",
      owner: { _id: "guest-1", name: "Grace Guest", email: "grace@example.com", avatar: "" },
      place,
      checkIn: "2099-08-10",
      checkOut: "2099-08-12",
      numOfGuests: { adults: 2, children: 0, infants: 0, pets: 0 },
      extraInfo: "",
      status: "confirmed",
      name: "Grace Guest",
      price: 400,
    }]);

    render(<MemoryRouter><HostDashboard /></MemoryRouter>);

    expect((await screen.findAllByRole("heading", { name: "Alpine home" })).length).toBeGreaterThan(0);
    expect(screen.getByText("Grace Guest")).toBeInTheDocument();
    expect(screen.getByText("400 CHF")).toBeInTheDocument();
    expect(screen.getAllByRole("link", { name: /list a new place/i })[0]).toHaveAttribute("href", "/host/listings/new");
    expect(screen.getByRole("link", { name: "Edit" })).toHaveAttribute("href", "/host/listings/place-1/edit");
  });
});
