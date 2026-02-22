import React, { createContext, useContext, useReducer, useEffect } from 'react';
import { THEME_MODES, THEME_CONFIG, ANIMATION_PRESETS, ANIMATION_CONFIG } from '../constants/themes';
import { useLocalStorage } from '../hooks/useLocalStorage';

const ThemeContext = createContext();

const initialState = {
  currentTheme: THEME_MODES.LIGHT,
  autoTheme: false,
  animationPreset: ANIMATION_PRESETS.SMOOTH,
  customColors: {},
  particleEffects: true,
  soundEffects: false,
  reducedMotion: false
};

function themeReducer(state, action) {
  switch (action.type) {
    case 'SET_THEME':
      return {
        ...state,
        currentTheme: action.payload,
        autoTheme: false
      };
    
    case 'TOGGLE_AUTO_THEME':
      return {
        ...state,
        autoTheme: !state.autoTheme
      };
    
    case 'SET_ANIMATION_PRESET':
      return {
        ...state,
        animationPreset: action.payload
      };
    
    case 'SET_CUSTOM_COLORS':
      return {
        ...state,
        customColors: { ...state.customColors, ...action.payload }
      };
    
    case 'TOGGLE_PARTICLE_EFFECTS':
      return {
        ...state,
        particleEffects: !state.particleEffects
      };
    
    case 'TOGGLE_SOUND_EFFECTS':
      return {
        ...state,
        soundEffects: !state.soundEffects
      };
    
    case 'TOGGLE_REDUCED_MOTION':
      return {
        ...state,
        reducedMotion: !state.reducedMotion
      };
    
    case 'RESET_THEME':
      return initialState;
    
    default:
      return state;
  }
}

export function ThemeProvider({ children }) {
  const [state, dispatch] = useReducer(themeReducer, initialState);
  const [savedTheme, setSavedTheme] = useLocalStorage('parallel-reality-theme', initialState);

  useEffect(() => {
    if (savedTheme) {
      dispatch({ type: 'SET_THEME', payload: savedTheme.currentTheme });
      dispatch({ type: 'SET_ANIMATION_PRESET', payload: savedTheme.animationPreset });
      dispatch({ type: 'TOGGLE_PARTICLE_EFFECTS', payload: savedTheme.particleEffects });
      dispatch({ type: 'TOGGLE_SOUND_EFFECTS', payload: savedTheme.soundEffects });
      dispatch({ type: 'TOGGLE_REDUCED_MOTION', payload: savedTheme.reducedMotion });
    }
  }, []);

  useEffect(() => {
    setSavedTheme(state);
  }, [state, setSavedTheme]);

  useEffect(() => {
    if (state.autoTheme) {
      const hour = new Date().getHours();
      const isNight = hour >= 18 || hour < 6;
      const autoTheme = isNight ? THEME_MODES.DARK : THEME_MODES.LIGHT;
      
      if (state.currentTheme !== autoTheme) {
        dispatch({ type: 'SET_THEME', payload: autoTheme });
      }
    }
  }, [state.autoTheme, state.currentTheme]);

  const setTheme = (theme) => {
    dispatch({ type: 'SET_THEME', payload: theme });
  };

  const toggleAutoTheme = () => {
    dispatch({ type: 'TOGGLE_AUTO_THEME' });
  };

  const setAnimationPreset = (preset) => {
    dispatch({ type: 'SET_ANIMATION_PRESET', payload: preset });
  };

  const setCustomColors = (colors) => {
    dispatch({ type: 'SET_CUSTOM_COLORS', payload: colors });
  };

  const toggleParticleEffects = () => {
    dispatch({ type: 'TOGGLE_PARTICLE_EFFECTS' });
  };

  const toggleSoundEffects = () => {
    dispatch({ type: 'TOGGLE_SOUND_EFFECTS' });
  };

  const toggleReducedMotion = () => {
    dispatch({ type: 'TOGGLE_REDUCED_MOTION' });
  };

  const resetTheme = () => {
    dispatch({ type: 'RESET_THEME' });
  };

  const value = {
    ...state,
    config: THEME_CONFIG[state.currentTheme],
    animationConfig: ANIMATION_CONFIG[state.animationPreset],
    setTheme,
    toggleAutoTheme,
    setAnimationPreset,
    setCustomColors,
    toggleParticleEffects,
    toggleSoundEffects,
    toggleReducedMotion,
    resetTheme
  };

  return (
    <ThemeContext.Provider value={value}>
      {children}
    </ThemeContext.Provider>
  );
}

export function useTheme() {
  const context = useContext(ThemeContext);
  if (!context) {
    throw new Error('useTheme must be used within a ThemeProvider');
  }
  return context;
}
