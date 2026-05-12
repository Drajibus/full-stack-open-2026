const Notification = ({ notification }) => {
  if (notification === null) {
    return null;
  }

  return (
    <div className={notification.notificationClass}>{notification.message}</div>
  );
};

export default Notification;
