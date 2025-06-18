import React, { useState, useEffect } from 'react';
import styled from '@emotion/styled';
import { keyframes } from '@emotion/react';

const slideIn = keyframes`
  from {
    opacity: 0;
    transform: translateX(100%) scale(0.95);
    filter: blur(4px);
  }
  to {
    opacity: 1;
    transform: translateX(0) scale(1);
    filter: blur(0);
  }
`;

const slideInMobile = keyframes`
  from {
    opacity: 0;
    transform: translateY(-100%) scale(0.9);
    filter: blur(4px);
  }
  to {
    opacity: 1;
    transform: translateY(0) scale(1);
    filter: blur(0);
  }
`;

const slideOut = keyframes`
  from {
    opacity: 1;
    transform: translateX(0) scale(1);
    filter: blur(0);
  }
  to {
    opacity: 0;
    transform: translateX(100%) scale(0.95);
    filter: blur(4px);
  }
`;

const slideOutMobile = keyframes`
  from {
    opacity: 1;
    transform: translateY(0) scale(1);
    filter: blur(0);
  }
  to {
    opacity: 0;
    transform: translateY(-100%) scale(0.9);
    filter: blur(4px);
  }
`;

const pulse = keyframes`
  0% {
    transform: scale(1);
  }
  50% {
    transform: scale(1.05);
  }
  100% {
    transform: scale(1);
  }
`;

const shimmer = keyframes`
  0% {
    background-position: -200% 0;
  }
  100% {
    background-position: 200% 0;
  }
`;

const float = keyframes`
  0%, 100% {
    transform: translateY(0px);
  }
  50% {
    transform: translateY(-3px);
  }
`;

const NotificationContainer = styled.div`
  position: fixed;
  top: 20px;
  right: 20px;
  z-index: 10000;
  display: flex;
  flex-direction: column;
  gap: 12px;
  max-width: 420px;
  width: 100%;
  pointer-events: none;
  
  /* Tablet styles */
  @media (max-width: 1024px) {
    max-width: 380px;
    top: 16px;
    right: 16px;
  }
  
  /* Mobile landscape */
  @media (max-width: 768px) {
    top: 12px;
    right: 12px;
    left: 12px;
    max-width: none;
    gap: 10px;
  }
  
  /* Mobile portrait */
  @media (max-width: 480px) {
    top: 8px;
    right: 8px;
    left: 8px;
    gap: 8px;
  }
  
  /* Ultra small screens */
  @media (max-width: 320px) {
    top: 4px;
    right: 4px;
    left: 4px;
    gap: 6px;
  }
`;

const NotificationItem = styled.div`
  position: relative;
  background: linear-gradient(135deg, 
    rgba(255, 255, 255, 0.15) 0%, 
    rgba(255, 255, 255, 0.08) 50%,
    rgba(255, 255, 255, 0.05) 100%);
  backdrop-filter: blur(25px) saturate(180%);
  border-radius: 18px;
  border: 1px solid ${props => {
    switch (props.type) {
      case 'success': return 'rgba(0, 212, 170, 0.6)';
      case 'error': return 'rgba(255, 107, 107, 0.6)';
      case 'warning': return 'rgba(255, 184, 77, 0.6)';
      default: return 'rgba(255, 152, 0, 0.4)';
    }
  }};
  padding: 18px 22px;
  color: white;
  box-shadow: 
    0 12px 40px rgba(0, 0, 0, 0.35),
    0 4px 16px rgba(0, 0, 0, 0.2),
    inset 0 1px 0 rgba(255, 255, 255, 0.2),
    0 0 30px ${props => {
      switch (props.type) {
        case 'success': return 'rgba(0, 212, 170, 0.25)';
        case 'error': return 'rgba(255, 107, 107, 0.25)';
        case 'warning': return 'rgba(255, 184, 77, 0.25)';
        default: return 'rgba(255, 152, 0, 0.25)';
      }
    }};
  animation: ${props => props.isLeaving ? slideOut : slideIn} 0.4s cubic-bezier(0.34, 1.56, 0.64, 1);
  display: flex;
  align-items: center;
  gap: 14px;
  cursor: pointer;
  transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
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
    transition: left 0.5s ease;
  }
  
  &:hover {
    transform: translateY(-3px) scale(1.02);
    box-shadow: 
      0 16px 50px rgba(0, 0, 0, 0.4),
      0 6px 20px rgba(0, 0, 0, 0.25),
      inset 0 1px 0 rgba(255, 255, 255, 0.3),
      0 0 40px ${props => {
        switch (props.type) {
          case 'success': return 'rgba(0, 212, 170, 0.35)';
          case 'error': return 'rgba(255, 107, 107, 0.35)';
          case 'warning': return 'rgba(255, 184, 77, 0.35)';
          default: return 'rgba(255, 152, 0, 0.35)';
        }
      }};
    
    &::before {
      left: 100%;
    }
  }
  
  &:active {
    transform: translateY(-1px) scale(0.98);
  }
`;

