// Extra question shapes for fine-structure (templates hfs-m31..m35). Imported by fine-structure.js.
import { int, choose } from '../_util.js';
import { msqOf, pickMcq, factMcq, oomMcq } from './_more.js';

const LET = 'spdfg';
const J = (j2) => `${j2}/2`;
const lv = (n, l, j2) => `${n}${LET[l]}_{${J(j2)}}`;

export default [
  { id: 'hfs-m31', type: 'mcq', level: 3, exams: ['gate', 'net'], sub: 'Dirac degeneracy',
    make(r) {
      const n = int(r, 2, 4);
      const st = []; for (let l = 0; l < n; l++) for (const j2 of [2 * l - 1, 2 * l + 1]) if (j2 > 0) st.push([n, l, j2]);
      const pairs = []; for (const a of st) for (const b of st) if (a[1] < b[1] && a[2] === b[2]) pairs.push([a, b]);
      const c = choose(r, pairs);
      const lab = (a, b) => `$${lv(...a)}$ and $${lv(...b)}$`;
      const wrongs = [];
      for (const a of st) for (const b of st) if (a[1] === b[1] && a[2] < b[2]) wrongs.push(lab(a, b));
      for (const a of st) if (a[2] !== c[0][2]) wrongs.push(lab(c[0], a[1] > c[0][1] ? a : a).replace(/^/, ''));
      wrongs.push(`$${lv(...c[0])}$ and $${lv(n + 1, c[1][1], c[1][2])}$`);
      const lamb = r() < 0.4;
      const o = pickMcq(r, lab(...c), wrongs.filter((w) => w !== lab(...c) && !w.includes(`${lv(...c[0])}$ and $${lv(...c[0])}`)));
      return { q: lamb
        ? `In hydrogen, which ONE pair of levels is split <b>only</b> by the Lamb shift (they coincide in the Dirac theory)?`
        : `In the Dirac theory of hydrogen (no QED corrections), which ONE pair of levels is exactly degenerate?`, ...o,
        sol: `Dirac energies depend only on $n$ and $j$: $E_{nj} = mc^2\\left[1 + \\alpha^2/(n - j - \\tfrac12 + \\sqrt{(j + \\tfrac12)^2 - \\alpha^2})^2\\right]^{-1/2}$. So $${lv(...c[0])}$ and $${lv(...c[1])}$ (same $n = ${n}$, same $j = ${J(c[0][2])}$, different $l$) coincide. Pairs with different $j$ are split by fine structure, and different $n$ by the gross structure. QED (the Lamb shift) lifts the remaining $l$-degeneracy, most strongly for s states.`,
        trap: 'Same $n$ and same $l$ with different $j$ is a fine-structure doublet, not a degeneracy.' };
    } },
  { id: 'hfs-m32', type: 'msq', level: 3, exams: ['gate', 'net'], sub: 'fine-structure facts', format: 'statements',
    make(r) {
      const Z = int(r, 2, 6);
      const not = r() < 0.4;
      const m = msqOf(r, [
        [`For a hydrogen-like ion with $Z = ${Z}$, the fine-structure splitting of a given level is $${Z ** 4}$ times that of hydrogen`, true, `The splitting scales as $\\alpha^2Z^4/n^3$: $${Z}^4 = ${Z ** 4}$.`],
        [`For a hydrogen-like ion with $Z = ${Z}$, the fine-structure splitting of a given level is $${Z ** 2}$ times that of hydrogen`, false, `That is the scaling of the gross energies; fine structure goes as $Z^4 = ${Z ** 4}$.`],
        ['Fine-structure energies are smaller than the Bohr energies by a factor of order $\\alpha^2 \\approx 5\\times10^{-5}$', true, 'Relativistic corrections go as $(v/c)^2 \\sim (Z\\alpha)^2$.'],
        ['The spin-orbit term vanishes for s states', true, '$\\vec L\\cdot\\vec S = 0$ when $l = 0$.'],
        ['The Darwin term shifts only s states', true, 'It is proportional to $|\\psi(0)|^2$, non-zero only for $l = 0$.'],
        ['In hydrogen the $2p_{3/2}$ level lies below $2p_{1/2}$', false, 'Higher $j$ lies higher in hydrogen: $E_{nj}$ increases with $j$.'],
        ['The 21 cm line of hydrogen is a fine-structure transition', false, 'It is the hyperfine transition of the ground state (electron-proton spin coupling).'],
        ['The relativistic kinetic correction lowers every level', true, '$-p^4/8m^3c^2$ has a negative expectation value.'],
      ], { not });
      return { q: `Which statements about the fine structure of hydrogen-like atoms are ${not ? '<b>NOT</b> correct' : 'correct'}?`, ...m,
        trap: 'Gross structure scales as $Z^2$, fine structure as $Z^4$: heavy ions have large fine structure.' };
    } },
  { id: 'hfs-m33', type: 'mcq', level: 3, exams: ['gate', 'net'], sub: 'counting levels',
    make(r) {
      const n = int(r, 2, 6), lamb = r() < 0.5;
      const ans = lamb ? 2 * n - 1 : n;
      const o = pickMcq(r, `${ans}`, [n, 2 * n - 1, n * n, 2 * n * n, n - 1, 2 * n].filter((x) => x !== ans).map(String));
      return { q: `Into how many distinct energies does the $n = ${n}$ level of hydrogen split when ${lamb ? 'both fine structure and the Lamb shift are included (no external field, hyperfine ignored)' : 'fine structure is included as in the Dirac theory (no Lamb shift, no hyperfine)'}?`, ...o,
        sol: lamb
          ? `The Lamb shift separates levels with the same $j$ but different $l$, so every pair $(l, j)$ is distinct. For $n = ${n}$: $l = 0$ gives one $j$, each $l \\ge 1$ gives two, so $1 + 2(${n} - 1) = ${2 * n - 1}$ energies.`
          : `Dirac energies depend only on $n$ and $j$, and $j$ runs from $\\tfrac12$ to $n - \\tfrac12$: $${n}$ values, so $${n}$ distinct energies.`,
        trap: 'Counting $(l, j)$ pairs instead of $j$ values overcounts in the Dirac theory, where $l = j \\pm \\tfrac12$ coincide.' };
    } },
  { id: 'hfs-m34', type: 'mcq', level: 2, exams: ['gate', 'net', 'jam'], sub: 'energy scales', format: 'order of magnitude',
    make(r) {
      const C = choose(r, [
        ['the energy of the Lyman-$\\alpha$ ($2 \\to 1$) photon', 10.2, '$\\tfrac34\\times13.6$ eV.'],
        ['the fine-structure splitting between $2p_{1/2}$ and $2p_{3/2}$', 4.5e-5, '$\\alpha^2\\times13.6\\text{ eV}/16 \\approx 4.5\\times10^{-5}$ eV (10.9 GHz).'],
        ['the Lamb shift between $2s_{1/2}$ and $2p_{1/2}$', 4.37e-6, 'About 1058 MHz, i.e. $4.4\\times10^{-6}$ eV.'],
        ['the hyperfine splitting of the ground state (the 21 cm line)', 5.87e-6, '1420 MHz, i.e. $5.9\\times10^{-6}$ eV.'],
        ['the ionisation energy of the ground state', 13.6, '13.6 eV.'],
        ['the fine-structure splitting between $3p_{1/2}$ and $3p_{3/2}$', 1.34e-5, 'It scales as $1/n^3$ relative to $n = 2$: about $1.3\\times10^{-5}$ eV.'],
      ]);
      const o = oomMcq(r, C[1], 'eV');
      return { q: `In hydrogen, ${C[0]} is closest to`, ...o, sol: `${C[2]} The nearest power of ten is $10^{${o.k}}$ eV. Rough ladder: gross structure ~10 eV, fine structure ~$10^{-5}$-$10^{-4}$ eV, Lamb shift and hyperfine ~$10^{-6}$-$10^{-5}$ eV.`,
        trap: 'Fine structure is about $\\alpha^2 \\approx 1/19000$ of the gross energies; the Lamb shift is about ten times smaller still.' };
    } },
  { id: 'hfs-m35', type: 'mcq', level: 3, exams: ['gate', 'net'], sub: 'terms in the Hamiltonian', format: 'which is NOT',
    make(r) {
      const T = [
        ['The relativistic kinetic correction is $-p^4/8m^3c^2$', 'The next term in $\\sqrt{p^2c^2 + m^2c^4}$.'],
        ['The spin-orbit term is proportional to $\\vec L\\cdot\\vec S/r^3$', 'For the Coulomb potential $\\tfrac1r\\tfrac{dV}{dr} \\propto 1/r^3$.'],
        ['The Darwin term is proportional to $\\delta^3(\\vec r)$', 'It comes from the zitterbewegung smearing of the electron over its Compton wavelength.'],
        ['The three corrections together give an energy depending only on $n$ and $j$', 'The $l$-dependence cancels between the terms.'],
        ['The Thomas factor $\\tfrac12$ appears in the spin-orbit term', 'The electron rest frame rotates (Thomas precession).'],
      ];
      const F = [
        ['The Lamb shift is part of the Dirac equation solution', 'It is a QED effect (vacuum fluctuations), absent in the Dirac theory.'],
        ['The spin-orbit term is largest for s states', 'It vanishes for $l = 0$.'],
        ['The Darwin term acts on all states equally', 'Only s states have $\\psi(0) \\ne 0$.'],
        ['The relativistic kinetic correction raises every level', 'Its expectation value is negative.'],
      ];
      const not = r() < 0.65;
      const o = factMcq(r, T, F, not);
      return { q: `About the fine-structure Hamiltonian of hydrogen, which ONE statement is ${not ? '<b>NOT</b> correct' : 'correct'}?`, ...o,
        trap: 'Each correction alone depends on $l$; only their sum is $l$-independent.' };
    } },
];
