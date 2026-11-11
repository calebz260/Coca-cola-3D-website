import { useRef } from 'react';
import { STORY } from '../data/content';
import { ScrollTrigger, useGSAP } from '../lib/gsap';

export function Story() {
  const root = useRef<HTMLElement>(null);

  // Highlights the year you are reading. Opacity only, so it is safe with reduced motion.
  useGSAP(
    () => {
      root.current?.querySelectorAll<HTMLElement>('[data-moment]').forEach((el) => {
        ScrollTrigger.create({
          trigger: el,
          start: 'top 62%',
          end: 'bottom 38%',
          toggleClass: { targets: el, className: 'is-current' },
        });
      });
    },
    { scope: root },
  );

  return (
    <section id="story" ref={root} className="bg-cellar">
      <div className="above-stage mx-auto max-w-[90rem] px-5 py-24 sm:px-8 md:py-36">
        <div className="max-w-[min(34rem,72%)] md:ml-auto md:w-1/2 md:max-w-none lg:w-[46%]">
          <h2 className="display text-h2">How a fountain drink became a shape you can feel in the dark</h2>
          <p className="mt-6 max-w-[34rem] text-paper/80">
            Four moments, from a five-cent glass in Atlanta to the bottle on the left.
          </p>

          <ol className="mt-20 space-y-24 md:mt-28 md:space-y-36">
            {STORY.map((m) => (
              <li
                key={m.year}
                data-moment
                className="opacity-40 transition-opacity duration-500 [&.is-current]:opacity-100"
              >
                <p className="display text-[clamp(4.5rem,13vw,9rem)] text-signal" aria-hidden>
                  {m.year}
                </p>
                <h3 className="mt-2 text-h3 leading-tight font-semibold">
                  <span className="sr-only">{m.year}: </span>
                  {m.title}
                </h3>
                <p className="mt-3 max-w-[34rem] text-paper/80">{m.body}</p>
              </li>
            ))}
          </ol>
        </div>
      </div>
    </section>
  );
}
