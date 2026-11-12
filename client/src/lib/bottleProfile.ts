/**
 * Contour bottle half-profile as [radius, height] pairs, bottom to top, in scene units.
 * It is turned on a lathe for the 3D model and mirrored for the 2D silhouettes, so both
 * always show the same shape. No three.js import here: this file ships in the main bundle.
 */
const OUTLINE: [number, number][] = [
  [0.0, 0.0],
  [0.37, 0.0],
  [0.415, 0.035],
  [0.435, 0.16],
  [0.44, 0.36], // lower bulge
  [0.428, 0.6],
  [0.405, 0.86],
  [0.398, 1.0], // waist
  [0.41, 1.18],
  [0.432, 1.4],
  [0.44, 1.64], // upper bulge (lettering band)
  [0.428, 1.88],
  [0.39, 2.1],
  [0.33, 2.28],
  [0.268, 2.46],
  [0.226, 2.62],
  [0.209, 2.8],
  [0.205, 2.95],
  [0.222, 2.99], // lip
  [0.222, 3.06],
  [0.2, 3.09],
];

export const BOTTLE_HEIGHT = 3.09;
/** Cola reaches the bottom of the neck, as in a freshly opened bottle. */
export const FILL_HEIGHT = 2.56;
/** Smooth band between the flutes where the lettering is printed on the glass. */
export const LABEL_RANGE: [number, number] = [1.3, 1.95];

const FLUTES = 12;
const FLUTE_DEPTH = 0.04;

const ramp = (a: number, b: number, v: number) => Math.max(0, Math.min(1, (v - a) / (b - a)));

/**
 * How strongly the vertical flutes show at a height: full on the lower body and the
 * shoulder, smooth in the lettering band, fading out at the base and into the neck.
 */
export function fluteWeight(y: number): number {
  const [lo, hi] = LABEL_RANGE;
  const below = ramp(0.06, 0.22, y) * (1 - ramp(lo - 0.14, lo, y));
  const above = ramp(hi, hi + 0.14, y) * (1 - ramp(2.3, 2.58, y));
  return Math.max(below, above);
}

/** Radial scale for the flutes at an angle around the bottle (1 = no change). */
export function fluteScale(y: number, angle: number): number {
  const w = fluteWeight(y);
  if (w === 0) return 1;
  // Rounded ribs with narrow grooves between them.
  const rib = Math.pow(Math.abs(Math.cos((angle * FLUTES) / 2)), 0.5);
  return 1 - FLUTE_DEPTH * w * (1 - rib);
}

function catmullRom(p0: number, p1: number, p2: number, p3: number, t: number) {
  const t2 = t * t;
  const t3 = t2 * t;
  return 0.5 * (2 * p1 + (-p0 + p2) * t + (2 * p0 - 5 * p1 + 4 * p2 - p3) * t2 + (-p0 + 3 * p1 - 3 * p2 + p3) * t3);
}

/** Smoothly resampled profile. The base corner stays sharp so the bottle stands flat. */
export function sampleProfile(stepsPerSegment = 8): [number, number][] {
  const pts: [number, number][] = [OUTLINE[0]];
  for (let i = 1; i < OUTLINE.length - 1; i++) {
    const p0 = OUTLINE[Math.max(i - 1, 1)];
    const p1 = OUTLINE[i];
    const p2 = OUTLINE[i + 1];
    const p3 = OUTLINE[Math.min(i + 2, OUTLINE.length - 1)];
    for (let s = 0; s < stepsPerSegment; s++) {
      const t = s / stepsPerSegment;
      pts.push([Math.max(0, catmullRom(p0[0], p1[0], p2[0], p3[0], t)), catmullRom(p0[1], p1[1], p2[1], p3[1], t)]);
    }
  }
  pts.push(OUTLINE[OUTLINE.length - 1]);
  return pts;
}

const SAMPLED = sampleProfile(10);

/** Outer radius of the bottle at a given height. */
export function radiusAt(y: number): number {
  for (let i = 1; i < SAMPLED.length; i++) {
    const [r1, y1] = SAMPLED[i];
    const [r0, y0] = SAMPLED[i - 1];
    if (y <= y1 && y1 > y0) {
      const t = (y - y0) / (y1 - y0);
      return r0 + (r1 - r0) * Math.max(0, Math.min(1, t));
    }
  }
  return SAMPLED[SAMPLED.length - 1][0];
}

/** Profile clipped to a height band and pushed out slightly, for the label sleeve. */
export function bandProfile([from, to]: [number, number], inflate = 1.012, steps = 24): [number, number][] {
  const out: [number, number][] = [];
  for (let i = 0; i <= steps; i++) {
    const y = from + ((to - from) * i) / steps;
    out.push([radiusAt(y) * inflate, y]);
  }
  return out;
}

/** Liquid volume: the inside of the glass up to the fill line, closed at the top. */
export function liquidProfile(wall = 0.9, steps = 40): [number, number][] {
  const out: [number, number][] = [[0, 0.03]];
  for (let i = 0; i <= steps; i++) {
    const y = 0.03 + ((FILL_HEIGHT - 0.03) * i) / steps;
    out.push([radiusAt(y) * wall, y]);
  }
  out.push([0, FILL_HEIGHT]);
  return out;
}

/** SVG path of the full silhouette (both halves), in a viewBox of width 1, height BOTTLE_HEIGHT + cap. */
export function silhouettePath(): string {
  const pts = sampleProfile(6);
  const cx = 0.5;
  const top = BOTTLE_HEIGHT;
  const right = pts.map(([r, y]) => `${(cx + r).toFixed(4)},${(top - y).toFixed(4)}`);
  const left = [...pts].reverse().map(([r, y]) => `${(cx - r).toFixed(4)},${(top - y).toFixed(4)}`);
  return `M${right.join(' L')} L${left.join(' L')} Z`;
}
