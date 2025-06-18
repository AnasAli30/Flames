import { useEffect, useState, useMemo } from 'react';
import { FlamesBackground as StyledBackground, FlameText } from '../styles/StyledComponents';

const FlamesBackground = () => {
  const [dimensions, setDimensions] = useState({ width: 0, height: 0 });

  useEffect(() => {
    const updateDimensions = () => {
      setDimensions({
        width: window.innerWidth,
        height: window.innerHeight
      });
    };

    updateDimensions();
    // Throttle resize event
    let timeoutId;
    const handleResize = () => {
      if (timeoutId) clearTimeout(timeoutId);
      timeoutId = setTimeout(updateDimensions, 250);
    };

    window.addEventListener('resize', handleResize);
    return () => {
      window.removeEventListener('resize', handleResize);
      if (timeoutId) clearTimeout(timeoutId);
    };
  }, []);

  // Memoize flames to prevent unnecessary recalculations
  const flames = useMemo(() => {
    // Reduce flame count significantly
    const getFlameCount = () => {
      if (dimensions.width < 480) return 3;
      if (dimensions.width < 768) return 4;
      if (dimensions.width < 1200) return 6;
      return 8;
    };

    const flameCount = getFlameCount();
    const flameTexts = ['🔥']; // Reduce variety of elements
    
    return Array.from({ length: flameCount }, (_, i) => ({
      id: i,
      text: flameTexts[0],
      style: {
        top: `${Math.random() * 100}vh`,
        left: `${Math.random() * 100}vw`,
        animationDelay: `${Math.random() * 8}s`,
        fontSize: dimensions.width < 768 
          ? '14px'  // Fixed size for better performance
          : '18px',
        opacity: 0.08, // Reduce opacity
        zIndex: -2
      }
    }));
  }, [dimensions]); // Only recalculate when dimensions change

  return (
    <StyledBackground>
      {flames.map(flame => (
        <FlameText key={flame.id} style={flame.style}>
          {flame.text}
        </FlameText>
      ))}
    </StyledBackground>
  );
};

export default FlamesBackground; 