import { useMemo, useRef, type MutableRefObject } from 'react';
import { useFrame } from '@react-three/fiber';
import * as THREE from 'three';

function bubbleSprite(): THREE.CanvasTexture {
  const size = 64;
  const canvas = document.createElement('canvas');
  canvas.width = canvas.height = size;
  const ctx = canvas.getContext('2d')!;
  const g = ctx.createRadialGradient(size * 0.42, size * 0.38, 2, size / 2, size / 2, size / 2);
  g.addColorStop(0, 'rgba(255,255,255,0.95)');
  g.addColorStop(0.25, 'rgba(255,255,255,0.15)');
  g.addColorStop(0.78, 'rgba(255,255,255,0.08)');
  g.addColorStop(0.92, 'rgba(255,255,255,0.75)');
  g.addColorStop(1, 'rgba(255,255,255,0)');
  ctx.fillStyle = g;
  ctx.fillRect(0, 0, size, size);
  const tex = new THREE.CanvasTexture(canvas);
  tex.colorSpace = THREE.SRGBColorSpace;
  return tex;
}

interface Props {
  count: number;
  burst: MutableRefObject<number>;
  still: boolean;
}

/** Floating bubbles and particles drifting up through the whole stage, behind the bottle. */
export function Fizz({ count, burst, still }: Props) {
  const points = useRef<THREE.Points>(null);
  const sprite = useMemo(bubbleSprite, []);
  const { positions, speeds } = useMemo(() => {
    const positions = new Float32Array(count * 3);
    const speeds = new Float32Array(count);
    for (let i = 0; i < count; i++) {
      positions[i * 3] = (Math.random() - 0.5) * 14;
      positions[i * 3 + 1] = (Math.random() - 0.5) * 9;
      positions[i * 3 + 2] = -1.5 - Math.random() * 4;
      speeds[i] = 0.12 + Math.random() * 0.4;
    }
    return { positions, speeds };
  }, [count]);

  useFrame((state, delta) => {
    if (still || !points.current) return;
    const dt = Math.min(delta, 0.05);
    const attr = points.current.geometry.attributes.position as THREE.BufferAttribute;
    const arr = attr.array as Float32Array;
    const t = state.clock.elapsedTime;
    const boost = 1 + burst.current * 3;
    for (let i = 0; i < count; i++) {
      arr[i * 3 + 1] += speeds[i] * boost * dt;
      arr[i * 3] += Math.sin(t * 0.8 + i) * 0.0015;
      if (arr[i * 3 + 1] > 4.8) arr[i * 3 + 1] = -4.8;
    }
    attr.needsUpdate = true;
  });

  return (
    <points ref={points} frustumCulled={false}>
      <bufferGeometry>
        <bufferAttribute attach="attributes-position" args={[positions, 3]} />
      </bufferGeometry>
      <pointsMaterial
        map={sprite}
        size={0.13}
        sizeAttenuation
        transparent
        opacity={0.55}
        depthWrite={false}
        color="#ffffff"
      />
    </points>
  );
}
