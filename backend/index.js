import express from 'express';
import mongoose from 'mongoose';
import cors from 'cors';

const app = express();

// CORS middleware: allow requests only from your frontend origin
app.use(
  cors({
    origin: 'http://localhost:5173', // frontend URL
    credentials: true, // allow cookies and auth headers
  })
);

// Handle OPTIONS preflight requests for all routes
app.options(
  '*',
  cors({
    origin: 'http://localhost:5173',
    credentials: true,
  })
);

// Parse JSON bodies
app.use(express.json());

// MongoDB connection string (replace placeholders as needed)
const mongoURI =
  'mongodb+srv://new-user70:Wildcat@cluster0.svlbt34.mongodb.net/?retryWrites=true&w=majority&appName=Cluster0';

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
