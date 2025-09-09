import React, { useState } from 'react';
import { Bell, Check, X, AlertTriangle, Info, CheckCircle, Clock } from 'lucide-react';
import { Notification } from '../../types';
import { useAuth } from '../../contexts/AuthContext';

const NotificationView: React.FC = () => {
  const { user } = useAuth();
  const [notifications, setNotifications] = useState<Notification[]>([
    {
      id: '1',
      type: 'alert',
      title: 'System Maintenance Scheduled',
      message: 'Scheduled maintenance for Line 2 will begin at 2:00 AM tonight.',
      priority: 'high',
      timestamp: '2024-01-20T10:30:00Z',
      read: false,
      targetRoles: ['maintenance_engineer', 'station_controller']
    },
    {
      id: '2',
      type: 'incident',
      title: 'Equipment Alert - Escalator E-23',
      message: 'Escalator E-23 at Central Station requires immediate attention.',
      priority: 'critical',
      timestamp: '2024-01-20T09:15:00Z',
      read: false,
      targetRoles: ['maintenance_engineer']
    },
    {
      id: '3',
      type: 'update',
      title: 'New SOP Available',
      message: 'Emergency evacuation procedures have been updated.',
      priority: 'medium',
      timestamp: '2024-01-19T16:45:00Z',
      read: true,
      targetRoles: ['station_controller', 'compliance_officer']
    },
    {
      id: '4',
      type: 'reminder',
      title: 'Monthly Safety Audit Due',
      message: 'Monthly safety audit is due next week.',
      priority: 'medium',
      timestamp: '2024-01-19T14:20:00Z',
      read: false,
      targetRoles: ['compliance_officer']
    }
  ]);

  const [filter, setFilter] = useState<'all' | 'unread' | 'high' | 'critical'>('all');

  const filteredNotifications = notifications.filter(notification => {
    // Role-based filtering
    if (!notification.targetRoles.includes(user?.role as any)) {
      return false;
    }

    // Status/Priority filtering
    switch (filter) {
      case 'unread':
        return !notification.read;
      case 'high':
        return notification.priority === 'high';
      case 'critical':
        return notification.priority === 'critical';
      default:
        return true;
    }
  });

  const markAsRead = (id: string) => {
    setNotifications(prev => prev.map(notif => 
      notif.id === id ? { ...notif, read: true } : notif
    ));
  };

  const markAsUnread = (id: string) => {
    setNotifications(prev => prev.map(notif => 
      notif.id === id ? { ...notif, read: false } : notif
    ));
  };

  const deleteNotification = (id: string) => {
    setNotifications(prev => prev.filter(notif => notif.id !== id));
  };

  const markAllAsRead = () => {
    setNotifications(prev => prev.map(notif => ({ ...notif, read: true })));
  };

  const getNotificationIcon = (type: string) => {
    const icons = {
      alert: AlertTriangle,
      incident: AlertTriangle,
      update: Info,
      reminder: Clock
    };
    return icons[type as keyof typeof icons] || Bell;
  };

  const getPriorityColor = (priority: string) => {
    const colors = {
      low: 'text-gray-500 bg-gray-100',
      medium: 'text-blue-600 bg-blue-100',
      high: 'text-orange-600 bg-orange-100',
      critical: 'text-red-600 bg-red-100'
    };
    return colors[priority as keyof typeof colors] || colors.medium;
  };

  const getTypeColor = (type: string) => {
    const colors = {
      alert: 'text-yellow-600 bg-yellow-100',
      incident: 'text-red-600 bg-red-100',
      update: 'text-blue-600 bg-blue-100',
      reminder: 'text-purple-600 bg-purple-100'
    };
    return colors[type as keyof typeof colors] || colors.update;
  };

  const formatTimestamp = (timestamp: string) => {
    const date = new Date(timestamp);
    const now = new Date();
    const diffTime = Math.abs(now.getTime() - date.getTime());
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));

    if (diffDays === 1) {
      return 'Today';
    } else if (diffDays === 2) {
      return 'Yesterday';
    } else if (diffDays <= 7) {
      return `${diffDays - 1} days ago`;
    } else {
      return date.toLocaleDateString();
    }
  };

  const unreadCount = notifications.filter(n => !n.read && n.targetRoles.includes(user?.role as any)).length;

  return (
    <div className="p-6">
      <div className="flex items-center justify-between mb-8">
        <div>
          <h1 className="text-2xl font-bold text-gray-900 mb-2">Notifications</h1>
          <p className="text-gray-600">
            Stay updated with important alerts and system updates
          </p>
        </div>
        
        {unreadCount > 0 && (
          <button
            onClick={markAllAsRead}
            className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition-colors"
          >
            Mark All as Read
          </button>
        )}
      </div>

      {/* Filters */}
      <div className="flex flex-wrap gap-2 mb-6">
        {[
          { key: 'all', label: 'All', count: filteredNotifications.length },
          { key: 'unread', label: 'Unread', count: notifications.filter(n => !n.read && n.targetRoles.includes(user?.role as any)).length },
          { key: 'high', label: 'High Priority', count: notifications.filter(n => n.priority === 'high' && n.targetRoles.includes(user?.role as any)).length },
          { key: 'critical', label: 'Critical', count: notifications.filter(n => n.priority === 'critical' && n.targetRoles.includes(user?.role as any)).length }
        ].map(({ key, label, count }) => (
          <button
            key={key}
            onClick={() => setFilter(key as any)}
            className={`px-4 py-2 rounded-lg border transition-colors ${
              filter === key
                ? 'bg-blue-600 text-white border-blue-600'
                : 'bg-white text-gray-700 border-gray-300 hover:bg-gray-50'
            }`}
          >
            {label}
            {count > 0 && (
              <span className={`ml-2 px-2 py-1 rounded-full text-xs ${
                filter === key
                  ? 'bg-white text-blue-600'
                  : 'bg-gray-200 text-gray-600'
              }`}>
                {count}
              </span>
            )}
          </button>
        ))}
      </div>

      {/* Notification List */}
      <div className="space-y-4">
        {filteredNotifications.length === 0 ? (
          <div className="text-center py-12">
            <Bell className="h-12 w-12 text-gray-400 mx-auto mb-4" />
            <p className="text-gray-600">No notifications found</p>
            <p className="text-sm text-gray-500 mt-2">You're all caught up!</p>
          </div>
        ) : (
          filteredNotifications.map((notification) => {
            const Icon = getNotificationIcon(notification.type);
            
            return (
              <div
                key={notification.id}
                className={`bg-white rounded-lg border p-6 transition-all hover:shadow-md ${
                  notification.read ? 'border-gray-200' : 'border-l-4 border-l-blue-500 border-gray-200'
                }`}
              >
                <div className="flex items-start gap-4">
                  <div className={`p-2 rounded-lg ${getTypeColor(notification.type)}`}>
                    <Icon className="h-5 w-5" />
                  </div>
                  
                  <div className="flex-1">
                    <div className="flex items-start justify-between mb-2">
                      <div>
                        <h3 className={`font-semibold ${notification.read ? 'text-gray-700' : 'text-gray-900'}`}>
                          {notification.title}
                        </h3>
                        <div className="flex items-center gap-2 mt-1">
                          <span className={`px-2 py-1 rounded-full text-xs font-medium ${getPriorityColor(notification.priority)}`}>
                            {notification.priority.toUpperCase()}
                          </span>
                          <span className="text-sm text-gray-500">
                            {formatTimestamp(notification.timestamp)}
                          </span>
                        </div>
                      </div>
                      
                      <div className="flex items-center gap-1">
                        {notification.read ? (
                          <button
                            onClick={() => markAsUnread(notification.id)}
                            className="p-1 text-gray-400 hover:text-gray-600 rounded transition-colors"
                            title="Mark as unread"
                          >
                            <Bell className="h-4 w-4" />
                          </button>
                        ) : (
                          <button
                            onClick={() => markAsRead(notification.id)}
                            className="p-1 text-gray-400 hover:text-green-600 rounded transition-colors"
                            title="Mark as read"
                          >
                            <CheckCircle className="h-4 w-4" />
                          </button>
                        )}
                        
                        <button
                          onClick={() => deleteNotification(notification.id)}
                          className="p-1 text-gray-400 hover:text-red-600 rounded transition-colors"
                          title="Delete notification"
                        >
                          <X className="h-4 w-4" />
                        </button>
                      </div>
                    </div>
                    
                    <p className={`${notification.read ? 'text-gray-600' : 'text-gray-700'}`}>
                      {notification.message}
                    </p>
                  </div>
                </div>
              </div>
            );
          })
        )}
      </div>

      {/* Notification Settings */}
      <div className="mt-8 bg-gray-50 rounded-lg p-6">
        <h3 className="text-lg font-semibold text-gray-900 mb-4">Notification Preferences</h3>
        <div className="space-y-3">
          <label className="flex items-center">
            <input type="checkbox" defaultChecked className="rounded border-gray-300 text-blue-600 mr-3" />
            <span className="text-gray-700">Email notifications for critical alerts</span>
          </label>
          <label className="flex items-center">
            <input type="checkbox" defaultChecked className="rounded border-gray-300 text-blue-600 mr-3" />
            <span className="text-gray-700">Microsoft Teams integration</span>
          </label>
          <label className="flex items-center">
            <input type="checkbox" defaultChecked className="rounded border-gray-300 text-blue-600 mr-3" />
            <span className="text-gray-700">Push notifications for mobile app</span>
          </label>
          <label className="flex items-center">
            <input type="checkbox" className="rounded border-gray-300 text-blue-600 mr-3" />
            <span className="text-gray-700">Daily digest emails</span>
          </label>
        </div>
      </div>
    </div>
  );
};

export default NotificationView;