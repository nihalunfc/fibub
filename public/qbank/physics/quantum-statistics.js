// Bose-Einstein and Fermi-Dirac statistics: spin and statistics, counting microstates, mean occupations from the grand
// canonical ensemble, the classical limit, density of states in 1D/2D/3D, first quantum corrections to the ideal gas,
// exchange correlations, the 2D Fermi gas, simple many-orbital and Hubbard-atom models.
// Original questions for GATE and CSIR NET practice (fibub), MSc level.
import { pick, int, choose, mcqOptions, round, shuffle, C } from '../_util.js';
import more from './quantum-statistics.more.gen.js';

const kBe = 8.617333e-5;
const binom = (n, k) => { if (k < 0 || k > n) return 0; let r = 1; for (let i = 1; i <= k; i++) r = (r * (n - k + i)) / i; return Math.round(r); };
const occ = (x, s) => (s === 'FD' ? 1 / (Math.exp(x) + 1) : s === 'BE' ? 1 / (Math.exp(x) - 1) : Math.exp(-x));
const g32 = (z) => { let s = 0; for (let k = 1; k < 400; k++) s += z ** k / k ** 1.5; return s; };
const solveZ = (y) => { let a = 0, b = 1; for (let i = 0; i < 80; i++) { const m = (a + b) / 2; if (g32(m) < y) a = m; else b = m; } return (a + b) / 2; };
const sig = (x, n = 3) => Number(x.toPrecision(n));

