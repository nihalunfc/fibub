// Class 12 Physics, Current Electricity: live problems (original fibub questions). Ids start with c12p-curr-.
import { pick, choose, n, steps } from './_util.js';

const sci = (v, d = 3) => { const e = Math.floor(Math.log10(Math.abs(v))), m = v / 10 ** e; return `${(+m.toPrecision(d)).toString()} × 10<sup>${e < 0 ? '−' + -e : e}</sup>`; };
const NAMES = ['black', 'brown', 'red', 'orange', 'yellow', 'green', 'blue', 'violet', 'grey', 'white'];

export default {
  'c12p-curr-drift': {
    title: 'drift speed of electrons in a wire',
    make(r) {
      const I = pick(r, 1, 10, 1), mm2 = choose(r, [0.5, 1, 1.5, 2.5, 4]), nn = 8.5e28, v = I / (nn * mm2 * 1e-6 * 1.6e-19) * 1000;
      return { I, mm2, q: `<p>A copper wire of cross-section ${mm2} mm² carries ${I} A. Taking ${sci(8.5e28)} free electrons per m³ (e = 1.6 × 10<sup>−19</sup> C), find the drift speed of the electrons in mm/s.</p>`, answer: v, unit: 'mm/s', tol: 0.01,
        hint: 'I = n A e v_d, so v_d = I/(nAe). Convert mm² to m² (× 10⁻⁶).',
        solution: steps(`A = ${mm2}×10<sup>−6</sup> m².`, `v_d = I/(nAe) = ${I} ÷ (8.5×10²⁸ × ${mm2}×10<sup>−6</sup> × 1.6×10<sup>−19</sup>) = ${sci(v / 1000)} m/s.`, `That is <b>${n(v)} mm/s</b>: slower than a snail, yet the bulb lights at once.`) };
    },
    verify: (x) => { const J = x.I / (x.mm2 * 1e-6); return (J / (8.5e28 * 1.6e-19)) * 1000; },
  },
  'c12p-curr-stretch': {
    title: 'resistance of a stretched wire',
    make(r) {
      const R0 = pick(r, 2, 20, 2), f = choose(r, [2, 3, 4]), R = R0 * f * f;
      return { R0, f, q: `<p>A wire has a resistance of ${R0} Ω. It is drawn out (volume unchanged) until it is ${f} times as long. What is its new resistance?</p>`, answer: R, unit: 'Ω', tol: 0.01,
        hint: 'Volume = A L stays fixed, so if L becomes f L then A becomes A/f. R = ρL/A.',
        solution: steps(`New length ${f}L, new area A/${f}.`, `R′ = ρ(${f}L)/(A/${f}) = ${f}² R = ${f * f} × ${R0} = <b>${R} Ω</b>.`) };
    },
    verify: (x) => { const L = 1, A = 1, rho = x.R0 * A / L; return (rho * x.f * L) / (A / x.f); },
  },
  'c12p-curr-temp': {
    title: 'resistance at a different temperature',
    make(r) {
      const R0 = pick(r, 10, 100, 10), T = pick(r, 40, 300, 20), al = 0.004, R = R0 * (1 + al * (T - 20));
      return { R0, T, q: `<p>A copper coil has a resistance of ${R0} Ω at 20 °C. Find its resistance at ${T} °C. (Temperature coefficient of resistance of copper: 0.004 per °C.)</p>`, answer: R, unit: 'Ω', tol: 0.01,
        hint: 'R = R₀[1 + α(T − T₀)] with α = 0.004 /°C and T₀ = 20 °C.',
        solution: steps(`ΔT = ${T} − 20 = ${T - 20} °C.`, `R = ${R0}[1 + 0.004 × ${T - 20}] = ${R0} × ${n(1 + al * (T - 20))} = <b>${n(R)} Ω</b>.`) };
    },
    verify: (x) => x.R0 + x.R0 * 0.004 * (x.T - 20),
  },
  'c12p-curr-colour': {
    title: 'read a resistor colour code',
    make(r) {
      const a = pick(r, 1, 9, 1), b = pick(r, 0, 9, 1), m = pick(r, 0, 5, 1), R = (10 * a + b) * 10 ** m;
      return { a, b, m, q: `<p>A carbon resistor has bands ${NAMES[a]}, ${NAMES[b]}, ${NAMES[m]}, gold (digits: black 0, brown 1, red 2, orange 3, yellow 4, green 5, blue 6, violet 7, grey 8, white 9). What is its resistance in kΩ?</p>`, answer: R / 1000, unit: 'kΩ', tol: 0.01,
        hint: 'First two bands are digits, the third is the power of ten, gold is the ±5 % tolerance.',
        solution: steps(`Digits ${a} and ${b}, so ${10 * a + b}; multiplier 10<sup>${m}</sup>.`, `R = ${10 * a + b} × 10<sup>${m}</sup> Ω = ${n(R)} Ω = <b>${n(R / 1000)} kΩ</b>, ±5 %.`) };
    },
    verify: (x) => Number(`${x.a}${x.b}`) * 10 ** x.m / 1000,
  },
  'c12p-curr-terminal': {
    title: 'terminal voltage of a cell with internal resistance',
    make(r) {
      const E = choose(r, [1.5, 3, 6, 9, 12]), rr = choose(r, [0.2, 0.5, 1, 2]), R = pick(r, 2, 20, 2), I = E / (R + rr), V = E - I * rr;
      return { E, rr, R, q: `<p>A cell of emf ${E} V and internal resistance ${rr} Ω is connected to a ${R} Ω resistor. Find the terminal voltage across the resistor.</p>`, answer: V, unit: 'V', tol: 0.01,
        hint: 'Current I = E/(R + r). The terminal voltage is V = E − Ir (or IR).',
        solution: steps(`I = ${E}/(${R} + ${rr}) = ${n(I)} A.`, `V = E − Ir = ${E} − ${n(I)} × ${rr} = <b>${n(V)} V</b>.`) };
    },
    verify: (x) => (x.E * x.R) / (x.R + x.rr),
  },
  'c12p-curr-maxpower': {
    title: 'maximum power from a cell',
    make(r) {
      const E = choose(r, [6, 9, 12, 24]), rr = choose(r, [1, 2, 3, 4, 6]), P = (E * E) / (4 * rr);
      return { E, rr, q: `<p>A battery of emf ${E} V and internal resistance ${rr} Ω supplies a variable load. What is the maximum power that can be delivered to the load, in watts?</p>`, answer: P, unit: 'W', tol: 0.01,
        hint: 'The power in the load is greatest when R = r. Then I = E/2r and P = I²R.',
        solution: steps(`Maximum power when R = r = ${rr} Ω.`, `I = E/(2r) = ${E}/${2 * rr} = ${n(E / (2 * rr))} A.`, `P = I²R = <b>${n(P)} W</b>  (= E²/4r), and half the total power is wasted inside the battery.`) };
    },
    verify: (x) => { const R = x.rr, I = x.E / (R + x.rr); return I * I * R; },
  },
  'c12p-curr-cells': {
    title: 'cells in series and parallel groups',
    make(r) {
      const E = 1.5, rr = choose(r, [0.1, 0.2, 0.5]), nn = choose(r, [2, 3, 4]), mm = choose(r, [2, 3]), R = pick(r, 1, 6, 1), I = (nn * E) / (R + (nn * rr) / mm);
      return { E, rr, nn, mm, R, q: `<p>${nn * mm} identical cells, each of emf ${E} V and internal resistance ${rr} Ω, are arranged as ${mm} parallel rows of ${nn} cells in series. The group drives a ${R} Ω resistor. Find the current in the resistor.</p>`, answer: I, unit: 'A', tol: 0.01,
        hint: 'Each row has emf nE and resistance nr; ${m} rows in parallel give emf nE and resistance nr/m.'.replace('${m}', mm),
        solution: steps(`E_eq = nE = ${nn} × ${E} = ${nn * E} V, r_eq = nr/m = ${nn} × ${rr} ÷ ${mm} = ${n((nn * rr) / mm)} Ω.`, `I = E_eq/(R + r_eq) = ${nn * E} ÷ (${R} + ${n((nn * rr) / mm)}) = <b>${n(I)} A</b>.`) };
    },
    verify: (x) => { const rowR = x.nn * x.rr, rowE = x.nn * x.E, V = (x.mm * rowE / rowR) / (1 / x.R + x.mm / rowR); return V / x.R; },
  },
  'c12p-curr-kirchhoff': {
    title: 'current in the middle branch (Kirchhoff)',
    make(r) {
      const E1 = choose(r, [6, 9, 12]), E2 = choose(r, [3, 4.5, 6]), Ra = choose(r, [1, 2, 3]), Rb = choose(r, [1, 2]), Rm = choose(r, [2, 3, 4, 6]);
      const det = (Ra + Rm) * (Rb + Rm) - Rm * Rm, I1 = (E1 * (Rb + Rm) - Rm * E2) / det, I3 = ((Ra + Rm) * E2 - Rm * E1) / det, I2 = I1 + I3;
      return { E1, E2, Ra, Rb, Rm, q: `<p>Two cells (${E1} V and ${E2} V, negligible internal resistance) are joined to the same two nodes through ${Ra} Ω and ${Rb} Ω respectively, with a ${Rm} Ω resistor connected between the two nodes. Both cells push current the same way through the ${Rm} Ω resistor. Find the current in the ${Rm} Ω resistor.</p>`, answer: I2, unit: 'A', tol: 0.01,
        hint: 'Let I₁ and I₃ flow from the cells to the top node, so I₂ = I₁ + I₃ in the middle. Loop rule on each loop: E₁ = R_a I₁ + R_m I₂ and E₂ = R_b I₃ + R_m I₂.',
        solution: steps(`Junction: I₂ = I₁ + I₃.`, `Loop 1: ${E1} = ${Ra} I₁ + ${Rm}(I₁ + I₃).  Loop 2: ${E2} = ${Rb} I₃ + ${Rm}(I₁ + I₃).`, `Solving: I₁ = ${n(I1)} A, I₃ = ${n(I3)} A (negative means opposite to the arrow).`, `I₂ = I₁ + I₃ = <b>${n(I2)} A</b>.`) };
    },
    verify: (x) => { const VA = (x.E1 / x.Ra + x.E2 / x.Rb) / (1 / x.Ra + 1 / x.Rb + 1 / x.Rm); return VA / x.Rm; },
  },
  'c12p-curr-wheatstone': {
    title: 'balanced Wheatstone bridge',
    make(r) {
      const P = choose(r, [10, 20, 50, 100]), Q = choose(r, [10, 20, 40, 50]), R = pick(r, 20, 200, 20), X = (Q * R) / P;
      return { P, Q, R, q: `<p>A Wheatstone bridge has P = ${P} Ω and Q = ${Q} Ω in the two arms of the ratio, and a known resistance R = ${R} Ω. The galvanometer reads zero when the unknown resistance X is in the fourth arm (so that P/Q = R/X). Find X.</p>`, answer: X, unit: 'Ω', tol: 0.01,
        hint: 'Balance: P/Q = R/X, so X = QR/P.',
        solution: steps(`P/Q = ${P}/${Q}.`, `X = QR/P = ${Q} × ${R} ÷ ${P} = <b>${n(X)} Ω</b>.`) };
    },
    verify: (x) => x.R / (x.P / x.Q),
  },
  'c12p-curr-network': {
    title: 'current in a series-parallel network',
    make(r) {
      const R1 = choose(r, [6, 12]), R2 = choose(r, [6, 4, 12]), R3 = pick(r, 2, 8, 2), V = choose(r, [12, 24, 36]), Rt = (R1 * R2) / (R1 + R2) + R3, I = V / Rt;
      return { R1, R2, R3, V, q: `<p>Resistors of ${R1} Ω and ${R2} Ω are in parallel, and this pair is in series with a ${R3} Ω resistor across a ${V} V battery (no internal resistance). Find the total current from the battery.</p>`, answer: I, unit: 'A', tol: 0.01,
        hint: 'Combine the parallel pair first, then add the series resistor: I = V/R_total.',
        solution: steps(`Parallel pair: (${R1} × ${R2})/(${R1} + ${R2}) = ${n((R1 * R2) / (R1 + R2))} Ω.`, `Total R = ${n((R1 * R2) / (R1 + R2))} + ${R3} = ${n(Rt)} Ω.`, `I = V/R = ${V}/${n(Rt)} = <b>${n(I)} A</b>.`) };
    },
    verify: (x) => x.V / (1 / (1 / x.R1 + 1 / x.R2) + x.R3),
  },
};
