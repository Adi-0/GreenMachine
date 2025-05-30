
import React from 'react';
import { NotificationMessage } from '../types';
import { CheckCircleIcon, ExclamationTriangleIcon, InformationCircleIcon, XCircleIcon } from './icons';

interface NotificationsPanelProps {
  notifications: NotificationMessage[];
  onDismiss: (id: string) => void;
}

const iconMap = {
  info: <InformationCircleIcon className="w-6 h-6 text-blue-500" />,
  success: <CheckCircleIcon className="w-6 h-6 text-green-500" />,
  warning: <ExclamationTriangleIcon className="w-6 h-6 text-yellow-500" />,
  error: <XCircleIcon className="w-6 h-6 text-red-500" />,
};

const bgColorMap = {
  info: 'bg-blue-50 border-blue-400',
  success: 'bg-green-50 border-green-400',
  warning: 'bg-yellow-50 border-yellow-400',
  error: 'bg-red-50 border-red-400',
}

const NotificationsPanel: React.FC<NotificationsPanelProps> = ({ notifications, onDismiss }) => {
  if (notifications.length === 0) {
    return null;
  }

  return (
    <div className="fixed top-5 right-5 w-full max-w-sm space-y-3 z-50">
      {notifications.map((notification) => (
        <div
          key={notification.id}
          className={`p-4 rounded-md shadow-lg flex items-start space-x-3 border-l-4 ${bgColorMap[notification.type]}`}
        >
          <div className="flex-shrink-0">{iconMap[notification.type]}</div>
          <div className="flex-1">
            <p className={`text-sm font-medium ${
                notification.type === 'info' ? 'text-blue-800' :
                notification.type === 'success' ? 'text-green-800' :
                notification.type === 'warning' ? 'text-yellow-800' :
                'text-red-800'
            }`}>{notification.message}</p>
          </div>
          <button
            onClick={() => onDismiss(notification.id)}
            className={`ml-auto -mx-1.5 -my-1.5 p-1.5 rounded-md inline-flex items-center justify-center focus:outline-none focus:ring-2 ${
                notification.type === 'info' ? 'text-blue-500 hover:bg-blue-100 focus:ring-blue-600' :
                notification.type === 'success' ? 'text-green-500 hover:bg-green-100 focus:ring-green-600' :
                notification.type === 'warning' ? 'text-yellow-500 hover:bg-yellow-100 focus:ring-yellow-600' :
                'text-red-500 hover:bg-red-100 focus:ring-red-600'
            }`}
            aria-label="Dismiss"
          >
            <XCircleIcon className="w-5 h-5" />
          </button>
        </div>
      ))}
    </div>
  );
};

export default NotificationsPanel;
    