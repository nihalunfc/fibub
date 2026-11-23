// Class 8 Maths, Chapter 6 We Distribute, Yet Things Multiply: live problems (original fibub questions). Ids start with c8m-dist-.
import { pick, choose, n, steps } from './_util.js';

const sg = (v) => String(v).replace('-', '−');
export default {
  'c8m-dist-near': {
    title: 'multiply by a number near a hundred',
    make(r) {
      const k = pick(r, 3, 19), d = pick(r, 1, 9), up = r() < 0.5, m = up ? 100 + d : 100 - d;
      return { k, d, up, m, q: `<p>Use the distributive property to work out ${k} × ${m}. (Hint: ${m} = 100 ${up ? '+' : '−'} ${d}.)</p>`, answer: k * m, abs: 0.01, tol: 0, unit: '',
        hint: `k × (100 ${up ? '+' : '−'} ${d}) = k × 100 ${up ? '+' : '−'} k × ${d}.`,
        solution: steps(`${k} × ${m} = ${k} × (100 ${up ? '+' : '−'} ${d}) = ${k * 100} ${up ? '+' : '−'} ${k * d}.`, `= <b>${k * m}</b>.`) };
    },
    verify: (p) => { let t = 0; for (let i = 0; i < p.k; i++) t += p.m; return t; },
  },
  'c8m-dist-sq': {
    title: 'square a number with (a + b)²',
    make(r) {
      const t = pick(r, 2, 9), u = pick(r, 1, 9), N = 10 * t + u;
      return { t, u, N, q: `<p>Write ${N} as ${10 * t} + ${u} and use (a + b)² = a² + 2ab + b² to find ${N}².</p>`, answer: N * N, abs: 0.01, tol: 0, unit: '',
        hint: `a = ${10 * t}, b = ${u}. Work out a², 2ab and b² and add.`,
        solution: steps(`a² = ${(10 * t) ** 2}, 2ab = ${2 * 10 * t * u}, b² = ${u * u}.`, `${(10 * t) ** 2} + ${2 * 10 * t * u} + ${u * u} = <b>${N * N}</b>.`) };
    },
    verify: (p) => { let s = 0; for (let i = 0; i < p.N; i++) s += p.N; return s; },
  },
  'c8m-dist-diff': {
    title: 'product with (m − d)(m + d)',
    make(r) {
      const m = choose(r, [20, 25, 30, 40, 50, 60, 70, 80, 90]), d = pick(r, 1, 9);
      return { m, d, q: `<p>Use (a − b)(a + b) = a² − b² to work out ${m - d} × ${m + d}.</p>`, answer: m * m - d * d, abs: 0.01, tol: 0, unit: '',
        hint: `The two numbers are ${m} − ${d} and ${m} + ${d}. So a = ${m} and b = ${d}.`,
        solution: steps(`${m}² = ${m * m} and ${d}² = ${d * d}.`, `${m * m} − ${d * d} = <b>${m * m - d * d}</b>.`) };
    },
    verify: (p) => (p.m - p.d) * (p.m + p.d),
  },
  'c8m-dist-xab': {
    title: 'the constant in (x + a)(x + b)',
    make(r) {
      const a = pick(r, -9, 9) || 3, b = pick(r, -9, 9) || 6, sa = a < 0 ? '−' + -a : '+' + a, sb = b < 0 ? '−' + -b : '+' + b;
      return { a, b, q: `<p>Expand (x ${sa.replace('+', '+ ').replace('−', '− ')})(x ${sb.replace('+', '+ ').replace('−', '− ')}) = x² + (something)x + (a number). What is the number term (the constant)?</p>`, answer: a * b, abs: 0.01, tol: 0, unit: '',
        hint: 'The constant is the product of the two numbers, with their signs.',
        solution: steps(`(x + (${sg(a)}))(x + (${sg(b)})) = x² + (${sg(a)} + ${sg(b)})x + (${sg(a)})(${sg(b)}).`, `Constant = <b>${sg(a * b)}</b> (and the x coefficient is ${sg(a + b)}).`) };
    },
    verify: (p) => { const f = (x) => (x + p.a) * (x + p.b); return f(0); },
  },
  'c8m-dist-cal': {
    title: 'the calendar block',
    make(r) {
      const x = choose(r, [1, 2, 3, 8, 9, 10, 15, 16, 17, 22, 23, 24]);
      return { x, q: `<p>On a calendar, a 2 × 2 block of dates has ${x} in its top-left corner. What is the sum of the four dates in the block? (A week is one row of 7 dates.)</p>`, answer: 4 * x + 16, abs: 0.01, tol: 0, unit: '',
        hint: 'The four dates are x, x + 1, x + 7 and x + 8.',
        solution: steps(`The dates are ${x}, ${x + 1}, ${x + 7}, ${x + 8}.`, `Sum = 4x + 16 = 4 × ${x} + 16 = <b>${4 * x + 16}</b>.`) };
    },
    verify: (p) => p.x + (p.x + 1) + (p.x + 7) + (p.x + 8),
  },
  'c8m-dist-cross': {
    title: 'a² + b² from the sum and product',
    make(r) {
      const x = pick(r, 1, 9), y = pick(r, 1, 9);
      return { x, y, q: `<p>Two numbers add up to ${x + y} and multiply to ${x * y}. What is the sum of their squares?</p>`, answer: (x + y) ** 2 - 2 * x * y, abs: 0.01, tol: 0, unit: '',
        hint: '(a + b)² = a² + 2ab + b², so a² + b² = (a + b)² − 2ab.',
        solution: steps(`a² + b² = (a + b)² − 2ab.`, `= ${(x + y) ** 2} − ${2 * x * y} = <b>${(x + y) ** 2 - 2 * x * y}</b>.`) };
    },
    verify: (p) => p.x * p.x + p.y * p.y,
  },
  'c8m-dist-cube9': {
    title: 'factor out the common number',
    make(r) {
      const k = pick(r, 3, 9), a = pick(r, 11, 49), b = pick(r, 11, 49);
      return { k, a, b, q: `<p>Find ${k} × ${a} + ${k} × ${b} quickly by taking ${k} out as a common factor.</p>`, answer: k * (a + b), abs: 0.01, tol: 0, unit: '',
        hint: `${k} × ${a} + ${k} × ${b} = ${k} × (${a} + ${b}).`,
        solution: steps(`Common factor ${k}: ${k} × (${a} + ${b}) = ${k} × ${a + b}.`, `= <b>${k * (a + b)}</b>.`) };
    },
    verify: (p) => p.k * p.a + p.k * p.b,
  },
};
