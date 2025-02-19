import { useState, useEffect } from 'react';

const NotificationTypes = {
  SUCCESS: {
    icon: '✓',
    className: 'bg-green-50 border-green-500 text-green-700',
    iconClassName: 'bg-green-500'
  },
  ERROR: {
    icon: '✕',
    className: 'bg-red-50 border-red-500 text-red-700',
    iconClassName: 'bg-red-500'
  },
  WARNING: {
    icon: '!',
    className: 'bg-yellow-50 border-yellow-500 text-yellow-700',
    iconClassName: 'bg-yellow-500'
  },
  INFO: {
    icon: 'i',
    className: 'bg-blue-50 border-blue-500 text-blue-700',
    iconClassName: 'bg-blue-500'
  }
};

const Notification = ({ 
  message, 
  type = 'SUCCESS', 
  duration = 3000, 
  onClose 
}) => {
  const [isVisible, setIsVisible] = useState(true);
  const notificationStyle = NotificationTypes[type];

  useEffect(() => {
    const timer = setTimeout(() => {
      setIsVisible(false);
      onClose?.();
    }, duration);

    return () => clearTimeout(timer);
  }, [duration, onClose]);

  if (!isVisible) return null;

  return (
    <div className="fixed top-4 right-4 z-50 animate-slide-in">
      <div className={`flex items-center p-4 rounded-lg border ${notificationStyle.className} shadow-lg max-w-md`}>
        <div className={`${notificationStyle.iconClassName} text-white w-6 h-6 rounded-full flex items-center justify-center mr-3 flex-shrink-0`}>
          {notificationStyle.icon}
        </div>
        <p className="flex-1">{message}</p>
        <button 
          onClick={() => {
            setIsVisible(false);
            onClose?.();
          }}
          className="ml-4 text-gray-500 hover:text-gray-700"
        >
          ✕
        </button>
      </div>
    </div>
  );
};

export default Notification; 