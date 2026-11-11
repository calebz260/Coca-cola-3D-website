/**
 * Where the bottle should be. GSAP ScrollTriggers write to this object and the 3D scene
 * eases toward it every frame, so scroll choreography never causes React re-renders.
 *
 * x, y   : position as a fraction of the half viewport (-1 left/bottom … 1 right/top)
 * height : bottle height as a fraction of the viewport height
 * tilt   : lean in radians (z axis)
 * intro  : entrance offset, 1 = below the fold, 0 = in place
 */
export interface Pose {
  x: number;
  y: number;
  height: number;
  tilt: number;
}

export const rig: Pose & { intro: number } = { x: 0.42, y: -0.02, height: 0.8, tilt: 0, intro: 1 };

export const POSES: Record<'desktop' | 'tablet' | 'mobile', Record<'hero' | 'story' | 'experience', Pose>> = {
  desktop: {
    // Overlaps the end of the headline on purpose: the bottle stands in front of the type.
    hero: { x: 0.25, y: -0.07, height: 0.76, tilt: 0.06 },
    story: { x: -0.5, y: -0.06, height: 0.74, tilt: -0.12 },
    experience: { x: -0.3, y: -0.06, height: 0.76, tilt: 0 },
  },
  tablet: {
    hero: { x: 0.45, y: -0.1, height: 0.66, tilt: 0.05 },
    story: { x: -0.55, y: 0, height: 0.6, tilt: -0.12 },
    experience: { x: 0, y: 0.28, height: 0.5, tilt: 0 },
  },
  mobile: {
    hero: { x: 0.12, y: -0.34, height: 0.48, tilt: 0.08 },
    story: { x: 0.62, y: -0.2, height: 0.5, tilt: -0.18 },
    experience: { x: 0, y: 0.34, height: 0.44, tilt: 0 },
  },
};
