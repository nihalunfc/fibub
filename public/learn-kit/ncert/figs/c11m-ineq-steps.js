// Class 11 Maths, Linear Inequalities: solving 3x − 5 ≤ 7 + x step by step. Each step does the same thing to both
// sides, and the number line below shows the solution set at the end. Stepping through also shows where the
// "flip the sign" rule would matter (only when multiplying or dividing by a negative number).
import { canvas, line, dot, text, title } from '../../kit.js';

const S = ['3x − 5 ≤ 7 + x', '3x − x − 5 ≤ 7', '2x ≤ 12', 'x ≤ 6'];
const N = ['Start: the unknown is on both sides.', 'Subtract x from both sides (the sign stays).', 'Add 5 to both sides (the sign stays).', 'Divide both sides by 2 (positive, so no flip).'];
export default function (host) {
  const cv = canvas(host, { aspect: 0.7, max: 440, min: 270, label: 'Steps of solving 3x minus 5 at most 7 plus x, ending with a number line' });
  let s = 0;
  cv.draw = (ctx, w, h, col) => {
    const top = title(ctx, 'Solve 3x − 5 ≤ 7 + x', col); const rows = [['3x − 5 ≤ 7 + x', ''], ['2x − 5 ≤ 7', '− x'], ['2x ≤ 12', '+ 5'], ['x ≤ 6', '÷ 2']];
    for (let i = 0; i <= s; i++) { const y = top + 22 + i * 28; text(ctx, rows[i][0], w * 0.1, y, { color: i === s ? col.ink : col.muted, size: 17, weight: i === s ? 700 : 400 }); if (rows[i][1]) text(ctx, rows[i][1] + ' both sides', w * 0.62, y, { color: col.s[0], size: 11.5 }); }
    const y = h - 40, X = (v) => 20 + ((v + 2) / 12) * (w - 40);
    line(ctx, [[20, y], [w - 20, y]], col.muted, 1.5);
    for (let v = -2; v <= 10; v += 2) { line(ctx, [[X(v), y - 4], [X(v), y + 4]], col.muted, 1); text(ctx, String(v).replace('-', '−'), X(v), y + 15, { color: col.muted, size: 10.5, align: 'center' }); }
    if (s === 3) { line(ctx, [[20, y], [X(6), y]], col.s[0], 4); dot(ctx, X(6), y, 7, col.s[0], col.panel); text(ctx, 'every x up to and including 6', w / 2, y - 18, { color: col.s[0], size: 12, weight: 700, align: 'center' }); }
    else text(ctx, 'solution set appears at the last step', w / 2, y - 18, { color: col.muted, size: 11.5, align: 'center' });
  };
  cv.redraw();
  return { step(i, n) { s = Math.min(Math.max(i, 0), 3); cv.redraw(); } };
}
