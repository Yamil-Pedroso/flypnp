import { TripsContainer } from './styles'

const Trips = () => {
  return (
    <TripsContainer>
      <div className="trips-wrapper">
        <h1>No trips booked...yet!</h1>
        <p>
          Is your next trip booked? Start planning your next adventure with
          Flypnp.
        </p>

        <button>
          <a href="/">Start Browsing</a>
        </button>
      </div>
    </TripsContainer>
  )
}

export default Trips
