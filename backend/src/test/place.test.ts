import type { Request, Response } from "express";
import { describe, expect, it, vi } from "vitest";

vi.mock("../models/Place", () => ({
  Place: { findById: vi.fn() },
}));
vi.mock("../models/Booking", () => ({
  Booking: { exists: vi.fn() },
}));

import { Booking } from "../models/Booking";
import { Place } from "../models/Place";
import { deletePlace } from "../controllers/placeController";

const responseMock = () => {
  const response = { status: vi.fn(), json: vi.fn() };
  response.status.mockReturnValue(response);
  return response as unknown as Response;
};

describe("host listings", () => {
  it("preserves listings that already have reservation history", async () => {
    const deleteOne = vi.fn();
    vi.mocked(Place.findById).mockResolvedValue({
      _id: "place-1",
      owner: { toString: () => "host-1" },
      deleteOne,
    } as never);
    vi.mocked(Booking.exists).mockResolvedValue({ _id: "booking-1" } as never);
    const request = {
      user: { _id: "host-1", id: "host-1", isAdmin: false },
      params: { id: "place-1" },
    } as unknown as Request;

    await expect(deletePlace(request, responseMock()))
      .rejects.toThrow("Listings with reservation history cannot be deleted");
    expect(deleteOne).not.toHaveBeenCalled();
  });
});
