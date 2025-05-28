require('dotenv').config();
const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');

const authRoutes = require('./routes/auth');
const profileRoutes = require('./routes/profile');
const savedJobsRoutes = require('./routes/savedJobs');
const resetPasswordRoutes = require('./routes/resetPassword'); // Reset password routes

const app = express();

// Connect to MongoDB
mongoose
  .connect(process.env.MONGO_URI || 'mongodb://127.0.0.1:27017/career-snap')
  .catch((err) => console.error('MongoDB connection error:', err));

// Middleware
app.use(express.json());

// Updated CORS config
const whitelist = ['http://localhost:5173', 'https://careersnap.l5.ca'];
const corsOptions = {
  origin: function (origin, callback) {
    if (!origin || whitelist.indexOf(origin) !== -1) {
      callback(null, true);
    } else {
      callback(new Error('Not allowed by CORS'));
    }
  },
  credentials: true, // This enables cookies/auth headers across origins
};
app.use(cors(corsOptions));

// Test route
app.get('/', (req, res) => res.send('Hello World'));

// API routes
app.use('/api/auth', authRoutes);
app.use('/api/profile', profileRoutes);
app.use('/api/savedJobs', savedJobsRoutes);
app.use('/api/auth/reset-password', resetPasswordRoutes); // Mount resetPasswordRoutes

// Start server
const PORT = process.env.PORT || 3003;
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
