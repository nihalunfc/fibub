// Browser side shared by the micrograph tools: open a PNG, JPEG or TIFF on the page (never uploaded), show it on a
// canvas, calibrate the scale (draw a line along the scale bar and type its length, or type the pixel size) and set
// the area to analyse (two corners). Each tool adds its own overlay and taps. The markup is in each Tool.astro with
// the mg-* classes below, inside the tool's own root element.
import { tiffToImg, boxDown, greyFromRgba, umPerPx, UNITS, fmtLen, type Img, type Rect } from './sci/micro';

export const MAXSIDE = 1600;

/** Reads an image file the user picked. Big images are scaled down to MAXSIDE px on the longer side; `scale` is
 *  shown pixels per original pixel. */
export async function openImage(f: File): Promise<Img & { scale: number; note: string }> {
  const head = new Uint8Array(await f.slice(0, 4).arrayBuffer());
  const isTiff = (head[0] === 0x49 && head[1] === 0x49 && head[2] === 42) || (head[0] === 0x4d && head[1] === 0x4d && head[3] === 42);
  if (isTiff) {
    if (f.size > 400e6) throw new Error('This TIFF is too big to open here (over 400 MB).');
    const t = tiffToImg(await f.arrayBuffer(), 120e6), k = Math.ceil(Math.max(t.w, t.h) / MAXSIDE);
    const d = boxDown(t, k);
    return { ...d, scale: d.w / t.w, note: [t.note, k > 1 ? `Scaled down from ${t.w} × ${t.h} to ${d.w} × ${d.h} px (each shown pixel is the average of ${k} × ${k}).` : ''].filter(Boolean).join(' ') };
  }
  const url = URL.createObjectURL(f);
  try {
    const im = new Image();
    await new Promise<void>((ok, bad) => { im.onload = () => ok(); im.onerror = () => bad(new Error('That image could not be opened. Try a PNG, JPEG or TIFF.')); im.src = url; });
    const s = Math.min(1, MAXSIDE / Math.max(im.naturalWidth, im.naturalHeight)), w = Math.max(1, Math.round(im.naturalWidth * s)), h = Math.max(1, Math.round(im.naturalHeight * s));
    const cv = document.createElement('canvas'); cv.width = w; cv.height = h; const cx = cv.getContext('2d')!; cx.drawImage(im, 0, 0, w, h);
    return { rgba: cx.getImageData(0, 0, w, h).data, w, h, scale: w / im.naturalWidth, note: s < 1 ? `Scaled down from ${im.naturalWidth} × ${im.naturalHeight} to ${w} × ${h} px to keep the page quick.` : '' };
  } finally { URL.revokeObjectURL(url); }
}

type Opts = {
  /** Called when the image, the area or the calibration changes. */
  change: () => void;
  /** Called when only the scale changes (defaults to change). */
  cal?: () => void;
  /** Draws the tool's own marks over the image; lw is a line width that reads well at this image size. */
  overlay?: (ctx: CanvasRenderingContext2D, lw: number) => void;
  /** A tap on the image while no scale line or area is being drawn, in image pixels. */
  tap?: (x: number, y: number) => void;
};

