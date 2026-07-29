import { createContext, useCallback, useContext, useEffect, useState } from 'react'
import {
  experiencesService,
  getErrorMessage,
  type Experience,
  type ExperienceBooking,
  type ExperienceFilters,
} from '../../services'
import { useAuth } from './useAuth'

export interface ExperiencesContextValue {
  experiences: Experience[]
  bookings: ExperienceBooking[]
  loading: boolean
  bookingsLoading: boolean
  error: string | null
  refresh: (filters?: ExperienceFilters) => Promise<void>
  refreshBookings: () => Promise<void>
  getExperience: (idOrSlug: string) => Promise<Experience>
  createBooking: (input: {
    experienceId: string
    date: string
    startTime: string
    participants: number
  }) => Promise<ExperienceBooking>
  deleteBooking: (id: string) => Promise<void>
}

export const ExperiencesContext = createContext<ExperiencesContextValue | null>(null)

export const useExperiencesController = (): ExperiencesContextValue => {
  const { user } = useAuth()
  const [experiences, setExperiences] = useState<Experience[]>([])
  const [bookings, setBookings] = useState<ExperienceBooking[]>([])
  const [loading, setLoading] = useState(true)
  const [bookingsLoading, setBookingsLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)

  const refresh = useCallback(async (filters: ExperienceFilters = {}) => {
    try {
      setLoading(true)
      setError(null)
      setExperiences(await experiencesService.list(filters))
    } catch (cause) {
      setError(getErrorMessage(cause, 'Could not load experiences'))
    } finally {
      setLoading(false)
    }
  }, [])

  const refreshBookings = useCallback(async () => {
    if (!user) {
      setBookings([])
      return
    }
    try {
      setBookingsLoading(true)
      setBookings(await experiencesService.listBookings())
    } catch (cause) {
      setError(getErrorMessage(cause, 'Could not load experience bookings'))
    } finally {
      setBookingsLoading(false)
    }
  }, [user])

  useEffect(() => { void refresh() }, [refresh])
  useEffect(() => { void refreshBookings() }, [refreshBookings])

  return {
    experiences,
    bookings,
    loading,
    bookingsLoading,
    error,
    refresh,
    refreshBookings,
    getExperience: experiencesService.get,
    async createBooking(input) {
      const booking = await experiencesService.createBooking(input)
      setBookings((current) => [...current, booking])
      return booking
    },
    async deleteBooking(id) {
      await experiencesService.removeBooking(id)
      setBookings((current) => current.filter((booking) => booking._id !== id))
    },
  }
}

export const useExperiences = () => {
  const context = useContext(ExperiencesContext)
  if (!context) throw new Error('useExperiences must be used inside ExperienceProvider')
  return context
}
