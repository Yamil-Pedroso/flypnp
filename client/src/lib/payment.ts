import type { Booking } from "../services";

export const getBookingPaymentPath = (booking: Booking) => {
  const { place, numOfGuests } = booking;
  const params = new URLSearchParams({
    booking: booking._id,
    checkIn: booking.checkIn,
    checkOut: booking.checkOut,
    guests: String(numOfGuests.adults + numOfGuests.children),
    infants: String(numOfGuests.infants),
    pets: String(numOfGuests.pets),
    price: String(booking.price),
    photo: place.photos[0]?.main || "",
    title: place.title,
    description: place.description,
    rating: String(place.rating),
    place: place._id,
  });

  return `/my-payment?${params.toString()}`;
};
