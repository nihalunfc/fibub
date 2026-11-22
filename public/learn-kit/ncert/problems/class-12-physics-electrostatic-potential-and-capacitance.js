// Class 12 Physics, Electrostatic Potential and Capacitance: live problems (original fibub questions). Ids start with c12p-cap-.
import { pick, choose, n, steps } from './_util.js';

const sci = (v, d = 3) => { const e = Math.floor(Math.log10(Math.abs(v))), m = v / 10 ** e; return `${(+m.toPrecision(d)).toString()} × 10<sup>${e < 0 ? '−' + -e : e}</sup>`; };
const K = 9e9, E0 = 8.854e-12;

export default {
  'c12p-cap-pointv': {
    title: 'potential of a point charge',
    make(r) {
      const q = pick(r, 1, 20, 1), cm = choose(r, [10, 20, 30, 50, 90]), V = (K * q * 1e-9) / (cm / 100);
      return { q_: q, cm, q: `<p>Find the electric potential at a point ${cm} cm from a point charge of +${q} nC (taking V = 0 at infinity).</p>`, answer: V, unit: 'V', tol: 0.01,
        hint: 'V = kq/r, with q in coulombs and r in metres. Potential is a scalar: no direction to worry about.',
        solution: steps(`V = kq/r = 9×10⁹ × ${q}×10<sup>−9</sup> ÷ ${cm / 100}.`, `V = <b>${n(V)} V</b>.`) };
    },
    verify: (x) => (x.q_ * 1e-9) / (4 * Math.PI * E0 * (x.cm / 100)),
  },
  'c12p-cap-uniform': {
    title: 'potential difference in a uniform field',
    make(r) {
      const E = pick(r, 100, 900, 100), cm = pick(r, 2, 20, 2), V = E * cm / 100;
      return { E, cm, q: `<p>Between two parallel plates the field is uniform and equal to ${E} V/m. What is the potential difference between two points ${cm} cm apart along the field?</p>`, answer: V, unit: 'V', tol: 0.01,
        hint: 'In a uniform field ΔV = E d, with d in metres measured along the field.',
        solution: steps(`d = ${cm} cm = ${cm / 100} m.`, `ΔV = E d = ${E} × ${cm / 100} = <b>${n(V)} V</b>.`) };
    },
    verify: (x) => (x.E * x.cm) / 100,
  },
  'c12p-cap-pairenergy': {
    title: 'potential energy of two charges',
    make(r) {
      const a = pick(r, 1, 8, 1), b = pick(r, 1, 8, 1), cm = choose(r, [10, 20, 30, 50]), U = (K * a * 1e-6 * b * 1e-6) / (cm / 100);
      return { a, b, cm, q: `<p>How much work is needed to bring a ${a} µC charge from far away to a point ${cm} cm from a fixed ${b} µC charge (both positive)?</p>`, answer: U, unit: 'J', tol: 0.01,
        hint: 'The work equals the potential energy of the pair, U = kq₁q₂/r.',
        solution: steps(`W = U = kq₁q₂/r = 9×10⁹ × ${a}×10<sup>−6</sup> × ${b}×10<sup>−6</sup> ÷ ${cm / 100}.`, `W = <b>${n(U)} J</b>.`) };
    },
    verify: (x) => x.b * 1e-6 * (x.a * 1e-6 * 8.9875e9 / (x.cm / 100)),
  },
  'c12p-cap-dipolev': {
    title: 'potential of a short dipole',
    make(r) {
      const q = pick(r, 1, 9, 1), d = choose(r, [1, 2]), rr = choose(r, [50, 80, 100]), th = choose(r, [0, 30, 60]), p = q * 1e-9 * d / 100, V = (K * p * Math.cos(th * Math.PI / 180)) / (rr / 100) ** 2;
      return { q_: q, d, rr, th, q: `<p>A dipole has charges ±${q} nC ${d} cm apart. Find the potential at ${rr} cm from its centre, at ${th}° to the axis on the positive side (far-field formula).</p>`, answer: V, unit: 'V', tol: 0.01,
        hint: 'p = q × separation; then V = k p cos θ / r².',
        solution: steps(`p = ${q}×10<sup>−9</sup> × ${d / 100} = ${sci(p)} C m.`, `V = kp cos θ / r² = 9×10⁹ × ${sci(p)} × cos ${th}° ÷ (${rr / 100})² = <b>${n(V)} V</b>.`) };
    },
    verify: (x) => { const a = x.d / 200, R = x.rr / 100, t = (x.th * Math.PI) / 180, q = x.q_ * 1e-9; return K * q * (1 / Math.sqrt(R * R + a * a - 2 * a * R * Math.cos(t)) - 1 / Math.sqrt(R * R + a * a + 2 * a * R * Math.cos(t))); },
  },
  'c12p-cap-plates': {
    title: 'capacitance of a parallel-plate capacitor',
    make(r) {
      const A = pick(r, 100, 1000, 100), d = pick(r, 1, 5, 0.5), C = E0 * A * 1e-4 / (d * 1e-3);
      return { A, d, q: `<p>A parallel-plate capacitor has plates of area ${A} cm² separated by ${d} mm of air. Find its capacitance in picofarads (1 pF = 10<sup>−12</sup> F).</p>`, answer: C * 1e12, unit: 'pF', tol: 0.01,
        hint: 'C = ε₀A/d, with A in m² (1 cm² = 10⁻⁴ m²) and d in m. ε₀ = 8.854 × 10⁻¹² F/m.',
        solution: steps(`A = ${A}×10<sup>−4</sup> m², d = ${d}×10<sup>−3</sup> m.`, `C = ε₀A/d = 8.854×10<sup>−12</sup> × ${A}×10<sup>−4</sup> ÷ ${d}×10<sup>−3</sup> = <b>${n(C * 1e12)} pF</b>.`) };
    },
    verify: (x) => ((x.A * 1e-4) / (4 * Math.PI * 8.9875e9 * x.d * 1e-3)) * 1e12,
  },
  'c12p-cap-combo': {
    title: 'two capacitors in series or parallel',
    make(r) {
      const a = pick(r, 1, 9, 1), b = pick(r, 1, 9, 1), mode = choose(r, ['series', 'parallel']), C = mode === 'series' ? (a * b) / (a + b) : a + b;
      return { a, b, mode, q: `<p>Capacitors of ${a} µF and ${b} µF are joined in ${mode}. What is the equivalent capacitance in µF?</p>`, answer: C, unit: 'µF', tol: 0.01,
        hint: mode === 'series' ? 'In series 1/C = 1/C₁ + 1/C₂, which is C = C₁C₂/(C₁ + C₂).' : 'In parallel the capacitances add: C = C₁ + C₂.',
        solution: mode === 'series' ? steps(`1/C = 1/${a} + 1/${b}.`, `C = ${a}×${b} ÷ ${a + b} = <b>${n(C)} µF</b>.`) : steps(`C = ${a} + ${b} = <b>${a + b} µF</b>.`) };
    },
    verify: (x) => (x.mode === 'series' ? 1 / (1 / x.a + 1 / x.b) : x.a + x.b),
  },
  'c12p-cap-energy': {
    title: 'energy stored in a capacitor',
    make(r) {
      const C = pick(r, 2, 50, 2), V = pick(r, 3, 24, 3), U = 0.5 * C * 1e-6 * V * V;
      return { C, V, q: `<p>A ${C} µF capacitor is charged to ${V} V. How much energy does it store? Give the answer in millijoules (mJ).</p>`, answer: U * 1e3, unit: 'mJ', tol: 0.01,
        hint: 'U = ½CV², with C in farads.',
        solution: steps(`U = ½ C V² = 0.5 × ${C}×10<sup>−6</sup> × ${V}².`, `U = ${sci(U)} J = <b>${n(U * 1e3)} mJ</b>.`) };
    },
    verify: (x) => { const Q = x.C * 1e-6 * x.V; return (Q * Q) / (2 * x.C * 1e-6) * 1e3; },
  },
  'c12p-cap-dielectric': {
    title: 'a dielectric slab in an isolated capacitor',
    make(r) {
      const V0 = pick(r, 20, 200, 20), k = choose(r, [2, 4, 5, 6, 10]);
      return { V0, k, q: `<p>A parallel-plate capacitor is charged to ${V0} V and disconnected from the battery. A dielectric slab of constant ${k} is then slid in to fill the gap. What is the voltage across the capacitor now?</p>`, answer: V0 / k, unit: 'V', tol: 0.01,
        hint: 'Disconnected means the charge Q stays fixed. C becomes κC, so V = Q/C falls by the factor κ.',
        solution: steps('Q is unchanged and C → κC.', `V = Q/(κC) = V₀/κ = ${V0}/${k} = <b>${n(V0 / k)} V</b>.`) };
    },
    verify: (x) => { const C0 = 1e-9, Q = C0 * x.V0; return Q / (x.k * C0); },
  },
  'c12p-cap-share': {
    title: 'two charged capacitors joined together',
    make(r) {
      const C1 = pick(r, 2, 10, 2), V1 = pick(r, 20, 100, 20), C2 = pick(r, 2, 10, 2), V2 = choose(r, [0, 10, 20]), V = (C1 * V1 + C2 * V2) / (C1 + C2);
      return { C1, V1, C2, V2, q: `<p>A ${C1} µF capacitor charged to ${V1} V is connected, positive plate to positive plate, to a ${C2} µF capacitor charged to ${V2} V. What is the common voltage?</p>`, answer: V, unit: 'V', tol: 0.01,
        hint: 'Total charge is conserved and both end at the same V: V = (C₁V₁ + C₂V₂)/(C₁ + C₂).',
        solution: steps(`Charges: Q₁ = ${C1}×${V1} = ${C1 * V1} µC, Q₂ = ${C2}×${V2} = ${C2 * V2} µC; total ${C1 * V1 + C2 * V2} µC.`, `Total capacitance (parallel) = ${C1 + C2} µF, so V = ${C1 * V1 + C2 * V2} ÷ ${C1 + C2} = <b>${n(V)} V</b>.`) };
    },
    verify: (x) => (x.C1 * x.V1 + x.C2 * x.V2) / (x.C1 + x.C2),
  },
};
