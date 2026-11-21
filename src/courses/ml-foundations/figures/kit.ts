// Shared canvas kit for the ML foundations simulations: a sharp, phone-first plot with axes and a fibub.com
// watermark, theme-aware colours (light, dark, red night mode), pointer dragging, and redraws on resize or
// theme change. Each figure's <script> imports from here and keeps only its own idea.
import { pagePalette } from '../../../lib/report';
import type { Palette } from '../../../lib/report';
export type { Palette };

export type PlotOpts = {
  x: [number, number]; y: [number, number];
  /** CSS pixel height (width follows the box). */
  h?: number;
  xLabel?: string; yLabel?: string;
  /** Hide axes and grid (for diagrams). */
  bare?: boolean;
  /** Keep 1 unit on x the same length as 1 unit on y (for vectors and angles). */
  equal?: boolean;
  /** Hide the numbers on the x-axis (for bar charts of categories). */
  noXTicks?: boolean;
  /** Hide the numbers and grid on the y-axis (for points along a single line). */
  noYTicks?: boolean;
};
type Style = { color?: string; width?: number; dash?: number[]; alpha?: number; fill?: string };

/** Round tick steps (1, 2 or 5 times a power of ten). */
export function ticks(lo: number, hi: number, n = 5) {
  const raw = (hi - lo) / n, p = 10 ** Math.floor(Math.log10(raw)), f = raw / p;
  const step = (f < 1.5 ? 1 : f < 3 ? 2 : f < 7 ? 5 : 10) * p;
  const out: number[] = [];
  for (let t = Math.ceil(lo / step - 1e-9) * step; t <= hi + 1e-9; t += step) out.push(Math.abs(t) < step * 1e-9 ? 0 : t);
  return out;
}
/** A number for a label: no long decimals. */
export const fmt = (x: number, d = 2) => {
  if (!Number.isFinite(x)) return '–';
  const s = Math.abs(x) >= 1000 ? Math.round(x).toLocaleString('en') : (+x.toFixed(d)).toString();
  return s.replace('-', '−');
};

export class Plot {
  cv: HTMLCanvasElement; ctx!: CanvasRenderingContext2D; pal!: Palette;
  W = 0; H = 0; o: PlotOpts;
  L = 44; R = 12; T = 12; B = 34;
  constructor(cv: HTMLCanvasElement, o: PlotOpts) {
    this.cv = cv; this.o = o;
    if (o.bare) { this.L = 8; this.R = 8; this.T = 8; this.B = 8; }
  }
  get x0() { return this.o.x[0]; } get x1() { return this.o.x[1]; }
  get y0() { return this.o.y[0]; } get y1() { return this.o.y[1]; }
  /** Data to screen. */
  px(x: number) { return this.L + ((x - this.x0) / (this.x1 - this.x0)) * (this.W - this.L - this.R); }
  py(y: number) { return this.H - this.B - ((y - this.y0) / (this.y1 - this.y0)) * (this.H - this.T - this.B); }
  /** Screen to data. */
  ix(px: number) { return this.x0 + ((px - this.L) / (this.W - this.L - this.R)) * (this.x1 - this.x0); }
  iy(py: number) { return this.y0 + ((this.H - this.B - py) / (this.H - this.T - this.B)) * (this.y1 - this.y0); }

