// Class 12 Chemistry, Chapter 10 Biomolecules: live problems (original fibub questions). Ids start with c12c-bio-.
import { pick, choose, n, steps } from './_util.js';

// ionisable groups: [type, pKa]; a = acid (COOH), b = base (NH3+, etc.)
const AA = [['glycine', [['a', 2.34], ['b', 9.6]]], ['alanine', [['a', 2.34], ['b', 9.69]]], ['valine', [['a', 2.32], ['b', 9.62]]], ['aspartic acid', [['a', 1.88], ['a', 3.65], ['b', 9.6]]], ['glutamic acid', [['a', 2.19], ['a', 4.25], ['b', 9.67]]], ['lysine', [['a', 2.18], ['b', 8.95], ['b', 10.53]]], ['arginine', [['a', 2.17], ['b', 9.04], ['b', 12.48]]]];
const MR = { Gly: 75, Ala: 89, Ser: 105, Val: 117, Leu: 131, Phe: 165, Asp: 133, Lys: 146 };
const PEPS = [['Gly', 'Ala'], ['Gly', 'Gly', 'Ala'], ['Ala', 'Ser', 'Val'], ['Gly', 'Leu', 'Phe'], ['Asp', 'Phe'], ['Ala', 'Lys', 'Gly', 'Ser'], ['Val', 'Leu', 'Ala', 'Gly'], ['Ser', 'Asp', 'Lys']];
const net = (g, pH) => g.reduce((s, [t, p]) => s + (t === 'a' ? -1 / (1 + Math.pow(10, p - pH)) : 1 / (1 + Math.pow(10, pH - p))), 0);
export default {
  'c12c-bio-pi': {
    title: 'isoelectric point of an amino acid',
    make(r) {
      const A = choose(r, AA), acid = A[1].filter((g) => g[0] === 'a').map((g) => g[1]), base = A[1].filter((g) => g[0] === 'b').map((g) => g[1]);
      const pair = acid.length > 1 ? [acid[0], acid[1]] : base.length > 1 ? [base[0], base[1]] : [acid[0], base[0]], pI = (pair[0] + pair[1]) / 2;
      return { A, q: `<p>The ionisable groups of ${A[0]} have pKa values ${A[1].map((g) => g[1]).join(', ')} (in order of increasing pH). Find its isoelectric point (the pH at which the net charge is zero).</p>`, answer: pI, unit: '', tol: 0.01,
        hint: 'The pI is the average of the two pKa values on either side of the neutral form. For an acidic amino acid use the two acid pKa values; for a basic one use the two base pKa values; otherwise use the lowest and highest.',
        solution: steps(`The neutral form is between the pKa values ${n(pair[0])} and ${n(pair[1])}.`, `pI = (${n(pair[0])} + ${n(pair[1])}) / 2 = <b>${n(pI)}</b>.`) };
    },
    verify: (x) => { let lo = 0, hi = 14; for (let i = 0; i < 70; i++) { const m = (lo + hi) / 2; net(x.A[1], m) > 0 ? (lo = m) : (hi = m); } return (lo + hi) / 2; },
  },
  'c12c-bio-peptide': {
    title: 'molar mass of a peptide',
    make(r) {
      const P = choose(r, PEPS), M = P.reduce((s, a) => s + MR[a], 0) - 18 * (P.length - 1);
      return { P, q: `<p>A peptide has the sequence ${P.join('–')}. The molar masses of the free amino acids are ${[...new Set(P)].map((a) => a + ' ' + MR[a]).join(', ')} g/mol. Find the molar mass of the peptide (1 water, 18 g/mol, is lost at each peptide bond).</p>`, answer: M, unit: 'g/mol', tol: 0.005,
        hint: 'A chain of n amino acids has n − 1 peptide bonds, so it loses n − 1 molecules of water.',
        solution: steps(`Sum of the amino acid masses = ${n(P.reduce((s, a) => s + MR[a], 0))} g/mol.`, `Peptide bonds = ${P.length - 1}, water lost = ${18 * (P.length - 1)} g/mol.`, `Molar mass = <b>${n(M)} g/mol</b>.`) };
    },
    verify: (x) => 18 + x.P.reduce((s, a) => s + (MR[a] - 18), 0),
  },
  'c12c-bio-hydrolysis': {
    title: 'glucose from hydrolysis of sucrose or starch',
    make(r) {
      const S = choose(r, [['sucrose', 342, 1, 'one mole of sucrose gives one mole of glucose and one of fructose', 'C₁₂H₂₂O₁₁'], ['starch', 162, 1, 'each C₆H₁₀O₅ unit (162 g/mol) gives one glucose', '(C₆H₁₀O₅)ₙ']]), m = choose(r, [34.2, 68.4, 171, 324]), g = m / S[1] * 180;
      return { S, m, q: `<p>${m} g of ${S[0]} (${S[4]}; ${S[1]} g per mole of repeating unit or molecule) is completely hydrolysed. What mass of glucose (180 g/mol) is formed?</p>`, answer: g, unit: 'g', tol: 0.01,
        hint: S[3] + '.',
        solution: steps(`Moles of ${S[0]} (unit) = ${m}/${S[1]} = ${n(m / S[1])} mol.`, `Moles of glucose = ${n(m / S[1])} mol.`, `Mass = ${n(m / S[1])} × 180 = <b>${n(g)} g</b>.`) };
    },
    verify: (x) => x.m * 180 / x.S[1],
  },
  'c12c-bio-chargaff': {
    title: 'base composition of DNA (Chargaff’s rules)',
    make(r) {
      const a = choose(r, [18, 22, 26, 29, 31, 33, 36]), g = 50 - a;
      return { a, q: `<p>In a sample of double-stranded DNA, ${a} % of the bases are adenine. What percentage of the bases is guanine?</p>`, answer: g, unit: '%', tol: 0.01,
        hint: 'In double-stranded DNA A = T and G = C, and all four bases add up to 100 %.',
        solution: steps(`A = T = ${a} %, so A + T = ${2 * a} %.`, `G + C = 100 − ${2 * a} = ${100 - 2 * a} %.`, `G = C, so G = <b>${n(g)} %</b>.`) };
    },
    verify: (x) => (100 - 2 * x.a) / 2,
  },
  'c12c-bio-hbond': {
    title: 'hydrogen bonds in a DNA duplex',
    make(r) {
      const N = choose(r, [100, 200, 500, 1000]), gc = choose(r, [30, 40, 50, 60]), h = 2 * N * (100 - gc) / 100 + 3 * N * gc / 100;
      return { N, gc, q: `<p>A double-stranded DNA piece has ${N} base pairs, of which ${gc} % are G–C pairs. An A–T pair has 2 hydrogen bonds and a G–C pair has 3. How many hydrogen bonds hold the two strands together?</p>`, answer: h, unit: 'bonds', tol: 0.005,
        hint: 'Count the A–T pairs and the G–C pairs separately, then multiply each by its number of hydrogen bonds.',
        solution: steps(`G–C pairs = ${n(N * gc / 100)}; A–T pairs = ${n(N * (100 - gc) / 100)}.`, `Hydrogen bonds = 3 × ${n(N * gc / 100)} + 2 × ${n(N * (100 - gc) / 100)} = <b>${n(h)}</b>.`) };
    },
    verify: (x) => 2 * x.N + (x.N * x.gc) / 100,
  },
  'c12c-bio-mm': {
    title: 'enzyme rate from the Michaelis–Menten equation',
    make(r) {
      const V = choose(r, [50, 80, 100, 120]), Km = choose(r, [1, 2, 4, 5]), S = choose(r, [1, 2, 5, 10, 20]), v = V * S / (Km + S);
      return { V, Km, S, q: `<p>An enzyme has V<sub>max</sub> = ${V} µmol/min and K<sub>m</sub> = ${Km} mM. What is its rate at a substrate concentration of ${S} mM?</p>`, answer: v, unit: 'µmol/min', tol: 0.01,
        hint: 'v = V<sub>max</sub>[S] / (K<sub>m</sub> + [S]). At [S] = K<sub>m</sub> the rate is half of V<sub>max</sub>.',
        solution: steps(`v = ${V} × ${S} / (${Km} + ${S}).`, `v = ${n(V * S)} / ${Km + S} = <b>${n(v)} µmol/min</b>.`) };
    },
    verify: (x) => 1 / (1 / x.V + x.Km / (x.V * x.S)),
  },
};
