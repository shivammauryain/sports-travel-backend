import dotenv from "dotenv";
dotenv.config();

const NODE_ENV = process.env.NODE_ENV || 'development';

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
  PORT: getEnvVar("PORT", 3000),
  NODE_ENV: NODE_ENV,
  MONGODB_URI: process.env.MONGODB_URI || undefined,
  MONGODB_URI_TEST: NODE_ENV === "test" ? getEnvVar("MONGODB_URI_TEST") : process.env.MONGODB_URI_TEST || undefined,
  ADMIN_API_KEY: process.env.ADMIN_API_KEY || undefined,
};
