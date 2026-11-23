// Class 10 Maths, Polynomials: live problems (original fibub questions). Ids start with c10m-poly-.
import { pick, choose, n, steps, tidyProblems } from './_util.js';

const pol = (a, b, c) => `${a === 1 ? '' : a === -1 ? '−' : a}x² ${b < 0 ? '−' : '+'} ${Math.abs(b) === 1 ? '' : Math.abs(b)}x ${c < 0 ? '−' : '+'} ${Math.abs(c)}`;
export default tidyProblems({
  'c10m-poly-value': {
    title: 'value of a polynomial at a point',
    make(r) {
      const a = choose(r, [1, 2, 3, -1, -2]), b = pick(r, -6, 6), c = pick(r, -9, 9), x = pick(r, -3, 4), answer = a * x * x + b * x + c;
      return { a, b, c, x, q: `<p>If p(x) = ${pol(a, b, c)}, find p(${x}).</p>`, answer, abs: 0.01, tol: 0, unit: '',
        hint: 'Replace every x with the number, using brackets for negative numbers, then work out powers before products.',
        solution: steps(`p(${x}) = ${a}(${x})² + (${b})(${x}) + (${c}).`, `= ${a * x * x} + ${b * x} + ${c} = <b>${n(answer)}</b>.`) };
    },
    verify: (p) => p.a * p.x ** 2 + p.b * p.x + p.c,
  },
  'c10m-poly-zeros': {
    title: 'find the larger zero of a quadratic',
    make(r) {
      let al = pick(r, -6, 6), be = pick(r, -6, 6); if (al === be) be += 1;
      const a = choose(r, [1, 1, 2, 3]), b = -a * (al + be), c = a * al * be, D = b * b - 4 * a * c, answer = (-b + Math.sqrt(D)) / (2 * a);
      return { a, b, c, q: `<p>Find the larger zero of ${pol(a, b, c)}.</p>`, answer, abs: 0.01, tol: 0, unit: '',
        hint: 'Split the middle term, or use the zeros-coefficients idea: find two numbers whose sum is −b/a and product is c/a.',
        solution: steps(`The zeros add to −b/a = ${n(-b / a)} and multiply to c/a = ${n(c / a)}.`, `The numbers are ${al} and ${be}, so the zeros are x = ${al} and x = ${be}.`, `The larger is <b>${n(answer)}</b>.`) };
    },
    verify: (p) => { for (let x = 20; x >= -20; x--) if (p.a * x * x + p.b * x + p.c === 0) return x; },
  },
  'c10m-poly-sumprod': {
    title: 'sum or product of zeros from the coefficients',
    make(r) {
      const al = pick(r, -5, 6), be = pick(r, -5, 6), a = choose(r, [1, 2, 3, 4, 5]), b = -a * (al + be), c = a * al * be, ask = choose(r, ['sum', 'product']);
      return { al, be, a, b, c, ask, q: `<p>For the polynomial ${pol(a, b, c)}, find the ${ask} of its zeros without finding the zeros.</p>`, answer: ask === 'sum' ? al + be : al * be, abs: 0.001, tol: 0, unit: '',
        hint: 'Sum of zeros = −b/a. Product of zeros = c/a.',
        solution: steps(`Here a = ${a}, b = ${b}, c = ${c}.`, ask === 'sum' ? `Sum = −b/a = −(${b})/${a} = <b>${n(-b / a)}</b>.` : `Product = c/a = ${c}/${a} = <b>${n(c / a)}</b>.`) };
    },
    verify: (p) => { const D = p.b * p.b - 4 * p.a * p.c, s = Math.sqrt(D), z1 = (-p.b + s) / (2 * p.a), z2 = (-p.b - s) / (2 * p.a); return p.ask === 'sum' ? z1 + z2 : z1 * z2; },
  },
  'c10m-poly-other': {
    title: 'find the other zero',
    make(r) {
      let al = pick(r, -6, 7), be = pick(r, -6, 7); if (al === 0) al = 2;
      const S = al + be, P = al * be;
      return { al, S, P, q: `<p>A quadratic polynomial has zeros that add up to ${S} and multiply to ${P}. One zero is ${al}. What is the other zero?</p>`, answer: be, abs: 0.001, tol: 0, unit: '',
        hint: 'Use sum of zeros = S: the other zero is S minus the one you know.',
        solution: steps(`Sum of zeros: ${al} + β = ${S}.`, `β = ${S} − (${al}) = <b>${n(be)}</b>. (Check: ${al} × ${be} = ${P}.)`) };
    },
    verify: (p) => p.P / p.al,
  },
}, ['c10m-poly-value', 'c10m-poly-zeros', 'c10m-poly-sumprod']);
