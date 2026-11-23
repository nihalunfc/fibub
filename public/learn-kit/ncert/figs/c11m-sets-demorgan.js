// Class 11 Maths, Sets (step player): De Morgan's law (A ∪ B)′ = A′ ∩ B′ shown with two Venn pictures. Left: take the union, then its complement.
// Right: take each complement, then overlap them. Both end up shading the same region.
import { canvas, text, title } from '../../kit.js';
import { shade } from '../c11m-lib.js';

export default function (host) {
  let s = 0;
  const cv = canvas(host, { aspect: 0.78, max: 440, min: 300, label: 'Two Venn diagrams showing that the complement of a union equals the intersection of the complements' });
  cv.draw = (ctx, w, h, col) => {
    const top = title(ctx, "De Morgan: (A ∪ B)′ = A′ ∩ B′", col), pw = (w - 24) / 2, ph = h - top - 58, R = Math.min(pw * 0.3, ph * 0.3);
    const panel = (x0, name, f1, f2, both) => {
      const cy = top + 10 + ph / 2, cA = x0 + pw * 0.38, cB = x0 + pw * 0.62, inA = (x, y) => Math.hypot(x - cA, y - cy) < R, inB = (x, y) => Math.hypot(x - cB, y - cy) < R;
      ctx.strokeStyle = col.muted; ctx.lineWidth = 1.3; ctx.strokeRect(x0, top + 10, pw, ph);
      if (f1) shade(ctx, x0, top + 10, x0 + pw, top + 10 + ph, (x, y) => f1(inA(x, y), inB(x, y)), col.s[0], 0.4, 2);
      if (f2) shade(ctx, x0, top + 10, x0 + pw, top + 10 + ph, (x, y) => f2(inA(x, y), inB(x, y)), col.s[2], 0.4, 2);
      ctx.lineWidth = 2; ctx.strokeStyle = col.ink; ctx.beginPath(); ctx.arc(cA, cy, R, 0, 7); ctx.stroke(); ctx.beginPath(); ctx.arc(cB, cy, R, 0, 7); ctx.stroke();
      text(ctx, 'A', cA - R * 0.55, cy, { color: col.ink, size: 13, weight: 800, align: 'center' }); text(ctx, 'B', cB + R * 0.55, cy, { color: col.ink, size: 13, weight: 800, align: 'center' });
      text(ctx, name, x0 + pw / 2, top + 10 + ph + 13, { color: col.ink, size: 12, weight: 700, align: 'center' });
    };
    const left = s === 0 ? [(a, b) => a || b, null, 'A ∪ B'] : [(a, b) => !(a || b), null, '(A ∪ B)′'];
    panel(8, s < 2 ? left[2] : left[2], s >= 0 ? left[0] : null, null);
    const rn = s < 2 ? 'start: A′ and B′' : s === 2 ? 'A′' : s === 3 ? 'A′ (blue) and B′ (green)' : 'A′ ∩ B′';
    panel(16 + pw, rn, s === 2 || s === 3 ? (a) => !a : s >= 4 ? (a, b) => !a && !b : null, s === 3 ? (a, b) => !b : null);
    if (s === 5) text(ctx, 'Same shaded region: (A ∪ B)′ = A′ ∩ B′', w / 2, h - 8, { color: col.good, size: 12.5, weight: 800, align: 'center' });
  };
  cv.redraw();
  return { step(i) { s = Math.min(i, 5); cv.redraw(); } };
}
