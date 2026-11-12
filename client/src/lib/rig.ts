/**
 * Where the bottle should be. GSAP ScrollTriggers write to this object and the 3D scene
 * eases toward it every frame, so scroll choreography never causes React re-renders.
 *
 * x, y   : position as a fraction of the half viewport (-1 left/bottom … 1 right/top)
 * height : bottle height as a fraction of the viewport height
 * tilt   : lean in radians (z axis)
 * intro  : entrance offset, 1 = below the fold, 0 = in place
 * lift   : extra upward offset in half-viewports, used to scroll the bottle away with the page
 */
export interface Pose {
  x: number;
  y: number;
  height: number;
  tilt: number;
}

export const rig: Pose & { intro: number; lift: number } = { x: 0.46, y: -0.07, height: 0.72, tilt: 0, intro: 1, lift: 0 };

export const POSES: Record<'desktop' | 'tablet' | 'mobile', Record<'hero' | 'story' | 'experience', Pose>> = {
  desktop: {
    // Upright, right of the headline, in front of the black hole's ring.
    hero: { x: 0.46, y: -0.07, height: 0.72, tilt: 0 },
    // Left of the timeline, with the anatomy callouts beside it.
    story: { x: -0.6, y: -0.04, height: 0.66, tilt: 0 },
    // Left column of "Pick a bottle", beside the flavour details and controls.
    experience: { x: -0.46, y: -0.04, height: 0.7, tilt: 0 },
  },
  tablet: {
    hero: { x: 0.46, y: -0.12, height: 0.6, tilt: 0 },
    story: { x: -0.56, y: 0, height: 0.56, tilt: 0 },
    experience: { x: 0, y: 0.36, height: 0.42, tilt: 0 },
  },
  mobile: {
    hero: { x: 0.5, y: -0.54, height: 0.36, tilt: 0 },
    story: { x: 0.7, y: -0.2, height: 0.42, tilt: -0.1 },
    experience: { x: 0, y: 0.4, height: 0.4, tilt: 0 },
  },
};
