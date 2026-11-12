import { useRef, useState, type FormEvent } from 'react';
import { AlertCircle, CheckCircle2, Mail, Phone } from 'lucide-react';
import { Button } from '../components/ui/Button';
import { CONTACT_DETAILS } from '../data/content';
import { submitContact, validateContact } from '../services/contactService';
import type { ContactFieldErrors, ContactPayload } from '../types/content';

const EMPTY: ContactPayload = { fullName: '', email: '', subject: '', message: '', company: '' };

type Status = { kind: 'idle' } | { kind: 'sending' } | { kind: 'sent'; name: string; email: string } | { kind: 'error'; message: string };

const FIELDS: { name: keyof Omit<ContactPayload, 'company'>; label: string; type?: string; autoComplete?: string }[] = [
  { name: 'fullName', label: 'Full name', autoComplete: 'name' },
  { name: 'email', label: 'Email address', type: 'email', autoComplete: 'email' },
  { name: 'subject', label: 'Subject' },
];

const inputClass =
  'mt-2 block w-full rounded-md border bg-cellar-raised px-4 py-3 text-paper placeholder:text-paper/40 ' +
  'transition-colors focus:border-paper focus:outline-none aria-[invalid=true]:border-[#ff9aa2]';

export function Contact() {
  const [values, setValues] = useState<ContactPayload>(EMPTY);
  const [errors, setErrors] = useState<ContactFieldErrors>({});
  const [status, setStatus] = useState<Status>({ kind: 'idle' });
  const formRef = useRef<HTMLFormElement>(null);

  const update = (name: keyof ContactPayload, value: string) => {
    setValues((v) => ({ ...v, [name]: value }));
    if (errors[name]) setErrors((e) => ({ ...e, [name]: undefined }));
  };

  const onSubmit = async (e: FormEvent) => {
    e.preventDefault();
    const found = validateContact(values);
    setErrors(found);
    if (Object.keys(found).length) {
      const first = Object.keys(found)[0];
      formRef.current?.querySelector<HTMLElement>(`[name="${first}"]`)?.focus();
      return;
    }
    setStatus({ kind: 'sending' });
    const result = await submitContact(values);
    if (result.ok) {
      setStatus({ kind: 'sent', name: values.fullName.trim().split(/\s+/)[0], email: values.email.trim() });
      setValues(EMPTY);
    } else {
      setErrors(result.fieldErrors ?? {});
      setStatus({ kind: 'error', message: result.message });
    }
  };

  return (
    <section id="contact" className="room bg-cellar px-5 py-24 sm:px-8 md:py-32 lg:px-[3.75rem]">
      <div className="mx-auto grid max-w-[90rem] gap-14 lg:grid-cols-[1fr_1.85fr] lg:gap-24">
        <div>
          <h2 className="display text-[clamp(3rem,6vw,5rem)]">Say hello</h2>
          <p className="mt-5 max-w-[25rem] text-paper/80">
            Questions about the concept, a collaboration or press? Send a message and we will reply within two working days.
          </p>
          <ul className="mt-10 space-y-5 text-[0.98rem]">
            <li>
              <a className="inline-flex items-center gap-3 text-paper/90 hover:text-paper hover:underline" href={`mailto:${CONTACT_DETAILS.email}`}>
                <Mail aria-hidden size={18} /> {CONTACT_DETAILS.email}
              </a>
            </li>
            <li>
              <a
                className="inline-flex items-center gap-3 text-paper/90 hover:text-paper hover:underline"
                href={`tel:${CONTACT_DETAILS.phone.replace(/[^+\d]/g, '')}`}
              >
                <Phone aria-hidden size={18} /> {CONTACT_DETAILS.phone}
              </a>
            </li>
          </ul>
        </div>

        {status.kind === 'sent' ? (
          <div role="status" className="self-start rounded-lg bg-cellar-raised p-8 ring-1 ring-paper/15 md:p-10">
            <CheckCircle2 aria-hidden size={40} className="text-paper" />
            <h3 className="mt-5 text-h3 leading-tight font-semibold">Message sent</h3>
            <p className="mt-3 text-paper/80">
              Thanks, {status.name}. We will reply to {status.email} within two working days.
            </p>
            <Button tone="red" className="mt-8" onClick={() => setStatus({ kind: 'idle' })}>
              Send another message
            </Button>
          </div>
        ) : (
          <form ref={formRef} noValidate onSubmit={onSubmit} aria-label="Contact form" className="grid gap-5">
            <div className="grid gap-5 sm:grid-cols-2 sm:gap-x-5">
              {FIELDS.map((f) => (
                <div key={f.name} className={f.name === 'subject' ? 'sm:col-span-2' : undefined}>
                  <label htmlFor={f.name} className="text-sm font-semibold">
                    {f.label}
                  </label>
                  <input
                    id={f.name}
                    name={f.name}
                    type={f.type ?? 'text'}
                    autoComplete={f.autoComplete}
                    value={values[f.name]}
                    onChange={(e) => update(f.name, e.target.value)}
                    aria-invalid={Boolean(errors[f.name])}
                    aria-describedby={errors[f.name] ? `${f.name}-error` : undefined}
                    className={`${inputClass} ${errors[f.name] ? '' : 'border-paper/30'}`}
                  />
                  {errors[f.name] && (
                    <p id={`${f.name}-error`} className="mt-2 text-sm text-[#ffc2c7]">
                      {errors[f.name]}
                    </p>
                  )}
                </div>
              ))}
            </div>

            <div>
              <label htmlFor="message" className="text-sm font-semibold">
                Message
              </label>
              <textarea
                id="message"
                name="message"
                rows={5}
                value={values.message}
                onChange={(e) => update('message', e.target.value)}
                aria-invalid={Boolean(errors.message)}
                aria-describedby={errors.message ? 'message-error' : undefined}
                className={`${inputClass} resize-y ${errors.message ? '' : 'border-paper/30'}`}
              />
              {errors.message && (
                <p id="message-error" className="mt-2 text-sm text-[#ffc2c7]">
                  {errors.message}
                </p>
              )}
            </div>

            {/* Honeypot for bots. Hidden from people and assistive tech. */}
            <div aria-hidden className="absolute -left-[9999px] h-px w-px overflow-hidden">
              <label htmlFor="company">Company</label>
              <input
                id="company"
                name="company"
                tabIndex={-1}
                autoComplete="off"
                value={values.company}
                onChange={(e) => update('company', e.target.value)}
              />
            </div>

            {status.kind === 'error' && (
              <p role="alert" className="flex items-start gap-3 rounded-xl bg-black/30 px-4 py-3 text-paper">
                <AlertCircle aria-hidden size={20} className="mt-0.5 shrink-0" />
                {status.message}
              </p>
            )}

            <div>
              <Button type="submit" tone="red" disabled={status.kind === 'sending'}>
                {status.kind === 'sending' ? 'Sending…' : 'Send message'}
              </Button>
            </div>
          </form>
        )}
      </div>
    </section>
  );
}
