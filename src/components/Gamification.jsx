import React from 'react';
import { motion } from 'framer-motion';
import { useTasks } from '../context/TaskContext';
import { useReality } from '../context/RealityContext';
import { useTaskFilters } from '../hooks/useTaskFilters';

const ACHIEVEMENTS = {
  'first-task': {
    name: 'First Steps',
    description: 'Complete your first task',
    icon: '🎯',
    condition: (stats) => stats.completed >= 1
  },
  'task-master': {
    name: 'Task Master',
    description: 'Complete 10 tasks',
    icon: '🏆',
    condition: (stats) => stats.completed >= 10
  },
  'reality-explorer': {
    name: 'Reality Explorer',
    description: 'Complete tasks in all three realities',
    icon: '🌍',
    condition: (stats, tasks) => {
      const realities = new Set();
      tasks.filter(t => t.completed).forEach(task => {
        realities.add(task.completedInReality || 'realistic');
      });
      return realities.size >= 3;
    }
  },
  'point-collector': {
    name: 'Point Collector',
    description: 'Earn 100 points',
    icon: '💎',
    condition: (stats) => stats.totalPoints >= 100
  },
  'speed-demon': {
    name: 'Speed Demon',
    description: 'Complete 5 tasks in one day',
    icon: '⚡',
    condition: (stats, tasks) => {
      const today = new Date().toDateString();
      const todayTasks = tasks.filter(t => 
        t.completed && new Date(t.completedAt).toDateString() === today
      );
      return todayTasks.length >= 5;
    }
  },
  'disaster-survivor': {
    name: 'Disaster Survivor',
    description: 'Complete 5 tasks in Disaster mode',
    icon: '🔥',
    condition: (stats, tasks) => {
      const disasterTasks = tasks.filter(t => 
        t.completed && (t.completedInReality === 'disaster' || t.currentReality === 'disaster')
      );
      return disasterTasks.length >= 5;
    }
  },
  'optimistic-achiever': {
    name: 'Optimistic Achiever',
    description: 'Complete 5 tasks in Optimistic mode',
    icon: '☀️',
    condition: (stats, tasks) => {
      const optimisticTasks = tasks.filter(t => 
        t.completed && (t.completedInReality === 'optimistic' || t.currentReality === 'optimistic')
      );
      return optimisticTasks.length >= 5;
    }
  },
  'perfect-day': {
    name: 'Perfect Day',
    description: 'Complete all active tasks',
    icon: '⭐',
    condition: (stats) => stats.incomplete === 0 && stats.completed > 0
  }
};

