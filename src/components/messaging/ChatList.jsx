import { useState } from 'react';
import styled from '@emotion/styled';
import NewChatForm from './NewChatForm';

const ChatListContainer = styled.div`
  width: 350px;
  min-width: 350px;
  background: #2a2f32;
  border-right: 1px solid #404040;
  height: 100%;
  display: flex;
  flex-direction: column;

  @media (min-width: 1200px) {
    width: 400px;
    min-width: 400px;
  }

  /* Custom scrollbar for modern browsers */
  &::-webkit-scrollbar {
    width: 6px;
  }

  &::-webkit-scrollbar-track {
    background: #2a2f32;
  }

  &::-webkit-scrollbar-thumb {
    background: #404040;
    border-radius: 3px;
  }
`;

const ChatListScroll = styled.div`
  flex: 1;
  overflow-y: auto;

  /* Custom scrollbar for modern browsers */
  &::-webkit-scrollbar {
    width: 6px;
  }

  &::-webkit-scrollbar-track {
    background: #2a2f32;
  }

  &::-webkit-scrollbar-thumb {
    background: #404040;
    border-radius: 3px;
  }
`;

const ChatItem = styled.div`
  padding: 20px;
  display: flex;
  align-items: center;
  cursor: pointer;
  border-bottom: 1px solid #404040;
  background: ${props => props.active ? '#323739' : 'transparent'};
  transition: background 0.2s ease;

  &:hover {
    background: #323739;
  }
`;

const Avatar = styled.div`
  width: 50px;
  height: 50px;
  border-radius: 50%;
  background: #404040;
  margin-right: 15px;
  display: flex;
  align-items: center;
  justify-content: center;
  color: #fff;
  font-weight: bold;
  font-size: 20px;
  flex-shrink: 0;
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

  return (
    <ChatListContainer>
      <NewChatForm onStartChat={onStartChat} error={error} />
      <ChatListScroll>
        {Array.isArray(chats) && chats.map(chat => {
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
        {(!chats || chats.length === 0) && (
          <EmptyState>
            <div>No chats yet. Start a new chat using someone's code!</div>
            <div>Your code:</div>
            <UserCode>{userCode}</UserCode>
          </EmptyState>
        )}
      </ChatListScroll>
    </ChatListContainer>
  );
};

export default ChatList; 