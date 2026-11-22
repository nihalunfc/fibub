// Hydrogen spectra and fine structure: the hydrogen degeneracy, relativistic, spin-orbit and Darwin terms, the
// Dirac formula E(n, j), the Lamb shift, alkali doublets, hyperfine splitting and the fine structure of lines.
// Original questions for GATE and CSIR NET practice (fibub). Levels: 1 warm-up ... 5 top rank.
import { pick, int, choose, mcqOptions, round, shuffle } from '../_util.js';
import more from './fine-structure.more.gen.js';
import more2 from './fine-structure.more2.gen.js';
import r4 from './fine-structure.r4.gen.js';
import r5 from './fine-structure.r5.gen.js';

const AL2 = 5.32514e-5;          // alpha^2, alpha = 1/137.036
const RY = 13.6057;              // eV
const RA2 = RY * AL2;            // 7.2452e-4 eV
const RA2CM = 109737.3 * AL2;    // 5.8437 cm^-1
const H_EV = 4.135668e-15;       // eV s
const LT = ['S', 'P', 'D', 'F', 'G', 'H'];
const fr = (x) => (Number.isInteger(x) ? String(x) : `${Math.round(2 * x)}/2`);
const term = (n, l, j) => `${n}\\,^2${LT[l]}_{${fr(j)}}`;
/** Fine-structure shift (eV) of the hydrogen-like level (n, j): -(Ry alpha^2 Z^4/n^4)(n/(j+1/2) - 3/4). */
const efs = (Z, n, j) => -(RA2 * Z ** 4 / n ** 4) * (n / (j + 0.5) - 0.75);
/** All one-electron states (n, l, j) of shell n. */
const states = (n) => { const s = []; for (let l = 0; l < n; l++) for (const j of [l - 0.5, l + 0.5]) if (j > 0) s.push([n, l, j]); return s; };
const e1 = (a, b) => Math.abs(a[1] - b[1]) === 1 && Math.abs(a[2] - b[2]) <= 1;

