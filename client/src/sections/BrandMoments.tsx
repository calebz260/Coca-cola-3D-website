import { useRef } from 'react';
import { SplitText, gsap, prefersReducedMotion, useGSAP } from '../lib/gsap';

const MOMENTS = [
  {
    line: 'A cold one, right on time.',
    detail: 'The end of a long shift, the first warm day, the walk home after the game.',
  },
  {
    line: 'Small things, made better.',
    detail: 'Pizza on a Friday, a film on the sofa, a picnic that ran late.',
  },
  {
    line: 'Pass it across the table.',
    detail: 'Two straws, one bottle. It has always been better shared.',
  },
];

// Rings drifting at different depths. [left %, top %, size rem, speed]
const RINGS: [number, number, number, number][] = [
  [8, 12, 9, 0.6],
  [78, 6, 4, 1.4],
  [62, 38, 14, 0.35],
  [18, 58, 3, 1.8],
  [88, 64, 7, 0.9],
  [40, 82, 5, 1.2],
  [4, 90, 11, 0.5],
];

export function BrandMoments() {
  const root = useRef<HTMLElement>(null);

  useGSAP(
    () => {
      if (prefersReducedMotion()) return;
      const splits: SplitText[] = [];
      root.current?.querySelectorAll<HTMLElement>('[data-line]').forEach((el) => {
        const split = SplitText.create(el, { type: 'words' });
        splits.push(split);
        gsap.fromTo(
          split.words,
          { opacity: 0.16 },
          {
            opacity: 1,
            ease: 'none',
            stagger: 0.12,
            scrollTrigger: { trigger: el, start: 'top 80%', end: 'bottom 45%', scrub: true },
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
      return () => splits.forEach((s) => s.revert());
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
            className="absolute rounded-full border-2 border-paper/25"
            style={{ left: `${left}%`, top: `${top}%`, width: `${size}rem`, height: `${size}rem` }}
          />
        ))}
      </div>

      <div className="relative mx-auto max-w-[90rem] px-5 sm:px-8">
        {MOMENTS.map((m) => (
          <div key={m.line} className="flex min-h-[85svh] flex-col justify-center py-20">
            <p data-line className="display max-w-[11ch] text-[clamp(3.75rem,11vw,10rem)]">
              {m.line}
            </p>
            <p className="mt-8 max-w-[30rem] text-lead leading-snug text-paper/90">{m.detail}</p>
          </div>
        ))}
      </div>
    </section>
  );
}
