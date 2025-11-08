/**
 * Nutrio Premium Subscription Utility
 * Manages premium features and restrictions across the app
 */

export const PLANS = {
  BASIC: 'basic',
  PREMIUM: 'premium'
};

export const FEATURES = {
  UNLIMITED_FAVOURITES: 'unlimited_favourites',
  BARCODE_SCANNER: 'barcode_scanner',
  EXTENDED_HISTORY: 'extended_history',
  ADVANCED_ANALYTICS: 'advanced_analytics'
};

// Mock subscription state - in production, this would come from your backend/payment provider
let currentPlan = PLANS.BASIC;

export const setUserPlan = (plan) => {
  if (Object.values(PLANS).includes(plan)) {
    currentPlan = plan;
  }
};

export const getUserPlan = () => currentPlan;

export const isPremium = () => currentPlan === PLANS.PREMIUM;

export const hasFeature = (feature) => {
  if (!isPremium()) {
    // Basic plan restrictions
    switch (feature) {
      case FEATURES.UNLIMITED_FAVOURITES:
        return false; // Basic limited to 3 favourites
      case FEATURES.BARCODE_SCANNER:
        return false; // Premium only
      case FEATURES.EXTENDED_HISTORY:
        return false; // Basic limited to 1 week
      case FEATURES.ADVANCED_ANALYTICS:
        return false; // Premium only
      default:
        return false;
    }
  }
  return true; // Premium users have all features
};

// Specific limit checks
export const LIMITS = {
  BASIC_FAVOURITES: 3,
  BASIC_HISTORY_DAYS: 7,
  PREMIUM_HISTORY_DAYS: 180 // 6 months
};

export const getFavouritesLimit = () => {
  return isPremium() ? Infinity : LIMITS.BASIC_FAVOURITES;
};

export const getHistoryRetentionDays = () => {
  return isPremium() ? LIMITS.PREMIUM_HISTORY_DAYS : LIMITS.BASIC_HISTORY_DAYS;
};

export const canAddFavourite = (currentCount) => {
  const limit = getFavouritesLimit();
  return currentCount < limit;
};

export const getPlanName = () => {
  return isPremium() ? 'Premium' : 'Basic';
};

export const getPlanFeatures = (plan = currentPlan) => {
  const basicFeatures = [
    'Track meals and calories',
    'Basic nutritional analysis',
    'Up to 3 favourite meals',
    '7 days of history',
    'Achievement system'
  ];

  const premiumFeatures = [
    ...basicFeatures.slice(0, 2), // Keep first 2
    'Unlimited favourite meals',
    '6 months of history',
    'Barcode scanner',
    'Advanced analytics',
    'Achievement system',
    'Priority support'
  ];

  return plan === PLANS.PREMIUM ? premiumFeatures : basicFeatures;
};
