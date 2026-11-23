// Class 12 Continuity: "find k so that f is continuous". f(x) = kx + 2 for x <= 2 and f(x) = x^2 + 1 for x > 2. At x = 2 the left side gives 2k + 2
// and the right side heads to 5. Continuity needs them equal, so 2k + 2 = 5 and k = 1.5. Slide k and watch the gap close.
import { canvas, text, title, line, dot, axes, row, slider, button, readout } from '../../kit.js';
import { plot } from '../c12m-lib.js';

export default function (host) {
  let k = 3;
  const cv = canvas(host, { aspect: 0.8, max: 440, min: 290, label: 'A piecewise function with a constant k that you adjust until the two pieces meet at x equals 2' });
  const ctl = row(host), out = readout(host);
  const sk = slider(ctl, { label: 'k', min: -1, max: 4, step: 0.25, value: k, fmt: (v) => String(v), oninput: (v) => { k = v; say(); } });
  button(ctl, 'Make it continuous', () => { k = 1.5; sk.set(k); say(); });
  function say() {
    const Lh = 2 * k + 2, gap = 5 - Lh;
    out.innerHTML = `Left side at x = 2: k(2) + 2 = <b>${+Lh.toFixed(2)}</b>. Right side heads to 2² + 1 = <b>5</b>. Gap = ${+gap.toFixed(2)}. ${Math.abs(gap) < 1e-9 ? '<b>The pieces meet: continuous at x = 2 (k = 1.5).</b>' : 'There is a jump, so f is not continuous. Solve 2k + 2 = 5.'}`;
    cv.redraw();
  }
  cv.draw = (ctx, w, h, col) => {
    title(ctx, 'Choose k so the pieces meet at x = 2', col);
    const A = axes(ctx, w, h, col, { x: [-1, 4], y: [-2, 11], l: 34, r: 14, t: 40, b: 36, xt: [0, 2, 4], yt: [0, 5, 10], xlabel: 'x' });
    ctx.save(); A.clip();
    plot(ctx, A.X, A.Y, (x) => k * x + 2, -1, 2, col.s[0], 3); plot(ctx, A.X, A.Y, (x) => x * x + 1, 2, 4, col.s[3], 3);
    ctx.restore();
    const Lh = 2 * k + 2;
    dot(ctx, A.X(2), A.Y(Lh), 6, Math.abs(5 - Lh) < 1e-9 ? col.s[2] : col.s[0], col.panel); dot(ctx, A.X(2), A.Y(5), 5, col.panel, col.s[3]);
    if (Math.abs(5 - Lh) > 1e-9) line(ctx, [[A.X(2) + 4, A.Y(Lh)], [A.X(2) + 4, A.Y(5)]], col.s[2], 2.5, [3, 3]);
    text(ctx, `k = ${k}`, A.L + 8, A.T + 12, { color: col.s[0], size: 13, weight: 800, halo: col.panel });
  };
  say();
}
