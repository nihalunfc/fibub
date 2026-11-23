// Class 12 Maths, Integrals (step player): integration by parts on ∫ x eˣ dx. The board fills in line by line:
// choose u (the part that gets simpler when differentiated, ILATE), dv (the part you can integrate), then
// ∫u dv = uv − ∫v du. A small plot checks the answer: the area of x eˣ from 0 to 1 is exactly 1.
import { canvas, axes, line, text, title } from '../../kit.js';

export default function (host) {
  let step = 0;
  const cv = canvas(host, { aspect: 1.2, max: 520, min: 400, label: 'Integration by parts worked line by line for x times e to the x' });
  const T = ['The problem: ∫ x eˣ dx', 'Pick u: the part that gets simpler (ILATE)', 'The rest is dv: what we can integrate', 'Differentiate u, integrate dv', 'Put into uv − ∫v du', 'Finish the easy integral', 'Check by differentiating'];
  const L = [
    ['∫ x eˣ dx', 'ink'], ['u = x   (A comes before E in ILATE)', 's0'], ['dv = eˣ dx', 's1'], ['du = dx,   v = eˣ', 's3'],
    ['∫ x eˣ dx = uv − ∫ v du = x eˣ − ∫ eˣ dx', 'ink'], ['= x eˣ − eˣ + C = (x − 1)eˣ + C', 'ink'],
    ['check: d/dx[(x − 1)eˣ] = eˣ + (x − 1)eˣ = x eˣ ✓', 's3'], ['so ∫₀¹ x eˣ dx = [(x − 1)eˣ]₀¹ = 0 − (−1) = 1', 'ink'],
  ];
  const UPTO = [1, 2, 3, 4, 5, 6, 8];
  cv.draw = (ctx, w, h, col) => {
    const t = title(ctx, T[step], col), C = { ink: col.ink, s0: col.s[0], s1: col.s[1], s3: col.s[3] };
    const n = UPTO[step];
    for (let i = 0; i < n; i++) text(ctx, L[i][0], 12, t + 16 + i * 21, { color: C[L[i][1]], size: 12.5, weight: 600 });
    if (step === 6) {
      const gy = t + 16 + 8 * 21 + 4, g = axes(ctx, w, h, col, { x: [0, 1.2], y: [0, 4], l: 34, b: 24, t: gy, r: 12, yt: [0, 2, 4], xt: [0, 0.5, 1] });
      ctx.save(); g.clip(); ctx.globalAlpha = 0.3; ctx.fillStyle = col.s[1]; ctx.beginPath(); ctx.moveTo(g.X(0), g.Y(0)); for (let i = 0; i <= 50; i++) { const x = i / 50; ctx.lineTo(g.X(x), g.Y(x * Math.exp(x))); } ctx.lineTo(g.X(1), g.Y(0)); ctx.fill(); ctx.globalAlpha = 1;
      const pts = []; for (let i = 0; i <= 60; i++) { const x = 1.2 * i / 60; pts.push([g.X(x), g.Y(x * Math.exp(x))]); } line(ctx, pts, col.s[0], 2.5); ctx.restore();
      text(ctx, 'area under x eˣ from 0 to 1 = 1', g.X(0.04), g.Y(3.5), { color: col.s[1], size: 11.5, weight: 700 });
    }
  };
  return { step(i) { step = Math.min(i, 6); cv.redraw(); } };
}
