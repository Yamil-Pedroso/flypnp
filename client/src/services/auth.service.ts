import { http } from './http'
import type { ApiResponse, User } from './types'

export interface SessionResponse {
  success: boolean
  token: string
  user: User
}

export const authService = {
  async register(input: { name: string; email: string; password: string; avatar: File | null }) {
    const form = new FormData()
    form.append('name', input.name)
    form.append('email', input.email)
    form.append('password', input.password)
    if (input.avatar) form.append('avatar', input.avatar)
    return (await http.post<SessionResponse>('/register', form)).data
  },
  async login(input: { email: string; password: string }) {
    return (await http.post<SessionResponse>('/login', input)).data
  },
  async googleLogin(credential: string) {
    return (await http.post<SessionResponse>('/google-login', { credential })).data
  },
  async logout() {
    return (await http.get<ApiResponse<never>>('/logout')).data
  },
  async update(id: string, input: FormData | Record<string, string>) {
    return (await http.put<SessionResponse>(`/update/${id}`, input)).data
  },
  async uploadAvatar(avatar: File) {
    const form = new FormData()
    form.append('avatar', avatar)
    return (await http.post<{ success: boolean; url: string }>('/upload-avatar', form)).data
  },
  async listUsers() {
    return (await http.get<ApiResponse<User[]>>('/users')).data.data
  },
}
