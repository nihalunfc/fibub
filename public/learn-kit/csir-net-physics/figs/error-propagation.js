// 7.2 Error propagation tested by simulation. 20 000 values of x are drawn from a Gaussian (mean 1, chosen relative
// spread) and pushed through f(x). The histogram is the true distribution of f; the curve is the Gaussian that
// first-order propagation predicts (mean f(1), sigma |f'(1)| sigma_x). For small spreads they agree; as the spread
// grows the true distribution skews and its mean shifts by about f''(1) sigma^2 / 2, which linear propagation misses.
import { canvas, axes, line, row, slider, choice, readout, title, text, fmt, rng } from '../../kit.js';

const F = {
  sq: { name: 'f = x²', f: (x) => x * x, d1: 2, d2: 2, lo: -0.2, hi: 3 },
  inv: { name: 'f = 1/x', f: (x) => 1 / x, d1: -1, d2: 2, lo: 0, hi: 3 },
  ln: { name: 'f = ln x', f: (x) => Math.log(x), d1: 1, d2: -1, lo: -1.6, hi: 0.9 },
  cos: { name: 'f = cos(x − 1) (a stationary point)', f: (x) => Math.cos(x - 1), d1: 0, d2: -1, lo: 0.6, hi: 1.05 },
};
const N = 20000;
export default function (host) {
  const cv = canvas(host, { aspect: 0.62, max: 400, min: 260, label: 'Histogram of a function of a Gaussian variable compared with the linear error-propagation prediction' });
  let key = 'sq', rel = 0.1;
  const ctl = row(host);
  choice(ctl, 'Function', [['sq', 'x²'], ['inv', '1/x'], ['ln', 'ln x'], ['cos', 'cos(x−1)']], key, (v) => { key = v; redo(); });
  slider(ctl, { label: 'Spread σₓ (x has mean 1)', min: 0.02, max: 0.35, step: 0.01, value: rel, fmt: (v) => v.toFixed(2), oninput: (v) => { rel = v; redo(); } });
  const out = readout(host);
  const r0 = rng(11), Z = new Float64Array(N);
  for (let i = 0; i < N; i++) { const u = Math.max(1e-12, r0()), v = r0(); Z[i] = Math.sqrt(-2 * Math.log(u)) * Math.cos(2 * Math.PI * v); }
  let hist = [], st = {};
  const redo = () => {
    const fn = F[key], vals = [];
    for (let i = 0; i < N; i++) { const x = 1 + rel * Z[i]; if (x > 0.02) vals.push(fn.f(x)); }
    const m = vals.reduce((a, b) => a + b, 0) / vals.length, sd = Math.sqrt(vals.reduce((a, b) => a + (b - m) ** 2, 0) / (vals.length - 1));
    const lin = Math.abs(fn.d1) * rel, f0 = fn.f(1);
    const lo = key === 'cos' ? 1 - 4.5 * rel * rel : Math.max(fn.lo, f0 - 4.5 * Math.max(lin, 0.01)), hi = key === 'cos' ? 1.01 : Math.min(fn.hi, f0 + 4.5 * Math.max(lin, 0.01));
    const nb = 60, bw = (hi - lo) / nb, cnt = new Array(nb).fill(0);
    for (const v of vals) { const k = Math.floor((v - lo) / bw); if (k >= 0 && k < nb) cnt[k]++; }
    hist = cnt.map((c, k) => [lo + (k + 0.5) * bw, c / (vals.length * bw)]);
    st = { m, sd, lin, f0, lo, hi, shift: 0.5 * fn.d2 * rel * rel };
    cv.redraw();
    out.innerHTML = `${F[key].name}: simulated mean <b>${fmt(m, 4)}</b> and spread <b>${fmt(sd, 3)}</b>. Linear propagation predicts mean ${fmt(f0, 4)} and spread <b>${fmt(lin, 3)}</b>${key === 'cos' ? ' (zero: the slope vanishes at x = 1; the true spread is about σ²/√2 = ' + fmt(rel * rel / Math.SQRT2, 3) + ')' : ''}. Second order shifts the mean by f″σ²/2 = ${fmt(st.shift, 3)}.`;
  };
  cv.draw = (ctx, w, h, col) => {
    const top = title(ctx, 'Is linear error propagation good enough?', col);
    const ymax = Math.max(...hist.map((p) => p[1])) * 1.15 || 1;
    const a = axes(ctx, w, h, col, { x: [st.lo, st.hi], y: [0, ymax], xlabel: 'value of f', ylabel: 'probability density', t: top + 6 });
    ctx.save(); a.clip();
    const bw = hist.length > 1 ? hist[1][0] - hist[0][0] : 0.1;
    ctx.fillStyle = col.s[1]; ctx.globalAlpha = 0.45;
    for (const [x, y] of hist) ctx.fillRect(a.X(x - bw / 2), a.Y(y), Math.max(1, a.X(x + bw / 2) - a.X(x - bw / 2) - 0.5), a.Y(0) - a.Y(y));
    ctx.globalAlpha = 1;
    if (st.lin > 1e-9) {
      const pts = []; for (let i = 0; i <= 200; i++) { const x = st.lo + (st.hi - st.lo) * i / 200; pts.push([a.X(x), a.Y(Math.exp(-((x - st.f0) ** 2) / (2 * st.lin ** 2)) / (st.lin * Math.sqrt(2 * Math.PI)))]); }
      line(ctx, pts, col.s[0], 2.3);
    }
    line(ctx, [[a.X(st.m), a.T], [a.X(st.m), a.B]], col.s[3], 1.5, [4, 3]);
    ctx.restore();
    text(ctx, 'histogram: simulation', a.R - 6, a.T + 12, { color: col.s[1], size: 11, align: 'right', halo: col.panel });
    text(ctx, 'curve: linear prediction', a.R - 6, a.T + 27, { color: col.s[0], size: 11, align: 'right', halo: col.panel });
    text(ctx, 'dashed: simulated mean', a.R - 6, a.T + 42, { color: col.s[3], size: 11, align: 'right', halo: col.panel });
  };
  redo();
}
