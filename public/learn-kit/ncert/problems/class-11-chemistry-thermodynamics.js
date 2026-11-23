// Class 11 Chemistry, Chapter 5 Thermodynamics: live problems (original fibub questions). Ids start with c11c-thermo-.
import { pick, choose, n, steps } from './_util.js';

const R = 8.314;
// reactions: [text, [[coefficient (+ product, - reactant), dHf kJ/mol, species]]]
const RXN = [
  ['CH₄(g) + 2 O₂(g) → CO₂(g) + 2 H₂O(l)', [[-1, -74.8, 'CH₄'], [-2, 0, 'O₂'], [1, -393.5, 'CO₂'], [2, -285.8, 'H₂O(l)']]],
  ['C₂H₄(g) + H₂(g) → C₂H₆(g)', [[-1, 52.3, 'C₂H₄'], [-1, 0, 'H₂'], [1, -84.7, 'C₂H₆']]],
  ['2 H₂S(g) + 3 O₂(g) → 2 SO₂(g) + 2 H₂O(l)', [[-2, -20.6, 'H₂S'], [-3, 0, 'O₂'], [2, -296.8, 'SO₂'], [2, -285.8, 'H₂O(l)']]],
  ['CaCO₃(s) → CaO(s) + CO₂(g)', [[-1, -1206.9, 'CaCO₃'], [1, -635.1, 'CaO'], [1, -393.5, 'CO₂']]],
  ['4 NH₃(g) + 5 O₂(g) → 4 NO(g) + 6 H₂O(g)', [[-4, -45.9, 'NH₃'], [-5, 0, 'O₂'], [4, 91.3, 'NO'], [6, -241.8, 'H₂O(g)']]],
];
export default {
  'c11c-thermo-firstlaw': {
    title: 'first law: change in internal energy',
    make(r) {
      const q = pick(r, 40, 300, 20), w = pick(r, 10, 200, 10), absorb = choose(r, [true, false]), onGas = choose(r, [true, false]);
      const dU = (absorb ? q : -q) + (onGas ? w : -w);
      return { h: q, w, absorb, onGas, q: `<p>A gas ${absorb ? 'absorbs' : 'gives out'} ${q} J of heat while ${w} J of work is done ${onGas ? 'on' : 'by'} the gas. Find the change in internal energy ΔU in joules (use the sign convention ΔU = q + w, work on the system +).</p>`, answer: dU, unit: 'J', abs: 0.01, tol: 0.01,
        hint: 'Heat absorbed by the system is +, heat given out is −. Work done ON the system is +, work done BY it is −.',
        solution: steps(`q = ${absorb ? '+' : '−'}${q} J.`, `w = ${onGas ? '+' : '−'}${w} J.`, `ΔU = q + w = <b>${dU} J</b>.`) };
    },
    verify: (x) => (x.absorb ? 1 : -1) * x.h + (x.onGas ? 1 : -1) * x.w,
  },
  'c11c-thermo-dhf': {
    title: 'enthalpy of reaction from enthalpies of formation',
    make(r) {
      const [t, sp] = choose(r, RXN), tot = sp.reduce((a, s) => a + (s[0] > 0 ? s[0] * s[1] : 0), 0) - sp.reduce((a, s) => a + (s[0] < 0 ? -s[0] * s[1] : 0), 0);
      return { t, sp, q: `<p>Using the standard enthalpies of formation in kJ/mol (${sp.filter((s) => s[1] !== 0).map((s) => `${s[2]}: ${s[1]}`).join('; ')}; elements in their standard state: 0), find ΔH° in kJ for:</p><p>${t}</p>`, answer: tot, unit: 'kJ', tol: 0.01,
        hint: 'ΔH° = Σ (coefficient × ΔHf) of products − Σ (coefficient × ΔHf) of reactants.',
        solution: steps(`Products: ${sp.filter((s) => s[0] > 0).map((s) => `${s[0]} × (${s[1]})`).join(' + ')} = ${n(sp.filter((s) => s[0] > 0).reduce((a, s) => a + s[0] * s[1], 0))}.`, `Reactants: ${sp.filter((s) => s[0] < 0).map((s) => `${-s[0]} × (${s[1]})`).join(' + ')} = ${n(sp.filter((s) => s[0] < 0).reduce((a, s) => a - s[0] * s[1], 0))}.`, `ΔH° = ${n(sp.filter((s) => s[0] > 0).reduce((a, s) => a + s[0] * s[1], 0))} − (${n(sp.filter((s) => s[0] < 0).reduce((a, s) => a - s[0] * s[1], 0))}) = <b>${n(tot)} kJ</b>.`) };
    },
    verify: (x) => x.sp.reduce((a, s) => a + s[0] * s[1], 0),
  },
  'c11c-thermo-hess': {
    title: "Hess's law with two known steps",
    make(r) {
      const a = choose(r, [-393.5, -395.4, -394.0]), b = choose(r, [-283.0, -282.0, -284.5, -285.0]);
      return { a, b, q: `<p>Given: (1) C(graphite) + O₂(g) → CO₂(g), ΔH = ${a} kJ; (2) CO(g) + ½O₂(g) → CO₂(g), ΔH = ${b} kJ. Find ΔH in kJ for C(graphite) + ½O₂(g) → CO(g).</p>`, answer: a - b, unit: 'kJ', tol: 0.01,
        hint: 'Reverse equation (2) (change the sign of its ΔH) and add it to equation (1).',
        solution: steps(`Equation (1): C + O₂ → CO₂, ΔH = ${a}.`, `Reverse (2): CO₂ → CO + ½O₂, ΔH = ${-b}.`, `Add: C + ½O₂ → CO, ΔH = ${a} + (${-b}) = <b>${n(a - b)} kJ</b>.`) };
    },
    verify: (x) => -(x.b) + x.a,
  },
  'c11c-thermo-dhdu': {
    title: 'ΔH and ΔU for a reaction with gases',
    make(r) {
      const rx = choose(r, [['N₂(g) + 3 H₂(g) → 2 NH₃(g)', -2], ['2 SO₂(g) + O₂(g) → 2 SO₃(g)', -1], ['PCl₅(g) → PCl₃(g) + Cl₂(g)', 1], ['C(s) + O₂(g) → CO₂(g)', 0], ['2 H₂O(l) → 2 H₂(g) + O₂(g)', 3]]), dU = pick(r, -200, 200, 10), T = choose(r, [298, 300, 400, 500]);
      return { rx, dU, T, q: `<p>For the reaction ${rx[0]} at ${T} K, ΔU = ${dU} kJ. Find ΔH in kJ. (R = 8.314 J/(K mol); ΔH = ΔU + Δn(g) RT)</p>`, answer: dU + rx[1] * R * T / 1000, unit: 'kJ', tol: 0.01, abs: 0.05,
        hint: 'Δn(g) = moles of gaseous products − moles of gaseous reactants.',
        solution: steps(`Δn(g) = ${rx[1]}.`, `Δn RT = ${rx[1]} × 8.314 × ${T} / 1000 = ${n(rx[1] * R * T / 1000)} kJ.`, `ΔH = ${dU} + (${n(rx[1] * R * T / 1000)}) = <b>${n(dU + rx[1] * R * T / 1000)} kJ</b>.`) };
    },
    verify: (x) => x.dU + x.rx[1] * 8.314 * x.T * 1e-3,
  },
  'c11c-thermo-gibbsT': {
    title: 'temperature at which a reaction becomes spontaneous',
    make(r) {
      const H = choose(r, [30, 55, 91, 120, 178]), S = choose(r, [80, 110, 135, 161, 200]);
      return { H, S, q: `<p>For a reaction, ΔH = +${H} kJ/mol and ΔS = +${S} J/(K mol), both taken as independent of temperature. Above what temperature (in kelvin) does the reaction become spontaneous?</p>`, answer: 1000 * H / S, unit: 'K', tol: 0.01,
        hint: 'Spontaneous when ΔG = ΔH − TΔS < 0. The changeover is where ΔG = 0, so T = ΔH/ΔS (watch kJ and J).',
        solution: steps(`Set ΔG = 0: T = ΔH / ΔS.`, `ΔS = ${S} J = ${S / 1000} kJ per K.`, `T = ${H} / ${S / 1000} = <b>${n(1000 * H / S)} K</b>.`) };
    },
    verify: (x) => (x.H * 1000) / x.S,
  },
  'c11c-thermo-gk': {
    title: 'equilibrium constant from ΔG°',
    make(r) {
      const g = choose(r, [-34.2, -22.8, -11.4, -5.7, 5.7, 11.4, 17.1, 22.8]);
      return { g, q: `<p>At 298 K the standard Gibbs energy change of a reaction is ΔG° = ${g} kJ/mol. Find log₁₀K. (R = 8.314 J/(K mol), ΔG° = −2.303 RT log K)</p>`, answer: -g * 1000 / (2.303 * R * 298), unit: '', tol: 0.015, abs: 0.02,
        hint: 'log K = −ΔG° / (2.303 RT). Convert kJ to J.',
        solution: steps(`2.303 RT = 2.303 × 8.314 × 298 = ${n(2.303 * R * 298)} J/mol.`, `log K = −(${g} × 1000) / ${n(2.303 * R * 298)} = <b>${n(-g * 1000 / (2.303 * R * 298))}</b>.`, `So K = ${n(Math.pow(10, -g * 1000 / (2.303 * R * 298)))}.`) };
    },
    verify: (x) => Math.log10(Math.exp(-x.g * 1000 / (R * 298))),
  },
  'c11c-thermo-calorimeter': {
    title: 'heat from a bomb calorimeter',
    make(r) {
      const C = choose(r, [8.0, 10.0, 12.5, 15.0]), dT = pick(r, 1.0, 4.0, 0.25), m = choose(r, [0.5, 1.0, 1.5, 2.0]), M = choose(r, [180, 342, 46, 60]);
      const per = C * dT / (m / M);
      return { C, dT, m, M, q: `<p>Burning ${m} g of a compound (molar mass ${M} g/mol) in a bomb calorimeter of heat capacity ${C} kJ/K raises the temperature by ${dT} K. Find the heat released per mole in kJ/mol (the magnitude).</p>`, answer: per, unit: 'kJ/mol', tol: 0.01,
        hint: 'Heat released = C × ΔT. Divide by the moles burned, m / M.',
        solution: steps(`q = C ΔT = ${C} × ${dT} = ${n(C * dT)} kJ.`, `Moles = ${m} / ${M} = ${n(m / M)} mol.`, `Per mole = ${n(C * dT)} / ${n(m / M)} = <b>${n(per)} kJ/mol</b>.`) };
    },
    verify: (x) => (x.C * x.dT * x.M) / x.m,
  },
};
