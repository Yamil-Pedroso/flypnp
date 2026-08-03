import type { Request, Response } from "express";
import { beforeEach, describe, expect, it, vi } from "vitest";

vi.mock("../models/Booking", () => ({
  Booking: { exists: vi.fn(), create: vi.fn(), findById: vi.fn(), find: vi.fn() },
}));
vi.mock("../models/Place", () => ({
  Place: { findById: vi.fn(), find: vi.fn() },
}));
vi.mock("../models/Payment", () => ({
  Payment: { findOne: vi.fn() },
}));
const { cancelIntent } = vi.hoisted(() => ({ cancelIntent: vi.fn() }));
vi.mock("../config/stripe", () => ({
  stripe: { paymentIntents: { cancel: cancelIntent } },
}));

import { Booking } from "../models/Booking";
import { Place } from "../models/Place";
import { Payment } from "../models/Payment";
import { createBookings, deleteBooking, getHostBookings } from "../controllers/bookingController";

const responseMock = () => {
  const response = { status: vi.fn(), json: vi.fn() };
  response.status.mockReturnValue(response);
  return response as unknown as Response;
};

describe("createBookings", () => {
  beforeEach(() => {
    vi.mocked(Payment.findOne).mockResolvedValue(null);
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
        checkIn: "2099-08-01",
        checkOut: "2099-08-04",
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

  it("rejects a booking with past dates", async () => {
    const request = {
      user: { _id: "user-1", id: "user-1", name: "Ada", isAdmin: false },
      body: {
        place: "place-1",
        checkIn: "2020-08-01",
        checkOut: "2020-08-04",
        numOfGuests: { adults: 1 },
      },
    } as unknown as Request;

    await expect(createBookings(request, responseMock())).rejects.toThrow("checkIn cannot be in the past");
  });

  it("archives a trip instead of destroying its payment history", async () => {
    const save = vi.fn();
    const booking = {
      owner: { toString: () => "user-1" },
      status: "confirmed",
      archivedAt: undefined as Date | undefined,
      save,
    };
    vi.mocked(Booking.findById).mockResolvedValue(booking as never);
    const request = {
      user: { _id: "user-1", id: "user-1", name: "Ada", isAdmin: false },
      params: { id: "booking-1" },
    } as unknown as Request;

    await deleteBooking(request, responseMock());

    expect(booking.archivedAt).toBeInstanceOf(Date);
    expect(booking.status).toBe("confirmed");
    expect(save).toHaveBeenCalled();
  });

  it("cancels an open Stripe intent when a pending trip is removed", async () => {
    const paymentSave = vi.fn();
    const bookingSave = vi.fn();
    const payment = { stripeId: "pi_pending", status: "pending", save: paymentSave };
    const booking = {
      _id: "booking-1",
      owner: { toString: () => "user-1" },
      status: "pending",
      archivedAt: undefined as Date | undefined,
      save: bookingSave,
    };
    vi.mocked(Payment.findOne).mockResolvedValue(payment as never);
    vi.mocked(Booking.findById).mockResolvedValue(booking as never);
    const request = {
      user: { _id: "user-1", id: "user-1", name: "Ada", isAdmin: false },
      params: { id: "booking-1" },
    } as unknown as Request;

    await deleteBooking(request, responseMock());

    expect(cancelIntent).toHaveBeenCalledWith("pi_pending");
    expect(payment.status).toBe("cancelled");
    expect(booking.status).toBe("cancelled");
    expect(booking.archivedAt).toBeInstanceOf(Date);
  });

  it("returns bookings only for places owned by the host", async () => {
    vi.mocked(Place.find).mockReturnValue({
      select: vi.fn().mockResolvedValue([{ _id: "place-1" }, { _id: "place-2" }]),
    } as never);
    const sort = vi.fn().mockResolvedValue([{ _id: "booking-1", place: "place-1" }]);
    const secondPopulate = vi.fn().mockReturnValue({ sort });
    const firstPopulate = vi.fn().mockReturnValue({ populate: secondPopulate });
    vi.mocked(Booking.find).mockReturnValue({ populate: firstPopulate } as never);
    const response = responseMock();
    const request = {
      user: { _id: "host-1", id: "host-1", name: "Host", isAdmin: false },
    } as unknown as Request;

    await getHostBookings(request, response);

    expect(Place.find).toHaveBeenCalledWith({ owner: "host-1" });
    expect(Booking.find).toHaveBeenCalledWith({ place: { $in: ["place-1", "place-2"] } });
    expect(firstPopulate).toHaveBeenCalledWith("place");
    expect(secondPopulate).toHaveBeenCalledWith("owner", "name email avatar");
    expect(response.status).toHaveBeenCalledWith(200);
  });
});
