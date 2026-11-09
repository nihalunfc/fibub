// Small graph-paper helpers for the school maths (Learn) tools: a view (world box to canvas pixels),
// grid and axes with tick numbers, and curves that lift the pen at jumps and gaps. Drawing only; the maths
// lives in src/lib/sci/. Colours come from the page palette (report.ts) so dark and red-night modes work.
import type { Palette } from './report';
import { niceTicks, tickLabel } from './sci/plot';

export type View = { x0: number; x1: number; y0: number; y1: number; W: number; H: number; l: number; r: number; t: number; b: number };
export const view = (x0: number, x1: number, y0: number, y1: number, W: number, H: number, pad = { l: 34, r: 10, t: 10, b: 24 }): View => ({ x0, x1, y0, y1, W, H, ...pad });
export const px = (v: View, x: number) => v.l + ((x - v.x0) / (v.x1 - v.x0)) * (v.W - v.l - v.r);
export const py = (v: View, y: number) => v.H - v.b - ((y - v.y0) / (v.y1 - v.y0)) * (v.H - v.t - v.b);
export const wx = (v: View, X: number) => v.x0 + ((X - v.l) / (v.W - v.l - v.r)) * (v.x1 - v.x0);
export const wy = (v: View, Y: number) => v.y0 + ((v.H - v.b - Y) / (v.H - v.t - v.b)) * (v.y1 - v.y0);
export const FONT = '12px system-ui, -apple-system, "Segoe UI", Roboto, sans-serif';

/** Grid lines, the x and y axes (where they are in view) and tick numbers. `xLabels` replaces the x numbers. */
export function axes(ctx: CanvasRenderingContext2D, v: View, pal: Palette, o: { xTicks?: number[]; xLabels?: string[]; yTicks?: number[]; xName?: string; yName?: string } = {}) {
  const xt = o.xTicks ?? niceTicks(v.x0, v.x1, Math.max(4, Math.round((v.W - v.l) / 70)));
  const yt = o.yTicks ?? niceTicks(v.y0, v.y1, Math.max(3, Math.round((v.H - v.b) / 50)));
  const xs = xt.length > 1 ? xt[1] - xt[0] : 1, ys = yt.length > 1 ? yt[1] - yt[0] : 1;
  ctx.save();
  ctx.beginPath(); ctx.rect(v.l, v.t, v.W - v.l - v.r, v.H - v.t - v.b); ctx.clip();
  ctx.strokeStyle = pal.grid; ctx.lineWidth = 1; ctx.beginPath();
  for (const x of xt) { const X = Math.round(px(v, x)) + 0.5; ctx.moveTo(X, v.t); ctx.lineTo(X, v.H - v.b); }
  for (const y of yt) { const Y = Math.round(py(v, y)) + 0.5; ctx.moveTo(v.l, Y); ctx.lineTo(v.W - v.r, Y); }
  ctx.stroke();
  ctx.strokeStyle = pal.muted; ctx.lineWidth = 1.2; ctx.beginPath();
  if (v.y0 <= 0 && v.y1 >= 0) { const Y = py(v, 0); ctx.moveTo(v.l, Y); ctx.lineTo(v.W - v.r, Y); }
  if (v.x0 <= 0 && v.x1 >= 0) { const X = px(v, 0); ctx.moveTo(X, v.t); ctx.lineTo(X, v.H - v.b); }
  ctx.stroke();
  ctx.restore();
  ctx.fillStyle = pal.muted; ctx.font = FONT; ctx.textAlign = 'center'; ctx.textBaseline = 'top';
  xt.forEach((x, i) => { const X = px(v, x); if (X >= v.l - 1 && X <= v.W - v.r + 1) ctx.fillText(o.xLabels?.[i] ?? tickLabel(x, xs), X, v.H - v.b + 5); });
  ctx.textAlign = 'right'; ctx.textBaseline = 'middle';
  for (const y of yt) { const Y = py(v, y); if (Y >= v.t - 1 && Y <= v.H - v.b + 1) ctx.fillText(tickLabel(y, ys), v.l - 4, Y); }
  ctx.textAlign = 'left'; ctx.textBaseline = 'top';
  if (o.yName) ctx.fillText(o.yName, v.l + 4, v.t + 2);
  if (o.xName) { ctx.textAlign = 'right'; ctx.textBaseline = 'bottom'; ctx.fillText(o.xName, v.W - v.r - 2, v.H - v.b - 3); }
}

