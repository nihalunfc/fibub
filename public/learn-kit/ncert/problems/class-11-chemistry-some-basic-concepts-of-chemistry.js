// Class 11 Chemistry, Chapter 1 Some Basic Concepts of Chemistry: live problems (original fibub questions). Ids start with c11c-basic-.
import { pick, choose, n, steps } from './_util.js';

const SUB = [['water, H₂O', 18.0, 3], ['carbon dioxide, CO₂', 44.0, 3], ['ammonia, NH₃', 17.0, 4], ['methane, CH₄', 16.0, 5], ['glucose, C₆H₁₂O₆', 180, 24]];
const NA = 6.022e23;
export default {
  'c11c-basic-particles': {
    title: 'grams to molecules and atoms',
    make(r) {
      const s = choose(r, SUB), g = choose(r, [9, 18, 36, 44, 88, 90, 180]), mol = g / s[1], N = mol * NA;
      return { s, g, q: `<p>How many <b>atoms</b> are there in ${g} g of ${s[0]}? (molar mass ${s[1]} g/mol, N<sub>A</sub> = 6.022 × 10²³). Give the answer in units of 10²³ atoms.</p>`, answer: N * s[2] / 1e23, unit: '× 10²³', tol: 0.01,
        hint: 'Grams ÷ molar mass = moles; × N_A = molecules; × atoms per molecule = atoms.',
        solution: steps(`Moles = ${g} / ${s[1]} = ${n(mol)} mol.`, `Molecules = ${n(mol)} × 6.022 × 10²³ = ${n(N / 1e23)} × 10²³.`, `Each molecule has ${s[2]} atoms, so atoms = <b>${n(N * s[2] / 1e23)} × 10²³</b>.`) };
    },
    verify: (x) => (x.g / x.s[1]) * x.s[2] * 6.022,
  },
  'c11c-basic-empirical': {
    title: 'empirical formula from percentages',
    make(r) {
      const F = [['C', 12, 'H', 1], ['C', 12, 'O', 16], ['Fe', 55.8, 'O', 16], ['Na', 23, 'S', 32]], f = choose(r, F), a = choose(r, [1, 2]), b = choose(r, [1, 3, 2]), ma = a * f[1], mb = b * f[3], pa = 100 * ma / (ma + mb);
      return { f, a, b, pa, q: `<p>A compound contains ${n(pa, 4)} % of ${f[0]} (atomic mass ${f[1]}) and the rest is ${f[2]} (atomic mass ${f[3]}). In its empirical formula, how many atoms of ${f[2]} are there for every ${a} atom${a > 1 ? 's' : ''} of ${f[0]}?</p><p>(Hint: the answer is a small whole number.)</p>`, answer: b, unit: 'atoms', tol: 0.02,
        hint: 'Take 100 g. Moles = mass / atomic mass. Divide both by the smaller, then clear any fraction.',
        solution: steps(`In 100 g: ${n(pa, 4)} g ${f[0]} and ${n(100 - pa, 4)} g ${f[2]}.`, `Moles: ${f[0]} = ${n(pa / f[1], 4)}, ${f[2]} = ${n((100 - pa) / f[3], 4)}.`, `Ratio ${f[0]} : ${f[2]} = ${a} : <b>${b}</b>.`) };
    },
    verify: (x) => ((100 - x.pa) / x.f[3]) / (x.pa / x.f[1]) * x.a,
  },
  'c11c-basic-limiting': {
    title: 'limiting reagent and product mass',
    make(r) {
      const a = choose(r, [4, 8, 12, 16, 20]), b = choose(r, [16, 32, 48, 64, 96]), prodN = Math.min(a / 2, b / 16), m = prodN * 18;
      return { a, b, q: `<p>${a} g of hydrogen (2 g/mol) burns with ${b} g of oxygen (32 g/mol): 2 H₂ + O₂ → 2 H₂O. What mass of water forms? (H₂O = 18 g/mol)</p>`, answer: m, unit: 'g', tol: 0.01,
        hint: 'Find moles of each, divide by its coefficient; the smaller number is the limiting reagent.',
        solution: steps(`n(H₂) = ${a}/2 = ${a / 2} mol, which gives ${a / 2} mol of H₂O if oxygen is plentiful.`, `n(O₂) = ${b}/32 = ${b / 32} mol, which gives ${b / 16} mol of H₂O if hydrogen is plentiful.`, `The smaller, ${n(prodN)} mol, is made. Mass = ${n(prodN)} × 18 = <b>${n(m)} g</b>.`) };
    },
    verify: (x) => Math.min(9 * x.a, 1.125 * x.b),
  },
  'c11c-basic-dilute': {
    title: 'volume needed to make a dilute solution',
    make(r) {
      const M1 = choose(r, [6, 10, 12, 18]), M2 = choose(r, [0.1, 0.25, 0.5, 1]), V2 = choose(r, [250, 500, 1000]), V1 = M2 * V2 / M1;
      return { M1, M2, V2, q: `<p>You have a stock solution of ${M1} mol/L. What volume of it must be diluted with water to make ${V2} mL of ${M2} mol/L solution?</p>`, answer: V1, unit: 'mL', tol: 0.01,
        hint: 'The moles of solute do not change on dilution: M₁V₁ = M₂V₂.',
        solution: steps(`Moles needed = ${M2} × ${V2 / 1000} L = ${n(M2 * V2 / 1000)} mol.`, `Stock volume = ${n(M2 * V2 / 1000)} mol / ${M1} mol/L = ${n(V1 / 1000)} L = <b>${n(V1)} mL</b>.`, `Add water to bring the total to ${V2} mL.`) };
    },
    verify: (x) => (x.M2 / x.M1) * x.V2,
  },
  'c11c-basic-avgmass': {
    title: 'average atomic mass from isotopes',
    make(r) {
      const I = choose(r, [['Cl', 35, 37], ['Cu', 63, 65], ['Br', 79, 81], ['Ga', 69, 71]]), p = pick(r, 20, 80, 5), avg = (p * I[1] + (100 - p) * I[2]) / 100;
      return { I, p, q: `<p>An element has two isotopes, mass numbers ${I[1]} and ${I[2]} (use these as their masses). The lighter isotope is ${p} % of the atoms. What is the average atomic mass of ${I[0]}?</p>`, answer: avg, unit: 'u', tol: 0.005,
        hint: 'Average = (abundance fraction × mass) added for each isotope.',
        solution: steps(`Light: ${p/100} × ${I[1]} = ${n(p * I[1] / 100, 4)}.`, `Heavy: ${(100 - p)/100} × ${I[2]} = ${n((100 - p) * I[2] / 100, 4)}.`, `Add: <b>${n(avg, 4)} u</b>.`) };
    },
    verify: (x) => x.I[2] - (x.I[2] - x.I[1]) * x.p / 100,
  },
  'c11c-basic-percent': {
    title: 'percentage composition by mass',
    make(r) {
      const C = choose(r, [['CaCO₃', 100, 40, 'Ca'], ['NaOH', 40, 23, 'Na'], ['Fe₂O₃', 160, 112, 'Fe'], ['H₂SO₄', 98, 32, 'S'], ['NH₄NO₃', 80, 28, 'N']]), p = 100 * C[2] / C[1];
      return { C, q: `<p>The molar mass of ${C[0]} is ${C[1]} g/mol and it contains ${C[2]} g of ${C[3]} in every mole. Find the mass percent of ${C[3]}.</p>`, answer: p, unit: '%', tol: 0.01,
        hint: 'Mass percent = (mass of the element in one mole) ÷ (molar mass) × 100.',
        solution: steps(`Mass of ${C[3]} in 1 mol = ${C[2]} g.`, `Percent = ${C[2]} / ${C[1]} × 100 = <b>${n(p)} %</b>.`) };
    },
    verify: (x) => (x.C[2] / x.C[1]) * 100,
  },
};
