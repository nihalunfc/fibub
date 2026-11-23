// Class 12 Maths, Application of Derivatives: live problems (original fibub questions). Ids start with c12m-appd-.
import { choose, n, steps } from './_util.js';

const D = (f, x) => { const h = 1e-5; return (f(x + h) - f(x - h)) / (2 * h); };
// golden-section search for the largest value of f on [lo, hi]
const maxOf = (f, lo, hi) => { const g = (Math.sqrt(5) - 1) / 2; let a = lo, b = hi; for (let i = 0; i < 120; i++) { const c = b - g * (b - a), d = a + g * (b - a); f(c) > f(d) ? (b = d) : (a = c); } return f((a + b) / 2); };

export default {
  'c12m-appd-balloon': {
    title: 'how fast the radius of a balloon grows',
    make(r) {
      const [dV, rr] = choose(r, [[100, 5], [200, 10], [60, 3], [150, 6], [90, 2], [300, 8]]);
      return { dV, rr, q: `<p>Air is blown into a spherical balloon at a steady ${dV} cm³/s. How fast is the radius increasing (in cm/s) at the moment the radius is ${rr} cm?</p>`, answer: dV / (4 * Math.PI * rr * rr), tol: 0.01, unit: 'cm/s',
        hint: 'V = (4/3)πr³, so dV/dt = 4πr² dr/dt.',
        solution: steps('V = (4/3)πr³. Differentiate with respect to t: dV/dt = 4πr²·dr/dt.', `dr/dt = ${dV} ÷ (4π × ${rr}²) = ${dV} ÷ ${n(4 * Math.PI * rr * rr)}.`, `dr/dt = <b>${n(dV / (4 * Math.PI * rr * rr))} cm/s</b>.`) };
    },
    verify: (p) => 1 / D((x) => (4 / 3) * Math.PI * x ** 3, p.rr) * p.dV,
  },
  'c12m-appd-ladder': {
    title: 'the top of a sliding ladder',
    make(r) {
      const [L, x, v] = choose(r, [[10, 6, 1], [13, 5, 2], [5, 3, 0.5], [17, 8, 1.5], [10, 8, 1], [25, 7, 2]]), y = Math.sqrt(L * L - x * x);
      return { L, x, v, q: `<p>A ${L} m ladder leans against a vertical wall. Its foot slides away from the wall at ${v} m/s. How fast (in m/s, as a positive number) is the top sliding down the wall when the foot is ${x} m from the wall?</p>`, answer: (x / y) * v, tol: 0.01, unit: 'm/s',
        hint: 'x² + y² = L². Differentiate with respect to t.',
        solution: steps(`x² + y² = ${L * L}, so 2x·dx/dt + 2y·dy/dt = 0 and dy/dt = −(x/y)·dx/dt.`, `y = √(${L * L} − ${x * x}) = ${n(y)} m.`, `Speed of the top = (${x}/${n(y)}) × ${v} = <b>${n((x / y) * v)} m/s</b>.`) };
    },
    verify: (p) => Math.abs(D((t) => Math.sqrt(p.L * p.L - (p.x + p.v * t) ** 2), 0)),
  },
  'c12m-appd-ripple': {
    title: 'the area of a spreading ripple',
    make(r) {
      const [v, rr] = choose(r, [[2, 5], [3, 10], [1, 20], [4, 6], [2, 15], [1.5, 8]]);
      return { v, rr, q: `<p>A circular ripple spreads so that its radius grows at ${v} cm/s. How fast is its area increasing (in cm²/s) when the radius is ${rr} cm?</p>`, answer: 2 * Math.PI * rr * v, tol: 0.01, unit: 'cm²/s',
        hint: 'A = πr², so dA/dt = 2πr·dr/dt.',
        solution: steps('A = πr², so dA/dt = 2πr·dr/dt.', `= 2π × ${rr} × ${v}`, `= <b>${n(2 * Math.PI * rr * v)} cm²/s</b>.`) };
    },
    verify: (p) => D((t) => Math.PI * (p.rr + p.v * t) ** 2, 0),
  },
  'c12m-appd-turn': {
    title: 'where a function turns from falling to rising',
    make(r) {
      const [a, b, c] = choose(r, [[1, 6, 5], [2, 12, 1], [1, 10, 3], [3, 18, 2], [2, 8, 7], [1, 4, 9]]);
      return { a, b, c, q: `<p>f(x) = ${a === 1 ? '' : a}x² − ${b}x + ${c}. For which value of x does f change from decreasing to increasing?</p>`, answer: b / (2 * a), tol: 0.01, unit: '',
        hint: 'Find where f′(x) = 0 and check the sign of f′ on each side.',
        solution: steps(`f′(x) = ${2 * a}x − ${b}.`, `f′ = 0 at x = ${b}/${2 * a} = ${n(b / (2 * a))}.`, `For x less than this, f′ < 0 (decreasing); for x more, f′ > 0 (increasing). Answer: <b>x = ${n(b / (2 * a))}</b>.`) };
    },
    // bisection on the numerical derivative
    verify: (p) => { const f = (x) => p.a * x * x - p.b * x + p.c; let lo = -50, hi = 50; for (let i = 0; i < 80; i++) { const m = (lo + hi) / 2; D(f, m) < 0 ? (lo = m) : (hi = m); } return (lo + hi) / 2; },
  },
  'c12m-appd-box': {
    title: 'the largest open box from a square sheet',
    make(r) {
      const s = choose(r, [12, 18, 24, 30, 36, 6]);
      return { s, q: `<p>A square sheet of side ${s} cm has a small square cut from each corner and the flaps are folded up to make an open box. Find the greatest possible volume of the box (in cm³).</p>`, answer: (2 * s ** 3) / 27, tol: 0.01, unit: 'cm³',
        hint: 'If x is the cut, V = x(s − 2x)². Set dV/dx = 0.',
        solution: steps(`V(x) = x(${s} − 2x)² = 4x³ − ${4 * s}x² + ${s * s}x.`, `V′(x) = 12x² − ${8 * s}x + ${s * s} = 12(x − ${n(s / 6)})(x − ${n(s / 2)}).`, `x = ${n(s / 6)} gives V″ < 0, so it is the maximum. V = ${n(s / 6)} × (${n((2 * s) / 3)})² = <b>${n((2 * s ** 3) / 27)} cm³</b>.`) };
    },
    verify: (p) => maxOf((x) => x * (p.s - 2 * x) ** 2, 0, p.s / 2),
  },
  'c12m-appd-fence': {
    title: 'the biggest field next to a river',
    make(r) {
      const F = choose(r, [40, 60, 80, 100, 120, 200]);
      return { F, q: `<p>A farmer has ${F} m of fencing to enclose a rectangular field along a straight river bank. No fence is needed along the river. Find the greatest area (in m²) she can enclose.</p>`, answer: (F * F) / 8, tol: 0.01, unit: 'm²',
        hint: 'Let the two sides at right angles to the river be x each. The side along the river is F − 2x.',
        solution: steps(`Area A(x) = x(${F} − 2x).`, `A′(x) = ${F} − 4x = 0 gives x = ${n(F / 4)}, and A″ = −4 < 0 (maximum).`, `Along the river: ${F} − ${n(F / 2)} = ${n(F / 2)}. Area = ${n(F / 4)} × ${n(F / 2)} = <b>${n((F * F) / 8)} m²</b>.`) };
    },
    verify: (p) => maxOf((x) => x * (p.F - 2 * x), 0, p.F / 2),
  },
  'c12m-appd-localmin': {
    title: 'a local minimum value by the second derivative test',
    make(r) {
      const [a, c] = choose(r, [[1, 5], [2, 3], [3, -1], [1, 10], [2, 0.5], [4, 7]]);
      return { a, c, q: `<p>Find the local minimum value of f(x) = x³ − ${3 * a * a}x + ${c}.</p>`, answer: c - 2 * a ** 3, tol: 0.01, abs: 0.01, unit: '',
        hint: 'f′(x) = 0 gives two points; f″(x) = 6x tells which is the minimum.',
        solution: steps(`f′(x) = 3x² − ${3 * a * a} = 3(x − ${a})(x + ${a}).`, `f″(x) = 6x: positive at x = ${a}, so x = ${a} gives a local minimum.`, `f(${a}) = ${a ** 3} − ${3 * a ** 3} + ${c} = <b>${n(c - 2 * a ** 3)}</b>.`) };
    },
    // search the numerical minimum near x = a
    verify: (p) => { const f = (x) => x ** 3 - 3 * p.a * p.a * x + p.c; let lo = p.a / 2, hi = p.a * 2; for (let i = 0; i < 120; i++) { const m1 = lo + (hi - lo) / 3, m2 = hi - (hi - lo) / 3; f(m1) < f(m2) ? (hi = m2) : (lo = m1); } return f((lo + hi) / 2); },
  },
};
