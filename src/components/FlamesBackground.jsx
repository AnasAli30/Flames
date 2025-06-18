import { useEffect, useState } from 'react';
import { FlamesBackground as StyledBackground, FlameText } from '../styles/StyledComponents';

const FlamesBackground = () => {
  const [flames, setFlames] = useState([]);

  useEffect(() => {
    const flameCount = 20;
    const newFlames = Array.from({ length: flameCount }, (_, i) => ({
      id: i,
      style: {
        top: `${Math.random() * 100}vh`,
        left: `${Math.random() * 100}vw`,
        animationDelay: `${Math.random() * 8}s, ${Math.random() * 4}s`,
        fontSize: `${16 + Math.random() * 24}px`
      }
    }));
    setFlames(newFlames);
  }, []);

  return (
    <StyledBackground>
      {flames.map(flame => (
        <FlameText key={flame.id} style={flame.style}>
          FLAME
        </FlameText>
      ))}
    </StyledBackground>
  );
};

export default FlamesBackground; 