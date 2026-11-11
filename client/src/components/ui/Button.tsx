import type { AnchorHTMLAttributes, ButtonHTMLAttributes } from 'react';

type Tone = 'light' | 'red' | 'ghost';

const base =
  'group relative inline-flex min-h-12 items-center justify-center gap-2 overflow-hidden rounded-full px-7 py-3 font-semibold ' +
  'transition-[transform,background-color,color,box-shadow] duration-300 ease-out active:scale-[0.97] ' +
  'disabled:cursor-not-allowed disabled:opacity-60';

const tones: Record<Tone, string> = {
  light: 'bg-paper text-signal hover:-translate-y-0.5 hover:shadow-[0_14px_30px_-12px_rgba(0,0,0,0.6)]',
  red: 'bg-signal text-paper hover:bg-signal-deep hover:-translate-y-0.5',
  ghost: 'text-paper ring-2 ring-paper/70 ring-inset hover:bg-paper hover:text-ink',
};

export function buttonClass(tone: Tone = 'light', extra = '') {
  return `${base} ${tones[tone]} ${extra}`;
}

export function LinkButton({
  tone = 'light',
  className = '',
  ...props
}: AnchorHTMLAttributes<HTMLAnchorElement> & { tone?: Tone }) {
  return <a className={buttonClass(tone, className)} {...props} />;
}

export function Button({
  tone = 'light',
  className = '',
  ...props
}: ButtonHTMLAttributes<HTMLButtonElement> & { tone?: Tone }) {
  return <button className={buttonClass(tone, className)} {...props} />;
}
