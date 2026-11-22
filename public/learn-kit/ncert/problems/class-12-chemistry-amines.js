// Class 12 Chemistry, Chapter 9 Amines: live problems (original fibub questions). Ids start with c12c-amine-.
import { pick, choose, n, steps } from './_util.js';

const AM = [['methylamine', 3.38], ['dimethylamine', 3.27], ['ethylamine', 3.29], ['ammonia', 4.75], ['trimethylamine', 4.22]];
export default {
  'c12c-amine-ph': {
    title: 'pH of an amine solution',
    make(r) {
      const A = choose(r, AM), c = choose(r, [0.1, 0.05, 0.01]), Kb = Math.pow(10, -A[1]), oh = (-Kb + Math.sqrt(Kb * Kb + 4 * Kb * c)) / 2, pH = 14 + Math.log10(oh);
      return { A, c, q: `<p>The pKb of ${A[0]} in water is ${A[1]}. What is the pH of a ${c} mol/L solution (at 298 K, pKw = 14)?</p>`, answer: pH, unit: '', tol: 0.01,
        hint: 'B + H₂O ⇌ BH⁺ + OH⁻. K_b = [OH⁻]²/(c − [OH⁻]). Solve for [OH⁻], then pOH, then pH = 14 − pOH.',
        solution: steps(`K_b = 10^(−${A[1]}) = ${n(Kb)}.`, `[OH⁻]² + K_b[OH⁻] − K_b c = 0 gives [OH⁻] = ${n(oh)} mol/L.`, `pOH = ${n(-Math.log10(oh))}, so pH = <b>${n(pH)}</b>.`) };
    },
    verify: (x) => { const Kb = Math.pow(10, -x.A[1]); let lo = -14, hi = Math.log10(x.c) - 1e-9; for (let i = 0; i < 80; i++) { const mid = (lo + hi) / 2, o = Math.pow(10, mid); (o * o / (x.c - o) > Kb) ? (hi = mid) : (lo = mid); } return 14 + (lo + hi) / 2; },
  },
  'c12c-amine-prot': {
    title: 'fraction of an amine protonated',
    make(r) {
      const A = choose(r, AM), pH = choose(r, [8, 9, 10, 11, 12]), pKaH = 14 - A[1], f = 100 / (1 + Math.pow(10, pH - pKaH));
      return { A, pH, q: `<p>The pKb of ${A[0]} is ${A[1]}. What percentage of its molecules is present as the protonated form (BH⁺) in a buffer of pH ${pH}?</p>`, answer: f, unit: '%', tol: 0.02, abs: 0.02,
        hint: 'The conjugate acid BH⁺ has pKa = 14 − pKb. Then fraction protonated = 1/(1 + 10^(pH − pKa)).',
        solution: steps(`pKa of BH⁺ = 14 − ${A[1]} = ${n(pKaH)}.`, `[B]/[BH⁺] = 10^(${pH} − ${n(pKaH)}) = ${n(Math.pow(10, pH - pKaH))}.`, `Protonated fraction = 1/(1 + ratio) = <b>${n(f)} %</b>.`) };
    },
    verify: (x) => { const Kw = 1e-14, Kb = Math.pow(10, -x.A[1]), oh = Kw / Math.pow(10, -x.pH); return 100 * Kb / (Kb + oh); },
  },
  'c12c-amine-hofmann': {
    title: 'amine from a Hofmann bromamide reaction',
    make(r) {
      const P = choose(r, [['ethanamide', 59, 'methylamine', 31], ['propanamide', 73, 'ethylamine', 45], ['benzamide', 121, 'aniline', 93]]), m = choose(r, [5, 10, 20, 25]), y = choose(r, [60, 70, 75, 80, 90]), got = m / P[1] * P[3] * y / 100;
      return { P, m, y, got, q: `<p>${m} g of ${P[0]} (${P[1]} g/mol) is converted to ${P[2]} (${P[3]} g/mol) by the Hofmann bromamide reaction with a yield of ${y} %. What mass of ${P[2]} is obtained?</p>`, answer: got, unit: 'g', tol: 0.015,
        hint: 'The reaction is one mole of amide to one mole of amine (one carbon fewer). Multiply the theoretical mass by the yield.',
        solution: steps(`Moles of amide = ${m}/${P[1]} = ${n(m / P[1])} mol.`, `Theoretical amine = ${n(m / P[1])} × ${P[3]} = ${n(m / P[1] * P[3])} g.`, `Actual mass = ${y} % of that = <b>${n(got)} g</b>.`) };
    },
    verify: (x) => (x.m * x.P[3] / x.P[1]) * (x.y / 100),
  },
  'c12c-amine-sandmeyer': {
    title: 'chlorobenzene from aniline by the Sandmeyer reaction',
    make(r) {
      const m = choose(r, [4.65, 9.3, 18.6, 27.9]), y = choose(r, [60, 65, 70, 80]), got = m / 93 * 112.5 * y / 100;
      return { m, y, got, q: `<p>${m} g of aniline (93 g/mol) is diazotised with sodium nitrite and HCl and treated with CuCl (Sandmeyer reaction): C₆H₅NH₂ → C₆H₅N₂⁺Cl⁻ → C₆H₅Cl. The overall yield is ${y} %. What mass of chlorobenzene (112.5 g/mol) forms?</p>`, answer: got, unit: 'g', tol: 0.015,
        hint: 'One mole of aniline gives one mole of chlorobenzene.',
        solution: steps(`Moles of aniline = ${m}/93 = ${n(m / 93)} mol.`, `Theoretical chlorobenzene = ${n(m / 93)} × 112.5 = ${n(m / 93 * 112.5)} g.`, `Actual = ${y} % of that = <b>${n(got)} g</b>.`) };
    },
    verify: (x) => (x.m / 93) * (x.y / 100) * 112.5,
  },
  'c12c-amine-nano2': {
    title: 'sodium nitrite for diazotisation',
    make(r) {
      const m = pick(r, 1, 10, 1), M = choose(r, [0.5, 1, 2]), V = m / 93 / M * 1000;
      return { m, M, q: `<p>${m} g of aniline (93 g/mol) is to be diazotised: C₆H₅NH₂ + NO₂⁻ + 2 H⁺ → C₆H₅N₂⁺ + 2 H₂O. What volume of ${M} mol/L sodium nitrite solution is needed (1 : 1 ratio)?</p>`, answer: V, unit: 'mL', tol: 0.01,
        hint: 'Moles of nitrite = moles of aniline. Volume = moles ÷ concentration.',
        solution: steps(`Moles of aniline = ${m}/93 = ${n(m / 93, 4)} mol.`, `Moles of nitrite = ${n(m / 93, 4)} mol.`, `Volume = ${n(m / 93, 4)} / ${M} L = <b>${n(V)} mL</b>.`) };
    },
    verify: (x) => 1000 * x.m / (93 * x.M),
  },
};
