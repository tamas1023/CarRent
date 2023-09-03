import React, { createContext, useState, useEffect } from "react";
export const NotificationCont = createContext();
const NotificationContext = (props) => {
  const [showNotification, setShowNotification] = useState(false);
  const [type, setType] = useState();
  const [message, setMessage] = useState();

  useEffect(() => {
    const time = setTimeout(() => {
      setShowNotification(false);
    }, 3000);
    return () => clearTimeout(time);
  }, [showNotification]);
  const clearTime = () => {
    setShowNotification(false);
  };
  const notificationHandler = (args) => {
    setType(args.type);
    setMessage(args.message);
    setShowNotification(true);
  };
  return (
    <NotificationCont.Provider
      value={{
        notificationHandler,
        clearTime,
        showNotification,
        type,
        message,
      }}
    >
      {props.children}
    </NotificationCont.Provider>
  );
};

export default NotificationContext;
