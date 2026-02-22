import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { useTasks } from '../context/TaskContext';
import { useReality } from '../context/RealityContext';
import { TASK_CATEGORIES, CATEGORY_CONFIG, TASK_PRIORITIES, PRIORITY_CONFIG } from '../constants/categories';

export function TaskForm({ onClose }) {
  const { addTask } = useTasks();
  const { config } = useReality();
  const [formData, setFormData] = useState({
    title: '',
    category: TASK_CATEGORIES.PERSONAL,
    priority: TASK_PRIORITIES.MEDIUM,
    tags: [],
    optimistic: {
      description: '',
      deadline: '',
      difficulty: 1,
      points: 10
    },
    realistic: {
      description: '',
      deadline: '',
      difficulty: 5,
      points: 5
    },
    disaster: {
      description: '',
      deadline: '',
      difficulty: 8,
      points: 2
    }
  });

  const handleAddTag = (e) => {
    if (e.key === 'Enter' && e.target.value.trim()) {
      const newTag = e.target.value.trim().toLowerCase();
      if (!formData.tags.includes(newTag)) {
        setFormData(prev => ({
          ...prev,
          tags: [...prev.tags, newTag]
        }));
      }
      e.target.value = '';
    }
  };

  const handleRemoveTag = (tagToRemove) => {
    setFormData(prev => ({
      ...prev,
      tags: prev.tags.filter(tag => tag !== tagToRemove)
    }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    addTask({
      ...formData,
      completed: false,
      createdAt: Date.now(),
      completedAt: null
    });
    onClose();
  };

  const handleChange = (section, field, value) => {
    setFormData(prev => ({
      ...prev,
      [section]: {
        ...prev[section],
        [field]: value
      }
    }));
  };

  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.9 }}
      animate={{ opacity: 1, scale: 1 }}
      exit={{ opacity: 0, scale: 0.9 }}
      className={`fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4`}
    >
      <motion.div
        initial={{ y: -50 }}
        animate={{ y: 0 }}
        className={`bg-white rounded-xl shadow-2xl max-w-4xl w-full max-h-[90vh] overflow-y-auto ${config.theme.card} border-2`}
      >
        <div className={`p-6 border-b ${config.theme.primary === 'emerald' ? 'border-emerald-300' : config.theme.primary === 'red' ? 'border-red-300' : 'border-gray-300'}`}>
          <h2 className={`text-2xl font-bold text-${config.theme.primary}-600`}>
            Create Parallel Reality Task
          </h2>
          <p className={`text-${config.theme.primary}-500 mt-1`}>
            Define your task across all reality modes
          </p>
        </div>

        <form onSubmit={handleSubmit} className="p-6 space-y-6">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Task Title
            </label>
            <input
              type="text"
              required
              value={formData.title}
              onChange={(e) => setFormData(prev => ({ ...prev, title: e.target.value }))}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
              placeholder="Enter task title..."
            />
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Category</label>
              <select
                value={formData.category}
                onChange={(e) => setFormData(prev => ({ ...prev, category: e.target.value }))}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
              >
                {Object.entries(CATEGORY_CONFIG).map(([key, config]) => (
                  <option key={key} value={key}>
                    {config.icon} {config.name}
                  </option>
                ))}
              </select>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Priority</label>
              <select
                value={formData.priority}
                onChange={(e) => setFormData(prev => ({ ...prev, priority: e.target.value }))}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
              >
                {Object.entries(PRIORITY_CONFIG).map(([key, config]) => (
                  <option key={key} value={key}>
                    {config.name}
                  </option>
                ))}
              </select>
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Tags (press Enter to add)
            </label>
            <div className="flex flex-wrap gap-2 mb-2">
              {formData.tags.map((tag, index) => (
                <span
                  key={index}
                  className="px-2 py-1 bg-blue-100 text-blue-700 rounded-full text-sm flex items-center space-x-1"
                >
                  <span>{tag}</span>
                  <button
                    type="button"
                    onClick={() => handleRemoveTag(tag)}
                    className="text-blue-500 hover:text-blue-700"
                  >
                    ×
                  </button>
                </span>
              ))}
            </div>
            <input
              type="text"
              placeholder="Add tags..."
              onKeyDown={handleAddTag}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className={`p-4 rounded-lg border-2 border-emerald-300 bg-emerald-50`}>
              <h3 className="text-lg font-semibold text-emerald-700 mb-3">☀️ Optimistic</h3>
              <div className="space-y-3">
                <div>
                  <label className="block text-sm font-medium text-emerald-600 mb-1">Description</label>
                  <textarea
                    value={formData.optimistic.description}
                    onChange={(e) => handleChange('optimistic', 'description', e.target.value)}
                    className="w-full px-2 py-1 border border-emerald-200 rounded text-sm focus:outline-none focus:ring-1 focus:ring-emerald-400"
                    rows="2"
                    placeholder="Best case scenario..."
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-emerald-600 mb-1">Deadline</label>
                  <input
                    type="datetime-local"
                    value={formData.optimistic.deadline}
                    onChange={(e) => handleChange('optimistic', 'deadline', e.target.value)}
                    className="w-full px-2 py-1 border border-emerald-200 rounded text-sm focus:outline-none focus:ring-1 focus:ring-emerald-400"
                  />
                </div>
                <div className="grid grid-cols-2 gap-2">
                  <div>
                    <label className="block text-sm font-medium text-emerald-600 mb-1">Difficulty</label>
                    <input
                      type="number"
                      min="1"
                      max="10"
                      value={formData.optimistic.difficulty}
                      onChange={(e) => handleChange('optimistic', 'difficulty', parseInt(e.target.value))}
                      className="w-full px-2 py-1 border border-emerald-200 rounded text-sm focus:outline-none focus:ring-1 focus:ring-emerald-400"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-emerald-600 mb-1">Points</label>
                    <input
                      type="number"
                      min="1"
                      value={formData.optimistic.points}
                      onChange={(e) => handleChange('optimistic', 'points', parseInt(e.target.value))}
                      className="w-full px-2 py-1 border border-emerald-200 rounded text-sm focus:outline-none focus:ring-1 focus:ring-emerald-400"
                    />
                  </div>
                </div>
              </div>
            </div>

            <div className={`p-4 rounded-lg border-2 border-gray-300 bg-gray-50`}>
              <h3 className="text-lg font-semibold text-gray-700 mb-3">⚖️ Realistic</h3>
              <div className="space-y-3">
                <div>
                  <label className="block text-sm font-medium text-gray-600 mb-1">Description</label>
                  <textarea
                    value={formData.realistic.description}
                    onChange={(e) => handleChange('realistic', 'description', e.target.value)}
                    className="w-full px-2 py-1 border border-gray-200 rounded text-sm focus:outline-none focus:ring-1 focus:ring-gray-400"
                    rows="2"
                    placeholder="Normal expectations..."
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-600 mb-1">Deadline</label>
                  <input
                    type="datetime-local"
                    value={formData.realistic.deadline}
                    onChange={(e) => handleChange('realistic', 'deadline', e.target.value)}
                    className="w-full px-2 py-1 border border-gray-200 rounded text-sm focus:outline-none focus:ring-1 focus:ring-gray-400"
                  />
                </div>
                <div className="grid grid-cols-2 gap-2">
                  <div>
                    <label className="block text-sm font-medium text-gray-600 mb-1">Difficulty</label>
                    <input
                      type="number"
                      min="1"
                      max="10"
                      value={formData.realistic.difficulty}
                      onChange={(e) => handleChange('realistic', 'difficulty', parseInt(e.target.value))}
                      className="w-full px-2 py-1 border border-gray-200 rounded text-sm focus:outline-none focus:ring-1 focus:ring-gray-400"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-600 mb-1">Points</label>
                    <input
                      type="number"
                      min="1"
                      value={formData.realistic.points}
                      onChange={(e) => handleChange('realistic', 'points', parseInt(e.target.value))}
                      className="w-full px-2 py-1 border border-gray-200 rounded text-sm focus:outline-none focus:ring-1 focus:ring-gray-400"
                    />
                  </div>
                </div>
              </div>
            </div>

            <div className={`p-4 rounded-lg border-2 border-red-300 bg-red-50`}>
              <h3 className="text-lg font-semibold text-red-700 mb-3">🌪️ Disaster</h3>
              <div className="space-y-3">
                <div>
                  <label className="block text-sm font-medium text-red-600 mb-1">Description</label>
                  <textarea
                    value={formData.disaster.description}
                    onChange={(e) => handleChange('disaster', 'description', e.target.value)}
                    className="w-full px-2 py-1 border border-red-200 rounded text-sm focus:outline-none focus:ring-1 focus:ring-red-400"
                    rows="2"
                    placeholder="Worst case scenario..."
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-red-600 mb-1">Deadline</label>
                  <input
                    type="datetime-local"
                    value={formData.disaster.deadline}
                    onChange={(e) => handleChange('disaster', 'deadline', e.target.value)}
                    className="w-full px-2 py-1 border border-red-200 rounded text-sm focus:outline-none focus:ring-1 focus:ring-red-400"
                  />
                </div>
                <div className="grid grid-cols-2 gap-2">
                  <div>
                    <label className="block text-sm font-medium text-red-600 mb-1">Difficulty</label>
                    <input
                      type="number"
                      min="1"
                      max="10"
                      value={formData.disaster.difficulty}
                      onChange={(e) => handleChange('disaster', 'difficulty', parseInt(e.target.value))}
                      className="w-full px-2 py-1 border border-red-200 rounded text-sm focus:outline-none focus:ring-1 focus:ring-red-400"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-red-600 mb-1">Points</label>
                    <input
                      type="number"
                      min="1"
                      value={formData.disaster.points}
                      onChange={(e) => handleChange('disaster', 'points', parseInt(e.target.value))}
                      className="w-full px-2 py-1 border border-red-200 rounded text-sm focus:outline-none focus:ring-1 focus:ring-red-400"
                    />
                  </div>
                </div>
              </div>
            </div>
          </div>

          <div className="flex justify-end space-x-3 pt-4 border-t">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 text-gray-600 bg-gray-200 rounded-lg hover:bg-gray-300 transition-colors"
            >
              Cancel
            </button>
            <button
              type="submit"
              className={`px-6 py-2 text-white bg-${config.theme.primary}-600 rounded-lg hover:bg-${config.theme.primary}-700 transition-colors`}
            >
              Create Task
            </button>
          </div>
        </form>
      </motion.div>
    </motion.div>
  );
}
