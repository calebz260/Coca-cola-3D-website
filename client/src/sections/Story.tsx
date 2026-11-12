import { useRef } from 'react';
import { STORY } from '../data/content';
import { BOTTLE_HEIGHT, radiusAt } from '../lib/bottleProfile';
import { ScrollTrigger, useGSAP } from '../lib/gsap';
import { POSES } from '../lib/rig';

/** Parts of the bottle named beside it: [label, height on the bottle in scene units]. */
const CALLOUTS: [string, number][] = [
  ['Crown cap', 3.16],
  ['Neck', 2.8],
  ['Shoulder', 2.24],
  ['Waist you can grip', 1.0],
  ['Heel', 0.12],
];

/**
 * Labels pinned beside the 3D bottle while the timeline scrolls. Positions come from the
 * story pose, so they stay on the glass if the pose changes. Desktop only.
 */
function Callouts() {
  const pose = POSES.desktop.story;
  const cx = 50 + pose.x * 50; // % of width
  const cy = 50 - pose.y * 50; // % of height
  const h = pose.height * 100; // bottle height in vh
  const labelX = 0.235 * h; // label column, right of the centre line, in vh

  return (
    <div aria-hidden className="pointer-events-none absolute inset-0 hidden lg:block">
      <div data-callouts className="sticky top-0 h-[100svh] opacity-0 transition-opacity duration-700 [&.is-on]:opacity-100">
        {CALLOUTS.map(([label, y]) => {
          const top = cy - (y / BOTTLE_HEIGHT - 0.5) * h;
          const edge = ((y > 3 ? 0.24 : radiusAt(y)) / BOTTLE_HEIGHT) * h; // cap skirt is wider than the lip
          return (
            <div
              key={label}
              className="absolute flex -translate-y-1/2 items-center gap-3 text-[0.95rem] text-paper/90"
              style={{ top: `${top}vh`, left: `calc(${cx}% + ${edge + 0.8}vh)` }}
            >
              <span className="block border-t border-dashed border-paper/40" style={{ width: `calc(${labelX - edge - 0.8}vh - 0.75rem)` }} />
              {label}
            </div>
          );
        })}
      </div>
    </div>
  );
}

export function Story() {
  const root = useRef<HTMLElement>(null);

  useGSAP(
    () => {
      // Highlights the year you are reading. Class toggles only, so it is safe with reduced motion.
      root.current?.querySelectorAll<HTMLElement>('[data-moment]').forEach((el) => {
        ScrollTrigger.create({
          trigger: el,
          start: 'top 62%',
          end: 'bottom 38%',
          toggleClass: { targets: el, className: 'is-current' },
        });
      });
      // Callouts appear once the bottle has settled beside the timeline.
      const callouts = root.current?.querySelector('[data-callouts]');
      if (callouts) {
        ScrollTrigger.create({
          trigger: root.current,
          start: 'top 8%',
          end: 'bottom 60%',
          toggleClass: { targets: callouts, className: 'is-on' },
        });
      }
    },
    { scope: root },
  );

  return (
    <section id="story" ref={root} className="relative bg-cellar">
      <Callouts />
      <div className="above-stage mx-auto max-w-[90rem] px-5 py-24 sm:px-8 md:py-36 lg:px-[3.75rem]">
        <div className="md:ml-auto md:w-1/2">
          <h2 className="display text-[clamp(2.75rem,5.4vw,4.5rem)]">
            How a fountain drink became a shape you can feel in the dark
          </h2>
          <p className="mt-6 max-w-[min(28rem,66%)] text-paper/75 md:max-w-[28rem]">
            Four moments, from a five-cent glass in Atlanta to the bottle on the left.
          </p>

          <ol className="relative mt-16 max-w-[66%] space-y-16 md:max-w-none before:absolute before:top-2 before:bottom-2 before:left-[7px] before:w-px before:bg-paper/20 md:mt-20 md:space-y-20">
            {STORY.map((m) => (
              <li key={m.year} data-moment className="group relative pl-10 md:pl-12">
                <span
                  aria-hidden
                  className="absolute top-[1.4rem] left-0 h-[15px] w-[15px] rounded-full bg-cellar ring-[1.5px] ring-signal/70 transition-all duration-500 group-[.is-current]:top-[1.25rem] group-[.is-current]:-left-[3px] group-[.is-current]:h-[21px] group-[.is-current]:w-[21px] group-[.is-current]:bg-signal group-[.is-current]:ring-2 group-[.is-current]:ring-paper"
                />
                <p
                  className="display text-[clamp(3.5rem,6vw,5rem)] leading-none text-signal/70 transition-colors duration-500 group-[.is-current]:text-signal"
                  aria-hidden
                >
                  {m.year}
                </p>
                <h3 className="mt-3 text-[1.375rem] leading-tight font-semibold text-paper/85 transition-colors duration-500 group-[.is-current]:text-paper">
                  <span className="sr-only">{m.year}: </span>
                  {m.title}
                </h3>
                <p className="mt-3 max-w-[28rem] text-[0.98rem] leading-relaxed text-paper/60 transition-colors duration-500 group-[.is-current]:text-paper/90">
                  {m.body}
                </p>
              </li>
            ))}
          </ol>
        </div>
      </div>
    </section>
  );
}
