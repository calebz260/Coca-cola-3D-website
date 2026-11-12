import { useEffect, useRef, type MutableRefObject } from 'react';
import { Canvas, useFrame, useThree, type ThreeEvent } from '@react-three/fiber';
import { ContactShadows, Environment, Lightformer } from '@react-three/drei';
import * as THREE from 'three';
import { BOTTLE_HEIGHT } from '../../lib/bottleProfile';
import { rig } from '../../lib/rig';
import { useExperience } from '../../state/ExperienceContext';
import { Bottle } from './Bottle';
import { Bubbles } from './Bubbles';
import { Condensation } from './Condensation';
import { Fizz } from './Fizz';

export interface SceneProps {
  quality: 'high' | 'lite';
  active: boolean;
  reducedMotion: boolean;
}

const AUTO_SPIN = 0.35; // radians per second

interface RigProps extends Omit<SceneProps, 'active'> {
  burst: MutableRefObject<number>;
}

function BottleRig({ quality, reducedMotion, burst }: RigProps) {
  const { variant, chilled, shakeCount } = useExperience();
  const outer = useRef<THREE.Group>(null);
  const spinner = useRef<THREE.Group>(null);
  const viewport = useThree((s) => s.viewport);
  const gl = useThree((s) => s.gl);
  const spin = useRef({ angle: -0.5, velocity: reducedMotion ? 0 : AUTO_SPIN, dragging: false, lastX: 0, lastT: 0 });

  useEffect(() => {
    if (shakeCount > 0) burst.current = 1;
  }, [shakeCount]);

  // Drag to spin, with momentum. Vertical swipes cancel the pointer and scroll the page.
  useEffect(() => {
    const s = spin.current;
    const move = (e: PointerEvent) => {
      if (!s.dragging) return;
      const now = performance.now();
      const dx = e.clientX - s.lastX;
      const dt = Math.max(1, now - s.lastT) / 1000;
      s.angle += dx * 0.012;
      s.velocity = THREE.MathUtils.clamp((dx * 0.012) / dt, -9, 9);
      s.lastX = e.clientX;
      s.lastT = now;
    };
    const end = () => {
      if (!s.dragging) return;
      s.dragging = false;
      document.documentElement.style.cursor = '';
    };
    window.addEventListener('pointermove', move);
    window.addEventListener('pointerup', end);
    window.addEventListener('pointercancel', end);
    return () => {
      window.removeEventListener('pointermove', move);
      window.removeEventListener('pointerup', end);
      window.removeEventListener('pointercancel', end);
    };
  }, []);

  const onPointerDown = (e: ThreeEvent<PointerEvent>) => {
    // Clicks on links and buttons above the canvas belong to them, not the bottle.
    const target = e.nativeEvent.target as HTMLElement | null;
    if (target?.closest('a, button, input, textarea, select, label')) return;
    e.stopPropagation();
    const s = spin.current;
    s.dragging = true;
    s.lastX = e.clientX;
    s.lastT = performance.now();
    document.documentElement.style.cursor = 'grabbing';
  };

  useFrame((state, delta) => {
    const g = outer.current;
    const sp = spinner.current;
    if (!g || !sp) return;
    const dt = Math.min(delta, 0.05);
    const s = spin.current;

    const scale = (rig.height * viewport.height) / BOTTLE_HEIGHT;
    const targetX = (rig.x * viewport.width) / 2;
    const targetY = ((rig.y + rig.lift) * viewport.height) / 2 - rig.intro * viewport.height;
    const k = reducedMotion ? 20 : 5;
    g.position.x = THREE.MathUtils.damp(g.position.x, targetX, k, dt);
    g.position.y = THREE.MathUtils.damp(g.position.y, targetY, k, dt);
    const sc = THREE.MathUtils.damp(g.scale.x, scale, k, dt);
    g.scale.setScalar(sc);

    if (!s.dragging) s.velocity = THREE.MathUtils.damp(s.velocity, reducedMotion ? 0 : AUTO_SPIN, 1.4, dt);
    s.angle += s.dragging ? 0 : s.velocity * dt;
    sp.rotation.y = s.angle;

    burst.current = Math.max(0, burst.current - dt * 0.7);
    const shakeWobble = reducedMotion ? 0 : Math.sin(state.clock.elapsedTime * 28) * 0.12 * burst.current ** 2;
    const pointerTilt = reducedMotion ? 0 : state.pointer.y * 0.06;
    g.rotation.z = THREE.MathUtils.damp(g.rotation.z, rig.tilt, 4, dt) + shakeWobble * 0.4;
    g.rotation.x = THREE.MathUtils.damp(g.rotation.x, -pointerTilt, 3, dt);
  });

  useEffect(() => {
    gl.domElement.setAttribute('aria-hidden', 'true');
  }, [gl]);

  return (
    <group ref={outer} scale={0.0001}>
      <group position={[0, -BOTTLE_HEIGHT / 2, 0]}>
        <group
          ref={spinner}
          onPointerDown={onPointerDown}
          onPointerOver={() => !spin.current.dragging && (document.documentElement.style.cursor = 'grab')}
          onPointerOut={() => !spin.current.dragging && (document.documentElement.style.cursor = '')}
        >
          <Bottle variant={variant} segments={quality === 'high' ? 128 : 64} />
          <Bubbles count={quality === 'high' ? 110 : 45} burst={burst} still={reducedMotion} />
          <Condensation count={quality === 'high' ? 520 : 180} chilled={chilled} />
        </group>
        {quality === 'high' && (
          <ContactShadows position={[0, 0.001, 0]} scale={2.2} far={1.2} blur={2.4} opacity={0.55} resolution={256} color="#200000" />
        )}
      </group>
    </group>
  );
}

