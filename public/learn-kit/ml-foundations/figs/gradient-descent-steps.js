// 3.3 Gradient descent on a straight line, step by step: three points (0, 1), (1, 3), (2, 5), starting at
// w = 0, b = 0 with learning rate 0.2. Each step shows the current line, its errors and the mean squared
// error; the last step jumps ahead 50 steps to w = 2, b = 1.
import { canvas, axes, text, title, line, dot, ease, loop, calm } from '../../kit.js';

const X = [0, 1, 2], Y = [1, 3, 5], ETA = 0.2;
const mse = (w, b) => X.reduce((s, x, i) => s + (w * x + b - Y[i]) ** 2, 0) / 3;
const grad = (w, b) => [(2 / 3) * X.reduce((s, x, i) => s + (w * x + b - Y[i]) * x, 0), (2 / 3) * X.reduce((s, x, i) => s + (w * x + b - Y[i]), 0)];
const PATH = [[0, 0]];
for (let t = 0; t < 60; t++) { const [w, b] = PATH[t], [gw, gb] = grad(w, b); PATH.push([w - ETA * gw, b - ETA * gb]); }
const AT = [0, 1, 2, 3, 60]; // which point of the path each player step shows
export default function (host) {
  const cv = canvas(host, { aspect: 0.7, max: 360, min: 260, label: 'A line moving towards three points by gradient descent' });
  let step = 0, prev = 0, k = 1;
  const anim = loop(host, (dt) => { if (k < 1) { k = Math.min(1, k + dt * 1.1); cv.redraw(); } }, { autoplay: false });
  cv.draw = (ctx, w, h, col) => {
    const A = axes(ctx, w, h, col, { x: [-0.3, 2.5], y: [-0.5, 6], xlabel: 'x', ylabel: 'y', l: 40, t: 80 });
    const [w0, b0] = PATH[AT[prev]], [w1, b1] = PATH[AT[step]], e = ease(k);
    const ww = w0 + (w1 - w0) * e, bb = b0 + (b1 - b0) * e;
    // the target line, faint
    line(ctx, [[A.X(-0.3), A.Y(0.4)], [A.X(2.5), A.Y(6)]], col.line, 1.5, [4, 4]);
    for (let i = 0; i < 3; i++) line(ctx, [[A.X(X[i]), A.Y(Y[i])], [A.X(X[i]), A.Y(ww * X[i] + bb)]], col.s[2], 2);
    ctx.save(); A.clip(); line(ctx, [[A.X(-0.3), A.Y(ww * -0.3 + bb)], [A.X(2.5), A.Y(ww * 2.5 + bb)]], col.s[0], 2.5); ctx.restore();
    for (let i = 0; i < 3; i++) dot(ctx, A.X(X[i]), A.Y(Y[i]), 5.5, col.s[1]);
    const [gw, gb] = grad(ww, bb).map((v) => (Math.abs(v) < 0.005 ? 0 : v));
    text(ctx, `${AT[step] === 60 ? 'after 60 steps' : 'step ' + AT[step]}:  w = ${ww.toFixed(2)},  b = ${bb.toFixed(2)}`, A.L + 8, A.T - 50, { color: col.ink, size: 12.5, weight: 700, halo: col.panel });
    text(ctx, `error (MSE) = ${mse(ww, bb).toFixed(3)}`, A.L + 8, A.T - 33, { color: col.ink, size: 12, halo: col.panel });
    text(ctx, `slopes: ∂L/∂w = ${gw.toFixed(2)}, ∂L/∂b = ${gb.toFixed(2)}`, A.L + 8, A.T - 16, { color: col.muted, size: 11.5, halo: col.panel });
    title(ctx, 'Walking the line downhill', col);
  };
  cv.redraw();
  return { step(i) { prev = step; step = Math.min(i, AT.length - 1); k = calm() ? 1 : 0; cv.redraw(); anim.play(); } };
}
