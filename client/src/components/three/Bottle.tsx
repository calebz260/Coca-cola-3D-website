import { useEffect, useMemo, useState } from 'react';
import * as THREE from 'three';
import {
  BOTTLE_HEIGHT,
  LABEL_RANGE,
  bandProfile,
  liquidProfile,
  sampleProfile,
} from '../../lib/bottleProfile';
import type { Variant } from '../../types/content';
import { createLabelTexture } from './labelTexture';

const toVec2 = (pts: [number, number][]) => pts.map(([r, y]) => new THREE.Vector2(r, y));

interface Props {
  variant: Variant;
  segments: number;
}

/**
 * The contour bottle, turned on a lathe from the shared profile: glass shell, liquid volume,
 * label sleeve and crimped cap. Origin is the centre of the base.
 */
export function Bottle({ variant, segments }: Props) {
  const geometry = useMemo(() => {
    const glass = new THREE.LatheGeometry(toVec2(sampleProfile(10)), segments);
    const liquid = new THREE.LatheGeometry(toVec2(liquidProfile()), Math.round(segments * 0.66));
    const label = new THREE.LatheGeometry(toVec2(bandProfile(LABEL_RANGE)), segments);
    const cap = new THREE.CylinderGeometry(0.17, 0.178, 0.12, 21, 1);
    return { glass, liquid, label, cap };
  }, [segments]);

  useEffect(
    () => () => Object.values(geometry).forEach((g) => g.dispose()),
    [geometry],
  );

  // Paint the label once the display font has loaded, so the wordmark uses the right face.
  const [fontsReady, setFontsReady] = useState(false);
  useEffect(() => {
    let cancelled = false;
    Promise.all([
      document.fonts.load('900 200px "Big Shoulders Display"'),
      document.fonts.load('600 58px "Hanken Grotesk"'),
    ])
      .catch(() => undefined)
      .finally(() => !cancelled && setFontsReady(true));
    return () => {
      cancelled = true;
    };
  }, []);

  const labelTexture = useMemo(() => createLabelTexture(variant), [variant, fontsReady]);
  useEffect(() => () => labelTexture.dispose(), [labelTexture]);

  return (
    <group>
      {/* Liquid first: it is opaque and is seen through the glass. */}
      <mesh geometry={geometry.liquid} renderOrder={0}>
        <meshPhysicalMaterial
          color={variant.liquid}
          emissive="#3a0e02"
          emissiveIntensity={0.55}
          roughness={0.12}
          metalness={0}
          clearcoat={1}
          clearcoatRoughness={0.06}
          envMapIntensity={1.2}
          sheen={0.6}
          sheenColor="#a8401a"
        />
      </mesh>

      <mesh geometry={geometry.label} renderOrder={1}>
        <meshPhysicalMaterial map={labelTexture} roughness={0.32} clearcoat={0.6} envMapIntensity={0.9} />
      </mesh>

      {/* Georgia-green glass: thin, reflective and see-through to the page behind it. */}
      <mesh geometry={geometry.glass} renderOrder={2}>
        <meshPhysicalMaterial
          color="#dff3e8"
          transparent
          opacity={0.24}
          roughness={0.03}
          metalness={0.05}
          clearcoat={1}
          clearcoatRoughness={0.02}
          envMapIntensity={2.6}
          depthWrite={false}
          side={THREE.DoubleSide}
        />
      </mesh>

      <mesh geometry={geometry.cap} position={[0, BOTTLE_HEIGHT + 0.05, 0]}>
        <meshStandardMaterial color={variant.cap} metalness={0.65} roughness={0.32} flatShading />
      </mesh>
    </group>
  );
}
