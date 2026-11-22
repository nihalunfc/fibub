// Class 12 Chemistry, Chapter 5 Coordination Compounds: live problems (original fibub questions). Ids start with c12c-coord-.
import { choose, n, steps } from './_util.js';

// [formula, sum of ligand charges, charge on complex, metal]
const OX = [['[Fe(CN)<sub>6</sub>]<sup>4−</sup>', -6, -4, 'Fe'], ['[Fe(CN)<sub>6</sub>]<sup>3−</sup>', -6, -3, 'Fe'], ['[Co(NH<sub>3</sub>)<sub>6</sub>]<sup>3+</sup>', 0, 3, 'Co'], ['[Cr(H<sub>2</sub>O)<sub>4</sub>Cl<sub>2</sub>]<sup>+</sup>', -2, 1, 'Cr'], ['[Cu(NH<sub>3</sub>)<sub>4</sub>]<sup>2+</sup>', 0, 2, 'Cu'], ['[PtCl<sub>4</sub>]<sup>2−</sup>', -4, -2, 'Pt'], ['[Co(NH<sub>3</sub>)<sub>5</sub>Cl]<sup>2+</sup>', -1, 2, 'Co'], ['[Ni(CN)<sub>4</sub>]<sup>2−</sup>', -4, -2, 'Ni'], ['[Fe(C<sub>2</sub>O<sub>4</sub>)<sub>3</sub>]<sup>3−</sup>', -6, -3, 'Fe'], ['[Co(en)<sub>3</sub>]<sup>3+</sup>', 0, 3, 'Co']];
// formula, list of [count, denticity]
const CN = [['[Co(en)<sub>2</sub>Cl<sub>2</sub>]<sup>+</sup>', [[2, 2], [2, 1]]], ['[Co(en)<sub>3</sub>]<sup>3+</sup>', [[3, 2]]], ['[Fe(C<sub>2</sub>O<sub>4</sub>)<sub>3</sub>]<sup>3−</sup>', [[3, 2]]], ['[Co(NH<sub>3</sub>)<sub>4</sub>Cl<sub>2</sub>]<sup>+</sup>', [[4, 1], [2, 1]]], ['[Cr(EDTA)]<sup>−</sup>', [[1, 6]]], ['[Pt(en)Cl<sub>2</sub>]', [[1, 2], [2, 1]]], ['[Co(en)<sub>2</sub>(NH<sub>3</sub>)Cl]<sup>2+</sup>', [[2, 2], [1, 1], [1, 1]]], ['[Ni(en)<sub>2</sub>(H<sub>2</sub>O)<sub>2</sub>]<sup>2+</sup>', [[2, 2], [2, 1]]]];
const FIELD = [[6, 'strong'], [6, 'weak'], [5, 'strong'], [5, 'weak'], [4, 'strong'], [4, 'weak'], [7, 'strong'], [7, 'weak'], [3, 'weak'], [8, 'weak'], [2, 'weak'], [9, 'weak']];
const ISO = [['[Cr(H<sub>2</sub>O)<sub>6</sub>]Cl<sub>3</sub>', 3], ['[Cr(H<sub>2</sub>O)<sub>5</sub>Cl]Cl<sub>2</sub>·H<sub>2</sub>O', 2], ['[Cr(H<sub>2</sub>O)<sub>4</sub>Cl<sub>2</sub>]Cl·2H<sub>2</sub>O', 1]];
const split = (d, strong) => { // returns [t2g count, eg count, unpaired]
  let t = 0, e = 0;
  if (strong) { t = Math.min(d, 6); e = d - t; } else { const s = Math.min(d, 5); t = Math.min(s, 3); e = Math.max(0, s - 3); let r = d - s; const pt = Math.min(r, 3 - 0); t += Math.min(r, 3); r -= Math.min(r, 3); e += r; }
  return [t, e];
};
const unp = (t, e) => { const ut = t <= 3 ? t : 6 - t, ue = e <= 2 ? e : 4 - e; return ut + ue; };

