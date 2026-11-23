// Class 11 Maths, Linear Inequalities in two variables: the four-step method for graphing 2x + 3y ≤ 12.
// 1 draw the boundary line, 2 solid or dashed, 3 test the origin, 4 shade the side that is true.
import { canvas, axes, line, dot, text, title } from '../../kit.js';

export default function (host) {
  const cv = canvas(host, { aspect: 0.85, max: 440, min: 280, label: 'Graphing 2x plus 3y at most 12 in four steps' });
  let s = 0;
  cv.draw = (ctx, w, h, col) => {
    const top = title(ctx, '2x + 3y ≤ 12', col), g = axes(ctx, w, h, col, { x: [-2, 8], y: [-2, 7], l: 26, b: 22, t: top + 4, r: 10, xt: [0, 2, 4, 6, 8], yt: [0, 2, 4, 6] });
    ctx.save(); g.clip();
    if (s >= 3) { ctx.fillStyle = col.s[0]; ctx.globalAlpha = 0.22; ctx.beginPath(); ctx.moveTo(g.X(-2), g.Y(16 / 3)); ctx.lineTo(g.X(8), g.Y(-4 / 3)); ctx.lineTo(g.X(8), g.Y(-2)); ctx.lineTo(g.X(-2), g.Y(-2)); ctx.closePath(); ctx.fill(); ctx.globalAlpha = 1; }
    if (s >= 0) { line(ctx, [[g.X(-2), g.Y(16 / 3)], [g.X(8), g.Y(-4 / 3)]], col.s[0], 2.5); ctx.setLineDash([]); }
    ctx.restore();
    if (s === 0) { dot(ctx, g.X(6), g.Y(0), 6, col.s[1], col.panel); dot(ctx, g.X(0), g.Y(4), 6, col.s[1], col.panel); text(ctx, '(6, 0)', g.X(6), g.Y(0) - 12, { color: col.s[1], size: 11, weight: 700, align: 'center' }); text(ctx, '(0, 4)', g.X(0) + 8, g.Y(4) - 2, { color: col.s[1], size: 11, weight: 700 }); }
    if (s === 1) text(ctx, '≤ includes "=": the line itself is solid', w / 2, top + 14, { color: col.s[0], size: 11.5, weight: 700, align: 'center' });
    if (s >= 2) { dot(ctx, g.X(0), g.Y(0), 6, col.s[2], col.panel); text(ctx, s === 2 ? 'O: 0 ≤ 12 true' : 'O', g.X(0) + 10, g.Y(0) + 14, { color: col.s[2], size: 11.5, weight: 700 }); }
    if (s === 3) text(ctx, 'shade the side with O', g.X(1), g.Y(1.5), { color: col.ink, size: 11.5, weight: 700 });
  };
  cv.redraw();
  return { step(i) { s = Math.min(Math.max(i, 0), 3); cv.redraw(); } };
}
