// Class 12 Maths, Chapter 7 Integrals: live problems (original fibub questions). Ids start with c12m-int-.
import { pick, choose, n, steps, tidyProblems } from './_util.js';

// Simpson's rule: a numerical check that does not use any antiderivative.
const simpson = (f, a, b, N = 2000) => { const h = (b - a) / N; let s = f(a) + f(b); for (let i = 1; i < N; i++) s += f(a + i * h) * (i % 2 ? 4 : 2); return s * h / 3; };
const sgn = (v, s) => (v === 0 ? '' : (v < 0 ? ' − ' : ' + ') + (Math.abs(v) === 1 && s ? '' : Math.abs(v)) + s);

export default tidyProblems({
  'c12m-int-power': {
    title: 'definite integral of a polynomial',
    make(r) {
      const p = pick(r, 1, 6), lin = pick(r, -6, 6), c = pick(r, -5, 5), a = pick(r, 0, 2), b = a + pick(r, 1, 3);
      const F = (x) => p * x ** 3 / 3 + lin * x * x / 2 + c * x, answer = F(b) - F(a);
      return { p, lin, c, a, b, q: `<p>Evaluate ∫ from ${a} to ${b} of (${p}x<sup>2</sup>${sgn(lin, 'x')}${sgn(c, '')}) dx.</p>`, answer, unit: '', tol: 0.005, abs: 0.005,
        hint: 'Integrate term by term: x² gives x³/3, x gives x²/2, a constant k gives kx. Then F(b) − F(a).',
        solution: steps(`An antiderivative is F(x) = ${p}x³/3${sgn(lin / 2, 'x²')}${sgn(c, 'x')}.`, `F(${b}) = ${n(F(b))} and F(${a}) = ${n(F(a))}.`, `The integral is F(${b}) − F(${a}) = <b>${n(answer)}</b>.`) };
    },
    verify: (x) => simpson((t) => x.p * t * t + x.lin * t + x.c, x.a, x.b),
  },
  'c12m-int-subst': {
    title: 'substitution u = x² + 1',
    make(r) {
      const k = pick(r, 1, 6), m = pick(r, 2, 5), answer = k / (2 * (m + 1)) * (2 ** (m + 1) - 1);
      return { k, m, q: `<p>Use the substitution u = x² + 1 to evaluate ∫ from 0 to 1 of ${k}x(x² + 1)<sup>${m}</sup> dx.</p>`, answer, unit: '', tol: 0.005, abs: 0.005,
        hint: 'Let u = x² + 1, so du = 2x dx. The limits become u = 1 and u = 2.',
        solution: steps(`u = x² + 1 gives du = 2x dx, so ${k}x dx = (${k}/2) du. At x = 0, u = 1; at x = 1, u = 2.`, `The integral becomes (${k}/2) ∫ from 1 to 2 of u<sup>${m}</sup> du = (${k}/2) · [u<sup>${m + 1}</sup>/${m + 1}] from 1 to 2.`, `= (${k}/${2 * (m + 1)})(${2 ** (m + 1)} − 1) = <b>${n(answer)}</b>.`) };
    },
    verify: (x) => simpson((t) => x.k * t * (t * t + 1) ** x.m, 0, 1),
  },
  'c12m-int-parts': {
    title: 'integration by parts, x·eˣ',
    make(r) {
      const A = choose(r, [1, 2, 3, 4]), c = pick(r, 2, 3), answer = A * ((c - 1) * Math.exp(c) + 1);
      return { A, c, q: `<p>Use integration by parts to evaluate ∫ from 0 to ${c} of ${A}x e<sup>x</sup> dx. (Give a decimal.)</p>`, answer, unit: '', tol: 0.005, abs: 0.005,
        hint: 'Take u = x and dv = eˣ dx. Then ∫x eˣ dx = x eˣ − eˣ.',
        solution: steps('u = x, dv = eˣ dx, so du = dx, v = eˣ.', `∫ x eˣ dx = x eˣ − ∫ eˣ dx = (x − 1)eˣ.`, `${A}[(x − 1)eˣ] from 0 to ${c} = ${A}[(${c - 1})e<sup>${c}</sup> − (−1)] = <b>${n(answer)}</b>.`) };
    },
    verify: (x) => simpson((t) => x.A * t * Math.exp(t), 0, x.c),
  },
  'c12m-int-partial': {
    title: 'partial fractions',
    make(r) {
      const [r1, r2] = choose(r, [[1, 2], [1, 3], [2, 3], [1, 4], [2, 5]]), c = pick(r, 1, 5), d = pick(r, 1, 6), L = r2 + 1, U = r2 + choose(r, [3, 5, 7]);
      const A = (c * r1 + d) / (r1 - r2), B = (c * r2 + d) / (r2 - r1), answer = A * Math.log((U - r1) / (L - r1)) + B * Math.log((U - r2) / (L - r2));
      return { r1, r2, c, d, L, U, q: `<p>Evaluate ∫ from ${L} to ${U} of (${c}x + ${d}) / ((x − ${r1})(x − ${r2})) dx. (Give a decimal.)</p>`, answer, unit: '', tol: 0.005, abs: 0.005,
        hint: `Write the fraction as A/(x − ${r1}) + B/(x − ${r2}); find A by putting x = ${r1} and B by putting x = ${r2} (cover-up).`,
        solution: steps(`A = (${c}·${r1} + ${d})/(${r1} − ${r2}) = ${n(A)}, B = (${c}·${r2} + ${d})/(${r2} − ${r1}) = ${n(B)}.`, `∫ = A ln|x − ${r1}| + B ln|x − ${r2}| from ${L} to ${U}.`, `= ${n(A)}·ln(${U - r1}/${L - r1}) + ${n(B)}·ln(${U - r2}/${L - r2}) = <b>${n(answer)}</b>.`) };
    },
    verify: (x) => simpson((t) => (x.c * t + x.d) / ((t - x.r1) * (t - x.r2)), x.L, x.U),
  },
  'c12m-int-even': {
    title: 'odd and even parts over −a to a',
    make(r) {
      const a = pick(r, 1, 4), p = pick(r, 1, 5), lin = pick(r, -4, 4), s = pick(r, -5, 5), answer = 2 * (p * a ** 3 / 3 + s * a);
      return { a, p, lin, s, q: `<p>Evaluate ∫ from −${a} to ${a} of (x³ ${lin < 0 ? '−' : '+'} ${Math.abs(lin)}x + ${p}x² ${s < 0 ? '−' : '+'} ${Math.abs(s)}) dx without finding the full antiderivative first.</p>`, answer, unit: '', tol: 0.005, abs: 0.005,
        hint: 'The odd terms (x³ and x) integrate to 0 over −a to a. Only the even terms count, and they give twice the integral from 0 to a.',
        solution: steps('x³ and the x term are odd functions, so their integral from −a to a is 0.', `The even part is ${p}x² ${s < 0 ? '−' : '+'} ${Math.abs(s)}, so the integral is 2 ∫ from 0 to ${a} of (${p}x² ${s < 0 ? '−' : '+'} ${Math.abs(s)}) dx = 2[${p}${a}³/3 ${s < 0 ? '−' : '+'} ${Math.abs(s)}·${a}].`, `= <b>${n(answer)}</b>.`) };
    },
    verify: (x) => simpson((t) => t ** 3 + x.lin * t + x.p * t * t + x.s, -x.a, x.a),
  },
  'c12m-int-arctan': {
    title: 'the arctan integral',
    make(r) {
      const c = pick(r, 1, 5), b = c * choose(r, [1, 2, 3]), answer = Math.atan(b / c) / c;
      return { c, b, q: `<p>Evaluate ∫ from 0 to ${b} of dx/(x² + ${c * c}). (Give a decimal; use radians.)</p>`, answer, unit: '', tol: 0.005, abs: 0.002,
        hint: 'Use ∫ dx/(x² + a²) = (1/a) tan⁻¹(x/a) with a = ' + c + '.',
        solution: steps(`With a = ${c}: ∫ dx/(x² + ${c * c}) = (1/${c}) tan⁻¹(x/${c}).`, `From 0 to ${b}: (1/${c})[tan⁻¹(${b / c}) − tan⁻¹(0)] = (1/${c})·${n(Math.atan(b / c))}.`, `= <b>${n(answer)}</b>.`) };
    },
    verify: (x) => simpson((t) => 1 / (t * t + x.c * x.c), 0, x.b),
  },
}, ['c12m-int-power', 'c12m-int-subst', 'c12m-int-parts', 'c12m-int-partial', 'c12m-int-even']);
