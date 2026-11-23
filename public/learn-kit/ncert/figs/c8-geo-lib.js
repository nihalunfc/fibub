// Shared helpers for the Class 8 symmetry figures (not a figure): shapes centred on their middle, turn, flip and compare.
const P = (n, a0 = 90) => Array.from({ length: n }, (_, i) => [Math.cos(((a0 + (360 / n) * i) * Math.PI) / 180), Math.sin(((a0 + (360 / n) * i) * Math.PI) / 180)]);
const pin = [];
for (let k = 0; k < 3; k++) { const a = (k * 2 * Math.PI) / 3, c = Math.cos(a), s = Math.sin(a); [[0.15, 0.05], [1, -0.12], [1, 0.38]].forEach(([x, y]) => pin.push([x * c - y * s, x * s + y * c])); }
const raw = {
  square: [[1, 1], [-1, 1], [-1, -1], [1, -1]].map(([x, y]) => [x * 0.9, y * 0.9]),
  rectangle: [[1.25, 0.7], [-1.25, 0.7], [-1.25, -0.7], [1.25, -0.7]],
  rhombus: [[1.2, 0], [0, 0.75], [-1.2, 0], [0, -0.75]],
  triangle: P(3),
  isosceles: [[0, 1.1], [-0.75, -0.7], [0.75, -0.7]],
  kite: [[0, 1.2], [0.75, 0.1], [0, -0.8], [-0.75, 0.1]],
  parallelogram: [[-1.2, -0.6], [0.6, -0.6], [1.2, 0.6], [-0.6, 0.6]],
  pentagon: P(5), hexagon: P(6, 0), pinwheel: pin,
};
export const NAMES = { square: 'Square', rectangle: 'Rectangle', rhombus: 'Rhombus', triangle: 'Equilateral triangle', isosceles: 'Isosceles triangle', kite: 'Kite', parallelogram: 'Parallelogram', pentagon: 'Regular pentagon', hexagon: 'Regular hexagon', pinwheel: 'Pinwheel' };
export const SHAPES = Object.fromEntries(Object.entries(raw).map(([k, v]) => { const cx = v.reduce((a, p) => a + p[0], 0) / v.length, cy = v.reduce((a, p) => a + p[1], 0) / v.length; return [k, v.map(([x, y]) => [x - cx, y - cy])]; }));
export const turn = (pts, deg) => { const a = (deg * Math.PI) / 180, c = Math.cos(a), s = Math.sin(a); return pts.map(([x, y]) => [x * c - y * s, x * s + y * c]); };
export const flip = (pts, deg) => { const a = (2 * deg * Math.PI) / 180, c = Math.cos(a), s = Math.sin(a); return pts.map(([x, y]) => [x * c + y * s, x * s - y * c]); };
export const same = (A, B, tol = 0.03) => A.every((p) => B.some((q) => Math.hypot(p[0] - q[0], p[1] - q[1]) < tol)) && B.every((q) => A.some((p) => Math.hypot(p[0] - q[0], p[1] - q[1]) < tol));
/** Angles (whole degrees, 0 to 179) of the lines of symmetry through the middle. */
export const lines = (pts) => { const r = []; for (let d = 0; d < 180; d++) if (same(pts, flip(pts, d))) r.push(d); return r; };
/** Turning angles (1 to 360) that bring the shape back onto itself. */
export const turns = (pts) => { const r = []; for (let d = 1; d <= 360; d++) if (same(pts, turn(pts, d))) r.push(d); return r; };
export function poly(ctx, pts, cx, cy, s, fill, stroke, alpha = 0.3, dash) {
  ctx.beginPath(); pts.forEach(([x, y], i) => (i ? ctx.lineTo(cx + x * s, cy - y * s) : ctx.moveTo(cx + x * s, cy - y * s))); ctx.closePath();
  if (fill) { ctx.fillStyle = fill; ctx.globalAlpha = alpha; ctx.fill(); ctx.globalAlpha = 1; }
  ctx.strokeStyle = stroke; ctx.lineWidth = 2.5; if (dash) ctx.setLineDash(dash); ctx.stroke(); ctx.setLineDash([]);
}

// Not a figure: nothing to draw.
export default function () {}
