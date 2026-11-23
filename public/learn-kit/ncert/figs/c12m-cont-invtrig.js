// Class 12 Derivative of an inverse function: y = sin^-1 x is the mirror image of y = sin x in the line y = x. Mirroring turns a tangent
// of slope m into a tangent of slope 1/m. At the mirrored point of sin, the slope is cos y = sqrt(1 - x^2), so the slope of sin^-1 x is
// 1/sqrt(1 - x^2): it is 1 at x = 0 and shoots up as x nears 1 where the sine curve goes flat.
import { canvas, text, title, line, dot, axes, row, slider, readout } from '../../kit.js';
import { plot } from '../c12m-lib.js';

export default function (host) {
  let x0 = 0.6;
  const cv = canvas(host, { aspect: 0.95, max: 440, min: 300, label: 'The graph of arcsine, its mirror image sine, and their tangents with reciprocal slopes' });
  const ctl = row(host), out = readout(host);
  slider(ctl, { label: 'x', min: -0.95, max: 0.95, step: 0.01, value: x0, fmt: (v) => v.toFixed(2), oninput: (v) => { x0 = v; say(); } });
  function say() {
    const y0 = Math.asin(x0), mB = 1 / Math.sqrt(1 - x0 * x0), mA = Math.cos(y0);
    out.innerHTML = `At x = ${x0.toFixed(2)}: y = sin⁻¹x = ${y0.toFixed(3)}. The sine curve at the mirror point has slope cos y = ${mA.toFixed(3)}. So sin⁻¹ has slope 1/cos y = 1/√(1 − x²) = <b>${mB.toFixed(3)}</b> (product of the two slopes = ${(mA * mB).toFixed(2)}).`;
    cv.redraw();
  }
  cv.draw = (ctx, w, h, col) => {
    title(ctx, 'Mirror in y = x: slopes become reciprocals', col);
    const A = axes(ctx, w, h, col, { x: [-1.8, 1.8], y: [-1.8, 1.8], l: 28, r: 14, t: 40, b: 26, xt: [-1, 0, 1], yt: [-1, 0, 1] });
    const y0 = Math.asin(x0), mB = 1 / Math.sqrt(1 - x0 * x0), mA = Math.cos(y0);
    ctx.save(); A.clip();
    line(ctx, [[A.X(-1.8), A.Y(-1.8)], [A.X(1.8), A.Y(1.8)]], col.line, 1.5, [4, 4]);
    plot(ctx, A.X, A.Y, Math.sin, -Math.PI / 2, Math.PI / 2, col.s[0], 3); plot(ctx, A.X, A.Y, Math.asin, -1, 1, col.s[3], 3);
    const tg = (px, py, m, c0) => { const d = 0.9 / Math.hypot(1, m); line(ctx, [[A.X(px - d), A.Y(py - m * d)], [A.X(px + d), A.Y(py + m * d)]], c0, 2.5, [6, 4]); };
    tg(x0, y0, mB, col.s[3]); tg(y0, x0, mA, col.s[0]); ctx.restore();
    dot(ctx, A.X(x0), A.Y(y0), 6, col.s[3], col.ink); dot(ctx, A.X(y0), A.Y(x0), 6, col.s[0], col.ink);
    text(ctx, 'y = sin⁻¹ x', A.X(0.15), A.Y(1.5), { color: col.s[3], size: 12, weight: 800, halo: col.panel });
    text(ctx, 'y = sin x', A.X(1.0), A.Y(-0.9), { color: col.s[0], size: 12, weight: 800, halo: col.panel });
  };
  say();
}