export function Gamification() {
  const { tasks } = useTasks();
  const { config } = useReality();
  const { taskStats } = useTaskFilters();

  const unlockedAchievements = Object.entries(ACHIEVEMENTS).filter(([key, achievement]) => 
    achievement.condition(taskStats, tasks)
  );

  const currentLevel = Math.floor(taskStats.totalPoints / 50) + 1;
  const pointsToNextLevel = (currentLevel * 50) - taskStats.totalPoints;
  const levelProgress = ((taskStats.totalPoints % 50) / 50) * 100;

  const getStreak = () => {
    const today = new Date();
    let streak = 0;
    
    for (let i = 0; i < 30; i++) {
      const checkDate = new Date(today);
      checkDate.setDate(today.getDate() - i);
      const dateStr = checkDate.toDateString();
      
      const hasCompletedTask = tasks.some(task => 
        task.completed && new Date(task.completedAt).toDateString() === dateStr
      );
      
      if (hasCompletedTask) {
        streak++;
      } else if (i > 0) {
        break;
      }
    }
    
    return streak;
  };

  const streak = getStreak();

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className={`p-6 rounded-xl ${config.theme.card} border-2`}
    >
      <h2 className="text-2xl font-bold text-gray-800 mb-6">🎮 Gamification</h2>
      
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
        <motion.div
          whileHover={{ scale: 1.02 }}
          className="p-4 bg-gradient-to-r from-purple-500 to-pink-500 text-white rounded-lg"
        >
          <div className="text-3xl font-bold">Level {currentLevel}</div>
          <div className="text-sm opacity-90">Current Level</div>
          <div className="mt-2 text-xs opacity-75">
            {pointsToNextLevel} points to next level
          </div>
        </motion.div>

        <motion.div
          whileHover={{ scale: 1.02 }}
          className="p-4 bg-gradient-to-r from-blue-500 to-cyan-500 text-white rounded-lg"
        >
          <div className="text-3xl font-bold">{taskStats.totalPoints}</div>
          <div className="text-sm opacity-90">Total Points</div>
          <div className="mt-2 text-xs opacity-75">
            All time achievement
          </div>
        </motion.div>

        <motion.div
          whileHover={{ scale: 1.02 }}
          className="p-4 bg-gradient-to-r from-orange-500 to-red-500 text-white rounded-lg"
        >
          <div className="text-3xl font-bold">{streak}🔥</div>
          <div className="text-sm opacity-90">Day Streak</div>
          <div className="mt-2 text-xs opacity-75">
            Keep it going!
          </div>
        </motion.div>
      </div>

      <div className="mb-6">
        <div className="flex justify-between items-center mb-2">
          <span className="text-sm font-medium text-gray-700">Level Progress</span>
          <span className="text-sm text-gray-600">{levelProgress.toFixed(0)}%</span>
        </div>
        <div className="w-full bg-gray-200 rounded-full h-3">
          <motion.div
            initial={{ width: 0 }}
            animate={{ width: `${levelProgress}%` }}
            transition={{ duration: 1, ease: "easeOut" }}
            className="h-3 rounded-full bg-gradient-to-r from-purple-500 to-pink-500"
          />
        </div>
      </div>

      <div>
        <h3 className="text-lg font-semibold text-gray-700 mb-4">Achievements</h3>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
          {Object.entries(ACHIEVEMENTS).map(([key, achievement]) => {
            const isUnlocked = unlockedAchievements.some(([k]) => k === key);
            
            return (
              <motion.div
                key={key}
                whileHover={{ scale: isUnlocked ? 1.02 : 1 }}
                className={`p-4 rounded-lg border-2 transition-all ${
                  isUnlocked 
                    ? 'bg-gradient-to-r from-yellow-50 to-orange-50 border-yellow-300' 
                    : 'bg-gray-50 border-gray-200 opacity-60'
                }`}
              >
                <div className="flex items-center space-x-3">
                  <div className={`text-3xl ${isUnlocked ? '' : 'grayscale'}`}>
                    {achievement.icon}
                  </div>
                  <div className="flex-1">
                    <h4 className={`font-semibold ${isUnlocked ? 'text-gray-800' : 'text-gray-500'}`}>
                      {achievement.name}
                    </h4>
                    <p className={`text-sm ${isUnlocked ? 'text-gray-600' : 'text-gray-400'}`}>
                      {achievement.description}
                    </p>
                  </div>
                  {isUnlocked && (
                    <div className="text-green-500">
                      <svg className="w-6 h-6" fill="currentColor" viewBox="0 0 20 20">
                        <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                      </svg>
                    </div>
                  )}
                </div>
              </motion.div>
            );
          })}
        </div>
      </div>

      <div className="mt-6 p-4 bg-gradient-to-r from-purple-50 to-pink-50 rounded-lg border border-purple-200">
        <div className="flex items-center justify-between">
          <div>
            <h4 className="text-sm font-semibold text-purple-800">Reality Bonus</h4>
            <p className="text-xs text-purple-600">
              Current {config.name} mode: {config.effects.pointMultiplier}x points multiplier
            </p>
          </div>
          <div className="text-2xl">
            {config.currentMode === 'optimistic' ? '☀️' : 
             config.currentMode === 'disaster' ? '🌪️' : '⚖️'}
          </div>
        </div>
      </div>
    </motion.div>
  );
}
