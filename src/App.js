import React, { useState } from 'react';
import { ThemeProvider } from './contexts/ThemeContext';
import './App.css';
import ThemeSwitcher from './components/ThemeSwitcher';
import SizeController from './components/SizeController';
import Clock from './components/Clock';
import Weather from './components/Weather';
import Greeting from './components/Greeting';
import News from './components/News';
import MusicPlayer from './components/MusicPlayer';
import MusicVisualizer from './components/MusicVisualizer';
import TodoList from './components/TodoListSimple';

function App() {
  const [audioData, setAudioData] = useState(null);

  const handleAudioDataUpdate = (data) => {
    setAudioData(data);
  };

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
              {/* Music Player below Clock */}
              <div className="section-music-player">
                <MusicPlayer onAudioDataUpdate={handleAudioDataUpdate} />
              </div>
            </div>
            <div className="section-weather">
              <Weather />
              {/* Todo List below Weather */}
              <TodoList />
            </div>
          </section>

          {/* Spacer for vertical balance */}
          <div className="spacer"></div>

          {/* Greeting & Team Names */}
          <section className="section-greeting">
            <Greeting />
          </section>

          {/* Bottom Row: Music Visualizer & News */}
          <section className="section-bottom-row">
            <div className="section-visualizer">
              <MusicVisualizer audioData={audioData} />
            </div>
            <div className="section-news">
              <News />
            </div>
          </section>
        </div>
      </div>
    </ThemeProvider>
  );
}

export default App;