  /** Size the canvas to its box, paint the background, grid and axes. Call first on every redraw. */
  begin() {
    const cv = this.cv, dpr = Math.min(3, window.devicePixelRatio || 1);
    const W = Math.max(240, cv.clientWidth || 340);
    let H = this.o.h ?? 260;
    if (this.o.equal) {
      // Stretch the y range so units are square, keeping the y centre.
      const sx = (W - this.L - this.R) / (this.o.x[1] - this.o.x[0]);
      const span = (H - this.T - this.B) / sx, mid = (this.o.y[0] + this.o.y[1]) / 2;
      this.o.y = [mid - span / 2, mid + span / 2];
    }
    if (cv.width !== Math.round(W * dpr) || cv.height !== Math.round(H * dpr)) { cv.width = Math.round(W * dpr); cv.height = Math.round(H * dpr); cv.style.height = H + 'px'; }
    this.W = W; this.H = H; this.pal = pagePalette();
    const c = (this.ctx = cv.getContext('2d')!);
    c.setTransform(dpr, 0, 0, dpr, 0, 0);
    c.fillStyle = this.pal.bg; c.fillRect(0, 0, W, H);
    c.font = '12px system-ui, -apple-system, "Segoe UI", Roboto, sans-serif';
    if (this.o.bare) return this;
    const xt = ticks(this.x0, this.x1, W < 400 ? 4 : 6), yt = this.o.noYTicks ? [] : ticks(this.y0, this.y1, 5);
    // Room on the left for the widest y tick label (and the y-axis title).
    this.L = Math.ceil(Math.max(30, ...yt.map((t) => c.measureText(fmt(t)).width)) + 10 + (this.o.yLabel ? 16 : 0));
    c.lineWidth = 1; c.strokeStyle = this.pal.grid;
    if (!this.o.noXTicks) for (const t of xt) { const x = Math.round(this.px(t)) + 0.5; c.beginPath(); c.moveTo(x, this.T); c.lineTo(x, H - this.B); c.stroke(); }
    for (const t of yt) { const y = Math.round(this.py(t)) + 0.5; c.beginPath(); c.moveTo(this.L, y); c.lineTo(W - this.R, y); c.stroke(); }
    c.strokeStyle = this.pal.line;
    c.beginPath(); c.moveTo(this.L + 0.5, this.T); c.lineTo(this.L + 0.5, H - this.B + 0.5); c.lineTo(W - this.R, H - this.B + 0.5); c.stroke();
    c.fillStyle = this.pal.muted; c.textAlign = 'center'; c.textBaseline = 'top';
    if (!this.o.noXTicks) for (const t of xt) c.fillText(fmt(t), this.px(t), H - this.B + 4);
    c.textAlign = 'right'; c.textBaseline = 'middle';
    for (const t of yt) c.fillText(fmt(t), this.L - 5, this.py(t));
    if (this.o.xLabel) { c.textAlign = 'right'; c.textBaseline = 'bottom'; c.fillText(this.o.xLabel, W - this.R, H - 1); }
    if (this.o.yLabel) { c.save(); c.translate(11, this.T); c.rotate(-Math.PI / 2); c.textAlign = 'right'; c.textBaseline = 'middle'; c.fillText(this.o.yLabel, 0, 0); c.restore(); }
    return this;
  }
  /** The fibub.com mark at 50 % in the bottom-right corner, inside the plot but clear of the axis labels. Call last. */
  end() {
    const c = this.ctx; c.save(); c.globalAlpha = 0.5; c.fillStyle = this.pal.muted;
    c.font = '11px system-ui, -apple-system, "Segoe UI", Roboto, sans-serif'; c.textAlign = 'right'; c.textBaseline = 'bottom';
    c.fillText('fibub.com', this.W - this.R - 4, this.H - this.B - 3); c.restore();
    return this;
  }
  private st(s: Style, def: string) {
    const c = this.ctx; c.strokeStyle = s.color ?? def; c.lineWidth = s.width ?? 2; c.setLineDash(s.dash ?? []); c.globalAlpha = s.alpha ?? 1;
  }
  line(x1: number, y1: number, x2: number, y2: number, s: Style = {}) {
    const c = this.ctx; this.st(s, this.pal.ink);
    c.beginPath(); c.moveTo(this.px(x1), this.py(y1)); c.lineTo(this.px(x2), this.py(y2)); c.stroke();
    c.setLineDash([]); c.globalAlpha = 1; return this;
  }
  /** A curve y = f(x) across the plot (or from..to), clipped to the plot area. */
  fn(f: (x: number) => number, s: Style & { from?: number; to?: number } = {}) {
    const c = this.ctx; this.st(s, this.pal.accent);
    c.save(); c.beginPath(); c.rect(this.L, this.T, this.W - this.L - this.R, this.H - this.T - this.B); c.clip();
    c.beginPath();
    const a = s.from ?? this.x0, b = s.to ?? this.x1, n = Math.max(40, Math.round(this.W / 2));
    let pen = false;
    for (let i = 0; i <= n; i++) {
      const x = a + ((b - a) * i) / n, y = f(x);
      if (!Number.isFinite(y)) { pen = false; continue; }
      const Y = Math.max(-1e4, Math.min(1e4, this.py(y)));
      if (pen) c.lineTo(this.px(x), Y); else { c.moveTo(this.px(x), Y); pen = true; }
    }
    c.stroke(); c.restore(); c.setLineDash([]); c.globalAlpha = 1; return this;
  }
  /** A line through points in data units (not closed, not filled). */
  path(pts: [number, number][], s: Style = {}) {
    const c = this.ctx; this.st(s, this.pal.accent); c.beginPath();
    pts.forEach(([x, y], i) => (i ? c.lineTo(this.px(x), this.py(y)) : c.moveTo(this.px(x), this.py(y))));
    c.stroke(); c.setLineDash([]); c.globalAlpha = 1; return this;
  }
  /** A filled polygon in data units. */
  poly(pts: [number, number][], s: Style = {}) {
    const c = this.ctx; c.globalAlpha = s.alpha ?? 0.2; c.fillStyle = s.fill ?? s.color ?? this.pal.accent;
    c.beginPath(); pts.forEach(([x, y], i) => (i ? c.lineTo(this.px(x), this.py(y)) : c.moveTo(this.px(x), this.py(y)))); c.closePath(); c.fill();
    c.globalAlpha = 1; return this;
  }
  /** A rectangle in data units (x, y is the bottom-left corner). */
  rect(x: number, y: number, w: number, h: number, s: Style = {}) {
    const c = this.ctx, X = this.px(x), Y = this.py(y + h), Wd = this.px(x + w) - X, Hd = this.py(y) - Y;
    if (s.fill) { c.globalAlpha = s.alpha ?? 1; c.fillStyle = s.fill; c.fillRect(X, Y, Wd, Hd); c.globalAlpha = 1; }
    if (s.color) { this.st({ ...s, alpha: 1 }, s.color); c.strokeRect(X, Y, Wd, Hd); c.setLineDash([]); }
    return this;
  }
  /** A point. shape 'square' is the second class, so classes differ by shape as well as colour. */
  dot(x: number, y: number, s: { color?: string; r?: number; shape?: 'circle' | 'square' | 'ring' | 'cross'; alpha?: number } = {}) {
    const c = this.ctx, X = this.px(x), Y = this.py(y), r = s.r ?? 5;
    c.globalAlpha = s.alpha ?? 1; c.fillStyle = c.strokeStyle = s.color ?? this.pal.accent; c.lineWidth = 2; c.setLineDash([]);
    c.beginPath();
    if (s.shape === 'square') c.rect(X - r * 0.9, Y - r * 0.9, r * 1.8, r * 1.8);
    else if (s.shape === 'cross') { c.moveTo(X - r, Y - r); c.lineTo(X + r, Y + r); c.moveTo(X + r, Y - r); c.lineTo(X - r, Y + r); c.stroke(); c.globalAlpha = 1; return this; }
    else c.arc(X, Y, r, 0, 2 * Math.PI);
    if (s.shape === 'ring') c.stroke(); else { c.fill(); c.strokeStyle = this.pal.bg; c.lineWidth = 1; c.stroke(); }
    c.globalAlpha = 1; return this;
  }
  /** An arrow from (x1, y1) to (x2, y2) in data units. */
  arrow(x1: number, y1: number, x2: number, y2: number, s: Style = {}) {
    const c = this.ctx; this.line(x1, y1, x2, y2, s);
    const X = this.px(x2), Y = this.py(y2), a = Math.atan2(Y - this.py(y1), X - this.px(x1)), k = 10;
    c.fillStyle = s.color ?? this.pal.ink; c.beginPath(); c.moveTo(X, Y);
    c.lineTo(X - k * Math.cos(a - 0.4), Y - k * Math.sin(a - 0.4)); c.lineTo(X - k * Math.cos(a + 0.4), Y - k * Math.sin(a + 0.4)); c.closePath(); c.fill();
    return this;
  }
  /** Text at a data point; dx, dy shift it in screen pixels. */
  text(x: number, y: number, t: string, s: { color?: string; align?: CanvasTextAlign; base?: CanvasTextBaseline; dx?: number; dy?: number; bold?: boolean; size?: number } = {}) {
    const c = this.ctx; c.fillStyle = s.color ?? this.pal.ink; c.textAlign = s.align ?? 'left'; c.textBaseline = s.base ?? 'middle';
    c.font = `${s.bold ? '600 ' : ''}${s.size ?? 12.5}px system-ui, -apple-system, "Segoe UI", Roboto, sans-serif`;
    c.fillText(t, this.px(x) + (s.dx ?? 0), this.py(y) + (s.dy ?? 0)); return this;
  }
}

