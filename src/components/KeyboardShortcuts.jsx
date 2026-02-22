import React, { useEffect, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useTheme } from '../context/ThemeContext';

export function KeyboardShortcuts() {
  const { config } = useTheme();
  const [showHelp, setShowHelp] = useState(false);
  const [recentShortcut, setRecentShortcut] = useState('');

  const shortcuts = [
    { key: 'Ctrl + N', description: 'Create new task', category: 'Tasks' },
    { key: 'Ctrl + /', description: 'Toggle search', category: 'Navigation' },
    { key: 'Ctrl + 1-5', description: 'Switch tabs', category: 'Navigation' },
    { key: 'Ctrl + D', description: 'Toggle dark mode', category: 'Theme' },
    { key: 'Ctrl + R', description: 'Random reality shift', category: 'Reality' },
    { key: 'Ctrl + Z', description: 'Undo last action', category: 'Actions' },
    { key: 'Ctrl + Y', description: 'Redo last action', category: 'Actions' },
    { key: 'Ctrl + S', description: 'Export tasks', category: 'Data' },
    { key: 'Ctrl + O', description: 'Import tasks', category: 'Data' },
    { key: 'Escape', description: 'Close modals', category: 'Navigation' },
    { key: 'Space', description: 'Toggle particle effects', category: 'Theme' },
    { key: 'Enter', description: 'Complete selected task', category: 'Tasks' },
    { key: 'Delete', description: 'Delete selected task', category: 'Tasks' }
  ];

  useEffect(() => {
    const handleKeyDown = (e) => {
      const key = [];
      
      if (e.ctrlKey || e.metaKey) key.push('Ctrl');
      if (e.shiftKey) key.push('Shift');
      if (e.altKey) key.push('Alt');
      
      if (e.key && e.key !== 'Control' && e.key !== 'Shift' && e.key !== 'Alt') {
        key.push(e.key === ' ' ? 'Space' : e.key === 'Escape' ? 'Escape' : e.key.toUpperCase());
      }
      
      const shortcut = key.join(' + ');
      
      // Handle specific shortcuts
      if (e.ctrlKey || e.metaKey) {
        switch (e.key.toLowerCase()) {
          case '/':
            e.preventDefault();
            setRecentShortcut('Toggle Search');
            break;
          case 'd':
            e.preventDefault();
            setRecentShortcut('Toggle Dark Mode');
            break;
          case 'r':
            e.preventDefault();
            setRecentShortcut('Random Reality Shift');
            break;
          case 'h':
            e.preventDefault();
            setShowHelp(!showHelp);
            break;
          case 's':
            e.preventDefault();
            setRecentShortcut('Export Tasks');
            break;
          case 'o':
            e.preventDefault();
            setRecentShortcut('Import Tasks');
            break;
          case 'z':
            e.preventDefault();
            setRecentShortcut('Undo');
            break;
          case 'y':
            e.preventDefault();
            setRecentShortcut('Redo');
            break;
          case '1':
          case '2':
          case '3':
          case '4':
          case '5':
            e.preventDefault();
            setRecentShortcut(`Switch to Tab ${e.key}`);
            break;
        }
      } else if (e.key === 'Escape') {
        setRecentShortcut('Close Modals');
      } else if (e.key === ' ') {
        e.preventDefault();
        setRecentShortcut('Toggle Particle Effects');
      }

      // Clear recent shortcut after 2 seconds
      if (shortcut) {
        setTimeout(() => setRecentShortcut(''), 2000);
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [showHelp]);

  const groupedShortcuts = shortcuts.reduce((acc, shortcut) => {
    if (!acc[shortcut.category]) acc[shortcut.category] = [];
    acc[shortcut.category].push(shortcut);
    return acc;
  }, {});

  return (
    <>
      <AnimatePresence>
        {recentShortcut && (
          <motion.div
            initial={{ opacity: 0, y: 50, scale: 0.8 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 50, scale: 0.8 }}
            className="fixed bottom-4 right-4 z-50 px-4 py-2 bg-black text-white rounded-lg shadow-lg"
          >
            <div className="flex items-center space-x-2">
              <span className="text-sm">⌨️</span>
              <span className="text-sm font-medium">{recentShortcut}</span>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      <AnimatePresence>
        {showHelp && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4"
            onClick={() => setShowHelp(false)}
          >
            <motion.div
              initial={{ scale: 0.9, y: 50 }}
              animate={{ scale: 1, y: 0 }}
              exit={{ scale: 0.9, y: 50 }}
              onClick={(e) => e.stopPropagation()}
              className={`max-w-4xl w-full max-h-[80vh] overflow-y-auto p-6 rounded-xl ${config.card} border-2`}
            >
              <div className="flex items-center justify-between mb-6">
                <h2 className="text-2xl font-bold text-gray-800">⌨️ Keyboard Shortcuts</h2>
                <button
                  onClick={() => setShowHelp(false)}
                  className="p-2 rounded-lg hover:bg-gray-100 transition-colors"
                >
                  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                  </svg>
                </button>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                {Object.entries(groupedShortcuts).map(([category, categoryShortcuts]) => (
                  <div key={category} className="space-y-2">
                    <h3 className="font-semibold text-gray-700 border-b pb-1">{category}</h3>
                    {categoryShortcuts.map((shortcut, index) => (
                      <div key={index} className="flex items-center justify-between py-1">
                        <kbd className="px-2 py-1 text-xs font-semibold text-gray-800 bg-gray-100 border border-gray-200 rounded">
                          {shortcut.key}
                        </kbd>
                        <span className="text-sm text-gray-600 ml-2">{shortcut.description}</span>
                      </div>
                    ))}
                  </div>
                ))}
              </div>

              <div className="mt-6 p-4 bg-blue-50 border border-blue-200 rounded-lg">
                <p className="text-sm text-blue-700">
                  <strong>Pro Tip:</strong> Press <kbd className="px-1 py-0.5 text-xs bg-blue-100 border border-blue-300 rounded">Ctrl + H</kbd> to toggle this help menu anytime!
                </p>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      <motion.button
        whileHover={{ scale: 1.05 }}
        whileTap={{ scale: 0.95 }}
        onClick={() => setShowHelp(true)}
        className="fixed bottom-4 left-4 z-40 p-3 bg-gray-800 text-white rounded-full shadow-lg hover:bg-gray-700 transition-colors"
        title="Keyboard Shortcuts (Ctrl+H)"
      >
        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 20l4-16m4 4l4 4-4 4M6 16l-4-4 4-4" />
        </svg>
      </motion.button>
    </>
  );
}
