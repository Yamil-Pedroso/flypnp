import { createContext, useContext, useEffect, useState } from 'react'
import { authService, getErrorMessage, setAuthToken, type User } from '../../services'

type AuthInput = { email: string; password: string }
type RegisterInput = AuthInput & { name: string; avatar: File | null }
type AuthResult = { success: boolean; message?: string; user?: User }

export interface AuthContextValue {
  user: User | null
  loading: boolean
  error: string | null
  setUser: (user: User | null) => void
  getAllUsers: () => Promise<User[]>
  register: (input: RegisterInput) => Promise<AuthResult>
  login: (input: AuthInput) => Promise<AuthResult>
  googleLogin: (credential: string) => Promise<AuthResult>
  logout: () => Promise<AuthResult>
  updateUser: (input: FormData | Record<string, string>, id: string) => Promise<AuthResult>
  uploadPicture: (avatar: File) => Promise<{ success: boolean; url?: string }>
}

export const AuthContext = createContext<AuthContextValue | null>(null)

const saveSession = (user: User, token: string) => {
  localStorage.setItem('user', JSON.stringify(user))
  localStorage.setItem('token', token)
  setAuthToken(token)
}

export const useAuthController = (): AuthContextValue => {
  const [user, setUser] = useState<User | null>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    const stored = localStorage.getItem('user')
    const token = localStorage.getItem('token')
    if (stored && token) {
      try {
        setUser(JSON.parse(stored) as User)
        setAuthToken(token)
      } catch {
        localStorage.removeItem('user')
        localStorage.removeItem('token')
      }
    }
    setLoading(false)
  }, [])

  const runSession = async (request: () => Promise<{ user: User; token: string }>) => {
    try {
      setError(null)
      const session = await request()
      setUser(session.user)
      saveSession(session.user, session.token)
      return { success: true, user: session.user }
    } catch (cause) {
      const message = getErrorMessage(cause, 'Authentication failed')
      setError(message)
      return { success: false, message }
    }
  }

  return {
    user,
    loading,
    error,
    setUser,
    getAllUsers: authService.listUsers,
    register: (input) => runSession(() => authService.register(input)),
    login: (input) => runSession(() => authService.login(input)),
    googleLogin: (credential) => runSession(() => authService.googleLogin(credential)),
    async logout() {
      try {
        await authService.logout()
      } finally {
        setUser(null)
        localStorage.removeItem('user')
        localStorage.removeItem('token')
        setAuthToken()
      }
      return { success: true }
    },
    async updateUser(input, id) {
      try {
        const session = await authService.update(id, input)
        setUser(session.user)
        saveSession(session.user, session.token)
        return { success: true, user: session.user }
      } catch (cause) {
        return { success: false, message: getErrorMessage(cause) }
      }
    },
    async uploadPicture(avatar) {
      try {
        return await authService.uploadAvatar(avatar)
      } catch (cause) {
        setError(getErrorMessage(cause))
        return { success: false }
      }
    },
  }
}

export const useAuth = () => {
  const context = useContext(AuthContext)
  if (!context) throw new Error('useAuth must be used inside UserProvider')
  return context
}
