import { usePlaces } from "../../../lib/hooks";
import PlaceCard from "../../place-card/PlaceCard";
import { useTranslation } from "react-i18next";

const BeachFront = () => {
  const { t } = useTranslation("places");
  const { places, loading } = usePlaces();
  const beachFrontPlaces = places.filter((place) => place.category === "beachFront");

  if (loading) {
    return <div>{t("gallery.loading")}</div>;
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
