import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useTasks } from '../context/TaskContext';
import { useReality } from '../context/RealityContext';

export function DependencyManager({ taskId, dependencies = [], onUpdate }) {
  const { tasks } = useTasks();
  const { config } = useReality();
  const [isExpanded, setIsExpanded] = useState(false);

  const availableTasks = tasks.filter(task => 
    task.id !== taskId && 
    !task.completed && 
    !dependencies.includes(task.id)
  );

  const addDependency = (dependencyId) => {
    onUpdate([...dependencies, dependencyId]);
  };

  const removeDependency = (dependencyId) => {
    onUpdate(dependencies.filter(id => id !== dependencyId));
  };

  const getDependencyStatus = (dependencyId) => {
    const task = tasks.find(t => t.id === dependencyId);
    if (!task) return 'unknown';
    
    if (task.completed) return 'completed';
    if (task[config.currentMode]?.deadline) {
      const deadline = new Date(task[config.currentMode].deadline);
      const now = new Date();
      return deadline < now ? 'overdue' : 'pending';
    }
    return 'pending';
  };

  const getStatusColor = (status) => {
    switch (status) {
      case 'completed': return 'bg-green-100 text-green-700 border-green-300';
      case 'overdue': return 'bg-red-100 text-red-700 border-red-300';
      case 'pending': return 'bg-yellow-100 text-yellow-700 border-yellow-300';
      default: return 'bg-gray-100 text-gray-700 border-gray-300';
    }
  };

  const getStatusIcon = (status) => {
    switch (status) {
      case 'completed': return '✅';
      case 'overdue': return '🚨';
      case 'pending': return '⏳';
      default: return '❓';
    }
  };

  return (
    <motion.div
      initial={{ opacity: 0, height: 0 }}
      animate={{ opacity: 1, height: 'auto' }}
      className={`mt-4 p-4 rounded-lg border-2 ${config.theme.card} border-${config.theme.primary}-200`}
    >
      <div className="flex items-center justify-between mb-3">
        <div className="flex items-center space-x-2">
          <h4 className="font-semibold text-gray-700">🔗 Dependencies</h4>
          <span className={`px-2 py-1 rounded-full text-xs font-medium bg-${config.theme.primary}-100 text-${config.theme.primary}-700`}>
            {dependencies.length} required
          </span>
        </div>
        <motion.button
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
          onClick={() => setIsExpanded(!isExpanded)}
          className={`p-1 rounded-lg ${isExpanded ? `bg-${config.theme.primary}-100 text-${config.theme.primary}-600` : 'bg-gray-100 text-gray-600'}`}
        >
          <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
          </svg>
        </motion.button>
      </div>

      {dependencies.length > 0 && (
        <div className="space-y-2 mb-3">
          {dependencies.map((depId, index) => {
            const task = tasks.find(t => t.id === depId);
            const status = getDependencyStatus(depId);
            
            if (!task) return null;
            
            return (
              <motion.div
                key={depId}
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                className={`flex items-center justify-between p-2 rounded-lg border ${getStatusColor(status)}`}
              >
                <div className="flex items-center space-x-2">
                  <span className="text-lg">{getStatusIcon(status)}</span>
                  <div>
                    <div className="font-medium text-sm">{task.title}</div>
                    <div className="text-xs opacity-75">
                      {task.category} • {task.priority} priority
                    </div>
                  </div>
                </div>
                
                <motion.button
                  whileHover={{ scale: 1.1 }}
                  whileTap={{ scale: 0.9 }}
                  onClick={() => removeDependency(depId)}
                  className="p-1 text-red-500 hover:bg-red-50 rounded transition-colors"
                >
                  <svg className="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                  </svg>
                </motion.button>
              </motion.div>
            );
          })}
        </div>
      )}

      <AnimatePresence>
        {isExpanded && availableTasks.length > 0 && (
          <motion.div
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: 'auto', opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            className="space-y-2"
          >
            <div className="text-sm font-medium text-gray-700 mb-2">
              Available tasks to add as dependencies:
            </div>
            
            {availableTasks.map((task) => (
              <motion.div
                key={task.id}
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                whileHover={{ scale: 1.02 }}
                className={`flex items-center justify-between p-3 rounded-lg border cursor-pointer ${config.theme.card} border-gray-200 hover:border-${config.theme.primary}-300`}
                onClick={() => addDependency(task.id)}
              >
                <div className="flex items-center space-x-2">
                  <div className={`w-2 h-2 rounded-full bg-${task.category === 'work' ? 'blue' : task.category === 'personal' ? 'green' : 'purple'}`} />
                  <div>
                    <div className="font-medium text-sm">{task.title}</div>
                    <div className="text-xs text-gray-500">
                      {task[config.currentMode]?.points} points • {task.priority}
                    </div>
                  </div>
                </div>
                
                <motion.button
                  whileHover={{ scale: 1.1 }}
                  whileTap={{ scale: 0.9 }}
                  className={`px-3 py-1 text-sm font-medium bg-${config.theme.primary}-500 text-white rounded hover:bg-${config.theme.primary}-600 transition-colors`}
                >
                  Add Dependency
                </motion.button>
              </motion.div>
            ))}
          </motion.div>
        )}
      </AnimatePresence>

      {dependencies.length === 0 && (
        <div className="text-center py-4 text-gray-500">
          <div className="text-lg mb-2">🔗</div>
          <div className="text-sm">No dependencies set</div>
          <div className="text-xs mt-1">
            Add dependencies to ensure tasks are completed in the correct order
          </div>
        </div>
      )}

      {availableTasks.length === 0 && dependencies.length === 0 && (
        <div className="text-center py-4 text-gray-500">
          <div className="text-sm">No available tasks to add as dependencies</div>
          <div className="text-xs mt-1">
            Create more tasks or complete existing ones to enable dependencies
          </div>
        </div>
      )}

      <div className="mt-4 p-3 bg-blue-50 border border-blue-200 rounded-lg">
        <div className="flex items-start space-x-2">
          <span className="text-lg">💡</span>
          <div className="text-sm text-blue-700">
            <div className="font-medium mb-1">Dependency Rules:</div>
            <ul className="space-y-1 text-xs">
              <li>• Tasks with dependencies can't be completed until all dependencies are done</li>
              <li>• Circular dependencies are automatically prevented</li>
              <li>• Completed dependencies are shown with a green checkmark</li>
              <li>• Overdue dependencies are highlighted in red</li>
            </ul>
          </div>
        </div>
      </div>
    </motion.div>
  );
}
