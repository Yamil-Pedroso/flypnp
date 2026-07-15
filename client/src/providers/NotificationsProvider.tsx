import { NotificationsContext, useNotificationsController } from '../lib/hooks'

export const NotificationsProvider = ({ children }: { children: React.ReactNode }) => {
  const value = useNotificationsController()
  return <NotificationsContext.Provider value={value}>{children}</NotificationsContext.Provider>
}
