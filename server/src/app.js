import express from 'express';
import cors from 'cors';
import chatRoutes from './routes/chat.routes.js';

const app = express();

// Middleware
app.use(cors());
app.use(express.json());

// Routes
app.use('/api/chat', chatRoutes);

// Health check endpoint
app.get('/api/health', (req, res) => {
  res.status(200).json({ status: 'ok', message: 'Orderly Chaos API is running' });
});

export default app;
