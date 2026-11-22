// Class 12 Chemistry, Chapter 6 Haloalkanes and Haloarenes: live problems (original fibub questions). Ids start with c12c-halo-.
import { choose, n, steps } from './_util.js';

// alkanes as adjacency lists (carbon skeleton)
const ALK = [
  ['propane', [[1], [0, 2], [1]], 2], ['butane', [[1], [0, 2], [1, 3], [2]], 2], ['2-methylpropane', [[1], [0, 2, 3], [1], [1]], 2], ['pentane', [[1], [0, 2], [1, 3], [2, 4], [3]], 3],
  ['2-methylbutane', [[1], [0, 2, 4], [1, 3], [2], [1]], 4], ['2,2-dimethylpropane', [[1], [0, 2, 3, 4], [1], [1], [1]], 1], ['2,3-dimethylbutane', [[1], [0, 2, 5], [1, 3, 4], [2], [2], [1]], 2], ['hexane', [[1], [0, 2], [1, 3], [2, 4], [3, 5], [4]], 3],
];
const STC = [
  ['2-bromobutane', [['H', 'CH3', 'C2H5', 'Br']], 1], ['2,3-dibromobutane', [['H', 'CH3', 'Br', 'CHBrCH3'], ['H', 'CH3', 'Br', 'CHBrCH3']], 2], ['2-bromopropane', [['H', 'CH3', 'CH3', 'Br']], 0],
  ['1-bromo-1-chloroethane', [['H', 'CH3', 'Cl', 'Br']], 1], ['2-chloropentane', [['H', 'CH3', 'Cl', 'C3H7']], 1], ['3-chloropentane', [['H', 'C2H5', 'C2H5', 'Cl']], 0], ['2-bromo-3-chlorobutane', [['H', 'CH3', 'Br', 'CHClCH3'], ['H', 'CH3', 'Cl', 'CHBrCH3']], 2],
];
const orbits = (adj) => { // colour refinement on a tree gives the exact orbits of carbon atoms
  let c = adj.map(() => '0');
  for (let r = 0; r < adj.length; r++) c = adj.map((nb, i) => c[i] + '(' + nb.map((j) => c[j]).sort().join(',') + ')').map((s, _, a) => s);
  const map = new Map(); c.forEach((s) => { if (!map.has(s)) map.set(s, map.size); }); return adj.map((_, i) => map.get(c[i]));
};

