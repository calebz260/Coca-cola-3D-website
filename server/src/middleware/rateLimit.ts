import rateLimit from 'express-rate-limit';

export function contactRateLimit(limit: number, windowMinutes: number) {
  return rateLimit({
    windowMs: windowMinutes * 60_000,
    limit,
    standardHeaders: 'draft-7',
    legacyHeaders: false,
    message: { message: `Too many messages sent. Wait ${windowMinutes} minutes and try again.` },
  });
}
