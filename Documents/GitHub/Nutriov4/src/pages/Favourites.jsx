import React, { useState } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import { removeFavourite, addMeal } from '../store/mealsSlice';
import { addXp } from '../store/achievementsSlice';
import { incrementMealCount } from '../store/userSlice';
import { canAddFavourite, getFavouritesLimit, isPremium } from '../utils/subscription';
import './Favourites.css';

const Favourites = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const favourites = useSelector(state => state.meals.favourites);
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(null);
  const [showLimitModal, setShowLimitModal] = useState(false);

  const handleDelete = (id) => {
    setShowDeleteConfirm(id);
  };

  const confirmDelete = () => {
    if (showDeleteConfirm) {
      dispatch(removeFavourite(showDeleteConfirm));
      setShowDeleteConfirm(null);
    }
  };

  const handleQuickLog = (favourite) => {
    const meal = {
      name: favourite.name,
      calories: favourite.calories,
      protein: favourite.protein,
      carbs: favourite.carbs,
      fat: favourite.fat
    };

    dispatch(addMeal(meal));
    dispatch(incrementMealCount());
    dispatch(addXp(10));
    
    alert('Meal logged successfully! +10 XP');
  };

  const limit = getFavouritesLimit();
  const canAdd = canAddFavourite(favourites.length);

  return (
    <div className="favourites">
      <div className="favourites-header">
        <div>
          <h2 className="text-3xl font-bold text-gray-800 dark:text-white mb-2">Favourite Meals</h2>
          <p className="text-gray-600 dark:text-gray-400">
            {isPremium() 
              ? 'Unlimited favourites available' 
              : `${favourites.length} / ${limit} favourites used`}
          </p>
        </div>
        {!canAdd && (
          <button 
            className="upgrade-btn btn-primary"
            onClick={() => setShowLimitModal(true)}
          >
            ⭐ Upgrade
          </button>
        )}
      </div>

      {/* Limit Warning */}
      {!isPremium() && favourites.length >= limit && (
        <div className="limit-warning card">
          <div className="warning-icon">⚠️</div>
          <div>
            <h4>Favourite limit reached</h4>
            <p>Upgrade to Premium for unlimited favourite meals</p>
          </div>
        </div>
      )}

      {/* Favourites List */}
      {favourites.length === 0 ? (
        <div className="empty-state card">
          <div className="empty-icon">❤️</div>
          <h3>No favourites yet</h3>
          <p>Save your frequently eaten meals for quick logging</p>
          <button 
            className="btn-primary"
            onClick={() => navigate('/analyze')}
          >
            Add Your First Favourite
          </button>
        </div>
      ) : (
        <div className="favourites-grid">
          {favourites.map(favourite => (
            <div key={favourite.id} className="favourite-card card">
              <div className="favourite-header">
                <h3 className="favourite-name">{favourite.name}</h3>
                <button 
                  className="delete-btn-icon"
                  onClick={() => handleDelete(favourite.id)}
                  aria-label="Delete favourite"
                >
                  🗑️
                </button>
              </div>

              <div className="favourite-macros">
                <div className="macro-badge">
                  <span className="macro-icon">🔥</span>
                  <span className="macro-text">{Math.round(favourite.calories)} cal</span>
                </div>
                <div className="macro-badge">
                  <span className="macro-icon">💪</span>
                  <span className="macro-text">{Math.round(favourite.protein)}g protein</span>
                </div>
              </div>

              <div className="favourite-details">
                <div className="detail-item">
                  <span className="detail-label">Carbs</span>
                  <span className="detail-value">{Math.round(favourite.carbs)}g</span>
                </div>
                <div className="detail-item">
                  <span className="detail-label">Fat</span>
                  <span className="detail-value">{Math.round(favourite.fat)}g</span>
                </div>
              </div>

              <button 
                className="quick-log-btn btn-primary"
                onClick={() => handleQuickLog(favourite)}
              >
                ⚡ Quick Log
              </button>
            </div>
          ))}
        </div>
      )}

      {/* Delete Confirmation Modal */}
      {showDeleteConfirm && (
        <div className="modal-overlay" onClick={() => setShowDeleteConfirm(null)}>
          <div className="modal-content" onClick={(e) => e.stopPropagation()}>
            <h3 className="modal-title">Remove Favourite?</h3>
            <p className="modal-text">
              Are you sure you want to remove this meal from your favourites?
            </p>
            <div className="modal-actions">
              <button className="btn-secondary" onClick={() => setShowDeleteConfirm(null)}>
                Cancel
              </button>
              <button className="btn-danger" onClick={confirmDelete}>
                Remove
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Limit Modal */}
      {showLimitModal && (
        <div className="modal-overlay" onClick={() => setShowLimitModal(false)}>
          <div className="modal-content" onClick={(e) => e.stopPropagation()}>
            <h3 className="modal-title">⭐ Upgrade to Premium</h3>
            <p className="modal-text">
              You've reached the 3 favourite meal limit on the Basic plan.
            </p>
            <ul className="modal-list">
              <li>❤️ Unlimited favourite meals</li>
              <li>📱 Barcode scanner</li>
              <li>📊 6 months of history</li>
              <li>📈 Advanced analytics</li>
            </ul>
            <div className="modal-actions">
              <button className="btn-secondary" onClick={() => setShowLimitModal(false)}>
                Close
              </button>
              <button className="btn-primary" onClick={() => {
                setShowLimitModal(false);
                navigate('/account');
              }}>
                View Plans
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default Favourites;
