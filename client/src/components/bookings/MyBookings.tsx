/* eslint-disable @typescript-eslint/no-explicit-any */
import { useBooking } from '../../../hooks'
import { Container } from './styles'

const MyBookings = () => {
  const { bookings } = useBooking()

  console.log(bookings)

  const getStatusClass = (status: string) => {
    switch (status) {
      case 'pending':
        return 'status-pending'
      case 'confirmed':
        return 'status-confirmed'
      case 'deleted':
        return 'status-deleted'
      default:
        return ''
    }
  }

  return (
    <Container>
      <h1>My Bookings</h1>
      <div>
        {bookings.map((booking: any, index: any) => (
          <div key={index}>
            <p>{booking.name}</p>
            <p>{new Date(booking.checkIn).toLocaleDateString()}</p>
            <p>{new Date(booking.checkOut).toLocaleDateString()}</p>
            <p>{booking.place.title}</p>
            <p>{booking.place.description}</p>
            <p>{booking.place.extraInfo}</p>
            <div>
              <img
                src={booking?.place.photos[0]?.main}
                alt={booking?.place}
                width={300}
              />
            </div>
            <div style={{ display: 'flex', flexDirection: 'column' }}>
              <p className={getStatusClass(booking.status)}>
                {booking.status === 'pending'
                  ? 'Pending'
                  : booking.status === 'confirmed'
                  ? 'Confirmed'
                  : 'Deleted'}
              </p>
            </div>
            <p>{booking.price}</p>
            <p>{booking.phone}</p>
            <p>{booking['numOfGuests'].adults}</p>
            <p>{booking['numOfGuests'].children}</p>
            <p>{booking['numOfGuests'].infants}</p>
            <p>{booking.extraInfo}</p>
          </div>
        ))}
      </div>
    </Container>
  )
}

export default MyBookings
