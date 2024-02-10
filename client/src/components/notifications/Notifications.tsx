import { NotificationsContainer } from './styles'

interface NotificationsProps {
  text: string
}

const Notifications = (props: NotificationsProps) => {
  return (
    <NotificationsContainer>
      <p>{props.text}</p>
    </NotificationsContainer>
  )
}

export default Notifications
