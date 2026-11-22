// Shared helpers for the Class 9 "Two Variables, One Line" figures (not a figure itself): coordinate plane, line clipping, dragging.
import { text, dot } from '../../kit.js';

export const note = (ctx, str, w, h, col) => {
  const max = Math.max(24, Math.floor((w - 20) / 6.4)), ls = []; let cur = '';
  str.split(' ').forEach((wd) => { if ((cur + ' ' + wd).trim().length > max) { ls.push(cur); cur = wd; } else cur = (cur + ' ' + wd).trim(); });
  ls.push(cur);
  ls.forEach((l, i) => text(ctx, l, w / 2, h - 12 - (ls.length - 1 - i) * 15, { color: col.ink, size: 11.5, weight: 600, align: 'center' }));
};
/** A coordinate plane that fits below a title: x from x0 to x1, y from y0 to y1 (equal scale on both axes). */
export const plane = (w, h, top, x0, x1, y0, y1, bottom = 14) => {
  const s = Math.min((w - 24) / (x1 - x0), (h - top - bottom) / (y1 - y0)), ox = (w - s * (x1 - x0)) / 2, oy = h - bottom;
  return { s, x0, x1, y0, y1, ox, oy, X: (x) => ox + (x - x0) * s, Y: (y) => oy - (y - y0) * s, wx: (px) => (px - ox) / s + x0, wy: (py) => (oy - py) / s + y0 };
};
/** Grid, axes with arrows, tick numbers and axis names. */
export const drawPlane = (ctx, v, col) => {
  ctx.strokeStyle = col.line; ctx.lineWidth = 1;
  for (let i = Math.ceil(v.x0); i <= v.x1; i++) { ctx.beginPath(); ctx.moveTo(v.X(i), v.Y(v.y0)); ctx.lineTo(v.X(i), v.Y(v.y1)); ctx.stroke(); }
  for (let j = Math.ceil(v.y0); j <= v.y1; j++) { ctx.beginPath(); ctx.moveTo(v.X(v.x0), v.Y(j)); ctx.lineTo(v.X(v.x1), v.Y(j)); ctx.stroke(); }
  ctx.strokeStyle = col.ink; ctx.lineWidth = 1.6;
  ctx.beginPath(); ctx.moveTo(v.X(v.x0), v.Y(0)); ctx.lineTo(v.X(v.x1), v.Y(0)); ctx.moveTo(v.X(0), v.Y(v.y0)); ctx.lineTo(v.X(0), v.Y(v.y1)); ctx.stroke();
  const step = v.s < 22 ? 2 : 1;
  for (let i = Math.ceil(v.x0); i <= v.x1; i++) if (i && i % step === 0) text(ctx, String(i), v.X(i), v.Y(0) + 9, { color: col.muted, size: 10, align: 'center' });
  for (let j = Math.ceil(v.y0); j <= v.y1; j++) if (j && j % step === 0) text(ctx, String(j), v.X(0) - 8, v.Y(j), { color: col.muted, size: 10, align: 'right' });
  text(ctx, 'x', v.X(v.x1) - 4, v.Y(0) - 10, { color: col.ink, size: 12, weight: 700 }); text(ctx, 'y', v.X(0) + 8, v.Y(v.y1) + 6, { color: col.ink, size: 12, weight: 700 });
};
/** The part of the line a x + b y = c inside the plane, as two world points (or null). */
export const clipLine = (v, a, b, c) => {
  const P = [];
  if (b !== 0) { [v.x0, v.x1].forEach((x) => { const y = (c - a * x) / b; if (y >= v.y0 - 1e-9 && y <= v.y1 + 1e-9) P.push([x, y]); }); }
  if (a !== 0) { [v.y0, v.y1].forEach((y) => { const x = (c - b * y) / a; if (x >= v.x0 - 1e-9 && x <= v.x1 + 1e-9 && !P.some((p) => Math.abs(p[0] - x) < 1e-9 && Math.abs(p[1] - y) < 1e-9)) P.push([x, y]); }); }
  return P.length >= 2 ? [P[0], P[1]] : null;
};
export const drawLine = (ctx, v, a, b, c, color, lw = 3, dash) => {
  const seg = clipLine(v, a, b, c); if (!seg) return;
  ctx.strokeStyle = color; ctx.lineWidth = lw; ctx.setLineDash(dash || []); ctx.beginPath(); ctx.moveTo(v.X(seg[0][0]), v.Y(seg[0][1])); ctx.lineTo(v.X(seg[1][0]), v.Y(seg[1][1])); ctx.stroke(); ctx.setLineDash([]);
};
/** Equation text for a x + b y = c, e.g. "2x + y = 6" or "x − 3y = 4". */
export const eqn = (a, b, c) => {
  const term = (k, v, first) => { if (k === 0) return ''; const s = k < 0 ? '−' : first ? '' : '+', m = Math.abs(k) === 1 ? '' : String(Math.abs(k)); return (first ? (k < 0 ? '−' : '') : ' ' + s + ' ') + m + v; };
  const l = term(a, 'x', true) + term(b, 'y', a === 0);
  return (l || '0') + ' = ' + c;
};
export const pt = (ctx, v, x, y, color, r = 5, ring) => dot(ctx, v.X(x), v.Y(y), r, color, ring);
/** Draggable points, snapped to `snap` and kept inside the plane. */
export function dragger(cv, pts, getView, { snap = 1, radius = 1, onmove } = {}) {
  cv.c.style.touchAction = 'none'; cv.c.style.cursor = 'grab';
  let d = -1;
  const pos = (e) => { const r = cv.c.getBoundingClientRect(), v = getView(); return [v.wx(e.clientX - r.left), v.wy(e.clientY - r.top)]; };
  cv.c.addEventListener('pointerdown', (e) => {
    const [x, y] = pos(e); let best = -1, bd = radius;
    pts.forEach((p, i) => { const q = Math.hypot(p[0] - x, p[1] - y); if (q < bd) { bd = q; best = i; } });
    if (best >= 0) { d = best; cv.c.setPointerCapture(e.pointerId); cv.c.style.cursor = 'grabbing'; e.preventDefault(); }
  });
  cv.c.addEventListener('pointermove', (e) => {
    if (d < 0) return; const [x, y] = pos(e), v = getView();
    pts[d] = [Math.min(v.x1, Math.max(v.x0, Math.round(x / snap) * snap)), Math.min(v.y1, Math.max(v.y0, Math.round(y / snap) * snap))];
    onmove && onmove(d);
  });
  const end = () => { d = -1; cv.c.style.cursor = 'grab'; cv.redraw(); };
  cv.c.addEventListener('pointerup', end); cv.c.addEventListener('pointercancel', end);
  return { get active() { return d; } };
}
export default function () {}
