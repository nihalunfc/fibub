// Class 10 Polynomials: a cubic with three chosen zeros alpha, beta, gamma: (x-alpha)(x-beta)(x-gamma) = x^3 - (sum) x^2 + (sum of pairs) x - product.
// So with p = ax^3+bx^2+cx+d: sum = -b/a, sum of pairs = c/a, product = -d/a. Zeros are where the curve meets the x-axis.
import { canvas, axes, line, dot, text, title, row, slider, readout } from '../../kit.js';

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
  let z = [-2, 1, 3];
  const cv = canvas(host, { aspect: 0.75, max: 440, min: 300, label: 'A cubic curve through three chosen zeros with the relations between zeros and coefficients' });
  const ctl = row(host);
  ['α', 'β', 'γ'].forEach((n, i) => slider(ctl, { label: 'Zero ' + n, min: -4, max: 4, step: 1, value: z[i], fmt: num, oninput: (v) => { z[i] = v; upd(); } }));
  const out = readout(host);
  const C = () => { const [p, q, r] = z; return [1, -(p + q + r), p * q + q * r + r * p, -p * q * r]; };
  cv.draw = (ctx, w, h, col) => {
    const c = C(), t = title(ctx, 'p(x) = ' + poly(c), col) + 2;
    const ax = axes(ctx, w, h, col, { x: [-5, 5], y: [-20, 20], t: t + 4, xt: [-4, -2, 0, 2, 4], yt: [-20, -10, 0, 10, 20], xlabel: 'x', ylabel: 'p(x)', b: 36 });
    curve(ctx, ax, c, -5, 5, col.s[0]);
    z.forEach((r, i) => dot(ctx, ax.X(r), ax.Y(0), 6, col.s[2 + (i % 3)], col.ink));
  };
  function upd() { const [a, b, c, d] = C(), [p, q, r] = z;
    out.innerHTML = `a = 1, b = ${num(b)}, c = ${num(c)}, d = ${num(d)}.<br>α + β + γ = <b>${num(p + q + r)}</b> = −b/a = ${num(-b)}.<br>αβ + βγ + γα = <b>${num(p * q + q * r + r * p)}</b> = c/a = ${num(c)}.<br>αβγ = <b>${num(p * q * r)}</b> = −d/a = ${num(-d)}.`; cv.redraw(); }
  upd();
}
