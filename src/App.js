import React from 'react';
import { ThemeProvider } from './contexts/ThemeContext';
import './App.css';
import ThemeSwitcher from './components/ThemeSwitcher';
import SizeController from './components/SizeController';
import Clock from './components/Clock';
import Weather from './components/Weather';
import Greeting from './components/Greeting';
import News from './components/News';

function App() {
  return (
    <ThemeProvider>
      <div className="app-container">
        <ThemeSwitcher />
        <SizeController />
        
        <div className="mirror-frame">
          
          {/* Top Row: Clock (left) & Weather (right) */}
          <section className="section-top-row">
            <div className="section-top">
              <Clock />
            </div>
            <div className="section-weather">
              <Weather />
            </div>
          </section>

          {/* Spacer for vertical balance */}
          <div className="spacer"></div>

          {/* Greeting & Team Names */}
          <section className="section-greeting">
            <Greeting />
          </section>

          {/* News Section - Centered at Bottom */}
          <section className="section-news-bottom">
            <News />
          </section>
        </div>
      </div>
    </ThemeProvider>
  );
}

export default App;
