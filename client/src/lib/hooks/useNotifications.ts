import { createContext, useCallback, useContext, useEffect, useState } from 'react'
import { getErrorMessage, notificationsService, type Notification } from '../../services'
import { useAuth } from './useAuth'

export interface NotificationsContextValue {
  notifications: Notification[]
  loading: boolean
  error: string | null
  refresh: () => Promise<void>
  markAsRead: (id: string) => Promise<void>
  deleteNotification: (id: string) => Promise<void>
}

export const NotificationsContext = createContext<NotificationsContextValue | null>(null)

export const useNotificationsController = (): NotificationsContextValue => {
  const { user } = useAuth()
  const [notifications, setNotifications] = useState<Notification[]>([])
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const refresh = useCallback(async () => {
    if (!user) return setNotifications([])
    try { setLoading(true); setNotifications(await notificationsService.list()); setError(null) }
    catch (cause) { setError(getErrorMessage(cause, 'Could not load notifications')) }
    finally { setLoading(false) }
  }, [user])
  useEffect(() => {
    if (!user) {
      void refresh()
      return
    }
    void refresh()
    const refreshWhenVisible = () => {
      if (document.visibilityState === 'visible') void refresh()
    }
    const interval = window.setInterval(() => {
      if (document.visibilityState === 'visible') void refresh()
    }, 60_000)
    document.addEventListener('visibilitychange', refreshWhenVisible)
    return () => {
      window.clearInterval(interval)
      document.removeEventListener('visibilitychange', refreshWhenVisible)
    }
  }, [refresh, user])
  return {
    notifications, loading, error, refresh,
    async markAsRead(id) {
      await notificationsService.markRead(id)
      setNotifications((current) => current.map((item) => item._id === id ? { ...item, read: true } : item))
    },
    async deleteNotification(id) {
      await notificationsService.remove(id)
      setNotifications((current) => current.filter((item) => item._id !== id))
    },
  }
}

export const useNotifications = () => {
  const context = useContext(NotificationsContext)
  if (!context) throw new Error('useNotifications must be used inside NotificationsProvider')
  return context
}
