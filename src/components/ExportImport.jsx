import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { useTasks } from '../context/TaskContext';
import { useReality } from '../context/RealityContext';
import { useFilters } from '../context/FilterContext';

export function ExportImport() {
  const { tasks, loadTasks } = useTasks();
  const { config } = useReality();
  const { resetFilters } = useFilters();
  const [importData, setImportData] = useState('');

  const exportTasks = () => {
    const exportObj = {
      version: '1.0',
      exportedAt: new Date().toISOString(),
      currentReality: config.currentMode,
      tasks: tasks,
      metadata: {
        totalTasks: tasks.length,
        completedTasks: tasks.filter(t => t.completed).length,
        categories: [...new Set(tasks.map(t => t.category).filter(Boolean))],
        priorities: [...new Set(tasks.map(t => t.priority).filter(Boolean))]
      }
    };

    const dataStr = JSON.stringify(exportObj, null, 2);
    const dataBlob = new Blob([dataStr], { type: 'application/json' });
    const url = URL.createObjectURL(dataBlob);
    
    const link = document.createElement('a');
    link.href = url;
    link.download = `parallel-reality-tasks-${new Date().toISOString().split('T')[0]}.json`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(url);
  };

  const importTasks = () => {
    try {
      const imported = JSON.parse(importData);
      
      if (!imported.tasks || !Array.isArray(imported.tasks)) {
        throw new Error('Invalid file format');
      }

      const confirmImport = window.confirm(
        `Import ${imported.tasks.length} tasks? This will replace all current tasks.`
      );

      if (confirmImport) {
        loadTasks(imported.tasks);
        resetFilters();
        setImportData('');
        alert('Tasks imported successfully!');
      }
    } catch (error) {
      alert('Error importing tasks: ' + error.message);
    }
  };

  const exportToCSV = () => {
    const headers = [
      'Title', 'Category', 'Priority', 'Status', 'Created At', 
      'Optimistic Points', 'Realistic Points', 'Disaster Points',
      'Current Reality', 'Adjusted Points'
    ];

    const csvData = tasks.map(task => {
      const currentTaskData = task[config.currentMode];
      return [
        `"${task.title}"`,
        task.category || '',
        task.priority || '',
        task.completed ? 'Completed' : 'Active',
        new Date(task.createdAt).toLocaleDateString(),
        task.optimistic.points || 0,
        task.realistic.points || 0,
        task.disaster.points || 0,
        config.currentMode,
        Math.round((currentTaskData?.points || 0) * config.effects.pointMultiplier)
      ].join(',');
    });

    const csv = [headers.join(','), ...csvData].join('\n');
    const blob = new Blob([csv], { type: 'text/csv' });
    const url = URL.createObjectURL(blob);
    
    const link = document.createElement('a');
    link.href = url;
    link.download = `parallel-reality-tasks-${new Date().toISOString().split('T')[0]}.csv`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(url);
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className={`p-6 rounded-xl ${config.theme.card} border-2`}
    >
      <h2 className="text-xl font-semibold text-gray-800 mb-4">Export & Import</h2>
      
      <div className="space-y-6">
        <div>
          <h3 className="text-lg font-medium text-gray-700 mb-3">Export Tasks</h3>
          <div className="flex flex-col sm:flex-row gap-3">
            <motion.button
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              onClick={exportTasks}
              className={`flex-1 py-2 px-4 bg-${config.theme.primary}-500 text-white rounded-lg hover:bg-${config.theme.primary}-600 transition-colors`}
            >
              📤 Export as JSON
            </motion.button>
            <motion.button
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              onClick={exportToCSV}
              className={`flex-1 py-2 px-4 bg-${config.theme.secondary}-500 text-white rounded-lg hover:bg-${config.theme.secondary}-600 transition-colors`}
            >
              📊 Export as CSV
            </motion.button>
          </div>
          <p className="text-sm text-gray-600 mt-2">
            Export {tasks.length} tasks with all reality data
          </p>
        </div>

        <div>
          <h3 className="text-lg font-medium text-gray-700 mb-3">Import Tasks</h3>
          <textarea
            value={importData}
            onChange={(e) => setImportData(e.target.value)}
            placeholder="Paste your exported JSON data here..."
            className="w-full h-32 px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 font-mono text-sm"
          />
          <motion.button
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
            onClick={importTasks}
            disabled={!importData.trim()}
            className={`mt-3 py-2 px-4 bg-green-500 text-white rounded-lg hover:bg-green-600 transition-colors disabled:bg-gray-300 disabled:cursor-not-allowed`}
          >
            📥 Import Tasks
          </motion.button>
        </div>

        <div className="p-4 bg-blue-50 border border-blue-200 rounded-lg">
          <h4 className="text-sm font-semibold text-blue-800 mb-2">💡 Export/Import Info</h4>
          <ul className="text-xs text-blue-700 space-y-1">
            <li>• JSON format preserves all reality modes and metadata</li>
            <li>• CSV format exports current reality view only</li>
            <li>• Import replaces all existing tasks</li>
            <li>• Tasks maintain their original creation dates</li>
            <li>• Reality-specific data is preserved in JSON format</li>
          </ul>
        </div>
      </div>
    </motion.div>
  );
}
