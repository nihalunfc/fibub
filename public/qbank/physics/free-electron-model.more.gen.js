// Extra question shapes for free-electron-model (templates fem-m31..m35). Imported by free-electron-model.js.
import { choose, round, fmt } from '../_util.js';
import { msqOf, pickMcq, factMcq, oomMcq } from './_more.js';

const HB = 1.054571817e-34, ME = 9.1093837e-31, QE = 1.602176634e-19, KB = 1.380649e-23;

export default [
  { id: 'fem-m31', type: 'mcq', level: 2, exams: ['gate', 'net', 'jam'], sub: 'which model explains it', format: 'match the system',
    make(r) {
      const O = { dr: 'the Drude model (classical free electrons with collisions)', so: 'the Sommerfeld model (free electrons obeying Fermi-Dirac statistics)', bt: 'band theory (electrons in a periodic potential)', bcs: 'none of these: it needs electron pairing (BCS theory)' };
      const C = choose(r, [
        ['Ohm\'s law, with $\\sigma = ne^2\\tau/m$', 'dr', 'A classical picture of electrons accelerated by the field and randomised by collisions is enough.'],
        ['the electronic heat capacity of a metal being about 1% of $\\tfrac32Nk_B$ at room temperature', 'so', 'Only electrons within about $k_BT$ of $E_F$ can be excited, a fraction of order $T/T_F$.'],
        ['the small, temperature-independent (Pauli) spin susceptibility of simple metals', 'so', 'Only electrons near $E_F$ can flip their spins, so $\\chi \\propto g(E_F)$, not $1/T$.'],
        ['the positive Hall coefficient of aluminium and beryllium', 'bt', 'Free-electron models always give $R_H = -1/ne$; hole-like carriers need band structure.'],
        ['why diamond is an insulator although it has four valence electrons per atom', 'bt', 'Filled bands separated by a gap carry no current.'],
        ['the very long mean free paths (hundreds of lattice spacings) in pure metals at low temperature', 'bt', 'Bloch states are exact eigenstates of a perfect periodic lattice: electrons are scattered only by defects and phonons, not by the ions themselves.'],
        ['zero resistance and the Meissner effect below a critical temperature', 'bcs', 'Superconductivity needs an attractive interaction that pairs electrons, beyond any one-electron model.'],
      ]);
      const o = pickMcq(r, O[C[1]], Object.keys(O).filter((k) => k !== C[1]).map((k) => O[k]));
      return { q: `Which is the simplest model that correctly explains ${C[0]}?`, ...o, sol: C[2],
        trap: 'Drude got the Wiedemann-Franz ratio roughly right by luck: two errors (heat capacity and speed) cancel.' };
    } },
  { id: 'fem-m32', type: 'msq', level: 2, exams: ['gate', 'net', 'jam'], sub: 'Fermi quantities', format: 'statements',
    make(r) {
      const M = choose(r, [['copper', 8.47], ['sodium', 2.65], ['silver', 5.86], ['aluminium', 18.1], ['potassium', 1.40], ['gold', 5.90], ['lithium', 4.70]]);
      const n = M[1] * 1e28, kF = Math.cbrt(3 * Math.PI ** 2 * n), EF = HB ** 2 * kF ** 2 / (2 * ME), vF = HB * kF / ME;
      const eV = EF / QE, TF = EF / KB;
      const not = r() < 0.4;
      const m = msqOf(r, [
        [`$k_F = (3\\pi^2n)^{1/3} = ${fmt(kF, 3)}$ m$^{-1}$`, true, 'Two spin states per $k$ point fill a sphere: $n = k_F^3/3\\pi^2$.'],
        [`$k_F = (\\pi^2n)^{1/3} = ${fmt(Math.cbrt(Math.PI ** 2 * n), 3)}$ m$^{-1}$`, false, 'The factor 3 comes from the sphere volume $\\tfrac43\\pi k_F^3$ and the two spin states.'],
        [`$E_F = ${round(eV, 2)}$ eV`, true, `$E_F = \\hbar^2k_F^2/2m$.`],
        [`$E_F = ${round(eV * 2 ** (2 / 3), 2)}$ eV`, false, `This forgets the spin degeneracy; the correct value is $${round(eV, 2)}$ eV.`],
        [`$v_F = ${fmt(vF, 3)}$ m/s, about ${round(vF / 3e8 * 100, 2)}% of the speed of light`, true, '$v_F = \\hbar k_F/m$.'],
        [`$T_F = ${fmt(TF, 3)}$ K, far above the melting point`, true, '$T_F = E_F/k_B$; the electron gas is highly degenerate at room temperature.'],
        ['$E_F$ is proportional to $n^{1/3}$', false, '$E_F \\propto k_F^2 \\propto n^{2/3}$.'],
        ['At $T = 0$ the average electron energy is $\\tfrac35E_F$', true, 'Averaging $E$ over a $\\sqrt E$ density of states.'],
      ], { not });
      return { q: `In ${M[0]} the conduction-electron density is $${M[1]}\\times10^{28}$ m$^{-3}$. Treat the electrons as a free-electron gas. Which statements are ${not ? '<b>NOT</b> correct' : 'correct'}?`, ...m,
        trap: 'Remember both spin states: $n = k_F^3/3\\pi^2$.' };
    } },
  { id: 'fem-m33', type: 'mcq', level: 2, exams: ['gate', 'net'], sub: 'density of states and dimension', format: 'graph in words',
    make(r) {
      const O = { sqrt: 'rises as $\\sqrt{E}$ from the band bottom', flat: 'is constant (a step at the band bottom)', inv: 'diverges as $1/\\sqrt{E}$ at the band bottom and then falls', stair: 'a staircase of equal steps, one at each subband energy', saw: 'a series of $1/\\sqrt{E - E_n}$ spikes, one at each subband energy', delta: 'a set of sharp, separate lines (delta functions)' };
      const C = choose(r, [
        ['a free-electron gas in a bulk metal (3D)', 'sqrt', '$g(E) \\propto k^2\\,dk/dE \\propto \\sqrt E$.'],
        ['a single 2D electron gas with one subband occupied', 'flat', 'In 2D, $g(E) = m/\\pi\\hbar^2$ per area, independent of $E$.'],
        ['electrons in a single 1D channel', 'inv', 'In 1D, $g(E) \\propto dk/dE \\propto 1/\\sqrt E$.'],
        ['a quantum well (free in 2D, confined in 1D) with several subbands', 'stair', 'Each confined level adds a constant 2D density of states.'],
        ['a quantum wire (free in 1D, confined in 2D) with several subbands', 'saw', 'Each subband adds a 1D density of states, diverging at its edge.'],
        ['a quantum dot (confined in all three directions)', 'delta', 'With no free direction the levels are discrete.'],
      ]);
      const o = pickMcq(r, O[C[1]], Object.keys(O).filter((k) => k !== C[1]).map((k) => O[k]));
      return { q: `For non-interacting electrons with $E = \\hbar^2k^2/2m$ in each free direction, the density of states $g(E)$ of ${C[0]}`, ...o, sol: `${C[2]} In $d$ free dimensions $g(E) \\propto E^{d/2 - 1}$.`,
        trap: 'Lowering the dimension sharpens the density of states: $\\sqrt E$, step, spike, line.' };
    } },
  { id: 'fem-m34', type: 'mcq', level: 3, exams: ['gate', 'net'], sub: 'plasma frequency and optics', format: 'which is NOT',
    make(r) {
      const T = [
        ['A free-electron metal reflects light below $\\omega_p$ and becomes transparent above it', 'For $\\omega < \\omega_p$, $\\varepsilon < 0$ and waves are evanescent.'],
        ['$\\omega_p = \\sqrt{ne^2/\\varepsilon_0m}$', 'From $\\varepsilon(\\omega) = 1 - \\omega_p^2/\\omega^2$.'],
        ['For typical metals $\\hbar\\omega_p$ is several eV, so $\\omega_p$ lies in the ultraviolet', 'Alkali metals are transparent in the UV.'],
        ['Doped semiconductors have plasma frequencies in the infrared', 'Their carrier densities are many orders lower than in metals.'],
        ['Plasmons are quantised collective oscillations of the electron gas', 'Seen as energy-loss peaks of fast electrons.'],
      ];
      const F = [
        ['A free-electron metal is transparent below $\\omega_p$ and reflects above it', 'It is the other way round.'],
        ['$\\omega_p$ is proportional to the electron density $n$', '$\\omega_p \\propto \\sqrt n$.'],
        ['For typical metals $\\omega_p$ lies in the microwave range', 'It is in the ultraviolet ($\\hbar\\omega_p \\approx 5$ to 15 eV).'],
        ['Below $\\omega_p$ the dielectric function of the free-electron gas is positive', '$1 - \\omega_p^2/\\omega^2 < 0$ there.'],
      ];
      const not = r() < 0.65;
      const o = factMcq(r, T, F, not);
      return { q: `About the plasma frequency $\\omega_p$ of a free-electron gas, which ONE statement is ${not ? '<b>NOT</b> correct' : 'correct'}?`, ...o,
        trap: 'Metals are shiny because visible light is below $\\omega_p$; they turn transparent in the ultraviolet.' };
    } },
  { id: 'fem-m35', type: 'mcq', level: 3, exams: ['gate', 'net'], sub: 'mean free path', format: 'order of magnitude',
    make(r) {
      const S = choose(r, [
        ['copper at 300 K', 8.47e28, 1.57e6, 1.7e-8], ['copper at 77 K', 8.47e28, 1.57e6, 2.0e-9], ['very pure copper at 4 K', 8.47e28, 1.57e6, 2.0e-11],
        ['sodium at 300 K', 2.65e28, 1.07e6, 4.8e-8], ['aluminium at 300 K', 1.81e29, 2.03e6, 2.7e-8], ['silver at 300 K', 5.86e28, 1.39e6, 1.6e-8],
      ]);
      const tau = ME / (S[1] * QE ** 2 * S[3]), l = S[2] * tau;
      const o = oomMcq(r, l, 'm');
      return { q: `For ${S[0]} take $n = ${fmt(S[1], 3)}$ m$^{-3}$, $v_F = ${fmt(S[2], 3)}$ m/s and resistivity $${fmt(S[3], 2)}$ Ω m. The electron mean free path is closest to`, ...o,
        sol: `Drude: $\\tau = m/ne^2\\rho = ${fmt(tau, 3)}$ s. The electrons that carry current move at $v_F$, so $\\ell = v_F\\tau = ${fmt(l, 3)}$ m, nearest $10^{${o.k}}$ m, about ${+(l / 2.5e-10).toPrecision(2)} spacings of a typical 2.5 Å lattice.`,
        trap: 'Use $v_F$, not the classical thermal speed (about $10^5$ m/s), which underestimates $\\ell$ by an order of magnitude.' };
    } },
];
