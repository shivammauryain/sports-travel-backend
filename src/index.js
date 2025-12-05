import express from 'express';
import cors from 'cors';
import helmet from 'helmet';

import env from './config/env';
import dbConnect from './config/database';
import logger from './middleware/logger';
import errorHandler from './middleware/errorHandler';
import leadRoutes from './routes/leadRoutes';
import eventRoutes from './routes/eventRoutes';
import quoteRoutes from './routes/quoteRoutes';

const app = express();

// Middleware
app.use(helmet());
app.use(cors());
app.use(express.json());
app.use(logger);

// Database Connection
dbConnect();

// Health Check Endpoint
app.get('/health', async (req, res) => {
  const dbStatus = dbConnect ? 'connected' : 'disconnected';
  const uptime = process.uptime();
  
  res.json({
    status: 'healthy',
    uptime: `${Math.floor(uptime)} seconds`,
    database: dbStatus,
    timestamp: new Date().toISOString()
  });
});

// Routes
app.use('/api/leads', leadRoutes);
app.use('/api/events', eventRoutes);
app.use('/api/quotes', quoteRoutes);

// Error Handling
app.use(errorHandler);

// Start Server
app.listen(env.PORT, () => {
  console.log(`Server is running on port ${env.PORT}`);
});

export default app;