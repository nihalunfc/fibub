// Class 9 Quadrilaterals (step player): the four angles of any quadrilateral add up to 360 degrees, because a diagonal
// splits it into two triangles and each triangle's angles add up to 180 degrees.
import { canvas, text, title } from '../../kit.js';
import { view, shape, seg, note, wedge } from './c9-quad-lib.js';

const N = ['Any four-sided shape ABCD. Its four angles are marked.', 'Draw the diagonal AC. It splits ABCD into two triangles, ABC and ACD.', 'Triangle ABC has angles adding to 180°. Its angles are B, and parts of A and C.', 'Triangle ACD also adds to 180°. Its angles are D, and the other parts of A and C.', 'Together the two triangles use all four angles of ABCD: 180° + 180° = 360°.'];
export default function (host) {
  let s = 0;
  const cv = canvas(host, { aspect: 0.85, max: 440, min: 290, label: 'A quadrilateral split by a diagonal into two triangles, each with angle sum 180 degrees' });
  cv.draw = (ctx, w, h, col) => {
    const top = title(ctx, 'Angle sum of a quadrilateral', col), V = view(w, h - 50, top, 10, 7, 4);
    const A = [1, 1], B = [9, 2], C = [8, 6.5], D = [2, 5.5];
    if (s >= 1) { shape(ctx, V, [A, B, C], col.s[0], null, s === 2 ? 0.4 : 0.15); shape(ctx, V, [A, C, D], col.s[1], null, s === 3 ? 0.4 : 0.15); }
    shape(ctx, V, [A, B, C, D], null, col.ink, 0, 2.5);
    if (s >= 1) seg(ctx, V, A, C, col.s[3], 2, [5, 4]);
    const lab = (p, t, dx, dy) => text(ctx, t, V.X(p[0]) + dx, V.Y(p[1]) + dy, { color: col.ink, size: 13, weight: 700, align: 'center', halo: col.panel });
    lab(A, 'A', -12, 8); lab(B, 'B', 12, 8); lab(C, 'C', 12, -8); lab(D, 'D', -12, -8);
    const wd = (p, q, r, c) => wedge(ctx, V, p, q, r, c);
    if (s === 0 || s === 4) { wd(A, B, D, col.s[0]); wd(B, C, A, col.s[1]); wd(C, D, B, col.s[2]); wd(D, A, C, col.s[4]); }
    if (s === 2) { wd(A, B, C, col.s[0]); wd(B, C, A, col.s[0]); wd(C, A, B, col.s[0]); }
    if (s === 3) { wd(A, C, D, col.s[1]); wd(C, D, A, col.s[1]); wd(D, A, C, col.s[1]); }
    if (s === 4) text(ctx, '180° + 180° = 360°', w / 2, h - 66, { color: col.s[3], size: 14, weight: 700, align: 'center' });
    note(ctx, N[s], w, h, col);
  };
  cv.redraw();
  return { step(i) { s = Math.min(i, 4); cv.redraw(); } };
}
