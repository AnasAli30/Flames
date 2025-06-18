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

const decryptMessage = async (message) => {
  try {
    if (!message || !message.encryptedMessage || !message.encryptedAESKey) {
      console.error('Invalid message format:', message);
      return 'Invalid message format';
    }

    // Safe base64 decoding function
    const base64ToArray = (base64String) => {
      try {
        // Handle PEM format
        let cleanBase64 = base64String;
        if (base64String.includes('-----BEGIN')) {
          // Extract the base64 part from PEM format
          cleanBase64 = base64String
            .replace('-----BEGIN PUBLIC KEY-----', '')
            .replace('-----END PUBLIC KEY-----', '')
            .replace('-----BEGIN PRIVATE KEY-----', '')
            .replace('-----END PRIVATE KEY-----', '')
            .replace(/[\n\r\s]/g, '');
        } else {
          // Regular base64 string - just remove whitespace
          cleanBase64 = base64String.replace(/\s/g, '');
        }

        // Validate base64 string
        if (!cleanBase64.match(/^[A-Za-z0-9+/]*={0,2}$/)) {
          console.error('Invalid base64 format for string:', base64String);
          throw new Error('Invalid base64 string format');
        }
        
        const binary = window.atob(cleanBase64);
        const bytes = new Uint8Array(binary.length);
        for (let i = 0; i < binary.length; i++) {
          bytes[i] = binary.charCodeAt(i);
        }
        return bytes;
      } catch (error) {
        console.error('Error in base64ToArray:', error);
        console.error('Problematic string:', base64String);
        throw new Error('Failed to decode data');
      }
    };

    // Log the received message for debugging
    console.log('Attempting to decrypt message:', {
      encryptedMessage: message.encryptedMessage,
      encryptedAESKey: message.encryptedAESKey
    });

    // Extract IV and encrypted message
    const combined = base64ToArray(message.encryptedMessage);
    const iv = combined.slice(0, 12);
    const encryptedMessage = combined.slice(12);

    // Get private key
    const privateKey = authState.user?.privateKey;
    if (!privateKey) {
      throw new Error('Private key is missing');
    }

    // Import private key
    const privateKeyArray = base64ToArray(privateKey);
    const importedPrivateKey = await crypto.subtle.importKey(
      'pkcs8',
      privateKeyArray,
      {
        name: 'RSA-OAEP',
        hash: 'SHA-256'
      },
      false,
      ['decrypt']
    );

    // Decrypt the AES key
    const encryptedAESKey = base64ToArray(message.encryptedAESKey);
    const aesKey = await crypto.subtle.decrypt(
      { name: 'RSA-OAEP' },
      importedPrivateKey,
      encryptedAESKey
    );

    // Import the AES key
    const importedAESKey = await crypto.subtle.importKey(
      'raw',
      aesKey,
      { name: 'AES-GCM' },
      false,
      ['decrypt']
    );

    // Decrypt the message
    const decryptedMessage = await crypto.subtle.decrypt(
      { name: 'AES-GCM', iv },
      importedAESKey,
      encryptedMessage
    );

    // Convert decrypted message to text
    const decoder = new TextDecoder();
    return decoder.decode(decryptedMessage);
  } catch (err) {
    console.error('Error decrypting message:', err);
    return `Error decrypting message: ${err.message}`;
  }
};

const authState = JSON.parse(localStorage.getItem('authState')) || {};


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