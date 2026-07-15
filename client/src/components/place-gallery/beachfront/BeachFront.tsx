import { usePlaces } from "../../../lib/hooks";
import PlaceCard from "../../place-card/PlaceCard";

const BeachFront = () => {
  const { places, loading } = usePlaces();
  const beachFrontPlaces = places.filter((place) => place.category === "beachFront");

  if (loading) {
    return <div>Loading...</div>;
  }

  return (
    <div className="flex justify-center items-center flex-wrap gap-4 mt-6">
      {beachFrontPlaces.map((place) => (
        <PlaceCard key={place._id} place={place} />
      ))}
    </div>
  );
};

export default BeachFront;
