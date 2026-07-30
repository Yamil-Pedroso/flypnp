import type { Booking, ExperienceBooking, ServiceRequest } from "../services";

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

export const getExperiencePaymentPath = (booking: ExperienceBooking) => {
  const { experience } = booking;
  const params = new URLSearchParams({
    experienceBooking: booking._id,
    productType: "experience",
    checkIn: booking.date,
    guests: String(booking.participants),
    price: String(booking.price),
    photo: experience.images[0] || "",
    title: experience.title,
    description: experience.summary,
    rating: String(experience.rating),
    experience: experience._id,
    startTime: booking.startTime,
  });
  return `/my-payment?${params.toString()}`;
};

export const getServicePaymentPath = (request: ServiceRequest) => {
  const params = new URLSearchParams({
    serviceRequest: request._id,
    productType: "service",
    checkIn: request.date.slice(0, 10),
    guests: String(request.participants),
    price: String(request.quotePrice ?? 0),
    title: {
      "airport-transfer": "Airport Transfer",
      "pet-care": "Pet Care",
      "local-guide": "Local Guide",
    }[request.serviceType],
    description: request.adminMessage || `Your ${request.serviceType.replaceAll("-", " ")} service quote.`,
    startTime: request.time,
    destination: request.destination,
    provider: request.provider?.name ?? "",
  });
  return `/my-payment?${params.toString()}`;
};
