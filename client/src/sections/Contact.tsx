import { useRef, useState, type FormEvent } from 'react';
import { AlertCircle, CheckCircle2, Mail, Phone } from 'lucide-react';
import { Button } from '../components/ui/Button';
import { CONTACT_DETAILS } from '../data/content';
import { submitContact, validateContact } from '../services/contactService';
import type { ContactFieldErrors, ContactPayload } from '../types/content';

const EMPTY: ContactPayload = { fullName: '', email: '', subject: '', message: '', company: '' };

type Status = { kind: 'idle' } | { kind: 'sending' } | { kind: 'sent'; name: string; email: string } | { kind: 'error'; message: string };

/**
 * What the message is about. The API has no topic field, so the choice is sent at the front of the
 * subject ("Press: …"). The subject box is capped so the two together stay within the API's 150 characters.
 */
const TOPICS = [
  { id: 'concept', label: 'About the concept', prefix: 'Concept' },
  { id: 'collaboration', label: 'Collaboration', prefix: 'Collaboration' },
  { id: 'press', label: 'Press', prefix: 'Press' },
] as const;
type TopicId = (typeof TOPICS)[number]['id'];
const SUBJECT_MAX = 150 - 'Collaboration: '.length;

const FIELDS: { name: keyof Omit<ContactPayload, 'company'>; label: string; type?: string; autoComplete?: string }[] = [
  { name: 'fullName', label: 'Full name', autoComplete: 'name' },
  { name: 'email', label: 'Email address', type: 'email', autoComplete: 'email' },
  { name: 'subject', label: 'Subject' },
];

// The form sits on a cream card, so it uses dark ink and a dark focus ring instead of the site's white one.
const INK = 'text-[#1a0609]';
const focusRing = 'focus-visible:outline-3 focus-visible:outline-offset-2 focus-visible:outline-[#1a0609]';
const inputClass =
  `mt-2 block w-full rounded-lg border bg-paper px-4 py-3 ${INK} placeholder:text-black/35 ` +
  'transition-[border-color,box-shadow] focus:border-signal focus:shadow-[0_0_0_3px_rgba(229,17,46,0.18)] focus:outline-none ' +
  'aria-[invalid=true]:border-signal-deep';

// Thin rings drifting over the maroon, like the rest of the site. [left %, top %, size rem]
const RINGS: [number, number, number][] = [
  [33, 4, 7],
  [-3, 88, 9],
  [93, 70, 5],
];

