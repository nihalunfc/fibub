// Class 12 Determinants (step player): expanding a 3x3 determinant along the first row. Each entry of the row is multiplied by
// the determinant of the 2x2 left after deleting its row and column (its minor), with signs + - + alternating.
// Matrix used: [[2, 1, 3], [0, -1, 4], [1, 2, 5]]; the value is -19.
import { canvas, text, title, line } from '../../kit.js';
import { matrix, det2 } from '../c12m-lib.js';

const M = [[2, 1, 3], [0, -1, 4], [1, 2, 5]];
const minor = (j) => { const r = [1, 2].map((i) => M[i].filter((_, k) => k !== j)); return r; };
const mv = (j) => { const m = minor(j); return det2(m[0][0], m[0][1], m[1][0], m[1][1]); };
const terms = [0, 1, 2].map((j) => (j === 1 ? -1 : 1) * M[0][j] * mv(j));

export default function (host) {
  let step = 0;
  const cv = canvas(host, { aspect: 0.8, max: 440, min: 300, label: 'Expanding a 3 by 3 determinant along its first row, one term at a time' });
  const TITLES = ['The determinant of a 3×3 matrix', 'Term 1: + 2 × (its minor)', 'Term 2: − 1 × (its minor)', 'Term 3: + 3 × (its minor)', 'Add the three terms'];
  cv.draw = (ctx, w, h, col) => {
    const s = Math.min(step, 4), j = s >= 1 && s <= 3 ? s - 1 : -1;
    const top = title(ctx, TITLES[s], col) + 10, cx = w / 2;
    matrix(ctx, M, cx, top + 56, col, { cw: 44, ch: 30, size: 17, hl: (i, k) => (j >= 0 && i === 0 && k === j ? col.s[3] : j >= 0 && (i === 0 || k === j) ? col.line : null) });
    text(ctx, '|A| =', cx - 112, top + 56, { color: col.muted, size: 14, weight: 700, align: 'right' });
    if (j >= 0) {
      const m = minor(j), y = top + 128;
      text(ctx, `Minor of ${M[0][j]} (delete row 1, column ${j + 1}):`, cx, y - 20, { color: col.muted, size: 12, align: 'center' });
      matrix(ctx, m, cx - 70, y + 22, col, { cw: 40, ch: 28, size: 16, hl: () => col.s[0] });
      text(ctx, `= (${m[0][0]})(${m[1][1]}) − (${m[0][1]})(${m[1][0]}) = ${mv(j)}`, cx + 6, y + 22, { color: col.ink, size: 13.5, weight: 700 });
      const sign = j === 1 ? '−' : '+';
      text(ctx, `Term = ${sign} ${M[0][j]} × ${mv(j) < 0 ? '(' + mv(j) + ')' : mv(j)} = ${terms[j]}`, cx, y + 70, { color: col.s[3], size: 15, weight: 800, align: 'center' });
      text(ctx, 'sign pattern: +  −  +', cx, y + 96, { color: col.muted, size: 12, align: 'center' });
    }
    if (s === 4) {
      text(ctx, `${terms[0]} + (${terms[1]}) + ${terms[2]}`, cx, top + 135, { color: col.ink, size: 16, weight: 700, align: 'center' });
      text(ctx, `|A| = ${terms[0] + terms[1] + terms[2]}`, cx, top + 175, { color: col.s[1], size: 24, weight: 800, align: 'center' });
    }
    if (s === 0) text(ctx, 'Pick the first row and work along it.', cx, top + 130, { color: col.muted, size: 13, align: 'center' });
  };
  return { step(i) { step = Math.min(i, 4); cv.redraw(); } };
}
