// Vibrational spectra: the harmonic oscillator and force constants, anharmonicity and the Morse potential, overtones
// and hot bands, dissociation energies, vibration-rotation bands (P and R branches, combination differences),
// isotope shifts and normal modes of polyatomic molecules.
// Original questions for GATE and CSIR NET practice (fibub). Levels: 1 warm-up ... 5 top rank.
import { pick, int, choose, mcqOptions, round, shuffle } from '../_util.js';

const U = 1.66053907e-27;     // kg
const CCM = 2.99792458e10;    // cm/s
const C2 = 1.438777;          // hc/k, cm K
const EV = 1.239842e-4;       // eV per cm^-1
const kOf = (w, muU) => muU * U * (2 * Math.PI * CCM * w) ** 2;          // N/m
const wOf = (k, muU) => Math.sqrt(k / (muU * U)) / (2 * Math.PI * CCM);  // cm^-1
const MOLS = [ // name, mu (u), we, wexe (cm^-1)
  ['$^1$H$^{35}$Cl', 0.97959, 2990.9, 52.82], ['$^{12}$C$^{16}$O', 6.8562, 2169.8, 13.29], ['$^1$H$^{19}$F', 0.95705, 4138.3, 89.88],
  ['$^1$H$^{79}$Br', 0.99542, 2648.98, 45.22], ['$^{14}$N$^{16}$O', 7.4664, 1904.2, 14.08], ['$^{1}$H$_2$', 0.50391, 4401.2, 121.34],
  ['$^{127}$I$_2$', 63.452, 214.50, 0.614], ['$^{35}$Cl$_2$', 17.4844, 559.7, 2.68], ['$^{14}$N$_2$', 7.00154, 2358.6, 14.32], ['$^{16}$O$_2$', 7.99746, 1580.2, 11.98]];
const G = (we, x, v) => we * (v + 0.5) - x * (v + 0.5) ** 2;

