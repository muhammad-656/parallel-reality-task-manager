export const REALITY_MODES = {
  OPTIMISTIC: 'optimistic',
  REALISTIC: 'realistic',
  DISASTER: 'disaster'
};

export const REALITY_CONFIG = {
  [REALITY_MODES.OPTIMISTIC]: {
    name: 'Optimistic Reality',
    description: 'Everything goes perfectly!',
    theme: {
      primary: 'emerald',
      secondary: 'cyan',
      accent: 'teal',
      background: 'from-emerald-50 to-cyan-50',
      card: 'task-card-optimistic',
      glow: 'glow-optimistic'
    },
    effects: {
      autoCompleteChance: 0.3,
      taskDuplication: false,
      deadlineMultiplier: 1.5,
      difficultyReduction: 0.7,
      pointMultiplier: 2
    },
    animations: {
      duration: 0.3,
      easing: 'ease-out'
    }
  },
  [REALITY_MODES.REALISTIC]: {
    name: 'Realistic Reality',
    description: 'Life as it usually is.',
    theme: {
      primary: 'gray',
      secondary: 'slate',
      accent: 'zinc',
      background: 'from-gray-50 to-slate-100',
      card: 'task-card-realistic',
      glow: ''
    },
    effects: {
      autoCompleteChance: 0.05,
      taskDuplication: false,
      deadlineMultiplier: 1,
      difficultyReduction: 1,
      pointMultiplier: 1
    },
    animations: {
      duration: 0.2,
      easing: 'ease-in-out'
    }
  },
  [REALITY_MODES.DISASTER]: {
    name: 'Disaster Reality',
    description: 'Everything that can go wrong, will!',
    theme: {
      primary: 'red',
      secondary: 'orange',
      accent: 'yellow',
      background: 'from-red-50 to-orange-50',
      card: 'task-card-disaster',
      glow: 'glow-disaster'
    },
    effects: {
      autoCompleteChance: 0,
      taskDuplication: true,
      deadlineMultiplier: 0.5,
      difficultyReduction: 1.5,
      pointMultiplier: 0.5
    },
    animations: {
      duration: 0.1,
      easing: 'ease-in'
    }
  }
};
