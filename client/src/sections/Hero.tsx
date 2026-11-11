import { useRef } from 'react';
import { LinkButton } from '../components/ui/Button';
import { SplitText, gsap, prefersReducedMotion, useGSAP } from '../lib/gsap';
import { rig } from '../lib/rig';

export function Hero() {
  const root = useRef<HTMLElement>(null);

  // The one orchestrated entrance: the headline rises line by line while the bottle lifts in.
  useGSAP(
    () => {
      if (prefersReducedMotion()) {
        rig.intro = 0;
        return;
      }
      const split = SplitText.create('[data-hero-title]', { type: 'lines', mask: 'lines' });
      const tl = gsap.timeline({ defaults: { ease: 'expo.out' } });
      tl.from(split.lines, { yPercent: 110, duration: 1.2, stagger: 0.09 }, 0.15)
        .to(rig, { intro: 0, duration: 1.8 }, 0.25)
        .from('[data-hero-rest]', { autoAlpha: 0, y: 16, duration: 0.9, stagger: 0.08 }, 0.75);
      return () => split.revert();
    },
    { scope: root },
  );

  return (
    <section id="home" ref={root} className="relative flex min-h-[100svh] flex-col bg-signal">
      <div className="mx-auto flex w-full max-w-[90rem] flex-1 flex-col px-5 pt-24 pb-8 sm:px-8 md:pb-12 lg:pt-28">
        {/* Not positioned on purpose: it paints under the 3D canvas, so the bottle stands in front of the words. */}
        <h1
          data-hero-title
          className="display text-[clamp(4.75rem,21vw,7.5rem)] uppercase md:text-[clamp(7rem,17vw,16.5rem)]"
        >
          Ice-cold
          <br />
          since
          <br />
          1886
        </h1>

        <div className="above-stage mt-auto flex max-w-[30rem] flex-col gap-6 pt-8">
          <p data-hero-rest className="max-w-[26rem] text-[1.0625rem] leading-snug text-paper sm:text-[1.25rem] lg:text-[1.375rem]">
            An interactive concept for the contour bottle. Drag it to spin, shake it to wake the bubbles,
            and pick your flavour.
          </p>
          <div data-hero-rest className="flex flex-wrap gap-3">
            <LinkButton href="#experience">Explore the experience</LinkButton>
            <LinkButton href="#story" tone="ghost">
              Read our story
            </LinkButton>
          </div>
        </div>
      </div>
    </section>
  );
}
