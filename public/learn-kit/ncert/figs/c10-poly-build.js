// Class 10 Polynomials: making a quadratic from the sum S and product P of its zeros: x^2 - Sx + P (times any k).
// The zeros are real only if S^2 >= 4P; otherwise the curve floats above the x-axis and there are no zeros.
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
  let S = 5, P = 6;
  const cv = canvas(host, { aspect: 0.72, max: 440, min: 300, label: 'Quadratic made from a chosen sum and product of zeros and its graph' });
  const ctl = row(host);
  slider(ctl, { label: 'Sum of zeros', min: -8, max: 8, step: 1, value: S, fmt: num, oninput: (v) => { S = v; upd(); } });
  slider(ctl, { label: 'Product of zeros', min: -12, max: 16, step: 1, value: P, fmt: num, oninput: (v) => { P = v; upd(); } });
  const out = readout(host);
  cv.draw = (ctx, w, h, col) => {
    const c = [1, -S, P], t = title(ctx, 'x² − (sum)x + (product) = ' + poly(c), col) + 2;
    const ax = axes(ctx, w, h, col, { x: [-8, 8], y: [-14, 20], t: t + 4, xt: [-8, -4, 0, 4, 8], yt: [-10, 0, 10, 20], xlabel: 'x', ylabel: 'p(x)', b: 36 });
    curve(ctx, ax, c, -8, 8, col.s[0]);
    const D = S * S - 4 * P; if (D >= 0) for (const r of [(S - Math.sqrt(D)) / 2, (S + Math.sqrt(D)) / 2]) dot(ctx, ax.X(r), ax.Y(0), 6, col.s[2], col.ink);
  };
  function upd() { const D = S * S - 4 * P, r = D < 0 ? [] : [(S - Math.sqrt(D)) / 2, (S + Math.sqrt(D)) / 2];
    out.innerHTML = `Polynomial: <b>x² ${S ? (S > 0 ? '− ' : '+ ') + num(Math.abs(S)) + 'x' : ''} ${P ? (P > 0 ? '+ ' : '− ') + num(Math.abs(P)) : ''}</b>. ` + (D < 0 ? 'No real zeros with this sum and product: the curve stays above the axis.' : `Its zeros are ${r.map(num).join(' and ')}: they add to ${num(r[0] + r[1])} and multiply to ${num(r[0] * r[1])}.`); cv.redraw(); }
  upd();
}
