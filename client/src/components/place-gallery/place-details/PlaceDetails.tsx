/* eslint-disable @typescript-eslint/no-explicit-any */
import { useState } from "react";
import { useParams } from "react-router-dom";
import { usePlaces } from "../../../../hooks";
import { Container } from "./styles";
import { IoShareSocial } from "react-icons/io5";
import { FaRegHeart } from "react-icons/fa6";
import ReserveBox from "./ReserveBox";
import ShowAllPhotos from "./ShowAllPhotos";
import { GiOlive } from "react-icons/gi";
import { FaStar } from "react-icons/fa";
import { BsAwardFill } from "react-icons/bs";
import {
  MdOutlineBedroomParent,
  MdOutlineHouse,
  MdOutlineBathroom,
} from "react-icons/md";

// Change to Tailwind CSS
const PlaceDetails = () => {
  const { id, category } = useParams<{ id: string; category: string }>();
  const { places, loading } = usePlaces();
  const [reserveBoxVisible, setReserveBoxVisible] = useState(false);

  const handleClickReserveBox = () => {
    setReserveBoxVisible(!reserveBoxVisible);
  };

  if (loading) {
    return <div>Loading...</div>;
  }

  const place = places.find(
    (place) => place._id === id && place.category === category
  );

  if (!place) {
    return <div>Place not found</div>;
  }

  const mainPhoto = place.photos[0]?.main || "";
  const thumbnails = place.photos[0]?.thumbnails || [];

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
          <img src={mainPhoto} alt={place.title} width={400} />
        </div>
        <div className="img-thumbnail-wrapper">
          <ShowAllPhotos />
          {thumbnails.map((photo, index) => (
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
          <div className="setting-reservation-wrapper">
            <div>
              <p>{place.description}</p>
              <p>{place.perks.join(" - ")}</p>
            </div>
            <div>
              <button onClick={handleClickReserveBox}>
                Setting your reservation
              </button>
            </div>
          </div>

          <div className="fav-guest-wrapper">
            <div className="fav-guest-cont">
              <div className="oliven-cont">
                <GiOlive size={48} className="oliven-1" />
                <p className="p-1">Guest favorite</p>
                <GiOlive size={48} className="oliven-2" />
              </div>
              <p className="p-2">One of the most booked places in the world</p>
            </div>

            <div className="rating-review-wrapper">
              <div>
                <p>{place.rating}</p>
                <FaStar />
              </div>

              <p>
                {place.reviews} <span>reviews</span>
              </p>
            </div>
          </div>

          <div className="superhost-wrapper">
            <div className="superhost-avatar">
              <BsAwardFill size={28} className="award-icon" />
              <img
                src="https://images.unsplash.com/photo-1438761681033-6461ffad8d80?q=80&w=3570&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D"
                alt="superhost"
              />
            </div>
            <div className="superhost-desc">
              <p>Stay with Jane</p>
              <p>Superhost - 4 years hosting</p>
            </div>
          </div>

          <div className="horizontal-line"></div>

          <div className="desc-place-wrapper">
            <div className="desc-1">
              <MdOutlineBedroomParent size={28} />
              <div>
                <h3>Roomm in a chalet</h3>
                <p>Your own room in the home, plus access to shared spaces.</p>
              </div>
            </div>
            <div className="desc-2">
              <MdOutlineHouse size={28} />
              <div>
                <h3>Shared common spaces</h3>
                <p>
                  You'll share part of the home with the host and other guests.
                </p>
              </div>
            </div>
            <div className="desc-3">
              <MdOutlineBathroom size={28} />
              <div>
                <h3>Shared bathroom</h3>
                <p>
                  You'll share a bathroom with the host and other guests in the
                  home.
                </p>
              </div>
            </div>
            <div className="desc-4">
              <BsAwardFill size={28} />
              <div>
                <h3>Jane is a Superhost</h3>
                <p>
                  Superhosts are experienced, highly rated hosts who are
                  committed to providing great stays for guests.
                </p>
              </div>
            </div>
          </div>
        </div>

        <div className={`reserve-box-wrapper `}>
          <ReserveBox />
        </div>
      </div>
    </Container>
  );
};

export default PlaceDetails;
