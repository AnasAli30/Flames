import styled from '@emotion/styled';
import { Input, Button } from '../../styles/StyledComponents';
import { useState, useEffect, useRef } from 'react';
import { toast } from 'react-toastify';

const ChatViewContainer = styled.div`
  flex: 1;
  display: flex;
  flex-direction: column;
  background: linear-gradient(135deg, 
    rgba(15, 23, 42, 0.98) 0%, 
    rgba(30, 41, 59, 0.98) 50%,
    rgba(51, 65, 85, 0.98) 100%);
  height: 100%;
  min-width: 0;
  position: relative;
  backdrop-filter: blur(20px);
  box-shadow: 
    inset 0 1px 0 rgba(255, 255, 255, 0.1),
    0 0 40px rgba(0, 0, 0, 0.3);
  
  &::before {
    content: '';
    position: absolute;
    top: 0;
    left: 0;
    right: 0;
    bottom: 0;
    background: linear-gradient(135deg, 
      rgba(255, 152, 0, 0.02) 0%, 
      transparent 50%,
      rgba(255, 107, 53, 0.02) 100%);
    pointer-events: none;
  }

  /* Large desktop */
  @media (min-width: 1200px) {
    min-width: 600px;
  }

  /* Desktop */
  @media (max-width: 1024px) {
    min-width: 500px;
  }

  /* Tablet */
  @media (max-width: 768px) {
    height: 60vh;
    min-width: 100%;
  }

  /* Mobile landscape */
  @media (max-width: 640px) {
    height: 65vh;
  }

  /* Mobile portrait */
  @media (max-width: 480px) {
    height: 70vh;
  }

  /* Ultra small screens */
  @media (max-width: 320px) {
    height: 75vh;
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

  &:hover .panic-btn {
    display: block;
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
  position: relative;
  @media (max-width: 480px) {
    font-size: 15px;
  }
  &:hover .panic-btn {
    display: block;
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

  &.blurred {
    filter: blur(4px);
    transition: filter 0.2s;
  }
  &.blurred:hover {
    filter: none;
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

const PanicButton = styled.button`
  display: none;
  position: absolute;
  right: -90px;
  top: 0;
  background: #ff3b3b;
  color: #fff;
  border: none;
  border-radius: 8px;
  padding: 6px 16px;
  font-weight: 600;
  cursor: pointer;
  z-index: 2;
`;

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL;

const ChatView = ({ activeChat, messages, onSendMessage, setChats, setMessagesByChat }) => {
  const [decryptedMessages, setDecryptedMessages] = useState([]);
  const messagesEndRef = useRef(null);

  const [customNames, setCustomNames] = useState(() => {
    return JSON.parse(localStorage.getItem('chatCustomNames') || '{}');
  });
  const [isDecrypting, setIsDecrypting] = useState(false);
  const [showAll, setShowAll] = useState(false);
  const [showPanic, setShowPanic] = useState(false);
  const panicTimerRef = useRef(null);

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

  useEffect(() => {
    setShowAll(false);
  }, [activeChat?.code]);

  // Show panic button for 3 seconds after hover
  const handleFlamesHover = () => {
    setShowPanic(true);
    if (panicTimerRef.current) clearTimeout(panicTimerRef.current);
    panicTimerRef.current = setTimeout(() => setShowPanic(false), 3000);
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    const message = e.target.message.value;
    if (message.trim()) {
      onSendMessage(message);
      e.target.message.value = '';
    }
  };

  // Panic button handler
  const handlePanic = async () => {
    if (!window.confirm('Are you sure you want to permanently delete this chat, all its messages, and your account? This cannot be undone.')) return;
    try {
      const authState = JSON.parse(localStorage.getItem('authState')) || {};
      const response = await fetch(`${API_BASE_URL}/panic-delete-chat`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${authState.token}`
        },
        body: JSON.stringify({ chatCode: activeChat.code })
      });
      if (response.status !== 200) {
        throw new Error('Failed to delete chat and account.');
      }
      toast.success('Chat, all messages, and your account have been deleted.');
      setTimeout(() => {
        localStorage.removeItem('authState');
        window.location.reload();
      }, 1500);
    } catch (err) {
      toast.error('Failed to delete chat/account. Please try again.');
    }
  };

  return (
    <ChatViewContainer>
      <ChatHeader>
        <ChatAvatar>{(activeChat?.customName || activeChat?.email || activeChat?.code)?.[0]?.toUpperCase() || '?'}</ChatAvatar>
        <ChatName onMouseEnter={handleFlamesHover}>
          {activeChat?.customName || customNames[activeChat?.code] || activeChat?.email || activeChat?.code || 'Loading...'}
          {showPanic && (
            <PanicButton className="panic-btn" onClick={handlePanic}>Panic!</PanicButton>
          )}
        </ChatName>
        {customNames[activeChat?.code] && (
          <ChatCode>{ activeChat?.code || 'Loading...'}</ChatCode>
        )}
      </ChatHeader>

      <MessagesContainer>
        {!showAll && decryptedMessages.length > 2 && (
          <div style={{ textAlign: 'center', margin: '10px 0' }}>
            <button
              style={{
                background: '#23272f',
                color: '#ff9800',
                border: '1px solid #ff9800',
                borderRadius: '8px',
                padding: '6px 18px',
                cursor: 'pointer',
                fontSize: '15px',
                marginBottom: '10px'
              }}
              onClick={() => setShowAll(true)}
            >
              Show All Messages
            </button>
          </div>
        )}
        {decryptedMessages.map((msg, index) => {
          const isLastTwo = index >= decryptedMessages.length - 2;
          const shouldBlur = !showAll && !isLastTwo;
          return (
            <MessageBubble
              key={`${msg.timestamp}-${index}`}
              sent={msg.from === 'me'}
              className={shouldBlur ? 'blurred' : ''}
            >
              {msg.decryptedContent || msg.encryptedMessage}
              <MessageTime>
                {new Date(msg.timestamp).toLocaleTimeString([], {
                  hour: '2-digit',
                  minute: '2-digit'
                })}
              </MessageTime>
            </MessageBubble>
          );
        })}
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