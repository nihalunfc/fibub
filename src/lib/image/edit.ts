// Image editing helpers for the Image resizer. Everything runs on the browser's canvas.

export type Format = 'image/jpeg' | 'image/png' | 'image/webp' | 'image/avif';
export const FORMATS: { mime: Format; ext: string; label: string; lossy: boolean }[] = [
  { mime: 'image/jpeg', ext: 'jpg', label: 'JPG', lossy: true },
  { mime: 'image/png', ext: 'png', label: 'PNG', lossy: false },
  { mime: 'image/webp', ext: 'webp', label: 'WebP', lossy: true },
  { mime: 'image/avif', ext: 'avif', label: 'AVIF', lossy: true },
];
export const formatInfo = (m: Format) => FORMATS.find((f) => f.mime === m)!;

export interface Rect { x: number; y: number; w: number; h: number }
export interface Edit {
  crop: Rect;            // in the coordinates of the rotated/flipped image
  outW: number;
  outH: number;
  format: Format;
  quality: number;       // 0..1, for lossy formats
  background: string;    // fill behind transparent areas for JPG
}

function toBlob(canvas: HTMLCanvasElement, mime: string, quality?: number): Promise<Blob> {
  return new Promise((res, rej) => canvas.toBlob((b) => (b ? res(b) : rej(new Error('encode failed'))), mime, quality));
}

/** Which formats this browser can write. Some can't write WebP (older Safari) or AVIF. */
export async function writableFormats(): Promise<Format[]> {
  const c = document.createElement('canvas');
  c.width = c.height = 2;
  const out: Format[] = [];
  for (const f of FORMATS) {
    try { if ((await toBlob(c, f.mime, 0.8)).type === f.mime) out.push(f.mime); } catch { /* not supported */ }
  }
  return out;
}

/** Draw the image turned by `rotate` degrees (multiple of 90) and optionally mirrored. */
export function orient(src: CanvasImageSource & { width: number; height: number }, rotate: number, flipH: boolean, flipV: boolean): HTMLCanvasElement {
  const r = ((rotate % 360) + 360) % 360;
  const swap = r === 90 || r === 270;
  const c = document.createElement('canvas');
  c.width = swap ? src.height : src.width;
  c.height = swap ? src.width : src.height;
  const ctx = c.getContext('2d')!;
  ctx.translate(c.width / 2, c.height / 2);
  ctx.rotate((r * Math.PI) / 180);
  ctx.scale(flipH ? -1 : 1, flipV ? -1 : 1);
  ctx.drawImage(src, -src.width / 2, -src.height / 2);
  return c;
}

/** Crop, resize and encode. Large reductions are done in halving steps for a sharper result. */
export async function render(oriented: HTMLCanvasElement, e: Edit): Promise<Blob> {
  let cur: HTMLCanvasElement = oriented;
  let { x, y, w, h } = e.crop;
  while (w / 2 >= e.outW && h / 2 >= e.outH) {
    const step = document.createElement('canvas');
    step.width = Math.round(w / 2); step.height = Math.round(h / 2);
    const sctx = step.getContext('2d')!;
    sctx.imageSmoothingQuality = 'high';
    sctx.drawImage(cur, x, y, w, h, 0, 0, step.width, step.height);
    cur = step; x = 0; y = 0; w = step.width; h = step.height;
  }
  const out = document.createElement('canvas');
  out.width = e.outW; out.height = e.outH;
  const ctx = out.getContext('2d')!;
  if (e.format === 'image/jpeg') { ctx.fillStyle = e.background; ctx.fillRect(0, 0, out.width, out.height); }
  ctx.imageSmoothingQuality = 'high';
  ctx.drawImage(cur, x, y, w, h, 0, 0, out.width, out.height);
  const blob = await toBlob(out, e.format, formatInfo(e.format).lossy ? e.quality : undefined);
  out.width = out.height = 0;
  return blob;
}

/**
 * Find the best-looking image under `maxBytes`: first the highest quality that fits, then, if
 * even low quality is too big (or the format is PNG), smaller dimensions.
 */
export async function renderUnder(
  oriented: HTMLCanvasElement, e: Edit, maxBytes: number, onStep: (msg: string) => void,
  floor: { minQuality: number; minSide: number } = { minQuality: 0.3, minSide: 16 },
) {
  let edit = { ...e };
  for (let round = 0; round < 8; round++) {
    if (formatInfo(edit.format).lossy) {
      let lo = floor.minQuality, hi = 0.95, best: Blob | null = null, bestQ = lo;
      for (let i = 0; i < 7; i++) {
        const q = (lo + hi) / 2;
        onStep(`Trying quality ${Math.round(q * 100)}% at ${edit.outW} × ${edit.outH}…`);
        const b = await render(oriented, { ...edit, quality: q });
        if (b.size <= maxBytes) { best = b; bestQ = q; lo = q; } else hi = q;
      }
      if (best) return { blob: best, edit: { ...edit, quality: bestQ } };
    } else {
      onStep(`Trying ${edit.outW} × ${edit.outH}…`);
      const b = await render(oriented, edit);
      if (b.size <= maxBytes) return { blob: b, edit };
    }
    const probe = await render(oriented, { ...edit, quality: floor.minQuality });
    let k = Math.max(0.5, Math.min(0.92, Math.sqrt(maxBytes / probe.size) * 0.95));
    const side = Math.max(edit.outW, edit.outH);
    if (side <= floor.minSide) break;
    if (side * k < floor.minSide) k = floor.minSide / side;
    if (edit.outW * k < 16 || edit.outH * k < 16) break;
    edit = { ...edit, outW: Math.round(edit.outW * k), outH: Math.round(edit.outH * k) };
  }
  return null;
}
