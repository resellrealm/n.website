/**
 * Nutrio Achievements System
 * Expanded achievement list with various milestones
 */

export const achievements = [
  // First Steps
  {
    id: 'first_meal',
    name: 'First Meal',
    description: 'Log your first meal',
    icon: '🍽️',
    xpReward: 50,
    requirement: { type: 'meals_logged', count: 1 }
  },
  {
    id: 'week_streak',
    name: 'Week Warrior',
    description: 'Log meals for 7 consecutive days',
    icon: '📅',
    xpReward: 200,
    requirement: { type: 'streak', days: 7 }
  },
  
  // Meal Milestones
  {
    id: 'meals_10',
    name: 'Getting Started',
    description: 'Log 10 meals',
    icon: '🎯',
    xpReward: 100,
    requirement: { type: 'meals_logged', count: 10 }
  },
  {
    id: 'meals_50',
    name: 'Nutrition Enthusiast',
    description: 'Log 50 meals',
    icon: '⭐',
    xpReward: 300,
    requirement: { type: 'meals_logged', count: 50 }
  },
  {
    id: 'meals_100',
    name: 'Century Club',
    description: 'Log 100 meals',
    icon: '💯',
    xpReward: 500,
    requirement: { type: 'meals_logged', count: 100 }
  },
  {
    id: 'meals_250',
    name: 'Nutrition Master',
    description: 'Log 250 meals',
    icon: '🏆',
    xpReward: 1000,
    requirement: { type: 'meals_logged', count: 250 }
  },
  {
    id: 'meals_500',
    name: 'Legendary Logger',
    description: 'Log 500 meals',
    icon: '👑',
    xpReward: 2000,
    requirement: { type: 'meals_logged', count: 500 }
  },
  
  // Streak Achievements
  {
    id: 'streak_30',
    name: 'Monthly Dedication',
    description: '30 day logging streak',
    icon: '🔥',
    xpReward: 500,
    requirement: { type: 'streak', days: 30 }
  },
  {
    id: 'streak_60',
    name: 'Two Month Hero',
    description: '60 day logging streak',
    icon: '💪',
    xpReward: 1000,
    requirement: { type: 'streak', days: 60 }
  },
  {
    id: 'streak_100',
    name: 'Centurion Streak',
    description: '100 day logging streak',
    icon: '🎖️',
    xpReward: 2000,
    requirement: { type: 'streak', days: 100 }
  },
  
  // Nutrition Goals
  {
    id: 'balanced_meal',
    name: 'Balanced Diet',
    description: 'Log a perfectly balanced meal',
    icon: '⚖️',
    xpReward: 150,
    requirement: { type: 'balanced_macros', count: 1 }
  },
  {
    id: 'protein_king',
    name: 'Protein King',
    description: 'Log a high-protein meal (40g+)',
    icon: '🥩',
    xpReward: 100,
    requirement: { type: 'high_protein', count: 1 }
  },
  {
    id: 'veggie_lover',
    name: 'Veggie Lover',
    description: 'Log 10 vegetable-rich meals',
    icon: '🥗',
    xpReward: 200,
    requirement: { type: 'veggie_meals', count: 10 }
  },
  {
    id: 'hydration_hero',
    name: 'Hydration Hero',
    description: 'Track water intake for 7 days',
    icon: '💧',
    xpReward: 150,
    requirement: { type: 'water_tracked', days: 7 }
  },
  
  // Social & Exploration
  {
    id: 'first_favourite',
    name: 'Found a Favourite',
    description: 'Save your first favourite meal',
    icon: '❤️',
    xpReward: 50,
    requirement: { type: 'favourites_saved', count: 1 }
  },
  {
    id: 'scanner_user',
    name: 'Scanner Pro',
    description: 'Use barcode scanner 10 times',
    icon: '📱',
    xpReward: 200,
    requirement: { type: 'scans_completed', count: 10 }
  },
  {
    id: 'explorer',
    name: 'Food Explorer',
    description: 'Log 20 different meal types',
    icon: '🌍',
    xpReward: 300,
    requirement: { type: 'unique_meals', count: 20 }
  },
  
  // Level Milestones
  {
    id: 'level_5',
    name: 'Rising Star',
    description: 'Reach level 5',
    icon: '🌟',
    xpReward: 0,
    requirement: { type: 'level', value: 5 }
  },
  {
    id: 'level_10',
    name: 'Nutrition Expert',
    description: 'Reach level 10',
    icon: '💎',
    xpReward: 0,
    requirement: { type: 'level', value: 10 }
  },
  {
    id: 'level_25',
    name: 'Health Guru',
    description: 'Reach level 25',
    icon: '🏅',
    xpReward: 0,
    requirement: { type: 'level', value: 25 }
  },
  {
    id: 'level_50',
    name: 'Nutrition Legend',
    description: 'Reach level 50',
    icon: '🎯',
    xpReward: 0,
    requirement: { type: 'level', value: 50 }
  },
  
  // Consistency
  {
    id: 'morning_person',
    name: 'Morning Person',
    description: 'Log breakfast 10 days in a row',
    icon: '🌅',
    xpReward: 150,
    requirement: { type: 'breakfast_streak', days: 10 }
  },
  {
    id: 'night_owl',
    name: 'Night Owl',
    description: 'Log dinner 10 days in a row',
    icon: '🌙',
    xpReward: 150,
    requirement: { type: 'dinner_streak', days: 10 }
  },
  {
    id: 'three_squares',
    name: 'Three Squares',
    description: 'Log 3 meals in one day',
    icon: '🍱',
    xpReward: 100,
    requirement: { type: 'meals_per_day', count: 3 }
  },
  
  // Special Achievements
  {
    id: 'perfectionist',
    name: 'Perfectionist',
    description: 'Complete all daily goals in one day',
    icon: '✨',
    xpReward: 300,
    requirement: { type: 'perfect_day', count: 1 }
  },
  {
    id: 'comeback',
    name: 'The Comeback',
    description: 'Log a meal after 30 days away',
    icon: '🎭',
    xpReward: 100,
    requirement: { type: 'return_after_break', days: 30 }
  },
  {
    id: 'early_bird',
    name: 'Early Bird',
    description: 'Log a meal before 7 AM',
    icon: '🐦',
    xpReward: 75,
    requirement: { type: 'early_log', hour: 7 }
  }
];

export default achievements;
