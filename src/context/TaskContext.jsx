import React, { createContext, useContext, useReducer, useEffect } from 'react';
import { v4 as uuidv4 } from 'uuid';
import { useReality } from './RealityContext';

const TaskContext = createContext();

const initialState = {
  tasks: [],
  history: [],
  historyIndex: -1,
  undoStack: [],
  redoStack: []
};

function taskReducer(state, action) {
  switch (action.type) {
    case 'ADD_TASK':
      return {
        ...state,
        tasks: [...state.tasks, { ...action.payload, id: uuidv4() }],
        undoStack: [...state.undoStack, { type: 'ADD_TASK', task: action.payload }],
        redoStack: []
      };
    
    case 'UPDATE_TASK':
      return {
        ...state,
        tasks: state.tasks.map(task =>
          task.id === action.payload.id ? { ...task, ...action.payload.updates } : task
        ),
        undoStack: [...state.undoStack, { 
          type: 'UPDATE_TASK', 
          taskId: action.payload.id, 
          previousTask: state.tasks.find(t => t.id === action.payload.id)
        }],
        redoStack: []
      };
    
    case 'DELETE_TASK':
      const deletedTask = state.tasks.find(task => task.id === action.payload);
      return {
        ...state,
        tasks: state.tasks.filter(task => task.id !== action.payload),
        undoStack: [...state.undoStack, { type: 'DELETE_TASK', task: deletedTask }],
        redoStack: []
      };
    
    case 'REORDER_TASKS':
      return {
        ...state,
        tasks: action.payload,
        undoStack: [...state.undoStack, { type: 'REORDER_TASKS', tasks: state.tasks }],
        redoStack: []
      };
    
    case 'DUPLICATE_TASK':
      const taskToDuplicate = state.tasks.find(task => task.id === action.payload);
      if (taskToDuplicate) {
        const duplicatedTask = {
          ...taskToDuplicate,
          id: uuidv4(),
          title: `${taskToDuplicate.title} (Duplicate)`,
          createdAt: Date.now()
        };
        return {
          ...state,
          tasks: [...state.tasks, duplicatedTask],
          undoStack: [...state.undoStack, { type: 'DUPLICATE_TASK', task: duplicatedTask }],
          redoStack: []
        };
      }
      return state;
    
    case 'AUTO_COMPLETE_TASK':
      const autoCompletedTask = state.tasks.find(task => task.id === action.payload);
      if (autoCompletedTask && !autoCompletedTask.completed) {
        return {
          ...state,
          tasks: state.tasks.map(task =>
            task.id === action.payload ? { ...task, completed: true, completedAt: Date.now() } : task
          ),
          undoStack: [...state.undoStack, { 
            type: 'AUTO_COMPLETE_TASK', 
            taskId: action.payload,
            previousState: false
          }],
          redoStack: []
        };
      }
      return state;
    
    case 'UNDO':
      if (state.undoStack.length > 0) {
        const lastAction = state.undoStack[state.undoStack.length - 1];
        return {
          ...state,
          undoStack: state.undoStack.slice(0, -1),
          redoStack: [...state.redoStack, lastAction]
        };
      }
      return state;
    
    case 'REDO':
      if (state.redoStack.length > 0) {
        const nextAction = state.redoStack[state.redoStack.length - 1];
        return {
          ...state,
          redoStack: state.redoStack.slice(0, -1),
          undoStack: [...state.undoStack, nextAction]
        };
      }
      return state;
    
    case 'LOAD_TASKS':
      return {
        ...state,
        tasks: action.payload,
        undoStack: [],
        redoStack: []
      };
    
    default:
      return state;
  }
}

export function TaskProvider({ children }) {
  const [state, dispatch] = useReducer(taskReducer, initialState);
  const { config, createSnapshot } = useReality();

  const addTask = (taskData) => {
    dispatch({ type: 'ADD_TASK', payload: taskData });
  };

  const updateTask = (taskId, updates) => {
    dispatch({ type: 'UPDATE_TASK', payload: { id: taskId, updates } });
  };

  const deleteTask = (taskId) => {
    dispatch({ type: 'DELETE_TASK', payload: taskId });
  };

  const reorderTasks = (tasks) => {
    dispatch({ type: 'REORDER_TASKS', payload: tasks });
  };

  const duplicateTask = (taskId) => {
    dispatch({ type: 'DUPLICATE_TASK', payload: taskId });
  };

  const autoCompleteTask = (taskId) => {
    dispatch({ type: 'AUTO_COMPLETE_TASK', payload: taskId });
  };

  const undo = () => {
    dispatch({ type: 'UNDO' });
  };

  const redo = () => {
    dispatch({ type: 'REDO' });
  };

  const loadTasks = (tasks) => {
    dispatch({ type: 'LOAD_TASKS', payload: tasks });
  };

  useEffect(() => {
    const savedTasks = localStorage.getItem('parallel-reality-tasks');
    if (savedTasks) {
      try {
        loadTasks(JSON.parse(savedTasks));
      } catch (error) {
        console.error('Error loading tasks:', error);
      }
    }
  }, []);

  useEffect(() => {
    localStorage.setItem('parallel-reality-tasks', JSON.stringify(state.tasks));
    createSnapshot(state.tasks);
  }, [state.tasks, createSnapshot]);

  useEffect(() => {
    const interval = setInterval(() => {
      state.tasks.forEach(task => {
        if (!task.completed && Math.random() < config.effects.autoCompleteChance) {
          autoCompleteTask(task.id);
        }
        
        if (config.effects.taskDuplication && !task.completed && Math.random() < 0.05) {
          duplicateTask(task.id);
        }
      });
    }, 10000);

    return () => clearInterval(interval);
  }, [state.tasks, config.effects]);

  const value = {
    ...state,
    addTask,
    updateTask,
    deleteTask,
    reorderTasks,
    duplicateTask,
    autoCompleteTask,
    undo,
    redo,
    loadTasks
  };

  return (
    <TaskContext.Provider value={value}>
      {children}
    </TaskContext.Provider>
  );
}

export function useTasks() {
  const context = useContext(TaskContext);
  if (!context) {
    throw new Error('useTasks must be used within a TaskProvider');
  }
  return context;
}
