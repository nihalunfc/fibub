// Class 10 Science, Electricity: live problems (original fibub questions). Ids start with c10s-elec-.
import { pick, choose, n, steps } from './_util.js';

export default {
  'c10s-elec-current': {
    title: 'find a current from charge and time',
    make(r) {
      const Q = pick(r, 12, 300, 6), t = pick(r, 10, 120, 5), answer = Q / t;
      return { Q, t, q: `<p>A charge of ${Q} C flows through a torch bulb in ${t} s. What current flows through it?</p>`, answer, unit: 'A', tol: 0.01,
        hint: 'Current is charge per second: I = Q/t, with Q in coulombs and t in seconds.',
        solution: steps(`I = Q/t = ${Q} C ÷ ${t} s.`, `I = <b>${n(answer)} A</b>.`) };
    },
    verify: (x) => x.Q / x.t,
  },
  'c10s-elec-electrons': {
    title: 'count the electrons in a current',
    make(r) {
      const I = pick(r, 0.2, 2, 0.1), t = pick(r, 1, 10), answer = (I * t) / 1.6e-19;
      return { I, t, q: `<p>A current of ${n(I)} A flows for ${t} s. How many electrons pass a point in the wire? (Charge of one electron = 1.6 × 10<sup>−19</sup> C.)</p>`, answer, unit: 'electrons', tol: 0.01,
        hint: 'First find the charge Q = It. Then divide by the charge on one electron.',
        solution: steps(`Q = It = ${n(I)} × ${t} = ${n(I * t)} C.`, `Number of electrons = Q ÷ e = ${n(I * t)} ÷ (1.6 × 10<sup>−19</sup>) = <b>${n(answer)}</b>.`) };
    },
    verify: (x) => x.I * x.t * 6.25e18,
  },
  'c10s-elec-work': {
    title: 'work done moving charge through a potential difference',
    make(r) {
      const V = pick(r, 3, 24, 1.5), Q = pick(r, 2, 20), answer = V * Q;
      return { V, Q, q: `<p>How much work is done in moving ${Q} C of charge across two points with a potential difference of ${n(V)} V?</p>`, answer, unit: 'J', tol: 0.005,
        hint: 'Potential difference is work per unit charge: V = W/Q, so W = VQ.',
        solution: steps(`W = VQ = ${n(V)} V × ${Q} C.`, `W = <b>${n(answer)} J</b>.`) };
    },
    verify: (x) => x.V * x.Q,
  },
  'c10s-elec-ohm': {
    title: 'use Ohm’s law',
    make(r) {
      const R = pick(r, 4, 60, 2), V = choose(r, [1.5, 3, 4.5, 6, 9, 12, 24]), ask = choose(r, ['I', 'R']);
      const I = V / R;
      if (ask === 'I') return { V, R, ask, q: `<p>A ${R} Ω resistor is connected to a ${V} V battery. What current flows through it?</p>`, answer: I, unit: 'A', tol: 0.01,
        hint: 'Ohm’s law: V = IR, so I = V/R.', solution: steps(`I = V/R = ${V} ÷ ${R}.`, `I = <b>${n(I)} A</b>.`) };
      return { V, R, ask, q: `<p>A ${V} V supply drives a current of ${n(I, 4)} A through a heater coil. What is the resistance of the coil?</p>`, answer: R, unit: 'Ω', tol: 0.01,
        hint: 'Rearrange Ohm’s law: R = V/I.', solution: steps(`R = V/I = ${V} ÷ ${n(I, 4)}.`, `R = <b>${R} Ω</b>.`) };
    },
    verify: (x) => (x.ask === 'I' ? x.V / x.R : x.R),
  },
  'c10s-elec-resistivity': {
    title: 'resistance of a wire from its resistivity',
    make(r) {
      const rho = choose(r, [[1.62e-8, 'copper'], [2.63e-8, 'aluminium'], [1.0e-6, 'nichrome']]), L = pick(r, 0.5, 10, 0.5), dmm = pick(r, 0.2, 1.0, 0.1);
      const A = Math.PI * (dmm / 2000) ** 2, answer = (rho[0] * L) / A;
      return { rho: rho[0], L, dmm, q: `<p>A ${rho[1]} wire (resistivity ${rho[0].toExponential(2).replace(/e-(\d+)/, ' × 10<sup>−$1</sup>')} Ω m) is ${L} m long and ${dmm.toFixed(1)} mm in diameter. What is its resistance?</p>`, answer, unit: 'Ω', tol: 0.01,
        hint: 'R = ρL/A. Turn the diameter into metres and use A = πr² with r = d/2.',
        solution: steps(`r = ${dmm.toFixed(1)}/2 mm = ${n(dmm / 2000)} m, so A = π r² = ${n(A)} m².`, `R = ρL/A = ${n(rho[0])} × ${L} ÷ ${n(A)}.`, `R = <b>${n(answer)} Ω</b>.`) };
    },
    verify: (x) => (4 * x.rho * x.L) / (Math.PI * (x.dmm / 1000) ** 2),
  },
  'c10s-elec-combination': {
    title: 'total resistance in series or parallel',
    make(r) {
      const a = pick(r, 2, 30), b = pick(r, 2, 30), c = pick(r, 2, 30), how = choose(r, ['series', 'parallel', 'mixed']);
      const par = (x, y) => (x * y) / (x + y);
      const answer = how === 'series' ? a + b + c : how === 'parallel' ? 1 / (1 / a + 1 / b + 1 / c) : a + par(b, c);
      const q = how === 'mixed' ? `<p>A ${a} Ω resistor is joined in series with a pair of resistors (${b} Ω and ${c} Ω) that are in parallel with each other. What is the total resistance?</p>`
        : `<p>Resistors of ${a} Ω, ${b} Ω and ${c} Ω are joined in ${how}. What is the total resistance?</p>`;
      const sol = how === 'series' ? steps(`In series the resistances add: R = ${a} + ${b} + ${c}.`, `R = <b>${n(answer)} Ω</b>.`)
        : how === 'parallel' ? steps(`In parallel: 1/R = 1/${a} + 1/${b} + 1/${c} = ${n(1 / a + 1 / b + 1 / c)} Ω⁻¹.`, `R = 1 ÷ ${n(1 / a + 1 / b + 1 / c)} = <b>${n(answer)} Ω</b> (less than the smallest, ${Math.min(a, b, c)} Ω).`)
        : steps(`Parallel pair: R<sub>p</sub> = (${b} × ${c})/(${b} + ${c}) = ${n(par(b, c))} Ω.`, `Add the series resistor: R = ${a} + ${n(par(b, c))} = <b>${n(answer)} Ω</b>.`);
      return { a, b, c, how, q, answer, unit: 'Ω', tol: 0.01, hint: how === 'series' ? 'Series: just add.' : 'Parallel: add the reciprocals, then take the reciprocal of the sum. For two resistors, product over sum.', solution: sol };
    },
    verify: (x) => (x.how === 'series' ? x.a + x.b + x.c : x.how === 'parallel' ? (x.a * x.b * x.c) / (x.a * x.b + x.b * x.c + x.a * x.c) : x.a + 1 / (1 / x.b + 1 / x.c)),
  },
  'c10s-elec-heat': {
    title: 'heat produced in a resistor',
    make(r) {
      const I = pick(r, 0.5, 5, 0.5), R = pick(r, 5, 100, 5), t = pick(r, 10, 300, 10), answer = I * I * R * t;
      return { I, R, t, q: `<p>A current of ${n(I)} A flows through a ${R} Ω resistor for ${t} s. How much heat is produced?</p>`, answer, unit: 'J', tol: 0.005,
        hint: 'Joule’s law of heating: H = I²Rt.',
        solution: steps(`H = I²Rt = ${n(I)}² × ${R} × ${t}.`, `H = ${n(I * I)} × ${R} × ${t} = <b>${n(answer, 4)} J</b>.`) };
    },
    verify: (x) => x.I ** 2 * x.R * x.t,
  },
  'c10s-elec-bill': {
    title: 'cost of running an appliance (kWh)',
    make(r) {
      const P = choose(r, [60, 100, 750, 1000, 1500, 2000]), hrs = pick(r, 1, 8), days = choose(r, [30, 31]), rate = pick(r, 5, 9, 0.5);
      const kwh = (P / 1000) * hrs * days, answer = kwh * rate;
      return { P, hrs, days, rate, q: `<p>A ${P} W appliance runs ${hrs} h a day for ${days} days. Electricity costs ₹${rate.toFixed(2)} per unit (kWh). What does it cost?</p>`, answer, unit: '₹', tol: 0.005, abs: 0.01,
        hint: 'Energy in kWh = power in kW × hours. One “unit” is 1 kWh.',
        solution: steps(`Power = ${P} W = ${P / 1000} kW.`, `Energy = ${P / 1000} kW × ${hrs} h × ${days} = ${n(kwh, 4)} kWh.`, `Cost = ${n(kwh, 4)} × ₹${rate.toFixed(2)} = <b>₹${answer.toFixed(2)}</b>.`) };
    },
    verify: (x) => (x.P / 1000) * x.hrs * x.days * x.rate,
  },
};
