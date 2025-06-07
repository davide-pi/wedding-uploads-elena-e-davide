import React from 'react';
import { useNotification } from '../hooks/useNotification';
import Notification from './Notification';

/**
 * Component that renders all active notifications
 */
const NotificationContainer: React.FC = () => {
  const { notifications, hideNotification } = useNotification();

  if (!notifications.length) return null;

  return (
    <div className="fixed top-4 right-4 z-50 w-full max-w-xs">
      {notifications.map(notification => (
        <Notification
          key={notification.id}
          notification={notification}
          onClose={() => hideNotification(notification.id)}
        />
      ))}
    </div>
  );
};

export default NotificationContainer;
