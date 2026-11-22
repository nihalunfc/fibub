// 1.1 Taylor polynomials closing in on a function. Pick a function and an order N: the Maclaurin polynomial hugs the
// curve over a wider and wider range, except beyond the radius of convergence (ln(1 + x) and 1/(1 − x) at |x| > 1),
// where adding terms makes it worse.
import { canvas, axes, line, text, row, slider, choice, readout, fmt, title } from '../../kit.js';

const fact = (n) => (n <= 1 ? 1 : n * fact(n - 1));
const FUNS = {
  sin: { name: 'sin x', f: Math.sin, c: (k) => (k % 2 ? ((k - 1) / 2) % 2 ? -1 / fact(k) : 1 / fact(k) : 0), R: Infinity, y: [-2.5, 2.5], x: [-7, 7] },
  exp: { name: 'eˣ', f: Math.exp, c: (k) => 1 / fact(k), R: Infinity, y: [-1, 8], x: [-4, 2.5] },
  ln: { name: 'ln(1 + x)', f: (x) => (x > -1 ? Math.log(1 + x) : NaN), c: (k) => (k === 0 ? 0 : (k % 2 ? 1 : -1) / k), R: 1, y: [-3, 2], x: [-1.5, 2.5] },
  geo: { name: '1/(1 − x)', f: (x) => 1 / (1 - x), c: () => 1, R: 1, y: [-3, 6], x: [-2, 1.6] },
};

export default function (host) {
  const cv = canvas(host, { aspect: 0.62, max: 420, min: 250, label: 'A function and its Taylor polynomial of order N about x = 0' });
  let key = 'sin', N = 3, x0 = 1;
  const ctl = row(host);
  choice(ctl, 'Function', Object.entries(FUNS).map(([k, v]) => [k, v.name]), key, (v) => { key = v; cv.redraw(); show(); });
  slider(ctl, { label: 'Order N', min: 0, max: 15, step: 1, value: N, fmt: (v) => String(v), oninput: (v) => { N = v; cv.redraw(); show(); } });
  slider(ctl, { label: 'Check at x', min: -1.5, max: 2.5, step: 0.05, value: x0, fmt: (v) => fmt(v, 3), oninput: (v) => { x0 = v; cv.redraw(); show(); } });
  const out = readout(host);
  const P = (x) => { const F = FUNS[key]; let s = 0; for (let k = 0; k <= N; k++) s += F.c(k) * x ** k; return s; };
  const show = () => {
    const F = FUNS[key], fv = F.f(x0), pv = P(x0);
    const inside = Math.abs(x0) < F.R || (key === 'ln' && x0 === 1);
    out.innerHTML = Number.isFinite(fv)
      ? `At x = ${fmt(x0, 3)}: ${F.name} = ${fmt(fv, 5)}, the order-${N} polynomial gives ${fmt(pv, 5)}, error ${fmt(fv - pv, 3)}. ${F.R === Infinity ? 'This series converges for every x: raise N and the error at any fixed x shrinks to zero.' : inside ? 'Inside the radius of convergence (|x| &lt; 1) the error shrinks as N grows.' : '<b>Outside the radius of convergence (|x| &gt; 1): raising N makes the polynomial worse, not better.</b>'}`
      : `${F.name} is not defined at x = ${fmt(x0, 3)}.`;
  };
  cv.draw = (ctx, w, h, col) => {
    const F = FUNS[key];
    const A = axes(ctx, w, h, col, { x: F.x, y: F.y, xlabel: 'x', t: 34 });
    title(ctx, `${F.name} (grey) and its order-${N} Taylor polynomial (colour)`, col);
    ctx.save(); A.clip();
    if (F.R !== Infinity) { ctx.fillStyle = col.soft; ctx.fillRect(A.X(-F.R), A.T, A.X(F.R) - A.X(-F.R), A.B - A.T); }
    const n = 400, fpts = [], ppts = [];
    let seg = [];
    for (let i = 0; i <= n; i++) {
      const x = F.x[0] + ((F.x[1] - F.x[0]) * i) / n, y = F.f(x);
      if (Number.isFinite(y) && Math.abs(y) < 50) seg.push([A.X(x), A.Y(y)]); else if (seg.length) { fpts.push(seg); seg = []; }
      const p = P(x); ppts.push([A.X(x), A.Y(Math.max(-60, Math.min(60, p)))]);
    }
    if (seg.length) fpts.push(seg);
    fpts.forEach((s) => line(ctx, s, col.muted, 3));
    line(ctx, ppts, col.s[0], 2);
    const fx = F.f(x0);
    if (Number.isFinite(fx)) { ctx.strokeStyle = col.s[3]; ctx.setLineDash([4, 4]); ctx.beginPath(); ctx.moveTo(A.X(x0), A.T); ctx.lineTo(A.X(x0), A.B); ctx.stroke(); }
    ctx.restore();
    if (F.R !== Infinity) text(ctx, 'shaded: |x| < 1, where the series converges', A.L + 6, A.B - 10, { color: col.muted, size: 11 });
  };
  cv.redraw(); show();
}