function Lighting() {
  return (
    <>
      <ambientLight intensity={0.35} />
      <directionalLight position={[3, 5, 4]} intensity={2.2} />
      <pointLight position={[-3, -1, -2]} intensity={4} color="#ff5a3a" distance={10} />
      <Environment resolution={256} frames={1}>
        <Lightformer form="rect" intensity={5} position={[0, 4, 3]} scale={[8, 1.2, 1]} rotation-x={Math.PI / 2} />
        <Lightformer form="rect" intensity={3.5} position={[-3.2, 0.4, 2]} rotation-y={Math.PI / 2.6} scale={[0.5, 9, 1]} />
        <Lightformer form="rect" intensity={2.5} position={[3.2, 0.4, 2]} rotation-y={-Math.PI / 2.6} scale={[0.35, 9, 1]} />
        <Lightformer form="rect" color="#ff2a3a" intensity={0.8} position={[0, -1, -5]} scale={[12, 5, 1]} />
      </Environment>
    </>
  );
}

function Stage({ quality, reducedMotion }: Omit<SceneProps, 'active'>) {
  // Shared by the bottle (wobble, inner bubbles) and the ambient fizz.
  const burst = useRef(0);
  return (
    <>
      <Lighting />
      <BottleRig quality={quality} reducedMotion={reducedMotion} burst={burst} />
      <Fizz count={quality === 'high' ? 260 : 90} burst={burst} still={reducedMotion} />
    </>
  );
}

export default function Scene({ quality, active, reducedMotion }: SceneProps) {
  return (
    <Canvas
      eventSource={document.getElementById('root') ?? undefined}
      eventPrefix="client"
      frameloop={active ? 'always' : 'never'}
      dpr={quality === 'high' ? [1, 1.75] : [1, 1.25]}
      camera={{ position: [0, 0, 7], fov: 35, near: 0.1, far: 50 }}
      gl={{ antialias: quality === 'high', alpha: true, powerPreference: 'high-performance' }}
      style={{ position: 'fixed', inset: 0, zIndex: 1, pointerEvents: 'none' }}
      data-testid="stage-canvas"
    >
      <Stage quality={quality} reducedMotion={reducedMotion} />
    </Canvas>
  );
}
