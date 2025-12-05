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
  MONGODB_URI: getEnvVar('MONGODB_URI'),
  MONGODB_URI_TEST: getEnvVar('MONGODB_URI_TEST'),
  ADMIN_API_KEY: getEnvVar('ADMIN_API_KEY')
};
