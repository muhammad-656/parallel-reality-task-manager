import React, { createContext, useContext, useReducer, useEffect, useCallback } from 'react';
import { REALITY_MODES, REALITY_CONFIG } from '../constants/realityModes';

const RealityContext = createContext();

const initialState = {
  currentMode: REALITY_MODES.REALISTIC,
  previousMode: null,
  modeHistory: [],
  lastModeChange: Date.now(),
  isTransitioning: false,
  autoChangeEnabled: true,
  snapshots: [],
  currentSnapshot: null
};

function realityReducer(state, action) {
  switch (action.type) {
    case 'CHANGE_REALITY_MODE':
      return {
        ...state,
        currentMode: action.payload,
        previousMode: state.currentMode,
        lastModeChange: Date.now(),
        isTransitioning: true,
        modeHistory: [...state.modeHistory, {
          mode: state.currentMode,
          timestamp: state.lastModeChange,
          snapshot: state.currentSnapshot
        }]
      };
    
    case 'COMPLETE_TRANSITION':
      return {
        ...state,
        isTransitioning: false
      };
    
    case 'TOGGLE_AUTO_CHANGE':
      return {
        ...state,
        autoChangeEnabled: !state.autoChangeEnabled
      };
    
    case 'CREATE_SNAPSHOT':
      return {
        ...state,
        currentSnapshot: {
          id: Date.now(),
          mode: state.currentMode,
          timestamp: Date.now(),
          data: action.payload
        },
        snapshots: [...state.snapshots, {
          id: Date.now(),
          mode: state.currentMode,
          timestamp: Date.now(),
          data: action.payload
        }]
      };
    
    case 'RESTORE_SNAPSHOT':
      const snapshot = state.snapshots.find(s => s.id === action.payload);
      if (snapshot) {
        return {
          ...state,
          currentMode: snapshot.mode,
          currentSnapshot: snapshot,
          lastModeChange: Date.now(),
          isTransitioning: true
        };
      }
      return state;
    
    case 'CLEAR_HISTORY':
      return {
        ...state,
        snapshots: [],
        modeHistory: []
      };
    
    default:
      return state;
  }
}

export function RealityProvider({ children }) {
  const [state, dispatch] = useReducer(realityReducer, initialState);

  const changeRealityMode = useCallback((mode) => {
    if (Object.values(REALITY_MODES).includes(mode)) {
      dispatch({ type: 'CHANGE_REALITY_MODE', payload: mode });
      setTimeout(() => {
        dispatch({ type: 'COMPLETE_TRANSITION' });
      }, 500);
    }
  }, []);

  const randomRealityChange = useCallback(() => {
    const modes = Object.values(REALITY_MODES);
    const availableModes = modes.filter(mode => mode !== state.currentMode);
    const randomMode = availableModes[Math.floor(Math.random() * availableModes.length)];
    changeRealityMode(randomMode);
  }, [state.currentMode, changeRealityMode]);

  const createSnapshot = (data) => {
    dispatch({ type: 'CREATE_SNAPSHOT', payload: data });
  };

  const restoreSnapshot = (snapshotId) => {
    dispatch({ type: 'RESTORE_SNAPSHOT', payload: snapshotId });
  };

  const toggleAutoChange = () => {
    dispatch({ type: 'TOGGLE_AUTO_CHANGE' });
  };

  const clearHistory = () => {
    dispatch({ type: 'CLEAR_HISTORY' });
  };

  useEffect(() => {
    if (state.autoChangeEnabled) {
      const interval = setInterval(() => {
        if (Math.random() < 0.1) {
          const modes = Object.values(REALITY_MODES);
          const availableModes = modes.filter(mode => mode !== state.currentMode);
          const randomMode = availableModes[Math.floor(Math.random() * availableModes.length)];
          changeRealityMode(randomMode);
        }
      }, 30000);

      return () => clearInterval(interval);
    }
  }, [state.autoChangeEnabled, state.currentMode, changeRealityMode]);

  const value = {
    ...state,
    config: REALITY_CONFIG[state.currentMode],
    changeRealityMode,
    randomRealityChange,
    createSnapshot,
    restoreSnapshot,
    toggleAutoChange,
    clearHistory
  };

  return (
    <RealityContext.Provider value={value}>
      {children}
    </RealityContext.Provider>
  );
}

export function useReality() {
  const context = useContext(RealityContext);
  if (!context) {
    throw new Error('useReality must be used within a RealityProvider');
  }
  return context;
}
