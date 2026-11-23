// Class 10 Maths, Quadratic Equations: live problems (original fibub questions). Ids start with c10m-quad-.
import { pick, choose, n, steps, tidyProblems } from './_util.js';

// "ax² + bx + c" written for the page, with signs handled.
const poly = (a, b, c) => {
  const t = (v, s) => (v === 0 ? '' : (v < 0 ? ' − ' : ' + ') + (Math.abs(v) === 1 && s ? '' : Math.abs(v)) + s);
  let out = (a < 0 ? '−' : '') + (Math.abs(a) === 1 ? '' : Math.abs(a)) + 'x<sup>2</sup>';
  return out + t(b, 'x') + t(c, '');
};
const bigroot = (a, b, c) => (-b + Math.sqrt(b * b - 4 * a * c)) / (2 * a);

export default tidyProblems({
  'c10m-quad-factor': {
    title: 'solve by factorisation',
    make(r) {
      let p = pick(r, -9, 9), s = pick(r, -9, 9);
      if (p === 0) p = 4; if (s === 0) s = -3;
      const b = -(p + s), c = p * s, answer = Math.max(p, s), small = Math.min(p, s);
      return { b, c, q: `<p>Solve by factorisation: ${poly(1, b, c)} = 0. Give the <b>larger</b> root.</p>`, answer, unit: '', tol: 0.001, abs: 0.001,
        hint: `Find two numbers whose product is ${c} and whose sum is ${b}. Then write (x − m)(x − n) = 0.`,
        solution: steps(`We need two numbers that multiply to ${c} and add to ${b}: they are ${-p} and ${-s}.`, `So ${poly(1, b, c)} = (x ${p > 0 ? '−' : '+'} ${Math.abs(p)})(x ${s > 0 ? '−' : '+'} ${Math.abs(s)}) = 0.`, `The roots are x = ${p} and x = ${s}; the larger is <b>${answer}</b> (the smaller is ${small}).`) };
    },
    verify: (x) => bigroot(1, x.b, x.c),
  },
  'c10m-quad-disc': {
    title: 'find the discriminant',
    make(r) {
      const a = pick(r, 1, 5), b = pick(r, -9, 9), c = pick(r, -6, 6), answer = b * b - 4 * a * c;
      return { a, b, c, q: `<p>Find the discriminant D = b<sup>2</sup> − 4ac of ${poly(a, b, c)} = 0.</p>`, answer, unit: '', tol: 0.001, abs: 0.001,
        hint: 'Read off a, b and c with their signs, then put them into b² − 4ac.',
        solution: steps(`a = ${a}, b = ${b}, c = ${c}.`, `D = (${b})<sup>2</sup> − 4(${a})(${c}) = ${b * b} − ${4 * a * c}.`, `D = <b>${answer}</b>, so the equation has ${answer > 0 ? 'two different real roots' : answer === 0 ? 'two equal real roots' : 'no real roots'}.`) };
    },
    verify: (x) => x.b ** 2 - 4 * x.a * x.c,
  },
  'c10m-quad-formula': {
    title: 'use the quadratic formula',
    make(r) {
      const a = choose(r, [2, 3, 4, 5]); let p = pick(r, -7, 7), q = pick(r, -7, 7);
      if (p === 0) p = 3; if (q === 0) q = 2;
      // (ax - p)(x - q) = a x^2 - (aq + p) x + pq
      const b = -(a * q + p), c = p * q, D = b * b - 4 * a * c, answer = Math.max(p / a, q);
      return { a, b, c, D, q: `<p>Use the quadratic formula to solve ${poly(a, b, c)} = 0. Give the <b>larger</b> root as a decimal.</p>`, answer, unit: '', tol: 0.005, abs: 0.001,
        hint: 'x = (−b ± √D) / 2a, with D = b² − 4ac. Work out D first.',
        solution: steps(`a = ${a}, b = ${b}, c = ${c}, so D = ${b}<sup>2</sup> − 4(${a})(${c}) = ${D}.`, `√D = ${n(Math.sqrt(D))}.`, `x = (${-b} ± ${n(Math.sqrt(D))}) / ${2 * a}, so the roots are ${n((-b + Math.sqrt(D)) / (2 * a))} and ${n((-b - Math.sqrt(D)) / (2 * a))}.`, `Larger root: <b>${n(answer)}</b>.`) };
    },
    verify: (x) => Math.max(...[1, -1].map((s) => (-x.b + s * Math.sqrt(x.b * x.b - 4 * x.a * x.c)) / (2 * x.a))),
  },
  'c10m-quad-equal': {
    title: 'find k for equal roots',
    make(r) {
      const m = pick(r, 2, 9), k = pick(r, 1, 9), b = 2 * m * k; // equal roots when c = b²/4 = (mk)²
      const c = m * m * k * k;
      return { b, q: `<p>For what value of k does ${poly(1, b, 0)} + k = 0 have two equal roots? (The constant term is k.)</p>`, answer: c, unit: '', tol: 0.001, abs: 0.001,
        hint: 'Equal roots means D = 0. Here a = 1, b is the coefficient of x, and c = k.',
        solution: steps(`a = 1, b = ${b}, c = k.`, `D = b<sup>2</sup> − 4ac = ${b * b} − 4k = 0.`, `So k = ${b * b}/4 = <b>${c}</b>.`) };
    },
    verify: (x) => (x.b * x.b) / 4,
  },
  'c10m-quad-plot': {
    title: 'a word problem about a plot',
    make(r) {
      const x = pick(r, 4, 15), d = pick(r, 2, 8), A = x * (x + d);
      return { x, d, A, q: `<p>A rectangular plot is ${d} m longer than it is wide, and its area is ${n(A)} m<sup>2</sup>. Find its breadth in metres.</p>`, answer: x, unit: 'm', tol: 0.001,
        hint: `Let the breadth be x. Then length = x + ${d}, and x(x + ${d}) = ${A}. Rearrange to x² + ${d}x − ${A} = 0.`,
        solution: steps(`Breadth x, length x + ${d}. Area: x(x + ${d}) = ${A}.`, `x<sup>2</sup> + ${d}x − ${A} = 0. Factors: (x + ${x + d})(x − ${x}) = 0.`, `x = ${x} or x = −${x + d}. A length cannot be negative, so the breadth is <b>${x} m</b>.`) };
    },
    verify: (p) => (-p.d + Math.sqrt(p.d * p.d + 4 * p.A)) / 2,
  },
  'c10m-quad-consec': {
    title: 'consecutive numbers',
    make(r) {
      const m = pick(r, 3, 20), P = m * (m + 1);
      return { m, P, q: `<p>The product of two consecutive positive integers is ${P}. What is the smaller integer?</p>`, answer: m, unit: '', tol: 0.001,
        hint: `Call them x and x + 1. Then x(x + 1) = ${P}, so x² + x − ${P} = 0.`,
        solution: steps(`x(x + 1) = ${P}, so x<sup>2</sup> + x − ${P} = 0.`, `D = 1 + ${4 * P} = ${1 + 4 * P} = ${2 * m + 1}<sup>2</sup>.`, `x = (−1 + ${2 * m + 1}) / 2 = <b>${m}</b> (the other root is negative, rejected).`) };
    },
    verify: (p) => (-1 + Math.sqrt(1 + 4 * p.P)) / 2,
  },
}, ['c10m-quad-disc']);
