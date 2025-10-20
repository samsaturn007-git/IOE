import React, { useState, useEffect } from 'react';
import './Countdown.css';

const Countdown = () => {
  const [events] = useState([
    { name: 'Project Deadline', date: new Date('2025-10-25T23:59:59') },
    { name: 'Weekend', date: new Date('2025-10-25T00:00:00') },
  ]);

  const [timeLeft, setTimeLeft] = useState({});

  useEffect(() => {
    const timer = setInterval(() => {
      const now = new Date();
      const newTimeLeft = {};

      events.forEach((event) => {
        const difference = event.date - now;
        
        if (difference > 0) {
          newTimeLeft[event.name] = {
            days: Math.floor(difference / (1000 * 60 * 60 * 24)),
            hours: Math.floor((difference / (1000 * 60 * 60)) % 24),
            minutes: Math.floor((difference / 1000 / 60) % 60),
            seconds: Math.floor((difference / 1000) % 60),
          };
        }
      });

      setTimeLeft(newTimeLeft);
    }, 1000);

    return () => clearInterval(timer);
  }, [events]);

  return (
    <div className="countdown-container">
      <div className="countdown-header">
        <span className="countdown-icon">⏰</span>
        <span className="countdown-title">Countdowns</span>
      </div>

      {events.map((event) => (
        timeLeft[event.name] && (
          <div key={event.name} className="countdown-event">
            <div className="countdown-event-name">{event.name}</div>
            <div className="countdown-timer-grid">
              <div className="countdown-unit">
                <div className="countdown-number">{timeLeft[event.name].days}</div>
                <div className="countdown-label">Days</div>
              </div>
              <div className="countdown-separator">:</div>
              <div className="countdown-unit">
                <div className="countdown-number">{String(timeLeft[event.name].hours).padStart(2, '0')}</div>
                <div className="countdown-label">Hours</div>
              </div>
              <div className="countdown-separator">:</div>
              <div className="countdown-unit">
                <div className="countdown-number">{String(timeLeft[event.name].minutes).padStart(2, '0')}</div>
                <div className="countdown-label">Mins</div>
              </div>
              <div className="countdown-separator">:</div>
              <div className="countdown-unit">
                <div className="countdown-number">{String(timeLeft[event.name].seconds).padStart(2, '0')}</div>
                <div className="countdown-label">Secs</div>
              </div>
            </div>
          </div>
        )
      ))}
    </div>
  );
};

export default Countdown;
