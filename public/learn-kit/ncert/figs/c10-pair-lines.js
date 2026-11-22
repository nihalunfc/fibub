// Class 10 Pair of Linear Equations: two lines a1x+b1y=c1 and a2x+b2y=c2 on one grid. Intersecting (a1/a2 != b1/b2): one solution.
// Parallel (a1/a2 = b1/b2 != c1/c2): none. Coincident (all three ratios equal): infinitely many. Sliders and presets.
import { canvas, axes, line, dot, text, title, row, slider, button, readout } from '../../kit.js';

const num = (v) => String(+(+v).toFixed(2)).replace('-', '−');
const term = (v, s, first) => { if (!v) return ''; const a = Math.abs(v), t = (a === 1 ? '' : num(a)) + s; return first ? (v < 0 ? '−' : '') + t : ` ${v < 0 ? '−' : '+'} ${t}`; };
const eq = (a, b, c) => { const l = term(a, 'x', true) + term(b, 'y', !a); return `${l || '0'} = ${num(c)}`; };
const seg = (ctx, ax, a, b, c, R, color, w = 2.5, dash) => { if (!a && !b) return; ctx.save(); ax.clip(); const [x0, x1, y0, y1] = R;
  const p = Math.abs(b) > 1e-9 ? [[x0, (c - a * x0) / b], [x1, (c - a * x1) / b]] : [[c / a, y0], [c / a, y1]];
  line(ctx, p.map(([x, y]) => [ax.X(x), ax.Y(y)]), color, w, dash); ctx.restore(); };
const solve = (a1, b1, c1, a2, b2, c2) => { const d = a1 * b2 - a2 * b1; return Math.abs(d) < 1e-9 ? null : [(c1 * b2 - c2 * b1) / d, (a1 * c2 - a2 * c1) / d]; };
const kind = (a1, b1, c1, a2, b2, c2) => { const d = a1 * b2 - a2 * b1; if (Math.abs(d) > 1e-6) return 'meet'; return Math.abs(a1 * c2 - a2 * c1) < 1e-6 && Math.abs(b1 * c2 - b2 * c1) < 1e-6 ? 'same' : 'parallel'; };
export default function (host) {
  const v = [1, 1, 6, 1, -1, 2], S = [];
  const cv = canvas(host, { aspect: 0.8, max: 440, min: 300, label: 'Two straight lines on a grid that meet, run parallel or lie on top of each other' });
  const ctl = row(host), pre = row(host), out = readout(host), R = [-8, 8, -8, 8];
  ['a₁', 'b₁', 'c₁', 'a₂', 'b₂', 'c₂'].forEach((n, i) => S.push(slider(ctl, { label: n, min: i % 3 === 2 ? -12 : -5, max: i % 3 === 2 ? 12 : 5, step: 1, value: v[i], fmt: num, oninput: (x) => { v[i] = x; upd(); } })));
  const set = (arr) => { arr.forEach((x, i) => { v[i] = x; S[i].set(x); }); upd(); };
  button(pre, 'Meet', () => set([1, 1, 6, 1, -1, 2])); button(pre, 'Parallel', () => set([1, 1, 6, 2, 2, 16])); button(pre, 'Same line', () => set([1, 1, 6, 2, 2, 12]));
  cv.draw = (ctx, w, h, col) => {
    const t = title(ctx, 'Two lines, three cases', col) + 2, ax = axes(ctx, w, h, col, { x: [-8, 8], y: [-8, 8], t: t + 4, xt: [-8, -4, 0, 4, 8], yt: [-8, -4, 0, 4, 8], xlabel: 'x', ylabel: 'y', b: 34 });
    const k = kind(...v);
    seg(ctx, ax, v[0], v[1], v[2], R, col.s[0], 4); seg(ctx, ax, v[3], v[4], v[5], R, col.s[1], 2.5, k === 'same' ? [6, 5] : null);
    const p = solve(...v); if (p && Math.abs(p[0]) <= 8 && Math.abs(p[1]) <= 8) { dot(ctx, ax.X(p[0]), ax.Y(p[1]), 7, col.s[2], col.ink); text(ctx, `(${num(p[0])}, ${num(p[1])})`, ax.X(p[0]) + 9, ax.Y(p[1]) - 12, { color: col.ink, size: 12, weight: 700, halo: col.panel }); }
  };
  function upd() { const [a1, b1, c1, a2, b2, c2] = v, k = kind(...v), r = (p, q) => (q ? num(p / q) : '—');
    if ((!a1 && !b1) || (!a2 && !b2)) { out.innerHTML = 'An equation with a = 0 and b = 0 is not a line. Change a or b.'; cv.redraw(); return; }
    out.innerHTML = `<b style="color:inherit">${eq(a1, b1, c1)}</b> and <b>${eq(a2, b2, c2)}</b><br>a₁/a₂ = ${r(a1, a2)}, b₁/b₂ = ${r(b1, b2)}, c₁/c₂ = ${r(c1, c2)}.<br>` + (k === 'meet' ? 'The ratios a₁/a₂ and b₁/b₂ differ: the lines <b>intersect</b> at one point, so there is exactly one solution (consistent).' : k === 'same' ? 'All three ratios are equal: the lines are <b>coincident</b>, so there are infinitely many solutions (consistent, dependent).' : 'a₁/a₂ = b₁/b₂ but c₁/c₂ is different: the lines are <b>parallel</b>, so there is no solution (inconsistent).'); cv.redraw(); }
  upd();
}
