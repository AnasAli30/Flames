import { useState, useEffect } from 'react';
import styled from '@emotion/styled';
import {
  Container,
  Title,
  Subtitle,
  ToggleLink,
  Button,
  pulseGlow,
  flameGlow,
  fadeIn
} from './styles/StyledComponents';
import FlamesBackground from './components/FlamesBackground';
import LoginForm from './components/auth/LoginForm';
import SignupForm from './components/auth/SignupForm';
import ChatList from './components/messaging/ChatList';
import ChatView from './components/messaging/ChatView';
import { v4 as uuidv4 } from 'uuid';
import { keyframes } from '@emotion/react';

const ChatContainer = styled.div`
  display: flex;
  height: calc(100vh - 140px);
  background: linear-gradient(135deg, 
    rgba(17, 27, 33, 0.95) 0%, 
    rgba(26, 26, 46, 0.95) 50%, 
    rgba(255, 123, 57, 0.95) 100%);
  border-radius: 16px;
  overflow: hidden;
  margin-top: 20px;
  max-width: 1400px;
  width: 100%;
  margin-left: auto;
  margin-right: auto;
  box-shadow: 
    0 8px 32px rgba(0, 0, 0, 0.3),
    0 0 40px rgba(255, 152, 0, 0.1),
    inset 0 1px 0 rgba(255, 255, 255, 0.1);
  backdrop-filter: blur(10px);
  border: 1px solid rgba(255, 152, 0, 0.2);
  position: relative;
  
  &::before {
    content: '';
    position: absolute;
    top: -2px;
    left: -2px;
    right: -2px;
    bottom: -2px;
    background: linear-gradient(45deg, #ff6b35, #ff9800, #ffb74d, #ff8a50);
    border-radius: 18px;
    z-index: -1;
    opacity: 0.3;
    animation: ${pulseGlow} 3s ease-in-out infinite;
  }

  @media (max-width: 768px) {
    flex-direction: column;
    height: calc(100vh - 120px);
    margin-top: 10px;
    border-radius: 12px;
  }

  @media (max-width: 480px) {
    height: calc(100vh - 100px);
    border-radius: 8px;
  }
`;

const Header = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  max-width: 1400px;
  width: 100%;
  margin: 0 auto;
  padding: 20px 0;
  position: relative;
  z-index: 10;

  @media (max-width: 768px) {
    padding: 15px 0;
    flex-direction: column;
    gap: 10px;
    text-align: center;
  }

  @media (max-width: 480px) {
    padding: 10px 0;
  }
