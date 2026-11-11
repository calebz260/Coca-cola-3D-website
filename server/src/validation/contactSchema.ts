import { z } from 'zod';

// Strip control characters (keep tabs and newlines in the message body).
const clean = (s: string) => s.replace(/[\u0000-\u0008\u000B\u000C\u000E-\u001F\u007F]/g, '').trim();
const singleLine = (s: string) => clean(s).replace(/\s+/g, ' ');

export const contactSchema = z
  .object({
    fullName: z
      .string({ required_error: 'Enter your full name.' })
      .transform(singleLine)
      .pipe(z.string().min(2, 'Enter your full name.').max(120, 'Keep your name under 120 characters.')),
    email: z
      .string({ required_error: 'Enter your email address.' })
      .transform((s) => clean(s).toLowerCase())
      .pipe(z.string().email('Enter an email address like name@example.com.').max(254, 'That email address is too long.')),
    subject: z
      .string({ required_error: 'Add a subject.' })
      .transform(singleLine)
      .pipe(z.string().min(3, 'Add a subject of at least 3 characters.').max(150, 'Keep the subject under 150 characters.')),
    message: z
      .string({ required_error: 'Write a message.' })
      .transform(clean)
      .pipe(z.string().min(10, 'Write at least 10 characters.').max(5000, 'Keep the message under 5,000 characters.')),
    /** Honeypot: must be empty. */
    company: z.string().max(200).optional(),
  })
  .strict();

export type ContactInput = z.infer<typeof contactSchema>;
