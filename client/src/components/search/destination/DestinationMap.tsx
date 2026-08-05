import { useEffect, useMemo, useRef, useState } from "react";
import { Heart, MapPin, Star } from "lucide-react";
import { AttributionControl, Map as MapLibreMap, Marker as MapLibreMarker, NavigationControl, type StyleSpecification } from "maplibre-gl";
import "maplibre-gl/dist/maplibre-gl.css";
import { toast } from "sonner";
import type { Place } from "../../../services";
import { useWishlist } from "../../../lib/hooks";
import type { DestinationCountry, DestinationRegion } from "./destinationRegions";

interface SimulatedPlace {
  place: Place;
  coordinates: [number, number];
  simulated: boolean;
}

interface DestinationMapProps {
  region: DestinationRegion;
  country: DestinationCountry | null;
  places: Place[];
  expanded?: boolean;
  onChoosePlace: (place: Place) => void;
}

const streetMapStyle: StyleSpecification = {
  version: 8,
  sources: {
    openstreetmap: {
      type: "raster",
      tiles: ["https://tile.openstreetmap.org/{z}/{x}/{y}.png"],
      tileSize: 256,
      maxzoom: 19,
      attribution: "© OpenStreetMap contributors",
    },
  },
  layers: [{ id: "openstreetmap", type: "raster", source: "openstreetmap" }],
};

const hashString = (value: string) => {
  let hash = 2166136261;
  for (let index = 0; index < value.length; index += 1) {
    hash ^= value.charCodeAt(index);
    hash = Math.imul(hash, 16777619);
  }
  return hash >>> 0;
};

const simulatedCoordinates = (place: Place, country: DestinationCountry, index: number): [number, number] => {
  const hash = hashString(`${country.name}-${place._id}-${index}`);
  const angle = ((hash % 360) * Math.PI) / 180;
  const distance = 0.3 + ((hash >>> 8) % 70) / 100;
  const spread = country.zoom >= 6 ? 1.35 : country.zoom >= 5 ? 3.5 : country.zoom >= 4 ? 6.5 : 10;
  const longitudeScale = Math.max(0.6, Math.cos((country.center[1] * Math.PI) / 180));
  return [
    country.center[0] + (Math.cos(angle) * distance * spread) / longitudeScale,
    Math.max(-82, Math.min(82, country.center[1] + Math.sin(angle) * distance * spread * 0.65)),
  ];
};

