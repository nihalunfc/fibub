// Extra question shapes for shell-model (templates nsm-m31..m35). Imported by shell-model.js.
import { int, choose, mcqOptions } from '../_util.js';
import { msqOf } from './_more.js';
import { oneOf, matchOne } from './_odd.js';
import { vs, nt } from './_vary.js';

const LV = [['1s_{1/2}', 0, 1], ['1p_{3/2}', 1, 3], ['1p_{1/2}', 1, 1], ['1d_{5/2}', 2, 5], ['2s_{1/2}', 0, 1], ['1d_{3/2}', 2, 3], ['1f_{7/2}', 3, 7], ['2p_{3/2}', 1, 3], ['1g_{9/2}', 4, 9], ['1h_{11/2}', 5, 11], ['1i_{13/2}', 6, 13]];

export default [
  { id: 'nsm-m31', type: 'msq', level: 2, exams: ['gate', 'net'], sub: 'magic numbers', format: 'statements',
    make(r) {
      const [lab, l, j2] = choose(r, LV), par = l % 2 ? 'negative' : 'positive', not = r() < 0.5;
      const m = msqOf(r, [
        vs(r, `the $${lab}$ level holds ${j2 + 1} nucleons of one kind`, `the $${lab}$ level holds ${2 * (2 * l + 1)} nucleons of one kind`, `A level of given $j$ holds $2j + 1 = ${j2 + 1}$; $2(2l + 1) = ${2 * (2 * l + 1)}$ is the capacity of both $j = l \\pm 1/2$ together.`),
        vs(r, `the $${lab}$ level has ${par} parity`, `the $${lab}$ level has ${l % 2 ? 'positive' : 'negative'} parity`, `Parity is $(-1)^l$ with $l = ${l}$.`),
        ['a harmonic-oscillator well alone gives shell closures at 2, 8, 20, 40, 70, 112', true, 'Shell $N$ holds $(N + 1)(N + 2)$ nucleons; the running totals are 2, 8, 20, 40, 70, 112.'],
        ['in nuclei the spin-orbit force lowers the $j = l + 1/2$ member of each pair', true, 'The nuclear spin-orbit term has the opposite sign to the atomic one, so the stretched level comes down.'],
        ['the magic number 28 appears only once the spin-orbit splitting is included', true, 'It is $20 + 8$ from the $1f_{7/2}$ level pushed down below the rest of the $N = 3$ shell.'],
        ['the magic number 28 already appears with an oscillator well and no spin-orbit force', false, 'The oscillator closures are 2, 8, 20, 40, ...: 28 needs the spin-orbit splitting.'],
        ['${}^{16}$O, ${}^{40}$Ca, ${}^{48}$Ca and ${}^{208}$Pb are doubly magic', true, 'Their $(Z, N)$ are (8, 8), (20, 20), (20, 28) and (82, 126).'],
        ['in nuclei the spin-orbit force lowers the $j = l - 1/2$ member of each pair', false, 'It is the $j = l + 1/2$ member that comes down.'],
      ], { not });
      return { q: `Which of the following statements about the nuclear shell model are ${nt(not)}?`, ...m,
        trap: 'A single $j$ level holds $2j + 1$ nucleons; the parity follows $l$, not $j$.' };
    } },
  { id: 'nsm-m32', type: 'mcq', level: 3, exams: ['gate', 'net'], sub: 'limits of the model',
    make(r) {
      const not = r() < 0.5;
      const m = oneOf(r, [
        ['it predicts $0^+$ ground states for all even-even nuclei', true, 'Pairs of like nucleons in the same $j$ couple to $J = 0$.'],
        ['it explains why measured magnetic moments of odd-$A$ nuclei mostly lie between the Schmidt lines', false, 'The pure single-particle model predicts moments on the Schmidt lines; the observed scatter between them needs configuration mixing and meson currents, beyond the simple model.'],
        ['it explains the islands of long-lived isomers just below the magic numbers 50, 82 and 126', true, 'There high-$j$ intruder levels lie next to low-$j$ levels of opposite parity, giving high-multipolarity transitions.'],
        ['it predicts the ground-state spin and parity of most odd-$A$ nuclei', true, 'They follow the level of the last odd nucleon.'],
        ['it explains the jumps in separation energies just past the magic numbers', true, 'The next nucleon must go into a new shell across a large gap.'],
        ['it explains the large quadrupole moments and rotational bands of rare-earth nuclei', false, 'These need a deformed (collective or Nilsson) description.'],
        ['it predicts $0^+$ ground states for odd-odd nuclei', false, 'An odd proton and an odd neutron couple to a range of $J$, usually not zero.'],
      ], not);
      return { q: `Which statement about the (spherical, independent-particle) shell model is ${nt(not)}?`, ...m,
        trap: 'The spherical shell model works near closed shells; large deformations and rotational bands are beyond it.' };
    } },
  { id: 'nsm-m33', type: 'mcq', level: 3, exams: ['gate', 'net'], sub: 'oscillator shells', format: 'scaling',
    make(r) {
      const A = choose(r, [16, 27, 40, 64, 90, 125, 208]), hw = 41 / Math.cbrt(A);
      const o = mcqOptions(r, hw.toFixed(1), [(41 * Math.cbrt(A)).toFixed(0), (41 / Math.cbrt(A * A)).toFixed(2), (41 / A).toFixed(2), (41 / Math.sqrt(A)).toFixed(1)]);
      return { q: `With the usual estimate $\\hbar\\omega \\approx 41A^{-1/3}$ MeV, the spacing between major oscillator shells in a nucleus with $A = ${A}$ is about (in MeV)`,
        options: o.options, answer: o.answer,
        sol: `$A^{1/3} = ${Math.cbrt(A).toFixed(2)}$, so $\\hbar\\omega \\approx 41/${Math.cbrt(A).toFixed(2)} = ${hw.toFixed(1)}$ MeV. The estimate comes from matching the oscillator's mean square radius to $R = r_0A^{1/3}$: a larger nucleus has more closely spaced shells.`,
        trap: 'The spacing falls with $A$ (as $A^{-1/3}$): bigger box, smaller level spacing.' };
    } },
  { id: 'nsm-m34', type: 'mcq', level: 3, exams: ['gate', 'net'], sub: 'isomers', format: 'match',
    make(r) {
      const L = {
        intr: 'a high-$j$ intruder level lying next to low-$j$ levels of opposite parity',
        gap: 'a large energy gap at a closed shell',
        pair: 'the pairing of like nucleons to zero angular momentum',
        mix: 'configuration mixing and meson exchange currents',
        def: 'a permanent (collective) deformation of the nucleus',
      };
      const cas = choose(r, [
        ['Long-lived isomeric states cluster just below $N$ or $Z$ = 50, 82 and 126.', 'intr', 'The $g_{9/2}$, $h_{11/2}$ and $i_{13/2}$ levels sit among $p$, $d$ and $f$ levels of opposite parity: transitions between them need large $\\Delta J$ with a parity change (M4, E5), which are very slow.'],
        ['The two-neutron separation energy drops sharply after $N = 126$.', 'gap', 'The 127th and 128th neutrons must go into the next shell, across the gap.'],
        ['Every even-even nucleus has a $0^+$ ground state.', 'pair', 'Pairs in the same $j$ coupled to $J = 0$ gain extra binding.'],
        ['Measured magnetic moments of odd-$A$ nuclei mostly lie between the Schmidt lines.', 'mix', 'Pure single-particle states would sit on the lines; mixing of other configurations and meson currents pull the moments inward.'],
        ['Quadrupole moments of rare-earth nuclei are 10-20 times the single-particle estimate.', 'def', 'Many nucleons contribute coherently in a deformed nucleus.'],
        ['Separation energies alternate between even and odd neutron numbers.', 'pair', 'Adding a neutron that completes a pair gains the pairing energy; adding an unpaired one does not.'],
      ]);
      return { q: `${cas[0]} The shell-model explanation is`, ...matchOne(r, L, cas),
        trap: 'Isomer islands come from the spin-orbit intruders, not from the shell gap itself.' };
    } },
  { id: 'nsm-m35', type: 'mcq', level: 3, exams: ['gate', 'net'], sub: 'shell gaps', format: 'graph in words',
    make(r) {
      const M = choose(r, [50, 82, 126]);
      const L = {
        drop: `decreases smoothly with $N$ and then drops suddenly just after $N = ${M}$`,
        peak: `shows a sharp maximum at $N = ${M}$`,
        dip: `shows a sharp minimum at $N = ${M}$`,
        sign: `is positive just below $N = ${M}$ and negative just above it`,
        flat: `stays constant across $N = ${M}$`,
      };
      const cas = choose(r, [
        ['the two-neutron separation energy $S_{2n}$ along an isotopic chain', 'drop', `Each added neutron is a little less bound as the shell fills; past ${M} the next neutrons start a new shell across the gap.`],
        ['the energy of the first $2^+$ state in even-even nuclei', 'peak', 'A closed-shell core is stiff: making a $2^+$ state requires breaking a pair across the gap.'],
        ['the reduced transition probability $B(E2; 0^+ \\to 2^+)$ in even-even nuclei', 'dip', 'Closed-shell nuclei are spherical and stiff; collectivity, and with it $B(E2)$, is smallest there.', ['peak']],
        ['the thermal neutron-capture cross-section', 'dip', 'A closed-shell nucleus binds the extra neutron weakly, so the capture levels are sparse and the cross-section is small.'],
        ['the spectroscopic quadrupole moment of odd-$N$ nuclei', 'sign', 'One hole in a filled shell gives $Q \\gt 0$; one particle outside it gives $Q \\lt 0$.'],
      ]);
      return { q: `Plotted against neutron number $N$ through the magic number ${M}, ${cas[0]}`, ...matchOne(r, L, cas, ),
        trap: 'Magic numbers show up as peaks in excitation energies and dips in collectivity and capture.' };
    } },
];
