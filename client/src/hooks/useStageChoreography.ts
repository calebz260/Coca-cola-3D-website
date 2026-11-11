import { BREAKPOINTS, gsap, prefersReducedMotion, useGSAP } from '../lib/gsap';
import { POSES, rig } from '../lib/rig';

/**
 * Scroll choreography for the bottle: hero → story → experience.
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
      });
    });

    return () => mm.revert();
  });
}
