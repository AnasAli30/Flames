import styled from '@emotion/styled';
import { keyframes } from '@emotion/react';

// Advanced animations
export const shimmer = keyframes`
  0% {
    background-position: -468px 0;
  }
  100% {
    background-position: 468px 0;
  }
`;

export const floatUp = keyframes`
  0% {
    transform: translateY(0px);
    opacity: 1;
  }
  100% {
    transform: translateY(-20px);
    opacity: 0;
  }
`;

export const ripple = keyframes`
  to {
    transform: scale(4);
    opacity: 0;
  }
`;

export const breathe = keyframes`
  0%, 100% {
    transform: scale(1);
    filter: brightness(1);
  }
  50% {
    transform: scale(1.02);
    filter: brightness(1.1);
  }
`;

export const slideInFromBottom = keyframes`
  from {
    opacity: 0;
    transform: translateY(30px);
  }
  to {
    opacity: 1;
    transform: translateY(0);
  }
`;

export const gradientShift = keyframes`
  0% {
    background-position: 0% 50%;
  }
  50% {
    background-position: 100% 50%;
  }
  100% {
    background-position: 0% 50%;
  }
`;

// Modern UI Components
export const GlassCard = styled.div`
  background: linear-gradient(135deg, 
    rgba(255, 255, 255, 0.1) 0%, 
    rgba(255, 255, 255, 0.05) 100%);
  backdrop-filter: blur(20px);
  border-radius: 20px;
  border: 1px solid rgba(255, 255, 255, 0.2);
  box-shadow: 
    0 8px 32px rgba(0, 0, 0, 0.3),
    inset 0 1px 0 rgba(255, 255, 255, 0.2);
  position: relative;
  overflow: hidden;
  
  &::before {
    content: '';
    position: absolute;
    top: 0;
    left: -100%;
    width: 100%;
    height: 100%;
    background: linear-gradient(
      90deg,
      transparent,
      rgba(255, 255, 255, 0.1),
      transparent
    );
    transition: left 0.8s;
  }
  
  &:hover::before {
    left: 100%;
  }
`;

export const NeonButton = styled.button`
  background: linear-gradient(135deg, #ff6b35 0%, #ff9800 100%);
  border: none;
  border-radius: 50px;
  color: white;
  font-weight: 600;
  padding: 12px 24px;
  cursor: pointer;
  position: relative;
  overflow: hidden;
  transition: all 0.3s ease;
  box-shadow: 
    0 0 20px rgba(255, 152, 0, 0.3),
    0 4px 15px rgba(0, 0, 0, 0.2);
  
  &::before {
    content: '';
    position: absolute;
    top: 50%;
    left: 50%;
    width: 0;
    height: 0;
    background: rgba(255, 255, 255, 0.2);
    border-radius: 50%;
    transform: translate(-50%, -50%);
    transition: all 0.3s ease;
  }
  
  &:hover {
    transform: translateY(-2px);
    box-shadow: 
      0 0 30px rgba(255, 152, 0, 0.5),
      0 8px 25px rgba(0, 0, 0, 0.3);
    
    &::before {
      width: 300px;
      height: 300px;
    }
  }
  
  &:active {
    transform: translateY(0);
  }
`;

export const FloatingParticle = styled.div`
  position: absolute;
  width: 4px;
  height: 4px;
  background: radial-gradient(circle, #ff9800, transparent);
  border-radius: 50%;
  animation: ${floatUp} 3s infinite linear;
  animation-delay: ${props => props.delay}s;
  left: ${props => props.left}%;
  opacity: 0.7;
`;

export const ModernInput = styled.input`
  background: rgba(15, 23, 42, 0.8);
  border: 2px solid transparent;
  border-radius: 15px;
  color: white;
  font-size: 16px;
  padding: 16px 20px;
  width: 100%;
  transition: all 0.3s ease;
  backdrop-filter: blur(10px);
  
  &::placeholder {
    color: rgba(255, 152, 0, 0.6);
  }
  
  &:focus {
    outline: none;
    border-color: #ff9800;
    background: rgba(30, 41, 59, 0.9);
    box-shadow: 
      0 0 0 4px rgba(255, 152, 0, 0.1),
      0 0 20px rgba(255, 152, 0, 0.2);
    transform: translateY(-2px);
  }
  
  &:hover {
    border-color: rgba(255, 152, 0, 0.5);
  }
`;

export const PulseLoader = styled.div`
  display: inline-block;
  width: 40px;
  height: 40px;
  position: relative;
  
  &::before,
  &::after {
    content: '';
    position: absolute;
    border: 2px solid #ff9800;
    border-radius: 50%;
    opacity: 1;
    animation: ${breathe} 1s infinite;
  }
  
  &::before {
    width: 100%;
    height: 100%;
    animation-delay: 0s;
  }
  
  &::after {
    width: 80%;
    height: 80%;
    top: 10%;
    left: 10%;
    animation-delay: 0.5s;
  }
`;

