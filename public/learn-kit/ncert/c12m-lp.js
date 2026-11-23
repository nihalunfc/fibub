// Helper for the Class 12 Maths Linear Programming figures: shade the points that satisfy several linear inequalities, draw a line a x + b y = c across the
// graph box, and find the corner points (where two boundary lines meet and every inequality still holds).
import { line, dot, text } from '../kit.js';

/** A constraint is { a, b, c, ge } meaning a x + b y <= c (or >= c when ge). */
export const ok = (k, x, y, eps = 1e-9) => (k.ge ? k.a * x + k.b * y >= k.c - eps : k.a * x + k.b * y <= k.c + eps);
export const feasible = (cons, x, y) => cons.every((k) => ok(k, x, y));

export function shade(ctx, G, cons, color, alpha = 0.28, xr = 10, yr = 10) {
  // clip the whole box by each half-plane in turn (Sutherland-Hodgman), then fill the polygon that is left
  let poly = [[0, 0], [xr, 0], [xr, yr], [0, yr]];
  for (const k of cons) {
    const f = (pt) => (k.ge ? k.a * pt[0] + k.b * pt[1] - k.c : k.c - k.a * pt[0] - k.b * pt[1]), out = [];
    for (let i = 0; i < poly.length; i++) {
      const A = poly[i], B = poly[(i + 1) % poly.length], fa = f(A), fb = f(B);
      if (fa >= 0) out.push(A);
      if ((fa >= 0) !== (fb >= 0)) { const t = fa / (fa - fb); out.push([A[0] + t * (B[0] - A[0]), A[1] + t * (B[1] - A[1])]); }
    }
    poly = out; if (!poly.length) return;
  }
  ctx.save(); ctx.fillStyle = color; ctx.globalAlpha = alpha; ctx.beginPath();
  poly.forEach((q, i) => (i ? ctx.lineTo(G.X(q[0]), G.Y(q[1])) : ctx.moveTo(G.X(q[0]), G.Y(q[1])))); ctx.closePath(); ctx.fill(); ctx.restore();
}

/** Draw a x + b y = c across the box [0, xr] x [0, yr]. */
export function lineFull(ctx, G, a, b, c, color, width = 2, dash, xr = 10, yr = 10) {
  const pts = [];
  if (b !== 0) { for (const x of [0, xr]) { const y = (c - a * x) / b; if (y >= -1e-9 && y <= yr + 1e-9) pts.push([x, y]); } }
  if (a !== 0) { for (const y of [0, yr]) { const x = (c - b * y) / a; if (x >= -1e-9 && x <= xr + 1e-9) pts.push([x, y]); } }
  if (pts.length < 2) return;
  pts.sort((p, q) => p[0] - q[0] || p[1] - q[1]);
  line(ctx, [[G.X(pts[0][0]), G.Y(pts[0][1])], [G.X(pts[pts.length - 1][0]), G.Y(pts[pts.length - 1][1])]], color, width, dash);
}

/** Corner points of the feasible region (the axes x >= 0, y >= 0 must be in `cons`). Sorted anticlockwise-ish by angle about the centre. */
export function corners(cons) {
  const out = [];
  for (let i = 0; i < cons.length; i++) for (let j = i + 1; j < cons.length; j++) {
    const p = cons[i], q = cons[j], det = p.a * q.b - q.a * p.b;
    if (Math.abs(det) < 1e-9) continue;
    const x = (p.c * q.b - q.c * p.b) / det, y = (p.a * q.c - q.a * p.c) / det;
    if (feasible(cons, x, y, 1e-7) && !out.some((o) => Math.hypot(o[0] - x, o[1] - y) < 1e-6)) out.push([x, y]);
  }
  if (!out.length) return out;
  const cx = out.reduce((s, p) => s + p[0], 0) / out.length, cy = out.reduce((s, p) => s + p[1], 0) / out.length;
  return out.sort((p, q) => Math.atan2(p[1] - cy, p[0] - cx) - Math.atan2(q[1] - cy, q[0] - cx));
}

export const AX = [{ a: 1, b: 0, c: 0, ge: true }, { a: 0, b: 1, c: 0, ge: true }];

/** A labelled corner dot. */
export function mark(ctx, G, x, y, color, ring, label, dx = 8, dy = -10, size = 11.5) {
  dot(ctx, G.X(x), G.Y(y), 5.5, color, ring);
  if (label) text(ctx, label, G.X(x) + dx, G.Y(y) + dy, { color, size, weight: 700, halo: ring });
}
