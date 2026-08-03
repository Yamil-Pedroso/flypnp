import { act, renderHook, waitFor } from '@testing-library/react'
import { beforeEach, describe, expect, it, vi } from 'vitest'
import { authService, type User } from '../../services'
import { useAuthController } from './useAuth'

const user: User = {
  _id: 'user-1',
  name: 'Yami',
  email: 'yami@example.com',
  avatar: '',
  isAdmin: false,
}

describe('useAuthController', () => {
  beforeEach(() => localStorage.clear())

  it('restores a persisted session on mount', async () => {
    localStorage.setItem('user', JSON.stringify(user))
    localStorage.setItem('token', 'stored-token')

    const { result } = renderHook(() => useAuthController())

    await waitFor(() => expect(result.current.loading).toBe(false))
    expect(result.current.user).toEqual(user)
  })

  it('persists the session returned by login', async () => {
    vi.spyOn(authService, 'login').mockResolvedValue({
      success: true,
      token: 'new-token',
      user,
    })
    const { result } = renderHook(() => useAuthController())
    await waitFor(() => expect(result.current.loading).toBe(false))

    await act(async () => {
      await expect(result.current.login({ email: user.email, password: 'secret' }))
        .resolves.toMatchObject({ success: true, user })
    })

    expect(localStorage.getItem('token')).toBe('new-token')
    expect(JSON.parse(localStorage.getItem('user') ?? '{}')).toEqual(user)
  })

  it('persists a demo session like any other authenticated user', async () => {
    vi.spyOn(authService, 'demoLogin').mockResolvedValue({
      success: true,
      token: 'demo-token',
      user: { ...user, _id: 'demo-1', name: 'Flypnp Demo', email: 'demo@example.com' },
    })
    const { result } = renderHook(() => useAuthController())
    await waitFor(() => expect(result.current.loading).toBe(false))

    await act(async () => {
      await expect(result.current.demoLogin()).resolves.toMatchObject({ success: true })
    })

    expect(localStorage.getItem('token')).toBe('demo-token')
    expect(JSON.parse(localStorage.getItem('user') ?? '{}').email).toBe('demo@example.com')
  })
})
