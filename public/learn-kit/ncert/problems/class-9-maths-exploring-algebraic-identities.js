// Class 9 Maths, Exploring Algebraic Identities: live problems (original fibub questions). Ids start with c9m-iden-.
import { pick, choose, n, steps, tidyProblems } from './_util.js';

const sg = (v) => String(v).replace('-', '−');
export default tidyProblems({
  'c9m-iden-sumsq': {
    title: 'x² + y² from the sum and product',
    make(r) {
      const x = pick(r, 1, 9), y = pick(r, 1, 9), s = x + y, pr = x * y;
      return { x, y, s, pr, q: `<p>If x + y = ${s} and xy = ${pr}, find x² + y².</p>`, answer: s * s - 2 * pr, abs: 0.01, tol: 0, unit: '',
        hint: 'Start from (x + y)² = x² + 2xy + y² and rearrange.',
        solution: steps(`(x + y)² = x² + y² + 2xy, so x² + y² = (x + y)² − 2xy.`, `= ${s}² − 2(${pr}) = ${s * s} − ${2 * pr} = <b>${s * s - 2 * pr}</b>.`) };
    },
    verify: (p) => p.x * p.x + p.y * p.y,
  },
  'c9m-iden-diffsq': {
    title: 'x² + y² from the difference and product',
    make(r) {
      const x = pick(r, 2, 12), y = pick(r, 1, x - 1), d = x - y, pr = x * y;
      return { x, y, d, pr, q: `<p>If x − y = ${d} and xy = ${pr}, find x² + y².</p>`, answer: d * d + 2 * pr, abs: 0.01, tol: 0, unit: '',
        hint: '(x − y)² = x² − 2xy + y², so x² + y² = (x − y)² + 2xy.',
        solution: steps(`(x − y)² = x² + y² − 2xy, so x² + y² = (x − y)² + 2xy.`, `= ${d}² + 2(${pr}) = ${d * d} + ${2 * pr} = <b>${d * d + 2 * pr}</b>.`) };
    },
    verify: (p) => p.x ** 2 + p.y ** 2,
  },
  'c9m-iden-mental': {
    title: 'square a number near 100',
    make(r) {
      const d = pick(r, 1, 9), up = r() < 0.5, N = up ? 100 + d : 100 - d;
      return { d, up, N, q: `<p>Use (a ${up ? '+' : '−'} b)² = a² ${up ? '+' : '−'} 2ab + b² with a = 100 and b = ${d} to work out ${N}².</p>`, answer: N * N, abs: 0.01, tol: 0, unit: '',
        hint: `${N} = 100 ${up ? '+' : '−'} ${d}. Write the square as 100² ${up ? '+' : '−'} 2 × 100 × ${d} + ${d}².`,
        solution: steps(`${N}² = (100 ${up ? '+' : '−'} ${d})² = 10000 ${up ? '+' : '−'} ${200 * d} + ${d * d}.`, `= <b>${n(N * N, 8)}</b>.`) };
    },
    verify: (p) => p.N * p.N,
  },
  'c9m-iden-pair': {
    title: 'product of numbers either side of 100',
    make(r) {
      const d = pick(r, 1, 9);
      return { d, q: `<p>Use a² − b² = (a + b)(a − b) to work out ${100 + d} × ${100 - d}.</p>`, answer: 10000 - d * d, abs: 0.01, tol: 0, unit: '',
        hint: `${100 + d} × ${100 - d} = (100 + ${d})(100 − ${d}), which is 100² − ${d}².`,
        solution: steps(`(100 + ${d})(100 − ${d}) = 100² − ${d}².`, `= 10000 − ${d * d} = <b>${10000 - d * d}</b>.`) };
    },
    verify: (p) => (100 + p.d) * (100 - p.d),
  },
  'c9m-iden-xab': {
    title: 'coefficient of x in a product',
    make(r) {
      const a = pick(r, -9, 9) || 4, b = pick(r, -9, 9) || 5;
      return { a, b, q: `<p>Expand (x ${a < 0 ? '−' : '+'} ${Math.abs(a)})(x ${b < 0 ? '−' : '+'} ${Math.abs(b)}). What is the coefficient of x in the answer?</p>`, answer: a + b, abs: 0.01, tol: 0, unit: '',
        hint: '(x + a)(x + b) = x² + (a + b)x + ab. Remember a and b carry their signs.',
        solution: steps(`(x + (${sg(a)}))(x + (${sg(b)})) = x² + (${sg(a)} + ${sg(b)})x + (${sg(a)})(${sg(b)}).`, `The coefficient of x is <b>${sg(a + b)}</b> (and the constant is ${sg(a * b)}).`) };
    },
    verify: (p) => (1 + p.a) * (1 + p.b) - 1 - p.a * p.b,
  },
  'c9m-iden-factor': {
    title: 'factorise x² + bx + c',
    make(r) {
      const p = pick(r, 1, 9), q = pick(r, p, 12);
      return { p, qq: q, q: `<p>x² + ${p + q}x + ${p * q} factorises as (x + m)(x + k) with m ≤ k. Find k, the larger number.</p>`, answer: q, abs: 0.01, tol: 0, unit: '',
        hint: 'Find two numbers whose product is the constant and whose sum is the coefficient of x.',
        solution: steps(`Product = ${p * q}, sum = ${p + q}.`, `The numbers are ${p} and ${q}: x² + ${p + q}x + ${p * q} = (x + ${p})(x + ${q}).`, `The larger is <b>${q}</b>.`) };
    },
    verify: (p) => { const S = p.p + p.qq, P = p.p * p.qq; for (let k = 40; k >= 1; k--) if (P % k === 0 && k + P / k === S) return k; },
  },
  'c9m-iden-cube': {
    title: 'a³ + b³ from the sum and product',
    make(r) {
      const x = pick(r, 1, 7), y = pick(r, 1, 7), s = x + y, pr = x * y;
      return { x, y, s, pr, q: `<p>If a + b = ${s} and ab = ${pr}, find a³ + b³.</p>`, answer: s ** 3 - 3 * pr * s, abs: 0.01, tol: 0, unit: '',
        hint: '(a + b)³ = a³ + b³ + 3ab(a + b), so a³ + b³ = (a + b)³ − 3ab(a + b).',
        solution: steps(`a³ + b³ = (a + b)³ − 3ab(a + b).`, `= ${s}³ − 3(${pr})(${s}) = ${s ** 3} − ${3 * pr * s} = <b>${s ** 3 - 3 * pr * s}</b>.`) };
    },
    verify: (p) => p.x ** 3 + p.y ** 3,
  },
  'c9m-iden-abc': {
    title: 'a³ + b³ + c³ when a + b + c = 0',
    make(r) {
      const a = pick(r, -6, 6) || 2, b = pick(r, -6, 6) || 3, c = -a - b;
      return { a, b, c, q: `<p>If a = ${sg(a)}, b = ${sg(b)} and c = ${sg(c)}, then a + b + c = 0. Use a³ + b³ + c³ − 3abc = (a + b + c)(…) to find a³ + b³ + c³.</p>`, answer: 3 * a * b * c, abs: 0.01, tol: 0, unit: '',
        hint: 'When a + b + c = 0 the right side is 0, so a³ + b³ + c³ = 3abc.',
        solution: steps(`a + b + c = 0, so a³ + b³ + c³ − 3abc = 0.`, `a³ + b³ + c³ = 3abc = 3(${sg(a)})(${sg(b)})(${sg(c)}) = <b>${sg(3 * a * b * c)}</b>.`) };
    },
    verify: (p) => p.a ** 3 + p.b ** 3 + p.c ** 3,
  },
  'c9m-iden-trin': {
    title: '(a + b + c)² from sums of squares and pairs',
    make(r) {
      const a = pick(r, 1, 6), b = pick(r, 1, 6), c = pick(r, 1, 6), s2 = a * a + b * b + c * c, pp = a * b + b * c + c * a;
      return { a, b, c, s2, pp, q: `<p>If a² + b² + c² = ${s2} and ab + bc + ca = ${pp}, find (a + b + c)².</p>`, answer: s2 + 2 * pp, abs: 0.01, tol: 0, unit: '',
        hint: '(a + b + c)² = a² + b² + c² + 2(ab + bc + ca).',
        solution: steps(`(a + b + c)² = (a² + b² + c²) + 2(ab + bc + ca).`, `= ${s2} + 2(${pp}) = <b>${s2 + 2 * pp}</b>.`) };
    },
    verify: (p) => (p.a + p.b + p.c) ** 2,
  },
}, ['c9m-iden-xab']);
