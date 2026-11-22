// Class 12 Electric Charges and Fields (step player): the superposition principle. Two +4 uC charges 60 cm apart and a +1 uC test
// charge 40 cm above the middle. Each charge pulls/pushes independently (F = kq1q2/r^2, r = 0.5 m, so 0.144 N); the two forces are
// added as vectors. Horizontal parts cancel, vertical parts add: F = 2 F cos(phi) = 0.230 N upward.
import { canvas, text, title, dot, arrow, line } from '../../kit.js';

export default function (host) {
  let step = 0;
  const cv = canvas(host, { aspect: 0.8, max: 440, min: 290, label: 'Forces from two charges on a test charge added as vectors' });
  const TITLES = ['Setup: two charges and a test charge', 'Force from charge A alone', 'Force from charge B alone', 'Add the two arrows (parallelogram)', 'Resolve into components', 'Result: only the vertical parts survive'];
  cv.draw = (ctx, w, h, col) => {
    const top = title(ctx, TITLES[step], col) + 4;
    const cx = w / 2, by = h - 46, s = Math.min((w - 70) / 0.7, (by - top - 20) / 0.55) * 0.9; // px per metre
    const A = [cx - 0.3 * s, by], B = [cx + 0.3 * s, by], P = [cx, by - 0.4 * s];
    const u = 100; // px per 0.144 N
    const fa = [(P[0] - A[0]) / (0.5 * s) * u, (P[1] - A[1]) / (0.5 * s) * u], fb = [(P[0] - B[0]) / (0.5 * s) * u, (P[1] - B[1]) / (0.5 * s) * u];
    const sc = 0.55;
    const fA = fa.map((v) => v * sc), fB = fb.map((v) => v * sc);
    line(ctx, [A, P, B], col.line, 1, [4, 4]); line(ctx, [A, B], col.line, 1, [4, 4]);
    dot(ctx, ...A, 11, col.s[2]); dot(ctx, ...B, 11, col.s[2]); dot(ctx, ...P, 8, col.s[3]);
    text(ctx, 'A +4 µC', A[0], A[1] + 20, { color: col.ink, size: 11, align: 'center' }); text(ctx, 'B +4 µC', B[0], B[1] + 20, { color: col.ink, size: 11, align: 'center' });
    text(ctx, 'test +1 µC', P[0] + 12, P[1] + 34, { color: col.ink, size: 11 });
    text(ctx, '0.6 m', cx, by + 20, { color: col.muted, size: 10.5, align: 'center' }); text(ctx, '0.5 m', (A[0] + P[0]) / 2 - 22, (A[1] + P[1]) / 2, { color: col.muted, size: 10.5, align: 'center' });
    line(ctx, [P, [cx, by]], col.line, 1, [4, 4]); text(ctx, '0.4 m', cx + 4, (P[1] + by) / 2 + 20, { color: col.muted, size: 10.5 });
    const drawA = step >= 1, drawB = step >= 2;
    if (step === 4 || step === 5) {
      const ax = [P[0] + fA[0], P[1]], bx = [P[0] + fB[0], P[1]];
      arrow(ctx, ...P, ...bx, col.s[5], 2); arrow(ctx, ...P, ...ax, col.s[5], 2);
      arrow(ctx, ...P, P[0], P[1] + fA[1], col.s[1], 2); arrow(ctx, ...P, P[0], P[1] + fB[1], col.s[1], 2);
      arrow(ctx, ...P, P[0] + fA[0], P[1] + fA[1], col.s[3], 1.5); arrow(ctx, ...P, P[0] + fB[0], P[1] + fB[1], col.s[1], 1.5);
      text(ctx, 'x parts: equal and opposite, they cancel', cx, P[1] + 18, { color: col.s[5], size: 11, align: 'center' });
      if (step === 5) { arrow(ctx, ...P, P[0], P[1] + fA[1] * 2, col.s[7], 3.5); text(ctx, 'F = 2F cos φ = 0.23 N', P[0] + 8, P[1] + fA[1], { color: col.s[7], size: 12, weight: 700 }); }
      else text(ctx, 'y parts: same way, they add', P[0] + 8, P[1] + fA[1] * 0.5, { color: col.s[1], size: 11 });
      return;
    }
    if (drawA) { arrow(ctx, ...P, P[0] + fA[0], P[1] + fA[1], col.s[3], 2.5); if (step < 3) text(ctx, 'F_A = 0.144 N', P[0] + fA[0] * 0.2 - 4, P[1] + fA[1] + 14, { color: col.s[3], size: 11, align: 'right' }); }
    if (drawB) { arrow(ctx, ...P, P[0] + fB[0], P[1] + fB[1], col.s[1], 2.5); if (step < 3) text(ctx, 'F_B = 0.144 N', P[0] + fB[0] * 0.2 + 4, P[1] + fB[1] + 14, { color: col.s[1], size: 11 }); }
    if (step === 3) {
      line(ctx, [[P[0] + fA[0], P[1] + fA[1]], [P[0] + fA[0] + fB[0], P[1] + fA[1] + fB[1]]], col.muted, 1, [4, 3]);
      line(ctx, [[P[0] + fB[0], P[1] + fB[1]], [P[0] + fA[0] + fB[0], P[1] + fA[1] + fB[1]]], col.muted, 1, [4, 3]);
      arrow(ctx, ...P, P[0] + fA[0] + fB[0], P[1] + fA[1] + fB[1], col.s[7], 3.5);
      text(ctx, 'F_A + F_B', P[0] + 8, P[1] + fA[1] * 2 + 6, { color: col.s[7], size: 11.5, weight: 700 });
    }
  };
  cv.redraw();
  return { step(i, n) { step = Math.min(i, 5); cv.redraw(); } };
}
