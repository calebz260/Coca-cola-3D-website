import { BREAKPOINTS, ScrollTrigger, gsap, prefersReducedMotion, useGSAP } from '../lib/gsap';
import { POSES, rig } from '../lib/rig';

/**
 * Scroll choreography for the bottle: hero → story → experience, then away with the page.
 * Tweens write to the rig; the 3D scene (or the flat fallback) eases toward it.
 */
export function useStageChoreography() {
  useGSAP(() => {
    const mm = gsap.matchMedia();
    const scrub = prefersReducedMotion() ? true : 0.8;

    (Object.keys(BREAKPOINTS) as (keyof typeof BREAKPOINTS)[]).forEach((bp) => {
      mm.add(BREAKPOINTS[bp], () => {
        const p = POSES[bp];
        Object.assign(rig, p.hero);

        gsap.fromTo(rig, { ...p.hero }, {
          ...p.story,
          ease: 'none',
          immediateRender: false,
          scrollTrigger: { trigger: '#story', start: 'top bottom', end: 'top 10%', scrub },
        });
        gsap.fromTo(rig, { ...p.story }, {
          ...p.experience,
          ease: 'none',
          immediateRender: false,
          scrollTrigger: { trigger: '#experience', start: 'top bottom', end: 'top top', scrub },
        });
        // Once the experience block starts to leave, the bottle scrolls away with it instead of floating
        // over the cards. A separate value from y, so it never fights the pose tweens above.
        // lift is in half-viewports: 2 is one full screen.
        gsap.fromTo(rig, { lift: 0 }, {
          lift: 2,
          ease: 'none',
          immediateRender: false,
          scrollTrigger: { trigger: '#experience', start: 'top top', end: 'top -100%', scrub: true },
        });
      });
    });

    // Web fonts change line heights once they load, which moves every trigger a little.
    let alive = true;
    document.fonts?.ready.then(() => alive && ScrollTrigger.refresh());

    return () => {
      alive = false;
      mm.revert();
    };
  });
}
