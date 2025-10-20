import React, { useState, useEffect } from 'react';
import './Weather.css';

const Weather = () => {
  const [weather, setWeather] = useState({
    temp: 24,
    condition: 'Partly Cloudy',
    location: 'San Francisco, CA'
  });

  useEffect(() => {
    // Simulate weather updates every 30 seconds
    const interval = setInterval(() => {
      const conditions = ['Sunny', 'Partly Cloudy', 'Cloudy', 'Clear'];
      const randomTemp = Math.floor(Math.random() * 15) + 18; // 18-32°C
      const randomCondition = conditions[Math.floor(Math.random() * conditions.length)];
      
      setWeather(prev => ({
        ...prev,
        temp: randomTemp,
        condition: randomCondition
      }));
    }, 30000);

    return () => clearInterval(interval);
  }, []);

  return (
    <div className="weather-container">
      <div className="weather-icon">
        {weather.condition === 'Sunny' && '☀️'}
        {weather.condition === 'Partly Cloudy' && '⛅'}
        {weather.condition === 'Cloudy' && '☁️'}
        {weather.condition === 'Clear' && '🌙'}
      </div>
      <div className="weather-temp">{weather.temp}°C</div>
      <div className="weather-condition">{weather.condition}</div>
      <div className="weather-location">{weather.location}</div>
    </div>
  );
};

export default Weather;
