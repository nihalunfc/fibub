// Class 12 Chemistry, Chapter 4 The d- and f-Block Elements: live problems (original fibub questions). Ids start with c12c-dblock-.
import { choose, n, steps, tidyProblems } from './_util.js';

const unpaired = (d) => (d <= 5 ? d : 10 - d);
const ION = [['Ti³⁺', 22, 3, 1], ['V³⁺', 23, 3, 2], ['Cr³⁺', 24, 3, 3], ['Mn²⁺', 25, 2, 5], ['Fe²⁺', 26, 2, 6], ['Fe³⁺', 26, 3, 5], ['Co²⁺', 27, 2, 7], ['Ni²⁺', 28, 2, 8], ['Cu²⁺', 29, 2, 9], ['Mn³⁺', 25, 3, 4], ['Cr²⁺', 24, 2, 4]];
const SPEC = [['MnO<sub>4</sub><sup>−</sup>', 'Mn', 1, 4, -1, 7], ['Cr<sub>2</sub>O<sub>7</sub><sup>2−</sup>', 'Cr', 2, 7, -2, 6], ['CrO<sub>4</sub><sup>2−</sup>', 'Cr', 1, 4, -2, 6], ['MnO<sub>4</sub><sup>2−</sup>', 'Mn', 1, 4, -2, 6], ['VO<sub>2</sub><sup>+</sup>', 'V', 1, 2, 1, 5], ['Mn<sub>2</sub>O<sub>7</sub>', 'Mn', 2, 7, 0, 7], ['TiO<sub>2</sub>', 'Ti', 1, 2, 0, 4], ['Fe<sub>2</sub>O<sub>3</sub>', 'Fe', 2, 3, 0, 3], ['VO<sup>2+</sup>', 'V', 1, 1, 2, 4]];
const EV = [['Fe', -0.44], ['Zn', -0.76], ['Ni', -0.25], ['Co', -0.28], ['Cu', 0.34], ['Mn', -1.18], ['Cr', -0.91]];
const LN = [['Ce', 58], ['Pr', 59], ['Nd', 60], ['Sm', 62], ['Eu', 63], ['Gd', 64], ['Tb', 65], ['Dy', 66], ['Ho', 67], ['Er', 68], ['Tm', 69]];

