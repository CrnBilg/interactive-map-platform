const express = require('express');
const http = require('http');
const { Server } = require('socket.io');
const mongoose = require('mongoose');
const cors = require('cors');
const dotenv = require('dotenv');

dotenv.config();

const app = express();
const server = http.createServer(app);

const io = new Server(server, {
  cors: {
    origin: process.env.CLIENT_URL || 'http://localhost:5173',
    methods: ['GET', 'POST'],
  },
});

// Middleware
app.use(cors({ origin: process.env.CLIENT_URL || 'http://localhost:5173' }));
app.use(express.json());
app.use('/uploads', express.static('uploads'));

// Routes
app.use('/api/auth', require('./routes/auth'));
app.use('/api/places', require('./routes/places'));
app.use('/api/events', require('./routes/events'));
app.use('/api/reviews', require('./routes/reviews'));
app.use('/api/cities', require('./routes/cities'));

// Health check
app.get('/', (req, res) => res.json({ message: 'CityLore API running 🏛️' }));

// Socket.IO for real-time events
io.on('connection', (socket) => {
  console.log('User connected:', socket.id);

  socket.on('join_city', (cityId) => {
    socket.join(`city_${cityId}`);
    console.log(`Socket ${socket.id} joined city_${cityId}`);
  });

  socket.on('leave_city', (cityId) => {
    socket.leave(`city_${cityId}`);
  });

  socket.on('new_event', (eventData) => {
    // Broadcast to all users in that city
    socket.to(`city_${eventData.cityId}`).emit('event_added', eventData);
  });

  socket.on('disconnect', () => {
    console.log('User disconnected:', socket.id);
  });
});

// Make io accessible to routes
app.set('io', io);

// MongoDB Connection
mongoose
  .connect(process.env.MONGO_URI)
  .then(() => {
    console.log('✅ MongoDB connected');
    server.listen(process.env.PORT || 5000, () => {
      console.log(`🚀 Server running on port ${process.env.PORT || 5000}`);
    });
  })
  .catch((err) => {
    console.error('❌ MongoDB connection error:', err);
    process.exit(1);
  });
