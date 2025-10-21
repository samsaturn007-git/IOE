import React, { useState, useEffect } from 'react';
import './Weather.css';

const Weather = () => {
  const [currentWeather, setCurrentWeather] = useState({
    temp: 24,
    condition: 'Partly Cloudy'
  });

  const [weeklyForecast, setWeeklyForecast] = useState([
    { day: 'Mon', temp: 23, condition: 'Sunny' },
    { day: 'Tue', temp: 25, condition: 'Partly Cloudy' },
    { day: 'Wed', temp: 22, condition: 'Cloudy' },
    { day: 'Thu', temp: 24, condition: 'Sunny' },
    { day: 'Fri', temp: 26, condition: 'Partly Cloudy' },
    { day: 'Sat', temp: 27, condition: 'Sunny' },
    { day: 'Sun', temp: 25, condition: 'Partly Cloudy' }
  ]);

  useEffect(() => {
    // Simulate weather updates every 30 seconds
    const interval = setInterval(() => {
      const conditions = ['Sunny', 'Partly Cloudy', 'Cloudy', 'Clear'];
      const randomTemp = Math.floor(Math.random() * 15) + 18; // 18-32°C
      const randomCondition = conditions[Math.floor(Math.random() * conditions.length)];
      
      setCurrentWeather({
        temp: randomTemp,
        condition: randomCondition
      });

      // Update weekly forecast
      setWeeklyForecast(prev => prev.map(day => ({
        ...day,
        temp: Math.floor(Math.random() * 15) + 18,
        condition: conditions[Math.floor(Math.random() * conditions.length)]
      })));
    }, 30000);

    return () => clearInterval(interval);
  }, []);

  const getWeatherIcon = (condition) => {
    switch(condition) {
      case 'Sunny': return '☀️';
      case 'Partly Cloudy': return '⛅';
      case 'Cloudy': return '☁️';
      case 'Clear': return '🌙';
      default: return '⛅';
    }
  };

  return (
    <div className="weather-container">
      <div className="weather-current">
        <div className="weather-icon-large">
          {getWeatherIcon(currentWeather.condition)}
        </div>
        <div className="weather-info">
          <div className="weather-temp">{currentWeather.temp}°C</div>
          <div className="weather-condition">{currentWeather.condition}</div>
        </div>
      </div>
      <div className="weather-weekly">
        {weeklyForecast.map((day, index) => (
          <div key={index} className="weather-day">
            <div className="weather-day-name">{day.day}</div>
            <div className="weather-day-icon">{getWeatherIcon(day.condition)}</div>
            <div className="weather-day-temp">{day.temp}°</div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default Weather;
