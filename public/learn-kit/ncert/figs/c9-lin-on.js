// Class 9 Linear Polynomials: is a point on the line y = ax + b? A point (x, y) lies on the graph exactly when y = p(x),
// that is when its coordinates satisfy the equation. Click any grid point to test it.
import { canvas, text, title, row, slider, readout, dot, line } from '../../kit.js';
import { plane } from './c9-coord-plane.js';

const num = (v) => String(+v.toFixed(2)).replace('-', '−');
export default function (host) {
  let a = 2, b = -1, P = [1, 1], g, tally = [0, 0];
  const cv = canvas(host, { aspect: 1, max: 440, min: 300, label: 'A line with a point you click, tested to see whether it lies on the line' });
  const ctl = row(host);
  slider(ctl, { label: 'a', min: -3, max: 3, step: 1, value: a, fmt: num, oninput: (v) => { a = v; upd(); } });
  slider(ctl, { label: 'b', min: -4, max: 4, step: 1, value: b, fmt: num, oninput: (v) => { b = v; upd(); } });
  const out = readout(host);
  cv.draw = (ctx, w, h, col) => {
    const t = title(ctx, 'Is (' + num(P[0]) + ', ' + num(P[1]) + ') on y = ' + num(a) + 'x ' + (b < 0 ? '− ' : '+ ') + num(Math.abs(b)) + '?', col);
    g = plane(ctx, w, h, col, { top: t + 6, x0: -6, x1: 6, y0: -8, y1: 8 });
    ctx.save(); ctx.beginPath(); ctx.rect(g.X(-6), g.Y(8), 12 * g.s, 16 * g.s); ctx.clip(); line(ctx, [[g.X(-6), g.Y(-6 * a + b)], [g.X(6), g.Y(6 * a + b)]], col.s[0], 3); ctx.restore();
    const on = P[1] === a * P[0] + b;
    dot(ctx, g.X(P[0]), g.Y(P[1]), 8, on ? col.s[2] : col.s[6], col.ink);
  };
  cv.c.style.cursor = 'crosshair';
  cv.c.addEventListener('pointerdown', (e) => {
    const r = cv.c.getBoundingClientRect(), [x, y] = g.inv(e.clientX - r.left, e.clientY - r.top), px = Math.round(x), py = Math.round(y);
    if (Math.abs(px) <= 6 && Math.abs(py) <= 8) { P = [px, py]; upd(); }
  });
  function upd() {
    const [x, y] = P, v = a * x + b, on = y === v;
    out.innerHTML = `Put x = ${num(x)} in the polynomial: p(${num(x)}) = ${num(a)}(${num(x)}) ${b < 0 ? '−' : '+'} ${num(Math.abs(b))} = <b>${num(v)}</b>. The point has y = ${num(y)}. ` + (on ? '<b>They match, so the point is on the line</b> (green).' : `<b>They differ, so the point is not on the line</b> (red): the line passes through (${num(x)}, ${num(v)}) instead.`) + ' Click the grid to test another point, or change a and b.';
    cv.redraw();
  }
  upd();
}
