// Class 12 Maths, Matrices: live problems (original fibub questions). Ids start with c12m-mat-.
import { pick, choose, n, steps } from './_util.js';

const mul = (A, B) => A.map((r) => B[0].map((_, j) => r.reduce((s, v, k) => s + v * B[k][j], 0)));
const fmtM = (M) => '[' + M.map((r) => '[' + r.join(', ') + ']').join(', ') + ']';
export default {
  'c12m-mat-orders': {
    title: 'possible orders of a matrix',
    make(r) {
      const N = choose(r, [12, 16, 18, 20, 24, 30, 36]); let c = 0; for (let i = 1; i <= N; i++) if (N % i === 0) c++;
      return { N, q: `<p>A matrix has <b>${N}</b> entries. How many different orders (m × n) is it possible for it to have?</p>`, answer: c, unit: '', tol: 0,
        hint: 'm × n = the number of entries, so count the ways to write it as a product of two whole numbers, order mattering.',
        solution: steps(`m × n = ${N}, so m is any factor of ${N}.`, `The factors of ${N} are ${Array.from({ length: N }, (_, i) => i + 1).filter((v) => N % v === 0).join(', ')}.`, `Number of orders = <b>${c}</b>.`) };
    },
    verify(x) { let c = 0; for (let i = 1; i * i <= x.N; i++) if (x.N % i === 0) c += i * i === x.N ? 1 : 2; return c; },
  },
  'c12m-mat-entry': {
    title: 'one entry of a matrix product',
    make(r) {
      const A = [[pick(r, 1, 5), pick(r, -3, 4), pick(r, 0, 6)], [pick(r, -2, 5), pick(r, 1, 6), pick(r, -3, 3)]], B = [[pick(r, 1, 4), pick(r, -2, 5)], [pick(r, 0, 5), pick(r, 1, 4)], [pick(r, -3, 4), pick(r, 0, 5)]], i = pick(r, 1, 2), j = pick(r, 1, 2);
      const answer = A[i - 1].reduce((s, v, k) => s + v * B[k][j - 1], 0);
      return { A, B, i, j, q: `<p>A = ${fmtM(A)} (2 × 3) and B = ${fmtM(B)} (3 × 2). Find the entry in row <b>${i}</b>, column <b>${j}</b> of AB.</p>`, answer, unit: '', tol: 0, abs: 0.001,
        hint: `Multiply row ${i} of A by column ${j} of B, entry by entry, and add.`,
        solution: steps(`Row ${i} of A: (${A[i - 1].join(', ')}). Column ${j} of B: (${B.map((rw) => rw[j - 1]).join(', ')}).`, `${A[i - 1].map((v, k) => `${v}×${B[k][j - 1]}`).join(' + ')} = <b>${answer}</b>.`) };
    },
    verify(x) { return mul(x.A, x.B)[x.i - 1][x.j - 1]; },
  },
  'c12m-mat-square': {
    title: 'sum of the entries of A²',
    make(r) {
      const a = pick(r, -3, 4), b = pick(r, -3, 4), c = pick(r, -3, 4), d = pick(r, -3, 4), answer = a * a + b * c + a * b + b * d + a * c + c * d + b * c + d * d;
      return { a, b, c, d, q: `<p>A = [[${a}, ${b}], [${c}, ${d}]]. Find the sum of all four entries of A².</p>`, answer, unit: '', tol: 0, abs: 0.001,
        hint: 'Work out A × A with row by column, then add up the four entries.',
        solution: steps(`A² = [[${a}·${a}+${b}·${c}, ${a}·${b}+${b}·${d}], [${c}·${a}+${d}·${c}, ${c}·${b}+${d}·${d}]].`, `= [[${a * a + b * c}, ${a * b + b * d}], [${c * a + d * c}, ${c * b + d * d}]].`, `Sum = <b>${answer}</b>.`) };
    },
    verify(x) { return mul([[x.a, x.b], [x.c, x.d]], [[x.a, x.b], [x.c, x.d]]).flat().reduce((s, v) => s + v, 0); },
  },
  'c12m-mat-skew': {
    title: 'completing a skew-symmetric matrix',
    make(r) {
      const a = pick(r, 1, 9), b = pick(r, -6, 8), c = pick(r, 1, 9), answer = -(a + b + c);
      return { a, b, c, q: `<p>The matrix [[0, ${a}, ${b}], [p, 0, ${c}], [q, s, 0]] is skew-symmetric. Find p + q + s.</p>`, answer, unit: '', tol: 0, abs: 0.001,
        hint: 'Skew-symmetric means Aᵀ = −A, so each entry mirrors across the diagonal with its sign changed.',
        solution: steps(`p = −${a}, q = −(${b}) = ${-b}, s = −${c}.`, `p + q + s = <b>${answer}</b>.`) };
    },
    verify(x) { const A = [[0, x.a, x.b], [0, 0, x.c], [0, 0, 0]], low = (i, j) => -A[j][i]; return low(1, 0) + low(2, 0) + low(2, 1); },
  },
  'c12m-mat-power': {
    title: 'a power of a shear matrix',
    make(r) {
      const a = pick(r, 1, 6), k = pick(r, 3, 9), answer = a * k;
      return { a, k, q: `<p>A = [[1, ${a}], [0, 1]]. Find the top-right entry of A<sup>${k}</sup>.</p>`, answer, unit: '', tol: 0, abs: 0.001,
        hint: 'Work out A², A³ and spot the pattern in the top-right entry.',
        solution: steps(`A² = [[1, ${2 * a}], [0, 1]], A³ = [[1, ${3 * a}], [0, 1]]: the top-right entry grows by ${a} each time.`, `Aⁿ = [[1, n·${a}], [0, 1]], so for n = ${k} the entry is <b>${answer}</b>.`) };
    },
    verify(x) { let M = [[1, x.a], [0, 1]], P = [[1, 0], [0, 1]]; for (let i = 0; i < x.k; i++) P = mul(P, M); return P[0][1]; },
  },
  'c12m-mat-inverse': {
    title: 'sum of the entries of an inverse',
    make(r) {
      const M = choose(r, [[[2, 1], [1, 1]], [[3, 2], [1, 1]], [[5, 2], [2, 1]], [[1, 2], [3, 7]], [[7, 3], [2, 1]], [[4, 3], [1, 1]]]), [[a, b], [c, d]] = M, det = a * d - b * c, answer = (d - b - c + a) / det;
      return { M, q: `<p>Find the sum of the four entries of the inverse of A = ${fmtM(M)}.</p>`, answer, unit: '', tol: 0, abs: 0.001,
        hint: 'For [[a, b], [c, d]] with determinant D, the inverse is (1/D)[[d, −b], [−c, a]].',
        solution: steps(`D = ${a}·${d} − ${b}·${c} = ${det}.`, `A⁻¹ = (1/${det}) [[${d}, ${-b}], [${-c}, ${a}]].`, `Sum of entries = (${d} − ${b} − ${c} + ${a})/${det} = <b>${answer}</b>.`) };
    },
    verify(x) { const [[a, b], [c, d]] = x.M, det = a * d - b * c, i1 = [d / det, -c / det], i2 = [-b / det, a / det]; /* columns by Cramer: A·col = e */ return i1[0] + i1[1] + i2[0] + i2[1]; },
  },
};
