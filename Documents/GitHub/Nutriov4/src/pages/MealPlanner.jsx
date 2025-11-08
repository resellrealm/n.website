import React from 'react';
import { useNavigate } from 'react-router-dom';
import { ChefHat, Lock, Star } from 'lucide-react';

const MealPlanner = () => {
  const navigate = useNavigate();
  const isPremium = localStorage.getItem('userPlan') === 'premium';

  if (!isPremium) {
    return (
      <div className="flex items-center justify-center min-h-[60vh]">
        <div className="text-center max-w-md">
          <div className="w-24 h-24 mx-auto mb-6 bg-gradient-to-br from-purple-500 to-purple-600 rounded-full flex items-center justify-center relative">
            <ChefHat size={48} className="text-white" />
            <div className="absolute -bottom-2 -right-2 w-12 h-12 bg-orange-500 rounded-full flex items-center justify-center">
              <Lock size={24} className="text-white" />
            </div>
          </div>
          
          <h2 className="text-3xl font-bold text-gray-800 dark:text-white mb-4">
            Meal Planner
          </h2>
          
          <p className="text-gray-600 dark:text-gray-400 mb-6">
            Plan your meals for the week, get recipe suggestions, and organize your nutrition goals with our Premium Meal Planner.
          </p>

          <div className="bg-gradient-to-r from-orange-50 to-yellow-50 dark:from-orange-900/20 dark:to-yellow-900/20 rounded-xl p-6 mb-6">
            <div className="flex items-center justify-center mb-4">
              <Star className="text-orange-500 mr-2" size={24} />
              <span className="text-lg font-semibold text-gray-800 dark:text-white">Premium Feature</span>
            </div>
            <ul className="text-left space-y-2 text-sm text-gray-700 dark:text-gray-300">
              <li className="flex items-start">
                <span className="text-green-500 mr-2">✓</span>
                <span>Weekly meal planning calendar</span>
              </li>
              <li className="flex items-start">
                <span className="text-green-500 mr-2">✓</span>
                <span>AI-powered recipe suggestions</span>
              </li>
              <li className="flex items-start">
                <span className="text-green-500 mr-2">✓</span>
                <span>Automated shopping lists</span>
              </li>
              <li className="flex items-start">
                <span className="text-green-500 mr-2">✓</span>
                <span>Macro planning and balancing</span>
              </li>
            </ul>
          </div>

          <button
            onClick={() => navigate('/account')}
            className="w-full bg-gradient-to-r from-orange-500 to-orange-600 text-white px-8 py-4 rounded-xl font-semibold text-lg hover:shadow-lg transition-all duration-200"
          >
            Upgrade to Premium - £7.99/month
          </button>

          <button
            onClick={() => navigate('/')}
            className="w-full mt-3 text-gray-600 dark:text-gray-400 hover:text-gray-800 dark:hover:text-gray-200 transition"
          >
            ← Back to Dashboard
          </button>
        </div>
      </div>
    );
  }

  // If premium, show actual meal planner (to be implemented)
  return (
    <div className="max-w-6xl mx-auto">
      <h1 className="text-3xl font-bold text-gray-800 dark:text-white mb-6">
        <ChefHat className="inline mr-3" size={32} />
        Meal Planner
      </h1>
      <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-card p-8 text-center">
        <p className="text-gray-600 dark:text-gray-400">
          Meal planning features coming soon! You have Premium access.
        </p>
      </div>
    </div>
  );
};

export default MealPlanner;
