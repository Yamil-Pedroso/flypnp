import { render, screen } from "@testing-library/react";
import { MemoryRouter, Route, Routes } from "react-router-dom";
import { describe, expect, it, vi } from "vitest";
import MyPayment from "./MyPayment";

vi.mock("./TestStripePayment", () => ({
  default: () => <div data-testid="stripe-form">Secure card form</div>,
}));

describe("MyPayment", () => {
  it("shows the trip, guest and price summary passed by the reservation", () => {
    const search = new URLSearchParams({
      checkIn: "2026-08-23",
      checkOut: "2026-08-26",
      guests: "2",
      infants: "1",
      pets: "1",
      price: "250",
      photo: "/chalet.jpg",
      title: "Alpine hideaway",
      description: "A warm chalet framed by quiet mountain views.",
      rating: "4.96",
      place: "place-1",
    });

    render(
      <MemoryRouter initialEntries={[`/my-payment?${search.toString()}`]}>
        <Routes><Route path="/my-payment" element={<MyPayment />} /></Routes>
      </MemoryRouter>,
    );

    expect(screen.getByRole("heading", { name: "Confirm and pay" })).toBeInTheDocument();
    expect(screen.getByRole("heading", { name: "Alpine hideaway" })).toBeInTheDocument();
    expect(screen.getByText("2 guests, 1 infant, 1 pet")).toBeInTheDocument();
    expect(screen.getByText("275.00 CHF")).toBeInTheDocument();
    expect(screen.getByTestId("stripe-form")).toBeInTheDocument();
  });

  it("shows a quoted service with the Flypnp fee", () => {
    const search = new URLSearchParams({
      serviceRequest: "service-request-1",
      productType: "service",
      checkIn: "2026-08-23",
      startTime: "14:30",
      guests: "2",
      price: "120",
      title: "Airport Transfer",
      description: "Private arrival transfer.",
    });

    render(
      <MemoryRouter initialEntries={[`/my-payment?${search.toString()}`]}>
        <Routes><Route path="/my-payment" element={<MyPayment />} /></Routes>
      </MemoryRouter>,
    );

    expect(screen.getByRole("heading", { name: "Your service" })).toBeInTheDocument();
    expect(screen.getByRole("heading", { name: "Airport Transfer" })).toBeInTheDocument();
    expect(screen.getByText("Quoted price")).toBeInTheDocument();
    expect(screen.getByText("132.00 CHF")).toBeInTheDocument();
  });
});