export const StatusIndicator = styled.div`
  width: 12px;
  height: 12px;
  border-radius: 50%;
  background: ${props => {
    switch (props.status) {
      case 'online': return '#00d4aa';
      case 'away': return '#ffb84d';
      case 'busy': return '#ff6b6b';
      default: return '#8696a0';
    }
  }};
  box-shadow: 0 0 10px ${props => {
    switch (props.status) {
      case 'online': return 'rgba(0, 212, 170, 0.5)';
      case 'away': return 'rgba(255, 184, 77, 0.5)';
      case 'busy': return 'rgba(255, 107, 107, 0.5)';
      default: return 'rgba(134, 150, 160, 0.3)';
    }
  }};
  animation: ${breathe} 2s infinite;
`;

export const GradientText = styled.span`
  background: linear-gradient(135deg, #ff9800 0%, #ff6b35 50%, #fff176 100%);
  background-size: 200% 200%;
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
  background-clip: text;
  animation: ${gradientShift} 3s ease infinite;
  font-weight: 700;
`;

export const FloatingActionButton = styled.button`
  position: fixed;
  bottom: 30px;
  right: 30px;
  width: 60px;
  height: 60px;
  border-radius: 50%;
  background: linear-gradient(135deg, #ff6b35 0%, #ff9800 100%);
  border: none;
  color: white;
  font-size: 24px;
  cursor: pointer;
  box-shadow: 
    0 4px 20px rgba(255, 152, 0, 0.4),
    0 0 0 0 rgba(255, 152, 0, 0.7);
  transition: all 0.3s ease;
  z-index: 1000;
  
  &:hover {
    transform: scale(1.1);
    box-shadow: 
      0 8px 25px rgba(255, 152, 0, 0.6),
      0 0 0 10px rgba(255, 152, 0, 0.1);
  }
  
  &:active {
    animation: ${ripple} 0.6s ease-out;
  }
`;

export const ProgressRing = styled.div`
  width: 50px;
  height: 50px;
  border-radius: 50%;
  background: conic-gradient(
    from 0deg,
    #ff9800 0deg,
    #ff6b35 ${props => props.progress * 3.6}deg,
    rgba(255, 255, 255, 0.1) ${props => props.progress * 3.6}deg
  );
  display: flex;
  align-items: center;
  justify-content: center;
  position: relative;
  
  &::before {
    content: '${props => props.progress}%';
    position: absolute;
    color: white;
    font-weight: 600;
    font-size: 12px;
  }
`;

export const ModernScrollbar = styled.div`
  /* Custom scrollbar styles */
  &::-webkit-scrollbar {
    width: 8px;
  }
  
  &::-webkit-scrollbar-track {
    background: rgba(15, 23, 42, 0.5);
    border-radius: 10px;
  }
  
  &::-webkit-scrollbar-thumb {
    background: linear-gradient(135deg, #ff6b35, #ff9800);
    border-radius: 10px;
    transition: all 0.3s ease;
  }
  
  &::-webkit-scrollbar-thumb:hover {
    background: linear-gradient(135deg, #ff8a50, #ffb74d);
    box-shadow: 0 0 10px rgba(255, 152, 0, 0.5);
  }
`;

export const NotificationToast = styled.div`
  position: fixed;
  top: 20px;
  right: 20px;
  background: linear-gradient(135deg, 
    rgba(255, 255, 255, 0.1) 0%, 
    rgba(255, 255, 255, 0.05) 100%);
  backdrop-filter: blur(20px);
  border-radius: 15px;
  border: 1px solid rgba(255, 152, 0, 0.3);
  padding: 16px 20px;
  color: white;
  box-shadow: 
    0 8px 32px rgba(0, 0, 0, 0.3),
    0 0 20px rgba(255, 152, 0, 0.2);
  animation: ${slideInFromBottom} 0.5s ease-out;
  z-index: 2000;
  max-width: 300px;
  
  &.success {
    border-color: rgba(0, 212, 170, 0.5);
    box-shadow: 
      0 8px 32px rgba(0, 0, 0, 0.3),
      0 0 20px rgba(0, 212, 170, 0.2);
  }
  
  &.error {
    border-color: rgba(255, 107, 107, 0.5);
    box-shadow: 
      0 8px 32px rgba(0, 0, 0, 0.3),
      0 0 20px rgba(255, 107, 107, 0.2);
  }
`;

export const WaveBackground = styled.div`
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  background: linear-gradient(135deg, 
    rgba(255, 152, 0, 0.05) 0%,
    rgba(255, 107, 53, 0.05) 50%,
    rgba(255, 152, 0, 0.05) 100%);
  background-size: 400% 400%;
  animation: ${gradientShift} 8s ease infinite;
  z-index: -1;
`;