const NotificationIcon = styled.div`
  font-size: 24px;
  flex-shrink: 0;
  display: flex;
  align-items: center;
  justify-content: center;
  width: 40px;
  height: 40px;
  border-radius: 50%;
  background: ${props => {
    switch (props.type) {
      case 'success': return 'linear-gradient(135deg, rgba(0, 212, 170, 0.2), rgba(0, 212, 170, 0.1))';
      case 'error': return 'linear-gradient(135deg, rgba(255, 107, 107, 0.2), rgba(255, 107, 107, 0.1))';
      case 'warning': return 'linear-gradient(135deg, rgba(255, 184, 77, 0.2), rgba(255, 184, 77, 0.1))';
      default: return 'linear-gradient(135deg, rgba(255, 152, 0, 0.2), rgba(255, 152, 0, 0.1))';
    }
  }};
  border: 1px solid ${props => {
    switch (props.type) {
      case 'success': return 'rgba(0, 212, 170, 0.3)';
      case 'error': return 'rgba(255, 107, 107, 0.3)';
      case 'warning': return 'rgba(255, 184, 77, 0.3)';
      default: return 'rgba(255, 152, 0, 0.3)';
    }
  }};
  animation: ${pulse} 2s ease-in-out infinite;
  box-shadow: 0 4px 12px ${props => {
    switch (props.type) {
      case 'success': return 'rgba(0, 212, 170, 0.15)';
      case 'error': return 'rgba(255, 107, 107, 0.15)';
      case 'warning': return 'rgba(255, 184, 77, 0.15)';
      default: return 'rgba(255, 152, 0, 0.15)';
    }
  }};
`;

const NotificationContent = styled.div`
  flex: 1;
  display: flex;
  flex-direction: column;
  gap: 2px;
`;

const NotificationTitle = styled.div`
  font-weight: 700;
  font-size: 15px;
  margin-bottom: 2px;
  background: linear-gradient(45deg, #ffffff, #f0f0f0);
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
  background-clip: text;
  text-shadow: 0 1px 2px rgba(0, 0, 0, 0.1);
`;

const NotificationMessage = styled.div`
  font-size: 13px;
  opacity: 0.92;
  line-height: 1.5;
  color: rgba(255, 255, 255, 0.95);
  text-shadow: 0 1px 2px rgba(0, 0, 0, 0.1);
`;

const CloseButton = styled.button`
  background: rgba(255, 255, 255, 0.1);
  border: 1px solid rgba(255, 255, 255, 0.2);
  color: white;
  cursor: pointer;
  padding: 8px;
  border-radius: 50%;
  opacity: 0.8;
  transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
  display: flex;
  align-items: center;
  justify-content: center;
  width: 28px;
  height: 28px;
  font-size: 14px;
  font-weight: 600;
  flex-shrink: 0;
  backdrop-filter: blur(10px);
  
  &:hover {
    opacity: 1;
    background: rgba(255, 255, 255, 0.2);
    border-color: rgba(255, 255, 255, 0.4);
    transform: scale(1.1) rotate(90deg);
    box-shadow: 0 4px 12px rgba(0, 0, 0, 0.2);
  }
  
  &:active {
    transform: scale(0.95) rotate(90deg);
  }
`;

