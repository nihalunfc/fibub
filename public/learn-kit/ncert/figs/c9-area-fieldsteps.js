// Class 9 Area (step player): the area of an odd-shaped field by splitting it into triangles. Field ABCD with
// AB = 13, BC = 14, CA = 15 (diagonal), CD = 8, DA = 17 metres. Triangle ABC (13, 14, 15) has area 84 m squared by
// Heron; triangle ACD (15, 8, 17) has s = 20 and area sqrt(20 x 5 x 12 x 3) = 60 m squared. Total 144 m squared.
import { canvas, text, title, dot } from '../../kit.js';
import { note } from './c9-area-lib.js';

const N = ['Farmer Meena’s field ABCD: sides 13 m, 14 m, 8 m and 17 m, and a rope stretched along the diagonal AC measures 15 m.', 'The rope AC cuts the field into two triangles. For each we know all three sides, so Heron’s formula works.', 'Triangle ABC has sides 13, 14, 15. s = 21, so area = √(21 × 8 × 7 × 6) = 84 m².', 'Triangle ACD has sides 15, 8, 17. s = 20, so area = √(20 × 5 × 12 × 3) = √3600 = 60 m².', 'Field area = 84 + 60 = 144 m².', 'Levelling the field costs ₹ 50 per m²: 144 × 50 = ₹ 7,200. Fencing it needs the perimeter 13 + 14 + 8 + 17 = 52 m of wire.'];
export default function (host) {
  let s = 0;
  const cv = canvas(host, { aspect: 0.95, max: 440, min: 290, label: 'An odd-shaped field split by a diagonal into two triangles whose areas are found by Heron formula' });
  cv.draw = (ctx, w, h, col) => {
    const top = title(ctx, 'A field split into triangles', col), k = Math.min((w - 40) / 20.4, (h - top - 130) / 12), ox = (w - 20.4 * k) / 2, by = top + 20 + 12 * k;
    const P = (x, y) => [ox + x * k, by - y * k], A = P(5, 12), B = P(0, 0), C = P(14, 0), D = P(20.4, 4.8);
    const poly = (pts, c, al) => { ctx.fillStyle = c; ctx.globalAlpha = al; ctx.beginPath(); pts.forEach((q, i) => (i ? ctx.lineTo(q[0], q[1]) : ctx.moveTo(q[0], q[1]))); ctx.closePath(); ctx.fill(); ctx.globalAlpha = 1; };
    poly([A, B, C, D], col.s[3], s === 0 ? 0.15 : 0);
    if (s >= 1) { poly([A, B, C], col.s[0], s === 2 || s >= 4 ? 0.35 : 0.14); poly([A, C, D], col.s[1], s === 3 || s >= 4 ? 0.35 : 0.14); }
    ctx.strokeStyle = col.ink; ctx.lineWidth = 2.5; ctx.beginPath(); [A, B, C, D].forEach((q, i) => (i ? ctx.lineTo(q[0], q[1]) : ctx.moveTo(q[0], q[1]))); ctx.closePath(); ctx.stroke();
    if (s >= 1) { ctx.strokeStyle = col.s[2]; ctx.lineWidth = 2.5; ctx.setLineDash([6, 4]); ctx.beginPath(); ctx.moveTo(A[0], A[1]); ctx.lineTo(C[0], C[1]); ctx.stroke(); ctx.setLineDash([]); }
    const lab = (t, p, q, dx, dy, c = col.ink) => text(ctx, t, (p[0] + q[0]) / 2 + dx, (p[1] + q[1]) / 2 + dy, { color: c, size: 11, weight: 700, align: 'center', halo: col.panel });
    lab('13', A, B, -12, -4); lab('14', B, C, 0, 12); lab('8', C, D, 10, 8); lab('17', D, A, 8, -10);
    if (s >= 1) lab('15', A, C, -12, 4, col.s[2]);
    [['A', A, 0, -11], ['B', B, -9, 6], ['C', C, 0, 12], ['D', D, 10, 0]].forEach(([n, q, dx, dy]) => { dot(ctx, q[0], q[1], 4, col.ink); text(ctx, n, q[0] + dx, q[1] + dy, { color: col.ink, size: 13, weight: 700, align: 'center' }); });
    if (s >= 2) text(ctx, '84 m²', (A[0] + B[0] + C[0]) / 3, (A[1] + B[1] + C[1]) / 3 + 6, { color: col.ink, size: 14, weight: 700, align: 'center', halo: col.panel });
    if (s >= 3) text(ctx, '60 m²', (A[0] + C[0] + D[0]) / 3 + 4, (A[1] + C[1] + D[1]) / 3, { color: col.ink, size: 14, weight: 700, align: 'center', halo: col.panel });
    if (s >= 4) text(ctx, 'Total 144 m²', w / 2, top + 14, { color: col.s[3], size: 14, weight: 700, align: 'center' });
    note(ctx, N[s], w, h, col);
  };
  cv.redraw();
  return { step(i) { s = Math.min(i, 5); cv.redraw(); } };
}
