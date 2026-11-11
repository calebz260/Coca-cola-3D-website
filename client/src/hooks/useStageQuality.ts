import { useMemo } from 'react';

export type StageQuality = 'high' | 'lite' | 'none';

interface NavigatorHints extends Navigator {
  deviceMemory?: number;
  connection?: { saveData?: boolean };
}

function hasWebGL(): boolean {
  try {
    const canvas = document.createElement('canvas');
    return Boolean(canvas.getContext('webgl2') ?? canvas.getContext('webgl'));
  } catch {
    return false;
  }
}

/**
 * Decides how much 3D the device gets.
 * - none: no WebGL, or forced with ?stage=none. A static bottle illustration is shown.
 * - lite: low memory, few cores, data saver, or ?stage=lite. Fewer particles, no shadows, dpr 1.
 * - high: everything else.
 */
export function useStageQuality(): StageQuality {
  return useMemo(() => {
    if (typeof window === 'undefined') return 'none';
    const forced = new URLSearchParams(window.location.search).get('stage');
    if (forced === 'none' || forced === 'lite' || forced === 'high') return forced;
    if (!hasWebGL()) return 'none';

    const nav = navigator as NavigatorHints;
    const lowMemory = (nav.deviceMemory ?? 8) <= 2;
    const fewCores = (nav.hardwareConcurrency ?? 8) <= 2;
    const saveData = nav.connection?.saveData === true;
    const smallTouch = window.matchMedia('(pointer: coarse) and (max-width: 767px)').matches;
    if (lowMemory || fewCores || saveData) return 'lite';
    return smallTouch ? 'lite' : 'high';
  }, []);
}
