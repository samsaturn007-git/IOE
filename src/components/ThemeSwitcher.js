import React, { useState } from 'react';
import { useTheme } from '../contexts/ThemeContext';
import './ThemeSwitcher.css';

const ThemeSwitcher = () => {
  const { currentTheme, setCurrentTheme, themes } = useTheme();
  const [isOpen, setIsOpen] = useState(false);

  return (
    <div className="theme-switcher">
      <button 
        className="theme-toggle-btn"
        onClick={() => setIsOpen(!isOpen)}
        aria-label="Toggle theme menu"
      >
        🎨
      </button>
      
      {isOpen && (
        <div className="theme-menu">
          <div className="theme-menu-header">Choose Theme</div>
          {Object.keys(themes).map((themeKey) => (
            <button
              key={themeKey}
              className={`theme-option ${currentTheme === themeKey ? 'active' : ''}`}
              onClick={() => {
                setCurrentTheme(themeKey);
                setIsOpen(false);
              }}
            >
              <span 
                className="theme-color-preview" 
                style={{ backgroundColor: themes[themeKey].primary }}
              />
              {themes[themeKey].name}
            </button>
          ))}
        </div>
      )}
    </div>
  );
};

export default ThemeSwitcher;
