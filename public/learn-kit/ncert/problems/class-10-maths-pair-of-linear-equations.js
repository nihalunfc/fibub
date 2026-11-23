// Class 10 Maths, Pair of Linear Equations in Two Variables: live problems (original fibub questions). Ids start with c10m-pair-.
import { pick, choose, n, steps, tidyProblems } from './_util.js';

const sgn = (v) => (v < 0 ? '−' : '+');
const lin = (a, b) => `${a === 1 ? '' : a === -1 ? '−' : a}x ${sgn(b)} ${Math.abs(b) === 1 ? '' : Math.abs(b)}y`;
export default tidyProblems({
  'c10m-pair-solve': {
    title: 'solve a pair of equations',
    make(r) {
      let x = pick(r, 1, 9), y = pick(r, 1, 9), a1 = pick(r, 1, 4), b1 = pick(r, 1, 4), a2 = pick(r, 1, 4), b2 = -pick(r, 1, 4);
      if (a1 * b2 - a2 * b1 === 0) a1 += 1;
      const c1 = a1 * x + b1 * y, c2 = a2 * x + b2 * y, ask = choose(r, ['x', 'y']);
      return { a1, b1, c1, a2, b2, c2, ask, q: `<p>Solve ${lin(a1, b1)} = ${c1} and ${lin(a2, b2)} = ${c2}. Give the value of ${ask}.</p>`, answer: ask === 'x' ? x : y, abs: 0.001, tol: 0, unit: '',
        hint: 'Make the coefficient of one variable the same in both equations (multiply), then add or subtract to eliminate it.',
        solution: steps(`Multiply the first equation by ${Math.abs(b2)} and the second by ${b1}: the y terms become ${b1 * Math.abs(b2)}y and −${b1 * Math.abs(b2)}y.`, `Add: ${a1 * Math.abs(b2) + a2 * b1}x = ${c1 * Math.abs(b2) + c2 * b1}, so x = ${x}.`, `Put x = ${x} in the first equation: y = ${y}.`, `So ${ask} = <b>${ask === 'x' ? x : y}</b>.`) };
    },
    verify: (p) => { const d = p.a1 * p.b2 - p.a2 * p.b1; return p.ask === 'x' ? (p.c1 * p.b2 - p.c2 * p.b1) / d : (p.a1 * p.c2 - p.a2 * p.c1) / d; },
  },
  'c10m-pair-numbers': {
    title: 'two numbers from their sum and difference',
    make(r) {
      const big = pick(r, 12, 60), small = pick(r, 3, big - 2), S = big + small, D = big - small, ask = choose(r, ['larger', 'smaller']);
      return { S, D, ask, q: `<p>The sum of two numbers is ${S} and their difference is ${D}. Find the ${ask} number.</p>`, answer: ask === 'larger' ? big : small, abs: 0.001, tol: 0, unit: '',
        hint: 'Let the numbers be x and y: x + y = sum and x − y = difference. Add the two equations to find x.',
        solution: steps(`x + y = ${S} and x − y = ${D}.`, `Adding: 2x = ${S + D}, so x = ${big}.`, `Then y = ${S} − ${big} = ${small}.`, `The ${ask} number is <b>${ask === 'larger' ? big : small}</b>.`) };
    },
    verify: (p) => (p.ask === 'larger' ? (p.S + p.D) / 2 : (p.S - p.D) / 2),
  },
  'c10m-pair-fare': {
    title: 'fixed charge and rate per unit',
    make(r) {
      const f = pick(r, 10, 40, 5), k = pick(r, 8, 20), d1 = pick(r, 2, 5), d2 = d1 + pick(r, 2, 5), c1 = f + k * d1, c2 = f + k * d2, ask = choose(r, ['fixed charge', 'rate per km']);
      return { c1, c2, d1, d2, ask, q: `<p>A taxi charges a fixed amount plus a fixed rate for each km. A ${d1} km ride costs ₹${c1} and a ${d2} km ride costs ₹${c2}. Find the ${ask} (in ₹).</p>`, answer: ask === 'fixed charge' ? f : k, abs: 0.001, tol: 0, unit: '₹',
        hint: 'Let the fixed charge be x and the rate y: x + d₁y = c₁ and x + d₂y = c₂. Subtract to remove x.',
        solution: steps(`x + ${d1}y = ${c1} and x + ${d2}y = ${c2}.`, `Subtract: ${d2 - d1}y = ${c2 - c1}, so y = ${k}.`, `Then x = ${c1} − ${d1}×${k} = ${f}.`, `The ${ask} is <b>₹${ask === 'fixed charge' ? f : k}</b>.`) };
    },
    verify: (p) => { const y = (p.c2 - p.c1) / (p.d2 - p.d1), x = p.c1 - p.d1 * y; return p.ask === 'fixed charge' ? x : y; },
  },
  'c10m-pair-k': {
    title: 'value of k for no solution',
    make(r) {
      const a1 = pick(r, 1, 5), b1 = pick(r, 2, 6), m = pick(r, 2, 4), c1 = pick(r, 3, 12), c2 = c1 * m + pick(r, 1, 5), k = a1 * m;
      return { a1, b1, m, c1, c2, q: `<p>For what value of k does the pair ${a1}x + ${b1}y = ${c1} and kx + ${b1 * m}y = ${c2} have no solution?</p>`, answer: k, abs: 0.001, tol: 0, unit: '',
        hint: 'No solution means parallel lines: a₁/a₂ = b₁/b₂ and this is not equal to c₁/c₂.',
        solution: steps(`Parallel lines need ${a1}/k = ${b1}/${b1 * m}.`, `${b1}/${b1 * m} = 1/${m}, so k = ${a1} × ${m} = <b>${k}</b>.`, `Check c: ${c1}/${c2} is not equal to 1/${m}, so the lines are parallel and not the same.`) };
    },
    verify: (p) => (p.a1 * (p.b1 * p.m)) / p.b1,
  },
  'c10m-pair-age': {
    title: 'an age problem as two equations',
    make(r) {
      const son = pick(r, 6, 16), mult = pick(r, 2, 4), fa = son * mult + pick(r, 0, 6), yrs = pick(r, 2, 8), ask = choose(r, ['father', 'son']);
      const f2 = fa + yrs, s2 = son + yrs;
      if (f2 === 2 * s2 || fa === 3 * son) return this.make(r);
      return { son, fa, yrs, ask, q: `<p>The father is ${fa - son} years older than his son. In ${yrs} years the sum of their ages will be ${f2 + s2}. Find the present age of the ${ask}.</p>`, answer: ask === 'father' ? fa : son, abs: 0.001, tol: 0, unit: 'years',
        hint: 'Let father = x, son = y. Then x − y = difference, and (x + yrs) + (y + yrs) = total.',
        solution: steps(`x − y = ${fa - son}, and x + y + ${2 * yrs} = ${f2 + s2}, so x + y = ${fa + son}.`, `Adding: 2x = ${2 * fa}, so x = ${fa}, and y = ${son}.`, `The ${ask} is <b>${ask === 'father' ? fa : son}</b> years old.`) };
    },
    verify: (p) => (p.ask === 'father' ? ((p.fa - p.son) + (p.fa + p.son)) / 2 : ((p.fa + p.son) - (p.fa - p.son)) / 2),
  },
}, ['c10m-pair-solve', 'c10m-pair-k']);
