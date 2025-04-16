const express = require('express');
const cors = require('cors');
const Redis = require('ioredis');

const app = express();
const redis = new Redis();
const subscriber = new Redis();

app.use(cors());
app.use(express.json());

const activeUsers = new Set();


const CHAT_CHANNEL = 'chat_messages';
const USER_CHANNEL = 'user_events';


subscriber.subscribe(CHAT_CHANNEL, USER_CHANNEL, (err, count) => {
    if (err) {
        console.error('Failed to subscribe:', err.message);
    } else {
        console.log(`Subscribed to ${count} channels`);
    }
});


subscriber.on('message', (channel, message) => {
    const data = JSON.parse(message);
    switch (channel) {
        case CHAT_CHANNEL:
            // Broadcast to all connected clients
            broadcastMessage(data);
            break;
        case USER_CHANNEL:
            handleUserEvent(data);
            break;
    }
});

app.post('/api/login', (req, res) => {
    const { username } = req.body;
    if (!username) {
        return res.status(400).json({ error: 'Username is required' });
    }

    if (activeUsers.has(username)) {
        return res.status(400).json({ error: 'Username already taken' });
    }

    activeUsers.add(username);
    redis.publish(USER_CHANNEL, JSON.stringify({
        type: 'join',
        username,
        timestamp: new Date()
    }));

    res.json({ success: true, activeUsers: Array.from(activeUsers) });
});

app.post('/api/logout', (req, res) => {
    const { username } = req.body;
    if (username && activeUsers.has(username)) {
        activeUsers.delete(username);
        redis.publish(USER_CHANNEL, JSON.stringify({
            type: 'leave',
            username,
            timestamp: new Date()
        }));
    }
    res.json({ success: true });
});

app.post('/api/messages', async (req, res) => {
    const { username, text } = req.body;
    if (!username || !text) {
        return res.status(400).json({ error: 'Username and text are required' });
    }

    const message = {
        id: Date.now(),
        username,
        text,
        timestamp: new Date()
    };

    await redis.rpush('messages', JSON.stringify(message));
    
    
    redis.publish(CHAT_CHANNEL, JSON.stringify(message));
    
    res.json({ success: true, message });
});

app.get('/api/messages', async (req, res) => {
    const messages = await redis.lrange('messages', 0, -1);
    res.json({
        messages: messages.map(msg => JSON.parse(msg))
    });
});

app.get('/api/users', (req, res) => {
    res.json({
        users: Array.from(activeUsers)
    });
});


app.use((err, req, res, next) => {
    console.error(err.stack);
    res.status(500).json({ error: 'Something went wrong!' });
});

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
}); 