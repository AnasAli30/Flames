import { useState } from 'react';
import styled from '@emotion/styled';
import NewChatForm from './NewChatForm';

const ChatListContainer = styled.div`
  width: 350px;
  min-width: 350px;
  background: linear-gradient(135deg, 
    rgba(42, 47, 50, 0.95) 0%, 
    rgba(26, 26, 46, 0.95) 100%);
  border-right: 1px solid rgba(255, 152, 0, 0.3);
  height: 100%;
  display: flex;
  flex-direction: column;
  backdrop-filter: blur(10px);
  position: relative;
  
  &::after {
    content: '';
    position: absolute;
    top: 0;
    right: 0;
    bottom: 0;
    width: 2px;
    background: linear-gradient(180deg, transparent, #ff9800, transparent);
    opacity: 0.6;
  }

  @media (min-width: 1200px) {
    width: 400px;
    min-width: 400px;
  }

  @media (max-width: 768px) {
    width: 100%;
    min-width: 100%;
    height: 40%;
    border-right: none;
    border-bottom: 1px solid rgba(255, 152, 0, 0.3);
    
    &::after {
      top: auto;
      bottom: 0;
      right: 0;
      left: 0;
      width: auto;
      height: 2px;
      background: linear-gradient(90deg, transparent, #ff9800, transparent);
    }
  }

  /* Custom scrollbar with flame theme */
  &::-webkit-scrollbar {
    width: 8px;
  }

  &::-webkit-scrollbar-track {
    background: rgba(42, 47, 50, 0.3);
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
`;

const ChatListScroll = styled.div`
  flex: 1;
  overflow-y: auto;

  /* Custom scrollbar with flame theme */
  &::-webkit-scrollbar {
    width: 8px;
  }

  &::-webkit-scrollbar-track {
    background: rgba(42, 47, 50, 0.3);
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
`;

const ChatItem = styled.div`
  padding: 16px 20px;
  display: flex;
  align-items: center;
  cursor: pointer;
  border-bottom: 1px solid rgba(64, 64, 64, 0.3);
  background: ${props => props.active 
    ? 'linear-gradient(135deg, rgba(255, 107, 53, 0.15) 0%, rgba(255, 152, 0, 0.15) 100%)'
    : 'transparent'};
  transition: all 0.3s ease;
  position: relative;
  border-radius: 0;
  
  ${props => props.active && `
    border-left: 3px solid #ff9800;
    box-shadow: inset 0 0 20px rgba(255, 152, 0, 0.1);
  `}

  &:hover {
    background: linear-gradient(135deg, 
      rgba(50, 55, 57, 0.8) 0%, 
      rgba(26, 26, 46, 0.8) 100%);
    transform: translateX(2px);
    border-left: 3px solid rgba(255, 152, 0, 0.5);
  }

  @media (max-width: 768px) {
    padding: 14px 16px;
  }

  @media (max-width: 480px) {
    padding: 12px 14px;
  }
`;

const Avatar = styled.div`
  width: 50px;
  height: 50px;
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
  box-shadow: 0 0 10px rgba(255, 152, 0, 0.2);
  transition: all 0.3s ease;
  
  &:hover {
    transform: scale(1.05);
    box-shadow: 0 0 15px rgba(255, 152, 0, 0.4);
  }

  @media (max-width: 480px) {
    width: 45px;
    height: 45px;
    font-size: 16px;
    margin-right: 12px;
  }
`;

const ChatInfo = styled.div`
  flex: 1;
  min-width: 0; // Enable text truncation
`;

const ChatName = styled.div`
  color: #fff;
  font-size: 16px;
  margin-bottom: 5px;
  font-weight: 500;
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
  display: flex;
  justify-content: space-between;
  align-items: center;
`;

const LastMessage = styled.div`
  color: #8696a0;
  font-size: 14px;
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
  max-width: 200px;

  @media (min-width: 1200px) {
    max-width: 250px;
  }
`;

const TimeStamp = styled.div`
  color: #8696a0;
  font-size: 12px;
  margin-left: 10px;
  flex-shrink: 0;
`;

const EmptyState = styled.div`
  color: #8696a0;
  text-align: center;
  padding: 20px;
  font-size: 14px;
  display: flex;
  flex-direction: column;
  gap: 10px;
  align-items: center;
`;

const UserCode = styled.div`
  background: #323739;
  padding: 8px 16px;
  border-radius: 8px;
  font-family: monospace;
  font-size: 16px;
  color: #00a884;
`;

const ChatList = ({ chats = [], activeChat, onChatSelect, onStartChat, userCode, error }) => {
  const [search, setSearch] = useState('');

  const getAvatarText = (email) => {
    if (!email) return '?';
    return email[0].toUpperCase();
  };

  const formatTime = (timestamp) => {
    if (!timestamp) return '';
    const date = new Date(timestamp);
    const now = new Date();
    const isToday = date.toDateString() === now.toDateString();
    
    if (isToday) {
      return date.toLocaleTimeString([], { 
        hour: '2-digit', 
        minute: '2-digit' 
      });
    }
    
    return date.toLocaleDateString([], {
      month: 'short',
      day: 'numeric'
    });
  };

  // Filter chats by search string
  const filteredChats = chats.filter(chat => {
    if (!search) return true;
    const val = search.toLowerCase();
    return (
      (chat.email && chat.email.toLowerCase().includes(val)) ||
      (chat.code && chat.code.toLowerCase().includes(val))
    );
  });

  return (
    <ChatListContainer>
      <NewChatForm onStartChat={onStartChat} error={error} />
      <div style={{ padding: '10px 16px' }}>
        <input
          type="text"
          placeholder="Search chats..."
          value={search}
          onChange={e => setSearch(e.target.value)}
          style={{
            width: '100%',
            padding: '8px 12px',
            borderRadius: '8px',
            border: '1px solid #ff9800',
            fontSize: '15px',
            marginBottom: '8px',
            outline: 'none',
            background: '#23272f',
            color: '#fff'
          }}
        />
      </div>
      <ChatListScroll>
        {Array.isArray(filteredChats) && filteredChats.map(chat => {
          if (!chat || !chat.code) return null;
          return (
            <ChatItem 
              key={chat.code} 
              active={activeChat?.code === chat.code}
              onClick={() => onChatSelect(chat)}
            >
              <Avatar>{getAvatarText(chat.email)}</Avatar>
              <ChatInfo>
                <ChatName>
                  <span>{chat.email || chat.code}</span>
                  <TimeStamp>{formatTime(chat.lastMessageTime)}</TimeStamp>
                </ChatName>
                <LastMessage>
                  {chat.lastMessage || 'No messages yet'}
                </LastMessage>
              </ChatInfo>
            </ChatItem>
          );
        })}
        {(!filteredChats || filteredChats.length === 0) && (
          <EmptyState>
            <div>No chats found.</div>
            <div>Your code:</div>
            <UserCode>{userCode}</UserCode>
          </EmptyState>
        )}
      </ChatListScroll>
    </ChatListContainer>
  );
};

export default ChatList; 