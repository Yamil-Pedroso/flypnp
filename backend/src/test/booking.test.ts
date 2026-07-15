import type { Request, Response } from "express";
import { beforeEach, describe, expect, it, vi } from "vitest";

vi.mock("../models/Booking", () => ({
  Booking: { exists: vi.fn(), create: vi.fn() },
}));
vi.mock("../models/Place", () => ({
  Place: { findById: vi.fn() },
}));

import { Booking } from "../models/Booking";
import { Place } from "../models/Place";
import { createBookings } from "../controllers/bookingController";

const responseMock = () => {
  const response = { status: vi.fn(), json: vi.fn() };
  response.status.mockReturnValue(response);
  return response as unknown as Response;
};

describe("createBookings", () => {
  beforeEach(() => {
    vi.mocked(Place.findById).mockResolvedValue({
      _id: "place-1",
      id: "place-1",
      price: 120,
      maxGuests: 4,
    } as never);
    vi.mocked(Booking.exists).mockResolvedValue(null);
    vi.mocked(Booking.create).mockImplementation(async (value) => value as never);
  });

  it("calculates price on the server and forces pending status", async () => {
    const request = {
      user: { _id: "user-1", id: "user-1", name: "Ada", isAdmin: false },
      body: {
        place: "place-1",
        checkIn: "2026-08-01",
        checkOut: "2026-08-04",
        numOfGuests: { adults: 2 },
        status: "confirmed",
        price: 1,
      },
    } as unknown as Request;
    await createBookings(request, responseMock());
    expect(Booking.create).toHaveBeenCalledWith(
      expect.objectContaining({ price: 360, status: "pending", owner: "user-1" })
    );
  });
});
