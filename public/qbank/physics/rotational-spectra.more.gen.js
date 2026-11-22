// Extra question shapes for rotational-spectra (templates rots-m31..m35). Imported by rotational-spectra.js.
import { int, choose, round, fmt } from '../_util.js';
import { msqOf, pickMcq, oomMcq } from './_more.js';

export default [
  { id: 'rots-m31', type: 'mcq', level: 2, exams: ['gate', 'net', 'jam'], sub: 'classes of rotors', format: 'match the system',
    make(r) {
      const O = { lin: 'a linear rotor', pro: 'a prolate symmetric top', obl: 'an oblate symmetric top', sph: 'a spherical top', asy: 'an asymmetric top' };
      const M = choose(r, [
        ['HCN', 'lin', 'All atoms on a line: one moment of inertia is zero, the other two equal.'], ['CO$_2$', 'lin', 'Linear molecule.'], ['C$_2$H$_2$ (acetylene)', 'lin', 'Linear molecule.'],
        ['CH$_3$Cl', 'pro', 'A threefold axis with the small moment about it ($I_a < I_b = I_c$): cigar-like.'], ['CH$_3$F', 'pro', 'Threefold axis, $I_a < I_b = I_c$.'],
        ['NH$_3$', 'obl', 'Threefold axis with the largest moment about it ($I_a = I_b < I_c$): disc-like.'], ['C$_6$H$_6$ (benzene)', 'obl', 'Sixfold axis, flat: $I_c = 2I_a$.'], ['BCl$_3$', 'obl', 'Flat, threefold axis.'],
        ['CH$_4$', 'sph', 'Tetrahedral: all three moments equal.'], ['SF$_6$', 'sph', 'Octahedral: all three moments equal.'],
        ['H$_2$O', 'asy', 'Bent, with no threefold or higher axis: three different moments.'], ['SO$_2$', 'asy', 'Bent: three different moments.'],
      ]);
      const o = pickMcq(r, O[M[1]], Object.keys(O).filter((k) => k !== M[1]).map((k) => O[k]));
      return { q: `As a rigid rotor, ${M[0]} is`, ...o, sol: `${M[2]} A threefold (or higher) symmetry axis makes two principal moments equal (a symmetric top); prolate if the unique moment is the smallest, oblate if it is the largest.`,
        trap: 'NH$_3$ looks like a pyramid "pointing" along its axis, yet it is oblate: the unique moment is the largest.' };
    } },
  { id: 'rots-m32', type: 'msq', level: 2, exams: ['gate', 'net', 'jam'], sub: 'rigid-rotor spectrum', format: 'statements',
    make(r) {
      const B = round(0.5 + 10 * r(), 2), J = int(r, 1, 5);
      const not = r() < 0.4;
      const m = msqOf(r, [
        [`The line $J = ${J} \\to ${J + 1}$ is at $${round(2 * B * (J + 1), 2)}$ cm$^{-1}$`, true, `$\\tilde\\nu = 2B(J + 1) = 2\\times${B}\\times${J + 1}$.`],
        [`The line $J = ${J} \\to ${J + 1}$ is at $${round(B * (J + 1), 2)}$ cm$^{-1}$`, false, `It is $2B(J + 1) = ${round(2 * B * (J + 1), 2)}$ cm$^{-1}$.`],
        [`Adjacent lines are $${round(2 * B, 2)}$ cm$^{-1}$ apart`, true, 'The spacing is $2B$.'],
        [`Adjacent lines are $${B}$ cm$^{-1}$ apart`, false, 'The spacing is $2B$, not $B$.'],
        ['Centrifugal distortion makes the spacing shrink slowly with $J$', true, 'The $-4DJ^3$ term lowers high-$J$ lines.'],
        ['Centrifugal distortion makes the spacing grow with $J$', false, 'The bond stretches, $I$ grows and the lines crowd together.'],
        ['The selection rule is $\\Delta J = \\pm1$ and the molecule needs a permanent dipole', true, 'Gross selection rule for microwave absorption.'],
        ['The selection rule is $\\Delta J = \\pm2$', false, 'That is the rotational Raman rule.'],
      ], { not });
      return { q: `A polar diatomic molecule behaves as a rotor with $B = ${B}$ cm$^{-1}$. Which statements about its pure rotational (microwave) absorption spectrum are ${not ? '<b>NOT</b> correct' : 'correct'}?`, ...m,
        trap: 'Levels are $BJ(J+1)$ but lines are at $2B(J+1)$, spaced by $2B$.' };
    } },
  { id: 'rots-m33', type: 'mcq', level: 3, exams: ['gate', 'net'], sub: 'line intensities', format: 'scaling',
    make(r) {
      const C = choose(r, [['the temperature is raised by a factor of 4', 2], ['the temperature is raised by a factor of 9', 3], ['the temperature is lowered by a factor of 4', 0.5], ['the molecule is replaced by one with a rotational constant 4 times smaller (same $T$)', 2], ['the molecule is replaced by one with a rotational constant 9 times larger (same $T$)', 1 / 3]]);
      const f = C[1], fs = f === 0.5 ? '\\tfrac12' : f === 1 / 3 ? '\\tfrac13' : `${f}`;
      const sq = f === 0.5 ? '\\tfrac14' : f === 1 / 3 ? '\\tfrac19' : `${f * f}`;
      const opt = (x) => (x === '1' ? 'the most intense line stays at the same $J$' : `the most intense line moves to a $J$ about $${x}$ times the old one`);
      const o = pickMcq(r, opt(fs), [opt(sq), opt('1'), opt(f === 0.5 ? '2' : f === 1 / 3 ? '3' : `\\tfrac{1}{${f}}`)]);
      return { q: `In the rotational spectrum of a diatomic gas at temperature $T$, the line intensities rise and then fall with $J$, peaking near $J_{max}$ (assume $J_{max} \\gg 1$). If ${C[0]},`, ...o,
        sol: `Populations go as $(2J + 1)e^{-hcBJ(J+1)/kT}$, maximal at $J_{max} \\approx \\sqrt{kT/2hcB} - \\tfrac12 \\propto \\sqrt{T/B}$. Here $\\sqrt{T/B}$ changes by $${fs}$.`,
        trap: 'The peak moves as the square root of $T/B$, not linearly.' };
    } },
  { id: 'rots-m34', type: 'mcq', level: 3, exams: ['gate', 'net'], sub: 'nuclear spin statistics', format: 'which is NOT',
    make(r) {
      const miss = ['$^{16}$O$_2$', '$^{12}$C$^{16}$O$_2$', '$^{18}$O$_2$'];
      const alt = ['H$_2$', '$^{14}$N$_2$', '$^{35}$Cl$_2$', 'D$_2$'];
      const none = ['H$^{35}$Cl', '$^{12}$C$^{16}$O', '$^{16}$O$^{18}$O', 'H$^{19}$F'];
      const mode = int(r, 0, 1);
      if (mode === 0) {
        const o = pickMcq(r, choose(r, miss), [...alt, ...none]);
        return { q: 'In which ONE of these molecules is every second rotational level completely missing?', ...o,
          sol: 'For a symmetric linear molecule whose identical nuclei are spin-0 bosons ($^{16}$O, $^{18}$O), only levels with the right exchange symmetry exist: in $^{16}$O$_2$ and $^{18}$O$_2$ (ground state $^3\\Sigma_g^-$) only odd $J$, in CO$_2$ only even $J$. Nuclei with spin (H, D, $^{14}$N, $^{35}$Cl) give an intensity alternation instead, and heteronuclear molecules show all levels with smooth intensities.',
          trap: 'Intensity alternation (H$_2$, N$_2$) is not the same as missing levels, which needs spin-0 identical nuclei.' };
      }
      const o = pickMcq(r, choose(r, none), [...alt, ...miss]);
      return { q: 'Which ONE of these molecules shows <b>no</b> alternation of intensities (and no missing lines) in its rotational structure?', ...o,
        sol: 'Alternation or missing levels come from the exchange symmetry of identical nuclei in a centrosymmetric molecule. Heteronuclear molecules (HCl, CO, $^{16}$O$^{18}$O, HF) have no such symmetry, so all levels appear with smoothly varying intensity.',
        trap: '$^{16}$O$^{18}$O contains two oxygen atoms but they are different isotopes, so they are not identical particles.' };
    } },
  { id: 'rots-m35', type: 'mcq', level: 2, exams: ['jam', 'gate', 'net'], sub: 'rotational frequencies', format: 'order of magnitude',
    make(r) {
      const M = choose(r, [['HCl', 1.008, 34.97, 127.5], ['CO', 12.0, 15.995, 112.8], ['HF', 1.008, 19.0, 91.7], ['NaCl', 22.99, 34.97, 236], ['CsI', 132.9, 126.9, 332], ['ICl', 126.9, 34.97, 232]]);
      const mu = M[1] * M[2] / (M[1] + M[2]) * 1.66054e-27, I = mu * (M[3] * 1e-12) ** 2;
      const nu = 2 * 1.0546e-34 / (2 * Math.PI * I);
      const o = oomMcq(r, nu, 'Hz');
      return { q: `A ${M[0]} molecule has atomic masses $${M[1]}$ u and $${M[2]}$ u and bond length $${M[3]}$ pm. The frequency of its $J = 0 \\to 1$ rotational absorption line is closest to`, ...o,
        sol: `$\\mu = ${round(M[1] * M[2] / (M[1] + M[2]), 3)}$ u $= ${fmt(mu, 3)}$ kg, $I = \\mu r^2 = ${fmt(I, 3)}$ kg m$^2$. The $J = 0 \\to 1$ line has $h\\nu = 2\\cdot\\hbar^2/2I$, i.e. $\\nu = \\hbar/(2\\pi I) = ${fmt(nu, 2)}$ Hz, nearest $10^{${o.k}}$ Hz.`,
        trap: 'Use the reduced mass, not the total mass; hydrides have small $\\mu$ and so the highest rotational frequencies.' };
    } },
];
