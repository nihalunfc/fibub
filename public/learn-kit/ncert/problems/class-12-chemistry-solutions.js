// Class 12 Chemistry, Chapter 1 Solutions: live problems (original fibub questions). Ids start with c12c-sol-.
import { pick, choose, n, steps } from './_util.js';

const SOLUTES = [['glucose', 180], ['urea', 60], ['sucrose', 342], ['NaCl', 58.5], ['ethylene glycol', 62]];
export default {
  'c12c-sol-molality': {
    title: 'molality of a solution',
    make(r) {
      const s = choose(r, SOLUTES.slice(0, 3)), w2 = pick(r, 5, 40, 5), w1 = choose(r, [100, 200, 250, 500]), m = (w2 / s[1]) / (w1 / 1000);
      return { s, w2, w1, q: `<p>${w2} g of ${s[0]} (molar mass ${s[1]} g/mol) is dissolved in ${w1} g of water. What is the molality of the solution?</p>`, answer: m, unit: 'mol/kg', tol: 0.01,
        hint: 'Molality = moles of solute ÷ kilograms of SOLVENT (not of solution).',
        solution: steps(`Moles of solute = ${w2} / ${s[1]} = ${n(w2 / s[1])} mol.`, `Mass of solvent = ${w1} g = ${w1 / 1000} kg.`, `m = ${n(w2 / s[1])} / ${w1 / 1000} = <b>${n(m)} mol/kg</b>.`) };
    },
    verify: (x) => 1000 * (x.w2 / x.s[1]) / x.w1,
  },
  'c12c-sol-molarity': {
    title: 'molarity from mass percent and density',
    make(r) {
      const w = choose(r, [10, 20, 30, 36, 37, 40]), d = choose(r, [1.05, 1.1, 1.15, 1.2, 1.25]), M = choose(r, [36.5, 40, 58.5]), mol = w * d * 10 / M;
      return { w, d, M, q: `<p>A solution of a compound (molar mass ${M} g/mol) is ${w} % by mass and its density is ${d} g/mL. Find its molarity.</p>`, answer: mol, unit: 'mol/L', tol: 0.01,
        hint: 'Take 100 g of solution: mass of solute = w g; volume = 100/d mL. Molarity = moles ÷ litres of solution.',
        solution: steps(`In 100 g of solution there are ${w} g of solute = ${n(w / M)} mol.`, `Volume = 100 / ${d} = ${n(100 / d)} mL = ${n(100 / d / 1000)} L.`, `M = ${n(w / M)} / ${n(100 / d / 1000)} = <b>${n(mol)} mol/L</b>.`) };
    },
    verify: (x) => (x.w / x.M) / (100 / x.d / 1000),
  },
  'c12c-sol-henry': {
    title: "Henry's law: gas dissolved in water",
    make(r) {
      const p = choose(r, [2, 3, 4, 5, 6, 8, 10]), KH = 1670, x = p / KH;
      return { p, KH, q: `<p>The Henry's law constant of CO₂ in water at 298 K is ${KH} bar. What is the mole fraction of CO₂ dissolved when CO₂ is kept at a pressure of ${p} bar above water? Give the answer in units of 10<sup>−3</sup>.</p>`, answer: x * 1000, unit: '× 10⁻³', tol: 0.01,
        hint: "Henry's law: x = p / K_H.",
        solution: steps(`x = p / K<sub>H</sub> = ${p} / ${KH}.`, `x = ${n(x, 3)} = <b>${n(x * 1000)} × 10⁻³</b>.`) };
    },
    verify: (x) => { const x1 = 1 / x.KH; return 1000 * x1 * x.p; },
  },
  'c12c-sol-raoult': {
    title: 'vapour pressure of a solution',
    make(r) {
      const w2 = choose(r, [9, 18, 36, 54, 90]), w1 = choose(r, [90, 180, 360]), p0 = choose(r, [23.8, 31.8, 47.1]), p = p0 * (w1 / 18) / (w1 / 18 + w2 / 180);
      return { w2, w1, p0, q: `<p>${w2} g of glucose (180 g/mol, non-volatile) is dissolved in ${w1} g of water (18 g/mol). The vapour pressure of pure water at this temperature is ${p0} mmHg. Find the vapour pressure of the solution in mmHg.</p>`, answer: p, unit: 'mmHg', tol: 0.01,
        hint: 'Raoult: p = x(solvent) × p°. x(solvent) = n₁ / (n₁ + n₂).',
        solution: steps(`n₁ (water) = ${w1}/18 = ${n(w1 / 18)} mol; n₂ (glucose) = ${w2}/180 = ${n(w2 / 180)} mol.`, `x₁ = ${n(w1 / 18)} / ${n(w1 / 18 + w2 / 180)} = ${n(w1 / 18 / (w1 / 18 + w2 / 180), 4)}.`, `p = x₁ p° = <b>${n(p)} mmHg</b>.`) };
    },
    verify: (x) => { const x2 = (x.w2 / 180) / (x.w1 / 18 + x.w2 / 180); return x.p0 - x.p0 * x2; },
  },
  'c12c-sol-bp': {
    title: 'elevation of boiling point',
    make(r) {
      const s = choose(r, SOLUTES.slice(0, 3)), w2 = pick(r, 6, 60, 6), w1 = choose(r, [100, 200, 500]), dT = 0.52 * (w2 / s[1]) / (w1 / 1000);
      return { s, w2, w1, q: `<p>${w2} g of ${s[0]} (${s[1]} g/mol) is dissolved in ${w1} g of water. Taking K<sub>b</sub> for water as 0.52 K kg/mol, find the rise in boiling point of the solution.</p>`, answer: dT, unit: 'K', tol: 0.015,
        hint: 'ΔT<sub>b</sub> = K<sub>b</sub> m, with m the molality.',
        solution: steps(`m = (${w2}/${s[1]}) / ${w1 / 1000} = ${n(w2 / s[1] / (w1 / 1000))} mol/kg.`, `ΔT<sub>b</sub> = 0.52 × ${n(w2 / s[1] / (w1 / 1000))} = <b>${n(dT)} K</b>.`) };
    },
    verify: (x) => 0.52 * 1000 * x.w2 / (x.s[1] * x.w1),
  },
  'c12c-sol-molmass': {
    title: 'molar mass from depression of freezing point',
    make(r) {
      const M0 = choose(r, [60, 90, 120, 150, 180, 342]), w2 = choose(r, [1.5, 2, 2.5, 3, 4, 5]), w1 = choose(r, [50, 100, 150]), dT = +(5.12 * (w2 / M0) / (w1 / 1000)).toFixed(2), M = 5.12 * w2 * 1000 / (dT * w1);
      return { w2, w1, dT, q: `<p>${w2} g of a non-electrolyte dissolved in ${w1} g of benzene lowers the freezing point of benzene by ${dT} K. K<sub>f</sub> of benzene is 5.12 K kg/mol. Find the molar mass of the solute.</p>`, answer: M, unit: 'g/mol', tol: 0.015,
        hint: 'm = ΔT<sub>f</sub>/K<sub>f</sub>; moles = m × kg of solvent; M = mass ÷ moles.',
        solution: steps(`m = ${dT}/5.12 = ${n(dT / 5.12, 4)} mol/kg.`, `Moles = ${n(dT / 5.12, 4)} × ${w1 / 1000} kg = ${n(dT / 5.12 * w1 / 1000, 4)} mol.`, `M = ${w2} g / ${n(dT / 5.12 * w1 / 1000, 4)} mol = <b>${n(M)} g/mol</b>.`) };
    },
    verify: (x) => { const mol = (x.dT / 5.12) * (x.w1 / 1000); return x.w2 / mol; },
  },
  'c12c-sol-osmotic': {
    title: 'osmotic pressure',
    make(r) {
      const w = choose(r, [1, 2, 3, 5, 9]), M = choose(r, [180, 342, 60, 90]), V = choose(r, [0.1, 0.25, 0.5, 1]), T = choose(r, [283, 293, 298, 310]), pi = (w / M) / V * 0.0821 * T;
      return { w, M, V, T, q: `<p>${w} g of a non-electrolyte (molar mass ${M} g/mol) is dissolved in water to make ${V} L of solution at ${T} K. Find the osmotic pressure in atm (R = 0.0821 L atm K⁻¹ mol⁻¹).</p>`, answer: pi, unit: 'atm', tol: 0.01,
        hint: 'π = C R T with C in mol/L.',
        solution: steps(`C = (${w}/${M}) / ${V} = ${n(w / M / V, 4)} mol/L.`, `π = CRT = ${n(w / M / V, 4)} × 0.0821 × ${T} = <b>${n(pi)} atm</b>.`) };
    },
    verify: (x) => ((x.w / x.M) * 8.314 * x.T / (x.V / 1000)) / 101325,
  },
  'c12c-sol-ivant': {
    title: "colligative effect with the van't Hoff factor",
    make(r) {
      const sol = choose(r, [['NaCl', 58.5, 2], ['CaCl₂', 111, 3], ['K₂SO₄', 174, 3]]), w2 = choose(r, [5.85, 11.1, 17.4, 29.25]), w1 = 500, dT = sol[2] * 1.86 * (w2 / sol[1]) / (w1 / 1000);
      return { sol, w2, w1, q: `<p>${w2} g of ${sol[0]} (${sol[1]} g/mol) is dissolved in ${w1} g of water. Assuming complete dissociation into ${sol[2]} ions, find the depression of freezing point. K<sub>f</sub> (water) = 1.86 K kg/mol.</p>`, answer: dT, unit: 'K', tol: 0.015,
        hint: 'ΔT<sub>f</sub> = i K<sub>f</sub> m, with i = the number of ions.',
        solution: steps(`m = (${w2}/${sol[1]}) / ${w1 / 1000} = ${n(w2 / sol[1] / (w1 / 1000), 4)} mol/kg.`, `ΔT<sub>f</sub> = ${sol[2]} × 1.86 × ${n(w2 / sol[1] / (w1 / 1000), 4)} = <b>${n(dT)} K</b>.`) };
    },
    verify: (x) => { const molsParticles = (x.w2 / x.sol[1]) * x.sol[2]; return 1.86 * molsParticles / (x.w1 / 1000); },
  },
};
