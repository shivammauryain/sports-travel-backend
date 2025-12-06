import express from 'express';
import cors from 'cors';
import helmet from 'helmet';

import env from './config/env.js';
import dbConnect from './config/database.js';
import logger from './middleware/logger.js';
import rateLimiter from './middleware/rateLimiter.js';
import errorHandler from './middleware/errorHandler.js';
import requestIdMiddleware from './middleware/requestId.js';

import healthRoutes from './routes/health.js';
import leadRoutes from './routes/leads.js';
import eventRoutes from './routes/events.js';
import packageRoutes from './routes/packages.js';
import quoteRoutes from './routes/quotes.js';
import authRoutes from './routes/auth.js';
import dashboardRoutes from './routes/dashboard.js';

// Initialize Express app
const app = express();

// Middleware
app.use(helmet());

// CORS configuration with fallback
const allowedOrigins = env.ORIGIN_URL 
  ? env.ORIGIN_URL.split(',').map(url => url.trim()).filter(url => url)
  : ['http://localhost:3000'];

app.use(cors({
  origin: allowedOrigins,
  credentials: true,
  methods: ['GET', 'POST', 'PUT', 'PATCH', 'DELETE', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization', 'X-Request-ID']
}));
app.use(express.json());
app.use(requestIdMiddleware);
app.use(logger);
app.use(rateLimiter);

// Database Connection Middleware
app.use(async (req, res, next) => {
  if (env.NODE_ENV === 'test') {
    return next();
  }
  
  try {
    await dbConnect();
    next();
  } catch (error) {
    console.error('Database connection error:', error);
    return res.status(503).json({
      success: false,
      message: 'Database connection unavailable',
      data: null
    });
  }
});

// Routes
app.get('/', (req, res) => {
  res.json({ 
    message: 'Sports Travel API is running', 
    status: 'ok', 
    env: env.NODE_ENV,
    timestamp: new Date().toISOString()
  });
});
app.use('/api/health', healthRoutes);
app.use('/api/auth', authRoutes);
app.use('/api/leads', leadRoutes);
app.use('/api/events', eventRoutes);
app.use('/api/packages', packageRoutes);
app.use('/api/quotes', quoteRoutes);
app.use('/api/dashboard', dashboardRoutes);

// Error Handler
app.use(errorHandler);

// Start Server 
if (env.NODE_ENV !== 'test' && !env.VERCEL) {
  const PORT = env.PORT || 3000;
  app.listen(PORT, () => {
    console.log(`Server running at http://localhost:${PORT}`);
  });
}

export default app;
