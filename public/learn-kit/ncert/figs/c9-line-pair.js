// Class 9 Two Variables, One Line (a peek ahead): draw two lines. A solution of BOTH equations is a point on BOTH lines, so it is where they cross.
// Lines can cross in one point, be parallel (no common solution), or be the same line (endless common solutions).
import { canvas, text, title, row, slider, button, readout } from '../../kit.js';
import { plane, drawPlane, drawLine, eqn, pt } from './c9-line-lib.js';

export default function (host) {
  let a2 = 1, b2 = -1, c2 = 2, sl;
  const cv = canvas(host, { aspect: 0.9, max: 440, min: 290, label: 'Two lines on a coordinate plane that cross, are parallel, or coincide' });
  const ctl = row(host);
  button(ctl, 'x − y = c: they cross', () => { a2 = 1; b2 = -1; c2 = 2; sl.set(2); sync(); });
  button(ctl, '2x + 2y = c: parallel or same', () => { a2 = 2; b2 = 2; c2 = 8; sl.set(8); sync(); });
  sl = slider(ctl, { label: 'c of the second line', min: -4, max: 16, step: 1, value: c2, oninput: (v) => { c2 = v; sync(); } });
  const out = readout(host);
  const det = () => 1 * b2 - a2 * 1;
  function sync() {
    const D = det();
    if (D !== 0) { const x = (6 * b2 - c2) / D, y = (c2 - a2 * 6) / D; out.innerHTML = `Line 1: x + y = 6. Line 2: ${eqn(a2, b2, c2)}. They cross at <b>(${+x.toFixed(2)}, ${+y.toFixed(2)})</b>, the one pair that works in both equations.`; }
    else if (c2 * 1 === 6 * a2) out.innerHTML = `Line 1: x + y = 6. Line 2: ${eqn(a2, b2, c2)}. This is the <b>same line</b> (divide by ${a2}): every solution of one is a solution of the other.`;
    else out.innerHTML = `Line 1: x + y = 6. Line 2: ${eqn(a2, b2, c2)}. The lines are <b>parallel</b>: they never meet, so no pair works in both equations.`;
    cv.redraw();
  }
  cv.draw = (ctx, w, h, col) => {
    const top = title(ctx, 'Two equations, two lines', col), v = plane(w, h, top, -4, 12, -4, 10);
    drawPlane(ctx, v, col); drawLine(ctx, v, 1, 1, 6, col.s[0], 3.5); drawLine(ctx, v, a2, b2, c2, col.s[4], 2.5, det() === 0 ? [7, 5] : undefined);
    const D = det(); if (D !== 0) { const x = (6 * b2 - c2) / D, y = (c2 - a2 * 6) / D; if (x >= v.x0 && x <= v.x1 && y >= v.y0 && y <= v.y1) { pt(ctx, v, x, y, col.s[2], 7, col.ink); text(ctx, `(${+x.toFixed(1)}, ${+y.toFixed(1)})`, v.X(x) + 10, v.Y(y) - 12, { color: col.ink, size: 11, weight: 700, halo: col.panel }); } }
  };
  sync();
}
