import React from 'react';
import { motion } from 'framer-motion';
import { useReality } from '../context/RealityContext';
import { useTaskFilters } from '../hooks/useTaskFilters';
import { CATEGORY_CONFIG, PRIORITY_CONFIG } from '../constants/categories';

export function AnalyticsDashboard() {
  const { config } = useReality();
  const { taskStats } = useTaskFilters();

  const getProgressColor = (percentage) => {
    if (percentage >= 80) return 'bg-green-500';
    if (percentage >= 60) return 'bg-blue-500';
    if (percentage >= 40) return 'bg-yellow-500';
    return 'bg-red-500';
  };

  const getUrgencyColor = (count) => {
    if (count === 0) return 'text-green-600';
    if (count <= 2) return 'text-yellow-600';
    return 'text-red-600';
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className={`p-6 rounded-xl ${config.theme.card} border-2`}
    >
      <h2 className="text-2xl font-bold text-gray-800 mb-6">Analytics Dashboard</h2>
      
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
        <motion.div
          whileHover={{ scale: 1.02 }}
          className="p-4 bg-white rounded-lg border border-gray-200"
        >
          <div className="text-3xl font-bold text-blue-600">{taskStats.total}</div>
          <div className="text-sm text-gray-600">Total Tasks</div>
        </motion.div>

        <motion.div
          whileHover={{ scale: 1.02 }}
          className="p-4 bg-white rounded-lg border border-gray-200"
        >
          <div className="text-3xl font-bold text-green-600">{taskStats.completed}</div>
          <div className="text-sm text-gray-600">Completed</div>
        </motion.div>

        <motion.div
          whileHover={{ scale: 1.02 }}
          className="p-4 bg-white rounded-lg border border-gray-200"
        >
          <div className="text-3xl font-bold text-orange-600">{taskStats.incomplete}</div>
          <div className="text-sm text-gray-600">In Progress</div>
        </motion.div>

        <motion.div
          whileHover={{ scale: 1.02 }}
          className="p-4 bg-white rounded-lg border border-gray-200"
        >
          <div className="text-3xl font-bold text-purple-600">{taskStats.totalPoints}</div>
          <div className="text-sm text-gray-600">Total Points</div>
        </motion.div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div className="space-y-4">
          <h3 className="text-lg font-semibold text-gray-700">Completion Progress</h3>
          
          <div className="p-4 bg-white rounded-lg border border-gray-200">
            <div className="flex justify-between items-center mb-2">
              <span className="text-sm font-medium text-gray-600">Overall Completion</span>
              <span className="text-sm font-bold text-gray-800">{taskStats.completionRate}%</span>
            </div>
            <div className="w-full bg-gray-200 rounded-full h-3">
              <motion.div
                initial={{ width: 0 }}
                animate={{ width: `${taskStats.completionRate}%` }}
                transition={{ duration: 1, ease: "easeOut" }}
                className={`h-3 rounded-full ${getProgressColor(taskStats.completionRate)}`}
              />
            </div>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div className="p-3 bg-white rounded-lg border border-gray-200">
              <div className={`text-2xl font-bold ${getUrgencyColor(taskStats.overdue)}`}>
                {taskStats.overdue}
              </div>
              <div className="text-xs text-gray-600">Overdue Tasks</div>
            </div>
            <div className="p-3 bg-white rounded-lg border border-gray-200">
              <div className={`text-2xl font-bold ${getUrgencyColor(taskStats.dueSoon)}`}>
                {taskStats.dueSoon}
              </div>
              <div className="text-xs text-gray-600">Due Soon (24h)</div>
            </div>
          </div>
        </div>

        <div className="space-y-4">
          <h3 className="text-lg font-semibold text-gray-700">Task Distribution</h3>
          
          <div className="p-4 bg-white rounded-lg border border-gray-200">
            <h4 className="text-sm font-medium text-gray-600 mb-3">By Category</h4>
            <div className="space-y-2">
              {Object.entries(taskStats.categoryStats).map(([category, count]) => {
                const categoryConfig = CATEGORY_CONFIG[category];
                const percentage = taskStats.total > 0 ? (count / taskStats.total) * 100 : 0;
                
                return (
                  <div key={category} className="flex items-center justify-between">
                    <div className="flex items-center space-x-2">
                      <span className="text-lg">{categoryConfig?.icon || '📁'}</span>
                      <span className="text-sm text-gray-700">{categoryConfig?.name || category}</span>
                    </div>
                    <div className="flex items-center space-x-2">
                      <div className="w-20 bg-gray-200 rounded-full h-2">
                        <motion.div
                          initial={{ width: 0 }}
                          animate={{ width: `${percentage}%` }}
                          transition={{ duration: 0.5, delay: 0.1 }}
                          className={`h-2 rounded-full bg-${categoryConfig?.color || 'gray'}-500`}
                        />
                      </div>
                      <span className="text-sm font-medium text-gray-600 w-8">{count}</span>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>

          <div className="p-4 bg-white rounded-lg border border-gray-200">
            <h4 className="text-sm font-medium text-gray-600 mb-3">By Priority</h4>
            <div className="space-y-2">
              {Object.entries(taskStats.priorityStats).map(([priority, count]) => {
                const priorityConfig = PRIORITY_CONFIG[priority];
                const percentage = taskStats.total > 0 ? (count / taskStats.total) * 100 : 0;
                
                return (
                  <div key={priority} className="flex items-center justify-between">
                    <div className="flex items-center space-x-2">
                      <div className={`w-3 h-3 rounded-full bg-${priorityConfig?.color || 'gray'}-500`} />
                      <span className="text-sm text-gray-700">{priorityConfig?.name || priority}</span>
                    </div>
                    <div className="flex items-center space-x-2">
                      <div className="w-20 bg-gray-200 rounded-full h-2">
                        <motion.div
                          initial={{ width: 0 }}
                          animate={{ width: `${percentage}%` }}
                          transition={{ duration: 0.5, delay: 0.2 }}
                          className={`h-2 rounded-full bg-${priorityConfig?.color || 'gray'}-500`}
                        />
                      </div>
                      <span className="text-sm font-medium text-gray-600 w-8">{count}</span>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        </div>
      </div>

      <div className="mt-6 p-4 bg-gradient-to-r from-blue-50 to-purple-50 rounded-lg border border-blue-200">
        <div className="flex items-center justify-between">
          <div>
            <h4 className="text-sm font-semibold text-blue-800">Current Reality Mode</h4>
            <p className="text-xs text-blue-600">Analytics reflect {config.name.toLowerCase()} effects</p>
          </div>
          <div className="text-right">
            <div className="text-lg font-bold text-blue-800">{config.name}</div>
            <div className="text-xs text-blue-600">
              Points Multiplier: {config.effects.pointMultiplier}x
            </div>
          </div>
        </div>
      </div>
    </motion.div>
  );
}
