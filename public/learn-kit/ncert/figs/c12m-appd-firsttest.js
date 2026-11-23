// Class 12 Maxima and minima (step player): the first derivative test on f(x) = 2x^3 - 9x^2 + 12x + 1. f'(x) = 6x^2 - 18x + 12 = 6(x-1)(x-2).
// Critical points x = 1 and x = 2. f' is + before 1, - between 1 and 2, + after 2: so f has a local maximum at x = 1 (f = 6) and a local
// minimum at x = 2 (f = 5). The second derivative test agrees: f'' = 12x - 18 is -6 at 1 and +6 at 2.
import { canvas, text, title, line, dot, axes } from '../../kit.js';
import { plot } from '../c12m-lib.js';

const f = (x) => 2 * x ** 3 - 9 * x * x + 12 * x + 1, d = (x) => 6 * (x - 1) * (x - 2);
export default function (host) {
  let step = 0;
  const cv = canvas(host, { aspect: 0.95, max: 440, min: 310, label: 'A cubic curve with its turning points found by the first derivative test' });
  const T = ['The curve f(x) = 2x³ − 9x² + 12x + 1', 'f′(x) = 6x² − 18x + 12 = 6(x − 1)(x − 2)', 'Critical points: f′ = 0 at x = 1 and x = 2', 'Sign of f′ in each part', 'x = 1 is a local maximum, x = 2 a local minimum'];
  cv.draw = (ctx, w, h, col) => {
    const s = Math.min(step, 4), top = title(ctx, T[s], col) + 4;
    const A = axes(ctx, w, h - 40, col, { x: [-0.5, 3.5], y: [-2, 14], l: 30, r: 14, t: top + 6, b: 20, xt: [0, 1, 2, 3], yt: [0, 5, 10] });
    ctx.save(); A.clip();
    if (s >= 3) for (const [a, b, up] of [[-0.5, 1, true], [1, 2, false], [2, 3.5, true]]) { ctx.fillStyle = up ? col.s[2] : col.s[1]; ctx.globalAlpha = 0.16; ctx.fillRect(A.X(a), A.T, A.X(b) - A.X(a), A.B - A.T); ctx.globalAlpha = 1; }
    plot(ctx, A.X, A.Y, f, -0.5, 3.5, col.ink, 3);
    if (s >= 1 && s <= 2) plot(ctx, A.X, A.Y, d, -0.5, 3.5, col.s[0], 2, 100, 1e9);
    ctx.restore();
    if (s >= 2) { [1, 2].forEach((x) => { line(ctx, [[A.X(x), A.B], [A.X(x), A.T]], col.muted, 1.2, [3, 3]); dot(ctx, A.X(x), A.Y(0), 4.5, col.s[0], col.panel); }); }
    if (s >= 3) { ['+', '−', '+'].forEach((sg, i) => text(ctx, `f′ ${sg}`, A.X([0.25, 1.5, 2.75][i]), A.B - 12, { color: sg === '+' ? col.s[2] : col.s[1], size: 13, weight: 800, align: 'center' })); }
    if (s >= 4) {
      dot(ctx, A.X(1), A.Y(f(1)), 7, col.s[1], col.ink); text(ctx, 'local max (1, 6)', A.X(1) - 6, A.Y(6) - 14, { color: col.s[1], size: 12, weight: 800, halo: col.panel, align: 'right' });
      dot(ctx, A.X(2), A.Y(f(2)), 7, col.s[2], col.ink); text(ctx, 'local min (2, 5)', A.X(2) + 8, A.Y(5) + 18, { color: col.s[2], size: 12, weight: 800, halo: col.panel });
    }
    if (s === 1) text(ctx, 'coloured curve: f′', A.R - 6, A.T + 12, { color: col.s[0], size: 11.5, weight: 700, align: 'right', halo: col.panel });
    if (s === 2) text(ctx, 'f′ crosses zero here', A.X(1.5), A.Y(0) + 16, { color: col.s[0], size: 11.5, weight: 700, align: 'center', halo: col.panel });
    text(ctx, s >= 4 ? 'f″(1) = −6 < 0, f″(2) = +6 > 0: second test agrees' : 'f is the black curve', w / 2, h - 12, { color: col.muted, size: 12, weight: 600, align: 'center' });
  };
  return { step(i) { step = Math.min(i, 4); cv.redraw(); } };
}
