import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useTasks } from '../context/TaskContext';
import { useReality } from '../context/RealityContext';
import { format, startOfMonth, endOfMonth, eachDayOfInterval, isSameMonth, isSameDay, addMonths, subMonths } from 'date-fns';

export function CalendarView() {
  const { tasks } = useTasks();
  const { config } = useReality();
  const [currentMonth, setCurrentMonth] = useState(new Date());
  const [selectedDate, setSelectedDate] = useState(null);

  const monthStart = startOfMonth(currentMonth);
  const monthEnd = endOfMonth(currentMonth);
  const monthDays = eachDayOfInterval({ start: monthStart, end: monthEnd });

  const getTasksForDate = (date) => {
    return tasks.filter(task => {
      const taskDeadline = new Date(task[config.currentMode]?.deadline);
      return taskDeadline && isSameDay(taskDeadline, date);
    });
  };

  const navigateMonth = (direction) => {
    setCurrentMonth(prev => 
      direction === 'next' ? addMonths(prev, 1) : subMonths(prev, 1)
    );
  };

  const getDayColor = (date, tasksForDate) => {
    const isToday = isSameDay(date, new Date());
    const isSelected = selectedDate && isSameDay(date, selectedDate);
    const hasOverdue = tasksForDate.some(task => {
      const deadline = new Date(task[config.currentMode]?.deadline);
      return deadline < new Date() && !task.completed;
    });

    if (isSelected) return `bg-${config.theme.primary}-500 text-white`;
    if (isToday) return `bg-${config.theme.primary}-100 text-${config.theme.primary}-700 border-2 border-${config.theme.primary}-300`;
    if (hasOverdue) return 'bg-red-100 text-red-700 border border-red-300';
    if (tasksForDate.length > 0) return `bg-${config.theme.secondary}-100 text-${config.theme.secondary}-700`;
    return 'bg-white text-gray-700 hover:bg-gray-50';
  };

  const weekDays = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className={`p-6 rounded-xl ${config.theme.card} border-2`}
    >
      <div className="flex items-center justify-between mb-6">
        <h2 className="text-2xl font-bold text-gray-800">📅 Calendar View</h2>
        <div className="flex items-center space-x-2">
          <motion.button
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            onClick={() => navigateMonth('prev')}
            className="p-2 rounded-lg bg-gray-100 hover:bg-gray-200 transition-colors"
          >
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
            </svg>
          </motion.button>
          
          <div className="px-4 py-2 bg-gray-100 rounded-lg min-w-[150px] text-center">
            <span className="font-semibold text-gray-700">
              {format(currentMonth, 'MMMM yyyy')}
            </span>
          </div>
          
          <motion.button
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            onClick={() => navigateMonth('next')}
            className="p-2 rounded-lg bg-gray-100 hover:bg-gray-200 transition-colors"
          >
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
            </svg>
          </motion.button>
        </div>
      </div>

      <div className="grid grid-cols-7 gap-1 mb-2">
        {weekDays.map(day => (
          <div key={day} className="text-center text-sm font-semibold text-gray-600 py-2">
            {day}
          </div>
        ))}
      </div>

      <div className="grid grid-cols-7 gap-1">
        {monthDays.map((date, index) => {
          const tasksForDate = getTasksForDate(date);
          const isCurrentMonth = isSameMonth(date, currentMonth);
          const dayColor = getDayColor(date, tasksForDate);
          
          return (
            <motion.div
              key={index}
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              onClick={() => setSelectedDate(date)}
              className={`
                min-h-[80px] p-2 border rounded-lg cursor-pointer transition-all
                ${dayColor}
                ${!isCurrentMonth ? 'opacity-40' : ''}
              `}
            >
              <div className="text-sm font-medium mb-1">
                {format(date, 'd')}
              </div>
              
              <div className="space-y-1">
                {tasksForDate.slice(0, 2).map((task, taskIndex) => (
                  <motion.div
                    key={task.id}
                    initial={{ opacity: 0, scale: 0.8 }}
                    animate={{ opacity: 1, scale: 1 }}
                    transition={{ delay: taskIndex * 0.1 }}
                    className={`
                      text-xs p-1 rounded truncate
                      ${task.completed 
                        ? 'bg-gray-200 text-gray-500 line-through' 
                        : `bg-${config.theme.primary}-200 text-${config.theme.primary}-700`
                      }
                    `}
                  >
                    {task.title}
                  </motion.div>
                ))}
                
                {tasksForDate.length > 2 && (
                  <div className="text-xs text-gray-500 font-medium">
                    +{tasksForDate.length - 2} more
                  </div>
                )}
              </div>
            </motion.div>
          );
        })}
      </div>

      <AnimatePresence>
        {selectedDate && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="mt-6 p-4 bg-gray-50 rounded-lg border"
          >
            <div className="flex items-center justify-between mb-3">
              <h3 className="font-semibold text-gray-700">
                Tasks for {format(selectedDate, 'MMMM d, yyyy')}
              </h3>
              <button
                onClick={() => setSelectedDate(null)}
                className="p-1 rounded hover:bg-gray-200 transition-colors"
              >
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                </svg>
              </button>
            </div>
            
            <div className="space-y-2">
              {getTasksForDate(selectedDate).map(task => (
                <motion.div
                  key={task.id}
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  className={`p-3 rounded-lg border ${
                    task.completed 
                      ? 'bg-gray-100 border-gray-200' 
                      : `${config.theme.card} border-${config.theme.primary}-200`
                  }`}
                >
                  <div className="flex items-center justify-between">
                    <div className="flex-1">
                      <div className={`font-medium ${task.completed ? 'line-through text-gray-500' : `text-${config.theme.primary}-700`}`}>
                        {task.title}
                      </div>
                      <div className="text-sm text-gray-500 mt-1">
                        {task[config.currentMode]?.points} points • {task.category}
                      </div>
                    </div>
                    <div className={`px-2 py-1 rounded-full text-xs font-medium ${
                      task.completed 
                        ? 'bg-green-100 text-green-700' 
                        : 'bg-yellow-100 text-yellow-700'
                    }`}>
                      {task.completed ? 'Completed' : 'Pending'}
                    </div>
                  </div>
                </motion.div>
              ))}
              
              {getTasksForDate(selectedDate).length === 0 && (
                <div className="text-center py-4 text-gray-500">
                  No tasks scheduled for this date
                </div>
              )}
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      <div className="mt-6 grid grid-cols-1 md:grid-cols-3 gap-4">
        <motion.div
          whileHover={{ scale: 1.02 }}
          className="p-4 bg-gradient-to-r from-blue-50 to-blue-100 rounded-lg border border-blue-200"
        >
          <div className="text-2xl font-bold text-blue-700">
            {tasks.filter(t => !t.completed).length}
          </div>
          <div className="text-sm text-blue-600">Total Active Tasks</div>
        </motion.div>

        <motion.div
          whileHover={{ scale: 1.02 }}
          className="p-4 bg-gradient-to-r from-green-50 to-green-100 rounded-lg border border-green-200"
        >
          <div className="text-2xl font-bold text-green-700">
            {tasks.filter(t => t.completed).length}
          </div>
          <div className="text-sm text-green-600">Completed This Month</div>
        </motion.div>

        <motion.div
          whileHover={{ scale: 1.02 }}
          className="p-4 bg-gradient-to-r from-purple-50 to-purple-100 rounded-lg border border-purple-200"
        >
          <div className="text-2xl font-bold text-purple-700">
            {tasks.filter(t => {
              const deadline = new Date(t[config.currentMode]?.deadline);
              return deadline && deadline < new Date() && !t.completed;
            }).length}
          </div>
          <div className="text-sm text-purple-600">Overdue Tasks</div>
        </motion.div>
      </div>
    </motion.div>
  );
}