export default {
  'c12c-halo-rate2': {
    title: 'rate of an SN2 reaction',
    make(r) {
      const rate0 = choose(r, [2, 3, 4, 5, 6]) * 1e-5, a = choose(r, [0.05, 0.1, 0.2, 0.4]), b = choose(r, [0.1, 0.2, 0.3, 0.5]), r1 = choose(r, [0.1, 0.2]), r2 = choose(r, [0.1, 0.2]);
      const rate = rate0 * (a / r1) * (b / r2);
      return { rate0, a, b, r1, r2, q: `<p>The hydrolysis of a primary bromide with OH<sup>−</sup> follows the SN2 mechanism. The initial rate is ${n(rate0 * 1e5)} × 10<sup>−5</sup> mol L<sup>−1</sup> s<sup>−1</sup> when [RBr] = ${r1} mol/L and [OH<sup>−</sup>] = ${r2} mol/L. Find the initial rate when [RBr] = ${a} mol/L and [OH<sup>−</sup>] = ${b} mol/L, in units of 10<sup>−5</sup> mol L<sup>−1</sup> s<sup>−1</sup>.</p>`, answer: rate * 1e5, unit: '× 10⁻⁵ mol L⁻¹ s⁻¹', tol: 0.01,
        hint: 'SN2 is second order: rate = k[RBr][OH⁻]. Find k from the first set, or use ratios.',
        solution: steps(`k = rate / ([RBr][OH⁻]) = ${n(rate0 * 1e5)}×10⁻⁵ / (${r1} × ${r2}) = ${n(rate0 / (r1 * r2) * 1e5)}×10⁻⁵ L mol⁻¹ s⁻¹.`, `New rate = k × ${a} × ${b} = <b>${n(rate * 1e5)} × 10⁻⁵</b> mol L⁻¹ s⁻¹.`) };
    },
    verify: (p) => { const k = p.rate0 / (p.r1 * p.r2); return k * p.a * p.b * 1e5; },
  },
  'c12c-halo-rate1': {
    title: 'rate of an SN1 reaction',
    make(r) {
      const rate0 = choose(r, [1, 2, 3, 4]) * 1e-5, c0 = choose(r, [0.1, 0.2]), c1 = choose(r, [0.05, 0.3, 0.4, 0.8]), nu0 = choose(r, [0.1, 0.5]), nu1 = choose(r, [0.2, 1.0, 2.0]);
      return { rate0, c0, c1, q: `<p>The hydrolysis of tert-butyl bromide in aqueous acetone follows the SN1 mechanism. At [RBr] = ${c0} mol/L and [OH<sup>−</sup>] = ${nu0} mol/L the rate is ${n(rate0 * 1e5)} × 10<sup>−5</sup> mol L<sup>−1</sup> s<sup>−1</sup>. What is the rate when [RBr] = ${c1} mol/L and [OH<sup>−</sup>] is raised to ${nu1} mol/L? Give your answer in units of 10<sup>−5</sup> mol L<sup>−1</sup> s<sup>−1</sup>.</p>`, answer: (rate0 * 1e5 * c1) / c0, unit: '× 10⁻⁵ mol L⁻¹ s⁻¹', tol: 0.01,
        hint: 'SN1 is first order in the haloalkane only: rate = k[RBr]. The nucleophile concentration does not appear in the rate law.',
        solution: steps(`rate = k[RBr], so k = ${n(rate0 * 1e5)}×10⁻⁵ / ${c0} = ${n(rate0 / c0 * 1e5)}×10⁻⁵ s⁻¹.`, `New rate = k × ${c1} = <b>${n(rate0 * 1e5 * c1 / c0)} × 10⁻⁵</b> mol L⁻¹ s⁻¹ (the OH⁻ change has no effect).`) };
    },
    verify: (p) => (p.rate0 / p.c0) * p.c1 * 1e5,
  },
  'c12c-halo-ee': {
    title: 'optical rotation of a mixture of enantiomers',
    make(r) {
      const sp = choose(r, [20, 30, 50, 66, 100]), pct = choose(r, [50, 60, 70, 80, 90, 100]);
      const val = (sp * (2 * pct - 100)) / 100;
      return { sp, pct, q: `<p>Pure (+)-enantiomer of a chiral haloalkane has a specific rotation of +${sp}°. A sample contains ${pct} % of the (+) form and the rest of the (−) form. What is the specific rotation of the sample, in degrees? (Enter a negative number if it rotates to the left.)</p>`, answer: val, unit: '°', tol: 0.01, abs: 0.01,
        hint: 'The (−) form rotates by the same angle in the opposite direction, so the net rotation is proportional to the difference of the two percentages.',
        solution: steps(`(+): ${pct} %, (−): ${100 - pct} %.`, `[α] = ${sp} × (${pct} − ${100 - pct}) / 100 = <b>${n(val)}°</b>.`, pct === 50 ? 'This is a racemic mixture: no net rotation.' : 'The excess of one form gives the net rotation.') };
    },
    verify: (p) => (p.sp * p.pct) / 100 - (p.sp * (100 - p.pct)) / 100,
  },
  'c12c-halo-mass': {
    title: 'mass of the major alkene',
    make(r) {
      const m = choose(r, [13.7, 27.4, 41.1, 68.5, 137]), frac = choose(r, [0.7, 0.81, 0.9]);
      const g = (m / 137) * frac * 56;
      return { m, frac, q: `<p>${m} g of 2-bromobutane (M = 137 g/mol) is heated with alcoholic KOH. All of it gives alkenes, and ${n(frac * 100)} % of the alkene (by moles) is but-2-ene (M = 56 g/mol). Find the mass of but-2-ene formed, in g.</p>`, answer: g, unit: 'g', tol: 0.01,
        hint: 'Moles of bromide = mass / 137; moles of but-2-ene = fraction × that; mass = moles × 56.',
        solution: steps(`n(2-bromobutane) = ${m}/137 = ${n(m / 137, 4)} mol.`, `n(but-2-ene) = ${frac} × ${n(m / 137, 4)} = ${n(frac * m / 137, 4)} mol.`, `Mass = ${n(frac * m / 137, 4)} × 56 = <b>${n(g)} g</b>.`) };
    },
    verify: (p) => 56 * p.frac * (p.m / 137),
  },
  'c12c-halo-isomc': {
    title: 'monochloro products of an alkane',
    make(r) {
      const [nm, adj, ans] = choose(r, ALK);
      return { adj, nm, q: `<p>How many different structural monochloro derivatives (C–H replaced by C–Cl) are possible from ${nm}? (Count constitutional isomers only; ignore stereoisomers.)</p>`, answer: ans, unit: '', tol: 0.01,
        hint: 'Count the different kinds of carbon that carry hydrogen: carbons related by symmetry give the same product.',
        solution: steps(`Group the carbons of ${nm} by symmetry.`, `Each group that carries at least one H gives one monochloro isomer: <b>${ans}</b>.`) };
    },
    verify: (p) => { const o = orbits(p.adj), seen = new Set(); p.adj.forEach((nb, i) => { if (nb.length < 4) seen.add(o[i]); }); return seen.size; },
  },
  'c12c-halo-stereo': {
    title: 'count the stereocentres',
    make(r) {
      const [nm, cs, ans] = choose(r, STC);
      return { cs, nm, q: `<p>How many stereocentres (carbon atoms with four different groups) does ${nm} contain? Use the groups: ${cs.map((c) => c.join(', ')).join(' and ')} (listed for each candidate carbon).</p>`, answer: ans, unit: '', tol: 0.01, abs: 0.01,
        hint: 'A stereocentre needs all four groups different. Check each listed carbon.',
        solution: steps(`${cs.map((c, i) => `Carbon ${i + 1}: groups ${c.join(', ')} → ${new Set(c).size === 4 ? 'all different, a stereocentre' : 'two alike, not a stereocentre'}`).join('<br>')}`, `Total: <b>${ans}</b>.`) };
    },
    verify: (p) => p.cs.filter((c) => new Set(c).size === 4).length,
  },
};
