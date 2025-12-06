import mongoose from 'mongoose';
import env from './env.js';

let isConnected = false;

// Disable buffering for serverless
mongoose.set('bufferCommands', false);
mongoose.set('bufferTimeoutMS', 30000);

// MongoDB Connection optimized for Serverless
const connectDB = async () => {
  if (isConnected && mongoose.connection.readyState === 1) {
    console.log('Using existing MongoDB connection');
    return mongoose.connection;
  }

  try {
    const mongoUri = process.env.NODE_ENV === 'test' ? env.MONGODB_URI_TEST : env.MONGODB_URI;
    
    if (!mongoUri) {
      console.error(`MongoDB URI not configured for ${process.env.NODE_ENV} environment`);
      throw new Error(`MongoDB URI not configured`);
    }
    
    const conn = await mongoose.connect(mongoUri, {
      serverSelectionTimeoutMS: 10000,
      socketTimeoutMS: 45000,
      maxPoolSize: 10,
      minPoolSize: 2,
      maxIdleTimeMS: 30000,
    });

    isConnected = true;
    console.log('MongoDB connected successfully');
    
    return conn;

  } catch (error) {
    console.error('MongoDB connection failed:', error.message);
    isConnected = false;
    throw error;
  }
};

export default connectDB;
