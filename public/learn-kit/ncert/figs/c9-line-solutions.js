// Class 9 Two Variables, One Line: an equation a x + b y = c has many solutions (x, y). Each is a point; all of them lie on one straight line.
// Change a, b and c, and slide x to see the y that goes with it. The whole-number solutions show as dots.
import { canvas, text, title, row, slider, readout } from '../../kit.js';
import { plane, drawPlane, drawLine, eqn, pt } from './c9-line-lib.js';

export default function (host) {
  let a = 2, b = 1, c = 6, x = 1;
  const cv = canvas(host, { aspect: 0.85, max: 440, min: 290, label: 'The graph of a linear equation in two variables with a moving solution point' });
  const ctl = row(host);
  slider(ctl, { label: 'a (number of x)', min: 1, max: 4, step: 1, value: a, oninput: (v) => { a = v; sync(); } });
  slider(ctl, { label: 'b (number of y)', min: 1, max: 4, step: 1, value: b, oninput: (v) => { b = v; sync(); } });
  slider(ctl, { label: 'c (the total)', min: 2, max: 12, step: 1, value: c, oninput: (v) => { c = v; sync(); } });
  slider(ctl, { label: 'Choose x', min: -4, max: 8, step: 0.5, value: x, fmt: (v) => String(v), oninput: (v) => { x = v; sync(); } });
  const out = readout(host);
  const f = (v) => String(+v.toFixed(2));
  function sync() { const y = (c - a * x) / b; out.innerHTML = `<b>${eqn(a, b, c)}</b>. Put x = ${f(x)}: ${a}(${f(x)}) + ${b}y = ${c}, so y = <b>${f(y)}</b>. The pair (${f(x)}, ${f(y)}) is a solution, and it is a point on the line.`; cv.redraw(); }
  cv.draw = (ctx, w, h, col) => {
    const top = title(ctx, eqn(a, b, c) + ': every solution is a point', col), v = plane(w, h, top, -4, 8, -4, 8);
    drawPlane(ctx, v, col); drawLine(ctx, v, a, b, c, col.s[0]);
    for (let i = v.x0; i <= v.x1; i++) { const y = (c - a * i) / b; if (Number.isInteger(y) && y >= v.y0 && y <= v.y1) pt(ctx, v, i, y, col.s[1], 4); }
    const y = (c - a * x) / b; if (y >= v.y0 && y <= v.y1) { pt(ctx, v, x, y, col.s[2], 7, col.ink); text(ctx, '(' + f(x) + ', ' + f(y) + ')', v.X(x) + 10, v.Y(y) - 12, { color: col.ink, size: 11, weight: 700, halo: col.panel }); }
  };
  sync();
}
