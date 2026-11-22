// Class 10 Polynomials (step player): checking the zeros-coefficients relation on p(x) = 2x^2 - 8x + 6 = 2(x-1)(x-3).
// Zeros 1 and 3: sum 4 = -b/a = 8/2 and product 3 = c/a = 6/2.
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
const L = ['p(x) = 2x² − 8x + 6, so a = 2, b = −8, c = 6', 'Zeros: 2(x² − 4x + 3) = 2(x − 1)(x − 3), so x = 1 and x = 3', 'Sum of zeros: 1 + 3 = 4.  And −b/a = −(−8)/2 = 4  ✓', 'Product of zeros: 1 × 3 = 3.  And c/a = 6/2 = 3  ✓', 'So the zeros add to −b/a and multiply to c/a', 'Use it backwards: sum 4, product 3 gives k(x² − 4x + 3)'];
export default function (host) {
  let s = 0;
  const cv = canvas(host, { aspect: 0.95, max: 440, min: 300, label: 'Checking that the sum of zeros is minus b over a and the product is c over a for 2x squared minus 8x plus 6' });
  cv.draw = (ctx, w, h, col) => {
    const t = title(ctx, 'Zeros and coefficients: a check', col);
    for (let i = 0; i <= s; i++) text(ctx, L[i], 10, t + 18 + i * 20, { color: i === s ? col.ink : col.muted, size: 12, weight: i === s ? 700 : 400, halo: col.panel });
    const top = t + 18 + 6 * 20 + 4, ax = axes(ctx, w, h, col, { x: [-1, 5], y: [-3, 12], t: top, xt: [0, 1, 2, 3, 4], yt: [0, 5, 10], xlabel: 'x', b: 34, l: 36 });
    curve(ctx, ax, [2, -8, 6], -1, 5, col.s[0]);
    if (s >= 1) for (const r of [1, 3]) { dot(ctx, ax.X(r), ax.Y(0), 6, col.s[2], col.ink); text(ctx, String(r), ax.X(r), ax.Y(0) - 14, { color: col.s[2], size: 12, weight: 700, align: 'center', halo: col.panel }); }
    if (s >= 2 && s <= 3) { const a = s === 2 ? 1 : 1, b = 3; line(ctx, [[ax.X(1), ax.Y(0) + 14], [ax.X(3), ax.Y(0) + 14]], col.s[3], 3); text(ctx, s === 2 ? 'sum = 4' : 'product = 3', ax.X(2), ax.Y(0) + 26, { color: col.s[3], size: 12, weight: 700, align: 'center' }); }
  };
  cv.redraw();
  return { step(i) { s = Math.min(i, 5); cv.redraw(); } };
}
