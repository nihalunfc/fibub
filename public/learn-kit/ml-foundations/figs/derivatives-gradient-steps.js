// 1.5 Three steps of gradient descent on f(x) = (x - 2)^2 + 1 from x = 0 with learning rate 0.25:
// at each point the tangent shows the slope, and an arrow shows the step x_new = x - 0.25 * slope.
import { canvas, axes, text, title, line, dot, arrow, ease, loop, calm } from '../../kit.js';

const f = (x) => (x - 2) ** 2 + 1, d = (x) => 2 * (x - 2), ETA = 0.25;
const XS = [0, 1, 1.5, 1.75];
export default function (host) {
  const cv = canvas(host, { aspect: 0.6, max: 340, min: 240, label: 'Gradient descent stepping down the curve f(x) = (x minus 2) squared plus 1' });
  let step = 0, k = 1;
  const anim = loop(host, (dt) => { if (k < 1) { k = Math.min(1, k + dt * 1.1); cv.redraw(); } }, { autoplay: false });
  cv.draw = (ctx, w, h, col) => {
    const A = axes(ctx, w, h, col, { x: [-0.5, 4.5], y: [0, 8], xlabel: 'x (the setting)', ylabel: 'f(x) (the error)', l: 44 });
    const pts = []; for (let x = -0.5; x <= 4.5; x += 0.05) pts.push([A.X(x), A.Y(Math.min(8.5, f(x)))]);
    ctx.save(); A.clip(); line(ctx, pts, col.s[0], 2.5);
    const i = Math.min(step, XS.length - 2), x0 = XS[i], x1 = XS[i + 1], m = d(x0);
    // tangent at x0
    line(ctx, [[A.X(x0 - 1.2), A.Y(f(x0) - 1.2 * m)], [A.X(x0 + 1.2), A.Y(f(x0) + 1.2 * m)]], col.s[2], 1.8, [5, 4]);
    ctx.restore();
    for (let j = 0; j < i; j++) dot(ctx, A.X(XS[j]), A.Y(f(XS[j])), 4, col.muted);
    const e = step >= XS.length - 1 ? 1 : ease(k), xm = x0 + (x1 - x0) * e;
    dot(ctx, A.X(x0), A.Y(f(x0)), 6, col.s[1]);
    if (e > 0.05) arrow(ctx, A.X(x0), A.Y(0) - 10, A.X(xm), A.Y(0) - 10, col.ink, 2);
    dot(ctx, A.X(xm), A.Y(f(xm)), 6, col.s[3]);
    dot(ctx, A.X(2), A.Y(1), 3, col.ink);
    text(ctx, 'bottom', A.X(2) + 6, A.Y(1) + 12, { color: col.muted, size: 10.5 });
    text(ctx, `x = ${x0}: slope ${m}, step −0.25 × (${m}) = +${-ETA * m}`, A.R - 4, 38, { color: col.ink, size: 12.5, weight: 700, align: 'right', halo: col.panel });
    text(ctx, `new x = ${x1}, error ${f(x0)} → ${f(x1)}`, A.R - 4, 56, { color: col.ink, size: 12, align: 'right', halo: col.panel });
    title(ctx, 'Step against the slope', col);
  };
  cv.redraw();
  return { step(i) { step = i; k = calm() ? 1 : 0; cv.redraw(); anim.play(); } };
}
