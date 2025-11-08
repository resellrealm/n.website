import { createSlice } from '@reduxjs/toolkit';
import { PLANS } from '../utils/subscription';

const loadFromLocalStorage = (key, defaultValue) => {
  try {
    const item = localStorage.getItem(key);
    return item ? JSON.parse(item) : defaultValue;
  } catch {
    return defaultValue;
  }
};

const saveToLocalStorage = (key, value) => {
  try {
    localStorage.setItem(key, JSON.stringify(value));
  } catch (error) {
    console.error('Error saving to localStorage:', error);
  }
};

const initialState = {
  name: loadFromLocalStorage('userName', 'User'),
  plan: loadFromLocalStorage('userPlan', PLANS.BASIC),
  preferences: loadFromLocalStorage('userPreferences', {
    notifications: true,
    darkMode: false, // Default to light mode
    units: 'metric'
  }),
  stats: loadFromLocalStorage('userStats', {
    totalMeals: 0,
    currentStreak: 0,
    longestStreak: 0,
    favouritesCount: 0,
    scansCompleted: 0,
    joinDate: new Date().toISOString()
  })
};

const userSlice = createSlice({
  name: 'user',
  initialState,
  reducers: {
    setUserName: (state, action) => {
      state.name = action.payload;
      saveToLocalStorage('userName', state.name);
    },
    
    setUserPlan: (state, action) => {
      state.plan = action.payload;
      saveToLocalStorage('userPlan', state.plan);
    },
    
    updatePreferences: (state, action) => {
      state.preferences = { ...state.preferences, ...action.payload };
      saveToLocalStorage('userPreferences', state.preferences);
    },
    
    updateStats: (state, action) => {
      state.stats = { ...state.stats, ...action.payload };
      saveToLocalStorage('userStats', state.stats);
    },
    
    incrementMealCount: (state) => {
      state.stats.totalMeals += 1;
      saveToLocalStorage('userStats', state.stats);
    },
    
    incrementScanCount: (state) => {
      state.stats.scansCompleted += 1;
      saveToLocalStorage('userStats', state.stats);
    }
  }
});

export const {
  setUserName,
  setUserPlan,
  updatePreferences,
  updateStats,
  incrementMealCount,
  incrementScanCount
} = userSlice.actions;

export default userSlice.reducer;
