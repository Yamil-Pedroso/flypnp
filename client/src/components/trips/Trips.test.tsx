import { render, screen, waitFor } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { MemoryRouter } from "react-router-dom";
import { describe, expect, it, vi } from "vitest";
import Trips from "./Trips";

const bookingState = vi.hoisted(() => ({
  deleteBooking: vi.fn().mockResolvedValue(undefined),
  bookings: [
    {
      _id: "pending-trip",
      owner: "user-1",
      place: { _id: "place-3", title: "Pending escape", address: "Bern", photos: [{ main: "/pending.jpg", thumbnails: [] }], category: "trending", description: "Quiet escape", perks: [], extraInfo: "", maxGuests: 2, rating: 4.7, reviews: 8, price: 200 },
      checkIn: "2099-09-10",
      checkOut: "2099-09-12",
      numOfGuests: { adults: 1, children: 0, infants: 0, pets: 0 },
      extraInfo: "",
      status: "pending" as const,
      name: "Yami",
      price: 400,
    },
    {
      _id: "future-trip",
      owner: "user-1",
      place: { _id: "place-1", title: "Alpine hideaway", address: "Zermatt", photos: [{ main: "/future.jpg", thumbnails: [] }], category: "trending", description: "", perks: [], extraInfo: "", maxGuests: 4, rating: 4.9, reviews: 20, price: 250 },
      checkIn: "2099-08-10",
      checkOut: "2099-08-14",
      numOfGuests: { adults: 2, children: 1, infants: 0, pets: 0 },
      extraInfo: "",
      status: "confirmed" as const,
      name: "Yami",
      price: 1000,
    },
    {
      _id: "past-trip",
      owner: "user-1",
      place: { _id: "place-2", title: "Lake memory", address: "Lucerne", photos: [{ main: "/past.jpg", thumbnails: [] }], category: "iconicCities", description: "", perks: [], extraInfo: "", maxGuests: 2, rating: 4.8, reviews: 12, price: 180 },
      checkIn: "2020-05-10",
      checkOut: "2020-05-12",
      numOfGuests: { adults: 1, children: 0, infants: 0, pets: 0 },
      extraInfo: "",
      status: "confirmed" as const,
      name: "Yami",
      price: 360,
    },
  ],
}));

vi.mock("../../lib/hooks", () => ({
  useBooking: () => ({ bookings: bookingState.bookings, loading: false, error: null, refresh: vi.fn(), deleteBooking: bookingState.deleteBooking }),
  useExperiences: () => ({ bookings: [], bookingsLoading: false, deleteBooking: vi.fn() }),
}));

vi.mock("../../services", async (importOriginal) => {
  const original = await importOriginal<typeof import("../../services")>();
  return {
    ...original,
    travelServicesService: {
      listRequests: vi.fn().mockResolvedValue([]),
      cancelRequest: vi.fn().mockResolvedValue(undefined),
    },
  };
});

describe("Trips", () => {
  it("separates upcoming trips from past memories", async () => {
    const user = userEvent.setup();
    render(<MemoryRouter><Trips /></MemoryRouter>);

    expect(await screen.findByRole("heading", { name: "Alpine hideaway" })).toBeInTheDocument();
    expect(screen.queryByRole("heading", { name: "Lake memory" })).not.toBeInTheDocument();
    expect(screen.getByText("3 guests")).toBeInTheDocument();
    const paymentLink = screen.getByRole("link", { name: "Complete payment" });
    expect(paymentLink).toHaveAttribute("href", expect.stringContaining("/my-payment?"));
    expect(paymentLink).toHaveAttribute("href", expect.stringContaining("booking=pending-trip"));

    await user.click(screen.getByRole("button", { name: "Delete trip Alpine hideaway" }));
    expect(screen.getByRole("dialog", { name: "Delete trip" })).toBeInTheDocument();
    await user.click(screen.getByRole("button", { name: "Remove trip" }));
    await waitFor(() => expect(bookingState.deleteBooking).toHaveBeenCalledWith("future-trip"));
    await waitFor(() => expect(screen.queryByRole("dialog", { name: "Delete trip" })).not.toBeInTheDocument());

    await user.click(screen.getByRole("tab", { name: /Past/ }));

    expect(screen.getByRole("heading", { name: "Lake memory" })).toBeInTheDocument();
    expect(screen.queryByRole("heading", { name: "Alpine hideaway" })).not.toBeInTheDocument();
  });

  it("shows the original Flypnp drawing when there are no trips", async () => {
    const savedBookings = bookingState.bookings;
    bookingState.bookings = [];

    render(<MemoryRouter><Trips /></MemoryRouter>);

    expect(await screen.findByRole("img", { name: "Flypnp empty trips drawing" })).toBeInTheDocument();
    expect(screen.getByRole("heading", { name: "No trips booked… yet!" })).toBeInTheDocument();
    bookingState.bookings = savedBookings;
  });
});
