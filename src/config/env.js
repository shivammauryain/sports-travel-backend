import dotenv from "dotenv";
dotenv.config();

const NODE_ENV = process.env.NODE_ENV || 'production';

// Check environment - more lenient for serverless
const getEnvVar = (key, defaultValue = undefined, required = false) => {
  const value = process.env[key];
  if (value === undefined || value === '') {
    if (defaultValue !== undefined) {
      return defaultValue;
    }
    if (required && NODE_ENV !== 'test') {
      console.error(`CRITICAL: Environment variable ${key} is not set`);
    }
    return defaultValue || '';
  }
  return value;
};

// Export configuration
const config = {
  PORT: getEnvVar("PORT", 3000),
  NODE_ENV: NODE_ENV,
  MONGODB_URI: getEnvVar("MONGODB_URI", "", true),
  MONGODB_URI_TEST: getEnvVar("MONGODB_URI_TEST", ""),
  JWT_SECRET: getEnvVar("JWT_SECRET", "", true),
  ORIGIN_URL: getEnvVar("ORIGIN_URL", "http://localhost:3000"),
  EMAIL_USER: getEnvVar("EMAIL_USER", ""),
  EMAIL_PASS: getEnvVar("EMAIL_PASS", ""),
  RECEIVER_EMAIL: getEnvVar("RECEIVER_EMAIL", ""),
  VERCEL: getEnvVar("VERCEL", ""),
};

export default config;
