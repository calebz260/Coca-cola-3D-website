import * as THREE from 'three';
import type { Variant } from '../../types/content';

const W = 2048;
const H = 512;

/**
 * Paints the label sleeve. The sleeve wraps once around the bottle, so the wordmark is
 * painted twice (front and back) and the ribbon's period divides the width to stay seamless.
 * This is a typeset wordmark, not the trademarked script logo.
 */
export function createLabelTexture(variant: Variant, anisotropy = 8): THREE.CanvasTexture {
  const canvas = document.createElement('canvas');
  canvas.width = W;
  canvas.height = H;
  const ctx = canvas.getContext('2d')!;

  ctx.fillStyle = variant.label;
  ctx.fillRect(0, 0, W, H);

  // Ribbon: two crests per wrap.
  ctx.strokeStyle = variant.ink;
  ctx.lineCap = 'round';
  for (const [offset, width] of [
    [404, 20],
    [446, 7],
  ] as const) {
    ctx.lineWidth = width;
    ctx.beginPath();
    for (let x = 0; x <= W; x += 8) {
      const y = offset + Math.sin((x / W) * Math.PI * 4) * 26;
      if (x === 0) ctx.moveTo(x, y);
      else ctx.lineTo(x, y);
    }
    ctx.stroke();
  }

  ctx.fillStyle = variant.ink;
  ctx.textAlign = 'center';
  ctx.textBaseline = 'alphabetic';
  for (const cx of [W * 0.25, W * 0.75]) {
    ctx.font = '900 200px "Big Shoulders Display", "Arial Narrow", sans-serif';
    ctx.fillText('Coca-Cola', cx, 262);
    ctx.font = '600 58px "Hanken Grotesk", system-ui, sans-serif';
    ctx.fillText(variant.name, cx, 344);
  }

  // Thin trim lines top and bottom.
  ctx.fillRect(0, 18, W, 6);
  ctx.fillRect(0, H - 24, W, 6);

  const texture = new THREE.CanvasTexture(canvas);
  texture.colorSpace = THREE.SRGBColorSpace;
  texture.anisotropy = anisotropy;
  texture.wrapS = THREE.RepeatWrapping;
  return texture;
}
