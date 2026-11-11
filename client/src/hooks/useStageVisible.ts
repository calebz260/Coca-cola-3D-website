import { useEffect, useState } from 'react';

/**
 * True while any section that shows the 3D bottle is on screen. The canvas stops rendering
 * otherwise, so products, contact and the footer cost no GPU time.
 */
export function useStageVisible(sectionIds: string[]): boolean {
  const [visible, setVisible] = useState(true);

  useEffect(() => {
    const onScreen = new Set<string>();
    const observer = new IntersectionObserver(
      (entries) => {
        for (const entry of entries) {
          if (entry.isIntersecting) onScreen.add(entry.target.id);
          else onScreen.delete(entry.target.id);
        }
        setVisible(onScreen.size > 0);
      },
      { rootMargin: '10% 0px 10% 0px' },
    );
    sectionIds.forEach((id) => {
      const el = document.getElementById(id);
      if (el) observer.observe(el);
    });
    return () => observer.disconnect();
  }, [sectionIds]);

  return visible;
}
