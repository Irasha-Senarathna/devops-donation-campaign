import mongoose from 'mongoose';
import dotenv from 'dotenv';

// Load environment variables from .env
dotenv.config();

const MONGO_URI = process.env.MONGO_URI || 'mongodb://localhost:27017/donation_db';

console.log('Attempting to connect to MongoDB at:', MONGO_URI);

mongoose.connect(MONGO_URI)
  .then(() => {
    console.log('✅ MongoDB connected successfully!');
    console.log('Connection state:', mongoose.connection.readyState === 1 ? 'CONNECTED' : 'NOT FULLY CONNECTED');
    console.log('Database name:', mongoose.connection.name);
    
    // Check if users collection exists
    return mongoose.connection.db.listCollections({name: 'users'}).toArray();
  })
  .then(collections => {
    if (collections.length > 0) {
      console.log('✅ Users collection exists');
      return mongoose.connection.db.collection('users').countDocuments();
    } else {
      console.log('❌ Users collection does not exist yet');
      return 0;
    }
  })
  .then(count => {
    console.log(`Number of users in database: ${count}`);
    process.exit(0);
  })
  .catch(err => {
    console.error('❌ MongoDB connection error:', err);
    process.exit(1);
  });