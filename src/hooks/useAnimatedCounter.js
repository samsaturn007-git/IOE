import { useState, useEffect } from 'react';

const useAnimatedCounter = (targetValue, duration = 1000) => {
  const [currentValue, setCurrentValue] = useState(targetValue);

  useEffect(() => {
    const startValue = currentValue;
    const difference = targetValue - startValue;
    const startTime = Date.now();

    const animate = () => {
      const currentTime = Date.now();
      const elapsed = currentTime - startTime;
      const progress = Math.min(elapsed / duration, 1);

      // Easing function for smooth animation
      const easeOutQuad = progress * (2 - progress);
      const newValue = startValue + difference * easeOutQuad;

      setCurrentValue(newValue);

      if (progress < 1) {
        requestAnimationFrame(animate);
      }
    };

    animate();
  }, [targetValue, duration]);

  return currentValue;
};

export default useAnimatedCounter;
