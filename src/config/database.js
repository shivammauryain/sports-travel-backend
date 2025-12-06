import mongoose from 'mongoose';
import env from './env.js';

let isConnected = false;

// MongoDB Connection optimized for Serverless
const connectDB = async () => {
  if (isConnected && mongoose.connection.readyState === 1) {
    console.log('Using existing MongoDB connection');
    return;
  }

  try {
    const mongoUri = process.env.NODE_ENV === 'test' ? env.MONGODB_URI_TEST : env.MONGODB_URI;
    
    if (!mongoUri) {
      console.error(`MongoDB URI not configured for ${process.env.NODE_ENV} environment`);
      throw new Error(`MongoDB URI not configured`);
    }
    
    await mongoose.connect(mongoUri, {
      serverSelectionTimeoutMS: 5000,
      socketTimeoutMS: 45000,
    });

    isConnected = true;
    console.log('MongoDB connected successfully');

  } catch (error) {
    console.error('MongoDB connection failed:', error.message);
    isConnected = false;
    throw error;
  }
};

export default connectDB;
