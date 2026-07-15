import { renderHook, waitFor } from '@testing-library/react'
import { describe, expect, it, vi } from 'vitest'
import { apiBaseUrl, placesService, type Place } from '../../services'
import { usePlacesController } from './usePlaces'

const place: Place = {
  _id: 'place-1',
  title: 'Lake house',
  address: 'Zurich',
  category: 'trending',
  description: 'A quiet stay',
  perks: [],
  extraInfo: '',
  maxGuests: 2,
  rating: 4.9,
  reviews: 12,
  price: 180,
  photos: [{ main: '/uploads/main.webp', thumbnails: ['/uploads/thumb.webp'] }],
}

describe('usePlacesController', () => {
  it('loads places and normalizes relative image paths', async () => {
    vi.spyOn(placesService, 'list').mockResolvedValue([place])

    const { result } = renderHook(() => usePlacesController())

    await waitFor(() => expect(result.current.loading).toBe(false))
    expect(result.current.error).toBeNull()
    const apiRoot = apiBaseUrl.replace(/\/api\/v1\/?$/, '')
    expect(result.current.places[0].photos[0]).toEqual({
      main: `${apiRoot}/uploads/main.webp`,
      thumbnails: [`${apiRoot}/uploads/thumb.webp`],
    })
  })
})
