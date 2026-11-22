// The nuclear shell model (GATE / CSIR NET level): evidence for magic numbers, the harmonic-oscillator shells and
// their parity, spin-orbit splitting (<l.s>, the 2l+1 rule, intruder orbits), the level order and ground-state
// spin-parity of odd-A nuclei (particles and holes), odd-odd coupling, Schmidt magnetic moments, quadrupole signs,
// islands of isomerism, and a first look at collective bands (rotor and vibrator ratios, moments of inertia).
// Original questions for fibub.
import { pick, int, choose, mcqOptions, round, shuffle } from '../_util.js';
import more from './shell-model.more.gen.js';
import more2 from './shell-model.more2.gen.js';

const GSP = 5.586, GSN = -3.826;
const LL = ['s', 'p', 'd', 'f', 'g', 'h', 'i', 'j'];
// standard single-particle order (Mayer-Jensen) up to 126: [n, l, 2j]
const ORBITS = [[1, 0, 1], [1, 1, 3], [1, 1, 1], [1, 2, 5], [2, 0, 1], [1, 2, 3], [1, 3, 7], [2, 1, 3], [1, 3, 5], [2, 1, 1], [1, 4, 9], [1, 4, 7], [2, 2, 5], [2, 2, 3], [3, 0, 1], [1, 5, 11], [1, 5, 9], [2, 3, 7], [2, 3, 5], [3, 1, 3], [3, 1, 1], [1, 6, 13]];
const oname = ([n, l, j2]) => `${n}${LL[l]}_{${j2}/2}`;
const jp = ([, l, j2]) => `${j2}/2^${l % 2 ? '-' : '+'}`;
const lastOrbit = (k) => { let c = 0; for (const o of ORBITS) { c += o[2] + 1; if (k <= c) return o; } return null; };
const schmidt = (l, j2, proton) => {
  const j = j2 / 2, gl = proton ? 1 : 0, gs = proton ? GSP : GSN;
  return j2 === 2 * l + 1 ? (j - 0.5) * gl + gs / 2 : j / (j + 1) * ((j + 1.5) * gl - gs / 2);
};
const HB2U = 197.327 ** 2 / 931.494;   // hbar^2 / (1 u fm^2) in MeV
const MAGIC = [2, 8, 20, 28, 50, 82, 126];
const ODD_OK = [1, 3, 5, 7, 9, 11, 13, 15, 17, 19, 21, 23, 25, 27, 29, 31, 41, 43, 45, 47, 49];

