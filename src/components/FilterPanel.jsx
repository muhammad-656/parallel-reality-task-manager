import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useFilters } from '../context/FilterContext';
import { useReality } from '../context/RealityContext';
import { 
  TASK_CATEGORIES, 
  CATEGORY_CONFIG, 
  TASK_PRIORITIES, 
  PRIORITY_CONFIG, 
  SORT_CONFIG 
} from '../constants/categories';

export function FilterPanel() {
  const { 
    categories, 
    priorities, 
    searchQuery, 
    sortBy, 
    showCompleted, 
    setCategories, 
    setPriorities, 
    setSearchQuery, 
    setSortBy, 
    toggleShowCompleted, 
    resetFilters 
  } = useFilters();
  const { config } = useReality();
  const [isExpanded, setIsExpanded] = useState(false);

  const handleCategoryToggle = (category) => {
    const newCategories = categories.includes(category)
      ? categories.filter(c => c !== category)
      : [...categories, category];
    setCategories(newCategories);
  };

  const handlePriorityToggle = (priority) => {
    const newPriorities = priorities.includes(priority)
      ? priorities.filter(p => p !== priority)
      : [...priorities, priority];
    setPriorities(newPriorities);
  };

  const hasActiveFilters = searchQuery || 
                           !showCompleted || 
                           categories.length < Object.values(TASK_CATEGORIES).length ||
                           priorities.length < Object.values(TASK_PRIORITIES).length;

  return (
    <motion.div
      initial={{ opacity: 0, y: -20 }}
      animate={{ opacity: 1, y: 0 }}
      className={`p-6 rounded-xl ${config.theme.card} border-2 mb-6`}
    >
      <div className="flex items-center justify-between mb-4">
        <h2 className="text-xl font-semibold text-gray-800">Filters & Search</h2>
        <motion.button
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
          onClick={() => setIsExpanded(!isExpanded)}
          className={`p-2 rounded-lg ${isExpanded ? `bg-${config.theme.primary}-100 text-${config.theme.primary}-600` : 'bg-gray-100 text-gray-600'}`}
        >
          <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 4a1 1 0 011-1h16a1 1 0 011 1v2.586a1 1 0 01-.293.707l-6.414 6.414a1 1 0 00-.293.707V17l-4 4v-6.586a1 1 0 00-.293-.707L3.293 7.707A1 1 0 013 7V4z" />
          </svg>
        </motion.button>
      </div>

      <div className="space-y-4">
        <div>
          <input
            type="text"
            placeholder="Search tasks..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
        </div>

        <div className="flex items-center justify-between">
          <select
            value={sortBy}
            onChange={(e) => setSortBy(e.target.value)}
            className="flex-1 px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 mr-2"
          >
            {Object.entries(SORT_CONFIG).map(([key, config]) => (
              <option key={key} value={key}>{config.name}</option>
            ))}
          </select>

          <motion.button
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            onClick={toggleShowCompleted}
            className={`px-4 py-2 rounded-lg font-medium transition-colors ${
              showCompleted 
                ? `bg-${config.theme.primary}-500 text-white` 
                : 'bg-gray-200 text-gray-600'
            }`}
          >
            {showCompleted ? '✓ All' : '○ Active'}
          </motion.button>
        </div>

        <AnimatePresence>
          {isExpanded && (
            <motion.div
              initial={{ height: 0, opacity: 0 }}
              animate={{ height: 'auto', opacity: 1 }}
              exit={{ height: 0, opacity: 0 }}
              className="space-y-4"
            >
              <div>
                <h3 className="text-sm font-semibold text-gray-700 mb-2">Categories</h3>
                <div className="flex flex-wrap gap-2">
                  {Object.entries(CATEGORY_CONFIG).map(([key, category]) => (
                    <motion.button
                      key={key}
                      whileHover={{ scale: 1.05 }}
                      whileTap={{ scale: 0.95 }}
                      onClick={() => handleCategoryToggle(key)}
                      className={`px-3 py-1 rounded-full text-sm font-medium transition-all ${
                        categories.includes(key)
                          ? `bg-${category.color}-100 text-${category.color}-700 border-2 border-${category.color}-300`
                          : 'bg-gray-100 text-gray-600 border-2 border-transparent'
                      }`}
                    >
                      {category.icon} {category.name}
                    </motion.button>
                  ))}
                </div>
              </div>

              <div>
                <h3 className="text-sm font-semibold text-gray-700 mb-2">Priorities</h3>
                <div className="flex flex-wrap gap-2">
                  {Object.entries(PRIORITY_CONFIG).map(([key, priority]) => (
                    <motion.button
                      key={key}
                      whileHover={{ scale: 1.05 }}
                      whileTap={{ scale: 0.95 }}
                      onClick={() => handlePriorityToggle(key)}
                      className={`px-3 py-1 rounded-full text-sm font-medium transition-all ${
                        priorities.includes(key)
                          ? `bg-${priority.color}-100 text-${priority.color}-700 border-2 border-${priority.color}-300`
                          : 'bg-gray-100 text-gray-600 border-2 border-transparent'
                      }`}
                    >
                      {priority.name}
                    </motion.button>
                  ))}
                </div>
              </div>

              {hasActiveFilters && (
                <motion.button
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                  onClick={resetFilters}
                  className="w-full py-2 px-4 bg-red-500 text-white rounded-lg hover:bg-red-600 transition-colors"
                >
                  Reset All Filters
                </motion.button>
              )}
            </motion.div>
          )}
        </AnimatePresence>
      </div>

      {hasActiveFilters && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          className="mt-4 p-2 bg-blue-50 border border-blue-200 rounded-lg"
        >
          <p className="text-xs text-blue-700">
            Filters are active {isExpanded ? '' : '(click filter icon to expand)'}
          </p>
        </motion.div>
      )}
    </motion.div>
  );
}
