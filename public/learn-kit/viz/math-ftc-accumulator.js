// Area as a running total. Slide x: the shaded area under f from a to x is F(x) = ∫ₐˣ f(t)dt, and the lower graph
// plots F(x) as you go. Notice that F rises while f is positive, falls while f is negative, and the slope of F at any
// point equals the height of f there: that is the Fundamental Theorem, F′(x) = f(x). Change the starting point a to
// see F shift up or down by a constant, which is the "+ C" of an indefinite integral.
import { canvas, axes, row, slider, choice, readout, dot, line, text } from '../kit.js';
import { curve, f2 } from './_math.js';

const FN = { sin: ['sin x', Math.sin, (x) => -Math.cos(x)], quad: ['x² − 2', (x) => x * x - 2, (x) => x ** 3 / 3 - 2 * x], lin: ['x', (x) => x, (x) => x * x / 2], cos2: ['2cos x', (x) => 2 * Math.cos(x), (x) => 2 * Math.sin(x)] };
export default function (host) {
  let k = 'sin', x = 1.5, a = 0;
  const cv = canvas(host, { aspect: 1.05, max: 430, min: 310, label: 'A function with its shaded area and the running total below' });
  const c = row(host), c2 = row(host);
  choice(c, 'f(x)', Object.entries(FN).map(([id, v]) => [id, v[0]]), k, (v) => { k = v; re(); });
  slider(c2, { label: 'x', min: -3, max: 3, step: 0.05, value: x, fmt: (v) => f2(v), oninput: (v) => { x = v; re(); } });
  slider(c2, { label: 'start a', min: -3, max: 3, step: 0.1, value: a, fmt: (v) => f2(v, 1), oninput: (v) => { a = v; re(); } });
  const out = readout(host);
  const Fx = (t) => FN[k][2](t) - FN[k][2](a);
  function re() { cv.redraw(); const f = FN[k][1]; out.innerHTML = `F(${f2(x)}) = ∫ from ${f2(a, 1)} to ${f2(x)} of f = F(x) − F(a) = <b>${f2(Fx(x), 4)}</b>. Height of f at x = ${f2(f(x), 3)}; slope of the lower graph at x ≈ ${f2((Fx(x + 0.001) - Fx(x - 0.001)) / 0.002, 3)}: the same number, because F′ = f. Where f < 0 the area counts negative and F falls.`; }
  cv.draw = (ctx, w, h, col) => {
    const f = FN[k][1], top = Math.round(h * 0.5), ys = Array.from({ length: 121 }, (_, i) => f(-3 + i * 0.05));
    ctx.save(); ctx.beginPath(); ctx.rect(0, 0, w, top); ctx.clip();
    const A = axes(ctx, w, top, col, { x: [-3, 3], y: [Math.min(...ys, 0) - 0.5, Math.max(...ys) + 0.5], l: 30, b: 20, t: 22, r: 10, xt: [-3, -2, -1, 0, 1, 2, 3], yt: [] });
    ctx.beginPath(); ctx.moveTo(A.X(a), A.Y(0)); const lo = Math.min(a, x), hi = Math.max(a, x); for (let t = a; (x >= a ? t <= x : t >= x); t += (x >= a ? 0.02 : -0.02)) ctx.lineTo(A.X(t), A.Y(f(t))); ctx.lineTo(A.X(x), A.Y(f(x))); ctx.lineTo(A.X(x), A.Y(0)); ctx.closePath(); ctx.globalAlpha = 0.3; ctx.fillStyle = col.s[2]; ctx.fill(); ctx.globalAlpha = 1;
    curve(ctx, A, f, -3, 3, col.s[0], 3); line(ctx, [[A.X(x), A.T], [A.X(x), A.B]], col.muted, 1, [4, 3]); dot(ctx, A.X(x), A.Y(f(x)), 5, col.s[0], col.ink); dot(ctx, A.X(a), A.Y(0), 4, col.s[3]);
    text(ctx, 'f(x): shaded = area from a to x', A.L + 6, A.T + 8, { color: col.muted, size: 10 }); ctx.restore();
    ctx.save(); ctx.translate(0, top); ctx.beginPath(); ctx.rect(0, 0, w, h - top); ctx.clip();
    const vs = Array.from({ length: 121 }, (_, i) => Fx(-3 + i * 0.05)), B = axes(ctx, w, h - top, col, { x: [-3, 3], y: [Math.min(...vs, 0) - 0.3, Math.max(...vs, 0) + 0.3], l: 30, b: 24, t: 8, r: 10, xlabel: 'x', yt: [] });
    curve(ctx, B, Fx, -3, 3, col.s[1], 3); line(ctx, [[B.X(x), B.T], [B.X(x), B.B]], col.muted, 1, [4, 3]); dot(ctx, B.X(x), B.Y(Fx(x)), 5, col.s[1], col.ink);
    text(ctx, 'F(x) = running total of area', B.L + 6, B.T + 8, { color: col.s[1], size: 10, weight: 600 }); ctx.restore();
  };
  re();
}
