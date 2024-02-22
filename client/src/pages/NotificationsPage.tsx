/* eslint-disable @typescript-eslint/no-explicit-any */
import { useState, useEffect } from "react";
import { NotificationsContainer } from "./styles";
import { useNotifications } from "../../hooks";

const NotificationsPage = () => {
  const [notifications, setNotifications] = useState([]);
  const notis = useNotifications();

  console.log(notis.notifications.length);

  useEffect(() => {
    setNotifications(notis.notifications);
  }, [notis.notifications]);

  return (
    <NotificationsContainer>
      <h1>Notifications</h1>
      <div className="notis-wrapper">
        {notifications.slice(0, 12).map((notification: any) => (
          <div className="notis-cont" key={notification.id}>
            <p>{notification.text}</p>
          </div>
        ))}
      </div>
    </NotificationsContainer>
  );
};

export default NotificationsPage;
