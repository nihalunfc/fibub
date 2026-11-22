// Shared helpers for the Class 9 Quadrilaterals figures (not a figure itself): wrapped caption, grid view, draggable corners.
import { text, dot } from '../../kit.js';

/** Caption wrapped onto up to three lines at the bottom of the canvas. */
export const note = (ctx, str, w, h, col) => {
  const max = Math.max(24, Math.floor((w - 20) / 6.4)), ls = []; let cur = '';
  str.split(' ').forEach((wd) => { if ((cur + ' ' + wd).trim().length > max) { ls.push(cur); cur = wd; } else cur = (cur + ' ' + wd).trim(); });
  ls.push(cur);
  ls.forEach((l, i) => text(ctx, l, w / 2, h - 12 - (ls.length - 1 - i) * 15, { color: col.ink, size: 11.5, weight: 600, align: 'center' }));
};
/** A view of a GX by GY grid that fits the canvas below a title and above a bottom margin. */
export const view = (w, h, top, GX, GY, bottom = 14) => {
  const s = Math.min((w - 20) / GX, (h - top - bottom) / GY), ox = (w - s * GX) / 2, oy = h - bottom;
  return { s, ox, oy, GX, GY, X: (x) => ox + x * s, Y: (y) => oy - y * s };
};
export const grid = (ctx, v, col) => {
  ctx.strokeStyle = col.line; ctx.lineWidth = 1;
  for (let i = 0; i <= v.GX; i++) { ctx.beginPath(); ctx.moveTo(v.X(i), v.Y(0)); ctx.lineTo(v.X(i), v.Y(v.GY)); ctx.stroke(); }
  for (let j = 0; j <= v.GY; j++) { ctx.beginPath(); ctx.moveTo(v.X(0), v.Y(j)); ctx.lineTo(v.X(v.GX), v.Y(j)); ctx.stroke(); }
};
/** Draw a closed shape from world points. */
export const shape = (ctx, v, pts, fill, stroke, alpha = 0.25, lw = 3) => {
  ctx.beginPath(); pts.forEach((p, i) => (i ? ctx.lineTo(v.X(p[0]), v.Y(p[1])) : ctx.moveTo(v.X(p[0]), v.Y(p[1])))); ctx.closePath();
  if (fill) { ctx.fillStyle = fill; ctx.globalAlpha = alpha; ctx.fill(); ctx.globalAlpha = 1; }
  if (stroke) { ctx.strokeStyle = stroke; ctx.lineWidth = lw; ctx.lineJoin = 'round'; ctx.stroke(); }
};
export const seg = (ctx, v, p, q, color, lw = 2, dash) => {
  ctx.strokeStyle = color; ctx.lineWidth = lw; ctx.setLineDash(dash || []); ctx.beginPath(); ctx.moveTo(v.X(p[0]), v.Y(p[1])); ctx.lineTo(v.X(q[0]), v.Y(q[1])); ctx.stroke(); ctx.setLineDash([]);
};
/** Make the points in pts draggable on the grid (snapped to `snap`). getView() gives the latest view. */
export function dragger(cv, pts, getView, { snap = 1, radius = 1.6, onmove, lock } = {}) {
  cv.c.style.touchAction = 'none'; cv.c.style.cursor = 'grab';
  let d = -1;
  const pos = (e) => { const r = cv.c.getBoundingClientRect(), v = getView(); return [(e.clientX - r.left - v.ox) / v.s, (v.oy - (e.clientY - r.top)) / v.s]; };
  cv.c.addEventListener('pointerdown', (e) => {
    const [x, y] = pos(e); let best = -1, bd = radius;
    pts.forEach((p, i) => { if (lock && lock(i)) return; const q = Math.hypot(p[0] - x, p[1] - y); if (q < bd) { bd = q; best = i; } });
    if (best >= 0) { d = best; cv.c.setPointerCapture(e.pointerId); cv.c.style.cursor = 'grabbing'; e.preventDefault(); }
  });
  cv.c.addEventListener('pointermove', (e) => {
    if (d < 0) return; const [x, y] = pos(e), v = getView();
    pts[d] = [Math.min(v.GX, Math.max(0, Math.round(x / snap) * snap)), Math.min(v.GY, Math.max(0, Math.round(y / snap) * snap))];
    onmove && onmove(d);
  });
  const end = () => { d = -1; cv.c.style.cursor = 'grab'; cv.redraw(); };
  cv.c.addEventListener('pointerup', end); cv.c.addEventListener('pointercancel', end);
  return { get active() { return d; } };
}
export const handle = (ctx, v, p, col, active) => dot(ctx, v.X(p[0]), v.Y(p[1]), active ? 9 : 7, col.s[2], col.ink);
export const sub = (p, q) => [p[0] - q[0], p[1] - q[1]];
export const len = (p, q) => Math.hypot(p[0] - q[0], p[1] - q[1]);
export const cross = (a, b) => a[0] * b[1] - a[1] * b[0];
export const dotp = (a, b) => a[0] * b[0] + a[1] * b[1];
export const mid = (p, q) => [(p[0] + q[0]) / 2, (p[1] + q[1]) / 2];
/** Arc marking the (smaller) angle at p between the rays to q and r. */
export const wedge = (ctx, v, p, q, r, color, rad = 16, lw = 3) => {
  const a1 = Math.atan2(v.Y(q[1]) - v.Y(p[1]), v.X(q[0]) - v.X(p[0])), a2 = Math.atan2(v.Y(r[1]) - v.Y(p[1]), v.X(r[0]) - v.X(p[0]));
  let d = a2 - a1; while (d > Math.PI) d -= 2 * Math.PI; while (d < -Math.PI) d += 2 * Math.PI;
  ctx.strokeStyle = color; ctx.lineWidth = lw; ctx.beginPath(); ctx.arc(v.X(p[0]), v.Y(p[1]), rad, a1, a1 + d, d < 0); ctx.stroke();
};
export default function () {}
