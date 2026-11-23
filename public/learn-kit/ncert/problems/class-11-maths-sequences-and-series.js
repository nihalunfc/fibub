// Class 11 Maths, Sequences and Series: live problems (original fibub questions). Ids start with c11m-seq-.
import { pick, choose, n, steps } from './_util.js';

export default {
  'c11m-seq-recur': {
    title: 'a sequence defined by a rule',
    make(r) {
      const a1 = pick(r, 1, 5), c = pick(r, 1, 5), k = pick(r, 4, 7); let a = a1; for (let i = 1; i < k; i++) a = 2 * a + c;
      return { a1, c, k, q: `<p>A sequence starts with a₁ = ${a1} and each next term is twice the previous term plus ${c}, so aₙ₊₁ = 2aₙ + ${c}. Find a<sub>${k}</sub>.</p>`, answer: a, unit: '', tol: 0, abs: 0.001,
        hint: 'Work out the terms one by one: a₂, a₃, ...',
        solution: steps(`a₁ = ${a1}.`, `Apply the rule ${k - 1} times (double and add ${c}).`, `a<sub>${k}</sub> = <b>${a}</b>.`) };
    },
    verify(x) { return (x.a1 + x.c) * 2 ** (x.k - 1) - x.c; },
  },
  'c11m-seq-gpterm': {
    title: 'the nth term of a GP',
    make(r) {
      const a = pick(r, 1, 5), q = pick(r, 2, 4), k = pick(r, 4, 8), answer = a * q ** (k - 1);
      return { a, qq: q, k, q: `<p>The first term of a GP is ${a} and the common ratio is ${q}. Find the ${k}th term.</p>`, answer, unit: '', tol: 0, abs: 0.001,
        hint: 'aₙ = a · r^(n−1).',
        solution: steps(`a<sub>${k}</sub> = ${a} × ${q}<sup>${k - 1}</sup>.`, `= ${a} × ${q ** (k - 1)} = <b>${answer}</b>.`) };
    },
    verify(x) { let t = x.a; for (let i = 1; i < x.k; i++) t *= x.qq; return t; },
  },
  'c11m-seq-gpsum': {
    title: 'the sum of a GP',
    make(r) {
      const a = pick(r, 1, 6), q = pick(r, 2, 4), k = pick(r, 4, 8), answer = a * (q ** k - 1) / (q - 1);
      return { a, qq: q, k, q: `<p>Find the sum of the first ${k} terms of the GP ${a}, ${a * q}, ${a * q * q}, ... </p>`, answer, unit: '', tol: 0, abs: 0.001,
        hint: 'Sₙ = a(rⁿ − 1)/(r − 1) with r = the ratio of any term to the one before.',
        solution: steps(`a = ${a}, r = ${q}, n = ${k}.`, `S = ${a}(${q}<sup>${k}</sup> − 1)/(${q} − 1) = ${a}(${q ** k} − 1)/${q - 1}.`, `= <b>${answer}</b>.`) };
    },
    verify(x) { let s = 0, t = x.a; for (let i = 0; i < x.k; i++) { s += t; t *= x.qq; } return s; },
  },
  'c11m-seq-gm': {
    title: 'geometric mean and arithmetic mean',
    make(r) {
      const [a, b] = choose(r, [[2, 8], [3, 12], [4, 9], [1, 16], [5, 20], [2, 32], [8, 18], [12, 27], [9, 25]]);
      return { a, b, q: `<p>Find the geometric mean of ${a} and ${b}, then give the value of AM − GM (the arithmetic mean minus the geometric mean).</p>`, answer: (a + b) / 2 - Math.sqrt(a * b), unit: '', tol: 0.001, abs: 0.0001,
        hint: 'GM = √(ab) and AM = (a + b)/2.',
        solution: steps(`GM = √(${a}×${b}) = √${a * b} = ${Math.sqrt(a * b)}.`, `AM = (${a} + ${b})/2 = ${(a + b) / 2}.`, `AM − GM = <b>${(a + b) / 2 - Math.sqrt(a * b)}</b> (never negative: AM ≥ GM).`) };
    },
    verify(x) { let g = 0; while (g * g < x.a * x.b - 1e-9) g++; return (x.a + x.b) / 2 - g; },
  },
  'c11m-seq-squares': {
    title: 'a sum of squares',
    make(r) {
      const m = pick(r, 5, 20), answer = m * (m + 1) * (2 * m + 1) / 6;
      return { m, q: `<p>Find 1² + 2² + 3² + ... + ${m}².</p>`, answer, unit: '', tol: 0, abs: 0.001,
        hint: 'Σn² = n(n+1)(2n+1)/6.',
        solution: steps(`n = ${m}: ${m} × ${m + 1} × ${2 * m + 1} / 6.`, `= <b>${answer}</b>.`) };
    },
    verify(x) { let s = 0; for (let i = 1; i <= x.m; i++) s += i * i; return s; },
  },
  'c11m-seq-means': {
    title: 'inserting geometric means',
    make(r) {
      const a = pick(r, 1, 4), q = pick(r, 2, 3), m = pick(r, 2, 4), last = a * q ** (m + 1), j = pick(r, 1, m);
      return { a, qq: q, m, j, q: `<p>${m} geometric means are inserted between ${a} and ${last}. Find the ${j === 1 ? 'first' : j === 2 ? 'second' : j === 3 ? 'third' : 'fourth'} mean.</p>`, answer: a * q ** j, unit: '', tol: 0, abs: 0.001,
        hint: `Together with the end numbers there are ${m + 2} terms, so ${last} = a · r^${m + 1}; find r first.`,
        solution: steps(`${m + 2} terms: ${last} = ${a} · r<sup>${m + 1}</sup>, so r<sup>${m + 1}</sup> = ${last / a} and r = ${q}.`, `The ${j}-th mean is ${a} × ${q}<sup>${j}</sup> = <b>${a * q ** j}</b>.`) };
    },
    verify(x) { const last = x.a * x.qq ** (x.m + 1); let rr = 1; while (Math.abs(x.a * rr ** (x.m + 1) - last) > 1e-9) rr++; return x.a * rr ** x.j; },
  },
};
