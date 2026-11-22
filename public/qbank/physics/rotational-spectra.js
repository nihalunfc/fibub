// Rotational spectra: the rigid rotor, line spacing 2B, bond lengths, isotope shifts, thermal populations and the
// strongest line, centrifugal distortion, symmetric tops, which molecules are microwave active, nuclear spin statistics.
// Original questions for GATE and CSIR NET practice (fibub). Levels: 1 warm-up ... 5 top rank.
import { pick, int, choose, mcqOptions, round, shuffle } from '../_util.js';

const IB = 16.8576;           // I (amu Å^2) = IB / B (cm^-1)
const C2 = 1.438777;          // hc/k in cm K
const GHZ = 29.9792458;       // GHz per cm^-1
const MEV = 0.123984;         // meV per cm^-1
const M = { H: 1.007825, D: 2.014102, C12: 12, C13: 13.003355, N14: 14.003074, O16: 15.994915, O18: 17.999160, F: 18.998403, Na: 22.989770, Cl35: 34.968853, Cl37: 36.965903, Br79: 78.918338, I: 126.904473, K: 38.963707, Li7: 7.016004 };
const mu = (a, b) => (a * b) / (a + b);
const MOL = [
  ['$^1$H$^{35}$Cl', M.H, M.Cl35, 127.46], ['$^2$H$^{35}$Cl', M.D, M.Cl35, 127.46], ['$^{12}$C$^{16}$O', M.C12, M.O16, 112.83], ['$^{13}$C$^{16}$O', M.C13, M.O16, 112.83],
  ['$^1$H$^{19}$F', M.H, M.F, 91.68], ['$^1$H$^{79}$Br', M.H, M.Br79, 141.44], ['$^1$H$^{127}$I', M.H, M.I, 160.92], ['$^{23}$Na$^{35}$Cl', M.Na, M.Cl35, 236.08],
  ['$^{14}$N$^{16}$O', M.N14, M.O16, 115.08], ['$^{7}$Li$^{1}$H', M.Li7, M.H, 159.56], ['$^{39}$K$^{35}$Cl', M.K, M.Cl35, 266.67]];
const Bof = (m1, m2, rpm) => IB / (mu(m1, m2) * (rpm / 100) ** 2);
const jmax = (B, T) => Math.sqrt(T / (2 * C2 * B)) - 0.5;
const jbest = (B, T) => { let best = 0, f = 0; for (let J = 0; J < 300; J++) { const v = (2 * J + 1) * Math.exp(-C2 * B * J * (J + 1) / T); if (v > f) { f = v; best = J; } } return best; };

