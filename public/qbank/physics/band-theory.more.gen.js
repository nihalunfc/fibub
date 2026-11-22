// Extra question shapes for band-theory (templates bth-m31..m35). Imported by band-theory.js.
import { choose, round, fmt } from '../_util.js';
import { msqOf, pickMcq, factMcq, oomMcq } from './_more.js';

export default [
  { id: 'bth-m31', type: 'mcq', level: 3, exams: ['gate', 'net'], sub: 'kinds of solid', format: 'classification',
    make(r) {
      const O = { met: 'a metal (a partly filled band)', semi: 'a semiconductor (a gap of order 1 eV)', ins: 'an insulator (a wide gap, several eV)', smet: 'a semimetal (a small overlap of a filled and an empty band)', mott: 'a Mott insulator (insulating because of electron repulsion, although band theory predicts a metal)' };
      const C = choose(r, [
        ['sodium', 'met', 'One valence electron per atom half-fills the 3s band.'],
        ['magnesium', 'met', 'Two electrons per atom would fill a band, but the 3s and 3p bands overlap.'],
        ['silicon', 'semi', 'Gap 1.1 eV.'], ['gallium arsenide', 'semi', 'Gap 1.4 eV (direct).'], ['germanium', 'semi', 'Gap 0.67 eV.'],
        ['diamond', 'ins', 'Gap about 5.5 eV.'], ['sodium chloride', 'ins', 'Gap about 9 eV.'],
        ['bismuth', 'smet', 'Tiny band overlap gives about $10^{-5}$ carriers per atom of each sign.'], ['graphite', 'smet', 'The $\\pi$ bands touch and overlap slightly.'],
        ['nickel oxide (NiO)', 'mott', 'Ni$^{2+}$ has a partly filled 3d shell, yet NiO is a good insulator: the on-site repulsion $U$ exceeds the bandwidth.'],
      ]);
      const o = pickMcq(r, O[C[1]], Object.keys(O).filter((k) => k !== C[1]).map((k) => O[k]));
      return { q: `At room temperature, ${C[0]} is best described as`, ...o, sol: C[2],
        trap: 'An even number of electrons per cell allows an insulator but does not guarantee one: bands can overlap (Mg, Bi). An odd number gives a metal in band theory, unless correlations take over (NiO).' };
    } },
  { id: 'bth-m32', type: 'msq', level: 3, exams: ['gate', 'net'], sub: 'tight-binding band', format: 'statements',
    make(r) {
      const t = choose(r, [0.5, 1, 1.5, 2]), a = choose(r, [2, 2.5, 3, 4]);
      const ms = 3.81 / (t * a * a), vmax = 2 * t * 1.602e-19 * a * 1e-10 / 1.0546e-34;
      const not = r() < 0.4;
      const m = msqOf(r, [
        [`The bandwidth is $4t = ${round(4 * t, 2)}$ eV`, true, 'From $E_0 - 2t$ at $k = 0$ to $E_0 + 2t$ at $k = \\pi/a$.'],
        [`The bandwidth is $2t = ${round(2 * t, 2)}$ eV`, false, '$\\cos ka$ runs from $+1$ to $-1$, so the width is $4t$.'],
        [`At the band bottom $m^* = \\hbar^2/2ta^2 \\approx ${round(ms, 3)}\\,m_e$`, true, `Expand $-2t\\cos ka \\approx -2t + ta^2k^2$; with $\\hbar^2/2m_e = 3.81$ eV Å$^2$.`],
        ['At the band top the effective mass is negative', true, 'The band curves downwards there.'],
        ['The effective mass at the band bottom grows as $t$ grows', false, '$m^* \\propto 1/t$: a wider band means lighter electrons.'],
        [`The largest group velocity is $2ta/\\hbar = ${fmt(vmax, 3)}$ m/s, at $k = \\pi/2a$`, true, '$v = (1/\\hbar)dE/dk = (2ta/\\hbar)\\sin ka$.'],
        ['The group velocity is largest at the zone boundary', false, 'It vanishes there; it peaks at $k = \\pi/2a$.'],
      ], { not });
      return { q: `A 1D tight-binding band is $E(k) = E_0 - 2t\\cos ka$ with $t = ${t}$ eV and $a = ${a}$ Å. Which statements are ${not ? '<b>NOT</b> correct' : 'correct'}?`, ...m,
        trap: 'Bandwidth $4t$ (in 1D; $2zt$ for $z$ neighbours), and $m^* \\propto 1/(ta^2)$.' };
    } },
  { id: 'bth-m33', type: 'mcq', level: 3, exams: ['gate', 'net'], sub: 'near the zone boundary', format: 'graph in words',
    make(r) {
      const C = choose(r, [
        ['the group velocity of an electron in the lower band', 'falls smoothly to zero at the boundary', ['grows without limit at the boundary', 'stays equal to $\\hbar k/m$', 'changes sign abruptly at the boundary while staying large'], 'The bands meet the boundary with zero slope, because the states there are standing waves.'],
        ['the effective mass of an electron just below the gap, in the lower band', 'is negative', ['equals the free-electron mass', 'is infinite at every $k$', 'is positive and smaller than near $k = 0$'], 'The lower band curves downwards near its top, so $m^* = \\hbar^2/(d^2E/dk^2) < 0$.'],
        ['the energy as $k$ crosses the boundary from the lower to the upper band', 'jumps by a gap of $2|U_G|$, where $U_G$ is the Fourier component of the potential', ['changes continuously with no gap', 'jumps by a gap of $|U_G|/2$', 'jumps by a gap equal to the free-electron energy at the boundary'], 'Degenerate perturbation theory mixes $e^{ikx}$ and $e^{i(k-G)x}$, splitting them by $2|U_G|$.'],
        ['the wavefunctions exactly at the boundary', 'are standing waves, one with its charge piled on the ions and one between them', ['are running waves moving with speed $\\hbar\\pi/ma$', 'are constant in space', 'are identical for the two bands'], 'The two combinations $\\cos(\\pi x/a)$ and $\\sin(\\pi x/a)$ have different potential energies, which opens the gap.'],
        ['the motion of an electron driven steadily by a weak field, with no scattering, once $k$ reaches the boundary', 'Bragg reflection sends $k$ to the opposite boundary and the electron oscillates in real space (Bloch oscillation)', ['the electron keeps accelerating for ever', 'the electron stops dead and stays at rest', 'the electron jumps to the upper band every time'], '$\\hbar\\dot k = -eE$ sweeps $k$ through the zone repeatedly; the velocity changes sign each period.'],
      ]);
      const o = pickMcq(r, C[1], C[2]);
      return { q: `In the nearly-free-electron model in 1D, near the zone boundary $k = \\pi/a$: ${C[0]}`, ...o, sol: C[3],
        trap: 'At the zone boundary the Bragg condition holds: running waves become standing waves and the bands flatten.' };
    } },
  { id: 'bth-m34', type: 'mcq', level: 2, exams: ['gate', 'net', 'jam'], sub: 'holes', format: 'which is NOT',
    make(r) {
      const T = [
        ['A hole behaves as a particle of charge $+e$', 'Removing an electron from a full band leaves a positive net charge that moves with the band.'],
        ['The wavevector of a hole is minus that of the missing electron', 'A full band has total $k = 0$, so removing $k_e$ leaves $-k_e$.'],
        ['Near the top of a band the hole effective mass is positive', '$m_h = -m_e^*$, and $m_e^*$ is negative at a band top.'],
        ['A completely filled band carries no electric current', 'For every $k$ there is $-k$ with the opposite velocity.'],
        ['Hole energies increase downwards on an electron band diagram', 'Removing a deeper electron costs more energy.'],
      ];
      const F = [
        ['A hole has charge $-e$, like the electron it replaces', 'It acts as $+e$.'],
        ['A completely filled band can carry current if a field is applied', 'Electrons just cycle through the full set of states: no net current.'],
        ['Near the top of a band the hole effective mass is negative', 'It is positive there, which is what makes holes useful.'],
        ['The wavevector of a hole equals that of the missing electron', 'It is the negative.'],
      ];
      const not = r() < 0.65;
      const o = factMcq(r, T, F, not);
      return { q: `About holes in a nearly full band, which ONE statement is ${not ? '<b>NOT</b> correct' : 'correct'}?`, ...o,
        trap: 'Holes have positive charge and positive mass near a band top; the two signs flip together, so they accelerate the way positive particles do.' };
    } },
  { id: 'bth-m35', type: 'mcq', level: 3, exams: ['gate', 'net'], sub: 'Bloch oscillations', format: 'order of magnitude',
    make(r) {
      const S = choose(r, [['a bulk crystal', 3e-10, '3 Å'], ['a bulk crystal', 5e-10, '5 Å'], ['a semiconductor superlattice', 1e-8, '10 nm'], ['a semiconductor superlattice', 5e-9, '5 nm']]);
      const bulk = S[0] === 'a bulk crystal', E = choose(r, bulk ? [1e5, 1e6, 1e7] : [1e6, 1e7]);
      const T = 6.62607e-34 / (1.602177e-19 * E * S[1]);
      const o = oomMcq(r, T, 's');
      return { q: `In ${S[0]} with period ${S[2]}, an electric field of $${fmt(E, 1)}$ V/m is applied. Ignoring scattering, the Bloch oscillation period $T_B = h/eEa$ is closest to`, ...o,
        sol: `$T_B = h/(eEa) = ${fmt(6.62607e-34, 3)}/(${fmt(1.602177e-19, 3)}\\times${fmt(E, 1)}\\times${fmt(S[1], 1)}) = ${fmt(T, 2)}$ s, nearest $10^{${o.k}}$ s. ${bulk ? 'Scattering times in a bulk crystal are about $10^{-14}$ s, far shorter, so the electron scatters long before completing an oscillation.' : 'Clean superlattices at low temperature have scattering times near a picosecond, so oscillations this fast can be seen; they were first observed in such structures.'}`,
        trap: 'The period scales as $1/a$: long superlattice periods make Bloch oscillations fast enough to beat scattering.' };
    } },
];
