import { useMemo } from 'react';
import { useFilters } from '../context/FilterContext';
import { useTasks } from '../context/TaskContext';
import { useReality } from '../context/RealityContext';
import { SORT_CONFIG, PRIORITY_CONFIG } from '../constants/categories';

export function useTaskFilters() {
  const { tasks } = useTasks();
  const { currentMode } = useReality();
  const { 
    categories, 
    priorities, 
    searchQuery, 
    sortBy, 
    showCompleted, 
    dateRange, 
    tags 
  } = useFilters();

  const filteredAndSortedTasks = useMemo(() => {
    let filtered = tasks.filter(task => {
      // Filter by completion status
      if (!showCompleted && task.completed) {
        return false;
      }

      // Filter by categories
      if (task.category && !categories.includes(task.category)) {
        return false;
      }

      // Filter by priorities
      if (task.priority && !priorities.includes(task.priority)) {
        return false;
      }

      // Filter by search query
      if (searchQuery) {
        const query = searchQuery.toLowerCase();
        const searchableText = [
          task.title,
          task[currentMode]?.description || '',
          task.category || '',
          ...(task.tags || [])
        ].join(' ').toLowerCase();
        
        if (!searchableText.includes(query)) {
          return false;
        }
      }

      // Filter by tags
      if (tags.length > 0 && task.tags) {
        const hasMatchingTag = tags.some(tag => task.tags.includes(tag));
        if (!hasMatchingTag) {
          return false;
        }
      }

      // Filter by date range
      if (dateRange) {
        const taskDate = new Date(task.createdAt);
        const startDate = dateRange.start ? new Date(dateRange.start) : null;
        const endDate = dateRange.end ? new Date(dateRange.end) : null;
        
        if (startDate && taskDate < startDate) {
          return false;
        }
        
        if (endDate && taskDate > endDate) {
          return false;
        }
      }

      return true;
    });

    // Sort tasks
    const sortConfig = SORT_CONFIG[sortBy];
    if (sortConfig) {
      filtered.sort((a, b) => {
        let aValue, bValue;

        switch (sortConfig.field) {
          case 'createdAt':
            aValue = a.createdAt;
            bValue = b.createdAt;
            break;
          case 'deadline':
            aValue = a[currentMode]?.deadline || '';
            bValue = b[currentMode]?.deadline || '';
            break;
          case 'priority':
            aValue = a.priority ? PRIORITY_CONFIG[a.priority]?.weight : 0;
            bValue = b.priority ? PRIORITY_CONFIG[b.priority]?.weight : 0;
            break;
          case 'title':
            aValue = a.title.toLowerCase();
            bValue = b.title.toLowerCase();
            break;
          case 'points':
            aValue = a[currentMode]?.points || 0;
            bValue = b[currentMode]?.points || 0;
            break;
          default:
            return 0;
        }

        if (sortConfig.direction === 'asc') {
          return aValue > bValue ? 1 : aValue < bValue ? -1 : 0;
        } else {
          return aValue < bValue ? 1 : aValue > bValue ? -1 : 0;
        }
      });
    }

    return filtered;
  }, [tasks, categories, priorities, searchQuery, sortBy, showCompleted, dateRange, tags, currentMode]);

  const taskStats = useMemo(() => {
    const total = tasks.length;
    const completed = tasks.filter(t => t.completed).length;
    const incomplete = total - completed;
    const overdue = tasks.filter(t => {
      if (t.completed) return false;
      const deadline = new Date(t[currentMode]?.deadline);
      return deadline < new Date();
    }).length;
    const dueSoon = tasks.filter(t => {
      if (t.completed) return false;
      const deadline = new Date(t[currentMode]?.deadline);
      const now = new Date();
      const hoursUntilDue = (deadline - now) / (1000 * 60 * 60);
      return hoursUntilDue > 0 && hoursUntilDue <= 24;
    }).length;

    const categoryStats = {};
    Object.keys(categories).forEach(category => {
      categoryStats[category] = tasks.filter(t => t.category === category).length;
    });

    const priorityStats = {};
    Object.keys(priorities).forEach(priority => {
      priorityStats[priority] = tasks.filter(t => t.priority === priority).length;
    });

    const totalPoints = tasks
      .filter(t => t.completed)
      .reduce((sum, task) => sum + (task[currentMode]?.points || 0), 0);

    return {
      total,
      completed,
      incomplete,
      overdue,
      dueSoon,
      completionRate: total > 0 ? Math.round((completed / total) * 100) : 0,
      categoryStats,
      priorityStats,
      totalPoints
    };
  }, [tasks, categories, priorities, currentMode]);

  return {
    filteredTasks: filteredAndSortedTasks,
    taskStats,
    hasActiveFilters: searchQuery || 
                      !showCompleted || 
                      dateRange || 
                      tags.length > 0 ||
                      categories.length < Object.keys(categories).length ||
                      priorities.length < Object.keys(priorities).length
  };
}
