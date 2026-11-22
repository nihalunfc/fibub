// Class 9 Coordinates (step player): how to plot (4, -3): start at the origin, move along x first, then along y, then mark the dot.
// It then plots (-2, 3) the same way to show that the signs only change the direction of each move.
import { canvas, text, title, dot, line, arrow } from '../../kit.js';
import { plane } from './c9-coord-plane.js';

const L = ['Start at the origin O (0, 0)', 'x = +4: 4 steps right', 'y = −3: 3 steps down', 'Mark (4, −3): quadrant IV', 'Next (−2, 3): x = −2, 2 steps left', 'y = +3: 3 steps up. Quadrant II']; 
export default function (host) {
  let s = 0;
  const cv = canvas(host, { aspect: 1, max: 440, min: 300, label: 'Plotting the points (4, -3) and (-2, 3) by walking along x first and then along y' });
  cv.draw = (ctx, w, h, col) => {
    const t = title(ctx, 'Plotting a point: x first, then y', col);
    text(ctx, L[s], 10, t + 12, { color: col.s[0], size: 13, weight: 700, halo: col.panel });
    const g = plane(ctx, w, h, col, { top: t + 28, x0: -5, x1: 6, y0: -5, y1: 5 });
    dot(ctx, g.X(0), g.Y(0), 4, col.ink);
    if (s >= 1) arrow(ctx, g.X(0), g.Y(0), g.X(Math.min(s, 3) === 1 ? 4 : 4), g.Y(0), col.s[0], 3);
    if (s >= 2) arrow(ctx, g.X(4), g.Y(0), g.X(4), g.Y(-3), col.s[2], 3);
    if (s >= 3) { dot(ctx, g.X(4), g.Y(-3), 7, col.s[5], col.ink); text(ctx, '(4, −3)', g.X(4) - 8, g.Y(-3) + 15, { color: col.ink, size: 12, weight: 700, align: 'right', halo: col.panel }); }
    if (s >= 4) arrow(ctx, g.X(0), g.Y(0), g.X(-2), g.Y(0), col.s[0], 3);
    if (s >= 5) { arrow(ctx, g.X(-2), g.Y(0), g.X(-2), g.Y(3), col.s[2], 3); dot(ctx, g.X(-2), g.Y(3), 7, col.s[5], col.ink); text(ctx, '(−2, 3)', g.X(-2) + 10, g.Y(3), { color: col.ink, size: 12, weight: 700, halo: col.panel }); }
  };
  cv.redraw();
  return { step(i) { s = Math.min(i, 5); cv.redraw(); } };
}
