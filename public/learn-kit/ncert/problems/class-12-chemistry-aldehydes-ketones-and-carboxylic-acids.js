// Class 12 Chemistry, Chapter 8 Aldehydes, Ketones and Carboxylic Acids: live problems (original fibub questions). Ids start with c12c-carb-.
import { pick, choose, n, steps } from './_util.js';

const ACIDS = [['ethanoic acid', 60, 4.76], ['benzoic acid', 122, 4.2], ['propanoic acid', 74, 4.87], ['methanoic acid', 46, 3.75]];
export default {
  'c12c-carb-ph': {
    title: 'pH of a weak carboxylic acid',
    make(r) {
      const A = choose(r, [ACIDS[0], ACIDS[1], ACIDS[2]]), c = choose(r, [0.1, 0.05, 0.01]), Ka = Math.pow(10, -A[2]), h = (-Ka + Math.sqrt(Ka * Ka + 4 * Ka * c)) / 2, pH = -Math.log10(h);
      return { A, c, q: `<p>The pKa of ${A[0]} is ${A[2]}. Find the pH of a ${c} mol/L solution.</p>`, answer: pH, unit: '', tol: 0.01,
        hint: 'Kₐ = [H⁺]²/(c − [H⁺]). For a weak acid, [H⁺] ≈ √(Kₐ c), so pH ≈ ½(pKa − log c); a quadratic gives the exact value.',
        solution: steps(`Kₐ = 10^(−${A[2]}) = ${n(Ka)}.`, `[H⁺] ≈ √(Kₐ c) = √(${n(Ka)} × ${c}) = ${n(Math.sqrt(Ka * c))} mol/L.`, `pH = <b>${n(pH)}</b>.`) };
    },
    verify: (x) => { const Ka = Math.pow(10, -x.A[2]); let lo = -14, hi = Math.log10(x.c) - 1e-9; for (let i = 0; i < 80; i++) { const mid = (lo + hi) / 2, h = Math.pow(10, mid); (h * h / (x.c - h) > Ka) ? (hi = mid) : (lo = mid); } return -(lo + hi) / 2; },
  },
  'c12c-carb-titre': {
    title: 'volume of NaOH to neutralise an acid',
    make(r) {
      const A = choose(r, ACIDS), m = pick(r, 0.3, 3, 0.3), M = choose(r, [0.1, 0.2, 0.5]), V = m / A[1] / M * 1000;
      return { A, m, M, q: `<p>${m} g of ${A[0]} (molar mass ${A[1]} g/mol, monobasic) is dissolved in water. What volume of ${M} mol/L NaOH is needed to neutralise it completely?</p>`, answer: V, unit: 'mL', tol: 0.01,
        hint: 'RCOOH + NaOH → RCOONa + H₂O: one mole of acid needs one mole of NaOH.',
        solution: steps(`Moles of acid = ${m}/${A[1]} = ${n(m / A[1])} mol.`, `Moles of NaOH needed = ${n(m / A[1])} mol.`, `Volume = moles ÷ concentration = ${n(m / A[1])} / ${M} = ${n(m / A[1] / M)} L = <b>${n(V)} mL</b>.`) };
    },
    verify: (x) => (x.m / x.A[1]) * (1000 / x.M),
  },
  'c12c-carb-ester': {
    title: 'ester at equilibrium',
    make(r) {
      const a = choose(r, [1, 2, 3]), K = choose(r, [4, 9, 2.25]), x = a * Math.sqrt(K) / (1 + Math.sqrt(K));
      return { a, K, q: `<p>${a} mol of ethanoic acid and ${a} mol of ethanol react: CH₃COOH + C₂H₅OH ⇌ CH₃COOC₂H₅ + H₂O, with K<sub>c</sub> = ${K}. How many moles of ester are present at equilibrium?</p>`, answer: x, unit: 'mol', tol: 0.01,
        hint: 'Let x mol of ester form. Then K = x² / (a − x)², and a square root of both sides gives a linear equation.',
        solution: steps(`K = x²/(${a} − x)² = ${K}, so x/(${a} − x) = √${K} = ${n(Math.sqrt(K))}.`, `x = ${n(Math.sqrt(K))}(${a} − x), so x(1 + ${n(Math.sqrt(K))}) = ${n(a * Math.sqrt(K))}.`, `x = <b>${n(x)} mol</b>.`) };
    },
    verify: (p) => { let lo = 0, hi = p.a; for (let i = 0; i < 80; i++) { const mid = (lo + hi) / 2; (mid * mid / ((p.a - mid) * (p.a - mid)) < p.K) ? (lo = mid) : (hi = mid); } return (lo + hi) / 2; },
  },
  'c12c-carb-tollens': {
    title: 'silver from the Tollens test',
    make(r) {
      const A = choose(r, [['ethanal', 44], ['propanal', 58], ['benzaldehyde', 106]]), m = pick(r, 0.5, 5, 0.5), ag = 2 * 108 * m / A[1];
      return { A, m, q: `<p>${m} g of ${A[0]} (${A[1]} g/mol) is oxidised completely by Tollens’ reagent, which deposits 2 mol of silver (108 g/mol) per mole of aldehyde. What mass of silver is deposited?</p>`, answer: ag, unit: 'g', tol: 0.01,
        hint: 'RCHO + 2 [Ag(NH₃)₂]⁺ + 3 OH⁻ → RCOO⁻ + 2 Ag + 4 NH₃ + 2 H₂O.',
        solution: steps(`Moles of aldehyde = ${m}/${A[1]} = ${n(m / A[1])} mol.`, `Moles of Ag = 2 × ${n(m / A[1])} = ${n(2 * m / A[1])} mol.`, `Mass = ${n(2 * m / A[1])} × 108 = <b>${n(ag)} g</b>.`) };
    },
    verify: (x) => 216 * x.m / x.A[1],
  },
  'c12c-carb-equiv': {
    title: 'molar mass of an unknown acid by titration',
    make(r) {
      const M = choose(r, [60, 74, 88, 102, 122, 136]), m = choose(r, [0.3, 0.4, 0.5, 0.6]), c = choose(r, [0.1, 0.2, 0.5]), V = +(m / M / c * 1000).toFixed(1);
      return { m, c, V, q: `<p>${m} g of an unknown monobasic carboxylic acid needs ${V} mL of ${c} mol/L NaOH to neutralise it. Find the molar mass of the acid.</p>`, answer: m * 1000 / (c * V), unit: 'g/mol', tol: 0.01,
        hint: 'Moles of NaOH = c × V/1000 equals moles of acid. Molar mass = mass ÷ moles.',
        solution: steps(`Moles of NaOH = ${c} × ${V}/1000 = ${n(c * V / 1000, 4)} mol = moles of acid.`, `Molar mass = ${m} / ${n(c * V / 1000, 4)} = <b>${n(m * 1000 / (c * V))} g/mol</b>.`) };
    },
    verify: (x) => x.m / (x.V / 1000 * x.c),
  },
};
