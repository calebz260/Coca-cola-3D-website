import type { ContactFieldErrors, ContactPayload } from '../types/content';

export type SubmitResult =
  | { ok: true; id: string }
  | { ok: false; message: string; fieldErrors?: ContactFieldErrors };

const API_BASE = import.meta.env.VITE_API_URL ?? '';

export async function submitContact(payload: ContactPayload, signal?: AbortSignal): Promise<SubmitResult> {
  let response: Response;
  try {
    response = await fetch(`${API_BASE}/api/contact`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(payload),
      signal,
    });
  } catch {
    return { ok: false, message: 'Could not reach the server. Check your connection and try again.' };
  }

  const body = (await response.json().catch(() => ({}))) as {
    id?: string;
    message?: string;
    fieldErrors?: ContactFieldErrors;
  };

  if (response.ok && body.id) return { ok: true, id: body.id };
  if (response.status === 429) {
    return { ok: false, message: body.message ?? 'Too many messages sent. Wait a few minutes and try again.' };
  }
  return {
    ok: false,
    message: body.message ?? 'The message was not sent. Try again in a moment.',
    fieldErrors: body.fieldErrors,
  };
}

const EMAIL = /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/;

/** Mirrors the server rules so people see problems before sending. The server still validates. */
export function validateContact(p: ContactPayload): ContactFieldErrors {
  const errors: ContactFieldErrors = {};
  const name = p.fullName.trim();
  if (name.length < 2) errors.fullName = 'Enter your full name.';
  else if (name.length > 120) errors.fullName = 'Keep your name under 120 characters.';
  if (!EMAIL.test(p.email.trim())) errors.email = 'Enter an email address like name@example.com.';
  const subject = p.subject.trim();
  if (subject.length < 3) errors.subject = 'Add a subject of at least 3 characters.';
  else if (subject.length > 150) errors.subject = 'Keep the subject under 150 characters.';
  const message = p.message.trim();
  if (message.length < 10) errors.message = 'Write at least 10 characters.';
  else if (message.length > 5000) errors.message = 'Keep the message under 5,000 characters.';
  return errors;
}
