import React, { useEffect, useState } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import { getXpForLevel } from '../store/achievementsSlice';
import { clearOldHistory } from '../store/mealsSlice';
import './Dashboard.css';

const motivationalQuotes = [
  "Every meal is a new beginning.",
  "Small changes lead to big results.",
  "Your body is a reflection of your lifestyle.",
  "Progress, not perfection.",
  "Nourish your body, feed your soul.",
  "Health is wealth.",
  "You are what you eat.",
  "Start where you are, use what you have.",
  "The only bad workout is the one that didn't happen.",
  "Your health is an investment, not an expense.",
  "Take care of your body, it's the only place you have to live.",
  "Eat well, live well, be well.",
  "Consistency is key to success.",
  "One day at a time, one meal at a time.",
  "Your future self will thank you."
];

const Dashboard = () => {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const meals = useSelector(state => state.meals);
  const user = useSelector(state => state.user);
  const achievements = useSelector(state => state.achievements);
  
  const [quote, setQuote] = useState('');
  const [todayMeals, setTodayMeals] = useState([]);
  const [todayTotals, setTodayTotals] = useState({
    calories: 0,
    protein: 0,
    carbs: 0,
    fat: 0
  });

  useEffect(() => {
    // Set random quote on mount
    const randomQuote = motivationalQuotes[Math.floor(Math.random() * motivationalQuotes.length)];
    setQuote(randomQuote);
    
    // Clear old history based on retention period
    dispatch(clearOldHistory());
  }, [dispatch]);

  useEffect(() => {
    // Calculate today's meals and totals
    const today = new Date().toDateString();
    const mealsToday = meals.history.filter(meal => 
      new Date(meal.date).toDateString() === today
    );
    
    setTodayMeals(mealsToday);
    
    const totals = mealsToday.reduce((acc, meal) => ({
      calories: acc.calories + (meal.calories || 0),
      protein: acc.protein + (meal.protein || 0),
      carbs: acc.carbs + (meal.carbs || 0),
      fat: acc.fat + (meal.fat || 0)
    }), { calories: 0, protein: 0, carbs: 0, fat: 0 });
    
    setTodayTotals(totals);
  }, [meals.history]);

  const xpNeeded = getXpForLevel(achievements.level);
  const xpProgress = (achievements.xp / xpNeeded) * 100;
  
  const caloriesProgress = (todayTotals.calories / meals.dailyGoals.calories) * 100;
  const proteinProgress = (todayTotals.protein / meals.dailyGoals.protein) * 100;

  return (
    <div className="dashboard">
      {/* Motivational Quote - Only on Dashboard */}
      <div className="quote-card glass fade-in">
        <div className="quote-icon">✨</div>
        <p className="quote-text">"{quote}"</p>
      </div>

      {/* Welcome Section */}
      <div className="welcome-section">
        <h2 className="welcome-title">Welcome back, {user.name}!</h2>
        <p className="welcome-subtitle">Let's track your nutrition today</p>
      </div>

      {/* Level Progress */}
      <div className="card fade-in">
        <div className="level-header">
          <div>
            <h3 className="card-title">Level {achievements.level}</h3>
            <p className="card-subtitle">{achievements.xp} / {xpNeeded} XP</p>
          </div>
          <div className="level-icon">🏆</div>
        </div>
        <div className="progress-bar">
          <div 
            className="progress-fill" 
            style={{ width: `${Math.min(xpProgress, 100)}%` }}
          />
        </div>
      </div>

      {/* Today's Progress */}
      <div className="card fade-in">
        <h3 className="card-title">Today's Progress</h3>
        <p className="card-subtitle">{todayMeals.length} meals logged</p>
        
        <div className="progress-section">
          <div className="progress-item">
            <div className="progress-label">
              <span>Calories</span>
              <span className="progress-value">
                {Math.round(todayTotals.calories)} / {meals.dailyGoals.calories}
              </span>
            </div>
            <div className="progress-bar">
              <div 
                className="progress-fill" 
                style={{ width: `${Math.min(caloriesProgress, 100)}%` }}
              />
            </div>
          </div>
          
          <div className="progress-item">
            <div className="progress-label">
              <span>Protein</span>
              <span className="progress-value">
                {Math.round(todayTotals.protein)}g / {meals.dailyGoals.protein}g
              </span>
            </div>
            <div className="progress-bar">
              <div 
                className="progress-fill" 
                style={{ width: `${Math.min(proteinProgress, 100)}%` }}
              />
            </div>
          </div>
        </div>
      </div>

      {/* Quick Actions */}
      <div className="quick-actions">
        <button 
          className="action-btn btn-primary"
          onClick={() => navigate('/analyze')}
        >
          <span className="action-icon">🔍</span>
          <span>Analyze Meal</span>
        </button>
        
        <button 
          className="action-btn btn-secondary"
          onClick={() => navigate('/history')}
        >
          <span className="action-icon">📜</span>
          <span>View History</span>
        </button>
      </div>

      {/* Recent Meals */}
      {todayMeals.length > 0 && (
        <div className="card fade-in">
          <h3 className="card-title">Recent Meals</h3>
          <div className="meals-list">
            {todayMeals.slice(0, 3).map(meal => (
              <div key={meal.id} className="meal-item">
                <div>
                  <p className="meal-name">{meal.name}</p>
                  <p className="meal-info">{meal.calories} cal • {meal.protein}g protein</p>
                </div>
                <span className="meal-time">
                  {new Date(meal.date).toLocaleTimeString('en-US', { 
                    hour: 'numeric', 
                    minute: '2-digit' 
                  })}
                </span>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Stats Overview */}
      <div className="stats-grid">
        <div className="stat-card card">
          <div className="stat-icon">🔥</div>
          <div className="stat-value">{user.stats.currentStreak}</div>
          <div className="stat-label">Day Streak</div>
        </div>
        
        <div className="stat-card card">
          <div className="stat-icon">🍽️</div>
          <div className="stat-value">{user.stats.totalMeals}</div>
          <div className="stat-label">Total Meals</div>
        </div>
        
        <div className="stat-card card">
          <div className="stat-icon">⭐</div>
          <div className="stat-value">{achievements.unlockedAchievements.length}</div>
          <div className="stat-label">Achievements</div>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
