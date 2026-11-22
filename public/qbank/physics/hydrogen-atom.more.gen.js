// Extra question shapes for hydrogen-atom (templates qhy-m31..m35). Imported by hydrogen-atom.js.
import { int, choose, round, shuffle } from '../_util.js';
import { msqOf, pickMcq, factMcq } from './_more.js';

const LET = 'spdfgh';

export default [
  { id: 'qhy-m31', type: 'msq', level: 3, exams: ['gate', 'net', 'jam'], sub: 'quantum numbers and nodes', format: 'statements',
    make(r) {
      const n = int(r, 2, 4), l = int(r, 0, n - 1), m = int(r, -l, l);
      const rr = (3 * n * n - l * (l + 1)) / 2;
      const props = shuffle(r, [
        [`It has $${n - l - 1}$ radial node${n - l - 1 === 1 ? '' : 's'}`, `It has $${n - l}$ radial nodes`, `Radial nodes: $n - l - 1 = ${n - l - 1}$.`],
        [`It has $${l}$ angular nodal surface${l === 1 ? '' : 's'}`, `It has $${l + 1}$ angular nodal surfaces`, `Angular nodes equal $l = ${l}$.`],
        [`Its energy is $-13.6/${n * n}$ eV`, `Its energy is $-13.6/${(n - l) ** 2 === n * n ? n * n + 1 : (n - l) ** 2}$ eV`, `In the Coulomb problem $E_n = -13.6/n^2$ eV depends only on $n = ${n}$.`],
        [`$\\langle r\\rangle = ${round(rr, 2)}\\,a_0$`, `$\\langle r\\rangle = ${n * n}\\,a_0$`, `$\\langle r\\rangle = \\tfrac{a_0}{2}[3n^2 - l(l+1)] = ${round(rr, 2)}a_0$; $n^2a_0$ is only the Bohr-orbit radius.`],
        [`Its level (fixed $n$, ignoring spin) contains $${n * n}$ states`, `Its level (fixed $n$, ignoring spin) contains $${2 * n - 1}$ states`, `$\\sum_{l=0}^{n-1}(2l + 1) = n^2 = ${n * n}$.`],
        [`$|\\vec L| = \\sqrt{${l * (l + 1)}}\\,\\hbar$`, `$|\\vec L| = ${l + 1}\\hbar$`, `$|\\vec L| = \\sqrt{l(l+1)}\\hbar$ with $l = ${l}$.`],
      ]);
      const cands = props.map((p, i) => (i < 3 ? [p[0], true, p[2]] : [p[1], false, p[2]]));
      cands.push([l === 0 ? '$\\psi$ is non-zero at the nucleus' : '$\\psi$ vanishes at the nucleus', true, `Near $r = 0$, $R_{nl} \\propto r^l$; ${l === 0 ? 's states are finite there' : `with $l = ${l}$ it vanishes`}.`]);
      const not = r() < 0.4;
      const mm = msqOf(r, cands, { not });
      return { q: `An electron in hydrogen is in the state $\\psi_{${n},${l},${m}}$ (the ${n}${LET[l]} orbital with $m = ${m}$). Which statements are ${not ? '<b>NOT</b> correct' : 'correct'}?`, ...mm,
        trap: 'Total nodes $= n - 1$ split into $n - l - 1$ radial and $l$ angular; the energy ignores $l$ in pure Coulomb hydrogen.' };
    } },
  { id: 'qhy-m32', type: 'mcq', level: 3, exams: ['gate', 'net'], sub: 'radial probability', format: 'graph in words',
    make(r) {
      const S = [[1, 0], [2, 0], [2, 1], [3, 0], [3, 1], [3, 2], [4, 3], [4, 1]];
      const i = int(r, 0, S.length - 1), [n, l] = S[i];
      const lab = (s) => `${s[0]}${LET[s[1]]}`;
      const peaks = n - l;
      const o = pickMcq(r, lab(S[i]), S.filter((_, j) => j !== i).map(lab));
      return { q: `The radial probability density $P(r) = r^2|R_{nl}(r)|^2$ of a hydrogen state has ${peaks} maximum${peaks === 1 ? '' : 'a'} (with ${peaks - 1} zero${peaks - 1 === 1 ? '' : 's'} between $r = 0$ and $\\infty$) and rises from the nucleus as $r^{${2 * l + 2}}$. Which state is it?`, ...o,
        sol: `Near the nucleus $R_{nl} \\propto r^l$, so $P \\propto r^{2l+2}$: $2l + 2 = ${2 * l + 2}$ gives $l = ${l}$. The number of maxima is $n - l$ (one more than the $n - l - 1$ radial nodes): $n - ${l} = ${peaks}$ gives $n = ${n}$. The state is ${lab(S[i])}.`,
        trap: 'The $r^2$ in $P(r)$ adds two to the power: $P \\propto r^{2l+2}$, not $r^{2l}$.' };
    } },
  { id: 'qhy-m33', type: 'mcq', level: 2, exams: ['jam', 'gate', 'net'], sub: 'spectral lines', format: 'which transition',
    make(r) {
      const SER = ['Lyman', 'Balmer', 'Paschen', 'Brackett'];
      const tr = [];
      for (const nl of [1, 2, 3, 4]) for (let nu = nl + 1; nu <= nl + 4; nu++) tr.push([nu, nl]);
      const pickT = choose(r, tr);
      const lam = (t) => 1e9 / (1.09678e7 * (1 / t[1] ** 2 - 1 / t[0] ** 2));
      const L = lam(pickT);
      const lab = (t) => `$n = ${t[0]} \\to ${t[1]}$ (${SER[t[1] - 1]} series)`;
      const near = tr.filter((t) => t !== pickT).sort((a, b) => Math.abs(Math.log(lam(a) / L)) - Math.abs(Math.log(lam(b) / L))).slice(0, 6);
      const o = pickMcq(r, lab(pickT), near.map(lab));
      return { q: `Hydrogen emits a line of vacuum wavelength $${round(L, 1)}$ nm. Which transition produces it? (Take $R_H = 1.0968\\times10^7$ m$^{-1}$.)`, ...o,
        sol: `$\\dfrac{1}{\\lambda} = R_H\\left(\\dfrac{1}{n_l^2} - \\dfrac{1}{n_u^2}\\right)$. For $${pickT[0]} \\to ${pickT[1]}$: $\\tfrac{1}{${pickT[1] ** 2}} - \\tfrac{1}{${pickT[0] ** 2}} = ${round(1 / pickT[1] ** 2 - 1 / pickT[0] ** 2, 5)}$, so $\\lambda = 1/(1.0968\\times10^7\\times${round(1 / pickT[1] ** 2 - 1 / pickT[0] ** 2, 5)})$ m $= ${round(L, 1)}$ nm. ${L < 400 ? 'It is ultraviolet.' : L < 700 ? 'It is visible.' : 'It is infrared.'} The lower level fixes the series: Lyman ends on 1, Balmer on 2, Paschen on 3, Brackett on 4.`,
        trap: 'Series overlap in wavelength (Brackett and Paschen lines interleave in the infrared), so compute rather than guess from the region.' };
    } },
  { id: 'qhy-m34', type: 'mcq', level: 3, exams: ['gate', 'net'], sub: 'scaling with Z and mass', format: 'scaling',
    make(r) {
      const muonic = r() < 0.3;
      const Q = muonic ? choose(r, [
        ['the binding energy of the ground state', 1, 'E \\propto \\mu e^4/\\hbar^2'],
        ['the Bohr radius', -1, 'a \\propto \\hbar^2/\\mu e^2'],
        ['the probability density at the nucleus $|\\psi_{100}(0)|^2$', 3, '|\\psi(0)|^2 = 1/\\pi a^3 \\propto \\mu^3'],
        ['the wavelength of the Lyman-$\\alpha$ line', -1, '\\lambda \\propto 1/E \\propto 1/\\mu'],
      ]) : choose(r, [
        ['the ionisation energy of the ground state', 2, 'E_n = -Z^2\\,13.6\\text{ eV}/n^2'],
        ['$\\langle r\\rangle$ in the ground state', -1, '\\langle r\\rangle = 3a_0/2Z'],
        ['the wavelength of the $2 \\to 1$ line', -2, '\\lambda \\propto 1/\\Delta E \\propto Z^{-2}'],
        ['the electron density at the nucleus $|\\psi_{100}(0)|^2$', 3, '|\\psi_{100}(0)|^2 = Z^3/\\pi a_0^3'],
        ['the orbital speed in the Bohr model', 1, 'v = Z\\alpha c/n'],
        ['$\\langle 1/r\\rangle$ in the ground state', 1, '\\langle 1/r\\rangle = Z/a_0'],
        ['the fine-structure splitting of a given level', 4, '\\Delta E_{fs} \\propto \\alpha^2Z^4/n^3'],
      ]);
      const v = muonic ? '\\mu' : 'Z', sh = (k) => (k === 1 ? `$${v}$` : `$${v}^{${k}}$`);
      const o = pickMcq(r, sh(Q[1]), [-3, -2, -1, 1, 2, 3, 4].filter((k) => k !== Q[1]).map(sh));
      return { q: muonic
        ? `In "muonic hydrogen" a muon replaces the electron, so the reduced mass $\\mu$ is about 186 times larger. Keeping the charge fixed, ${Q[0]} scales as`
        : `For a hydrogen-like ion with nuclear charge $Ze$ (one electron), ${Q[0]} scales with $Z$ as`, ...o,
        sol: `$${Q[2]}$, so the dependence is ${sh(Q[1])}.${muonic ? ' Replace $m_e$ by the reduced mass everywhere: lengths shrink as $1/\\mu$ and energies grow as $\\mu$.' : ' Replace $e^2$ by $Ze^2$ in the hydrogen formulas: lengths scale as $1/Z$ and energies as $Z^2$.'}`,
        trap: 'Densities go as one over length cubed, so they pick up the cube of the length scaling.' };
    } },
  { id: 'qhy-m35', type: 'mcq', level: 3, exams: ['gate', 'net'], sub: 'good quantum numbers', format: 'which is NOT',
    make(r) {
      const C = choose(r, [
        ['the non-relativistic Coulomb Hamiltonian (spin included but no spin-orbit term)', ['$n$', '$l$', '$m_l$', '$m_s$'], ['$j$ (it is good too, but so is everything here)'], 'none', 'All of $n, l, m_l, m_s$ (and also $j$, $m_j$) are good because $H$ commutes with $\\vec L$ and $\\vec S$ separately.'],
        ['the fine-structure Hamiltonian (with spin-orbit coupling, no external field)', ['$n$', '$l$', '$j$', '$m_j$'], ['$m_l$', '$m_s$'], 'so', 'The spin-orbit term $\\vec L\\cdot\\vec S$ commutes with $L^2$, $S^2$, $J^2$, $J_z$ but not with $L_z$ or $S_z$ separately.'],
        ['the Paschen-Back regime (a strong magnetic field along $z$, spin-orbit neglected)', ['$n$', '$l$', '$m_l$', '$m_s$'], ['$j$'], 'pb', 'The field term $\\mu_B B(L_z + 2S_z)/\\hbar$ commutes with $L_z$ and $S_z$ but not with $J^2$.'],
        ['a weak magnetic field along $z$ (anomalous Zeeman regime, spin-orbit dominant)', ['$n$', '$l$', '$j$', '$m_j$'], ['$m_l$', '$m_s$'], 'wz', 'Spin-orbit coupling still dominates, so $J^2$ and $J_z$ are good; $L_z$ and $S_z$ are not.'],
        ['a uniform electric field along $z$ acting on the $n = 2$ level (Stark effect, fine structure ignored)', ['$n$ (to first order)', '$m_l$'], ['$l$', 'parity'], 'st', 'The field term $eEz$ commutes with $L_z$ (axial symmetry) but mixes $2s$ and $2p$ of opposite parity, so $l$ and parity are no longer good.'],
      ]);
      if (C[3] === 'none') {
        const o = pickMcq(r, 'none of these: all four are good quantum numbers', ['$n$', '$l$', '$m_l$', '$m_s$']);
        return { q: `For hydrogen described by ${C[0]}, which of these is <b>NOT</b> a good quantum number?`, ...o, sol: C[4],
          trap: 'Without spin-orbit coupling there is nothing to spoil $m_l$ and $m_s$.' };
      }
      const o = pickMcq(r, choose(r, C[2]), C[1].concat(C[1].length < 3 ? ['$m_s$'] : []));
      return { q: `For hydrogen described by ${C[0]}, which ONE of these is <b>NOT</b> a good quantum number?`, ...o, sol: C[4],
        trap: 'A quantum number is good when its operator commutes with the full Hamiltonian, not just with the unperturbed one.' };
    } },
];