export function Contact() {
  const [values, setValues] = useState<ContactPayload>(EMPTY);
  const [topic, setTopic] = useState<TopicId>('concept');
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
    const prefix = TOPICS.find((t) => t.id === topic)?.prefix ?? 'Concept';
    const result = await submitContact({ ...values, subject: `${prefix}: ${values.subject.trim()}` });
    if (result.ok) {
      setStatus({ kind: 'sent', name: values.fullName.trim().split(/\s+/)[0], email: values.email.trim() });
      setValues(EMPTY);
    } else {
      setErrors(result.fieldErrors ?? {});
      setStatus({ kind: 'error', message: result.message });
    }
  };

  return (
    <section id="contact" className="room overflow-hidden bg-cellar px-5 py-24 sm:px-8 md:py-32 lg:px-[3.75rem]">
      <div aria-hidden className="pointer-events-none absolute inset-0">
        {RINGS.map(([left, top, size], i) => (
          <span
            key={i}
            className="absolute rounded-full border border-paper/15"
            style={{ left: `${left}%`, top: `${top}%`, width: `${size}rem`, height: `${size}rem` }}
          />
        ))}
      </div>

      <div className="relative mx-auto grid max-w-[90rem] gap-14 lg:grid-cols-[1fr_1.15fr] lg:gap-16 xl:gap-24">
        <div className="lg:pt-4">
          <h2 className="display text-[clamp(5rem,11vw,9.5rem)] leading-[0.84] uppercase">
            Say
            <br />
            hello
          </h2>
          <p className="mt-10 max-w-[34rem] text-lg leading-relaxed text-paper/85 md:text-xl">
            Questions about the concept, a collaboration or press? Send a message and we will reply within two working days.
          </p>
          <ul className="mt-12 space-y-6">
            {[
              { Icon: Mail, label: 'Email', value: CONTACT_DETAILS.email, href: `mailto:${CONTACT_DETAILS.email}` },
              {
                Icon: Phone,
                label: 'Phone',
                value: CONTACT_DETAILS.phone,
                href: `tel:${CONTACT_DETAILS.phone.replace(/[^+\d]/g, '')}`,
              },
            ].map(({ Icon, label, value, href }) => (
              <li key={label}>
                <a href={href} className="group inline-flex items-center gap-5">
                  <span className="flex h-14 w-14 shrink-0 items-center justify-center rounded-full bg-signal transition-transform duration-300 group-hover:scale-105">
                    <Icon aria-hidden size={22} />
                  </span>
                  <span>
                    <span className="block text-sm text-paper/70">{label}</span>
                    <span className="block text-xl font-semibold break-all decoration-2 underline-offset-4 group-hover:underline md:text-[1.375rem]">
                      {value}
                    </span>
                  </span>
                </a>
              </li>
            ))}
          </ul>
        </div>

        <div className={`self-start rounded-[1.5rem] bg-[#f6f0ec] p-7 sm:p-10 lg:p-14 ${INK}`}>
          {status.kind === 'sent' ? (
            <div role="status">
              <CheckCircle2 aria-hidden size={44} className="text-signal" />
              <h3 className="display mt-6 text-[clamp(2.25rem,3.6vw,3.25rem)]">Message sent</h3>
              <p className="mt-4 max-w-[30rem] text-lg text-black/70">
                Thanks, {status.name}. We will reply to {status.email} within two working days.
              </p>
              <Button tone="red" className={`mt-8 ${focusRing}`} onClick={() => setStatus({ kind: 'idle' })}>
                Send another message
              </Button>
            </div>
          ) : (
            <>
              <h3 className="display text-[clamp(2.25rem,3.6vw,3.25rem)]">Send us a message</h3>
              <form ref={formRef} noValidate onSubmit={onSubmit} aria-label="Contact form" className="mt-8 grid gap-6">
                <fieldset>
                  <legend className="text-sm font-semibold">What is it about?</legend>
                  <div className="mt-3 flex flex-wrap gap-2.5">
                    {TOPICS.map((t) => {
                      const selected = t.id === topic;
                      return (
                        <label
                          key={t.id}
                          className={`flex min-h-12 cursor-pointer items-center rounded-full px-5 font-semibold transition-colors has-[:focus-visible]:outline-3 has-[:focus-visible]:outline-offset-2 has-[:focus-visible]:outline-[#1a0609] ${
                            selected ? 'bg-[#1a0609] text-paper' : 'ring-1 ring-black/25 hover:ring-black/60'
                          }`}
                        >
                          <input
                            type="radio"
                            name="topic"
                            value={t.id}
                            checked={selected}
                            onChange={() => setTopic(t.id)}
                            className="sr-only"
                          />
                          {t.label}
                        </label>
                      );
                    })}
                  </div>
                </fieldset>

                <div className="grid gap-6 sm:grid-cols-2 sm:gap-x-6">
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
                        maxLength={f.name === 'subject' ? SUBJECT_MAX : undefined}
                        value={values[f.name]}
                        onChange={(e) => update(f.name, e.target.value)}
                        aria-invalid={Boolean(errors[f.name])}
                        aria-describedby={errors[f.name] ? `${f.name}-error` : undefined}
                        className={`${inputClass} ${errors[f.name] ? '' : 'border-black/25'}`}
                      />
                      {errors[f.name] && (
                        <p id={`${f.name}-error`} className="mt-2 text-sm font-medium text-signal-deep">
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
                    rows={6}
                    value={values.message}
                    onChange={(e) => update('message', e.target.value)}
                    aria-invalid={Boolean(errors.message)}
                    aria-describedby={errors.message ? 'message-error' : undefined}
                    className={`${inputClass} resize-y ${errors.message ? '' : 'border-black/25'}`}
                  />
                  {errors.message && (
                    <p id="message-error" className="mt-2 text-sm font-medium text-signal-deep">
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
                  <p role="alert" className="flex items-start gap-3 rounded-xl bg-signal/10 px-4 py-3 font-medium text-signal-deep">
                    <AlertCircle aria-hidden size={20} className="mt-0.5 shrink-0" />
                    {status.message}
                  </p>
                )}

                <div>
                  <Button type="submit" tone="red" disabled={status.kind === 'sending'} className={focusRing}>
                    {status.kind === 'sending' ? 'Sending…' : 'Send message'}
                  </Button>
                </div>
              </form>
            </>
          )}
        </div>
      </div>
    </section>
  );
}
