import dotenv from 'dotenv';
dotenv.config();

// Check environment
const getEnvVar = (key, defaultValue = undefined) => {
  const value = process.env[key];
  if (value === undefined) {
    if (defaultValue !== undefined) {
      return defaultValue;
    }
    throw new Error(`Environment variable ${key} is not set`);
  }
  return value;
};

// Export configuration
export default {
  PORT: getEnvVar('PORT', 3000),
  MONGODB_URI: process.env.NODE_ENV === 'test' 
    ? getEnvVar('MONGODB_URI', undefined) // Optional in test
    : getEnvVar('MONGODB_URI'), // Required in production
  MONGODB_URI_TEST: process.env.NODE_ENV === 'test' 
    ? getEnvVar('MONGODB_URI_TEST') // Required in test
    : getEnvVar('MONGODB_URI_TEST', undefined), // Optional in production
  ADMIN_API_KEY: getEnvVar('ADMIN_API_KEY')
};
