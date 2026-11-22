// Class 10 Polynomials: the graph of a polynomial of degree 1, 2 or 3 with sliders for the coefficients. The zeros are the
// x-values where the curve meets the x-axis, so a polynomial of degree n has at most n zeros (a line 1, a parabola 2, a cubic 3).
import { canvas, axes, line, dot, text, title, row, slider, choice, readout } from '../../kit.js';

const SUP = { 2: '²', 3: '³' };
const num = (v) => String(+v.toFixed(2)).replace('-', '−');
const poly = (c) => { const d = c.length - 1; let s = ''; c.forEach((v, i) => { const e = d - i; if (!v) return; const a = Math.abs(v); let t = (a === 1 && e > 0) ? '' : num(a); t += e > 1 ? 'x' + SUP[e] : e === 1 ? 'x' : ''; s += s ? ` ${v < 0 ? '−' : '+'} ${t}` : (v < 0 ? '−' : '') + t; }); return s || '0'; };
const val = (c, x) => c.reduce((a, v) => a * x + v, 0);
const roots = (c, lo = -6, hi = 6) => { const f = (x) => val(c, x), r = []; let px = lo, py = f(px);
  for (let i = 1; i <= 1500; i++) { const x = lo + (hi - lo) * i / 1500, y = f(x); if (py === 0) r.push(px); else if (py * y < 0) { let a = px, b = x; for (let k = 0; k < 40; k++) { const m = (a + b) / 2; if (f(a) * f(m) <= 0) b = m; else a = m; } r.push((a + b) / 2); } px = x; py = y; }
  if (c.length === 3) { const D = c[1] * c[1] - 4 * c[0] * c[2]; if (Math.abs(D) < 1e-9 && c[0]) return [-c[1] / (2 * c[0])]; }
  return r; };
const curve = (ctx, ax, c, x0, x1, color, w = 2.5) => { ctx.save(); ax.clip(); const pts = []; for (let i = 0; i <= 240; i++) { const x = x0 + (x1 - x0) * i / 240; pts.push([ax.X(x), ax.Y(val(c, x))]); } line(ctx, pts, color, w); ctx.restore(); };
export default function (host) {
  let deg = 2; const co = { 1: [1, -2], 2: [1, -4, 3], 3: [1, -2, -5, 6] };
  const cv = canvas(host, { aspect: 0.75, max: 440, min: 300, label: 'Graph of a linear, quadratic or cubic polynomial with its zeros marked on the x-axis' });
  const top = row(host), ctl = row(host), out = readout(host);
  choice(top, 'Degree', [[1, 'Linear'], [2, 'Quadratic'], [3, 'Cubic']], deg, (v) => { deg = v; build(); });
  const names = ['a (x³)', 'b (x²)', 'c (x)', 'd'];
  function build() {
    ctl.innerHTML = '';
    const nm = deg === 3 ? names : deg === 2 ? ['a (x²)', 'b (x)', 'c'] : ['a (x)', 'b'];
    co[deg].forEach((v, i) => slider(ctl, { label: nm[i], min: i === 0 ? -3 : -8, max: i === 0 ? 3 : 8, step: 0.5, value: v, fmt: num, oninput: (x) => { co[deg][i] = x; upd(); } }));
    upd();
  }
  cv.draw = (ctx, w, h, col) => {
    const c = co[deg], t = title(ctx, 'p(x) = ' + poly(c), col) + 2;
    const ax = axes(ctx, w, h, col, { x: [-5, 5], y: [-12, 12], t: t + 4, xt: [-4, -2, 0, 2, 4], yt: [-10, -5, 0, 5, 10], xlabel: 'x', ylabel: 'p(x)', b: 36 });
    curve(ctx, ax, c, -5, 5, col.s[0]);
    for (const r of roots(c, -5, 5)) { dot(ctx, ax.X(r), ax.Y(0), 6, col.s[2], col.ink); text(ctx, num(r), ax.X(r), ax.Y(0) - 13, { color: col.s[2], size: 11, weight: 700, align: 'center', halo: col.panel }); }
  };
  function upd() { const c = co[deg], r = roots(c, -5, 5);
    out.innerHTML = c[0] === 0 ? 'The first coefficient is 0, so this is no longer a polynomial of degree ' + deg + '. Move it away from 0.' : `Degree ${deg}: at most ${deg} zero${deg > 1 ? 's' : ''}. This one has <b>${r.length}</b>${r.length ? ': x = ' + r.map(num).join(', ') : ' (the curve never meets the x-axis)'}.`; cv.redraw(); }
  build();
}
