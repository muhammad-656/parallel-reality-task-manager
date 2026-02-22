import React from 'react';
import { motion } from 'framer-motion';
import { useTasks } from '../context/TaskContext';
import { useReality } from '../context/RealityContext';
import { TASK_CATEGORIES, CATEGORY_CONFIG, TASK_PRIORITIES } from '../constants/categories';

const TASK_TEMPLATES = {
  'daily-review': {
    name: 'Daily Review',
    icon: '📋',
    category: TASK_CATEGORIES.WORK,
    priority: TASK_PRIORITIES.MEDIUM,
    optimistic: {
      description: 'Quick 15-minute daily standup and planning',
      difficulty: 2,
      points: 5,
      deadline: '18:00'
    },
    realistic: {
      description: '30-minute daily review and tomorrow planning',
      difficulty: 4,
      points: 3,
      deadline: '17:00'
    },
    disaster: {
      description: 'Hour-long daily review with crisis management',
      difficulty: 7,
      points: 1,
      deadline: '16:00'
    }
  },
  'exercise': {
    name: 'Exercise',
    icon: '🏃',
    category: TASK_CATEGORIES.HEALTH,
    priority: TASK_PRIORITIES.MEDIUM,
    optimistic: {
      description: '30-minute energizing workout',
      difficulty: 3,
      points: 8,
      deadline: '19:00'
    },
    realistic: {
      description: '45-minute moderate exercise session',
      difficulty: 5,
      points: 5,
      deadline: '18:00'
    },
    disaster: {
      description: 'Exhausting 90-minute workout with recovery',
      difficulty: 8,
      points: 2,
      deadline: '20:00'
    }
  },
  'learning': {
    name: 'Learning Session',
    icon: '📚',
    category: TASK_CATEGORIES.LEARNING,
    priority: TASK_PRIORITIES.LOW,
    optimistic: {
      description: 'Quick 25-minute focused learning',
      difficulty: 2,
      points: 6,
      deadline: '21:00'
    },
    realistic: {
      description: '1-hour structured learning session',
      difficulty: 4,
      points: 4,
      deadline: '20:00'
    },
    disaster: {
      description: '2-hour intensive study with challenges',
      difficulty: 6,
      points: 2,
      deadline: '22:00'
    }
  },
  'creative-project': {
    name: 'Creative Project',
    icon: '🎨',
    category: TASK_CATEGORIES.CREATIVE,
    priority: TASK_PRIORITIES.LOW,
    optimistic: {
      description: '30-minute creative brainstorming',
      difficulty: 2,
      points: 7,
      deadline: '19:00'
    },
    realistic: {
      description: '1-hour focused creative work',
      difficulty: 4,
      points: 4,
      deadline: '18:00'
    },
    disaster: {
      description: '2-hour creative struggle with revisions',
      difficulty: 7,
      points: 2,
      deadline: '21:00'
    }
  },
  'finance-review': {
    name: 'Finance Review',
    icon: '💰',
    category: TASK_CATEGORIES.FINANCE,
    priority: TASK_PRIORITIES.HIGH,
    optimistic: {
      description: 'Quick 15-minute budget check',
      difficulty: 1,
      points: 6,
      deadline: '17:00'
    },
    realistic: {
      description: '30-minute detailed finance review',
      difficulty: 3,
      points: 4,
      deadline: '16:00'
    },
    disaster: {
      description: '1-hour emergency financial planning',
      difficulty: 6,
      points: 2,
      deadline: '15:00'
    }
  },
  'social-connect': {
    name: 'Social Connection',
    icon: '👥',
    category: TASK_CATEGORIES.SOCIAL,
    priority: TASK_PRIORITIES.LOW,
    optimistic: {
      description: 'Quick 15-minute call with friend',
      difficulty: 1,
      points: 5,
      deadline: '20:00'
    },
    realistic: {
      description: '30-minute meaningful conversation',
      difficulty: 2,
      points: 3,
      deadline: '19:00'
    },
    disaster: {
      description: '1-hour difficult social interaction',
      difficulty: 5,
      points: 1,
      deadline: '21:00'
    }
  }
};

