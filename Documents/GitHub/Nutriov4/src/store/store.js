import { configureStore } from '@reduxjs/toolkit';
import mealsReducer from './mealsSlice';
import achievementsReducer from './achievementsSlice';
import userReducer from './userSlice';

export const store = configureStore({
  reducer: {
    meals: mealsReducer,
    achievements: achievementsReducer,
    user: userReducer
  }
});

export default store;
