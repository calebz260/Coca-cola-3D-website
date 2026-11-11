import cors from 'cors';
import express, { type Express } from 'express';
import helmet from 'helmet';
import { errorHandler, notFound } from './middleware/errorHandler.js';
import { createApiRouter, type RouteDeps } from './routes/index.js';

export interface AppOptions extends RouteDeps {
  corsOrigins: string[];
  trustProxy?: number;
}

export function createApp(options: AppOptions): Express {
  const app = express();
  app.disable('x-powered-by');
  if (options.trustProxy) app.set('trust proxy', options.trustProxy);

  app.use(helmet());
  app.use(
    cors({
      origin(origin, cb) {
        // Same-origin and server-to-server requests carry no Origin header.
        if (!origin || options.corsOrigins.includes(origin)) return cb(null, true);
        cb(null, false);
      },
      methods: ['GET', 'POST'],
      allowedHeaders: ['Content-Type'],
      maxAge: 600,
    }),
  );
  app.use(express.json({ limit: '20kb' }));

  app.use('/api', createApiRouter(options));
  app.use('/api', notFound);
  app.use(errorHandler);

  return app;
}
