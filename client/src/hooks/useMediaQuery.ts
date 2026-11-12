import { useEffect, useState } from 'react';

/** Live result of a CSS media query. */
export function useMediaQuery(query: string): boolean {
  const [matches, setMatches] = useState(() =>
    typeof window === 'undefined' ? false : window.matchMedia(query).matches,
  );
  useEffect(() => {
    const m = window.matchMedia(query);
    const sync = () => setMatches(m.matches);
    sync();
    m.addEventListener('change', sync);
    return () => m.removeEventListener('change', sync);
  }, [query]);
  return matches;
}

/** The same three breakpoints the scroll choreography uses. */
export function useBreakpoint(): 'desktop' | 'tablet' | 'mobile' {
  const desktop = useMediaQuery('(min-width: 1025px)');
  const tablet = useMediaQuery('(min-width: 768px)');
  return desktop ? 'desktop' : tablet ? 'tablet' : 'mobile';
}