export default {
  topic: 'fine-structure',
  items: [
    // ---------- level 1 ----------
    { id: 'hfs-001', type: 'mcq', level: 1, exams: ['gate', 'net'], sub: 'degeneracy',
      q: 'In the non-relativistic hydrogen atom, ignoring electron spin, the number of states with principal quantum number $n$ is',
      options: ['$n$', '$n^2$', '$2n^2$', '$2n + 1$'], answer: 1,
      sol: 'For each $l = 0, 1, \\dots, n-1$ there are $2l + 1$ values of $m_l$. $\\sum_{l=0}^{n-1}(2l+1) = n^2$. Counting the two spin states doubles it to $2n^2$, but the question leaves spin out.',
      trap: '$2n^2$ is the count with spin; read whether spin is included.' },
    { id: 'hfs-002', type: 'mcq', level: 1, exams: ['gate', 'net'], sub: 'fine-structure constant',
      q: 'The fine-structure constant $\\alpha = e^2/(4\\pi\\varepsilon_0\\hbar c)$ is closest to',
      options: ['$1/1836$', '$1/861$', '$1/137$', '$137$'], answer: 2,
      sol: '$\\alpha = 7.297\\times10^{-3} \\approx 1/137.04$. It is dimensionless; it is also the speed of the electron in the Bohr ground state in units of $c$. Fine-structure energies are smaller than the Bohr energies by about $\\alpha^2 \\approx 5\\times10^{-5}$.',
      trap: '$1/1836$ is $m_e/m_p$, which sets the size of hyperfine effects, not fine structure.' },
    { id: 'hfs-003', type: 'mcq', level: 1, exams: ['gate', 'net'], sub: 'good quantum numbers',
      q: 'Once spin-orbit coupling $\\xi(r)\\,\\vec L\\cdot\\vec S$ is included for a one-electron atom, the stationary states are labelled by',
      options: ['$n, l, m_l, m_s$', '$n, m_l, m_s$', '$n, j, m_l$', '$n, l, j, m_j$'], answer: 3,
      sol: '$\\vec L\\cdot\\vec S = \\tfrac12(J^2 - L^2 - S^2)$ commutes with $J^2$, $J_z$, $L^2$ and $S^2$, but not with $L_z$ or $S_z$ separately. So $m_l$ and $m_s$ stop being good quantum numbers; $j$ and $m_j$ replace them.',
      trap: 'The uncoupled labels $m_l, m_s$ are good only when an external field dominates (Paschen-Back).' },
    { id: 'hfs-004', type: 'nat', level: 1, exams: ['gate', 'net'], sub: 'fine-structure levels',
      q: 'In Dirac\'s theory the energy of a hydrogen level depends only on $n$ and $j$. The number of distinct energies into which the $n = 4$ level splits is ______.',
      answer: 4, tol: 0,
      sol: 'With $l = 0, \\dots, 3$ and $j = l \\pm \\tfrac12$, the values of $j$ are $\\tfrac12, \\tfrac32, \\tfrac52, \\tfrac72$: four distinct values, so four levels. In general level $n$ splits into $n$ fine-structure levels.',
      trap: 'Counting $(l, j)$ pairs gives 7, but pairs with the same $j$ (like $4s_{1/2}$ and $4p_{1/2}$) share an energy.' },
    { id: 'hfs-005', type: 'mcq', level: 1, exams: ['gate', 'net'], sub: 'term symbols',
      q: 'A single electron in a $3d$ orbital with total angular momentum $j = 5/2$ is written as',
      options: ['$3\\,^2D_{5/2}$', '$3\\,^2P_{5/2}$', '$3\\,^1D_{5/2}$', '$3\\,^2D_{3/2}$'], answer: 0,
      sol: 'The term symbol is $n\\,^{2S+1}L_J$. One electron has $S = 1/2$ so $2S + 1 = 2$ (a doublet); $d$ means $L = 2$ (letter D); $J = 5/2$.',
      trap: 'The superscript is $2S+1$, not $2L+1$; a single electron is always a doublet.' },
    { id: 'hfs-006', type: 'msq', level: 1, exams: ['gate', 'net'], sub: 'contributions',
      q: 'Which of the following are part of the fine structure of hydrogen (order $\\alpha^2$ times the Bohr energy)?',
      options: ['The relativistic correction to the kinetic energy', 'Spin-orbit coupling', 'The Darwin term', 'The interaction with the proton\'s magnetic moment'], answer: [0, 1, 2],
      sol: 'The three order-$\\alpha^2$ corrections that come out of the Dirac equation are the relativistic kinetic term $-p^4/8m^3c^2$, spin-orbit coupling and the Darwin term (only for $s$ states). The coupling to the proton\'s moment is hyperfine structure, smaller again by about $m_e/m_p$.',
      trap: 'Hyperfine structure is a separate, much finer splitting (e.g. the 21 cm line).' },

    // ---------- level 2 ----------
    { id: 'hfs-007', type: 'nat', level: 2, exams: ['gate', 'net'], sub: 'dirac formula',
      q: 'The fine-structure energy of hydrogen is $E_{nj} = -\\dfrac{R_\\infty hc}{n^2}\\left[1 + \\dfrac{\\alpha^2}{n^2}\\left(\\dfrac{n}{j + 1/2} - \\dfrac34\\right)\\right]$. With $R_\\infty\\alpha^2 = 5.84$ cm$^{-1}$, the separation between $2p_{3/2}$ and $2p_{1/2}$ is ______ cm$^{-1}$ (to three decimal places).',
      answer: 0.365, tol: 0.003, unit: 'cm⁻¹', calc: () => 5.84 / 16,
      sol: 'Only the $j$-dependent part differs: $\\Delta\\tilde\\nu = \\dfrac{R_\\infty\\alpha^2}{n^3}\\left(\\dfrac{1}{1} - \\dfrac{1}{2}\\right)$ for $j = 1/2$ and $3/2$. With $n = 2$: $5.84/8\\times\\tfrac12 = 0.365$ cm$^{-1}$ (about 10.9 GHz, or 45 $\\mu$eV).',
      trap: 'The bracket carries $\\alpha^2/n^2$ and the prefactor another $1/n^2$; overall it is $1/n^3$ after multiplying by $n$.' },
    { id: 'hfs-008', type: 'mcq', level: 2, exams: ['gate', 'net'], sub: 'dirac degeneracy',
      q: 'According to the Dirac equation (no QED corrections), which pair of hydrogen states has exactly the same energy?',
      options: ['$2p_{1/2}$ and $2p_{3/2}$', '$2s_{1/2}$ and $2p_{1/2}$', '$2s_{1/2}$ and $2p_{3/2}$', '$3p_{3/2}$ and $3d_{5/2}$'], answer: 1,
      sol: 'Dirac energies depend on $n$ and $j$ only. $2s_{1/2}$ and $2p_{1/2}$ have the same $n = 2$ and $j = 1/2$. The other pairs differ in $j$.',
      trap: 'Same $l$ does not mean same energy once spin-orbit acts; same $j$ does.' },
    { id: 'hfs-009', type: 'mcq', level: 2, exams: ['gate', 'net'], sub: 'lamb shift',
      q: 'The Lamb shift in hydrogen refers to',
      options: ['the splitting of $2p_{1/2}$ and $2p_{3/2}$ by spin-orbit coupling', 'the shift of hydrogen lines caused by the recoil of the atom', 'the small separation of $2s_{1/2}$ above $2p_{1/2}$, about 1058 MHz, explained by quantum electrodynamics', 'the hyperfine splitting of the ground state'], answer: 2,
      sol: 'Lamb and Retherford (1947) found $2s_{1/2}$ about 1058 MHz ($4.4\\,\\mu$eV) above $2p_{1/2}$, which Dirac theory says are degenerate. It comes from the electron\'s coupling to the quantised field (vacuum fluctuations smear its position, which mostly affects $s$ states that reach the nucleus).',
      trap: 'The spin-orbit splitting of $2p$ is ten times larger (about 10.9 GHz) and is ordinary fine structure.' },
    { id: 'hfs-010', type: 'nat', level: 2, exams: ['gate', 'net'], sub: 'spin-orbit',
      q: 'For a single electron in a $d_{3/2}$ state, the eigenvalue of $\\vec L\\cdot\\vec S$ in units of $\\hbar^2$ is ______.',
      answer: -1.5, tol: 0,
      sol: '$\\vec L\\cdot\\vec S = \\tfrac12[j(j+1) - l(l+1) - s(s+1)]\\hbar^2 = \\tfrac12[\\tfrac{15}{4} - 6 - \\tfrac34]\\hbar^2 = \\tfrac12(-3)\\hbar^2 = -1.5\\,\\hbar^2$.',
      trap: 'Using $j^2$ instead of $j(j+1)$ gives the wrong number; also do not forget the $s(s+1) = 3/4$.' },
    { id: 'hfs-011', type: 'mcq', level: 2, exams: ['gate', 'net'], sub: 'dirac formula',
      q: 'In the Dirac theory of hydrogen, the energy of a bound state depends on',
      options: ['$n$ only', '$n$ and $l$ only', '$n$, $l$ and $j$', '$n$ and $j$ only'], answer: 3,
      sol: 'The relativistic and spin-orbit terms each depend on $l$, but in the sum (plus the Darwin term for $l = 0$) the $l$-dependence cancels, leaving $E_{nj}$. This is why $2s_{1/2}$ and $2p_{1/2}$ coincide until QED is added.',
      trap: 'Each correction separately depends on $l$; only their total does not.' },
    { id: 'hfs-012', type: 'nat', level: 2, exams: ['gate', 'net'], sub: 'alkali doublets',
      q: 'The sodium D lines have wavelengths 589.00 nm and 589.59 nm. The spin-orbit splitting of the $3p$ level is ______ cm$^{-1}$ (to one decimal place).',
      answer: 17.0, tol: 0.2, unit: 'cm⁻¹', calc: () => 1e7 / 589.00 - 1e7 / 589.59,
      sol: 'Both lines end on $3s_{1/2}$, so their difference in wavenumber is the $3p_{3/2}$-$3p_{1/2}$ splitting: $10^7/589.00 - 10^7/589.59 = 16977.9 - 16960.9 = 17.0$ cm$^{-1}$ (2.1 meV).',
      trap: 'Converting $\\Delta\\lambda = 0.59$ nm by $1/\\Delta\\lambda$ is wrong; use $\\Delta\\tilde\\nu \\approx \\Delta\\lambda/\\lambda^2$ or subtract wavenumbers.' },
    { id: 'hfs-013', type: 'mcq', level: 2, exams: ['gate', 'net'], sub: 'line intensities',
      q: 'In a hot sodium flame where the $3p$ states are populated in proportion to their degeneracy, the intensity ratio of $D_2$ ($3p_{3/2}\\to3s_{1/2}$) to $D_1$ ($3p_{1/2}\\to3s_{1/2}$) is about',
      options: ['$1:1$', '$1:2$', '$3:2$', '$2:1$'], answer: 3,
      sol: 'The upper levels have $2j + 1 = 4$ and $2$ states, and each state of a $p\\to s$ doublet decays at the same rate. So the line strengths are in the ratio $4:2 = 2:1$.',
      trap: 'The ratio comes from $2j+1$ of the upper levels, not from $j$ itself ($3/2 : 1/2$ would give $3:1$).' },
    { id: 'hfs-014', type: 'msq', level: 2, exams: ['gate', 'net'], sub: 'selection rules',
      q: 'For electric dipole transitions of a one-electron atom with spin-orbit coupling, which statements are correct?',
      options: ['$\\Delta l = \\pm1$', '$\\Delta j = 0, \\pm1$, so $2p_{1/2}\\to1s_{1/2}$ is allowed', '$\\Delta n = \\pm1$ only', 'Parity must stay the same'], answer: [0, 1],
      sol: 'The dipole operator is a vector with odd parity: $\\Delta l = \\pm1$ (parity changes), $\\Delta j = 0, \\pm1$ with $0\\not\\to0$ (never an issue for one electron, whose $j$ is half-integer). There is no rule on $\\Delta n$.',
      trap: '$\\Delta j = 0$ is allowed; it is $\\Delta l = 0$ that is forbidden.' },
    { id: 'hfs-015', type: 'mcq', level: 2, exams: ['gate', 'net'], sub: 'scaling',
      q: 'The ratio of the fine-structure splittings in hydrogen to the gross (Bohr) level spacings is of order',
      options: ['$\\alpha \\approx 7\\times10^{-3}$', '$\\alpha^2 \\approx 5\\times10^{-5}$', '$\\alpha^3 \\approx 4\\times10^{-7}$', '$m_e/m_p \\approx 5\\times10^{-4}$'], answer: 1,
      sol: 'The electron speed is $v \\sim \\alpha c$, so relativistic corrections go as $(v/c)^2 \\sim \\alpha^2$ times the Bohr energy. Spin-orbit is of the same order. The Lamb shift is order $\\alpha^3$ (times logs) and hyperfine order $\\alpha^2 m_e/m_p$.',
      trap: '$\\alpha$ alone is $v/c$, not an energy ratio.' },
    { id: 'hfs-016', type: 'msq', level: 2, exams: ['gate', 'net'], sub: 'darwin term',
      q: 'Which statements about the Darwin term in hydrogen are correct?',
      options: ['It is non-zero only for $s$ states', 'It arises because the electron\'s position is smeared over about a Compton wavelength', 'It is proportional to $|\\psi(0)|^2$', 'It splits $2p_{1/2}$ from $2p_{3/2}$'], answer: [0, 1, 2],
      sol: 'The Darwin term is $\\dfrac{\\pi\\hbar^2}{2m^2c^2}\\dfrac{Ze^2}{4\\pi\\varepsilon_0}|\\psi(0)|^2$: the electron jitters over $\\sim\\hbar/mc$ and samples the Coulomb potential near the nucleus. Only $s$ states have $\\psi(0) \\ne 0$. The $2p$ splitting is spin-orbit, not Darwin.',
      trap: 'The Darwin term shifts levels but never splits a $p$ level.' },

    // ---------- level 3 ----------
    { id: 'hfs-017', type: 'nat', level: 3, exams: ['gate', 'net'], sub: 'darwin term',
      q: 'For hydrogen-like states with $l = 0$, the Darwin term is $E_D = R_\\infty hc\\,\\alpha^2 Z^4/n^3$. With $R_\\infty hc\\,\\alpha^2 = 7.245\\times10^{-4}$ eV, the Darwin shift of the hydrogen $2s$ level is ______ $\\mu$eV (to one decimal place).',
      answer: 90.6, tol: 0.5, unit: 'μeV', calc: () => 724.5 / 8,
      sol: '$E_D = 7.245\\times10^{-4}/2^3$ eV $= 9.06\\times10^{-5}$ eV $= 90.6\\,\\mu$eV, upwards (the Darwin term is positive).',
      trap: 'The Darwin term goes as $1/n^3$ (from $|\\psi_{n00}(0)|^2 = Z^3/\\pi a_0^3n^3$), not $1/n^2$.' },
    { id: 'hfs-018', type: 'nat', level: 3, exams: ['gate', 'net'], sub: 'hydrogen-like ions',
      q: 'The $2p_{3/2}$-$2p_{1/2}$ separation in hydrogen is 0.365 cm$^{-1}$. Ignoring reduced-mass and QED effects, the same separation in He$^+$ is ______ cm$^{-1}$ (to two decimal places).',
      answer: 5.84, tol: 0.03, unit: 'cm⁻¹', calc: () => 0.365 * 16,
      sol: 'Fine-structure splittings scale as $Z^4\\alpha^2/n^3$: two powers of $Z$ from the Bohr energy and two more because $v/c = Z\\alpha/n$. For $Z = 2$: $0.365\\times16 = 5.84$ cm$^{-1}$.',
      trap: 'Scaling by $Z^2$ like the Bohr energies gives 1.46; fine structure grows much faster with $Z$.' },
    { id: 'hfs-019', type: 'nat', level: 3, exams: ['gate', 'net'], sub: 'fine structure of lines',
      q: 'Consider the Balmer $H_\\alpha$ line ($n = 3 \\to n = 2$) in the Dirac theory, where levels depend only on $n$ and $j$. Counting only energy differences that are produced by allowed E1 transitions, the number of distinct fine-structure components is ______.',
      answer: 5, tol: 0,
      sol: 'Levels: $n = 3$ has $j = \\tfrac12, \\tfrac32, \\tfrac52$; $n = 2$ has $j = \\tfrac12, \\tfrac32$. The allowed $nlj$ transitions are $3s_{1/2}\\to2p_{1/2}, 2p_{3/2}$; $3p_{1/2}, 3p_{3/2}\\to2s_{1/2}$; $3d_{3/2}\\to2p_{1/2}, 2p_{3/2}$; $3d_{5/2}\\to2p_{3/2}$ (seven in all). In $j$ labels these give $(\\tfrac12\\to\\tfrac12)$, $(\\tfrac12\\to\\tfrac32)$, $(\\tfrac32\\to\\tfrac12)$, $(\\tfrac32\\to\\tfrac32)$, $(\\tfrac52\\to\\tfrac32)$: five distinct energies.',
      trap: 'There are seven transitions, but several coincide in energy when $2s_{1/2}$ and $2p_{1/2}$ are degenerate. $3d_{5/2}\\to2p_{1/2}$ has $\\Delta j = 2$ and is forbidden.' },
    { id: 'hfs-020', type: 'mcq', level: 3, exams: ['gate', 'net'], sub: 'lyman alpha',
      q: 'The Lyman $\\alpha$ line of hydrogen, examined with very high resolution (ignoring hyperfine structure and the Lamb shift), consists of',
      options: ['a single line', 'two lines with intensity ratio 2 : 1, the shorter-wavelength one stronger', 'two lines of equal intensity', 'three lines, from $2s_{1/2}$, $2p_{1/2}$ and $2p_{3/2}$'], answer: 1,
      sol: 'Only $2p\\to1s$ is E1-allowed ($2s\\to1s$ has $\\Delta l = 0$). $2p_{3/2}$ lies 0.365 cm$^{-1}$ above $2p_{1/2}$, so the $2p_{3/2}\\to1s_{1/2}$ line has the shorter wavelength, and with 4 versus 2 upper states it is twice as strong.',
      trap: '$2s_{1/2}\\to1s_{1/2}$ is not an E1 line (it decays mainly by two-photon emission, lifetime about 0.12 s).' },
    { id: 'hfs-021', type: 'nat', level: 3, exams: ['gate', 'net'], sub: 'expectation values',
      q: 'For hydrogen, $\\langle r^{-3}\\rangle_{nl} = \\dfrac{1}{a_0^3 n^3 l(l + \\tfrac12)(l+1)}$. For the $2p$ state, $\\langle r^{-3}\\rangle = 1/(k\\,a_0^3)$. The value of $k$ is ______.',
      answer: 24, tol: 0,
      sol: '$n^3 l(l + \\tfrac12)(l + 1) = 8\\times1\\times\\tfrac32\\times2 = 24$. So $\\langle r^{-3}\\rangle_{2p} = 1/(24a_0^3)$. This expectation value sets the spin-orbit energy.',
      trap: 'For $l = 0$ the formula diverges, which is why spin-orbit is taken as zero for $s$ states and the Darwin term takes over.' },
    { id: 'hfs-022', type: 'mcq', level: 3, exams: ['gate', 'net'], sub: 'spin-orbit',
      q: 'The spin-orbit Hamiltonian derived in the electron\'s rest frame must be multiplied by a factor to give the correct answer in the atom\'s frame. This factor and its origin are',
      options: ['2, from the electron $g$-factor', '1/2, from Thomas precession of the rotating rest frame', '1/2, from the reduced mass of the electron', '$\\alpha$, from the coupling to the radiation field'], answer: 1,
      sol: 'In the electron\'s frame the proton circles it and makes a field $\\vec B$; with $g = 2$ this gives twice the right spin-orbit energy. The electron\'s rest frame is accelerated and rotates (Thomas precession), which removes exactly half. The Dirac equation gives the correct factor automatically.',
      trap: 'The $g = 2$ is already in the naive formula; Thomas precession is what halves it.' },
    { id: 'hfs-023', type: 'nat', level: 3, exams: ['gate', 'net'], sub: 'hyperfine',
      q: 'The hyperfine transition of ground-state hydrogen has frequency 1420.4 MHz. The energy splitting is ______ $\\mu$eV (to two decimal places). Use $h = 4.136\\times10^{-15}$ eV s.',
      answer: 5.87, tol: 0.02, unit: 'μeV', calc: () => 1420.4e6 * 4.136e-15 * 1e6,
      sol: '$\\Delta E = h\\nu = 4.136\\times10^{-15}\\times1.4204\\times10^9 = 5.87\\times10^{-6}$ eV $= 5.87\\,\\mu$eV. The wavelength is $c/\\nu = 21.1$ cm, the famous 21 cm line of radio astronomy.',
      trap: 'MHz is $10^6$ Hz; mixing it with GHz shifts the answer by $10^3$.' },
    { id: 'hfs-024', type: 'msq', level: 3, exams: ['gate', 'net'], sub: 'level ordering',
      q: 'For the $n = 3$ level of hydrogen, including fine structure and the Lamb shift, which statements are correct?',
      options: ['$3d_{5/2}$ is the highest of the $n = 3$ states', '$3s_{1/2}$ lies slightly above $3p_{1/2}$', '$3p_{3/2}$ and $3d_{3/2}$ are degenerate in Dirac theory', '$3s_{1/2}$ is the highest of the $n = 3$ states'], answer: [0, 1, 2],
      sol: 'The fine-structure shift $-(n/(j+\\tfrac12) - \\tfrac34)$ is least negative for the largest $j$, so $j = 5/2$ is highest. States with the same $j$ ($3s_{1/2}, 3p_{1/2}$; $3p_{3/2}, 3d_{3/2}$) coincide in Dirac theory; the Lamb shift then pushes $3s_{1/2}$ up a little (by about 315 MHz), far less than the gap to $j = 3/2$.',
      trap: 'The Lamb shift is tiny; it never lifts an $s$ state above levels of larger $j$.' },
    { id: 'hfs-025', type: 'nat', level: 3, exams: ['gate', 'net'], sub: 'fine-structure shifts',
      q: 'Using $E^{(1)}_{nj} = -\\dfrac{R_\\infty hc\\,\\alpha^2}{n^4}\\left(\\dfrac{n}{j+1/2} - \\dfrac34\\right)$ with $R_\\infty hc\\,\\alpha^2 = 7.245\\times10^{-4}$ eV, the fine-structure shift of the hydrogen ground state is ______ $\\mu$eV (to one decimal place, with sign).',
      answer: -181.1, tol: 0.5, unit: 'μeV', calc: () => -724.5 * (1 - 0.75),
      sol: 'For $n = 1$, $j = 1/2$: the bracket is $1 - \\tfrac34 = \\tfrac14$. $E^{(1)} = -7.245\\times10^{-4}/4$ eV $= -1.811\\times10^{-4}$ eV $= -181.1\\,\\mu$eV. The ground state is pushed down.',
      trap: 'The relativistic part alone is $-905.6\\,\\mu$eV; the Darwin term ($+724.5\\,\\mu$eV) cancels most of it.' },
    { id: 'hfs-026', type: 'mcq', level: 3, exams: ['gate', 'net'], sub: 'alkali doublets',
      q: 'Which statement about the spin-orbit doublets of the alkali atoms is correct?',
      options: ['The $^2P$ doublet splitting increases rapidly down the group, from Li to Cs', 'The $^2S_{1/2}$ ground terms are split into two levels', 'The $j = l - 1/2$ level lies above $j = l + 1/2$', 'The splitting is the same for every alkali because each has one valence electron'], answer: 0,
      sol: 'The valence electron penetrates the core and feels a large effective $Z$ near the nucleus, where $\\xi(r) \\propto (1/r)dV/dr$ is large. The splitting of the first $^2P$ term grows from 0.34 cm$^{-1}$ (Li) to 17 cm$^{-1}$ (Na) to 554 cm$^{-1}$ (Cs). $S$ terms ($l = 0$) have a single $j = 1/2$; doublets are normal, with the higher $j$ above.',
      trap: 'The valence electron count is the same, but the core penetration, and so the effective field, is not.' },
    { id: 'hfs-027', type: 'nat', level: 3, exams: ['gate', 'net'], sub: 'fine-structure shifts',
      q: 'In hydrogen, the separation between $3p_{3/2}$ and $3d_{5/2}$ in the Dirac theory is ______ GHz (to two decimal places). Take $R_\\infty c\\,\\alpha^2 = 175.2$ GHz.',
      answer: 1.08, tol: 0.01, unit: 'GHz', calc: () => 175.2 / 27 * (1 / 2 - 1 / 3),
      sol: 'Only $j$ matters: $\\Delta\\nu = \\dfrac{R_\\infty c\\,\\alpha^2}{n^3}\\left(\\dfrac{1}{j_1 + 1/2} - \\dfrac{1}{j_2 + 1/2}\\right) = \\dfrac{175.2}{27}\\left(\\dfrac12 - \\dfrac13\\right) = 6.489\\times\\dfrac16 = 1.08$ GHz.',
      trap: 'Thinking $l$ matters leads to a spin-orbit-only estimate; in hydrogen the $l$ dependence cancels.' },
    { id: 'hfs-028', type: 'mcq', level: 3, exams: ['gate', 'net'], sub: 'scaling',
      q: 'For hydrogen-like ions, at fixed $l$ the spin-orbit splitting between $j = l + 1/2$ and $j = l - 1/2$ scales with $Z$ and $n$ as',
      options: ['$Z^2/n^2$', '$Z^3/n^3$', '$Z^4/n^3$', '$Z^4/n^4$'], answer: 2,
      sol: '$\\Delta E = \\dfrac{R_\\infty hc\\,\\alpha^2 Z^4}{n^3}\\left(\\dfrac{1}{l} - \\dfrac{1}{l+1}\\right) = \\dfrac{R_\\infty hc\\,\\alpha^2 Z^4}{n^3\\,l(l+1)}$. One $Z^3$ comes from $\\langle r^{-3}\\rangle \\propto Z^3$ and another $Z$ from the potential gradient.',
      trap: 'The shift of a single level carries $1/n^4$ in front of the bracket, but the splitting at fixed $l$ ends up $\\propto 1/n^3$.' },

    // ---------- level 4 ----------
    { id: 'hfs-029', type: 'nat', level: 4, exams: ['gate', 'net'], sub: 'spin-orbit',
      q: 'A crude model treats the sodium $3p$ splitting (2.10 meV) as the energy difference $2\\mu_B B$ of the electron\'s spin moment in an internal field $B$. With $\\mu_B = 5.788\\times10^{-5}$ eV/T, $B$ is ______ T (to one decimal place).',
      answer: 18.1, tol: 0.2, unit: 'T', calc: () => 2.10e-3 / (2 * 5.788e-5),
      sol: 'Spin up and down along $B$ differ by $2\\mu_B B$. $B = 2.10\\times10^{-3}/(2\\times5.788\\times10^{-5}) = 18.1$ T. The orbital motion produces an enormous field at the electron, larger than most laboratory magnets.',
      trap: 'Using $\\mu_B B$ instead of $2\\mu_B B$ for the splitting doubles the answer.' },
    { id: 'hfs-030', type: 'nat', level: 4, exams: ['gate', 'net'], sub: 'relativistic correction',
      q: 'The relativistic kinetic-energy correction for a hydrogen-like state is $E_{rel} = -\\dfrac{E_n^2}{2mc^2}\\left(\\dfrac{4n}{l + 1/2} - 3\\right)$. For the hydrogen $1s$ state ($E_1 = -13.6$ eV, $mc^2 = 511$ keV), $E_{rel}$ is ______ $\\mu$eV (to the nearest integer, with sign).',
      answer: -905, tol: 3, unit: 'μeV', calc: () => -(13.6 ** 2 / (2 * 511000)) * (8 - 3) * 1e6,
      sol: '$E_n^2/2mc^2 = 184.96/(1.022\\times10^6)$ eV $= 1.810\\times10^{-4}$ eV. The bracket is $4/(1/2) - 3 = 5$. $E_{rel} = -9.05\\times10^{-4}$ eV $= -905\\,\\mu$eV.',
      trap: 'The bracket uses $l + \\tfrac12$, not $j + \\tfrac12$; for $1s$ both are 1/2 but for $2p$ they differ.' },
    { id: 'hfs-031', type: 'msq', level: 4, exams: ['gate', 'net'], sub: 'perturbation theory',
      q: 'In first-order perturbation theory for hydrogen\'s fine structure, which statements are correct?',
      options: ['Degenerate perturbation theory is needed, but $|n l j m_j\\rangle$ already diagonalises the perturbation', 'The relativistic term $-p^4/8m^3c^2$ is diagonal in the $|n l m_l m_s\\rangle$ basis as well', 'Spin-orbit coupling shifts $j = l + 1/2$ up and $j = l - 1/2$ down, with the centre of gravity (weighted by $2j+1$) unshifted', 'The total first-order shift is positive for every state'], answer: [0, 1, 2],
      sol: '$p^4 = 4m^2(H_0 - V)^2$ commutes with $L^2$, $L_z$, $S_z$, so it is diagonal in either basis. $\\vec L\\cdot\\vec S$ is diagonal in $|lsjm_j\\rangle$. The weighted mean $\\sum(2j+1)\\langle\\vec L\\cdot\\vec S\\rangle$ vanishes: $(2l+2)\\tfrac{l}{2} + 2l\\cdot(-\\tfrac{l+1}{2}) = 0$. The total shift $-(n/(j+\\tfrac12) - \\tfrac34)$ is negative because $n/(j+\\tfrac12) \\ge 1$.',
      trap: 'Spin-orbit raises the upper $j$ level, but the full fine structure lowers every level.' },
    { id: 'hfs-032', type: 'nat', level: 4, exams: ['gate', 'net'], sub: 'spin-orbit',
      q: 'The spin-orbit energy of a hydrogen-like state is $E_{so} = \\dfrac{R_\\infty hc\\,\\alpha^2 Z^4}{2n^3}\\,\\dfrac{j(j+1) - l(l+1) - 3/4}{l(l + 1/2)(l+1)}$. For the hydrogen $3d_{5/2}$ state, with $R_\\infty hc\\,\\alpha^2 = 724.5\\,\\mu$eV, $E_{so}$ is ______ $\\mu$eV (to two decimal places).',
      answer: 1.79, tol: 0.02, unit: 'μeV', calc: () => (724.5 / (2 * 27)) * ((35 / 4 - 6 - 0.75) / (2 * 2.5 * 3)),
      sol: '$j(j+1) - l(l+1) - \\tfrac34 = \\tfrac{35}{4} - 6 - \\tfrac34 = 2$. $l(l+\\tfrac12)(l+1) = 2\\times2.5\\times3 = 15$. $E_{so} = \\dfrac{724.5}{54}\\times\\dfrac{2}{15} = 13.417\\times0.1333 = 1.79\\,\\mu$eV.',
      trap: 'The factor $1/2$ in front already includes the Thomas factor; do not halve again.' },
    { id: 'hfs-033', type: 'mcq', level: 4, exams: ['gate', 'net'], sub: 'hyperfine',
      q: 'Why is the hyperfine splitting of the hydrogen ground state roughly 1000 times smaller than its fine-structure shift?',
      options: ['The proton\'s magnetic moment is smaller than the Bohr magneton by roughly $m_e/m_p$', 'The ground state has $l = 0$, so the magnetic interaction vanishes', 'Hyperfine coupling is a second-order effect', 'The proton has no spin'], answer: 0,
      sol: 'The nuclear magneton is $e\\hbar/2m_p$, smaller than $\\mu_B$ by $m_e/m_p = 1/1836$. With $g_p = 5.59$ the ratio is a few times $10^{-3}$. For $l = 0$ the Fermi contact term ($\\propto |\\psi(0)|^2$) gives the splitting, so it does not vanish.',
      trap: 'For $s$ states the orbital part vanishes, but the contact interaction with the spin is largest there.' },
    { id: 'hfs-034', type: 'nat', level: 4, exams: ['gate', 'net'], sub: 'hyperfine',
      q: 'In the hydrogen ground state the hyperfine levels are $F = 1$ (upper) and $F = 0$ (lower), 5.87 $\\mu$eV apart. In interstellar gas at $T = 100$ K, the ratio of atoms in $F = 1$ to $F = 0$ is ______ (to two decimal places). Use $k_B = 8.617\\times10^{-5}$ eV/K.',
      answer: 3.00, tol: 0.01, calc: () => 3 * Math.exp(-5.87e-6 / (8.617e-5 * 100)),
      sol: 'Boltzmann with degeneracies: $N_1/N_0 = \\dfrac{g_1}{g_0}e^{-\\Delta E/k_BT} = 3\\,e^{-5.87\\times10^{-6}/8.617\\times10^{-3}} = 3\\times e^{-0.00068} = 2.998 \\approx 3.00$. $\\Delta E/k_B$ is only 0.068 K.',
      trap: 'Forgetting $2F+1$ gives a ratio near 1; the upper level is triply degenerate.' },
    { id: 'hfs-035', type: 'mcq', level: 4, exams: ['gate', 'net'], sub: 'sommerfeld',
      q: 'Sommerfeld\'s relativistic elliptic-orbit theory gave the correct fine-structure energies of hydrogen. The quantum number in his formula that plays the role of $j + \\tfrac12$ in the Dirac result is',
      options: ['the radial quantum number $n_r$', 'the principal quantum number $n$', 'the magnetic quantum number', 'the azimuthal quantum number $k = 1, 2, \\dots, n$'], answer: 3,
      sol: 'Sommerfeld found $E = -\\dfrac{R hc}{n^2}\\left[1 + \\dfrac{\\alpha^2}{n^2}\\left(\\dfrac{n}{k} - \\dfrac34\\right)\\right]$ with $k = 1, \\dots, n$. Dirac\'s formula has the same form with $k \\to j + \\tfrac12$. The agreement was partly luck: Sommerfeld had no spin, and the relativistic and spin-orbit terms combine to mimic his result.',
      trap: 'The forms agree but the physics differs; $k$ is not $l$ (the formula with $l + 1$ in place of $j + \\tfrac12$ is wrong).' },
    { id: 'hfs-036', type: 'nat', level: 4, exams: ['gate', 'net'], sub: 'fine structure of lines',
      q: 'The $2p_{3/2}$-$2p_{1/2}$ separation of hydrogen is 10.97 GHz. A spectrometer looking at Lyman $\\alpha$ (121.57 nm) must resolve two lines this far apart. The resolving power $\\lambda/\\Delta\\lambda$ needed is about ______ $\\times10^5$ (to two decimal places).',
      answer: 2.25, tol: 0.03, calc: () => (2.99792458e8 / 121.57e-9) / 10.97e9 / 1e5,
      sol: '$\\lambda/\\Delta\\lambda = \\nu/\\Delta\\nu$. $\\nu = c/\\lambda = 2.998\\times10^8/1.2157\\times10^{-7} = 2.466\\times10^{15}$ Hz. $\\nu/\\Delta\\nu = 2.466\\times10^{15}/1.097\\times10^{10} = 2.25\\times10^5$.',
      trap: 'Fine structure is a few parts in $10^6$ of the line energy for Lyman $\\alpha$; Doppler broadening in a hot gas often hides it.' },

    // ---------- level 5 ----------
    { id: 'hfs-037', type: 'nat', level: 5, exams: ['gate', 'net'], sub: 'dirac formula',
      q: 'The exact Dirac ground-state energy (including rest energy) of a hydrogen-like ion is $E = mc^2\\sqrt{1 - Z^2\\alpha^2}$. For $Z = 80$, with $mc^2 = 511.0$ keV and $\\alpha = 1/137.04$, the binding energy $mc^2 - E$ is ______ keV (to one decimal place).',
      answer: 96.1, tol: 0.2, unit: 'keV', calc: () => 511.0 * (1 - Math.sqrt(1 - (80 / 137.04) ** 2)),
      sol: '$Z\\alpha = 80/137.04 = 0.5838$, $(Z\\alpha)^2 = 0.3408$, $\\sqrt{1 - 0.3408} = 0.8119$. Binding energy $= 511.0\\times(1 - 0.8119) = 96.1$ keV. The Bohr value $13.6\\times6400$ eV $= 87.1$ keV is 10% low: for heavy ions the relativistic correction is no longer small.',
      trap: 'Expanding $\\sqrt{1 - x}$ to first order just gives back the Bohr result; the higher terms are the point here.' },
    { id: 'hfs-038', type: 'msq', level: 5, exams: ['gate', 'net'], sub: 'level ordering',
      q: 'Consider the $n = 2$ manifold of atomic hydrogen including fine structure, the Lamb shift and hyperfine structure (proton spin $1/2$). Which statements are correct?',
      options: ['$2p_{3/2}$ splits into hyperfine levels $F = 1$ and $F = 2$', 'The total number of states (counting all $m_F$) is 16', '$2s_{1/2}$ splits into $F = 0$ and $F = 1$', 'The Lamb shift is larger than the $2p$ fine-structure splitting'], answer: [0, 1, 2],
      sol: '$F = j \\pm \\tfrac12$: $2p_{3/2}$ gives $F = 1, 2$; $2s_{1/2}$ and $2p_{1/2}$ give $F = 0, 1$. States: $2n^2 = 8$ electron states times 2 proton states $= 16$ (check: $2s$: 1 + 3, $2p_{1/2}$: 1 + 3, $2p_{3/2}$: 3 + 5, total 16). The Lamb shift (1.06 GHz) is about ten times smaller than the fine-structure splitting (10.9 GHz).',
      trap: 'Hyperfine splitting never changes the number of states, only how they are grouped.' },
    { id: 'hfs-039', type: 'nat', level: 5, exams: ['gate', 'net'], sub: 'muonic atoms',
      q: 'Fine-structure splittings scale as $\\mu c^2(Z\\alpha)^4$, where $\\mu$ is the reduced mass. The $2p$ fine-structure splitting of hydrogen is 45.3 $\\mu$eV. For muonic hydrogen ($\\mu = 186\\,m_e$, a point nucleus assumed), the $2p$ fine-structure splitting is ______ meV (to two decimal places).',
      answer: 8.43, tol: 0.05, unit: 'meV', calc: () => 45.3e-3 * 186,
      sol: 'Same $Z$ and $n$, so the splitting simply scales with the reduced mass: $45.3\\,\\mu$eV $\\times186 = 8426\\,\\mu$eV $= 8.43$ meV. (The measured value, about 8.35 meV, also has small corrections from the muon\'s own anomalous moment and the nuclear size.)',
      trap: 'Using $(186)^4$ confuses mass scaling with charge scaling; only $Z\\alpha$ enters to the fourth power.' },
    { id: 'hfs-040', type: 'mcq', level: 5, exams: ['gate', 'net'], sub: 'perturbation theory',
      q: 'The spin-orbit term alone, $E_{so} \\propto [j(j+1) - l(l+1) - \\tfrac34]/[l(l+\\tfrac12)(l+1)]$, appears to diverge for $l = 0$. What is the correct treatment of hydrogen $s$ states?',
      options: ['The numerator is also zero for $l = 0$, $j = 1/2$; spin-orbit vanishes and the Darwin term supplies a contact energy that makes the total fit the $E_{nj}$ formula', 'The divergence is real and is cut off by the finite proton size', 'The $s$ states have no fine structure at all', 'One must use $l = 1/2$ for $s$ states'], answer: 0,
      sol: 'For $l = 0$ the operator $\\vec L\\cdot\\vec S$ is identically zero, so $E_{so} = 0$ (the "0/0" is resolved by the operator, not by a limit). The Darwin term $R_\\infty hc\\,\\alpha^2Z^4/n^3$, present only for $l = 0$, then makes relativistic + Darwin equal to $-(R_\\infty hc\\,\\alpha^2Z^4/n^4)(n - \\tfrac34)$, the $j = \\tfrac12$ value of the general formula.',
      trap: 'Taking the limit $l \\to 0$ in the closed formula happens to give the Darwin result too, but the reason is the Darwin term, not spin-orbit.' },
    ...more2,
    ...r4.items,
    ...r5.items,
  ],

  gens: [
    { id: 'hfs-g01', type: 'nat', level: 3, exams: ['gate', 'net'], sub: 'fine-structure splitting',
      make(r) {
        const [Z, ion] = choose(r, [[1, 'hydrogen'], [2, 'He$^+$'], [3, 'Li$^{2+}$']]);
        const n = int(r, 2, 4), l = int(r, 1, n - 1);
        const d = RA2CM * Z ** 4 / (n ** 3 * l * (l + 1));
        return { q: `For ${ion} ($Z = ${Z}$), using $E^{(1)}_{nj} = -\\dfrac{R_\\infty hc\\,\\alpha^2Z^4}{n^4}\\left(\\dfrac{n}{j+1/2} - \\dfrac34\\right)$ with $R_\\infty\\alpha^2 = 5.844$ cm$^{-1}$, the separation between $${term(n, l, l + 0.5)}$ and $${term(n, l, l - 0.5)}$ is ______ cm$^{-1}$ (to three significant figures).`,
          answer: +d.toPrecision(3), tol: +(d * 0.01).toPrecision(2), unit: 'cm⁻¹', Z, n, l,
          sol: `$\\Delta\\tilde\\nu = \\dfrac{R_\\infty\\alpha^2Z^4}{n^3}\\left(\\dfrac{1}{${l}} - \\dfrac{1}{${l + 1}}\\right) = \\dfrac{5.844\\times${Z ** 4}}{${n ** 3}\\times${l * (l + 1)}} = ${+d.toPrecision(4)}$ cm$^{-1}$.`,
          trap: 'Splittings scale as $Z^4/n^3$, not as the Bohr energies ($Z^2/n^2$).' };
      },
      verify: (p) => RA2CM * p.Z ** 4 / p.n ** 3 * (1 / p.l - 1 / (p.l + 1)) },
    { id: 'hfs-g02', type: 'nat', level: 3, exams: ['gate', 'net'], sub: 'fine-structure shifts',
      make(r) {
        const n = int(r, 1, 4), j = int(r, 0, n - 1) + 0.5;
        const E = efs(1, n, j) * 1e6;
        return { q: `Using $E^{(1)}_{nj} = -\\dfrac{R_\\infty hc\\,\\alpha^2}{n^4}\\left(\\dfrac{n}{j+1/2} - \\dfrac34\\right)$ with $R_\\infty hc\\,\\alpha^2 = 724.5\\,\\mu$eV, the fine-structure shift of the hydrogen level $n = ${n}$, $j = ${fr(j)}$ is ______ $\\mu$eV (to one decimal place, with sign).`,
          answer: round(E, 1), tol: Math.max(0.1, round(Math.abs(E) * 0.005, 1)), unit: 'μeV', n, j,
          sol: `$n/(j + \\tfrac12) = ${n}/${j + 0.5} = ${round(n / (j + 0.5), 4)}$; minus $\\tfrac34$ gives ${round(n / (j + 0.5) - 0.75, 4)}. Divide $724.5$ by $n^4 = ${n ** 4}$: ${round(724.5 / n ** 4, 3)}. $E^{(1)} = -${round(724.5 / n ** 4, 3)}\\times${round(n / (j + 0.5) - 0.75, 4)} = ${round(E, 1)}\\,\\mu$eV.`,
          trap: 'Every fine-structure shift is negative: $n/(j+\\tfrac12) \\ge 1 > \\tfrac34$.' };
      },
      verify: (p) => -(724.5 / p.n ** 4) * (p.n / (p.j + 0.5) - 0.75) },
    { id: 'hfs-g03', type: 'nat', level: 2, exams: ['gate', 'net'], sub: 'spin-orbit',
      make(r) {
        const l = int(r, 1, 4), j = l + choose(r, [-0.5, 0.5]);
        const v = (j * (j + 1) - l * (l + 1) - 0.75) / 2;
        return { q: `A single electron is in a state with $l = ${l}$ ($${LT[l].toLowerCase()}$ electron) and $j = ${fr(j)}$. The eigenvalue of $\\vec L\\cdot\\vec S$ in units of $\\hbar^2$ is ______.`,
          answer: v, tol: 0, l, j,
          sol: `$\\vec L\\cdot\\vec S = \\tfrac12[j(j+1) - l(l+1) - s(s+1)]\\hbar^2 = \\tfrac12[${j * (j + 1)} - ${l * (l + 1)} - 0.75]\\hbar^2 = ${v}\\,\\hbar^2$. (For $j = l + \\tfrac12$ it is always $l/2$, for $j = l - \\tfrac12$ always $-(l+1)/2$.)`,
          trap: 'Use $j(j+1)$, not $j^2$.' };
      },
      verify: (p) => (p.j * (p.j + 1) - p.l * (p.l + 1) - 0.75) / 2 },
    { id: 'hfs-g04', type: 'nat', level: 4, exams: ['gate', 'net'], sub: 'fine structure of lines',
      make(r) {
        const [nu, nl] = choose(r, [[2, 1], [3, 1], [3, 2], [4, 2], [4, 3], [5, 2], [5, 3], [5, 4]]);
        const mode = choose(r, ['all', 'distinct']);
        const U = states(nu), Lw = states(nl);
        const pairs = []; for (const a of U) for (const b of Lw) if (e1(a, b)) pairs.push([a, b]);
        const ans = mode === 'all' ? pairs.length : new Set(pairs.map(([a, b]) => `${a[2]}-${b[2]}`)).size;
        return { q: mode === 'all'
          ? `Counting every electric-dipole-allowed transition between one-electron states $n\\,l_j$ (rules $\\Delta l = \\pm1$, $\\Delta j = 0, \\pm1$), the number of transitions from $n = ${nu}$ to $n = ${nl}$ in hydrogen is ______.`
          : `In the Dirac theory of hydrogen (energies depend only on $n$ and $j$), the number of distinct fine-structure components of the $n = ${nu} \\to n = ${nl}$ line, counting only energy differences reached by E1-allowed transitions, is ______.`,
          answer: ans, tol: 0, nu, nl, mode,
          sol: `List the states: $n = ${nu}$: ${U.map((s) => `$${s[0]}${LT[s[1]].toLowerCase()}_{${fr(s[2])}}$`).join(', ')}; $n = ${nl}$: ${Lw.map((s) => `$${s[0]}${LT[s[1]].toLowerCase()}_{${fr(s[2])}}$`).join(', ')}. Pairs with $\\Delta l = \\pm1$ and $|\\Delta j| \\le 1$: ${pairs.length}. ${mode === 'all' ? `So the answer is ${ans}.` : `Grouping them by $(j_{upper}, j_{lower})$ gives ${ans} distinct energies.`}`,
          trap: mode === 'all' ? '$\\Delta j = 2$ pairs such as $d_{5/2}\\to p_{1/2}$ are forbidden.' : 'Transitions with the same pair of $j$ values coincide in energy in Dirac theory.' };
      },
      verify: (p) => {
        let c = 0; const seen = new Set();
        for (let l1 = 0; l1 < p.nu; l1++) for (let l2 = 0; l2 < p.nl; l2++) if (Math.abs(l1 - l2) === 1)
          for (const j1 of [l1 - 0.5, l1 + 0.5]) for (const j2 of [l2 - 0.5, l2 + 0.5]) if (j1 > 0 && j2 > 0 && Math.abs(j1 - j2) <= 1) { c++; seen.add(j1 * 10 + j2); }
        return p.mode === 'all' ? c : seen.size;
      } },
    { id: 'hfs-g05', type: 'nat', level: 2, exams: ['gate', 'net'], sub: 'degeneracy',
      make(r) {
        const n = int(r, 2, 6), j = int(r, 0, n - 1) + 0.5;
        const g = (j < n - 0.5 ? 2 : 1) * (2 * j + 1);
        return { q: `In the Dirac theory of hydrogen, the level with $n = ${n}$ and $j = ${fr(j)}$ contains how many states (counting every $m_j$ and every $l$ that gives this $j$)? ______`,
          answer: g, tol: 0, n, j,
          sol: `$j = ${fr(j)}$ comes from $l = j - \\tfrac12 = ${j - 0.5}$${j < n - 0.5 ? ` and $l = j + \\tfrac12 = ${j + 0.5}$ (both allowed since $l \\le n - 1 = ${n - 1}$)` : ` only ($l = j + \\tfrac12 = ${j + 0.5}$ would need $l > n - 1$)`}. Each gives $2j + 1 = ${2 * j + 1}$ states, so ${g} in all.`,
          trap: 'The top level $j = n - \\tfrac12$ has only one $l$; every other $j$ has two.' };
      },
      verify: (p) => { let g = 0; for (let l = 0; l < p.n; l++) for (const j of [l - 0.5, l + 0.5]) if (j === p.j) g += 2 * j + 1; return g; } },
    { id: 'hfs-g06', type: 'nat', level: 2, exams: ['gate', 'net'], sub: 'alkali doublets',
      make(r) {
        const [el, l1, l2] = choose(r, [['sodium', 589.592, 588.995], ['potassium', 769.896, 766.490], ['rubidium', 794.979, 780.241], ['caesium', 894.347, 852.347], ['lithium', 670.791, 670.776]]);
        const unit = choose(r, ['cm', 'meV']);
        const dcm = 1e7 / l2 - 1e7 / l1, dmeV = dcm * 1.23984e-4 * 1e3;
        const ans = unit === 'cm' ? dcm : dmeV;
        const d = ans < 1 ? 3 : ans < 10 ? 2 : 1;
        return { q: `The resonance doublet of ${el} has wavelengths ${l2} nm and ${l1} nm (both end on the ground $^2S_{1/2}$ level). The fine-structure splitting of the first excited $^2P$ term is ______ ${unit === 'cm' ? 'cm$^{-1}$' : 'meV'}${unit === 'meV' ? ' (use 1 cm$^{-1}$ = 0.12398 meV)' : ''}.`,
          answer: round(ans, d), tol: Math.max(10 ** -d, round(ans * 0.01, d)), unit: unit === 'cm' ? 'cm⁻¹' : 'meV', l1, l2, cm: unit === 'cm',
          sol: `$\\Delta\\tilde\\nu = 10^7/${l2} - 10^7/${l1} = ${round(1e7 / l2, 2)} - ${round(1e7 / l1, 2)} = ${round(dcm, 3)}$ cm$^{-1}$${unit === 'meV' ? ` $= ${round(dcm, 3)}\\times0.12398$ meV $= ${round(dmeV, 3)}$ meV` : ''}. The shorter wavelength comes from $^2P_{3/2}$.`,
          trap: 'Subtract wavenumbers; $1/\\Delta\\lambda$ is meaningless.' };
      },
      verify: (p) => { const d = 1e7 / p.l2 - 1e7 / p.l1; return p.cm ? d : d * 0.123984; } },
    { id: 'hfs-g07', type: 'mcq', level: 3, exams: ['gate', 'net'], sub: 'scaling',
      make(r) {
        const a = [choose(r, [1, 2, 3]), int(r, 2, 3)]; a.push(int(r, 1, a[1] - 1));
        let b = [choose(r, [1, 2, 3, 4]), int(r, 2, 4)]; b.push(int(r, 1, b[1] - 1));
        if (a[0] === b[0] && a[1] === b[1] && a[2] === b[2]) b = [a[0] + 1, a[1], a[2]];
        const s = (x) => x[0] ** 4 / (x[1] ** 3 * x[2] * (x[2] + 1));
        const ratio = s(b) / s(a);
        const show = (v) => `$${fmt3(v)}$`;
        const o = mcqOptions(r, ratio, [s2(b) / s2(a), (b[0] ** 4 / b[1] ** 3) / (a[0] ** 4 / a[1] ** 3), (b[0] ** 4 / b[1] ** 4) / (a[0] ** 4 / a[1] ** 4), 1 / ratio], show);
        return { q: `Let $\\Delta_1$ be the spin-orbit (fine-structure) splitting between $j = l \\pm \\tfrac12$ for $Z = ${a[0]}$, $n = ${a[1]}$, $l = ${a[2]}$, and $\\Delta_2$ the same for $Z = ${b[0]}$, $n = ${b[1]}$, $l = ${b[2]}$ (hydrogen-like ions, Dirac theory). The ratio $\\Delta_2/\\Delta_1$ is`,
          options: o.options, answer: o.answer,
          sol: `$\\Delta \\propto Z^4/[n^3 l(l+1)]$. $\\Delta_1 \\propto ${a[0] ** 4}/(${a[1] ** 3}\\times${a[2] * (a[2] + 1)})$, $\\Delta_2 \\propto ${b[0] ** 4}/(${b[1] ** 3}\\times${b[2] * (b[2] + 1)})$. Ratio $= ${fmt3(ratio)}$.`,
          trap: 'Bohr-like scaling $Z^2/n^2$ is wrong for fine structure.' };
      } },
    { id: 'hfs-g08', type: 'nat', level: 2, exams: ['gate', 'net'], sub: 'unit conversions',
      make(r) {
        const [what, nu] = choose(r, [['the hydrogen ground-state hyperfine transition', 1420.406], ['the hydrogen $2s_{1/2}$-$2p_{1/2}$ Lamb shift', 1057.8], ['the hydrogen $2p_{3/2}$-$2p_{1/2}$ fine-structure interval', 10969.0], ['the deuterium ground-state hyperfine transition', 327.384], ['the hydrogen $2s_{1/2}$ hyperfine interval', 177.557]]);
        const ask = choose(r, ['ueV', 'cm', 'K']);
        const E = nu * 1e6 * H_EV;
        const ans = ask === 'ueV' ? E * 1e6 : ask === 'cm' ? 2.99792458e10 / (nu * 1e6) : E / 8.617333e-5 * 1000;
        const txt = ask === 'ueV' ? 'energy in $\\mu$eV' : ask === 'cm' ? 'wavelength in cm' : 'equivalent temperature $\\Delta E/k_B$ in mK';
        return { q: `The frequency of ${what} is ${nu} MHz. Its ${txt} is ______ (to three significant figures). Use $h = 4.1357\\times10^{-15}$ eV s, $c = 2.998\\times10^8$ m/s, $k_B = 8.617\\times10^{-5}$ eV/K.`,
          answer: +ans.toPrecision(3), tol: +(ans * 0.01).toPrecision(2), unit: ask === 'ueV' ? 'μeV' : ask === 'cm' ? 'cm' : 'mK', nu, ask,
          sol: ask === 'ueV' ? `$E = h\\nu = 4.1357\\times10^{-15}\\times${nu}\\times10^6 = ${+(E * 1e6).toPrecision(4)}\\,\\mu$eV.`
            : ask === 'cm' ? `$\\lambda = c/\\nu = 2.998\\times10^{10}$ cm/s $/ ${nu}\\times10^6$ Hz $= ${+ans.toPrecision(4)}$ cm.`
            : `$E = h\\nu = ${+(E * 1e6).toPrecision(4)}\\,\\mu$eV; $E/k_B = ${+(E * 1e6).toPrecision(4)}\\times10^{-6}/8.617\\times10^{-5}$ K $= ${+ans.toPrecision(4)}$ mK.`,
          trap: 'Keep MHz as $10^6$ Hz.' };
      },
      verify: (p) => { const E = p.nu * 1e6 * H_EV; return p.ask === 'ueV' ? E * 1e6 : p.ask === 'cm' ? 2.99792458e10 / (p.nu * 1e6) : E / 8.617333e-5 * 1000; } },
    { id: 'hfs-g09', type: 'msq', level: 3, exams: ['gate', 'net'], sub: 'selection rules',
      make(r) {
        const pool = [];
        for (const nu of [2, 3, 4]) for (const nl of [1, 2, 3]) if (nl < nu) for (const a of states(nu)) for (const b of states(nl)) pool.push([a, b, e1(a, b)]);
        const good = pool.filter((p) => p[2]), bad = pool.filter((p) => !p[2]);
        const k = int(r, 1, 3);
        const chosen = shuffle(r, [...shuffle(r, good).slice(0, k), ...shuffle(r, bad).slice(0, 4 - k)]);
        const lab = (s) => `${s[0]}${LT[s[1]].toLowerCase()}_{${fr(s[2])}}`;
        return { q: 'Which of the following one-electron transitions are allowed as electric dipole (E1) transitions?',
          options: chosen.map(([a, b]) => `$${lab(a)}\\to${lab(b)}$`), answer: chosen.map((c, i) => (c[2] ? i : -1)).filter((i) => i >= 0),
          sol: 'Rules: $\\Delta l = \\pm1$ and $\\Delta j = 0, \\pm1$ (no rule on $n$). ' + chosen.map(([a, b, ok]) => `$${lab(a)}\\to${lab(b)}$: $\\Delta l = ${b[1] - a[1]}$, $\\Delta j = ${b[2] - a[2]}$, ${ok ? 'allowed' : 'forbidden'}.`).join(' '),
          trap: 'Check $\\Delta l$ first: $s\\to s$ and $p\\to f$ are never E1.' };
      } },
    { id: 'hfs-g10', type: 'nat', level: 4, exams: ['gate', 'net'], sub: 'spin-orbit',
      make(r) {
        const Z = choose(r, [1, 1, 2]), n = int(r, 2, 4), l = int(r, 1, n - 1), j = l + choose(r, [-0.5, 0.5]);
        const E = (RA2 * 1e6 * Z ** 4 / (2 * n ** 3)) * (j * (j + 1) - l * (l + 1) - 0.75) / (l * (l + 0.5) * (l + 1));
        return { q: `The spin-orbit energy of a hydrogen-like state is $E_{so} = \\dfrac{R_\\infty hc\\,\\alpha^2Z^4}{2n^3}\\,\\dfrac{j(j+1) - l(l+1) - 3/4}{l(l+\\frac12)(l+1)}$, with $R_\\infty hc\\,\\alpha^2 = 724.5\\,\\mu$eV. For the $${term(n, l, j)}$ state of ${Z === 1 ? 'hydrogen' : 'He$^+$'}, $E_{so}$ is ______ $\\mu$eV (to two decimal places, with sign).`,
          answer: round(E, 2), tol: Math.max(0.01, round(Math.abs(E) * 0.005, 2)), unit: 'μeV', Z, n, l, j,
          sol: `Numerator: $${j * (j + 1)} - ${l * (l + 1)} - 0.75 = ${j * (j + 1) - l * (l + 1) - 0.75}$. Denominator: $${l}\\times${l + 0.5}\\times${l + 1} = ${l * (l + 0.5) * (l + 1)}$. Prefactor: $724.5\\times${Z ** 4}/(2\\times${n ** 3}) = ${round(724.5 * Z ** 4 / (2 * n ** 3), 3)}\\,\\mu$eV. $E_{so} = ${round(E, 2)}\\,\\mu$eV.`,
          trap: 'The $j = l - \\tfrac12$ level moves down by $(l+1)/l$ times as much as $j = l + \\tfrac12$ moves up.' };
      },
      verify: (p) => (724.52 * p.Z ** 4 / (2 * p.n ** 3)) * (p.j * (p.j + 1) - p.l * (p.l + 1) - 0.75) / (p.l * (p.l + 0.5) * (p.l + 1)) },
    { id: 'hfs-g11', type: 'mcq', level: 1, exams: ['gate', 'net'], sub: 'term symbols',
      make(r) {
        const n = int(r, 2, 5), l = int(r, 1, Math.min(4, n - 1));
        const right = `$${term(n, l, l - 0.5)}$ and $${term(n, l, l + 0.5)}$`;
        const wrongs = [`$${term(n, l, l)}$ only`, `$${n}\\,^1${LT[l]}_{${l}}$ and $${n}\\,^3${LT[l]}_{${l}}$`, `$${term(n, l, l + 0.5)}$ and $${term(n, l, l + 1.5)}$`, `$${term(n, l, l + 0.5)}$ only`];
        const o = mcqOptions(r, right, wrongs, (v) => v);
        return { q: `A single electron occupies a $${n}${LT[l].toLowerCase()}$ orbital. Including spin, the possible levels are`,
          options: o.options, answer: o.answer,
          sol: `$l = ${l}$, $s = \\tfrac12$, so $j = l \\pm \\tfrac12 = ${fr(l - 0.5)}, ${fr(l + 0.5)}$. One electron is always a doublet ($2S + 1 = 2$): ${right}.`,
          trap: 'Singlets and triplets need two electrons.' };
      } },
    { id: 'hfs-g12', type: 'nat', level: 3, exams: ['gate', 'net'], sub: 'relativistic correction',
      make(r) {
        const n = int(r, 1, 3), l = int(r, 0, n - 1);
        const which = choose(r, ['rel', 'dar']);
        const ans = which === 'rel' ? -(RA2 * 1e6 / (4 * n ** 4)) * (4 * n / (l + 0.5) - 3) : (l === 0 ? RA2 * 1e6 / n ** 3 : 0);
        return { q: which === 'rel'
          ? `The relativistic kinetic correction is $E_{rel} = -\\dfrac{R_\\infty hc\\,\\alpha^2}{4n^4}\\left(\\dfrac{4n}{l+1/2} - 3\\right)$ for hydrogen, with $R_\\infty hc\\,\\alpha^2 = 724.5\\,\\mu$eV. For the $${n}${LT[l].toLowerCase()}$ state, $E_{rel}$ is ______ $\\mu$eV (to one decimal place, with sign).`
          : `The Darwin term in hydrogen is $E_D = R_\\infty hc\\,\\alpha^2/n^3$ for $l = 0$ and zero otherwise, with $R_\\infty hc\\,\\alpha^2 = 724.5\\,\\mu$eV. For the $${n}${LT[l].toLowerCase()}$ state, $E_D$ is ______ $\\mu$eV (to one decimal place).`,
          answer: round(ans, 1), tol: Math.max(0.1, round(Math.abs(ans) * 0.005, 1)), unit: 'μeV', n, l, which,
          sol: which === 'rel'
            ? `$4n/(l+\\tfrac12) - 3 = ${4 * n}/${l + 0.5} - 3 = ${round(4 * n / (l + 0.5) - 3, 4)}$. $724.5/(4\\times${n ** 4}) = ${round(724.5 / (4 * n ** 4), 3)}$. $E_{rel} = ${round(ans, 1)}\\,\\mu$eV.`
            : (l === 0 ? `$l = 0$, so $E_D = 724.5/${n ** 3} = ${round(ans, 1)}\\,\\mu$eV.` : `$l = ${l} \\ne 0$: the wavefunction vanishes at the nucleus, so $E_D = 0$.`),
          trap: which === 'rel' ? 'The relativistic term depends on $l$, not $j$.' : 'Only $s$ states feel the Darwin term.' };
      },
      verify: (p) => (p.which === 'rel' ? -(724.52 / (4 * p.n ** 4)) * (4 * p.n / (p.l + 0.5) - 3) : (p.l === 0 ? 724.52 / p.n ** 3 : 0)) },
    ...more,
    ...r4.gens,
    ...r5.gens,
  ],
};

function fmt3(v) { return String(+v.toPrecision(3)); }
function s2(x) { return x[0] ** 2 / x[1] ** 2; }
