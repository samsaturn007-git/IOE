import React, { useState, useEffect } from 'react';
import './Greeting.css';

const Greeting = () => {
  const [greeting, setGreeting] = useState('');
  const [quote, setQuote] = useState('');

  const quotes = [
    'The future belongs to those who believe in the beauty of their dreams.',
    'Innovation distinguishes between a leader and a follower.',
    'The best way to predict the future is to invent it.',
    'Technology is best when it brings people together.',
    'The only way to do great work is to love what you do.',
    'Simplicity is the ultimate sophistication.',
    'Stay hungry, stay foolish.'
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

    const updateQuote = () => {
      const randomQuote = quotes[Math.floor(Math.random() * quotes.length)];
      setQuote(randomQuote);
    };

    updateGreeting();
    updateQuote();

    // Update greeting every minute
    const greetingInterval = setInterval(updateGreeting, 60000);
    // Update quote every 5 minutes
    const quoteInterval = setInterval(updateQuote, 300000);

    return () => {
      clearInterval(greetingInterval);
      clearInterval(quoteInterval);
    };
  }, []);

  return (
    <div className="greeting-container">
      <div className="greeting-text">{greeting}</div>
      <div className="quote-text">"{quote}"</div>
    </div>
  );
};

export default Greeting;
