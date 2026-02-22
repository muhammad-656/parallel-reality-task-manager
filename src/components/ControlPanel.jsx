import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { TaskForm } from './TaskForm';
import { useTasks } from '../context/TaskContext';
import { useReality } from '../context/RealityContext';
import { useTaskFilters } from '../hooks/useTaskFilters';

export function ControlPanel() {
  const { tasks, undo, redo, undoStack, redoStack } = useTasks();
  const { config, snapshots, restoreSnapshot, clearHistory } = useReality();
  const { taskStats } = useTaskFilters();
  const [showTaskForm, setShowTaskForm] = useState(false);
  const [showHistory, setShowHistory] = useState(false);

  const incompleteTasks = tasks.filter(task => !task.completed);
  const completedTasks = tasks.filter(task => task.completed);
  const totalPoints = taskStats.totalPoints;

  return (
    <div className="space-y-4">
      <motion.div
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        className={`p-6 rounded-xl ${config.theme.card} border-2`}
      >
        <h2 className="text-2xl font-bold text-gray-800 mb-4">Control Panel</h2>
        
        <motion.button
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
          onClick={() => setShowTaskForm(true)}
          className={`w-full py-3 px-4 rounded-lg bg-${config.theme.primary}-500 text-white font-medium hover:bg-${config.theme.primary}-600 transition-colors mb-4`}
        >
          ➕ Create New Task
        </motion.button>

        <div className="grid grid-cols-2 gap-4 mb-4">
          <div className="text-center p-3 bg-white rounded-lg border">
            <div className="text-2xl font-bold text-blue-600">{incompleteTasks.length}</div>
            <div className="text-sm text-gray-600">Active Tasks</div>
          </div>
          <div className="text-center p-3 bg-white rounded-lg border">
            <div className="text-2xl font-bold text-green-600">{completedTasks.length}</div>
            <div className="text-sm text-gray-600">Completed</div>
          </div>
        </div>

        <div className="text-center p-3 bg-gradient-to-r from-purple-50 to-pink-50 rounded-lg border border-purple-200 mb-4">
          <div className="text-2xl font-bold text-purple-600">{totalPoints}</div>
          <div className="text-sm text-purple-600">Total Points</div>
        </div>

        <div className="flex space-x-2">
          <motion.button
            whileHover={{ scale: undoStack.length > 0 ? 1.05 : 1 }}
            whileTap={{ scale: undoStack.length > 0 ? 0.95 : 1 }}
            onClick={undo}
            disabled={undoStack.length === 0}
            className={`flex-1 py-2 px-3 rounded-lg font-medium transition-all ${
              undoStack.length > 0 
                ? 'bg-blue-500 text-white hover:bg-blue-600' 
                : 'bg-gray-200 text-gray-400 cursor-not-allowed'
            }`}
          >
            ↶ Undo ({undoStack.length})
          </motion.button>
          <motion.button
            whileHover={{ scale: redoStack.length > 0 ? 1.05 : 1 }}
            whileTap={{ scale: redoStack.length > 0 ? 0.95 : 1 }}
            onClick={redo}
            disabled={redoStack.length === 0}
            className={`flex-1 py-2 px-3 rounded-lg font-medium transition-all ${
              redoStack.length > 0 
                ? 'bg-blue-500 text-white hover:bg-blue-600' 
                : 'bg-gray-200 text-gray-400 cursor-not-allowed'
            }`}
          >
            ↷ Redo ({redoStack.length})
          </motion.button>
        </div>
      </motion.div>

      <motion.div
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.1 }}
        className={`p-6 rounded-xl ${config.theme.card} border-2`}
      >
        <div className="flex items-center justify-between mb-4">
          <h3 className="text-lg font-semibold text-gray-800">Reality Snapshots</h3>
          <motion.button
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            onClick={() => setShowHistory(!showHistory)}
            className="text-sm text-blue-600 hover:text-blue-700"
          >
            {showHistory ? 'Hide' : 'Show'} History
          </motion.button>
        </div>

        <div className="text-sm text-gray-600 mb-2">
          {snapshots.length} snapshots available
        </div>

        <AnimatePresence>
          {showHistory && (
            <motion.div
              initial={{ height: 0, opacity: 0 }}
              animate={{ height: 'auto', opacity: 1 }}
              exit={{ height: 0, opacity: 0 }}
              className="space-y-2 max-h-60 overflow-y-auto"
            >
              {snapshots.slice(-5).reverse().map((snapshot) => (
                <motion.div
                  key={snapshot.id}
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  className="flex items-center justify-between p-2 bg-white rounded border hover:bg-gray-50"
                >
                  <div className="text-sm">
                    <div className="font-medium capitalize">{snapshot.mode} Reality</div>
                    <div className="text-xs text-gray-500">
                      {new Date(snapshot.timestamp).toLocaleString()}
                    </div>
                  </div>
                  <motion.button
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                    onClick={() => restoreSnapshot(snapshot.id)}
                    className="px-2 py-1 text-xs bg-blue-500 text-white rounded hover:bg-blue-600"
                  >
                    Restore
                  </motion.button>
                </motion.div>
              ))}
              
              {snapshots.length > 0 && (
                <motion.button
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                  onClick={clearHistory}
                  className="w-full py-2 text-sm text-red-600 hover:bg-red-50 rounded transition-colors"
                >
                  Clear History
                </motion.button>
              )}
            </motion.div>
          )}
        </AnimatePresence>
      </motion.div>

      <AnimatePresence>
        {showTaskForm && (
          <TaskForm onClose={() => setShowTaskForm(false)} />
        )}
      </AnimatePresence>
    </div>
  );
}
