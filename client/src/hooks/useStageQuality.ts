import { useMemo } from 'react';

/**
 * True when WebGL is drawn by the CPU (SwiftShader, llvmpipe, a VM with no GPU). Heavy shaders such as
 * the black hole run at seconds per frame there and starve everything else, so they are skipped.
 */
export function isSoftwareRenderer(): boolean {
  try {
    const gl = document.createElement('canvas').getContext('webgl');
    if (!gl) return false;
    const dbg = gl.getExtension('WEBGL_debug_renderer_info');
    const name = dbg ? String(gl.getParameter(dbg.UNMASKED_RENDERER_WEBGL) ?? '') : '';
    gl.getExtension('WEBGL_lose_context')?.loseContext();
    return /swiftshader|llvmpipe|softpipe|software|microsoft basic/i.test(name);
  } catch {
    return false;
  }
}

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
