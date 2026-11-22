// Extra question shapes for vibrational-spectra (templates vibs-m31..m35). Imported by vibrational-spectra.js.
import { int, choose, round } from '../_util.js';
import { msqOf, pickMcq, factMcq } from './_more.js';

export default [
  { id: 'vibs-m31', type: 'mcq', level: 3, exams: ['gate', 'net'], sub: 'infrared activity',
    make(r) {
      const M = choose(r, [
        ['CO$_2$', 4, 2, 'Of the 4 modes, the symmetric stretch is IR-inactive; the doubly degenerate bend and the antisymmetric stretch are active: 2 distinct bands.'],
        ['H$_2$O', 3, 3, 'All three modes (two stretches, one bend) change the dipole.'],
        ['CH$_4$', 9, 2, 'The 9 modes fall into 4 distinct frequencies ($A_1$, $E$, two $T_2$); only the two triply degenerate $T_2$ sets are IR-active.'],
        ['SF$_6$', 15, 2, 'Of the 6 distinct frequencies only the two $T_{1u}$ sets are IR-active.'],
        ['NH$_3$', 6, 4, 'Four distinct frequencies ($2A_1 + 2E$), all IR-active.'],
        ['BF$_3$', 6, 3, 'Four distinct frequencies; the symmetric stretch ($A_1\'$) is IR-inactive, the other three are active.'],
        ['N$_2$', 1, 0, 'A homonuclear stretch does not change the dipole.'],
        ['HCN', 4, 3, 'Linear without a centre of symmetry: CH stretch, CN stretch and the doubly degenerate bend are all active.'],
        ['C$_2$H$_2$', 7, 2, 'Centrosymmetric linear molecule: only the antisymmetric CH stretch ($\\sigma_u^+$) and the $\\pi_u$ bend are IR-active.'],
      ]);
      const o = pickMcq(r, `${M[2]}`, [0, 1, 2, 3, 4, 5].filter((x) => x !== M[2]).map(String));
      return { q: `${M[0]} has ${M[1]} vibrational normal mode${M[1] > 1 ? 's' : ''}. How many <b>distinct</b> fundamental frequencies appear in its infrared absorption spectrum?`, ...o,
        sol: `${M[3]} A fundamental is IR-active only if the vibration changes the dipole moment (it transforms like $x$, $y$ or $z$); degenerate modes give a single band.`,
        trap: 'Count distinct frequencies, not modes: degenerate modes absorb at one wavenumber.' };
    } },
  { id: 'vibs-m32', type: 'msq', level: 3, exams: ['gate', 'net', 'jam'], sub: 'anharmonic oscillator', format: 'statements',
    make(r) {
      const we = int(r, 800, 3000), x = round(we * (0.005 + 0.015 * r()), 1);
      const fund = we - 2 * x, ov = 2 * we - 6 * x, De = we * we / (4 * x);
      const not = r() < 0.4;
      const m = msqOf(r, [
        [`The fundamental is at $${round(fund, 1)}$ cm$^{-1}$`, true, `$G(1) - G(0) = \\tilde\\omega_e - 2\\tilde\\omega_ex_e$.`],
        [`The fundamental is at $${round(we - x, 1)}$ cm$^{-1}$`, false, `It is $\\tilde\\omega_e - 2\\tilde\\omega_ex_e = ${round(fund, 1)}$ cm$^{-1}$.`],
        [`The first overtone is at $${round(ov, 1)}$ cm$^{-1}$`, true, `$G(2) - G(0) = 2\\tilde\\omega_e - 6\\tilde\\omega_ex_e$.`],
        [`The first overtone is at exactly twice the fundamental, $${round(2 * fund, 1)}$ cm$^{-1}$`, false, `Anharmonicity makes it $${round(ov, 1)}$, which is $2\\tilde\\omega_ex_e$ less than twice the fundamental.`],
        ['The spacing between adjacent levels decreases linearly with $v$', true, '$G(v+1) - G(v) = \\tilde\\omega_e - 2\\tilde\\omega_ex_e(v + 1)$.'],
        [`In the Morse model the well depth is $D_e \\approx ${Math.round(De)}$ cm$^{-1}$`, true, `$D_e = \\tilde\\omega_e^2/4\\tilde\\omega_ex_e$.`],
        ['$D_0$ is larger than $D_e$', false, '$D_0 = D_e - G(0)$: the zero-point energy makes it smaller.'],
      ], { not });
      return { q: `A diatomic molecule has $G(v) = \\tilde\\omega_e(v + \\tfrac12) - \\tilde\\omega_ex_e(v + \\tfrac12)^2$ with $\\tilde\\omega_e = ${we}$ cm$^{-1}$ and $\\tilde\\omega_ex_e = ${x}$ cm$^{-1}$. Which statements are ${not ? '<b>NOT</b> correct' : 'correct'}?`, ...m,
        trap: 'The fundamental is $\\tilde\\omega_e - 2\\tilde\\omega_ex_e$, not $\\tilde\\omega_e$: the levels squeeze together as $v$ grows.' };
    } },
  { id: 'vibs-m33', type: 'mcq', level: 3, exams: ['gate', 'net'], sub: 'band structure', format: 'graph in words',
    make(r) {
      const O = { pr: 'P and R branches only, with a gap at the band origin', pqr: 'P, Q and R branches, with a strong central Q branch', none: 'no infrared band at all', one: 'a single sharp line at the band origin' };
      const C = choose(r, [
        ['the fundamental of gaseous HCl', 'pr', 'For a $^1\\Sigma$ diatomic, $\\Delta J = \\pm1$ only, so there is no Q branch and a gap of about $4B$ at the origin.'],
        ['the antisymmetric stretch of gaseous CO$_2$ (a parallel band)', 'pr', 'Parallel bands of linear molecules have $\\Delta J = \\pm1$ only.'],
        ['the bending fundamental of gaseous CO$_2$ (a perpendicular band)', 'pqr', 'The bend carries vibrational angular momentum ($l = 1$), so $\\Delta J = 0$ is allowed too.'],
        ['the fundamental of gaseous NO (electronic ground state $^2\\Pi$)', 'pqr', 'The electronic orbital angular momentum $\\Lambda = 1$ allows $\\Delta J = 0$.'],
        ['the fundamental of gaseous N$_2$', 'none', 'The stretch of a homonuclear diatomic does not change the dipole: IR-inactive.'],
        ['the fundamental of CO in a cold inert-gas matrix where it cannot rotate', 'one', 'With rotation suppressed, only the pure vibrational transition remains.'],
      ]);
      const o = pickMcq(r, O[C[1]], Object.keys(O).filter((k) => k !== C[1]).map((k) => O[k]));
      return { q: `At high resolution, what does the infrared spectrum of ${C[0]} look like?`, ...o, sol: C[2],
        trap: 'A Q branch needs angular momentum about the molecular axis, from the electrons or from a degenerate bending vibration.' };
    } },
  { id: 'vibs-m34', type: 'mcq', level: 2, exams: ['gate', 'net', 'jam'], sub: 'Morse potential', format: 'which is NOT',
    make(r) {
      const T = [
        ['It has a finite number of bound vibrational levels', 'The levels converge below the dissociation limit.'],
        ['Its levels crowd together towards the dissociation limit', 'The spacing falls linearly with $v$.'],
        ['$D_0 = D_e - G(0)$', 'Dissociation from the ground level needs the well depth minus the zero-point energy.'],
        ['Overtones become weakly allowed', 'Anharmonicity mixes the levels, relaxing $\\Delta v = \\pm1$.'],
        ['Isotopic substitution leaves $D_e$ unchanged but changes $D_0$', 'The potential is electronic; the zero-point energy depends on mass.'],
      ];
      const F = [
        ['The level spacing increases with $v$', 'It decreases.'],
        ['It has infinitely many bound levels', 'That is the harmonic oscillator, which never dissociates.'],
        ['A heavier isotope has a larger zero-point energy', 'Zero-point energy scales as $1/\\sqrt\\mu$: heavier means smaller.'],
        ['Isotopic substitution changes the well depth $D_e$', 'The Born-Oppenheimer potential does not depend on nuclear mass.'],
      ];
      const not = r() < 0.65;
      const o = factMcq(r, T, F, not);
      return { q: `For a diatomic molecule described by a Morse potential, which ONE statement is ${not ? '<b>NOT</b> correct' : 'correct'}?`, ...o,
        trap: 'Deuteration changes $D_0$ (through the zero-point energy), not $D_e$.' };
    } },
  { id: 'vibs-m35', type: 'mcq', level: 2, exams: ['jam', 'gate', 'net'], sub: 'force constants', format: 'two-step',
    make(r) {
      const M = choose(r, [['HCl', 516, 1.008, 34.97], ['CO', 1902, 12.0, 15.995], ['HF', 966, 1.008, 19.0], ['NO', 1595, 14.003, 15.995], ['Cl$_2$', 323, 34.97, 34.97], ['HBr', 412, 1.008, 78.92]]);
      const mu = M[2] * M[3] / (M[2] + M[3]), w = (k, m) => Math.sqrt(k / (m * 1.66054e-27)) / (2 * Math.PI * 2.99792458e10);
      const ok = w(M[1], mu);
      const sh = (v) => `$${Math.round(v)}$ cm$^{-1}$`;
      const o = pickMcq(r, sh(ok), [sh(ok * 2 * Math.PI), sh(w(M[1], M[2] + M[3])), sh(ok * Math.SQRT2), sh(ok / 2)]);
      return { q: `The bond of ${M[0]} has force constant $${M[1]}$ N/m and the atomic masses are $${M[2]}$ u and $${M[3]}$ u. In the harmonic approximation its vibrational wavenumber is`, ...o,
        sol: `$\\mu = \\dfrac{${M[2]}\\times${M[3]}}{${M[2]} + ${M[3]}} = ${round(mu, 4)}$ u. Then $\\tilde\\nu = \\dfrac{1}{2\\pi c}\\sqrt{\\dfrac{k}{\\mu}} = ${Math.round(ok)}$ cm$^{-1}$ (with $c$ in cm/s and $\\mu$ in kg).`,
        trap: 'Using the total mass instead of the reduced mass, or forgetting the $2\\pi$, gives the tempting wrong values.' };
    } },
];
