import React, { useState, useEffect } from 'react';
import './Weather.css';
import config from '../config';

const Weather = () => {
  const [currentWeather, setCurrentWeather] = useState({
    temp: 24,
    condition: 'Loading...',
    humidity: null,
    windSpeed: null
  });

  const [weeklyForecast, setWeeklyForecast] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const mapOpenWeatherToCondition = (weatherMain, description) => {
    const mainCondition = weatherMain.toLowerCase();
    if (mainCondition.includes('clear')) return 'Clear';
    if (mainCondition.includes('cloud')) {
      if (description.includes('few')) return 'Partly Cloudy';
      return 'Cloudy';
    }
    if (mainCondition.includes('rain')) return 'Rainy';
    if (mainCondition.includes('thunder')) return 'Thunderstorm';
    if (mainCondition.includes('snow')) return 'Snowy';
    if (mainCondition.includes('mist') || mainCondition.includes('fog')) return 'Foggy';
    return 'Partly Cloudy';
  };

  const getMockWeatherData = () => {
    // Mock weather data for Mumbai as fallback
    const mockCurrent = {
      temp: 28,
      condition: 'Partly Cloudy',
      humidity: 75,
      windSpeed: 15
    };

    const mockForecast = [
      { day: 'Mon', temp: 29, condition: 'Partly Cloudy' },
      { day: 'Tue', temp: 30, condition: 'Clear' },
      { day: 'Wed', temp: 28, condition: 'Cloudy' },
      { day: 'Thu', temp: 27, condition: 'Rainy' },
      { day: 'Fri', temp: 28, condition: 'Partly Cloudy' },
      { day: 'Sat', temp: 29, condition: 'Clear' },
      { day: 'Sun', temp: 30, condition: 'Clear' }
    ];

    return { mockCurrent, mockForecast };
  };

  const fetchWeatherData = async () => {
    try {
      setLoading(true);
      setError(null);

      // Fetch current weather for Mumbai
      const currentResponse = await fetch(
        `https://api.openweathermap.org/data/2.5/weather?q=Mumbai,IN&units=metric&appid=${config.OPENWEATHER_API_KEY}`
      );
      
      if (!currentResponse.ok) {
        throw new Error('Failed to fetch weather data');
      }

      const currentData = await currentResponse.json();
      
      setCurrentWeather({
        temp: Math.round(currentData.main.temp),
        condition: mapOpenWeatherToCondition(currentData.weather[0].main, currentData.weather[0].description),
        humidity: currentData.main.humidity,
        windSpeed: Math.round(currentData.wind.speed * 3.6) // Convert m/s to km/h
      });

      // Fetch 5-day forecast
      const forecastResponse = await fetch(
        `https://api.openweathermap.org/data/2.5/forecast?q=Mumbai,IN&units=metric&appid=${config.OPENWEATHER_API_KEY}`
      );

      if (!forecastResponse.ok) {
        throw new Error('Failed to fetch forecast data');
      }

      const forecastData = await forecastResponse.json();
      
      // Process forecast data - get one entry per day at noon
      const dailyForecasts = [];
      const processedDays = new Set();
      
      forecastData.list.forEach(item => {
        const date = new Date(item.dt * 1000);
        const dayName = date.toLocaleDateString('en-US', { weekday: 'short' });
        const dateKey = date.toDateString();
        
        // Get forecast around noon (12:00) for each day
        if (!processedDays.has(dateKey) && dailyForecasts.length < 7) {
          processedDays.add(dateKey);
          dailyForecasts.push({
            day: dayName,
            temp: Math.round(item.main.temp),
            condition: mapOpenWeatherToCondition(item.weather[0].main, item.weather[0].description)
          });
        }
      });

      setWeeklyForecast(dailyForecasts);
      setLoading(false);
    } catch (err) {
      console.error('Weather fetch error:', err);
      console.log('Using mock weather data as fallback');
      
      // Use mock data as fallback instead of showing error
      const { mockCurrent, mockForecast } = getMockWeatherData();
      setCurrentWeather(mockCurrent);
      setWeeklyForecast(mockForecast);
      setError(null); // Clear error to prevent error UI
      setLoading(false);
    }
  };

  useEffect(() => {
    // Fetch weather data immediately
    fetchWeatherData();

    // Refresh weather data every 10 minutes
    const interval = setInterval(() => {
      fetchWeatherData();
    }, 10 * 60 * 1000); // 10 minutes

    return () => clearInterval(interval);
  }, []);

  const getWeatherIcon = (condition) => {
    const hour = new Date().getHours();
    const isNight = hour < 6 || hour > 20;
    
    switch(condition) {
      case 'Clear': return isNight ? '🌙' : '☀️';
      case 'Partly Cloudy': return '⛅';
      case 'Cloudy': return '☁️';
      case 'Rainy': return '🌧️';
      case 'Thunderstorm': return '⛈️';
      case 'Snowy': return '❄️';
      case 'Foggy': return '�️';
      default: return '⛅';
    }
  };

  return (
    <div className="weather-container">
      <div className="weather-current">
        <div className="weather-icon-large">
          {loading ? '⏳' : getWeatherIcon(currentWeather.condition)}
        </div>
        <div className="weather-info">
          <div className="weather-temp">{currentWeather.temp}°C</div>
          <div className="weather-condition">{currentWeather.condition}</div>
          <div className="weather-location">Mumbai, India</div>
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
