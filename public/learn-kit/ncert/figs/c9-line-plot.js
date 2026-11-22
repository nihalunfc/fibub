// Class 9 Two Variables, One Line (step player): graph x + 2y = 6 by choosing x, finding y, plotting the points and joining them.
// Three points are enough to draw it, and the third checks the first two. A point that does not satisfy the equation is off the line.
import { canvas, text, title } from '../../kit.js';
import { plane, drawPlane, drawLine, pt, note } from './c9-line-lib.js';

const N = ['Graph x + 2y = 6. We need some solutions: choose a value of x, then work out y.', 'Choose x = 0. Then 2y = 6, so y = 3. The solution (0, 3) is plotted.', 'Choose x = 2. Then 2 + 2y = 6, so y = 2. Plot (2, 2).', 'Choose x = 4. Then 4 + 2y = 6, so y = 1. Plot (4, 1).', 'The three points are in a straight line. Join them with a ruler and extend both ends: this is the graph.', 'Check: (6, 0) is on the line and 6 + 0 = 6 works. (3, 3) is off the line and 3 + 6 = 9, not 6.'];
export default function (host) {
  let s = 0;
  const cv = canvas(host, { aspect: 0.95, max: 440, min: 300, label: 'Plotting three solutions of x + 2y = 6 and joining them to make a straight line' });
  cv.draw = (ctx, w, h, col) => {
    const top = title(ctx, 'Graph of x + 2y = 6', col), v = plane(w, h - 62, top, -2, 9, -2, 5.5, 4);
    drawPlane(ctx, v, col);
    if (s >= 4) drawLine(ctx, v, 1, 2, 6, col.s[0]);
    [[0, 3], [2, 2], [4, 1]].forEach(([x, y], i) => { if (s > i) { pt(ctx, v, x, y, col.s[2], 6, col.ink); text(ctx, `(${x}, ${y})`, v.X(x) + 8, v.Y(y) - 12, { color: col.ink, size: 11, weight: 700, halo: col.panel }); } });
    if (s === 5) { pt(ctx, v, 6, 0, col.s[1], 6, col.ink); text(ctx, '(6, 0) ✓', v.X(6), v.Y(0) - 14, { color: col.s[1], size: 11, weight: 700, align: 'center', halo: col.panel }); pt(ctx, v, 3, 3, col.s[4], 6, col.ink); text(ctx, '(3, 3) ✗', v.X(3) + 8, v.Y(3) - 12, { color: col.s[4], size: 11, weight: 700, halo: col.panel }); }
    note(ctx, N[s], w, h, col);
  };
  cv.redraw();
  return { step(i) { s = Math.min(i, 5); cv.redraw(); } };
}
