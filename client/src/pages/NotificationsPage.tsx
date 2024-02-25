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
      {myNotifications.length === 0 ? (
        <h1>No notis</h1>
      ) : (
        <h1>You have notis...</h1>
      )}
      <div className="notis-wrapper">
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
