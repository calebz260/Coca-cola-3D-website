/**
 * Contour bottle half-profile as [radius, height] pairs, bottom to top, in scene units.
 * It is turned on a lathe for the 3D model and mirrored for the 2D silhouettes, so both
 * always show the same shape. No three.js import here: this file ships in the main bundle.
 */
const OUTLINE: [number, number][] = [
  [0.0, 0.0],
  [0.34, 0.0],
  [0.4, 0.05],
  [0.42, 0.18],
  [0.42, 0.46],
  [0.4, 0.72],
  [0.355, 0.96],
  [0.335, 1.1], // waist
  [0.36, 1.3],
  [0.405, 1.55],
  [0.42, 1.76],
  [0.4, 1.98],
  [0.34, 2.22],
  [0.26, 2.46],
  [0.19, 2.7],
  [0.155, 2.9],
  [0.148, 3.0],
  [0.165, 3.04],
  [0.165, 3.1],
  [0.14, 3.12],
];

export const BOTTLE_HEIGHT = 3.12;
export const FILL_HEIGHT = 2.5;
export const LABEL_RANGE: [number, number] = [0.3, 0.88];

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