/** Draw y = f(x) across the view, lifting the pen where f is not a number, leaves the box far, or jumps. */
export function curve(ctx: CanvasRenderingContext2D, v: View, f: (x: number) => number, color: string, width = 2, dash: number[] = [], from = v.x0, to = v.x1) {
  ctx.save();
  ctx.beginPath(); ctx.rect(v.l, v.t, v.W - v.l - v.r, v.H - v.t - v.b); ctx.clip();
  ctx.strokeStyle = color; ctx.lineWidth = width; ctx.setLineDash(dash); ctx.lineJoin = 'round';
  const n = Math.max(200, Math.round((v.W - v.l - v.r) * 2)), span = v.y1 - v.y0;
  ctx.beginPath();
  let pen = false, prev = NaN;
  for (let i = 0; i <= n; i++) {
    const x = from + ((to - from) * i) / n, y = f(x);
    if (!Number.isFinite(y) || Math.abs(y - (v.y0 + v.y1) / 2) > span * 50 || (pen && Math.abs(y - prev) > span * 0.8)) { pen = false; prev = NaN; if (!Number.isFinite(y)) continue; }
    const X = px(v, x), Y = py(v, y);
    if (pen) ctx.lineTo(X, Y); else { ctx.moveTo(X, Y); pen = true; }
    prev = y;
  }
  ctx.stroke();
  ctx.restore();
}

/** A straight segment in world coordinates, clipped to the plot box. */
export function line(ctx: CanvasRenderingContext2D, v: View, x1: number, y1: number, x2: number, y2: number, color: string, width = 1.5, dash: number[] = []) {
  ctx.save();
  ctx.beginPath(); ctx.rect(v.l, v.t, v.W - v.l - v.r, v.H - v.t - v.b); ctx.clip();
  ctx.strokeStyle = color; ctx.lineWidth = width; ctx.setLineDash(dash);
  ctx.beginPath(); ctx.moveTo(px(v, x1), py(v, y1)); ctx.lineTo(px(v, x2), py(v, y2)); ctx.stroke();
  ctx.restore();
}

/** A dot (filled, or open for a hole in a graph). */
export function dot(ctx: CanvasRenderingContext2D, v: View, x: number, y: number, color: string, r = 5, open = false, bg = '#fff') {
  const X = px(v, x), Y = py(v, y);
  if (X < v.l - r || X > v.W - v.r + r || Y < v.t - r || Y > v.H - v.b + r) return;
  ctx.beginPath(); ctx.arc(X, Y, r, 0, 2 * Math.PI);
  ctx.fillStyle = open ? bg : color; ctx.fill();
  ctx.lineWidth = 2; ctx.strokeStyle = color; ctx.stroke();
}

/** A text label in world coordinates, nudged by (dx, dy) pixels. */
export function label(ctx: CanvasRenderingContext2D, v: View, x: number, y: number, text: string, color: string, dx = 6, dy = -6, align: CanvasTextAlign = 'left') {
  ctx.font = FONT; ctx.fillStyle = color; ctx.textAlign = align; ctx.textBaseline = 'bottom';
  ctx.fillText(text, px(v, x) + dx, py(v, y) + dy);
}

/** Canvas pixel position of a pointer event, in the figure's own units (w × h). */
export function pointer(canvas: HTMLCanvasElement, e: PointerEvent, w: number, h: number) {
  const r = canvas.getBoundingClientRect();
  return { X: ((e.clientX - r.left) / r.width) * w, Y: ((e.clientY - r.top) / r.height) * h };
}

/** Make a number short and friendly: 3 decimals at most, no trailing zeros, a real minus sign. */
export const fmt = (x: number, d = 3) => {
  if (!Number.isFinite(x)) return x > 0 ? '∞' : x < 0 ? '−∞' : 'undefined';
  const s = (Math.abs(x) < 1e-12 ? 0 : x).toFixed(d).replace(/\.?0+$/, '');
  return (s === '-0' ? '0' : s).replace('-', '−');
};
