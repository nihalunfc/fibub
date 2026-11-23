// Class 12 Continuity (step player): f(x) = (x^2 - 4)/(x - 2) is not defined at x = 2, but for x not equal to 2 it equals x + 2, so both one-sided limits at 2 are 4.
// The graph is the line y = x + 2 with a hole at (2, 4): a removable discontinuity. Defining f(2) = 4 fills the hole and makes f continuous.
import { canvas, text, title, line, dot, axes } from '../../kit.js';

export default function (host) {
  let step = 0;
  const cv = canvas(host, { aspect: 0.95, max: 440, min: 310, label: 'A line with a hole at x equals 2 that is filled by defining the missing value' });
  const LINES = ['f(x) = (x² − 4)/(x − 2),  x ≠ 2', 'f(2) = 0/0: not defined', 'left-hand limit: x + 2 → 4', 'right-hand limit: x + 2 → 4', 'limits equal 4, but f(2) is missing: a hole', 'define f(2) = 4: now continuous'];
  cv.draw = (ctx, w, h, col) => {
    const s = Math.min(step, 5); title(ctx, 'Removable discontinuity', col);
    text(ctx, LINES[s], 12, 44, { color: s >= 4 ? col.s[3] : col.ink, size: 14, weight: 800 });
    if (s >= 1) text(ctx, s === 1 ? 'the graph has no point at x = 2' : LINES[1], 12, 64, { color: col.muted, size: 12, weight: 600 });
    const A = axes(ctx, w, h, col, { x: [-1, 5], y: [0, 7], l: 30, r: 14, t: 78, b: 28, xt: [0, 2, 4], yt: [0, 2, 4, 6] });
    const a = [], b = []; for (let x = -1; x <= 1.999; x += 0.1) a.push([A.X(x), A.Y(x + 2)]); for (let x = 2.001; x <= 5; x += 0.1) b.push([A.X(x), A.Y(x + 2)]);
    line(ctx, a, col.s[0], 3); line(ctx, b, col.s[0], 3);
    if (s === 2 || s === 4 || s === 5) text(ctx, 'from the left', A.X(0.4), A.Y(2.4) - 18, { color: col.s[0], size: 11.5, weight: 700, halo: col.panel });
    if (s === 3 || s === 4 || s === 5) text(ctx, 'from the right', A.X(3.4), A.Y(5.4) - 12, { color: col.s[0], size: 11.5, weight: 700, halo: col.panel });
    ctx.setLineDash([4, 4]); if (s >= 2) line(ctx, [[A.X(2), A.B], [A.X(2), A.Y(4)]], col.line, 1.5, [4, 4]); if (s >= 2) line(ctx, [[A.L, A.Y(4)], [A.X(2), A.Y(4)]], col.line, 1.5, [4, 4]); ctx.setLineDash([]);
    if (s >= 1 && s < 5) dot(ctx, A.X(2), A.Y(4), 6, col.panel, col.s[3]);
    if (s === 5) dot(ctx, A.X(2), A.Y(4), 6.5, col.s[2], col.ink);
  };
  return { step(i) { step = Math.min(i, 5); cv.redraw(); } };
}
