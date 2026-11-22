// 3.2 What "least squares" adds up, step by step: three points, then three candidate lines (the flat mean
// line, y = 2x and the least-squares line y = 1.5x + 2/3), each with its residuals drawn as real squares
// and their total, the sum of squared errors.
import { canvas, axes, text, title, line, dot, ease, loop, calm } from '../../kit.js';

const P = [[1, 2], [2, 4], [3, 5]];
const LINES = [null, [0, 11 / 3], [2, 0], [1.5, 2 / 3], [1.5, 2 / 3]]; // [m, c] per step
const NAME = ['', 'flat line at the mean, ŷ = 3.67', 'ŷ = 2x', 'least squares, ŷ = 1.5x + 0.67', 'least squares, ŷ = 1.5x + 0.67'];
export default function (host) {
  const cv = canvas(host, { aspect: 0.75, max: 380, min: 270, label: 'Three points with a line and the squares of their residuals' });
  let step = 0, prev = 0, k = 1;
  const anim = loop(host, (dt) => { if (k < 1) { k = Math.min(1, k + dt * 1.2); cv.redraw(); } }, { autoplay: false });
  cv.draw = (ctx, w, h, col) => {
    const A = axes(ctx, w, h, col, { x: [0, 4], y: [0, 6], xlabel: 'sunshine (hours)', ylabel: 'tubs sold (tens)', l: 44, t: 64 });
    const unitY = (A.B - A.T) / 6;
    const L1 = LINES[step], L0 = LINES[prev] || L1, e = ease(k);
    if (L1) {
      const m = L0[0] + (L1[0] - L0[0]) * e, c = L0[1] + (L1[1] - L0[1]) * e;
      let sse = 0;
      for (const [x, y] of P) {
        const yh = m * x + c, r = y - yh; sse += r * r;
        // the square on the residual: side |r| in y units, drawn the same pixel length across
        const side = Math.abs(r) * unitY, x0 = A.X(x), top = A.Y(Math.max(y, yh));
        ctx.save(); ctx.globalAlpha = 0.28; ctx.fillStyle = col.s[2]; ctx.fillRect(x0, top, side, side); ctx.restore();
        line(ctx, [[x0, A.Y(y)], [x0, A.Y(yh)]], col.s[2], 2);
      }
      ctx.save(); A.clip(); line(ctx, [[A.X(0), A.Y(c)], [A.X(4), A.Y(m * 4 + c)]], col.s[0], 2.5); ctx.restore();
      if (k >= 1) {
        text(ctx, NAME[step], A.L + 8, A.T - 32, { color: col.ink, size: 12, weight: 600, halo: col.panel });
        text(ctx, `sum of squares = ${sse.toFixed(2)}`, A.L + 8, A.T - 14, { color: col.ink, size: 13, weight: 700, halo: col.panel });
      }
      if (step === 4) { dot(ctx, A.X(2), A.Y(11 / 3), 5, col.ink); text(ctx, 'point of means (2, 3.67)', A.X(2) + 8, A.Y(11 / 3) + 16, { color: col.ink, size: 11, halo: col.panel }); }
    } else text(ctx, 'means: x̄ = 2, ȳ = 3.67', A.L + 8, A.T - 32, { color: col.ink, size: 12, weight: 600 });
    for (const [x, y] of P) dot(ctx, A.X(x), A.Y(y), 5.5, col.s[1]);
    title(ctx, 'Adding up squared misses', col);
  };
  cv.redraw();
  return { step(i) { prev = step; step = Math.min(i, LINES.length - 1); k = calm() || !LINES[prev] ? 1 : 0; cv.redraw(); anim.play(); } };
}