export default {
  topic: 'vibrational-spectra',
  items: [
    // ---------- level 1 ----------
    { id: 'vibs-001', type: 'mcq', level: 1, exams: ['gate', 'net'], sub: 'harmonic oscillator',
      q: 'For a diatomic molecule treated as a harmonic oscillator with wavenumber $\\tilde\\omega$, the vibrational levels are',
      options: ['$G(v) = \\tilde\\omega(v + \\tfrac12)$, equally spaced, with zero-point energy $\\tilde\\omega/2$', '$G(v) = \\tilde\\omega v$, with no zero-point energy', '$G(v) = \\tilde\\omega v(v+1)$', '$G(v) = \\tilde\\omega(v + \\tfrac12)^2$'], answer: 0,
      sol: 'The quantum harmonic oscillator has $E_v = \\hbar\\omega(v + \\tfrac12)$: equal spacing $\\tilde\\omega$ and a zero-point energy $\\tilde\\omega/2$ that the molecule keeps even at 0 K.',
      trap: '$v(v+1)$ is the rotational pattern, not the vibrational one.' },
    { id: 'vibs-002', type: 'mcq', level: 1, exams: ['gate', 'net'], sub: 'selection rules',
      q: 'For a harmonic oscillator with a dipole moment linear in the displacement, the infrared selection rule is',
      options: ['$\\Delta v = 0, \\pm1$', '$\\Delta v = \\pm1$', '$\\Delta v = \\pm1, \\pm2, \\pm3, \\dots$', '$\\Delta v = \\pm2$'], answer: 1,
      sol: 'The transition dipole is $(d\\mu/dx)\\langle v\'|x|v\\rangle$, and $x \\propto a + a^\\dagger$ connects only neighbouring levels. So $\\Delta v = \\pm1$, and the mode must change the dipole moment ($d\\mu/dx \\ne 0$).',
      trap: 'Overtones ($\\Delta v = \\pm2, \\dots$) appear only through anharmonicity.' },
    { id: 'vibs-003', type: 'nat', level: 1, exams: ['gate', 'net'], sub: 'normal modes',
      q: 'The number of vibrational normal modes of a water molecule (H$_2$O, bent) is ______.',
      answer: 3, tol: 0,
      sol: 'A non-linear molecule of $N$ atoms has $3N - 6$ modes: $3\\times3 - 6 = 3$ (symmetric stretch, bend, antisymmetric stretch).',
      trap: 'Use $3N - 5$ only for linear molecules.' },
    { id: 'vibs-004', type: 'msq', level: 1, exams: ['gate', 'net'], sub: 'ir activity',
      q: 'Which of these diatomic molecules show an infrared vibrational absorption band?',
      options: ['HCl', 'N$_2$', 'CO', 'O$_2$'], answer: [0, 2],
      sol: 'IR absorption needs the dipole moment to change during the vibration. Stretching HCl or CO changes their dipole. Homonuclear N$_2$ and O$_2$ have zero dipole at every bond length.',
      trap: 'N$_2$ and O$_2$ vibrations are seen in Raman spectra instead.' },
    { id: 'vibs-005', type: 'mcq', level: 1, exams: ['gate', 'net'], sub: 'harmonic oscillator',
      q: 'Two diatomic molecules have the same force constant. The one with the larger reduced mass has',
      options: ['the higher vibrational frequency', 'the same frequency', 'the lower vibrational frequency', 'no vibrational spectrum'], answer: 2,
      sol: '$\\omega = \\sqrt{k/\\mu}$: a heavier reduced mass vibrates more slowly.',
      trap: 'Frequency goes as $\\mu^{-1/2}$, not $\\mu^{-1}$.' },
    { id: 'vibs-006', type: 'nat', level: 1, exams: ['gate', 'net'], sub: 'normal modes',
      q: 'The number of vibrational normal modes of CO$_2$ (linear) is ______.',
      answer: 4, tol: 0,
      sol: 'Linear: $3N - 5 = 9 - 5 = 4$. They are the symmetric stretch, the antisymmetric stretch and the bend, which counts twice (two perpendicular planes, same frequency).',
      trap: 'Only three distinct frequencies, but four modes: the bend is doubly degenerate.' },

    // ---------- level 2 ----------
    { id: 'vibs-007', type: 'nat', level: 2, exams: ['gate', 'net'], sub: 'force constant',
      q: 'The HCl fundamental is at 2886 cm$^{-1}$ and $\\mu = 0.9796$ u. Treating it as harmonic, the force constant is ______ N/m (to the nearest integer). Use $1\\text{ u} = 1.6605\\times10^{-27}$ kg, $c = 2.998\\times10^{10}$ cm/s.',
      answer: 481, tol: 2, unit: 'N/m', calc: () => 0.9796 * 1.6605e-27 * (2 * Math.PI * 2.998e10 * 2886) ** 2,
      sol: '$\\omega = 2\\pi c\\tilde\\omega = 2\\pi\\times2.998\\times10^{10}\\times2886 = 5.436\\times10^{14}$ rad/s. $\\mu = 1.6266\\times10^{-27}$ kg. $k = \\mu\\omega^2 = 1.6266\\times10^{-27}\\times2.955\\times10^{29} = 481$ N/m.',
      trap: '$c$ in cm/s with $\\tilde\\omega$ in cm$^{-1}$; and $\\omega$ needs the $2\\pi$.' },
    { id: 'vibs-008', type: 'nat', level: 2, exams: ['gate', 'net'], sub: 'anharmonicity',
      q: 'With $G(v) = \\tilde\\omega_e(v + \\tfrac12) - \\tilde\\omega_ex_e(v + \\tfrac12)^2$, $\\tilde\\omega_e = 2990.9$ cm$^{-1}$ and $\\tilde\\omega_ex_e = 52.82$ cm$^{-1}$ (HCl), the fundamental $0\\to1$ is at ______ cm$^{-1}$ (to one decimal place).',
      answer: 2885.3, tol: 0.2, unit: 'cm⁻¹', calc: () => 2990.9 - 2 * 52.82,
      sol: '$G(1) - G(0) = \\tilde\\omega_e - 2\\tilde\\omega_ex_e = 2990.9 - 105.64 = 2885.3$ cm$^{-1}$.',
      trap: 'The fundamental is not $\\tilde\\omega_e$; it is lower by $2\\tilde\\omega_ex_e$.' },
    { id: 'vibs-009', type: 'mcq', level: 2, exams: ['gate', 'net'], sub: 'anharmonicity',
      q: 'In an anharmonic diatomic molecule, the first overtone ($0\\to2$) appears',
      options: ['at exactly twice the fundamental', 'at more than twice the fundamental', 'at the same place as the fundamental', 'at slightly less than twice the fundamental, and much weaker'], answer: 3,
      sol: '$G(2) - G(0) = 2\\tilde\\omega_e - 6\\tilde\\omega_ex_e = 2(\\tilde\\omega_e - 2\\tilde\\omega_ex_e) - 2\\tilde\\omega_ex_e$: twice the fundamental minus $2\\tilde\\omega_ex_e$. It is weak because it is allowed only through anharmonicity. HCl: 5668 cm$^{-1}$ against $2\\times2886 = 5772$.',
      trap: 'Levels get closer together going up, so overtones fall short of multiples of the fundamental.' },
    { id: 'vibs-010', type: 'nat', level: 2, exams: ['gate', 'net'], sub: 'isotope effect',
      q: 'The H$^{35}$Cl fundamental is at 2886 cm$^{-1}$. With reduced masses 0.97959 u (HCl) and 1.90441 u (DCl), the harmonic estimate for the D$^{35}$Cl fundamental is ______ cm$^{-1}$ (to the nearest integer).',
      answer: 2070, tol: 2, unit: 'cm⁻¹', calc: () => 2886 * Math.sqrt(0.97959 / 1.90441),
      sol: 'Same force constant, $\\tilde\\omega \\propto \\mu^{-1/2}$: $2886\\times\\sqrt{0.97959/1.90441} = 2886\\times0.7172 = 2070$ cm$^{-1}$. (The measured 2091 cm$^{-1}$ is higher because anharmonicity also scales with mass; see the level-5 question.)',
      trap: 'Not a factor of 1/2: vibration goes as $\\mu^{-1/2}$.' },
    { id: 'vibs-011', type: 'mcq', level: 2, exams: ['gate', 'net'], sub: 'vibration-rotation',
      q: 'At high resolution, the fundamental band of gaseous HCl shows',
      options: ['P and R branches with a gap at the band origin and no central Q branch', 'a single sharp line at the band origin', 'P, Q and R branches, with the Q branch strongest', 'equally strong lines with no gap'], answer: 0,
      sol: 'For a $^1\\Sigma$ diatomic, a vibrational transition must change $J$ by $\\pm1$: R branch ($\\Delta J = +1$) on the high side, P branch ($\\Delta J = -1$) on the low side. $\\Delta J = 0$ (Q) is forbidden, leaving a gap of about $4B$ where the band origin is.',
      trap: 'Q branches do appear for molecules with electronic angular momentum (e.g. NO) and in perpendicular bands of polyatomics.' },
    { id: 'vibs-012', type: 'msq', level: 2, exams: ['gate', 'net'], sub: 'normal modes',
      q: 'Which statements about the normal modes of CO$_2$ are correct?',
      options: ['The symmetric stretch is IR inactive', 'The bending mode (667 cm$^{-1}$) is IR active and doubly degenerate', 'The antisymmetric stretch (2349 cm$^{-1}$) is IR active', 'The symmetric stretch is Raman inactive'], answer: [0, 1, 2],
      sol: 'In the symmetric stretch the two C=O dipoles stay equal and opposite: no dipole change (IR inactive) but the polarisability changes (Raman active, near 1388 cm$^{-1}$). Bending and antisymmetric stretching create an oscillating dipole: IR active.',
      trap: 'CO$_2$ has a centre of symmetry, so no mode is both IR and Raman active (mutual exclusion).' },
    { id: 'vibs-013', type: 'nat', level: 2, exams: ['gate', 'net'], sub: 'zero-point energy',
      q: 'For HCl ($\\tilde\\omega_e = 2990.9$ cm$^{-1}$, $\\tilde\\omega_ex_e = 52.82$ cm$^{-1}$), the zero-point energy $G(0)$ is ______ cm$^{-1}$ (to one decimal place).',
      answer: 1482.2, tol: 0.2, unit: 'cm⁻¹', calc: () => 2990.9 / 2 - 52.82 / 4,
      sol: '$G(0) = \\tilde\\omega_e/2 - \\tilde\\omega_ex_e/4 = 1495.45 - 13.21 = 1482.2$ cm$^{-1}$ (0.184 eV).',
      trap: 'The anharmonic term at $v = 0$ is $(\\tfrac12)^2 = \\tfrac14$ times $\\tilde\\omega_ex_e$.' },
    { id: 'vibs-014', type: 'mcq', level: 2, exams: ['gate', 'net'], sub: 'vibration-rotation',
      q: 'In a vibration-rotation band, the P-branch lines',
      options: ['have $\\Delta J = +1$ and lie above the band origin', 'have $\\Delta J = -1$ and lie below the band origin', 'have $\\Delta J = 0$ and lie at the band origin', 'have $\\Delta J = \\pm2$'], answer: 1,
      sol: 'P: $J\\to J - 1$ in absorption, so the molecule gives up rotational energy, $\\tilde\\nu = \\tilde\\nu_0 - 2BJ$ (rigid). R: $J\\to J + 1$, $\\tilde\\nu = \\tilde\\nu_0 + 2B(J+1)$.',
      trap: 'Memory aid: P for "poorer" (lower wavenumber), R for "richer".' },
    { id: 'vibs-015', type: 'nat', level: 2, exams: ['gate', 'net'], sub: 'populations',
      q: 'For HCl (fundamental 2886 cm$^{-1}$) at 300 K, the population ratio $N_{v=1}/N_{v=0}$ is ______ $\\times10^{-7}$ (to two decimal places). Use $hc/k = 1.4388$ cm K.',
      answer: 9.74, tol: 0.05, calc: () => Math.exp(-1.4388 * 2886 / 300) * 1e7,
      sol: '$hc\\tilde\\nu/kT = 1.4388\\times2886/300 = 13.84$. $N_1/N_0 = e^{-13.84} = 9.74\\times10^{-7}$ (non-degenerate levels). Practically every molecule is in $v = 0$, so vibrational spectra start from $v = 0$.',
      trap: 'Unlike rotation, vibrational levels have no $2J + 1$ type degeneracy.' },
    { id: 'vibs-016', type: 'mcq', level: 2, exams: ['gate', 'net'], sub: 'dissociation energy',
      q: 'For a diatomic molecule, the spectroscopic dissociation energy $D_0$ (from $v = 0$) and the well depth $D_e$ are related by',
      options: ['$D_0 = D_e$', '$D_0 = D_e + G(0)$', '$D_0 = D_e - G(0)$', '$D_0 = D_e/2$'], answer: 2,
      sol: 'The molecule starts in $v = 0$, which already lies $G(0)$ above the bottom of the well. So the energy needed to dissociate it is $D_0 = D_e - G(0)$.',
      trap: 'Zero-point energy makes the molecule easier to break, not harder.' },

    // ---------- level 3 ----------
    { id: 'vibs-017', type: 'nat', level: 3, exams: ['gate', 'net'], sub: 'anharmonicity',
      q: 'For HCl ($\\tilde\\omega_e = 2990.9$ cm$^{-1}$, $\\tilde\\omega_ex_e = 52.82$ cm$^{-1}$), the first overtone $0\\to2$ is at ______ cm$^{-1}$ (to one decimal place).',
      answer: 5664.9, tol: 0.2, unit: 'cm⁻¹', calc: () => 2 * 2990.9 - 6 * 52.82,
      sol: '$G(2) - G(0) = 2\\tilde\\omega_e - 6\\tilde\\omega_ex_e = 5981.8 - 316.92 = 5664.9$ cm$^{-1}$.',
      trap: '$(2.5)^2 - (0.5)^2 = 6$, so the anharmonic correction is $6\\tilde\\omega_ex_e$.' },
    { id: 'vibs-018', type: 'nat', level: 3, exams: ['gate', 'net'], sub: 'morse potential',
      q: 'For a Morse oscillator $D_e = \\tilde\\omega_e^2/4\\tilde\\omega_ex_e$. With the HCl constants $\\tilde\\omega_e = 2990.9$ cm$^{-1}$ and $\\tilde\\omega_ex_e = 52.82$ cm$^{-1}$, this gives $D_e = $ ______ eV (to two decimal places). Use 1 cm$^{-1}$ = $1.2398\\times10^{-4}$ eV.',
      answer: 5.25, tol: 0.02, unit: 'eV', calc: () => 2990.9 ** 2 / (4 * 52.82) * 1.2398e-4,
      sol: '$D_e = 2990.9^2/(4\\times52.82) = 8.9455\\times10^6/211.28 = 42{,}340$ cm$^{-1}$ $= 5.25$ eV. The true value is 4.62 eV: the Morse form overestimates for HCl because real levels converge faster near dissociation.',
      trap: 'Morse estimates of $D_e$ are only approximate.' },
    { id: 'vibs-019', type: 'nat', level: 3, exams: ['gate', 'net'], sub: 'vibration-rotation',
      q: 'For HCl, $B_0 = 10.44$ cm$^{-1}$ and $B_1 = 10.14$ cm$^{-1}$. The gap between the lines R(0) and P(1) in the fundamental band is ______ cm$^{-1}$ (to two decimal places).',
      answer: 41.16, tol: 0.02, unit: 'cm⁻¹', calc: () => 2 * (10.44 + 10.14),
      sol: 'R(0) $= \\tilde\\nu_0 + 2B_1$ (upper level $J = 1$ in $v = 1$). P(1) $= \\tilde\\nu_0 - 2B_0$ (lower level $J = 1$ in $v = 0$). Gap $= 2(B_0 + B_1) = 41.16$ cm$^{-1}$, close to $4B$.',
      trap: 'The gap is $4B$, twice the spacing $2B$ between ordinary neighbouring lines.' },
    { id: 'vibs-020', type: 'msq', level: 3, exams: ['gate', 'net'], sub: 'normal modes',
      q: 'Which statements about the vibrations of H$_2$O are correct?',
      options: ['It has three normal modes', 'All three are IR active', 'The bend has the lowest frequency (about 1595 cm$^{-1}$)', 'Its symmetric stretch is IR inactive, as in CO$_2$'], answer: [0, 1, 2],
      sol: 'Bent water has $3N - 6 = 3$ modes. With no centre of symmetry, each mode changes the dipole (IR active) and the polarisability (Raman active). Bending is softer than stretching: about 1595 versus 3657 and 3756 cm$^{-1}$.',
      trap: 'The CO$_2$ rule fails because water is bent: its symmetric stretch changes the dipole along the symmetry axis.' },
    { id: 'vibs-021', type: 'mcq', level: 3, exams: ['gate', 'net'], sub: 'hot bands',
      q: 'A weak band appears slightly below the fundamental of a diatomic molecule and grows stronger as the gas is heated. It is',
      options: ['the first overtone', 'a combination band', 'the Q branch', 'a hot band, $v = 1\\to2$'], answer: 3,
      sol: '$G(2) - G(1) = \\tilde\\omega_e - 4\\tilde\\omega_ex_e$, lower than the fundamental $\\tilde\\omega_e - 2\\tilde\\omega_ex_e$ by $2\\tilde\\omega_ex_e$. It starts from $v = 1$, whose population $\\propto e^{-hc\\tilde\\nu/kT}$ grows with temperature.',
      trap: 'Overtones are near twice the fundamental, not just below it.' },
    { id: 'vibs-022', type: 'nat', level: 3, exams: ['gate', 'net'], sub: 'morse potential',
      q: 'In a Morse oscillator the level spacing $\\Delta G = \\tilde\\omega_e - 2\\tilde\\omega_ex_e(v+1)$ falls to zero near $v = 1/2x_e - 1$. Defining $v_{max}$ as the largest integer not exceeding $1/2x_e - 1/2$ (where $G(v)$ peaks), for $x_e = 0.01766$ (HCl), $v_{max} = $ ______.',
      answer: 27, tol: 0,
      sol: '$1/2x_e = 1/0.03532 = 28.31$. $28.31 - 0.5 = 27.81$, so $v_{max} = 27$: about 28 bound levels ($v = 0$ to 27) in this model.',
      trap: 'The Morse model gives a finite number of bound levels, unlike the harmonic oscillator.' },
    { id: 'vibs-023', type: 'nat', level: 3, exams: ['gate', 'net'], sub: 'combination differences',
      q: 'In the HCl fundamental, R(0) is at 2906.25 cm$^{-1}$ and P(2) at 2843.62 cm$^{-1}$. The two lines start from different lower levels but reach the same upper level ($v = 1$, $J = 1$). Using $\\text{R}(J-1) - \\text{P}(J+1) = 4B_0(J + \\tfrac12)$ with $J = 1$, $B_0 = $ ______ cm$^{-1}$ (to two decimal places).',
      answer: 10.44, tol: 0.01, unit: 'cm⁻¹', calc: () => (2906.25 - 2843.62) / 6,
      sol: 'R(0) starts from $J = 0$ and P(2) from $J = 2$, both ending on $J = 1$ of $v = 1$. Their difference is $F_0(2) - F_0(0) = 6B_0$ (rigid). $B_0 = 62.63/6 = 10.44$ cm$^{-1}$.',
      trap: 'Pick lines sharing the upper level to get the lower-state constant, and vice versa.' },
    { id: 'vibs-024', type: 'mcq', level: 3, exams: ['gate', 'net'], sub: 'vibration-rotation',
      q: 'Why does the infrared spectrum of NO (ground state $^2\\Pi$) show a Q branch while that of HCl ($^1\\Sigma^+$) does not?',
      options: ['NO has non-zero electronic orbital angular momentum about the axis, so $\\Delta J = 0$ is allowed', 'NO is heavier', 'NO is a radical and so has no selection rules', 'HCl is too light to show Q branches'], answer: 0,
      sol: 'For $\\Lambda = 0$ ($\\Sigma$ states) the parity argument forbids $\\Delta J = 0$ in a vibrational transition. With $\\Lambda \\ne 0$ ($\\Pi$) each $J$ has two parity components, and $\\Delta J = 0$ becomes allowed, giving a Q branch.',
      trap: 'The rule depends on the electronic angular momentum, not on mass.' },
    { id: 'vibs-025', type: 'nat', level: 3, exams: ['gate', 'net'], sub: 'force constant',
      q: 'The $^{12}$C$^{16}$O fundamental is at 2143 cm$^{-1}$ and $\\mu = 6.856$ u. Treating it as harmonic, the force constant is ______ N/m (to the nearest 5 N/m). Use $1\\text{ u} = 1.6605\\times10^{-27}$ kg, $c = 2.998\\times10^{10}$ cm/s.',
      answer: 1855, tol: 5, unit: 'N/m', calc: () => 6.856 * 1.6605e-27 * (2 * Math.PI * 2.998e10 * 2143) ** 2,
      sol: '$\\omega = 2\\pi\\times2.998\\times10^{10}\\times2143 = 4.037\\times10^{14}$ rad/s; $\\mu = 1.1385\\times10^{-26}$ kg; $k = \\mu\\omega^2 = 1855$ N/m. The triple bond is almost four times stiffer than the HCl bond.',
      trap: 'A high frequency can come from a light atom (HCl) or a stiff bond (CO); compare $k$, not $\\tilde\\omega$.' },
    { id: 'vibs-026', type: 'mcq', level: 3, exams: ['gate', 'net'], sub: 'dissociation energy',
      q: 'In a Birge-Sponer extrapolation, the dissociation energy $D_0$ is obtained from',
      options: ['the slope of $G(v)$ against $v$', 'the area under the plot of $\\Delta G_{v+1/2}$ against $v + \\tfrac12$, down to where $\\Delta G$ reaches zero', 'the intercept of $\\Delta G$ at $v = 0$', 'the ratio of overtone to fundamental intensities'], answer: 1,
      sol: '$D_0 = \\sum_v\\Delta G_{v+1/2}$: the sum of all level spacings from $v = 0$ to the dissociation limit, which is the area under the $\\Delta G$ plot. For a Morse oscillator the plot is a straight line and the area is a triangle.',
      trap: 'The intercept gives roughly $\\tilde\\omega_e$, not the dissociation energy.' },
    { id: 'vibs-027', type: 'nat', level: 3, exams: ['gate', 'net'], sub: 'hot bands',
      q: 'For HCl ($\\tilde\\omega_e = 2990.9$ cm$^{-1}$, $\\tilde\\omega_ex_e = 52.82$ cm$^{-1}$), the hot band $v = 1\\to2$ lies at ______ cm$^{-1}$ (to one decimal place).',
      answer: 2779.6, tol: 0.2, unit: 'cm⁻¹', calc: () => 2990.9 - 4 * 52.82,
      sol: '$G(2) - G(1) = \\tilde\\omega_e - 4\\tilde\\omega_ex_e = 2990.9 - 211.28 = 2779.6$ cm$^{-1}$, about 106 cm$^{-1}$ below the fundamental.',
      trap: 'In general $\\Delta G_{v+1/2} = \\tilde\\omega_e - 2\\tilde\\omega_ex_e(v+1)$.' },
    { id: 'vibs-028', type: 'mcq', level: 3, exams: ['gate', 'net'], sub: 'normal modes',
      q: 'The number of vibrational normal modes of acetylene, H-C≡C-H (linear), is',
      options: ['6', '12', '7', '5'], answer: 2,
      sol: 'Linear with $N = 4$: $3N - 5 = 7$ (three stretches and two doubly degenerate bends).',
      trap: '$3N - 6 = 6$ wrongly treats it as non-linear.' },

    // ---------- level 4 ----------
    { id: 'vibs-029', type: 'nat', level: 4, exams: ['gate', 'net'], sub: 'anharmonicity',
      q: 'The fundamental and first overtone of $^{12}$C$^{16}$O are at 2143.3 and 4260.0 cm$^{-1}$. Using $G(v) = \\tilde\\omega_e(v + \\tfrac12) - \\tilde\\omega_ex_e(v + \\tfrac12)^2$, $\\tilde\\omega_e = $ ______ cm$^{-1}$ (to one decimal place).',
      answer: 2169.9, tol: 0.2, unit: 'cm⁻¹', calc: () => 3 * 2143.3 - 4260.0,
      sol: '$\\nu_1 = \\tilde\\omega_e - 2\\tilde\\omega_ex_e$, $\\nu_2 = 2\\tilde\\omega_e - 6\\tilde\\omega_ex_e$. Then $3\\nu_1 - \\nu_2 = \\tilde\\omega_e = 6429.9 - 4260.0 = 2169.9$ cm$^{-1}$, and $\\tilde\\omega_ex_e = (\\tilde\\omega_e - \\nu_1)/2 = 13.3$ cm$^{-1}$.',
      trap: 'The harmonic guess $\\tilde\\omega_e = \\nu_1$ is off by about 27 cm$^{-1}$.' },
    { id: 'vibs-030', type: 'nat', level: 4, exams: ['gate', 'net'], sub: 'dissociation energy',
      q: 'The well depth of HCl is $D_e = 4.618$ eV and its zero-point energy is 1482 cm$^{-1}$. The dissociation energy $D_0$ is ______ eV (to two decimal places). Use 1 cm$^{-1}$ = $1.2398\\times10^{-4}$ eV.',
      answer: 4.43, tol: 0.01, unit: 'eV', calc: () => 4.618 - 1482 * 1.2398e-4,
      sol: '$G(0) = 1482\\times1.2398\\times10^{-4} = 0.1837$ eV. $D_0 = 4.618 - 0.184 = 4.434$ eV $\\approx 4.43$ eV.',
      trap: 'Subtract the zero-point energy; do not add it.' },
    { id: 'vibs-031', type: 'msq', level: 4, exams: ['gate', 'net'], sub: 'vibration-rotation',
      q: 'For a vibration-rotation band with $B_1 < B_0$, which statements are correct?',
      options: ['R-branch lines get closer together with increasing $J$ and may form a band head', 'P-branch lines spread further apart with increasing $J$', 'There is a gap near the band origin where no line appears', 'R-branch lines lie at lower wavenumbers than the band origin'], answer: [0, 1, 2],
      sol: 'R($J$) $= \\tilde\\nu_0 + (B_1 + B_0)(J+1) + (B_1 - B_0)(J+1)^2$: the negative quadratic term makes R lines converge. P($J$) $= \\tilde\\nu_0 - (B_1 + B_0)J + (B_1 - B_0)J^2$: the same term pushes P lines further down, so they spread. No line at $\\tilde\\nu_0$ (no Q branch). R lies above the origin.',
      trap: 'Band heads in IR bands are rare (small $B_1 - B_0$) but common in electronic bands.' },
    { id: 'vibs-032', type: 'nat', level: 4, exams: ['gate', 'net'], sub: 'vibration-rotation',
      q: 'For HCl, $\\tilde\\nu_0 = 2885.9$ cm$^{-1}$, $B_0 = 10.44$ cm$^{-1}$, $B_1 = 10.14$ cm$^{-1}$. Using R($J$) $= \\tilde\\nu_0 + (B_1 + B_0)(J+1) + (B_1 - B_0)(J+1)^2$, the line R(3) is at ______ cm$^{-1}$ (to one decimal place).',
      answer: 2963.4, tol: 0.1, unit: 'cm⁻¹', calc: () => 2885.9 + 20.58 * 4 - 0.3 * 16,
      sol: '$(B_1 + B_0)(J+1) = 20.58\\times4 = 82.32$; $(B_1 - B_0)(J+1)^2 = -0.30\\times16 = -4.80$. R(3) $= 2885.9 + 82.32 - 4.80 = 2963.4$ cm$^{-1}$.',
      trap: 'Use $J + 1 = 4$ for R(3).' },
    { id: 'vibs-033', type: 'mcq', level: 4, exams: ['gate', 'net'], sub: 'morse potential',
      q: 'For the Morse potential $V(r) = D_e[1 - e^{-a(r - r_e)}]^2$, the anharmonicity constant is',
      options: ['$\\tilde\\omega_ex_e = \\tilde\\omega_e/4D_e$', '$\\tilde\\omega_ex_e = 4D_e/\\tilde\\omega_e^2$', '$\\tilde\\omega_ex_e = \\tilde\\omega_e^2/D_e$', '$\\tilde\\omega_ex_e = \\tilde\\omega_e^2/4D_e$'], answer: 3,
      sol: 'The exact Morse levels are $G(v) = \\tilde\\omega_e(v + \\tfrac12) - \\tilde\\omega_ex_e(v + \\tfrac12)^2$ with $\\tilde\\omega_e = (a/2\\pi c)\\sqrt{2D_e/\\mu}$ and $\\tilde\\omega_ex_e = \\tilde\\omega_e^2/4D_e$ (all in cm$^{-1}$). A deep well (large $D_e$) is nearly harmonic.',
      trap: 'Check dimensions: $\\tilde\\omega_ex_e$ has the same units as $\\tilde\\omega_e$, so $\\tilde\\omega_e^2/D_e$-type forms are right.' },
    { id: 'vibs-034', type: 'nat', level: 4, exams: ['gate', 'net'], sub: 'populations',
      q: 'Iodine vapour has a vibrational spacing of 214.5 cm$^{-1}$. At 300 K the ratio $N_{v=1}/N_{v=0}$ is ______ (to three decimal places). Use $hc/k = 1.4388$ cm K.',
      answer: 0.357, tol: 0.003, calc: () => Math.exp(-1.4388 * 214.5 / 300),
      sol: '$hc\\tilde\\nu/kT = 1.4388\\times214.5/300 = 1.0287$; $e^{-1.0287} = 0.357$. Heavy, weakly bound molecules have many vibrational levels populated at room temperature, so their spectra show strong hot bands.',
      trap: 'Compare with HCl, where the same ratio is about $10^{-6}$.' },
    { id: 'vibs-035', type: 'mcq', level: 4, exams: ['gate', 'net'], sub: 'normal modes',
      q: 'Carbon dioxide absorbs strongly in the thermal infrared near 15 $\\mu$m, which is central to its greenhouse effect. Which mode is responsible?',
      options: ['The bending mode, near 667 cm$^{-1}$', 'The symmetric stretch, near 1388 cm$^{-1}$', 'The antisymmetric stretch, near 2349 cm$^{-1}$', 'A pure rotational transition'], answer: 0,
      sol: '$\\lambda = 1/\\tilde\\nu = 1/667$ cm $= 15.0\\,\\mu$m. The bend is IR active and lies near the peak of Earth\'s thermal emission. The 2349 cm$^{-1}$ band is at 4.3 $\\mu$m; the symmetric stretch is IR inactive; CO$_2$ has no rotational spectrum.',
      trap: 'Convert: $\\lambda(\\mu\\text{m}) = 10^4/\\tilde\\nu(\\text{cm}^{-1})$.' },
    { id: 'vibs-036', type: 'nat', level: 4, exams: ['gate', 'net'], sub: 'vibration-rotation interaction',
      q: 'For HCl, $B_0 = 10.440$ cm$^{-1}$ and $B_1 = 10.137$ cm$^{-1}$. With $B_v = B_e - \\alpha_e(v + \\tfrac12)$, the equilibrium constant $B_e$ is ______ cm$^{-1}$ (to two decimal places).',
      answer: 10.59, tol: 0.01, unit: 'cm⁻¹', calc: () => 10.44 + (10.44 - 10.137) / 2,
      sol: '$\\alpha_e = B_0 - B_1 = 0.303$ cm$^{-1}$. $B_e = B_0 + \\alpha_e/2 = 10.440 + 0.1515 = 10.59$ cm$^{-1}$, which gives the equilibrium bond length $r_e = 127.5$ pm.',
      trap: '$B_0$ is not $B_e$: even $v = 0$ carries half a quantum of vibration.' },

    // ---------- level 5 ----------
    { id: 'vibs-037', type: 'nat', level: 5, exams: ['gate', 'net'], sub: 'morse potential',
      q: 'For H$_2$, $\\tilde\\omega_e = 4401.2$ cm$^{-1}$ and $\\tilde\\omega_ex_e = 121.34$ cm$^{-1}$. In the Morse model, taking $v_{max}$ as the largest integer not exceeding $\\tilde\\omega_e/2\\tilde\\omega_ex_e - \\tfrac12$, $v_{max} = $ ______.',
      answer: 17, tol: 0,
      sol: '$\\tilde\\omega_e/2\\tilde\\omega_ex_e = 4401.2/242.68 = 18.14$; minus 0.5 is 17.64; so $v_{max} = 17$. (Real H$_2$ has only 15 bound levels, $v = 0$ to 14: higher-order terms make its levels converge faster than Morse.)',
      trap: 'The Morse count is an estimate; the true potential is shallower near dissociation.' },
    { id: 'vibs-038', type: 'msq', level: 5, exams: ['gate', 'net'], sub: 'morse potential',
      q: 'Which statements about the Morse oscillator are correct?',
      options: ['It has a finite number of bound states', 'Its level spacing decreases linearly with $v$', 'Its well depth equals $\\tilde\\omega_e^2/4\\tilde\\omega_ex_e$', 'Only $\\Delta v = \\pm1$ transitions are allowed, as for the harmonic oscillator'], answer: [0, 1, 2],
      sol: '$\\Delta G_{v+1/2} = \\tilde\\omega_e - 2\\tilde\\omega_ex_e(v+1)$ falls linearly and reaches zero at a finite $v$. The well depth is $\\tilde\\omega_e^2/4\\tilde\\omega_ex_e$. The eigenfunctions are not those of the harmonic oscillator, so $\\langle v\'|x|v\\rangle \\ne 0$ for $|\\Delta v| > 1$: overtones are weakly allowed.',
      trap: 'Anharmonic wavefunctions allow overtones even with a linear dipole function.' },
    { id: 'vibs-039', type: 'nat', level: 5, exams: ['gate', 'net'], sub: 'isotope effect',
      q: 'For H$^{35}$Cl, $\\tilde\\omega_e = 2990.9$ cm$^{-1}$ and $\\tilde\\omega_ex_e = 52.82$ cm$^{-1}$. With $\\rho = \\sqrt{\\mu_{HCl}/\\mu_{DCl}} = 0.71720$, and using $\\tilde\\omega_e \\propto \\rho$, $\\tilde\\omega_ex_e \\propto \\rho^2$, the D$^{35}$Cl fundamental is ______ cm$^{-1}$ (to one decimal place).',
      answer: 2090.8, tol: 0.3, unit: 'cm⁻¹', calc: () => 2990.9 * 0.7172 - 2 * 52.82 * 0.7172 ** 2,
      sol: '$\\tilde\\omega_e\' = 2990.9\\times0.71720 = 2145.07$; $\\tilde\\omega_ex_e\' = 52.82\\times0.51438 = 27.17$. Fundamental $= 2145.07 - 2\\times27.17 = 2090.7$ cm$^{-1}$, matching the measured 2091 cm$^{-1}$ far better than the harmonic 2070.',
      trap: 'Anharmonicity scales as $1/\\mu$ (like $B$), not as $1/\\sqrt\\mu$.' },
    { id: 'vibs-040', type: 'mcq', level: 5, exams: ['gate', 'net'], sub: 'anharmonicity',
      q: 'Overtone bands ($\\Delta v = 2, 3, \\dots$) in the IR spectrum of a diatomic molecule get their intensity from',
      options: ['the rotation of the molecule', 'both mechanical anharmonicity (non-parabolic potential) and electrical anharmonicity (dipole moment non-linear in $r$)', 'the nuclear spin', 'collisions only'], answer: 1,
      sol: 'With $\\mu(r) = \\mu_0 + \\mu_1x + \\mu_2x^2 + \\dots$, the $\\mu_2x^2$ term connects $v$ to $v \\pm 2$ even for harmonic wavefunctions (electrical anharmonicity). An anharmonic potential mixes the wavefunctions so $\\langle v\\pm2|x|v\\rangle \\ne 0$ (mechanical anharmonicity). Both contribute.',
      trap: 'A purely harmonic molecule with a linear dipole function would show only the fundamental.' },
  ],

  gens: [
    { id: 'vibs-g01', type: 'nat', level: 2, exams: ['gate', 'net'], sub: 'force constant',
      make(r) {
        const [name, m, we] = choose(r, MOLS);
        const mode = choose(r, ['k', 'w']);
        const k = kOf(we, m);
        const kr = round(k, 0);
        return { q: mode === 'k'
          ? `Treat ${name} ($\\mu = ${m}$ u) as a harmonic oscillator with $\\tilde\\omega = ${we}$ cm$^{-1}$. The force constant is ______ N/m (to three significant figures). Use $1\\text{ u} = 1.6605\\times10^{-27}$ kg.`
          : `A bond with force constant ${kr} N/m joins atoms with reduced mass ${m} u (${name}). Its harmonic vibrational wavenumber is ______ cm$^{-1}$ (to three significant figures). Use $1\\text{ u} = 1.6605\\times10^{-27}$ kg.`,
          answer: mode === 'k' ? +k.toPrecision(3) : +wOf(kr, m).toPrecision(3), tol: mode === 'k' ? +(k * 0.006).toPrecision(2) : +(we * 0.006).toPrecision(2), unit: mode === 'k' ? 'N/m' : 'cm⁻¹', m, we, kr, mode,
          sol: mode === 'k'
            ? `$k = \\mu(2\\pi c\\tilde\\omega)^2 = ${m}\\times1.6605\\times10^{-27}\\times(2\\pi\\times2.998\\times10^{10}\\times${we})^2 = ${+k.toPrecision(4)}$ N/m.`
            : `$\\tilde\\omega = \\dfrac{1}{2\\pi c}\\sqrt{k/\\mu} = \\dfrac{1}{2\\pi\\times2.998\\times10^{10}}\\sqrt{${kr}/(${m}\\times1.6605\\times10^{-27})} = ${+wOf(kr, m).toPrecision(4)}$ cm$^{-1}$.`,
          trap: 'Use $c$ in cm/s when $\\tilde\\omega$ is in cm$^{-1}$.' };
      },
      verify: (p) => (p.mode === 'k' ? kOf(p.we, p.m) : wOf(p.kr, p.m)) },
    { id: 'vibs-g02', type: 'nat', level: 3, exams: ['gate', 'net'], sub: 'anharmonicity',
      make(r) {
        const [name, , we, x] = choose(r, MOLS);
        const [v1, v2, lab] = choose(r, [[0, 1, 'the fundamental $v = 0\\to1$'], [0, 2, 'the first overtone $v = 0\\to2$'], [0, 3, 'the second overtone $v = 0\\to3$'], [1, 2, 'the hot band $v = 1\\to2$'], [2, 3, 'the hot band $v = 2\\to3$']]);
        const ans = G(we, x, v2) - G(we, x, v1);
        return { q: `For ${name}, $\\tilde\\omega_e = ${we}$ cm$^{-1}$ and $\\tilde\\omega_ex_e = ${x}$ cm$^{-1}$. With $G(v) = \\tilde\\omega_e(v + \\tfrac12) - \\tilde\\omega_ex_e(v + \\tfrac12)^2$, ${lab} lies at ______ cm$^{-1}$ (to one decimal place).`,
          answer: round(ans, 1), tol: 0.2, unit: 'cm⁻¹', we, x, v1, v2,
          sol: `$G(${v2}) - G(${v1}) = \\tilde\\omega_e(${v2 - v1}) - \\tilde\\omega_ex_e[(${v2 + 0.5})^2 - (${v1 + 0.5})^2] = ${we * (v2 - v1)} - ${x}\\times${(v2 + 0.5) ** 2 - (v1 + 0.5) ** 2} = ${round(ans, 2)}$ cm$^{-1}$.`,
          trap: 'Square $(v + \\tfrac12)$, not $v$.' };
      },
      verify: (p) => G(p.we, p.x, p.v2) - G(p.we, p.x, p.v1) },
    { id: 'vibs-g03', type: 'nat', level: 4, exams: ['gate', 'net'], sub: 'anharmonicity',
      make(r) {
        const we = pick(r, 500, 4000, 0.5), x = round(we * pick(r, 0.004, 0.025, 0.0005), 2);
        const n1 = round(we - 2 * x, 1), n2 = round(2 * we - 6 * x, 1);
        const ask = choose(r, ['we', 'x']);
        const weC = 3 * n1 - n2, xC = (weC - n1) / 2;
        return { q: `The fundamental and first overtone of a diatomic molecule are at ${n1} and ${n2} cm$^{-1}$. Using $G(v) = \\tilde\\omega_e(v + \\tfrac12) - \\tilde\\omega_ex_e(v + \\tfrac12)^2$, ${ask === 'we' ? '$\\tilde\\omega_e$' : '$\\tilde\\omega_ex_e$'} is ______ cm$^{-1}$ (to one decimal place).`,
          answer: round(ask === 'we' ? weC : xC, 1), tol: 0.15, unit: 'cm⁻¹', n1, n2, ask,
          sol: `$\\nu_1 = \\tilde\\omega_e - 2\\tilde\\omega_ex_e$ and $\\nu_2 = 2\\tilde\\omega_e - 6\\tilde\\omega_ex_e$. So $\\tilde\\omega_e = 3\\nu_1 - \\nu_2 = ${round(3 * n1, 1)} - ${n2} = ${round(weC, 2)}$ cm$^{-1}$ and $\\tilde\\omega_ex_e = (\\tilde\\omega_e - \\nu_1)/2 = ${round(xC, 2)}$ cm$^{-1}$.`,
          trap: 'Two equations, two unknowns: eliminate $\\tilde\\omega_ex_e$ with $3\\nu_1 - \\nu_2$.' };
      },
      verify: (p) => { const w = 3 * p.n1 - p.n2; return p.ask === 'we' ? w : (w - p.n1) / 2; } },
    { id: 'vibs-g04', type: 'nat', level: 3, exams: ['gate', 'net'], sub: 'morse potential',
      make(r) {
        const [name, , we, x] = choose(r, MOLS);
        const mode = choose(r, ['De', 'D0']);
        const De = we * we / (4 * x), D0 = De - G(we, x, 0);
        const ans = (mode === 'De' ? De : D0) * EV;
        return { q: `For ${name}, $\\tilde\\omega_e = ${we}$ cm$^{-1}$ and $\\tilde\\omega_ex_e = ${x}$ cm$^{-1}$. In the Morse model, ${mode === 'De' ? 'the well depth $D_e = \\tilde\\omega_e^2/4\\tilde\\omega_ex_e$' : 'the dissociation energy from $v = 0$, $D_0 = D_e - G(0)$ with $D_e = \\tilde\\omega_e^2/4\\tilde\\omega_ex_e$,'} is ______ eV (to three significant figures). Use 1 cm$^{-1}$ = $1.2398\\times10^{-4}$ eV.`,
          answer: +ans.toPrecision(3), tol: +(ans * 0.005).toPrecision(2), unit: 'eV', we, x, mode,
          sol: `$D_e = ${we}^2/(4\\times${x}) = ${round(De, 0)}$ cm$^{-1}$.${mode === 'D0' ? ` $G(0) = \\tilde\\omega_e/2 - \\tilde\\omega_ex_e/4 = ${round(G(we, x, 0), 2)}$ cm$^{-1}$, so $D_0 = ${round(D0, 0)}$ cm$^{-1}$.` : ''} In eV: ${+ans.toPrecision(4)} eV.`,
          trap: '$D_0$ is smaller than $D_e$ by the zero-point energy.' };
      },
      verify: (p) => { const De = p.we ** 2 / (4 * p.x); return (p.mode === 'De' ? De : De - G(p.we, p.x, 0)) * EV; } },
    { id: 'vibs-g05', type: 'nat', level: 3, exams: ['gate', 'net'], sub: 'morse potential',
      make(r) {
        const [name, , we, x] = choose(r, MOLS);
        const vm = Math.floor(we / (2 * x) - 0.5);
        return { q: `For ${name} ($\\tilde\\omega_e = ${we}$ cm$^{-1}$, $\\tilde\\omega_ex_e = ${x}$ cm$^{-1}$), the Morse model's highest bound level is taken as the largest integer $v$ not exceeding $\\tilde\\omega_e/2\\tilde\\omega_ex_e - \\tfrac12$ (where $G(v)$ peaks). It is $v_{max} = $ ______.`,
          answer: vm, tol: 0, we, x,
          sol: `$\\tilde\\omega_e/2\\tilde\\omega_ex_e = ${we}/${round(2 * x, 3)} = ${round(we / (2 * x), 3)}$; minus $\\tfrac12$ gives ${round(we / (2 * x) - 0.5, 3)}, so $v_{max} = ${vm}$.`,
          trap: 'A Morse well holds a finite number of levels; heavy, deep wells hold many.' };
      },
      verify: (p) => Math.floor(p.we / (2 * p.x) - 0.5) },
    { id: 'vibs-g06', type: 'nat', level: 3, exams: ['gate', 'net'], sub: 'vibration-rotation',
      make(r) {
        const n0 = pick(r, 1000, 4000, 0.1), B0 = pick(r, 1, 20, 0.01), B1 = round(B0 * (1 - pick(r, 0.005, 0.04, 0.001)), 3);
        const br = choose(r, ['R', 'P']), J = br === 'R' ? int(r, 0, 9) : int(r, 1, 10);
        const v = br === 'R' ? n0 + (B1 + B0) * (J + 1) + (B1 - B0) * (J + 1) ** 2 : n0 - (B1 + B0) * J + (B1 - B0) * J * J;
        return { q: `A vibration-rotation band has origin $\\tilde\\nu_0 = ${n0}$ cm$^{-1}$, $B_0 = ${B0}$ cm$^{-1}$ and $B_1 = ${B1}$ cm$^{-1}$. The line ${br}(${J}) lies at ______ cm$^{-1}$ (to two decimal places).`,
          answer: round(v, 2), tol: 0.02, unit: 'cm⁻¹', n0, B0, B1, br, J,
          sol: br === 'R'
            ? `R($J$): $J\\to J+1$, $\\tilde\\nu = \\tilde\\nu_0 + B_1(J+1)(J+2) - B_0J(J+1) = \\tilde\\nu_0 + (B_1 + B_0)(J+1) + (B_1 - B_0)(J+1)^2 = ${n0} + ${round((B1 + B0) * (J + 1), 4)} + (${round((B1 - B0) * (J + 1) ** 2, 4)}) = ${round(v, 2)}$ cm$^{-1}$.`
            : `P($J$): $J\\to J-1$, $\\tilde\\nu = \\tilde\\nu_0 + B_1(J-1)J - B_0J(J+1) = \\tilde\\nu_0 - (B_1 + B_0)J + (B_1 - B_0)J^2 = ${n0} - ${round((B1 + B0) * J, 4)} + (${round((B1 - B0) * J * J, 4)}) = ${round(v, 2)}$ cm$^{-1}$.`,
          trap: 'The label is the lower-state $J$; P(0) does not exist.' };
      },
      verify: (p) => (p.br === 'R' ? p.n0 + p.B1 * (p.J + 1) * (p.J + 2) - p.B0 * p.J * (p.J + 1) : p.n0 + p.B1 * (p.J - 1) * p.J - p.B0 * p.J * (p.J + 1)) },
    { id: 'vibs-g07', type: 'nat', level: 4, exams: ['gate', 'net'], sub: 'combination differences',
      make(r) {
        const n0 = pick(r, 1000, 4000, 0.1), B0 = pick(r, 1, 20, 0.01), B1 = round(B0 * (1 - pick(r, 0.005, 0.04, 0.001)), 3);
        const J = int(r, 1, 6), ask = choose(r, ['B0', 'B1']);
        const R = (j) => n0 + B1 * (j + 1) * (j + 2) - B0 * j * (j + 1), P = (j) => n0 + B1 * (j - 1) * j - B0 * j * (j + 1);
        const a = ask === 'B0' ? round(R(J - 1), 2) : round(R(J), 2), b = ask === 'B0' ? round(P(J + 1), 2) : round(P(J), 2);
        const ans = (a - b) / (4 * (J + 0.5));
        return { q: ask === 'B0'
          ? `In a vibration-rotation band, R(${J - 1}) is at ${a} cm$^{-1}$ and P(${J + 1}) at ${b} cm$^{-1}$. Using the combination difference $\\text{R}(J-1) - \\text{P}(J+1) = 4B_0(J + \\tfrac12)$, $B_0 = $ ______ cm$^{-1}$ (to three decimal places).`
          : `In a vibration-rotation band, R(${J}) is at ${a} cm$^{-1}$ and P(${J}) at ${b} cm$^{-1}$. Using the combination difference $\\text{R}(J) - \\text{P}(J) = 4B_1(J + \\tfrac12)$, $B_1 = $ ______ cm$^{-1}$ (to three decimal places).`,
          answer: round(ans, 3), tol: 0.003, unit: 'cm⁻¹', a, b, J,
          sol: ask === 'B0'
            ? `R(${J - 1}) and P(${J + 1}) share the upper level ($v = 1$, $J = ${J}$), so their difference is $F_0(${J + 1}) - F_0(${J - 1}) = 4B_0(J + \\tfrac12)$. $B_0 = (${a} - ${b})/(4\\times${J + 0.5}) = ${round(ans, 4)}$ cm$^{-1}$.`
            : `R(${J}) and P(${J}) start from the same lower level, so their difference is $F_1(${J + 1}) - F_1(${J - 1}) = 4B_1(J + \\tfrac12)$. $B_1 = (${a} - ${b})/(4\\times${J + 0.5}) = ${round(ans, 4)}$ cm$^{-1}$.`,
          trap: 'Lines with a common upper level give the lower-state constant, and the reverse.' };
      },
      verify: (p) => (p.a - p.b) / (4 * (p.J + 0.5)) },
    { id: 'vibs-g08', type: 'nat', level: 1, exams: ['gate', 'net'], sub: 'normal modes',
      make(r) {
        const [name, N, lin] = choose(r, [['NH$_3$', 4, 0], ['CH$_4$', 5, 0], ['C$_6$H$_6$', 12, 0], ['HCN', 3, 1], ['C$_2$H$_2$', 4, 1], ['SO$_2$', 3, 0], ['N$_2$O (linear)', 3, 1], ['CS$_2$', 3, 1], ['SF$_6$', 7, 0], ['C$_2$H$_4$', 6, 0], ['CH$_3$Cl', 5, 0], ['OCS', 3, 1], ['H$_2$O$_2$', 4, 0], ['C$_3$O$_2$ (linear)', 5, 1], ['HCl', 2, 1]]);
        const n = 3 * N - (lin ? 5 : 6);
        return { q: `The number of vibrational normal modes of ${name} is ______.`, answer: n, tol: 0, N, lin,
          sol: `${name} has $N = ${N}$ atoms and is ${lin ? 'linear: $3N - 5$' : 'non-linear: $3N - 6$'} $= ${n}$. (Of the $3N$ degrees of freedom, 3 are translation and ${lin ? 2 : 3} are rotation.)`,
          trap: 'Linear molecules have only 2 rotations, so one more vibration.' };
      },
      verify: (p) => 3 * p.N - (p.lin ? 5 : 6) },
    { id: 'vibs-g09', type: 'msq', level: 2, exams: ['gate', 'net'], sub: 'ir activity',
      make(r) {
        const pool = [['HCl', 1], ['CO', 1], ['NO', 1], ['HBr', 1], ['CO$_2$', 1], ['CH$_4$', 1], ['SF$_6$', 1], ['H$_2$O', 1], ['C$_2$H$_2$', 1], ['N$_2$', 0], ['O$_2$', 0], ['H$_2$', 0], ['Cl$_2$', 0], ['I$_2$', 0], ['F$_2$', 0]];
        const yes = pool.filter((x) => x[1]), no = pool.filter((x) => !x[1]);
        const k = int(r, 1, 3), ch = shuffle(r, [...shuffle(r, yes).slice(0, k), ...shuffle(r, no).slice(0, 4 - k)]);
        return { q: 'Which of these molecules have at least one infrared-active vibrational fundamental?',
          options: ch.map((x) => x[0]), answer: ch.map((x, i) => (x[1] ? i : -1)).filter((i) => i >= 0),
          sol: 'A mode is IR active if it changes the dipole moment. Every polyatomic molecule has at least one such mode, even if it has no permanent dipole (CO$_2$, CH$_4$, SF$_6$). Homonuclear diatomics have none. ' + ch.map((x) => `${x[0]}: ${x[1] ? 'yes' : 'no'}.`).join(' '),
          trap: 'Microwave inactive does not mean IR inactive: CO$_2$ and CH$_4$ absorb strongly in the IR.' };
      } },
    { id: 'vibs-g10', type: 'nat', level: 3, exams: ['gate', 'net'], sub: 'isotope effect',
      make(r) {
        const [a, b, m1, m2] = choose(r, [['H$^{35}$Cl', 'D$^{35}$Cl', 0.97959, 1.90441], ['$^{12}$C$^{16}$O', '$^{13}$C$^{16}$O', 6.85621, 7.17241], ['$^{12}$C$^{16}$O', '$^{12}$C$^{18}$O', 6.85621, 7.20000], ['H$^{19}$F', 'D$^{19}$F', 0.95705, 1.82100], ['H$_2$', 'D$_2$', 0.50391, 1.00705], ['H$_2$', 'HD', 0.50391, 0.67171], ['H$^{79}$Br', 'D$^{79}$Br', 0.99542, 1.95433]]);
        const w = pick(r, 500, 4200, 1);
        const ans = w * Math.sqrt(m1 / m2);
        return { q: `In the harmonic approximation, a vibration of ${a} (reduced mass ${m1} u) at ${w} cm$^{-1}$ moves, for ${b} (reduced mass ${m2} u), to ______ cm$^{-1}$ (to the nearest integer). (Wavenumber hypothetical, for practice.)`,
          answer: Math.round(ans), tol: Math.max(1, Math.round(ans * 0.001)), unit: 'cm⁻¹', w, m1, m2,
          sol: `Same force constant, so $\\tilde\\omega \\propto \\mu^{-1/2}$: $${w}\\times\\sqrt{${m1}/${m2}} = ${w}\\times${round(Math.sqrt(m1 / m2), 5)} = ${round(ans, 1)}$ cm$^{-1}$.`,
          trap: 'Square root of the mass ratio, not the ratio itself.' };
      },
      verify: (p) => p.w * Math.sqrt(p.m1 / p.m2) },
    { id: 'vibs-g11', type: 'nat', level: 3, exams: ['gate', 'net'], sub: 'populations',
      make(r) {
        const w = pick(r, 100, 3000, 1), T = choose(r, [300, 500, 1000, 1500, 2000, 3000]);
        const mode = choose(r, ['ratio', 'hot']);
        const x = Math.exp(-C2 * w / T);
        const ans = mode === 'ratio' ? x : 1 - x;
        return { q: mode === 'ratio'
          ? `A diatomic molecule has a vibrational spacing of ${w} cm$^{-1}$. At ${T} K the population ratio $N_{v=1}/N_{v=0}$ is ______ (to three significant figures). Use $hc/k = 1.4388$ cm K.`
          : `Treating a molecule with vibrational spacing ${w} cm$^{-1}$ as harmonic (equally spaced levels), the fraction of molecules in $v = 0$ at ${T} K, $1 - e^{-hc\\tilde\\nu/kT}$, is ______ (to three significant figures). Use $hc/k = 1.4388$ cm K.`,
          answer: +ans.toPrecision(3), tol: +(Math.abs(ans) * 0.006).toPrecision(2), w, T, mode,
          sol: `$hc\\tilde\\nu/kT = 1.4388\\times${w}/${T} = ${round(C2 * w / T, 4)}$; $e^{-${round(C2 * w / T, 4)}} = ${(+x.toPrecision(4))}$.${mode === 'hot' ? ` For equally spaced levels the partition function is $1/(1 - e^{-x})$, so the $v = 0$ fraction is $1 - e^{-x} = ${+ans.toPrecision(4)}$.` : ''}`,
          trap: 'Vibrational levels are non-degenerate: no $2J+1$ factor.' };
      },
      verify: (p) => { const x = Math.exp(-C2 * p.w / p.T); return p.mode === 'ratio' ? x : 1 - x; } },
    { id: 'vibs-g12', type: 'nat', level: 3, exams: ['gate', 'net'], sub: 'vibration-rotation',
      make(r) {
        const n0 = pick(r, 1000, 4000, 0.1), B0 = pick(r, 1, 20, 0.01), B1 = round(B0 * (1 - pick(r, 0.005, 0.04, 0.001)), 3);
        const R0 = round(n0 + 2 * B1, 2), P1 = round(n0 - 2 * B0, 2), ask = choose(r, ['gap', 'origin']);
        return { q: ask === 'gap'
          ? `A vibration-rotation band has $B_0 = ${B0}$ cm$^{-1}$ and $B_1 = ${B1}$ cm$^{-1}$. The gap between R(0) and P(1) at the centre of the band is ______ cm$^{-1}$ (to two decimal places).`
          : `In a vibration-rotation band the lines R(0) and P(1) are at ${R0} and ${P1} cm$^{-1}$, with $B_0 = ${B0}$ and $B_1 = ${B1}$ cm$^{-1}$. The band origin $\\tilde\\nu_0$ is ______ cm$^{-1}$ (to two decimal places).`,
          answer: ask === 'gap' ? round(2 * (B0 + B1), 2) : round(R0 - 2 * B1, 2), tol: 0.02, unit: 'cm⁻¹', B0, B1, R0, ask,
          sol: `R(0) $= \\tilde\\nu_0 + 2B_1$ and P(1) $= \\tilde\\nu_0 - 2B_0$. ${ask === 'gap' ? `Gap $= 2(B_0 + B_1) = ${round(2 * (B0 + B1), 3)}$ cm$^{-1}$.` : `So $\\tilde\\nu_0 = \\text{R}(0) - 2B_1 = ${R0} - ${round(2 * B1, 3)} = ${round(R0 - 2 * B1, 2)}$ cm$^{-1}$ (check: P(1) $+ 2B_0$ gives the same).`}`,
          trap: 'There is no line at the band origin itself.' };
      },
      verify: (p) => (p.ask === 'gap' ? 2 * (p.B0 + p.B1) : p.R0 - 2 * p.B1) },
  ],
};
