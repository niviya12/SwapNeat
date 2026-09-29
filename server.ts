import express from 'express';
import path from 'path';
import { fileURLToPath } from 'url';
import dotenv from 'dotenv';
import { initDatabase } from './server/data/store.ts';

// Load environment variables
dotenv.config();

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Import API routes
import authRoutes from './server/routes/auth.ts';
import itemsRoutes from './server/routes/items.ts';
import requestsRoutes from './server/routes/requests.ts';
import exchangesRoutes from './server/routes/exchanges.ts';
import messagesRoutes from './server/routes/messages.ts';
import savedRoutes from './server/routes/saved.ts';
import reviewsRoutes from './server/routes/reviews.ts';
import reportsRoutes from './server/routes/reports.ts';
import notificationsRoutes from './server/routes/notifications.ts';
import analyticsRoutes from './server/routes/analytics.ts';
import adminRoutes from './server/routes/admin.ts';

async function startServer() {
  const app = express();
  const PORT = parseInt(process.env.PORT || '3000', 10);

  // Initialize Tamil Nadu store
  initDatabase();

  app.use(express.json({ limit: '10mb' }));
  app.use(express.urlencoded({ extended: true, limit: '10mb' }));

  // API Routes
  app.use('/api/auth', authRoutes);
  app.use('/api/items', itemsRoutes);
  app.use('/api/requests', requestsRoutes);
  app.use('/api/exchanges', exchangesRoutes);
  app.use('/api/messages', messagesRoutes);
  app.use('/api/saved', savedRoutes);
  app.use('/api/reviews', reviewsRoutes);
  app.use('/api/reports', reportsRoutes);
  app.use('/api/notifications', notificationsRoutes);
  app.use('/api/analytics', analyticsRoutes);
  app.use('/api/admin', adminRoutes);

  // Health check endpoint
  app.get('/api/health', (_req, res) => {
    res.json({
      status: 'healthy',
      app: 'SWAPNEAT',
      region: 'Tamil Nadu, India',
      districts: 38,
      timestamp: new Date().toISOString()
    });
  });

  const isProduction = process.env.NODE_ENV === 'production';

  if (!isProduction) {
    const { createServer } = await import('vite');
    const vite = await createServer({
      server: { middlewareMode: true },
      appType: 'spa'
    });
    app.use(vite.middlewares);
  } else {
    // Production static serving
    const distPath = path.resolve(__dirname, 'dist');
    app.use(express.static(distPath));
    app.get('*', (_req, res) => {
      res.sendFile(path.resolve(distPath, 'index.html'));
    });
  }

  app.listen(PORT, '0.0.0.0', () => {
    console.log(`[SWAPNEAT] Server running on http://0.0.0.0:${PORT} (Tamil Nadu Only Platform)`);
  });
}

startServer().catch(err => {
  console.error('[SWAPNEAT] Failed to start server:', err);
  process.exit(1);
});