export default tidyProblems({
  'c12c-dblock-mu': {
    title: 'spin-only magnetic moment of an ion',
    make(r) {
      const [nm, Z, q, d] = choose(r, ION), nn = unpaired(d), mu = Math.sqrt(nn * (nn + 2));
      return { Z, charge: q, q: `<p>Find the spin-only magnetic moment of ${nm} (atomic number ${Z}), in Bohr magnetons (BM).</p>`, answer: mu, unit: 'BM', tol: 0.01,
        hint: 'Write the configuration of the ion (4s electrons go first), count the unpaired 3d electrons n, then use μ = √(n(n + 2)).',
        solution: steps(`${nm} has ${Z} − ${q} = ${Z - q} electrons, that is [Ar] 3d<sup>${d}</sup>.`, `Unpaired electrons: n = ${nn}.`, `μ = √(${nn} × ${nn + 2}) = <b>${n(mu)} BM</b>.`) };
    },
    verify: (x) => { const d = x.Z - x.charge - 18, nn = d <= 5 ? d : 10 - d; return Math.sqrt(nn * (nn + 2)); },
  },
  'c12c-dblock-state': {
    title: 'oxidation state of the metal',
    make(r) {
      const [f, M, x, y, z, s] = choose(r, SPEC);
      return { x, y, z, f, q: `<p>What is the oxidation state of ${M} in ${f}? (Oxygen is −2.)</p>`, answer: s, unit: '', tol: 0.01,
        hint: 'The oxidation states add up to the charge on the species: x × (state of metal) + y × (−2) = charge.',
        solution: steps(`Let the state of ${M} be s: ${x}s + ${y}(−2) = ${z}.`, `${x}s = ${z + 2 * y}, so s = <b>+${s}</b>.`) };
    },
    verify: (p) => { for (let s = -3; s <= 9; s++) if (p.x * s - 2 * p.y === p.z) return s; return NaN; },
  },
  'c12c-dblock-dg': {
    title: 'does the metal dissolve in dilute acid?',
    make(r) {
      const [M, E] = choose(r, EV), dG = 2 * 96.485 * E;
      return { M, E, q: `<p>For the reaction ${M} + 2H<sup>+</sup> → ${M}<sup>2+</sup> + H<sub>2</sub>, E°(${M}<sup>2+</sup>/${M}) = ${E > 0 ? '+' : '−'}${Math.abs(E).toFixed(2)} V and E°(H<sup>+</sup>/H<sub>2</sub>) = 0. Find ΔG° in kJ/mol (F = 96 485 C/mol). A negative value means the metal dissolves.</p>`, answer: dG, unit: 'kJ/mol', tol: 0.01,
        hint: 'E°cell = E°(H⁺/H₂) − E°(M²⁺/M); then ΔG° = −nFE°cell with n = 2.',
        solution: steps(`E°cell = 0 − (${E.toFixed(2)}) = ${(-E).toFixed(2)} V.`, `ΔG° = −2 × 96485 × ${(-E).toFixed(2)} = ${n(dG * 1000)} J = <b>${n(dG)} kJ/mol</b>.`, dG < 0 ? `ΔG° is negative: ${M} dissolves in dilute acid.` : `ΔG° is positive: ${M} does not dissolve in dilute acid.`) };
    },
    verify: (x) => { const K = Math.exp((2 * 96485 * (0 - x.E)) / (8.314 * 298.15)); return (-8.314 * 298.15 * Math.log(K)) / 1000; },
  },
  'c12c-dblock-nfrom': {
    title: 'unpaired electrons from a magnetic moment',
    make(r) {
      const nn = choose(r, [1, 2, 3, 4, 5]), mu = +Math.sqrt(nn * (nn + 2)).toFixed(2);
      return { mu, q: `<p>A complex ion has a measured spin-only magnetic moment of ${mu} BM. How many unpaired electrons does it have?</p>`, answer: nn, unit: '', tol: 0.01,
        hint: 'Solve μ² = n(n + 2) for n, or try n = 1, 2, 3, 4, 5 and compare.',
        solution: steps(`μ² = ${n(mu * mu)}, so n² + 2n − ${n(mu * mu)} = 0.`, `n = −1 + √(1 + μ²) = −1 + √${n(1 + mu * mu)} = <b>${nn}</b>.`) };
    },
    verify: (x) => Math.round(-1 + Math.sqrt(1 + x.mu * x.mu)),
  },
  'c12c-dblock-flect': {
    title: 'unpaired 4f electrons in a lanthanoid ion',
    make(r) {
      const [s, Z] = choose(r, LN), f = Z - 57;
      const unp = f <= 7 ? f : 14 - f;
      return { Z, s, q: `<p>The atomic number of ${s} is ${Z}. How many unpaired electrons does the ion ${s}<sup>3+</sup> have? (Its configuration is [Xe] 4f<sup>n</sup>; each of the seven 4f orbitals takes one electron first.)</p>`, answer: unp, unit: '', tol: 0.01,
        hint: 'Ln³⁺ has Z − 3 electrons; subtract the 54 of xenon to get the 4f count. Seven 4f boxes fill singly, then pair.',
        solution: steps(`${s}³⁺ has ${Z} − 3 = ${Z - 3} electrons, so 4f<sup>${f}</sup> after the 54 of [Xe].`, f <= 7 ? `${f} ≤ 7, so all are single: <b>${f}</b> unpaired.` : `The first 7 are single, the other ${f - 7} pair up: 14 − ${f} = <b>${14 - f}</b> unpaired.`) };
    },
    verify: (x) => { const f = x.Z - 3 - 54; return Math.min(f, 14 - f); },
  },
}, ['c12c-dblock-state']);
