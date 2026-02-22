import { useEffect } from 'react';
import { useTasks } from '../context/TaskContext';
import { useReality } from '../context/RealityContext';

export function useRealityEffects() {
  const { tasks, duplicateTask, autoCompleteTask } = useTasks();
  const { config, currentMode } = useReality();

  useEffect(() => {
    if (currentMode === 'disaster') {
      const disasterInterval = setInterval(() => {
        tasks.forEach(task => {
          if (!task.completed) {
            if (Math.random() < 0.1) {
              duplicateTask(task.id);
            }
          }
        });
      }, 15000);

      return () => clearInterval(disasterInterval);
    }
  }, [currentMode, tasks, duplicateTask]);

  useEffect(() => {
    if (currentMode === 'optimistic') {
      const optimisticInterval = setInterval(() => {
        const incompleteTasks = tasks.filter(task => !task.completed);
        if (incompleteTasks.length > 0 && Math.random() < config.effects.autoCompleteChance) {
          const randomTask = incompleteTasks[Math.floor(Math.random() * incompleteTasks.length)];
          autoCompleteTask(randomTask.id);
        }
      }, 8000);

      return () => clearInterval(optimisticInterval);
    }
  }, [currentMode, tasks, config.effects.autoCompleteChance, autoCompleteTask]);

  const getAdjustedDeadline = (baseDeadline) => {
    const now = Date.now();
    const baseTime = new Date(baseDeadline).getTime();
    const adjustedTime = now + (baseTime - now) * config.effects.deadlineMultiplier;
    return new Date(adjustedTime);
  };

  const getAdjustedDifficulty = (baseDifficulty) => {
    return Math.max(1, Math.min(10, baseDifficulty * config.effects.difficultyReduction));
  };

  const getAdjustedPoints = (basePoints) => {
    return Math.round(basePoints * config.effects.pointMultiplier);
  };

  return {
    getAdjustedDeadline,
    getAdjustedDifficulty,
    getAdjustedPoints
  };
}
