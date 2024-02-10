import { createContext } from 'react'

import { useProvideNotifications } from '../../hooks'

const initialState = {
  notifications: [],
  setNotifications: () => {},
  loading: true,
  setLoading: () => {},
}

export const NotificationsContext = createContext(initialState)

export const NotificationsProvider = ({ children }: any) => {
  const allNotifications = useProvideNotifications()

  return (
    <NotificationsContext.Provider value={allNotifications as any}>
      {children}
    </NotificationsContext.Provider>
  )
}
