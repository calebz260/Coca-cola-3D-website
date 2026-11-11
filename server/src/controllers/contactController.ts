import type { RequestHandler } from 'express';
import type { ContactService } from '../services/contactService.js';
import type { ContactInput } from '../validation/contactSchema.js';

export function createContactController(service: ContactService): RequestHandler {
  return async (req, res) => {
    const { company, ...input } = res.locals.body as ContactInput;

    // Bots fill the hidden field. Answer like a success so they learn nothing, store nothing.
    if (company) {
      res.status(201).json({ id: 'received', message: 'Message sent.' });
      return;
    }

    const saved = await service.create(input);
    res.status(201).json({ id: saved.id, createdAt: saved.createdAt, message: 'Message sent.' });
  };
}
