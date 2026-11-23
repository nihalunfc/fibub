// Class 11 Physics, Units and Measurement: live problems (original fibub questions). Ids start with c11p-units-.
import { pick, choose, n, steps } from './_util.js';
const ord = (n) => n + ((n % 100 >= 11 && n % 100 <= 13) ? 'th' : ({ 1: 'st', 2: 'nd', 3: 'rd' }[n % 10] || 'th'));

// Dimensions as [M, L, T] powers: each quantity is given by two different routes (formula 1 for make, formula 2 for verify).
const DIM = [
  { name: 'force', a: [1, 1, -2], via: [[1, 0, 0], [0, 1, -2]], fn: 'mass × acceleration' },
  { name: 'work (energy)', a: [1, 2, -2], via: [[1, 1, -2], [0, 1, 0]], fn: 'force × distance' },
  { name: 'power', a: [1, 2, -3], via: [[1, 2, -2], [0, 0, -1]], fn: 'energy ÷ time' },
  { name: 'pressure', a: [1, -1, -2], via: [[1, 1, -2], [0, -2, 0]], fn: 'force ÷ area' },
  { name: 'momentum', a: [1, 1, -1], via: [[1, 0, 0], [0, 1, -1]], fn: 'mass × velocity' },
  { name: 'impulse', a: [1, 1, -1], via: [[1, 1, -2], [0, 0, 1]], fn: 'force × time' },
];
const AX = ['mass (M)', 'length (L)', 'time (T)'];
const sci = (v) => { const e = Math.floor(Math.log10(Math.abs(v))), m = v / 10 ** e; return `${(+m.toPrecision(3)).toString()} × 10<sup>${e < 0 ? '−' + -e : e}</sup>`; };

export default {
  'c11p-units-sigfig': {
    title: 'area of a rectangle with the right significant figures',
    make(r) {
      const a = choose(r, [5.74, 8.31, 12.6, 3.27, 7.45]), b = choose(r, [1.2, 2.5, 3.4, 4.1, 0.8]), raw = a * b, sf = 2, ans = +raw.toPrecision(sf);
      return { a, b, q: `<p>A rectangular sheet measures ${a} m by ${b} m (the second value has only 2 significant figures). Give its area in m² with the correct number of significant figures.</p>`, answer: ans, unit: 'm²', tol: 0.001,
        hint: 'In a product, the answer has as many significant figures as the measurement with the fewest.',
        solution: steps(`${a} × ${b} = ${n(raw, 6)} on a calculator.`, `${b} has 2 significant figures, so round to 2: <b>${n(ans)} m²</b>.`) };
    },
    verify: (x) => Number((x.a * x.b).toExponential(1)),
  },
  'c11p-units-vernier': {
    title: 'reading a vernier caliper',
    make(r) {
      const N = choose(r, [10, 20, 50]), ms = pick(r, 12, 45, 1), k = pick(r, 1, N - 1, 1), lc = 1 / N, ans = ms + k * lc;
      return { N, ms, k, q: `<p>A vernier caliper has 1 mm divisions on the main scale and ${N} vernier divisions that together equal ${N - 1} main-scale divisions. The zero of the vernier lies just beyond the ${ms} mm mark, and the ${ord(k)} vernier division coincides with a main-scale line. What is the length in mm?</p>`, answer: ans, unit: 'mm', tol: 0.0005,
        hint: 'Least count = 1 mm ÷ N. Reading = main scale reading + (coinciding division) × least count.',
        solution: steps(`Least count = 1/${N} = ${lc} mm.`, `Reading = ${ms} + ${k} × ${lc} = <b>${n(ans, 5)} mm</b>.`) };
    },
    verify: (x) => (x.ms * x.N + x.k) / x.N,
  },
  'c11p-units-dim': {
    title: 'power of a base unit in a dimension',
    make(r) {
      const qi = Math.floor(r() * DIM.length) % DIM.length, ax = Math.floor(r() * 3) % 3, d = DIM[qi], ans = d.a[ax];
      return { qi, ax, q: `<p>The dimensional formula of <b>${d.name}</b> is M<sup>a</sup>L<sup>b</sup>T<sup>c</sup>. Find the power of <b>${AX[ax]}</b> in it (give the signed number).</p>`, answer: ans, abs: 0.001, tol: 0,
        hint: `Think of ${d.name} as ${d.fn} and combine the dimensions.`,
        solution: steps(`${d.name} = ${d.fn}.`, `Dimension: M<sup>${d.a[0]}</sup> L<sup>${d.a[1]}</sup> T<sup>${d.a[2]}</sup>.`, `The power of ${AX[ax]} is <b>${ans}</b>.`) };
    },
    verify: (x) => DIM[x.qi].via.reduce((s, v) => s + v[x.ax], 0),
  },
  'c11p-units-error': {
    title: 'percentage error in the density of a cube',
    make(r) {
      const m = choose(r, [50, 100, 200, 250]), dm = choose(r, [0.5, 1, 2]), l = choose(r, [2, 4, 5, 10]), dl = choose(r, [0.01, 0.02, 0.05]), ans = (dm / m + 3 * dl / l) * 100;
      return { m, dm, l, dl, q: `<p>A metal cube has mass ${m} ± ${dm} g and edge ${l} ± ${dl} cm. Find the maximum percentage error in its density.</p>`, answer: ans, unit: '%', tol: 0.01,
        hint: 'ρ = m/l³. In a quotient the relative errors add, and a power multiplies the relative error by the power.',
        solution: steps(`Δm/m = ${dm}/${m} = ${n(dm / m, 4)}; Δl/l = ${dl}/${l} = ${n(dl / l, 4)}.`, `Δρ/ρ = Δm/m + 3Δl/l = ${n(dm / m, 4)} + 3 × ${n(dl / l, 4)} = ${n(ans / 100, 4)}.`, `That is <b>${n(ans)} %</b>.`) };
    },
    verify: (x) => 100 * x.dm / x.m + 300 * x.dl / x.l,
  },
  'c11p-units-convert': {
    title: 'converting units of density',
    make(r) {
      const d = pick(r, 0.8, 13.6, 0.4), ans = d * 1000;
      return { d, q: `<p>A liquid has a density of ${d} g/cm³. Express it in kg/m³.</p>`, answer: ans, unit: 'kg/m³', tol: 0.001,
        hint: '1 g = 10⁻³ kg and 1 cm³ = 10⁻⁶ m³.',
        solution: steps(`${d} g/cm³ = ${d} × 10<sup>−3</sup> kg ÷ 10<sup>−6</sup> m³.`, `= ${d} × 10³ = <b>${n(ans)} kg/m³</b>.`) };
    },
    verify: (x) => (x.d / 1000) / 1e-6,
  },
};
