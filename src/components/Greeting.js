import React, { useState, useEffect } from 'react';
import './Greeting.css';

const Greeting = () => {
  const [greeting, setGreeting] = useState('');
  const [currentNameIndex, setCurrentNameIndex] = useState(0);
  const [currentQuoteIndex, setCurrentQuoteIndex] = useState(0);
  
  const teamMembers = ['Samuel', 'Tejas', 'Dushyant', 'Onkar'];
  const quotes = [
    'Rise and shine, the day is yours!',
    'Innovation distinguishes between a leader and a follower.',
    'The best way to predict the future is to invent it.',
    'Technology is best when it brings people together.',
    'The only way to do great work is to love what you do.',
    'Simplicity is the ultimate sophistication.',
    'Stay hungry, stay foolish.',
    'Dream big, work hard, stay focused.',
    'The future belongs to those who believe in their dreams.'
  ];

  useEffect(() => {
    const updateGreeting = () => {
      const hour = new Date().getHours();
      if (hour < 12) {
        setGreeting('Good Morning');
      } else if (hour < 18) {
        setGreeting('Good Afternoon');
      } else {
        setGreeting('Good Evening');
      }
    };

    updateGreeting();

    // Update greeting every minute
    const greetingInterval = setInterval(updateGreeting, 60000);

    return () => {
      clearInterval(greetingInterval);
    };
  }, []);

  useEffect(() => {
    // Flash team member names every 3 seconds
    const nameInterval = setInterval(() => {
      setCurrentNameIndex((prevIndex) => (prevIndex + 1) % teamMembers.length);
    }, 3000);

    return () => clearInterval(nameInterval);
  }, []);

  useEffect(() => {
    // Change quote every 10 seconds
    const quoteInterval = setInterval(() => {
      setCurrentQuoteIndex((prevIndex) => (prevIndex + 1) % quotes.length);
    }, 10000);

    return () => clearInterval(quoteInterval);
  }, []);

  return (
    <div className="greeting-container">
      <div className="greeting-text">{greeting}</div>
      <div className="team-names">
        <span className="team-name active">
          {teamMembers[currentNameIndex]}
        </span>
      </div>
      <div className="motivational-quote">{quotes[currentQuoteIndex]}</div>
    </div>
  );
};

export default Greeting;
