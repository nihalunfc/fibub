// Class 12 Maths, Differential Equations (step player): the linear equation dy/dx + Py = Q by an integrating factor,
// on dy/dx + y = x with y(0) = 2. Multiplying by IF = e^(∫P dx) = eˣ turns the left side into d/dx(y·eˣ), so one
// integration finishes it: y = x − 1 + C e^(−x). The graph shows the family, the line y = x − 1 they all approach,
// and the particular solution C = 3.
import { canvas, axes, line, dot, text, title } from '../../kit.js';

export default function (host) {
  let step = 0;
  const cv = canvas(host, { aspect: 1.15, max: 490, min: 390, label: 'Solving a linear first order equation with an integrating factor' });
  const T = ['Write it as dy/dx + Py = Q', 'Integrating factor', 'Multiply through', 'Integrate both sides', 'Solve for y', 'Use y(0) = 2'];
  const L = [['dy/dx + y = x   ⇒   P = 1, Q = x', 'ink'], ['IF = e^(∫P dx) = e^(∫1 dx) = eˣ', 's0'], ['eˣ dy/dx + y eˣ = x eˣ   ⇒   d/dx (y eˣ) = x eˣ', 'ink'], ['y eˣ = ∫ x eˣ dx = (x − 1)eˣ + C   (by parts)', 'ink'], ['y = x − 1 + C e⁻ˣ', 's0'], ['2 = 0 − 1 + C ⇒ C = 3:   y = x − 1 + 3e⁻ˣ', 's1']];
  cv.draw = (ctx, w, h, col) => {
    const t = title(ctx, T[step], col), C = { ink: col.ink, s0: col.s[0], s1: col.s[1] };
    for (let i = 0; i <= step; i++) text(ctx, L[i][0], 12, t + 14 + i * 19, { color: C[L[i][1]], size: 12, weight: 600 });
    const g = axes(ctx, w, h, col, { x: [0, 4], y: [-2, 6], l: 30, b: 24, t: t + 14 + 6 * 19 + 2, r: 12, yt: [-2, 0, 2, 4, 6] });
    ctx.save(); g.clip();
    if (step >= 4) { line(ctx, [[g.X(0), g.Y(-1)], [g.X(4), g.Y(3)]], col.muted, 1.5, [5, 4]); for (const Cc of [-2, 0, 1, 3, 5]) { const p = []; for (let i = 0; i <= 100; i++) { const x = 4 * i / 100; p.push([g.X(x), g.Y(x - 1 + Cc * Math.exp(-x))]); } line(ctx, p, step === 5 && Cc === 3 ? col.s[1] : col.line, step === 5 && Cc === 3 ? 3.5 : 1.5); } }
    ctx.restore(); if (step === 5) dot(ctx, g.X(0), g.Y(2), 5.5, col.s[1], col.panel);
    if (step >= 4) text(ctx, 'dashed: y = x − 1, the long-run line', g.R - 6, g.B - 10, { color: col.muted, size: 11, align: 'right', halo: col.panel });
  };
  return { step(i) { step = Math.min(i, 5); cv.redraw(); } };
}
