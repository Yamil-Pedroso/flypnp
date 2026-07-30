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
  archivedAt?: string
}

export type PlaceInput = Pick<
  Place,
  'title' | 'address' | 'photos' | 'category' | 'description' | 'perks' | 'extraInfo' | 'maxGuests' | 'price'
>

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

export type HostBooking = Omit<Booking, 'owner'> & {
  owner: string | Pick<User, '_id' | 'name' | 'email' | 'avatar'>
}

export type BookingInput = Omit<Booking, '_id' | 'owner' | 'name' | 'price' | 'place' | 'status'> & {
  place: string
}

export interface WishlistItem {
  _id: string
  place?: string
  experience?: string
  itemType?: 'place' | 'experience'
  title: string
  picture?: string
}

export interface Notification {
  _id: string
  type?: 'general' | 'service_quote' | 'service_confirmed' | 'service_cancelled'
  title?: string
  message: string
  actionUrl?: string
  read: boolean
  createdAt?: string
}

export interface Payment {
  _id: string
  user: string
  place?: Place
  experience?: Experience
  booking?: string
  experienceBooking?: string
  serviceRequest?: string | ServiceRequest
  amount: number
  currency: string
  status: 'pending' | 'confirmed' | 'cancelled' | 'failed'
  stripeId: string
  paymentMethod: string
  paymentDate: string
}

export type ExperienceCategory =
  | 'local-flavors'
  | 'nature'
  | 'creative'
  | 'hidden-gems'
  | 'night'
  | 'family'
  | 'wellness'
  | 'culture'

export interface Experience {
  _id: string
  slug: string
  title: string
  city: string
  country: string
  address: string
  category: ExperienceCategory
  kind: 'moment' | 'local-path'
  summary: string
  description: string
  images: string[]
  host: {
    name: string
    avatar: string
    bio: string
    yearsHosting: number
  }
  durationMinutes: number
  languages: string[]
  maxGuests: number
  price: number
  rating: number
  reviews: number
  meetingPoint: string
  included: string[]
  bring: string[]
  highlights: string[]
  availableDays: number[]
  startTimes: string[]
  featured: boolean
}

export interface ExperienceBooking {
  _id: string
  owner: string
  experience: Experience
  date: string
  startTime: string
  participants: number
  status: 'pending' | 'confirmed' | 'cancelled'
  name: string
  price: number
}

export interface ExperienceFilters {
  destination?: string
  category?: ExperienceCategory | 'all'
  date?: string
  guests?: number
  kind?: Experience['kind']
}

export type TravelServiceType = 'airport-transfer' | 'pet-care' | 'local-guide'

export interface ServiceRequest {
  _id: string
  owner: string | Pick<User, '_id' | 'name' | 'email' | 'avatar'>
  serviceType: TravelServiceType
  destination: string
  date: string
  time: string
  participants: number
  notes?: string
  details: {
    pickup?: string
    dropoff?: string
    flightNumber?: string
    petType?: string
    petCount?: number
    language?: string
    interests?: string
  }
  quotePrice?: number
  provider?: {
    name: string
    email?: string
    phone?: string
  }
  adminMessage?: string
  quotedAt?: string
  confirmedAt?: string
  status: 'requested' | 'quoted' | 'confirmed' | 'cancelled'
}

export type ServiceRequestInput = Omit<ServiceRequest, '_id' | 'owner' | 'status'>
