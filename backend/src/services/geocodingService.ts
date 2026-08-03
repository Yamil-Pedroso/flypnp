interface NominatimResult {
  lat: string;
  lon: string;
  display_name: string;
  address?: {
    country?: string;
    country_code?: string;
  };
}

export interface GeocodingResult {
  latitude: number;
  longitude: number;
  country: string;
  countryCode: string;
  formattedAddress: string;
}

const cache = new Map<string, { expiresAt: number; value: GeocodingResult | null }>();
const cacheTtlMs = 24 * 60 * 60_000;
let lastRequestAt = 0;
let requestQueue: Promise<void> = Promise.resolve();

const normalizeAddress = (address: string) => address.trim().replace(/\s+/g, " ");

const waitForRateLimit = async () => {
  const waitMs = Math.max(0, 1_050 - (Date.now() - lastRequestAt));
  if (waitMs > 0) await new Promise((resolve) => setTimeout(resolve, waitMs));
  lastRequestAt = Date.now();
};

const runSerially = async <T>(operation: () => Promise<T>) => {
  const previous = requestQueue;
  let release!: () => void;
  requestQueue = new Promise<void>((resolve) => { release = resolve; });
  await previous;
  try {
    await waitForRateLimit();
    return await operation();
  } finally {
    release();
  }
};

export const geocodeAddress = async (rawAddress: string): Promise<GeocodingResult | null> => {
  const address = normalizeAddress(rawAddress);
  if (address.length < 5) return null;

  const cacheKey = address.toLowerCase();
  const cached = cache.get(cacheKey);
  if (cached && cached.expiresAt > Date.now()) return cached.value;

  const value = await runSerially(async () => {
    const baseUrl = (process.env.GEOCODING_BASE_URL ?? "https://nominatim.openstreetmap.org").replace(/\/$/, "");
    const params = new URLSearchParams({
      q: address,
      format: "jsonv2",
      addressdetails: "1",
      limit: "1",
    });
    const appName = process.env.APP_NAME?.trim() || "Flypnp";
    const contact = process.env.GEOCODING_CONTACT_EMAIL?.trim() || process.env.EMAIL_REPLY_TO?.trim() || "support@flypnp.com";
    const response = await fetch(`${baseUrl}/search?${params.toString()}`, {
      headers: {
        Accept: "application/json",
        "Accept-Language": "en",
        "User-Agent": `${appName}/1.0 (${contact})`,
      },
      signal: AbortSignal.timeout(8_000),
    });
    if (!response.ok) throw new Error(`Geocoding provider returned ${response.status}`);

    const [result] = await response.json() as NominatimResult[];
    if (!result) return null;
    const latitude = Number(result.lat);
    const longitude = Number(result.lon);
    if (!Number.isFinite(latitude) || !Number.isFinite(longitude)) return null;

    return {
      latitude,
      longitude,
      country: result.address?.country?.trim() || "",
      countryCode: result.address?.country_code?.trim().toUpperCase() || "",
      formattedAddress: result.display_name?.trim() || address,
    };
  });

  cache.set(cacheKey, { expiresAt: Date.now() + cacheTtlMs, value });
  return value;
};
