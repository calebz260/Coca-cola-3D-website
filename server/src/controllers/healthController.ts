import type { RequestHandler } from 'express';

export function createHealthController(checkDatabase: () => Promise<boolean>): RequestHandler {
  return async (_req, res) => {
    const database = await checkDatabase();
    res.status(database ? 200 : 503).json({ status: database ? 'ok' : 'degraded', database });
  };
}
