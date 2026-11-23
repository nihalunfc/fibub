// Class 12 Maths, Probability (step player): the multiplication theorem P(A and B) = P(A) P(B | A) on a probability tree.
// A bag holds 4 red and 6 blue marbles; two are drawn one after the other WITHOUT putting the first back. Multiply along a path, add the paths you want.
import { canvas, text, title, line, dot } from '../../kit.js';

export default function (host) {
  let st = 0;
  const cv = canvas(host, { aspect: 0.95, max: 440, min: 320, label: 'A probability tree for drawing two marbles without replacement, built one step at a time' });
  const TT = ['First draw: 4 red, 6 blue', 'After a red: 3 red, 6 blue left', 'After a blue: 4 red, 5 blue left', 'Multiply along a path', 'One of each colour: add two paths', 'All four paths add to 1'];
  cv.draw = (ctx, w, h, col) => {
    const top = title(ctx, TT[st], col) + 10;
    const x0 = 22, x1 = w * 0.42, x2 = w * 0.52, H = h - top - 40, ys = [0.12, 0.34, 0.62, 0.86].map((f) => top + f * H), y1 = [(ys[0] + ys[1]) / 2, (ys[2] + ys[3]) / 2], yc = (y1[0] + y1[1]) / 2;
    const P = [['R', 'R', 4 / 10 * 3 / 9, '4/10 × 3/9 = 12/90'], ['R', 'B', 4 / 10 * 6 / 9, '4/10 × 6/9 = 24/90'], ['B', 'R', 6 / 10 * 4 / 9, '6/10 × 4/9 = 24/90'], ['B', 'B', 6 / 10 * 5 / 9, '6/10 × 5/9 = 30/90']];
    const hi = (i) => (st === 3 && i === 0) || (st === 4 && (i === 1 || i === 2)) || st === 5;
    const lab = (a, b, t, c = col.ink, dx = 0, dy = -7) => text(ctx, t, (a[0] + b[0]) / 2 + dx, (a[1] + b[1]) / 2 + dy, { color: c, size: 11, weight: 700, align: 'center', halo: col.panel });
    const O = [x0, yc], R1 = [x1, y1[0]], B1 = [x1, y1[1]];
    line(ctx, [O, R1], col.s[1], 2); line(ctx, [O, B1], col.s[0], 2);
    lab(O, R1, '4/10', col.s[1], -10); lab(O, B1, '6/10', col.s[0], -10, 12);
    dot(ctx, O[0], O[1], 4, col.ink); dot(ctx, R1[0], R1[1], 5, col.s[1]); dot(ctx, B1[0], B1[1], 5, col.s[0]);
    text(ctx, 'R', R1[0] + 8, R1[1], { color: col.s[1], size: 13, weight: 700 }); text(ctx, 'B', B1[0] + 8, B1[1], { color: col.s[0], size: 13, weight: 700 });
    if (st >= 1) [[R1, ys[0], 'R', '3/9', col.s[1]], [R1, ys[1], 'B', '6/9', col.s[0]]].forEach(([f, y, c, p, cc]) => { const e = [x2, y]; line(ctx, [f, e], cc, 2); lab(f, e, p, cc, 0, -7); text(ctx, c, e[0] + 8, y, { color: cc, size: 13, weight: 700 }); });
    if (st >= 2) [[B1, ys[2], 'R', '4/9', col.s[1]], [B1, ys[3], 'B', '5/9', col.s[0]]].forEach(([f, y, c, p, cc]) => { const e = [x2, y]; line(ctx, [f, e], cc, 2); lab(f, e, p, cc, 0, -7); text(ctx, c, e[0] + 8, y, { color: cc, size: 13, weight: 700 }); });
    if (st >= 3) P.forEach((q, i) => { if (st === 3 && i > 0) return; text(ctx, `${q[0]}${q[1]} = ${Math.round(q[2] * 90)}/90`, x2 + 26, ys[i] + (hi(i) ? 0 : 0), { color: hi(i) ? col.s[3] : col.muted, size: 11, weight: hi(i) ? 700 : 400 }); });
    if (st === 3) text(ctx, 'P(R then R) = 4/10 × 3/9 = 12/90 = 2/15', 12, h - 16, { color: col.s[3], size: 12, weight: 700 });
    if (st === 4) text(ctx, 'P(one of each) = 24/90 + 24/90 = 48/90 = 8/15', 12, h - 16, { color: col.s[3], size: 12, weight: 700 });
    if (st === 5) text(ctx, '12/90 + 24/90 + 24/90 + 30/90 = 90/90 = 1', 12, h - 16, { color: col.s[3], size: 12, weight: 700 });
  };
  cv.redraw();
  return { step(i) { st = Math.min(5, i); cv.redraw(); } };
}
