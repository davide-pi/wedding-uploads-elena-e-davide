import React, { createContext, ReactNode, useState } from 'react';

export type NotificationType = 'error' | 'success' | 'info';

export interface Notification {
  id: string;
  type: NotificationType;
  message: string;
}

interface NotificationContextType {
  notifications: Notification[];
  showNotification: (type: NotificationType, message: string, duration?: number) => string;
  hideNotification: (id: string) => void;
}

// Create the notification context
export const NotificationContext = createContext<NotificationContextType | undefined>(undefined);

interface NotificationProviderProps {
  children: ReactNode;
}

export const NotificationProvider: React.FC<NotificationProviderProps> = ({ children }) => {
  const [notifications, setNotifications] = useState<Notification[]>([]);
  const timeoutsRef = React.useRef<Record<string, number>>({});  // Instead of cleaning up all timeouts at once in the useEffect,
  // we'll clean up each timeout when the notification is removed
  // Show a notification with optional auto-dismiss
  const showNotification = (type: NotificationType, message: string, duration = 3000) => {
    const id = Date.now().toString();

    setNotifications(prev => [...prev, { id, type, message }]);

    if (duration > 0) {
      // Use separate state for each notification's auto-dismiss
      const timer = window.setTimeout(() => {
        hideNotification(id);
      }, duration);

      // Store the timer ID for cleanup
      timeoutsRef.current[id] = timer;
    }

    return id;
  };

  // Hide a specific notification
  const hideNotification = (id: string) => {
    // Clean up timeout if it exists
    if (timeoutsRef.current[id]) {
      clearTimeout(timeoutsRef.current[id]);
      delete timeoutsRef.current[id];
    }
    setNotifications(prev => prev.filter(notification => notification.id !== id));
  };

  return (
    <NotificationContext.Provider value={{ notifications, showNotification, hideNotification }}>
      {children}
    </NotificationContext.Provider>
  );
};
