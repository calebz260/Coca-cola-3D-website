import { useEffect, useState } from 'react';
import type { SectionId } from '../types/content';

/**
 * The section under a reading line just below the fixed nav, 200px down. A section the nav jumps to
 * lands with its top under the nav, so the line falls inside it on every screen height.
 * Sections can nest (#experience lives inside #products), so when several cover the line the
 * innermost one wins; `ids` is in page order, which puts a nested section after its parent.
 */
export function useActiveSection(ids: SectionId[]): SectionId {
  const [active, setActive] = useState<SectionId>(ids[0]);

  useEffect(() => {
    const onLine = new Set<SectionId>();
    let observer: IntersectionObserver | null = null;

    const observe = () => {
      observer?.disconnect();
      onLine.clear();
      const line = Math.min(200, Math.round(window.innerHeight * 0.4));
      observer = new IntersectionObserver(
        (entries) => {
          for (const entry of entries) {
            const id = entry.target.id as SectionId;
            if (entry.isIntersecting) onLine.add(id);
            else onLine.delete(id);
          }
          const innermost = [...ids].reverse().find((id) => onLine.has(id));
          if (innermost) setActive(innermost);
        },
        { rootMargin: `-${line}px 0px -${window.innerHeight - line - 1}px 0px` },
      );
      ids.forEach((id) => {
        const el = document.getElementById(id);
        if (el) observer?.observe(el);
      });
    };

    observe();
    window.addEventListener('resize', observe);
    return () => {
      window.removeEventListener('resize', observe);
      observer?.disconnect();
    };
  }, [ids]);

  return active;
}
