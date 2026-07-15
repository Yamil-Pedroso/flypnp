import axios from 'axios'

export const apiBaseUrl = import.meta.env.VITE_BASE_URL || '/api/v1'

export const http = axios.create({
  baseURL: apiBaseUrl,
  withCredentials: true,
  timeout: 15_000,
})

http.interceptors.request.use((config) => {
  const token = localStorage.getItem('token')
  if (token) config.headers.Authorization = `Bearer ${token}`
  return config
})

export const setAuthToken = (token?: string) => {
  if (token) http.defaults.headers.common.Authorization = `Bearer ${token}`
  else delete http.defaults.headers.common.Authorization
}
