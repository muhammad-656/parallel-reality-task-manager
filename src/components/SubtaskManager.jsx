import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useTasks } from '../context/TaskContext';
import { useReality } from '../context/RealityContext';
import { v4 as uuidv4 } from 'uuid';

export function SubtaskManager({ taskId, subtasks = [], onUpdate }) {
  const { config } = useReality();
  const [newSubtaskTitle, setNewSubtaskTitle] = useState('');
  const [isExpanded, setIsExpanded] = useState(false);

  const addSubtask = () => {
    if (newSubtaskTitle.trim()) {
      const newSubtask = {
        id: uuidv4(),
        title: newSubtaskTitle.trim(),
        completed: false,
        createdAt: Date.now(),
        completedAt: null,
        difficulty: Math.floor(Math.random() * 5) + 1
      };
      
      onUpdate([...subtasks, newSubtask]);
      setNewSubtaskTitle('');
    }
  };

  const toggleSubtask = (subtaskId) => {
    const updatedSubtasks = subtasks.map(subtask => {
      if (subtask.id === subtaskId) {
        return {
          ...subtask,
          completed: !subtask.completed,
          completedAt: !subtask.completed ? Date.now() : null
        };
      }
      return subtask;
    });
    
    onUpdate(updatedSubtasks);
  };

  const deleteSubtask = (subtaskId) => {
    const updatedSubtasks = subtasks.filter(subtask => subtask.id !== subtaskId);
    onUpdate(updatedSubtasks);
  };

  const completedCount = subtasks.filter(st => st.completed).length;
  const totalCount = subtasks.length;
  const progress = totalCount > 0 ? (completedCount / totalCount) * 100 : 0;

  const getDifficultyColor = (difficulty) => {
    if (difficulty <= 2) return 'bg-green-100 text-green-700 border-green-300';
    if (difficulty <= 4) return 'bg-yellow-100 text-yellow-700 border-yellow-300';
    return 'bg-red-100 text-red-700 border-red-300';
  };

  return (
    <motion.div
      initial={{ opacity: 0, height: 0 }}
      animate={{ opacity: 1, height: 'auto' }}
      className={`mt-4 p-4 rounded-lg border-2 ${config.theme.card} border-${config.theme.primary}-200`}
    >
      <div className="flex items-center justify-between mb-3">
        <div className="flex items-center space-x-2">
          <h4 className="font-semibold text-gray-700">Subtasks</h4>
          <span className={`px-2 py-1 rounded-full text-xs font-medium bg-${config.theme.primary}-100 text-${config.theme.primary}-700`}>
            {completedCount}/{totalCount}
          </span>
        </div>
        <motion.button
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
          onClick={() => setIsExpanded(!isExpanded)}
          className={`p-1 rounded ${isExpanded ? `bg-${config.theme.primary}-100 text-${config.theme.primary}-600` : 'bg-gray-100 text-gray-600'}`}
        >
          <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
          </svg>
        </motion.button>
      </div>

      {totalCount > 0 && (
        <div className="mb-3">
          <div className="flex justify-between items-center mb-1">
            <span className="text-xs text-gray-600">Progress</span>
            <span className="text-xs font-medium text-gray-700">{Math.round(progress)}%</span>
          </div>
          <div className="w-full bg-gray-200 rounded-full h-2">
            <motion.div
              initial={{ width: 0 }}
              animate={{ width: `${progress}%` }}
              transition={{ duration: 0.5, ease: "easeOut" }}
              className={`h-2 rounded-full bg-gradient-to-r from-${config.theme.primary}-400 to-${config.theme.primary}-600`}
            />
          </div>
        </div>
      )}

      <AnimatePresence>
        {isExpanded && (
          <motion.div
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: 'auto', opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            className="space-y-2"
          >
            {subtasks.map((subtask, index) => (
              <motion.div
                key={subtask.id}
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: 20 }}
                className={`flex items-center space-x-2 p-2 rounded-lg border ${subtask.completed ? 'opacity-60' : ''} ${config.theme.card} border-gray-200`}
              >
                <motion.button
                  whileHover={{ scale: 1.1 }}
                  whileTap={{ scale: 0.9 }}
                  onClick={() => toggleSubtask(subtask.id)}
                  className={`w-4 h-4 rounded border-2 flex items-center justify-center ${
                    subtask.completed 
                      ? `bg-${config.theme.primary}-500 border-${config.theme.primary}-500` 
                      : `border-${config.theme.primary}-300 hover:border-${config.theme.primary}-400`
                  } transition-colors`}
                >
                  {subtask.completed && (
                    <svg className="w-2 h-2 text-white" fill="currentColor" viewBox="0 0 20 20">
                      <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                    </svg>
                  )}
                </motion.button>
                
                <div className="flex-1">
                  <div className={`text-sm ${subtask.completed ? 'line-through text-gray-500' : `text-${config.theme.primary}-700`}`}>
                    {subtask.title}
                  </div>
                  <div className="flex items-center space-x-2 mt-1">
                    <span className={`px-1 py-0.5 rounded text-xs ${getDifficultyColor(subtask.difficulty)}`}>
                      {subtask.difficulty}/5
                    </span>
                    <span className="text-xs text-gray-500">
                      {new Date(subtask.createdAt).toLocaleDateString()}
                    </span>
                  </div>
                </div>
                
                <motion.button
                  whileHover={{ scale: 1.1 }}
                  whileTap={{ scale: 0.9 }}
                  onClick={() => deleteSubtask(subtask.id)}
                  className="p-1 text-red-500 hover:bg-red-50 rounded transition-colors"
                >
                  <svg className="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                  </svg>
                </motion.button>
              </motion.div>
            ))}

            <div className="flex space-x-2 mt-3">
              <input
                type="text"
                value={newSubtaskTitle}
                onChange={(e) => setNewSubtaskTitle(e.target.value)}
                onKeyPress={(e) => e.key === 'Enter' && addSubtask()}
                placeholder="Add new subtask..."
                className="flex-1 px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 text-sm"
              />
              <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                onClick={addSubtask}
                disabled={!newSubtaskTitle.trim()}
                className={`px-4 py-2 bg-${config.theme.primary}-500 text-white rounded-lg hover:bg-${config.theme.primary}-600 transition-colors disabled:bg-gray-300 disabled:cursor-not-allowed text-sm font-medium`}
              >
                Add
              </motion.button>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.div>
  );
}
