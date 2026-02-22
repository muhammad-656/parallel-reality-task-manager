import React, { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useTasks } from '../context/TaskContext';
import { useReality } from '../context/RealityContext';
import { useTheme } from '../context/ThemeContext';

export function VoiceCommands() {
  const { addTask, tasks, updateTask } = useTasks();
  const { config, changeRealityMode, randomRealityChange } = useReality();
  const { soundEffects, setTheme } = useTheme();
  const [isListening, setIsListening] = useState(false);
  const [transcript, setTranscript] = useState('');
  const [lastCommand, setLastCommand] = useState('');
  const recognitionRef = useRef(null);

  const commands = {
    'create task': {
      pattern: /create task (.+)/i,
      action: (match) => {
        const title = match[1].trim();
        if (title) {
          addTask({
            title,
            category: 'personal',
            priority: 'medium',
            optimistic: { description: '', deadline: '', difficulty: 1, points: 10 },
            realistic: { description: '', deadline: '', difficulty: 5, points: 5 },
            disaster: { description: '', deadline: '', difficulty: 8, points: 2 },
            completed: false,
            createdAt: Date.now(),
            completedAt: null
          });
          speak(`Created task: ${title}`);
        }
      }
    },
    'complete task': {
      pattern: /complete task (.+)/i,
      action: (match) => {
        const title = match[1].trim().toLowerCase();
        const task = tasks.find(t => t.title.toLowerCase().includes(title));
        if (task) {
          updateTask(task.id, { 
            completed: true, 
            completedAt: Date.now(),
            completedInReality: config.currentMode 
          });
          speak(`Completed task: ${task.title}`);
        } else {
          speak(`Task not found: ${title}`);
        }
      }
    },
    'switch reality': {
      pattern: /switch to (optimistic|realistic|disaster) reality/i,
      action: (match) => {
        const mode = match[1].toLowerCase();
        changeRealityMode(mode);
        speak(`Switched to ${mode} reality`);
      }
    },
    'random reality': {
      pattern: /random reality/i,
      action: () => {
        randomRealityChange();
        speak('Switched to random reality');
      }
    },
    'task count': {
      pattern: /how many tasks/i,
      action: () => {
        const active = tasks.filter(t => !t.completed).length;
        const completed = tasks.filter(t => t.completed).length;
        speak(`You have ${active} active tasks and ${completed} completed tasks`);
      }
    },
    'switch theme': {
      pattern: /switch to (light|dark|cyberpunk|nature|ocean|sunset|galaxy) theme/i,
      action: (match) => {
        const theme = match[1].toLowerCase();
        const themeMap = {
          'light': 'light',
          'dark': 'dark', 
          'cyberpunk': 'cyberpunk',
          'nature': 'nature',
          'ocean': 'ocean',
          'sunset': 'sunset',
          'galaxy': 'galaxy'
        };
        
        if (themeMap[theme]) {
          setTheme(themeMap[theme]);
          speak(`Switched to ${theme} theme`);
        }
      }
    }
  };

  const speak = (text) => {
    if (!soundEffects || !('speechSynthesis' in window)) return;
    
    const utterance = new SpeechSynthesisUtterance(text);
    utterance.rate = 1.1;
    utterance.pitch = 1;
    utterance.volume = 0.8;
    
    window.speechSynthesis.speak(utterance);
  };

  useEffect(() => {
    if (!('webkitSpeechRecognition' in window) && !('SpeechRecognition' in window)) {
      console.log('Speech recognition not supported');
      return;
    }

    const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;
    const recognition = new SpeechRecognition();
    
    recognition.continuous = false;
    recognition.interimResults = false;
    recognition.lang = 'en-US';

    recognition.onresult = (event) => {
      const transcript = event.results[0][0].transcript;
      setTranscript(transcript);
      
      // Check for command matches
      Object.entries(commands).forEach(([commandName, command]) => {
        const match = transcript.match(command.pattern);
        if (match) {
          setLastCommand(`${commandName}: ${transcript}`);
          command.action(match);
        }
      });
    };

    recognition.onerror = (event) => {
      console.error('Speech recognition error:', event.error);
      setIsListening(false);
    };

    recognition.onend = () => {
      setIsListening(false);
    };

    recognitionRef.current = recognition;

    return () => {
      if (recognitionRef.current) {
        recognitionRef.current.stop();
        setIsListening(false);
      }
    };
  }, [soundEffects, commands]); // eslint-disable-line react-hooks/exhaustive-deps

  const toggleListening = () => {
    if (!recognitionRef.current) return;

    if (isListening) {
      recognitionRef.current.stop();
      setIsListening(false);
    } else {
      recognitionRef.current.start();
      setIsListening(true);
      setTranscript('');
      setLastCommand('');
    }
  };

  return (
    <>
      <motion.div
        initial={{ opacity: 0, scale: 0.8 }}
        animate={{ opacity: 1, scale: 1 }}
        className="fixed bottom-4 right-4 z-40"
      >
        <motion.button
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
          onClick={toggleListening}
          className={`p-4 rounded-full shadow-lg transition-all ${
            isListening 
              ? 'bg-red-500 text-white animate-pulse' 
              : 'bg-gray-800 text-white hover:bg-gray-700'
          }`}
        >
          {isListening ? (
            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 11a7 7 0 01-7 7m0 0a7 7 0 0114 0m0 0a7 7 0 01-14 0M9 11a7 7 0 01-7 7m0 0a7 7 0 0114 0m0 0a7 7 0 01-14 0" />
            </svg>
          ) : (
            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 11a7 7 0 01-7 7m0 0a7 7 0 0114 0m0 0a7 7 0 01-14 0M9 11a7 7 0 01-7 7m0 0a7 7 0 0114 0m0 0a7 7 0 01-14 0" />
            </svg>
          )}
        </motion.button>
      </motion.div>

      <AnimatePresence>
        {isListening && (
          <motion.div
            initial={{ opacity: 0, y: 50 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: 50 }}
            className="fixed top-4 right-4 z-50 p-4 bg-black text-white rounded-lg shadow-xl max-w-sm"
          >
            <div className="flex items-center space-x-2 mb-2">
              <div className="w-3 h-3 bg-red-500 rounded-full animate-pulse" />
              <span className="text-sm font-medium">Listening...</span>
            </div>
            
            {transcript && (
              <div className="text-sm mb-2 p-2 bg-white bg-opacity-20 rounded">
                "{transcript}"
              </div>
            )}
            
            <div className="text-xs text-gray-300">
              Say commands like:
            </div>
            <div className="text-xs space-y-1 mt-1">
              <div>• "Create task [task name]"</div>
              <div>• "Complete task [task name]"</div>
              <div>• "Switch to [reality] reality"</div>
              <div>• "Switch to [theme] theme"</div>
              <div>• "How many tasks"</div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      <AnimatePresence>
        {lastCommand && (
          <motion.div
            initial={{ opacity: 0, x: 50 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: 50 }}
            className="fixed bottom-20 right-4 z-40 px-3 py-2 bg-green-500 text-white rounded-lg shadow-lg text-sm"
          >
            ✅ {lastCommand}
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}
