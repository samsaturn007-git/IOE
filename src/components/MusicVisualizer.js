import React, { useEffect, useRef } from 'react';
import './MusicVisualizer.css';

const MusicVisualizer = ({ audioData }) => {
  const canvasRef = useRef(null);
  const animationRef = useRef(null);

  // Polyfill for roundRect if not supported
  useEffect(() => {
    if (!CanvasRenderingContext2D.prototype.roundRect) {
      CanvasRenderingContext2D.prototype.roundRect = function(x, y, width, height, radii) {
        const radius = Array.isArray(radii) ? radii[0] : radii;
        this.beginPath();
        this.moveTo(x + radius, y);
        this.lineTo(x + width - radius, y);
        this.quadraticCurveTo(x + width, y, x + width, y + radius);
        this.lineTo(x + width, y + height);
        this.lineTo(x, y + height);
        this.lineTo(x, y + radius);
        this.quadraticCurveTo(x, y, x + radius, y);
        this.closePath();
      };
    }
  }, []);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext('2d');
    const updateCanvasSize = () => {
      canvas.width = canvas.offsetWidth * window.devicePixelRatio;
      canvas.height = canvas.offsetHeight * window.devicePixelRatio;
      ctx.scale(window.devicePixelRatio, window.devicePixelRatio);
    };

    updateCanvasSize();
    window.addEventListener('resize', updateCanvasSize);

    return () => {
      window.removeEventListener('resize', updateCanvasSize);
      if (animationRef.current) {
        cancelAnimationFrame(animationRef.current);
      }
    };
  }, []);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext('2d');
    const width = canvas.offsetWidth;
    const height = canvas.offsetHeight;

    const draw = () => {
      ctx.clearRect(0, 0, width, height);

      if (!audioData || audioData.length === 0) {
        // Draw idle state - gentle wave
        const time = Date.now() * 0.001;
        const barCount = 60;
        const barWidth = width / barCount;
        
        for (let i = 0; i < barCount; i++) {
          const x = i * barWidth;
          const waveOffset = Math.sin(time * 2 + i * 0.3) * 5 + 10;
          
          const gradient = ctx.createLinearGradient(x, height, x, height - waveOffset);
          gradient.addColorStop(0, 'rgba(0, 191, 255, 0.3)');
          gradient.addColorStop(1, 'rgba(57, 255, 20, 0.3)');
          
          ctx.fillStyle = gradient;
          ctx.fillRect(x, height - waveOffset, barWidth - 2, waveOffset);
        }

        animationRef.current = requestAnimationFrame(draw);
        return;
      }

      // Draw active visualization with audio data
      const bufferLength = audioData.length;
      const barCount = Math.min(60, bufferLength);
      const barWidth = width / barCount;
      const step = Math.floor(bufferLength / barCount);

      for (let i = 0; i < barCount; i++) {
        const dataIndex = i * step;
        const value = audioData[dataIndex];
        const barHeight = (value / 255) * height * 0.8;
        const x = i * barWidth;
        
        // Create gradient for each bar
        const gradient = ctx.createLinearGradient(x, height, x, height - barHeight);
        gradient.addColorStop(0, 'rgba(0, 191, 255, 0.8)');
        gradient.addColorStop(0.5, 'rgba(0, 191, 255, 0.5)');
        gradient.addColorStop(1, 'rgba(57, 255, 20, 0.8)');
        
        ctx.fillStyle = gradient;
        
        // Draw bar with rounded top
        ctx.beginPath();
        ctx.roundRect(x + 1, height - barHeight, barWidth - 2, barHeight, [4, 4, 0, 0]);
        ctx.fill();
        
        // Add glow effect
        ctx.shadowBlur = 15;
        ctx.shadowColor = value > 200 ? 'rgba(57, 255, 20, 0.8)' : 'rgba(0, 191, 255, 0.6)';
      }

      animationRef.current = requestAnimationFrame(draw);
    };

    draw();

    return () => {
      if (animationRef.current) {
        cancelAnimationFrame(animationRef.current);
      }
    };
  }, [audioData]);

  return (
    <div className="music-visualizer">
      <canvas ref={canvasRef} className="visualizer-canvas"></canvas>
      <div className="visualizer-overlay"></div>
    </div>
  );
};

export default MusicVisualizer;
