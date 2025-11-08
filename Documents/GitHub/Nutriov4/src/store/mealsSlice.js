import { createSlice } from '@reduxjs/toolkit';
import { getHistoryRetentionDays } from '../utils/subscription';

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

// Filter meals based on retention period
const filterMealsByRetention = (meals) => {
  const retentionDays = getHistoryRetentionDays();
  const cutoffDate = new Date();
  cutoffDate.setDate(cutoffDate.getDate() - retentionDays);
  
  return meals.filter(meal => new Date(meal.date) >= cutoffDate);
};

const initialState = {
  history: filterMealsByRetention(loadFromLocalStorage('mealHistory', [])),
  favourites: loadFromLocalStorage('favourites', []),
  dailyGoals: {
    calories: 2000,
    protein: 150,
    carbs: 250,
    fat: 65
  }
};

const mealsSlice = createSlice({
  name: 'meals',
  initialState,
  reducers: {
    addMeal: (state, action) => {
      const newMeal = {
        ...action.payload,
        id: Date.now().toString(),
        date: new Date().toISOString()
      };
      state.history.unshift(newMeal);
      
      // Apply retention filter
      state.history = filterMealsByRetention(state.history);
      
      saveToLocalStorage('mealHistory', state.history);
    },
    
    deleteMeal: (state, action) => {
      state.history = state.history.filter(meal => meal.id !== action.payload);
      saveToLocalStorage('mealHistory', state.history);
    },
    
    addFavourite: (state, action) => {
      if (!state.favourites.find(fav => fav.id === action.payload.id)) {
        state.favourites.push({
          ...action.payload,
          id: action.payload.id || Date.now().toString()
        });
        saveToLocalStorage('favourites', state.favourites);
      }
    },
    
    removeFavourite: (state, action) => {
      state.favourites = state.favourites.filter(fav => fav.id !== action.payload);
      saveToLocalStorage('favourites', state.favourites);
    },
    
    updateDailyGoals: (state, action) => {
      state.dailyGoals = { ...state.dailyGoals, ...action.payload };
      saveToLocalStorage('dailyGoals', state.dailyGoals);
    },
    
    clearOldHistory: (state) => {
      state.history = filterMealsByRetention(state.history);
      saveToLocalStorage('mealHistory', state.history);
    }
  }
});

export const {
  addMeal,
  deleteMeal,
  addFavourite,
  removeFavourite,
  updateDailyGoals,
  clearOldHistory
} = mealsSlice.actions;

export default mealsSlice.reducer;
