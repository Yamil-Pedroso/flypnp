/* eslint-disable @typescript-eslint/no-explicit-any */
import { useState, useEffect } from "react";
import { usePlaces } from "../../../../hooks";
import PlaceCard from "../../place-card/PlaceCard";
import { Place } from "../../../providers/PlacesProvider";

const Trending = () => {
  const [trendingPlaces, setTrendingPlaces] = useState<Place[]>([]);
  const { places, loading } = usePlaces();
  console.log("Trending places", places);

  useEffect(() => {
    if (!loading && Array.isArray(places)) {
      const trendingPlaces = places.filter(
        (place) => place.category === "trending"
      );
      setTrendingPlaces(trendingPlaces);
      console.log("places is an array:", places);
    } else {
      console.log("places is not an array:", places);
      setTrendingPlaces([]);
    }
  }, [places, loading]);

  if (loading) {
    return <div>Loading...</div>;
  }

  return (
    <div className="flex justify-center items-center flex-wrap gap-4 mt-6">
      {trendingPlaces.map((place: any, idx: number) => (
        <PlaceCard key={idx} place={place} />
      ))}
    </div>
  );
};

export default Trending;
