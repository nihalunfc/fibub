// Class 12 Maths, Determinants: live problems (original fibub questions). Ids start with c12m-det-.
import { pick, choose, n, steps, tidyProblems } from './_util.js';

// A matrix as a small HTML table with brackets (bars when bar is true).
const mx = (M, bar = false) => `<table style="display:inline-table;vertical-align:middle;margin:0 4px;border-collapse:collapse;border-left:2px solid currentColor;border-right:2px solid currentColor;border-radius:${bar ? 0 : 6}px"><tbody>${M.map((r) => `<tr>${r.map((v) => `<td style="padding:1px 7px;text-align:center">${v}</td>`).join('')}</tr>`).join('')}</tbody></table>`;
const d2 = (a, b, c, d) => a * d - b * c;
const SETS3 = [[[2, 1, 3], [0, -1, 4], [1, 2, 5]], [[1, 2, 0], [3, -1, 2], [4, 0, 1]], [[3, 0, 2], [1, 4, -1], [2, 5, 1]], [[2, -1, 1], [0, 3, 2], [1, 1, 4]], [[1, 4, 2], [2, 0, 3], [-1, 3, 1]], [[5, 1, 0], [2, 3, 1], [0, 4, 2]]];
const TRI = [[[0, 0], [4, 0], [0, 3]], [[1, 1], [5, 2], [3, 6]], [[-2, 0], [2, 1], [0, 5]], [[1, 2], [4, 3], [2, 7]], [[0, 1], [6, 2], [3, -4]], [[-1, -1], [3, 0], [1, 5]]];
const SYS = [[2, 1, 3, 5], [1, 2, 4, 3], [3, 1, 1, 2], [2, 3, 5, 1], [4, 1, 2, 7], [1, 3, 2, 4]];

