import React from 'react';
import { ThemeProvider } from './contexts/ThemeContext';
import './App.css';
import ParticleBackground from './components/ParticleBackground';
import SeasonalEffects from './components/SeasonalEffects';
import ThemeSwitcher from './components/ThemeSwitcher';
import SizeController from './components/SizeController';
import Clock from './components/Clock';
import Weather from './components/Weather';
import Greeting from './components/Greeting';
import IoTCards from './components/IoTCards';
import News from './components/News';

function App() {
  return (
    <ThemeProvider>
      <div className="app-container">
        <ThemeSwitcher />
        <SizeController />
        
        <div className="mirror-frame">
          <ParticleBackground />
          <SeasonalEffects />
          
          {/* Top Row: Clock (left) & Weather (right) */}
          <section className="section-top-row">
            <div className="section-top">
              <Clock />
            </div>
            <div className="section-weather">
              <Weather />
            </div>
          </section>

          {/* Greeting & Team Names */}
          <section className="section-greeting">
            <Greeting />
          </section>

          {/* IoT Data Cards & News Section */}
          <section className="section-iot">
            <IoTCards />
            <div className="section-news">
              <News />
            </div>
          </section>

          {/* Spacer for vertical balance */}
          <div className="spacer"></div>
        </div>
      </div>
    </ThemeProvider>
  );
}

export default App;
