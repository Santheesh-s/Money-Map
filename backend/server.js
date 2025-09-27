// backend/index.js
require('dotenv').config(); // Load .env before anything else

const express = require('express');
const cors = require('cors');
const mongoose = require('mongoose');
const path = require('path');
const cookieParser = require('./middleware/cookieParser');

const app = express();
const PORT = process.env.PORT || 5000;

// Middleware
const corsOptions = {
  origin: process.env.NODE_ENV === 'production' 
    ? process.env.FRONTEND_URL || true 
    : 'http://localhost:3000',
  credentials: true
};
app.use(cors(corsOptions));
app.use(express.json());
app.use(cookieParser());

// MongoDB Connection
mongoose.connect(process.env.MONGO_URI, {
  useNewUrlParser: true,
  useUnifiedTopology: true,
});
const db = mongoose.connection;
db.once('open', () => console.log('MongoDB connected'));
db.on('error', (err) => console.error('MongoDB error:', err));

// Simple Test Route
app.get('/', (req, res) => {
  res.send('Backend is working!');
});

const transactionRoutes = require('./routes/transactionRoutes');
app.use('/transactions', transactionRoutes);

const authRoutes = require('./routes/authRoutes');
app.use('/auth', authRoutes);

const receiptUploadRoutes = require('./routes/receiptUploadRoutes');
app.use('/receipt', receiptUploadRoutes);

const chatRoutes = require('./routes/chatRoutes');
app.use('/chat', chatRoutes);

const userRoutes = require('./routes/userRoutes');
app.use('/user', userRoutes);

const budgetRoutes = require('./routes/budgetRoutes');
app.use('/budgets', budgetRoutes);

// Serve static files from React build in production
if (process.env.NODE_ENV === 'production') {
  app.use(express.static(path.join(__dirname, '../frontend/build')));
  
  // Handle React routing, return all requests to React app
  app.get('*', (req, res) => {
    res.sendFile(path.join(__dirname, '../frontend/build', 'index.html'));
  });
}

// Initialize budget notification service
const { scheduleBudgetChecks } = require('./services/budgetNotificationService');
scheduleBudgetChecks();

// Start Server
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
