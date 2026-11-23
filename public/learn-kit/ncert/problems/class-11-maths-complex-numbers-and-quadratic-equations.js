// Class 11 Maths, Complex Numbers and Quadratic Equations: live problems (original fibub questions). Ids start with c11m-cx-.
import { pick, choose, n, steps } from './_util.js';

const cm = ([a, b], [c, d]) => [a * c - b * d, a * d + b * c];
const sg = (v) => (v < 0 ? '−' : '+');
export default {
  'c11m-cx-power': {
    title: 'imaginary part of a power of i',
    make(r) {
      const k = pick(r, 12, 99), answer = [0, 1, 0, -1][k % 4];
      return { k, q: `<p>Find the imaginary part of <b>i<sup>${k}</sup></b>. (Enter 0, 1 or −1.)</p>`, answer, unit: '', tol: 0, abs: 0.001,
        hint: 'Powers of i repeat every 4: i, −1, −i, 1. Divide the power by 4 and use the remainder.',
        solution: steps(`${k} = 4 × ${Math.floor(k / 4)} + ${k % 4}, so i<sup>${k}</sup> = i<sup>${k % 4}</sup> = ${['1', 'i', '−1', '−i'][k % 4]}.`, `Imaginary part = <b>${answer}</b>.`) };
    },
    verify(x) { let z = [1, 0]; for (let i = 0; i < x.k; i++) z = cm(z, [0, 1]); return z[1]; },
  },
  'c11m-cx-product': {
    title: 'real part of a product',
    make(r) {
      const a = pick(r, -5, 6), b = pick(r, -5, 6), c = pick(r, -5, 6), d = pick(r, -5, 6), answer = a * c - b * d;
      return { a, b, c, d, q: `<p>Find the <b>real part</b> of (${a} ${sg(b)} ${Math.abs(b)}i)(${c} ${sg(d)} ${Math.abs(d)}i).</p>`, answer, unit: '', tol: 0, abs: 0.01,
        hint: 'Multiply out and use i² = −1. The real part collects the terms without i.',
        solution: steps(`(${a} ${sg(b)} ${Math.abs(b)}i)(${c} ${sg(d)} ${Math.abs(d)}i) = ${a * c} + ${a * d}i + ${b * c}i + ${b * d}i².`, `Real part = ${a * c} − (${b * d}) = <b>${answer}</b>.`) };
    },
    verify(x) { const m1 = Math.hypot(x.a, x.b), m2 = Math.hypot(x.c, x.d), t = Math.atan2(x.b, x.a) + Math.atan2(x.d, x.c); return m1 * m2 * Math.cos(t); },
  },
  'c11m-cx-modulus': {
    title: 'modulus of a product',
    make(r) {
      const [a, b] = choose(r, [[3, 4], [5, 12], [8, 6], [6, 8], [12, 5], [9, 12]]), [c, d] = choose(r, [[3, 4], [4, 3], [5, 12], [15, 8], [7, 24]]), [pr, pi] = cm([a, b], [c, d]), answer = Math.hypot(pr, pi);
      return { a, b, c, d, q: `<p>Find |z<sub>1</sub>z<sub>2</sub>| for z<sub>1</sub> = ${a} + ${b}i and z<sub>2</sub> = ${c} + ${d}i.</p>`, answer, unit: '', tol: 0.001,
        hint: 'Either multiply first and then take the modulus, or use |z₁z₂| = |z₁||z₂|.',
        solution: steps(`|z<sub>1</sub>| = √(${a}² + ${b}²) = ${n(Math.hypot(a, b), 4)}, |z<sub>2</sub>| = √(${c}² + ${d}²) = ${n(Math.hypot(c, d), 4)}.`, `|z<sub>1</sub>z<sub>2</sub>| = <b>${n(answer, 5)}</b>.`) };
    },
    verify(x) { return Math.hypot(x.a, x.b) * Math.hypot(x.c, x.d); },
  },
  'c11m-cx-quotient': {
    title: 'real part of a quotient',
    make(r) {
      const a = pick(r, -6, 8), b = pick(r, -6, 8), c = pick(r, 1, 5), d = pick(r, -4, 4), answer = (a * c + b * d) / (c * c + d * d);
      return { a, b, c, d, q: `<p>Find the real part of (${a} ${sg(b)} ${Math.abs(b)}i) / (${c} ${sg(d)} ${Math.abs(d)}i) to 3 decimal places.</p>`, answer, unit: '', tol: 0.003, abs: 0.002,
        hint: 'Multiply top and bottom by the conjugate of the bottom, so the bottom becomes c² + d².',
        solution: steps(`Multiply by (${c} ${d < 0 ? '+' : '−'} ${Math.abs(d)}i): top = (${a} ${sg(b)} ${Math.abs(b)}i)(${c} ${d < 0 ? '+' : '−'} ${Math.abs(d)}i); bottom = ${c * c + d * d}.`, `Real part of the top = ${a * c + b * d}. Real part of the quotient = ${a * c + b * d} / ${c * c + d * d} = <b>${n(answer, 4)}</b>.`) };
    },
    verify(x) { return (Math.hypot(x.a, x.b) / Math.hypot(x.c, x.d)) * Math.cos(Math.atan2(x.b, x.a) - Math.atan2(x.d, x.c)); },
  },
  'c11m-cx-root': {
    title: 'imaginary part of a root',
    make(r) {
      const b = 2 * pick(r, -4, 4), c = (b / 2) ** 2 + pick(r, 1, 12), answer = Math.sqrt(4 * c - b * b) / 2;
      return { b, c, q: `<p>x² ${sg(b)} ${Math.abs(b)}x + ${c} = 0 has two complex roots. Find the (positive) imaginary part of one of them, to 3 decimal places.</p>`, answer, unit: '', tol: 0.003,
        hint: 'Use x = (−b ± √(b² − 4c)) / 2. Because b² − 4c is negative, the root is −b/2 ± i·√(4c − b²)/2.',
        solution: steps(`D = b² − 4c = ${b * b} − ${4 * c} = ${b * b - 4 * c} < 0.`, `x = ${-b / 2} ± i √${4 * c - b * b} / 2. Imaginary part = <b>${n(answer, 4)}</b>.`) };
    },
    verify(x) { return Math.sqrt(x.c - (x.b / 2) ** 2); },
  },
  'c11m-cx-argument': {
    title: 'principal argument in degrees',
    make(r) {
      const a = choose(r, [-1, -2, -3, -4, 1, 2, 3, 4]), b = choose(r, [-1, -2, -3, -4, 1, 2, 3, 4]), q = a > 0 ? (b > 0 ? 1 : 4) : b > 0 ? 2 : 3, base = (Math.atan(Math.abs(b) / Math.abs(a)) * 180) / Math.PI, answer = q === 1 ? base : q === 2 ? 180 - base : q === 3 ? -(180 - base) : -base;
      return { a, b, q: `<p>Find the principal argument (between −180° and 180°) of z = ${a} ${sg(b)} ${Math.abs(b)}i, in degrees to 1 decimal place.</p>`, answer, unit: '°', tol: 0.005,
        hint: 'Find the reference angle tan⁻¹(|b|/|a|), then place it in the right quadrant.',
        solution: steps(`z is in quadrant ${['I', 'II', 'III', 'IV'][q - 1]}; reference angle = tan⁻¹(${Math.abs(b)}/${Math.abs(a)}) = ${n(base, 4)}°.`, `Principal argument = <b>${n(answer, 4)}°</b>.`) };
    },
    verify(x) { return (Math.atan2(x.b, x.a) * 180) / Math.PI; },
  },
};
