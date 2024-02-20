/* eslint-disable @typescript-eslint/no-explicit-any */
import { useParams } from "react-router-dom";
import { trending } from "../../../data/trending";
import { iconicCities } from "../../../data/iconicCities";
import { beachFront } from "../../../data/beachFront";
import { Container } from "./styles";
import { IoShareSocial } from "react-icons/io5";
import { FaRegHeart } from "react-icons/fa6";
import ReserveBox from "./ReserveBox";

const PlaceDetails = () => {
  const { id, category } = useParams();

  let dataSource = [] as any;
  switch (category) {
    case "trending":
      dataSource = trending;
      break;
    case "iconicCities":
      dataSource = iconicCities;
      break;
    case "beachFront":
      dataSource = beachFront;
      break;
    default:
      dataSource = [];
  }

  const place = dataSource.find((place: any) => place.id === Number(id));

  if (!place) {
    return <div>Image not found</div>;
  }

  return (
    <Container>
      <div className="header-details-wrapper">
        <div>
          <h2>{place.title}</h2>
        </div>
        <div className="share-save-wrapper">
          <div>
            <IoShareSocial className="share-icon" />
            <span>Share</span>
          </div>
          <div>
            <FaRegHeart className="save-icon" />
            <span>Save</span>
          </div>
        </div>
      </div>
      <div className="img-details-wrapper">
        <div className="img-wrapper">
          <img src={place.photos[0]} alt={place.title} width={400} />
        </div>
        <div className="img-thumbnail-wrapper">
          {place.photos[1].thumbnails.map((photo: string, index: number) => (
            <img
              key={index}
              src={photo}
              alt={place.title}
              width={200}
              height={200}
            />
          ))}
        </div>
      </div>
      <div className="desc-reserve-wrapper">
        <div className="place-desc-wrapper">
          <p>Address: {place.address}</p>
          <p>Description: {place.description}</p>
          <p>Perks: {place.perks.join(", ")}</p>
          <p>Extra Info: {place.extraInfo}</p>
          <p>Max Guests: {place.maxGuests}</p>
          <p>Rating: {place.rating}</p>
          <p>Price: CHF {place.price} per night</p>
        </div>

        <ReserveBox />
      </div>
    </Container>
  );
};

export default PlaceDetails;
