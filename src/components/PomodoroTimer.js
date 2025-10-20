import React, { useState, useEffect, useRef } from 'react';
import './PomodoroTimer.css';

const PomodoroTimer = () => {
  const [minutes, setMinutes] = useState(25);
  const [seconds, setSeconds] = useState(0);
  const [isActive, setIsActive] = useState(false);
  const [mode, setMode] = useState('work'); // work, break
  const intervalRef = useRef(null);

  useEffect(() => {
    if (isActive) {
      intervalRef.current = setInterval(() => {
        if (seconds === 0) {
          if (minutes === 0) {
            // Timer completed
            setIsActive(false);
            if (mode === 'work') {
              setMode('break');
              setMinutes(5);
            } else {
              setMode('work');
              setMinutes(25);
            }
          } else {
            setMinutes(minutes - 1);
            setSeconds(59);
          }
        } else {
          setSeconds(seconds - 1);
        }
      }, 1000);
    } else {
      clearInterval(intervalRef.current);
    }

    return () => clearInterval(intervalRef.current);
  }, [isActive, minutes, seconds, mode]);

  const toggleTimer = () => {
    setIsActive(!isActive);
  };

  const resetTimer = () => {
    setIsActive(false);
    setMode('work');
    setMinutes(25);
    setSeconds(0);
  };

  const progress = mode === 'work' 
    ? ((25 * 60 - (minutes * 60 + seconds)) / (25 * 60)) * 100
    : ((5 * 60 - (minutes * 60 + seconds)) / (5 * 60)) * 100;

  return (
    <div className="pomodoro-container">
      <div className="pomodoro-header">
        <span className="pomodoro-icon">🍅</span>
        <span className="pomodoro-mode">{mode === 'work' ? 'Focus Time' : 'Break Time'}</span>
      </div>
      
      <div className="pomodoro-timer">
        <svg className="pomodoro-progress" viewBox="0 0 120 120">
          <circle
            className="pomodoro-progress-bg"
            cx="60"
            cy="60"
            r="54"
          />
          <circle
            className="pomodoro-progress-fill"
            cx="60"
            cy="60"
            r="54"
            style={{
              strokeDasharray: `${2 * Math.PI * 54}`,
              strokeDashoffset: `${2 * Math.PI * 54 * (1 - progress / 100)}`,
            }}
          />
        </svg>
        
        <div className="pomodoro-time">
          {String(minutes).padStart(2, '0')}:{String(seconds).padStart(2, '0')}
        </div>
      </div>
      
      <div className="pomodoro-controls">
        <button className="pomodoro-btn" onClick={toggleTimer}>
          {isActive ? '⏸' : '▶'}
        </button>
        <button className="pomodoro-btn" onClick={resetTimer}>
          ↻
        </button>
      </div>
    </div>
  );
};

export default PomodoroTimer;
