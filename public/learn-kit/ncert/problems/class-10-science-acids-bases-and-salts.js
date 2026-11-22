// Class 10 Science, Acids, Bases and Salts: live problems (original fibub questions). Ids start with c10s-acid-.
import { pick, choose, n, steps } from './_util.js';

export default {
  'c10s-acid-ph': {
    title: 'pH from hydrogen ion concentration',
    make(r) {
      const e = pick(r, 1, 6), a = choose(r, [1, 2, 5]), conc = a * Math.pow(10, -e), answer = e - Math.log10(a);
      return { conc, q: `<p>A solution has a hydrogen ion concentration of ${a} × 10<sup>−${e}</sup> mol/L. What is its pH (to 2 decimal places)? Is it acidic or basic?</p>`, answer, unit: '', tol: 0.01,
        hint: 'pH = −log₁₀[H⁺]. For a × 10<sup>−e</sup>, the log of the power of ten is −e, and you add log a.',
        solution: steps(`pH = −log₁₀(${a} × 10<sup>−${e}</sup>) = ${e} − log₁₀(${a}).`, `pH = <b>${n(answer, 3)}</b> (${answer < 7 ? 'acidic, below 7' : 'basic, above 7'}).`) };
    },
    verify: (x) => -Math.log(x.conc) / Math.LN10,
  },
  'c10s-acid-times': {
    title: 'how many times more acidic',
    make(r) {
      const a = pick(r, 1, 4), b = a + pick(r, 1, 5);
      return { a, b, q: `<p>Solution X has pH ${a} and solution Y has pH ${b}. How many times greater is the hydrogen ion concentration in X than in Y?</p>`, answer: Math.pow(10, b - a), unit: 'times', tol: 0.01,
        hint: 'Each unit of pH is a factor of 10 in [H⁺]. The lower the pH, the more H⁺.',
        solution: steps(`The pH differs by ${b} − ${a} = ${b - a}.`, `[H⁺] in X is 10<sup>${b - a}</sup> = <b>${Math.pow(10, b - a).toLocaleString('en-IN')}</b> times that in Y.`) };
    },
    verify: (x) => Math.pow(10, -x.a) / Math.pow(10, -x.b),
  },
  'c10s-acid-dilute': {
    title: 'pH after diluting an acid',
    make(r) {
      const p0 = pick(r, 1, 3), k = pick(r, 1, 3);
      return { p0, k, q: `<p>A strong acid has pH ${p0}. It is diluted with water to make its volume ${Math.pow(10, k).toLocaleString('en-IN')} times larger. What is the new pH? (The acid is strong, and the dilution is not so great that the water's own ions matter.)</p>`, answer: p0 + k, unit: '', tol: 0.01,
        hint: 'Diluting 10 times cuts [H⁺] to a tenth, which raises the pH by 1.',
        solution: steps(`New [H⁺] = 10<sup>−${p0}</sup> ÷ ${Math.pow(10, k).toLocaleString('en-IN')} = 10<sup>−${p0 + k}</sup> mol/L.`, `pH = <b>${p0 + k}</b>. It is still an acid: dilution moves the pH toward 7 but never past it.`) };
    },
    verify: (x) => -Math.log10(Math.pow(10, -x.p0) / Math.pow(10, x.k)),
  },
  'c10s-acid-neutral': {
    title: 'volume of base to neutralise an acid',
    make(r) {
      const V1 = pick(r, 10, 50, 5), c1 = choose(r, [0.1, 0.2, 0.5]), c2 = choose(r, [0.1, 0.2, 0.25, 0.4, 0.5]);
      return { V1, c1, c2, q: `<p>${V1} mL of ${n(c1)} mol/L hydrochloric acid is to be neutralised with ${n(c2)} mol/L sodium hydroxide solution (HCl + NaOH → NaCl + H₂O). What volume of NaOH is needed, in mL?</p>`, answer: (V1 * c1) / c2, unit: 'mL', tol: 0.01,
        hint: 'One HCl neutralises one NaOH, so the amounts (concentration × volume) must be equal: c₁V₁ = c₂V₂.',
        solution: steps(`Amount of HCl = ${n(c1)} × ${V1} = ${n(c1 * V1)} (in mmol).`, `V(NaOH) = ${n(c1 * V1)} ÷ ${n(c2)} = <b>${n((V1 * c1) / c2)} mL</b>.`) };
    },
    verify: (x) => ((x.c1 * x.V1 / 1000) / x.c2) * 1000,
  },
  'c10s-acid-pop': {
    title: 'plaster of Paris from gypsum',
    make(r) {
      const m = pick(r, 20, 400, 20);
      return { m, q: `<p>Gypsum, CaSO₄·2H₂O (formula mass 172), is heated at 100 °C to make plaster of Paris, CaSO₄·½H₂O (formula mass 145), losing 1½ water molecules (27 u) per unit. How many kg of plaster of Paris can be made from ${m} kg of gypsum?</p>`, answer: (m * 145) / 172, unit: 'kg', tol: 0.01,
        hint: 'Mass of POP formed ÷ mass of gypsum = 145 ÷ 172 (the same ratio as one unit of each).',
        solution: steps('Gypsum: 40 + 32 + 64 + 36 = 172. POP: 136 + 9 = 145. Water lost per unit = 27.', `POP = ${m} × 145 ÷ 172 = <b>${n((m * 145) / 172)} kg</b> (and ${n((m * 27) / 172)} kg of water is lost).`) };
    },
    verify: (x) => x.m - (x.m * 27) / 172,
  },
  'c10s-acid-bake': {
    title: 'washing soda from baking soda',
    make(r) {
      const m = pick(r, 42, 840, 42);
      return { m, q: `<p>Baking soda is heated: 2NaHCO₃ → Na₂CO₃ + H₂O + CO₂. How many grams of sodium carbonate form from ${m} g of NaHCO₃? (Na = 23, H = 1, C = 12, O = 16.)</p>`, answer: (m / 168) * 106, unit: 'g', tol: 0.01,
        hint: '2 × 84 = 168 g of NaHCO₃ gives 106 g of Na₂CO₃. Scale by m ÷ 168.',
        solution: steps('NaHCO₃ = 23 + 1 + 12 + 48 = 84, so 2NaHCO₃ = 168. Na₂CO₃ = 46 + 12 + 48 = 106.', `${m} g gives ${m} × 106 ÷ 168 = <b>${n((m / 168) * 106)} g</b>.`) };
    },
    verify: (x) => x.m - (x.m / 168) * 62,
  },
  'c10s-acid-crystal': {
    title: 'water of crystallisation in blue vitriol',
    make(r) {
      const m = pick(r, 25, 500, 25);
      return { m, q: `<p>Blue crystals of copper sulphate, CuSO₄·5H₂O (formula mass 250), are heated until all the water of crystallisation is lost (the crystals turn white). How many grams of water are driven off from ${m} g of crystals? (CuSO₄ = 160.)</p>`, answer: (m * 90) / 250, unit: 'g', tol: 0.01,
        hint: '5 × 18 = 90 of the 250 units of mass are water.',
        solution: steps('5H₂O = 5 × 18 = 90; the whole formula unit is 160 + 90 = 250.', `Water = ${m} × 90 ÷ 250 = <b>${n((m * 90) / 250)} g</b>.`) };
    },
    verify: (x) => x.m - (x.m * 160) / 250,
  },
};