export default {
  topic: 'shell-model',
  items: [
    // ---------- level 1 ----------
    { id: 'nsm-001', type: 'mcq', level: 1, exams: ['jam', 'gate', 'net'], sub: 'magic numbers',
      q: 'The nuclear magic numbers (for protons or neutrons) are',
      options: ['$2, 10, 18, 36, 54, 86$', '$2, 8, 20, 28, 50, 82, 126$', '$2, 8, 20, 40, 70, 112$', '$2, 6, 12, 20, 30, 42$'], answer: 1,
      sol: 'Nuclei with these numbers of protons or neutrons are unusually tightly bound. The first list is the noble-gas atomic numbers (atomic shells), the third the harmonic-oscillator closures, which match only up to 20. Spin-orbit splitting is what turns the oscillator sequence into the real one.',
      trap: 'The noble gases close electron shells, not nuclear ones.' },
    { id: 'nsm-002', type: 'mcq', level: 1, exams: ['jam', 'gate', 'net'], sub: 'magic numbers',
      q: 'Which of the following is NOT evidence for nuclear magic numbers?',
      options: ['the sudden drop of the neutron separation energy just after a magic $N$', 'the high energy of the first $2^+$ state in doubly magic even-even nuclei', 'the large number of stable isotopes or isotones at magic $Z$ or $N$', 'the very large electric quadrupole moments of magic nuclei'], answer: 3,
      sol: 'Magic nuclei are spherical, so their quadrupole moments are close to zero; the large moments belong to nuclei midway between closed shells. The other three are classic signatures: a new shell starts after the closure, closed shells are stiff against excitation, and extra binding makes more stable species (tin, $Z = 50$, has ten stable isotopes).',
      trap: 'Large quadrupole moments signal deformation, which happens away from closed shells.' },
    { id: 'nsm-003', type: 'mcq', level: 1, exams: ['gate', 'net'], sub: 'spin-orbit',
      q: 'In the nuclear shell model, for a given orbital angular momentum $l > 0$, the strong spin-orbit interaction',
      options: ['lowers the $j = l + \\tfrac12$ level and raises $j = l - \\tfrac12$', 'lowers the $j = l - \\tfrac12$ level and raises $j = l + \\tfrac12$', 'has no effect on the energies, only on the magnetic moments', 'affects only protons'], answer: 0,
      sol: 'The nuclear potential contains $-V_{ls}(r)\\,\\vec l\\cdot\\vec s$ with $V_{ls} > 0$, so the state with spin parallel to orbit ($j = l + \\tfrac12$, $\\langle\\vec l\\cdot\\vec s\\rangle = l\\hbar^2/2$) is lower. The splitting is several MeV and grows with $l$, large enough to move levels between oscillator shells. It is a strong-force effect and acts on neutrons and protons alike.',
      trap: 'In atoms the fine-structure ordering is the opposite and the effect is tiny; nuclear spin-orbit is not magnetic.' },
    { id: 'nsm-004', type: 'mcq', level: 1, exams: ['jam', 'gate', 'net'], sub: 'level scheme',
      q: 'How many neutrons can occupy the $1f_{7/2}$ level?',
      options: ['$7$', '$14$', '$8$', '$16$'], answer: 2,
      sol: 'A level of angular momentum $j$ has $2j + 1$ magnetic substates, each holding one neutron (Pauli): $2\\times\\tfrac72 + 1 = 8$. Filling it after 20 gives the magic number 28.',
      trap: '$2(2l + 1) = 14$ counts both $j$ values of the $f$ orbit together.' },
    { id: 'nsm-005', type: 'mcq', level: 1, exams: ['gate', 'net'], sub: 'parity',
      q: 'A nucleon in the $1d_{5/2}$ orbit has parity',
      options: ['$-1$, because $j$ is half-integer', 'positive, because $l = 2$ is even', 'that depends on the principal number $n = 1$', 'negative, because $j = 5/2$'], answer: 1,
      sol: 'Parity of a single-particle orbit is $(-1)^l$; the letter gives $l$ ($s, p, d, f, g, h = 0, 1, 2, 3, 4, 5$). For $d$, $l = 2$ and the parity is $+$. Neither $j$ nor the radial number $n$ affects it.',
      trap: 'Reading parity from $j$; only the orbital part of the wavefunction changes sign under inversion.' },
    { id: 'nsm-006', type: 'mcq', level: 1, exams: ['jam', 'gate', 'net'], sub: 'magic numbers',
      q: 'Which nucleus is doubly magic?',
      options: ['${}^{209}$Bi', '${}^{56}$Fe', '${}^{238}$U', '${}^{208}$Pb'], answer: 3,
      sol: '${}^{208}$Pb has $Z = 82$ and $N = 126$, both magic. ${}^{209}$Bi has one proton beyond $Z = 82$; ${}^{56}$Fe has $Z = 26$, $N = 30$; ${}^{238}$U is far from closed shells and strongly deformed.',
      trap: 'Heavy is not the same as magic.' },

    // ---------- level 2 ----------
    { id: 'nsm-007', type: 'mcq', level: 2, exams: ['gate', 'net'], sub: 'ground-state spin',
      q: 'The extreme single-particle shell model predicts the ground state of ${}^{17}$O ($Z = 8$, $N = 9$) to be',
      options: ['$\\tfrac12^+$', '$\\tfrac52^+$', '$\\tfrac52^-$', '$\\tfrac32^-$'], answer: 1,
      sol: 'The 8 protons and the first 8 neutrons fill $1s_{1/2}$, $1p_{3/2}$, $1p_{1/2}$ and pair to zero. The 9th neutron goes into the next level, $1d_{5/2}$: $j = 5/2$, parity $(-1)^2 = +$. Measured: $\\tfrac52^+$.',
      trap: 'The $2s_{1/2}$ level is just above $1d_{5/2}$; it gives the first excited state ($\\tfrac12^+$ at $0.87$ MeV).' },
    { id: 'nsm-008', type: 'mcq', level: 2, exams: ['gate', 'net'], sub: 'ground-state spin',
      q: 'The ground state of ${}^{15}$N ($Z = 7$, $N = 8$) is predicted by the shell model to be',
      options: ['$\\tfrac32^-$', '$\\tfrac12^+$', '$\\tfrac12^-$', '$\\tfrac52^+$'], answer: 2,
      sol: 'The neutrons fill the $N = 8$ shell. Seven protons are one short of filling $1p_{1/2}$: a single hole in $1p_{1/2}$. A hole carries the $j$ and parity of the missing nucleon: $\\tfrac12^-$ (measured).',
      trap: 'Counting the 7th proton as the first in $1p_{3/2}$; the $1p_{3/2}$ level (4 places) is already full after 6.' },
    { id: 'nsm-009', type: 'nat', level: 2, exams: ['gate', 'net'], sub: 'spin-orbit', unit: 'ħ²',
      q: 'For a nucleon in the $1f_{5/2}$ orbit, $\\langle\\vec l\\cdot\\vec s\\rangle$ in units of $\\hbar^2$ is ______.',
      answer: -2, tol: 0, calc: () => (2.5 * 3.5 - 3 * 4 - 0.75) / 2,
      sol: '$\\vec l\\cdot\\vec s = \\tfrac12(j^2 - l^2 - s^2)$, so $\\langle\\vec l\\cdot\\vec s\\rangle = \\tfrac12[j(j + 1) - l(l + 1) - \\tfrac34]\\hbar^2 = \\tfrac12[8.75 - 12 - 0.75] = -2$. In general $-\\tfrac12(l + 1)$ for $j = l - \\tfrac12$ and $+\\tfrac12l$ for $j = l + \\tfrac12$.',
      trap: 'Forgetting $s(s + 1) = 3/4$.' },
    { id: 'nsm-010', type: 'msq', level: 2, exams: ['gate', 'net'], sub: 'oscillator shells',
      q: 'Which statements about the three-dimensional harmonic-oscillator shell model are correct?',
      options: ['Its closed shells at 2, 8 and 20 agree with the first three magic numbers', 'All levels of oscillator shell $N$ have the same parity $(-1)^N$', 'Adding spin-orbit splitting pulls $1f_{7/2}$ down out of the $N = 3$ shell, creating the magic number 28', 'The oscillator alone predicts the magic number 28'], answer: [0, 1, 2],
      sol: 'Shell $N$ holds $(N + 1)(N + 2)$ nucleons of one kind (with spin), giving closures 2, 8, 20, 40, 70, 112. Its orbits have $l = N, N - 2, \\dots$, all with parity $(-1)^N$. The real sequence 28, 50, 82, 126 appears only when the highest-$j$ level of each shell is pushed down by the spin-orbit force.',
      trap: 'The oscillator gives 40, not 28, after 20.' },
    { id: 'nsm-011', type: 'nat', level: 2, exams: ['gate', 'net'], sub: 'oscillator shells',
      q: 'The $N = 4$ shell of the three-dimensional harmonic oscillator can hold ______ neutrons.',
      answer: 30, tol: 0, calc: () => 5 * 6,
      sol: 'Shell $N$ has $\\tfrac12(N + 1)(N + 2)$ spatial states, doubled for spin: $(N + 1)(N + 2) = 5\\times6 = 30$. Check by orbits: $N = 4$ contains $1g$, $2d$, $3s$ with $2(2l + 1) = 18 + 10 + 2 = 30$.',
      trap: 'Forgetting the spin factor gives 15.' },
    { id: 'nsm-012', type: 'mcq', level: 2, exams: ['gate', 'net'], sub: 'ground-state spin',
      q: '${}^{209}$Bi has one proton beyond the doubly magic ${}^{208}$Pb. Its ground-state spin and parity are',
      options: ['$\\tfrac92^-$', '$\\tfrac92^+$', '$\\tfrac72^-$', '$\\tfrac{11}2^-$'], answer: 0,
      sol: 'The first proton orbit above $Z = 82$ is $1h_{9/2}$ ($l = 5$, odd parity). So $J^\\pi = \\tfrac92^-$, as measured. (For neutrons beyond 126 the next orbit is $2g_{9/2}$: ${}^{209}$Pb is $\\tfrac92^+$.)',
      trap: 'Confusing the proton and neutron orbits above lead.' },
    { id: 'nsm-013', type: 'mcq', level: 2, exams: ['gate', 'net'], sub: 'ground-state spin',
      q: '${}^{207}$Pb has one neutron fewer than ${}^{208}$Pb. The highest filled neutron orbit below $N = 126$ is $3p_{1/2}$. The ground state of ${}^{207}$Pb is',
      options: ['$0^+$', '$\\tfrac12^+$', '$\\tfrac{13}2^+$', '$\\tfrac12^-$'], answer: 3,
      sol: 'A single hole in $3p_{1/2}$ carries $j = \\tfrac12$ and parity $(-1)^1 = -$. So $\\tfrac12^-$, as measured (and the reason ${}^{207}$Pb is used in NMR with $I = \\tfrac12$).',
      trap: 'The $1i_{13/2}$ orbit is in the same shell but lies lower for neutrons; the last orbit filled is $3p_{1/2}$.' },
    { id: 'nsm-014', type: 'nat', level: 2, exams: ['gate', 'net'], sub: 'level scheme',
      q: 'Between the magic numbers 28 and 50 the orbits are $2p_{3/2}$, $1f_{5/2}$, $2p_{1/2}$ and $1g_{9/2}$. Together they hold ______ nucleons of one kind.',
      answer: 22, tol: 0, calc: () => 4 + 6 + 2 + 10,
      sol: '$2j + 1$ for each: $4 + 6 + 2 + 10 = 22$, and $28 + 22 = 50$. Note that $1g_{9/2}$ comes from the $N = 4$ oscillator shell but sits with the $N = 3$ orbits: it is an intruder of opposite parity.',
      trap: 'Using $2l + 1$ instead of $2j + 1$.' },
    { id: 'nsm-015', type: 'mcq', level: 2, exams: ['gate', 'net'], sub: 'excited states',
      q: 'In the single-particle picture, the first excited state of ${}^{17}$O (at $0.87$ MeV) arises from',
      options: ['breaking a proton pair', 'a rotation of the whole nucleus', 'the odd neutron moving from $1d_{5/2}$ to $2s_{1/2}$, giving $\\tfrac12^+$', 'the odd neutron moving to $1p_{1/2}$'], answer: 2,
      sol: 'The cheapest excitation of a nucleus with one nucleon outside a closed core is to promote that nucleon to the next orbit. Above $1d_{5/2}$ lies $2s_{1/2}$: $\\tfrac12^+$, as observed. Breaking the doubly magic ${}^{16}$O core costs several MeV.',
      trap: 'The $1p_{1/2}$ orbit is full; the odd neutron cannot go down into it.' },
    { id: 'nsm-016', type: 'mcq', level: 2, exams: ['gate', 'net'], sub: 'magic numbers',
      q: 'Which of these calcium isotopes is doubly magic besides ${}^{40}$Ca?',
      options: ['${}^{42}$Ca', '${}^{44}$Ca', '${}^{46}$Ca', '${}^{48}$Ca'], answer: 3,
      sol: 'Calcium has $Z = 20$. ${}^{48}$Ca has $N = 28$, the closure made by the spin-orbit-lowered $1f_{7/2}$ level. It is stable despite eight extra neutrons, a striking proof of the 28 closure.',
      trap: 'Thinking only $N = Z$ nuclei can be doubly magic.' },

    // ---------- level 3 ----------
    { id: 'nsm-017', type: 'nat', level: 3, exams: ['gate', 'net'], sub: 'Schmidt moments', unit: 'μN',
      q: 'The odd proton of ${}^{209}$Bi is in $1h_{9/2}$. With $g_s = 5.586$ and $g_l = 1$, the Schmidt value of its magnetic moment, $\\mu = \\dfrac{j}{j + 1}\\left[(j + \\tfrac32)g_l - \\tfrac12g_s\\right]\\mu_N$ for $j = l - \\tfrac12$, is ______ $\\mu_N$ (to two decimal places).',
      answer: 2.62, tol: 0.01, calc: () => 4.5 / 5.5 * (6 - 2.793),
      sol: '$h$ means $l = 5$, so $j = 9/2 = l - \\tfrac12$. $\\mu = \\dfrac{4.5}{5.5}(6 - 2.793) = 0.8182\\times3.207 = 2.62\\,\\mu_N$. The measured $4.11\\,\\mu_N$ lies between the two Schmidt lines, as most moments do.',
      trap: 'Using the $j = l + \\tfrac12$ formula, which gives $j + 2.29 = 6.79\\,\\mu_N$.' },
    { id: 'nsm-018', type: 'nat', level: 3, exams: ['gate', 'net'], sub: 'Schmidt moments', unit: 'μN',
      q: '${}^{39}$K has a proton hole in $1d_{3/2}$. A single hole has the same Schmidt moment as a single particle in that orbit. With $g_s = 5.586$, $g_l = 1$, the Schmidt moment is ______ $\\mu_N$ (to three decimal places).',
      answer: 0.124, tol: 0.003, calc: () => 1.5 / 2.5 * (3 - 2.793),
      sol: '$d$ gives $l = 2$, $j = \\tfrac32 = l - \\tfrac12$. $\\mu = \\dfrac{j}{j + 1}[(j + \\tfrac32) - 2.793] = 0.6\\times(3 - 2.793) = 0.124\\,\\mu_N$. (Measured $0.391\\,\\mu_N$.)',
      trap: 'Changing the sign for a hole: the magnetic moment of a hole equals that of the particle (unlike the quadrupole moment).' },
    { id: 'nsm-019', type: 'msq', level: 3, exams: ['gate', 'net'], sub: 'Schmidt moments',
      q: 'Which statements about Schmidt (single-particle) magnetic moments are correct?',
      options: ['For an odd neutron with $j = l + \\tfrac12$, $\\mu = -1.913\\,\\mu_N$ whatever $l$ is', 'For an odd proton with $j = l + \\tfrac12$, $\\mu = (j + 2.293)\\,\\mu_N$', 'Measured moments of odd-$A$ nuclei lie exactly on the Schmidt lines', 'The two Schmidt lines for protons bound most measured moments of odd-proton nuclei'], answer: [0, 1, 3],
      sol: 'For $j = l + \\tfrac12$, $\\mu = (j - \\tfrac12)g_l + \\tfrac12g_s$. Neutron: $g_l = 0$, so $\\mu = g_s/2 = -1.913$. Proton: $\\mu = j - \\tfrac12 + 2.793 = j + 2.293$. Real moments are quenched towards the middle by core polarisation and meson currents, so they fall between the lines, not on them.',
      trap: 'The Schmidt values are limits, not predictions to 1%.' },
    { id: 'nsm-020', type: 'mcq', level: 3, exams: ['gate', 'net'], sub: 'isomers',
      q: 'Long-lived nuclear isomers cluster at odd $N$ or $Z$ just below the magic numbers 50, 82 and 126 ("islands of isomerism"). The shell-model reason is that',
      options: ['these nuclei are deformed', 'a high-$j$ intruder orbit of opposite parity (such as $1g_{9/2}$ near $2p_{1/2}$) lies close to a low-$j$ orbit, so the transition between them needs a large angular momentum change with a parity change (M4, E5) and is very slow', 'the Coulomb barrier is highest there', 'beta decay is forbidden there'], answer: 1,
      sol: 'Below 50, the $2p_{1/2}$ ($\\tfrac12^-$) and $1g_{9/2}$ ($\\tfrac92^+$) levels are close. A gamma ray connecting them changes $J$ by 4 with a parity change: M4. Weisskopf rates fall steeply with multipolarity, so half-lives of seconds to years follow (for example ${}^{87m}$Sr, ${}^{93m}$Nb). Similar pairs exist below 82 ($1h_{11/2}$, $2d_{3/2}$) and 126 ($1i_{13/2}$, $3p_{1/2}$).',
      trap: 'Isomers are about gamma transitions being hindered, not about beta decay.' },
    { id: 'nsm-021', type: 'nat', level: 3, exams: ['gate', 'net'], sub: 'spin-orbit', unit: 'MeV',
      q: 'Assume the spin-orbit term has the same radial strength for the $1p$ and $1d$ orbits. If the $1p_{3/2}$-$1p_{1/2}$ splitting is $6.0$ MeV, the $1d_{5/2}$-$1d_{3/2}$ splitting is ______ MeV.',
      answer: 10, tol: 0.05, calc: () => 6 * 5 / 3,
      sol: 'The difference of $\\langle\\vec l\\cdot\\vec s\\rangle$ between $j = l + \\tfrac12$ and $j = l - \\tfrac12$ is $\\tfrac12l - [-\\tfrac12(l + 1)] = \\tfrac12(2l + 1)$. So splittings scale as $2l + 1$: $6.0\\times5/3 = 10$ MeV. (The real ${}^{17}$O value, about 5 MeV, is smaller because the radial factor differs.)',
      trap: 'Scaling with $l$ (giving 12 MeV) instead of $2l + 1$.' },
    { id: 'nsm-022', type: 'mcq', level: 3, exams: ['gate', 'net'], sub: 'collective bands',
      q: 'For the ground-state rotational band of an ideal rigid rotor (even-even, $K = 0$), the ratio $E(4^+)/E(2^+)$ is',
      options: ['$2.00$', '$3.00$', '$10/3$', '$4.00$'], answer: 2,
      sol: '$E_I = \\dfrac{\\hbar^2}{2\\mathcal I}I(I + 1)$, so $E(4)/E(2) = 20/6 = 3.33$. A harmonic vibrator gives 2.00 (two phonons for $4^+$, one for $2^+$). Measured ratios near 3.3 identify deformed rotors (rare earths, actinides).',
      trap: 'Taking $E \\propto I^2$ gives 4.' },
    { id: 'nsm-023', type: 'nat', level: 3, exams: ['gate', 'net'], sub: 'collective bands', unit: 'keV',
      q: 'A deformed even-even nucleus has its first $2^+$ level at $90.0$ keV. If its ground band is an ideal rotor, the $6^+$ member lies at ______ keV.',
      answer: 630, tol: 1, calc: () => 90 * 42 / 6,
      sol: '$E_I \\propto I(I + 1)$: $E(6^+) = 90.0\\times\\dfrac{6\\times7}{2\\times3} = 90.0\\times7 = 630$ keV.',
      trap: 'Scaling with $I$ (giving 270 keV) or with $I^2$ (810 keV).' },
    { id: 'nsm-024', type: 'mcq', level: 3, exams: ['gate', 'net'], sub: 'odd-odd nuclei',
      q: 'In an odd-odd nucleus, the odd proton is in $1d_{3/2}$ and the odd neutron in $1f_{7/2}$. The possible states of this configuration are',
      options: ['$J = 2, 3, 4, 5$, all positive parity', '$J = 2, 3, 4, 5$, all negative parity', '$J = 1, 2, 3, 4$, all negative parity', 'only $J = 5$ with negative parity'], answer: 1,
      sol: 'Coupling $j_p = \\tfrac32$ and $j_n = \\tfrac72$ gives $|j_p - j_n| \\le J \\le j_p + j_n$: $2, 3, 4, 5$. Parity is the product $(-1)^{l_p + l_n} = (-1)^{2 + 3} = -1$. (${}^{38}$Cl has this configuration with a $2^-$ ground state.)',
      trap: 'Taking the parity from one nucleon only.' },
    { id: 'nsm-025', type: 'msq', level: 3, exams: ['gate', 'net'], sub: 'ground-state spin',
      q: 'Which of these nuclei does the single-particle shell model predict to have a negative-parity ground state?',
      options: ['${}^{41}$Ca ($N = 21$)', '${}^{13}$C ($N = 7$)', '${}^{17}$F ($Z = 9$)', '${}^{209}$Pb ($N = 127$)'], answer: [0, 1],
      sol: '${}^{41}$Ca: neutron in $1f_{7/2}$, $\\tfrac72^-$. ${}^{13}$C: neutron in $1p_{1/2}$, $\\tfrac12^-$. ${}^{17}$F: proton in $1d_{5/2}$, $\\tfrac52^+$. ${}^{209}$Pb: neutron in $2g_{9/2}$, $\\tfrac92^+$. All four agree with experiment.',
      trap: 'For ${}^{13}$C the 7th neutron goes into $1p_{1/2}$ (after 6 fill $1s_{1/2}$ and $1p_{3/2}$), not into $1d_{5/2}$.' },
    { id: 'nsm-026', type: 'mcq', level: 3, exams: ['gate', 'net'], sub: 'ground-state spin',
      q: '${}^{93}$Nb has $Z = 41$ and $N = 52$. The single-particle shell model gives its ground state as',
      options: ['$\\tfrac52^+$', '$\\tfrac12^-$', '$\\tfrac72^+$', '$\\tfrac92^+$'], answer: 3,
      sol: '$N = 52$ is even, so the neutrons pair to zero. The 41st proton is the first beyond the closed $Z = 40$ sub-shell ($2p_{1/2}$ full), and goes into $1g_{9/2}$: $\\tfrac92^+$ (measured).',
      trap: 'Placing the odd nucleon by $N$ when $N$ is even.' },
    { id: 'nsm-027', type: 'nat', level: 3, exams: ['gate', 'net'], sub: 'oscillator shells', unit: 'MeV',
      q: 'The oscillator spacing that reproduces nuclear radii is about $\\hbar\\omega \\approx 41A^{-1/3}$ MeV. For $A = 64$, $\\hbar\\omega$ = ______ MeV (to two decimal places).',
      answer: 10.25, tol: 0.02, calc: () => 41 / 4,
      sol: '$64^{1/3} = 4$, so $\\hbar\\omega = 41/4 = 10.25$ MeV. Major-shell gaps are of this size, which is why closed-shell nuclei have high first excited states.',
      trap: 'Using $A^{-2/3}$.' },
    { id: 'nsm-028', type: 'mcq', level: 3, exams: ['gate', 'net'], sub: 'pairing in the shell model',
      q: 'Three neutrons occupy the $1f_{7/2}$ orbit outside a closed ${}^{40}$Ca core (as in ${}^{43}$Ca). The ground-state spin is predicted to be',
      options: ['$\\tfrac72$', '$\\tfrac{21}2$', '$\\tfrac32$', '$\\tfrac{15}2$'], answer: 0,
      sol: 'The short-range pairing force makes two of the identical nucleons couple to $J = 0$; the third carries $j = \\tfrac72$ (seniority 1). So $J = \\tfrac72$, parity $(-1)^3 = -$: $\\tfrac72^-$, as measured. This is why the extreme single-particle model works for odd-$A$ nuclei.',
      trap: 'Adding the three $j$ values, which the Pauli principle and pairing do not allow for the ground state.' },

    // ---------- level 4 ----------
    { id: 'nsm-029', type: 'nat', level: 4, exams: ['gate', 'net'], sub: 'Schmidt moments', unit: 'μN',
      q: 'The odd proton of ${}^{93}$Nb is in $1g_{9/2}$. With $g_s = 5.586$ and $g_l = 1$, the Schmidt moment is ______ $\\mu_N$ (to two decimal places).',
      answer: 6.79, tol: 0.01, calc: () => 4 + 5.586 / 2,
      sol: '$g$: $l = 4$, $j = \\tfrac92 = l + \\tfrac12$. $\\mu = (j - \\tfrac12)g_l + \\tfrac12g_s = 4 + 2.793 = 6.79\\,\\mu_N$. Measured: $6.17\\,\\mu_N$.',
      trap: 'Using $g_s = 2$ as for an electron.' },
    { id: 'nsm-030', type: 'nat', level: 4, exams: ['gate', 'net'], sub: 'Schmidt moments', unit: 'μN',
      q: 'The odd neutron of ${}^{13}$C is in $1p_{1/2}$. With $g_s = -3.826$ and $g_l = 0$, the Schmidt moment is ______ $\\mu_N$ (to three decimal places).',
      answer: 0.638, tol: 0.003, calc: () => 0.5 / 1.5 * (3.826 / 2),
      sol: '$j = \\tfrac12 = l - \\tfrac12$ with $l = 1$. $\\mu = \\dfrac{j}{j + 1}\\left[(j + \\tfrac32)\\cdot0 - \\tfrac12(-3.826)\\right] = \\tfrac13\\times1.913 = 0.638\\,\\mu_N$, positive: the neutron spin points against $\\vec j$. Measured $0.702\\,\\mu_N$.',
      trap: 'Expecting a negative moment for any odd-neutron nucleus: for $j = l - \\tfrac12$ it is positive.' },
    { id: 'nsm-031', type: 'msq', level: 4, exams: ['gate', 'net'], sub: 'collective bands',
      q: 'Which statements about rotational bands of deformed even-even nuclei are correct?',
      options: ['The ground band has $I^\\pi = 0^+, 2^+, 4^+, \\dots$ (odd $I$ are missing)', 'The level energies follow $E_I \\approx \\dfrac{\\hbar^2}{2\\mathcal I}I(I + 1)$', 'The moment of inertia equals that of a rigid sphere of the same mass exactly', 'Such bands appear mainly far from closed shells'], answer: [0, 1, 3],
      sol: 'A reflection-symmetric shape with $K = 0$ allows only even $I$ with positive parity. Energies go as $I(I + 1)$. Measured moments of inertia are about half the rigid value, because pairing makes the nucleus behave partly like a superfluid. Deformation, and hence rotation, appears midway between closed shells.',
      trap: 'Rigid-body moment of inertia overestimates by about a factor of 2.' },
    { id: 'nsm-032', type: 'nat', level: 4, exams: ['gate', 'net'], sub: 'collective bands', unit: 'keV',
      q: 'The $2^+$ level of a rotational ground band is at $80.0$ keV. The rotational constant $\\hbar^2/2\\mathcal I$ is ______ keV (to two decimal places).',
      answer: 13.33, tol: 0.02, calc: () => 80 / 6,
      sol: '$E(2^+) = \\dfrac{\\hbar^2}{2\\mathcal I}\\times2\\times3 = 6\\dfrac{\\hbar^2}{2\\mathcal I}$, so $\\hbar^2/2\\mathcal I = 80.0/6 = 13.33$ keV. The band then predicts $4^+$ at 267 keV and $6^+$ at 560 keV.',
      trap: 'Dividing by 2 (the spin) instead of $I(I + 1) = 6$.' },
    { id: 'nsm-033', type: 'mcq', level: 4, exams: ['gate', 'net'], sub: 'quadrupole moments',
      q: 'For a nucleus with one proton beyond a closed shell, and one with a single proton hole in a closed shell (same orbit $j \\ge \\tfrac32$), the spectroscopic quadrupole moments are expected to be',
      options: ['both zero', 'both positive', 'equal in size and opposite in sign: negative for the particle, positive for the hole', 'positive for the particle, negative for the hole'], answer: 2,
      sol: 'A single proton in an orbit with maximum $m = j$ moves near the equatorial plane, making the charge distribution oblate: $Q < 0$. A hole is a missing equatorial charge, so the remaining distribution is prolate: $Q > 0$, of the same size. ${}^{209}$Bi has $Q = -0.5$ b, as expected for a particle.',
      trap: 'Magnetic moments of particle and hole are equal; quadrupole moments change sign.' },
    { id: 'nsm-034', type: 'nat', level: 4, exams: ['gate', 'net'], sub: 'odd-odd nuclei',
      q: 'An odd-odd nucleus has its odd proton in a $j = 7/2$ orbit and its odd neutron in a $j = 3/2$ orbit. The number of distinct total angular momentum values this configuration allows is ______.',
      answer: 4, tol: 0, calc: () => 2 * 1.5 + 1,
      sol: '$J$ runs from $|7/2 - 3/2| = 2$ to $7/2 + 3/2 = 5$: $J = 2, 3, 4, 5$, which is $2\\min(j_p, j_n) + 1 = 4$ values.',
      trap: 'Counting magnetic substates instead of $J$ values.' },
    { id: 'nsm-035', type: 'mcq', level: 4, exams: ['gate', 'net'], sub: 'level scheme',
      q: 'The orbits between the magic numbers 50 and 82 are',
      options: ['$1g_{9/2}$, $2d_{5/2}$, $2d_{3/2}$, $3s_{1/2}$', '$1h_{9/2}$, $2f_{7/2}$, $2f_{5/2}$, $3p_{3/2}$, $3p_{1/2}$, $1i_{13/2}$', '$1f_{5/2}$, $2p_{3/2}$, $2p_{1/2}$, $1g_{9/2}$', '$1g_{7/2}$, $2d_{5/2}$, $2d_{3/2}$, $3s_{1/2}$, $1h_{11/2}$'], answer: 3,
      sol: 'The $N = 4$ oscillator shell minus its $1g_{9/2}$ (pushed down to 50) plus the $1h_{11/2}$ intruder from $N = 5$: $8 + 6 + 4 + 2 + 12 = 32$ places, and $50 + 32 = 82$. The second list is the 82 to 126 shell; the third is 28 to 50.',
      trap: 'Forgetting the intruder: without $1h_{11/2}$ the shell holds only 20.' },
    { id: 'nsm-036', type: 'mcq', level: 4, exams: ['gate', 'net'], sub: 'shell gaps',
      q: 'Neutron separation energies: ${}^{208}$Pb $7.37$ MeV, ${}^{209}$Pb $3.94$ MeV. The best reading of these numbers is',
      options: ['a neutron shell gap of about $3.4$ MeV at $N = 126$', 'a pairing energy of $7.4$ MeV', 'evidence that ${}^{209}$Pb is unbound', 'a proton shell gap at $Z = 82$'], answer: 0,
      sol: 'The last neutron of ${}^{208}$Pb sits in the top orbit below 126 ($3p_{1/2}$); that of ${}^{209}$Pb in the first orbit above ($2g_{9/2}$). Their binding differs by $7.37 - 3.94 = 3.4$ MeV, the size of the gap (pairing contributes too, which is why $S_{2n}$ or averaged differences are used for precise gaps).',
      trap: 'Separation energies of neutrons measure neutron shells, not proton shells.' },

    // ---------- level 5 ----------
    { id: 'nsm-037', type: 'nat', level: 5, exams: ['gate', 'net'], sub: 'spin-orbit', unit: 'MeV',
      q: 'Relative to ${}^{16}$O plus a neutron, the $1d_{5/2}$ and $1d_{3/2}$ single-particle levels in ${}^{17}$O are at $-4.14$ MeV and $+0.94$ MeV. A pure $\\vec l\\cdot\\vec s$ interaction leaves the $(2j + 1)$-weighted centroid of a spin-orbit pair unshifted. The unsplit $1d$ energy is ______ MeV (to two decimal places).',
      answer: -2.11, tol: 0.01, calc: () => (6 * -4.14 + 4 * 0.94) / 10,
      sol: 'The trace of $\\vec l\\cdot\\vec s$ over all $2(2l + 1)$ states is zero: $(2l + 2)\\tfrac l2 + 2l\\cdot\\left(-\\tfrac{l + 1}2\\right) = 0$. So $\\sum(2j + 1)E_j/\\sum(2j + 1)$ is the unsplit energy: $(6\\times(-4.14) + 4\\times0.94)/10 = (-24.84 + 3.76)/10 = -2.11$ MeV. The shifts are $-2.03$ and $+3.05$ MeV, in the ratio $l : -(l + 1) = 2 : -3$.',
      trap: 'Taking the simple average ($-1.60$ MeV) ignores the different degeneracies.' },
    { id: 'nsm-038', type: 'msq', level: 5, exams: ['gate', 'net'], sub: 'Schmidt moments',
      q: 'Which statements are correct?',
      options: ['The magnetic moment of a single hole in orbit $j$ equals that of a single particle in the same orbit', 'Mirror nuclei with an odd nucleon in the same orbit have Schmidt moments of the same sign', 'For $j = l - \\tfrac12$ the proton Schmidt moment is smaller than for $j = l + \\tfrac12$ at the same $j$', 'For an odd proton in an $s_{1/2}$ orbit the Schmidt moment is $2.793\\,\\mu_N$, the free proton value'], answer: [0, 2, 3],
      sol: 'A filled orbit has zero moment, so particle and hole moments are equal (rank-1 operator, no sign change under particle-hole conjugation for the diagonal element). For $s_{1/2}$, $l = 0$ and $\\mu = g_s/2 = 2.793\\,\\mu_N$. At fixed $j$ the $l - \\tfrac12$ line ($\\tfrac{j}{j+1}(j - 1.293)$) lies below the $l + \\tfrac12$ line ($j + 2.293$). Mirror nuclei have the odd nucleon a proton in one and a neutron in the other: for $j = l + \\tfrac12$ the signs differ (positive proton, $-1.913$ neutron).',
      trap: 'Mirror nuclei swap proton and neutron roles, and so the sign of $g_s$.' },
    { id: 'nsm-039', type: 'nat', level: 4, exams: ['gate', 'net'], sub: 'oscillator shells',
      q: 'Counting all states up to and including the $N = 5$ shell of the three-dimensional harmonic oscillator (with spin), the oscillator would predict a closed shell at ______ nucleons of one kind.',
      answer: 112, tol: 0, calc: () => 6 * 7 * 8 / 3,
      sol: 'Shell $N$ holds $(N + 1)(N + 2)$, and the cumulative total is $\\tfrac13(N + 1)(N + 2)(N + 3)$: $2, 8, 20, 40, 70, 112$. Nature has 82 and 126 instead, because spin-orbit splitting moves the highest-$j$ level of each shell into the one below.',
      trap: 'Stopping at the shell size (42) rather than the running total.' },
    { id: 'nsm-040', type: 'nat', level: 5, exams: ['gate', 'net'], sub: 'collective bands',
      q: 'In ${}^{238}$U the first $2^+$ level is at $44.9$ keV. Compare its moment of inertia with that of a rigid uniform sphere ($\\tfrac25MR^2$, $M = 238$ u, $R = 1.2A^{1/3}$ fm). The ratio $\\mathcal I/\\mathcal I_{rigid}$ is ______ (to two decimal places). Use $\\hbar^2/(1\\text{ u fm}^2) = 41.80$ MeV.',
      answer: 0.53, tol: 0.01, calc: () => { const I = 3 * HB2U / 0.0449; const Ir = 0.4 * 238 * (1.2 * Math.cbrt(238)) ** 2; return I / Ir; },
      sol: '$E(2^+) = 3\\hbar^2/\\mathcal I$, so $\\mathcal I = 3\\times41.80/0.0449 = 2793$ u fm$^2$. Rigid: $R = 1.2\\times6.197 = 7.44$ fm, $\\mathcal I_{rigid} = 0.4\\times238\\times55.3 = 5265$ u fm$^2$. Ratio $0.53$: the nucleus rotates with about half the rigid inertia (pairing), but far more than an irrotational fluid would give.',
      trap: 'Using $E(2^+) = \\hbar^2/\\mathcal I$, forgetting $I(I + 1)/2 = 3$.' },
    { id: 'nsm-041', type: 'msq', level: 2, exams: ['jam', 'gate', 'net'], sub: 'magic numbers',
      q: 'Which of these nuclides have a magic number of protons, of neutrons, or both?',
      options: ['${}^{40}$Ca', '${}^{88}$Sr ($Z = 38$)', '${}^{140}$Ce ($Z = 58$)', '${}^{64}$Zn ($Z = 30$)'], answer: [0, 1, 2],
      sol: '${}^{40}$Ca: $Z = N = 20$. ${}^{88}$Sr: $N = 50$. ${}^{140}$Ce: $N = 82$. ${}^{64}$Zn has $Z = 30$, $N = 34$: neither is magic.',
      trap: 'Checking only $Z$: the neutron number counts too.' },
    { id: 'nsm-042', type: 'msq', level: 4, exams: ['gate', 'net'], sub: 'isomers',
      q: 'An odd-$A$ nucleus has its ground state $\\tfrac92^+$ ($1g_{9/2}$) and its first excited state $\\tfrac12^-$ ($2p_{1/2}$) only $40$ keV above. Which statements are correct?',
      options: ['The gamma transition between them changes $J$ by 4 with a change of parity, so its lowest multipole is M4', 'The excited state is likely to be a long-lived isomer', 'The transition can go by E1 because the parity changes', 'Internal conversion can compete strongly with gamma emission for such a low-energy, high-multipole transition'], answer: [0, 1, 3],
      sol: '$|\\Delta J| = 4$ needs multipole $L \\ge 4$; with a parity change, $L = 4$ is magnetic (M4), whose Weisskopf rate at 40 keV is tiny, so the state lives long. E1 needs $|\\Delta J| \\le 1$. Low energy and high multipolarity give a large conversion coefficient, so conversion electrons dominate.',
      trap: 'Parity change alone does not make a transition E1; angular momentum must also allow it.' },
    ...more2,
  ],
  gens: [
    { id: 'nsm-g01', type: 'mcq', level: 2, exams: ['gate', 'net'], sub: 'ground-state spin',
      make(r) {
        const k = choose(r, ODD_OK), o = lastOrbit(k), who = choose(r, ['protons', 'neutrons']);
        const ans = jp(o), wr = ORBITS.filter((x) => jp(x) !== ans).map(jp);
        const near = ORBITS.indexOf(o), cand = [ORBITS[near + 1], ORBITS[near - 1], [o[0], o[1], o[2] === 2 * o[1] + 1 ? 2 * o[1] - 1 : 2 * o[1] + 1], [o[0], o[1] + 1, o[2]]].filter((x) => x && x[2] > 0).map(jp);
        const opts = mcqOptions(r, ans, [...cand, ...wr].filter((v) => v !== ans), (v) => `$${v}$`);
        return { q: `A nucleus has ${k} ${who} and an even number of ${who === 'protons' ? 'neutrons' : 'protons'}. The extreme single-particle shell model predicts its ground-state spin and parity to be`, ...opts,
          sol: `The even group pairs to $0^+$. Filling ${who} in the order $1s_{1/2}$, $1p_{3/2}$, $1p_{1/2}$, $1d_{5/2}$, $2s_{1/2}$, $1d_{3/2}$, $1f_{7/2}$, $2p_{3/2}$, $1f_{5/2}$, $2p_{1/2}$, $1g_{9/2}$ (capacities $2j + 1$), the ${k}th goes into $${oname(o)}$. So $J = ${o[2]}/2$ and parity $(-1)^{${o[1]}} = ${o[1] % 2 ? '-' : '+'}$: $${ans}$.`,
          trap: 'Taking parity from $j$, or forgetting the capacities $2j + 1$.', k };
      } },
    { id: 'nsm-g02', type: 'nat', level: 3, exams: ['gate', 'net'], sub: 'Schmidt moments',
      make(r) {
        const l = int(r, 0, 5), up = l === 0 ? true : r() < 0.5, j2 = up ? 2 * l + 1 : 2 * l - 1, proton = r() < 0.5;
        const n = choose(r, [1, 2, 3]), mu = schmidt(l, j2, proton);
        return { q: `Find the Schmidt magnetic moment of a single odd ${proton ? 'proton' : 'neutron'} in the $${n}${LL[l]}_{${j2}/2}$ orbit, using $g_l = ${proton ? 1 : 0}$ and $g_s = ${proton ? GSP : GSN}$. $\\mu$ = ______ $\\mu_N$ (to three decimal places).`,
          answer: round(mu, 3), tol: 0.003, unit: 'μN', l, j2, proton,
          sol: up ? `$j = l + \\tfrac12$ with $l = ${l}$: $\\mu = (j - \\tfrac12)g_l + \\tfrac12g_s = ${l}\\times${proton ? 1 : 0} + ${round((proton ? GSP : GSN) / 2, 3)} = ${round(mu, 3)}\\,\\mu_N$.` : `$j = l - \\tfrac12$ with $l = ${l}$: $\\mu = \\dfrac{j}{j + 1}\\left[(j + \\tfrac32)g_l - \\tfrac12g_s\\right] = \\dfrac{${j2 / 2}}{${j2 / 2 + 1}}\\left[${j2 / 2 + 1.5}\\times${proton ? 1 : 0} - (${round((proton ? GSP : GSN) / 2, 3)})\\right] = ${round(mu, 3)}\\,\\mu_N$.`,
          trap: 'Using the wrong branch: check whether $j = l + \\tfrac12$ or $l - \\tfrac12$ from the orbit label.' };
      },
      verify: (p) => { const j = p.j2 / 2, gl = p.proton ? 1 : 0, gs = p.proton ? GSP : GSN; const gL = (j * (j + 1) + p.l * (p.l + 1) - 0.75) / (2 * j * (j + 1)), gS = (j * (j + 1) - p.l * (p.l + 1) + 0.75) / (2 * j * (j + 1)); return j * (gl * gL + gs * gS); } },
    { id: 'nsm-g03', type: 'nat', level: 2, exams: ['gate', 'net'], sub: 'level scheme',
      make(r) {
        const i = int(r, 3, ORBITS.length - 1), mode = choose(r, ['cap', 'cum']);
        const cum = ORBITS.slice(0, i + 1).reduce((s, o) => s + o[2] + 1, 0), cap = ORBITS[i][2] + 1;
        return { q: mode === 'cap' ? `How many neutrons can the $${oname(ORBITS[i])}$ orbit hold?` : `Filling orbits in the standard shell-model order, how many protons are needed to fill every orbit up to and including $${oname(ORBITS[i])}$?`,
          answer: mode === 'cap' ? cap : cum, tol: 0, i, mode,
          sol: mode === 'cap' ? `Capacity $2j + 1 = ${ORBITS[i][2]} + 1 = ${cap}$.` : `Adding $2j + 1$ over the orbits ${ORBITS.slice(0, i + 1).map((o) => `$${oname(o)}$ (${o[2] + 1})`).join(', ')} gives ${cum}.${MAGIC.includes(cum) ? ' That is a magic number.' : ''}`,
          trap: 'Using $2(2l + 1)$, which counts both spin-orbit partners.' };
      },
      verify: (p) => (p.mode === 'cap' ? ORBITS[p.i][2] + 1 : ORBITS.slice(0, p.i + 1).reduce((s, o) => s + o[2] + 1, 0)) },
    { id: 'nsm-g04', type: 'nat', level: 3, exams: ['gate', 'net'], sub: 'spin-orbit',
      make(r) {
        const l1 = int(r, 1, 3), l2 = l1 + int(r, 1, 3), d1 = pick(r, 2.0, 7.0, 0.5), d2 = d1 * (2 * l2 + 1) / (2 * l1 + 1);
        return { q: `Assume the spin-orbit term $-V_{ls}\\,\\vec l\\cdot\\vec s/\\hbar^2$ has the same strength $V_{ls}$ for all orbits. If the splitting between $j = l \\pm \\tfrac12$ for $l = ${l1}$ is $${d1}$ MeV, the splitting for $l = ${l2}$ is ______ MeV (to two decimal places).`,
          answer: round(d2, 2), tol: 0.02, unit: 'MeV', l1, l2, d1,
          sol: `$\\langle\\vec l\\cdot\\vec s\\rangle$ is $\\tfrac l2\\hbar^2$ for $j = l + \\tfrac12$ and $-\\tfrac{l + 1}2\\hbar^2$ for $j = l - \\tfrac12$: a difference of $\\tfrac{2l + 1}2\\hbar^2$. So $\\Delta E \\propto 2l + 1$: $${d1}\\times${2 * l2 + 1}/${2 * l1 + 1} = ${round(d2, 2)}$ MeV.`,
          trap: 'Scaling with $l$ instead of $2l + 1$.' };
      },
      verify: (p) => p.d1 * (2 * p.l2 + 1) / (2 * p.l1 + 1) },
    { id: 'nsm-g05', type: 'nat', level: 2, exams: ['gate', 'net'], sub: 'oscillator shells',
      make(r) {
        const N = int(r, 0, 7), mode = choose(r, ['shell', 'cum', 'orbits']);
        const val = mode === 'shell' ? (N + 1) * (N + 2) : mode === 'cum' ? (N + 1) * (N + 2) * (N + 3) / 3 : Math.floor(N / 2) + 1;
        return { q: mode === 'shell' ? `How many protons fit in the $N = ${N}$ shell of a three-dimensional harmonic oscillator (spin included)?` : mode === 'cum' ? `Counting all oscillator shells from $N = 0$ to $N = ${N}$ (spin included), the harmonic oscillator closes a shell at how many nucleons of one kind?` : `How many different orbital angular momenta $l$ occur in the $N = ${N}$ harmonic-oscillator shell?`,
          answer: val, tol: 0, N, mode,
          sol: `Shell $N$ contains $l = N, N - 2, \\dots, ${N % 2}$ (${Math.floor(N / 2) + 1} values), each with $2(2l + 1)$ states, all of parity $(-1)^{${N}}$: $(N + 1)(N + 2) = ${(N + 1) * (N + 2)}$ in all. The running total is $\\tfrac13(N + 1)(N + 2)(N + 3) = ${(N + 1) * (N + 2) * (N + 3) / 3}$. The answer is ${val}.`,
          trap: 'Forgetting the spin factor 2, or that $l$ steps by 2.' };
      },
      verify: (p) => { let shell = 0, cum = 0, nl = 0; for (let n = 0; n <= p.N; n++) { let s = 0, c = 0; for (let l = n % 2; l <= n; l += 2) { s += 2 * (2 * l + 1); c++; } cum += s; if (n === p.N) { shell = s; nl = c; } } return p.mode === 'shell' ? shell : p.mode === 'cum' ? cum : nl; } },
    { id: 'nsm-g06', type: 'nat', level: 3, exams: ['gate', 'net'], sub: 'collective bands',
      make(r) {
        const E2 = pick(r, 40, 120, 0.5), I = choose(r, [4, 6, 8, 10]), EI = E2 * I * (I + 1) / 6;
        return { q: `A rotational ground band has its $2^+$ level at $${E2}$ keV. For an ideal rotor, the $${I}^+$ level lies at ______ keV (to the nearest keV).`,
          answer: Math.round(EI), tol: 1, unit: 'keV', E2, I,
          sol: `$E_I = \\dfrac{\\hbar^2}{2\\mathcal I}I(I + 1)$ with $\\hbar^2/2\\mathcal I = ${E2}/6 = ${round(E2 / 6, 3)}$ keV. $E(${I}^+) = ${round(E2 / 6, 3)}\\times${I * (I + 1)} = ${Math.round(EI)}$ keV.`,
          trap: 'Scaling with $I^2$ or $I$.' };
      },
      verify: (p) => p.E2 * p.I * (p.I + 1) / 6 },
    { id: 'nsm-g07', type: 'mcq', level: 3, exams: ['gate', 'net'], sub: 'collective bands',
      make(r) {
        const kind = choose(r, ['rot', 'vib', 'magic']), R = kind === 'rot' ? pick(r, 3.20, 3.33, 0.01) : kind === 'vib' ? pick(r, 1.95, 2.30, 0.01) : pick(r, 1.3, 1.6, 0.05);
        const E2 = kind === 'rot' ? pick(r, 40, 110, 1) : kind === 'vib' ? pick(r, 400, 800, 10) : pick(r, 2600, 4400, 100);
        const opts = ['a deformed rotor, far from closed shells', 'a spherical vibrator, a few nucleons from closed shells', 'a doubly magic or closed-shell nucleus', 'an odd-$A$ nucleus'];
        const ans = kind === 'rot' ? 0 : kind === 'vib' ? 1 : 2;
        return { q: `An even-even nucleus has $E(2^+_1) = ${E2}$ keV and $E(4^+_1)/E(2^+_1) = ${R}$. It is best described as`, options: opts, answer: ans,
          sol: `Rotor: $E \\propto I(I + 1)$ gives $10/3 = 3.33$ and low $2^+$ energies (tens of keV). Vibrator: one- and two-phonon states give a ratio near 2 with $2^+$ at several hundred keV. Closed shells: the $2^+$ needs a particle-hole excitation across the gap, so it is high (MeV) and the ratio is irregular, often below 2. Here: ${opts[ans]}.`,
          trap: 'An odd-$A$ nucleus has no $0^+$ ground band; the data describe an even-even nucleus.', kind };
      } },
    { id: 'nsm-g08', type: 'mcq', level: 1, exams: ['gate', 'net'], sub: 'parity',
      make(r) {
        const o = choose(r, ORBITS), ans = jp(o);
        const wr = [`${o[2]}/2^${o[1] % 2 ? '+' : '-'}`, `${2 * o[1] + 1}/2^${o[1] % 2 ? '-' : '+'}`, `${o[1]}^${o[1] % 2 ? '-' : '+'}`, `${o[0]}/2^${o[1] % 2 ? '-' : '+'}`, `${o[2] + 2}/2^${o[1] % 2 ? '-' : '+'}`];
        const opts = mcqOptions(r, ans, wr.filter((v) => v !== ans), (v) => `$${v}$`);
        return { q: `A single nucleon in the $${oname(o)}$ orbit has $j^\\pi$ equal to`, ...opts,
          sol: `The letter gives $l = ${o[1]}$, the subscript gives $j = ${o[2]}/2$, and the parity is $(-1)^l = ${o[1] % 2 ? '-' : '+'}$. The leading ${o[0]} only counts radial nodes. So $${ans}$.`,
          trap: 'Taking the leading number as $j$ or $l$, or the parity from $j$.', o };
      } },
    { id: 'nsm-g09', type: 'msq', level: 2, exams: ['jam', 'gate', 'net'], sub: 'magic numbers',
      make(r) {
        const DM = [['{}^{4}\\text{He}', 2, 2], ['{}^{16}\\text{O}', 8, 8], ['{}^{40}\\text{Ca}', 20, 20], ['{}^{48}\\text{Ca}', 20, 28], ['{}^{56}\\text{Ni}', 28, 28], ['{}^{132}\\text{Sn}', 50, 82], ['{}^{208}\\text{Pb}', 82, 126], ['{}^{100}\\text{Sn}', 50, 50]];
        const SM = [['{}^{90}\\text{Zr}', 40, 50], ['{}^{88}\\text{Sr}', 38, 50], ['{}^{120}\\text{Sn}', 50, 70], ['{}^{138}\\text{Ba}', 56, 82], ['{}^{209}\\text{Bi}', 83, 126], ['{}^{58}\\text{Ni}', 28, 30], ['{}^{12}\\text{C}', 6, 6], ['{}^{32}\\text{S}', 16, 16], ['{}^{60}\\text{Ni}', 28, 32], ['{}^{142}\\text{Nd}', 60, 82]];
        const a = choose(r, DM), b = choose(r, DM.filter((x) => x !== a)), c = choose(r, SM), d = choose(r, SM.filter((x) => x !== c));
        const pickB = r() < 0.5, list = [a, pickB ? b : d, c, pickB ? d : choose(r, SM.filter((x) => x !== c && x !== d))];
        const items = shuffle(r, list);
        const answer = items.map((x, i) => (MAGIC.includes(x[1]) && MAGIC.includes(x[2]) ? i : -1)).filter((i) => i >= 0);
        return { q: 'Which of these nuclei are doubly magic?', options: items.map((x) => `$${x[0]}$ ($Z = ${x[1]}$, $N = ${x[2]}$)`), answer,
          sol: `Doubly magic means both $Z$ and $N$ are in $\\{2, 8, 20, 28, 50, 82, 126\\}$. ${items.map((x) => `$${x[0]}$: ${MAGIC.includes(x[1]) && MAGIC.includes(x[2]) ? 'yes' : 'no'}`).join('; ')}. (40 and 64 are sub-shell closures, not magic numbers.)`,
          trap: 'Counting a single magic number (such as $N = 50$ or $82$) as doubly magic.' };
      } },
    { id: 'nsm-g10', type: 'nat', level: 2, exams: ['gate', 'net'], sub: 'spin-orbit',
      make(r) {
        const l = int(r, 1, 6), up = r() < 0.5, j = up ? l + 0.5 : l - 0.5, v = (j * (j + 1) - l * (l + 1) - 0.75) / 2;
        return { q: `For a nucleon with $l = ${l}$ and $j = ${2 * j}/2$, $\\langle\\vec l\\cdot\\vec s\\rangle/\\hbar^2$ = ______ (to one decimal place).`,
          answer: round(v, 1), tol: 0, l, j,
          sol: `$\\langle\\vec l\\cdot\\vec s\\rangle/\\hbar^2 = \\tfrac12[j(j + 1) - l(l + 1) - \\tfrac34] = \\tfrac12[${j * (j + 1)} - ${l * (l + 1)} - 0.75] = ${round(v, 1)}$${up ? ', which is $l/2$.' : ', which is $-(l + 1)/2$.'}`,
          trap: 'Dropping $s(s + 1) = \\tfrac34$.' };
      },
      verify: (p) => (p.j > p.l ? p.l / 2 : -(p.l + 1) / 2) },
    { id: 'nsm-g11', type: 'mcq', level: 3, exams: ['gate', 'net'], sub: 'odd-odd nuclei',
      make(r) {
        const op = choose(r, ORBITS.slice(1, 12)), on = choose(r, ORBITS.slice(1, 12).filter((x) => x !== op));
        const a = op[2] / 2, b = on[2] / 2, lo = Math.abs(a - b), hi = a + b, par = (op[1] + on[1]) % 2 ? '-' : '+', wpar = par === '-' ? '+' : '-';
        const show = (v) => v;
        const ans = `$J = ${lo}$ to $${hi}$, parity $${par}$`;
        const wr = [`$J = ${lo}$ to $${hi}$, parity $${wpar}$`, `$J = ${lo + 1}$ to $${hi + 1}$, parity $${par}$`, `$J = ${hi}$ only, parity $${par}$`, `$J = 0$ to $${hi}$, parity $${par}$`];
        const o = mcqOptions(r, ans, wr.filter((w) => w !== ans), show);
        return { q: `In an odd-odd nucleus the odd proton is in $${oname(op)}$ and the odd neutron in $${oname(on)}$. The configuration allows`, ...o,
          sol: `$J$ runs from $|j_p - j_n| = ${lo}$ to $j_p + j_n = ${hi}$ in integer steps; parity $(-1)^{l_p + l_n} = (-1)^{${op[1] + on[1]}} = ${par}$.`,
          trap: 'The parity is the product of both nucleons’ parities.', a, b };
      } },
    ...more,
  ],
};
