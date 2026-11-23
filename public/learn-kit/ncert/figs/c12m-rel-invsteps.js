// Class 12 Maths, Inverse of a function (step player): find the inverse of f(x) = 3x + 2 by solving for x, swapping names, and checking.
// The graph shows the inverse as the mirror image of f in the line y = x.
import { canvas, text, title, axes, line } from '../../kit.js';

const L = [
  ['f takes x, triples it, adds 2.', 'y = 3x + 2'],
  ['To undo f, work backwards: write y = f(x) and solve for x.', 'y = 3x + 2  →  3x = y − 2'],
  ['Divide by 3 to get x alone.', 'x = (y − 2) / 3'],
  ['The inverse takes y back to x. Rename the input as x, as usual.', 'f⁻¹(x) = (x − 2) / 3'],
  ['Check: f(f⁻¹(x)) = 3 · (x − 2)/3 + 2 = x, and f⁻¹(f(x)) = ((3x + 2) − 2)/3 = x.', 'f(f⁻¹(x)) = x  ✓   f⁻¹(f(x)) = x  ✓'],
  ['On a graph the two lines are mirror images in y = x: every point (a, b) of f becomes (b, a) on f⁻¹.', 'mirror in y = x'],
];
export default function (host) {
  let s = 0;
  const cv = canvas(host, { aspect: 1.15, max: 440, min: 330, label: 'Finding the inverse of 3x + 2 step by step with its mirror graph' });
  cv.draw = (ctx, w, h, col) => {
    const top = title(ctx, 'Inverse of f(x) = 3x + 2', col);
    for (let i = 0; i <= s; i++) text(ctx, L[i][1], 14, top + 18 + i * 19, { color: i === s ? col.ink : col.muted, size: i === s ? 13 : 12, weight: i === s ? 700 : 500 });
    const note = L[s][0], max = Math.floor((w - 24) / 6.3), ls = []; let cur = '';
    note.split(' ').forEach((wd) => { if ((cur + ' ' + wd).trim().length > max) { ls.push(cur); cur = wd; } else cur = (cur + ' ' + wd).trim(); }); ls.push(cur);
    const gy = top + 18 + 6 * 19 + 6, gh = h - gy - 10 - ls.length * 15;
    if (s >= 3) {
      const yr = (4 * (gh + 12)) / (w - 36);
      ctx.save(); ctx.translate(10, gy - 8); const A2 = axes(ctx, w - 20, gh + 20, col, { x: [-4, 4], y: [-yr, yr], l: 8, b: 8, t: 4, r: 10, fx: () => '', fy: () => '' });
      ctx.save(); A2.clip();
      line(ctx, [[A2.X(-4), A2.Y(-4)], [A2.X(4), A2.Y(4)]], col.muted, 1.2, [4, 4]);
      if (s >= 5 || s === 3 || s === 4) line(ctx, [[A2.X(-4), A2.Y(-10)], [A2.X(4), A2.Y(14)]], col.s[0], 2.5);
      line(ctx, [[A2.X(-10), A2.Y(-4)], [A2.X(14), A2.Y(4)]], col.s[2], 2.5);
      ctx.restore(); ctx.restore();
      text(ctx, 'f', w - 44, gy + 12, { color: col.s[0], size: 12, weight: 700 }); text(ctx, 'f⁻¹', w - 44, gy + gh - 16, { color: col.s[2], size: 12, weight: 700 });
    }
    ls.forEach((l, i) => text(ctx, l, 14, h - 10 - (ls.length - 1 - i) * 15, { color: col.ink, size: 11.5, weight: 600 }));
  };
  cv.redraw();
  return { step(i) { s = Math.min(i, L.length - 1); cv.redraw(); } };
}
