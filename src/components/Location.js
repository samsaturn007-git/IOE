import React, { useState, useEffect } from 'react';
import './Location.css';

const Location = () => {
  const [location, setLocation] = useState({
    city: 'Mumbai',
    country: 'India',
    timezone: 'IST'
  });

  useEffect(() => {
    // You can integrate with a geolocation API here
    // For now, using static data
    const updateLocation = () => {
      const date = new Date();
      const timeString = date.toLocaleTimeString('en-US', {
        hour: '2-digit',
        minute: '2-digit',
        hour12: true
      });
      
      setLocation(prev => ({
        ...prev,
        currentTime: timeString
      }));
    };

    updateLocation();
    const interval = setInterval(updateLocation, 60000);

    return () => clearInterval(interval);
  }, []);

  return (
    <div className="location-container">
      <div className="location-icon">📍</div>
      <div className="location-info">
        <div className="location-city">{location.city}</div>
        <div className="location-country">{location.country}</div>
      </div>
    </div>
  );
};

export default Location;
