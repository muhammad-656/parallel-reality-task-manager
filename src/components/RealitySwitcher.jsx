import React from 'react';
import { motion } from 'framer-motion';
import { useReality } from '../context/RealityContext';
import { REALITY_MODES } from '../constants/realityModes';

export function RealitySwitcher() {
  const { 
    currentMode, 
    config, 
    changeRealityMode, 
    randomRealityChange, 
    autoChangeEnabled, 
    toggleAutoChange,
    isTransitioning 
  } = useReality();

  const getRealityIcon = (mode) => {
    switch (mode) {
      case REALITY_MODES.OPTIMISTIC:
        return '☀️';
      case REALITY_MODES.DISASTER:
        return '🌪️';
      default:
        return '⚖️';
    }
  };

  const getRealityColor = (mode) => {
    switch (mode) {
      case REALITY_MODES.OPTIMISTIC:
        return 'from-emerald-400 to-cyan-400';
      case REALITY_MODES.DISASTER:
        return 'from-red-400 to-orange-400';
      default:
        return 'from-gray-400 to-slate-400';
    }
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: -20 }}
      animate={{ opacity: 1, y: 0 }}
      className={`p-6 rounded-xl ${config.theme.card} border-2 ${
        isTransitioning ? 'animate-pulse' : ''
      }`}
    >
      <div className="flex items-center justify-between mb-4">
        <h2 className="text-2xl font-bold text-gray-800">Reality Mode</h2>
        <motion.div
          animate={{ rotate: isTransitioning ? 360 : 0 }}
          transition={{ duration: 0.5 }}
          className="text-3xl"
        >
          {getRealityIcon(currentMode)}
        </motion.div>
      </div>

      <motion.div
        key={currentMode}
        initial={{ opacity: 0, x: -20 }}
        animate={{ opacity: 1, x: 0 }}
        className="mb-6"
      >
        <h3 className={`text-xl font-semibold text-${config.theme.primary}-700 mb-2`}>
          {config.name}
        </h3>
        <p className={`text-${config.theme.primary}-600`}>
          {config.description}
        </p>
      </motion.div>

      <div className="grid grid-cols-3 gap-2 mb-4">
        {Object.values(REALITY_MODES).map((mode) => (
          <motion.button
            key={mode}
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            onClick={() => changeRealityMode(mode)}
            className={`p-3 rounded-lg border-2 transition-all ${
              currentMode === mode
                ? `border-${config.theme.primary}-500 bg-gradient-to-r ${getRealityColor(mode)} text-white`
                : 'border-gray-300 bg-white hover:border-gray-400'
            }`}
          >
            <div className="text-2xl mb-1">{getRealityIcon(mode)}</div>
            <div className="text-xs font-medium">
              {mode === REALITY_MODES.OPTIMISTIC ? 'Optimistic' : 
               mode === REALITY_MODES.DISASTER ? 'Disaster' : 'Realistic'}
            </div>
          </motion.button>
        ))}
      </div>

      <div className="space-y-3">
        <motion.button
          whileHover={{ scale: 1.02 }}
          whileTap={{ scale: 0.98 }}
          onClick={randomRealityChange}
          className={`w-full py-2 px-4 rounded-lg bg-gradient-to-r ${getRealityColor('random')} text-white font-medium transition-all hover:shadow-lg`}
        >
          🎲 Random Reality Shift
        </motion.button>

        <div className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
          <span className="text-sm font-medium text-gray-700">Auto Change</span>
          <motion.button
            whileHover={{ scale: 1.1 }}
            whileTap={{ scale: 0.9 }}
            onClick={toggleAutoChange}
            className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors ${
              autoChangeEnabled ? `bg-${config.theme.primary}-500` : 'bg-gray-300'
            }`}
          >
            <motion.span
              animate={{ x: autoChangeEnabled ? 20 : 2 }}
              className="inline-block h-4 w-4 transform rounded-full bg-white transition-transform"
            />
          </motion.button>
        </div>
      </div>

      {isTransitioning && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          className="mt-4 p-3 bg-yellow-50 border border-yellow-200 rounded-lg"
        >
          <p className="text-sm text-yellow-800 font-medium">
            ⚡ Reality shifting in progress...
          </p>
        </motion.div>
      )}

      <div className="mt-4 p-3 bg-gray-50 rounded-lg">
        <h4 className="text-sm font-semibold text-gray-700 mb-2">Current Effects:</h4>
        <div className="space-y-1 text-xs text-gray-600">
          <div>Auto-complete: {(config.effects.autoCompleteChance * 100).toFixed(0)}%</div>
          <div>Task duplication: {config.effects.taskDuplication ? 'Enabled' : 'Disabled'}</div>
          <div>Deadline multiplier: {config.effects.deadlineMultiplier}x</div>
          <div>Point multiplier: {config.effects.pointMultiplier}x</div>
        </div>
      </div>
    </motion.div>
  );
}