`;

// Add a flame sticker background for the title
const FlameSticker = styled.div`
  position: absolute;
  left: 50%;
  top: 50%;
  transform: translate(-50%, -60%);
  z-index: 0;
  pointer-events: none;
  font-size: 8rem;
  opacity: 0.13;
  filter: blur(1.5px) drop-shadow(0 0 32px #ff9800cc);
  user-select: none;
  @media (max-width: 768px) {
    font-size: 5rem;
    top: 55%;
  }
  @media (max-width: 480px) {
    font-size: 3.2rem;
    top: 60%;
  }
`;

const UserInfo = styled.div`
  display: flex;
  align-items: center;
  gap: 15px;
  background: rgba(42, 47, 50, 0.8);
  padding: 12px 20px;
  border-radius: 25px;
  border: 1px solid rgba(255, 152, 0, 0.3);
  backdrop-filter: blur(10px);
  transition: all 0.3s ease;

  &:hover {
    background: rgba(42, 47, 50, 0.9);
    border-color: rgba(255, 152, 0, 0.5);
    transform: translateY(-2px);
    box-shadow: 0 4px 20px rgba(255, 152, 0, 0.2);
  }

  @media (max-width: 768px) {
    flex-direction: column;
    gap: 8px;
    padding: 10px 16px;
    border-radius: 16px;
  }
`;

const UserCode = styled.span`
  color: #8696a0;
  font-size: 14px;
  display: flex;
  align-items: center;
  gap: 8px;

  strong {
    color: #ff9800;
    font-family: 'Courier New', monospace;
    background: rgba(255, 152, 0, 0.1);
    padding: 4px 8px;
    border-radius: 6px;
    border: 1px solid rgba(255, 152, 0, 0.3);
  }

  @media (max-width: 480px) {
    font-size: 12px;
    flex-direction: column;
    gap: 4px;
    text-align: center;
  }
`;

const LogoutButton = styled(Button)`
  background: linear-gradient(135deg, #ff6b35 0%, #ff9800 100%);
  padding: 8px 16px;
  font-size: 14px;
  border-radius: 20px;
  transition: all 0.3s ease;
  
  &:hover {
    background: linear-gradient(135deg, #ff8a50 0%, #ffb74d 100%);
    transform: translateY(-2px);
    box-shadow: 0 4px 15px rgba(255, 152, 0, 0.4);
  }

  @media (max-width: 480px) {
    padding: 6px 12px;
    font-size: 12px;
  }
`;

const AuthContainer = styled.div`
  max-width: 500px;
  margin: 0 auto;
  width: 100%;
  background: rgba(30, 30, 30, 0.95);
  border-radius: 20px;
  padding: 40px;
  backdrop-filter: blur(15px);
  border: 1px solid rgba(255, 152, 0, 0.2);
  box-shadow: 
    0 8px 32px rgba(0, 0, 0, 0.3),
    0 0 40px rgba(255, 152, 0, 0.1);
  animation: ${fadeIn} 0.6s ease-out;

  @media (max-width: 768px) {
    max-width: 400px;
    padding: 30px;
    border-radius: 16px;
  }

  @media (max-width: 480px) {
    max-width: 350px;
    padding: 20px;
    border-radius: 12px;
    margin: 0 10px;
  }
`;

const EmptyState = styled.div`
  flex: 1;
  display: flex;
  align-items: center;
  justify-content: center;
  color: #ff9800;
  font-size: 2.2rem;
  background: linear-gradient(135deg, rgba(11, 20, 26, 0.8) 0%, rgba(22, 33, 62, 0.8) 100%);
  padding: 60px 20px;
  flex-direction: column;
  gap: 24px;
  position: relative;
  font-weight: 800;
  text-shadow: 0 2px 16px #ff980044;
  @media (max-width: 768px) {
    padding: 30px;
    font-size: 1.5rem;
  }
  @media (max-width: 480px) {
    padding: 18px;
    font-size: 1.1rem;
  }
`;

const BigFlame = styled.div`
  font-size: 8rem;
  text-align: center;
  margin-bottom: 24px;
  filter: drop-shadow(0 0 32px #ff9800cc) blur(0.5px);
  user-select: none;
  @media (max-width: 768px) {
    font-size: 5rem;
  }
  @media (max-width: 480px) {
    font-size: 3.2rem;
  }
`;

const MobileToggle = styled.button`
  display: none;
  background: rgba(255, 152, 0, 0.2);
  border: 1px solid rgba(255, 152, 0, 0.5);
  color: #ff9800;
  padding: 8px 16px;
  border-radius: 20px;
  font-size: 14px;
  cursor: pointer;
  transition: all 0.3s ease;
  
  &:hover {
    background: rgba(255, 152, 0, 0.3);
    transform: translateY(-1px);
  }

  @media (max-width: 768px) {
    display: block;
    position: absolute;
    top: 20px;
    left: 20px;
    z-index: 20;
  }
`;

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL;
console.log("API_BASE_URL", API_BASE_URL);

// Add flame bounce animation
const flameBounce = keyframes`
  0%, 100% { transform: translateY(0) scale(1); }
  50% { transform: translateY(-18px) scale(1.12); }
`;

const GlassCard = styled.div`
  background: rgba(30, 30, 30, 0.85);
  border-radius: 32px;
  box-shadow: 0 8px 32px 0 rgba(255,152,0,0.18), 0 1.5px 8px 0 #ff980055;
  backdrop-filter: blur(16px);
  border: 1.5px solid rgba(255,152,0,0.18);
  padding: 3.5rem 2.5rem 2.5rem 2.5rem;
  max-width: 520px;
  margin: 0 auto;
  width: 98vw;
  display: flex;
  flex-direction: column;
  align-items: center;
  animation: ${fadeIn} 0.8s cubic-bezier(.77,0,.18,1) both;
  @media (max-width: 600px) {
    padding: 2rem 0.7rem 1.2rem 0.7rem;
    max-width: 99vw;
  }
`;

const AnimatedFlame = styled.div`
  font-size: 8rem;
  margin-bottom: 18px;
  filter: drop-shadow(0 0 32px #ff9800cc) blur(0.5px);
  user-select: none;
  animation: ${flameBounce} 2.2s infinite;
  @media (max-width: 768px) {
    font-size: 5rem;
  }
  @media (max-width: 480px) {
    font-size: 3.2rem;
  }
`;

const Headline = styled.h2`
  font-size: 2.5rem;
  font-weight: 900;
  margin-bottom: 0.5em;
  background: linear-gradient(90deg, #ff9800 30%, #ff6b35 70%, #fff176 100%);
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
  text-align: center;
  letter-spacing: 0.02em;
  text-shadow: 0 2px 16px #ff980044;
  @media (max-width: 600px) {
    font-size: 1.5rem;
  }
`;

const Subtext = styled.p`
  color: #ff9800;
  font-size: 1.15rem;
  font-weight: 600;
  margin-top: 0.5em;
  margin-bottom: 0;
  text-align: center;
  opacity: 0.92;
  text-shadow: 0 1px 8px #ff980033;
  @media (max-width: 600px) {
    font-size: 1rem;
  }
`;

const App = () => {
  const [isLogin, setIsLogin] = useState(true);
  const [authState, setAuthState] = useState({
    isAuthenticated: false,
    user: null,
    token: null
  });
  const [error, setError] = useState('');
  const [chats, setChats] = useState([]);
  const [activeChat, setActiveChat] = useState(null);
  const [messages, setMessages] = useState([]);
  const [messagesByChat, setMessagesByChat] = useState({});
  const [chatError, setChatError] = useState('');

  useEffect(() => {
    // Check for stored auth state
    const storedAuth = localStorage.getItem('authState');
    if (storedAuth) {
      const parsedAuth = JSON.parse(storedAuth);
      setAuthState(parsedAuth);
    }
  }, []);

  useEffect(() => {
    if (authState.isAuthenticated) {
      fetchChatList();
      // Set up message polling
      const pollInterval = setInterval(fetchMessages, 2000);
      return () => clearInterval(pollInterval);
    }
  }, [authState.isAuthenticated]);

  const fetchChatList = async () => {
    try {
      const response = await fetch(`${API_BASE_URL}/message-history`, {
        headers: {
          'Authorization': `Bearer ${authState.token}`
        }
      });
      
      const result = await response.json();
      console.log('Message history response:', result);
      
      if (!response.ok) {
        throw new Error(result.message);
      }

      // Group messages by sender/receiver and create chat list
      const chatMap = new Map();
      const msgMap = {};

      // Get stored sent messages from localStorage
      const storedSentMessages = JSON.parse(localStorage.getItem('sentMessages') || '{}');

      if (Array.isArray(result.messages)) {
        for (const msg of result.messages) {
          if (!msg) continue; // Skip invalid messages
          
          const isSentByMe = msg.from === authState.user?.code;
          const otherUser = isSentByMe ? msg.to : msg.from;
          
          if (!otherUser) continue; // Skip messages without proper sender/receiver

          try {
            let messageContent;
            if (isSentByMe) {
              // For sent messages, try to get from localStorage first
              // console.log("storedSentMessages", storedSentMessages);
              const storedMessages = storedSentMessages[otherUser] || [];
              console.log("storedMessages", storedMessages);
              const storedMessage = storedMessages.find(m => m.id === msg.id);
              console.log("storedMessage", storedMessage);
              if (storedMessage) {
                // Use stored encrypted message
                messageContent = await decryptMessage({
                  encryptedMessage: storedMessage.encryptedMessage,
                  encryptedAESKey: storedMessage.encryptedAESKey
                });
              }
            } else {
              // For received messages, decrypt from server
              messageContent = await decryptMessage(msg);
            }

            // if (messageContent.startsWith('Error decrypting message:')) {
            // console.log("messageContent", messageContent);
            //   console.error('Failed to decrypt message:', msg);
            //   messageContent = '🔒 Encrypted message';
            // }

            // Update chat list
            if (!chatMap.has(otherUser)) {
              chatMap.set(otherUser, {
                code: otherUser,
                email: otherUser,
                lastMessage: messageContent,
                lastMessageTime: msg.timestamp
              });
            } else if (msg.timestamp > chatMap.get(otherUser).lastMessageTime) {
              const chat = chatMap.get(otherUser);
              chat.lastMessage = messageContent;
              chat.lastMessageTime = msg.timestamp;
            }

            // Group messages by chat
            if (!msgMap[otherUser]) {
              msgMap[otherUser] = [];
            }

            // Store message with proper format
            msgMap[otherUser].push({
              ...msg,
              from: isSentByMe ? 'me' : msg.from,
              decryptedContent: messageContent,
              timestamp: msg.timestamp || Date.now()
            });
          } catch (err) {
            console.error('Error processing message:', err);
            continue;
          }
        }

        // Sort messages by timestamp for each chat
        Object.values(msgMap).forEach(messages => {
          messages.sort((a, b) => a.timestamp - b.timestamp);
        });

        // Update state
        setMessagesByChat(msgMap);
        setChats(Array.from(chatMap.values()));
      }
    } catch (err) {
      console.error('Error fetching chat list:', err);
    }
  };

  const handleLogin = async (data) => {
    try {
      console.log('Attempting login with:', data);
      const response = await fetch(`${API_BASE_URL}/login`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(data)
      });
      
      const result = await response.json();
      console.log('Login response:', result);
      
      if (!response.ok) {
        throw new Error(result.message);
      }

      const newAuthState = {
        isAuthenticated: true,
        user: result.user,
        token: result.token
      };

      setAuthState(newAuthState);
      localStorage.setItem('authState', JSON.stringify(newAuthState));
      setError('');

      // Initialize chat state
      setChats([]);
      setMessagesByChat({});
      setActiveChat(null);

      // Fetch initial messages
      await fetchChatList();
    } catch (err) {
      console.error('Login error:', err);
      setError(err instanceof Error ? err.message : 'Login failed');
    }
  };

  const handleSignup = async (data) => {
    try {
      const response = await fetch(`${API_BASE_URL}/register`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(data)
      });
      
      const result = await response.json();
      
      if (!response.ok) {
        throw new Error(result.message);
      }

      await handleLogin({ code: result.code, password: data.password });
      setError('');
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Signup failed');
    }
  };

  const handleStartChat = async (code) => {
    try {
      // Validate that the code exists
      const response = await fetch(`${API_BASE_URL}/public-key/${code}`, {
        headers: {
          'Authorization': `Bearer ${authState.token}`
        }
      });

      if (!response.ok) {
        throw new Error('User not found');
      }

      // Check if chat already exists
      const existingChat = chats.find(chat => chat.code === code);
      if (existingChat) {
        setActiveChat(existingChat);
        setChatError('');
        return;
      }

      // Create new chat
      const newChat = {
        code: code,
        email: code, // In a real app, we'd have the actual email
        lastMessage: null,
        lastMessageTime: null
      };

      setChats(prev => [...prev, newChat]);
      setActiveChat(newChat);
      setMessagesByChat(prev => ({
        ...prev,
        [code]: []
      }));
      setChatError('');
    } catch (err) {
      setChatError('Invalid user code. Please check and try again.');
    }
  };

  const handleSendMessage = async (message) => {
    if (!activeChat) return;
    const messageId = uuidv4(); // Generate unique ID
    
    try {
      // Generate a random AES key for this message
      const aesKey = crypto.getRandomValues(new Uint8Array(32));
      
      // Encrypt the message with AES
      const encoder = new TextEncoder();
      const messageData = encoder.encode(message);
      const iv = crypto.getRandomValues(new Uint8Array(12));
      const encryptedMessage = await crypto.subtle.encrypt(
        { name: 'AES-GCM', iv },
        await crypto.subtle.importKey(
          'raw',
          aesKey,
          { name: 'AES-GCM' },
          false,
          ['encrypt']
        ),
        messageData
      );

      // Safe base64 encoding function
      const arrayToBase64 = (buffer) => {
        try {
          const bytes = new Uint8Array(buffer);
          const binary = bytes.reduce((str, byte) => str + String.fromCharCode(byte), '');
          return window.btoa(binary);
        } catch (error) {
          console.error('Error in arrayToBase64:', error);
          throw new Error('Failed to encode data to base64');
        }
      };

      // Safe base64 decoding function that handles PEM format
      const base64ToArray = (base64String) => {
        try {
          // Handle PEM format
          let cleanBase64 = base64String;
          if (base64String.includes('-----BEGIN')) {
            cleanBase64 = base64String
              .replace(/-----BEGIN [^-]+-----/, '')
              .replace(/-----END [^-]+-----/, '')
              .replace(/[\n\r\s]/g, '');
          } else {
            cleanBase64 = base64String.replace(/[\n\r\s]/g, '');
          }

          // Validate base64 string
          if (!cleanBase64.match(/^[A-Za-z0-9+/]*={0,2}$/)) {
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
          throw new Error('Failed to decode data');
        }
      };

      // Combine and encode IV and encrypted message
      const combinedArray = new Uint8Array([...iv, ...new Uint8Array(encryptedMessage)]);
      const finalEncryptedMessage = arrayToBase64(combinedArray);

      // Get recipient's public key
      const publicKeyResponse = await fetch(`${API_BASE_URL}/public-key/${activeChat.code}`, {
        headers: {
          'Authorization': `Bearer ${authState.token}`
        }
      });
      
      if (!publicKeyResponse.ok) {
        throw new Error('Failed to fetch recipient public key');
      }

      const { publicKey: recipientPublicKey } = await publicKeyResponse.json();
      
      if (!recipientPublicKey) {
        throw new Error('Recipient public key is missing');
      }

      // Import recipient's public key
      const recipientPublicKeyArray = base64ToArray(recipientPublicKey);
      const importedRecipientPublicKey = await crypto.subtle.importKey(
        'spki',
        recipientPublicKeyArray,
        {
          name: 'RSA-OAEP',
          hash: 'SHA-256'
        },
        false,
        ['encrypt']
      );

      // Encrypt AES key with recipient's public key
      const recipientEncryptedAESKey = await crypto.subtle.encrypt(
        { name: 'RSA-OAEP' },
        importedRecipientPublicKey,
        aesKey
      );

      // Convert encrypted AES key to base64
      const recipientEncryptedAESKeyBase64 = arrayToBase64(recipientEncryptedAESKey);

      // Now encrypt the same message for ourselves using our own public key
      const myPublicKeyArray = base64ToArray(authState.user.publicKey);
      const importedMyPublicKey = await crypto.subtle.importKey(
        'spki',
        myPublicKeyArray,
        {
          name: 'RSA-OAEP',
          hash: 'SHA-256'
        },
        false,
        ['encrypt']
      );

      // Encrypt AES key with our public key
      const myEncryptedAESKey = await crypto.subtle.encrypt(
        { name: 'RSA-OAEP' },
        importedMyPublicKey,
        aesKey
      );

      // Convert our encrypted AES key to base64
      const myEncryptedAESKeyBase64 = arrayToBase64(myEncryptedAESKey);

      // Store in localStorage
      const sentMessage = {
        id: messageId,
        encryptedMessage: finalEncryptedMessage,
        encryptedAESKey: myEncryptedAESKeyBase64,
        timestamp: Date.now()
      };

      // Get existing sent messages or initialize empty array
      const sentMessages = JSON.parse(localStorage.getItem('sentMessages') || '{}');
      if (!sentMessages[activeChat.code]) {
        sentMessages[activeChat.code] = [];
      }
      sentMessages[activeChat.code].push(sentMessage);
      localStorage.setItem('sentMessages', JSON.stringify(sentMessages));

      // Send to server
      const response = await fetch(`${API_BASE_URL}/send-message`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${authState.token}`
        },
        body: JSON.stringify({
          to: activeChat.code,
          encryptedMessage: finalEncryptedMessage,
          encryptedAESKey: recipientEncryptedAESKeyBase64,
          id: messageId, // Send the ID to the server
          timestamp: sentMessage.timestamp // Optionally send your timestamp
        })
      });

      const result = await response.json();
      
      if (!response.ok) {
        throw new Error(result.message || 'Failed to send message');
      }

      // Add message to current chat with the encrypted version for ourselves
      const newMessage = {
        from: 'me',
        to: activeChat.code,
        encryptedMessage: finalEncryptedMessage,
        encryptedAESKey: myEncryptedAESKeyBase64,
        decryptedContent: message, // <-- Show original text immediately
        id: messageId,
        timestamp: Date.now()
      };

      setMessagesByChat(prev => ({
        ...prev,
        [activeChat.code]: [...(prev[activeChat.code] || []), newMessage]
      }));

      // Update chat list
      setChats(prev => {
        const updated = [...prev];
        const chatIndex = updated.findIndex(chat => chat.code === activeChat.code);
        if (chatIndex !== -1) {
          updated[chatIndex] = {
            ...updated[chatIndex],
            lastMessage: message,
            lastMessageTime: Date.now()
          };
        }
        return updated;
      });

    } catch (err) {
      console.error('Failed to send message:', err);
      alert('Failed to send message. Please try again.');
    }
  };

  const fetchMessages = async () => {
    try {
      const response = await fetch(`${API_BASE_URL}/fetch-messages`, {
        headers: {
          'Authorization': `Bearer ${authState.token}`
        }
      });
      
      const result = await response.json();
      console.log('Fetch messages response:', result);
      
      if (!response.ok) {
        throw new Error(result.message);
      }

      if (result.messages && result.messages.length > 0) {
        // Group new messages by chat and decrypt them
        const newMessages = {};
        for (const msg of result.messages) {
          try {
            const chatId = msg.from;
            if (!newMessages[chatId]) {
              newMessages[chatId] = [];
            }

            // Validate message format
            if (!msg.encryptedMessage || !msg.encryptedAESKey) {
              console.error('Invalid message format:', msg);
              continue;
            }

            // Decrypt the message
            const decryptedMessage = await decryptMessage(msg);
            if (decryptedMessage.startsWith('Error decrypting message:')) {
              console.error('Failed to decrypt message:', decryptedMessage);
              continue;
            }

            newMessages[chatId].push({
              ...msg,
              from: msg.from,
              decryptedContent: decryptedMessage,
              originalEncryptedMessage: msg.encryptedMessage
            });
          } catch (err) {
            console.error('Error processing message:', err);
            continue;
          }
        }

        // Update messages and chats
        setMessagesByChat(prev => {
          const updated = { ...prev };
          Object.entries(newMessages).forEach(([chatId, messages]) => {
            if (!updated[chatId]) {
              updated[chatId] = [];
            }
            // Filter out any duplicate messages by timestamp
            const existingTimestamps = new Set(updated[chatId].map(m => m.timestamp));
            const newUniqueMessages = messages.filter(m => !existingTimestamps.has(m.timestamp));
            updated[chatId] = [...updated[chatId], ...newUniqueMessages];
            // Sort messages by timestamp
            updated[chatId].sort((a, b) => a.timestamp - b.timestamp);
          });
          return updated;
        });

        // Update chat list with latest messages
        setChats(prev => {
          const updated = [...prev];
          Object.entries(newMessages).forEach(([chatId, messages]) => {
            if (messages.length > 0) {
              const latestMessage = messages[messages.length - 1];
              const chatIndex = updated.findIndex(chat => chat.code === chatId);
              if (chatIndex !== -1) {
                updated[chatIndex] = {
                  ...updated[chatIndex],
                  lastMessage: latestMessage.decryptedContent,
                  lastMessageTime: latestMessage.timestamp
                };
              } else {
                updated.push({
                  code: chatId,
                  email: chatId,
                  lastMessage: latestMessage.decryptedContent,
                  lastMessageTime: latestMessage.timestamp
                });
              }
            }
          });
          return updated;
        });
      }
    } catch (err) {
      console.error('Failed to fetch messages:', err);
    }
  };

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

  const handleLogout = () => {
    setAuthState({
      isAuthenticated: false,
      user: null,
      token: null
    });
    localStorage.removeItem('authState');
    setMessages([]);
    setChats([]);
    setActiveChat(null);
  };

  return (
    <>
      <FlamesBackground />
      <Container
        style={{
          maxWidth: '100%',
          padding: '0 30px',
          fontFamily: "'SF Pro Display', -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Helvetica, Arial, sans-serif",
          color: '#eaeaea',
          backgroundColor: '#111b21',
          minHeight: '100vh',
          background: 'linear-gradient(135deg, #111b21 0%, #1a2b3c 100%)',
        }}
      >
        <Header
          style={{
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'center',
            padding: '30px 0',
            borderBottom: '1px solid #2a3942',
            position: 'relative',
            zIndex: 10
          }}
        >
          <FlameSticker>🔥</FlameSticker>
          <Title style={{ 
            fontSize: '60px', 
            color: '#00a884', 
            letterSpacing: '2px',
            fontFamily: 'SF Pro Display',
            fontWeight: 'bold',
            margin: 0,
            position: 'relative',
            zIndex: 1
          }}>FLAMES</Title>
          {authState.isAuthenticated && (
            <div style={{ display: 'flex', alignItems: 'center', gap: '20px' }}>
              <span style={{ fontSize: '16px', color: '#b0b9be' }}>
                Your code:{' '}
                <strong style={{ 
                  color: '#00a884', 
                  fontWeight: 600,
                  fontSize: '18px',
                  background: 'linear-gradient(45deg, #00a884, #00d4a3)',
                  WebkitBackgroundClip: 'text',
                  WebkitTextFillColor: 'transparent'
                }}>
                  {authState.user?.code}
                </strong>
              </span>
              <Button
                onClick={handleLogout}
                style={{
                  backgroundColor: '#1f2c33',
                  color: '#eaeaea',
                  border: 'none',
                  padding: '12px 24px',
                  borderRadius: '12px',
                  cursor: 'pointer',
                  fontSize: '16px',
                  fontWeight: 500
                }}
              >
                Logout
              </Button>
            </div>
          )}
        </Header>
  
        {!authState.isAuthenticated ? (
          <>
            {isLogin ? (
              <LoginForm onSubmit={handleLogin} error={error} />
            ) : (
              <SignupForm onSubmit={handleSignup} error={error} />
            )}
            <ToggleLink style={{ textAlign: 'center', marginTop: '30px' }}>
              <a
                href="#"
                onClick={(e) => {
                  e.preventDefault();
                  setIsLogin(!isLogin);
                  setError('');
                }}
                style={{
                  color: '#00a884',
                  fontSize: '16px',
                  textDecoration: 'none',
                  fontWeight: 500,
                  transition: 'all 0.3s ease',
                  padding: '10px 20px',
                  borderRadius: '8px',
                  ':hover': {
                    backgroundColor: 'rgba(0, 168, 132, 0.1)'
                  }
                }}
              >
                {isLogin ? "Don't have an account? Sign Up" : 'Already have an account? Log In'}
              </a>
            </ToggleLink>
          </>
        ) : (
          <ChatContainer
            style={{
              display: 'flex',
              height: 'calc(100vh - 120px)',
              marginTop: '30px',
              borderRadius: '20px',
              overflow: 'hidden',
              boxShadow: '0 0 30px rgba(0,0,0,0.4)',
            }}
          >
            <div style={{ 
              width: '570px',
              backgroundColor: 'rgba(31, 44, 51, 0.8)',
              padding: '10px',
              overflowY: 'auto',
              backdropFilter: 'blur(10px)',
              borderRight: '1px solid rgba(255, 255, 255, 0.1)'
            }}>
              <ChatList
                chats={chats}
                activeChat={activeChat}
                onChatSelect={setActiveChat}
                onStartChat={handleStartChat}
                userCode={authState.user?.code}
                error={chatError}
              />
            </div>
            {activeChat ? (
              <ChatView
                activeChat={activeChat}
                messages={messagesByChat[activeChat.code] || []}
                onSendMessage={handleSendMessage}
                error={chatError}
              />
            ) : (
              <EmptyState>
                <GlassCard>
                  <AnimatedFlame>🔥</AnimatedFlame>
                  <Headline>Ready to spark a new chat?</Headline>
                  <Subtext>Start a <span role="img" aria-label="fire">🔥</span> conversation and make it lit!</Subtext>
                </GlassCard>
              </EmptyState>
            )}
          </ChatContainer>
        )}
      </Container>
    </>
  );
  
};

export default App;
