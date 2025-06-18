import { useState } from 'react';
import styled from '@emotion/styled';
import { Input, Button } from '../../styles/StyledComponents';

const FormContainer = styled.div`
  padding: 20px;
  background: #2a2f32;
  border-bottom: 1px solid #404040;
`;

const Form = styled.form`
  display: flex;
  gap: 10px;
`;

const StyledInput = styled(Input)`
  flex: 1;
  background: #323739;
  border: 1px solid #404040;
  color: #fff;
  padding: 12px 16px;
  border-radius: 8px;
  width: 100%;
  &::placeholder {
    color: #8696a0;
  }

  &:focus {
    border-color: #00a884;
    background: #323739;
  }
`;

const StyledButton = styled(Button)`
  background: #00a884;
  font-size: 0.9rem;
  font-weight: 600;

  border-radius: 10px;
  transition: background 0.5s ease-in-out;

  &:hover {
    background: #02735e;
  }
`;

const ErrorMessage = styled.div`
  color: #f15c6d;
  font-size: 14px;
  margin-top: 10px;
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