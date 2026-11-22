// Extra question shapes for collective-model (templates coll-m31..m35). Imported by collective-model.js.
import { choose, mcqOptions } from '../_util.js';
import { msqOf } from './_more.js';
import { orderOpts, matchOne } from './_odd.js';
import { vs, nt, sci } from './_vary.js';

export default [
  { id: 'coll-m31', type: 'msq', level: 3, exams: ['gate', 'net'], sub: 'collective signatures', format: 'statements',
    make(r) {
      const E2 = choose(r, [72, 81, 93, 100, 120]), E4 = (E2 * 10) / 3, not = r() < 0.5;
      const m = msqOf(r, [
        vs(r, `if a rigid-rotor band has $E(2^+) = ${E2}$ keV, its $4^+$ level lies at about ${E4.toFixed(0)} keV`, `if a rigid-rotor band has $E(2^+) = ${E2}$ keV, its $4^+$ level lies at about ${2 * E2} keV`, `$E \\propto I(I + 1)$, so $E(4^+) = \\tfrac{20}{6}E(2^+) = ${E4.toFixed(0)}$ keV; $2E(2^+)$ is the vibrator value.`),
        ['the ground band of an even-even deformed nucleus contains only $I = 0, 2, 4, \\dots$ with positive parity', true, 'Reflection symmetry of the shape removes the odd-$I$ members.'],
        ['the two-phonon quadrupole vibrational states form a triplet $0^+, 2^+, 4^+$', true, 'Two identical $l = 2$ phonons couple only to even total $I$.'],
        ['measured moments of inertia lie between the irrotational-flow value and the rigid-body value', true, 'Pairing makes the nucleus less than rigid, but it is more than an ideal fluid.'],
        ['$B(E2)$ values in strongly deformed nuclei are much larger than single-particle estimates', true, 'Hundreds of Weisskopf units: many nucleons move coherently.'],
        ['most deformed nuclei have an oblate shape', false, 'The great majority of deformed ground states are prolate ($Q_0 \\gt 0$).'],
        ['the first $2^+$ energy is higher in deformed nuclei than in closed-shell nuclei', false, 'It is lowest in deformed mid-shell nuclei (tens of keV) and highest at closed shells (MeV).'],
        ['backbending comes from the alignment of a pair of high-$j$ nucleons along the rotation axis', true, 'Coriolis forces break the pair, and the aligned pair carries much of the angular momentum.'],
      ], { not });
      return { q: `Which of the following statements about collective nuclear motion are ${nt(not)}?`, ...m,
        trap: 'Rotor: $E(4^+)/E(2^+) = 3.33$; vibrator: 2.0.' };
    } },
  { id: 'coll-m32', type: 'mcq', level: 3, exams: ['gate', 'net'], sub: 'rotational bands', format: 'match',
    make(r) {
      const L = { rot: 'a good deformed rotor', vib: 'a near-harmonic spherical vibrator', gs: 'a gamma-soft (gamma-unstable) nucleus', sh: 'a nucleus near a closed shell, without simple collective structure' };
      const cls = choose(r, [['rot', 3.29, 3.33, [73, 82, 91, 100]], ['vib', 1.95, 2.2, [480, 560, 650, 780]], ['gs', 2.45, 2.55, [330, 420, 600]], ['sh', 1.3, 1.7, [1300, 1600, 2100]]]);
      const E2 = choose(r, cls[3]), R = cls[1] + (cls[2] - cls[1]) * r(), E4 = Math.round(E2 * R);
      const why = { rot: 'For a rigid rotor $E \\propto I(I + 1)$, so the ratio is $20/6 = 3.33$.', vib: 'Equally spaced phonons give $E(4^+) = 2E(2^+)$.', gs: 'A gamma-unstable rotor (Wilets-Jean) gives 2.5.', sh: 'A ratio below 2 is typical of nuclei close to closed shells, where seniority-type spectra appear.' }[cls[0]];
      return { q: `An even-even nucleus has its first $2^+$ level at ${E2} keV and first $4^+$ level at ${E4} keV. It is best described as`,
        ...matchOne(r, L, [null, cls[0], `$E(4^+)/E(2^+) = ${E4}/${E2} = ${(E4 / E2).toFixed(2)}$. ${why}`]),
        trap: 'Use the ratio $R_{4/2}$, not the absolute energies: 3.33 rotor, 2.5 gamma-soft, 2.0 vibrator.' };
    } },
  { id: 'coll-m33', type: 'mcq', level: 4, exams: ['gate', 'net'], sub: 'backbending', format: 'graph in words',
    make(r) {
      const L = {
        line0: 'a straight line through the origin',
        lineI: 'a straight line in $I$ with equal steps',
        sshape: 'rising slowly, then turning back on itself in an S shape',
        dec: 'a straight line sloping slowly downward',
        mid: 'rising from a minimum at the closed shell to a maximum at mid-shell',
      };
      const cas = choose(r, [
        ['$E(I)$ against $I(I + 1)$ for an ideal rotational band', 'line0', '$E = \\tfrac{\\hbar^2}{2\\mathcal I}I(I + 1)$: slope $\\hbar^2/2\\mathcal I$, through the origin.'],
        ['$E(I)$ against $I$ for the yrast states of an ideal vibrator ($I = 0, 2, 4, \\dots$ built from $I/2$ phonons)', 'lineI', 'Each extra phonon adds $\\hbar\\omega$ and two units of $I$.'],
        ['the moment of inertia $2\\mathcal I/\\hbar^2$ against $(\\hbar\\omega)^2$ through a band crossing', 'sshape', 'At the crossing an aligned two-quasiparticle band takes over: $\\mathcal I$ jumps while $\\omega$ falls briefly (backbending).'],
        ['$E(I)/[I(I + 1)]$ against $I(I + 1)$ for a real rotor with centrifugal stretching, $E = AI(I + 1) - B[I(I + 1)]^2$', 'dec', '$E/[I(I + 1)] = A - BI(I + 1)$: a line of small negative slope.'],
        ['$B(E2; 0^+ \\to 2^+)$ against neutron number from one closed shell to the middle of the shell', 'mid', 'Collectivity grows with the number of valence nucleons, peaking at mid-shell.'],
      ]);
      return { q: `A plot of ${cas[0]} looks like`, ...matchOne(r, L, cas),
        trap: 'Backbending is a plot of moment of inertia against rotational frequency squared, not of energy against spin.' };
    } },
  { id: 'coll-m34', type: 'mcq', level: 4, exams: ['gate', 'net'], sub: 'moment of inertia', format: 'limiting case',
    make(r) {
      const b = choose(r, [0.2, 0.25, 0.28, 0.3, 0.35]), x = (45 / (16 * Math.PI)) * b * b;
      const o = mcqOptions(r, x.toFixed(3), [(1 / x).toFixed(1), (45 / (16 * Math.PI) * b).toFixed(3), (b * b).toFixed(3), (2 * x).toFixed(3)]);
      return { q: `For small deformation $\\beta$, irrotational flow gives $\\mathcal I_{irr} = \\tfrac{9}{8\\pi}AmR^2\\beta^2$, and a rigid sphere has $\\mathcal I_{rig} = \\tfrac25AmR^2$. For $\\beta = ${b}$, the ratio $\\mathcal I_{irr}/\\mathcal I_{rig}$ is about`,
        options: o.options, answer: o.answer,
        sol: `$\\mathcal I_{irr}/\\mathcal I_{rig} = \\tfrac{9/8\\pi}{2/5}\\beta^2 = \\tfrac{45}{16\\pi}\\beta^2 = 0.895\\times${b}^2 = ${x.toFixed(3)}$. Measured values are typically 2-5 times $\\mathcal I_{irr}$ but well below $\\mathcal I_{rig}$: the nucleus is neither a fluid nor a rigid body.`,
        trap: 'Irrotational flow vanishes for a sphere ($\\propto\\beta^2$): only the deformed bulge takes part in the rotation.' };
    } },
  { id: 'coll-m35', type: 'mcq', level: 2, exams: ['gate', 'net'], sub: 'order of magnitude',
    make(r) {
      const A = choose(r, [150, 160, 170, 180, 230, 240]), R2 = 1.44 * A ** (2 / 3);
      const x = (197.33 ** 2) / (2 * 0.4 * A * 931.5 * R2) * 1000;
      const o = orderOpts(r, x, '\\text{keV}');
      return { q: `Treat a nucleus with $A = ${A}$ as a rigid sphere of radius $1.2A^{1/3}$ fm. The rotational constant $\\hbar^2/2\\mathcal I$ is about`,
        options: o.options, answer: o.answer,
        sol: `$\\mathcal I = \\tfrac25AmR^2$ with $R^2 = ${R2.toFixed(1)}$ fm$^2$. $\\hbar^2/2\\mathcal I = (\\hbar c)^2/(2\\cdot\\tfrac25Amc^2R^2) = 197.3^2/(0.8\\times${A}\\times931.5\\times${R2.toFixed(1)})$ MeV $= ${sci(x)}$ keV. Real deformed nuclei have $\\hbar^2/2\\mathcal I$ about 2 times larger (moment of inertia about half rigid), giving $E(2^+) = 6\\hbar^2/2\\mathcal I$ near 100 keV.`,
        trap: 'Rotational energies of heavy nuclei are tens of keV, far below single-particle energies of MeV.' };
    } },
];
