import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useTheme } from '../context/ThemeContext';
import { THEME_CONFIG, ANIMATION_CONFIG } from '../constants/themes';

export function ThemeCustomizer() {
  const { 
    currentTheme, 
    config, 
    autoTheme, 
    animationPreset, 
    particleEffects, 
    soundEffects, 
    reducedMotion,
    setTheme, 
    toggleAutoTheme, 
    setAnimationPreset, 
    toggleParticleEffects, 
    toggleSoundEffects, 
    toggleReducedMotion 
  } = useTheme();
  const [isExpanded, setIsExpanded] = useState(false);

  const getThemePreview = (theme) => {
    const themeConfig = THEME_CONFIG[theme];
    return {
      background: themeConfig.background,
      card: themeConfig.card,
      text: themeConfig.text
    };
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className={`p-6 rounded-xl ${config.card} border-2`}
    >
      <div className="flex items-center justify-between mb-4">
        <h2 className="text-xl font-semibold text-gray-800">🎨 Theme Customizer</h2>
        <motion.button
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
          onClick={() => setIsExpanded(!isExpanded)}
          className={`p-2 rounded-lg ${isExpanded ? 'bg-blue-500 text-white' : 'bg-gray-100 text-gray-600'}`}
        >
          <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6V4m0 2a2 2 0 100 4m0-4a2 2 0 110 4m-6 8a2 2 0 100-4m0 4a2 2 0 110-4m0 4v2m0-6V4m6 6v10m6-2a2 2 0 100-4m0 4a2 2 0 110-4m0 4v2m0-6V4" />
          </svg>
        </motion.button>
      </div>

      <div className="space-y-4">
        <div>
          <h3 className="text-sm font-semibold text-gray-700 mb-3">Theme Mode</h3>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-2">
            {Object.entries(THEME_CONFIG).map(([key, theme]) => (
              <motion.button
                key={key}
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                onClick={() => setTheme(key)}
                className={`p-3 rounded-lg border-2 transition-all ${
                  currentTheme === key
                    ? 'border-blue-500 shadow-lg'
                    : 'border-gray-200 hover:border-gray-300'
                }`}
                style={{
                  background: `linear-gradient(135deg, ${getThemePreview(key).background})`
                }}
              >
                <div className="text-2xl mb-1">{theme.icon}</div>
                <div className="text-xs font-medium text-gray-800">{theme.name}</div>
              </motion.button>
            ))}
          </div>
        </div>

        <div className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
          <div>
            <div className="text-sm font-medium text-gray-700">Auto Theme</div>
            <div className="text-xs text-gray-500">Switch based on time of day</div>
          </div>
          <motion.button
            whileHover={{ scale: 1.1 }}
            whileTap={{ scale: 0.9 }}
            onClick={toggleAutoTheme}
            className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors ${
              autoTheme ? 'bg-blue-500' : 'bg-gray-300'
            }`}
          >
            <motion.span
              animate={{ x: autoTheme ? 20 : 2 }}
              className="inline-block h-4 w-4 transform rounded-full bg-white transition-transform"
            />
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
                <h3 className="text-sm font-semibold text-gray-700 mb-3">Animation Style</h3>
                <div className="grid grid-cols-2 md:grid-cols-3 gap-2">
                  {Object.entries(ANIMATION_CONFIG).map(([key, animConfig]) => (
                    <motion.button
                      key={key}
                      whileHover={{ scale: 1.05 }}
                      whileTap={{ scale: 0.95 }}
                      onClick={() => setAnimationPreset(key)}
                      className={`px-3 py-2 rounded-lg border text-sm font-medium transition-all ${
                        animationPreset === key
                          ? 'border-blue-500 bg-blue-50 text-blue-700'
                          : 'border-gray-200 bg-white text-gray-700 hover:border-gray-300'
                      }`}
                    >
                      <div className="capitalize">{key}</div>
                      <div className="text-xs text-gray-500">{animConfig.duration}s</div>
                    </motion.button>
                  ))}
                </div>
              </div>

              <div>
                <h3 className="text-sm font-semibold text-gray-700 mb-3">Visual Effects</h3>
                <div className="space-y-2">
                  <div className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                    <div>
                      <div className="text-sm font-medium text-gray-700">Particle Effects</div>
                      <div className="text-xs text-gray-500">Interactive background particles</div>
                    </div>
                    <motion.button
                      whileHover={{ scale: 1.1 }}
                      whileTap={{ scale: 0.9 }}
                      onClick={toggleParticleEffects}
                      className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors ${
                        particleEffects ? 'bg-purple-500' : 'bg-gray-300'
                      }`}
                    >
                      <motion.span
                        animate={{ x: particleEffects ? 20 : 2 }}
                        className="inline-block h-4 w-4 transform rounded-full bg-white transition-transform"
                      />
                    </motion.button>
                  </div>

                  <div className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                    <div>
                      <div className="text-sm font-medium text-gray-700">Sound Effects</div>
                      <div className="text-xs text-gray-500">Audio feedback for actions</div>
                    </div>
                    <motion.button
                      whileHover={{ scale: 1.1 }}
                      whileTap={{ scale: 0.9 }}
                      onClick={toggleSoundEffects}
                      className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors ${
                        soundEffects ? 'bg-green-500' : 'bg-gray-300'
                      }`}
                    >
                      <motion.span
                        animate={{ x: soundEffects ? 20 : 2 }}
                        className="inline-block h-4 w-4 transform rounded-full bg-white transition-transform"
                      />
                    </motion.button>
                  </div>

                  <div className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                    <div>
                      <div className="text-sm font-medium text-gray-700">Reduced Motion</div>
                      <div className="text-xs text-gray-500">Minimize animations for accessibility</div>
                    </div>
                    <motion.button
                      whileHover={{ scale: 1.1 }}
                      whileTap={{ scale: 0.9 }}
                      onClick={toggleReducedMotion}
                      className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors ${
                        reducedMotion ? 'bg-orange-500' : 'bg-gray-300'
                      }`}
                    >
                      <motion.span
                        animate={{ x: reducedMotion ? 20 : 2 }}
                        className="inline-block h-4 w-4 transform rounded-full bg-white transition-transform"
                      />
                    </motion.button>
                  </div>
                </div>
              </div>

              <div className="p-4 bg-gradient-to-r from-purple-50 to-pink-50 rounded-lg border border-purple-200">
                <h4 className="text-sm font-semibold text-purple-800 mb-2">Current Theme Info</h4>
                <div className="grid grid-cols-2 gap-2 text-xs text-purple-700">
                  <div>
                    <span className="font-medium">Theme:</span> {config.name}
                  </div>
                  <div>
                    <span className="font-medium">Animation:</span> {animationPreset}
                  </div>
                  <div>
                    <span className="font-medium">Particles:</span> {particleEffects ? 'On' : 'Off'}
                  </div>
                  <div>
                    <span className="font-medium">Auto:</span> {autoTheme ? 'On' : 'Off'}
                  </div>
                </div>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </motion.div>
  );
}
