// Class 9 Quadrilaterals (step player): why a parallelogram has equal opposite sides and equal opposite angles.
// The diagonal AC cuts it into two triangles that are exact copies (ASA: shared side AC and two pairs of alternate angles).
import { canvas, text, title } from '../../kit.js';
import { view, shape, seg, note, wedge } from './c9-quad-lib.js';

const N = ['A parallelogram ABCD: AB is parallel to DC, and AD is parallel to BC.', 'Draw the diagonal AC. It splits the shape into triangles ABC and CDA.', 'Because AB ∥ DC, the angles at A and C marked here are equal (alternate angles). The same for the other pair, as AD ∥ BC.', 'The two triangles share the side AC, and have two equal angle pairs. So they are exact copies (ASA).', 'Matching parts of copies are equal: AB = DC and AD = BC. Opposite sides are equal.', 'Also angle B = angle D. And angle A (two parts) = angle C. Opposite angles are equal.'];
export default function (host) {
  let s = 0;
  const cv = canvas(host, { aspect: 0.85, max: 440, min: 290, label: 'A parallelogram cut by a diagonal into two congruent triangles' });
  cv.draw = (ctx, w, h, col) => {
    const top = title(ctx, 'Parallelogram: why opposites are equal', col), V = view(w, h - 56, top, 12, 6, 4);
    const A = [1, 1], B = [8, 1], C = [11, 5], D = [4, 5];
    if (s >= 1) { shape(ctx, V, [A, B, C], col.s[0], null, s >= 3 ? 0.35 : 0.15); shape(ctx, V, [C, D, A], col.s[1], null, s >= 3 ? 0.35 : 0.15); seg(ctx, V, A, C, col.s[3], 2, [5, 4]); }
    shape(ctx, V, [A, B, C, D], null, col.ink, 0, 2.5);
    const lab = (p, t, dx, dy) => text(ctx, t, V.X(p[0]) + dx, V.Y(p[1]) + dy, { color: col.ink, size: 13, weight: 700, align: 'center', halo: col.panel });
    lab(A, 'A', -12, 8); lab(B, 'B', 12, 8); lab(C, 'C', 12, -8); lab(D, 'D', -12, -8);
    const tick = (p, q, n, c) => { const mx = (V.X(p[0]) + V.X(q[0])) / 2, my = (V.Y(p[1]) + V.Y(q[1])) / 2, a = Math.atan2(V.Y(q[1]) - V.Y(p[1]), V.X(q[0]) - V.X(p[0])); ctx.strokeStyle = c; ctx.lineWidth = 2.5; for (let i = 0; i < n; i++) { const o = (i - (n - 1) / 2) * 5; ctx.beginPath(); ctx.moveTo(mx + o * Math.cos(a) - 6 * Math.sin(a), my + o * Math.sin(a) + 6 * Math.cos(a)); ctx.lineTo(mx + o * Math.cos(a) + 6 * Math.sin(a), my + o * Math.sin(a) - 6 * Math.cos(a)); ctx.stroke(); } };
    if (s >= 2 && s <= 3) { wedge(ctx, V, A, B, C, col.s[4], 20); wedge(ctx, V, C, D, A, col.s[4], 20); wedge(ctx, V, A, C, D, col.s[5], 26); wedge(ctx, V, C, A, B, col.s[5], 26); }
    if (s >= 4) { tick(A, B, 1, col.s[2]); tick(D, C, 1, col.s[2]); tick(A, D, 2, col.s[3]); tick(B, C, 2, col.s[3]); }
    if (s === 5) { wedge(ctx, V, B, A, C, col.s[2], 16); wedge(ctx, V, D, C, A, col.s[2], 16); }
    note(ctx, N[s], w, h, col);
  };
  cv.redraw();
  return { step(i) { s = Math.min(i, 5); cv.redraw(); } };
}
