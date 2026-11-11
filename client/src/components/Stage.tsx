import { Component, Suspense, lazy, useEffect, useRef, useState, type ReactNode } from 'react';
import { useReducedMotion } from '../hooks/useReducedMotion';
import { useStageQuality } from '../hooks/useStageQuality';
import { useStageVisible } from '../hooks/useStageVisible';
import { rig } from '../lib/rig';
import { useExperience } from '../state/ExperienceContext';
import { BottleSilhouette } from './BottleSilhouette';

const Scene = lazy(() => import('./three/Scene'));
const STAGE_SECTIONS = ['home', 'story', 'experience'];

class WebGLBoundary extends Component<{ fallback: ReactNode; children: ReactNode }, { failed: boolean }> {
  state = { failed: false };
  static getDerivedStateFromError() {
    return { failed: true };
  }
  componentDidCatch(error: unknown) {
    console.warn('3D stage unavailable, showing the illustrated bottle instead.', error);
  }
  render() {
    return this.state.failed ? this.props.fallback : this.props.children;
  }
}

/**
 * Lightweight stand-in for devices without WebGL, and the placeholder while the 3D chunk
 * downloads. It follows the same scroll choreography as the 3D bottle by reading the rig.
 */
function FlatStage({ loading }: { loading: boolean }) {
  const { variant } = useExperience();
  const el = useRef<HTMLDivElement>(null);

  useEffect(() => {
    let frame = 0;
    const tick = () => {
      const node = el.current;
      if (node) {
        const vh = window.innerHeight;
        const h = rig.height * vh;
        const x = (rig.x * window.innerWidth) / 2;
        const y = (-rig.y * vh) / 2 + rig.intro * vh;
        node.style.height = `${h}px`;
        node.style.transform = `translate(-50%, -50%) translate(${x}px, ${y}px) rotate(${-rig.tilt}rad)`;
      }
      frame = requestAnimationFrame(tick);
    };
    tick();
    return () => cancelAnimationFrame(frame);
  }, []);

  return (
    <div className="pointer-events-none fixed inset-0 z-[1]" aria-hidden={!loading}>
      <div ref={el} className="absolute top-1/2 left-1/2 aspect-[1/3.32]">
        <BottleSilhouette variant={variant} className="h-full w-full drop-shadow-[0_30px_40px_rgba(0,0,0,0.35)]" />
      </div>
      {loading && (
        <p
          role="status"
          className="absolute right-4 bottom-4 rounded-full bg-black/60 px-4 py-2 text-sm text-white backdrop-blur"
        >
          Loading the 3D bottle…
        </p>
      )}
    </div>
  );
}

export function Stage() {
  const quality = useStageQuality();
  const reducedMotion = useReducedMotion();
  const active = useStageVisible(STAGE_SECTIONS);
  const [mounted, setMounted] = useState(false);

  // Mount after first paint so the page text is interactive before the 3D chunk downloads.
  useEffect(() => {
    const id = requestAnimationFrame(() => setMounted(true));
    return () => cancelAnimationFrame(id);
  }, []);

  if (quality === 'none') return <FlatStage loading={false} />;
  if (!mounted) return <FlatStage loading />;

  return (
    <WebGLBoundary fallback={<FlatStage loading={false} />}>
      <Suspense fallback={<FlatStage loading />}>
        <Scene quality={quality} active={active} reducedMotion={reducedMotion} />
      </Suspense>
    </WebGLBoundary>
  );
}
