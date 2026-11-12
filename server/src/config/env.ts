import 'dotenv/config';
import { z } from 'zod';

const schema = z.object({
  NODE_ENV: z.enum(['development', 'test', 'production']).default('development'),
  PORT: z.coerce.number().int().positive().default(5050),
  DATABASE_URL: z.string().url({ message: 'DATABASE_URL must be a postgresql:// connection string' }),
  /** Comma-separated list of origins allowed to call the API. */
  CORS_ORIGIN: z.string().default('http://localhost:5273,http://localhost:4173,http://127.0.0.1:5273,http://127.0.0.1:4173'),
  /** Contact form submissions allowed per IP in each window. */
  CONTACT_RATE_LIMIT: z.coerce.number().int().positive().default(5),
  CONTACT_RATE_WINDOW_MINUTES: z.coerce.number().int().positive().default(15),
  /** Number of reverse proxies in front of the app, for correct client IPs. */
  TRUST_PROXY: z.coerce.number().int().min(0).default(0),
});

const parsed = schema.safeParse(process.env);
if (!parsed.success) {
  console.error('Invalid environment configuration:');
  for (const issue of parsed.error.issues) console.error(`  ${issue.path.join('.')}: ${issue.message}`);
  process.exit(1);
}

export const env = {
  ...parsed.data,
  corsOrigins: parsed.data.CORS_ORIGIN.split(',').map((o) => o.trim()).filter(Boolean),
};
export type Env = typeof env;
