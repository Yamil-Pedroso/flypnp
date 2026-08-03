import type { Request, Response } from "express";
import { beforeEach, describe, expect, it, vi } from "vitest";

vi.mock("../models/Place", () => ({
  Place: { create: vi.fn() },
}));
vi.mock("../models/Booking", () => ({
  Booking: { exists: vi.fn() },
}));
vi.mock("../services/geocodingService", () => ({
  geocodeAddress: vi.fn(),
}));

import { Place } from "../models/Place";
import { geocodeAddress } from "../services/geocodingService";
import { addPlace } from "../controllers/placeController";

const responseMock = () => {
  const response = { status: vi.fn(), json: vi.fn() };
  response.status.mockReturnValue(response);
  return response as unknown as Response;
};

describe("place geocoding", () => {
  beforeEach(() => vi.clearAllMocks());

  it("stores verified coordinates and a GeoJSON point when a host creates a listing", async () => {
    vi.mocked(geocodeAddress).mockResolvedValue({
      latitude: 46.0207,
      longitude: 7.7491,
      country: "Switzerland",
      countryCode: "CH",
      formattedAddress: "Zermatt, Switzerland",
    });
    vi.mocked(Place.create).mockImplementation(async (value) => value as never);
    const request = {
      user: { _id: "host-1" },
      body: {
        title: "Alpine home",
        address: "Zermatt, Switzerland",
        photos: [{ main: "/home.jpg", thumbnails: [] }],
        category: "trending",
        description: "Mountain home",
        perks: [],
        extraInfo: "Quiet hours",
        maxGuests: 4,
        price: 220,
      },
    } as unknown as Request;

    await addPlace(request, responseMock());

    expect(Place.create).toHaveBeenCalledWith(expect.objectContaining({
      country: "Switzerland",
      countryCode: "CH",
      latitude: 46.0207,
      longitude: 7.7491,
      location: { type: "Point", coordinates: [7.7491, 46.0207] },
    }));
  });

  it("rejects an address that cannot be located", async () => {
    vi.mocked(geocodeAddress).mockResolvedValue(null);
    const request = {
      user: { _id: "host-1" },
      body: {
        title: "Unknown home",
        address: "Nowhere 99999",
        photos: [],
        category: "trending",
        description: "Unknown",
        perks: [],
        extraInfo: "Unknown",
        maxGuests: 1,
        price: 100,
      },
    } as unknown as Request;

    await expect(addPlace(request, responseMock())).rejects.toMatchObject({ statusCode: 422 });
    expect(Place.create).not.toHaveBeenCalled();
  });
});
