// Class 12 Absolute maximum and minimum on a closed interval [a, b]: the extreme values of a continuous f can only be at the two ends or at critical points
// (where f' = 0) inside. Here f(x) = x^3 - 6x^2 + 9x + 1 has critical points x = 1 (f = 5) and x = 3 (f = 1). Slide the ends; the figure lists the candidates
// inside [a, b] and marks the absolute maximum and minimum.
import { canvas, text, title, line, dot, axes, row, slider, readout } from '../../kit.js';
import { plot } from '../c12m-lib.js';

const f = (x) => x ** 3 - 6 * x * x + 9 * x + 1;
export default function (host) {
  let a = 0, b = 4;
  const cv = canvas(host, { aspect: 0.95, max: 440, min: 310, label: 'A cubic curve on an adjustable interval with its absolute maximum and minimum marked' });
  const ctl = row(host), out = readout(host);
  slider(ctl, { label: 'left end a', min: -0.5, max: 2, step: 0.25, value: a, fmt: (v) => v.toFixed(2), oninput: (v) => { a = Math.min(v, b - 0.5); say(); } });
  slider(ctl, { label: 'right end b', min: 2.5, max: 4.5, step: 0.25, value: b, fmt: (v) => v.toFixed(2), oninput: (v) => { b = Math.max(v, a + 0.5); say(); } });
  const cand = () => [a, b, ...[1, 3].filter((c) => c > a && c < b)];
  function say() {
    const c = cand(), vs = c.map(f), mx = Math.max(...vs), mn = Math.min(...vs);
    out.innerHTML = `Candidates on [${a}, ${b}]: ${c.map((x, i) => `f(${x}) = ${vs[i].toFixed(2)}`).join(', ')}. <b>Absolute maximum ${mx.toFixed(2)}</b> at x = ${c[vs.indexOf(mx)]}, <b>absolute minimum ${mn.toFixed(2)}</b> at x = ${c[vs.indexOf(mn)]}.`;
    cv.redraw();
  }
  cv.draw = (ctx, w, h, col) => {
    title(ctx, 'Check the ends and the critical points', col);
    const A = axes(ctx, w, h, col, { x: [-1, 5], y: [-2, 22], l: 32, r: 14, t: 40, b: 26, xt: [0, 1, 2, 3, 4, 5], yt: [0, 10, 20] });
    ctx.save(); A.clip();
    ctx.fillStyle = col.soft; ctx.fillRect(A.X(a), A.T, A.X(b) - A.X(a), A.B - A.T);
    plot(ctx, A.X, A.Y, f, -1, 5, col.muted, 2); plot(ctx, A.X, A.Y, f, a, b, col.ink, 3.5); ctx.restore();
    const c = cand(), vs = c.map(f), mx = Math.max(...vs), mn = Math.min(...vs);
    c.forEach((x, i) => {
      const big = vs[i] === mx, small = vs[i] === mn, k = big ? col.s[1] : small ? col.s[2] : col.s[0];
      line(ctx, [[A.X(x), A.Y(vs[i])], [A.L, A.Y(vs[i])]], k, 1, [3, 3]);
      dot(ctx, A.X(x), A.Y(vs[i]), big || small ? 7 : 5, k, col.ink);
      text(ctx, `${big ? 'max ' : small ? 'min ' : ''}${vs[i].toFixed(0)}`, A.X(x) + 8, A.Y(vs[i]) - 9, { color: k, size: 11.5, weight: 800, halo: col.panel });
    });
    text(ctx, 'max and min are labelled', A.R - 6, A.T + 10, { color: col.muted, size: 11, weight: 700, align: 'right', halo: col.panel });
  };
  say();
}
