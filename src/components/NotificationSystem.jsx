import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useTasks } from '../context/TaskContext';
import { useReality } from '../context/RealityContext';

export function NotificationSystem() {
  const { tasks } = useTasks();
  const { currentMode } = useReality();
  const [notifications, setNotifications] = useState([]);

  useEffect(() => {
    const checkNotifications = () => {
      const now = Date.now();
      const newNotifications = [];

      tasks.forEach(task => {
        if (task.completed) return;

        const currentTaskData = task[currentMode];
        if (!currentTaskData.deadline) return;

        const deadlineTime = new Date(currentTaskData.deadline).getTime();
        const hoursUntilDue = (deadlineTime - now) / (1000 * 60 * 60);

        if (hoursUntilDue <= 1 && hoursUntilDue > 0) {
          newNotifications.push({
            id: `${task.id}-urgent`,
            type: 'urgent',
            title: 'Task Due Soon!',
            message: `"${task.title}" is due in less than 1 hour!`,
            taskId: task.id,
            timestamp: now
          });
        } else if (hoursUntilDue <= 24 && hoursUntilDue > 23) {
          newNotifications.push({
            id: `${task.id}-24h`,
            type: 'warning',
            title: 'Task Due Tomorrow',
            message: `"${task.title}" is due within 24 hours`,
            taskId: task.id,
            timestamp: now
          });
        }

        if (deadlineTime < now && hoursUntilDue > -1) {
          newNotifications.push({
            id: `${task.id}-overdue`,
            type: 'error',
            title: 'Task Overdue!',
            message: `"${task.title}" was due ${Math.abs(Math.floor(hoursUntilDue))} hours ago`,
            taskId: task.id,
            timestamp: now
          });
        }
      });

      setNotifications(prev => {
        const filtered = prev.filter(n => now - n.timestamp < 60000);
        const unique = [...newNotifications, ...filtered].reduce((acc, notification) => {
          if (!acc.find(n => n.id === notification.id)) {
            acc.push(notification);
          }
          return acc;
        }, []);
        return unique.sort((a, b) => b.timestamp - a.timestamp).slice(0, 5);
      });
    };

    checkNotifications();
    const interval = setInterval(checkNotifications, 30000);

    return () => clearInterval(interval);
  }, [tasks, currentMode]);

  const removeNotification = (id) => {
    setNotifications(prev => prev.filter(n => n.id !== id));
  };

  const getNotificationStyle = (type) => {
    switch (type) {
      case 'urgent':
        return 'bg-red-500 text-white border-red-600';
      case 'error':
        return 'bg-red-600 text-white border-red-700';
      case 'warning':
        return 'bg-yellow-500 text-white border-yellow-600';
      case 'success':
        return 'bg-green-500 text-white border-green-600';
      default:
        return 'bg-blue-500 text-white border-blue-600';
    }
  };

  const getNotificationIcon = (type) => {
    switch (type) {
      case 'urgent':
      case 'error':
        return '🚨';
      case 'warning':
        return '⚠️';
      case 'success':
        return '✅';
      default:
        return '📢';
    }
  };

  return (
    <div className="fixed top-4 right-4 z-50 space-y-2 max-w-sm">
      <AnimatePresence>
        {notifications.map((notification) => (
          <motion.div
            key={notification.id}
            initial={{ opacity: 0, x: 300, scale: 0.8 }}
            animate={{ opacity: 1, x: 0, scale: 1 }}
            exit={{ opacity: 0, x: 300, scale: 0.8 }}
            className={`p-4 rounded-lg border-2 shadow-lg ${getNotificationStyle(notification.type)}`}
          >
            <div className="flex items-start justify-between">
              <div className="flex items-start space-x-2 flex-1">
                <span className="text-xl">{getNotificationIcon(notification.type)}</span>
                <div className="flex-1">
                  <h4 className="font-semibold text-sm">{notification.title}</h4>
                  <p className="text-xs opacity-90 mt-1">{notification.message}</p>
                  <p className="text-xs opacity-75 mt-2">
                    {currentMode === 'optimistic' ? '☀️ Optimistic' : 
                     currentMode === 'disaster' ? '🌪️ Disaster' : '⚖️ Realistic'} Reality
                  </p>
                </div>
              </div>
              <button
                onClick={() => removeNotification(notification.id)}
                className="ml-2 text-white hover:text-gray-200 transition-colors"
              >
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                </svg>
              </button>
            </div>
          </motion.div>
        ))}
      </AnimatePresence>

      {notifications.length === 0 && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          className="text-xs text-gray-500 text-center"
        >
          No notifications
        </motion.div>
      )}
    </div>
  );
}
