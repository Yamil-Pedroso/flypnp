import { useState } from "react";
import { Link } from "react-router-dom";
import { MdStar, MdStarBorder, MdStarHalf } from "react-icons/md";
import { FaRegHeart } from "react-icons/fa";
import CreateWishListBox from "../wishlist/create/CreateWishListBox";
import WebpImage from "./WebpImage";

interface Photo {
  main: string;
  thumbnails: string[];
}

interface PlaceCardProps {
  place: {
    _id: string;
    category: string;
    placeId?: number;
    title: string;
    address: string;
    photos: Photo[];
    description?: string;
    perks?: string[];
    extraInfo?: string;
    maxGuests?: number;
    rating: number;
    price: number;
  };
}

const PlaceCard = ({ place }: PlaceCardProps) => {
  const [showCreateWishList, setShowCreateWishList] = useState(false);

  const { title, address, photos, rating, price, category, _id } = place;
  const mainPhotoUrl = photos?.[0]?.main ?? "";

  const handleClickCreateWishList = () => {
    setShowCreateWishList(!showCreateWishList);
  };

  return (
    <div className="relative w-full max-w-[320px] mx-auto">
      {/* Overlay Wishlist */}
      {showCreateWishList && (
        <div className="fixed inset-0 bg-black/50 z-[999] animate-fadeInFromDown">
          <CreateWishListBox
            closeCreateWishList={handleClickCreateWishList}
            className="wishlist-box"
            placeId={_id}
            title={title}
            picture={mainPhotoUrl}
          />
        </div>
      )}

      {/* Card Wrapper */}
      <div className="rounded-xl cursor-pointer transition-transform duration-300 hover:scale-105 relative shadow-md overflow-hidden flex flex-col h-[450px]">
        {/* Image */}
        {mainPhotoUrl && (
          <div className="relative h-[200px] w-full overflow-hidden">
            <Link to={`/place/${category}/${_id}`}>
              <WebpImage
                src={mainPhotoUrl}
                alt="place"
                className="w-full h-full object-cover"
              />
            </Link>
            <div
              className="absolute top-2 right-2 text-2xl text-[#ff8c91] hover:text-red-500 animate-heart cursor-pointer"
              onClick={handleClickCreateWishList}
            >
              <FaRegHeart />
            </div>
          </div>
        )}

        {/* Content */}
        <div className="p-4 flex flex-col justify-between flex-grow">
          <div>
            <p className="font-semibold text-lg">{title}</p>
            <p className="text-sm text-gray-600">{address}</p>
            <p className="flex items-center gap-1 text-[#ff8c91]">
              {renderRatingStars(rating)}
              <span className="text-gray-800">{rating}</span>
            </p>
          </div>
          <div className="text-sm mt-2">
            <span className="font-bold">CHF{price} </span>per night
          </div>
        </div>
      </div>
    </div>
  );
};

function renderRatingStars(rating: number) {
  const fullStars = Math.floor(rating);
  const halfStar = rating % 1 >= 0.5;
  const stars = [];

  for (let i = 0; i < fullStars; i++) {
    stars.push(<MdStar key={`star-${i}`} />);
  }

  if (halfStar) {
    stars.push(<MdStarHalf key="half" />);
  }

  while (stars.length < 5) {
    stars.push(<MdStarBorder key={`border-${stars.length}`} />);
  }

  return <span className="flex text-[#ff8c91]">{stars}</span>;
}

export default PlaceCard;
