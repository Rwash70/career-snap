import express from 'express';
import mongoose from 'mongoose';
import cors from 'cors';
import dotenv from 'dotenv';

dotenv.config(); // Load environment variables

const app = express();

const corsOptions = {
  origin: 'http://localhost:5173', // frontend URL
  credentials: true, // allow cookies and auth headers
};

// CORS middleware: allow requests only from your frontend origin
app.use(cors(corsOptions));

// Handle OPTIONS preflight requests for all routes
app.options('*', cors(corsOptions));

// Extra middleware: log every incoming request method and URL
app.use((req, res, next) => {
  console.log(`Received ${req.method} request for ${req.url}`);
  next();
});

// Parse JSON bodies
app.use(express.json());

// Simple root route to test server is running
app.get('/', (req, res) => {
  res.send('Hello World');
});

// MongoDB connection string using environment variable
const mongoURI = process.env.MONGODB_URI;

mongoose
  .connect(mongoURI, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
  })
  .then(() => console.log('MongoDB connected'))
  .catch((err) => console.error('MongoDB connection error:', err));

// Define profile schema and model
const profileSchema = new mongoose.Schema({
  name: String,
  email: String,
  memberSince: String,
  receiveEmails: Boolean,
});

const Profile = mongoose.model('Profile', profileSchema);

// POST /profile route to create or update profile
app.post('/profile', async (req, res) => {
  try {
    console.log('Request body:', req.body);
    const { email, name, memberSince, receiveEmails } = req.body;

    let profile = await Profile.findOne({ email });

    if (profile) {
      profile.name = name;
      profile.memberSince = memberSince;
      profile.receiveEmails = receiveEmails;
    } else {
      profile = new Profile({ name, email, memberSince, receiveEmails });
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
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
