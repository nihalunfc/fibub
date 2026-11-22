// Class 9 Two Variables, One Line: x = k is a vertical line (every point has the same x, y is free) and y = k is a horizontal line.
// The y-axis is x = 0 and the x-axis is y = 0.
import { canvas, text, title, row, slider, choice, readout } from '../../kit.js';
import { plane, drawPlane, drawLine, pt } from './c9-line-lib.js';

export default function (host) {
  let k = 3, kind = 'x';
  const cv = canvas(host, { aspect: 0.85, max: 440, min: 290, label: 'A vertical or horizontal line x = k or y = k on a coordinate plane' });
  const ctl = row(host);
  choice(ctl, 'Equation', [['x', 'x = k'], ['y', 'y = k']], kind, (v) => { kind = v; sync(); });
  slider(ctl, { label: 'k', min: -5, max: 5, step: 1, value: k, oninput: (v) => { k = v; sync(); } });
  const out = readout(host);
  function sync() {
    const ys = [-3, 0, 4];
    out.innerHTML = kind === 'x' ? `<b>x = ${k}</b> means x + 0·y = ${k}. Every point has x = ${k}, and y can be anything: ${ys.map((y) => `(${k}, ${y})`).join(', ')} are all solutions. The graph is a <b>vertical</b> line${k === 0 ? ' (this is the y-axis)' : ''}.` : `<b>y = ${k}</b> means 0·x + y = ${k}. Every point has y = ${k}, and x can be anything: ${ys.map((x) => `(${x}, ${k})`).join(', ')} are all solutions. The graph is a <b>horizontal</b> line${k === 0 ? ' (this is the x-axis)' : ''}.`;
    cv.redraw();
  }
  cv.draw = (ctx, w, h, col) => {
    const top = title(ctx, (kind === 'x' ? 'x = ' : 'y = ') + k, col), v = plane(w, h, top, -6, 6, -6, 6);
    drawPlane(ctx, v, col);
    if (kind === 'x') { drawLine(ctx, v, 1, 0, k, col.s[0]); [-3, 0, 4].forEach((y) => pt(ctx, v, k, y, col.s[2], 5, col.ink)); } else { drawLine(ctx, v, 0, 1, k, col.s[0]); [-3, 0, 4].forEach((x) => pt(ctx, v, x, k, col.s[2], 5, col.ink)); }
  };
  sync();
}
