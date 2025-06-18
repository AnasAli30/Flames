import { useEffect, useState, useMemo } from 'react';
import styled from '@emotion/styled';
import { keyframes } from '@emotion/react';
import { FloatingParticle, WaveBackground } from '../styles/ModernTheme';

// Enhanced animations
const float = keyframes`
  0%, 100% { 
    transform: translateY(0px) rotate(0deg) scale(1); 
    opacity: 0.3;
  }
  25% { 
    transform: translateY(-30px) rotate(90deg) scale(1.1); 
    opacity: 0.7;
  }
  50% { 
    transform: translateY(-15px) rotate(180deg) scale(0.9); 
    opacity: 0.5;
  }
  75% { 
    transform: translateY(-40px) rotate(270deg) scale(1.2); 
    opacity: 0.8;
  }
`;

const glow = keyframes`
  0%, 100% { 
    filter: brightness(1) blur(0px) drop-shadow(0 0 10px rgba(255, 152, 0, 0.3)); 
  }
  50% { 
    filter: brightness(1.5) blur(1px) drop-shadow(0 0 20px rgba(255, 152, 0, 0.6)); 
  }
`;

const pulse = keyframes`
  0%, 100% { 
    transform: scale(1); 
    opacity: 0.4;
  }
  50% { 
    transform: scale(1.05); 
    opacity: 0.8;
  }
`;

const sparkle = keyframes`
  0% {
    opacity: 0;
    transform: scale(0) rotate(0deg);
  }
  50% {
    opacity: 1;
    transform: scale(1) rotate(180deg);
  }
  100% {
    opacity: 0;
    transform: scale(0) rotate(360deg);
  }
`;

const BackgroundContainer = styled.div`
  position: fixed;
  top: 0;
  left: 0;
  width: 100vw;
  height: 100vh;
  pointer-events: none;
  z-index: 0;
  overflow: hidden;
  background: linear-gradient(135deg, 
    rgba(12, 20, 38, 1) 0%, 
    rgba(26, 26, 46, 1) 35%,
    rgba(22, 33, 62, 1) 70%,
    rgba(15, 23, 42, 1) 100%);
`;

const FlameElement = styled.div`
  position: absolute;
  color: ${props => props.color || '#ff9800'};
  font-size: ${props => props.size || 20}px;
  opacity: ${props => props.opacity || 0.3};
  animation: ${float} ${props => props.duration || 8}s infinite linear,
             ${glow} ${props => props.glowDuration || 4}s infinite ease-in-out;
  user-select: none;
  transform: rotate(${props => props.rotation || 0}deg);
  filter: blur(${props => props.blur || 0}px);
  transition: all 0.3s ease;
  animation-delay: ${props => props.delay || 0}s;
  top: ${props => props.top}%;
  left: ${props => props.left}%;
  
  &:hover {
    animation-play-state: paused;
    transform: scale(1.2) rotate(${props => (props.rotation || 0) + 45}deg);
    opacity: 0.9;
  }
`;

const Sparkle = styled.div`
  position: absolute;
  color: #fff176;
  font-size: 12px;
  animation: ${sparkle} 3s ease-in-out infinite;
  animation-delay: ${props => props.delay}s;
  top: ${props => props.top}%;
  left: ${props => props.left}%;
  opacity: 0.6;
`;

const FloatingOrb = styled.div`
  position: absolute;
  width: ${props => props.size}px;
  height: ${props => props.size}px;
  border-radius: 50%;
  background: radial-gradient(circle, 
    rgba(255, 152, 0, 0.4) 0%, 
    rgba(255, 107, 53, 0.2) 50%,
    transparent 100%);
  animation: ${pulse} ${props => props.duration}s infinite ease-in-out;
  animation-delay: ${props => props.delay}s;
  top: ${props => props.top}%;
  left: ${props => props.left}%;
  filter: blur(1px);
`;

const GradientOverlay = styled.div`
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  background: radial-gradient(circle at 50% 50%, 
    transparent 0%,
    rgba(255, 152, 0, 0.02) 30%,
    rgba(255, 107, 53, 0.03) 60%,
    rgba(12, 20, 38, 0.1) 100%);
  pointer-events: none;
`;

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

  // Enhanced flames with modern effects
  const flames = useMemo(() => {
    const getFlameCount = () => {
      if (dimensions.width < 480) return 4;
      if (dimensions.width < 768) return 6;
      if (dimensions.width < 1200) return 8;
      return 12;
    };

    const flameCount = getFlameCount();
    const flameTexts = ['🔥', '✨', '💫'];
    
    return Array.from({ length: flameCount }, (_, i) => ({
      id: i,
      text: flameTexts[i % flameTexts.length],
      color: i % 3 === 0 ? '#ff9800' : i % 3 === 1 ? '#ff6b35' : '#fff176',
      size: Math.random() * 15 + 15,
      opacity: Math.random() * 0.3 + 0.1,
      duration: Math.random() * 6 + 8,
      glowDuration: Math.random() * 3 + 3,
      rotation: Math.random() * 360,
      blur: Math.random() * 1,
      delay: Math.random() * 5,
      top: Math.random() * 100,
      left: Math.random() * 100
    }));
  }, [dimensions]);

  // Sparkles
  const sparkles = useMemo(() => {
    const sparkleCount = dimensions.width < 768 ? 8 : 15;
    return Array.from({ length: sparkleCount }, (_, i) => ({
      id: `sparkle-${i}`,
      delay: Math.random() * 3,
      top: Math.random() * 100,
      left: Math.random() * 100
    }));
  }, [dimensions]);

  // Floating orbs
  const orbs = useMemo(() => {
    const orbCount = dimensions.width < 768 ? 4 : 8;
    return Array.from({ length: orbCount }, (_, i) => ({
      id: `orb-${i}`,
      size: Math.random() * 30 + 20,
      duration: Math.random() * 4 + 4,
      delay: Math.random() * 3,
      top: Math.random() * 100,
      left: Math.random() * 100
    }));
  }, [dimensions]);

  // Floating particles
  const particles = useMemo(() => {
    const particleCount = dimensions.width < 768 ? 10 : 20;
    return Array.from({ length: particleCount }, (_, i) => ({
      id: `particle-${i}`,
      delay: Math.random() * 5,
      left: Math.random() * 100
    }));
  }, [dimensions]);

  return (
    <BackgroundContainer>
      <WaveBackground />
      <GradientOverlay />
      
      {flames.map(flame => (
        <FlameElement
          key={flame.id}
          color={flame.color}
          size={flame.size}
          opacity={flame.opacity}
          duration={flame.duration}
          glowDuration={flame.glowDuration}
          rotation={flame.rotation}
          blur={flame.blur}
          delay={flame.delay}
          top={flame.top}
          left={flame.left}
        >
          {flame.text}
        </FlameElement>
      ))}
      
      {sparkles.map(sparkle => (
        <Sparkle
          key={sparkle.id}
          delay={sparkle.delay}
          top={sparkle.top}
          left={sparkle.left}
        >
          ✨
        </Sparkle>
      ))}
      
      {orbs.map(orb => (
        <FloatingOrb
          key={orb.id}
          size={orb.size}
          duration={orb.duration}
          delay={orb.delay}
          top={orb.top}
          left={orb.left}
        />
      ))}
      
      {particles.map(particle => (
        <FloatingParticle
          key={particle.id}
          delay={particle.delay}
          left={particle.left}
        />
      ))}
    </BackgroundContainer>
  );
};

export default FlamesBackground; 