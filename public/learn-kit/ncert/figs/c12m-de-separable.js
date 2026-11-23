// Class 12 Maths, Differential Equations (step player): variable separable method on dy/dx = 2xy with y(0) = 1.
// Put all y with dy and all x with dx, integrate both sides, solve for y (one constant A: a family of curves), then use
// the starting value to pick the particular solution y = e^(x²), and check it by differentiating.
import { canvas, axes, line, dot, text, title } from '../../kit.js';

export default function (host) {
  let step = 0;
  const cv = canvas(host, { aspect: 1.1, max: 480, min: 380, label: 'Separating variables on dy/dx = 2xy and drawing the solution curves' });
  const T = ['The equation and a starting value', 'Separate the variables', 'Integrate both sides', 'Solve for y: a family of curves', 'Use y(0) = 1 to find A', 'Check by differentiating'];
  const L = [['dy/dx = 2xy,   y(0) = 1', 'ink'], ['dy/y = 2x dx      (y ≠ 0)', 'ink'], ['∫ dy/y = ∫ 2x dx   ⇒   ln|y| = x² + C', 'ink'], ['y = A eˣ²   where A = ±e^C', 's0'], ['y(0) = 1:  A e⁰ = 1  ⇒  A = 1,   y = eˣ²', 's1'], ['dy/dx = 2x eˣ² = 2x·y ✓', 's3']];
  cv.draw = (ctx, w, h, col) => {
    const t = title(ctx, T[step], col), C = { ink: col.ink, s0: col.s[0], s1: col.s[1], s3: col.s[3] };
    for (let i = 0; i <= step; i++) text(ctx, L[i][0], 12, t + 14 + i * 19, { color: C[L[i][1]], size: 12.5, weight: 600 });
    const g = axes(ctx, w, h, col, { x: [-1.5, 1.5], y: [0, 5], l: 30, b: 24, t: t + 14 + 6 * 19 + 2, r: 12, yt: [0, 2, 4] });
    ctx.save(); g.clip();
    if (step >= 3) for (const A of [0.25, 0.5, 1, 2, 3.5]) { const p = []; for (let i = 0; i <= 100; i++) { const x = -1.5 + 3 * i / 100; p.push([g.X(x), g.Y(A * Math.exp(x * x))]); } line(ctx, p, step >= 4 && A === 1 ? col.s[1] : col.line, step >= 4 && A === 1 ? 3 : 1.5); }
    if (step >= 4) { const p = []; for (let i = 0; i <= 100; i++) { const x = -1.5 + 3 * i / 100; p.push([g.X(x), g.Y(Math.exp(x * x))]); } line(ctx, p, col.s[1], 3.5); }
    if (step === 5) { const x = 0.8, y = Math.exp(x * x), m = 2 * x * y; line(ctx, [[g.X(x - 0.4), g.Y(y - m * 0.4)], [g.X(x + 0.4), g.Y(y + m * 0.4)]], col.s[3], 2.5); }
    ctx.restore();
    if (step >= 4) dot(ctx, g.X(0), g.Y(1), 5.5, col.s[1], col.panel);
    if (step >= 3) text(ctx, step >= 4 ? 'the curve through (0, 1)' : 'one curve for each A', g.L + 8, g.T + 10, { color: col.muted, size: 11 });
    if (step === 5) text(ctx, 'tangent slope = 2xy', g.R - 6, g.T + 24, { color: col.s[3], size: 11, align: 'right' });
  };
  return { step(i) { step = Math.min(i, 5); cv.redraw(); } };
}
