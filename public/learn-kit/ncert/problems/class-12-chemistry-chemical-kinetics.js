// Class 12 Chemistry, Chapter 3 Chemical Kinetics: live problems (original fibub questions). Ids start with c12c-kin-.
import { pick, choose, n, steps } from './_util.js';

export default {
  'c12c-kin-first': {
    title: 'rate constant of a first order reaction',
    make(r) {
      const A0 = choose(r, [0.8, 1.0, 1.2, 2.0]), f = choose(r, [0.5, 0.4, 0.25, 0.1]), t = choose(r, [10, 20, 30, 50]), A = A0 * f, k = (2.303 / t) * Math.log10(A0 / A);
      return { A0, A, t, q: `<p>In a first order reaction the concentration of the reactant falls from ${A0} mol/L to ${+A.toFixed(3)} mol/L in ${t} minutes. Find the rate constant in min⁻¹.</p>`, answer: k, unit: 'min⁻¹', tol: 0.01,
        hint: 'k = (2.303/t) log([R]₀/[R]).',
        solution: steps(`[R]₀/[R] = ${A0}/${+A.toFixed(3)} = ${n(A0 / A)}.`, `k = (2.303/${t}) × log ${n(A0 / A)} = <b>${n(k, 3)} min⁻¹</b>.`) };
    },
    verify: (x) => Math.log(x.A0 / x.A) / x.t,
  },
  'c12c-kin-halflife': {
    title: 'time for a first order reaction to reach a stage',
    make(r) {
      const th = choose(r, [10, 20, 30, 40, 60]), nh = choose(r, [2, 3, 4]), pct = (1 - Math.pow(0.5, nh)) * 100;
      return { th, nh, pct, q: `<p>The half-life of a first order reaction is ${th} minutes. How long does it take for ${pct}% of the reactant to react?</p>`, answer: th * nh, unit: 'min', tol: 0.01,
        hint: 'After each half-life, half of what is left reacts. How many half-lives give this percentage?',
        solution: steps(`${pct}% reacted means ${100 - pct}% is left = (1/2)<sup>${nh}</sup>.`, `So ${nh} half-lives are needed: ${nh} × ${th} = <b>${th * nh} min</b>.`) };
    },
    verify: (x) => { const k = Math.LN2 / x.th, left = 1 - x.pct / 100; return Math.log(1 / left) / k; },
  },
  'c12c-kin-order': {
    title: 'order from change in initial rate',
    make(r) {
      const x = choose(r, [0, 1, 2, 3]), f = choose(r, [2, 3]), r1 = choose(r, [2, 3, 4, 5]), r2 = r1 * Math.pow(f, x);
      return { x, f, r1, r2, q: `<p>When the concentration of A is multiplied by ${f} (other concentrations fixed) the initial rate of a reaction goes from ${r1} × 10<sup>−3</sup> to ${r2} × 10<sup>−3</sup> mol L⁻¹ s⁻¹. What is the order of the reaction with respect to A?</p>`, answer: x, unit: '', tol: 0, abs: 0.05,
        hint: 'rate₂/rate₁ = (conc ratio)<sup>order</sup>.',
        solution: steps(`rate₂/rate₁ = ${n(r2)}/${r1} = ${n(r2 / r1)}.`, `${f}<sup>x</sup> = ${n(r2 / r1)}, so the order x = <b>${x}</b>.`) };
    },
    verify: (x) => Math.log(x.r2 / x.r1) / Math.log(x.f),
  },
  'c12c-kin-ea': {
    title: 'activation energy from two temperatures',
    make(r) {
      const T1 = choose(r, [290, 300, 310]), dT = choose(r, [10, 20]), T2 = T1 + dT, ratio = choose(r, [2, 3, 4]), Ea = 2.303 * 8.314 * Math.log10(ratio) * T1 * T2 / dT / 1000;
      return { T1, T2, ratio, q: `<p>The rate constant of a reaction becomes ${ratio} times larger when the temperature is raised from ${T1} K to ${T2} K. Find the activation energy in kJ/mol (R = 8.314 J K⁻¹ mol⁻¹).</p>`, answer: Ea, unit: 'kJ/mol', tol: 0.015,
        hint: 'log(k₂/k₁) = Ea (T₂ − T₁) / (2.303 R T₁ T₂).',
        solution: steps(`log ${ratio} = ${n(Math.log10(ratio), 4)}.`, `Ea = 2.303 × 8.314 × ${n(Math.log10(ratio), 4)} × (${T1} × ${T2}) / ${T2 - T1} = ${n(Ea * 1000)} J/mol = <b>${n(Ea)} kJ/mol</b>.`) };
    },
    verify: (x) => { const slope = Math.log(x.ratio) / (1 / x.T1 - 1 / x.T2); return slope * 8.314 / 1000; },
  },
  'c12c-kin-zero': {
    title: 'a zero order reaction',
    make(r) {
      const A0 = choose(r, [0.5, 0.8, 1.0, 1.2]), k = choose(r, [0.01, 0.02, 0.025, 0.04]), t = choose(r, [5, 10, 15].filter((x) => k * x < A0)), A = A0 - k * t;
      return { A0, k, t, q: `<p>A zero order reaction has k = ${k} mol L⁻¹ s⁻¹ and starts with [R]₀ = ${A0} mol/L. What is the concentration after ${t} s?</p>`, answer: A, unit: 'mol/L', tol: 0.01,
        hint: '[R] = [R]₀ − kt for zero order.',
        solution: steps(`[R] = ${A0} − ${k} × ${t} = ${A0} − ${+(k * t).toFixed(3)} = <b>${n(A)} mol/L</b>.`) };
    },
    verify: (x) => { const consumed = x.k * x.t; return x.A0 - consumed; },
  },
  'c12c-kin-arrh': {
    title: 'rate constant from the Arrhenius equation',
    make(r) {
      const Ea = choose(r, [50, 60, 75, 90]), T = choose(r, [300, 320, 350]), k = 1e12 * Math.exp(-Ea * 1000 / (8.314 * T));
      return { Ea, T, q: `<p>For a reaction A = 1.0 × 10<sup>12</sup> s⁻¹ and Ea = ${Ea} kJ/mol. Find k at ${T} K in s⁻¹ (R = 8.314 J K⁻¹ mol⁻¹). Give the answer in units of 10<sup>−3</sup> s⁻¹.</p>`, answer: k * 1000, unit: '× 10⁻³ s⁻¹', tol: 0.02,
        hint: 'k = A e<sup>−Ea/RT</sup>; remember to convert Ea to J.',
        solution: steps(`Ea/RT = ${Ea * 1000} / (8.314 × ${T}) = ${n(Ea * 1000 / (8.314 * T), 4)}.`, `k = 10<sup>12</sup> × e<sup>−${n(Ea * 1000 / (8.314 * T), 4)}</sup> = ${n(k, 3)} s⁻¹ = <b>${n(k * 1000)} × 10⁻³ s⁻¹</b>.`) };
    },
    verify: (x) => { const lnk = Math.log(1e12) - x.Ea * 1000 / (8.314 * x.T); return Math.exp(lnk) * 1000; },
  },
  'c12c-kin-stoich': {
    title: 'rates of disappearance and formation',
    make(r) {
      const v = choose(r, [2, 4, 6, 8]), rate = v / 4;
      return { v, q: `<p>For 2N₂O₅ → 4NO₂ + O₂, NO₂ is formed at ${v} × 10<sup>−3</sup> mol L⁻¹ s⁻¹. At what rate (in 10<sup>−3</sup> mol L⁻¹ s⁻¹) does N₂O₅ disappear?</p>`, answer: v / 2, unit: '× 10⁻³ mol L⁻¹ s⁻¹', tol: 0.01,
        hint: 'Rate of reaction = −½ d[N₂O₅]/dt = ¼ d[NO₂]/dt.',
        solution: steps(`Rate of reaction = ¼ × ${v} = ${rate} × 10⁻³.`, `−d[N₂O₅]/dt = 2 × rate = 2 × ${rate} = <b>${v / 2} × 10⁻³ mol L⁻¹ s⁻¹</b>.`) };
    },
    verify: (x) => x.v * (2 / 4),
  },
};
