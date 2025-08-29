require('dotenv').config();
const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');

const authRoutes = require('./routes/auth');
const profileRoutes = require('./routes/profile');
const savedJobsRoutes = require('./routes/savedJobs');
const jobsRoutes = require('./routes/jobs'); // <-- jobs proxy/source
const resetPasswordRoutes = require('./routes/resetPassword');

const app = express();

// If behind GCP load balancer / Nginx, trust the proxy (cookies, IPs, HTTPS)
app.set('trust proxy', 1);

// Connect to MongoDB
mongoose
  .connect(process.env.MONGO_URI || 'mongodb://127.0.0.1:27017/career-snap')
  .catch((err) => console.error('MongoDB connection error:', err));

// Middleware
app.use(express.json());

// CORS — allow your dev + production origins
const whitelist = [
  'http://localhost:5173',
  'https://bejewelled-taffy-88ec6a.netlify.app',
  'https://careersnap.l5.ca',
];
const corsOptions = {
  origin(origin, callback) {
    console.log(origin);
    if (!origin || whitelist.includes(origin)) callback(null, true);
    else callback(new Error('Not allowed by CORS'));
  },
  credentials: true,
};
app.use(cors(corsOptions));

// Health check (useful on phone to confirm backend works)
app.get('/api/health', (req, res) => res.json({ ok: true, ts: Date.now() }));

// API routes
app.use('/api/auth', authRoutes);
app.use('/api/profile', profileRoutes);
app.use('/api/savedJobs', savedJobsRoutes);
app.use('/api/jobs', jobsRoutes);
app.use('/api/reset-password', resetPasswordRoutes);

// Start server (bind 0.0.0.0 so a reverse proxy can reach it)
const PORT = process.env.PORT || 3003;
app.listen(PORT, '0.0.0.0', () => {
  console.log(`Server running on port ${PORT}`);
});
