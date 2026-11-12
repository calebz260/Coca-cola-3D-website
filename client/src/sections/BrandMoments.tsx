import { useRef, type ReactNode } from 'react';
import { gsap, prefersReducedMotion, useGSAP } from '../lib/gsap';

/*
 * Line icons for the moment cards. Red is the drawing, white the accent, on a 96px grid.
 * Every shape has pathLength="1" so the scroll animation can draw any of them the same way.
 */
const RED = '#ff3b4f';
const WHITE = '#ffffff';
const stroke = { fill: 'none', strokeWidth: 3, strokeLinecap: 'round', strokeLinejoin: 'round', pathLength: 1 } as const;

function ClockIcon() {
  return (
    <svg viewBox="0 0 128 80" className="h-24 w-auto lg:h-28">
      {/* Clock face and hour ticks. */}
      <circle cx="40" cy="40" r="32" stroke={RED} {...stroke} />
      <path d="M40 10v6M40 64v6M10 40h6M64 40h6" stroke={RED} {...stroke} />
      {/* Hands at ten past five o'clock: knocking-off time. */}
      <path d="M40 22v18l9 6" stroke={WHITE} {...stroke} />
      {/* An ice cube tumbling past. */}
      <rect x="85" y="38" width="28" height="28" rx="6" transform="rotate(12 99 52)" stroke={WHITE} {...stroke} />
      <path d="M93 46l7 -1" stroke={RED} {...stroke} />
    </svg>
  );
}

function PizzaIcon() {
  return (
    <svg viewBox="0 0 96 96" className="h-24 w-auto lg:h-28">
      {/* Slice and crust. */}
      <path d="M8 22Q48 0 88 22L48 92Z" stroke={RED} {...stroke} />
      <path d="M15 34Q48 16 81 34" stroke={RED} {...stroke} />
      {/* Toppings. */}
      <circle cx="37" cy="45" r="5" stroke={WHITE} {...stroke} />
      <circle cx="60" cy="42" r="5" stroke={WHITE} {...stroke} />
      <circle cx="48" cy="62" r="5" stroke={WHITE} {...stroke} />
    </svg>
  );
}

function SharedBottleIcon() {
  return (
    <svg viewBox="0 0 96 96" className="h-24 w-auto lg:h-28">
      {/* Two straws meeting in one bottle. */}
      <path d="M22 4L46 30M74 4L50 30" stroke={WHITE} {...stroke} />
      {/* The contour bottle, small. */}
      <path
        d="M44 30h8v10q0 6 3 12q3 7 1 14q-2 6 1 12q3 8 -3 13h-12q-6 -5 -3 -13q3 -6 1 -12q-2 -7 1 -14q3 -6 3 -12z"
        stroke={RED}
        {...stroke}
      />
    </svg>
  );
}

const MOMENTS: { line: string; detail: string; icon: ReactNode }[] = [
  {
    line: 'A cold one, right on time.',
    detail: 'The end of a long shift, the first warm day, the walk home after the game.',
    icon: <ClockIcon />,
  },
  {
    line: 'Small things, made better.',
    detail: 'Pizza on a Friday, a film on the sofa, a picnic that ran late.',
    icon: <PizzaIcon />,
  },
  {
    line: 'Pass it across the table.',
    detail: 'Two straws, one bottle. It has always been better shared.',
    icon: <SharedBottleIcon />,
  },
];

// Thin rings drifting on the red behind the cards. [left %, top %, size rem, drift speed]
const RINGS: [number, number, number, number][] = [
  [-4, -12, 12, 0.5],
  [91, 44, 9, 0.9],
  [46, 88, 5, 1.4],
];

export function BrandMoments() {
  const root = useRef<HTMLElement>(null);

  useGSAP(
    () => {
      if (prefersReducedMotion()) return;
      const cards = gsap.utils.toArray<HTMLElement>('[data-card]');
      // Cards rise in one after another, then each icon draws itself.
      gsap.from(cards, {
        y: 70,
        autoAlpha: 0,
        duration: 1,
        ease: 'expo.out',
        stagger: 0.12,
        scrollTrigger: { trigger: root.current, start: 'top 75%' },
      });
      cards.forEach((card, i) => {
        gsap.fromTo(
          card.querySelectorAll('[pathLength]'),
          { strokeDasharray: 1, strokeDashoffset: 1 },
          {
            strokeDashoffset: 0,
            duration: 1.4,
            ease: 'power2.inOut',
            stagger: 0.08,
            delay: 0.35 + i * 0.12,
            scrollTrigger: { trigger: root.current, start: 'top 75%' },
          },
        );
      });
      root.current?.querySelectorAll<HTMLElement>('[data-ring]').forEach((el) => {
        gsap.to(el, {
          yPercent: -120 * Number(el.dataset.ring),
          ease: 'none',
          scrollTrigger: { trigger: root.current, start: 'top bottom', end: 'bottom top', scrub: true },
        });
      });
    },
    { scope: root },
  );

  return (
    <section ref={root} aria-label="Moments" className="room overflow-hidden bg-signal">
      <div aria-hidden className="pointer-events-none absolute inset-0">
        {RINGS.map(([left, top, size, speed], i) => (
          <span
            key={i}
            data-ring={speed}
            className="absolute rounded-full border border-paper/45"
            style={{ left: `${left}%`, top: `${top}%`, width: `${size}rem`, height: `${size}rem` }}
          />
        ))}
      </div>

      <ul className="relative mx-auto grid max-w-[90rem] gap-4 px-5 py-16 sm:px-8 md:grid-cols-3 md:gap-5 md:py-24 lg:gap-7 lg:px-[3.75rem]">
        {MOMENTS.map((m) => (
          <li
            key={m.line}
            data-card
            className="flex min-h-[26rem] flex-col rounded-[1.25rem] bg-ink p-8 sm:p-10 md:min-h-[34rem] lg:min-h-[38rem] lg:p-11"
          >
            <div aria-hidden>{m.icon}</div>
            <h3 className="display mt-auto pt-12 text-[clamp(3rem,4.9vw,5.25rem)] leading-[0.9]">{m.line}</h3>
            <p className="mt-6 max-w-[26rem] text-[1.0625rem] leading-relaxed text-paper/85">{m.detail}</p>
          </li>
        ))}
      </ul>
    </section>
  );
}
