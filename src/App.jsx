import React from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { RealityProvider } from './context/RealityContext';
import { TaskProvider } from './context/TaskContext';
import { FilterProvider } from './context/FilterContext';
import { ThemeProvider } from './context/ThemeContext';
import { RealitySwitcher } from './components/RealitySwitcher';
import { ControlPanel } from './components/ControlPanel';
import { FilterPanel } from './components/FilterPanel';
import { TaskList } from './components/TaskList';
import { AnalyticsDashboard } from './components/AnalyticsDashboard';
import { TaskTemplates } from './components/TaskTemplates';
import { NotificationSystem } from './components/NotificationSystem';
import { ExportImport } from './components/ExportImport';
import { Gamification } from './components/Gamification';
import { ThemeCustomizer } from './components/ThemeCustomizer';
import { ParticleEffects } from './components/ParticleEffects';
import { KeyboardShortcuts } from './components/KeyboardShortcuts';
import { DataVisualization } from './components/DataVisualization';
import { VoiceCommands } from './components/VoiceCommands';
import { DependencyManager } from './components/DependencyManager';
import { useReality } from './context/RealityContext';
import { useTheme } from './context/ThemeContext';
import './index.css';

function AppContent() {
  const { config, isTransitioning } = useReality();
  const { config: themeConfig } = useTheme();
  const [activeTab, setActiveTab] = React.useState('tasks');

  const tabs = [
    { id: 'tasks', name: 'Tasks', icon: '📋' },
    { id: 'visualization', name: 'Data Viz', icon: '📈' },
    { id: 'voice', name: 'Voice', icon: '🎤' },
    { id: 'analytics', name: 'Analytics', icon: '📊' },
    { id: 'templates', name: 'Templates', icon: '📝' },
    { id: 'gamification', name: 'Gamification', icon: '🎮' },
    { id: 'themes', name: 'Themes', icon: '🎨' },
    { id: 'export', name: 'Export/Import', icon: '💾' }
  ];

  return (
    <motion.div
      key={themeConfig.background}
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.5 }}
      className={`min-h-screen bg-gradient-to-br ${themeConfig.background} transition-all duration-500`}
    >
      <ParticleEffects />
      <KeyboardShortcuts />
      <NotificationSystem />
      
      <div className="container mx-auto px-4 py-8 max-w-7xl">
        <motion.header
          initial={{ y: -50, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          className="text-center mb-8"
        >
          <h1 className="text-4xl md:text-5xl font-bold text-gray-800 mb-2">
            Parallel Reality Task Manager
          </h1>
          <motion.p
            animate={{ 
              color: isTransitioning ? ['#ef4444', '#eab308', '#22c55e'] : config.theme.primary === 'emerald' ? '#10b981' : config.theme.primary === 'red' ? '#ef4444' : '#6b7280'
            }}
            transition={{ duration: 2, repeat: isTransitioning ? Infinity : 0 }}
            className="text-lg"
          >
            Manage tasks across multiple realities
          </motion.p>
        </motion.header>

        <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
          <div className="lg:col-span-3 space-y-6">
            <div className="flex flex-wrap gap-2 mb-6">
              {tabs.map((tab) => (
                <motion.button
                  key={tab.id}
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  onClick={() => setActiveTab(tab.id)}
                  className={`px-4 py-2 rounded-lg font-medium transition-all ${
                    activeTab === tab.id
                      ? `bg-${config.theme.primary}-500 text-white`
                      : 'bg-white text-gray-600 hover:bg-gray-100'
                  }`}
                >
                  <span className="mr-2">{tab.icon}</span>
                  {tab.name}
                </motion.button>
              ))}
            </div>

            <AnimatePresence mode="wait">
              {activeTab === 'visualization' && (
                <motion.div
                  key="visualization"
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -20 }}
                >
                  <DataVisualization />
                </motion.div>
              )}
              
              {activeTab === 'voice' && (
                <motion.div
                  key="voice"
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -20 }}
                >
                  <div className={`p-6 rounded-xl ${themeConfig.card} border-2`}>
                    <h2 className="text-2xl font-bold text-gray-800 mb-4">🎤 Voice Commands</h2>
                    <VoiceCommands />
                  </div>
                </motion.div>
              )}
              
              {activeTab === 'tasks' && (
                <motion.div
                  key="tasks"
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -20 }}
                >
                  <FilterPanel />
                  <TaskList />
                </motion.div>
              )}
              
              {activeTab === 'analytics' && (
                <motion.div
                  key="analytics"
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -20 }}
                >
                  <AnalyticsDashboard />
                </motion.div>
              )}
              
              {activeTab === 'templates' && (
                <motion.div
                  key="templates"
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -20 }}
                >
                  <TaskTemplates />
                </motion.div>
              )}
              
              {activeTab === 'gamification' && (
                <motion.div
                  key="gamification"
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -20 }}
                >
                  <Gamification />
                </motion.div>
              )}
              
              {activeTab === 'export' && (
                <motion.div
                  key="export"
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -20 }}
                >
                  <ExportImport />
                </motion.div>
              )}
            </AnimatePresence>
          </div>
          
          <div className="space-y-6">
            <RealitySwitcher />
            <ControlPanel />
          </div>
        </div>

        <motion.footer
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.5 }}
          className="text-center mt-12 text-sm text-gray-600"
        >
          <p>
            Current Reality: <span className="font-semibold">{config.name}</span> | 
            Auto-change: <span className="font-semibold">{isTransitioning ? 'Shifting...' : 'Active'}</span>
          </p>
        </motion.footer>
      </div>

      <AnimatePresence>
        {isTransitioning && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black bg-opacity-20 z-40 pointer-events-none"
          >
            <motion.div
              initial={{ scale: 0 }}
              animate={{ scale: 1 }}
              exit={{ scale: 0 }}
              className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2"
            >
              <div className="text-6xl">🌀</div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.div>
  );
}

function App() {
  return (
    <ThemeProvider>
      <RealityProvider>
        <TaskProvider>
          <FilterProvider>
            <AppContent />
          </FilterProvider>
        </TaskProvider>
      </RealityProvider>
    </ThemeProvider>
  );
}

export default App;
