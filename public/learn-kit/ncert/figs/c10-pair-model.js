// Class 10 Pair of Linear Equations (step player): turning a word problem into two lines. A 4 km ride costs 70 rupees and a
// 7 km ride costs 115: fixed charge x and per-km charge y give x + 4y = 70 and x + 7y = 115, which meet at (10, 15).
import { canvas, axes, line, dot, text, title } from '../../kit.js';

const num = (v) => String(+(+v).toFixed(2)).replace('-', '−');
const term = (v, s, first) => { if (!v) return ''; const a = Math.abs(v), t = (a === 1 ? '' : num(a)) + s; return first ? (v < 0 ? '−' : '') + t : ` ${v < 0 ? '−' : '+'} ${t}`; };
const eq = (a, b, c) => { const l = term(a, 'x', true) + term(b, 'y', !a); return `${l || '0'} = ${num(c)}`; };
const seg = (ctx, ax, a, b, c, R, color, w = 2.5, dash) => { if (!a && !b) return; ctx.save(); ax.clip(); const [x0, x1, y0, y1] = R;
  const p = Math.abs(b) > 1e-9 ? [[x0, (c - a * x0) / b], [x1, (c - a * x1) / b]] : [[c / a, y0], [c / a, y1]];
  line(ctx, p.map(([x, y]) => [ax.X(x), ax.Y(y)]), color, w, dash); ctx.restore(); };
const solve = (a1, b1, c1, a2, b2, c2) => { const d = a1 * b2 - a2 * b1; return Math.abs(d) < 1e-9 ? null : [(c1 * b2 - c2 * b1) / d, (a1 * c2 - a2 * c1) / d]; };
const kind = (a1, b1, c1, a2, b2, c2) => { const d = a1 * b2 - a2 * b1; if (Math.abs(d) > 1e-6) return 'meet'; return Math.abs(a1 * c2 - a2 * c1) < 1e-6 && Math.abs(b1 * c2 - b2 * c1) < 1e-6 ? 'same' : 'parallel'; };
const L = ['A 4 km auto ride costs ₹70; a 7 km ride costs ₹115.', 'Unknowns: x = fixed charge (₹), y = charge per km (₹)', 'First ride: fixed + 4 km: x + 4y = 70', 'Second ride: fixed + 7 km: x + 7y = 115', 'Line 1 shows every (x, y) that fits the first ride', 'Line 2 shows every (x, y) that fits the second ride', 'Only one point fits both: fixed ₹10, ₹15 per km'];
export default function (host) {
  let s = 0;
  const cv = canvas(host, { aspect: 1, max: 440, min: 300, label: 'A word problem about auto fares turned into two lines that meet at fixed charge 10 and rate 15 per km' });
  const R = [0, 40, 0, 20];
  cv.draw = (ctx, w, h, col) => {
    const t = title(ctx, 'A word problem becomes two lines', col);
    for (let i = 0; i <= s && i < 4; i++) text(ctx, L[i], 10, t + 18 + i * 20, { color: i === s ? col.ink : col.muted, size: 12, weight: i === s ? 700 : 400, halo: col.panel });
    if (s >= 4) text(ctx, L[Math.min(s, 6)], 10, t + 18 + 4 * 20, { color: col.ink, size: 12, weight: 700, halo: col.panel });
    const top = t + 18 + 5 * 20 + 6, ax = axes(ctx, w, h, col, { x: [0, 40], y: [0, 20], t: top, xt: [0, 10, 20, 30, 40], yt: [0, 5, 10, 15, 20], xlabel: 'fixed charge x (₹)', ylabel: 'per km y (₹)', b: 40 });
    if (s >= 4) seg(ctx, ax, 1, 4, 70, R, col.s[0], 3);
    if (s >= 5) seg(ctx, ax, 1, 7, 115, R, col.s[1], 3);
    if (s >= 6) { dot(ctx, ax.X(10), ax.Y(15), 7, col.s[2], col.ink); text(ctx, '(10, 15)', ax.X(10) + 9, ax.Y(15) - 12, { color: col.ink, size: 12, weight: 700, halo: col.panel }); }
  };
  cv.redraw();
  return { step(i) { s = Math.min(i, 6); cv.redraw(); } };
}
