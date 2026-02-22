export const TASK_CATEGORIES = {
  WORK: 'work',
  PERSONAL: 'personal',
  HEALTH: 'health',
  LEARNING: 'learning',
  FINANCE: 'finance',
  CREATIVE: 'creative',
  SOCIAL: 'social',
  EMERGENCY: 'emergency'
};

export const CATEGORY_CONFIG = {
  [TASK_CATEGORIES.WORK]: {
    name: 'Work',
    icon: '💼',
    color: 'blue',
    description: 'Professional tasks and projects'
  },
  [TASK_CATEGORIES.PERSONAL]: {
    name: 'Personal',
    icon: '🏠',
    color: 'green',
    description: 'Personal life and home tasks'
  },
  [TASK_CATEGORIES.HEALTH]: {
    name: 'Health',
    icon: '🏃',
    color: 'red',
    description: 'Health, fitness and wellness'
  },
  [TASK_CATEGORIES.LEARNING]: {
    name: 'Learning',
    icon: '📚',
    color: 'purple',
    description: 'Education and skill development'
  },
  [TASK_CATEGORIES.FINANCE]: {
    name: 'Finance',
    icon: '💰',
    color: 'yellow',
    description: 'Financial tasks and budgeting'
  },
  [TASK_CATEGORIES.CREATIVE]: {
    name: 'Creative',
    icon: '🎨',
    color: 'pink',
    description: 'Creative projects and hobbies'
  },
  [TASK_CATEGORIES.SOCIAL]: {
    name: 'Social',
    icon: '👥',
    color: 'indigo',
    description: 'Social activities and relationships'
  },
  [TASK_CATEGORIES.EMERGENCY]: {
    name: 'Emergency',
    icon: '🚨',
    color: 'orange',
    description: 'Urgent and critical tasks'
  }
};

export const TASK_PRIORITIES = {
  LOW: 'low',
  MEDIUM: 'medium',
  HIGH: 'high',
  URGENT: 'urgent'
};

export const PRIORITY_CONFIG = {
  [TASK_PRIORITIES.LOW]: {
    name: 'Low',
    level: 1,
    color: 'gray',
    weight: 1
  },
  [TASK_PRIORITIES.MEDIUM]: {
    name: 'Medium',
    level: 2,
    color: 'blue',
    weight: 2
  },
  [TASK_PRIORITIES.HIGH]: {
    name: 'High',
    level: 3,
    color: 'orange',
    weight: 3
  },
  [TASK_PRIORITIES.URGENT]: {
    name: 'Urgent',
    level: 4,
    color: 'red',
    weight: 4
  }
};

export const SORT_OPTIONS = {
  CREATED_DESC: 'created_desc',
  CREATED_ASC: 'created_asc',
  DEADLINE_DESC: 'deadline_desc',
  DEADLINE_ASC: 'deadline_asc',
  PRIORITY_DESC: 'priority_desc',
  PRIORITY_ASC: 'priority_asc',
  TITLE_ASC: 'title_asc',
  TITLE_DESC: 'title_desc',
  POINTS_DESC: 'points_desc',
  POINTS_ASC: 'points_asc'
};

export const SORT_CONFIG = {
  [SORT_OPTIONS.CREATED_DESC]: {
    name: 'Newest First',
    field: 'createdAt',
    direction: 'desc'
  },
  [SORT_OPTIONS.CREATED_ASC]: {
    name: 'Oldest First',
    field: 'createdAt',
    direction: 'asc'
  },
  [SORT_OPTIONS.DEADLINE_DESC]: {
    name: 'Deadline Soon',
    field: 'deadline',
    direction: 'desc'
  },
  [SORT_OPTIONS.DEADLINE_ASC]: {
    name: 'Deadline Far',
    field: 'deadline',
    direction: 'asc'
  },
  [SORT_OPTIONS.PRIORITY_DESC]: {
    name: 'High Priority',
    field: 'priority',
    direction: 'desc'
  },
  [SORT_OPTIONS.PRIORITY_ASC]: {
    name: 'Low Priority',
    field: 'priority',
    direction: 'asc'
  },
  [SORT_OPTIONS.TITLE_ASC]: {
    name: 'Title A-Z',
    field: 'title',
    direction: 'asc'
  },
  [SORT_OPTIONS.TITLE_DESC]: {
    name: 'Title Z-A',
    field: 'title',
    direction: 'desc'
  },
  [SORT_OPTIONS.POINTS_DESC]: {
    name: 'High Points',
    field: 'points',
    direction: 'desc'
  },
  [SORT_OPTIONS.POINTS_ASC]: {
    name: 'Low Points',
    field: 'points',
    direction: 'asc'
  }
};
