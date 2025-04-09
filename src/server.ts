import express from 'express';
import cors from 'cors';
import helmet from 'helmet';
import morgan from 'morgan';
import { config } from 'dotenv';
import { PrismaClient } from '@prisma/client';
import apiRoutes from './routes/api';

// Load environment variables
config();

// Initialize Prisma client
export const prisma = new PrismaClient();

// Create Express app
const app = express();
const PORT = process.env.PORT || 3001;

// Middleware
app.use(helmet()); // Security headers
app.use(cors()); // CORS support
app.use(express.json()); // Parse JSON bodies
app.use(morgan('dev')); // HTTP request logging

// API Routes
app.use('/api', apiRoutes);

// Basic route for testing
app.get('/api/health', (req, res) => {
  res.status(200).json({ status: 'OK', timestamp: new Date() });
});

// 404 handler
app.use((req, res) => {
  res.status(404).json({
    error: true,
    message: 'Route not found'
  });
});

// Error handling middleware
app.use((err: any, req: express.Request, res: express.Response, next: express.NextFunction) => {
  console.error(err.stack);
  res.status(500).json({
    error: true,
    message: process.env.NODE_ENV === 'development' ? err.message : 'Internal Server Error'
  });
});

// Start server
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});

// Handle graceful shutdown
process.on('SIGTERM', async () => {
  await prisma.$disconnect();
  process.exit(0);
}); 