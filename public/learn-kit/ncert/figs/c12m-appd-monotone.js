// Class 12 Increasing and decreasing functions: where f'(x) > 0 the graph climbs (f increasing), where f'(x) < 0 it falls (f decreasing), and at a
// point with f'(x) = 0 it levels off. The top graph is f, shaded by the sign of f'; the lower graph is f' itself. Slide the point and watch the
// tangent turn from up to flat to down while f' crosses the axis.
import { canvas, text, title, line, dot, axes, row, slider, choice, readout } from '../../kit.js';
import { plot } from '../c12m-lib.js';

const FN = {
  cubic: { f: (x) => x ** 3 - 3 * x, d: (x) => 3 * x * x - 3, n: 'x³ − 3x', X: [-2.5, 2.5], Y: [-4, 4], dY: [-4, 10] },
  quad: { f: (x) => 4 - x * x, d: (x) => -2 * x, n: '4 − x²', X: [-2.5, 2.5], Y: [-3, 5], dY: [-6, 6] },
  exp: { f: (x) => Math.exp(x / 1.2), d: (x) => Math.exp(x / 1.2) / 1.2, n: 'e^(x/1.2)', X: [-2.5, 2.5], Y: [0, 8.5], dY: [-1, 7] },
  sin: { f: (x) => 2 * Math.sin(1.5 * x), d: (x) => 3 * Math.cos(1.5 * x), n: '2 sin 1.5x', X: [-2.5, 2.5], Y: [-3, 3], dY: [-4, 4] },
};
export default function (host) {
  let key = 'cubic', x0 = -1.8;
  const cv = canvas(host, { aspect: 1.1, max: 460, min: 340, label: 'A curve shaded green where it rises and red where it falls, with the graph of its derivative below' });
  const ctl = row(host), out = readout(host);
  choice(ctl, 'f(x) =', Object.entries(FN).map(([k, v]) => [k, v.n]), key, (v) => { key = v; say(); });
  slider(ctl, { label: 'x', min: -2.5, max: 2.5, step: 0.05, value: x0, fmt: (v) => v.toFixed(2), oninput: (v) => { x0 = v; say(); } });
  function say() {
    const F = FN[key], d = F.d(x0);
    out.innerHTML = `At x = ${x0.toFixed(2)}: f′(x) = <b>${d.toFixed(2)}</b>, ${Math.abs(d) < 0.08 ? '<b>about 0: a stationary point, the tangent is flat.</b>' : d > 0 ? 'positive, so f is <b>increasing</b> here (the tangent climbs).' : 'negative, so f is <b>decreasing</b> here (the tangent falls).'}`;
    cv.redraw();
  }
  cv.draw = (ctx, w, h, col) => {
    const F = FN[key]; title(ctx, 'Sign of f′ decides rising or falling', col);
    const mid = Math.round(h * 0.55);
    const A = axes(ctx, w, mid, col, { x: F.X, y: F.Y, l: 30, r: 14, t: 38, b: 6, grid: false, xt: [-2, 0, 2], yt: [] });
    const B = axes(ctx, w, h, col, { x: F.X, y: F.dY, l: 30, r: 14, t: mid + 8, b: 28, xt: [-2, 0, 2], yt: [0], xlabel: 'x' });
    const N = 200, xs = (i) => F.X[0] + ((F.X[1] - F.X[0]) * i) / N, up = (i) => F.d((xs(i) + xs(i + 1)) / 2) > 0;
    const runs = []; for (let i = 0; i < N; i++) { if (runs.length && runs[runs.length - 1].up === up(i)) runs[runs.length - 1].b = xs(i + 1); else runs.push({ a: xs(i), b: xs(i + 1), up: up(i) }); }
    runs.forEach((r) => { ctx.fillStyle = r.up ? col.s[2] : col.s[1]; ctx.globalAlpha = 0.16; ctx.fillRect(A.X(r.a), A.T, A.X(r.b) - A.X(r.a), A.B - A.T); ctx.globalAlpha = 1; });
    ctx.save(); ctx.beginPath(); ctx.rect(A.L, A.T, A.R - A.L, A.B - A.T); ctx.clip(); plot(ctx, A.X, A.Y, F.f, F.X[0], F.X[1], col.ink, 3);
    const m = F.d(x0), dx = 0.7; line(ctx, [[A.X(x0 - dx), A.Y(F.f(x0) - m * dx)], [A.X(x0 + dx), A.Y(F.f(x0) + m * dx)]], col.s[3], 2.5); ctx.restore();
    dot(ctx, A.X(x0), A.Y(F.f(x0)), 6, col.s[3], col.ink);
    ctx.save(); ctx.beginPath(); ctx.rect(B.L, B.T, B.R - B.L, B.B - B.T); ctx.clip();
    ctx.globalAlpha = 0.3;
    for (const r of runs) { ctx.fillStyle = r.up ? col.s[2] : col.s[1]; ctx.beginPath(); ctx.moveTo(B.X(r.a), B.Y(0)); for (let u = r.a; u <= r.b + 1e-9; u += (r.b - r.a) / 40) ctx.lineTo(B.X(u), B.Y(F.d(u))); ctx.lineTo(B.X(r.b), B.Y(0)); ctx.closePath(); ctx.fill(); }
    ctx.globalAlpha = 1;
    plot(ctx, B.X, B.Y, F.d, F.X[0], F.X[1], col.s[0], 2.5); ctx.restore();
    dot(ctx, B.X(x0), B.Y(F.d(x0)), 5.5, col.s[3], col.ink);
    text(ctx, 'f(x)', A.L + 6, A.T + 10, { color: col.ink, size: 12, weight: 800 }); text(ctx, 'f′(x)', B.L + 6, B.T + 10, { color: col.s[0], size: 12, weight: 800 });
  };
  say();
}
