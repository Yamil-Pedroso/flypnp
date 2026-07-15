import { useState } from "react";
import { Link } from "react-router-dom";
import { Heart, Star } from "lucide-react";
import CreateWishListBox from "../wishlist/create/CreateWishListBox";
import WebpImage from "./WebpImage";
import type { Place } from "../../services";
import { getTravelParams, useTravelSearch } from "../search/SearchContext";

interface PlaceCardProps {
  place: Place;
}

const PlaceCard = ({ place }: PlaceCardProps) => {
  const [showCreateWishList, setShowCreateWishList] = useState(false);
  const { destination, checkIn, checkOut, guests } = useTravelSearch();

  const { title, address, photos, rating, price, category, _id } = place;
  const mainPhotoUrl = photos?.[0]?.main ?? "";
  const travelParams = getTravelParams({ destination, checkIn, checkOut, guests });
  const placeUrl = `/place/${category}/${_id}?${travelParams.toString()}`;

  const handleClickCreateWishList = () => {
    setShowCreateWishList(!showCreateWishList);
  };

  return (
    <article className="group relative min-w-0">
      {/* Overlay Wishlist */}
      {showCreateWishList && (
        <div className="fixed inset-0 z-[999] bg-slate-950/55 backdrop-blur-sm">
          <CreateWishListBox
            closeCreateWishList={handleClickCreateWishList}
            className="wishlist-box"
            placeId={_id}
            title={title}
            picture={mainPhotoUrl}
          />
        </div>
      )}

      <div>
        {mainPhotoUrl && (
          <div className="relative aspect-[4/3] w-full overflow-hidden rounded-3xl bg-slate-200">
            <Link to={placeUrl} className="block size-full" aria-label={`View ${title}`}>
              <WebpImage
                src={mainPhotoUrl}
                alt={title}
                className="size-full object-cover transition duration-500 group-hover:scale-[1.04]"
              />
            </Link>
            <button
              type="button"
              aria-label={`Save ${title} to wishlist`}
              className="absolute right-3 top-3 flex size-10 items-center justify-center rounded-full bg-white/90 text-slate-800 shadow-sm backdrop-blur transition hover:scale-105 hover:text-rose-500"
              onClick={handleClickCreateWishList}
            >
              <Heart className="size-5" />
            </button>
          </div>
        )}

        <div className="px-1 pt-3">
          <div className="flex items-start justify-between gap-3">
            <h2 className="truncate font-semibold text-slate-950">{title}</h2>
            <span className="flex shrink-0 items-center gap-1 text-sm text-slate-800"><Star className="size-4 fill-slate-900" />{rating.toFixed(1)}</span>
          </div>
          <p className="mt-0.5 truncate text-sm text-slate-500">{address}</p>
          <p className="mt-2 text-sm text-slate-700"><span className="font-semibold text-slate-950">CHF {price}</span> night</p>
        </div>
      </div>
    </article>
  );
};

export default PlaceCard;
