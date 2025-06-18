import { useState } from 'react';
import styled from '@emotion/styled';
import { keyframes } from '@emotion/react';
import {
  Form,
  Input,
  Button,
  Feedback,
  SrOnly
} from '../../styles/StyledComponents';

// Fun flame bounce animation
const flameBounce = keyframes`
  0%, 100% { transform: translateY(0); }
  50% { transform: translateY(-8px) scale(1.1); }
`;

// Glassmorphism card
const GlassCard = styled.div`
  background: rgba(30, 30, 30, 0.85);
  border-radius: 24px;
  box-shadow: 0 8px 32px 0 rgba(255,152,0,0.18), 0 1.5px 8px 0 #ff980055;
  backdrop-filter: blur(16px);
  border: 1.5px solid rgba(255,152,0,0.18);
  padding: 2.5rem 2rem 2rem 2rem;
  max-width: 410px;
  margin: 3.5rem auto 0 auto;
  width: 95vw;
  display: flex;
  flex-direction: column;
  align-items: center;
  animation: fadeIn 0.8s cubic-bezier(.77,0,.18,1) both;

  @media (max-width: 600px) {
    padding: 1.5rem 0.7rem 1.2rem 0.7rem;
    max-width: 98vw;
  }
`;

const AnimatedTitle = styled.h2`
  font-size: 2.2rem;
  font-weight: 800;
  letter-spacing: 0.04em;
  margin-bottom: 0.2em;
  background: linear-gradient(90deg, #ff9800 30%, #ff6b35 70%, #fff176 100%);
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
  display: flex;
  align-items: center;
  gap: 0.5em;
  animation: ${flameBounce} 2.2s infinite;
  user-select: none;
  text-shadow: 0 2px 16px #ff980044;

  .flame {
    font-size: 1.5em;
    animation: ${flameBounce} 1.2s infinite;
    filter: drop-shadow(0 0 8px #ff9800cc);
  }

  @media (max-width: 600px) {
    font-size: 1.3rem;
  }
`;

const FunSubtitle = styled.p`
  color: #ff9800;
  font-size: 1.08rem;
  margin-bottom: 1.5em;
  font-weight: 500;
  text-align: center;
  letter-spacing: 0.01em;
  opacity: 0.92;
  text-shadow: 0 1px 8px #ff980033;
  @media (max-width: 600px) {
    font-size: 0.98rem;
    margin-bottom: 1em;
  }
`;

const InputGroup = styled.div`
  width: 100%;
  margin-bottom: 1.1em;
  position: relative;
`;

const FunInput = styled(Input)`
  width: 100%;
  padding: 1.1em 1.1em;
  border-radius: 12px;
  background: rgba(35,35,35,0.92);
  color: #fff;
  font-size: 1.08rem;
  border: 2px solid transparent;
  box-shadow: 0 2px 12px #ff980022;
  transition: border 0.22s, box-shadow 0.22s, background 0.22s, transform 0.18s;
  outline: none;

  &:focus {
    border: 2px solid #ff9800;
    box-shadow: 0 0 0 3px #ff980044, 0 2px 12px #ff980044;
    background: rgba(35,35,35,0.98);
    transform: scale(1.03);
  }

  &::placeholder {
    color: #ff9800bb;
    opacity: 0.7;
    font-size: 1em;
  }
`;

const AnimatedButton = styled(Button)`
  width: 100%;
  padding: 1.1em 0;
  font-size: 1.15rem;
  border-radius: 14px;
  background: linear-gradient(90deg, #ff9800 60%, #ff5722 100%);
  font-weight: 700;
  letter-spacing: 0.04em;
  margin-top: 0.7em;
  box-shadow: 0 4px 18px #ff980044;
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 0.7em;
  transition: background 0.18s, transform 0.13s, box-shadow 0.18s;
  animation: ${flameBounce} 2.5s infinite;

  &:hover {
    background: linear-gradient(90deg, #ffb300 60%, #ff7043 100%);
    transform: scale(1.04) translateY(-2px);
    box-shadow: 0 8px 24px #ff980066;
  }
`;

const ErrorMessage = styled(Feedback)`
  background: rgba(255, 59, 48, 0.1);
  border: 1px solid rgba(255, 59, 48, 0.2);
  color: #ff3b30;
  padding: 12px;
  border-radius: 8px;
  font-size: 14px;
  margin-top: 10px;
  backdrop-filter: blur(10px);
  width: 100%;
  text-align: center;
  @media (max-width: 480px) {
    padding: 10px;
    font-size: 12px;
  }
`;

const SignupForm = ({ onSubmit, error }) => {
  const [formData, setFormData] = useState({
    email: '',
    phone: '',
    password: '',
    confirmPassword: ''
  });

  const handleSubmit = (e) => {
    e.preventDefault();
    if (formData.password !== formData.confirmPassword) {
      return;
    }
    onSubmit(formData);
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  return (
    <GlassCard>
      <AnimatedTitle>
        <span className="flame">🔥</span> Sign Up
      </AnimatedTitle>
      <FunSubtitle>Start your fiery journey! <span role="img" aria-label="sparkles">✨</span></FunSubtitle>
      <Form onSubmit={handleSubmit} style={{ width: '100%' }}>
        <InputGroup>
          <SrOnly>Email</SrOnly>
          <FunInput
            type="email"
            name="email"
            placeholder="Enter your email"
            value={formData.email}
            onChange={handleChange}
            required
            autoComplete="email"
          />
        </InputGroup>
        <InputGroup>
          <SrOnly>Phone</SrOnly>
          <FunInput
            type="tel"
            name="phone"
            placeholder="Your phone number"
            value={formData.phone}
            onChange={handleChange}
            required
            autoComplete="tel"
          />
        </InputGroup>
        <InputGroup>
          <SrOnly>Password</SrOnly>
          <FunInput
            type="password"
            name="password"
            placeholder="Create a password"
            value={formData.password}
            onChange={handleChange}
            required
            autoComplete="new-password"
          />
        </InputGroup>
        <InputGroup>
          <SrOnly>Confirm Password</SrOnly>
          <FunInput
            type="password"
            name="confirmPassword"
            placeholder="Confirm password"
            value={formData.confirmPassword}
            onChange={handleChange}
            required
            autoComplete="new-password"
          />
        </InputGroup>
        <AnimatedButton type="submit">
          <span role="img" aria-label="flame">🔥</span> Create Account
        </AnimatedButton>
        {error && <ErrorMessage isError>{error}</ErrorMessage>}
      </Form>
    </GlassCard>
  );
};

export default SignupForm;
