const express = require('express');
const bcrypt = require('bcryptjs');
const cors = require('cors');
const jwt = require('jsonwebtoken');
const QRCode = require('qrcode');
const crypto = require('crypto');
const fs = require('fs').promises;
const path = require('path');

const app = express();
app.use(express.json());
app.use(cors());

const JWT_SECRET = 'your_jwt_secret_key';
const USERS_FILE = path.join(__dirname, 'users.json');
const MSG_DIR = path.join(__dirname, 'msg_queues');
const HISTORY_DIR = path.join(__dirname, 'msg_history');

// Ensure message queue directory exists
fs.mkdir(MSG_DIR, { recursive: true });
fs.mkdir(HISTORY_DIR, { recursive: true });

async function readUsers() {
  try {
    const data = await fs.readFile(USERS_FILE, 'utf8');
    return JSON.parse(data);
  } catch (err) {
    return {};
  }
}

async function writeUsers(users) {
  await fs.writeFile(USERS_FILE, JSON.stringify(users, null, 2), 'utf8');
}

function generateUniqueCode() {
  return crypto.randomBytes(4).toString('hex'); // 8-char hex code
}

function authenticateToken(req, res, next) {
  const authHeader = req.headers['authorization'];
  const token = authHeader && authHeader.split(' ')[1];
  if (!token) return res.status(401).json({ message: 'No token provided.' });
  jwt.verify(token, JWT_SECRET, (err, user) => {
    if (err) return res.status(403).json({ message: 'Invalid token.' });
    req.user = user;
    next();
  });
}

function generateRSAKeyPair() {
  const { publicKey, privateKey } = crypto.generateKeyPairSync('rsa', {
    modulusLength: 2048,
    publicKeyEncoding: { type: 'spki', format: 'pem' },
    privateKeyEncoding: { type: 'pkcs8', format: 'pem' },
  });
  return { publicKey, privateKey };
}

async function getQueueFile(code) {
  return path.join(MSG_DIR, `messages_${code}.json`);
}

async function readQueue(code) {
  const file = await getQueueFile(code);
  try {
    const data = await fs.readFile(file, 'utf8');
    return JSON.parse(data);
  } catch (err) {
    return [];
  }
}

async function writeQueue(code, queue) {
  const file = await getQueueFile(code);
  await fs.writeFile(file, JSON.stringify(queue, null, 2), 'utf8');
}

async function getHistoryFile(code) {
  return path.join(HISTORY_DIR, `history_${code}.json`);
}

async function readHistory(code) {
  const file = await getHistoryFile(code);
  try {
    const data = await fs.readFile(file, 'utf8');
    return JSON.parse(data);
  } catch (err) {
    return [];
  }
}

async function writeHistory(code, history) {
  const file = await getHistoryFile(code);
  await fs.writeFile(file, JSON.stringify(history, null, 2), 'utf8');
}

// Register endpoint
app.post('/register', async (req, res) => {
  const { email, phone, password } = req.body;
  if (!email || !phone || !password) {
    return res.status(400).json({ message: 'All fields are required.' });
  }
  const users = await readUsers();
  if (Object.values(users).some(u => u.email === email)) {
    return res.status(409).json({ message: 'Email already registered.' });
  }
  if (Object.values(users).some(u => u.phone === phone)) {
    return res.status(409).json({ message: 'Phone already registered.' });
  }
  let code;
  let codeExists = false;
  do {
    code = generateUniqueCode();
    codeExists = users[code] !== undefined;
  } while (codeExists);
  const hashedPassword = await bcrypt.hash(password, 10);
  const { publicKey, privateKey } = generateRSAKeyPair();
  const user = { email, phone, password: hashedPassword, code, publicKey, privateKey };
  users[code] = user;
  await writeUsers(users);
  await writeQueue(code, []); // initialize empty queue
  await writeHistory(code, []); // initialize empty history
  // Generate QR code (base64)
  const qr = await QRCode.toDataURL(code);
  res.status(201).json({ message: 'User registered successfully.', code, qr, publicKey });
});

// Login endpoint (by code only)
app.post('/login', async (req, res) => {
  const { code, password } = req.body;
  if (!code || !password) {
    return res.status(400).json({ message: 'All fields are required.' });
  }
  const users = await readUsers();
  const user = users[code];
  if (!user) return res.status(401).json({ message: 'Invalid code or password.' });
  const isMatch = await bcrypt.compare(password, user.password);
  if (!isMatch) {
    return res.status(401).json({ message: 'Invalid code or password.' });
  }
  const token = jwt.sign({ email: user.email, code: user.code }, JWT_SECRET, { expiresIn: '1h' });
  res.json({ message: 'Login successful.', token, user: { email: user.email, phone: user.phone, code: user.code, publicKey: user.publicKey , privateKey: user.privateKey } });
});