/** Run draw() now, when the box changes size, and when the light/dark/red switch changes. */
export function live(cv: HTMLElement, draw: () => void) {
  let raf = 0;
  const go = () => { cancelAnimationFrame(raf); raf = requestAnimationFrame(draw); };
  new ResizeObserver(go).observe(cv);
  new MutationObserver(go).observe(document.documentElement, { attributes: true, attributeFilter: ['class', 'data-theme'] });
  draw();
  return go;
}

/**
 * Let the reader drag points on a plot. pts() gives the draggable points in data units; move(i, x, y) is
 * called with the new position (clamp it there). Works with mouse, pen and touch; the page still scrolls
 * when a touch starts away from a point.
 */
export function drag(p: Plot, pts: () => [number, number][], move: (i: number, x: number, y: number) => void, radius = 22) {
  const cv = p.cv; let on = -1;
  const at = (e: PointerEvent) => { const b = cv.getBoundingClientRect(); return [e.clientX - b.left, e.clientY - b.top]; };
  const near = (X: number, Y: number) => {
    let best = -1, bd = radius * radius;
    pts().forEach(([x, y], i) => { const d = (p.px(x) - X) ** 2 + (p.py(y) - Y) ** 2; if (d < bd) { bd = d; best = i; } });
    return best;
  };
  cv.style.touchAction = 'pan-y';
  cv.addEventListener('pointerdown', (e) => {
    const [X, Y] = at(e); on = near(X, Y);
    if (on >= 0) { cv.setPointerCapture(e.pointerId); e.preventDefault(); cv.style.touchAction = 'none'; }
  });
  cv.addEventListener('pointermove', (e) => {
    const [X, Y] = at(e);
    if (on < 0) { cv.style.cursor = near(X, Y) >= 0 ? 'grab' : ''; return; }
    move(on, p.ix(X), p.iy(Y));
  });
  const stop = () => { on = -1; cv.style.touchAction = 'pan-y'; };
  cv.addEventListener('pointerup', stop); cv.addEventListener('pointercancel', stop);
}

