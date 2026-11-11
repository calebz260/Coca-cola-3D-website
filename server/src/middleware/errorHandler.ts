import type { ErrorRequestHandler, RequestHandler } from 'express';
import { Prisma } from '@prisma/client';
import { HttpError } from '../utils/httpError.js';

export const notFound: RequestHandler = (req, res) => {
  res.status(404).json({ message: `No API route for ${req.method} ${req.path}.` });
};

/** Last stop for errors. Never leaks stack traces or database details to clients. */
export const errorHandler: ErrorRequestHandler = (err, _req, res, _next) => {
  if (err instanceof HttpError) {
    res.status(err.status).json({ message: err.message, ...err.details });
    return;
  }
  // Malformed JSON or oversized body from express.json().
  if (err?.type === 'entity.parse.failed') {
    res.status(400).json({ message: 'The request body is not valid JSON.' });
    return;
  }
  if (err?.type === 'entity.too.large') {
    res.status(413).json({ message: 'The request is too large.' });
    return;
  }
  if (err instanceof Prisma.PrismaClientInitializationError || err instanceof Prisma.PrismaClientKnownRequestError) {
    console.error('[db]', err.message);
    res.status(503).json({ message: 'The message could not be saved right now. Try again in a few minutes.' });
    return;
  }
  console.error('[unhandled]', err);
  res.status(500).json({ message: 'Something went wrong on our side. Try again in a few minutes.' });
};
