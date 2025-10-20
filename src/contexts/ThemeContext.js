import React, { createContext, useState, useContext, useEffect } from 'react';

const ThemeContext = createContext();

export const themes = {
  classic: {
    name: 'Classic Blue',
    primary: '#00BFFF',
    secondary: '#39FF14',
    background: '#000000',
    text: '#FFFFFF',
    textSecondary: '#AAAAAA',
    glow: 'rgba(0, 191, 255, 0.3)',
  },
  purple: {
    name: 'Purple Dream',
    primary: '#B24BF3',
    secondary: '#FF6EC7',
    background: '#000000',
    text: '#FFFFFF',
    textSecondary: '#AAAAAA',
    glow: 'rgba(178, 75, 243, 0.3)',
  },
  green: {
    name: 'Matrix Green',
    primary: '#00FF41',
    secondary: '#00D9FF',
    background: '#000000',
    text: '#FFFFFF',
    textSecondary: '#AAAAAA',
    glow: 'rgba(0, 255, 65, 0.3)',
  },
  amber: {
    name: 'Amber Glow',
    primary: '#FFA500',
    secondary: '#FFD700',
    background: '#000000',
    text: '#FFFFFF',
    textSecondary: '#AAAAAA',
    glow: 'rgba(255, 165, 0, 0.3)',
  },
  cyan: {
    name: 'Cyber Cyan',
    primary: '#00FFFF',
    secondary: '#FF00FF',
    background: '#000000',
    text: '#FFFFFF',
    textSecondary: '#AAAAAA',
    glow: 'rgba(0, 255, 255, 0.3)',
  },
};

export const ThemeProvider = ({ children }) => {
  const [currentTheme, setCurrentTheme] = useState('classic');
  const [adaptiveBrightness, setAdaptiveBrightness] = useState(true);

  useEffect(() => {
    // Apply theme CSS variables
    const theme = themes[currentTheme];
    Object.keys(theme).forEach((key) => {
      if (key !== 'name') {
        document.documentElement.style.setProperty(`--${key}`, theme[key]);
      }
    });

    // Adaptive brightness based on time
    if (adaptiveBrightness) {
      const hour = new Date().getHours();
      let brightness = 1;
      
      if (hour >= 22 || hour < 6) {
        brightness = 0.6; // Night mode
      } else if (hour >= 6 && hour < 8) {
        brightness = 0.8; // Early morning
      } else if (hour >= 20 && hour < 22) {
        brightness = 0.85; // Evening
      }
      
      document.documentElement.style.setProperty('--brightness', brightness);
    } else {
      document.documentElement.style.setProperty('--brightness', 1);
    }
  }, [currentTheme, adaptiveBrightness]);

  return (
    <ThemeContext.Provider
      value={{
        currentTheme,
        setCurrentTheme,
        themes,
        adaptiveBrightness,
        setAdaptiveBrightness,
      }}
    >
      {children}
    </ThemeContext.Provider>
  );
};

export const useTheme = () => {
  const context = useContext(ThemeContext);
  if (!context) {
    throw new Error('useTheme must be used within ThemeProvider');
  }
  return context;
};