/** Wire a range input to a <output> or [data-v] span and a callback; returns a getter. */
export function slider(root: HTMLElement, name: string, cb: () => void, show = (v: number) => fmt(v)) {
  const el = root.querySelector<HTMLInputElement>(`input[name="${name}"]`)!;
  const out = root.querySelector<HTMLElement>(`[data-v="${name}"]`);
  const upd = () => { if (out) out.textContent = show(Number(el.value)); cb(); };
  el.addEventListener('input', upd);
  if (out) out.textContent = show(Number(el.value));
  return () => Number(el.value);
}

/** Colours for two classes that stay apart in light and dark mode (shape tells them apart in red mode). */
export const classColour = (pal: Palette, k: number) => (k ? pal.accent2 : pal.accent);

/**
 * Shade the plot by a classifier's probability of class 1: the second class colour where p > 0.5, the first
 * where p < 0.5, stronger the surer it is. f gets data coordinates. Draw before the points.
 */
export function shade(p: Plot, f: (x: number, y: number) => number, cells = 60, strength = 0.35) {
  const nx = cells, ny = Math.max(10, Math.round((cells * (p.H - p.T - p.B)) / (p.W - p.L - p.R)));
  const dx = (p.x1 - p.x0) / nx, dy = (p.y1 - p.y0) / ny;
  for (let i = 0; i < nx; i++) for (let j = 0; j < ny; j++) {
    const v = f(p.x0 + (i + 0.5) * dx, p.y0 + (j + 0.5) * dy);
    if (!Number.isFinite(v)) continue;
    p.rect(p.x0 + i * dx, p.y0 + j * dy, dx * 1.03, dy * 1.03, { fill: classColour(p.pal, v > 0.5 ? 1 : 0), alpha: strength * Math.abs(v - 0.5) * 2 });
  }
}

/** Two-class toy datasets in the square −1..1: blobs, a ring, an XOR pattern and two moons. */
export function toy(kind: 'blobs' | 'ring' | 'xor' | 'moons', n: number, R: { normal: (m?: number, s?: number) => number; uniform: (a?: number, b?: number) => number; next: () => number }, noise = 0.12) {
  const X: number[][] = [], y: number[] = [];
  for (let i = 0; i < n; i++) {
    const k = i % 2; let a: number, b: number;
    if (kind === 'blobs') { a = R.normal(k ? 0.35 : -0.35, 0.28); b = R.normal(k ? 0.3 : -0.3, 0.28); }
    else if (kind === 'ring') { const t = R.uniform(0, 2 * Math.PI), r = k ? R.uniform(0.55, 0.9) : R.uniform(0, 0.35); a = r * Math.cos(t); b = r * Math.sin(t); }
    else if (kind === 'xor') { const sx = R.next() < 0.5 ? -1 : 1, sy = k ? -sx : sx; a = sx * R.uniform(0.1, 0.9); b = sy * R.uniform(0.1, 0.9); }
    else { const t = R.uniform(0, Math.PI); a = k ? 0.5 - Math.cos(t) * 0.7 - 0.25 : Math.cos(t) * 0.7 - 0.25; b = k ? 0.15 - Math.sin(t) * 0.6 + 0.1 : Math.sin(t) * 0.6 - 0.25; }
    X.push([a + R.normal(0, noise), b + R.normal(0, noise)]); y.push(k);
  }
  return { X, y };
}
