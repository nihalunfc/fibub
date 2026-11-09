// Small page helpers shared by fibub's plant, spore, reef and canopy photo tools: open a photo into RGBA pixels
// (scaled down to keep the page quick), turn a tap on the shown picture into photo pixels, and keep a picture
// for drawing marks on. The photo is read on the page only; nothing is uploaded or stored.
import type { Pt } from './sci/plantimg';

export type Photo = { px: Uint8ClampedArray; w: number; h: number; name: string; scaled: boolean; ow: number; oh: number };

/** Read an image file into pixels, longest side at most maxSide. */
export function readPhoto(file: File, maxSide = 1200): Promise<Photo> {
  return new Promise((res, rej) => {
    const url = URL.createObjectURL(file), im = new Image();
    im.onload = () => {
      const ow = im.naturalWidth, oh = im.naturalHeight, s = Math.min(1, maxSide / Math.max(ow, oh));
      const w = Math.max(1, Math.round(ow * s)), h = Math.max(1, Math.round(oh * s));
      const cv = document.createElement('canvas'); cv.width = w; cv.height = h;
      const cx = cv.getContext('2d', { willReadFrequently: true })!; cx.drawImage(im, 0, 0, w, h);
      URL.revokeObjectURL(url);
      res({ px: cx.getImageData(0, 0, w, h).data, w, h, name: file.name.replace(/\.[^.]+$/, ''), scaled: s < 1, ow, oh });
    };
    im.onerror = () => { URL.revokeObjectURL(url); rej(new Error('That image could not be opened. Try a PNG or JPEG.')); };
    im.src = url;
  });
}

/** An off-screen canvas holding the pixels, for drawing the photo under marks. */
export function photoCanvas(px: Uint8ClampedArray, w: number, h: number): HTMLCanvasElement {
  const c = document.createElement('canvas'); c.width = w; c.height = h;
  c.getContext('2d')!.putImageData(new ImageData(new Uint8ClampedArray(px), w, h), 0, 0);
  return c;
}

/** Where a click or tap on the shown canvas falls, in photo pixels. */
export function tapAt(ev: MouseEvent, canvas: HTMLCanvasElement, w: number, h: number): Pt {
  const r = canvas.getBoundingClientRect();
  return [Math.max(0, Math.min(w - 1e-6, ((ev.clientX - r.left) / r.width) * w)), Math.max(0, Math.min(h - 1e-6, ((ev.clientY - r.top) / r.height) * h))];
}

/** Paint a mask over a picture: pixels where pick(i) gives a colour are tinted with it. */
export function tint(ctx: CanvasRenderingContext2D, w: number, h: number, pick: (i: number) => [number, number, number] | null, alpha = 0.55) {
  const id = ctx.getImageData(0, 0, w, h), d = id.data;
  for (let i = 0; i < w * h; i++) {
    const c = pick(i);
    if (!c) continue;
    d[4 * i] = d[4 * i] * (1 - alpha) + c[0] * alpha; d[4 * i + 1] = d[4 * i + 1] * (1 - alpha) + c[1] * alpha; d[4 * i + 2] = d[4 * i + 2] * (1 - alpha) + c[2] * alpha;
  }
  ctx.putImageData(id, 0, 0);
}

/** A fact for an <dl class="ax-facts">. */
export function fact(k: string, v: string, sm = '') {
  const d = document.createElement('div'); d.innerHTML = '<dt></dt><dd></dd>';
  d.querySelector('dt')!.textContent = k; d.querySelector('dd')!.textContent = v;
  if (sm) { const e = document.createElement('small'); e.textContent = sm; d.querySelector('dd')!.append(e); }
  return d;
}
export const factPairs = (dl: HTMLElement) => [...dl.children].map((d) => [d.querySelector('dt')!.textContent!, d.querySelector('dd')!.childNodes[0].textContent!] as [string, string]);

/** Fill a <table> with a header row and body rows (numbers right-aligned after the first column). */
export function fillTable(t: HTMLTableElement, head: string[], rows: string[][]) {
  t.replaceChildren();
  const hr = t.createTHead().insertRow();
  head.forEach((h, i) => { const th = document.createElement('th'); th.textContent = h; if (i) th.style.textAlign = 'right'; hr.append(th); });
  const b = t.createTBody();
  rows.forEach((r) => { const tr = b.insertRow(); r.forEach((c, i) => { const td = tr.insertCell(); td.textContent = c; if (i) td.style.textAlign = 'right'; }); });
}

/** A report figure that is a copy of a canvas (the photo with its marks), at most 640 px wide. */
export function canvasFigure(src: HTMLCanvasElement, alt: string) {
  const w = 640, h = Math.max(1, Math.round((640 * src.height) / src.width));
  const copy = document.createElement('canvas'); copy.width = src.width; copy.height = src.height; copy.getContext('2d')!.drawImage(src, 0, 0);
  return { w, h, alt, draw: (ctx: CanvasRenderingContext2D, fw: number, fh: number) => ctx.drawImage(copy, 0, 0, fw, fh) };
}
