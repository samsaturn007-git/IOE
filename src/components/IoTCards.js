import React, { useState, useEffect } from 'react';
import useAnimatedCounter from '../hooks/useAnimatedCounter';
import './IoTCards.css';

const Sparkline = ({ data, color }) => {
  const max = Math.max(...data);
  const min = Math.min(...data);
  const range = max - min || 1;
  
  const points = data.map((value, index) => {
    const x = (index / (data.length - 1)) * 100;
    const y = 100 - ((value - min) / range) * 100;
    return `${x},${y}`;
  }).join(' ');

  return (
    <svg className="sparkline" viewBox="0 0 100 30" preserveAspectRatio="none">
      <polyline
        fill="none"
        stroke={color}
        strokeWidth="2"
        points={points}
      />
    </svg>
  );
};

const IoTCards = () => {
  const [iotData, setIotData] = useState({
    temperature: 22.5,
    humidity: 65,
    airQuality: 85,
    windSpeed: 12.5
  });

  const [history, setHistory] = useState({
    temperature: [22, 22.5, 23, 22.8, 22.5],
    humidity: [63, 64, 65, 66, 65],
    airQuality: [83, 84, 85, 86, 85],
    windSpeed: [10, 11, 12.5, 13, 12.5]
  });

  const animatedTemp = useAnimatedCounter(parseFloat(iotData.temperature), 800);
  const animatedHumidity = useAnimatedCounter(iotData.humidity, 800);
  const animatedAirQuality = useAnimatedCounter(iotData.airQuality, 800);
  const animatedWindSpeed = useAnimatedCounter(parseFloat(iotData.windSpeed), 800);

  useEffect(() => {
    // Simulate IoT sensor updates every 5 seconds
    const interval = setInterval(() => {
      const newData = {
        temperature: parseFloat((Math.random() * 10 + 18).toFixed(1)),
        humidity: Math.floor(Math.random() * 30 + 50),
        airQuality: Math.floor(Math.random() * 30 + 70),
        windSpeed: parseFloat((Math.random() * 20 + 5).toFixed(1))
      };
      
      setIotData(newData);
      
      // Update history
      setHistory(prev => ({
        temperature: [...prev.temperature.slice(1), newData.temperature],
        humidity: [...prev.humidity.slice(1), newData.humidity],
        airQuality: [...prev.airQuality.slice(1), newData.airQuality],
        windSpeed: [...prev.windSpeed.slice(1), newData.windSpeed]
      }));
    }, 5000);

    return () => clearInterval(interval);
  }, []);

  const getAirQualityStatus = (value) => {
    if (value >= 80) return 'Good';
    if (value >= 60) return 'Moderate';
    return 'Poor';
  };

  const getAirQualityColor = (value) => {
    if (value >= 80) return 'var(--secondary, #39FF14)';
    if (value >= 60) return 'var(--primary, #00BFFF)';
    return '#FF4757';
  };

  return (
    <div className="iot-cards-container">
      <div className="iot-card">
        <div className="iot-icon">🌡️</div>
        <div className="iot-value">{animatedTemp.toFixed(1)}°C</div>
        <div className="iot-label">Temperature</div>
      </div>

      <div className="iot-card">
        <div className="iot-icon">💧</div>
        <div className="iot-value">{Math.round(animatedHumidity)}%</div>
        <div className="iot-label">Humidity</div>
      </div>

      <div className="iot-card" style={{ borderColor: getAirQualityColor(iotData.airQuality) }}>
        <div className="iot-icon">🌬️</div>
        <div className="iot-value" style={{ color: getAirQualityColor(iotData.airQuality) }}>
          {Math.round(animatedAirQuality)}
        </div>
        <div className="iot-label">Air Quality</div>
        <div className="iot-status" style={{ color: getAirQualityColor(iotData.airQuality) }}>
          {getAirQualityStatus(iotData.airQuality)}
        </div>
      </div>

      <div className="iot-card">
        <div className="iot-icon">💨</div>
        <div className="iot-value">{animatedWindSpeed.toFixed(1)} km/h</div>
        <div className="iot-label">Wind Speed</div>
      </div>
    </div>
  );
};

export default IoTCards;
