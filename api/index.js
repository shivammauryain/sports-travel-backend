// Vercel Serverless Function Entry Point
import app from '../src/index.js';

// Export the Express app as a serverless function handler
export default async function handler(req, res) {
  try {
    // Let Express handle the request
    return app(req, res);
  } catch (error) {
    console.error('Serverless function error:', error);
    return res.status(500).json({
      success: false,
      message: 'Internal server error',
      error: process.env.NODE_ENV === 'production' ? undefined : error.message
    });
  }
}
