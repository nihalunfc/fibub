// Class 12 Determinants (step player): Cramer's rule for three equations in three unknowns,
// x + y + z = 6, 2x - y + z = 3, x + 2y - z = 2. D uses the coefficients; Dx, Dy, Dz replace one column by the constants.
// D = 7, Dx = 7, Dy = 14, Dz = 21, so (x, y, z) = (1, 2, 3).
import { canvas, text, title } from '../../kit.js';
import { matrix, det3 } from '../c12m-lib.js';

const A = [[1, 1, 1], [2, -1, 1], [1, 2, -1]], B = [6, 3, 2];
const rep = (k) => A.map((r, i) => r.map((v, j) => (j === k ? B[i] : v)));
const D = det3(A), Dv = [0, 1, 2].map((k) => det3(rep(k))), names = ['x', 'y', 'z'];

export default function (host) {
  let step = 0;
  const cv = canvas(host, { aspect: 0.82, max: 440, min: 300, label: 'Solving three linear equations with Cramer rule, one determinant at a time' });
  const T = ['The system and its coefficient determinant D', 'Dx: replace column 1 by the constants', 'Dy: replace column 2 by the constants', 'Dz: replace column 3 by the constants', 'Divide: x = Dx/D, y = Dy/D, z = Dz/D'];
  cv.draw = (ctx, w, h, col) => {
    const s = Math.min(step, 4), top = title(ctx, T[s], col) + 6, cx = w / 2;
    ['x + y + z = 6', '2x − y + z = 3', 'x + 2y − z = 2'].forEach((e, i) => text(ctx, e, cx, top + 10 + i * 19, { color: col.muted, size: 13, weight: 600, align: 'center' }));
    const y0 = top + 120;
    if (s <= 3) {
      const k = s - 1, M = s === 0 ? A : rep(k);
      matrix(ctx, M, cx, y0 + 12, col, { cw: 46, ch: 30, size: 17, hl: (i, j) => (j === k ? col.s[3] : null) });
      text(ctx, s === 0 ? '|D|' : `|D${names[k]}|`, cx - 100, y0 + 12, { color: col.muted, size: 14, weight: 800, align: 'right' });
      text(ctx, `= ${s === 0 ? D : Dv[k]}`, cx + 100, y0 + 12, { color: col.s[1], size: 20, weight: 800 });
      text(ctx, s === 0 ? 'expand along row 1: 1(−1) − 1(−3) + 1(5) = 7' : 'the same kind of expansion', cx, y0 + 72, { color: col.muted, size: 12, align: 'center' });
      const done = [s >= 0 ? `D = ${D}` : '', s >= 1 ? `Dx = ${Dv[0]}` : '', s >= 2 ? `Dy = ${Dv[1]}` : '', s >= 3 ? `Dz = ${Dv[2]}` : ''].filter(Boolean).join('   ');
      text(ctx, done, cx, y0 + 96, { color: col.ink, size: 13, weight: 700, align: 'center' });
    } else {
      names.forEach((n, i) => text(ctx, `${n} = D${n}/D = ${Dv[i]}/${D} = ${Dv[i] / D}`, cx, y0 + i * 30, { color: col.s[1], size: 18, weight: 800, align: 'center' }));
      text(ctx, 'check eq. 2: 2(1) − 2 + 3 = 3 ✓', cx, y0 + 108, { color: col.muted, size: 12.5, align: 'center' });
    }
  };
  return { step(i) { step = Math.min(i, 4); cv.redraw(); } };
}
