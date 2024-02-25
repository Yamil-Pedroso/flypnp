/* eslint-disable @typescript-eslint/no-explicit-any */
import { createContext } from 'react'

import { useProvideNotifications } from '../../hooks'

interface Notifications {
  id: string
  message: string
}

interface NotificationsContextType {
  notifications: Notifications[]
  deleteNotification: (id: string) => Promise<void>
  setNotifications: (notifications: Notifications[]) => void
  loading: boolean
  setLoading: (loading: boolean) => void
}

const initialState: NotificationsContextType = {
  notifications: [],
  deleteNotification: async () => {},
  setNotifications: () => {},
  loading: true,
  setLoading: () => {},
}

export const NotificationsContext = createContext<NotificationsContextType>(
  initialState,
)

interface NotificationsProviderProps {
  children: React.ReactNode
}

export const NotificationsProvider = ({
  children,
}: NotificationsProviderProps) => {
  const allNotifications = useProvideNotifications()

  return (
    <NotificationsContext.Provider value={allNotifications as any}>
      {children}
    </NotificationsContext.Provider>
  )
}
