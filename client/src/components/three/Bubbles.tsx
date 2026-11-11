import { useMemo, useRef, type MutableRefObject } from 'react';
import { useFrame } from '@react-three/fiber';
import * as THREE from 'three';
import { FILL_HEIGHT, radiusAt } from '../../lib/bottleProfile';

interface Props {
  count: number;
  /** 0 … 1, spikes to 1 when the bottle is shaken and decays back. */
  burst: MutableRefObject<number>;
  still: boolean;
}

interface Bubble {
  y: number;
  angle: number;
  depth: number;
  speed: number;
  size: number;
  phase: number;
}

/** Carbonation rising inside the liquid. One instanced draw call. */
export function Bubbles({ count, burst, still }: Props) {
  const mesh = useRef<THREE.InstancedMesh>(null);
  const dummy = useMemo(() => new THREE.Object3D(), []);
  const bubbles = useMemo<Bubble[]>(
    () =>
      Array.from({ length: count }, () => ({
        y: 0.08 + Math.random() * (FILL_HEIGHT - 0.2),
        angle: Math.random() * Math.PI * 2,
        depth: 0.25 + Math.random() * 0.6,
        speed: 0.18 + Math.random() * 0.35,
        size: 0.008 + Math.random() * 0.018,
        phase: Math.random() * Math.PI * 2,
      })),
    [count],
  );

  useFrame((state, delta) => {
    if (!mesh.current) return;
    const dt = Math.min(delta, 0.05);
    const boost = 1 + burst.current * 6;
    const t = state.clock.elapsedTime;
    bubbles.forEach((b, i) => {
      if (!still) {
        b.y += b.speed * boost * dt;
        if (b.y > FILL_HEIGHT - 0.04) {
          b.y = 0.06;
          b.angle = Math.random() * Math.PI * 2;
        }
      }
      const r = radiusAt(b.y) * 0.86 * b.depth;
      const wobble = still ? 0 : Math.sin(t * 3 + b.phase) * 0.01;
      dummy.position.set(Math.sin(b.angle) * r + wobble, b.y, Math.cos(b.angle) * r);
      dummy.scale.setScalar(b.size * (1 + burst.current * 0.6));
      dummy.updateMatrix();
      mesh.current!.setMatrixAt(i, dummy.matrix);
    });
    mesh.current.instanceMatrix.needsUpdate = true;
  });

  return (
    <instancedMesh ref={mesh} args={[undefined, undefined, count]} frustumCulled={false}>
      <sphereGeometry args={[1, 8, 6]} />
      <meshStandardMaterial color="#ffd9b8" emissive="#5a2a10" roughness={0.1} transparent opacity={0.7} />
    </instancedMesh>
  );
}