const ProgressBar = styled.div`
  position: absolute;
  bottom: 0;
  left: 0;
  height: 3px;
  background: linear-gradient(90deg, 
    ${props => {
      switch (props.type) {
        case 'success': return 'rgba(0, 212, 170, 0.9), rgba(0, 212, 170, 0.6)';
        case 'error': return 'rgba(255, 107, 107, 0.9), rgba(255, 107, 107, 0.6)';
        case 'warning': return 'rgba(255, 184, 77, 0.9), rgba(255, 184, 77, 0.6)';
        default: return 'rgba(255, 152, 0, 0.9), rgba(255, 152, 0, 0.6)';
      }
    }}
  );
  width: ${props => props.progress}%;
  transition: width 0.1s linear;
  border-radius: 0 0 18px 18px;
  box-shadow: 0 0 10px ${props => {
    switch (props.type) {
      case 'success': return 'rgba(0, 212, 170, 0.3)';
      case 'error': return 'rgba(255, 107, 107, 0.3)';
      case 'warning': return 'rgba(255, 184, 77, 0.3)';
      default: return 'rgba(255, 152, 0, 0.3)';
    }
  }};
  
  &::after {
    content: '';
    position: absolute;
    top: 0;
    right: 0;
    width: 20px;
    height: 100%;
    background: linear-gradient(90deg, transparent, rgba(255, 255, 255, 0.3));
    border-radius: 0 0 18px 0;
  }
`;

const getNotificationIcon = (type) => {
  switch (type) {
    case 'success': return '✅';
    case 'error': return '❌';
    case 'warning': return '⚠️';
    default: return '🔥';
  }
};

const getNotificationTitle = (type) => {
  switch (type) {
    case 'success': return 'Success';
    case 'error': return 'Error';
    case 'warning': return 'Warning';
    default: return 'Info';
  }
};

const NotificationSystem = () => {
  const [notifications, setNotifications] = useState([]);

  useEffect(() => {
    // Listen for custom notification events
    const handleNotification = (event) => {
      const { type, message, duration = 5000 } = event.detail;
      const id = Date.now() + Math.random();
      
      const notification = {
        id,
        type,
        message,
        duration,
        progress: 100,
        isLeaving: false
      };
      
      setNotifications(prev => [...prev, notification]);
      
      // Auto-remove notification
      const startTime = Date.now();
      const interval = setInterval(() => {
        const elapsed = Date.now() - startTime;
        const progress = Math.max(0, 100 - (elapsed / duration) * 100);
        
        setNotifications(prev => 
          prev.map(n => 
            n.id === id ? { ...n, progress } : n
          )
        );
        
        if (progress <= 0) {
          clearInterval(interval);
          removeNotification(id);
        }
      }, 50);
    };

    window.addEventListener('notification', handleNotification);
    return () => window.removeEventListener('notification', handleNotification);
  }, []);

  const removeNotification = (id) => {
    setNotifications(prev => 
      prev.map(n => 
        n.id === id ? { ...n, isLeaving: true } : n
      )
    );
    
    setTimeout(() => {
      setNotifications(prev => prev.filter(n => n.id !== id));
    }, 300);
  };

  return (
    <NotificationContainer>
      {notifications.map(notification => (
        <NotificationItem
          key={notification.id}
          type={notification.type}
          isLeaving={notification.isLeaving}
          onClick={() => removeNotification(notification.id)}
        >
          <NotificationIcon type={notification.type}>
            {getNotificationIcon(notification.type)}
          </NotificationIcon>
          <NotificationContent>
            <NotificationTitle>
              {getNotificationTitle(notification.type)}
            </NotificationTitle>
            <NotificationMessage>
              {notification.message}
            </NotificationMessage>
          </NotificationContent>
          <CloseButton onClick={(e) => {
            e.stopPropagation();
            removeNotification(notification.id);
          }}>
            ×
          </CloseButton>
          <ProgressBar 
            type={notification.type} 
            progress={notification.progress} 
          />
        </NotificationItem>
      ))}
    </NotificationContainer>
  );
};

// Helper function to show notifications
export const showNotification = (type, message, duration) => {
  window.dispatchEvent(new CustomEvent('notification', {
    detail: { type, message, duration }
  }));
};

export default NotificationSystem;

