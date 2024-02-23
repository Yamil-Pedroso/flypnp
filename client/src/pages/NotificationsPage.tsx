/* eslint-disable @typescript-eslint/no-explicit-any */
import { useState, useEffect } from 'react'
import { NotificationsContainer } from './styles'
import { useNotifications } from '../../hooks'
import { AiFillDelete } from 'react-icons/ai'

const NotificationsPage = () => {
  const [myNotifications, setMyNotifications] = useState([])
  const { notifications, deleteNotification } = useNotifications()

  useEffect(() => {
    setMyNotifications(notifications as any)
  }, [notifications])

  const handleDeleteNotification = async (id: any) => {
    await deleteNotification(id)
  }

  return (
    <NotificationsContainer>
      <div className="notis-wrapper">
        {myNotifications.length === 0 && <p>No notifications</p>}
        {myNotifications.map((notification: any) => (
          <div className="notis-cont" key={notification.id}>
            <p>{notification.message}</p>
            <AiFillDelete
              className="close-icon"
              size={18}
              onClick={() => handleDeleteNotification(notification._id)}
            />
          </div>
        ))}
      </div>
    </NotificationsContainer>
  )
}

export default NotificationsPage
