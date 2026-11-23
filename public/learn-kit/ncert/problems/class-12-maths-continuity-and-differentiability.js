// Class 12 Maths, Continuity and Differentiability: live problems (original fibub questions). Ids start with c12m-cont-.
import { choose, n, steps, tidyProblems } from './_util.js';

const D = (f, x) => { const h = 1e-5; return (f(x + h) - f(x - h)) / (2 * h); };
const D2 = (f, x) => { const h = 1e-3; return (f(x + h) - 2 * f(x) + f(x - h)) / (h * h); };

export default tidyProblems({
  'c12m-cont-findk': {
    title: 'the constant that makes a function continuous',
    make(r) {
      const [p, a, b] = choose(r, [[2, 3, 9], [3, 1, 10], [4, 2, 14], [2, 5, 11], [5, 3, 18], [3, 4, 13]]), k = (b - a) / p;
      return { p, a, b, q: `<p>f(x) = kx + ${a} for x ≤ ${p}, and f(x) = ${b} for x > ${p}. Find k so that f is continuous at x = ${p}.</p>`, answer: k, tol: 0.01, unit: '',
        hint: 'Continuity needs the left-hand limit to equal the right-hand limit (and f at the point).',
        solution: steps(`Left-hand limit at x = ${p}: k(${p}) + ${a} = ${p}k + ${a}.`, `Right-hand limit: ${b}.`, `Equate them: ${p}k + ${a} = ${b}, so k = ${b - a}/${p} = <b>${n(k)}</b>.`) };
    },
    verify: (x) => { const left = (k) => k * x.p + x.a - x.b; return -left(0) / (left(1) - left(0)); },
  },
  'c12m-cont-chain': {
    title: 'chain rule at a point',
    make(r) {
      const [a, b, e, x0] = choose(r, [[2, 1, 3, 1], [3, -1, 4, 1], [2, 3, 2, 1], [5, 1, 3, 0.2], [4, -3, 2, 2], [3, 2, 5, 0.5]]);
      return { a, b, e, x0, q: `<p>If y = (${a}x ${b < 0 ? '−' : '+'} ${Math.abs(b)})<sup>${e}</sup>, find dy/dx at x = ${x0}.</p>`, answer: a * e * (a * x0 + b) ** (e - 1), tol: 0.01, unit: '',
        hint: 'Outer function u^n, inner function ax + b: dy/dx = n u^(n−1) × a.',
        solution: steps(`Let u = ${a}x ${b < 0 ? '−' : '+'} ${Math.abs(b)}, so y = u<sup>${e}</sup>.`, `dy/dx = ${e}u<sup>${e - 1}</sup> × ${a}.`, `At x = ${x0}: u = ${n(a * x0 + b)}, so dy/dx = ${e} × ${n((a * x0 + b) ** (e - 1))} × ${a} = <b>${n(a * e * (a * x0 + b) ** (e - 1))}</b>.`) };
    },
    verify: (x) => D((t) => (x.a * t + x.b) ** x.e, x.x0),
  },
  'c12m-cont-implicit': {
    title: 'slope of a circle by implicit differentiation',
    make(r) {
      const [x0, y0] = choose(r, [[3, 4], [4, 3], [6, 8], [5, 12], [8, 6], [-3, 4], [-4, 3]]), R = Math.hypot(x0, y0);
      return { x0, y0, R, q: `<p>The circle x² + y² = ${R * R} passes through (${x0}, ${y0}). Find dy/dx there.</p>`, answer: -x0 / y0, tol: 0.01, unit: '',
        hint: 'Differentiate both sides with respect to x: 2x + 2y(dy/dx) = 0.',
        solution: steps('2x + 2y·(dy/dx) = 0, so dy/dx = −x/y.', `At (${x0}, ${y0}): dy/dx = −${x0}/${y0} = <b>${n(-x0 / y0)}</b>.`, 'The tangent is perpendicular to the radius: radius slope y/x, tangent slope −x/y.') };
    },
    // explicit upper half circle, derivative taken numerically
    verify: (x) => D((t) => Math.sqrt(x.R * x.R - t * t), x.x0),
  },
  'c12m-cont-param': {
    title: 'dy/dx from parametric equations',
    make(r) {
      const [a, b, t0] = choose(r, [[2, 3, 1], [1, 4, 2], [3, 2, 1], [2, 5, 2], [4, 3, 2], [1, 6, 3]]);
      return { a, b, t0, q: `<p>x = ${a}t², y = ${b}t³. Find dy/dx at t = ${t0}.</p>`, answer: (3 * b * t0) / (2 * a), tol: 0.01, unit: '',
        hint: 'dy/dx = (dy/dt) ÷ (dx/dt).',
        solution: steps(`dx/dt = ${2 * a}t and dy/dt = ${3 * b}t².`, `dy/dx = ${3 * b}t² ÷ ${2 * a}t = ${n((3 * b) / (2 * a))}t.`, `At t = ${t0}: dy/dx = <b>${n((3 * b * t0) / (2 * a))}</b>.`) };
    },
    // eliminate t: t = sqrt(x/a), y = b (x/a)^(3/2); differentiate numerically
    verify: (p) => D((x) => p.b * (x / p.a) ** 1.5, p.a * p.t0 * p.t0),
  },
  'c12m-cont-second': {
    title: 'a second derivative',
    make(r) {
      const [A, B, x0] = choose(r, [[2, 3, 1], [1, -4, 2], [3, 5, 1], [4, -2, 0.5], [5, 1, 2], [2, -6, 3]]);
      return { A, B, x0, q: `<p>If y = ${A}x³ ${B < 0 ? '−' : '+'} ${Math.abs(B)}x², find d²y/dx² at x = ${x0}.</p>`, answer: 6 * A * x0 + 2 * B, tol: 0.01, abs: 0.01, unit: '',
        hint: 'Differentiate twice: the power rule each time.',
        solution: steps(`dy/dx = ${3 * A}x² ${B < 0 ? '−' : '+'} ${2 * Math.abs(B)}x.`, `d²y/dx² = ${6 * A}x ${B < 0 ? '−' : '+'} ${2 * Math.abs(B)}.`, `At x = ${x0}: <b>${n(6 * A * x0 + 2 * B)}</b>.`) };
    },
    verify: (p) => D2((x) => p.A * x ** 3 + p.B * x * x, p.x0),
  },
  'c12m-cont-logdiff': {
    title: 'slope of x to the power x',
    make(r) {
      const c = choose(r, [1, 2, 3, 0.5, 1.5, 2.5]);
      return { c, q: `<p>y = x<sup>x</sup> for x > 0. Find dy/dx at x = ${c}.</p>`, answer: c ** c * (Math.log(c) + 1), tol: 0.01, abs: 0.01, unit: '',
        hint: 'Take natural logs: ln y = x ln x, then differentiate both sides.',
        solution: steps('ln y = x ln x, so (1/y)·y′ = ln x + 1.', `y′ = x<sup>x</sup>(ln x + 1).`, `At x = ${c}: ${n(c ** c)} × (${n(Math.log(c))} + 1) = <b>${n(c ** c * (Math.log(c) + 1))}</b>.`) };
    },
    verify: (p) => D((x) => Math.exp(x * Math.log(x)), p.c),
  },
  'c12m-cont-mvt': {
    title: 'the point promised by the mean value theorem',
    make(r) {
      const [a, b] = choose(r, [[1, 5], [0, 4], [2, 6], [1, 7], [3, 9], [-1, 5]]);
      return { a, b, q: `<p>For f(x) = x² on [${a}, ${b}], find the value of c in (${a}, ${b}) given by the mean value theorem.</p>`, answer: (a + b) / 2, tol: 0.01, abs: 0.01, unit: '',
        hint: 'f′(c) = (f(b) − f(a))/(b − a).',
        solution: steps(`Chord slope = (${b * b} − ${a * a})/(${b} − ${a}) = ${n((b * b - a * a) / (b - a))}.`, `f′(c) = 2c, so 2c = ${n((b * b - a * a) / (b - a))}.`, `c = <b>${n((a + b) / 2)}</b>, which lies between ${a} and ${b}.`) };
    },
    // find c by bisection on f'(c) - slope
    verify: (p) => { const m = (p.b * p.b - p.a * p.a) / (p.b - p.a); let lo = p.a, hi = p.b; for (let i = 0; i < 60; i++) { const mid = (lo + hi) / 2; (2 * mid - m) < 0 ? (lo = mid) : (hi = mid); } return (lo + hi) / 2; },
  },
}, ['c12m-cont-implicit', 'c12m-cont-param', 'c12m-cont-second', 'c12m-cont-mvt']);
