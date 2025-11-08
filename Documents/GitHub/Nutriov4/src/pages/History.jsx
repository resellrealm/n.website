import React, { useState, useEffect } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { deleteMeal } from '../store/mealsSlice';
import { getHistoryRetentionDays, isPremium } from '../utils/subscription';
import './History.css';

const History = () => {
  const dispatch = useDispatch();
  const meals = useSelector(state => state.meals);
  const [filter, setFilter] = useState('all'); // all, today, week, month
  const [filteredMeals, setFilteredMeals] = useState([]);
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(null);

  useEffect(() => {
    filterMeals();
  }, [meals.history, filter]);

  const filterMeals = () => {
    const now = new Date();
    let filtered = [...meals.history];

    switch (filter) {
      case 'today':
        filtered = filtered.filter(meal => {
          const mealDate = new Date(meal.date);
          return mealDate.toDateString() === now.toDateString();
        });
        break;
      case 'week':
        const weekAgo = new Date(now.getTime() - 7 * 24 * 60 * 60 * 1000);
        filtered = filtered.filter(meal => new Date(meal.date) >= weekAgo);
        break;
      case 'month':
        const monthAgo = new Date(now.getTime() - 30 * 24 * 60 * 60 * 1000);
        filtered = filtered.filter(meal => new Date(meal.date) >= monthAgo);
        break;
      default:
        // all - no filtering needed
        break;
    }

    setFilteredMeals(filtered);
  };

  const handleDelete = (id) => {
    setShowDeleteConfirm(id);
  };

  const confirmDelete = () => {
    if (showDeleteConfirm) {
      dispatch(deleteMeal(showDeleteConfirm));
      setShowDeleteConfirm(null);
    }
  };

  const formatDate = (dateString) => {
    const date = new Date(dateString);
    const today = new Date();
    const yesterday = new Date(today);
    yesterday.setDate(yesterday.getDate() - 1);

    if (date.toDateString() === today.toDateString()) {
      return 'Today';
    } else if (date.toDateString() === yesterday.toDateString()) {
      return 'Yesterday';
    } else {
      return date.toLocaleDateString('en-US', { 
        month: 'short', 
        day: 'numeric',
        year: date.getFullYear() !== today.getFullYear() ? 'numeric' : undefined
      });
    }
  };

  const groupByDate = () => {
    const grouped = {};
    filteredMeals.forEach(meal => {
      const dateKey = new Date(meal.date).toDateString();
      if (!grouped[dateKey]) {
        grouped[dateKey] = [];
      }
      grouped[dateKey].push(meal);
    });
    return grouped;
  };

  const groupedMeals = groupByDate();
  const retentionDays = getHistoryRetentionDays();

  return (
    <div className="history">
      <div className="history-header">
        <div>
          <h2 className="text-3xl font-bold text-gray-800 dark:text-white mb-2">Meal History</h2>
          <p className="text-gray-600 dark:text-gray-400">
            {isPremium() 
              ? '6 months of history available' 
              : '7 days of history available - Upgrade for 6 months'}
          </p>
        </div>
        {!isPremium() && (
          <div className="retention-badge">
            ⏰ {retentionDays} days
          </div>
        )}
      </div>

      {/* Filter Tabs */}
      <div className="filter-tabs">
        <button 
          className={`filter-tab ${filter === 'all' ? 'active' : ''}`}
          onClick={() => setFilter('all')}
        >
          All
        </button>
        <button 
          className={`filter-tab ${filter === 'today' ? 'active' : ''}`}
          onClick={() => setFilter('today')}
        >
          Today
        </button>
        <button 
          className={`filter-tab ${filter === 'week' ? 'active' : ''}`}
          onClick={() => setFilter('week')}
        >
          This Week
        </button>
        <button 
          className={`filter-tab ${filter === 'month' ? 'active' : ''}`}
          onClick={() => setFilter('month')}
        >
          This Month
        </button>
      </div>

      {/* Meals List */}
      {filteredMeals.length === 0 ? (
        <div className="empty-state card">
          <div className="empty-icon">📜</div>
          <h3>No meals found</h3>
          <p>Start logging meals to see your history</p>
        </div>
      ) : (
        <div className="meals-timeline">
          {Object.keys(groupedMeals).sort((a, b) => new Date(b) - new Date(a)).map(dateKey => (
            <div key={dateKey} className="date-group">
              <div className="date-header">
                <h3 className="date-title">{formatDate(dateKey)}</h3>
                <span className="meal-count">{groupedMeals[dateKey].length} meals</span>
              </div>
              
              <div className="meals-list">
                {groupedMeals[dateKey].sort((a, b) => new Date(b.date) - new Date(a.date)).map(meal => (
                  <div key={meal.id} className="meal-card card">
                    <div className="meal-main">
                      <div className="meal-info">
                        <h4 className="meal-name">{meal.name}</h4>
                        <p className="meal-time">
                          {new Date(meal.date).toLocaleTimeString('en-US', { 
                            hour: 'numeric', 
                            minute: '2-digit' 
                          })}
                        </p>
                      </div>
                      <button 
                        className="delete-btn btn-danger"
                        onClick={() => handleDelete(meal.id)}
                      >
                        🗑️
                      </button>
                    </div>
                    
                    <div className="meal-macros">
                      <div className="macro-item">
                        <span className="macro-label">Calories</span>
                        <span className="macro-value">{Math.round(meal.calories)}</span>
                      </div>
                      <div className="macro-item">
                        <span className="macro-label">Protein</span>
                        <span className="macro-value">{Math.round(meal.protein)}g</span>
                      </div>
                      <div className="macro-item">
                        <span className="macro-label">Carbs</span>
                        <span className="macro-value">{Math.round(meal.carbs)}g</span>
                      </div>
                      <div className="macro-item">
                        <span className="macro-label">Fat</span>
                        <span className="macro-value">{Math.round(meal.fat)}g</span>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Delete Confirmation Modal */}
      {showDeleteConfirm && (
        <div className="modal-overlay" onClick={() => setShowDeleteConfirm(null)}>
          <div className="modal-content" onClick={(e) => e.stopPropagation()}>
            <h3 className="modal-title">Delete Meal?</h3>
            <p className="modal-text">
              Are you sure you want to delete this meal from your history? This action cannot be undone.
            </p>
            <div className="modal-actions">
              <button className="btn-secondary" onClick={() => setShowDeleteConfirm(null)}>
                Cancel
              </button>
              <button className="btn-danger" onClick={confirmDelete}>
                Delete
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default History;