export default tidyProblems({
  'c12m-det-three': {
    title: 'value of a 3 × 3 determinant',
    make(r) {
      const M = choose(r, SETS3), v = M[0][0] * d2(M[1][1], M[1][2], M[2][1], M[2][2]) - M[0][1] * d2(M[1][0], M[1][2], M[2][0], M[2][2]) + M[0][2] * d2(M[1][0], M[1][1], M[2][0], M[2][1]);
      return { M, q: `<p>Find the value of the determinant ${mx(M, true)}</p>`, answer: v, abs: 0.01, tol: 0, unit: '',
        hint: 'Expand along the first row with signs + − +, using a 2 × 2 minor for each entry.',
        solution: steps(`Term 1: +${M[0][0]} × (${M[1][1]}×${M[2][2]} − ${M[1][2]}×${M[2][1]}) = ${M[0][0] * d2(M[1][1], M[1][2], M[2][1], M[2][2])}.`, `Term 2: −${M[0][1]} × (${M[1][0]}×${M[2][2]} − ${M[1][2]}×${M[2][0]}) = ${-M[0][1] * d2(M[1][0], M[1][2], M[2][0], M[2][2])}.`, `Term 3: +${M[0][2]} × (${M[1][0]}×${M[2][1]} − ${M[1][1]}×${M[2][0]}) = ${M[0][2] * d2(M[1][0], M[1][1], M[2][0], M[2][1])}.`, `Sum = <b>${v}</b>.`) };
    },
    // Sarrus rule: a different way from the cofactor expansion
    verify: (x) => { const m = x.M; return m[0][0] * m[1][1] * m[2][2] + m[0][1] * m[1][2] * m[2][0] + m[0][2] * m[1][0] * m[2][1] - m[0][2] * m[1][1] * m[2][0] - m[0][0] * m[1][2] * m[2][1] - m[0][1] * m[1][0] * m[2][2]; },
  },
  'c12m-det-tri': {
    title: 'area of a triangle from a determinant',
    make(r) {
      const P = choose(r, TRI), D = P.map(([x, y]) => [x, y, 1]);
      const d = P[0][0] * (P[1][1] - P[2][1]) + P[1][0] * (P[2][1] - P[0][1]) + P[2][0] * (P[0][1] - P[1][1]);
      return { P, q: `<p>Using a determinant, find the area (in square units) of the triangle with corners A(${P[0]}), B(${P[1]}) and C(${P[2]}).</p>`, answer: Math.abs(d) / 2, tol: 0.01, unit: 'sq units',
        hint: 'Area = ½ |det| with rows (x, y, 1). The answer is the absolute value.',
        solution: steps(`Write ${mx(D, true)}`, `Expanding along row 1 gives ${P[0][0]}(${P[1][1]} − ${P[2][1]}) − ${P[0][1]}(${P[1][0]} − ${P[2][0]}) + 1(${P[1][0] * P[2][1]} − ${P[2][0] * P[1][1]}) = ${d}.`, `Area = ½ × |${d}| = <b>${n(Math.abs(d) / 2)}</b> square units.`) };
    },
    // shoelace formula from the edge vectors
    verify: (x) => { const [a, b, c] = x.P; const u = [b[0] - a[0], b[1] - a[1]], v = [c[0] - a[0], c[1] - a[1]]; return Math.abs(u[0] * v[1] - u[1] * v[0]) / 2; },
  },
  'c12m-det-cramer': {
    title: 'Cramer’s rule for two equations',
    make(r) {
      const [a, b, x, y] = choose(r, SYS), c = pick(r, 1, 3, 1), d = pick(r, 2, 5, 1) + (a === 2 ? 1 : 0), e = a * x + b * y, f = c * x - d * y;
      return { a, b, c, d, e, f, x, y, q: `<p>Solve by Cramer’s rule and give the value of <b>x</b>:</p><p>${a}x + ${b}y = ${e}<br>${c}x − ${d}y = ${f}</p>`, answer: x, tol: 0, abs: 0.01, unit: '',
        hint: 'D = a₁b₂ − a₂b₁ with the coefficients, Dx = replace the x column by the constants.',
        solution: steps(`D = ${a}(−${d}) − ${b}(${c}) = ${-a * d - b * c}.`, `Dx = ${e}(−${d}) − ${b}(${f}) = ${-e * d - b * f}.`, `x = Dx/D = ${-e * d - b * f}/${-a * d - b * c} = <b>${x}</b>. (Then y = ${y}.)`) };
    },
    // elimination: multiply and subtract, a different route from the determinants
    verify: (p) => { const k = p.c / p.a; const yv = (p.f - k * p.e) / (-p.d - k * p.b); return (p.e - p.b * yv) / p.a; },
  },
  'c12m-det-inv2': {
    title: 'an entry of the inverse of a 2 × 2 matrix',
    make(r) {
      const [a, b, c, d] = choose(r, [[2, 1, 1, 3], [3, 2, 1, 4], [4, 1, 2, 5], [5, 2, 3, 4], [3, 1, 2, 6], [6, 2, 1, 5]]), D = a * d - b * c;
      return { a, b, c, d, q: `<p>For A = ${mx([[a, b], [c, d]])} find the entry in <b>row 1, column 1</b> of A⁻¹ (as a decimal, to 3 significant figures).</p>`, answer: d / D, tol: 0.01, unit: '',
        hint: 'For a 2 × 2 matrix, adj A swaps the diagonal entries and changes the signs of the other two; then divide by |A|.',
        solution: steps(`|A| = ${a}×${d} − ${b}×${c} = ${D}.`, `adj A = ${mx([[d, -b], [-c, a]])}.`, `A⁻¹ = adj A / ${D}, so the (1,1) entry is ${d}/${D} = <b>${n(d / D)}</b>.`) };
    },
    // solve A x = (1, 0)^T by elimination: x is the first column of the inverse
    verify: (p) => { const m = p.c / p.a; const y = (0 - m * 1) / (p.d - m * p.b); return (1 - p.b * y) / p.a; },
  },
  'c12m-det-k': {
    title: 'the value of k that makes a matrix singular',
    make(r) {
      const a = choose(r, [2, 3, 4, 5]), b = choose(r, [3, 4, 6]), c = choose(r, [1, 2]), k = a * b / c;
      return { a, b, c, q: `<p>For which value of k is the matrix ${mx([['k', a], [b * 1, c]])} singular (its inverse does not exist)?</p>`, answer: k, tol: 0.01, unit: '',
        hint: 'A matrix is singular when its determinant is 0. Write the determinant in terms of k and set it equal to 0.',
        solution: steps(`|A| = k×${c} − ${a}×${b} = ${c}k − ${a * b}.`, `Singular means |A| = 0, so ${c}k = ${a * b}.`, `k = <b>${n(k)}</b>.`) };
    },
    // |A| is linear in k: find the zero from two values
    verify: (p) => { const f = (k) => k * p.c - p.a * p.b; return -f(0) / (f(1) - f(0)); },
  },
  'c12m-det-adj': {
    title: 'determinant of the adjoint',
    make(r) {
      const D = choose(r, [2, 3, 4, 5, -2, -3]), k = choose(r, [2, 3]);
      return { D, k, q: `<p>A is a ${k === 2 ? '2 × 2' : '3 × 3'} matrix with |A| = ${D}. Find |adj A|.</p>`, answer: D ** (k - 1), tol: 0.01, unit: '',
        hint: 'For an n × n matrix, |adj A| = |A|<sup>n−1</sup>.',
        solution: steps(`For an n × n matrix, |adj A| = |A|<sup>n − 1</sup>.`, `Here n = ${k}, so |adj A| = (${D})<sup>${k - 1}</sup> = <b>${D ** (k - 1)}</b>.`) };
    },
    // from A adj A = |A| I, taking determinants: |A| |adj A| = |A|^n
    verify: (p) => (p.D ** p.k) / p.D,
  },
}, ['c12m-det-three', 'c12m-det-tri', 'c12m-det-cramer', 'c12m-det-k']);
