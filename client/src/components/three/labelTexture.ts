import * as THREE from 'three';
import type { Variant } from '../../types/content';

const W = 2048;
const H = 512;

/**
 * Lettering printed straight onto the glass, on a transparent background so the cola shows
 * through. The texture wraps once around the bottle, so it is painted front and back.
 * The name is typeset in a generic script face; it is not the trademarked logo artwork.
 */
export function createLabelTexture(variant: Variant, anisotropy = 8): THREE.CanvasTexture {
  const canvas = document.createElement('canvas');
  canvas.width = W;
  canvas.height = H;
  const ctx = canvas.getContext('2d')!;
  ctx.clearRect(0, 0, W, H);

  ctx.fillStyle = variant.print;
  ctx.textAlign = 'center';
  ctx.textBaseline = 'alphabetic';
  // About 40% of the wrap: the lettering fills the face of the bottle, as on the real one.
  const maxWidth = W * 0.4;
  for (const cx of [W * 0.25, W * 0.75]) {
    ctx.font = '400 300px "Yellowtail", "Brush Script MT", cursive';
    ctx.fillText('Coca-Cola', cx, 330, maxWidth);
    if (variant.id !== 'classic') {
      ctx.font = '600 52px "Hanken Grotesk", system-ui, sans-serif';
      ctx.letterSpacing = '6px';
      ctx.fillText(variant.name.toUpperCase(), cx, 430, maxWidth);
      ctx.letterSpacing = '0px';
    }
  }

  const texture = new THREE.CanvasTexture(canvas);
  texture.colorSpace = THREE.SRGBColorSpace;
  texture.anisotropy = anisotropy;
  texture.wrapS = THREE.RepeatWrapping;
  return texture;
}
