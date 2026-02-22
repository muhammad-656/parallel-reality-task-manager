import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { useTasks } from '../context/TaskContext';
import { useReality } from '../context/RealityContext';
import { useTaskFilters } from '../hooks/useTaskFilters';
import { CATEGORY_CONFIG, PRIORITY_CONFIG } from '../constants/categories';

export function DataVisualization() {
  const { tasks } = useTasks();
  const { config } = useReality();
  const { taskStats } = useTaskFilters();
  const [chartType, setChartType] = useState('bar');

  const getWeeklyData = () => {
    const weeks = {};
    const now = new Date();
    
    for (let i = 0; i < 12; i++) {
      const weekStart = new Date(now);
      weekStart.setDate(now.getDate() - (i * 7));
      weekStart.setHours(0, 0, 0, 0);
      
      const weekEnd = new Date(weekStart);
      weekEnd.setDate(weekStart.getDate() + 6);
      weekEnd.setHours(23, 59, 59, 999);
      
      const weekKey = `Week ${i + 1}`;
      weeks[weekKey] = {
        created: 0,
        completed: 0,
        start: weekStart,
        end: weekEnd
      };
    }

    tasks.forEach(task => {
      Object.values(weeks).forEach(week => {
        if (task.createdAt >= week.start && task.createdAt <= week.end) {
          weeks[`Week ${Object.keys(weeks).find(k => weeks[k] === week)}`].created++;
        }
        
        if (task.completedAt && task.completedAt >= week.start && task.completedAt <= week.end) {
          weeks[`Week ${Object.keys(weeks).find(k => weeks[k] === week)}`].completed++;
        }
      });
    });

    return Object.entries(weeks).reverse().slice(0, 8);
  };

  const getCategoryDistribution = () => {
    const distribution = {};
    
    Object.entries(CATEGORY_CONFIG).forEach(([key, category]) => {
      distribution[key] = {
        name: category.name,
        icon: category.icon,
        total: tasks.filter(t => t.category === key).length,
        completed: tasks.filter(t => t.category === key && t.completed).length,
        color: category.color
      };
    });

    return Object.values(distribution).filter(d => d.total > 0);
  };

  const getPriorityDistribution = () => {
    const distribution = {};
    
    Object.entries(PRIORITY_CONFIG).forEach(([key, priority]) => {
      distribution[key] = {
        name: priority.name,
        total: tasks.filter(t => t.priority === key).length,
        completed: tasks.filter(t => t.priority === key && t.completed).length,
        color: priority.color,
        weight: priority.weight
      };
    });

    return Object.values(distribution).filter(d => d.total > 0);
  };

  const getRealityPerformance = () => {
    const performance = {};
    
    ['optimistic', 'realistic', 'disaster'].forEach(reality => {
      const realityTasks = tasks.filter(t => t.completedInReality === reality);
      performance[reality] = {
        name: reality.charAt(0).toUpperCase() + reality.slice(1),
        completed: realityTasks.length,
        totalPoints: realityTasks.reduce((sum, task) => sum + (task[reality]?.points || 0), 0),
        avgDifficulty: realityTasks.length > 0 
          ? realityTasks.reduce((sum, task) => sum + (task[reality]?.difficulty || 0), 0) / realityTasks.length 
          : 0
      };
    });

    return performance;
  };

  const weeklyData = getWeeklyData();
  const categoryData = getCategoryDistribution();
  const priorityData = getPriorityDistribution();
  const realityData = getRealityPerformance();

  const renderBarChart = (data, title, dataKey, colorKey) => (
    <div className="bg-white p-4 rounded-lg border border-gray-200">
      <h3 className="text-lg font-semibold text-gray-800 mb-4">{title}</h3>
      <div className="space-y-3">
        {data.map((item, index) => (
          <div key={index} className="flex items-center space-x-3">
            <div className="w-20 text-sm text-gray-600 font-medium">
              {item.name || `Week ${index + 1}`}
            </div>
            <div className="flex-1 bg-gray-200 rounded-full h-6 relative">
              <motion.div
                initial={{ width: 0 }}
                animate={{ width: `${Math.min(100, (item[dataKey] / Math.max(...data.map(d => d[dataKey]))) * 100)}%` }}
                transition={{ duration: 0.5, delay: index * 0.1 }}
                className={`h-6 rounded-full bg-${item[colorKey] || 'blue'}-500 flex items-center justify-end pr-2`}
              >
                <span className="text-xs text-white font-medium">
                  {item[dataKey]}
                </span>
              </motion.div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );

  const renderPieChart = (data, title) => {
    const total = data.reduce((sum, item) => sum + item.total, 0);
    
    return (
      <div className="bg-white p-4 rounded-lg border border-gray-200">
        <h3 className="text-lg font-semibold text-gray-800 mb-4">{title}</h3>
        <div className="space-y-3">
          {data.map((item, index) => {
            const percentage = total > 0 ? (item.total / total) * 100 : 0;
            
            return (
              <div key={index} className="flex items-center space-x-3">
                <div className="flex items-center space-x-2 w-32">
                  <span className="text-lg">{item.icon || '📊'}</span>
                  <span className="text-sm font-medium text-gray-700">{item.name}</span>
                </div>
                <div className="flex-1 bg-gray-200 rounded-full h-6 relative">
                  <motion.div
                    initial={{ width: 0 }}
                    animate={{ width: `${percentage}%` }}
                    transition={{ duration: 0.5, delay: index * 0.1 }}
                    className={`h-6 rounded-full bg-${item.color}-500 flex items-center justify-end pr-2`}
                  >
                    <span className="text-xs text-white font-medium">
                      {item.total} ({percentage.toFixed(1)}%)
                    </span>
                  </motion.div>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    );
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className={`p-6 rounded-xl ${config.theme.card} border-2`}
    >
      <div className="flex items-center justify-between mb-6">
        <h2 className="text-2xl font-bold text-gray-800">📊 Data Visualization</h2>
        <div className="flex space-x-2">
          {['bar', 'pie'].map((type) => (
            <motion.button
              key={type}
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              onClick={() => setChartType(type)}
              className={`px-4 py-2 rounded-lg font-medium transition-all ${
                chartType === type
                  ? `bg-${config.theme.primary}-500 text-white`
                  : 'bg-gray-200 text-gray-600 hover:bg-gray-300'
              }`}
            >
              {type === 'bar' ? '📊 Bar' : '🥧 Pie'}
            </motion.button>
          ))}
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {chartType === 'bar' ? (
          <>
            {renderBarChart(weeklyData, 'Weekly Activity', 'created', 'color')}
            {renderBarChart(priorityData, 'Priority Distribution', 'total', 'color')}
          </>
        ) : (
          <>
            {renderPieChart(categoryData, 'Task Categories')}
            {renderPieChart(priorityData, 'Task Priorities')}
          </>
        )}
        
        <div className="bg-white p-4 rounded-lg border border-gray-200">
          <h3 className="text-lg font-semibold text-gray-800 mb-4">Reality Performance</h3>
          <div className="space-y-4">
            {Object.entries(realityData).map(([reality, data]) => (
              <div key={reality} className="p-3 bg-gray-50 rounded-lg">
                <div className="flex items-center justify-between mb-2">
                  <h4 className="font-medium text-gray-700">
                    {reality === 'optimistic' ? '☀️' : reality === 'disaster' ? '🌪️' : '⚖️'} {data.name}
                  </h4>
                  <span className={`px-2 py-1 rounded-full text-xs font-medium ${
                    reality === 'optimistic' ? 'bg-green-100 text-green-700' :
                    reality === 'disaster' ? 'bg-red-100 text-red-700' :
                    'bg-gray-100 text-gray-700'
                  }`}>
                    {data.completed} tasks
                  </span>
                </div>
                <div className="grid grid-cols-2 gap-2 text-sm">
                  <div>
                    <span className="text-gray-600">Points:</span>
                    <span className="ml-2 font-medium">{data.totalPoints}</span>
                  </div>
                  <div>
                    <span className="text-gray-600">Avg Difficulty:</span>
                    <span className="ml-2 font-medium">{data.avgDifficulty.toFixed(1)}</span>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      <div className="mt-6 grid grid-cols-1 md:grid-cols-3 gap-4">
        <motion.div
          whileHover={{ scale: 1.02 }}
          className="p-4 bg-gradient-to-r from-blue-50 to-blue-100 rounded-lg border border-blue-200"
        >
          <div className="text-2xl font-bold text-blue-700">{taskStats.completionRate}%</div>
          <div className="text-sm text-blue-600">Completion Rate</div>
        </motion.div>

        <motion.div
          whileHover={{ scale: 1.02 }}
          className="p-4 bg-gradient-to-r from-green-50 to-green-100 rounded-lg border border-green-200"
        >
          <div className="text-2xl font-bold text-green-700">{taskStats.totalPoints}</div>
          <div className="text-sm text-green-600">Total Points Earned</div>
        </motion.div>

        <motion.div
          whileHover={{ scale: 1.02 }}
          className="p-4 bg-gradient-to-r from-purple-50 to-purple-100 rounded-lg border border-purple-200"
        >
          <div className="text-2xl font-bold text-purple-700">{categoryData.length}</div>
          <div className="text-sm text-purple-600">Active Categories</div>
        </motion.div>
      </div>
    </motion.div>
  );
}
