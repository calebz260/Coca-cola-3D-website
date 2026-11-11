import { Router } from 'express';
import { createContactController } from '../controllers/contactController.js';
import { createHealthController } from '../controllers/healthController.js';
import { contactRateLimit } from '../middleware/rateLimit.js';
import { validateBody } from '../middleware/validate.js';
import type { ContactService } from '../services/contactService.js';
import { contactSchema } from '../validation/contactSchema.js';

export interface RouteDeps {
  contactService: ContactService;
  checkDatabase: () => Promise<boolean>;
  rateLimit: { limit: number; windowMinutes: number };
}

export function createApiRouter(deps: RouteDeps): Router {
  const router = Router();

  router.get('/health', createHealthController(deps.checkDatabase));

  router.post(
    '/contact',
    contactRateLimit(deps.rateLimit.limit, deps.rateLimit.windowMinutes),
    validateBody(contactSchema),
    createContactController(deps.contactService),
  );

  return router;
}
