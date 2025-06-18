import React, { useState, useEffect } from 'react';
import styled from '@emotion/styled';
import { keyframes } from '@emotion/react';

// Animation keyframes
const flameGlow = keyframes`
  0%, 100% {
    filter: drop-shadow(0 0 20px #ff9800) blur(0.5px);
    transform: scale(1);
  }
  50% {
    filter: drop-shadow(0 0 40px #ff6b35) blur(0.3px);
    transform: scale(1.05);
  }
`;

const progressFill = keyframes`
  from {
    width: 0%;
  }
  to {
    width: 100%;
  }
`;

const pulseText = keyframes`
  0%, 100% {
    opacity: 0.8;
    transform: translateY(0);
  }
  50% {
    opacity: 1;
    transform: translateY(-2px);
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

// Styled components
const LoadingContainer = styled.div`
  position: fixed;
  top: 0;
  left: 0;
  width: 100vw;
  height: 100vh;
  background: linear-gradient(135deg, #0c1426 0%, #1a1a2e 50%, #16213e 100%);
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  z-index: 9999;
  font-family: 'Inter', 'Segoe UI', Arial, sans-serif;
`;

const FlameIcon = styled.div`
  font-size: 6rem;
  margin-bottom: 2rem;
  animation: ${flameGlow} 2s ease-in-out infinite;
  user-select: none;
  
  @media (max-width: 768px) {
    font-size: 4rem;
    margin-bottom: 1.5rem;
  }
  
  @media (max-width: 480px) {
    font-size: 3rem;
    margin-bottom: 1rem;
  }
`;

const LoadingTitle = styled.h1`
  color: #ffffff;
  font-size: 2.5rem;
  font-weight: 700;
  margin-bottom: 0.5rem;
  background: linear-gradient(90deg, #ff9800 30%, #ff6b35 70%, #fff176 100%);
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
  background-clip: text;
  animation: ${pulseText} 2s ease-in-out infinite;
  
  @media (max-width: 768px) {
    font-size: 2rem;
  }
  
  @media (max-width: 480px) {
    font-size: 1.5rem;
  }
`;

const LoadingSubtitle = styled.p`
  color: #8696a0;
  font-size: 1.1rem;
  margin-bottom: 3rem;
  text-align: center;
  animation: ${pulseText} 2.5s ease-in-out infinite;
  
  @media (max-width: 768px) {
    font-size: 1rem;
    margin-bottom: 2rem;
  }
  
  @media (max-width: 480px) {
    font-size: 0.9rem;
    margin-bottom: 1.5rem;
  }
`;

const ProgressContainer = styled.div`
  width: 300px;
  height: 8px;
  background: rgba(255, 255, 255, 0.1);
  border-radius: 20px;
  overflow: hidden;
  position: relative;
  margin-bottom: 1rem;
  box-shadow: inset 0 2px 4px rgba(0, 0, 0, 0.2);
  
  @media (max-width: 768px) {
    width: 250px;
    height: 6px;
  }
  
  @media (max-width: 480px) {
    width: 200px;
    height: 6px;
  }
`;

const ProgressBar = styled.div`
  height: 100%;
  background: linear-gradient(90deg, #ff6b35, #ff9800, #ffb74d);
  border-radius: 20px;
  transition: width 0.3s ease;
  position: relative;
  box-shadow: 0 0 10px rgba(255, 152, 0, 0.5);
  
  &::after {
    content: '';
    position: absolute;
    top: 0;
    left: 0;
    right: 0;
    bottom: 0;
    background: linear-gradient(90deg, transparent, rgba(255, 255, 255, 0.3), transparent);
    animation: ${progressFill} 2s ease-in-out infinite;
  }
`;

const ProgressText = styled.div`
  color: #ff9800;
  font-size: 0.9rem;
  font-weight: 600;
  text-align: center;
  
  @media (max-width: 480px) {
    font-size: 0.8rem;
  }
`;

const SparkleContainer = styled.div`
  position: absolute;
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%);
  width: 100%;
  height: 100%;
  pointer-events: none;
`;

const Sparkle = styled.div`
  position: absolute;
  color: #ff9800;
  font-size: 1rem;
  animation: ${sparkle} 3s ease-in-out infinite;
  animation-delay: ${props => props.delay}s;
  top: ${props => props.top}%;
  left: ${props => props.left}%;
`;

const LoadingMessages = styled.div`
  position: absolute;
  bottom: 10%;
  left: 50%;
  transform: translateX(-50%);
  text-align: center;
  color: #8696a0;
  font-size: 0.9rem;
  animation: ${pulseText} 3s ease-in-out infinite;
  
  @media (max-width: 480px) {
    font-size: 0.8rem;
    bottom: 8%;
  }
`;

const LoadingScreen = ({ onComplete }) => {
  const [progress, setProgress] = useState(0);
  const [loadingMessage, setLoadingMessage] = useState('Initializing Flames...');

  const loadingMessages = [
    'Initializing Flames...',
    'Loading secure encryption...',
    'Setting up chat protocols...',
    'Preparing user interface...',
    'Almost ready...'
  ];

  // Sparkle positions for decorative effect
  const sparkles = [
    { top: 20, left: 15, delay: 0 },
    { top: 80, left: 85, delay: 0.5 },
    { top: 30, left: 75, delay: 1 },
    { top: 70, left: 25, delay: 1.5 },
    { top: 15, left: 60, delay: 2 },
    { top: 85, left: 40, delay: 2.5 }
  ];

  useEffect(() => {
    let progressInterval;
    let messageInterval;
    let messageIndex = 0;

    // Progress animation
    progressInterval = setInterval(() => {
      setProgress(prev => {
        if (prev >= 100) {
          clearInterval(progressInterval);
          // Call onComplete after a short delay
          setTimeout(() => {
            if (onComplete) onComplete();
          }, 500);
          return 100;
        }
        return prev + Math.random() * 15 + 5; // Random increment between 5-20
      });
    }, 200);

    // Loading message rotation
    messageInterval = setInterval(() => {
      messageIndex = (messageIndex + 1) % loadingMessages.length;
      setLoadingMessage(loadingMessages[messageIndex]);
    }, 800);

    return () => {
      clearInterval(progressInterval);
      clearInterval(messageInterval);
    };
  }, [onComplete]);

  return (
    <LoadingContainer>
      <SparkleContainer>
        {sparkles.map((sparkle, index) => (
          <Sparkle
            key={index}
            top={sparkle.top}
            left={sparkle.left}
            delay={sparkle.delay}
          >
            ✨
          </Sparkle>
        ))}
      </SparkleContainer>
      
      <FlameIcon>🔥</FlameIcon>
      <LoadingTitle>FLAMES</LoadingTitle>
      <LoadingSubtitle>Secure Messaging Platform</LoadingSubtitle>
      
      <ProgressContainer>
        <ProgressBar style={{ width: `${Math.min(progress, 100)}%` }} />
      </ProgressContainer>
      
      <ProgressText>{Math.round(Math.min(progress, 100))}%</ProgressText>
      
      <LoadingMessages>
        {loadingMessage}
      </LoadingMessages>
    </LoadingContainer>
  );
};

export default LoadingScreen;

