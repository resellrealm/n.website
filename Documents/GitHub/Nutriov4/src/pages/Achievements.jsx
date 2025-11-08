import React, { useState } from 'react';
import { useSelector } from 'react-redux';
import { getXpForLevel } from '../store/achievementsSlice';
import './Achievements.css';

const Achievements = () => {
  const achievements = useSelector(state => state.achievements);
  const user = useSelector(state => state.user);
  const [filter, setFilter] = useState('all'); // all, unlocked, locked

  const getFilteredAchievements = () => {
    switch (filter) {
      case 'unlocked':
        return achievements.allAchievements.filter(a => 
          achievements.unlockedAchievements.includes(a.id)
        );
      case 'locked':
        return achievements.allAchievements.filter(a => 
          !achievements.unlockedAchievements.includes(a.id)
        );
      default:
        return achievements.allAchievements;
    }
  };

  const filteredAchievements = getFilteredAchievements();
  const unlockedCount = achievements.unlockedAchievements.length;
  const totalCount = achievements.allAchievements.length;
  const completionPercent = (unlockedCount / totalCount) * 100;
  
  const xpNeeded = getXpForLevel(achievements.level);
  const xpProgress = (achievements.xp / xpNeeded) * 100;

  return (
    <div className="achievements-page">
      <h2 className="text-3xl font-bold text-gray-800 dark:text-white mb-2">Achievements</h2>
      <p className="text-gray-600 dark:text-gray-400 mb-6">Track your progress and earn rewards</p>

      {/* Progress Overview */}
      <div className="progress-cards">
        <div className="progress-card card">
          <h3 className="progress-title">Level Progress</h3>
          <div className="level-display">
            <div className="level-number">{achievements.level}</div>
            <div className="level-info">
              <p className="level-label">Current Level</p>
              <p className="xp-text">{achievements.xp} / {xpNeeded} XP</p>
            </div>
          </div>
          <div className="progress-bar">
            <div 
              className="progress-fill" 
              style={{ width: `${Math.min(xpProgress, 100)}%` }}
            />
          </div>
        </div>

        <div className="progress-card card">
          <h3 className="progress-title">Achievement Progress</h3>
          <div className="achievement-stats">
            <div className="stat-large">
              <span className="stat-number">{unlockedCount}</span>
              <span className="stat-divider">/</span>
              <span className="stat-total">{totalCount}</span>
            </div>
            <p className="stat-label">Achievements Unlocked</p>
          </div>
          <div className="progress-bar">
            <div 
              className="progress-fill" 
              style={{ width: `${completionPercent}%` }}
            />
          </div>
        </div>
      </div>

      {/* Filter Tabs */}
      <div className="filter-tabs">
        <button 
          className={`filter-tab ${filter === 'all' ? 'active' : ''}`}
          onClick={() => setFilter('all')}
        >
          All ({totalCount})
        </button>
        <button 
          className={`filter-tab ${filter === 'unlocked' ? 'active' : ''}`}
          onClick={() => setFilter('unlocked')}
        >
          Unlocked ({unlockedCount})
        </button>
        <button 
          className={`filter-tab ${filter === 'locked' ? 'active' : ''}`}
          onClick={() => setFilter('locked')}
        >
          Locked ({totalCount - unlockedCount})
        </button>
      </div>

      {/* Achievements Grid */}
      <div className="achievements-grid">
        {filteredAchievements.map(achievement => {
          const isUnlocked = achievements.unlockedAchievements.includes(achievement.id);
          
          return (
            <div 
              key={achievement.id} 
              className={`achievement-card card ${isUnlocked ? 'unlocked' : 'locked'}`}
            >
              <div className="achievement-icon">
                {achievement.icon}
              </div>
              <div className="achievement-content">
                <h4 className="achievement-name">{achievement.name}</h4>
                <p className="achievement-desc">{achievement.description}</p>
                {achievement.xpReward > 0 && (
                  <p className="achievement-reward">
                    +{achievement.xpReward} XP
                  </p>
                )}
              </div>
              {isUnlocked && (
                <div className="unlocked-badge">
                  ✓
                </div>
              )}
            </div>
          );
        })}
      </div>

      {filteredAchievements.length === 0 && (
        <div className="empty-state card">
          <div className="empty-icon">🏆</div>
          <h3>No achievements found</h3>
          <p>Try a different filter</p>
        </div>
      )}
    </div>
  );
};

export default Achievements;
