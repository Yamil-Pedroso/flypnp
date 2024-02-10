import { useParams } from 'react-router-dom'
import { trending } from '../../../data/trending'
import { iconicCities } from '../../../data/iconicCities'
import { beachFront } from '../../../data/beachFront'

const PlaceDetails = () => {
  const { id, category } = useParams()

  let dataSource = [] as any
  switch (category) {
    case 'trending':
      dataSource = trending
      break
    case 'iconicCities':
      dataSource = iconicCities
      break
    case 'beachFront':
      dataSource = beachFront
      break
    default:
      dataSource = []
  }

  const place = dataSource.find((place: any) => place.id === Number(id))

  if (!place) {
    return <div>Image not found</div>
  }

  return (
    <div>
      <h1>Place Details</h1>
      <h2>{place.title}</h2>
      <img src={place.photos[0]} alt={place.title} width={400} />
      <div>
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
      <p>Address: {place.address}</p>
      <p>Description: {place.description}</p>
      <p>Perks: {place.perks.join(', ')}</p>
      <p>Extra Info: {place.extraInfo}</p>
      <p>Max Guests: {place.maxGuests}</p>
      <p>Rating: {place.rating}</p>
      <p>Price: CHF {place.price} per night</p>
    </div>
  )
}

export default PlaceDetails
