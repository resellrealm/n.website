import { createSlice } from '@reduxjs/toolkit';
import achievements from '../data/achievements';

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

// Improved XP curve - more generous scaling
const getXpForLevel = (level) => {
  return Math.floor(100 * Math.pow(1.15, level - 1));
};

const initialState = {
  xp: loadFromLocalStorage('userXp', 0),
  level: loadFromLocalStorage('userLevel', 1),
  unlockedAchievements: loadFromLocalStorage('unlockedAchievements', []),
  allAchievements: achievements
};

const achievementsSlice = createSlice({
  name: 'achievements',
  initialState,
  reducers: {
    addXp: (state, action) => {
      state.xp += action.payload;
      
      // Level up check
      let xpNeeded = getXpForLevel(state.level);
      while (state.xp >= xpNeeded) {
        state.xp -= xpNeeded;
        state.level += 1;
        xpNeeded = getXpForLevel(state.level);
      }
      
      saveToLocalStorage('userXp', state.xp);
      saveToLocalStorage('userLevel', state.level);
    },
    
    unlockAchievement: (state, action) => {
      const achievementId = action.payload;
      if (!state.unlockedAchievements.includes(achievementId)) {
        state.unlockedAchievements.push(achievementId);
        
        // Grant XP reward
        const achievement = achievements.find(a => a.id === achievementId);
        if (achievement && achievement.xpReward > 0) {
          state.xp += achievement.xpReward;
          
          // Level up check
          let xpNeeded = getXpForLevel(state.level);
          while (state.xp >= xpNeeded) {
            state.xp -= xpNeeded;
            state.level += 1;
            xpNeeded = getXpForLevel(state.level);
          }
        }
        
        saveToLocalStorage('unlockedAchievements', state.unlockedAchievements);
        saveToLocalStorage('userXp', state.xp);
        saveToLocalStorage('userLevel', state.level);
      }
    },
    
    checkAchievements: (state, action) => {
      const stats = action.payload;
      
      achievements.forEach(achievement => {
        if (state.unlockedAchievements.includes(achievement.id)) return;
        
        let unlocked = false;
        const req = achievement.requirement;
        
        switch (req.type) {
          case 'meals_logged':
            unlocked = stats.totalMeals >= req.count;
            break;
          case 'streak':
            unlocked = stats.currentStreak >= req.days;
            break;
          case 'level':
            unlocked = state.level >= req.value;
            break;
          case 'favourites_saved':
            unlocked = stats.favouritesCount >= req.count;
            break;
          case 'scans_completed':
            unlocked = stats.scansCompleted >= req.count;
            break;
          default:
            break;
        }
        
        if (unlocked) {
          state.unlockedAchievements.push(achievement.id);
          if (achievement.xpReward > 0) {
            state.xp += achievement.xpReward;
          }
        }
      });
      
      // Level up check after all achievements
      let xpNeeded = getXpForLevel(state.level);
      while (state.xp >= xpNeeded) {
        state.xp -= xpNeeded;
        state.level += 1;
        xpNeeded = getXpForLevel(state.level);
      }
      
      saveToLocalStorage('unlockedAchievements', state.unlockedAchievements);
      saveToLocalStorage('userXp', state.xp);
      saveToLocalStorage('userLevel', state.level);
    }
  }
});

export const { addXp, unlockAchievement, checkAchievements } = achievementsSlice.actions;
export { getXpForLevel };
export default achievementsSlice.reducer;