const DestinationMap = ({ region, country, places, expanded = false, onChoosePlace }: DestinationMapProps) => {
  const containerRef = useRef<HTMLDivElement>(null);
  const mapRef = useRef<MapLibreMap | null>(null);
  const markersRef = useRef<MapLibreMarker[]>([]);
  const [mapReady, setMapReady] = useState(false);
  const [selectedPlaceId, setSelectedPlaceId] = useState<string | null>(null);
  const [savingId, setSavingId] = useState<string | null>(null);
  const { wishlist, addWishlist, deleteWishlist } = useWishlist();

  const simulatedPlaces = useMemo<SimulatedPlace[]>(() => {
    if (!country) return [];
    const matches = places.filter((place) => {
      const haystack = `${place.title} ${place.address}`.toLowerCase();
      return place.country?.toLowerCase() === country.name.toLowerCase()
        || country.aliases.some((alias) => haystack.includes(alias));
    });
    const candidates = matches.length > 0 ? matches : places;
    return candidates
      .slice(0, 14)
      .map((place, index) => {
        const hasRealCoordinates = matches.length > 0
          && Number.isFinite(place.latitude)
          && Number.isFinite(place.longitude);
        return {
          place,
          coordinates: hasRealCoordinates
            ? [place.longitude!, place.latitude!]
            : simulatedCoordinates(place, country, index),
          simulated: !hasRealCoordinates,
        };
      });
  }, [country, places]);

  const simulatedCount = simulatedPlaces.filter((item) => item.simulated).length;

  const selectedPlace = simulatedPlaces.find(({ place }) => place._id === selectedPlaceId)?.place ?? null;

  useEffect(() => {
    if (!containerRef.current || mapRef.current) return;
    const map = new MapLibreMap({
      container: containerRef.current,
      // The standard OSM tiles include borders, country/city labels and streets
      // in the image itself, so a partially loaded vector style cannot leave a
      // blank land layer behind.
      style: streetMapStyle,
      center: region.center,
      zoom: region.zoom,
      maxZoom: 19,
      attributionControl: false,
    });
    map.addControl(new NavigationControl({ showCompass: false }), "top-right");
    map.addControl(new AttributionControl({ compact: true }), "bottom-right");
    map.on("load", () => {
      map.resize();
    });
    mapRef.current = map;
    // HTML price markers do not depend on the tile style being downloaded.
    // Render them immediately so the simulation remains usable on slow networks.
    setMapReady(true);
    return () => {
      markersRef.current.forEach((marker) => marker.remove());
      markersRef.current = [];
      map.remove();
      mapRef.current = null;
    };
  }, [region.center, region.zoom]);

  useEffect(() => {
    const container = containerRef.current;
    if (!container || typeof ResizeObserver === "undefined") return;
    let animationFrame = 0;
    const observer = new ResizeObserver(() => {
      window.cancelAnimationFrame(animationFrame);
      animationFrame = window.requestAnimationFrame(() => mapRef.current?.resize());
    });
    observer.observe(container);
    return () => {
      observer.disconnect();
      window.cancelAnimationFrame(animationFrame);
    };
  }, []);

  useEffect(() => {
    const map = mapRef.current;
    if (!map) return;
    const target = country ?? region;
    map.flyTo({ center: target.center, zoom: target.zoom, duration: 950, essential: true });
    setSelectedPlaceId(null);
  }, [country, region]);

  useEffect(() => {
    const map = mapRef.current;
    if (!map || !mapReady) return;
    markersRef.current.forEach((marker) => marker.remove());
    markersRef.current = simulatedPlaces.map(({ place, coordinates }) => {
      const markerButton = document.createElement("button");
      markerButton.type = "button";
      markerButton.className = `flypnp-price-marker${selectedPlaceId === place._id ? " is-selected" : ""}`;
      markerButton.textContent = `CHF ${place.price}`;
      markerButton.setAttribute("aria-label", `Show ${place.title}, CHF ${place.price} per night`);
      markerButton.addEventListener("click", (event) => {
        event.stopPropagation();
        setSelectedPlaceId(place._id);
        map.easeTo({ center: coordinates, duration: 500 });
      });
      return new MapLibreMarker({ element: markerButton, anchor: "bottom" }).setLngLat(coordinates).addTo(map);
    });
    return () => {
      markersRef.current.forEach((marker) => marker.remove());
      markersRef.current = [];
    };
  }, [mapReady, selectedPlaceId, simulatedPlaces]);

  const isSaved = (placeId: string) => wishlist.some((item) => item.place === placeId);
  const toggleWishlist = async (place: Place) => {
    try {
      setSavingId(place._id);
      if (isSaved(place._id)) {
        await deleteWishlist(place._id);
        toast.success("Removed from your wishlist");
      } else {
        await addWishlist(place._id, place.title, place.photos[0]?.main, "place");
        toast.success("Saved to your wishlist");
      }
    } catch {
      toast.error("Sign in to save this stay to your wishlist");
    } finally {
      setSavingId(null);
    }
  };

  return (
    <div className={`relative min-h-0 overflow-hidden bg-slate-100 ${expanded ? "h-full min-h-[22rem] rounded-none" : "h-[25rem] rounded-[1.5rem] lg:h-full lg:rounded-l-none"}`}>
      <div ref={containerRef} className="size-full" aria-label={`Interactive map of ${country?.name ?? region.name}`} />
      <div className="pointer-events-none absolute left-3 top-3 rounded-full border border-white/70 bg-white/90 px-3 py-1.5 text-xs font-semibold text-slate-700 shadow-sm">
        {country
          ? simulatedCount > 0
            ? `${simulatedPlaces.length} stays · ${simulatedCount} simulated`
            : `${simulatedPlaces.length} stays at verified locations`
          : "Choose a country to see stays"}
      </div>

      {country && simulatedPlaces.length === 0 && (
        <div className="absolute inset-0 grid place-items-center bg-white/55 p-6 text-center">
          <div className="rounded-2xl bg-white px-5 py-4 shadow-lg"><MapPin className="mx-auto size-6 text-emerald-600" /><p className="mt-2 text-sm font-semibold text-slate-900">No sample stays available yet</p></div>
        </div>
      )}

      {selectedPlace && (
        <article className="absolute bottom-3 left-3 right-3 overflow-hidden rounded-2xl border border-white/80 bg-white p-2 shadow-[0_18px_45px_rgba(15,23,42,0.28)] sm:right-auto sm:w-[22rem]">
          <div className="flex gap-3">
            <div className="h-24 w-28 shrink-0 overflow-hidden rounded-xl bg-slate-100">
              {selectedPlace.photos[0]?.main ? <img src={selectedPlace.photos[0].main} alt={selectedPlace.title} className="size-full object-cover" /> : <div className="grid size-full place-items-center"><MapPin className="text-slate-400" /></div>}
            </div>
            <div className="min-w-0 flex-1 py-1">
              <div className="flex items-start justify-between gap-2">
                <button type="button" onClick={() => onChoosePlace(selectedPlace)} className="min-w-0 text-left"><h3 className="truncate text-sm font-bold text-slate-950">{selectedPlace.title}</h3><p className="mt-0.5 truncate text-xs text-slate-500">{selectedPlace.address}</p></button>
                <button type="button" disabled={savingId === selectedPlace._id} onClick={() => void toggleWishlist(selectedPlace)} aria-label={isSaved(selectedPlace._id) ? `Remove ${selectedPlace.title} from wishlist` : `Save ${selectedPlace.title} to wishlist`} className="grid size-9 shrink-0 place-items-center rounded-full bg-slate-50 text-rose-500 transition hover:bg-rose-50 disabled:opacity-50"><Heart className={`size-5 ${isSaved(selectedPlace._id) ? "fill-current" : ""}`} /></button>
              </div>
              <div className="mt-3 flex items-center justify-between gap-3 text-xs"><span className="font-bold text-slate-950">CHF {selectedPlace.price} <span className="font-normal text-slate-500">night</span></span><span className="flex items-center gap-1 font-semibold"><Star className="size-3.5 fill-amber-400 text-amber-400" />{selectedPlace.rating.toFixed(1)}</span></div>
            </div>
          </div>
        </article>
      )}
    </div>
  );
};

export default DestinationMap;
