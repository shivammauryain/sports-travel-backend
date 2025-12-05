import mongoose from 'mongoose';
import env from './env.js';

// MongoDB Connection with Retry Logic
const connectDB = async (retries = 5) => {
  try {
    await mongoose.connect(env.MONGODB_URI);

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
