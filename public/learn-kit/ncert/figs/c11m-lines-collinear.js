// Class 11 Maths, Straight Lines: three points A, B, C are collinear (lie on one line) exactly when the slope of AB
// equals the slope of BC. Drag the points. The lines AB and BC are drawn; when the slopes match, they coincide.
import { canvas, axes, line, dot, text, title, readout, touchGuard } from '../../kit.js';

export default function (host) {
  let P = [[-3, -2], [0, 1], [4, 5]], g, drag = -1;
  const cv = canvas(host, { aspect: 0.85, max: 440, min: 280, label: 'Three draggable points and the slopes of AB and BC to test whether they are collinear' });
  const out = readout(host);
  const sl = (p, q) => (Math.abs(q[0] - p[0]) < 1e-9 ? Infinity : (q[1] - p[1]) / (q[0] - p[0]));
  const re = () => { cv.redraw(); const a = sl(P[0], P[1]), b = sl(P[1], P[2]), f = (v) => (v === Infinity ? '∞' : v.toFixed(2)); out.innerHTML = `slope AB = ${f(a)}, slope BC = ${f(b)}: ${Math.abs(a - b) < 1e-9 || (a === Infinity && b === Infinity) ? '<b>equal, so A, B, C are collinear.</b>' : '<b>different, so A, B, C are not on one line</b> (they form a triangle).'}`; };
  cv.draw = (ctx, w, h, col) => {
    const top = title(ctx, 'Collinear points: slope AB = slope BC', col); g = axes(ctx, w, h, col, { x: [-6, 6], y: [-6, 6], l: 26, b: 22, t: top + 4, r: 10, xt: [-6, -3, 0, 3, 6], yt: [-6, -3, 0, 3, 6] });
    const ext = (p, q, c) => { const dx = q[0] - p[0], dy = q[1] - p[1], L = 20 / Math.hypot(dx, dy || 1e-9); line(ctx, [[g.X(p[0] - dx * L), g.Y(p[1] - dy * L)], [g.X(p[0] + dx * L), g.Y(p[1] + dy * L)]], c, 2); };
    ctx.save(); g.clip(); ctx.globalAlpha = 0.7; ext(P[0], P[1], col.s[0]); ext(P[1], P[2], col.s[1]); ctx.globalAlpha = 1; ctx.restore();
    P.forEach((p, i) => { dot(ctx, g.X(p[0]), g.Y(p[1]), 8, col.s[2], col.panel); text(ctx, 'ABC'[i], g.X(p[0]) + 12, g.Y(p[1]) - 10, { color: col.ink, size: 12, weight: 700 }); });
  };
  const near = (x, y) => g ? P.findIndex((p) => Math.hypot(x - g.X(p[0]), y - g.Y(p[1])) < 24) : -1;
  const toXY = (e) => { const r = cv.c.getBoundingClientRect(); return [Math.round(Math.max(-6, Math.min(6, -6 + (e.clientX - r.left - g.L) / (g.R - g.L) * 12))), Math.round(Math.max(-6, Math.min(6, 6 - (e.clientY - r.top - g.T) / (g.B - g.T) * 12)))]; };
  cv.c.addEventListener('pointerdown', (e) => { const r = cv.c.getBoundingClientRect(); drag = near(e.clientX - r.left, e.clientY - r.top); if (drag >= 0) cv.c.setPointerCapture(e.pointerId); });
  cv.c.addEventListener('pointermove', (e) => { if (drag >= 0) { P[drag] = toXY(e); re(); } });
  cv.c.addEventListener('pointerup', () => (drag = -1));
  touchGuard(cv.c, (x, y) => near(x, y) >= 0);
  re();
}
