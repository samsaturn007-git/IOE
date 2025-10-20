import { useState, useEffect } from 'react';

const useResponsiveScale = () => {
  const [scale, setScale] = useState(1);
  const [dimensions, setDimensions] = useState({
    width: 400,
    height: 1678
  });

  useEffect(() => {
    const calculateScale = () => {
      const viewportWidth = window.innerWidth;
      const viewportHeight = window.innerHeight;
      
      // Default dimensions
      const defaultWidth = 400;
      const defaultHeight = 1678;
      
      // Calculate scale based on viewport
      const widthScale = (viewportWidth - 40) / defaultWidth;
      const heightScale = (viewportHeight - 40) / defaultHeight;
      
      // Use the smaller scale to ensure content fits
      const calculatedScale = Math.min(widthScale, heightScale, 1.2);
      
      setScale(calculatedScale);
      setDimensions({
        width: defaultWidth,
        height: defaultHeight
      });
    };

    calculateScale();
    
    // Recalculate on window resize
    window.addEventListener('resize', calculateScale);
    
    return () => window.removeEventListener('resize', calculateScale);
  }, []);

  return { scale, dimensions };
};

export default useResponsiveScale;
