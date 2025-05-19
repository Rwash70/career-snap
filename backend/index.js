import express from 'express';
import mongoose from 'mongoose';
import cors from 'cors';
import dotenv from 'dotenv';

dotenv.config();

const app = express();

// CORS setup - allow requests from your frontend with credentials
app.use(
  cors({
    origin: 'http://localhost:5173',
    credentials: true,
  })
);

// Handle preflight OPTIONS requests for all routes
app.options(
  '*',
  cors({
    origin: 'http://localhost:5173',
    credentials: true,
  })
);

// Parse incoming JSON
app.use(express.json());

// Log all incoming requests
app.use((req, res, next) => {
  console.log(`${req.method} ${req.url}`);
  next();
});

// Test route
app.get('/', (req, res) => {
  res.send('Hello World');
});

// MongoDB connection
mongoose
  .connect(process.env.MONGODB_URI, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
  })
  .then(() => console.log('MongoDB connected'))
  .catch((err) => console.error('MongoDB connection error:', err));

// Profile schema + model
const profileSchema = new mongoose.Schema({
  name: String,
  email: String,
  memberSince: String,
  receiveEmails: Boolean,
  preferences: String, // New field
});

const Profile = mongoose.model('Profile', profileSchema);

// Save or update profile
app.post('/profile', async (req, res) => {
  try {
    const { name, email, memberSince, receiveEmails, preferences } = req.body;
    let profile = await Profile.findOne({ email });

    if (profile) {
      profile.name = name;
      profile.memberSince = memberSince;
      profile.receiveEmails = receiveEmails;
      profile.preferences = preferences;
    } else {
      profile = new Profile({
        name,
        email,
        memberSince,
        receiveEmails,
        preferences,
      });
    }

    await profile.save();
    res.json(profile);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Server error' });
  }
});

// Start server
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
