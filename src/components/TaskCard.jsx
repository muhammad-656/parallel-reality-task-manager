import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useTasks } from '../context/TaskContext';
import { useReality } from '../context/RealityContext';
import { useRealityEffects } from '../hooks/useRealityEffects';
import { format } from 'date-fns';
import { CATEGORY_CONFIG, PRIORITY_CONFIG } from '../constants/categories';
import { SubtaskManager } from './SubtaskManager';

export function TaskCard({ task, index }) {
  const { updateTask, deleteTask } = useTasks();
  const { config, currentMode } = useReality();
  const { getAdjustedDeadline, getAdjustedDifficulty, getAdjustedPoints } = useRealityEffects();
  const [isExpanded, setIsExpanded] = useState(false);

  const categoryConfig = CATEGORY_CONFIG[task.category];
  const priorityConfig = PRIORITY_CONFIG[task.priority];

  const currentTaskData = task[currentMode];
  const adjustedDeadline = getAdjustedDeadline(currentTaskData.deadline);
  const adjustedDifficulty = getAdjustedDifficulty(currentTaskData.difficulty);
  const adjustedPoints = getAdjustedPoints(currentTaskData.points);

  const handleToggleComplete = () => {
    updateTask(task.id, { 
      completed: !task.completed,
      completedAt: !task.completed ? Date.now() : null,
      completedInReality: !task.completed ? currentMode : task.completedInReality
    });
  };

  const handleDelete = () => {
    deleteTask(task.id);
  };

  const getDifficultyColor = (difficulty) => {
    if (difficulty <= 3) return 'text-green-600 bg-green-100';
    if (difficulty <= 6) return 'text-yellow-600 bg-yellow-100';
    return 'text-red-600 bg-red-100';
  };

  const getDeadlineStatus = (deadline) => {
    const now = Date.now();
    const deadlineTime = new Date(deadline).getTime();
    const hoursRemaining = (deadlineTime - now) / (1000 * 60 * 60);
    
    if (hoursRemaining < 0) return { text: 'Overdue', color: 'text-red-600 bg-red-100' };
    if (hoursRemaining < 24) return { text: 'Due Soon', color: 'text-orange-600 bg-orange-100' };
    if (hoursRemaining < 72) return { text: 'This Week', color: 'text-yellow-600 bg-yellow-100' };
    return { text: 'On Track', color: 'text-green-600 bg-green-100' };
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -20 }}
      whileHover={{ scale: 1.02 }}
      whileTap={{ scale: 0.98 }}
      className={`p-4 rounded-lg border-2 ${config.theme.card} ${task.completed ? 'opacity-75' : ''} ${
        config.theme.glow && !task.completed ? config.theme.glow : ''
      } transition-all duration-300 cursor-pointer`}
      onClick={() => setIsExpanded(!isExpanded)}
    >
      <div className="flex items-start justify-between">
        <div className="flex items-start space-x-3 flex-1">
          <motion.button
            whileHover={{ scale: 1.1 }}
            whileTap={{ scale: 0.9 }}
            onClick={(e) => {
              e.stopPropagation();
              handleToggleComplete();
            }}
            className={`mt-1 w-5 h-5 rounded border-2 flex items-center justify-center ${
              task.completed 
                ? `bg-${config.theme.primary}-500 border-${config.theme.primary}-500` 
                : `border-${config.theme.primary}-300 hover:border-${config.theme.primary}-400`
            } transition-colors`}
          >
            {task.completed && (
              <svg className="w-3 h-3 text-white" fill="currentColor" viewBox="0 0 20 20">
                <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414 0l-8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
              </svg>
            )}
          </motion.button>
        </div>
        <div className="flex-1">
          <h3 className={`font-semibold text-lg ${task.completed ? 'line-through text-gray-500' : `text-${config.theme.primary}-700`}`}>
            {task.title}
          </h3>
          
          <p className={`text-sm mt-1 ${task.completed ? 'text-gray-400' : `text-${config.theme.primary}-600`}`}>
            {currentTaskData.description}
          </p>
          
          <div className="flex flex-wrap items-center gap-2 mt-3">
            <span className={`px-2 py-1 rounded-full text-xs font-medium ${getDifficultyColor(adjustedDifficulty)}`}>
              Difficulty: {adjustedDifficulty}/10
            </span>
            
            <span className={`px-2 py-1 rounded-full text-xs font-medium ${getDeadlineStatus(adjustedDeadline).color}`}>
              {getDeadlineStatus(adjustedDeadline).text}
            </span>
            
            <span className={`px-2 py-1 rounded-full text-xs font-medium bg-${config.theme.secondary}-100 text-${config.theme.secondary}-700`}>
              {adjustedPoints} pts
            </span>

            {categoryConfig && (
              <span className="px-2 py-1 rounded-full text-xs font-medium bg-gray-100 text-gray-700">
                {categoryConfig.icon} {categoryConfig.name}
              </span>
            )}

            {priorityConfig && (
              <span className={`px-2 py-1 rounded-full text-xs font-medium bg-${priorityConfig.color}-100 text-${priorityConfig.color}-700`}>
                {priorityConfig.name}
              </span>
            )}

            {currentMode !== 'realistic' && (
              <span className={`px-2 py-1 rounded-full text-xs font-medium bg-purple-100 text-purple-700`}>
                {currentMode === 'optimistic' ? '☀️ Optimistic' : '🌪️ Disaster'}
              </span>
            )}
          </div>
        </div>

        <motion.button
          whileHover={{ scale: 1.1 }}
          whileTap={{ scale: 0.9 }}
          onClick={(e) => {
            e.stopPropagation();
            handleDelete();
          }}
          className={`ml-2 p-1 rounded-lg text-red-500 hover:bg-red-100 transition-colors`}
        >
          <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
          </svg>
        </motion.button>
      </div>

      <AnimatePresence mode="wait">
        {isExpanded && (
          <motion.div
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: 'auto', opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            className="mt-4 pt-4 border-t border-gray-200 space-y-2"
          >
            <div className="flex items-center space-x-2">
              <span className="text-sm font-medium text-gray-700">Created:</span>
              <span className="text-sm text-gray-600">{format(new Date(task.createdAt), 'MMM dd, yyyy HH:mm')}</span>
            </div>

            {task.completed && task.completedAt && (
              <div className="flex items-center space-x-2">
                <span className="text-sm font-medium text-gray-700">Completed:</span>
                <span className="text-sm text-gray-600">{format(new Date(task.completedAt), 'MMM dd, yyyy HH:mm')}</span>
              </div>
            )}

            {task.dependencies && task.dependencies.length > 0 && (
              <div className="flex items-center space-x-2">
                <span className="text-sm font-medium text-gray-700">Dependencies:</span>
                <span className="text-sm text-gray-600">{task.dependencies.length} tasks</span>
              </div>
            )}

            <div className="grid grid-cols-3 gap-2 mt-3">
              <div className="text-xs p-2 rounded bg-emerald-50 border-emerald-200">
                <div className="font-medium text-emerald-700">Optimistic</div>
                <div className="text-emerald-600">{task.optimistic.points} pts</div>
              </div>
              <div className="text-xs p-2 rounded bg-gray-50 border-gray-200">
                <div className="font-medium text-gray-700">Realistic</div>
                <div className="text-gray-600">{task.realistic.points} pts</div>
              </div>
              <div className="text-xs p-2 rounded bg-red-50 border-red-200">
                <div className="font-medium text-red-700">Disaster</div>
                <div className="text-red-600">{task.disaster.points} pts</div>
              </div>
            </div>

            <SubtaskManager 
              taskId={task.id} 
              subtasks={task.subtasks || []}
              onUpdate={(subtasks) => updateTask(task.id, { subtasks })}
            />
          </motion.div>
        )}
      </AnimatePresence>
    </motion.div>
  );
}
