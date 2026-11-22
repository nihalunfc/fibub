// Class 9 Numbers (step player): constructing sqrt(2) on the number line. The diagonal of a unit square has length sqrt(1^2 + 1^2) = sqrt 2.
// Swing a compass of that radius from 0 and the arc lands on the number line at the point sqrt 2 = 1.41421...
import { canvas, text, title, line, dot } from '../../kit.js';

export default function (host) {
  let s = 0;
  const cv = canvas(host, { aspect: 0.62, max: 440, min: 260, label: 'A unit square on the number line, its diagonal, and a compass arc that lands at the square root of two' });
  cv.draw = (ctx, w, h, col) => {
    const t = title(ctx, ['A number line with 0, 1 and 2', 'Build a unit square on the segment 0 to 1', 'Draw its diagonal: length √(1² + 1²) = √2', 'Compass at 0, radius = the diagonal: swing the arc down', 'The arc meets the line at the point √2', 'It sits between 1.4 and 1.5: 1.41421…'][s], col);
    const sc = (w - 56) / 2.4, ox = 26, oy = h - 46, X = (v) => ox + v * sc, Y = (v) => oy - v * sc;
    line(ctx, [[X(-0.2), oy], [X(2.2), oy]], col.ink, 2.5);
    for (const v of [0, 1, 2]) { line(ctx, [[X(v), oy - 6], [X(v), oy + 6]], col.ink, 2); text(ctx, String(v), X(v), oy + 20, { color: col.ink, size: 13, weight: 700, align: 'center' }); }
    if (s >= 1) { ctx.save(); ctx.globalAlpha = 0.16; ctx.fillStyle = col.s[0]; ctx.fillRect(X(0), Y(1), sc, sc); ctx.restore(); line(ctx, [[X(0), oy], [X(1), oy], [X(1), Y(1)], [X(0), Y(1)], [X(0), oy]], col.s[0], 2.5); text(ctx, '1', X(0.5), Y(0.5), { color: col.s[0], size: 14, weight: 700, align: 'center' }); text(ctx, '1', X(1) + 8, Y(0.5), { color: col.s[0], size: 12, weight: 700 }); }
    if (s >= 2) { line(ctx, [[X(0), oy], [X(1), Y(1)]], col.s[5], 3); text(ctx, '√2', X(0.3), Y(0.62), { color: col.s[5], size: 14, weight: 700, halo: col.panel }); }
    if (s >= 3) { ctx.save(); ctx.strokeStyle = col.s[3]; ctx.lineWidth = 2.5; ctx.setLineDash([6, 4]); ctx.beginPath(); ctx.arc(X(0), oy, Math.SQRT2 * sc, -Math.PI / 4, s >= 4 ? 0 : -Math.PI / 4 + 0.01 + (s === 3 ? 0.5 : 0)); ctx.stroke(); ctx.restore(); }
    if (s >= 4) { dot(ctx, X(Math.SQRT2), oy, 7, col.s[3], col.ink); text(ctx, '√2 ≈ 1.414', X(Math.SQRT2), oy - 18, { color: col.ink, size: 13, weight: 700, align: 'center', halo: col.panel }); }
    if (s >= 5) { line(ctx, [[X(1.4), oy + 10], [X(1.5), oy + 10]], col.s[2], 4); }
  };
  cv.redraw();
  return { step(i) { s = Math.min(i, 5); cv.redraw(); } };
}
