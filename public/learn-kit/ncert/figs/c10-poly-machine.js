// Class 10 Polynomials: a polynomial as a machine. Slide x, and the machine gives p(x), the height of the curve above the x-axis.
// A zero of the polynomial is an input that makes the output 0: the point sits exactly on the axis.
import { canvas, axes, line, dot, text, title, row, slider, choice, readout } from '../../kit.js';

const SUP = { 2: '²', 3: '³' };
const num = (v) => String(+v.toFixed(2)).replace('-', '−');
const poly = (c) => { const d = c.length - 1; let s = ''; c.forEach((v, i) => { const e = d - i; if (!v) return; const a = Math.abs(v); let t = (a === 1 && e > 0) ? '' : num(a); t += e > 1 ? 'x' + SUP[e] : e === 1 ? 'x' : ''; s += s ? ` ${v < 0 ? '−' : '+'} ${t}` : (v < 0 ? '−' : '') + t; }); return s || '0'; };
const val = (c, x) => c.reduce((a, v) => a * x + v, 0);
const roots = (c, lo = -6, hi = 6) => { const f = (x) => val(c, x), r = []; let px = lo, py = f(px);
  for (let i = 1; i <= 1500; i++) { const x = lo + (hi - lo) * i / 1500, y = f(x); if (py === 0) r.push(px); else if (py * y < 0) { let a = px, b = x; for (let k = 0; k < 40; k++) { const m = (a + b) / 2; if (f(a) * f(m) <= 0) b = m; else a = m; } r.push((a + b) / 2); } px = x; py = y; }
  if (c.length === 3) { const D = c[1] * c[1] - 4 * c[0] * c[2]; if (Math.abs(D) < 1e-9 && c[0]) return [-c[1] / (2 * c[0])]; }
  return r; };
const curve = (ctx, ax, c, x0, x1, color, w = 2.5) => { ctx.save(); ax.clip(); const pts = []; for (let i = 0; i <= 240; i++) { const x = x0 + (x1 - x0) * i / 240; pts.push([ax.X(x), ax.Y(val(c, x))]); } line(ctx, pts, color, w); ctx.restore(); };
const LIST = { a: [1, -5, 6], b: [2, 0, -8], c: [1, 0, 1], d: [-1, 4, -3] };
export default function (host) {
  let key = 'a', x = 0.5;
  const cv = canvas(host, { aspect: 0.72, max: 440, min: 300, label: 'A point sliding along a polynomial curve showing the value p of x and whether it is a zero' });
  const ctl = row(host);
  choice(ctl, 'Polynomial', [['a', 'x²−5x+6'], ['b', '2x²−8'], ['c', 'x²+1'], ['d', '−x²+4x−3']], key, (v) => { key = v; upd(); });
  slider(ctl, { label: 'Input x', min: -2, max: 6, step: 0.5, value: x, fmt: num, oninput: (v) => { x = v; upd(); } });
  const out = readout(host);
  cv.draw = (ctx, w, h, col) => {
    const c = LIST[key], t = title(ctx, 'p(x) = ' + poly(c), col) + 2;
    const ax = axes(ctx, w, h, col, { x: [-2, 6], y: [-10, 14], t: t + 4, xt: [-2, 0, 2, 4, 6], yt: [-10, -5, 0, 5, 10], xlabel: 'x', ylabel: 'p(x)', b: 36 });
    curve(ctx, ax, c, -2, 6, col.s[0]);
    const y = val(c, x), zero = Math.abs(y) < 1e-9;
    ctx.save(); ax.clip(); line(ctx, [[ax.X(x), ax.Y(0)], [ax.X(x), ax.Y(y)]], zero ? col.s[2] : col.s[6], 2, [4, 3]); dot(ctx, ax.X(x), ax.Y(y), 7, zero ? col.s[2] : col.panel, col.ink); ctx.restore();
    for (const r of roots(c, -2, 6)) dot(ctx, ax.X(r), ax.Y(0), 4, col.s[2]);
  };
  function upd() { const c = LIST[key], y = val(c, x);
    out.innerHTML = `p(${num(x)}) = ${num(y)}.` + (Math.abs(y) < 1e-9 ? ' <b>The value is 0, so x = ' + num(x) + ' is a zero:</b> the point sits on the x-axis.' : ` Not zero, so ${num(x)} is not a zero (the point is ${y > 0 ? 'above' : 'below'} the axis).`) + (roots(c, -2, 6).length ? '' : ' This curve never meets the axis: it has no zeros.'); cv.redraw(); }
  upd();
}
