import styled from '@emotion/styled';
import { Input, Button } from '../../styles/StyledComponents';

const ChatViewContainer = styled.div`
  flex: 1;
  display: flex;
  flex-direction: column;
  background: #0b141a;
  height: 80%;
  min-width: 0;
`;

const ChatHeader = styled.div`
  padding: 15px 25px;
  background: #2a2f32;
  display: flex;
  align-items: center;
  border-bottom: 1px solid #404040;
  height: 75px;
`;

const ChatAvatar = styled.div`
  width: 45px;
  height: 45px;
  border-radius: 50%;
  background: #404040;
  margin-right: 15px;
  display: flex;
  align-items: center;
  justify-content: center;
  color: #fff;
  font-weight: bold;
  font-size: 18px;
  flex-shrink: 0;
`;

const ChatName = styled.div`
  color: #fff;
  font-size: 17px;
  font-weight: 500;
`;

const MessagesContainer = styled.div`
  flex: 1;
  overflow-y: auto;
  padding: 20px;
  display: flex;
  flex-direction: column;
  gap: 8px;

  /* Custom scrollbar */
  &::-webkit-scrollbar {
    width: 6px;
  }

  &::-webkit-scrollbar-track {
    background: #0b141a;
  }

  &::-webkit-scrollbar-thumb {
    background: #374045;
    border-radius: 3px;
  }
`;

const MessageBubble = styled.div`
  max-width: 65%;
  padding: 12px 16px;
  margin: 4px 0;
  border-radius: 8px;
  color: #fff;
  align-self: ${props => props.sent ? 'flex-end' : 'flex-start'};
  background: ${props => props.sent ? '#005c4b' : '#202c33'};
  position: relative;
  font-size: 15px;
  line-height: 1.4;

  @media (min-width: 1200px) {
    max-width: 55%;
  }
`;

const MessageTime = styled.span`
  font-size: 11px;
  color: #8696a0;
  margin-left: 8px;
  float: right;
  margin-top: 4px;
  margin-left: 24px;
`;

const InputContainer = styled.div`
  padding: 20px 25px;
  background: #2a2f32;
  display: flex;
  gap: 15px;
  align-items: center;
  border-top: 1px solid #404040;
`;

const MessageInput = styled(Input)`
  flex: 1;
  border-radius: 24px;
  padding: 14px 24px;
  font-size: 15px;
  background: #2a2f32;
  border: 1px solid #404040;
  color: #fff;
  transition: all 0.2s ease;

  &:focus {
    border-color: #00a884;
    background: #323739;
  }

  &::placeholder {
    color: #8696a0;
  }
`;

const SendButton = styled(Button)`
  border-radius: 50%;
  width: 48px;
  height: 48px;
  padding: 0;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 24px;
  background: #00a884;
  transition: all 0.2s ease;

  &:hover {
    background: #02735e;
  }
`;

const ChatView = ({ activeChat, messages, onSendMessage }) => {
  const handleSubmit = (e) => {
    e.preventDefault();
    const message = e.target.message.value;
    if (message.trim()) {
      onSendMessage(message);
      e.target.message.value = '';
    }
  };

  return (
    <ChatViewContainer>
      <ChatHeader>
        <ChatAvatar>{activeChat.email[0].toUpperCase()}</ChatAvatar>
        <ChatName>{activeChat.email}</ChatName>
      </ChatHeader>

      <MessagesContainer>
        {messages.map((msg, index) => (
          <MessageBubble 
            key={`${msg.timestamp}-${index}`}
            sent={msg.from === 'me'}
          >
            {msg.encryptedMessage}
            <MessageTime>
              {new Date(msg.timestamp).toLocaleTimeString([], {
                hour: '2-digit',
                minute: '2-digit'
              })}
            </MessageTime>
          </MessageBubble>
        ))}
      </MessagesContainer>

      <form onSubmit={handleSubmit}>
        <InputContainer>
          <MessageInput
            type="text"
            name="message"
            placeholder="Type a message"
            autoComplete="off"
          />
          <SendButton type="submit">→</SendButton>
        </InputContainer>
      </form>
    </ChatViewContainer>
  );
};

export default ChatView; 