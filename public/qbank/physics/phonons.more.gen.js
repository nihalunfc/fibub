// Extra question shapes for phonons (templates ph-m31..m35). Imported by phonons.js.
import { int, choose, round, fmt } from '../_util.js';
import { msqOf, pickMcq, factMcq, oomMcq } from './_more.js';

export default [
  { id: 'ph-m31', type: 'mcq', level: 3, exams: ['gate', 'net'], sub: 'atomic motion in the diatomic chain', format: 'match the system',
    make(r) {
      const O = {
        inph: 'both kinds of atom move in phase, with equal amplitudes (the cell moves as a whole)',
        anti: 'the two atoms move in opposite directions, with amplitudes in the inverse ratio of their masses (the centre of mass stays still)',
        heavy: 'only the heavy atoms move; the light atoms stay at rest',
        light: 'only the light atoms move; the heavy atoms stay at rest',
      };
      const C = choose(r, [
        ['the acoustic branch as $k \\to 0$', 'inph', 'A long-wavelength acoustic wave is a sound wave: neighbouring cells move together and $\\omega = v_sk \\to 0$.'],
        ['the optical branch at $k = 0$', 'anti', 'Here $\\omega^2 = 2K(1/M_1 + 1/M_2)$; $M_1u_1 = -M_2u_2$, so in an ionic crystal the motion carries an oscillating dipole and couples to infrared light.'],
        ['the acoustic branch at the zone boundary $k = \\pi/a$', 'heavy', 'There $\\omega = \\sqrt{2K/M_{heavy}}$: the light sublattice sits at nodes and only the heavy atoms oscillate.'],
        ['the optical branch at the zone boundary $k = \\pi/a$', 'light', 'There $\\omega = \\sqrt{2K/M_{light}}$: only the light atoms oscillate, between stationary heavy neighbours.'],
      ]);
      const ratio = choose(r, [2, 3, 5]);
      const o = pickMcq(r, O[C[1]], Object.keys(O).filter((k) => k !== C[1]).map((k) => O[k]));
      return { q: `A 1D chain alternates atoms of masses $M_1 = ${ratio}M_2$ joined by identical springs (repeat distance $a$). For ${C[0]},`, ...o, sol: C[2],
        trap: 'At the zone boundary the two branches separate the sublattices: acoustic moves the heavy atoms, optical the light ones.' };
    } },
  { id: 'ph-m32', type: 'msq', level: 2, exams: ['gate', 'net', 'jam'], sub: 'monatomic chain', format: 'statements',
    make(r) {
      const K = int(r, 10, 60), mu = int(r, 20, 120), a = round(2.5 + 2 * r(), 2);
      const w0 = Math.sqrt(K / (mu * 1.66054e-27)), wm = 2 * w0, vs = w0 * a * 1e-10;
      const not = r() < 0.4;
      const m = msqOf(r, [
        [`The maximum angular frequency is $2\\sqrt{K/m} = ${fmt(wm, 3)}$ rad/s`, true, '$\\omega = 2\\sqrt{K/m}\\,|\\sin(ka/2)|$, largest at $k = \\pi/a$.'],
        [`The maximum angular frequency is $\\sqrt{K/m} = ${fmt(w0, 3)}$ rad/s`, false, `It is twice that: $${fmt(wm, 3)}$ rad/s.`],
        [`The speed of long-wavelength sound is $a\\sqrt{K/m} = ${Math.round(vs)}$ m/s`, true, 'For small $k$, $\\omega \\approx a\\sqrt{K/m}\\,k$.'],
        ['The group velocity vanishes at the zone boundary $k = \\pi/a$', true, 'The wave is a standing wave there.'],
        ['The group velocity is largest at the zone boundary', false, 'It is largest at $k \\to 0$ and zero at the boundary.'],
        [`At the zone boundary the phase velocity is $(2/\\pi)$ times the sound speed, $${Math.round(2 * vs / Math.PI)}$ m/s`, true, '$\\omega/k = 2\\sqrt{K/m}/(\\pi/a)$.'],
        ['Wavevectors $k$ and $k + 2\\pi/a$ describe the same atomic motion', true, 'The displacements are only defined at the atoms, $x = na$.'],
        ['The dispersion is linear for all $k$', false, 'Only for $ka \\ll 1$; it bends over to zero slope at the boundary.'],
      ], { not });
      return { q: `A chain of atoms of mass $${mu}$ u, spacing $${a}$ Å, joined by nearest-neighbour springs of $K = ${K}$ N/m. Which statements are ${not ? '<b>NOT</b> correct' : 'correct'}?`, ...m,
        trap: 'The maximum frequency is $2\\sqrt{K/m}$, not $\\sqrt{K/m}$: at the zone boundary neighbours move oppositely, doubling the stretch.' };
    } },
  { id: 'ph-m33', type: 'mcq', level: 2, exams: ['gate', 'net'], sub: 'phonon concepts', format: 'which is NOT',
    make(r) {
      const T = [
        ['Phonons are bosons with zero chemical potential', 'Their number is not conserved, so $\\mu = 0$ in equilibrium.'],
        ['A phonon carries crystal momentum $\\hbar k$, which is conserved only up to a reciprocal lattice vector', 'Umklapp processes transfer $\\hbar G$ to the lattice as a whole.'],
        ['Umklapp processes give a finite thermal resistance in a perfect crystal', 'Normal processes conserve the total crystal momentum and cannot relax a heat current.'],
        ['A crystal of $N$ primitive cells with $p$ atoms each has $3pN$ vibrational modes', 'One per degree of freedom.'],
        ['In an ionic crystal the LO frequency at $k = 0$ is higher than the TO frequency', 'Lyddane-Sachs-Teller: $\\omega_{LO}^2/\\omega_{TO}^2 = \\varepsilon(0)/\\varepsilon(\\infty) > 1$.'],
      ];
      const F = [
        ['The number of phonons is conserved in collisions', 'Phonons are created and destroyed freely; anharmonicity merges and splits them.'],
        ['Normal (non-Umklapp) processes alone give a finite thermal conductivity', 'They conserve total crystal momentum; a heat current would flow for ever.'],
        ['Acoustic phonons have a non-zero frequency at $k = 0$', 'A uniform translation costs no energy, so $\\omega \\to 0$.'],
        ['A monatomic Bravais crystal such as copper has optical branches', 'With one atom per primitive cell there are only 3 acoustic branches.'],
        ['A phonon carries true mechanical momentum $\\hbar k$', 'Except for $k = 0$, the atoms\' total momentum in a phonon is zero.'],
      ];
      const not = r() < 0.65;
      const o = factMcq(r, T, F, not);
      return { q: `About phonons in crystals, which ONE statement is ${not ? '<b>NOT</b> correct' : 'correct'}?`, ...o,
        trap: 'Crystal momentum is not true momentum; that is why Umklapp processes are possible.' };
    } },
  { id: 'ph-m34', type: 'mcq', level: 2, exams: ['gate', 'net', 'jam'], sub: 'phonon frequencies', format: 'order of magnitude',
    make(r) {
      const M = choose(r, [['lead', 1200, 3.5], ['copper', 3800, 2.55], ['aluminium', 5100, 2.86], ['silicon', 6000, 2.35], ['diamond', 12000, 1.54], ['sodium', 2500, 3.66], ['caesium', 1000, 5.3]]);
      const f = M[1] / (2 * M[2] * 1e-10);
      const o = oomMcq(r, f, 'Hz');
      return { q: `In ${M[0]} the speed of sound is about $${M[1]}$ m/s and the nearest-neighbour distance about $${M[2]}$ Å. Treating it as a chain, the highest phonon frequency $\\nu_{max} \\approx v_s/2a$ is closest to`, ...o,
        sol: `The shortest wavelength is $2a$, so $\\nu_{max} \\approx ${M[1]}/(2\\times${M[2]}\\times10^{-10}) = ${fmt(f, 2)}$ Hz, nearest $10^{${o.k}}$ Hz. Phonon frequencies are in the terahertz range, and $h\\nu_{max}/k_B$ is of the order of the Debye temperature.`,
        trap: 'Lattice vibrations are terahertz, far above ultrasound (MHz) but below visible light ($10^{14}$ to $10^{15}$ Hz).' };
    } },
  { id: 'ph-m35', type: 'mcq', level: 3, exams: ['gate', 'net'], sub: 'lattice thermal conductivity', format: 'graph in words',
    make(r) {
      const O = {
        t3: 'it grows as $T^3$ and is larger for a bigger sample',
        exp: 'it rises steeply as $T$ falls, roughly as $e^{\\theta_D/bT}$',
        inv: 'it falls as $1/T$',
        flat: 'it is small and nearly independent of temperature, rising only slowly',
      };
      const C = choose(r, [
        ['a pure insulating crystal at very low temperature ($T \\ll \\theta_D$, below the conductivity peak)', 't3', 'The mean free path is limited by the sample boundaries, so $\\kappa = \\tfrac13Cv\\ell \\propto C \\propto T^3$.'],
        ['a pure insulating crystal just above its conductivity peak (still $T < \\theta_D$)', 'exp', 'Umklapp processes need phonons with $k$ near the zone edge, whose number freezes out as $e^{-\\theta_D/bT}$, so the mean free path grows exponentially as $T$ falls.'],
        ['a pure insulating crystal at high temperature ($T \\gtrsim \\theta_D$)', 'inv', 'Heat capacity is constant and the number of phonons available for Umklapp scattering grows as $T$, so $\\ell \\propto 1/T$.'],
        ['a glass (amorphous solid) above about 20 K', 'flat', 'Disorder limits the mean free path to about the interatomic spacing at all temperatures.'],
      ]);
      const o = pickMcq(r, O[C[1]], Object.keys(O).filter((k) => k !== C[1]).map((k) => O[k]));
      return { q: `How does the lattice thermal conductivity $\\kappa(T)$ of ${C[0]} behave?`, ...o, sol: `Using $\\kappa = \\tfrac13Cv\\ell$: ${C[2]}`,
        trap: 'Normal processes do not limit $\\kappa$; it is Umklapp scattering (and boundaries and defects) that sets the mean free path.' };
    } },
];
