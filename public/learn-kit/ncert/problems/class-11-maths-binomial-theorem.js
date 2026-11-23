// Class 11 Maths, Binomial Theorem: live problems (original fibub questions). Ids start with c11m-binom-.
import { pick, choose, n, steps } from './_util.js';

const C = (m, k) => { let v = 1; for (let i = 1; i <= k; i++) v = v * (m - k + i) / i; return Math.round(v); };
// coefficients of (p + q x)^m by repeated multiplication (a different route from the formula)
const poly = (p, q, m) => { let c = [1]; for (let i = 0; i < m; i++) { const d = Array(c.length + 1).fill(0); c.forEach((v, j) => { d[j] += v * p; d[j + 1] += v * q; }); c = d; } return c; };
export default {
  'c11m-binom-terms': {
    title: 'number of terms and a coefficient',
    make(r) {
      const m = pick(r, 5, 12), k = pick(r, 2, 4), answer = C(m, k);
      return { m, k, q: `<p>What is the coefficient of <b>x<sup>${k}</sup></b> in the expansion of (1 + x)<sup>${m}</sup>?</p>`, answer, unit: '', tol: 0, abs: 0.001,
        hint: `In (1 + x)^n the coefficient of x^k is nCk.`,
        solution: steps(`T(k+1) = ${m}Ck · 1^(${m}−k) · x^k, so the coefficient of x^${k} is ${m}C${k}.`, `${m}C${k} = <b>${answer}</b>.`) };
    },
    verify(x) { return poly(1, 1, x.m)[x.k]; },
  },
  'c11m-binom-general': {
    title: 'a coefficient in (a + bx)ⁿ',
    make(r) {
      const p = pick(r, 1, 3), qq = pick(r, 2, 4), m = pick(r, 5, 8), k = pick(r, 2, 4), answer = C(m, k) * p ** (m - k) * qq ** k;
      return { p, qq, m, k, q: `<p>Find the coefficient of x<sup>${k}</sup> in the expansion of (${p} + ${qq}x)<sup>${m}</sup>.</p>`, answer, unit: '', tol: 0.0001,
        hint: `General term: nCk · a^(n−k) · (bx)^k with a = ${p}, b = ${qq}.`,
        solution: steps(`T(k+1) = ${m}C${k} · ${p}^${m - k} · (${qq}x)^${k}.`, `Coefficient = ${C(m, k)} × ${p ** (m - k)} × ${qq ** k} = <b>${answer}</b>.`) };
    },
    verify(x) { return poly(x.p, x.qq, x.m)[x.k]; },
  },
  'c11m-binom-sum': {
    title: 'sum of coefficients',
    make(r) {
      const m = pick(r, 4, 12), answer = 2 ** m;
      return { m, q: `<p>Find the sum of all the coefficients in the expansion of (1 + x)<sup>${m}</sup>.</p>`, answer, unit: '', tol: 0.0001,
        hint: 'Put x = 1 so every power of x becomes 1.',
        solution: steps(`Putting x = 1 turns every power of x into 1, so the sum of the coefficients is (1 + 1)^${m}.`, `= 2^${m} = <b>${answer}</b>.`) };
    },
    verify(x) { return poly(1, 1, x.m).reduce((s, v) => s + v, 0); },
  },
  'c11m-binom-middle': {
    title: 'the middle term coefficient',
    make(r) {
      const m = choose(r, [4, 6, 8, 10, 12]), answer = C(m, m / 2);
      return { m, q: `<p>In the expansion of (a + b)<sup>${m}</sup> the middle term is the one with equal powers of a and b. What is its coefficient?</p>`, answer, unit: '', tol: 0, abs: 0.001,
        hint: `There are ${m + 1} terms, so the middle one is term number ${m / 2 + 1}.`,
        solution: steps(`n = ${m} is even, so one middle term T(${m / 2 + 1}) = ${m}C${m / 2} · a^${m / 2} · b^${m / 2}.`, `Coefficient = <b>${answer}</b>.`) };
    },
    verify(x) { return poly(1, 1, x.m)[x.m / 2]; },
  },
  'c11m-binom-approx': {
    title: 'a quick estimate with the binomial theorem',
    make(r) {
      const m = pick(r, 5, 12), d = pick(r, 1, 4), x = d / 100, answer = +(1 + m * x + C(m, 2) * x * x).toFixed(5);
      return { m, d, x, q: `<p>Use the first three terms of the binomial expansion to estimate (1.0${d})<sup>${m}</sup>. Give your answer to 4 decimal places.</p>`, answer, unit: '', tol: 0.00001,
        hint: '(1 + x)^n ≈ 1 + nx + n(n−1)/2 · x².',
        solution: steps(`x = 0.0${d}, n = ${m}.`, `1 + ${m}(${x}) + ${C(m, 2)}(${x})² = 1 + ${+(m * x).toFixed(4)} + ${+(C(m, 2) * x * x).toFixed(5)}.`, `Estimate <b>${answer}</b> (the exact value is ${(1 + x) ** m < 10 ? +((1 + x) ** m).toFixed(5) : ''}).`) };
    },
    verify(x) { const c = poly(1, x.x, x.m); return +(c[0] + c[1] + c[2]).toFixed(5); },
  },
};
