// Image compression with the browser's own canvas: resize, then re-save.
// Re-saving also drops hidden details such as GPS location and camera model.
import type { Level } from './types';

const SETTINGS: Record<Level, { maxSide: number; quality: number }> = {
  light: { maxSide: Infinity, quality: 0.85 },
  recommended: { maxSide: 2560, quality: 0.75 },
  smallest: { maxSide: 1600, quality: 0.6 },
};

function toBlob(canvas: HTMLCanvasElement, mime: string, quality?: number): Promise<Blob> {
  return new Promise((res, rej) => canvas.toBlob((b) => (b ? res(b) : rej(new Error('encode failed'))), mime, quality));
}

function hasTransparency(ctx: CanvasRenderingContext2D, w: number, h: number): boolean {
  // Check a grid of points rather than every pixel; enough to spot a transparent background.
  const step = Math.max(1, Math.floor(Math.min(w, h) / 64));
  const data = ctx.getImageData(0, 0, w, h).data;
  for (let y = 0; y < h; y += step) for (let x = 0; x < w; x += step) if (data[(y * w + x) * 4 + 3] < 250) return true;
  return false;
}

export interface ImageResult { bytes: Uint8Array; mime: string; width: number; height: number }

/**
 * Compress one image. With keepFormat (used inside Word/Excel files, which point at each
 * picture by name) the result has the same type. Otherwise a PNG photo without transparency
 * may become a JPEG, which is usually far smaller.
 */
export async function compressImage(input: Blob, mime: string, level: Level, keepFormat: boolean): Promise<ImageResult | null> {
  let bmp: ImageBitmap;
  try {
    bmp = await createImageBitmap(input);
  } catch {
    return null; // a format this browser can't decode
  }
  const { maxSide, quality } = SETTINGS[level];
  const scale = Math.min(1, maxSide / Math.max(bmp.width, bmp.height));
  const w = Math.max(1, Math.round(bmp.width * scale)), h = Math.max(1, Math.round(bmp.height * scale));
  const canvas = document.createElement('canvas');
  canvas.width = w; canvas.height = h;
  const ctx = canvas.getContext('2d')!;
  ctx.imageSmoothingQuality = 'high';
  ctx.drawImage(bmp, 0, 0, w, h);
  bmp.close();

  let outMime = mime === 'image/jpg' ? 'image/jpeg' : mime;
  if (outMime === 'image/png' && !keepFormat && level !== 'light' && !hasTransparency(ctx, w, h)) outMime = 'image/jpeg';
  if (outMime === 'image/jpeg') { ctx.globalCompositeOperation = 'destination-over'; ctx.fillStyle = '#fff'; ctx.fillRect(0, 0, w, h); }
  let blob = await toBlob(canvas, outMime, outMime === 'image/png' ? undefined : quality);
  // Some browsers (older Safari) can't write WebP and quietly give PNG instead.
  if (blob.type !== outMime) {
    if (keepFormat) return null;
    outMime = blob.type;
  }
  canvas.width = canvas.height = 0;
  return { bytes: new Uint8Array(await blob.arrayBuffer()), mime: outMime, width: w, height: h };
}

export const extFor = (mime: string) => ({ 'image/jpeg': 'jpg', 'image/png': 'png', 'image/webp': 'webp' })[mime] ?? 'img';
