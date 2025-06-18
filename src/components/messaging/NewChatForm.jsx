import { useState } from 'react';
import styled from '@emotion/styled';
import { keyframes } from '@emotion/react';
import { Input, Button } from '../../styles/StyledComponents';

const pulseGlow = keyframes`
  0%, 100% {
    box-shadow: 0 0 15px rgba(255, 152, 0, 0.3);
  }
  50% {
    box-shadow: 0 0 25px rgba(255, 152, 0, 0.5);
  }
`;

const FormContainer = styled.div`
  padding: 24px;
  background: linear-gradient(135deg, 
    rgba(15, 23, 42, 0.98) 0%, 
    rgba(30, 41, 59, 0.98) 50%,
    rgba(51, 65, 85, 0.98) 100%);
  border-bottom: 1px solid rgba(255, 152, 0, 0.2);
  backdrop-filter: blur(20px);
  position: relative;
  box-shadow: 
    inset 0 1px 0 rgba(255, 255, 255, 0.1),
    0 2px 10px rgba(0, 0, 0, 0.2);
  
  &::before {
    content: '';
    position: absolute;
    top: 0;
    left: 0;
    right: 0;
    bottom: 0;
    background: linear-gradient(135deg, 
      rgba(255, 152, 0, 0.03) 0%, 
      transparent 50%,
      rgba(255, 107, 53, 0.03) 100%);
    pointer-events: none;
  }
  
  &::after {
    content: '';
    position: absolute;
    bottom: 0;
    left: 0;
    right: 0;
    height: 1px;
    background: linear-gradient(90deg, 
      transparent, 
      rgba(255, 152, 0, 0.8), 
      transparent);
    opacity: 0.8;
    box-shadow: 0 1px 8px rgba(255, 152, 0, 0.3);
  }
  
  @media (max-width: 768px) {
    padding: 20px;
  }
  
  @media (max-width: 480px) {
    padding: 16px;
  }
`;

const FormTitle = styled.h3`
  color: #ff9800;
  font-size: 18px;
  font-weight: 600;
  margin-bottom: 16px;
  text-align: center;
  background: linear-gradient(90deg, #ff9800 30%, #ff6b35 70%, #fff176 100%);
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
  background-clip: text;
  text-shadow: 0 2px 8px rgba(255, 152, 0, 0.3);
  
  @media (max-width: 480px) {
    font-size: 16px;
    margin-bottom: 12px;
  }
`;

const Form = styled.form`
  display: flex;
  gap: 12px;
  align-items: flex-start;
  
  @media (max-width: 480px) {
    flex-direction: column;
    gap: 10px;
  }
`;

const StyledInput = styled(Input)`
  flex: 1;
  background: rgba(42, 47, 50, 0.8);
  border: 1px solid rgba(255, 152, 0, 0.3);
  color: #fff;
  padding: 14px 18px;
  border-radius: 12px;
  font-size: 15px;
  backdrop-filter: blur(10px);
  transition: all 0.3s ease;
  position: relative;
  z-index: 1;
  
  &::placeholder {
    color: rgba(255, 152, 0, 0.6);
  }

  &:focus {
    border-color: rgba(255, 152, 0, 0.8);
    background: rgba(50, 55, 57, 0.9);
    box-shadow: 0 0 20px rgba(255, 152, 0, 0.2);
    outline: none;
    transform: translateY(-1px);
  }
  
  &:hover {
    border-color: rgba(255, 152, 0, 0.5);
    background: rgba(46, 51, 54, 0.85);
  }
  
  @media (max-width: 480px) {
    width: 100%;
    padding: 12px 16px;
    font-size: 14px;
  }
`;

const StyledButton = styled(Button)`
  background: linear-gradient(135deg, #ff6b35 0%, #ff9800 100%);
  border: 2px solid rgba(255, 152, 0, 0.3);
  color: #fff;
  font-size: 15px;
  font-weight: 600;
  padding: 14px 24px;
  border-radius: 12px;
  transition: all 0.3s cubic-bezier(0.34, 1.56, 0.64, 1);
  position: relative;
  overflow: hidden;
  white-space: nowrap;
  min-width: 120px;
  
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
    background: linear-gradient(135deg, #ff8a50 0%, #ffb74d 100%);
    transform: translateY(-2px) scale(1.02);
    box-shadow: 0 8px 25px rgba(255, 152, 0, 0.4);
    animation: ${pulseGlow} 2s infinite;
    
    &::before {
      left: 100%;
    }
  }
  
  &:active {
    transform: translateY(-1px) scale(1.01);
    transition: all 0.1s;
  }
  
  @media (max-width: 480px) {
    width: 100%;
    padding: 12px 20px;
    font-size: 14px;
    min-width: auto;
  }
`;

const ErrorMessage = styled.div`
  background: rgba(255, 59, 48, 0.1);
  border: 1px solid rgba(255, 59, 48, 0.3);
  color: #ff6b6b;
  padding: 12px 16px;
  border-radius: 10px;
  font-size: 14px;
  margin-top: 12px;
  backdrop-filter: blur(10px);
  text-align: center;
  animation: slideIn 0.3s ease-out;
  
  @keyframes slideIn {
    from {
      opacity: 0;
      transform: translateY(-10px);
    }
    to {
      opacity: 1;
      transform: translateY(0);
    }
  }
  
  @media (max-width: 480px) {
    padding: 10px 14px;
    font-size: 13px;
  }
`;

const NewChatForm = ({ onStartChat, error }) => {
  const [code, setCode] = useState('');

  const handleSubmit = (e) => {
    e.preventDefault();
    if (code.trim()) {
      onStartChat(code.trim());
      setCode('');
    }
  };

  return (
    <FormContainer>
      <Form onSubmit={handleSubmit}>
        <StyledInput
          type="text"
          value={code}
          onChange={(e) => setCode(e.target.value)}
          placeholder="Enter recipient's code to start chat"
          required
        />
        <StyledButton type="submit">
          Start Chat
        </StyledButton>
      </Form>
      {error && <ErrorMessage>{error}</ErrorMessage>}
    </FormContainer>
  );
};

export default NewChatForm; 