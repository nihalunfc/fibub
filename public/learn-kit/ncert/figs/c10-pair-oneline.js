// Class 10 Pair of Linear Equations: one linear equation in two variables has infinitely many solutions, and they all lie on a straight line.
// Choose a, b, c for ax + by = c, slide x, and the matching y is found; every point you reach on the line is a solution.
import { canvas, axes, line, dot, text, title, row, slider, readout } from '../../kit.js';

const num = (v) => String(+(+v).toFixed(2)).replace('-', '−');
const term = (v, s, first) => { if (!v) return ''; const a = Math.abs(v), t = (a === 1 ? '' : num(a)) + s; return first ? (v < 0 ? '−' : '') + t : ` ${v < 0 ? '−' : '+'} ${t}`; };
const eq = (a, b, c) => { const l = term(a, 'x', true) + term(b, 'y', !a); return `${l || '0'} = ${num(c)}`; };
const seg = (ctx, ax, a, b, c, R, color, w = 2.5, dash) => { if (!a && !b) return; ctx.save(); ax.clip(); const [x0, x1, y0, y1] = R;
  const p = Math.abs(b) > 1e-9 ? [[x0, (c - a * x0) / b], [x1, (c - a * x1) / b]] : [[c / a, y0], [c / a, y1]];
  line(ctx, p.map(([x, y]) => [ax.X(x), ax.Y(y)]), color, w, dash); ctx.restore(); };
const solve = (a1, b1, c1, a2, b2, c2) => { const d = a1 * b2 - a2 * b1; return Math.abs(d) < 1e-9 ? null : [(c1 * b2 - c2 * b1) / d, (a1 * c2 - a2 * c1) / d]; };
const kind = (a1, b1, c1, a2, b2, c2) => { const d = a1 * b2 - a2 * b1; if (Math.abs(d) > 1e-6) return 'meet'; return Math.abs(a1 * c2 - a2 * c1) < 1e-6 && Math.abs(b1 * c2 - b2 * c1) < 1e-6 ? 'same' : 'parallel'; };
export default function (host) {
  let a = 2, b = 1, c = 8, x = 2;
  const cv = canvas(host, { aspect: 0.8, max: 440, min: 300, label: 'The straight line of all solutions of one linear equation in two variables with a point sliding on it' });
  const ctl = row(host);
  slider(ctl, { label: 'a', min: -4, max: 4, step: 1, value: a, fmt: num, oninput: (v) => { a = v; upd(); } });
  slider(ctl, { label: 'b', min: -4, max: 4, step: 1, value: b, fmt: num, oninput: (v) => { b = v; upd(); } });
  slider(ctl, { label: 'c', min: -12, max: 12, step: 1, value: c, fmt: num, oninput: (v) => { c = v; upd(); } });
  slider(ctl, { label: 'Pick x', min: -6, max: 6, step: 0.5, value: x, fmt: num, oninput: (v) => { x = v; upd(); } });
  const out = readout(host), R = [-8, 8, -8, 8];
  cv.draw = (ctx, w, h, col) => {
    const t = title(ctx, eq(a, b, c), col) + 2, ax = axes(ctx, w, h, col, { x: [-8, 8], y: [-8, 8], t: t + 4, xt: [-8, -4, 0, 4, 8], yt: [-8, -4, 0, 4, 8], xlabel: 'x', ylabel: 'y', b: 34 });
    seg(ctx, ax, a, b, c, R, col.s[0]);
    if (Math.abs(b) > 1e-9) { for (let k = -8; k <= 8; k++) { const y = (c - a * k) / b; if (Number.isInteger(+y.toFixed(9)) && Math.abs(y) <= 8) dot(ctx, ax.X(k), ax.Y(y), 3.5, col.muted); }
      const y = (c - a * x) / b; if (Math.abs(y) <= 8) { dot(ctx, ax.X(x), ax.Y(y), 7, col.s[2], col.ink); text(ctx, `(${num(x)}, ${num(y)})`, ax.X(x) + 9, ax.Y(y) - 12, { color: col.ink, size: 11, weight: 700, halo: col.panel }); } }
  };
  function upd() { out.innerHTML = !a && !b ? 'Make a or b non-zero: with both 0 there is no line.' : Math.abs(b) < 1e-9 ? `With b = 0 the equation is x = ${num(c / a)}: a vertical line. Every point on it is a solution.` : `x = ${num(x)} gives y = (${num(c)} − ${num(a)}×${num(x)}) ÷ ${num(b)} = <b>${num((c - a * x) / b)}</b>. Check: ${num(a)}×${num(x)} + ${num(b)}×${num((c - a * x) / b)} = ${num(c)}. Every point on the line (grey dots show whole-number ones) is a solution: infinitely many.`; cv.redraw(); }
  upd();
}
