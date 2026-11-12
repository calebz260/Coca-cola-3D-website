import { useId } from 'react';
import { BOTTLE_HEIGHT, FILL_HEIGHT, LABEL_RANGE, silhouettePath } from '../lib/bottleProfile';
import type { Variant } from '../types/content';

const PATH = silhouettePath();
const CAP = 0.2;

// SVG y runs downward: the base sits at y = BOTTLE_HEIGHT and the mouth near y = 0.
const flip = (h: number) => BOTTLE_HEIGHT - h;

interface Props {
  variant: Variant;
  className?: string;
  title?: string;
}

/** Flat illustration of the same contour profile used by the 3D model. */
export function BottleSilhouette({ variant, className, title }: Props) {
  const id = useId().replace(/:/g, '');
  const letterY = flip((LABEL_RANGE[0] + LABEL_RANGE[1]) / 2) + 0.06;
  return (
    <svg
      viewBox={`0 ${-CAP} 1 ${BOTTLE_HEIGHT + CAP}`}
      className={className}
      role={title ? 'img' : undefined}
      aria-label={title}
      aria-hidden={title ? undefined : true}
      preserveAspectRatio="xMidYMax meet"
    >
      <defs>
        <clipPath id={`${id}-clip`}>
          <path d={PATH} />
        </clipPath>
        <linearGradient id={`${id}-shine`} x1="0" x2="1">
          <stop offset="0" stopColor="#fff" stopOpacity="0" />
          <stop offset="0.3" stopColor="#fff" stopOpacity="0.4" />
          <stop offset="0.37" stopColor="#fff" stopOpacity="0" />
          <stop offset="0.8" stopColor="#fff" stopOpacity="0" />
          <stop offset="0.86" stopColor="#fff" stopOpacity="0.2" />
          <stop offset="1" stopColor="#fff" stopOpacity="0" />
        </linearGradient>
      </defs>
      <g clipPath={`url(#${id}-clip)`}>
        <rect x="0" y="0" width="1" height={BOTTLE_HEIGHT} fill="#1d3a2a" opacity="0.55" />
        <rect x="0" y={flip(FILL_HEIGHT)} width="1" height={FILL_HEIGHT} fill={variant.liquid} />
        <text
          x="0.5"
          y={letterY}
          textAnchor="middle"
          fontFamily="Yellowtail, 'Brush Script MT', cursive"
          fontSize="0.2"
          textLength="0.66"
          lengthAdjust="spacingAndGlyphs"
          fill={variant.print}
        >
          Coca-Cola
        </text>
        <rect x="0" y="0" width="1" height={BOTTLE_HEIGHT} fill={`url(#${id}-shine)`} />
      </g>
      <rect x="0.27" y={-CAP + 0.1} width="0.46" height="0.15" rx="0.025" fill={variant.cap} />
    </svg>
  );
}