/** The shared image card: open, show, calibrate, set the area. */
export class Micro {
  img: Img | null = null; grey: Float32Array | null = null; name = 'micrograph'; scale = 1;
  rect: Rect = { x0: 0, y0: 0, x1: 0, y1: 0 };
  line: [number, number, number, number] | null = null;
  mode: 'none' | 'scale' | 'area' = 'none';
  private a: [number, number] | null = null; private down: [number, number] | null = null; private base: HTMLCanvasElement | null = null;
  constructor(public root: HTMLElement, public o: Opts) {
    const q = this.q.bind(this);
    q('.mg-open').addEventListener('click', () => q<HTMLInputElement>('.mg-file').click());
    q('.mg-file').addEventListener('change', async () => {
      const f = q<HTMLInputElement>('.mg-file').files?.[0]; if (!f) return;
      q<HTMLInputElement>('.mg-file').value = '';
      try { const r = await openImage(f); this.load(r, f.name.replace(/\.[^.]+$/, ''), r.scale, r.note); }
      catch (e) { this.err((e as Error).message || 'That image could not be opened.'); }
    });
    q('.mg-draw').addEventListener('click', () => this.setMode(this.mode === 'scale' ? 'none' : 'scale'));
    q('.mg-area').addEventListener('click', () => this.setMode(this.mode === 'area' ? 'none' : 'area'));
    q('.mg-full').addEventListener('click', () => { if (!this.img) return; this.rect = { x0: 0, y0: 0, x1: this.img.w, y1: this.img.h }; this.setMode('none'); this.o.change(); });
    let t = 0;
    ['.mg-bpx', '.mg-blen', '.mg-pix'].forEach((c) => q(c).addEventListener('input', () => { clearTimeout(t); t = window.setTimeout(() => { this.calText(); (this.o.cal ?? this.o.change)(); }, 250); }));
    q('.mg-unit').addEventListener('change', () => { this.calText(); (this.o.cal ?? this.o.change)(); });
    const cv = q<HTMLCanvasElement>('.mg-canvas');
    cv.addEventListener('pointerdown', (e) => { if (this.mode === 'none') return; this.down = this.at(e); cv.setPointerCapture(e.pointerId); e.preventDefault(); });
    cv.addEventListener('pointerup', (e) => {
      const p = this.at(e);
      if (this.mode === 'none') { if (this.img && this.o.tap) this.o.tap(p[0], p[1]); return; }
      const d = this.down; this.down = null;
      const r = cv.getBoundingClientRect(), k = this.img ? r.width / this.img.w : 1;
      if (d && Math.hypot(p[0] - d[0], p[1] - d[1]) * k > 10) this.finish(d, p);
      else if (!this.a) { this.a = p; this.draw(); }
      else { const a = this.a; this.a = null; this.finish(a, p); }
    });
  }
  q<T extends HTMLElement = HTMLElement>(c: string) { return this.root.querySelector(c) as T; }
  private at(e: PointerEvent): [number, number] {
    const cv = this.q<HTMLCanvasElement>('.mg-canvas'), r = cv.getBoundingClientRect(), w = this.img?.w ?? 1, h = this.img?.h ?? 1;
    return [Math.max(0, Math.min(w, ((e.clientX - r.left) / r.width) * w)), Math.max(0, Math.min(h, ((e.clientY - r.top) / r.height) * h))];
  }
  err(m: string) { const e = this.q('.mg-err'); e.textContent = m; e.hidden = !m; }
  setMode(m: 'none' | 'scale' | 'area') {
    this.mode = m; this.a = null;
    this.q('.mg-draw').textContent = m === 'scale' ? 'Tap both ends of the scale bar…' : 'Draw on the scale bar';
    this.q('.mg-area').textContent = m === 'area' ? 'Tap two opposite corners…' : 'Set the area to analyse';
    this.q('.mg-canvas').style.touchAction = m === 'none' ? '' : 'none';
    this.draw();
  }
  private finish(a: [number, number], b: [number, number]) {
    if (this.mode === 'scale') {
      this.line = [a[0], a[1], b[0], b[1]];
      const L = Math.hypot(b[0] - a[0], b[1] - a[1]);
      this.q<HTMLInputElement>('.mg-bpx').value = String(Math.round(L * 10) / 10);
      this.q<HTMLInputElement>('.mg-pix').value = '';
      this.setMode('none'); this.calText();
      if (!this.q<HTMLInputElement>('.mg-blen').value) this.q<HTMLInputElement>('.mg-blen').focus();
      (this.o.cal ?? this.o.change)(); return;
    }
    if (Math.abs(b[0] - a[0]) < 8 || Math.abs(b[1] - a[1]) < 8) { this.err('That area is too small; tap two corners further apart.'); this.setMode('none'); return; }
    this.rect = { x0: Math.round(Math.min(a[0], b[0])), y0: Math.round(Math.min(a[1], b[1])), x1: Math.round(Math.max(a[0], b[0])), y1: Math.round(Math.max(a[1], b[1])) };
    this.err(''); this.setMode('none'); this.o.change();
  }
  /** Loads an image (RGBA). rect is the area to analyse (the whole image if left out). */
  load(img: Img, name: string, scale = 1, note = '', rect?: Rect) {
    this.img = img; this.name = name; this.scale = scale; this.grey = greyFromRgba(img.rgba, img.w, img.h);
    this.rect = rect ?? { x0: 0, y0: 0, x1: img.w, y1: img.h }; this.line = null;
    const b = document.createElement('canvas'); b.width = img.w; b.height = img.h;
    b.getContext('2d')!.putImageData(new ImageData(new Uint8ClampedArray(img.rgba), img.w, img.h), 0, 0); this.base = b;
    this.q('.mg-canvas').hidden = false; this.q('.mg-cal').hidden = false;
    this.q('.mg-note').textContent = `${name}: ${img.w} × ${img.h} px. ${note} The image is read on this page only and is never uploaded.`.replace(/\s+/g, ' ');
    this.err(''); this.setMode('none'); this.calText();
    this.o.change();
  }
  /** Micrometres per shown pixel, or NaN when the calibration is missing or wrong. */
  umpp(): number {
    const unit = this.q<HTMLSelectElement>('.mg-unit').value, pix = Number(this.q<HTMLInputElement>('.mg-pix').value);
    if (this.q<HTMLInputElement>('.mg-pix').value.trim() && pix > 0) return (pix * (UNITS[unit] ?? NaN)) / this.scale;
    const bpx = Number(this.q<HTMLInputElement>('.mg-bpx').value), len = Number(this.q<HTMLInputElement>('.mg-blen').value);
    return bpx > 0 && len > 0 ? umPerPx(bpx, len, unit) : NaN;
  }
  calText() {
    const u = this.umpp(), el = this.q('.mg-calout');
    el.textContent = Number.isFinite(u) ? `1 pixel = ${fmtLen(u, 4)} (${+(1 / u).toPrecision(4)} pixels per µm)` : 'Not calibrated yet: draw on the scale bar and type its length, or type the pixel size. Results are in pixels until then.';
    el.classList.toggle('mg-warn', !Number.isFinite(u));
  }
  /** Redraws the image with the area, the scale line and the tool's own marks. */
  draw() {
    if (!this.img || !this.base) return;
    const cv = this.q<HTMLCanvasElement>('.mg-canvas'), { w, h } = this.img;
    if (cv.width !== w || cv.height !== h) { cv.width = w; cv.height = h; }
    const ctx = cv.getContext('2d')!; ctx.drawImage(this.base, 0, 0);
    const lw = Math.max(1.5, Math.max(w, h) / 450);
    this.o.overlay?.(ctx, lw);
    const R = this.rect;
    if (R.x0 > 0 || R.y0 > 0 || R.x1 < w || R.y1 < h) {
      ctx.fillStyle = 'rgba(0,0,0,0.45)'; ctx.fillRect(0, 0, w, R.y0); ctx.fillRect(0, R.y1, w, h - R.y1); ctx.fillRect(0, R.y0, R.x0, R.y1 - R.y0); ctx.fillRect(R.x1, R.y0, w - R.x1, R.y1 - R.y0);
      ctx.strokeStyle = '#E69F00'; ctx.lineWidth = lw; ctx.setLineDash([lw * 4, lw * 3]); ctx.strokeRect(R.x0, R.y0, R.x1 - R.x0, R.y1 - R.y0); ctx.setLineDash([]);
    }
    if (this.line) {
      const [x0, y0, x1, y1] = this.line; ctx.strokeStyle = '#E69F00'; ctx.lineWidth = lw * 1.5;
      ctx.beginPath(); ctx.moveTo(x0, y0); ctx.lineTo(x1, y1); ctx.stroke();
      for (const [x, y] of [[x0, y0], [x1, y1]]) { ctx.beginPath(); ctx.arc(x, y, lw * 3, 0, 2 * Math.PI); ctx.stroke(); }
    }
    if (this.a) { ctx.fillStyle = '#E69F00'; ctx.beginPath(); ctx.arc(this.a[0], this.a[1], lw * 4, 0, 2 * Math.PI); ctx.fill(); }
  }
}
