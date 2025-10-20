import React, { useState, useEffect } from 'react';
import './FitnessTracker.css';

const FitnessTracker = () => {
  const [stats, setStats] = useState({
    steps: 6847,
    calories: 342,
    heartRate: 72,
    distance: 5.2,
  });

  const goals = {
    steps: 10000,
    calories: 500,
    distance: 8,
  };

  useEffect(() => {
    // Simulate fitness data updates
    const interval = setInterval(() => {
      setStats(prev => ({
        steps: Math.min(prev.steps + Math.floor(Math.random() * 50), goals.steps),
        calories: Math.min(prev.calories + Math.floor(Math.random() * 5), goals.calories),
        heartRate: 65 + Math.floor(Math.random() * 20),
        distance: Math.min(prev.distance + Math.random() * 0.1, goals.distance),
      }));
    }, 3000);

    return () => clearInterval(interval);
  }, []);

  const getProgress = (current, goal) => (current / goal) * 100;

  return (
    <div className="fitness-container">
      <div className="fitness-header">
        <span className="fitness-icon">💪</span>
        <span className="fitness-title">Fitness Tracker</span>
      </div>

      <div className="fitness-stats">
        <div className="fitness-stat">
          <div className="stat-ring">
            <svg viewBox="0 0 36 36" className="circular-chart">
              <path
                className="circle-bg"
                d="M18 2.0845
                  a 15.9155 15.9155 0 0 1 0 31.831
                  a 15.9155 15.9155 0 0 1 0 -31.831"
              />
              <path
                className="circle steps"
                strokeDasharray={`${getProgress(stats.steps, goals.steps)}, 100`}
                d="M18 2.0845
                  a 15.9155 15.9155 0 0 1 0 31.831
                  a 15.9155 15.9155 0 0 1 0 -31.831"
              />
            </svg>
            <div className="stat-value">{stats.steps.toLocaleString()}</div>
          </div>
          <div className="stat-label">Steps</div>
          <div className="stat-goal">{goals.steps.toLocaleString()} goal</div>
        </div>

        <div className="fitness-stat">
          <div className="stat-ring">
            <svg viewBox="0 0 36 36" className="circular-chart">
              <path
                className="circle-bg"
                d="M18 2.0845
                  a 15.9155 15.9155 0 0 1 0 31.831
                  a 15.9155 15.9155 0 0 1 0 -31.831"
              />
              <path
                className="circle calories"
                strokeDasharray={`${getProgress(stats.calories, goals.calories)}, 100`}
                d="M18 2.0845
                  a 15.9155 15.9155 0 0 1 0 31.831
                  a 15.9155 15.9155 0 0 1 0 -31.831"
              />
            </svg>
            <div className="stat-value">{stats.calories}</div>
          </div>
          <div className="stat-label">Calories</div>
          <div className="stat-goal">{goals.calories} goal</div>
        </div>
      </div>

      <div className="fitness-extras">
        <div className="extra-stat">
          <span className="extra-icon">❤️</span>
          <span className="extra-value">{stats.heartRate} bpm</span>
        </div>
        <div className="extra-stat">
          <span className="extra-icon">📍</span>
          <span className="extra-value">{stats.distance.toFixed(1)} km</span>
        </div>
      </div>
    </div>
  );
};

export default FitnessTracker;
