// Extra question shapes for fermi-gas (templates fgas-m31..m35). Imported by fermi-gas.js.
import { choose, round, fmt } from '../_util.js';
import { msqOf, pickMcq, factMcq, oomMcq } from './_more.js';

export default [
  { id: 'fgas-m31', type: 'mcq', level: 3, exams: ['gate', 'net'], sub: 'dimension dependence', format: 'scaling',
    make(r) {
      const dos = r() < 0.4;
      if (dos) {
        const d = choose(r, [1, 2, 3]);
        const A = { 1: '$E^{-1/2}$', 2: '$E^{0}$ (constant)', 3: '$E^{1/2}$' };
        const o = pickMcq(r, A[d], [...Object.values(A).filter((x) => x !== A[d]), '$E$', '$E^{3/2}$']);
        return { q: `For free non-relativistic particles in ${d} dimension${d > 1 ? 's' : ''}, the density of states $g(E)$ is proportional to`, ...o,
          sol: `The number of states below $E$ grows as $k^d \\propto E^{d/2}$; differentiating gives $g(E) \\propto E^{d/2 - 1}$, i.e. ${A[d]}.`,
          trap: 'The 2D density of states is flat, which is why the 2D Fermi energy is simply proportional to $n$.' };
      }
      const C = choose(r, [[3, 8, '4'], [3, 27, '9'], [3, 64, '16'], [2, 3, '3'], [2, 5, '5'], [1, 2, '4'], [1, 3, '9']]);
      const [d, k, ans] = C;
      const o = pickMcq(r, ans, [`${k}`, `${k * k}`, d === 3 ? `${round(Math.sqrt(k), 2)}` : `${round(k ** (2 / 3), 2)}`, `${round(k ** (1 / 3), 2)}`, `${2 * k}`].filter((x) => x !== ans));
      return { q: `An ideal gas of spin-$\\tfrac12$ fermions in ${d} dimension${d > 1 ? 's' : ''} has its number density multiplied by ${k} (same particles). Its Fermi energy is multiplied by`, ...o,
        sol: `In $d$ dimensions $n \\propto k_F^d$ and $E_F \\propto k_F^2$, so $E_F \\propto n^{2/d}$. Here $${k}^{2/${d}} = ${ans}$.`,
        trap: 'The familiar $n^{2/3}$ is the 3D result; in 2D it is $n^1$ and in 1D $n^2$.' };
    } },
  { id: 'fgas-m32', type: 'msq', level: 3, exams: ['gate', 'net', 'jam'], sub: 'ground state of the Fermi gas', format: 'statements',
    make(r) {
      const EF = round(1 + 9 * r(), 1);
      const not = r() < 0.4;
      const m = msqOf(r, [
        [`The mean energy per particle is $${round(0.6 * EF, 2)}$ eV`, true, `$\\langle E\\rangle = \\tfrac35E_F = ${round(0.6 * EF, 2)}$ eV.`],
        [`The mean energy per particle is $${round(0.5 * EF, 2)}$ eV`, false, `It is $\\tfrac35E_F = ${round(0.6 * EF, 2)}$ eV, not $E_F/2$.`],
        ['The pressure is $\\tfrac25nE_F$, even at $T = 0$', true, '$P = \\tfrac23U/V = \\tfrac23\\cdot\\tfrac35nE_F$.'],
        ['The pressure vanishes at $T = 0$', false, 'Degeneracy pressure remains.'],
        ['The entropy is zero', true, 'A single microstate: the filled Fermi sphere.'],
        ['On slight warming, the heat capacity grows linearly in $T$', true, 'Only a fraction $\\sim T/T_F$ of the particles, within $kT$ of $E_F$, can be excited.'],
        ['On slight warming, the chemical potential rises above $E_F$', false, 'In 3D, $\\mu = E_F[1 - \\tfrac{\\pi^2}{12}(T/T_F)^2]$ decreases.'],
        [`The fastest electrons move at $v_F = \\sqrt{2E_F/m}$, about $${fmt(Math.sqrt(2 * EF * 1.602e-19 / 9.109e-31), 2)}$ m/s here`, true, `$\\sqrt{2\\times${EF}\\times1.602\\times10^{-19}/9.109\\times10^{-31}}$.`],
      ], { not });
      return { q: `A 3D ideal electron gas has $E_F = ${EF}$ eV and is at $T = 0$ (unless stated otherwise). Which statements are ${not ? '<b>NOT</b> correct' : 'correct'}?`, ...m,
        trap: 'At $T = 0$ the Fermi gas is far from motionless: its mean energy is $\\tfrac35E_F$ and it exerts pressure.' };
    } },
  { id: 'fgas-m33', type: 'mcq', level: 2, exams: ['gate', 'net', 'jam'], sub: 'occupation curves', format: 'graph in words',
    make(r) {
      const O = {
        step: 'a sharp step: 1 below $E_F$, 0 above',
        smear: 'a step rounded over a few $kT$ around $\\mu \\approx E_F$, passing through $\\tfrac12$ at $\\mu$, with the rest unchanged',
        mb: 'nearly a decaying exponential, with every occupation much less than 1',
        flat: '$\\tfrac12$ at all energies',
      };
      const C = choose(r, [
        ['$T = 0$', 'step', 'At $T = 0$ all states up to $E_F$ are filled.'],
        [`$T = ${choose(r, [0.005, 0.01, 0.02])}\\,T_F$`, 'smear', 'For $T \\ll T_F$ only states within a few $kT$ of $\\mu$ change occupation; $f(\\mu) = \\tfrac12$.'],
        [`$T = ${choose(r, [10, 20, 50])}\\,T_F$`, 'mb', 'For $T \\gg T_F$ the chemical potential is large and negative, so $f \\approx e^{-(E - \\mu)/kT} \\ll 1$: the classical limit.'],
      ]);
      const o = pickMcq(r, O[C[1]], Object.keys(O).filter((k) => k !== C[1]).map((k) => O[k]));
      return { q: `For an ideal 3D Fermi gas at ${C[0]}, the occupation $f(E)$ as a function of energy is`, ...o, sol: C[2],
        trap: 'The occupation never becomes flat at $\\tfrac12$: at high $T$ the chemical potential drops so that the total number stays fixed.' };
    } },
  { id: 'fgas-m34', type: 'mcq', level: 2, exams: ['gate', 'net'], sub: 'Fermi temperatures', format: 'order of magnitude',
    make(r) {
      const S = choose(r, [
        ['conduction electrons in copper ($n = 8.5\\times10^{28}$ m$^{-3}$)', 8.5e28, 9.109e-31],
        ['conduction electrons in sodium ($n = 2.5\\times10^{28}$ m$^{-3}$)', 2.5e28, 9.109e-31],
        ['liquid helium-3 atoms ($n = 1.6\\times10^{28}$ m$^{-3}$, $m = 3$ u; treat as spin-$\\tfrac12$ ideal gas)', 1.6e28, 3 * 1.6605e-27],
        ['a trapped cloud of potassium-40 atoms ($n = 10^{19}$ m$^{-3}$, two spin states)', 1e19, 40 * 1.6605e-27],
        ['neutrons in a nucleus ($n = 0.8\\times10^{44}$ m$^{-3}$)', 0.8e44, 1.675e-27],
        ['electrons in a white dwarf ($n = 10^{35}$ m$^{-3}$, non-relativistic formula)', 1e35, 9.109e-31],
      ]);
      const EF = (1.0546e-34 ** 2 / (2 * S[2])) * (3 * Math.PI ** 2 * S[1]) ** (2 / 3), TF = EF / 1.380649e-23;
      const o = oomMcq(r, TF, 'K');
      return { q: `Using $E_F = \\dfrac{\\hbar^2}{2m}(3\\pi^2n)^{2/3}$, the Fermi temperature of ${S[0]} is closest to`, ...o,
        sol: `$(3\\pi^2n)^{2/3} = ${fmt((3 * Math.PI ** 2 * S[1]) ** (2 / 3), 3)}$ m$^{-2}$, so $E_F = ${fmt(EF, 3)}$ J and $T_F = E_F/k = ${fmt(TF, 2)}$ K, nearest $10^{${o.k}}$ K.`,
        trap: 'Heavier particles have much lower Fermi temperatures at the same density ($T_F \\propto 1/m$).' };
    } },
  { id: 'fgas-m35', type: 'mcq', level: 2, exams: ['gate', 'net', 'jam'], sub: 'consequences of degeneracy', format: 'which is NOT',
    make(r) {
      const T = [
        ['The electronic heat capacity of a metal is far below $\\tfrac32Nk$ at room temperature', 'Only electrons within $kT$ of $E_F$ can absorb heat: a fraction $\\sim T/T_F$.'],
        ['The spin susceptibility of a simple metal is nearly independent of temperature (Pauli)', 'Only electrons near $E_F$ can flip, again a fraction $\\sim T/T_F$, cancelling the Curie $1/T$.'],
        ['Conduction electrons move at about $10^6$ m/s even at $T = 0$', 'That is the Fermi velocity.'],
        ['Electron degeneracy pressure supports white dwarf stars', 'Pauli exclusion resists compression.'],
      ];
      const F = [
        ['The spin susceptibility of a simple metal follows the Curie law $\\chi \\propto 1/T$', 'Curie behaviour is for localised, non-degenerate moments; metals show Pauli paramagnetism.'],
        ['The electronic heat capacity of a metal is $\\tfrac32Nk$ at room temperature', 'This classical value is about 100 times too large.'],
        ['The mean speed of conduction electrons vanishes at $T = 0$', 'They fill the Fermi sphere with speeds up to $v_F$.'],
        ['All conduction electrons take part equally in heat conduction', 'Only those near the Fermi surface can scatter into empty states.'],
      ];
      const not = r() < 0.65;
      const o = factMcq(r, T, F, not);
      return { q: `About the degenerate electron gas in metals and stars, which ONE statement is ${not ? '<b>NOT</b> correct' : 'correct'}?`, ...o,
        trap: 'Almost every metal property that "looks too small classically" comes from the factor $T/T_F$.' };
    } },
];