export default {
  topic: 'quantum-statistics',
  items: [
    // ---- level 1 ----
    { id: 'qstat-001', type: 'mcq', level: 1, exams: ['gate', 'net'], sub: 'distributions',
      q: 'The mean occupation of a single-particle state of energy $\\varepsilon$ in an ideal Fermi gas at temperature $T$ and chemical potential $\\mu$ is',
      options: ['$\\dfrac{1}{e^{(\\varepsilon-\\mu)/kT} - 1}$', '$e^{-(\\varepsilon-\\mu)/kT}$', '$\\dfrac{1}{e^{(\\varepsilon-\\mu)/kT} + 1}$', '$\\dfrac{1}{e^{(\\varepsilon+\\mu)/kT} + 1}$'], answer: 2,
      sol: 'Fermi-Dirac: $\\langle n\\rangle = 1/(e^{\\beta(\\varepsilon-\\mu)} + 1)$, always between 0 and 1. The minus sign gives Bose-Einstein; the pure exponential is Maxwell-Boltzmann.' },
    { id: 'qstat-002', type: 'mcq', level: 1, exams: ['gate', 'net'], sub: 'distributions',
      q: 'The Bose-Einstein mean occupation of a state of energy $\\varepsilon$ is',
      options: ['$\\dfrac{1}{e^{(\\varepsilon-\\mu)/kT} - 1}$', '$\\dfrac{1}{e^{(\\varepsilon-\\mu)/kT} + 1}$', '$\\dfrac{1}{1 - e^{(\\varepsilon-\\mu)/kT}}$', '$e^{(\\varepsilon-\\mu)/kT} - 1$'], answer: 0,
      sol: 'From the grand sum over $n = 0, 1, 2, \\ldots$: $\\langle n\\rangle = 1/(e^{\\beta(\\varepsilon-\\mu)} - 1)$. It is positive only if $\\varepsilon > \\mu$; the third option is its negative.' },
    { id: 'qstat-003', type: 'mcq', level: 1, exams: ['gate', 'net'], sub: 'spin-statistics',
      q: 'Which of these obeys Bose-Einstein statistics?',
      options: ['An electron', 'A helium-3 atom', 'A neutron', 'A helium-4 atom'], answer: 3,
      sol: 'A composite particle is a boson if it contains an even number of fermions. $^4$He: 2 protons, 2 neutrons, 2 electrons (six fermions) — a boson. $^3$He has five fermions: a fermion. Electrons and neutrons have spin 1/2.' },
    { id: 'qstat-004', type: 'mcq', level: 1, exams: ['gate', 'net'], sub: 'distributions',
      q: 'At any temperature, the Fermi-Dirac occupation of a state whose energy equals the chemical potential is',
      options: ['0', '1/2', '1', '$1/e$'], answer: 1,
      sol: '$1/(e^0 + 1) = 1/2$. This is one way to define the Fermi level at $T > 0$.' },
    { id: 'qstat-005', type: 'mcq', level: 1, exams: ['gate', 'net'], sub: 'spin-statistics',
      q: 'The largest number of identical fermions that can occupy one single-particle quantum state (including its spin label) is',
      options: ['2', 'unlimited', '1', 'equal to $2s + 1$'], answer: 2,
      sol: 'The Pauli principle: an antisymmetric wavefunction vanishes if two fermions share a state. "Two per orbital" counts the two spin states of a spin-1/2 particle as separate states.',
      trap: 'Two electrons per orbital means one per spin state.' },
    { id: 'qstat-006', type: 'msq', level: 1, exams: ['gate', 'net'], sub: 'spin-statistics', format: 'multi',
      q: 'Which of the following are bosons?',
      options: ['A photon', 'A $^4$He atom', 'A $^3$He atom', 'A deuteron ($^2$H nucleus)'], answer: [0, 1, 3],
      sol: 'Photon: spin 1. $^4$He: six fermions, integer spin. Deuteron: proton + neutron, spin 1. $^3$He atom: five fermions, half-integer spin, a fermion (which is why its superfluidity needs pairing).' },

    // ---- level 2 ----
    { id: 'qstat-007', type: 'nat', level: 2, exams: ['gate', 'net'], sub: 'counting',
      q: 'Two identical bosons are placed in three single-particle states of equal energy. The number of distinct microstates is ______.',
      answer: 6, tol: 0, calc: () => binom(4, 2),
      sol: 'Bosons: only occupation numbers matter. Both in one state: 3 ways; in two different states: $\\binom32 = 3$ ways. Total 6 $= \\binom{3+2-1}{2}$. (Distinguishable: $3^2 = 9$; fermions: $\\binom32 = 3$.)' },
    { id: 'qstat-008', type: 'nat', level: 2, exams: ['gate', 'net'], sub: 'counting',
      q: 'Three identical bosons are distributed among four degenerate single-particle states. The number of microstates is ______.',
      answer: 20, tol: 0, calc: () => binom(6, 3),
      sol: 'Stars and bars: $\\binom{n + g - 1}{n} = \\binom{6}{3} = 20$.' },
    { id: 'qstat-009', type: 'nat', level: 2, exams: ['gate', 'net'], sub: 'counting',
      q: 'Three identical fermions are placed in five degenerate single-particle states (spin already included). The number of microstates is ______.',
      answer: 10, tol: 0, calc: () => binom(5, 3),
      sol: 'Each state holds 0 or 1: choose which 3 of 5 are full, $\\binom53 = 10$.' },
    { id: 'qstat-010', type: 'mcq', level: 2, exams: ['gate', 'net'], sub: 'classical limit',
      q: 'The Fermi-Dirac and Bose-Einstein distributions both reduce to the Maxwell-Boltzmann form when',
      options: ['$e^{(\\varepsilon - \\mu)/kT} \\gg 1$ for all states, i.e. all occupations are much less than 1', '$\\mu \\gg kT$', '$T \\to 0$', '$\\varepsilon = \\mu$'], answer: 0,
      sol: 'If the exponential dominates, the $\\pm1$ is negligible and $\\langle n\\rangle \\approx e^{-\\beta(\\varepsilon-\\mu)}$. This needs $-\\mu \\gg kT$, the same as $n\\lambda^3 \\ll 1$: dilute or hot.' },
    { id: 'qstat-011', type: 'nat', level: 2, exams: ['gate', 'net'], sub: 'distributions',
      q: 'For fermions, the mean occupation of a state lying $2kT$ above the chemical potential is ______.',
      answer: 0.119, tol: 0.002, calc: () => occ(2, 'FD'),
      sol: '$1/(e^2 + 1) = 1/8.389 = 0.119$. Maxwell-Boltzmann would give $e^{-2} = 0.135$.' },
    { id: 'qstat-012', type: 'nat', level: 2, exams: ['gate', 'net'], sub: 'distributions',
      q: 'For bosons, the mean occupation of a state lying $kT$ above the chemical potential is ______.',
      answer: 0.582, tol: 0.003, calc: () => occ(1, 'BE'),
      sol: '$1/(e - 1) = 0.582$. Compare MB $e^{-1} = 0.368$ and FD $1/(e + 1) = 0.269$: bosons crowd into states, fermions avoid each other.' },
    { id: 'qstat-013', type: 'mcq', level: 2, exams: ['gate', 'net'], sub: 'chemical potential',
      q: 'For an ideal Bose gas whose lowest single-particle energy is $\\varepsilon_0$, the chemical potential must satisfy',
      options: ['$\\mu > \\varepsilon_0$', '$\\mu \\le \\varepsilon_0$', '$\\mu = 0$ always', '$\\mu \\ge 0$'], answer: 1,
      sol: 'If $\\mu > \\varepsilon_0$, the ground-state occupation $1/(e^{\\beta(\\varepsilon_0-\\mu)} - 1)$ would be negative. So $\\mu \\le \\varepsilon_0$ (usually $\\mu \\le 0$ with $\\varepsilon_0 = 0$). Fermions have no such limit.' },
    { id: 'qstat-014', type: 'mcq', level: 2, exams: ['gate', 'net'], sub: 'distributions',
      q: 'The Fermi function $f(\\varepsilon) = 1/(e^{(\\varepsilon-\\mu)/kT} + 1)$ satisfies, for any $\\delta$,',
      options: ['$f(\\mu + \\delta) = f(\\mu - \\delta)$', '$f(\\mu + \\delta) + f(\\mu - \\delta) = 1$', '$f(\\mu + \\delta)f(\\mu - \\delta) = 1$', '$f(\\mu + \\delta) = 1/2 + \\delta/kT$'], answer: 1,
      sol: '$f(\\mu - \\delta) = 1/(e^{-x} + 1) = e^x/(1 + e^x) = 1 - f(\\mu + \\delta)$. The chance that a state $\\delta$ above $\\mu$ is full equals the chance a state $\\delta$ below is empty: the basis of electron-hole symmetry.' },
    { id: 'qstat-015', type: 'mcq', level: 2, exams: ['gate', 'net'], sub: 'density of states',
      q: 'For free non-relativistic particles in three dimensions, the single-particle density of states $g(\\varepsilon)$ is proportional to',
      options: ['$\\varepsilon^{-1/2}$', '$\\varepsilon^0$ (constant)', '$\\varepsilon$', '$\\varepsilon^{1/2}$'], answer: 3,
      sol: 'Number of states with $|\\mathbf k| < k$: $\\propto k^3 \\propto \\varepsilon^{3/2}$. Differentiating, $g(\\varepsilon) \\propto \\varepsilon^{1/2}$. Explicitly $g = \\frac{gV}{4\\pi^2}\\left(\\frac{2m}{\\hbar^2}\\right)^{3/2}\\sqrt\\varepsilon$ with $g$ the spin degeneracy.' },
    { id: 'qstat-016', type: 'mcq', level: 2, exams: ['gate', 'net'], sub: 'density of states',
      q: 'For free non-relativistic particles moving in two dimensions, the density of states is',
      options: ['proportional to $\\varepsilon$', 'independent of $\\varepsilon$', 'proportional to $\\varepsilon^{-1/2}$', 'proportional to $\\varepsilon^{1/2}$'], answer: 1,
      sol: 'States with $|\\mathbf k| < k$: $\\propto k^2 \\propto \\varepsilon$, so $g(\\varepsilon) = gAm/2\\pi\\hbar^2$, a constant. (1D gives $\\varepsilon^{-1/2}$.)' },
    { id: 'qstat-017', type: 'mcq', level: 2, exams: ['gate', 'net'], sub: 'chemical potential',
      q: 'The fugacity $z = e^{\\mu/kT}$ of an ideal Bose gas with ground-state energy zero lies in the range',
      options: ['$0 < z \\le 1$', '$z \\ge 1$', '$-1 < z < 1$', '$0 < z < \\infty$'], answer: 0,
      sol: '$\\mu \\le 0$ gives $z \\le 1$. $z \\to 1$ signals Bose-Einstein condensation; $z \\ll 1$ is the classical limit. For fermions $z$ can be any positive number.' },
    { id: 'qstat-018', type: 'nat', level: 2, exams: ['gate', 'net'], sub: 'classical limit',
      q: 'How far above $\\mu$, in units of $kT$, must a state lie for the Maxwell-Boltzmann occupation to exceed the Fermi-Dirac one by only 1%?',
      answer: 4.61, tol: 0.02, calc: () => Math.log(100),
      sol: '$n_{MB}/n_{FD} = e^{-x}(e^x + 1) = 1 + e^{-x}$. Setting $1 + e^{-x} = 1.01$ gives $x = \\ln100 = 4.61$.' },

    // ---- level 3 ----
    { id: 'qstat-019', type: 'mcq', level: 3, exams: ['gate', 'net'], sub: 'grand canonical',
      q: 'The grand partition function of a single fermion orbital of energy $\\varepsilon$ (spin ignored) is',
      options: ['$1/(1 - e^{-\\beta(\\varepsilon-\\mu)})$', '$1 + e^{-\\beta(\\varepsilon-\\mu)}$', '$e^{-\\beta(\\varepsilon-\\mu)}$', '$1 - e^{-\\beta(\\varepsilon-\\mu)}$'], answer: 1,
      sol: 'Occupation 0 or 1: $\\mathcal Z = 1 + e^{-\\beta(\\varepsilon-\\mu)}$. Then $\\langle n\\rangle = kT\\,\\partial\\ln\\mathcal Z/\\partial\\mu = 1/(e^{\\beta(\\varepsilon-\\mu)} + 1)$. The bosonic orbital gives the geometric series in the first option.' },
    { id: 'qstat-020', type: 'msq', level: 3, exams: ['gate', 'net'], sub: 'quantum corrections', format: 'statements',
      q: 'Compare ideal gases of spinless fermions, classical particles and spinless bosons with the same mass, density and temperature, with $n\\lambda^3$ small but not negligible. Which statements are correct?',
      options: ['The fermion gas has the highest pressure', 'The boson gas has the lowest pressure', 'The leading correction is $P/nkT = 1 \\pm n\\lambda^3/2^{5/2}$, plus for fermions', 'All three have the same pressure because they have the same $T$'], answer: [0, 1, 2],
      sol: 'Expanding in fugacity: $P/nkT = 1 \\pm 2^{-5/2}n\\lambda^3 + \\ldots$ (plus for fermions, minus for bosons). Exchange acts like an effective repulsion for fermions and attraction for bosons, even without forces.' },
    { id: 'qstat-021', type: 'nat', level: 3, exams: ['gate', 'net'], sub: 'quantum corrections',
      q: 'An ideal gas of spinless fermions has $n\\lambda^3 = 0.10$. To first order in $n\\lambda^3$, the ratio $P/nkT$ is ______.',
      answer: 1.0177, tol: 0.0004, calc: () => 1 + 0.1 / 2 ** 2.5,
      sol: '$P/nkT = 1 + n\\lambda^3/2^{5/2} = 1 + 0.10/5.657 = 1.0177$. With spin-1/2 ($g = 2$) the correction is halved, because the same density is spread over twice as many states.' },
    { id: 'qstat-022', type: 'nat', level: 3, exams: ['gate', 'net'], sub: 'density of states',
      q: 'The number of electron states (both spins) with kinetic energy below $1.0$ meV in a cube of volume $1.0\\ \\mu$m$^3$ is about ______ $\\times10^5$.',
      answer: 1.44, tol: 0.015, calc: () => 2 * 1e-18 * (2 * C.me * 1e-3 * C.e) ** 1.5 / (6 * Math.PI ** 2 * C.hbar ** 3) / 1e5,
      sol: '$N(\\varepsilon) = g\\frac{V}{6\\pi^2}\\left(\\frac{2m\\varepsilon}{\\hbar^2}\\right)^{3/2}$. $2m\\varepsilon = 2.92\\times10^{-52}$, so $k^3 = (2m\\varepsilon)^{3/2}/\\hbar^3 = 4.25\\times10^{24}$ m$^{-3}$ (since $k = 1.62\\times10^8$ m$^{-1}$). $N = 2\\times10^{-18}\\times4.25\\times10^{24}/59.2 \\approx 1.44\\times10^5$.' },
    { id: 'qstat-023', type: 'nat', level: 3, exams: ['gate', 'net'], sub: 'Bose occupation',
      q: 'In an ideal Bose gas the ground state ($\\varepsilon_0 = 0$) has $\\mu = -10^{-4}kT$. Its mean occupation is ______.',
      answer: 9999.5, tol: 5, calc: () => 1 / (Math.exp(1e-4) - 1),
      sol: '$\\langle n_0\\rangle = 1/(e^{10^{-4}} - 1) \\approx kT/|\\mu| - \\tfrac12 = 9999.5$. As $\\mu \\to 0^-$ the ground state can hold a macroscopic number: the seed of condensation.' },
    { id: 'qstat-024', type: 'msq', level: 3, exams: ['gate', 'net'], sub: 'entropy', format: 'statements',
      q: 'For ideal quantum gases with mean occupations $\\langle n_i\\rangle$, which entropy formulas are correct?',
      options: ['Fermions: $S = -k\\sum_i[\\langle n_i\\rangle\\ln\\langle n_i\\rangle + (1 - \\langle n_i\\rangle)\\ln(1 - \\langle n_i\\rangle)]$', 'Bosons: $S = k\\sum_i[(1 + \\langle n_i\\rangle)\\ln(1 + \\langle n_i\\rangle) - \\langle n_i\\rangle\\ln\\langle n_i\\rangle]$', 'Fully occupied or empty fermion states contribute no entropy', 'Bosons: $S = -k\\sum_i\\langle n_i\\rangle\\ln\\langle n_i\\rangle$ exactly'], answer: [0, 1, 2],
      sol: 'Counting $W = \\prod\\binom{g_i}{n_i}$ (fermions) or $\\prod\\binom{g_i + n_i - 1}{n_i}$ (bosons) and using Stirling gives the first two forms. At $T = 0$ every fermion state has $n = 0$ or $1$, and $0\\ln0 = 0$, so $S = 0$. The last form is only the classical limit.' },
    { id: 'qstat-025', type: 'nat', level: 3, exams: ['gate', 'net'], sub: 'distributions',
      q: 'In a metal at $300$ K, the probability that a state $0.10$ eV above the Fermi level is occupied is ______.',
      answer: 0.0205, tol: 0.0004, calc: () => occ(0.1 / (kBe * 300), 'FD'),
      sol: '$x = 0.10/0.02585 = 3.868$; $f = 1/(e^{3.868} + 1) = 1/48.9 = 0.0205$.' },
    { id: 'qstat-026', type: 'mcq', level: 3, exams: ['gate', 'net'], sub: 'grand canonical',
      q: 'For an ideal quantum gas with single-particle levels $\\varepsilon_i$, $\\ln\\mathcal Z = \\pm\\sum_i\\ln(1 \\pm e^{-\\beta(\\varepsilon_i - \\mu)})$ (upper sign fermions). The mean particle number is',
      options: ['$\\langle N\\rangle = kT\\,\\partial\\ln\\mathcal Z/\\partial\\mu$', '$\\langle N\\rangle = -\\partial\\ln\\mathcal Z/\\partial\\beta$', '$\\langle N\\rangle = \\ln\\mathcal Z$', '$\\langle N\\rangle = \\mu\\,\\partial\\ln\\mathcal Z/\\partial T$'], answer: 0,
      sol: '$\\langle N\\rangle = -\\partial\\Phi_G/\\partial\\mu$ with $\\Phi_G = -kT\\ln\\mathcal Z$, so $\\langle N\\rangle = kT\\,\\partial_\\mu\\ln\\mathcal Z = \\sum_i 1/(e^{\\beta(\\varepsilon_i-\\mu)} \\pm 1)$. $-\\partial_\\beta\\ln\\mathcal Z$ at fixed $z$ gives the energy, and $\\ln\\mathcal Z = PV/kT$.' },
    { id: 'qstat-027', type: 'nat', level: 3, exams: ['gate', 'net'], sub: 'distributions',
      q: 'For bosons, a state has mean occupation $0.5$. How far above $\\mu$ is it, in units of $kT$?',
      answer: 1.099, tol: 0.003, calc: () => Math.log(3),
      sol: '$1/(e^x - 1) = 0.5 \\Rightarrow e^x = 3 \\Rightarrow x = \\ln3 = 1.099$. (For fermions $\\langle n\\rangle = 0.5$ means $x = 0$.)' },
    { id: 'qstat-028', type: 'mcq', level: 3, exams: ['gate', 'net'], sub: 'symmetry',
      q: 'Two identical particles occupy two different orthonormal single-particle states $\\phi_a$ and $\\phi_b$. The probability density of finding both at the same point $x$ is',
      options: ['zero for bosons, doubled for fermions compared with distinguishable particles', 'the same for bosons, fermions and distinguishable particles', 'doubled for bosons and zero for (same-spin) fermions, compared with distinguishable particles', 'zero for both bosons and fermions'], answer: 2,
      sol: '$\\psi_\\pm = [\\phi_a(x_1)\\phi_b(x_2) \\pm \\phi_b(x_1)\\phi_a(x_2)]/\\sqrt2$. At $x_1 = x_2 = x$: $|\\psi_+|^2 = 2|\\phi_a\\phi_b|^2$ (bosons bunch), $|\\psi_-|^2 = 0$ (fermions anti-bunch). Distinguishable particles give $|\\phi_a\\phi_b|^2$.' },
    { id: 'qstat-029', type: 'nat', level: 3, exams: ['gate', 'net'], sub: 'counting',
      q: 'A group of 10 degenerate single-particle states holds 3 identical particles. The ratio of the number of microstates for bosons to that for fermions is ______.',
      answer: 1.833, tol: 0.003, calc: () => binom(12, 3) / binom(10, 3),
      sol: 'Bosons: $\\binom{12}{3} = 220$. Fermions: $\\binom{10}{3} = 120$. Ratio $1.833$. When $g \\gg n$ both tend to $g^n/n!$, the corrected Boltzmann count.' },
    { id: 'qstat-030', type: 'mcq', level: 3, exams: ['gate', 'net'], sub: 'chemical potential',
      q: 'For an ideal Fermi gas at fixed density, how does the chemical potential behave as the temperature rises from zero?',
      options: ['It stays equal to $E_F$', 'It rises above $E_F$', 'It falls, passing through zero and becoming large and negative in the classical regime', 'It jumps to zero'], answer: 2,
      sol: 'At $T = 0$, $\\mu = E_F$. Because $g(\\varepsilon) \\propto \\sqrt\\varepsilon$ rises, $\\mu$ must fall to keep $N$ fixed ($\\mu \\approx E_F[1 - \\tfrac{\\pi^2}{12}(T/T_F)^2]$). At high $T$, $\\mu \\to kT\\ln(n\\lambda^3/g) < 0$.' },

    // ---- level 4 ----
    { id: 'qstat-031', type: 'nat', level: 4, exams: ['gate', 'net'], sub: 'counting',
      q: 'Two identical bosons share two degenerate single-particle states, all microstates equally likely. The probability that both bosons are in the same state is ______.',
      answer: 0.667, tol: 0.003, calc: () => 2 / 3,
      sol: 'Boson microstates: (2,0), (0,2), (1,1): three, two of them "together", so $P = 2/3$. Distinguishable particles: $AB|\\,$, $|AB$, $A|B$, $B|A$: $P = 1/2$. Fermions: 0.' },
    { id: 'qstat-032', type: 'nat', level: 4, exams: ['gate', 'net'], sub: '2D Fermi gas',
      q: 'For an ideal two-dimensional Fermi gas the density of states is constant, which gives $\\mu = kT\\ln(e^{E_F/kT} - 1)$ exactly. At $kT = E_F$, $\\mu/E_F$ is ______.',
      answer: 0.541, tol: 0.003, calc: () => Math.log(Math.E - 1),
      sol: '$N = g_0\\int_0^\\infty d\\varepsilon/(e^{\\beta(\\varepsilon-\\mu)} + 1) = g_0kT\\ln(1 + e^{\\beta\\mu})$ and $N = g_0E_F$. So $e^{\\beta\\mu} = e^{\\beta E_F} - 1$. At $kT = E_F$: $\\mu = E_F\\ln(e - 1) = 0.541E_F$.' },
    { id: 'qstat-033', type: 'mcq', level: 4, exams: ['gate', 'net'], sub: 'Bose condensation',
      q: 'Why is there no Bose-Einstein condensation at $T > 0$ in an ideal Bose gas in two dimensions (in a box)?',
      options: ['Because 2D bosons are really fermions', 'Because with constant density of states, $\\int_0 d\\varepsilon/(e^{\\beta\\varepsilon} - 1)$ diverges, so excited states can hold any number of particles as $\\mu \\to 0$', 'Because the chemical potential is positive in 2D', 'Because the ground state is degenerate'], answer: 1,
      sol: 'Condensation happens when excited states saturate at $\\mu = 0$. In 3D, $\\int\\sqrt\\varepsilon\\,d\\varepsilon/(e^{\\beta\\varepsilon} - 1)$ is finite, so extra particles must go into the ground state. In 2D the integrand $\\sim 1/\\beta\\varepsilon$ near 0 makes the integral diverge: there is always room.' },
    { id: 'qstat-034', type: 'msq', level: 4, exams: ['gate', 'net'], sub: 'density of states', format: 'statements',
      q: 'Which density-of-states results are correct?',
      options: ['Non-relativistic particles in $d$ dimensions: $g(\\varepsilon) \\propto \\varepsilon^{d/2 - 1}$', 'Ultra-relativistic particles ($\\varepsilon = pc$) in 3D: $g(\\varepsilon) \\propto \\varepsilon^2$', 'Non-relativistic particles in 1D: $g(\\varepsilon) \\propto \\varepsilon^{-1/2}$', 'Particles in a 3D harmonic trap: $g(\\varepsilon) \\propto \\varepsilon^{1/2}$'], answer: [0, 1, 2],
      sol: '$N(<\\varepsilon) \\propto k^d \\propto \\varepsilon^{d/2}$, so $g \\propto \\varepsilon^{d/2-1}$: 1D $\\varepsilon^{-1/2}$, 2D constant, 3D $\\varepsilon^{1/2}$. With $\\varepsilon = pc$, $N \\propto \\varepsilon^3$ and $g \\propto \\varepsilon^2$ (photons). A 3D harmonic trap has levels $\\hbar\\omega(n_x + n_y + n_z)$, so $g \\propto \\varepsilon^2/2(\\hbar\\omega)^3$.' },
    { id: 'qstat-035', type: 'nat', level: 4, exams: ['gate', 'net'], sub: 'fugacity',
      q: 'For an ideal spinless Bose gas, $n\\lambda^3 = g_{3/2}(z) = z + z^2/2^{3/2} + z^3/3^{3/2} + \\ldots$. If $n\\lambda^3 = 0.20$, the fugacity $z$ is ______.',
      answer: 0.186, tol: 0.002, calc: () => solveZ(0.2),
      sol: 'Invert the series: $z \\approx y - y^2/2^{3/2} + \\ldots = 0.20 - 0.04/2.828 = 0.1859$; including higher terms gives $z \\approx 0.186$. The classical guess $z = n\\lambda^3 = 0.20$ overestimates it.' },
    { id: 'qstat-036', type: 'mcq', level: 4, exams: ['gate', 'net'], sub: 'counting',
      q: 'In the Bose-Einstein derivation, $n_i$ particles are placed in a group of $g_i$ states. The number of arrangements is',
      options: ['$g_i^{n_i}/n_i!$', '$\\dfrac{g_i!}{n_i!(g_i - n_i)!}$', '$\\dfrac{(n_i + g_i - 1)!}{n_i!(g_i - 1)!}$', '$g_i^{n_i}$'], answer: 2,
      sol: 'Line up $n_i$ particles and $g_i - 1$ partitions: $(n_i + g_i - 1)!/(n_i!(g_i - 1)!)$. The binomial $\\binom{g_i}{n_i}$ is the fermion count; $g_i^{n_i}$ is for distinguishable particles; $g_i^{n_i}/n_i!$ is the corrected Boltzmann count.' },
    { id: 'qstat-037', type: 'msq', level: 4, exams: ['gate', 'net'], sub: 'distributions', format: 'statements',
      q: 'At the same value of $x = (\\varepsilon - \\mu)/kT > 0$, which statements are correct?',
      options: ['$n_{BE} > n_{MB} > n_{FD}$', '$1/n_{FD} - 1/n_{BE} = 2$', 'All three agree to within 1% once $x > 5$', '$n_{BE}$ can exceed 1, $n_{FD}$ cannot'], answer: [0, 1, 2, 3],
      sol: '$1/n = e^x - 1,\\ e^x,\\ e^x + 1$ for BE, MB, FD: so $n_{BE} > n_{MB} > n_{FD}$ and $1/n_{FD} - 1/n_{BE} = 2$. At $x = 5$, $e^{-5} = 0.0067$, so the relative differences are below 1%. $n_{BE} = 1/(e^x - 1) > 1$ when $x < \\ln2$.' },
    { id: 'qstat-038', type: 'nat', level: 4, exams: ['gate', 'net'], sub: 'counting',
      q: 'Three particles occupy non-degenerate levels at $0$, $\\varepsilon$ and $2\\varepsilon$ with total energy $3\\varepsilon$. If the particles are distinguishable, how many microstates are there?',
      answer: 7, tol: 0, calc: () => 1 + 6,
      sol: 'Occupation sets $(n_0, n_1, n_2)$ with $n_0 + n_1 + n_2 = 3$ and $n_1 + 2n_2 = 3$: $(0,3,0)$ and $(1,1,1)$. Distinguishable: $(0,3,0)$ gives 1 way, $(1,1,1)$ gives $3! = 6$. Total 7. Bosons: 2. Spinless fermions: 1.' },

    // ---- level 5 ----
    { id: 'qstat-039', type: 'nat', level: 5, exams: ['gate', 'net'], sub: 'grand canonical',
      q: 'A single orbital at energy $0$ can hold an up and a down electron; double occupancy costs an extra energy $U$. With $\\mu = U/2$ and any temperature, the mean number of electrons on the orbital is ______.',
      answer: 1, tol: 0.001, calc: () => { const b = 3, U = 1, mu = 0.5; const Z = 1 + 2 * Math.exp(b * mu) + Math.exp(b * (2 * mu - U)); return (2 * Math.exp(b * mu) + 2 * Math.exp(b * (2 * mu - U))) / Z; },
      sol: '$\\mathcal Z = 1 + 2e^{\\beta\\mu} + e^{\\beta(2\\mu - U)}$. At $\\mu = U/2$ the empty and doubly occupied terms are both 1: $\\mathcal Z = 2 + 2e^{\\beta U/2}$ and $\\langle n\\rangle = (2e^{\\beta U/2} + 2)/(2 + 2e^{\\beta U/2}) = 1$: half filling by particle-hole symmetry.' },
    { id: 'qstat-040', type: 'msq', level: 5, exams: ['gate', 'net'], sub: 'correlations', format: 'statements',
      q: 'Which statements about exchange correlations in ideal quantum gases are correct?',
      options: ['Photons from a thermal source arrive bunched in time (Hanbury Brown–Twiss effect)', 'For an ideal Fermi gas the pair correlation of same-spin particles vanishes at zero separation', 'Exchange correlations extend over about a thermal wavelength', 'Exchange correlations require an interaction potential between the particles'], answer: [0, 1, 2],
      sol: 'Symmetrisation alone doubles the joint probability for bosons at the same point and removes it for same-spin fermions, over distances $\\sim\\lambda$ (or $1/k_F$ when degenerate). No forces are needed; the effect is purely statistical, and gives the effective attraction/repulsion of the virial correction.' },
    { id: 'qstat-041', type: 'mcq', level: 5, exams: ['gate', 'net'], sub: 'counting',
      q: 'In the derivation of the distributions, $\\ln W$ is maximised with $\\sum n_i = N$ and $\\sum n_i\\varepsilon_i = E$ fixed, with multipliers $\\alpha$ and $\\beta$. For fermions this yields $n_i/g_i = 1/(e^{\\alpha + \\beta\\varepsilon_i} + 1)$. The physical meaning of $\\alpha$ is',
      options: ['$\\alpha = -\\mu/kT$', '$\\alpha = \\mu/kT$', '$\\alpha = 1/kT$', '$\\alpha = \\ln N$'], answer: 0,
      sol: 'Comparing $\\partial S/\\partial N = -\\mu/T$ with $\\partial(k\\ln W)/\\partial N = k\\alpha$ gives $\\alpha = -\\mu/kT$, so $e^{\\alpha + \\beta\\varepsilon} = e^{(\\varepsilon - \\mu)/kT}$.' },
    { id: 'qstat-042', type: 'nat', level: 5, exams: ['gate', 'net'], sub: 'quantum corrections',
      q: 'For an ideal spin-1/2 Fermi gas ($g = 2$) the first quantum correction is $P/nkT = 1 + n\\lambda^3/(g\\,2^{5/2})$. For electrons at $T = 10^5$ K and $n = 10^{27}$ m$^{-3}$, the correction term is ______.',
      answer: 0.00116, tol: 0.00002, calc: () => { const l = C.h / Math.sqrt(2 * Math.PI * C.me * C.kB * 1e5); return 1e27 * l ** 3 / (2 * 2 ** 2.5); },
      sol: '$\\lambda = h/\\sqrt{2\\pi m_ekT} = 6.626\\times10^{-34}/\\sqrt{2\\pi\\times9.109\\times10^{-31}\\times1.381\\times10^{-18}} = 2.36\\times10^{-10}$ m, $\\lambda^3 = 1.31\\times10^{-29}$ m$^3$. $n\\lambda^3 = 10^{27}\\times1.31\\times10^{-29} = 0.0131$. Correction $= 0.0131/(2\\times5.657) = 0.00116$: a 0.1% rise in pressure. (Here $1.381\\times10^{-18}$ is $kT$ in joules.)' },
    { id: 'qstat-043', type: 'mcq', level: 3, exams: ['gate', 'net'], sub: 'density of states',
      q: 'Free electrons are confined to a long thin wire, so they move in one dimension only. Their density of states $g(\\varepsilon)$ is proportional to',
      options: ['$\\varepsilon^{1/2}$', 'a constant', '$\\varepsilon$', '$\\varepsilon^{-1/2}$'], answer: 3,
      sol: 'In 1D the number of states with $|k| < k_0$ is $\\propto k_0 \\propto \\sqrt\\varepsilon$, so $g = dN/d\\varepsilon \\propto \\varepsilon^{-1/2}$. It diverges at the band bottom (the van Hove singularity of nanowires).' },
    { id: 'qstat-044', type: 'msq', level: 2, exams: ['gate', 'net'], sub: 'distributions', format: 'multi',
      q: 'Which statements about the Fermi-Dirac function $f(\\varepsilon)$ at temperature $T > 0$ are correct?',
      options: ['$0 < f < 1$ for every finite $\\varepsilon$', 'It falls from nearly 1 to nearly 0 over a width of a few $kT$ around $\\mu$', '$-\\partial f/\\partial\\varepsilon$ is a peak of area 1 centred on $\\mu$', '$f(\\varepsilon)$ is larger for higher $\\varepsilon$'], answer: [0, 1, 2],
      sol: 'The exponential is positive and finite, so $f$ is strictly between 0 and 1. It changes from 0.9 to 0.1 between $\\mu \\mp 2.2kT$. $-\\partial f/\\partial\\varepsilon$ is a symmetric bump of height $1/4kT$ whose integral is $f(-\\infty) - f(\\infty) = 1$; it becomes a delta function at $T = 0$. $f$ decreases with energy.' },
    { id: 'qstat-045', type: 'msq', level: 4, exams: ['gate', 'net'], sub: 'grand canonical', format: 'statements',
      q: 'For an ideal quantum gas in a 3D box with $g(\\varepsilon) \\propto \\sqrt\\varepsilon$, which relations hold for both bosons and fermions?',
      options: ['$PV = \\tfrac23U$', '$PV = kT\\ln\\mathcal Z$', '$U = \\tfrac32NkT$ exactly at every temperature', 'In an adiabatic (isentropic) change, $PV^{5/3}$ is constant'], answer: [0, 1, 3],
      sol: 'With $\\varepsilon \\propto V^{-2/3}$ for every level, $P = -\\langle\\partial E/\\partial V\\rangle = \\tfrac23U/V$ whatever the statistics. $\\ln\\mathcal Z = PV/kT$ always. Isentropic means fixed occupations, so $U \\propto V^{-2/3}$ and $PV^{5/3}$ is constant. But $U = \\tfrac32NkT$ only in the classical limit; a degenerate Fermi gas has $U \\to \\tfrac35NE_F$ at $T = 0$.' },
  ],
  gens: [
    { id: 'qstat-g01', type: 'nat', level: 2, exams: ['gate', 'net'], sub: 'counting',
      make(r) {
        const g = int(r, 2, 8), n = int(r, 2, Math.min(4, g)), s = choose(r, ['bosons', 'fermions', 'distinguishable particles']);
        const W = s === 'bosons' ? binom(n + g - 1, n) : s === 'fermions' ? binom(g, n) : g ** n;
        const how = s === 'bosons' ? `stars and bars, $\\binom{n + g - 1}{n} = \\binom{${n + g - 1}}{${n}}$` : s === 'fermions' ? `at most one per state, $\\binom{g}{n} = \\binom{${g}}{${n}}$` : `each particle picks any state, $g^n = ${g}^${n}$`;
        return { q: `$${n}$ ${s === 'distinguishable particles' ? 'distinguishable particles' : `identical ${s}`} are placed in $${g}$ degenerate single-particle states. How many microstates are there?`,
          answer: W, tol: 0, g, n, s,
          sol: `For ${s}: ${how} $= ${W}$. (Compare bosons ${binom(n + g - 1, n)}, fermions ${binom(g, n)}, distinguishable ${g ** n}.)` };
      },
      verify: (p) => (p.s === 'bosons' ? binom(p.n + p.g - 1, p.n) : p.s === 'fermions' ? binom(p.g, p.n) : p.g ** p.n) },
    { id: 'qstat-g02', type: 'nat', level: 2, exams: ['gate', 'net'], sub: 'distributions',
      make(r) {
        const x = choose(r, [0.1, 0.25, 0.5, 1, 1.5, 2, 3]), s = choose(r, ['FD', 'BE', 'MB']);
        const n = occ(x, s), name = { FD: 'Fermi-Dirac', BE: 'Bose-Einstein', MB: 'Maxwell-Boltzmann' }[s];
        return { q: `A state lies $${x}\\,kT$ above the chemical potential. Its mean occupation under ${name} statistics is ______.`,
          answer: round(n, 4), tol: Math.max(0.002, round(n * 0.01, 4)), x, s,
          sol: `${name}: $\\langle n\\rangle = ${s === 'FD' ? '1/(e^x + 1)' : s === 'BE' ? '1/(e^x - 1)' : 'e^{-x}'}$ with $x = ${x}$, giving $${round(n, 4)}$. (FD ${round(occ(x, 'FD'), 4)}, MB ${round(occ(x, 'MB'), 4)}, BE ${round(occ(x, 'BE'), 4)}.)` };
      },
      verify: (p) => occ(p.x, p.s) },
    { id: 'qstat-g03', type: 'nat', level: 2, exams: ['gate', 'net'], sub: 'distributions',
      make(r) {
        const d = choose(r, [-0.2, -0.1, -0.05, 0.02, 0.05, 0.1, 0.15, 0.2]), T = choose(r, [77, 300, 500, 1000]);
        const f = occ(d / (kBe * T), 'FD');
        return { q: `In a metal at $${T}$ K, what is the probability that an electron state $${Math.abs(d)}$ eV ${d > 0 ? 'above' : 'below'} the Fermi level is occupied?`,
          answer: sig(f, 4), tol: Math.max(1e-6, sig(f * 0.01, 2)), d, T,
          sol: `$x = (E - E_F)/kT = ${d}/${round(kBe * T, 5)} = ${round(d / (kBe * T), 3)}$. $f = 1/(e^x + 1) \\approx ${sig(f, 4)}$.` };
      },
      verify: (p) => occ(p.d / (kBe * p.T), 'FD') },
    { id: 'qstat-g04', type: 'nat', level: 3, exams: ['gate', 'net'], sub: 'distributions',
      make(r) {
        const x = choose(r, [0.2, 0.5, 1, 2, 3]), [a, b] = choose(r, [['BE', 'FD'], ['BE', 'MB'], ['MB', 'FD']]);
        const ratio = occ(x, a) / occ(x, b);
        return { q: `For a state $${x}\\,kT$ above $\\mu$, the ratio of the ${a} occupation to the ${b} occupation is ______.`,
          answer: round(ratio, 4), tol: Math.max(0.002, round(ratio * 0.005, 4)), x, a, b,
          sol: `$1/n_{BE} = e^x - 1$, $1/n_{MB} = e^x$, $1/n_{FD} = e^x + 1$ with $e^{${x}} = ${round(Math.exp(x), 4)}$. Ratio $= ${round(occ(x, a), 5)}/${round(occ(x, b), 5)} \\approx ${round(ratio, 4)}$.` };
      },
      verify: (p) => occ(p.x, p.a) / occ(p.x, p.b) },
    { id: 'qstat-g05', type: 'nat', level: 3, exams: ['gate', 'net'], sub: 'density of states',
      make(r) {
        const [name, m, g] = choose(r, [['electrons (spin 1/2)', C.me, 2], ['neutrons (spin 1/2)', C.mn, 2], ['spinless bosons of mass $4$ u', 4.0026 * C.u, 1]]), E = choose(r, [0.1, 1, 10]), L = choose(r, [0.1, 1, 10]);
        const N = g * (L * 1e-6) ** 3 * (2 * m * E * 1e-3 * C.e) ** 1.5 / (6 * Math.PI ** 2 * C.hbar ** 3);
        return { q: `How many single-particle states for ${name} with kinetic energy below $${E}$ meV fit in a cube of side $${L}\\ \\mu$m? (Give the number; scientific notation is fine.)`,
          answer: sig(N, 3), tol: sig(N * 0.015, 2), m, g, E, L,
          sol: `$N = g\\frac{V}{6\\pi^2}\\left(\\frac{2m\\varepsilon}{\\hbar^2}\\right)^{3/2}$ with $g = ${g}$, $V = ${sig((L * 1e-6) ** 3, 3)}$ m$^3$: $N \\approx ${sig(N, 3)}$.` };
      },
      verify: (p) => p.g * (p.L * 1e-6) ** 3 * (2 * p.m * p.E * 1e-3 * C.e) ** 1.5 / (6 * Math.PI ** 2 * C.hbar ** 3) },
    { id: 'qstat-g06', type: 'nat', level: 3, exams: ['gate', 'net'], sub: 'quantum corrections',
      make(r) {
        const y = choose(r, [0.02, 0.05, 0.1, 0.2]), s = choose(r, ['fermions', 'bosons']), g = choose(r, [1, 2]);
        const v = 1 + (s === 'fermions' ? 1 : -1) * y / (g * 2 ** 2.5);
        return { q: `An ideal gas of ${s} with spin degeneracy $g = ${g}$ has $n\\lambda^3 = ${y}$. To first order, $P/nkT$ is ______.`,
          answer: round(v, 5), tol: 0.0002, y, s, g,
          sol: `$P/nkT = 1 ${s === 'fermions' ? '+' : '-'} \\frac{n\\lambda^3}{g\\,2^{5/2}} = 1 ${s === 'fermions' ? '+' : '-'} \\frac{${y}}{${g}\\times5.657} = ${round(v, 5)}$.`,
          trap: 'Fermions push harder (plus sign), bosons less (minus).' };
      },
      verify: (p) => 1 + (p.s === 'fermions' ? 1 : -1) * p.y / (p.g * 2 ** 2.5) },
    { id: 'qstat-g07', type: 'mcq', level: 2, exams: ['gate', 'net'], sub: 'spin-statistics',
      make(r) {
        const F = ['a $^3$He atom', 'a proton', 'a neutron', 'a muon', 'a $^6$Li atom', 'a $^{40}$K atom', 'a neutrino', 'a $^{13}$C nucleus', 'a triton ($^3$H nucleus)'];
        const B = ['a $^4$He atom', 'a photon', 'a deuteron', 'a $^{87}$Rb atom', 'a $^{23}$Na atom', 'a Cooper pair', 'a pion', 'an $\\alpha$ particle', 'a $^7$Li atom', 'a phonon'];
        const want = choose(r, ['Fermi-Dirac', 'Bose-Einstein']);
        const [good, bad] = want === 'Fermi-Dirac' ? [F, B] : [B, F];
        const right = choose(r, good), ws = shuffle(r, bad).slice(0, 3);
        const o = mcqOptions(r, right, ws);
        return { q: `Which of the following obeys ${want} statistics?`, options: o.options, answer: o.answer,
          sol: `Count the elementary fermions (protons, neutrons, electrons, quarks, leptons): an odd number makes a fermion, an even number a boson. ${right[0].toUpperCase() + right.slice(1)} is a ${want === 'Fermi-Dirac' ? 'fermion' : 'boson'}; the other three are ${want === 'Fermi-Dirac' ? 'bosons' : 'fermions'}. (Neutral atoms: count neutrons, since protons and electrons pair up; $^{87}$Rb, $^{23}$Na, $^7$Li have even neutron numbers.)` };
      } },
    { id: 'qstat-g08', type: 'nat', level: 3, exams: ['gate', 'net'], sub: 'distributions',
      make(r) {
        const s = choose(r, ['FD', 'BE']), n = s === 'FD' ? choose(r, [0.01, 0.05, 0.1, 0.25, 0.4, 0.75, 0.9]) : choose(r, [0.01, 0.1, 0.5, 1, 2, 5, 10]);
        const x = Math.log(1 / n + (s === 'FD' ? -1 : 1));
        return { q: `Under ${s === 'FD' ? 'Fermi-Dirac' : 'Bose-Einstein'} statistics a state has mean occupation $${n}$. What is $(\\varepsilon - \\mu)/kT$ for it?`,
          answer: round(x, 4), tol: 0.003, s, n,
          sol: `Invert: $e^x = 1/n ${s === 'FD' ? '-' : '+'} 1 = ${round(1 / n + (s === 'FD' ? -1 : 1), 4)}$, so $x = ${round(x, 4)}$.${x < 0 ? ' Negative: the state lies below $\\mu$.' : ''}` };
      },
      verify: (p) => Math.log(1 / p.n + (p.s === 'FD' ? -1 : 1)) },
    { id: 'qstat-g09', type: 'nat', level: 4, exams: ['gate', 'net'], sub: '2D Fermi gas',
      make(r) {
        const t = choose(r, [0.1, 0.2, 0.3, 0.5, 0.7, 1, 1.5, 2]);
        const mu = t * Math.log(Math.exp(1 / t) - 1);
        return { q: `An ideal two-dimensional Fermi gas is at $T = ${t}\\,T_F$. Its chemical potential, in units of $E_F$, is ______.`,
          answer: round(mu, 4), tol: 0.003, t,
          sol: `Constant density of states gives $N = g_0kT\\ln(1 + e^{\\mu/kT})$ and $N = g_0E_F$, so $\\mu = kT\\ln(e^{E_F/kT} - 1) = ${t}\\ln(e^{${round(1 / t, 4)}} - 1) \\approx ${round(mu, 4)}\\,E_F$.${mu < 0 ? ' It has turned negative: the gas is becoming classical.' : ''}` };
      },
      verify: (p) => p.t * Math.log(Math.exp(1 / p.t) - 1) },
    { id: 'qstat-g10', type: 'nat', level: 3, exams: ['gate', 'net'], sub: 'Bose occupation',
      make(r) {
        const e = choose(r, [2, 3, 4, 5, 6]), c = choose(r, [1, 2, 5]);
        const a = c * 10 ** -e, n = 1 / (Math.exp(a) - 1);
        return { q: `The ground state ($\\varepsilon_0 = 0$) of an ideal Bose gas has $\\mu = -${c}\\times10^{-${e}}\\,kT$. Its mean occupation is ______.`,
          answer: sig(n, 5), tol: Math.max(1, sig(n * 0.001, 2)), a,
          sol: `$\\langle n_0\\rangle = 1/(e^{${c}\\times10^{-${e}}} - 1) \\approx kT/|\\mu| - \\tfrac12 \\approx ${sig(n, 5)}$.` };
      },
      verify: (p) => 1 / (Math.exp(p.a) - 1) },
    { id: 'qstat-g11', type: 'nat', level: 5, exams: ['gate', 'net'], sub: 'grand canonical',
      make(r) {
        const U = choose(r, [1, 2, 4]), muf = choose(r, [0.25, 0.75, 1.25, -0.25]), bU = choose(r, [2, 4, 8]);
        const mu = muf * U, b = bU / U;
        const Z = 1 + 2 * Math.exp(b * mu) + Math.exp(b * (2 * mu - U)), n = (2 * Math.exp(b * mu) + 2 * Math.exp(b * (2 * mu - U))) / Z;
        return { q: `An orbital at energy $0$ holds up to two electrons (up and down), with an extra energy $U = ${U}$ eV when doubly occupied. With $\\mu = ${round(mu, 3)}$ eV and $U/kT = ${bU}$, the mean occupation is ______.`,
          answer: round(n, 4), tol: 0.003, U, mu, b,
          sol: `$\\mathcal Z = 1 + 2e^{\\beta\\mu} + e^{\\beta(2\\mu - U)} = 1 + 2e^{${round(b * mu, 3)}} + e^{${round(b * (2 * mu - U), 3)}} = ${round(Z, 4)}$. $\\langle n\\rangle = [2e^{\\beta\\mu} + 2e^{\\beta(2\\mu - U)}]/\\mathcal Z \\approx ${round(n, 4)}$.` };
      },
      verify: (p) => { const Z = 1 + 2 * Math.exp(p.b * p.mu) + Math.exp(p.b * (2 * p.mu - p.U)); return (2 * Math.exp(p.b * p.mu) + 2 * Math.exp(p.b * (2 * p.mu - p.U))) / Z; } },
    ...more,
  ],
};
