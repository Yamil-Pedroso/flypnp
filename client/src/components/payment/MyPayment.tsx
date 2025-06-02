import { useLocation } from "react-router-dom";
import {
  FaCcVisa,
  FaPaypal,
  FaCcMastercard,
  FaGooglePay,
} from "react-icons/fa";
import { GrAmex } from "react-icons/gr";
import TestStripePayment from "./TestStripePayment";

interface MyPaymentProps {
  myPrice: string;
}

const MyPayment = ({ myPrice }: MyPaymentProps) => {
  const location = useLocation();
  const useQuery = new URLSearchParams(location.search);
  const user = useQuery.get("user");
  const booking = useQuery.get("booking");
  const checkIn = useQuery.get("checkIn");
  const checkOut = useQuery.get("checkOut");
  const guests = useQuery.get("guests");
  const infants = useQuery.get("infants");
  const pets = useQuery.get("pets");
  const price = useQuery.get("price");
  const photo = useQuery.get("photo") as string;
  const title = useQuery.get("title");
  const description = useQuery.get("description");
  const rating = useQuery.get("rating");

  return (
    <div className="flex flex-col md:flex-row justify-between gap-8 max-w-5xl mx-auto p-6">
      <div className="w-full md:w-1/2 space-y-6">
        <h2 className="text-xl font-semibold">Your trip</h2>

        <div className="space-y-4">
          <div className="flex justify-between items-center border-b pb-2">
            <div>
              <p className="text-gray-700 font-medium">Dates</p>
              <p className="text-gray-600">
                {checkIn} - {checkOut}
              </p>
            </div>
            <div className="text-pink-600 underline cursor-pointer">Edit</div>
          </div>

          <div className="flex justify-between items-center border-b pb-2">
            <div>
              <p className="text-gray-700 font-medium">Guests</p>
              <p className="text-gray-600">
                {guests} guest{Number(guests) > 1 ? "s" : ""}
                {infants
                  ? `, ${infants} infant${Number(infants) > 1 ? "s" : ""}`
                  : ""}
                {pets ? `, ${pets} pet${Number(pets) > 1 ? "s" : ""}` : ""}
              </p>
            </div>
            <div className="text-pink-600 underline cursor-pointer">Edit</div>
          </div>
        </div>

        <div className="mt-6 space-y-4">
          <div className="flex justify-between items-center">
            <h2 className="text-lg font-semibold">Pay with</h2>
            <div className="flex gap-2 items-center text-gray-600">
              <FaCcVisa size={18} />
              <FaPaypal size={18} />
              <FaCcMastercard size={18} />
              <GrAmex size={28} />
              <FaGooglePay size={28} />
            </div>
          </div>

          <TestStripePayment />
        </div>
      </div>

      <div className="w-full md:w-1/2 border border-gray-300 rounded-md p-4 space-y-4 h-fit">
        <div className="flex gap-4 items-start">
          <img
            src={photo}
            alt={title || ""}
            className="w-32 h-24 object-cover rounded-md"
          />
          <div className="flex flex-col">
            <h2 className="font-semibold text-lg">{title}</h2>
            <p className="text-sm text-gray-600 line-clamp-3">{description}</p>
            <p className="text-sm font-medium text-yellow-600">
              Rating: {rating}
            </p>
          </div>
        </div>

        <hr />

        <div className="flex justify-between text-sm text-gray-700">
          <p>
            <span className="font-medium">Service fee</span>
          </p>
          <p>{(Number(price) * 0.1).toFixed(2)} CHF</p>
        </div>

        <hr />

        <div className="flex justify-between text-base font-semibold">
          <p>Total</p>
          <p>{(Number(price) + Number(price) * 0.1).toFixed(2)} CHF</p>
        </div>
      </div>
    </div>
  );
};

export default MyPayment;
