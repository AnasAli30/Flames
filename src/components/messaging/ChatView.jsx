import styled from '@emotion/styled';
import { Input, Button } from '../../styles/StyledComponents';
import { useState, useEffect, useRef } from 'react';

const ChatViewContainer = styled.div`
  flex: 1;
  display: flex;
  flex-direction: column;
  background: linear-gradient(135deg, 
    rgba(11, 20, 26, 0.95) 0%, 
    rgba(22, 33, 62, 0.95) 100%);
  height: 100%;
  min-width: 0;
  position: relative;
  backdrop-filter: blur(10px);

  @media (max-width: 768px) {
    height: calc(100vh - 200px);
  }

  @media (max-width: 480px) {
    height: calc(100vh - 180px);
  }
`;

const ChatHeader = styled.div`
  padding: 15px 25px;
  background: linear-gradient(135deg, 
    rgba(42, 47, 50, 0.95) 0%, 
    rgba(26, 26, 46, 0.95) 100%);
  display: flex;
  align-items: center;
  border-bottom: 1px solid rgba(255, 152, 0, 0.3);
  backdrop-filter: blur(10px);
  min-height: 75px;
  position: relative;
  
  &::after {
    content: '';
    position: absolute;
    bottom: 0;
    left: 0;
    right: 0;
    height: 2px;
    background: linear-gradient(90deg, transparent, #ff9800, transparent);
    opacity: 0.6;
  }

  @media (max-width: 768px) {
    padding: 12px 20px;
    min-height: 65px;
  }

  @media (max-width: 480px) {
    padding: 10px 15px;
    min-height: 60px;
  }
`;

const ChatAvatar = styled.div`
  width: 45px;
  height: 45px;
  border-radius: 50%;
  background: linear-gradient(135deg, #ff6b35, #ff9800);
  margin-right: 15px;
  display: flex;
  align-items: center;
  justify-content: center;
  color: #fff;
  font-weight: bold;
  font-size: 18px;
  flex-shrink: 0;
  border: 2px solid rgba(255, 152, 0, 0.3);
  box-shadow: 0 0 15px rgba(255, 152, 0, 0.2);
  transition: all 0.3s ease;
  
  &:hover {
    transform: scale(1.05);
    box-shadow: 0 0 20px rgba(255, 152, 0, 0.4);
  }

  @media (max-width: 480px) {
    width: 40px;
    height: 40px;
    font-size: 16px;
    margin-right: 12px;
  }
`;

const ChatName = styled.div`
  color: #fff;
  font-size: 17px;
  font-weight: 500;
  text-shadow: 0 0 10px rgba(255, 152, 0, 0.3);

  @media (max-width: 480px) {
    font-size: 15px;
  }
`;

const ChatCode = styled.div`
  color: #8696a0;
  font-size: 14px;
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
  margin-left: 10px;
  font-size: 12px;
  font-weight: 400;
  position: absolute;
  right: 25px;
  top: 25px;
`;

const MessagesContainer = styled.div`
  flex: 1;
  overflow-y: auto;
  padding: 20px;
  display: flex;
  flex-direction: column;
  gap: 12px;
  position: relative;

  /* Custom scrollbar with flame theme */
  &::-webkit-scrollbar {
    width: 8px;
  }

  &::-webkit-scrollbar-track {
    background: rgba(11, 20, 26, 0.5);
    border-radius: 4px;
  }

  &::-webkit-scrollbar-thumb {
    background: linear-gradient(45deg, #ff6b35, #ff9800);
    border-radius: 4px;
    transition: background 0.3s ease;
  }

  &::-webkit-scrollbar-thumb:hover {
    background: linear-gradient(45deg, #ff8a50, #ffb74d);
  }

  @media (max-width: 768px) {
    padding: 15px;
    gap: 10px;
  }

  @media (max-width: 480px) {
    padding: 12px;
    gap: 8px;
  }
`;

const MessageBubble = styled.div`
  max-width: 100%;
  padding: 12px 16px;
  margin: 4px 0;
  overflow-wrap: break-word;
  border-radius: ${props => props.sent ? '18px 18px 4px 18px' : '18px 18px 18px 4px'};
  color: #fff;
  align-self: ${props => props.sent ? 'flex-end' : 'flex-start'};
  background: ${props => props.sent 
    ? 'linear-gradient(135deg, #ff6b35 0%, #ff9800 100%)' 
    : 'linear-gradient(135deg, rgba(32, 44, 51, 0.95) 0%, rgba(26, 26, 46, 0.95) 100%)'};
  position: relative;
  font-size: 15px;
  line-height: 1.4;
  border: 1px solid ${props => props.sent 
    ? 'rgba(255, 152, 0, 0.3)' 
    : 'rgba(64, 64, 64, 0.5)'};
  box-shadow: ${props => props.sent 
    ? '0 2px 8px rgba(255, 152, 0, 0.2)' 
    : '0 2px 8px rgba(0, 0, 0, 0.2)'};
  backdrop-filter: blur(10px);
  transition: all 0.3s ease;
  animation: slideIn 0.3s ease-out;

  &:hover {
    transform: translateY(-1px);
    box-shadow: ${props => props.sent 
      ? '0 4px 12px rgba(255, 152, 0, 0.3)' 
      : '0 4px 12px rgba(0, 0, 0, 0.3)'};
  }

  @media (min-width: 1200px) {
    max-width: 55%;
  }

  @media (max-width: 768px) {
    max-width: 75%;
    font-size: 14px;
    padding: 10px 14px;
  }

  @media (max-width: 480px) {
    max-width: 85%;
    font-size: 13px;
    padding: 8px 12px;
  }

  @keyframes slideIn {
    from {
      opacity: 0;
      transform: translateY(10px);
    }
    to {
      opacity: 1;
      transform: translateY(0);
    }
  }
`;

