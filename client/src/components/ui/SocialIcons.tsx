import type { SVGProps } from 'react';

/** Brand glyphs (lucide no longer ships brand marks). 24px grid, stroke-based to match lucide. */
type IconProps = SVGProps<SVGSVGElement> & { size?: number };

const base = (size: number): SVGProps<SVGSVGElement> => ({
  width: size,
  height: size,
  viewBox: '0 0 24 24',
  fill: 'none',
  stroke: 'currentColor',
  strokeWidth: 1.8,
  strokeLinecap: 'round',
  strokeLinejoin: 'round',
  'aria-hidden': true,
});

export function InstagramIcon({ size = 20, ...props }: IconProps) {
  return (
    <svg {...base(size)} {...props}>
      <rect x="3" y="3" width="18" height="18" rx="5" />
      <circle cx="12" cy="12" r="4" />
      <circle cx="17.4" cy="6.6" r="0.6" fill="currentColor" />
    </svg>
  );
}

export function YouTubeIcon({ size = 20, ...props }: IconProps) {
  return (
    <svg {...base(size)} {...props}>
      <rect x="2.5" y="5.5" width="19" height="13" rx="4" />
      <path d="M10.2 9.4v5.2l4.4-2.6z" fill="currentColor" />
    </svg>
  );
}

export function XIcon({ size = 20, ...props }: IconProps) {
  return (
    <svg {...base(size)} {...props}>
      <path d="M4 4l16 16M20 4L4 20" />
    </svg>
  );
}

export const SOCIAL_LINKS = [
  { label: 'Instagram', href: 'https://www.instagram.com/', Icon: InstagramIcon },
  { label: 'TikTok', href: 'https://www.tiktok.com/', Icon: null },
  { label: 'YouTube', href: 'https://www.youtube.com/', Icon: YouTubeIcon },
  { label: 'X', href: 'https://x.com/', Icon: XIcon },
] as const;
