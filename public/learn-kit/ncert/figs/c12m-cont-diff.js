// Class 12 Differentiability: the derivative at x = a is the limit of the secant slope (f(a+h) - f(a))/h as h shrinks. It exists only
// if the slope from the right (h > 0) and from the left (h < 0) settle on the same number. |x| has a sharp corner at 0 (left slope -1,
// right slope +1); x^2 and x|x| are smooth; x^(1/3) has a vertical tangent (the slopes grow without limit).
import { canvas, text, title, line, dot, axes, row, slider, choice, readout } from '../../kit.js';
import { plot } from '../c12m-lib.js';

const FN = { abs: [(x) => Math.abs(x), '|x|'], sq: [(x) => x * x, 'x²'], xab: [(x) => x * Math.abs(x), 'x|x|'], cbrt: [(x) => Math.cbrt(x), 'x^(1/3)'] };
export default function (host) {
  let key = 'abs', a = 0, hh = 0.8;
  const cv = canvas(host, { aspect: 0.85, max: 440, min: 300, label: 'Secant lines from the left and from the right of a point as the gap h shrinks' });
  const ctl = row(host), out = readout(host);
  choice(ctl, 'f(x) =', Object.entries(FN).map(([k, v]) => [k, v[1]]), key, (v) => { key = v; say(); });
  slider(ctl, { label: 'point a', min: -1, max: 1, step: 0.25, value: a, fmt: (v) => String(v), oninput: (v) => { a = v; say(); } });
  slider(ctl, { label: 'gap h', min: 0.01, max: 1, step: 0.01, value: hh, fmt: (v) => v.toFixed(2), oninput: (v) => { hh = v; say(); } });
  const sl = (f, h) => (f(a + h) - f(a)) / h;
  function say() {
    const f = FN[key][0], r = sl(f, hh), l = sl(f, -hh), r0 = sl(f, 1e-4), l0 = sl(f, -1e-4);
    const same = Math.abs(r0 - l0) < 0.01 && Math.abs(r0) < 50;
    out.innerHTML = `At a = ${a}, gap h = ${hh.toFixed(2)}: right slope = <b>${r.toFixed(3)}</b>, left slope = <b>${l.toFixed(3)}</b>. As h → 0 they head to <b>${Math.abs(r0) > 50 ? '∞' : r0.toFixed(3)}</b> (right) and <b>${Math.abs(l0) > 50 ? '∞' : l0.toFixed(3)}</b> (left): ` + (same ? '<b>equal, so f is differentiable here.</b>' : '<b>not equal, so f is NOT differentiable here.</b>');
    cv.redraw();
  }
  cv.draw = (ctx, w, h, col) => {
    const f = FN[key][0]; title(ctx, `Left and right slopes of f(x) = ${FN[key][1]}`, col);
    const A = axes(ctx, w, h, col, { x: [-2, 2], y: [-1.5, 3], l: 30, r: 14, t: 40, b: 28, xt: [-2, -1, 0, 1, 2], yt: [-1, 0, 1, 2, 3] });
    ctx.save(); A.clip(); plot(ctx, A.X, A.Y, f, -2, 2, col.muted, 2.5);
    const ext = (h0, c0) => { const m = sl(f, h0), x0 = a - 1.5, x1 = a + 1.5; line(ctx, [[A.X(x0), A.Y(f(a) + m * (x0 - a))], [A.X(x1), A.Y(f(a) + m * (x1 - a))]], c0, 2.5, [6, 4]); };
    ext(hh, col.s[3]); ext(-hh, col.s[0]); ctx.restore();
    dot(ctx, A.X(a), A.Y(f(a)), 6, col.ink, col.panel); dot(ctx, A.X(a + hh), A.Y(f(a + hh)), 4.5, col.s[3]); dot(ctx, A.X(a - hh), A.Y(f(a - hh)), 4.5, col.s[0]);
    text(ctx, 'right secant', A.R - 6, A.T + 10, { color: col.s[3], size: 11.5, weight: 700, align: 'right', halo: col.panel });
    text(ctx, 'left secant', A.R - 6, A.T + 26, { color: col.s[0], size: 11.5, weight: 700, align: 'right', halo: col.panel });
  };
  say();
}
