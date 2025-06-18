import styled from '@emotion/styled';
import { keyframes } from '@emotion/react';

export const flameRotate = keyframes`
  0%   { transform: rotate(0deg) translateY(0px); opacity: 0.7; }
  50%  { transform: rotate(180deg) translateY(-8px); opacity: 0.9; }
  100% { transform: rotate(360deg) translateY(0px); opacity: 0.7; }
`;

export const flameGlow = keyframes`
  0%, 100% {
    text-shadow: 0 0 20px rgba(255, 152, 0, 0.4);
  }
  50% {
    text-shadow: 0 0 30px rgba(255, 152, 0, 0.6);
  }
`;

export const pulseGlow = keyframes`
  0%, 100% {
    box-shadow: 0 0 20px rgba(255, 152, 0, 0.2);
  }
  50% {
    box-shadow: 0 0 30px rgba(255, 152, 0, 0.3);
  }
`;

export const slideInFromLeft = keyframes`
  from {
    transform: translateX(-100%);
    opacity: 0;
  }
  to {
    transform: translateX(0);
    opacity: 1;
  }
`;

export const slideInFromRight = keyframes`
  from {
    transform: translateX(100%);
    opacity: 0;
  }
  to {
    transform: translateX(0);
    opacity: 1;
  }
`;

export const fadeIn = keyframes`
  from { opacity: 0; transform: translateY(30px); }
  to { opacity: 1; transform: translateY(0); }
`;

export const Container = styled.div`
  position: relative;
  z-index: 2;
  margin: 0 auto;
  max-width: 1400px;
  width: 100%;
  padding: 20px;
  
  @media (max-width: 768px) {
    padding: 15px;
  }
  
  @media (max-width: 480px) {
    padding: 10px;
  }
`;

export const FlamesBackground = styled.div`
  position: fixed;
  width: 100vw;
  height: 100vh;
  z-index: 0;
  pointer-events: none;
  overflow: hidden;
  will-change: transform;
`;

export const FlameText = styled.div`
  position: absolute;
  color: #ff9800cc;
  font-size: 2.5vw;
  font-weight: bold;
  opacity: 0.12;
  user-select: none;
  filter: blur(0.5px);
  animation: ${flameRotate} 8s linear infinite;
  transform-origin: center center;
`;

export const Title = styled.h1`
  color: #ff9800;
  letter-spacing: 0.2em;
  margin-bottom: 0.2em;
  font-size: 2.2rem;
`;

export const Subtitle = styled.h2`
  color: #fff;
  font-size: 1.2rem;
  margin-bottom: 1.2em;
  font-weight: 400;
`;

export const Form = styled.form`
  display: flex;
  flex-direction: column;
  gap: 1.1em;
`;

export const Input = styled.input`
  padding: 0.8em 1em;
  border: none;
  border-radius: 8px;
  background: #232323;
  color: #fff;
  font-size: 1rem;
  transition: background 0.2s;
  outline: none;

  &:focus {
    background: #292929;
  }
`;

export const Button = styled.button`
  background: linear-gradient(90deg, #ff9800 60%, #ff5722 100%);
  color: #fff;
  border: none;
  border-radius: 12px;
  padding: 0.9em 1.8em;
  font-size: 1.1rem;
  font-weight: 600;
  cursor: pointer;
  box-shadow: 
    0 4px 12px rgba(255, 152, 0, 0.3),
    0 2px 6px rgba(0, 0, 0, 0.2);
  transition: all 0.3s cubic-bezier(0.34, 1.56, 0.64, 1);
  width: ${props => props.fullWidth ? '100%' : 'auto'};
  position: relative;
  overflow: hidden;
  
  &::before {
    content: '';
    position: absolute;
    top: 0;
    left: -100%;
    width: 100%;
    height: 100%;
    background: linear-gradient(90deg, transparent, rgba(255, 255, 255, 0.2), transparent);
    transition: left 0.5s;
  }

  &:hover {
    background: linear-gradient(90deg, #ffb300 60%, #ff7043 100%);
    transform: translateY(-2px) scale(1.05);
    box-shadow: 
      0 8px 20px rgba(255, 152, 0, 0.4),
      0 4px 12px rgba(0, 0, 0, 0.3);
      
    &::before {
      left: 100%;
    }
  }
  
  &:active {
    transform: translateY(-1px) scale(1.03);
    transition: all 0.1s;
  }
`;

export const ToggleLink = styled.p`
  margin-top: 1.2em;
  font-size: 0.98em;

  a {
    color: #ff9800;
    text-decoration: none;
    transition: color 0.15s;

    &:hover {
      color: #fff;
      text-decoration: underline;
    }
  }
`;

export const Feedback = styled.div`
  margin-top: 1em;
  color: ${props => props.isError ? '#ff4444' : '#ff9800'};
`;

export const Dashboard = styled.div`
  margin-top: 2em;
  text-align: left;
  width: 100%;
`;

export const MessagesList = styled.div`
  margin-top: 1em;
  max-height: 300px;
  overflow-y: auto;
  padding: 1em;
  background: #232323;
  border-radius: 8px;
  width: 100%;
`;

export const Message = styled.div`
  margin-bottom: 1em;
  padding: 1em;
  background: #292929;
  border-radius: 6px;
  color: #fff;
  
  &:last-child {
    margin-bottom: 0;
  }

  div {
    margin-bottom: 0.5em;
    &:last-child {
      margin-bottom: 0;
      font-size: 0.9em;
      color: #999;
    }
  }
`;

export const SrOnly = styled.span`
  position: absolute;
  width: 1px;
  height: 1px;
  padding: 0;
  margin: -1px;
  overflow: hidden;
  clip: rect(0, 0, 0, 0);
  border: 0;
`; 