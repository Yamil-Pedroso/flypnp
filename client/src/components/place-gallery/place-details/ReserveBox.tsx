/* eslint-disable @typescript-eslint/no-explicit-any */
import { useNavigate } from "react-router-dom";
import { useState, useEffect } from "react";
import { useParams } from "react-router-dom";
import { usePlaces } from "../../../../hooks";
import { useBooking } from "../../../../hooks";
import { useAuth } from "../../../../hooks";
import {
  FaChevronDown,
  FaChevronUp,
  FaMinusCircle,
  FaPlusCircle,
} from "react-icons/fa";
import MyCalendar from "../../common/calendar/Calendar";

const ReserveBox = () => {
  const [clickArrow, setClickArrow] = useState(false);
  const [clickCheckIn, setClickCheckIn] = useState(false);
  const { places, loading } = usePlaces();
  const { id, category } = useParams();
  const [checkInDate, setCheckInDate] = useState("2024-02-23"); // setStates to play with the data dynamically
  const [checkOutDate, setCheckOutDate] = useState("2024-03-19"); // setStates to play with the data dynamically
  const { user } = useAuth() as any;
  const { addBooking } = useBooking() as any;
  const [adult, setAdult] = useState(0);
  const [children, setChildren] = useState(0);
  const [infants, setInfants] = useState(0);
  const [pets, setPets] = useState(0);
  const [guests, setGuests] = useState(0);

  console.log("user", user.phone);

  useEffect(() => {
    setGuests(adult + children);
  }, [adult, children]);

  const handleClickAdults = (count: number) => {
    if ((children > 0 || infants > 0 || pets > 0) && count < 1) return;

    if (count >= 0 && count <= 16) {
      setAdult(count);
    }
  };

  const handleClickChildren = (count: number) => {
    if (count < 0) return;
    if (adult === 0 && children === 0) {
      setAdult(1);
      setChildren(1);
    }
    if (count >= 0 && count <= 15) {
      setChildren(count);
    }
  };

  const handleClickInfants = (count: number) => {
    if (count < 0) return;
    if (adult === 0 && infants === 0) {
      setAdult(1);
      setInfants(1);
    }
    if (count >= 0 && count <= 5) {
      setInfants(count);
    }
  };

  const handleClickPets = (count: number) => {
    if (count < 0) return;
    if (adult === 0 && pets === 0) {
      setAdult(1);
      setPets(1);
    }
    if (count >= 0 && count <= 5) {
      setPets(count);
    }
  };

  const navigate = useNavigate();

  const handleClickArrow = () => {
    setClickArrow(!clickArrow);
  };

  const handleCheckInClick = () => {
    setClickCheckIn(!clickCheckIn);
  };

  if (loading) {
    return <div>Loading...</div>;
  }

  const place = places.find(
    (place) => place._id === id && place.category === category
  );

  if (!place) {
    return <div>Image not found</div>;
  }

  const mainPhoto = place.photos[0]?.main || "";

  const handleReserveClick = async () => {
    const booking = {
      owner: user.id,
      place: place._id,
      checkIn: new Date(checkInDate),
      checkOut: new Date(checkOutDate),
      numOfGuests: {
        adults: adult,
        children: children,
        infants: infants,
        pets: pets,
      },
      status: "pending",
      extraInfo: "Lorem ipsum dolor sit amet, consectetur adipiscing elit.",
      name: user.name,
      price: place.price,
    };

    try {
      await addBooking(booking);
      console.log(addBooking(booking) );
      navigate(
        `/my-payment?checkIn=${checkInDate}&checkOut=${checkOutDate}&guests=${
          adult + children
        }&infants=${infants}&pets=${pets}&price=${
          place.price
        }&photo=${mainPhoto}&title=${place.title}&description=${
          place.description
        }&rating=${place.rating}&user=${user._id}&place=${place._id}`
      );
    } catch (error) {
      console.error("Error adding booking:", error);
    }
  };

  return (
    <div className="reserve-box-container">
      <div className="price-wrapper">
        <span>{place.price} CHF</span>
        <span>/ night</span>
      </div>

      <div className="check-in-out-guests-wrapper">
        <div className="check-in-out-guests-box">
          <button onClick={handleCheckInClick}>
            <span>CHECK-IN</span>
            <p>2/23/2024</p>
          </button>
          <div className="vertical-line"></div>
          <button>
            <span>CHECK-OUT</span>
            <p>3/19/2024</p>
          </button>
        </div>

        <div className="horizontal-line"></div>

        <div className="guests-box">
          <div className="dropdown-guests-wrapper">
            <div>
              <p>Guests</p>
              {adult + children > 0 ? (
                <p>
                  {adult + children} guests
                  {infants > 0 || pets > 0
                    ? `, ${
                        infants
                          ? infants === 1
                            ? infants + " infant,"
                            : infants + " infants,"
                          : ""
                      }
                  ${pets ? (pets === 1 ? pets + " pet" : pets + " pets") : ""}`
                    : ""}
                </p>
              ) : (
                <p>Add guest</p>
              )}
            </div>
            <div className="arrow-down-up">
              <span onClick={handleClickArrow}>
                {clickArrow ? <FaChevronUp /> : <FaChevronDown />}
              </span>
            </div>
          </div>
        </div>
      </div>

      <button onClick={handleReserveClick} className="reserve-button">
        Reserve
      </button>

      {clickArrow && (
        <div className="guests-dropdown">
          <div className="section adults-cont">
            <div className="guest">
              <p>Adults</p>
              <span>Age 13 or above</span>
            </div>
            <div className="counter">
              <FaMinusCircle
                onClick={() => handleClickAdults(adult - 1)}
                className={`counter-icon ${
                  adult === 0 || children >= 1 || infants >= 1 || pets >= 1
                    ? "disabled"
                    : ""
                }`}
              />

              <span>{adult}</span>

              <FaPlusCircle
                onClick={() => handleClickAdults(adult + 1)}
                className="counter-icon"
              />
            </div>
          </div>
          <div className="section children-cont">
            <div className="guest">
              <p>Children</p>
              <span>Age 2-12</span>
            </div>
            <div className="counter">
              <FaMinusCircle
                onClick={() => handleClickChildren(children - 1)}
                className={`counter-icon ${children === 0 ? "disabled" : ""}`}
              />

              <span>{children}</span>
              <FaPlusCircle
                onClick={() => handleClickChildren(children + 1)}
                className="counter-icon"
              />
            </div>
          </div>
          <div className="section infants-cont">
            <div className="guest">
              <p>Infants</p>
              <span>Under 2</span>
            </div>
            <div className="counter">
              <FaMinusCircle
                onClick={() => handleClickInfants(infants - 1)}
                className={`counter-icon ${infants === 0 ? "disabled" : ""}`}
              />

              <span>{infants}</span>

              <FaPlusCircle
                onClick={() => handleClickInfants(infants + 1)}
                className="counter-icon"
              />
            </div>
          </div>
          <div className="section pets-cont">
            <div className="guest">
              <p>Pets</p>
              <span>
                <a href="#">Bringing a service animal?</a>
              </span>
            </div>
            <div className="counter">
              <FaMinusCircle
                onClick={() => handleClickPets(pets - 1)}
                className={`counter-icon ${pets === 0 ? "disabled" : ""}`}
              />

              <span>{pets}</span>

              <FaPlusCircle
                onClick={() => handleClickPets(pets + 1)}
                className="counter-icon"
              />
            </div>
          </div>
        </div>
      )}

      {clickCheckIn && <MyCalendar className="calendar" />}
    </div>
  );
};

export default ReserveBox;
