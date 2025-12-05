import mongoose from 'mongoose';
import env from './env.js';

// MongoDB Connection with Retry Logic
const connectDB = async (retries = 5) => {
  try {
    // Use test database in test environment, otherwise use production database
    const mongoUri = process.env.NODE_ENV === 'test' ? env.MONGODB_URI_TEST : env.MONGODB_URI;
    
    if (!mongoUri) {
      throw new Error(`MongoDB URI not configured for ${process.env.NODE_ENV} environment`);
    }
    
    await mongoose.connect(mongoUri);

    console.log('MongoDB connected successfully');

  } catch (error) {
    if (retries > 0) {
      console.log(`MongoDB connection failed. Retrying... (${retries} attempts left)`);
      await new Promise(resolve => setTimeout(resolve, 5000));
      return connectDB(retries - 1);
    }

    console.error('MongoDB connection failed:', error.message);
    process.exit(1);
  }
};

export default connectDB;