export function TaskTemplates() {
  const { addTask } = useTasks();
  const { config } = useReality();

  const handleCreateFromTemplate = (templateKey) => {
    const template = TASK_TEMPLATES[templateKey];
    if (!template) return;

    const now = new Date();
    const getDeadlineTime = (timeStr) => {
      const [hours, minutes] = timeStr.split(':').map(Number);
      const deadline = new Date(now);
      deadline.setHours(hours, minutes || 0, 0, 0);
      
      if (deadline <= now) {
        deadline.setDate(deadline.getDate() + 1);
      }
      
      return deadline.toISOString().slice(0, 16);
    };

    const taskData = {
      title: template.name,
      category: template.category,
      priority: template.priority,
      optimistic: {
        ...template.optimistic,
        deadline: getDeadlineTime(template.optimistic.deadline)
      },
      realistic: {
        ...template.realistic,
        deadline: getDeadlineTime(template.realistic.deadline)
      },
      disaster: {
        ...template.disaster,
        deadline: getDeadlineTime(template.disaster.deadline)
      },
      tags: ['template'],
      completed: false,
      createdAt: Date.now(),
      completedAt: null
    };

    addTask(taskData);
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className={`p-6 rounded-xl ${config.theme.card} border-2`}
    >
      <h2 className="text-xl font-semibold text-gray-800 mb-4">Quick Task Templates</h2>
      
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3">
        {Object.entries(TASK_TEMPLATES).map(([key, template]) => {
          const categoryConfig = CATEGORY_CONFIG[template.category];
          
          return (
            <motion.div
              key={key}
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              onClick={() => handleCreateFromTemplate(key)}
              className={`p-4 bg-white rounded-lg border-2 border-gray-200 hover:border-${config.theme.primary}-300 cursor-pointer transition-all`}
            >
              <div className="flex items-start justify-between mb-2">
                <div className="flex items-center space-x-2">
                  <span className="text-2xl">{template.icon}</span>
                  <div>
                    <h3 className="font-semibold text-gray-800">{template.name}</h3>
                    <div className="flex items-center space-x-1 text-xs text-gray-500">
                      <span>{categoryConfig?.icon}</span>
                      <span>{categoryConfig?.name}</span>
                    </div>
                  </div>
                </div>
                <div className={`px-2 py-1 rounded-full text-xs font-medium bg-${config.theme.primary}-100 text-${config.theme.primary}-700`}>
                  {template.priority}
                </div>
              </div>
              
              <div className="text-xs text-gray-600 mb-3">
                {template[config.currentMode]?.description}
              </div>
              
              <div className="flex justify-between items-center text-xs">
                <div className="flex items-center space-x-2">
                  <span className="text-gray-500">Difficulty:</span>
                  <span className="font-medium">{template[config.currentMode]?.difficulty}/10</span>
                </div>
                <div className="flex items-center space-x-2">
                  <span className="text-gray-500">Points:</span>
                  <span className={`font-medium text-${config.theme.primary}-600`}>
                    {Math.round(template[config.currentMode]?.points * config.effects.pointMultiplier)}
                  </span>
                </div>
              </div>
              
              <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                className={`w-full mt-3 py-1 px-2 bg-${config.theme.primary}-500 text-white text-sm rounded hover:bg-${config.theme.primary}-600 transition-colors`}
              >
                Create Task
              </motion.button>
            </motion.div>
          );
        })}
      </div>

      <div className="mt-4 p-3 bg-blue-50 border border-blue-200 rounded-lg">
        <p className="text-sm text-blue-700">
          💡 Templates automatically adjust to the current reality mode with appropriate difficulty, points, and deadlines.
        </p>
      </div>
    </motion.div>
  );
}
