import React, { useState } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { setUserName, setUserPlan, updatePreferences } from '../store/userSlice';
import { setUserPlan as setSubscriptionPlan, PLANS, getPlanFeatures, isPremium } from '../utils/subscription';
import './Account.css';

const Account = () => {
  const dispatch = useDispatch();
  const user = useSelector(state => state.user);
  const achievements = useSelector(state => state.achievements);
  
  const [isEditing, setIsEditing] = useState(false);
  const [editedName, setEditedName] = useState(user.name);
  const [showUpgradeModal, setShowUpgradeModal] = useState(false);

  const handleSaveName = () => {
    if (editedName.trim()) {
      dispatch(setUserName(editedName.trim()));
      setIsEditing(false);
    }
  };

  const handlePlanChange = (plan) => {
    dispatch(setUserPlan(plan));
    setSubscriptionPlan(plan);
    
    if (plan === PLANS.PREMIUM) {
      alert('🎉 Welcome to Nutrio Premium!');
    } else {
      alert('Switched to Basic plan');
    }
  };

  const handleDarkModeToggle = (enabled) => {
    dispatch(updatePreferences({ darkMode: enabled }));
    if (enabled) {
      document.documentElement.classList.add('dark');
    } else {
      document.documentElement.classList.remove('dark');
    }
  };

  const currentPlanFeatures = getPlanFeatures(user.plan);
  const premiumFeatures = getPlanFeatures(PLANS.PREMIUM);

  return (
    <div className="account-page">
      <h2 className="text-3xl font-bold text-gray-800 dark:text-white mb-2">Account</h2>
      <p className="text-gray-600 dark:text-gray-400 mb-6">Manage your profile and subscription</p>

      {/* Profile Card */}
      <div className="card profile-card">
        <div className="profile-header">
          <div className="profile-avatar">
            {user.name.charAt(0).toUpperCase()}
          </div>
          <div className="profile-info">
            {isEditing ? (
              <div className="name-edit">
                <input
                  type="text"
                  value={editedName}
                  onChange={(e) => setEditedName(e.target.value)}
                  className="name-input"
                  autoFocus
                />
                <div className="edit-actions">
                  <button className="btn-secondary" onClick={() => setIsEditing(false)}>
                    Cancel
                  </button>
                  <button className="btn-primary" onClick={handleSaveName}>
                    Save
                  </button>
                </div>
              </div>
            ) : (
              <>
                <h3 className="profile-name">{user.name}</h3>
                <button className="edit-btn" onClick={() => setIsEditing(true)}>
                  ✏️ Edit
                </button>
              </>
            )}
            <div className="profile-stats">
              <span className="stat-badge">Level {achievements.level}</span>
              <span className="stat-badge">{user.plan === PLANS.PREMIUM ? '⭐ Premium' : 'Basic'}</span>
            </div>
          </div>
        </div>
      </div>

      {/* Current Plan Card */}
      <div className="card plan-card">
        <div className="plan-header">
          <h3 className="card-title">Current Plan</h3>
          {user.plan === PLANS.BASIC && (
            <button 
              className="upgrade-btn-small"
              onClick={() => setShowUpgradeModal(true)}
            >
              ⭐ Upgrade
            </button>
          )}
        </div>
        
        <div className="current-plan">
          <div className="plan-badge">
            {user.plan === PLANS.PREMIUM ? '⭐ Premium' : '📦 Basic'}
          </div>
          <h4 className="plan-name">
            {user.plan === PLANS.PREMIUM ? 'Premium Plan' : 'Basic Plan'}
          </h4>
          <p className="plan-price">
            {user.plan === PLANS.PREMIUM ? '£7.99/month' : 'Free'}
          </p>
        </div>

        <div className="features-list">
          <h4 className="features-title">Included Features:</h4>
          {currentPlanFeatures.map((feature, index) => (
            <div key={index} className="feature-item">
              <span className="feature-check">✓</span>
              <span>{feature}</span>
            </div>
          ))}
        </div>

        {user.plan === PLANS.PREMIUM && (
          <button 
            className="downgrade-btn"
            onClick={() => handlePlanChange(PLANS.BASIC)}
          >
            Switch to Basic Plan
          </button>
        )}
      </div>

      {/* Stats Overview */}
      <div className="card stats-card">
        <h3 className="card-title">Your Statistics</h3>
        <div className="stats-grid">
          <div className="stat-item">
            <div className="stat-icon">🍽️</div>
            <div className="stat-content">
              <div className="stat-value">{user.stats.totalMeals}</div>
              <div className="stat-label">Total Meals</div>
            </div>
          </div>
          
          <div className="stat-item">
            <div className="stat-icon">🔥</div>
            <div className="stat-content">
              <div className="stat-value">{user.stats.currentStreak}</div>
              <div className="stat-label">Day Streak</div>
            </div>
          </div>
          
          <div className="stat-item">
            <div className="stat-icon">🏆</div>
            <div className="stat-content">
              <div className="stat-value">{achievements.unlockedAchievements.length}</div>
              <div className="stat-label">Achievements</div>
            </div>
          </div>
          
          <div className="stat-item">
            <div className="stat-icon">📊</div>
            <div className="stat-content">
              <div className="stat-value">{achievements.level}</div>
              <div className="stat-label">Level</div>
            </div>
          </div>
        </div>
      </div>

      {/* Preferences */}
      <div className="card preferences-card">
        <h3 className="card-title">Preferences</h3>
        
        <div className="preference-item">
          <div>
            <h4 className="preference-name">Dark Mode</h4>
            <p className="preference-desc">Use dark theme throughout the app</p>
          </div>
          <label className="toggle">
            <input 
              type="checkbox" 
              checked={user.preferences.darkMode}
              onChange={(e) => handleDarkModeToggle(e.target.checked)}
            />
            <span className="toggle-slider"></span>
          </label>
        </div>

        <div className="preference-item">
          <div>
            <h4 className="preference-name">Notifications</h4>
            <p className="preference-desc">Receive reminders and updates</p>
          </div>
          <label className="toggle">
            <input 
              type="checkbox" 
              checked={user.preferences.notifications}
              onChange={(e) => dispatch(updatePreferences({ notifications: e.target.checked }))}
            />
            <span className="toggle-slider"></span>
          </label>
        </div>
      </div>

      {/* Upgrade Modal */}
      {showUpgradeModal && (
        <div className="modal-overlay" onClick={() => setShowUpgradeModal(false)}>
          <div className="modal-content upgrade-modal" onClick={(e) => e.stopPropagation()}>
            <h3 className="modal-title">⭐ Upgrade to Premium</h3>
            <p className="modal-subtitle">Unlock all features and take your nutrition tracking to the next level</p>
            
            <div className="pricing-box">
              <div className="price-badge">£7.99</div>
              <div className="price-period">per month</div>
            </div>

            <div className="premium-features">
              {premiumFeatures.map((feature, index) => (
                <div key={index} className="premium-feature">
                  <span className="feature-check-premium">✓</span>
                  <span>{feature}</span>
                </div>
              ))}
            </div>

            <div className="modal-actions">
              <button className="btn-secondary" onClick={() => setShowUpgradeModal(false)}>
                Maybe Later
              </button>
              <button 
                className="btn-primary premium-btn" 
                onClick={() => {
                  handlePlanChange(PLANS.PREMIUM);
                  setShowUpgradeModal(false);
                }}
              >
                Upgrade Now
              </button>
            </div>
            
            <p className="modal-disclaimer">
              This is a demo. No actual payment will be processed.
            </p>
          </div>
        </div>
      )}
    </div>
  );
};

export default Account;
