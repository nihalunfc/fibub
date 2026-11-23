// Class 12 Determinants (step player): the inverse of a 3x3 matrix by the adjoint method, A^-1 = adj(A) / |A|.
// Matrix A = [[1,1,0],[0,1,1],[1,0,1]] with |A| = 2. Steps: find |A|, find every cofactor, transpose the cofactor matrix to get
// adj A, divide by |A|, check that A times A^-1 is the identity.
import { canvas, text, title } from '../../kit.js';
import { matrix, det2 } from '../c12m-lib.js';

const A = [[1, 1, 0], [0, 1, 1], [1, 0, 1]];
const cof = (i, j) => { const r = [0, 1, 2].filter((x) => x !== i).map((x) => A[x].filter((_, k) => k !== j)); return ((i + j) % 2 ? -1 : 1) * det2(r[0][0], r[0][1], r[1][0], r[1][1]); };
const C = [0, 1, 2].map((i) => [0, 1, 2].map((j) => cof(i, j)));
const ADJ = [0, 1, 2].map((i) => [0, 1, 2].map((j) => C[j][i]));
const half = (v) => (v === 0 ? '0' : (v < 0 ? '−' : '') + (Math.abs(v) === 1 ? '1/2' : Math.abs(v) + '/2'));

export default function (host) {
  let step = 0;
  const cv = canvas(host, { aspect: 0.82, max: 440, min: 300, label: 'Finding the inverse of a 3 by 3 matrix with cofactors and the adjoint' });
  const T = ['Start with A and find |A|', 'Cofactor matrix: one 2×2 minor per entry', 'Transpose the cofactors: adj A', 'Divide by |A|: the inverse', 'Check: A × A⁻¹ = I'];
  cv.draw = (ctx, w, h, col) => {
    const s = Math.min(step, 4), top = title(ctx, T[s], col) + 8, cx = w / 2, cy = top + 70;
    const sm = { cw: 42, ch: 28, size: 15 };
    if (s === 0) {
      matrix(ctx, A, cx, cy, col, { ...sm, cw: 44, ch: 32, size: 17 });
      text(ctx, '|A| = 1(1·1 − 1·0) − 1(0·1 − 1·1) + 0 = 1 + 1 = 2', cx, cy + 66, { color: col.ink, size: 12.5, weight: 700, align: 'center' });
      text(ctx, '|A| ≠ 0, so A is non-singular and an inverse exists.', cx, cy + 90, { color: col.s[1], size: 12.5, weight: 700, align: 'center' });
    } else if (s === 1) {
      matrix(ctx, C, cx, cy, col, { ...sm, cw: 44, ch: 32, size: 17, hl: (i, j) => ((i + j) % 2 ? col.s[2] : col.s[1]) });
      text(ctx, 'C = cofactor matrix', cx, cy - 36 - 12, { color: col.muted, size: 12, align: 'center' });
      text(ctx, 'e.g. C₁₂ = −(0·1 − 1·1) = 1 (sign − at position 1,2)', cx, cy + 66, { color: col.ink, size: 12.5, weight: 700, align: 'center' });
      text(ctx, 'green: sign +, red: sign −', cx, cy + 88, { color: col.muted, size: 11.5, align: 'center' });
    } else if (s === 2) {
      matrix(ctx, C, w * 0.27, cy, col, { ...sm, cw: 38 });
      text(ctx, 'transpose →', w * 0.5, cy, { color: col.s[3], size: 12.5, weight: 700, align: 'center' });
      matrix(ctx, ADJ, w * 0.76, cy, col, { ...sm, cw: 38, hl: () => col.s[0] });
      text(ctx, 'adj A', w * 0.76, cy - 36 - 12, { color: col.muted, size: 12, align: 'center' });
      text(ctx, 'rows become columns', cx, cy + 66, { color: col.ink, size: 12.5, weight: 700, align: 'center' });
    } else if (s === 3) {
      text(ctx, 'A⁻¹ = 1/2 ×', w * 0.2, cy, { color: col.ink, size: 14, weight: 800, align: 'center' });
      matrix(ctx, ADJ, w * 0.5, cy, col, { ...sm, cw: 38 });
      text(ctx, '=', w * 0.67, cy, { color: col.ink, size: 16, weight: 800, align: 'center' });
      matrix(ctx, ADJ.map((r) => r.map(half)), w * 0.84, cy, col, { cw: 36, ch: 28, size: 13, hl: () => col.s[1] });
    } else {
      matrix(ctx, A, w * 0.17, cy, col, { cw: 28, ch: 26, size: 13 });
      text(ctx, '×', w * 0.325, cy, { color: col.ink, size: 16, weight: 800, align: 'center' });
      matrix(ctx, ADJ.map((r) => r.map(half)), w * 0.53, cy, col, { cw: 34, ch: 26, size: 12 });
      text(ctx, '=', w * 0.725, cy, { color: col.ink, size: 16, weight: 800, align: 'center' });
      matrix(ctx, [[1, 0, 0], [0, 1, 0], [0, 0, 1]], w * 0.86, cy, col, { cw: 24, ch: 26, size: 13, hl: (i, j) => (i === j ? col.s[1] : null) });
      text(ctx, 'e.g. row 1 × column 1 = 1/2 + 1/2 + 0 = 1', cx, cy + 66, { color: col.ink, size: 12.5, weight: 700, align: 'center' });
    }
  };
  return { step(i) { step = Math.min(i, 4); cv.redraw(); } };
}
