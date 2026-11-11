import { createContext, useCallback, useContext, useMemo, useState, type ReactNode } from 'react';
import { VARIANTS } from '../data/content';
import type { Variant, VariantId } from '../types/content';

interface ExperienceState {
  variant: Variant;
  setVariant: (id: VariantId) => void;
  chilled: boolean;
  setChilled: (value: boolean) => void;
  /** Increments every time the visitor shakes the bottle. */
  shakeCount: number;
  shake: () => void;
}

const ExperienceContext = createContext<ExperienceState | null>(null);

export function ExperienceProvider({ children }: { children: ReactNode }) {
  const [variantId, setVariantId] = useState<VariantId>('classic');
  const [chilled, setChilled] = useState(true);
  const [shakeCount, setShakeCount] = useState(0);

  const shake = useCallback(() => setShakeCount((n) => n + 1), []);
  const value = useMemo<ExperienceState>(
    () => ({
      variant: VARIANTS.find((v) => v.id === variantId) ?? VARIANTS[0],
      setVariant: setVariantId,
      chilled,
      setChilled,
      shakeCount,
      shake,
    }),
    [variantId, chilled, shakeCount, shake],
  );

  return <ExperienceContext.Provider value={value}>{children}</ExperienceContext.Provider>;
}

export function useExperience() {
  const ctx = useContext(ExperienceContext);
  if (!ctx) throw new Error('useExperience must be used inside ExperienceProvider');
  return ctx;
}
