import express from 'express';
import dotenv from 'dotenv';
import mongoose from 'mongoose';
import cors from 'cors';
import authRoutes from './src/routes/auth.js';
import campaignRoutes from './src/routes/campaign.js'; // New campaign routes

dotenv.config();

const app = express();
app.use(cors());
app.use(express.json());

// ------------------------
// Health Check
// ------------------------
app.get('/api/health', (req, res) => {
  const readyState = mongoose.connection.readyState; // 0=disconnected,1=connected,2=connecting,3=disconnecting
  const map = { 0: 'disconnected', 1: 'connected', 2: 'connecting', 3: 'disconnecting' };
  res.json({
    status: 'ok',
    db: map[readyState] || 'unknown',
    dbName: mongoose.connection.name,
    timestamp: new Date().toISOString()
  });
});

// ------------------------
// Test Database Connectivity
// ------------------------
app.get('/api/test/db', async (req, res) => {
  try {
    const databaseName = mongoose.connection.name;
    const collections = await mongoose.connection.db.listCollections().toArray();
    const collectionNames = collections.map(c => c.name);

    // Count users and campaigns
    const userCount = collectionNames.includes('users') 
      ? await mongoose.connection.db.collection('users').countDocuments() 
      : 0;
    const campaignCount = collectionNames.includes('campaigns')
      ? await mongoose.connection.db.collection('campaigns').countDocuments()
      : 0;

    res.json({
      connected: mongoose.connection.readyState === 1,
      databaseName,
      collections: collectionNames,
      users: { collectionExists: collectionNames.includes('users'), count: userCount },
      campaigns: { collectionExists: collectionNames.includes('campaigns'), count: campaignCount }
    });
  } catch (err) {
    console.error('Database test error:', err);
    res.status(500).json({
      error: err.message,
      connected: mongoose.connection.readyState === 1
    });
  }
});

// ------------------------
// API Routes
// ------------------------
app.use('/api/auth', authRoutes);        // Auth: login/register/profile
app.use('/api/campaigns', campaignRoutes); // Campaigns CRUD & donation

// ------------------------
// MongoDB Connection
// ------------------------
const PORT = process.env.PORT || 5000;
const MONGO_URI = process.env.MONGO_URI || 'mongodb://mongo:27017/donation_db';

console.log('Connecting to MongoDB:', MONGO_URI.replace(/:\/\/([^:]+):([^@]+)@/, '://***:***@'));

mongoose.connect(MONGO_URI)
  .then(() => {
    console.log('MongoDB connected successfully to:', mongoose.connection.name);
    console.log('Connection state:', mongoose.connection.readyState === 1 ? 'CONNECTED' : 'NOT FULLY CONNECTED');
    
    app.listen(PORT, () => {
      console.log(`Server running on port ${PORT}`);
      console.log(`Health check at: http://localhost:${PORT}/api/health`);
      console.log(`Test MongoDB connection at: http://localhost:${PORT}/api/test/db`);
    });
  })
  .catch(err => {
    console.error('MongoDB connection error:', err);
    process.exit(1);
  });
