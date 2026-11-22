// Class 9 Linear Polynomials: the zero of ax + b is the x that makes it 0, which is x = -b/a. On the graph it is the point
// where the straight line meets the x-axis. If a = 0 the line is flat: it never meets the axis (or is the axis itself when b = 0 too).
import { canvas, text, title, row, slider, readout, dot, line } from '../../kit.js';
import { plane } from './c9-coord-plane.js';

const num = (v) => String(+v.toFixed(2)).replace('-', '−');
const lin = (a, b) => { let s = a === 0 ? '' : a === 1 ? 'x' : a === -1 ? '−x' : num(a) + 'x'; if (b !== 0 || a === 0) s += s ? (b < 0 ? ' − ' : ' + ') + num(Math.abs(b)) : num(b); return s; };
export default function (host) {
  let a = 2, b = -6;
  const cv = canvas(host, { aspect: 1, max: 440, min: 300, label: 'A straight line ax plus b meeting the x-axis at its zero' });
  const ctl = row(host);
  slider(ctl, { label: 'a', min: -3, max: 3, step: 0.5, value: a, fmt: num, oninput: (v) => { a = v; upd(); } });
  slider(ctl, { label: 'b', min: -8, max: 8, step: 1, value: b, fmt: num, oninput: (v) => { b = v; upd(); } });
  const out = readout(host);
  cv.draw = (ctx, w, h, col) => {
    const t = title(ctx, 'p(x) = ' + lin(a, b), col), g = plane(ctx, w, h, col, { top: t + 6, x0: -8, x1: 8, y0: -8, y1: 8 });
    ctx.save(); ctx.beginPath(); ctx.rect(g.X(-8), g.Y(8), 16 * g.s, 16 * g.s); ctx.clip(); line(ctx, [[g.X(-8), g.Y(-8 * a + b)], [g.X(8), g.Y(8 * a + b)]], col.s[0], 3.5); ctx.restore();
    if (a !== 0) { const z = -b / a; if (Math.abs(z) <= 8) { dot(ctx, g.X(z), g.Y(0), 8, col.s[2], col.ink); text(ctx, 'zero x = ' + num(z), g.X(z), g.Y(0) + (a * 1 > 0 ? -16 : 16) * 1, { color: col.s[2], size: 12, weight: 700, align: 'center', halo: col.panel }); } }
  };
  function upd() {
    out.innerHTML = a === 0 ? (b === 0 ? 'p(x) = 0 for every x: every number is a zero (the line is the x-axis itself).' : `a = 0, so p(x) = ${num(b)} is a constant. It is never 0, so it has <b>no zero</b>: the flat line never meets the x-axis.`) : `Set ${lin(a, b)} = 0. Then ${num(a)}x = ${num(-b)}, so <b>x = −b/a = ${num(-b / a)}</b>. That is where the line meets the x-axis. A linear polynomial (a ≠ 0) has exactly one zero.`;
    cv.redraw();
  }
  upd();
}
