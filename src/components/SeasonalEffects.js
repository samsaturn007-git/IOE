import React, { useEffect, useRef } from 'react';
import './SeasonalEffects.css';

const SeasonalEffects = () => {
  const canvasRef = useRef(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    const ctx = canvas.getContext('2d');
    canvas.width = 400;
    canvas.height = 1678;

    // Determine season based on month
    const month = new Date().getMonth();
    let season = 'spring';
    
    if (month >= 11 || month <= 1) season = 'winter';
    else if (month >= 2 && month <= 4) season = 'spring';
    else if (month >= 5 && month <= 7) season = 'summer';
    else if (month >= 8 && month <= 10) season = 'fall';

    const particles = [];
    const particleCount = 20;

    class Particle {
      constructor() {
        this.reset();
      }

      reset() {
        this.x = Math.random() * canvas.width;
        this.y = -10;
        this.size = Math.random() * 3 + 1;
        this.speedY = Math.random() * 2 + 1;
        this.speedX = Math.random() * 1 - 0.5;
        this.opacity = Math.random() * 0.5 + 0.3;
        
        if (season === 'winter') {
          this.char = '❄';
          this.rotation = Math.random() * 360;
          this.rotationSpeed = Math.random() * 2 - 1;
        } else if (season === 'fall') {
          this.char = ['🍂', '🍁'][Math.floor(Math.random() * 2)];
          this.rotation = Math.random() * 360;
          this.rotationSpeed = Math.random() * 4 - 2;
          this.speedY = Math.random() * 1.5 + 0.5;
        } else if (season === 'spring') {
          this.char = ['🌸', '🌺', '🌼'][Math.floor(Math.random() * 3)];
          this.rotation = 0;
          this.rotationSpeed = 0;
          this.speedY = Math.random() * 1 + 0.3;
        } else {
          // Summer - fireflies/sparkles
          this.char = '✨';
          this.speedY = Math.random() * 0.5 - 0.25;
          this.speedX = Math.random() * 0.8 - 0.4;
        }
      }

      update() {
        this.y += this.speedY;
        this.x += this.speedX;
        
        if (season !== 'summer') {
          this.rotation += this.rotationSpeed;
        } else {
          // Firefly floating motion
          this.y += Math.sin(Date.now() * 0.001 + this.x) * 0.2;
        }

        if (this.y > canvas.height || this.x < -20 || this.x > canvas.width + 20) {
          this.reset();
        }
      }

      draw() {
        ctx.save();
        ctx.globalAlpha = this.opacity;
        ctx.translate(this.x, this.y);
        ctx.rotate((this.rotation * Math.PI) / 180);
        ctx.font = `${this.size * 8}px Arial`;
        ctx.textAlign = 'center';
        ctx.textBaseline = 'middle';
        
        // Apply grayscale filter for mirror effect
        ctx.filter = 'grayscale(100%) brightness(1.5)';
        ctx.fillText(this.char, 0, 0);
        ctx.restore();
      }
    }

    // Initialize particles
    for (let i = 0; i < particleCount; i++) {
      particles.push(new Particle());
    }

    // Animation loop
    const animate = () => {
      ctx.clearRect(0, 0, canvas.width, canvas.height);

      particles.forEach((particle) => {
        particle.update();
        particle.draw();
      });

      requestAnimationFrame(animate);
    };

    animate();
  }, []);

  return <canvas ref={canvasRef} className="seasonal-effects" />;
};

export default SeasonalEffects;
