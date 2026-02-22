import React, { createContext, useContext, useReducer, useEffect } from 'react';
import { useLocalStorage } from '../hooks/useLocalStorage';
import { TASK_CATEGORIES, TASK_PRIORITIES, SORT_OPTIONS } from '../constants/categories';

const FilterContext = createContext();

const initialState = {
  categories: Object.values(TASK_CATEGORIES),
  priorities: Object.values(TASK_PRIORITIES),
  searchQuery: '',
  sortBy: SORT_OPTIONS.CREATED_DESC,
  showCompleted: true,
  dateRange: null,
  tags: []
};

function filterReducer(state, action) {
  switch (action.type) {
    case 'SET_CATEGORIES':
      return { ...state, categories: action.payload };
    
    case 'SET_PRIORITIES':
      return { ...state, priorities: action.payload };
    
    case 'SET_SEARCH_QUERY':
      return { ...state, searchQuery: action.payload };
    
    case 'SET_SORT_BY':
      return { ...state, sortBy: action.payload };
    
    case 'TOGGLE_SHOW_COMPLETED':
      return { ...state, showCompleted: !state.showCompleted };
    
    case 'SET_DATE_RANGE':
      return { ...state, dateRange: action.payload };
    
    case 'SET_TAGS':
      return { ...state, tags: action.payload };
    
    case 'RESET_FILTERS':
      return initialState;
    
    case 'LOAD_FILTERS':
      return { ...state, ...action.payload };
    
    default:
      return state;
  }
}

export function FilterProvider({ children }) {
  const [state, dispatch] = useReducer(filterReducer, initialState);
  const [savedFilters, setSavedFilters] = useLocalStorage('parallel-reality-filters', initialState);

  useEffect(() => {
    if (savedFilters) {
      dispatch({ type: 'LOAD_FILTERS', payload: savedFilters });
    }
  }, []); // eslint-disable-line react-hooks/exhaustive-deps

  useEffect(() => {
    setSavedFilters(state);
  }, [state, setSavedFilters]);

  const setCategories = (categories) => {
    dispatch({ type: 'SET_CATEGORIES', payload: categories });
  };

  const setPriorities = (priorities) => {
    dispatch({ type: 'SET_PRIORITIES', payload: priorities });
  };

  const setSearchQuery = (query) => {
    dispatch({ type: 'SET_SEARCH_QUERY', payload: query });
  };

  const setSortBy = (sortBy) => {
    dispatch({ type: 'SET_SORT_BY', payload: sortBy });
  };

  const toggleShowCompleted = () => {
    dispatch({ type: 'TOGGLE_SHOW_COMPLETED' });
  };

  const setDateRange = (dateRange) => {
    dispatch({ type: 'SET_DATE_RANGE', payload: dateRange });
  };

  const setTags = (tags) => {
    dispatch({ type: 'SET_TAGS', payload: tags });
  };

  const resetFilters = () => {
    dispatch({ type: 'RESET_FILTERS' });
  };

  const value = {
    ...state,
    setCategories,
    setPriorities,
    setSearchQuery,
    setSortBy,
    toggleShowCompleted,
    setDateRange,
    setTags,
    resetFilters
  };

  return (
    <FilterContext.Provider value={value}>
      {children}
    </FilterContext.Provider>
  );
}

export function useFilters() {
  const context = useContext(FilterContext);
  if (!context) {
    throw new Error('useFilters must be used within a FilterProvider');
  }
  return context;
}
