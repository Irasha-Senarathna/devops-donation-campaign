import express from 'express';
import dotenv from 'dotenv';
import mongoose from 'mongoose';
import cors from 'cors';
import authRoutes from './src/routes/auth.js';
import itemRoutes from './src/routes/items.js';

dotenv.config();

const app = express();
app.use(cors());
app.use(express.json());

// Enhanced health check with more details
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

// Test endpoint to check database connectivity
app.get('/api/test/db', async (req, res) => {
  try {
    const databaseName = mongoose.connection.name;
    const collections = await mongoose.connection.db.listCollections().toArray();
    const collectionNames = collections.map(c => c.name);
    
    // Count users
    const userCount = await mongoose.connection.db.collection('users').countDocuments();
    
    res.json({
      connected: mongoose.connection.readyState === 1,
      databaseName,
      collections: collectionNames,
      users: {
        collectionExists: collectionNames.includes('users'),
        count: userCount
      }
    });
  } catch (err) {
    console.error('Database test error:', err);
    res.status(500).json({
      error: err.message,
      connected: mongoose.connection.readyState === 1
    });
  }
});

app.use('/api/auth', authRoutes);
app.use('/api/items', itemRoutes);

const PORT = process.env.PORT || 5000;
const MONGO_URI = process.env.MONGO_URI || 'mongodb://localhost:27017/donation_db';

console.log('Connecting to MongoDB:', MONGO_URI.replace(/:\/\/([^:]+):([^@]+)@/, '://***:***@')); // Hide credentials in logs

mongoose.connect(MONGO_URI)
  .then(() => {
    console.log('MongoDB connected successfully to:', mongoose.connection.name);
    console.log('Connection state:', mongoose.connection.readyState === 1 ? 'CONNECTED' : 'NOT FULLY CONNECTED');
    
    app.listen(PORT, () => {
      console.log(`Server running on port ${PORT}`);
      console.log(`Test MongoDB connection at: http://localhost:${PORT}/api/test/db`);
    });
  })
  .catch(err => {
    console.error('MongoDB connection error:', err);
    process.exit(1);
  });
