import express from 'express';
import cors from 'cors';
import morgan from 'morgan';
import helmet from 'helmet';
import dotenv from 'dotenv';
import mongoose from 'mongoose';
import http from 'http';
import { Server as SocketIOServer } from 'socket.io';

import authRoutes from './routes/auth.js';
import twoFARoutes from './routes/2fa.js';
import ChatMessage from './models/ChatMessage.js';
import activityLogsRoutes from './routes/activityLogs.js';
import passwordResetRoutes from './routes/passwordReset.js';
import analyticsRoutes from './routes/analytics.js';
import paymentRoutes from './routes/payment.js';

dotenv.config();

const app = express();
const server = http.createServer(app);
const io = new SocketIOServer(server, {
  cors: {
    origin: '*',
    methods: ['GET', 'POST'],
  },
});

// Middleware
app.use(helmet());
app.use(cors());
app.use(express.json({ limit: '10mb' }));
app.use(express.urlencoded({ extended: true }));
app.use(morgan('dev'));

// MongoDB connection
mongoose.connect(process.env.MONGODB_URI, {
  useNewUrlParser: true,
  useUnifiedTopology: true,
})
.then(() => console.log('MongoDB connected'))
.catch((err) => console.error('MongoDB connection error:', err));

// Basic route
app.get('/', (req, res) => {
  res.send('CyberShield Guardian API is running');
});

// Routes
app.use('/api/auth', authRoutes);
app.use('/api/2fa', twoFARoutes);
app.use('/api/activity-logs', activityLogsRoutes);
app.use('/api/password-reset', passwordResetRoutes);
app.use('/api/analytics', analyticsRoutes);
app.use('/api/payment', paymentRoutes);

// Socket.io chat handling
io.on('connection', (socket) => {
  console.log('New client connected:', socket.id);

  socket.on('sendMessage', async (data) => {
    const { senderId, message } = data;
    try {
      const chatMessage = new ChatMessage({
        sender: senderId,
        message,
      });
      await chatMessage.save();
      io.emit('receiveMessage', {
        senderId,
        message,
        timestamp: chatMessage.timestamp,
      });
    } catch (error) {
      console.error('Error saving chat message:', error);
    }
  });

  socket.on('disconnect', () => {
    console.log('Client disconnected:', socket.id);
  });
});

const PORT = process.env.PORT || 5000;

server.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
