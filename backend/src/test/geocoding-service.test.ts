import { afterEach, describe, expect, it, vi } from "vitest";
import { geocodeAddress } from "../services/geocodingService";

describe("geocoding service", () => {
  afterEach(() => vi.unstubAllGlobals());

  it("normalizes a Nominatim result", async () => {
    const fetchMock = vi.fn().mockResolvedValue(new Response(JSON.stringify([{
      lat: "46.0207",
      lon: "7.7491",
      display_name: "Zermatt, Visp, Valais, Switzerland",
      address: { country: "Switzerland", country_code: "ch" },
    }]), { status: 200, headers: { "Content-Type": "application/json" } }));
    vi.stubGlobal("fetch", fetchMock);

    await expect(geocodeAddress("Bahnhofplatz 1, 3920 Zermatt, Switzerland unique-test"))
      .resolves.toEqual({
        latitude: 46.0207,
        longitude: 7.7491,
        country: "Switzerland",
        countryCode: "CH",
        formattedAddress: "Zermatt, Visp, Valais, Switzerland",
      });
    expect(fetchMock).toHaveBeenCalledOnce();
    expect(fetchMock.mock.calls[0][1].headers["User-Agent"]).toContain("Flypnp");
  });
});
