import { createApp } from './app.js';
import { env } from './config/env.js';
import { connectDatabase, disconnectDatabase, isDatabaseHealthy } from './db/prisma.js';
import { contactService } from './services/contactService.js';

async function main() {
  try {
    await connectDatabase();
    console.log('[db] connected');
  } catch (err) {
    console.error('[db] could not connect. Is PostgreSQL running? See README > Database setup.');
    console.error(err instanceof Error ? err.message : err);
    process.exit(1);
  }

  const app = createApp({
    contactService,
    checkDatabase: isDatabaseHealthy,
    rateLimit: { limit: env.CONTACT_RATE_LIMIT, windowMinutes: env.CONTACT_RATE_WINDOW_MINUTES },
    corsOrigins: env.corsOrigins,
    trustProxy: env.TRUST_PROXY,
  });

  const server = app.listen(env.PORT, () => {
    console.log(`[api] listening on http://localhost:${env.PORT}`);
  });

  const shutdown = (signal: string) => {
    console.log(`[api] ${signal} received, shutting down`);
    server.close(async () => {
      await disconnectDatabase();
      process.exit(0);
    });
    setTimeout(() => process.exit(1), 10_000).unref();
  };
  process.on('SIGINT', () => shutdown('SIGINT'));
  process.on('SIGTERM', () => shutdown('SIGTERM'));
}

void main();
