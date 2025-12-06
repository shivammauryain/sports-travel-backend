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
  NODE_ENV: getEnvVar("NODE_ENV", "development"),
  MONGODB_URI: getEnvVar("MONGODB_URI"),
  MONGODB_URI_TEST: getEnvVar("MONGODB_URI_TEST", ""),
  JWT_SECRET: getEnvVar("JWT_SECRET"),
  ORIGIN_URL: getEnvVar("ORIGIN_URL", "http://localhost:3000"),
  EMAIL_USER: getEnvVar("EMAIL_USER", ""),
  EMAIL_PASS: getEnvVar("EMAIL_PASS", ""),
  RECEIVER_EMAIL: getEnvVar("RECEIVER_EMAIL", ""),
  VERCEL: getEnvVar("VERCEL", ""),
};
