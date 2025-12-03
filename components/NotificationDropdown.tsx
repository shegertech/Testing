import React, { useState, useEffect, useRef } from 'react';
import { Bell, Check } from 'lucide-react';
import { api } from '../services/api';
import { User, AppNotification } from '../types';

interface Props {
  user: User;
}

const NotificationDropdown: React.FC<Props> = ({ user }) => {
  const [isOpen, setIsOpen] = useState(false);
  const [notifications, setNotifications] = useState<AppNotification[]>([]);
  const [unreadCount, setUnreadCount] = useState(0);
  const dropdownRef = useRef<HTMLDivElement>(null);

  const fetchNotifications = async () => {
    try {
      const list = await api.notifications.getByUser(user.id);
      setNotifications(list);
      setUnreadCount(list.filter(n => !n.isRead).length);
    } catch (e) {
      console.error("Failed to fetch notifications", e);
    }
  };

  useEffect(() => {
    // Use real-time listener if available, otherwise fall back to polling
    if (api.notifications.listenToUserNotifications) {
      const unsubscribe = api.notifications.listenToUserNotifications(user.id, (list) => {
        setNotifications(list);
        setUnreadCount(list.filter(n => !n.isRead).length);
      });
      return unsubscribe;
    } else {
      // Fallback to polling for mock mode
      fetchNotifications();
      const interval = setInterval(fetchNotifications, 30000);
      return () => clearInterval(interval);
    }
  }, [user]);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setIsOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const handleMarkAsRead = async (id: string) => {
    await api.notifications.markAsRead(id);
    setNotifications(prev => prev.map(n => n.id === id ? { ...n, isRead: true } : n));
    setUnreadCount(prev => Math.max(0, prev - 1));
  };

  return (
    <div className="relative" ref={dropdownRef}>
      <button
        onClick={() => { setIsOpen(!isOpen); if (!isOpen) fetchNotifications(); }}
        className="relative p-2 text-gray-400 hover:text-gray-500 focus:outline-none"
      >
        <Bell className="h-6 w-6" />
        {unreadCount > 0 && (
          <span className="absolute top-1 right-1 block h-4 w-4 rounded-full ring-2 ring-white bg-red-500 text-[10px] font-bold text-white text-center leading-3 flex items-center justify-center">
            {unreadCount}
          </span>
        )}
      </button>

      {isOpen && (
        <div className="origin-top-right absolute right-0 mt-2 w-80 rounded-md shadow-lg py-1 bg-white ring-1 ring-black ring-opacity-5 z-50 max-h-96 overflow-y-auto">
          <div className="px-4 py-2 border-b border-gray-100 flex justify-between items-center">
            <h3 className="text-sm font-semibold text-gray-900">Notifications</h3>
            <button onClick={fetchNotifications} className="text-xs text-blue-600 hover:text-blue-800">Refresh</button>
          </div>
          {notifications.length === 0 ? (
            <div className="px-4 py-6 text-center text-sm text-gray-500">
              No notifications yet.
            </div>
          ) : (
            <div>
              {notifications.map(n => (
                <div key={n.id} className={`px-4 py-3 hover:bg-gray-50 transition border-b border-gray-50 last:border-0 ${n.isRead ? 'opacity-60' : 'bg-blue-50/30'}`}>
                  <div className="flex justify-between items-start">
                    <p className="text-sm font-medium text-gray-900">{n.title}</p>
                    {!n.isRead && (
                      <button onClick={() => handleMarkAsRead(n.id)} title="Mark as read" className="text-blue-600 hover:text-blue-800">
                        <Check className="w-4 h-4" />
                      </button>
                    )}
                  </div>
                  <p className="text-xs text-gray-600 mt-1">{n.message}</p>
                  <p className="text-[10px] text-gray-400 mt-2">{new Date(n.createdAt).toLocaleDateString()}</p>
                </div>
              ))}
            </div>
          )}
        </div>
      )}
    </div>
  );
};

export default NotificationDropdown;
