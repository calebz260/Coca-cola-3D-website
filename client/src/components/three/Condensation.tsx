import { useMemo, useRef } from 'react';
import { useFrame } from '@react-three/fiber';
import * as THREE from 'three';
import { radiusAt } from '../../lib/bottleProfile';

interface Props {
  count: number;
  chilled: boolean;
}

/** Droplets beading on the glass when the bottle is chilled. Fades in and out. */
export function Condensation({ count, chilled }: Props) {
  const mesh = useRef<THREE.InstancedMesh>(null);
  const amount = useRef(chilled ? 1 : 0);
  const dummy = useMemo(() => new THREE.Object3D(), []);
  const drops = useMemo(
    () =>
      Array.from({ length: count }, () => {
        const y = 0.12 + Math.random() * 2.1;
        return {
          y,
          angle: Math.random() * Math.PI * 2,
          size: 0.006 + Math.random() ** 2 * 0.022,
          stretch: 1 + Math.random() * 0.6,
          threshold: Math.random(),
        };
      }),
    [count],
  );

  useFrame((_, delta) => {
    if (!mesh.current) return;
    const target = chilled ? 1 : 0;
    const next = THREE.MathUtils.damp(amount.current, target, 2.5, Math.min(delta, 0.05));
    if (Math.abs(next - amount.current) < 1e-4 && mesh.current.userData.ready) return;
    amount.current = next;
    drops.forEach((d, i) => {
      const r = radiusAt(d.y) * 1.003;
      const visible = Math.max(0, Math.min(1, (amount.current - d.threshold * 0.7) * 3));
      dummy.position.set(Math.sin(d.angle) * r, d.y, Math.cos(d.angle) * r);
      dummy.lookAt(dummy.position.x * 2, d.y, dummy.position.z * 2);
      dummy.scale.set(d.size * visible, d.size * d.stretch * visible, d.size * 0.5 * visible);
      dummy.updateMatrix();
      mesh.current!.setMatrixAt(i, dummy.matrix);
    });
    mesh.current.instanceMatrix.needsUpdate = true;
    mesh.current.userData.ready = true;
  });

  return (
    <instancedMesh ref={mesh} args={[undefined, undefined, count]} frustumCulled={false}>
      <sphereGeometry args={[1, 10, 8]} />
      <meshPhysicalMaterial
        color="#ffffff"
        roughness={0.02}
        metalness={0}
        clearcoat={1}
        transparent
        opacity={0.55}
        envMapIntensity={2.2}
      />
    </instancedMesh>
  );
}
