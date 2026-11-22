// Binomial distribution B(n, p): bars for P(X = r), r = 0..n. Move n, p and k; the bars at k (or from k up) are
// coloured and the readout gives P(X = k), P(X ≥ k), the mean np and the variance npq.
import { canvas, axes, row, slider, choice, readout, fmt, line } from '../../kit.js';

const C = (a, b) => { let x = 1; for (let i = 0; i < b; i++) x = (x * (a - i)) / (i + 1); return x; };

export default function (host) {
  let n = 8, p = 0.3, k = 3, mode = 'eq';
  const cv = canvas(host, { aspect: 0.62, max: 380, min: 240, label: 'Bar chart of a binomial distribution with the chosen bars highlighted' });
  const ctl = row(host);
  const re = () => { k = Math.min(k, n); kS.set(k); cv.redraw(); show(); };
  slider(ctl, { label: 'n (trials)', min: 1, max: 20, step: 1, value: n, fmt: (v) => String(v), oninput: (v) => { n = Math.round(v); re(); } });
  slider(ctl, { label: 'p (success)', min: 0.05, max: 0.95, step: 0.05, value: p, fmt: (v) => fmt(v, 2), oninput: (v) => { p = v; re(); } });
  const kS = slider(ctl, { label: 'k', min: 0, max: 20, step: 1, value: k, fmt: (v) => String(v), oninput: (v) => { k = Math.round(v); re(); } });
  choice(ctl, 'Show', [['eq', 'X = k'], ['ge', 'X ≥ k'], ['le', 'X ≤ k']], mode, (v) => { mode = v; re(); });
  const out = readout(host);
  const P = (r) => C(n, r) * p ** r * (1 - p) ** (n - r);
  const on = (r) => (mode === 'eq' ? r === k : mode === 'ge' ? r >= k : r <= k);
  const show = () => {
    let s = 0; for (let r = 0; r <= n; r++) if (on(r)) s += P(r);
    const lab = mode === 'eq' ? `P(X = ${k})` : mode === 'ge' ? `P(X ≥ ${k})` : `P(X ≤ ${k})`;
    out.innerHTML = `${lab} = <b>${fmt(s, 4)}</b>. Mean np = ${fmt(n * p, 3)}, variance npq = ${fmt(n * p * (1 - p), 3)}, standard deviation ${fmt(Math.sqrt(n * p * (1 - p)), 3)}. P(at least one) = 1 − qⁿ = ${fmt(1 - (1 - p) ** n, 4)}.`;
  };
  cv.draw = (ctx, w, h, col) => {
    let top = 0; for (let r = 0; r <= n; r++) top = Math.max(top, P(r));
    const ymax = Math.min(1, Math.ceil(top * 10 + 0.5) / 10);
    const { X, Y } = axes(ctx, w, h, col, { x: [-0.6, n + 0.6], y: [0, ymax], xlabel: 'r (number of successes)', ylabel: 'P(X = r)', xt: [...Array(n + 1).keys()].filter((r) => n <= 12 || r % 2 === 0), l: 46 });
    const bw = Math.max(3, (X(1) - X(0)) * 0.7);
    for (let r = 0; r <= n; r++) {
      ctx.fillStyle = on(r) ? col.s[1] : col.s[0];
      ctx.globalAlpha = on(r) ? 1 : 0.55;
      ctx.fillRect(X(r) - bw / 2, Y(P(r)), bw, Y(0) - Y(P(r)));
    }
    ctx.globalAlpha = 1;
    line(ctx, [[X(n * p), Y(0)], [X(n * p), Y(ymax)]], col.ink, 1.5, [5, 4]);
  };
  re();
}
