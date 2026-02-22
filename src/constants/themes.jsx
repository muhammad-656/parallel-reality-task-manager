export const THEME_MODES = {
  LIGHT: 'light',
  DARK: 'dark',
  AUTO: 'auto',
  CYBERPUNK: 'cyberpunk',
  NATURE: 'nature',
  OCEAN: 'ocean',
  SUNSET: 'sunset',
  GALAXY: 'galaxy'
};

export const THEME_CONFIG = {
  [THEME_MODES.LIGHT]: {
    name: 'Light',
    icon: '☀️',
    background: 'from-gray-50 to-white',
    card: 'bg-white border-gray-200',
    text: 'text-gray-900',
    subtext: 'text-gray-600',
    primary: 'blue',
    secondary: 'gray',
    accent: 'indigo'
  },
  [THEME_MODES.DARK]: {
    name: 'Dark',
    icon: '🌙',
    background: 'from-gray-900 to-black',
    card: 'bg-gray-800 border-gray-700',
    text: 'text-gray-100',
    subtext: 'text-gray-400',
    primary: 'purple',
    secondary: 'gray',
    accent: 'pink'
  },
  [THEME_MODES.CYBERPUNK]: {
    name: 'Cyberpunk',
    icon: '🤖',
    background: 'from-purple-900 via-pink-900 to-indigo-900',
    card: 'bg-black border-pink-500',
    text: 'text-pink-100',
    subtext: 'text-pink-300',
    primary: 'pink',
    secondary: 'purple',
    accent: 'cyan'
  },
  [THEME_MODES.NATURE]: {
    name: 'Nature',
    icon: '🌿',
    background: 'from-green-100 via-emerald-50 to-teal-100',
    card: 'bg-green-50 border-green-300',
    text: 'text-green-900',
    subtext: 'text-green-700',
    primary: 'green',
    secondary: 'emerald',
    accent: 'teal'
  },
  [THEME_MODES.OCEAN]: {
    name: 'Ocean',
    icon: '🌊',
    background: 'from-blue-100 via-cyan-50 to-teal-100',
    card: 'bg-blue-50 border-blue-300',
    text: 'text-blue-900',
    subtext: 'text-blue-700',
    primary: 'blue',
    secondary: 'cyan',
    accent: 'teal'
  },
  [THEME_MODES.SUNSET]: {
    name: 'Sunset',
    icon: '🌅',
    background: 'from-orange-100 via-pink-50 to-purple-100',
    card: 'bg-orange-50 border-orange-300',
    text: 'text-orange-900',
    subtext: 'text-orange-700',
    primary: 'orange',
    secondary: 'pink',
    accent: 'purple'
  },
  [THEME_MODES.GALAXY]: {
    name: 'Galaxy',
    icon: '🌌',
    background: 'from-indigo-900 via-purple-900 to-pink-900',
    card: 'bg-indigo-950 border-purple-500',
    text: 'text-purple-100',
    subtext: 'text-purple-300',
    primary: 'purple',
    secondary: 'indigo',
    accent: 'pink'
  }
};

export const ANIMATION_PRESETS = {
  SMOOTH: 'smooth',
  BOUNCY: 'bouncy',
  DRAMATIC: 'dramatic',
  SUBTLE: 'subtle',
  FAST: 'fast',
  SLOW: 'slow'
};

export const ANIMATION_CONFIG = {
  [ANIMATION_PRESETS.SMOOTH]: {
    duration: 0.3,
    ease: 'easeInOut',
    spring: { stiffness: 100, damping: 15 }
  },
  [ANIMATION_PRESETS.BOUNCY]: {
    duration: 0.5,
    ease: 'easeOut',
    spring: { stiffness: 300, damping: 20 }
  },
  [ANIMATION_PRESETS.DRAMATIC]: {
    duration: 0.6,
    ease: 'easeInOut',
    spring: { stiffness: 200, damping: 10 }
  },
  [ANIMATION_PRESETS.SUBTLE]: {
    duration: 0.2,
    ease: 'easeInOut',
    spring: { stiffness: 50, damping: 25 }
  },
  [ANIMATION_PRESETS.FAST]: {
    duration: 0.15,
    ease: 'easeOut',
    spring: { stiffness: 400, damping: 25 }
  },
  [ANIMATION_PRESETS.SLOW]: {
    duration: 0.8,
    ease: 'easeInOut',
    spring: { stiffness: 80, damping: 20 }
  }
};
