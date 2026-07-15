export interface ApiResponse<T> {
  success: boolean
  data: T
  message?: string
}

export interface User {
  _id: string
  name: string
  email: string
  avatar: string
  isAdmin: boolean
}

export interface Photo {
  main: string
  thumbnails: string[]
}

export interface Place {
  _id: string
  title: string
  address: string
  photos: Photo[]
  category: string
  description: string
  perks: string[]
  extraInfo: string
  maxGuests: number
  rating: number
  reviews: number
  price: number
}

export interface GuestCount {
  adults: number
  children: number
  infants: number
  pets: number
}

export interface Booking {
  _id: string
  owner: string
  place: Place
  checkIn: string
  checkOut: string
  numOfGuests: GuestCount
  extraInfo: string
  status: 'pending' | 'confirmed' | 'cancelled'
  name: string
  price: number
}

export type BookingInput = Omit<Booking, '_id' | 'owner' | 'name' | 'price' | 'place' | 'status'> & {
  place: string
}

export interface WishlistItem {
  _id: string
  place: string
  title: string
  picture?: string
}

export interface Notification {
  _id: string
  message: string
  read: boolean
}

export interface Payment {
  _id: string
  user: string
  place: Place
  amount: number
  currency: string
  status: 'pending' | 'confirmed' | 'cancelled' | 'failed'
  stripeId: string
  paymentMethod: string
  paymentDate: string
}
