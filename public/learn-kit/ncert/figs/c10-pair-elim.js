// Class 10 Pair of Linear Equations (step player): the elimination method on 3x + 2y = 16 and x - y = 2.
// Multiply (2) by 2 so the y terms are +2y and -2y, add the equations to remove y, solve 5x = 20, then find y = 2.
import { canvas, axes, line, dot, text, title } from '../../kit.js';

const num = (v) => String(+(+v).toFixed(2)).replace('-', '−');
const term = (v, s, first) => { if (!v) return ''; const a = Math.abs(v), t = (a === 1 ? '' : num(a)) + s; return first ? (v < 0 ? '−' : '') + t : ` ${v < 0 ? '−' : '+'} ${t}`; };
const eq = (a, b, c) => { const l = term(a, 'x', true) + term(b, 'y', !a); return `${l || '0'} = ${num(c)}`; };
const seg = (ctx, ax, a, b, c, R, color, w = 2.5, dash) => { if (!a && !b) return; ctx.save(); ax.clip(); const [x0, x1, y0, y1] = R;
  const p = Math.abs(b) > 1e-9 ? [[x0, (c - a * x0) / b], [x1, (c - a * x1) / b]] : [[c / a, y0], [c / a, y1]];
  line(ctx, p.map(([x, y]) => [ax.X(x), ax.Y(y)]), color, w, dash); ctx.restore(); };
const solve = (a1, b1, c1, a2, b2, c2) => { const d = a1 * b2 - a2 * b1; return Math.abs(d) < 1e-9 ? null : [(c1 * b2 - c2 * b1) / d, (a1 * c2 - a2 * c1) / d]; };
const kind = (a1, b1, c1, a2, b2, c2) => { const d = a1 * b2 - a2 * b1; if (Math.abs(d) > 1e-6) return 'meet'; return Math.abs(a1 * c2 - a2 * c1) < 1e-6 && Math.abs(b1 * c2 - b2 * c1) < 1e-6 ? 'same' : 'parallel'; };
const L = ['(1) 3x + 2y = 16     (2) x − y = 2', 'Make the y terms match: multiply (2) by 2: (3) 2x − 2y = 4', 'Add (1) and (3): 3x + 2x + 2y − 2y = 16 + 4, so 5x = 20', 'Solve: x = 4', 'Put x = 4 in (2): 4 − y = 2, so y = 2', 'Check (1): 3×4 + 2×2 = 16 ✓.  Lines meet at (4, 2)'];
export default function (host) {
  let s = 0;
  const cv = canvas(host, { aspect: 0.95, max: 440, min: 300, label: 'Solving two equations by elimination line by line with the two lines meeting at 4 comma 2' });
  const R = [-1, 9, -2, 9];
  cv.draw = (ctx, w, h, col) => {
    const t = title(ctx, 'Elimination method', col);
    for (let i = 0; i <= s; i++) text(ctx, L[i], 10, t + 18 + i * 20, { color: i === s ? col.ink : col.muted, size: 12, weight: i === s ? 700 : 400, halo: col.panel });
    const top = t + 18 + 6 * 20 + 4, ax = axes(ctx, w, h, col, { x: [-1, 9], y: [-2, 9], t: top, xt: [0, 2, 4, 6, 8], yt: [0, 3, 6, 9], xlabel: 'x', b: 34, l: 36 });
    if (s >= 5) { seg(ctx, ax, 3, 2, 16, R, col.s[0], 3); seg(ctx, ax, 1, -1, 2, R, col.s[1], 3); dot(ctx, ax.X(4), ax.Y(2), 7, col.s[2], col.ink); text(ctx, '(4, 2)', ax.X(4) + 9, ax.Y(2) - 12, { color: col.ink, size: 12, weight: 700, halo: col.panel }); }
  };
  cv.redraw();
  return { step(i) { s = Math.min(i, 5); cv.redraw(); } };
}
