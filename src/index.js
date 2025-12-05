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
import quoteRoutes from './routes/quotes.js';

const app = express();

// Middleware
app.use(helmet());
app.use(cors());
app.use(express.json());
app.use(requestIdMiddleware);
app.use(logger);
app.use(rateLimiter);

// Connect Database 
if (env.NODE_ENV !== 'test') {
  dbConnect();
}

// Routes
app.use('/api/health', healthRoutes);
app.use('/api/leads', leadRoutes);
app.use('/api/events', eventRoutes);
app.use('/api/quotes', quoteRoutes);

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
