import { usePlaces } from "../../../lib/hooks";
import PlaceCard from "../../place-card/PlaceCard";

const IconicCities = () => {
  const { places, loading } = usePlaces();
  const iconicCityPlaces = places.filter((place) => place.category === "iconicCities");

  if (loading) {
    return <div>Loading...</div>;
  }

  return (
    <div className="flex justify-center items-center flex-wrap gap-4 mt-6">
      {iconicCityPlaces.map((place) => (
        <PlaceCard key={place._id} place={place} />
      ))}
    </div>
  );
};

export default IconicCities;
