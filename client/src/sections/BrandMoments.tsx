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

// Thin rings, like bubbles rising past the copy. [left %, top %, size rem, drift speed]
const RINGS: [number, number, number, number][] = [
  [61, 5, 4.5, 1.2],
  [77, 41, 12, 0.45],
  [89, 73, 6, 0.9],
  [8, 92, 3, 1.6],
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
          { opacity: 0.18 },
          {
            opacity: 1,
            ease: 'none',
            stagger: 0.12,
            scrollTrigger: { trigger: el, start: 'top 85%', end: 'bottom 55%', scrub: true },
          },
        );
      });
      root.current?.querySelectorAll<HTMLElement>('[data-rule]').forEach((el) => {
        gsap.from(el, {
          scaleX: 0,
          transformOrigin: 'left center',
          duration: 1.2,
          ease: 'expo.out',
          scrollTrigger: { trigger: el, start: 'top 90%' },
        });
      });
      root.current?.querySelectorAll<HTMLElement>('[data-ring]').forEach((el) => {
        gsap.to(el, {
          yPercent: -140 * Number(el.dataset.ring),
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
            className="absolute rounded-full border border-paper/45"
            style={{ left: `${left}%`, top: `${top}%`, width: `${size}rem`, height: `${size}rem` }}
          />
        ))}
      </div>

      <div className="relative mx-auto max-w-[90rem] px-5 py-16 sm:px-8 md:py-24 lg:px-[3.75rem]">
        {MOMENTS.map((m) => (
          <div key={m.line} className="relative">
            <span data-rule aria-hidden className="block h-px bg-paper/45" />
            <div className="grid gap-6 py-12 md:grid-cols-[1fr_minmax(14rem,20rem)] md:items-end md:gap-12 md:py-14">
              <p data-line className="display text-[clamp(3.25rem,8.4vw,7.75rem)] leading-[0.86]">
                {m.line}
              </p>
              <p className="max-w-[21rem] text-[1.0625rem] leading-relaxed text-paper/95 md:pb-2">{m.detail}</p>
            </div>
          </div>
        ))}
      </div>
    </section>
  );
}
