import { usePlaces } from "../../../lib/hooks";
import PlaceCard from "../../place-card/PlaceCard";
import { useTranslation } from "react-i18next";

const Trending = () => {
  const { t } = useTranslation("places");
  const { places, loading } = usePlaces();
  const trendingPlaces = places.filter((place) => place.category === "trending");

  if (loading) {
    return <div>{t("gallery.loading")}</div>;
  }

  return (
    <div className="flex justify-center items-center flex-wrap gap-4 mt-6">
      {trendingPlaces.map((place) => (
        <PlaceCard key={place._id} place={place} />
      ))}
    </div>
  );
};

export default Trending;
