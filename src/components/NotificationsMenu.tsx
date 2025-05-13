import { useState, useEffect } from 'react';
import { Bell, X } from 'lucide-react';
import { mockNotifications } from '../data/mockData';
import { Notification } from '../types';
import { formatDate } from '../lib/utils';

interface NotificationsMenuProps {
  onClose: () => void;
}

export default function NotificationsMenu({ onClose }: NotificationsMenuProps) {
  const [notifications, setNotifications] = useState<Notification[]>([]);
  
  useEffect(() => {
    // In a real app, fetch notifications from API
    setNotifications(mockNotifications);
  }, []);

  const markAsRead = (id: string) => {
    setNotifications(
      notifications.map(notification => 
        notification.id === id ? { ...notification, read: true } : notification
      )
    );
  };

  const markAllAsRead = () => {
    setNotifications(
      notifications.map(notification => ({ ...notification, read: true }))
    );
  };
  
  return (
    <div className="absolute right-0 mt-2 w-80 bg-white rounded-md shadow-lg border border-neutral-200 overflow-hidden z-50 animate-fade-in">
      <div className="p-3 border-b flex items-center justify-between">
        <div className="flex items-center gap-2">
          <Bell size={16} className="text-primary-600" />
          <h3 className="font-medium">Notifications</h3>
        </div>
        <div className="flex items-center gap-2">
          <button 
            onClick={markAllAsRead}
            className="text-xs text-primary-600 hover:text-primary-700"
          >
            Mark all as read
          </button>
          <button 
            onClick={onClose}
            className="p-1 rounded-full hover:bg-neutral-100"
          >
            <X size={16} />
          </button>
        </div>
      </div>
      
      <div className="max-h-80 overflow-y-auto">
        {notifications.length === 0 ? (
          <div className="p-4 text-center text-neutral-500 text-sm">
            No notifications
          </div>
        ) : (
          <ul className="divide-y divide-neutral-100">
            {notifications.map(notification => (
              <li 
                key={notification.id}
                className={`p-3 hover:bg-neutral-50 ${notification.read ? 'opacity-75' : ''}`}
              >
                <div className="flex items-start gap-2">
                  {!notification.read && (
                    <span className="w-2 h-2 rounded-full bg-primary-600 mt-2 flex-shrink-0" />
                  )}
                  <div className="flex-1">
                    <div className="flex justify-between">
                      <p className="text-sm font-medium">{notification.title}</p>
                      <span className="text-xs text-neutral-500">{formatDate(notification.createdAt)}</span>
                    </div>
                    <p className="text-sm text-neutral-600 mt-1">{notification.message}</p>
                    {!notification.read && (
                      <button 
                        onClick={() => markAsRead(notification.id)}
                        className="text-xs text-primary-600 mt-2 hover:text-primary-700"
                      >
                        Mark as read
                      </button>
                    )}
                  </div>
                </div>
              </li>
            ))}
          </ul>
        )}
      </div>
    </div>
  );
}