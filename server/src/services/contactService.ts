import { prisma } from '../db/prisma.js';
import type { ContactInput } from '../validation/contactSchema.js';

export interface ContactService {
  create(input: Omit<ContactInput, 'company'>): Promise<{ id: string; createdAt: Date }>;
}

export const contactService: ContactService = {
  async create({ fullName, email, subject, message }) {
    return prisma.contactMessage.create({
      data: { fullName, email, subject, message },
      select: { id: true, createdAt: true },
    });
  },
};
