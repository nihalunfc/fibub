// Class 12 Chemistry, Chapter 7 Alcohols, Phenols and Ethers: live problems (original fibub questions). Ids start with c12c-alc-.
import { pick, choose, n, steps } from './_util.js';

const PKA = [['ethanol', 15.9], ['phenol', 10], ['4-nitrophenol', 7.15], ['4-chlorophenol', 9.4], ['acetic acid', 4.76], ['water', 15.7]];
export default {
  'c12c-alc-yield': {
    title: 'percentage yield of ethanol from fermentation',
    make(r) {
      const g = choose(r, [90, 180, 360, 450, 900]), y = choose(r, [60, 70, 75, 80, 85, 90]), got = g * 92 / 180 * y / 100;
      return { g, got, q: `<p>Yeast ferments ${g} g of glucose: C₆H₁₂O₆ → 2 C₂H₅OH + 2 CO₂ (molar masses: glucose 180, ethanol 46 g/mol). The ethanol collected weighs ${n(got)} g. What is the percentage yield?</p>`, answer: y, unit: '%', tol: 0.01,
        hint: 'One mole of glucose gives two moles of ethanol. Percentage yield = (actual ÷ theoretical) × 100.',
        solution: steps(`Moles of glucose = ${g}/180 = ${n(g / 180)} mol.`, `Theoretical ethanol = 2 × ${n(g / 180)} = ${n(2 * g / 180)} mol = ${n(2 * g / 180 * 46)} g.`, `Yield = ${n(got)} / ${n(2 * g / 180 * 46)} × 100 = <b>${n(y)} %</b>.`) };
    },
    verify: (x) => 100 * (x.got / 46) / (2 * x.g / 180),
  },
  'c12c-alc-ionised': {
    title: 'fraction of an acid ionised at a given pH',
    make(r) {
      const [nm, pKa] = choose(r, PKA), pH = choose(r, [6, 7, 8, 9, 10, 11, 12]), f = 100 / (1 + Math.pow(10, pKa - pH));
      return { nm, pKa, pH, q: `<p>The pKa of ${nm} is ${pKa}. What percentage of its molecules is ionised in a buffer of pH ${pH}?</p>`, answer: f, unit: '%', tol: 0.02, abs: 0.02,
        hint: 'pH = pKa + log([A⁻]/[HA]). Find the ratio [A⁻]/[HA] = 10^(pH − pKa), then fraction = ratio ÷ (1 + ratio).',
        solution: steps(`pH − pKa = ${pH} − ${pKa} = ${n(pH - pKa)}.`, `[A⁻]/[HA] = 10^${n(pH - pKa)} = ${n(Math.pow(10, pH - pKa))}.`, `Fraction ionised = ratio/(1 + ratio) = <b>${n(f)} %</b>.`) };
    },
    verify: (x) => { const ka = Math.pow(10, -x.pKa), h = Math.pow(10, -x.pH); return 100 * ka / (ka + h); },
  },
  'c12c-alc-stronger': {
    title: 'how many times stronger is an acid',
    make(r) {
      const a = choose(r, [['phenol', 10], ['4-nitrophenol', 7.15], ['picric acid', 0.4]]), b = choose(r, [['ethanol', 15.9], ['water', 15.7]]);
      return { a, b, q: `<p>The pKa of ${a[0]} is ${a[1]} and the pKa of ${b[0]} is ${b[1]}. How many times larger is the acid dissociation constant Kₐ of ${a[0]} than that of ${b[0]}? Give the answer as a power of ten: enter the exponent x in 10ˣ.</p>`, answer: b[1] - a[1], unit: '(exponent x)', tol: 0.01,
        hint: 'Kₐ = 10^(−pKa), so Kₐ(1)/Kₐ(2) = 10^(pKa₂ − pKa₁).',
        solution: steps(`Kₐ(${a[0]}) = 10^−${a[1]}; Kₐ(${b[0]}) = 10^−${b[1]}.`, `Ratio = 10^(${b[1]} − ${a[1]}) = 10^<b>${n(b[1] - a[1])}</b>.`) };
    },
    verify: (x) => Math.log10(Math.pow(10, -x.a[1]) / Math.pow(10, -x.b[1])),
  },
  'c12c-alc-h2': {
    title: 'hydrogen from an alcohol and sodium',
    make(r) {
      const A = choose(r, [['methanol', 32], ['ethanol', 46], ['propan-1-ol', 60], ['butan-1-ol', 74]]), m = pick(r, 2, 20, 2), v = m / A[1] / 2 * 22.4;
      return { A, m, q: `<p>${m} g of ${A[0]} (${A[1]} g/mol) reacts completely with excess sodium: 2 ROH + 2 Na → 2 RONa + H₂. What volume of hydrogen is given off at STP (1 mole of gas = 22.4 L)?</p>`, answer: v, unit: 'L', tol: 0.015,
        hint: 'Two moles of alcohol give one mole of H₂.',
        solution: steps(`Moles of alcohol = ${m}/${A[1]} = ${n(m / A[1])} mol.`, `Moles of H₂ = half of that = ${n(m / A[1] / 2)} mol.`, `Volume = ${n(m / A[1] / 2)} × 22.4 = <b>${n(v)} L</b>.`) };
    },
    verify: (x) => 22.4 * x.m / (2 * x.A[1]),
  },
  'c12c-alc-ether': {
    title: 'mass of ether from dehydration of ethanol',
    make(r) {
      const m = choose(r, [23, 46, 92, 115, 230]), y = choose(r, [50, 60, 70, 80]), got = m / 46 / 2 * 74 * y / 100;
      return { m, y, got, q: `<p>Ethanol is heated with concentrated H₂SO₄ at 413 K: 2 C₂H₅OH → C₂H₅OC₂H₅ + H₂O. Starting with ${m} g of ethanol (46 g/mol) and a yield of ${y} %, what mass of ethoxyethane (74 g/mol) is obtained?</p>`, answer: got, unit: 'g', tol: 0.015,
        hint: 'Two moles of ethanol make one mole of ether. Multiply the theoretical mass by the yield.',
        solution: steps(`Moles of ethanol = ${m}/46 = ${n(m / 46)} mol.`, `Theoretical ether = ${n(m / 46 / 2)} mol = ${n(m / 46 / 2 * 74)} g.`, `Actual = ${y} % of that = <b>${n(got)} g</b>.`) };
    },
    verify: (x) => (x.m * 74 / 92) * x.y / 100,
  },
};
