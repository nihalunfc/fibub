// Class 11 Chemistry, Chapter 9 Hydrocarbons: live problems (original fibub questions). Ids start with c11c-hc-.
import { pick, choose, n, steps } from './_util.js';

// [name, carbons, double bonds, triple bonds, rings]
const HC = [['cyclohexene', 6, 1, 0, 1], ['but-1-yne', 4, 0, 1, 0], ['benzene', 6, 3, 0, 1], ['buta-1,3-diene', 4, 2, 0, 0], ['cyclohexane', 6, 0, 0, 1], ['propene', 3, 1, 0, 0], ['hex-1-en-4-yne', 6, 1, 1, 0], ['toluene', 7, 3, 0, 1], ['ethyne', 2, 0, 1, 0], ['naphthalene', 10, 5, 0, 2]];
const PI = [[6, 'benzene'], [10, 'naphthalene'], [14, 'anthracene'], [18, '[18]annulene'], [6, 'the cyclopentadienyl anion'], [2, 'the cyclopropenyl cation']];
// [name, primary H, secondary-or-tertiary H, relative reactivity of that H, kind]
const CL = [['propane', 6, 2, 3.8, 'secondary'], ['butane', 6, 4, 3.8, 'secondary'], ['2-methylpropane', 9, 1, 5.0, 'tertiary'], ['pentane (C-2 and C-3 together)', 6, 6, 3.8, 'secondary']];
export default {
  'c11c-hc-unsat': {
    title: 'degrees of unsaturation',
    make(r) {
      const [nm, c, db, tb, ring] = choose(r, HC); const dou = db + 2 * tb + ring; const hh = 2 * c + 2 - 2 * dou;
      return { c, hh, db, tb, ring, q: `<p>${nm} has the molecular formula C<sub>${c}</sub>H<sub>${hh}</sub>. Find its degree of unsaturation, (2C + 2 − H) ÷ 2.</p>`, answer: (2 * c + 2 - hh) / 2, tol: 0.01, abs: 0.01,
        hint: 'Each ring or double bond counts as 1, each triple bond as 2.',
        solution: steps(`(2 × ${c} + 2 − ${hh}) ÷ 2 = ${n((2 * c + 2 - hh) / 2)}.`, `Check from the structure: ${db} double bond(s) + 2 × ${tb} triple bond(s) + ${ring} ring(s) = <b>${db + 2 * tb + ring}</b>.`) };
    },
    verify: (x) => x.db + 2 * x.tb + x.ring,
  },
  'c11c-hc-combust': {
    title: 'oxygen needed for combustion of an alkane',
    make(r) {
      const c = choose(r, [1, 2, 3, 4, 5, 6, 8]), m = choose(r, [1, 2, 4, 8]), M = 14 * c + 2, V = (m / M) * (c + (2 * c + 2) / 4) * 22.4;
      return { c, m, q: `<p>Find the volume of oxygen at STP (22.4 L/mol) needed to burn completely ${m} g of the alkane C<sub>${c}</sub>H<sub>${2 * c + 2}</sub> (C = 12, H = 1).</p>`, answer: V, unit: 'L', tol: 0.01,
        hint: 'C<sub>x</sub>H<sub>y</sub> + (x + y/4) O₂ → x CO₂ + (y/2) H₂O. Find moles of the alkane first.',
        solution: steps(`Molar mass = 12 × ${c} + ${2 * c + 2} = ${M} g/mol; moles = ${m} ÷ ${M} = ${n(m / M, 3)} mol.`, `Moles of O₂ per mole of alkane = ${c} + ${2 * c + 2}/4 = ${n(c + (2 * c + 2) / 4)}.`, `Volume of O₂ = ${n(m / M, 3)} × ${n(c + (2 * c + 2) / 4)} × 22.4 = <b>${n(V)} L</b>.`) };
    },
    verify: (x) => { const M = 12 * x.c + (2 * x.c + 2), oAtoms = 2 * x.c + (2 * x.c + 2) / 2; return ((x.m / M) * oAtoms / 2) * 22.4; },
  },
  'c11c-hc-bromine': {
    title: 'bromine addition to an alkene',
    make(r) {
      const c = choose(r, [2, 3, 4, 5, 6]), m = choose(r, [1.4, 2.8, 4.2, 7.0]), k = choose(r, [1, 1, 2]), M = 14 * c - 2 * (k - 1), g = (m / M) * k * 160;
      return { c, m, k, q: `<p>${m} g of ${k === 1 ? `an alkene C<sub>${c}</sub>H<sub>${2 * c}</sub> (a mono-alkene)` : `an alkadiene C<sub>${c}</sub>H<sub>${2 * c - 2}</sub> (two C=C bonds)`} reacts completely with bromine (Br₂ = 160 g/mol). Find the mass of bromine that adds (C = 12, H = 1).</p>`, answer: g, unit: 'g', tol: 0.01,
        hint: 'Each C=C adds one Br₂. Moles of Br₂ = moles of compound × number of C=C bonds.',
        solution: steps(`Molar mass = ${M} g/mol; moles = ${m} ÷ ${M} = ${n(m / M, 3)} mol.`, `Moles of Br₂ = ${n(m / M, 3)} × ${k} = ${n(m / M * k, 3)} mol.`, `Mass = ${n(m / M * k, 3)} × 160 = <b>${n(g)} g</b>.`) };
    },
    verify: (x) => { const M = 12 * x.c + (x.k === 1 ? 2 * x.c : 2 * x.c - 2); return ((x.m / M) * 160) * x.k; },
  },
  'c11c-hc-huckel': {
    title: 'Hückel’s rule: find n',
    make(r) {
      const [e, nm] = choose(r, PI);
      return { e, q: `<p>${nm[0].toUpperCase() + nm.slice(1)} has ${e} π electrons in a planar, fully conjugated ring. If this follows Hückel’s rule, 4n + 2 = ${e}: find n.</p>`, answer: (e - 2) / 4, tol: 0.01, abs: 0.01,
        hint: 'Solve 4n + 2 = number of π electrons.',
        solution: steps(`4n + 2 = ${e}, so 4n = ${e - 2}.`, `n = <b>${n((e - 2) / 4)}</b>: a whole number, so the ring is aromatic.`) };
    },
    verify: (x) => { for (let k = 0; k < 10; k++) if (4 * k + 2 === x.e) return k; return NaN; },
  },
  'c11c-hc-chlor': {
    title: 'free-radical chlorination: product ratio',
    make(r) {
      const [nm, p, s, rel, kind] = choose(r, CL), pct = (s * rel) / (p * 1 + s * rel) * 100;
      return { p, s, rel, q: `<p>Monochlorination of ${nm} at 300 °C: each primary C–H is taken as 1, each ${kind} C–H is ${rel} times as reactive. There are ${p} primary H atoms and ${s} ${kind} H atoms. What percentage of the monochloro product comes from the ${kind} H?</p>`, answer: pct, unit: '%', tol: 0.01,
        hint: `Relative amount = number of H × reactivity. Divide the ${kind} share by the total.`,
        solution: steps(`Primary: ${p} × 1 = ${p}. ${kind[0].toUpperCase() + kind.slice(1)}: ${s} × ${rel} = ${n(s * rel)}.`, `Share = ${n(s * rel)} ÷ (${p} + ${n(s * rel)}) × 100 = <b>${n(pct)} %</b>.`) };
    },
    verify: (x) => { const a = x.p, b = x.s * x.rel; return (b / (a + b)) * 100; },
  },
};
