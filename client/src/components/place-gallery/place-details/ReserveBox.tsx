import { useNavigate } from "react-router-dom";
import { useState, useEffect } from "react";
import { useParams } from "react-router-dom";
import { usePlaces, useBooking, useAuth } from "../../../../hooks";
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
  const [checkInDate, setCheckInDate] = useState("2024-02-23");
  const [checkOutDate, setCheckOutDate] = useState("2024-03-19");
  const { user } = useAuth();
  const { addBooking } = useBooking();
  const [adult, setAdult] = useState(0);
  const [children, setChildren] = useState(0);
  const [infants, setInfants] = useState(0);
  const [pets, setPets] = useState(0);
  const [guests, setGuests] = useState(0);

  useEffect(() => {
    setGuests(adult + children);
  }, [adult, children]);

  const place = places.find(
    (place) => place._id === id && place.category === category
  );
  if (loading) return <div>Loading...</div>;
  if (!place) return <div>Image not found</div>;

  const navigate = useNavigate();
  const mainPhoto = place.photos[0]?.main || "";

  const handleClickAdults = (count: number) => {
    const hasDependents = children > 0 || infants > 0 || pets > 0;
    if (count < 1 && hasDependents) return;

    if (count === 0) {
      setChildren(0);
      setInfants(0);
      setPets(0);
    }

    if (count >= 0 && count <= 16) setAdult(count);
  };

  const handleClickChildren = (count: number) => {
    if (count < 0 || count > 15) return;
    if (count > 0 && adult === 0) setAdult(1);
    setChildren(count);
  };

  const handleClickInfants = (count: number) => {
    if (count < 0 || count > 5) return;
    if (count > 0 && adult === 0) setAdult(1);
    setInfants(count);
  };

  const handleClickPets = (count: number) => {
    if (count < 0 || count > 5) return;
    if (count > 0 && adult === 0) setAdult(1);
    setPets(count);
  };

  const handleReserveClick = async () => {
    const booking = {
      owner: user.id,
      place: place._id,
      checkIn: new Date(checkInDate),
      checkOut: new Date(checkOutDate),
      numOfGuests: { adults: adult, children, infants, pets },
      status: "pending",
      extraInfo: "Lorem ipsum dolor sit amet, consectetur adipiscing elit.",
      name: user.name,
      price: place.price,
    };

    try {
      await addBooking(booking);
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
    <div className="w-[23rem] h-[28rem] p-4 border border-gray-300 shadow-xl rounded-lg relative bg-white">
      <div className="flex justify-between text-lg font-semibold mb-4">
        <span>{place.price} CHF</span>
        <span>/ night</span>
      </div>

      <div className="border rounded-md p-3">
        <div className="flex justify-between mb-2">
          <button onClick={() => setClickCheckIn(!clickCheckIn)}>
            <span className="block text-xs font-semibold">CHECK-IN</span>
            <p>{checkInDate}</p>
          </button>
          <div className="w-px bg-gray-400" />
          <button>
            <span className="block text-xs font-semibold">CHECK-OUT</span>
            <p>{checkOutDate}</p>
          </button>
        </div>

        <div className="h-px bg-gray-400 mb-2" />

        <div>
          <div className="flex justify-between items-center">
            <div>
              <p className="font-semibold">Guests</p>
              <p className="text-sm text-gray-600">
                {guests > 0
                  ? `${guests} guests${infants ? `, ${infants} infant` : ""}${
                      pets ? `, ${pets} pet` : ""
                    }`
                  : "Add guest"}
              </p>
            </div>
            <div
              onClick={() => setClickArrow(!clickArrow)}
              className="cursor-pointer"
            >
              {clickArrow ? <FaChevronUp /> : <FaChevronDown />}
            </div>
          </div>
        </div>
      </div>

      <button
        onClick={handleReserveClick}
        className="w-full bg-pink-600 text-white py-2 mt-4 rounded hover:opacity-80"
      >
        Reserve
      </button>

      {clickArrow && (
        <div className="absolute bg-white p-4 shadow-lg border rounded-lg top-[15rem] right-0 w-[27rem] z-50">
          {[
            {
              label: "Adults",
              note: "Age 13 or above",
              value: adult,
              set: handleClickAdults,
            },
            {
              label: "Children",
              note: "Age 2-12",
              value: children,
              set: handleClickChildren,
            },
            {
              label: "Infants",
              note: "Under 2",
              value: infants,
              set: handleClickInfants,
            },
            {
              label: "Pets",
              note: <a href="#">Bringing a service animal?</a>,
              value: pets,
              set: handleClickPets,
            },
          ].map(({ label, note, value, set }, idx) => (
            <div
              key={idx}
              className="flex justify-between items-center border-b py-2"
            >
              <div>
                <p className="font-semibold">{label}</p>
                <span className="text-sm text-gray-500">{note}</span>
              </div>
              <div className="flex items-center text-gray-500">
                <FaMinusCircle
                  onClick={() => set(value - 1)}
                  className={`text-xl cursor-pointer ${
                    value === 0 ? "text-gray-300 cursor-not-allowed" : ""
                  }`}
                />
                <span className="mx-3 text-base">{value}</span>
                <FaPlusCircle
                  onClick={() => set(value + 1)}
                  className="text-xl cursor-pointer"
                />
              </div>
            </div>
          ))}
        </div>
      )}

      {clickCheckIn && (
        <MyCalendar className="absolute top-[10rem] right-[-2rem] w-[55rem] h-[36rem] rounded-xl shadow-md overflow-hidden" />
      )}
    </div>
  );
};

export default ReserveBox;
