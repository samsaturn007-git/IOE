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
          
          {/* Top Section: Clock & Date */}
          <section className="section-top">
            <Clock />
          </section>

          {/* Weather Widget */}
          <section className="section-weather">
            <Weather />
          </section>

          {/* Greeting & Quote */}
          <section className="section-greeting">
            <Greeting />
          </section>

          {/* IoT Data Cards */}
          <section className="section-iot">
            <IoTCards />
          </section>

          {/* Spacer for vertical balance */}
          <div className="spacer"></div>

          {/* News Section - Bottom */}
          <section className="section-news">
            <News />
          </section>
        </div>
      </div>
    </ThemeProvider>
  );
}

export default App;