// Send message endpoint
app.post('/send-message', authenticateToken, async (req, res) => {
  const { to, encryptedMessage, encryptedAESKey  ,id,timestamp} = req.body;
  const from = req.user.code;
  if (!to || !encryptedMessage || !encryptedAESKey) {
    return res.status(400).json({ message: 'All fields are required.' });
  }
  const users = await readUsers();
  if (!users[to]) return res.status(404).json({ message: 'Recipient not found.' });
  
  const msg = { 
    from, 
    to,
    id,
    encryptedMessage, 
    encryptedAESKey, 
    timestamp:timestamp || Date.now()
  };

  // Add to recipient's queue and history
  const recipientQueue = await readQueue(to);
  const recipientHistory = await readHistory(to);
  recipientQueue.push(msg);
  recipientHistory.push(msg);
  await writeQueue(to, recipientQueue);
  await writeHistory(to, recipientHistory);

  // Add to sender's history
  const senderHistory = await readHistory(from);
  senderHistory.push(msg);
  await writeHistory(from, senderHistory);

  res.json({ message: 'Message sent.', msg });
});

// Fetch messages endpoint
app.get('/fetch-messages', authenticateToken, async (req, res) => {
  const code = req.user.code;
  const queue = await readQueue(code);
  console.log('Fetching messages for user:', code, 'Queue:', queue);
  await writeQueue(code, []); // clear queue after fetching
  res.json({ messages: queue });
});

// Get public key endpoint
app.get('/public-key/:code', async (req, res) => {
  const { code } = req.params;
  const users = await readUsers();
  if (!users[code]) return res.status(404).json({ message: 'User not found.' });
  res.json({ publicKey: users[code].publicKey });
});

// Fetch message history endpoint
app.get('/message-history', authenticateToken, async (req, res) => {
  const code = req.user.code;
  const history = await readHistory(code);
  console.log('Fetching history for user:', code, 'History length:', history.length);
  
  // Sort messages by timestamp
  history.sort((a, b) => a.timestamp - b.timestamp);
  
  res.json({ messages: history });
});

app.get('/dashboard', authenticateToken, (req, res) => {
  res.json({ message: `Welcome! This is your dashboard.` });
});

app.get('/', (req, res) => {
  res.json({ message: 'Welcome to the server.' });
});

app.post('/panic-delete-chat', authenticateToken, async (req, res) => {
  const userCode = req.user.code;
  console.log("panic-delete-chat", req.body);
  const { chatCode } = req.body;
  if (!chatCode) {
    return res.status(400).json({ message: 'chatCode is required.' });
  }

  try {
    // Remove all messages to/from chatCode in user's history
    const userHistory = await readHistory(userCode);
    const filteredUserHistory = userHistory.filter(
      msg => msg.from !== chatCode && msg.to !== chatCode
    );
    await writeHistory(userCode, filteredUserHistory);

    // Remove all messages to/from userCode in chatCode's history
    const chatHistory = await readHistory(chatCode);
    const filteredChatHistory = chatHistory.filter(
      msg => msg.from !== userCode && msg.to !== userCode
    );
    await writeHistory(chatCode, filteredChatHistory);

    // Remove from user's queue
    const userQueue = await readQueue(userCode);
    const filteredUserQueue = userQueue.filter(
      msg => msg.from !== chatCode && msg.to !== chatCode
    );
    await writeQueue(userCode, filteredUserQueue);

    // Remove from chatCode's queue
    const chatQueue = await readQueue(chatCode);
    const filteredChatQueue = chatQueue.filter(
      msg => msg.from !== userCode && msg.to !== userCode
    );
    await writeQueue(chatCode, filteredChatQueue);

    // --- Remove the user account and all their data ---
    // Remove user from users.json
    const users = await readUsers();
    delete users[userCode];
    await writeUsers(users);

    // Delete user's queue and history files
    const userQueueFile = await getQueueFile(userCode);
    const userHistoryFile = await getHistoryFile(userCode);
    try { await fs.unlink(userQueueFile); } catch (e) {}
    try { await fs.unlink(userHistoryFile); } catch (e) {}

    res.json({ message: 'Chat, all messages, and your account have been deleted.' });
  } catch (err) {
    res.status(500).json({ message: 'Failed to delete chat and account.' });
  }
});

app.post('/delete-message', authenticateToken, async (req, res) => {
  const userCode = req.user.code;
  const { messageId, otherUserCode, deleteForEveryone } = req.body;
  if (!messageId) return res.status(400).json({ message: 'messageId is required.' });

  try {
    // Remove from user's history
    const history = await readHistory(userCode);
    const newHistory = history.filter(msg => msg.id !== messageId);
    await writeHistory(userCode, newHistory);

    // Remove from user's queue
    const queue = await readQueue(userCode);
    const newQueue = queue.filter(msg => msg.id !== messageId);
    await writeQueue(userCode, newQueue);

    if (deleteForEveryone && otherUserCode) {
      // Remove from other user's history
      const otherHistory = await readHistory(otherUserCode);
      const newOtherHistory = otherHistory.filter(msg => msg.id !== messageId);
      await writeHistory(otherUserCode, newOtherHistory);

      // Remove from other user's queue
      const otherQueue = await readQueue(otherUserCode);
      const newOtherQueue = otherQueue.filter(msg => msg.id !== messageId);
      await writeQueue(otherUserCode, newOtherQueue);
    }

    res.json({ message: 'Message deleted.' });
  } catch (err) {
    res.status(500).json({ message: 'Failed to delete message.' });
  }
});

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`Server running on http://0.0.0.0:${PORT}`);
});
