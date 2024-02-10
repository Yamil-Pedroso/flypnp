import { useState, useEffect } from 'react'
//import Notifications from '../components/notifications/Notifications'
import { useNotifications } from '../../hooks'

const NotificationsPage = () => {
  const [notifications, setNotifications] = useState([])
  const notis = useNotifications()

  console.log(notis.notifications.length)

  useEffect(() => {
    setNotifications(notis.notifications)
  }, [notis.notifications])

  return (
    <div>
      <h1>Notifications</h1>
      <ul>
        {notifications.map((notification: any) => (
          <li key={notification.id}>{notification.text}</li>
        ))}
      </ul>
    </div>
  )
}

export default NotificationsPage
