// Class 9 Area (step player): the area of a quadrilateral by cutting it along a diagonal into two triangles.
// With the diagonal AC as the common base and the perpendicular heights h1 and h2 from B and D,
// area = 1/2 x AC x h1 + 1/2 x AC x h2 = 1/2 x AC x (h1 + h2).
import { canvas, text, title, dot } from '../../kit.js';
import { note } from './c9-area-lib.js';

const N = ['A four-sided plot ABCD. We do not have a formula for this odd shape.', 'Draw the diagonal AC. The plot is now two triangles, ABC and ACD, that share the side AC.', 'Drop a perpendicular from B to AC (height 3 m) and from D to AC (height 4 m).', 'Triangle ABC: ½ × 10 × 3 = 15 m². Triangle ACD: ½ × 10 × 4 = 20 m².', 'Add them: 15 + 20 = 35 m². Or in one go, ½ × AC × (h₁ + h₂) = ½ × 10 × 7 = 35 m².'];
export default function (host) {
  let s = 0;
  const cv = canvas(host, { aspect: 0.9, max: 440, min: 290, label: 'A quadrilateral cut into two triangles by a diagonal and its area worked out' });
  cv.draw = (ctx, w, h, col) => {
    const top = title(ctx, 'Area of a quadrilateral: split it', col), k = Math.min((w - 40) / 10, (h - top - 100) / 7.4), ox = (w - 10 * k) / 2, ay = top + 28 + 3.4 * k;
    const P = (x, y) => [ox + x * k, ay - y * k], A = P(0, 0), C = P(10, 0), B = P(3, 3), D = P(6, -4);
    const poly = (pts, c, al) => { ctx.fillStyle = c; ctx.globalAlpha = al; ctx.beginPath(); pts.forEach((q, i) => (i ? ctx.lineTo(q[0], q[1]) : ctx.moveTo(q[0], q[1]))); ctx.closePath(); ctx.fill(); ctx.globalAlpha = 1; };
    if (s >= 1) { poly([A, B, C], col.s[0], s >= 3 ? 0.35 : 0.12); poly([A, C, D], col.s[1], s >= 3 ? 0.35 : 0.12); }
    ctx.strokeStyle = col.ink; ctx.lineWidth = 2.5; ctx.beginPath(); [A, B, C, D].forEach((q, i) => (i ? ctx.lineTo(q[0], q[1]) : ctx.moveTo(q[0], q[1]))); ctx.closePath(); ctx.stroke();
    if (s >= 1) { ctx.strokeStyle = col.s[3]; ctx.lineWidth = 2.5; ctx.beginPath(); ctx.moveTo(A[0], A[1]); ctx.lineTo(C[0], C[1]); ctx.stroke(); text(ctx, 'AC = 10 m', A[0] + 2.4 * k, A[1] + 12, { color: col.s[3], size: 11, weight: 700, align: 'center', halo: col.panel }); }
    if (s >= 2) { ctx.strokeStyle = col.s[2]; ctx.lineWidth = 2; ctx.setLineDash([4, 3]); ctx.beginPath(); ctx.moveTo(B[0], B[1]); ctx.lineTo(B[0], A[1]); ctx.moveTo(D[0], D[1]); ctx.lineTo(D[0], A[1]); ctx.stroke(); ctx.setLineDash([]); text(ctx, 'h₁ = 3', B[0] + 5, (B[1] + A[1]) / 2, { color: col.s[2], size: 11, weight: 700, halo: col.panel }); text(ctx, 'h₂ = 4', D[0] + 5, (D[1] + A[1]) / 2, { color: col.s[2], size: 11, weight: 700, halo: col.panel }); }
    if (s >= 3) { text(ctx, '15 m²', ox + 4.2 * k, A[1] - 0.9 * k, { color: col.ink, size: 12, weight: 700, align: 'center' }); text(ctx, '20 m²', ox + 5.2 * k, A[1] + 1.4 * k, { color: col.ink, size: 12, weight: 700, align: 'center' }); }
    [['A', A, -10, 0], ['B', B, 0, -10], ['C', C, 10, 0], ['D', D, 0, 11]].forEach(([n, q, dx, dy]) => { dot(ctx, q[0], q[1], 4, col.ink); text(ctx, n, q[0] + dx, q[1] + dy, { color: col.ink, size: 13, weight: 700, align: 'center' }); });
    note(ctx, N[s], w, h, col);
  };
  cv.redraw();
  return { step(i) { s = Math.min(i, 4); cv.redraw(); } };
}
