// Class 10 Pair of Linear Equations: guess and check. 2 notebooks + 1 pen cost 19 rupees and 1 notebook + 3 pens cost 22.
// Slide (or click on the graph) to try a price for each: each equation turns green when it is satisfied; only (7, 5) satisfies both.
import { canvas, axes, line, dot, text, title, row, slider, readout, touchGuard } from '../../kit.js';

const num = (v) => String(+(+v).toFixed(2)).replace('-', '−');
const term = (v, s, first) => { if (!v) return ''; const a = Math.abs(v), t = (a === 1 ? '' : num(a)) + s; return first ? (v < 0 ? '−' : '') + t : ` ${v < 0 ? '−' : '+'} ${t}`; };
const eq = (a, b, c) => { const l = term(a, 'x', true) + term(b, 'y', !a); return `${l || '0'} = ${num(c)}`; };
const seg = (ctx, ax, a, b, c, R, color, w = 2.5, dash) => { if (!a && !b) return; ctx.save(); ax.clip(); const [x0, x1, y0, y1] = R;
  const p = Math.abs(b) > 1e-9 ? [[x0, (c - a * x0) / b], [x1, (c - a * x1) / b]] : [[c / a, y0], [c / a, y1]];
  line(ctx, p.map(([x, y]) => [ax.X(x), ax.Y(y)]), color, w, dash); ctx.restore(); };
const solve = (a1, b1, c1, a2, b2, c2) => { const d = a1 * b2 - a2 * b1; return Math.abs(d) < 1e-9 ? null : [(c1 * b2 - c2 * b1) / d, (a1 * c2 - a2 * c1) / d]; };
const kind = (a1, b1, c1, a2, b2, c2) => { const d = a1 * b2 - a2 * b1; if (Math.abs(d) > 1e-6) return 'meet'; return Math.abs(a1 * c2 - a2 * c1) < 1e-6 && Math.abs(b1 * c2 - b2 * c1) < 1e-6 ? 'same' : 'parallel'; };
export default function (host) {
  let x = 3, y = 3, ax0;
  const cv = canvas(host, { aspect: 0.8, max: 440, min: 300, label: 'A graph of two price equations where you try a notebook price and a pen price until both are satisfied' });
  const ctl = row(host), out = readout(host), R = [0, 12, 0, 12];
  const sx = slider(ctl, { label: 'Notebook price x (₹)', min: 0, max: 12, step: 1, value: x, fmt: num, oninput: (v) => { x = v; upd(); } });
  const sy = slider(ctl, { label: 'Pen price y (₹)', min: 0, max: 12, step: 1, value: y, fmt: num, oninput: (v) => { y = v; upd(); } });
  const pick = (e) => { if (!ax0) return; const r = cv.c.getBoundingClientRect(), px = e.clientX - r.left, py = e.clientY - r.top;
    x = Math.max(0, Math.min(12, Math.round(12 * (px - ax0.L) / (ax0.R - ax0.L)))); y = Math.max(0, Math.min(12, Math.round(12 * (ax0.B - py) / (ax0.B - ax0.T)))); sx.set(x); sy.set(y); upd(); };
  cv.c.addEventListener('pointerdown', pick); cv.c.addEventListener('pointermove', (e) => { if (e.buttons) pick(e); }); touchGuard(cv.c, (x, y) => !!ax0 && x >= ax0.L && x <= ax0.R && y >= ax0.T && y <= ax0.B);
  cv.draw = (ctx, w, h, col) => {
    const t = title(ctx, '2x + y = 19 and x + 3y = 22', col) + 2, ax = (ax0 = axes(ctx, w, h, col, { x: [0, 12], y: [0, 12], t: t + 4, xt: [0, 3, 6, 9, 12], yt: [0, 3, 6, 9, 12], xlabel: 'notebook x (₹)', ylabel: 'pen y (₹)', b: 40 }));
    seg(ctx, ax, 2, 1, 19, R, col.s[0], 3); seg(ctx, ax, 1, 3, 22, R, col.s[1], 3);
    const ok1 = 2 * x + y === 19, ok2 = x + 3 * y === 22;
    dot(ctx, ax.X(x), ax.Y(y), 8, ok1 && ok2 ? col.s[2] : col.panel, col.ink);
    text(ctx, `(${x}, ${y})`, ax.X(x) + 10, ax.Y(y) - 12, { color: col.ink, size: 12, weight: 700, halo: col.panel });
  };
  function upd() { const l1 = 2 * x + y, l2 = x + 3 * y;
    out.innerHTML = `Try ₹${x} per notebook and ₹${y} per pen.<br>2x + y = ${l1} ${l1 === 19 ? '✔ matches 19' : '✘ should be 19'}<br>x + 3y = ${l2} ${l2 === 22 ? '✔ matches 22' : '✘ should be 22'}` + (l1 === 19 && l2 === 22 ? '<br><b>Both hold: this point is on both lines. That is the solution.</b>' : '<br>Move toward where the two lines cross.'); cv.redraw(); }
  upd();
}