const MessageTime = styled.span`
  font-size: 11px;
  color:${props => props.sent ? 'white' : 'pink'};
  margin-left: 8px;
  float: right;
  margin-top: 4px;
  margin-left: 24px;
`;

const InputContainer = styled.div`
  padding: 20px 25px;
  background: linear-gradient(135deg, 
    rgba(42, 47, 50, 0.95) 0%, 
    rgba(26, 26, 46, 0.95) 100%);
  display: flex;
  gap: 15px;
  align-items: center;
  border-top: 1px solid rgba(255, 152, 0, 0.3);
  backdrop-filter: blur(10px);
  position: relative;
  
  &::before {
    content: '';
    position: absolute;
    top: 0;
    left: 0;
    right: 0;
    height: 2px;
    background: linear-gradient(90deg, transparent, #ff9800, transparent);
    opacity: 0.6;
  }

  @media (max-width: 768px) {
    padding: 15px 20px;
    gap: 12px;
  }

  @media (max-width: 480px) {
    padding: 12px 15px;
    gap: 10px;
  }
`;

const MessageInput = styled(Input)`
  flex: 1;
  border-radius: 25px;
  padding: 14px 20px;
  font-size: 15px;
  background: rgba(42, 47, 50, 0.8);
  border: 1px solid rgba(64, 64, 64, 0.5);
  color: #fff;
  transition: all 0.3s ease;
  backdrop-filter: blur(10px);

  &:focus {
    border-color: rgba(255, 152, 0, 0.6);
    background: rgba(50, 55, 57, 0.9);
    box-shadow: 0 0 15px rgba(255, 152, 0, 0.2);
    outline: none;
  }

  &::placeholder {
    color: #8696a0;
  }

  @media (max-width: 768px) {
    padding: 12px 18px;
    font-size: 14px;
  }

  @media (max-width: 480px) {
    padding: 10px 16px;
    font-size: 13px;
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
  font-size: 20px;
  background: linear-gradient(135deg, #ff6b35 0%, #ff9800 100%);
  border: 2px solid rgba(255, 152, 0, 0.3);
  box-shadow: 0 0 15px rgba(255, 152, 0, 0.3);
  transition: all 0.3s ease;
  position: relative;
  overflow: hidden;

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
    background: linear-gradient(135deg, #ff8a50 0%, #ffb74d 100%);
    transform: scale(1.05);
    box-shadow: 0 0 20px rgba(255, 152, 0, 0.5);
    
    &::before {
      width: 100%;
      height: 100%;
    }
  }

  &:active {
    transform: scale(0.95);
  }

  @media (max-width: 768px) {
    width: 44px;
    height: 44px;
    font-size: 18px;
  }

  @media (max-width: 480px) {
    width: 40px;
    height: 40px;
    font-size: 16px;
  }
`;

const ChatView = ({ activeChat, messages, onSendMessage }) => {
  const [decryptedMessages, setDecryptedMessages] = useState([]);
  const messagesEndRef = useRef(null);

  const [customNames, setCustomNames] = useState(() => {
    return JSON.parse(localStorage.getItem('chatCustomNames') || '{}');
  });
  const [isDecrypting, setIsDecrypting] = useState(false);
  console.log("chatview messages", messages);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(() => {
    scrollToBottom();
  }, [decryptedMessages]);

  useEffect(() => {
    if (!messages || messages.length === 0) {
      setDecryptedMessages([]);
      return;
    }

    // Messages are already processed in App.jsx, just sort them
    const sortedMessages = [...messages].sort((a, b) => a.timestamp - b.timestamp);
    setDecryptedMessages(sortedMessages);
  }, [messages]);

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
        <ChatAvatar>{(activeChat?.customName || activeChat?.email || activeChat?.code)?.[0]?.toUpperCase() || '?'}</ChatAvatar>
        <ChatName>{activeChat?.customName || customNames[activeChat?.code] || activeChat?.email || activeChat?.code || 'Loading...'}</ChatName>
        {customNames[activeChat?.code] && (
        <ChatCode>{ activeChat?.code || 'Loading...'}</ChatCode>
        )}
      </ChatHeader>

      <MessagesContainer>
        {decryptedMessages.map((msg, index) => (
          <MessageBubble 
            key={`${msg.timestamp}-${index}`}
            sent={msg.from === 'me'}
          >
            {msg.decryptedContent || msg.encryptedMessage}
            <MessageTime sent={msg.from === 'me'}>
              {new Date(msg.timestamp).toLocaleTimeString([], {
                hour: '2-digit',
                minute: '2-digit'
              })}
            </MessageTime>
          </MessageBubble>
        ))}
        <div ref={messagesEndRef} />
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