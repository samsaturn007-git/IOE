import React, { useState, useEffect } from 'react';
import './NotificationSystem.css';

const NotificationSystem = () => {
  const [notifications, setNotifications] = useState([]);

  const notificationTypes = [
    { type: 'info', icon: 'ℹ️', message: 'Temperature optimal for productivity', color: 'var(--primary, #00BFFF)' },
    { type: 'success', icon: '✅', message: 'Air quality improved to Good', color: 'var(--secondary, #39FF14)' },
    { type: 'warning', icon: '⚠️', message: 'Low light detected, consider adjusting', color: '#FFA500' },
    { type: 'reminder', icon: '🔔', message: 'Team meeting in 15 minutes', color: 'var(--primary, #00BFFF)' },
    { type: 'achievement', icon: '🎯', message: 'Daily step goal achieved!', color: 'var(--secondary, #39FF14)' },
  ];

  useEffect(() => {
    // Show random notifications
    const interval = setInterval(() => {
      const randomNotif = notificationTypes[Math.floor(Math.random() * notificationTypes.length)];
      const id = Date.now();
      
      setNotifications(prev => [...prev, { ...randomNotif, id }]);

      // Auto-remove after 4 seconds
      setTimeout(() => {
        setNotifications(prev => prev.filter(n => n.id !== id));
      }, 4000);
    }, 15000); // Show notification every 15 seconds

    return () => clearInterval(interval);
  }, []);

  const removeNotification = (id) => {
    setNotifications(prev => prev.filter(n => n.id !== id));
  };

  return (
    <div className="notification-container">
      {notifications.map((notif) => (
        <div
          key={notif.id}
          className={`notification notification-${notif.type}`}
          style={{ borderLeftColor: notif.color }}
          onClick={() => removeNotification(notif.id)}
        >
          <span className="notification-icon">{notif.icon}</span>
          <span className="notification-message">{notif.message}</span>
          <button className="notification-close">×</button>
        </div>
      ))}
    </div>
  );
};

export default NotificationSystem;
