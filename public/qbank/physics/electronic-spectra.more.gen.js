// Extra question shapes for electronic-spectra (templates els-m31..m35). Imported by electronic-spectra.js.
import { choose, mcqOptions, int } from '../_util.js';
import { msqOf } from './_more.js';
import { oneOf, orderOpts, matchOne } from './_odd.js';
import { nt, sci } from './_vary.js';

export default [
  { id: 'els-m31', type: 'msq', level: 2, exams: ['gate', 'net'], sub: 'Franck-Condon principle', format: 'statements',
    make(r) {
      const not = r() < 0.5;
      const m = msqOf(r, [
        ['electronic transitions are vertical on a potential-energy diagram', true, 'Nuclei hardly move during the fast electronic jump (Franck-Condon).'],
        ['if both states have the same equilibrium bond length, the 0-0 band is the strongest in absorption from $v\'\' = 0$', true, 'The vibrational wavefunctions are then nearly orthogonal except for $v\' = 0$.'],
        ['a large change of bond length makes the absorption maximum lie at high $v\'$', true, 'The vertical line from the ground state hits the upper curve far up its inner wall.'],
        ['fluorescence is shifted to longer wavelength than absorption (Stokes shift)', true, 'The molecule relaxes vibrationally in the excited state before emitting.'],
        ['phosphorescence is spin-forbidden and therefore longer-lived than fluorescence', true, 'It goes from a triplet to the singlet ground state.'],
        ['electronic transitions obey the strict vibrational rule $\\Delta v = \\pm1$', false, 'Any $\\Delta v$ is allowed; intensities follow Franck-Condon factors.'],
        ['phosphorescence is faster than fluorescence', false, 'It is slower (ms to s against ns).'],
        ['the vibrational structure of a band system is independent of the bond lengths of the two states', false, 'The progression\'s shape is fixed by the displacement between the potential curves.'],
      ], { not });
      return { q: `Which of the following statements about electronic spectra of molecules are ${nt(not)}?`, ...m,
        trap: 'There is no $\\Delta v$ selection rule in electronic spectra; only Franck-Condon overlaps.' };
    } },
  { id: 'els-m32', type: 'mcq', level: 3, exams: ['gate', 'net'], sub: 'selection rules',
    make(r) {
      const not = r() < 0.5;
      const m = oneOf(r, [
        ['$\\Delta\\Lambda = 0, \\pm1$ for electric-dipole transitions of diatomic molecules', true, 'The dipole operator has components with $\\Delta\\Lambda = 0$ and $\\pm1$.'],
        ['$\\Delta S = 0$ (for light molecules)', true, 'The dipole operator does not act on spin.'],
        ['$\\Sigma^+ \\leftrightarrow \\Sigma^-$ transitions are forbidden', true, 'Reflection symmetry in a plane containing the axis.'],
        ['in a homonuclear molecule only $g \\leftrightarrow u$ transitions are allowed', true, 'The dipole operator is odd under inversion.'],
        ['the ground state of O$_2$ is $^3\\Sigma_g^-$', true, 'Two unpaired electrons in $\\pi_g^*$ orbitals: paramagnetic.'],
        ['$g \\leftrightarrow g$ transitions are allowed in homonuclear molecules', false, 'Parity must change.'],
        ['the ground state of H$_2$ is $^3\\Sigma_u^+$', false, 'It is $^1\\Sigma_g^+$; $^3\\Sigma_u^+$ is the repulsive lowest triplet.'],
        ['$\\Sigma^+ \\leftrightarrow \\Sigma^-$ transitions are strongly allowed', false, 'They are forbidden.'],
      ], not);
      return { q: `Which statement about electronic states and selection rules of diatomic molecules is ${nt(not)}?`, ...m,
        trap: 'Homonuclear: $g \\leftrightarrow u$ only; $\\Sigma^+ \\leftrightarrow \\Sigma^-$ never.' };
    } },
  { id: 'els-m33', type: 'mcq', level: 3, exams: ['gate', 'net'], sub: 'progressions', format: 'match',
    make(r) {
      const L = { longer: 'the upper state has a much longer bond than the ground state', same: 'the two states have nearly the same bond length', diss: 'the molecule dissociates above the convergence limit', pre: 'the upper levels are predissociated by a crossing repulsive state', red: 'the rotational constant is smaller in the upper state', spin: 'nuclear-spin statistics remove half of the rotational levels' };
      const cas = choose(r, [
        ['A long vibrational progression whose intensity peaks at a high $v\'$', 'longer', 'Vertical excitation lands high on the displaced upper curve.', ['red']],
        ['A strong 0-0 band and only a few weak bands with $v\' \\gt 0$', 'same', 'Overlap is concentrated in $v\' = 0$.'],
        ['Bands crowding together and merging into a continuum at short wavelength', 'diss', 'The convergence limit gives the dissociation energy of the upper state.'],
        ['Sharp bands that suddenly become diffuse above a certain $v\'$, though they are not yet at the convergence limit', 'pre', 'The levels gain a short lifetime by leaking to a dissociative curve.'],
        ['Rotational structure with a band head on the high-frequency side, shading toward the red', 'red', '$B\' \\lt B\'\'$ makes the R branch turn back, forming a head.', ['longer']],
        ['Alternate rotational lines missing in a band of ${}^{16}$O$_2$', 'spin', 'Spin-0 identical nuclei allow only half of the rotational levels.'],
      ]);
      return { q: `Observation in an electronic band spectrum: ${cas[0]}. The best explanation is that`, ...matchOne(r, L, cas),
        trap: 'Diffuse bands below the convergence limit mean predissociation, not ordinary dissociation.' };
    } },
  { id: 'els-m34', type: 'mcq', level: 3, exams: ['gate', 'net'], sub: 'isotope effect', format: 'scaling',
    make(r) {
      const k = choose(r, [2, 4, 9]), q = choose(r, ['vib', 'rot', 'el']);
      const val = { vib: 1 / Math.sqrt(k), rot: 1 / k, el: 1 }[q];
      const show = (x) => (x === 1 ? 'unchanged (factor 1)' : `multiplied by ${x < 1 ? `1/${+(1 / x).toFixed(3)}` : x}`);
      const what = { vib: 'the vibrational spacing (harmonic)', rot: 'the rotational constant $B$', el: 'the electronic term energy $T_e$ (minimum to minimum)' }[q];
      const o = mcqOptions(r, val, [1, 1 / Math.sqrt(k), 1 / k, Math.sqrt(k)].filter((x) => x !== val), show);
      return { q: `If the reduced mass of a diatomic molecule were multiplied by ${k} with the potential curves unchanged (Born-Oppenheimer), ${what} would be`,
        options: o.options, answer: o.answer,
        sol: `Potential curves do not depend on nuclear mass. Vibration: $\\omega = \\sqrt{k_f/\\mu} \\propto \\mu^{-1/2}$. Rotation: $B = \\hbar^2/(2\\mu r_e^2) \\propto 1/\\mu$. Electronic $T_e$: independent of $\\mu$. So the answer is ${show(val)}.`,
        trap: 'This is why $E_{el} : E_{vib} : E_{rot} \\approx 1 : (m/M)^{1/2} : m/M$.' };
    } },
  { id: 'els-m35', type: 'mcq', level: 1, exams: ['gate', 'net'], sub: 'energy scales', format: 'order of magnitude',
    make(r) {
      const kind = int(r, 0, 2);
      const [lo, hi, nm] = [[20000, 50000, 'an electronic transition'], [800, 3500, 'a fundamental vibrational transition'], [2, 20, 'a pure rotational transition']][kind];
      const nu = Math.round(lo + (hi - lo) * r()), x = 1 / (nu * 100), o = orderOpts(r, x, '\\text{m}');
      return { q: `A diatomic molecule shows ${nm} at ${nu} cm$^{-1}$. The wavelength of this radiation is about`,
        options: o.options, answer: o.answer,
        sol: `$\\lambda = 1/\\tilde\\nu = 1/(${nu}\\times100\\text{ m}^{-1}) = ${sci(x)}$ m. Electronic transitions are visible/UV, vibrations infrared, rotations microwave.`,
        trap: 'Convert cm$^{-1}$ to m$^{-1}$ (multiply by 100) before inverting.' };
    } },
];
