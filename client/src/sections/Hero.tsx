import { useMemo, useRef } from 'react';
import { ChevronLeft, ChevronRight } from 'lucide-react';
import { BlackHoleHeroSection } from '@/components/ui/blackhole-hero-section';
import { LinkButton } from '../components/ui/Button';
import { VARIANTS } from '../data/content';
import { useActiveSection } from '../hooks/useActiveSection';
import { useBreakpoint } from '../hooks/useMediaQuery';
import { isSoftwareRenderer, useStageQuality } from '../hooks/useStageQuality';
import { SplitText, gsap, prefersReducedMotion, useGSAP } from '../lib/gsap';
import { POSES, rig } from '../lib/rig';
import { useExperience } from '../state/ExperienceContext';
import type { SectionId } from '../types/content';

const DOTS: { id: SectionId; label: string }[] = [
  { id: 'home', label: 'Home' },
  { id: 'story', label: 'Our story' },
  { id: 'experience', label: 'Experience' },
  { id: 'contact', label: 'Contact' },
];
const DOT_IDS = DOTS.map((d) => d.id);

/**
 * The moving backdrop: a ray-traced black hole in Coca-Cola reds, its ring centred on the
 * bottle so the glass stands in front of the glow. A static glow stands in when there is no GPU.
 */
function Backdrop() {
  const quality = useStageQuality();
  const software = useMemo(isSoftwareRenderer, []);
  const bp = useBreakpoint();
  const pose = POSES[bp].hero;
  // Rig coordinates are half-viewport fractions from the centre; focus is 0..1 from top left.
  const focus: [number, number] = [0.5 + pose.x / 2, 0.5 - pose.y / 2];

  if (quality === 'none' || software) {
    return (
      <div
        aria-hidden
        className="absolute inset-0"
        style={{
          background: `radial-gradient(ellipse 24% 38% at ${focus[0] * 100}% ${focus[1] * 100}%, rgba(229,17,46,0.45), transparent 70%)`,
        }}
      />
    );
  }

  const lite = quality === 'lite';
  return (
    <BlackHoleHeroSection
      aria-hidden
      data-blackhole=""
      className="absolute! inset-0 bg-ink!"
      focus={focus}
      scrim={bp === 'mobile' ? 'top' : 'left'}
      scrimStrength={0.92}
      distance={24}
      elevation={bp === 'mobile' ? -7 : -5}
      roll={-14}
      fov={bp === 'mobile' ? 60 : 44}
      diskOuter={14}
      brightness={1.05}
      spinSpeed={0.05}
      doppler={0.4}
      hotColor="#FFD7C8"
      midColor="#F0182F"
      coolColor="#4A0610"
      glow={bp === 'mobile' ? 0.85 : 1.1}
      exposure={0.95}
      vignette={0.4}
      steps={lite ? 180 : 300}
      resolution={lite ? 0.55 : 0.7}
      maxDpr={lite ? 1.25 : 1.75}
    />
  );
}

