import { beforeEach, describe, expect, it, vi } from 'vitest'
import { authService } from './auth.service'
import { http } from './http'

vi.mock('./http', () => ({
  http: {
    post: vi.fn(),
    get: vi.fn(),
    put: vi.fn(),
  },
}))

describe('authService', () => {
  beforeEach(() => vi.clearAllMocks())

  it('uses the login endpoint and unwraps the session response', async () => {
    const session = {
      success: true,
      token: 'signed-token',
      user: { _id: 'user-1', name: 'Yami', email: 'yami@example.com', avatar: '', isAdmin: false },
    }
    vi.mocked(http.post).mockResolvedValueOnce({ data: session })

    await expect(authService.login({ email: 'yami@example.com', password: 'secret' })).resolves.toEqual(session)
    expect(http.post).toHaveBeenCalledWith('/login', {
      email: 'yami@example.com',
      password: 'secret',
    })
  })

  it('sends the Google credential through the backend service', async () => {
    vi.mocked(http.post).mockResolvedValueOnce({ data: { success: true } })

    await authService.googleLogin('google-credential')

    expect(http.post).toHaveBeenCalledWith('/google-login', { credential: 'google-credential' })
  })

  it('uses the dedicated demo session endpoint', async () => {
    const session = {
      success: true,
      token: 'demo-token',
      user: { _id: 'demo-1', name: 'Flypnp Demo', email: 'demo@example.com', avatar: '', isAdmin: false },
    }
    vi.mocked(http.post).mockResolvedValueOnce({ data: session })

    await expect(authService.demoLogin()).resolves.toEqual(session)
    expect(http.post).toHaveBeenCalledWith('/demo-login')
  })
})