export default {
  topic: 'rotational-spectra',
  items: [
    // ---------- level 1 ----------
    { id: 'rots-001', type: 'mcq', level: 1, exams: ['gate', 'net'], sub: 'rigid rotor',
      q: 'For a rigid diatomic rotor with rotational constant $B$ (in cm$^{-1}$), the spacing between adjacent lines of the pure rotational absorption spectrum is',
      options: ['$B$', '$2B$', '$4B$', '$B/2$'], answer: 1,
      sol: '$F(J) = BJ(J+1)$. The line $J\\to J+1$ is at $F(J+1) - F(J) = 2B(J+1)$: $2B, 4B, 6B, \\dots$ Adjacent lines are $2B$ apart; the first line is also at $2B$.',
      trap: 'The levels are not equally spaced (gaps $2B, 4B, 6B$); the lines are.' },
    { id: 'rots-002', type: 'msq', level: 1, exams: ['gate', 'net'], sub: 'microwave activity',
      q: 'Which of these molecules show a pure rotational (microwave) absorption spectrum?',
      options: ['HCl', 'CO', 'N$_2$', 'CO$_2$'], answer: [0, 1],
      sol: 'A pure rotational E1 spectrum needs a permanent electric dipole moment. HCl and CO are polar. N$_2$ (homonuclear) and CO$_2$ (linear and symmetric, O=C=O) have none.',
      trap: 'CO$_2$ has polar bonds, but the two bond dipoles cancel.' },
    { id: 'rots-003', type: 'mcq', level: 1, exams: ['gate', 'net'], sub: 'selection rules',
      q: 'The selection rule for pure rotational electric dipole transitions of a linear molecule is',
      options: ['$\\Delta J = 0, \\pm1$', '$\\Delta J = \\pm2$', '$\\Delta J = \\pm1$', 'any $\\Delta J$'], answer: 2,
      sol: 'The photon carries one unit of angular momentum and the dipole operator has odd parity, while the rotational levels alternate in parity: $\\Delta J = \\pm1$. ($\\Delta J = \\pm2$ is the rotational Raman rule; $\\Delta J = 0$ appears in vibrational bands of some molecules, not in pure rotation.)',
      trap: '$\\Delta J = \\pm2$ belongs to rotational Raman spectra.' },
    { id: 'rots-004', type: 'nat', level: 1, exams: ['gate', 'net'], sub: 'rigid rotor',
      q: 'The degeneracy of the rotational level $J = 4$ of a diatomic molecule (in zero field) is ______.',
      answer: 9, tol: 0,
      sol: 'Each $J$ has $2J + 1$ values of $M_J$: $2\\times4 + 1 = 9$.',
      trap: 'Degeneracy is $2J + 1$, not $J + 1$.' },
    { id: 'rots-005', type: 'mcq', level: 1, exams: ['gate', 'net'], sub: 'rotational constant',
      q: 'The rotational constant $B = h/(8\\pi^2cI)$ of a diatomic molecule',
      options: ['increases with the bond length', 'is the same for all isotopic forms of a molecule', 'is independent of the masses of the atoms', 'decreases as the moment of inertia increases'], answer: 3,
      sol: '$B \\propto 1/I = 1/(\\mu r^2)$. A longer bond or heavier atoms give a larger $I$ and a smaller $B$, so heavy molecules have closely spaced lines. Isotopes change $\\mu$ and therefore $B$.',
      trap: 'Isotopes have the same bond length but different $B$.' },
    { id: 'rots-006', type: 'nat', level: 1, exams: ['gate', 'net'], sub: 'line positions',
      q: 'A diatomic molecule has $B = 1.92$ cm$^{-1}$. Its first pure rotational absorption line ($J = 0\\to1$) is at ______ cm$^{-1}$.',
      answer: 3.84, tol: 0.01, unit: 'cm⁻¹', calc: () => 2 * 1.92,
      sol: '$\\tilde\\nu = 2B(J+1)$ with $J = 0$: $2\\times1.92 = 3.84$ cm$^{-1}$ (about 115 GHz, wavelength 2.6 mm).',
      trap: 'The first line is at $2B$, not $B$.' },

    // ---------- level 2 ----------
    { id: 'rots-007', type: 'nat', level: 2, exams: ['gate', 'net'], sub: 'line positions',
      q: 'For $^1$H$^{35}$Cl, $B = 10.59$ cm$^{-1}$. The rigid-rotor position of the $J = 3\\to4$ absorption line is ______ cm$^{-1}$ (to one decimal place).',
      answer: 84.7, tol: 0.1, unit: 'cm⁻¹', calc: () => 2 * 10.59 * 4,
      sol: '$\\tilde\\nu = 2B(J+1) = 2\\times10.59\\times4 = 84.72$ cm$^{-1}$, in the far infrared.',
      trap: 'Use the lower $J$ plus one: $J + 1 = 4$.' },
    { id: 'rots-008', type: 'nat', level: 2, exams: ['gate', 'net'], sub: 'rotational constant',
      q: 'The $J = 0\\to1$ line of $^{12}$C$^{16}$O is at 115.27 GHz. The rotational constant $B$ is ______ cm$^{-1}$ (to three decimal places). Use $c = 2.998\\times10^{10}$ cm/s.',
      answer: 1.922, tol: 0.002, unit: 'cm⁻¹', calc: () => 115.27e9 / 2 / 2.998e10,
      sol: 'The line is at $2B$, so $B = 57.635$ GHz. In wavenumbers: $57.635\\times10^9/2.998\\times10^{10} = 1.922$ cm$^{-1}$.',
      trap: 'Forgetting that the first line is at $2B$ doubles $B$.' },
    { id: 'rots-009', type: 'mcq', level: 2, exams: ['gate', 'net'], sub: 'isotope effect',
      q: 'When H is replaced by D in HCl (bond length unchanged), the rotational line spacing',
      options: ['roughly halves', 'roughly doubles', 'stays the same', 'falls by a factor $\\sqrt2$'], answer: 0,
      sol: '$\\mu(\\text{HCl}) = 0.980$ u, $\\mu(\\text{DCl}) = 1.904$ u. $B \\propto 1/\\mu$, so $B$ and the line spacing drop by a factor of 0.514, about half.',
      trap: '$\\sqrt2$ is the factor for vibrational frequencies ($\\omega \\propto \\mu^{-1/2}$); rotation goes as $1/\\mu$.' },
    { id: 'rots-010', type: 'nat', level: 2, exams: ['gate', 'net'], sub: 'bond length',
      q: 'For $^{12}$C$^{16}$O, $B = 1.9313$ cm$^{-1}$ and $\\mu = 6.856$ u. Using $I\\,(\\text{u Å}^2) = 16.858/B\\,(\\text{cm}^{-1})$, the bond length is ______ pm (to one decimal place).',
      answer: 112.8, tol: 0.3, unit: 'pm', calc: () => Math.sqrt(16.858 / 1.9313 / 6.856) * 100,
      sol: '$I = 16.858/1.9313 = 8.729$ u Å$^2$. $r = \\sqrt{I/\\mu} = \\sqrt{8.729/6.856} = \\sqrt{1.2732} = 1.128$ Å $= 112.8$ pm.',
      trap: 'Use the reduced mass, not the total mass.' },
    { id: 'rots-011', type: 'mcq', level: 2, exams: ['gate', 'net'], sub: 'populations',
      q: 'The rotational level of a diatomic gas with the largest population at temperature $T$ is closest to',
      options: ['$J = 0$ always', '$J_{max} = \\sqrt{kT/2hcB} - \\tfrac12$', '$J_{max} = kT/hcB$', '$J_{max} = \\sqrt{2kT/hcB}$'], answer: 1,
      sol: '$N_J \\propto (2J+1)e^{-hcBJ(J+1)/kT}$. Setting $dN_J/dJ = 0$: $2 = (2J+1)^2hcB/kT$, so $J_{max} = \\sqrt{kT/2hcB} - \\tfrac12$. The degeneracy grows while the Boltzmann factor falls.',
      trap: '$J = 0$ has the largest population per state, but not per level, because of the $2J+1$ degeneracy.' },
    { id: 'rots-012', type: 'msq', level: 2, exams: ['gate', 'net'], sub: 'microwave activity',
      q: 'Which of these polyatomic molecules have a pure rotational microwave spectrum?',
      options: ['OCS (linear)', 'CH$_4$', 'H$_2$O', 'CO$_2$'], answer: [0, 2],
      sol: 'Linear OCS has different ends and a dipole moment. Bent H$_2$O is polar. Tetrahedral CH$_4$ (a spherical top) and linear symmetric CO$_2$ have no permanent dipole.',
      trap: 'A molecule can be microwave inactive and still show a rotational Raman spectrum (CO$_2$ does).' },
    { id: 'rots-013', type: 'nat', level: 2, exams: ['gate', 'net'], sub: 'populations',
      q: 'With $k/hc = 0.6950$ cm$^{-1}$/K, the thermal energy $kT$ at 300 K expressed in wavenumbers is ______ cm$^{-1}$ (to one decimal place).',
      answer: 208.5, tol: 0.2, unit: 'cm⁻¹', calc: () => 0.695 * 300,
      sol: '$kT/hc = 0.6950\\times300 = 208.5$ cm$^{-1}$. Since rotational constants are typically 0.1 to 60 cm$^{-1}$, many rotational levels are populated at room temperature.',
      trap: 'This number (about 200 cm$^{-1}$) is worth memorising for quick estimates.' },
    { id: 'rots-014', type: 'mcq', level: 2, exams: ['gate', 'net'], sub: 'centrifugal distortion',
      q: 'In a real diatomic molecule the observed pure rotational lines are',
      options: ['exactly equally spaced', 'spaced further apart at high $J$', 'spaced slightly closer together at high $J$ because the bond stretches', 'alternately strong and weak'], answer: 2,
      sol: 'Centrifugal stretching increases $I$ at high $J$, lowering the levels: $F(J) = BJ(J+1) - DJ^2(J+1)^2$, with lines at $2B(J+1) - 4D(J+1)^3$. The spacing shrinks slowly with $J$.',
      trap: 'Alternating intensities come from nuclear spin statistics in homonuclear molecules (seen in Raman spectra).' },
    { id: 'rots-015', type: 'nat', level: 2, exams: ['gate', 'net'], sub: 'moment of inertia',
      q: 'For HCl, $B = 10.59$ cm$^{-1}$. Its moment of inertia is ______ $\\times10^{-47}$ kg m$^2$ (to two decimal places). Use $h = 6.626\\times10^{-34}$ J s, $c = 2.998\\times10^{10}$ cm/s.',
      answer: 2.64, tol: 0.01, calc: () => 6.626e-34 / (8 * Math.PI ** 2 * 2.998e10 * 10.59) / 1e-47,
      sol: '$I = h/(8\\pi^2cB) = 6.626\\times10^{-34}/(8\\times9.870\\times2.998\\times10^{10}\\times10.59)$ kg m$^2$ $= 2.64\\times10^{-47}$ kg m$^2$. ($c$ in cm/s because $B$ is in cm$^{-1}$.)',
      trap: 'Mixing $c$ in m/s with $B$ in cm$^{-1}$ gives an answer 100 times too large.' },
    { id: 'rots-016', type: 'mcq', level: 2, exams: ['gate', 'net'], sub: 'spectral regions',
      q: 'Pure rotational transitions of small molecules fall mainly in the',
      options: ['visible region', 'ultraviolet region', 'near infrared ($\\sim$ 1 $\\mu$m)', 'microwave and far-infrared regions'], answer: 3,
      sol: '$2B$ ranges from about 0.4 cm$^{-1}$ (heavy molecules, $\\sim$ 10 GHz) to about 120 cm$^{-1}$ (H$_2$-like), wavelengths from cm down to about 0.1 mm. Vibrations are in the infrared and electronic transitions in the visible and UV.',
      trap: 'Near-IR is vibrational overtone territory.' },

    // ---------- level 3 ----------
    { id: 'rots-017', type: 'nat', level: 3, exams: ['gate', 'net'], sub: 'populations',
      q: 'For HCl ($B = 10.59$ cm$^{-1}$) at 300 K ($kT/hc = 208.5$ cm$^{-1}$), the rotational level with the largest population has $J = $ ______.',
      answer: 3, tol: 0,
      sol: '$J_{max} = \\sqrt{208.5/(2\\times10.59)} - 0.5 = \\sqrt{9.844} - 0.5 = 2.64$. Compare neighbours: $(2J+1)e^{-BJ(J+1)/208.5}$ is 3.69 ($J = 2$), 3.81 ($J = 3$), 3.26 ($J = 4$). So $J = 3$.',
      trap: 'Round by comparing the integers on either side, not by truncating 2.64 to 2.' },
    { id: 'rots-018', type: 'nat', level: 3, exams: ['gate', 'net'], sub: 'populations',
      q: 'For CO ($B = 1.9313$ cm$^{-1}$) at 300 K ($kT/hc = 208.5$ cm$^{-1}$), the population ratio $N_{J=1}/N_{J=0}$ is ______ (to two decimal places).',
      answer: 2.94, tol: 0.01, calc: () => 3 * Math.exp(-2 * 1.9313 / 208.5),
      sol: '$N_1/N_0 = \\dfrac{3}{1}e^{-2B/(kT/hc)} = 3e^{-3.8626/208.5} = 3e^{-0.01853} = 3\\times0.9816 = 2.94$.',
      trap: 'Include the degeneracy 3 of $J = 1$; the Boltzmann factor alone is 0.98.' },
    { id: 'rots-019', type: 'nat', level: 3, exams: ['gate', 'net'], sub: 'centrifugal distortion',
      q: 'For a diatomic molecule the centrifugal distortion constant is $D = 4B^3/\\tilde\\omega^2$. For HCl, $B = 10.59$ cm$^{-1}$ and $\\tilde\\omega = 2991$ cm$^{-1}$, so $D = $ ______ $\\times10^{-4}$ cm$^{-1}$ (to two decimal places).',
      answer: 5.31, tol: 0.03, calc: () => 4 * 10.59 ** 3 / 2991 ** 2 * 1e4,
      sol: '$B^3 = 1187.7$ cm$^{-3}$; $4B^3 = 4750.7$; $\\tilde\\omega^2 = 8.946\\times10^6$. $D = 5.31\\times10^{-4}$ cm$^{-1}$, about $5\\times10^{-5}$ of $B$: a stiff bond barely stretches.',
      trap: 'A stiffer bond (larger $\\tilde\\omega$) gives a smaller $D$.' },
    { id: 'rots-020', type: 'mcq', level: 3, exams: ['gate', 'net'], sub: 'line positions',
      q: 'For a rigid rotor, a plot of the frequency of the line $J\\to J+1$ against the lower $J$ is',
      options: ['a straight line with slope $2B$ and intercept $2B$', 'a straight line through the origin with slope $B$', 'a parabola $\\propto J(J+1)$', 'a straight line with slope $2B$ through the origin'], answer: 0,
      sol: '$\\tilde\\nu = 2B(J+1) = 2BJ + 2B$: slope $2B$, intercept $2B$ at $J = 0$. With centrifugal distortion the line bends slightly downward at large $J$ (the $-4D(J+1)^3$ term).',
      trap: 'The parabola $BJ(J+1)$ is the level energy, not the line position.' },
    { id: 'rots-021', type: 'nat', level: 3, exams: ['gate', 'net'], sub: 'isotope effect',
      q: 'For $^{12}$C$^{16}$O, $B = 1.9313$ cm$^{-1}$. With reduced masses 6.8562 u ($^{12}$C$^{16}$O) and 7.1724 u ($^{13}$C$^{16}$O) and the same bond length, $B$ for $^{13}$C$^{16}$O is ______ cm$^{-1}$ (to three decimal places).',
      answer: 1.846, tol: 0.002, unit: 'cm⁻¹', calc: () => 1.9313 * 6.8562 / 7.1724,
      sol: '$B \\propto 1/\\mu$: $B\' = 1.9313\\times6.8562/7.1724 = 1.9313\\times0.9559 = 1.846$ cm$^{-1}$. This is how isotopes are identified in interstellar clouds.',
      trap: 'Scale by $\\mu$, not by the total mass (which would give 1.865).' },
    { id: 'rots-022', type: 'msq', level: 3, exams: ['gate', 'net'], sub: 'symmetric tops',
      q: 'For a rigid symmetric-top molecule such as CH$_3$Cl, with $F(J, K) = BJ(J+1) + (A - B)K^2$, which statements are correct?',
      options: ['The pure rotational selection rules are $\\Delta J = \\pm1$, $\\Delta K = 0$', 'The rigid-rotor lines are at $2B(J+1)$, independent of $K$', 'CH$_3$Cl is a prolate top ($A > B$)', 'Levels with $K \\ne 0$ are non-degenerate'], answer: [0, 1, 2],
      sol: 'The dipole lies along the symmetry axis, so radiation cannot change the rotation about it: $\\Delta K = 0$. Then the $(A-B)K^2$ term cancels in every line, leaving $2B(J+1)$ (centrifugal terms split each line slightly by $K$). CH$_3$Cl is elongated, so $I_\\parallel < I_\\perp$ and $A > B$. Levels with $K \\ne 0$ are doubly degenerate ($\\pm K$), on top of the $2J+1$ of $M$.',
      trap: '$\\pm K$ give the same energy, so $K \\ne 0$ levels are doubly degenerate in $K$.' },
    { id: 'rots-023', type: 'nat', level: 3, exams: ['gate', 'net'], sub: 'rotational temperature',
      q: 'For H$_2$, $B = 60.85$ cm$^{-1}$. The characteristic rotational temperature $\\theta_{rot} = hcB/k$ is ______ K (to one decimal place). Use $hc/k = 1.4388$ cm K.',
      answer: 87.6, tol: 0.1, unit: 'K', calc: () => 60.85 * 1.4388,
      sol: '$\\theta_{rot} = 1.4388\\times60.85 = 87.55$ K. Below about this temperature H$_2$ rotation freezes out, which shows in its heat capacity.',
      trap: 'For most other molecules $\\theta_{rot}$ is a few kelvin or less, so rotation is classical at room temperature.' },
    { id: 'rots-024', type: 'mcq', level: 3, exams: ['gate', 'net'], sub: 'nuclear spin statistics',
      q: 'In hydrogen gas at room temperature, the ratio of ortho-H$_2$ (odd $J$, nuclear spins parallel) to para-H$_2$ (even $J$) is about',
      options: ['1 : 1', '3 : 1', '1 : 3', '2 : 1'], answer: 1,
      sol: 'Two spin-1/2 protons: 3 symmetric (triplet) and 1 antisymmetric (singlet) spin states. Fermi statistics ties the triplet to odd $J$ and the singlet to even $J$. At high $T$ (many $J$ populated), the ratio approaches 3 : 1.',
      trap: '2 : 1 is the even : odd ratio for $^{14}$N$_2$ (spin-1 nuclei, bosons).' },
    { id: 'rots-025', type: 'nat', level: 3, exams: ['gate', 'net'], sub: 'isotope effect',
      q: 'The $J = 3\\to4$ line of H$^{35}$Cl is at 83.03 cm$^{-1}$. The reduced masses are 0.97959 u (H$^{35}$Cl) and 0.98108 u (H$^{37}$Cl). The H$^{37}$Cl line lies lower by ______ cm$^{-1}$ (to two decimal places).',
      answer: 0.13, tol: 0.01, unit: 'cm⁻¹', calc: () => 83.03 * (1 - 0.97959 / 0.98108),
      sol: '$\\tilde\\nu\\propto B\\propto1/\\mu$. $\\tilde\\nu\' = 83.03\\times0.97959/0.98108 = 83.03\\times0.998481 = 82.904$ cm$^{-1}$. Shift $= 0.126 \\approx 0.13$ cm$^{-1}$. Each HCl line is a close doublet with intensity ratio about 3 : 1 (the $^{35}$Cl : $^{37}$Cl abundance).',
      trap: 'The heavier isotope has the smaller $B$ and so the lower frequency.' },
    { id: 'rots-026', type: 'mcq', level: 3, exams: ['gate', 'net'], sub: 'populations',
      q: 'In the rotational absorption spectrum of a gas at room temperature, the line intensities first rise and then fall with $J$. This is because',
      options: ['the transition dipole moment increases with $J$ and then decreases', 'centrifugal distortion weakens high-$J$ lines', 'the population per level, $(2J+1)e^{-E_J/kT}$, first rises with degeneracy and then falls with the Boltzmann factor', 'the spectrometer response falls at high frequency'], answer: 2,
      sol: 'The intensity of $J\\to J+1$ follows mainly the population of the lower level $J$, which has a maximum near $J_{max} = \\sqrt{kT/2hcB} - \\tfrac12$.',
      trap: 'The permanent dipole is the same for every $J$; the envelope comes from thermal populations.' },
    { id: 'rots-027', type: 'nat', level: 3, exams: ['gate', 'net'], sub: 'rigid rotor',
      q: 'For CO ($B = 1.9313$ cm$^{-1}$), the energy of the $J = 2$ rotational level above $J = 0$ is ______ meV (to two decimal places). Use 1 cm$^{-1}$ = 0.12398 meV.',
      answer: 1.44, tol: 0.01, unit: 'meV', calc: () => 6 * 1.9313 * 0.12398,
      sol: '$F(2) = B\\times2\\times3 = 6B = 11.588$ cm$^{-1}$ $= 11.588\\times0.12398 = 1.437$ meV.',
      trap: '$J(J+1) = 6$, not $J^2 = 4$.' },
    { id: 'rots-028', type: 'mcq', level: 3, exams: ['gate', 'net'], sub: 'stark effect',
      q: 'Measuring how microwave rotational lines split and shift in a known static electric field (the rotational Stark effect) is mainly used to determine',
      options: ['the bond length', 'the nuclear spin', 'the vibrational frequency', 'the electric dipole moment of the molecule'], answer: 3,
      sol: 'For a linear molecule the second-order Stark shift of $|J, M\\rangle$ is proportional to $\\mu_d^2E^2/B$. Knowing $B$ from the zero-field spectrum, the splitting gives the dipole moment $\\mu_d$ very precisely.',
      trap: 'The bond length comes from $B$ itself, without any field.' },

    // ---------- level 4 ----------
    { id: 'rots-029', type: 'nat', level: 4, exams: ['gate', 'net'], sub: 'line assignment',
      q: 'Two adjacent lines in the far-infrared spectrum of a diatomic molecule are at 38.40 and 57.60 cm$^{-1}$, and there are no lines between them. Assuming a rigid rotor, the line at 57.60 cm$^{-1}$ starts from the level $J = $ ______.',
      answer: 2, tol: 0,
      sol: 'Spacing $2B = 19.20$ cm$^{-1}$, so $B = 9.60$ cm$^{-1}$. $57.60 = 2B(J+1) = 19.20(J+1)$ gives $J + 1 = 3$, $J = 2$ (the $2\\to3$ line). Check: $38.40 = 19.20\\times2$ is the $1\\to2$ line.',
      trap: 'The line index is $J + 1$, one more than the lower level.' },
    { id: 'rots-030', type: 'nat', level: 4, exams: ['gate', 'net'], sub: 'centrifugal distortion',
      q: 'Including centrifugal distortion, lines are at $\\tilde\\nu = 2B(J+1) - 4D(J+1)^3$. For HCl, $B = 10.59$ cm$^{-1}$ and $D = 5.3\\times10^{-4}$ cm$^{-1}$. The $J = 9\\to10$ line is at ______ cm$^{-1}$ (to one decimal place).',
      answer: 209.7, tol: 0.1, unit: 'cm⁻¹', calc: () => 2 * 10.59 * 10 - 4 * 5.3e-4 * 1000,
      sol: '$2B\\times10 = 211.80$; $4D\\times10^3 = 2.12$. $\\tilde\\nu = 211.80 - 2.12 = 209.68 \\approx 209.7$ cm$^{-1}$. The correction is about 1% at $J = 9$ and grows as $J^3$.',
      trap: 'The distortion term goes as $(J+1)^3$ for the line, not $(J+1)^2$.' },
    { id: 'rots-031', type: 'msq', level: 4, exams: ['gate', 'net'], sub: 'populations',
      q: 'Which statements about the thermal distribution over rotational levels are correct?',
      options: ['The most populated $J$ moves to higher values as $T$ rises', 'At the same $T$, a molecule with smaller $B$ has a larger $J_{max}$', 'As $T\\to0$ only $J = 0$ remains populated', '$J_{max}$ grows in proportion to $T$'], answer: [0, 1, 2],
      sol: '$J_{max} \\approx \\sqrt{kT/2hcB} - \\tfrac12$: it grows as $\\sqrt T$ (not $T$) and as $1/\\sqrt B$. At low $T$ the Boltzmann factor kills every excited level.',
      trap: 'Square root, not linear: quadrupling $T$ only doubles $J_{max} + \\tfrac12$.' },
    { id: 'rots-032', type: 'nat', level: 4, exams: ['gate', 'net'], sub: 'partition function',
      q: 'At high temperature the rotational partition function of a heteronuclear diatomic molecule is $q_{rot} \\approx kT/hcB$. For CO ($B = 1.9313$ cm$^{-1}$) at 300 K ($kT/hc = 208.5$ cm$^{-1}$), $q_{rot}$ is ______ (to the nearest integer).',
      answer: 108, tol: 1, calc: () => 208.5 / 1.9313,
      sol: '$q_{rot} = 208.5/1.9313 = 107.96 \\approx 108$. For a homonuclear molecule divide by the symmetry number $\\sigma = 2$.',
      trap: 'Forgetting $\\sigma$ for homonuclear molecules overcounts by 2.' },
    { id: 'rots-033', type: 'mcq', level: 4, exams: ['gate', 'net'], sub: 'symmetric tops',
      q: 'A prolate symmetric top has $A = 5.00$ cm$^{-1}$ and $B = 0.25$ cm$^{-1}$, with $F(J, K) = BJ(J+1) + (A - B)K^2$. The energy of the level $J = 3$, $K = 2$ is',
      options: ['22.0 cm$^{-1}$', '23.0 cm$^{-1}$', '$-16.0$ cm$^{-1}$', '60.0 cm$^{-1}$'], answer: 0,
      sol: '$BJ(J+1) = 0.25\\times12 = 3.0$; $(A - B)K^2 = 4.75\\times4 = 19.0$. Total 22.0 cm$^{-1}$.',
      trap: 'Using $AK^2$ instead of $(A - B)K^2$ gives 23.0; the rotation about the axis is already partly counted in $J(J+1)$.' },
    { id: 'rots-034', type: 'nat', level: 4, exams: ['gate', 'net'], sub: 'populations',
      q: 'For HCl ($B = 10.59$ cm$^{-1}$) at 300 K ($kT/hc = 208.5$ cm$^{-1}$), the population ratio $N_{J=1}/N_{J=5}$ is ______ (to two decimal places).',
      answer: 1.13, tol: 0.01, calc: () => (3 / 11) * Math.exp((30 - 2) * 10.59 / 208.5),
      sol: '$\\dfrac{N_1}{N_5} = \\dfrac{3}{11}\\exp\\left[\\dfrac{B(30 - 2)}{kT/hc}\\right] = 0.2727\\times e^{1.4222} = 0.2727\\times4.146 = 1.13$.',
      trap: '$F(5) - F(1) = B(30 - 2) = 28B$.' },
    { id: 'rots-035', type: 'mcq', level: 4, exams: ['gate', 'net'], sub: 'vibration-rotation interaction',
      q: 'The rotational constant in the first excited vibrational level, $B_1$, is slightly smaller than in the ground level, $B_0$. The reason is',
      options: ['the reduced mass increases on excitation', 'the anharmonic potential makes the average of $1/r^2$ smaller in $v = 1$ (the molecule is, on average, longer)', 'centrifugal distortion is larger in $v = 1$', 'the selection rules change'], answer: 1,
      sol: '$B_v \\propto \\langle 1/r^2\\rangle_v$. In an anharmonic (Morse-like) well the vibrating molecule spends more time at large $r$ as $v$ rises, so $B_v = B_e - \\alpha_e(v + \\tfrac12)$ with $\\alpha_e > 0$.',
      trap: 'The reduced mass is fixed by the nuclei and never changes with vibration.' },
    { id: 'rots-036', type: 'nat', level: 4, exams: ['gate', 'net'], sub: 'bond length',
      q: 'For $^{23}$Na$^{35}$Cl in the gas phase, $B = 0.2181$ cm$^{-1}$ and $\\mu = 13.871$ u. Using $I\\,(\\text{u Å}^2) = 16.858/B$, the bond length is ______ pm (to the nearest pm).',
      answer: 236, tol: 1, unit: 'pm', calc: () => Math.sqrt(16.858 / 0.2181 / 13.871) * 100,
      sol: '$I = 16.858/0.2181 = 77.29$ u Å$^2$. $r = \\sqrt{77.29/13.871} = \\sqrt{5.572} = 2.361$ Å $= 236$ pm. The ionic bond is long and the lines are only 0.44 cm$^{-1}$ apart (13 GHz).',
      trap: 'A small $B$ means a large $I$; check the order of magnitude against typical bonds (100 to 300 pm).' },

    // ---------- level 5 ----------
    { id: 'rots-037', type: 'nat', level: 5, exams: ['gate', 'net'], sub: 'centrifugal distortion',
      q: 'Lines of a diatomic molecule follow $\\tilde\\nu = 2B(J+1) - 4D(J+1)^3$. The $J = 0\\to1$ line is at 41.112 cm$^{-1}$ and the $J = 9\\to10$ line at 402.80 cm$^{-1}$. The distortion constant $D$ is ______ $\\times10^{-3}$ cm$^{-1}$ (to two decimal places).',
      answer: 2.10, tol: 0.02, calc: () => (10 * 41.112 - 402.80) / 3960 * 1e3,
      sol: '$\\tilde\\nu_1 = 2B - 4D$, $\\tilde\\nu_{10} = 20B - 4000D$. Then $10\\tilde\\nu_1 - \\tilde\\nu_{10} = -40D + 4000D = 3960D$. $D = (411.12 - 402.80)/3960 = 8.32/3960 = 2.10\\times10^{-3}$ cm$^{-1}$, and $B = (41.112 + 4D)/2 = 20.56$ cm$^{-1}$ (this is HF).',
      trap: 'Eliminate $B$ first; trying to fit both numbers by eye loses the small $D$.' },
    { id: 'rots-038', type: 'msq', level: 5, exams: ['gate', 'net'], sub: 'nuclear spin statistics',
      q: 'Which statements about homonuclear diatomic molecules are correct?',
      options: ['In $^{16}$O$_2$ (spin-0 nuclei) only odd-$J$ rotational levels of the ground electronic state exist', 'In $^{14}$N$_2$ (spin-1 nuclei) even-$J$ and odd-$J$ levels have statistical weights in the ratio 2 : 1', 'H$_2$ has no pure rotational electric dipole absorption spectrum', '$^{12}$C$^{16}$O$_2$ has a strong pure rotational microwave spectrum'], answer: [0, 1, 2],
      sol: 'Spin-0 bosons: the total wavefunction must be symmetric under exchange; for the $^3\\Sigma_g^-$ ground state of O$_2$ this allows only odd $N$. For spin-1 nuclei, 6 symmetric and 3 antisymmetric spin states give even : odd $= 6 : 3 = 2 : 1$. H$_2$ and CO$_2$ have no permanent dipole, so no microwave spectrum (both show rotational Raman spectra).',
      trap: 'Missing levels and intensity alternation are the fingerprints of nuclear spin statistics.' },
    { id: 'rots-039', type: 'nat', level: 5, exams: ['gate', 'net'], sub: 'populations',
      q: 'For CO ($B = 1.9313$ cm$^{-1}$) at 300 K ($kT/hc = 208.5$ cm$^{-1}$), the most populated rotational level has $J = $ ______.',
      answer: 7, tol: 0,
      sol: '$J_{max} = \\sqrt{208.5/3.8626} - 0.5 = \\sqrt{53.98} - 0.5 = 6.85$. Check: $(2J+1)e^{-BJ(J+1)/208.5}$ is 8.81 ($J = 6$), 8.93 ($J = 7$), 8.73 ($J = 8$). So $J = 7$, and the strongest absorption line is $7\\to8$ at $16B = 30.9$ cm$^{-1}$.',
      trap: 'Compare neighbouring integers; the continuous formula only tells you where to look.' },
    { id: 'rots-040', type: 'mcq', level: 5, exams: ['gate', 'net'], sub: 'rotational constant',
      q: 'Among HF, HCl, HBr and HI (bond lengths 92, 127, 141 and 161 pm), which has the widest spacing between rotational lines?',
      options: ['HI', 'HBr', 'HF', 'HCl'], answer: 2,
      sol: 'In all four the reduced mass is close to the H mass (0.957, 0.980, 0.995, 1.000 u), so $B \\propto 1/(\\mu r^2)$ is set mainly by $r$. HF has the shortest bond and smallest $\\mu$: $B = 20.6$ cm$^{-1}$, versus 10.6, 8.5 and 6.4 cm$^{-1}$.',
      trap: 'The heavy halogen hardly matters for $\\mu$; the bond length decides.' },
  ],

  gens: [
    { id: 'rots-g01', type: 'nat', level: 2, exams: ['gate', 'net'], sub: 'line positions',
      make(r) {
        const B = pick(r, 0.2, 20, 0.01), J = int(r, 0, 12), unit = choose(r, ['cm', 'GHz']);
        const v = 2 * B * (J + 1), ans = unit === 'cm' ? v : v * GHZ;
        return { q: `A rigid diatomic rotor has $B = ${B}$ cm$^{-1}$. The absorption line $J = ${J}\\to${J + 1}$ is at ______ ${unit === 'cm' ? 'cm$^{-1}$' : 'GHz'} (to ${unit === 'cm' ? 'two decimal places' : 'one decimal place'}).${unit === 'GHz' ? ' Use 1 cm$^{-1}$ = 29.979 GHz.' : ''}`,
          answer: round(ans, unit === 'cm' ? 2 : 1), tol: unit === 'cm' ? Math.max(0.01, round(ans * 0.002, 2)) : Math.max(0.1, round(ans * 0.002, 1)), unit: unit === 'cm' ? 'cm⁻¹' : 'GHz', B, J, u: unit,
          sol: `$\\tilde\\nu = 2B(J+1) = 2\\times${B}\\times${J + 1} = ${round(v, 3)}$ cm$^{-1}$${unit === 'GHz' ? ` $= ${round(v, 3)}\\times29.979 = ${round(ans, 1)}$ GHz` : ''}.`,
          trap: 'The factor is $J + 1$ (the upper level), and there is a 2.' };
      },
      verify: (p) => 2 * p.B * (p.J + 1) * (p.u === 'cm' ? 1 : GHZ) },
    { id: 'rots-g02', type: 'nat', level: 3, exams: ['gate', 'net'], sub: 'bond length',
      make(r) {
        const [name, m1, m2, rr] = choose(r, MOL);
        const B = round(Bof(m1, m2, rr), 4), m = mu(m1, m2), rp = Math.sqrt(IB / (B * m)) * 100;
        return { q: `For ${name} the rotational constant is $B = ${B}$ cm$^{-1}$. With atomic masses ${round(m1, 3)} u and ${round(m2, 3)} u, and $I\\,(\\text{u Å}^2) = 16.858/B\\,(\\text{cm}^{-1})$, the bond length is ______ pm (to one decimal place).`,
          answer: round(rp, 1), tol: Math.max(0.2, round(rp * 0.003, 1)), unit: 'pm', B, m1: round(m1, 3), m2: round(m2, 3),
          sol: `$\\mu = ${round(m1, 3)}\\times${round(m2, 3)}/(${round(m1, 3)} + ${round(m2, 3)}) = ${round(m, 4)}$ u. $I = 16.858/${B} = ${round(IB / B, 4)}$ u Å$^2$. $r = \\sqrt{I/\\mu} = ${round(rp / 100, 4)}$ Å $= ${round(rp, 1)}$ pm.`,
          trap: 'Use the reduced mass $m_1m_2/(m_1 + m_2)$.' };
      },
      verify: (p) => Math.sqrt(IB / (p.B * mu(p.m1, p.m2))) * 100 },
    { id: 'rots-g03', type: 'nat', level: 3, exams: ['gate', 'net'], sub: 'rotational constant',
      make(r) {
        const [name, m1, m2, rr] = choose(r, MOL);
        const B = Bof(m1, m2, rr), ask = choose(r, ['B', 'line']);
        const ans = ask === 'B' ? B : 2 * B * GHZ;
        return { q: `In ${name} the bond length is ${rr} pm and the atomic masses are ${round(m1, 3)} u and ${round(m2, 3)} u. ${ask === 'B' ? 'The rotational constant $B$ is ______ cm$^{-1}$ (to three significant figures).' : 'The frequency of its $J = 0\\to1$ line is ______ GHz (to three significant figures).'} Use $B\\,(\\text{cm}^{-1}) = 16.858/I\\,(\\text{u Å}^2)$${ask === 'line' ? ' and 1 cm$^{-1}$ = 29.979 GHz' : ''}.`,
          answer: +ans.toPrecision(3), tol: +(ans * 0.006).toPrecision(2), unit: ask === 'B' ? 'cm⁻¹' : 'GHz', m1, m2, rr, ask,
          sol: `$\\mu = ${round(mu(m1, m2), 4)}$ u; $I = \\mu r^2 = ${round(mu(m1, m2), 4)}\\times(${rr / 100})^2 = ${round(mu(m1, m2) * (rr / 100) ** 2, 4)}$ u Å$^2$. $B = 16.858/I = ${round(B, 4)}$ cm$^{-1}$.${ask === 'line' ? ` The first line is at $2B = ${round(2 * B, 4)}$ cm$^{-1}$ $= ${round(2 * B * GHZ, 2)}$ GHz.` : ''}`,
          trap: 'Convert pm to Å (divide by 100) before squaring.' };
      },
      verify: (p) => { const B = Bof(p.m1, p.m2, p.rr); return p.ask === 'B' ? B : 2 * B * GHZ; } },
    { id: 'rots-g04', type: 'nat', level: 3, exams: ['gate', 'net'], sub: 'populations',
      make(r) {
        const [name, B] = choose(r, [['HCl', 10.59], ['HF', 20.56], ['HBr', 8.46], ['CO', 1.9313], ['NO', 1.70], ['NaCl', 0.2181], ['HI', 6.43], ['CN', 1.90], ['OH', 18.9]]);
        const T = choose(r, [50, 77, 100, 150, 200, 300, 500, 1000, 2000]);
        const J = jbest(B, T);
        return { q: `For ${name} ($B = ${B}$ cm$^{-1}$) at $T = ${T}$ K, the most populated rotational level has $J = $ ______. Use $hc/k = 1.4388$ cm K.`,
          answer: J, tol: 0, B, T,
          sol: `$kT/hc = ${T}/1.4388 = ${round(T / C2, 1)}$ cm$^{-1}$. $J_{max} = \\sqrt{kT/2hcB} - \\tfrac12 = ${round(jmax(B, T), 2)}$. Comparing $(2J+1)e^{-BJ(J+1)hc/kT}$ for the neighbouring integers gives $J = ${J}$.`,
          trap: 'Check the integers on both sides of the continuous estimate.' };
      },
      verify: (p) => jbest(p.B, p.T) },
    { id: 'rots-g05', type: 'nat', level: 3, exams: ['gate', 'net'], sub: 'populations',
      make(r) {
        const B = pick(r, 0.5, 20, 0.1), T = choose(r, [100, 200, 300, 500, 1000]), J = int(r, 1, 8), J0 = choose(r, [0, 0, 1]);
        const ratio = ((2 * J + 1) / (2 * J0 + 1)) * Math.exp(-C2 * B * (J * (J + 1) - J0 * (J0 + 1)) / T);
        return { q: `For a diatomic molecule with $B = ${B}$ cm$^{-1}$ at $T = ${T}$ K, the population ratio $N_{J=${J}}/N_{J=${J0}}$ is ______ (to three significant figures). Use $hc/k = 1.4388$ cm K.`,
          answer: +ratio.toPrecision(3), tol: +(ratio * 0.01).toPrecision(2), B, T, J, J0,
          sol: `$\\dfrac{N_J}{N_{J'}} = \\dfrac{2J+1}{2J'+1}\\exp\\left[-\\dfrac{hcB[J(J+1) - J'(J'+1)]}{kT}\\right] = \\dfrac{${2 * J + 1}}{${2 * J0 + 1}}\\exp\\left[-\\dfrac{1.4388\\times${B}\\times${J * (J + 1) - J0 * (J0 + 1)}}{${T}}\\right] = ${+ratio.toPrecision(4)}$.`,
          trap: 'Both the degeneracy ratio and the Boltzmann factor are needed.' };
      },
      verify: (p) => ((2 * p.J + 1) / (2 * p.J0 + 1)) * Math.exp(-C2 * p.B * (p.J * (p.J + 1) - p.J0 * (p.J0 + 1)) / p.T) },
    { id: 'rots-g06', type: 'nat', level: 3, exams: ['gate', 'net'], sub: 'isotope effect',
      make(r) {
        const [a, b, m1, m2, m1b, m2b] = choose(r, [['$^1$H$^{35}$Cl', '$^2$H$^{35}$Cl', M.H, M.Cl35, M.D, M.Cl35], ['$^{12}$C$^{16}$O', '$^{13}$C$^{16}$O', M.C12, M.O16, M.C13, M.O16], ['$^{12}$C$^{16}$O', '$^{12}$C$^{18}$O', M.C12, M.O16, M.C12, M.O18], ['$^1$H$^{35}$Cl', '$^1$H$^{37}$Cl', M.H, M.Cl35, M.H, M.Cl37], ['$^1$H$^{19}$F', '$^2$H$^{19}$F', M.H, M.F, M.D, M.F]]);
        const B = pick(r, 1, 21, 0.01), mode = choose(r, ['B', 'spacing']);
        const Bn = B * mu(m1, m2) / mu(m1b, m2b), ans = mode === 'B' ? Bn : 2 * Bn;
        return { q: `For ${a}, $B = ${B}$ cm$^{-1}$ (a hypothetical value for practice). Assuming the same bond length, ${mode === 'B' ? `$B$ for ${b} is ______ cm$^{-1}$` : `the spacing between adjacent rotational lines of ${b} is ______ cm$^{-1}$`} (to three decimal places). Atomic masses: ${round(m1, 3)}, ${round(m2, 3)}, ${round(m1b, 3)}, ${round(m2b, 3)} u.`,
          answer: round(ans, 3), tol: Math.max(0.002, round(ans * 0.002, 3)), unit: 'cm⁻¹', B, mode, r: mu(m1, m2) / mu(m1b, m2b),
          sol: `$\\mu = ${round(mu(m1, m2), 5)}$ u and $\\mu' = ${round(mu(m1b, m2b), 5)}$ u. $B' = B\\mu/\\mu' = ${B}\\times${round(mu(m1, m2) / mu(m1b, m2b), 5)} = ${round(Bn, 4)}$ cm$^{-1}$${mode === 'spacing' ? `; spacing $2B' = ${round(2 * Bn, 3)}$ cm$^{-1}$` : ''}.`,
          trap: 'Rotational constants scale as $1/\\mu$ (vibrational frequencies as $1/\\sqrt\\mu$).' };
      },
      verify: (p) => p.B * p.r * (p.mode === 'B' ? 1 : 2) },
    { id: 'rots-g07', type: 'nat', level: 4, exams: ['gate', 'net'], sub: 'centrifugal distortion',
      make(r) {
        const B = pick(r, 1, 20, 0.01), w = pick(r, 500, 4000, 10), J = int(r, 5, 20);
        const D = 4 * B ** 3 / w ** 2, mode = choose(r, ['D', 'line']);
        const ans = mode === 'D' ? D * 1e4 : 2 * B * (J + 1) - 4 * D * (J + 1) ** 3;
        return { q: mode === 'D'
          ? `A diatomic molecule has $B = ${B}$ cm$^{-1}$ and vibrational wavenumber $\\tilde\\omega = ${w}$ cm$^{-1}$. Its centrifugal distortion constant $D = 4B^3/\\tilde\\omega^2$ is ______ $\\times10^{-4}$ cm$^{-1}$ (to three significant figures).`
          : `A diatomic molecule has $B = ${B}$ cm$^{-1}$ and $\\tilde\\omega = ${w}$ cm$^{-1}$, so $D = 4B^3/\\tilde\\omega^2$. Including distortion, the $J = ${J}\\to${J + 1}$ line is at ______ cm$^{-1}$ (to two decimal places).`,
          answer: mode === 'D' ? +ans.toPrecision(3) : round(ans, 2), tol: mode === 'D' ? +(ans * 0.01).toPrecision(2) : Math.max(0.01, round(Math.abs(ans) * 0.0005, 2)), unit: mode === 'D' ? undefined : 'cm⁻¹', B, w, J, mode,
          sol: `$D = 4\\times${B}^3/${w}^2 = ${(D).toExponential(3).replace(/e([+-]\d+)/, '\\times10^{$1}')}$ cm$^{-1}$.${mode === 'line' ? ` Line: $2B(J+1) - 4D(J+1)^3 = ${round(2 * B * (J + 1), 3)} - ${round(4 * D * (J + 1) ** 3, 3)} = ${round(ans, 2)}$ cm$^{-1}$.` : ''}`,
          trap: 'The distortion lowers every line, more at high $J$.' };
      },
      verify: (p) => { const D = 4 * p.B ** 3 / p.w ** 2; return p.mode === 'D' ? D * 1e4 : 2 * p.B * (p.J + 1) - 4 * D * (p.J + 1) ** 3; } },
    { id: 'rots-g08', type: 'msq', level: 2, exams: ['gate', 'net'], sub: 'microwave activity',
      make(r) {
        const pool = [['HCl', 1], ['CO', 1], ['NO', 1], ['OCS', 1], ['H$_2$O', 1], ['NH$_3$', 1], ['SO$_2$', 1], ['CH$_3$Cl', 1], ['HCN', 1], ['O$_3$', 1], ['N$_2$', 0], ['O$_2$', 0], ['H$_2$', 0], ['CO$_2$', 0], ['CH$_4$', 0], ['SF$_6$', 0], ['C$_2$H$_2$ (acetylene)', 0], ['Cl$_2$', 0], ['CCl$_4$', 0], ['C$_6$H$_6$', 0]];
        const yes = pool.filter((x) => x[1]), no = pool.filter((x) => !x[1]);
        const k = int(r, 1, 3), ch = shuffle(r, [...shuffle(r, yes).slice(0, k), ...shuffle(r, no).slice(0, 4 - k)]);
        return { q: 'Which of these molecules show a pure rotational (microwave) absorption spectrum?',
          options: ch.map((x) => x[0]), answer: ch.map((x, i) => (x[1] ? i : -1)).filter((i) => i >= 0),
          sol: 'A pure rotational spectrum needs a permanent electric dipole moment. ' + ch.map((x) => `${x[0]}: ${x[1] ? 'polar, active' : 'no permanent dipole (symmetric), inactive'}.`).join(' '),
          trap: 'Symmetric molecules with polar bonds (CO$_2$, CH$_4$, SF$_6$, CCl$_4$) have no net dipole.' };
      } },
    { id: 'rots-g09', type: 'nat', level: 3, exams: ['gate', 'net'], sub: 'line assignment',
      make(r) {
        const B = pick(r, 0.5, 15, 0.01), J = int(r, 0, 10), mode = choose(r, ['J', 'B']);
        const v1 = round(2 * B * (J + 1), 2), v2 = round(2 * B * (J + 2), 2);
        return { q: `Two adjacent lines of the pure rotational spectrum of a rigid diatomic molecule are at ${v1} and ${v2} cm$^{-1}$. ${mode === 'J' ? `The line at ${v2} cm$^{-1}$ starts from the level $J = $ ______.` : 'The rotational constant $B$ is ______ cm$^{-1}$ (to two decimal places).'}`,
          answer: mode === 'J' ? J + 1 : round((v2 - v1) / 2, 2), tol: mode === 'J' ? 0 : 0.01, unit: mode === 'J' ? undefined : 'cm⁻¹', v1, v2, mode,
          sol: `The spacing is $2B = ${round(v2 - v1, 2)}$ cm$^{-1}$, so $B = ${round((v2 - v1) / 2, 3)}$ cm$^{-1}$. ${mode === 'J' ? `Then $${v2} = 2B(J+1)$ gives $J + 1 = ${round(v2 / (v2 - v1), 2)}$, so $J = ${J + 1}$.` : ''}`,
          trap: 'The line $J\\to J+1$ is at $2B(J+1)$, so divide by the spacing to get $J + 1$.' };
      },
      verify: (p) => (p.mode === 'J' ? Math.round(p.v2 / (p.v2 - p.v1)) - 1 : (p.v2 - p.v1) / 2) },
    { id: 'rots-g10', type: 'nat', level: 3, exams: ['gate', 'net'], sub: 'partition function',
      make(r) {
        const [name, B, s] = choose(r, [['H$_2$', 60.85, 2], ['N$_2$', 1.998, 2], ['O$_2$', 1.4377, 2], ['Cl$_2$', 0.2440, 2], ['HCl', 10.59, 1], ['CO', 1.9313, 1], ['HF', 20.56, 1], ['NO', 1.70, 1], ['I$_2$', 0.0374, 2]]);
        const mode = choose(r, ['theta', 'q']), T = choose(r, [300, 500, 1000]);
        const ans = mode === 'theta' ? C2 * B : T / (s * C2 * B);
        return { q: mode === 'theta'
          ? `For ${name} ($B = ${B}$ cm$^{-1}$) the rotational temperature $\\theta_{rot} = hcB/k$ is ______ K (to three significant figures). Use $hc/k = 1.4388$ cm K.`
          : `Using the high-temperature result $q_{rot} = kT/(\\sigma hcB)$, the rotational partition function of ${name} ($B = ${B}$ cm$^{-1}$) at ${T} K is ______ (to three significant figures). Use $hc/k = 1.4388$ cm K.`,
          answer: +ans.toPrecision(3), tol: +(ans * 0.006).toPrecision(2), unit: mode === 'theta' ? 'K' : undefined, B, s, T, mode,
          sol: mode === 'theta' ? `$\\theta_{rot} = 1.4388\\times${B} = ${+ans.toPrecision(4)}$ K.` : `${s === 2 ? 'Homonuclear, so $\\sigma = 2$' : 'Heteronuclear, so $\\sigma = 1$'}. $q = ${T}/(${s}\\times1.4388\\times${B}) = ${+ans.toPrecision(4)}$.`,
          trap: mode === 'theta' ? 'Multiply $B$ (cm$^{-1}$) by $hc/k$ (cm K).' : 'Homonuclear molecules need the symmetry number 2.' };
      },
      verify: (p) => (p.mode === 'theta' ? C2 * p.B : p.T / (p.s * C2 * p.B)) },
    { id: 'rots-g11', type: 'nat', level: 2, exams: ['gate', 'net'], sub: 'rigid rotor',
      make(r) {
        const B = pick(r, 0.5, 20, 0.01), J1 = int(r, 0, 5), J2 = J1 + int(r, 1, 4), unit = choose(r, ['cm', 'meV']);
        const d = B * (J2 * (J2 + 1) - J1 * (J1 + 1)), ans = unit === 'cm' ? d : d * MEV;
        return { q: `A rigid diatomic rotor has $B = ${B}$ cm$^{-1}$. The energy of level $J = ${J2}$ above level $J = ${J1}$ is ______ ${unit === 'cm' ? 'cm$^{-1}$' : 'meV (use 1 cm$^{-1}$ = 0.12398 meV)'} (to three significant figures).`,
          answer: +ans.toPrecision(3), tol: +(ans * 0.005).toPrecision(2), unit: unit === 'cm' ? 'cm⁻¹' : 'meV', B, J1, J2, u: unit,
          sol: `$F(J) = BJ(J+1)$: $F(${J2}) - F(${J1}) = ${B}\\times(${J2 * (J2 + 1)} - ${J1 * (J1 + 1)}) = ${round(d, 3)}$ cm$^{-1}$${unit === 'meV' ? ` $= ${+ans.toPrecision(4)}$ meV` : ''}. ${J2 - J1 > 1 ? 'No single photon connects these levels ($\\Delta J = \\pm1$ only), but the energy difference is still well defined.' : ''}`,
          trap: 'Use $J(J+1)$, not $J^2$.' };
      },
      verify: (p) => p.B * (p.J2 * (p.J2 + 1) - p.J1 * (p.J1 + 1)) * (p.u === 'cm' ? 1 : MEV) },
    { id: 'rots-g12', type: 'mcq', level: 3, exams: ['gate', 'net'], sub: 'symmetric tops',
      make(r) {
        const type = choose(r, ['prolate', 'oblate']);
        const B = pick(r, 0.2, 10, 0.05), A = type === 'prolate' ? round(B * pick(r, 1.5, 6, 0.5), 2) : round(B * pick(r, 0.3, 0.8, 0.1), 2);
        const J = int(r, 1, 6), K = int(r, 1, J);
        const E = B * J * (J + 1) + (A - B) * K * K;
        const show = (v) => `${round(v, 2)} cm$^{-1}$`;
        const o = mcqOptions(r, E, [B * J * (J + 1) + A * K * K, B * J * (J + 1) - (A - B) * K * K, B * J * (J + 1), A * J * (J + 1) + (B - A) * K * K, B * J * J + (A - B) * K * K], show);
        return { q: `A${type === 'oblate' ? 'n' : ''} ${type} symmetric-top molecule has rotational constants $A = ${A}$ cm$^{-1}$ (about the symmetry axis) and $B = ${B}$ cm$^{-1}$. Its rigid-rotor level energy $F(J, K) = BJ(J+1) + (A - B)K^2$ for $J = ${J}$, $K = ${K}$ is`,
          options: o.options, answer: o.answer,
          sol: `$BJ(J+1) = ${B}\\times${J * (J + 1)} = ${round(B * J * (J + 1), 3)}$; $(A - B)K^2 = (${round(A - B, 3)})\\times${K * K} = ${round((A - B) * K * K, 3)}$. Sum: ${show(E)}. ${type === 'oblate' ? 'For an oblate top $A < B$ (often written $C$), so the $K$ term lowers the energy.' : 'For a prolate top $A > B$, so the $K$ term raises the energy.'}`,
          trap: 'The $K$ term carries $A - B$, not $A$.' };
      } },
  ],
};
