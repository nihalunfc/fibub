// Class 12 Maths, Differential Equations (step player): solving the homogeneous equation dy/dx = (x + y)/x with y(1) = 2.
// Check that the right side is a function of y/x, put y = vx so dy/dx = v + x dv/dx, separate v and x, integrate, and put
// y/x back. The curves are y = x(ln x + C); the highlighted one passes through (1, 2).
import { canvas, axes, line, dot, text, title } from '../../kit.js';

export default function (host) {
  let step = 0;
  const cv = canvas(host, { aspect: 1.1, max: 480, min: 380, label: 'Solving a homogeneous differential equation by putting y equals v x' });
  const T = ['The equation and a starting point', 'Is it homogeneous?', 'Substitute y = vx', 'Separate v and x', 'Integrate and put y/x back', 'Use y(1) = 2'];
  const L = [['dy/dx = (x + y)/x,   y(1) = 2', 'ink'], ['(x + y)/x = 1 + y/x: depends only on y/x ✓', 'ink'], ['y = vx ⇒ dy/dx = v + x dv/dx,   so  v + x dv/dx = 1 + v', 's0'], ['x dv/dx = 1  ⇒  dv = dx/x', 'ink'], ['v = ln|x| + C  ⇒  y = x (ln|x| + C)', 's0'], ['2 = 1·(0 + C) ⇒ C = 2:   y = x (ln x + 2)', 's1']];
  cv.draw = (ctx, w, h, col) => {
    const t = title(ctx, T[step], col), C = { ink: col.ink, s0: col.s[0], s1: col.s[1] };
    for (let i = 0; i <= step; i++) text(ctx, L[i][0], 12, t + 14 + i * 19, { color: C[L[i][1]], size: 12, weight: 600 });
    const g = axes(ctx, w, h, col, { x: [0, 3], y: [-1, 8], l: 30, b: 24, t: t + 14 + 6 * 19 + 2, r: 12, yt: [0, 4, 8] });
    ctx.save(); g.clip();
    if (step <= 1) for (let j = 0; j <= 6; j++) { const r = j * 0.8, p = [[g.X(0), g.Y(0)], [g.X(3), g.Y(3 * r)]]; line(ctx, p, j === 3 ? col.s[0] : col.line, j === 3 ? 2 : 1); }
    if (step === 1) text(ctx, 'same slope on every ray', g.R - 6, g.T + 10, { color: col.s[0], size: 11, align: 'right' });
    if (step >= 4) for (const Cc of [-1, 0, 1, 2, 3]) { const p = []; for (let i = 1; i <= 120; i++) { const x = 3 * i / 120; p.push([g.X(x), g.Y(x * (Math.log(x) + Cc))]); } line(ctx, p, step === 5 && Cc === 2 ? col.s[1] : col.line, step === 5 && Cc === 2 ? 3.5 : 1.5); }
    ctx.restore(); if (step === 5) dot(ctx, g.X(1), g.Y(2), 5.5, col.s[1], col.panel);
    if (step >= 2 && step < 4) text(ctx, 'v = y/x is the new variable', g.L + 8, g.T + 12, { color: col.muted, size: 11 });
  };
  return { step(i) { step = Math.min(i, 5); cv.redraw(); } };
}
