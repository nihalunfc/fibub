// Class 12 Maths, Integrals (step player): partial fractions on (3x + 5)/((x + 1)(x + 2)) = 2/(x + 1) + 1/(x + 2).
// A fraction with a factorised denominator splits into simple pieces, each of which integrates to a logarithm.
// The graph shows the pieces adding to the original; drag the marker to see the heights add at any x.
import { canvas, axes, line, dot, text, title, touchGuard } from '../../kit.js';

export default function (host) {
  let step = 0, x0 = 1;
  const cv = canvas(host, { aspect: 1.0, max: 460, min: 340, label: 'A fraction split into two simpler fractions whose curves add up to it' });
  const f = (x) => (3 * x + 5) / ((x + 1) * (x + 2)), p1 = (x) => 2 / (x + 1), p2 = (x) => 1 / (x + 2);
  const T = ['The fraction to integrate', 'Write it as A/(x+1) + B/(x+2)', 'Find A: cover (x+1), put x = −1', 'Find B: cover (x+2), put x = −2', 'The pieces add up to the original', 'Integrate each piece: logarithms'];
  const L = [['f(x) = (3x + 5) / ((x + 1)(x + 2))', 'ink'], ['(3x + 5)/((x+1)(x+2)) = A/(x+1) + B/(x+2)', 'ink'], ['A = (3(−1) + 5)/(−1 + 2) = 2', 's0'], ['B = (3(−2) + 5)/(−2 + 1) = 1', 's1'], ['check x = 0: 5/2 = 2/1 + 1/2 ✓', 'ink'], ['∫ f dx = 2 ln|x + 1| + ln|x + 2| + C', 'ink']];
  const UP = [1, 2, 3, 4, 5, 6];
  let g;
  cv.draw = (ctx, w, h, col) => {
    const t = title(ctx, T[step], col), C = { ink: col.ink, s0: col.s[0], s1: col.s[1] };
    const n = UP[step];
    for (let i = 0; i < n; i++) text(ctx, L[i][0], 12, t + 14 + i * 19, { color: C[L[i][1]], size: 12, weight: 600 });
    g = axes(ctx, w, h, col, { x: [0, 4], y: [0, 5], l: 32, b: 24, t: t + 14 + 6 * 19 + 2, r: 12, yt: [0, 2, 4] });
    ctx.save(); g.clip();
    const cu = (fn, c, wd) => { const pts = []; for (let i = 0; i <= 80; i++) { const x = 4 * i / 80; pts.push([g.X(x), g.Y(fn(x))]); } line(ctx, pts, c, wd); };
    cu(f, col.ink, 3);
    if (step >= 2) cu(p1, col.s[0], 2);
    if (step >= 3) cu(p2, col.s[1], 2);
    ctx.restore();
    if (step >= 4) {
      line(ctx, [[g.X(x0), g.Y(0)], [g.X(x0), g.Y(p1(x0))]], col.s[0], 5);
      line(ctx, [[g.X(x0), g.Y(p1(x0))], [g.X(x0), g.Y(p1(x0) + p2(x0))]], col.s[1], 5);
      dot(ctx, g.X(x0), g.Y(f(x0)), 5, col.ink, col.panel);
      text(ctx, `at x = ${x0.toFixed(1)}: ${p1(x0).toFixed(2)} + ${p2(x0).toFixed(2)} = ${f(x0).toFixed(2)}`, g.R - 4, g.T + 10, { color: col.ink, size: 11.5, align: "right", halo: col.panel });
    }
  };
  let drag = false;
  const mv = (e) => { const b = cv.c.getBoundingClientRect(); x0 = Math.max(0.1, Math.min(3.9, (e.clientX - b.left - g.L) / (g.R - g.L) * 4)); cv.redraw(); };
  cv.c.addEventListener('pointerdown', (e) => { if (step >= 4) { drag = true; cv.c.setPointerCapture(e.pointerId); mv(e); } });
  cv.c.addEventListener('pointermove', (e) => drag && mv(e));
  cv.c.addEventListener('pointerup', () => (drag = false));
  touchGuard(cv.c, (x) => g && step >= 4 && Math.abs(x - g.X(x0)) < 28);
  return { step(i) { step = Math.min(i, 5); cv.redraw(); } };
}
