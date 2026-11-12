import { useEffect, useMemo, useState } from 'react';
import * as THREE from 'three';
import {
  FILL_HEIGHT,
  LABEL_RANGE,
  bandProfile,
  fluteScale,
  liquidProfile,
  radiusAt,
  sampleProfile,
} from '../../lib/bottleProfile';
import type { Variant } from '../../types/content';
import { createLabelTexture } from './labelTexture';

const toVec2 = (pts: [number, number][]) => pts.map(([r, y]) => new THREE.Vector2(r, y));

/** Press the vertical flutes into a lathe-turned surface. */
function flute(geometry: THREE.BufferGeometry) {
  const pos = geometry.attributes.position as THREE.BufferAttribute;
  for (let i = 0; i < pos.count; i++) {
    const x = pos.getX(i);
    const y = pos.getY(i);
    const z = pos.getZ(i);
    const k = fluteScale(y, Math.atan2(x, z));
    pos.setXYZ(i, x * k, y, z * k);
  }
  pos.needsUpdate = true;
  geometry.computeVertexNormals();
  return geometry;
}

/** Inside of the empty neck, above the cola: reads as thick, green-tinted glass. */
function neckProfile(steps = 16): [number, number][] {
  const top = 3.04;
  const out: [number, number][] = [];
  for (let i = 0; i <= steps; i++) {
    const y = FILL_HEIGHT + ((top - FILL_HEIGHT) * i) / steps;
    out.push([radiusAt(y) * 0.86, y]);
  }
  return out;
}

/** Crown cap: domed top and a skirt crimped into 21 teeth. Origin at the skirt's bottom edge. */
function crownCap(segments: number) {
  const profile: [number, number][] = [
    [0.234, 0],
    [0.24, 0.02],
    [0.236, 0.075],
    [0.226, 0.105],
    [0.205, 0.125],
    [0.12, 0.134],
    [0, 0.136],
  ];
  const geometry = new THREE.LatheGeometry(toVec2(profile), segments);
  const pos = geometry.attributes.position as THREE.BufferAttribute;
  for (let i = 0; i < pos.count; i++) {
    const x = pos.getX(i);
    const y = pos.getY(i);
    const z = pos.getZ(i);
    if (y > 0.11) continue;
    const teeth = Math.pow(Math.abs(Math.cos((Math.atan2(x, z) * 21) / 2)), 3);
    const k = 1 + 0.07 * teeth * (1 - y / 0.11);
    pos.setXYZ(i, x * k, y, z * k);
  }
  geometry.computeVertexNormals();
  return geometry;
}

interface Props {
  variant: Variant;
  segments: number;
}

/**
 * The glass contour bottle, modelled on the classic returnable: fluted glass, cola filled to
 * the neck, lettering printed straight onto the glass and a crimped crown cap.
 * Origin is the centre of the base.
 */
export function Bottle({ variant, segments }: Props) {
  const geometry = useMemo(() => {
    const glass = flute(new THREE.LatheGeometry(toVec2(sampleProfile(10)), segments));
    const liquid = flute(new THREE.LatheGeometry(toVec2(liquidProfile(0.965)), segments));
    const neck = new THREE.LatheGeometry(toVec2(neckProfile()), Math.round(segments * 0.5));
    const label = new THREE.LatheGeometry(toVec2(bandProfile(LABEL_RANGE, 1.006)), segments);
    const cap = crownCap(Math.max(84, segments));
    return { glass, liquid, neck, label, cap };
  }, [segments]);

  useEffect(() => () => Object.values(geometry).forEach((g) => g.dispose()), [geometry]);

  // Paint the lettering once the script face has loaded.
  const [fontsReady, setFontsReady] = useState(false);
  useEffect(() => {
    let cancelled = false;
    Promise.all([document.fonts.load('400 160px "Yellowtail"'), document.fonts.load('600 40px "Hanken Grotesk"')])
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
      {/* Cola: deep red that glows where the light passes through. Seen through the glass. */}
      <mesh geometry={geometry.liquid} renderOrder={0}>
        <meshPhysicalMaterial
          color={variant.liquid}
          emissive={variant.liquid}
          emissiveIntensity={0.55}
          roughness={0.08}
          metalness={0}
          clearcoat={1}
          clearcoatRoughness={0.04}
          envMapIntensity={1.6}
          sheen={0.3}
          sheenRoughness={0.35}
          sheenColor="#c0300e"
        />
      </mesh>

      <mesh geometry={geometry.neck} renderOrder={1}>
        <meshPhysicalMaterial
          color="#0b2116"
          transparent
          opacity={0.8}
          roughness={0.1}
          clearcoat={1}
          envMapIntensity={1.4}
          depthWrite={false}
          side={THREE.DoubleSide}
        />
      </mesh>

      {/* Thin glass with a faint green tint, bright reflections on the flutes. */}
      <mesh geometry={geometry.glass} renderOrder={2}>
        <meshPhysicalMaterial
          color="#cfe9da"
          transparent
          opacity={0.13}
          roughness={0.02}
          metalness={0.05}
          clearcoat={1}
          clearcoatRoughness={0.01}
          envMapIntensity={3}
          depthWrite={false}
          side={THREE.DoubleSide}
        />
      </mesh>

      {/* Lettering printed on the outside of the glass. */}
      <mesh geometry={geometry.label} renderOrder={3}>
        <meshStandardMaterial
          map={labelTexture}
          transparent
          alphaTest={0.02}
          roughness={0.35}
          envMapIntensity={0.8}
          depthWrite={false}
        />
      </mesh>

      <mesh geometry={geometry.cap} position={[0, 2.965, 0]}>
        <meshPhysicalMaterial
          color={variant.cap}
          metalness={0.55}
          roughness={0.28}
          clearcoat={0.8}
          clearcoatRoughness={0.15}
          envMapIntensity={1.6}
        />
      </mesh>
    </group>
  );
}
