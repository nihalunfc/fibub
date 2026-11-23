// Class 11 Maths, Limits and Derivatives: the limit as "what the function is heading for". Slide h down: the values of f at a - h (from the left, blue)
// and at a + h (from the right, orange) either close in on one number, which is the limit, or they do not (1/x, |x|/x). The value f(a) itself is not needed.
import { canvas, text, title, dot, row, slider, readout, choice, loop } from '../../kit.js';
import { plot, curve, r2 } from '../c11m-lib.js';

const FUNS = {
  hole: { name: '(x² − 1)/(x − 1) near x = 1', a: 1, f: (x) => (x * x - 1) / (x - 1), x: [-1, 3], y: [-1, 5], L: 2, hole: true },
  sinc: { name: 'sin x / x near x = 0', a: 0, f: (x) => Math.sin(x) / x, x: [-6, 6], y: [-0.5, 1.5], L: 1, hole: true },
  cosq: { name: '(1 − cos x)/x² near x = 0', a: 0, f: (x) => (1 - Math.cos(x)) / (x * x), x: [-6, 6], y: [-0.2, 0.8], L: 0.5, hole: true },
  sign: { name: '|x| / x near x = 0', a: 0, f: (x) => Math.abs(x) / x, x: [-3, 3], y: [-2, 2], L: null },
  inv: { name: '1 / x near x = 0', a: 0, f: (x) => 1 / x, x: [-3, 3], y: [-6, 6], L: null },
};
export default function (host) {
  let k = 'hole', lg = 0, play = true;
  const cv = canvas(host, { aspect: 0.82, max: 440, min: 300, label: 'A graph with two dots approaching x = a from the left and from the right, and the values of the function' });
  const ctl = row(host), ro = readout(host);
  choice(ctl, 'Function', [['hole', '(x²−1)/(x−1)'], ['sinc', 'sin x / x'], ['cosq', '(1−cos x)/x²'], ['sign', '|x| / x'], ['inv', '1 / x']], k, (v) => { k = v; lg = 0; play = true; cv.redraw(); });
  const sl = slider(ctl, { label: 'distance h from a', min: -3, max: 0, step: 0.02, value: lg, fmt: (v) => 'h = ' + (+Math.pow(10, v).toPrecision(2)), oninput: (v) => { lg = v; play = false; an.pause(); cv.redraw(); } });
  const an = loop(host, (dt) => { if (!play) return; lg -= dt * 0.5; if (lg < -3.05) lg = 0; sl.set(lg); cv.redraw(); });
  an.button(ctl);
  cv.draw = (ctx, w, h, col) => {
    const F = FUNS[k], top = title(ctx, 'Approach ' + F.name, col), P = plot(ctx, w, h, col, { x: F.x, y: F.y, sx: F.x[1] > 4 ? 2 : 1, sy: F.y[1] - F.y[0] > 6 ? 2 : F.y[1] - F.y[0] > 3 ? 1 : 0.5, t: top + 6, b: 20, fy: (v) => r2(v, 1) });
    curve(ctx, P, F.f, col.s[0], 2.5, 60);
    const hh = Math.pow(10, lg), a = F.a, xl = a - hh, xr = a + hh, yl = F.f(xl), yr = F.f(xr);
    if (F.hole) { ctx.save(); ctx.beginPath(); ctx.arc(P.X(a), P.Y(F.L), 5, 0, 7); ctx.fillStyle = col.panel; ctx.fill(); ctx.strokeStyle = col.s[0]; ctx.lineWidth = 2; ctx.stroke(); ctx.restore(); }
    const dd = (x, y, c) => { if (y >= F.y[0] && y <= F.y[1]) { ctx.save(); ctx.strokeStyle = c; ctx.setLineDash([3, 3]); ctx.beginPath(); ctx.moveTo(P.X(x), P.Y(0)); ctx.lineTo(P.X(x), P.Y(y)); ctx.moveTo(P.X(x), P.Y(y)); ctx.lineTo(P.X(0), P.Y(y)); ctx.stroke(); ctx.restore(); dot(ctx, P.X(x), P.Y(y), 6, c, col.panel); } };
    dd(xl, yl, col.s[1]); dd(xr, yr, col.s[3]);
    const g = (v) => (Math.abs(v) >= 1e4 ? (v > 0 ? '+' : '−') + 'very large' : r2(v, 5));
    const verdict = F.L !== null ? `Both sides head for <b>${F.L}</b>, so the limit is ${F.L}.` : k === 'sign' ? 'Left side stays at −1, right side stays at +1: <b>no limit</b>.' : 'Left side runs to −∞, right side to +∞: <b>no limit</b>.';
    ro.innerHTML = `From the left: f(${r2(xl, 5)}) = <b style="color:${col.s[1]}">${g(yl)}</b>. From the right: f(${r2(xr, 5)}) = <b style="color:${col.s[3]}">${g(yr)}</b>. ${verdict}`;
  };
  cv.redraw();
}
