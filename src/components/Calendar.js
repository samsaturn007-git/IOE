import React, { useState, useEffect } from 'react';
import './Calendar.css';

const Calendar = () => {
  const [events, setEvents] = useState([
    { time: '09:00 AM', title: 'Team Standup', type: 'meeting' },
    { time: '02:00 PM', title: 'IoT Project Demo', type: 'important' },
    { time: '04:30 PM', title: 'Code Review', type: 'work' },
  ]);

  const today = new Date();
  const dayName = today.toLocaleDateString('en-US', { weekday: 'short' });
  const dayNumber = today.getDate();

  return (
    <div className="calendar-container">
      <div className="calendar-header">
        <div className="calendar-date-badge">
          <div className="calendar-day-name">{dayName}</div>
          <div className="calendar-day-number">{dayNumber}</div>
        </div>
        <div className="calendar-title">Today's Schedule</div>
      </div>
      
      <div className="calendar-events">
        {events.map((event, index) => (
          <div key={index} className={`calendar-event ${event.type}`}>
            <div className="event-time">{event.time}</div>
            <div className="event-title">{event.title}</div>
            <div className="event-indicator"></div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default Calendar;