export default {
  'c12c-coord-ox': {
    title: 'oxidation state of the metal in a complex',
    make(r) {
      const [f, lq, z, M] = choose(r, OX);
      return { lq, z, f, M, q: `<p>Find the oxidation state of ${M} in ${f}.</p>`, answer: z - lq, unit: '', tol: 0.01,
        hint: 'Charge on the complex = oxidation state of the metal + sum of the charges of the ligands. NH₃, H₂O, en and CO are neutral.',
        solution: steps(`Let the state of ${M} be x. The ligands carry a total charge of ${lq}.`, `x + (${lq}) = ${z}, so x = <b>${z - lq > 0 ? '+' : ''}${z - lq}</b>.`) };
    },
    verify: (p) => { for (let x = -3; x <= 9; x++) if (x + p.lq === p.z) return x; return NaN; },
  },
  'c12c-coord-cn': {
    title: 'coordination number of a complex',
    make(r) {
      const [f, parts] = choose(r, CN), cn = parts.reduce((s, [c, d]) => s + c * d, 0);
      return { parts, f, q: `<p>What is the coordination number of the metal in ${f}? (en and C₂O₄²⁻ are bidentate, EDTA is hexadentate, the rest are unidentate.)</p>`, answer: cn, unit: '', tol: 0.01,
        hint: 'Coordination number = number of donor atoms bonded to the metal = (number of ligands) × (their denticity), added up.',
        solution: steps(...parts.map(([c, d]) => `${c} ligand${c > 1 ? 's' : ''} × ${d} donor atom${d > 1 ? 's' : ''} = ${c * d}`), `Total = <b>${cn}</b>.`) };
    },
    verify: (p) => p.parts.map(([c, d]) => c * d).reduce((a, b) => a + b, 0),
  },
  'c12c-coord-mu': {
    title: 'magnetic moment of an octahedral complex',
    make(r) {
      const [d, f] = choose(r, FIELD), strong = f === 'strong', [t, e] = split(d, strong), un = unp(t, e), mu = Math.sqrt(un * (un + 2));
      return { d, f, q: `<p>An octahedral complex has a central ion with ${d} d electrons and a ${f}-field ligand. Find its spin-only magnetic moment in BM.</p>`, answer: mu, unit: 'BM', tol: 0.01, abs: 0.01,
        hint: 'Strong field: fill t₂g (6 places) completely before e_g. Weak field: one electron in each of the five orbitals first, then pair. Count the unpaired n; μ = √(n(n + 2)).',
        solution: steps(`${f} field: t₂g has ${t} and e_g has ${e} electrons.`, `Unpaired electrons n = ${un}.`, `μ = √(${un} × ${un + 2}) = <b>${n(mu)} BM</b>.`) };
    },
    verify: (p) => { // brute force: fill orbital energies explicitly
      const E = p.f === 'strong' ? [0, 0, 0, 10, 10] : [0, 0, 0, 1.0, 1.0], P = p.f === 'strong' ? 5 : 20; // pairing cost relative to gap
      // choose occupations to minimise energy + P * number of pairs
      let best = null;
      const rec = (i, left, occ) => { if (i === 5) { if (left) return; const en = occ.reduce((s, o, k) => s + o * E[k], 0) + P * occ.filter((o) => o === 2).length * 1; if (!best || en < best.en) best = { en, occ: [...occ] }; return; } for (let o = 0; o <= Math.min(2, left); o++) rec(i + 1, left - o, [...occ, o]); };
      rec(0, p.d, []);
      const un = best.occ.filter((o) => o === 1).length; return Math.sqrt(un * (un + 2));
    },
  },
  'c12c-coord-cfse': {
    title: 'crystal field stabilisation energy',
    make(r) {
      const [d, f] = choose(r, FIELD), [t, e] = split(d, f === 'strong'), c = -0.4 * t + 0.6 * e;
      return { t, e, d, f, q: `<p>Find the crystal field stabilisation energy, in units of Δ<sub>o</sub> (ignore the pairing energy), of an octahedral d<sup>${d}</sup> ion in a ${f} field.</p>`, answer: c, unit: 'Δo', tol: 0.01, abs: 0.01,
        hint: 'CFSE = (−0.4 × n(t₂g) + 0.6 × n(e_g)) Δo. Work out how many electrons are in t₂g and e_g first.',
        solution: steps(`${f} field: n(t₂g) = ${t}, n(e_g) = ${e}.`, `CFSE = (−0.4 × ${t} + 0.6 × ${e}) Δ<sub>o</sub> = <b>${n(c)} Δ<sub>o</sub></b>.`) };
    },
    verify: (p) => (-2 * p.t + 3 * p.e) / 5,
  },
  'c12c-coord-lam': {
    title: 'colour from the splitting energy',
    make(r) {
      const D = choose(r, [13000, 15200, 17400, 20000, 21600, 24000, 26600]);
      return { D, q: `<p>A complex has Δ<sub>o</sub> = ${D.toLocaleString('en-IN')} cm<sup>−1</sup>. At what wavelength, in nm, does it absorb its main d–d band?</p>`, answer: 1e7 / D, unit: 'nm', tol: 0.01,
        hint: 'Wavelength in nm = 10⁷ divided by the wavenumber in cm⁻¹ (since 1 cm = 10⁷ nm).',
        solution: steps(`λ = 1/ν̃ = 1 / ${D} cm = ${n(1 / D, 4)} cm.`, `In nm: ${n(1 / D, 4)} × 10⁷ = <b>${n(1e7 / D)} nm</b>.`) };
    },
    verify: (p) => { const h = 6.626e-34, c = 2.998e8, E = h * c * p.D * 100; return (h * c / E) * 1e9; },
  },
  'c12c-coord-agcl': {
    title: 'silver chloride from a hydrate isomer',
    make(r) {
      const [f, free] = choose(r, ISO), m = choose(r, [1.0, 2.0, 2.665, 5.33, 10.66]), g = (m / 266.5) * free * 143.5;
      return { m, free, f, q: `<p>${m} g of the chromium complex ${f} (molar mass 266.5 g/mol) is dissolved in water and excess AgNO<sub>3</sub> is added. Only the free chloride ions are precipitated. Find the mass of AgCl formed (molar mass 143.5 g/mol), in g.</p>`, answer: g, unit: 'g', tol: 0.01,
        hint: 'Moles of complex = mass / molar mass. Each mole releases as many moles of free Cl⁻ as there are Cl outside the brackets.',
        solution: steps(`Moles of complex = ${m} / 266.5 = ${n(m / 266.5, 4)} mol.`, `Free Cl⁻ per formula unit = ${free}, so moles of AgCl = ${n(m / 266.5 * free, 4)} mol.`, `Mass = ${n(m / 266.5 * free, 4)} × 143.5 = <b>${n(g)} g</b>.`) };
    },
    verify: (p) => (143.5 / 266.5) * p.m * p.free,
  },
};
