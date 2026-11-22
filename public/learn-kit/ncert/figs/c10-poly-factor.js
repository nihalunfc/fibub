// Class 10 Polynomials (step player): finding the zeros of x^2 - 5x + 6 by splitting the middle term. Find two numbers with
// product 6 and sum -5 (they are -2 and -3), split, group into (x-2)(x-3), and read the zeros 2 and 3, which are where the curve crosses the x-axis.
import { canvas, axes, line, dot, text, title } from '../../kit.js';

const SUP = { 2: '²', 3: '³' };
const num = (v) => String(+v.toFixed(2)).replace('-', '−');
const poly = (c) => { const d = c.length - 1; let s = ''; c.forEach((v, i) => { const e = d - i; if (!v) return; const a = Math.abs(v); let t = (a === 1 && e > 0) ? '' : num(a); t += e > 1 ? 'x' + SUP[e] : e === 1 ? 'x' : ''; s += s ? ` ${v < 0 ? '−' : '+'} ${t}` : (v < 0 ? '−' : '') + t; }); return s || '0'; };
const val = (c, x) => c.reduce((a, v) => a * x + v, 0);
const roots = (c, lo = -6, hi = 6) => { const f = (x) => val(c, x), r = []; let px = lo, py = f(px);
  for (let i = 1; i <= 1500; i++) { const x = lo + (hi - lo) * i / 1500, y = f(x); if (py === 0) r.push(px); else if (py * y < 0) { let a = px, b = x; for (let k = 0; k < 40; k++) { const m = (a + b) / 2; if (f(a) * f(m) <= 0) b = m; else a = m; } r.push((a + b) / 2); } px = x; py = y; }
  if (c.length === 3) { const D = c[1] * c[1] - 4 * c[0] * c[2]; if (Math.abs(D) < 1e-9 && c[0]) return [-c[1] / (2 * c[0])]; }
  return r; };
const curve = (ctx, ax, c, x0, x1, color, w = 2.5) => { ctx.save(); ax.clip(); const pts = []; for (let i = 0; i <= 240; i++) { const x = x0 + (x1 - x0) * i / 240; pts.push([ax.X(x), ax.Y(val(c, x))]); } line(ctx, pts, color, w); ctx.restore(); };
const L = ['p(x) = x² − 5x + 6. Where is p(x) = 0?', 'Two numbers with product 6, sum −5: −2 and −3 (not −1, −6)', 'Split: x² − 2x − 3x + 6', 'Group: x(x − 2) − 3(x − 2) = (x − 2)(x − 3)', 'Zero product: x − 2 = 0 or x − 3 = 0, so x = 2 or x = 3', 'The graph agrees: the curve crosses the x-axis at 2 and 3'];
export default function (host) {
  let s = 0;
  const cv = canvas(host, { aspect: 0.95, max: 440, min: 300, label: 'Factorising x squared minus 5x plus 6 line by line and the parabola crossing the axis at 2 and 3' });
  cv.draw = (ctx, w, h, col) => {
    const t = title(ctx, 'Zeros by splitting the middle term', col);
    for (let i = 0; i <= s; i++) text(ctx, L[i], 10, t + 18 + i * 20, { color: i === s ? col.ink : col.muted, size: 12, weight: i === s ? 700 : 400, halo: col.panel });
    const top = t + 18 + 6 * 20 + 4, ax = axes(ctx, w, h, col, { x: [-1, 5], y: [-2, 8], t: top, xt: [0, 1, 2, 3, 4], yt: [0, 4, 8], xlabel: 'x', b: 34, l: 36 });
    curve(ctx, ax, [1, -5, 6], -1, 5, col.s[0]);
    if (s >= 4) for (const r of [2, 3]) { dot(ctx, ax.X(r), ax.Y(0), 6, col.s[2], col.ink); text(ctx, 'x = ' + r, ax.X(r), ax.Y(0) - 14, { color: col.s[2], size: 12, weight: 700, align: 'center', halo: col.panel }); }
  };
  cv.redraw();
  return { step(i) { s = Math.min(i, 5); cv.redraw(); } };
}
