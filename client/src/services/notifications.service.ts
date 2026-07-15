import { http } from './http'
import type { Notification } from './types'

export const notificationsService = {
  async list() {
    return (await http.get<Notification[]>('/user-notifications')).data
  },
  async markRead(id: string) {
    return (await http.put(`/mark-as-read/${id}`)).data
  },
  async remove(id: string) {
    await http.delete(`/delete-notification/${id}`)
  },
}
