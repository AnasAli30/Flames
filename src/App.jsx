import { useState, useEffect } from 'react';
import styled from '@emotion/styled';
import {
  Container,
  Title,
  Subtitle,
  ToggleLink,
  Button
} from './styles/StyledComponents';
import FlamesBackground from './components/FlamesBackground';
import LoginForm from './components/auth/LoginForm';
import SignupForm from './components/auth/SignupForm';
import ChatList from './components/messaging/ChatList';
import ChatView from './components/messaging/ChatView';

const ChatContainer = styled.div`
  display: flex;
  height: 100%;
  background: #111b21;
  border-radius: 12px;
  overflow: hidden;
  margin-top: 20px;
  max-width: 1400px;
  width: 100%;
  margin-left: auto;
  margin-right: auto;
  box-shadow: 0 8px 32px rgba(0, 0, 0, 0.2);
`;

const Header = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  max-width: 1400px;
  width: 100%;
  margin: 0 auto;
  padding: 20px 0;
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
      const response = await fetch('http://localhost:5000/message-history', {
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

      if (Array.isArray(result.messages)) {
        result.messages.forEach(msg => {
          if (!msg) return; // Skip invalid messages
          
          // For sent messages, the other user is the recipient (to)
          // For received messages, the other user is the sender (from)
          const otherUser = msg.from === authState.user?.code ? msg.to : msg.from;
          if (!otherUser) return; // Skip messages without proper sender/receiver
          
          // Update chat list
          if (!chatMap.has(otherUser)) {
            chatMap.set(otherUser, {
              code: otherUser,
              email: otherUser, // In a real app, we'd have the actual email
              lastMessage: msg.encryptedMessage,
              lastMessageTime: msg.timestamp
            });
          } else if (msg.timestamp > chatMap.get(otherUser).lastMessageTime) {
            const chat = chatMap.get(otherUser);
            chat.lastMessage = msg.encryptedMessage;
            chat.lastMessageTime = msg.timestamp;
          }

          // Group messages by chat
          if (!msgMap[otherUser]) {
            msgMap[otherUser] = [];
          }
          msgMap[otherUser].push({
            ...msg,
            from: msg.from === authState.user?.code ? 'me' : msg.from
          });
        });

        // Sort messages by timestamp for each chat
        Object.values(msgMap).forEach(messages => {
          messages.sort((a, b) => a.timestamp - b.timestamp);
        });
      }

      const chatList = Array.from(chatMap.values());
      console.log('Processed chat list:', chatList);
      console.log('Processed messages by chat:', msgMap);

      setChats(chatList);
      setMessagesByChat(msgMap);
    } catch (err) {
      console.error('Failed to fetch chat list:', err);
      setChats([]);
      setMessagesByChat({});
    }
  };

  const handleLogin = async (data) => {
    try {
      console.log('Attempting login with:', data);
      const response = await fetch('http://localhost:5000/login', {
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
      const response = await fetch('http://localhost:5000/register', {
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
      const response = await fetch(`http://localhost:5000/public-key/${code}`, {
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
    
    try {
      const response = await fetch('http://localhost:5000/send-message', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${authState.token}`
        },
        body: JSON.stringify({
          to: activeChat.code,
          message: message,
          encryptedAESKey: 'dummy-key'
        })
      });

      const result = await response.json();
      
      if (!response.ok) {
        throw new Error(result.message);
      }

      // Add message to current chat
      const newMessage = {
        from: 'me',
        to: activeChat.code,
        encryptedMessage: message,
        timestamp: Date.now()
      };

      setMessagesByChat(prev => ({
        ...prev,
        [activeChat.code]: [...(prev[activeChat.code] || []), newMessage]
      }));

      // Update chat list
      setChats(prev => {
        const updatedChats = [...prev];
        const chatIndex = updatedChats.findIndex(chat => chat.code === activeChat.code);
        if (chatIndex !== -1) {
          updatedChats[chatIndex] = {
            ...updatedChats[chatIndex],
            lastMessage: message,
            lastMessageTime: Date.now()
          };
        }
        return updatedChats;
      });

      setChatError('');
    } catch (err) {
      setChatError(err.message || 'Failed to send message');
    }
  };

  const fetchMessages = async () => {
    try {
      const response = await fetch('http://localhost:5000/fetch-messages', {
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
        // Group new messages by chat
        const newMessages = {};
        result.messages.forEach(msg => {
          const chatId = msg.from;
          if (!newMessages[chatId]) {
            newMessages[chatId] = [];
          }
          newMessages[chatId].push({
            ...msg,
            from: msg.from
          });
        });

        // Update messages and chats
        setMessagesByChat(prev => {
          const updated = { ...prev };
          Object.entries(newMessages).forEach(([chatId, messages]) => {
            updated[chatId] = [...(updated[chatId] || []), ...messages];
          });
          console.log('Updated messages after fetch:', updated);
          return updated;
        });

        // Update chat list with latest messages
        setChats(prev => {
          const updated = [...prev];
          Object.entries(newMessages).forEach(([chatId, messages]) => {
            const latestMessage = messages[messages.length - 1];
            const chatIndex = updated.findIndex(chat => chat.code === chatId);
            if (chatIndex !== -1) {
              updated[chatIndex] = {
                ...updated[chatIndex],
                lastMessage: latestMessage.encryptedMessage,
                lastMessageTime: latestMessage.timestamp
              };
            } else {
              updated.push({
                code: chatId,
                email: chatId,
                lastMessage: latestMessage.encryptedMessage,
                lastMessageTime: latestMessage.timestamp
              });
            }
          });
          console.log('Updated chat list after fetch:', updated);
          return updated;
        });
      }
    } catch (err) {
      console.error('Failed to fetch messages:', err);
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
      <Container style={{ maxWidth: '100%', padding: '0 20px' }}>
        <Header>
          <Title>FLAMES</Title>
          {authState.isAuthenticated && (
            <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
              <span style={{ color: '#8696a0', fontSize: '14px' }}>
                Your code: <strong style={{ color: '#00a884' }}>{authState.user?.code}</strong>
              </span>
              <Button onClick={handleLogout}>Logout</Button>
            </div>
          )}
        </Header>
        
        {!authState.isAuthenticated ? (
          <div style={{ maxWidth: '500px', margin: '0 auto', width: '100%' }}>
            <Subtitle>{isLogin ? 'Login' : 'Sign Up'}</Subtitle>
            {isLogin ? (
              <LoginForm onSubmit={handleLogin} error={error} />
            ) : (
              <SignupForm onSubmit={handleSignup} error={error} />
            )}
            <ToggleLink>
              <a href="#" onClick={(e) => {
                e.preventDefault();
                setIsLogin(!isLogin);
                setError('');
              }}>
                {isLogin ? "Don't have an account? Sign Up" : 'Already have an account? Log In'}
              </a>
            </ToggleLink>
          </div>
        ) : (
          <ChatContainer>
            <ChatList 
              chats={chats}
              activeChat={activeChat}
              onChatSelect={setActiveChat}
              onStartChat={handleStartChat}
              userCode={authState.user?.code}
              error={chatError}
            />
            {activeChat ? (
              <ChatView
                activeChat={activeChat}
                messages={messagesByChat[activeChat.code] || []}
                onSendMessage={handleSendMessage}
                error={chatError}
              />
            ) : (
              <div style={{ 
                flex: 1, 
                display: 'flex', 
                alignItems: 'center', 
                justifyContent: 'center',
                color: '#8696a0',
                fontSize: '18px',
                background: '#0b141a',
                padding: '20px',
                flexDirection: 'column',
                gap: '10px'
              }}>
                <div>Select a chat or start a new one to begin messaging</div>
              </div>
            )}
          </ChatContainer>
        )}
      </Container>
    </>
  );
};

export default App;