export function Hero() {
  const root = useRef<HTMLElement>(null);
  const active = useActiveSection(DOT_IDS);
  const { variant, setVariant } = useExperience();

  const step = (dir: 1 | -1) => {
    const i = VARIANTS.findIndex((v) => v.id === variant.id);
    setVariant(VARIANTS[(i + dir + VARIANTS.length) % VARIANTS.length].id);
  };

  // The one orchestrated entrance: the headline rises line by line while the bottle lifts in.
  useGSAP(
    () => {
      if (prefersReducedMotion()) {
        rig.intro = 0;
        return;
      }
      const split = SplitText.create('[data-hero-title]', { type: 'lines', mask: 'lines' });
      const tl = gsap.timeline({ defaults: { ease: 'expo.out' } });
      tl.from('[data-hero-script]', { autoAlpha: 0, x: -24, duration: 1.1 }, 0.05)
        .from(split.lines, { yPercent: 110, duration: 1.2, stagger: 0.09 }, 0.15)
        .to(rig, { intro: 0, duration: 1.8 }, 0.25)
        .from('[data-hero-numeral]', { autoAlpha: 0, scale: 1.04, duration: 2.2 }, 0.2)
        .from('[data-hero-rest]', { autoAlpha: 0, y: 16, duration: 0.9, stagger: 0.08 }, 0.75);
      return () => split.revert();
    },
    { scope: root },
  );

  return (
    <section id="home" ref={root} className="relative flex min-h-[100svh] flex-col overflow-hidden bg-ink">
      <Backdrop />

      {/* Outlined year behind the bottle. Not positioned above the stage, so the glass stands in front of it. */}
      <p
        data-hero-numeral
        aria-hidden
        className="display outline-type pointer-events-none absolute top-[9%] left-[38%] text-[34vw] leading-[0.8] whitespace-nowrap select-none max-md:top-[44%] max-md:left-[6%] max-md:text-[52vw]"
      >
        1886
      </p>

      <div className="above-stage mx-auto flex w-full max-w-[90rem] flex-1 flex-col px-5 pt-24 pb-10 sm:px-8 md:justify-center md:pt-32 lg:px-[3.75rem]">
        <div className="max-w-[36rem]">
          <p
            data-hero-script
            className="script -ml-1 text-[clamp(3.25rem,13vw,5.5rem)] text-signal lg:text-[clamp(5.5rem,8vw,7.5rem)]"
          >
            Coca-Cola
          </p>
          <h1
            data-hero-title
            className="display mt-2 text-[clamp(3rem,13vw,5rem)] uppercase md:mt-3 md:text-[clamp(5rem,7.4vw,6.5rem)]"
          >
            Ice-cold
            <br />
            since 1886
          </h1>
          <p data-hero-rest className="mt-5 max-w-[26rem] text-base leading-relaxed text-mist sm:text-lg md:mt-8">
            An interactive concept for the contour bottle. Drag it to spin, shake it to wake the bubbles, and pick
            your flavour.
          </p>
          <div data-hero-rest className="mt-6 flex flex-wrap gap-3 md:mt-8">
            <LinkButton href="#experience" tone="red">
              Explore the experience
            </LinkButton>
            <LinkButton href="#story" tone="ghost">
              Read our story
            </LinkButton>
          </div>
        </div>
      </div>

      {/* Section dots, right edge. */}
      <nav aria-label="Sections" className="above-stage absolute top-1/2 right-[3.75rem] hidden -translate-y-1/2 lg:block">
        <ul className="flex flex-col items-center gap-5">
          {DOTS.map((d) => {
            const isActive = active === d.id;
            return (
              <li key={d.id}>
                <a
                  href={`#${d.id}`}
                  aria-label={d.label}
                  aria-current={isActive ? 'location' : undefined}
                  className="flex h-6 w-6 items-center justify-center rounded-full"
                >
                  <span
                    className={`block rounded-full transition-all duration-300 ${
                      isActive ? 'h-3 w-3 bg-signal ring-2 ring-paper/90' : 'h-2 w-2 ring-[1.5px] ring-paper/80'
                    }`}
                  />
                </a>
              </li>
            );
          })}
        </ul>
      </nav>

      {/* Under the bottle, and the flavour arrows bottom right. */}
      <p
        data-hero-rest
        aria-hidden
        className="above-stage pointer-events-none absolute bottom-10 left-[73%] hidden -translate-x-1/2 text-sm text-mist lg:block"
      >
        Drag to spin
      </p>
      <div data-hero-rest className="above-stage absolute right-[3.75rem] bottom-9 hidden gap-3 lg:flex">
        <button
          type="button"
          onClick={() => step(-1)}
          aria-label="Previous flavour"
          className="inline-flex h-[3.25rem] w-[3.25rem] items-center justify-center rounded-md bg-paper/[0.06] ring-1 ring-paper/15 transition-colors hover:bg-paper/15"
        >
          <ChevronLeft aria-hidden size={20} />
        </button>
        <button
          type="button"
          onClick={() => step(1)}
          aria-label="Next flavour"
          className="inline-flex h-[3.25rem] w-[3.25rem] items-center justify-center rounded-md bg-paper/[0.06] ring-1 ring-paper/15 transition-colors hover:bg-paper/15"
        >
          <ChevronRight aria-hidden size={20} />
        </button>
      </div>
    </section>
  );
}
