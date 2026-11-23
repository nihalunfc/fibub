// Class 11 Maths, Limits and Derivatives: live problems (original fibub questions). Ids start with c11m-lim-.
import { pick, choose, n, steps } from './_util.js';

const sg = (v) => (v < 0 ? '−' + Math.abs(v) : String(v));
const cd = (f, x) => (f(x + 1e-5) - f(x - 1e-5)) / 2e-5;   // numerical slope
export default {
  'c11m-lim-cube': {
    title: 'limit of (x³ − a³)/(x − a)',
    make(r) {
      const a = pick(r, 2, 9);
      return { a, q: `<p>Find the limit of (x³ − ${a ** 3})/(x − ${a}) as x → ${a}.</p>`, answer: 3 * a * a, unit: '', tol: 0.01,
        hint: 'Substituting gives 0/0. Factorise x³ − a³ = (x − a)(x² + ax + a²) and cancel.',
        solution: steps(`x³ − ${a ** 3} = (x − ${a})(x² + ${a}x + ${a * a}).`, `Cancel (x − ${a}): the fraction becomes x² + ${a}x + ${a * a}.`, `Put x = ${a}: ${a * a} + ${a * a} + ${a * a} = <b>${3 * a * a}</b>.`) };
    },
    // evaluate very close to a
    verify: (p) => { const x = p.a + 1e-5; return (x ** 3 - p.a ** 3) / (x - p.a); },
  },
  'c11m-lim-quad': {
    title: 'limit of a quadratic over a linear factor',
    make(r) {
      const a = pick(r, 1, 8), b = pick(r, -6, 6);
      return { a, b, q: `<p>Find the limit of (x² − ${sg(a + b)}x + ${sg(a * b)})/(x − ${a}) as x → ${a}.</p>`, answer: a - b, unit: '', tol: 0.001, abs: 0.01,
        hint: 'The top factorises as (x − a)(x − b). Cancel the common factor.',
        solution: steps(`x² − ${sg(a + b)}x + ${sg(a * b)} = (x − ${a})(x − ${sg(b)}).`, `Cancel (x − ${a}): x − ${sg(b)}.`, `Put x = ${a}: ${a} − ${sg(b)} = <b>${a - b}</b>.`) };
    },
    verify: (p) => { const x = p.a + 1e-6; return (x * x - (p.a + p.b) * x + p.a * p.b) / (x - p.a); },
  },
  'c11m-lim-sin': {
    title: 'a limit with sine',
    make(r) {
      const k = pick(r, 1, 9), m = pick(r, 2, 8);
      return { k, m, q: `<p>Find the limit of sin(${k}x)/(${m}x) as x → 0 (a decimal to 3 places).</p>`, answer: k / m, unit: '', tol: 0.01,
        hint: 'Use lim sin(u)/u = 1 as u → 0. Write sin(kx)/(mx) = (k/m)·sin(kx)/(kx).',
        solution: steps(`sin(${k}x)/(${m}x) = (${k}/${m}) × sin(${k}x)/(${k}x).`, `As x → 0, ${k}x → 0, so sin(${k}x)/(${k}x) → 1.`, `Limit = ${k}/${m} = <b>${n(k / m, 4)}</b>.`) };
    },
    verify: (p) => { const x = 1e-5; return Math.sin(p.k * x) / (p.m * x); },
  },
  'c11m-lim-cosq': {
    title: 'a limit with cosine',
    make(r) {
      const k = pick(r, 1, 6);
      return { k, q: `<p>Find the limit of (1 − cos ${k}x)/x² as x → 0.</p>`, answer: (k * k) / 2, unit: '', tol: 0.01,
        hint: 'Use 1 − cos u = 2 sin²(u/2), then sin(u)/u → 1.',
        solution: steps(`1 − cos ${k}x = 2 sin²(${k}x/2).`, `So the fraction = 2 sin²(${k}x/2)/x² = (${k * k}/2) × [sin(${k}x/2)/(${k}x/2)]².`, `The bracket → 1, so the limit = <b>${n((k * k) / 2, 4)}</b>.`) };
    },
    verify: (p) => { const x = 1e-3; return (1 - Math.cos(p.k * x)) / (x * x); },
  },
  'c11m-lim-deriv': {
    title: 'slope of a cubic at a point',
    make(r) {
      const A = pick(r, 1, 5), B = pick(r, -6, 6), C = pick(r, -8, 8), x0 = pick(r, -3, 3);
      return { A, B, C, x0, q: `<p>f(x) = ${A}x³ ${B < 0 ? '−' : '+'} ${Math.abs(B)}x² ${C < 0 ? '−' : '+'} ${Math.abs(C)}x. Find f′(${sg(x0)}), the slope of the tangent at x = ${sg(x0)}.</p>`, answer: 3 * A * x0 * x0 + 2 * B * x0 + C, unit: '', tol: 0.001, abs: 0.01,
        hint: 'Use d/dx(xⁿ) = n xⁿ⁻¹ term by term, then substitute.',
        solution: steps(`f′(x) = ${3 * A}x² ${2 * B < 0 ? '−' : '+'} ${Math.abs(2 * B)}x ${C < 0 ? '−' : '+'} ${Math.abs(C)}.`, `At x = ${sg(x0)}: ${3 * A * x0 * x0} ${2 * B * x0 < 0 ? '−' : '+'} ${Math.abs(2 * B * x0)} ${C < 0 ? '−' : '+'} ${Math.abs(C)} = <b>${3 * A * x0 * x0 + 2 * B * x0 + C}</b>.`) };
    },
    verify: (p) => cd((x) => p.A * x ** 3 + p.B * x * x + p.C * x, p.x0),
  },
  'c11m-lim-product': {
    title: 'product rule at a point',
    make(r) {
      const a = pick(r, 1, 4), b = pick(r, -4, 4), c = pick(r, 1, 4), d = pick(r, -4, 4), x0 = pick(r, -3, 3);
      return { a, b, c, d, x0, q: `<p>f(x) = (${a}x ${b < 0 ? '−' : '+'} ${Math.abs(b)})(${c}x ${d < 0 ? '−' : '+'} ${Math.abs(d)}). Use the product rule to find f′(${sg(x0)}).</p>`, answer: a * (c * x0 + d) + c * (a * x0 + b), unit: '', tol: 0.001, abs: 0.01,
        hint: '(uv)′ = u′v + uv′ with u = ' + a + 'x + (' + b + '), v = ' + c + 'x + (' + d + ').',
        solution: steps(`u′ = ${a}, v′ = ${c}; at x = ${sg(x0)}: u = ${a * x0 + b}, v = ${c * x0 + d}.`, `f′ = u′v + uv′ = ${a}×${c * x0 + d} + ${a * x0 + b}×${c} = <b>${a * (c * x0 + d) + c * (a * x0 + b)}</b>.`) };
    },
    verify: (p) => cd((x) => (p.a * x + p.b) * (p.c * x + p.d), p.x0),
  },
  'c11m-lim-quot': {
    title: 'quotient rule at a point',
    make(r) {
      const a = pick(r, 1, 6), b = choose(r, [-5, -4, -3, -2, -1, 1, 2, 3, 4, 5]), x0 = choose(r, [-4, -3, 0, 2, 4, 6].filter((v) => v !== b)), ans = -(a + b) / (x0 - b) ** 2, vt = b < 0 ? `x + ${-b}` : `x − ${b}`;
      return { a, b, x0, q: `<p>f(x) = (x + ${a})/(x ${b < 0 ? '+' : '−'} ${Math.abs(b)}). Find f′(${sg(x0)}) (a decimal to 4 places).</p>`, answer: ans, unit: '', tol: 0.01, abs: 0.0005,
        hint: '(u/v)′ = (u′v − uv′)/v².',
        solution: steps(`u = x + ${a}, v = ${vt}, u′ = v′ = 1.`, `f′ = [1·(${vt}) − (x + ${a})·1]/(${vt})² = ${sg(-(a + b))}/(${vt})².`, `At x = ${sg(x0)}: <b>${n(ans, 4)}</b>.`) };
    },
    verify: (p) => cd((x) => (x + p.a) / (x - p.b), p.x0),
  },
};
