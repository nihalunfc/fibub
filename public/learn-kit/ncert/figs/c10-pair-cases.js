// Class 10 Pair of Linear Equations (animation): the second line moves and the pair passes through the three cases:
// intersecting (one solution), coincident (infinitely many) and parallel (none). The ratios a1/a2, b1/b2, c1/c2 are shown live.
import { canvas, axes, line, dot, text, title, row, readout, loop, ease } from '../../kit.js';

const num = (v) => String(+(+v).toFixed(2)).replace('-', '−');
const term = (v, s, first) => { if (!v) return ''; const a = Math.abs(v), t = (a === 1 ? '' : num(a)) + s; return first ? (v < 0 ? '−' : '') + t : ` ${v < 0 ? '−' : '+'} ${t}`; };
const eq = (a, b, c) => { const l = term(a, 'x', true) + term(b, 'y', !a); return `${l || '0'} = ${num(c)}`; };
const seg = (ctx, ax, a, b, c, R, color, w = 2.5, dash) => { if (!a && !b) return; ctx.save(); ax.clip(); const [x0, x1, y0, y1] = R;
  const p = Math.abs(b) > 1e-9 ? [[x0, (c - a * x0) / b], [x1, (c - a * x1) / b]] : [[c / a, y0], [c / a, y1]];
  line(ctx, p.map(([x, y]) => [ax.X(x), ax.Y(y)]), color, w, dash); ctx.restore(); };
const solve = (a1, b1, c1, a2, b2, c2) => { const d = a1 * b2 - a2 * b1; return Math.abs(d) < 1e-9 ? null : [(c1 * b2 - c2 * b1) / d, (a1 * c2 - a2 * c1) / d]; };
const kind = (a1, b1, c1, a2, b2, c2) => { const d = a1 * b2 - a2 * b1; if (Math.abs(d) > 1e-6) return 'meet'; return Math.abs(a1 * c2 - a2 * c1) < 1e-6 && Math.abs(b1 * c2 - b2 * c1) < 1e-6 ? 'same' : 'parallel'; };
const K = [[1, -1, 2], [2, 2, 12], [1, 1, 10], [3, -1, 1]];
export default function (host) {
  let t0 = 0, cur = K[0];
  const cv = canvas(host, { aspect: 0.8, max: 440, min: 300, label: 'A moving line that crosses, lies on and runs parallel to a fixed line' });
  const ctl = row(host), out = readout(host), R = [-8, 8, -8, 8];
  const a = loop(host, (dt, t) => { t0 = t; const ph = t % 12, s = Math.floor(ph / 3), u = ease(Math.min(1, (ph % 3) / 1.6)), A = K[s], B = K[(s + 1) % 4];
    cur = A.map((x, i) => x + (B[i] - x) * (ph % 3 > 1.6 ? 1 : u)); upd(); });
  a.button(ctl);
  cv.draw = (ctx, w, h, col) => {
    const k = kind(1, 1, 6, ...cur), t = title(ctx, k === 'meet' ? 'Intersecting: one solution' : k === 'same' ? 'Coincident: infinitely many solutions' : 'Parallel: no solution', col) + 2;
    const ax = axes(ctx, w, h, col, { x: [-8, 8], y: [-8, 8], t: t + 4, xt: [-8, -4, 0, 4, 8], yt: [-8, -4, 0, 4, 8], xlabel: 'x', ylabel: 'y', b: 34 });
    seg(ctx, ax, 1, 1, 6, R, col.s[0], 4); seg(ctx, ax, ...cur, R, col.s[1], 2.5, k === 'same' ? [6, 5] : null);
    const p = solve(1, 1, 6, ...cur); if (p && Math.abs(p[0]) <= 8 && Math.abs(p[1]) <= 8) dot(ctx, ax.X(p[0]), ax.Y(p[1]), 7, col.s[2], col.ink);
  };
  function upd() { const [a2, b2, c2] = cur, r = (q) => num(1 / q);
    out.innerHTML = `Fixed line x + y = 6. Moving line ${eq(a2, b2, c2)}.<br>a₁/a₂ = ${r(a2)}, b₁/b₂ = ${r(b2)}, c₁/c₂ = ${num(6 / c2)}.`; cv.redraw(); }
  upd();
}
