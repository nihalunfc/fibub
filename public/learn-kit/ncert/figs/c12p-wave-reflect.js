// Class 12 Wave Optics (step player): proof of the law of reflection with Huygens' principle. A plane front AB meets a mirror.
// While B travels BC = v t, the wavelet from A grows to AE = v t in the same medium, so BC = AE. Right triangles ABC and AEC share
// the hypotenuse AC, so they are congruent and angle i = angle r.
import { canvas, text, title, line, dot, arrow } from '../../kit.js';
import { rad } from '../c12p-optlib.js';

export default function (host) {
  let step = 0;
  const cv = canvas(host, { aspect: 0.8, max: 440, min: 290, label: 'Huygens construction for reflection from a plane mirror' });
  const TITLES = ['Plane front AB meets the mirror', 'B travels to C in time t: BC = vt', 'The wavelet from A grows to AE = vt (same medium)', 'The tangent from C is the reflected front CE', 'Triangles ABC and AEC are congruent: i = r'];
  cv.draw = (ctx, w, h, col) => {
    const top = title(ctx, TITLES[step], col) + 6, Y = h - 30, i = rad(32);
    line(ctx, [[0, Y], [w, Y]], col.ink, 4);
    for (let x = 6; x < w; x += 12) line(ctx, [[x, Y + 3], [x - 7, Y + 12]], col.muted, 1);
    const A = [w * 0.3, Y], Lc = w * 0.5, C = [A[0] + Lc, Y], BC = Lc * Math.sin(i);
    const B = [C[0] - BC * Math.sin(i), C[1] - BC * Math.cos(i)];
    const E = [A[0] + BC * Math.sin(i), A[1] - BC * Math.cos(i)];
    line(ctx, [[A[0], Y], [A[0], Y - 120]], col.muted, 1, [4, 4]);
    line(ctx, [A, B], col.s[0], 3.5); dot(ctx, ...A, 4, col.ink); dot(ctx, ...B, 4, col.ink);
    text(ctx, 'A', A[0] - 12, A[1] + 0, { color: col.ink, size: 13, weight: 700 }); text(ctx, 'B', B[0] - 12, B[1] - 8, { color: col.ink, size: 13, weight: 700 });
    for (const f of [0.35, 0.8]) { const p = [A[0] + (B[0] - A[0]) * f, A[1] + (B[1] - A[1]) * f]; arrow(ctx, p[0] - Math.sin(i) * 46, p[1] - Math.cos(i) * 46, p[0] - Math.sin(i) * 4, p[1] - Math.cos(i) * 4, col.s[0], 1.6, 6); }
    if (step >= 1) {
      dot(ctx, ...C, 4, col.ink); text(ctx, 'C', C[0] + 6, C[1] - 10, { color: col.ink, size: 13, weight: 700 });
      line(ctx, [B, C], col.s[2], 2.5, [6, 3]); text(ctx, 'BC = vt', (B[0] + C[0]) / 2 + 8, (B[1] + C[1]) / 2 - 8, { color: col.s[2], size: 12, weight: 700 });
      line(ctx, [A, C], col.ink, 1.5);
    }
    if (step >= 2) {
      ctx.strokeStyle = col.s[1]; ctx.lineWidth = 2; ctx.beginPath(); ctx.arc(A[0], A[1], BC, -Math.PI, 0); ctx.stroke();
      dot(ctx, ...E, 4, col.ink); text(ctx, 'E', E[0] - 4, E[1] - 12, { color: col.ink, size: 13, weight: 700, align: 'center' });
      line(ctx, [A, E], col.s[1], 2.5); text(ctx, 'AE = vt', (A[0] + E[0]) / 2 - 8, (A[1] + E[1]) / 2 + 12, { color: col.s[1], size: 12, weight: 700, align: 'right' });
    }
    if (step >= 3) {
      line(ctx, [C, E], col.s[3], 3.5); text(ctx, 'reflected front', E[0] - 8, E[1] - 12, { color: col.s[3], size: 11.5, weight: 700, align: 'right' });
      for (const k of [0.35, 0.8]) { const p = [E[0] + (C[0] - E[0]) * k, E[1] + (C[1] - E[1]) * k]; arrow(ctx, p[0], p[1], p[0] + Math.sin(i) * 46, p[1] - Math.cos(i) * 46, col.s[3], 1.6, 6); }
    }
    if (step >= 4) {
      const aB = Math.atan2(B[1] - A[1], B[0] - A[0]), aE = Math.atan2(E[1] - C[1], E[0] - C[0]);
      ctx.lineWidth = 1.5; ctx.strokeStyle = col.s[0]; ctx.beginPath(); ctx.arc(A[0], A[1], 30, 0, aB, true); ctx.stroke();
      text(ctx, 'i', A[0] + 42 * Math.cos(aB / 2), A[1] + 42 * Math.sin(aB / 2), { color: col.s[0], size: 13, weight: 700, align: 'center' });
      ctx.strokeStyle = col.s[3]; ctx.beginPath(); ctx.arc(C[0], C[1], 34, Math.PI, aE, false); ctx.stroke();
      text(ctx, 'r', C[0] + 48 * Math.cos((3 * Math.PI + aE) / 2), C[1] + 48 * Math.sin((3 * Math.PI + aE) / 2), { color: col.s[3], size: 13, weight: 700, align: 'center' });
      text(ctx, 'AC common, BC = AE, both 90°', w - 8, top + 8, { color: col.s[7], size: 12, weight: 700, align: 'right' });
      text(ctx, '⇒ ∠BAC = ∠ECA: i = r', w - 8, top + 26, { color: col.s[7], size: 12.5, weight: 700, align: 'right' });
    }
  };
  cv.redraw();
  return { step(k) { step = Math.min(4, k); cv.redraw(); } };
}
