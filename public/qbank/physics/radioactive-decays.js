// Alpha, beta and gamma decay (GATE / CSIR NET level): Coulomb and centrifugal barriers, Gamow tunnelling factor and
// the Geiger-Nuttall law, alpha angular momentum and parity, hindrance; Fermi theory of beta decay, Sargent rule,
// Kurie plot, ft values and selection rules (Fermi, Gamow-Teller, forbidden orders), electron capture, parity
// violation and neutrino helicity, double beta decay; gamma multipoles and selection rules, Weisskopf estimates,
// internal conversion, isomers, recoil and the Mossbauer effect. (The decay law and simple Q values are in the JAM
// topic nuclei-radioactivity.) Original questions for fibub.
import { pick, int, choose, mcqOptions, round } from '../_util.js';
import more from './radioactive-decays.more.gen.js';

const ALPHA = 1 / 137.036, MA = 3727.379, HBARC = 197.327, KE2 = 1.44, U = 931.494, HBAR_EVS = 6.582120e-16, CL = 2.99792458e8;
const twoG = (Z, Q, R) => { const B = 2 * Z * KE2 / R, x = Q / B; return 2 * Math.sqrt(2 * MA * Q) / HBARC * (2 * Z * KE2 / Q) * (Math.acos(Math.sqrt(x)) - Math.sqrt(x * (1 - x))); };
// Weisskopf single-particle rates (s^-1), E in MeV (Krane, table 10.2)
const WK = { E1: (A, E) => 1.0e14 * A ** (2 / 3) * E ** 3, E2: (A, E) => 7.3e7 * A ** (4 / 3) * E ** 5, E3: (A, E) => 34 * A ** 2 * E ** 7, M1: (A, E) => 5.6e13 * E ** 3, M2: (A, E) => 3.5e7 * A ** (2 / 3) * E ** 5, M3: (A, E) => 16 * A ** (4 / 3) * E ** 7 };
const WKTXT = { E1: '1.0\\times10^{14}A^{2/3}E^3', E2: '7.3\\times10^{7}A^{4/3}E^5', E3: '34A^{2}E^7', M1: '5.6\\times10^{13}E^3', M2: '3.5\\times10^{7}A^{2/3}E^5', M3: '16A^{4/3}E^7' };
const hs = (j2) => (j2 % 2 ? `${j2}/2` : `${j2 / 2}`);
const st = (j2, p) => `${hs(j2)}^${p > 0 ? '+' : '-'}`;

export default {
  topic: 'radioactive-decays',
  items: [
    // ---------- level 1 ----------
    { id: 'rdk-001', type: 'mcq', level: 1, exams: ['gate', 'net'], sub: 'Geiger-Nuttall',
      q: 'For alpha emitters of one element, the Geiger-Nuttall law says that',
      options: ['the half-life is proportional to the decay energy $Q$', '$\\log t_{1/2}$ is roughly a linear function of $Q^{-1/2}$, increasing as $Q$ decreases', 'all alpha emitters have the same half-life', '$\\log t_{1/2}$ is proportional to $Q^2$'], answer: 1,
      sol: 'The tunnelling probability is $e^{-2G}$ with $2G \\approx \\pi zZ\\alpha\\sqrt{2mc^2/Q}$ minus a smaller term. So $\\ln t_{1/2} \\approx a + bZ/\\sqrt Q$: a straight line against $Q^{-1/2}$, steep enough that a factor of 2 in $Q$ changes $t_{1/2}$ by more than 20 orders of magnitude.',
      trap: 'Higher $Q$ means a thinner barrier and a shorter half-life, not a longer one.' },
    { id: 'rdk-002', type: 'mcq', level: 1, exams: ['gate', 'net'], sub: 'gamma multipoles',
      q: 'The gamma transition from the first $2^+$ level of an even-even nucleus to its $0^+$ ground state is',
      options: ['E1', 'M1', 'E2', 'M2'], answer: 2,
      sol: 'The photon must carry $L$ with $|J_i - J_f| \\le L \\le J_i + J_f$, so $L = 2$. No parity change: an electric multipole has parity $(-1)^L = +$, a magnetic one $(-1)^{L+1} = -$. Hence E2, the hallmark transition of collective states.',
      trap: 'E1 and M1 cannot carry two units of angular momentum.' },
    { id: 'rdk-003', type: 'mcq', level: 1, exams: ['gate', 'net'], sub: 'electron capture',
      q: 'When a nucleus decays by electron capture (from the K shell), what is emitted?',
      options: ['a positron and a neutrino with a continuous spectrum', 'only a gamma ray', 'an electron and an antineutrino', 'a monoenergetic neutrino, followed by X-rays or Auger electrons as the atom fills the K-shell vacancy'], answer: 3,
      sol: '$p + e^- \\to n + \\nu_e$ inside the atom is a two-body final state (daughter atom plus neutrino), so the neutrino energy is fixed: $Q_{EC} - B_K$ minus a tiny recoil. The vacancy left in the K shell is filled by an outer electron, giving characteristic X-rays or Auger electrons of the daughter.',
      trap: 'Only three-body decays such as $\\beta^\\pm$ give continuous spectra.' },
    { id: 'rdk-004', type: 'mcq', level: 1, exams: ['gate', 'net'], sub: 'selection rules',
      q: 'A beta decay between two $0^+$ states is',
      options: ['a pure Fermi transition, allowed', 'a pure Gamow-Teller transition', 'forbidden to all orders', 'first forbidden'], answer: 0,
      sol: 'In allowed decays the leptons carry no orbital angular momentum. If their spins are antiparallel (Fermi, $S = 0$) the nucleus keeps its $J$; if parallel (Gamow-Teller, $S = 1$) $\\Delta J = 0, \\pm1$ but $0 \\to 0$ is impossible. So $0^+ \\to 0^+$ is pure Fermi. Superallowed $0^+ \\to 0^+$ decays such as ${}^{14}$O are used to test the Standard Model.',
      trap: 'Gamow-Teller cannot connect two $J = 0$ states.' },
    { id: 'rdk-005', type: 'nat', level: 1, exams: ['gate', 'net'], sub: 'recoil', unit: 'eV',
      q: 'A nucleus of mass $100$ u at rest emits a $1.00$ MeV gamma ray. Its recoil kinetic energy is ______ eV (to two decimal places). Use $1$ u $= 931.494$ MeV$/c^2$.',
      answer: 5.37, tol: 0.02, calc: () => 1e6 / (2 * 100 * 931.494),
      sol: 'The nucleus takes momentum $E_\\gamma/c$, so $T_R = E_\\gamma^2/(2Mc^2) = 1.00^2/(2\\times93\\,149)$ MeV $= 5.37\\times10^{-6}$ MeV $= 5.37$ eV. This is far larger than the natural line width (micro-eV or less), which is why free nuclei cannot resonantly reabsorb their own gamma rays.',
      trap: 'Using $E_\\gamma/Mc^2$ (forgetting the 2) or treating the photon energy as the recoil momentum in kg m/s without converting.' },
    { id: 'rdk-006', type: 'mcq', level: 1, exams: ['gate', 'net'], sub: 'internal conversion',
      q: 'In internal conversion, an excited nucleus',
      options: ['emits a gamma ray which then knocks out an atomic electron', 'transfers its excitation energy directly to an atomic electron, which leaves with kinetic energy $E_{transition} - B_{shell}$', 'turns a neutron into a proton', 'captures an atomic electron'], answer: 1,
      sol: 'The electromagnetic field of the nucleus couples directly to an atomic electron whose wavefunction overlaps it. The electron comes out with a sharp energy: transition energy minus its binding energy, giving K, L, M lines. It is not a two-step photoelectric process; it competes with gamma emission.',
      trap: 'Conversion electrons are monoenergetic, unlike beta electrons.' },

    // ---------- level 2 ----------
    { id: 'rdk-007', type: 'nat', level: 2, exams: ['gate', 'net'], sub: 'internal conversion', unit: '%',
      q: 'A nuclear level decays to the ground state by gamma emission and internal conversion, with total conversion coefficient $\\alpha = 0.35$. The percentage of decays that produce a gamma ray is ______ % (to one decimal place).',
      answer: 74.1, tol: 0.1, calc: () => 100 / 1.35,
      sol: '$\\alpha = \\lambda_e/\\lambda_\\gamma$, so $\\lambda = \\lambda_\\gamma(1 + \\alpha)$ and the gamma fraction is $1/(1 + \\alpha) = 1/1.35 = 0.741 = 74.1\\%$. The rest, 25.9%, give conversion electrons.',
      trap: 'Taking $1 - \\alpha = 65\\%$: $\\alpha$ is a ratio of rates, not a fraction of decays.' },
    { id: 'rdk-008', type: 'mcq', level: 2, exams: ['gate', 'net'], sub: 'Fermi theory',
      q: 'For allowed beta decays with endpoint energies well above $m_ec^2$, Sargent\'s rule says the decay constant scales roughly as',
      options: ['$E_0$', '$E_0^2$', '$E_0^{1/2}$', '$E_0^5$'], answer: 3,
      sol: 'With a constant matrix element, the rate is set by the phase space $\\int p_e^2p_\\nu^2\\,dp_e \\propto \\int_0^{E_0}E^2(E_0 - E)^2dE \\propto E_0^5$ in the relativistic limit. Doubling the endpoint shortens the half-life by about 32.',
      trap: 'The Geiger-Nuttall exponential belongs to alpha decay; beta decay has a power law.' },
    { id: 'rdk-009', type: 'mcq', level: 2, exams: ['gate', 'net'], sub: 'gamma multipoles',
      q: 'A $0^+$ excited state decays to a $0^+$ ground state. Which statement is correct?',
      options: ['It decays by an E1 photon', 'It decays by an M1 photon', 'It cannot emit a single photon; it decays by internal conversion or, if above $1.022$ MeV, by internal pair creation (E0)', 'It cannot decay at all'], answer: 2,
      sol: 'A real photon carries at least one unit of angular momentum, so $J = 0 \\to 0$ single-photon emission is strictly forbidden. The nucleus can still give its energy to an atomic electron (conversion) or create an $e^+e^-$ pair: monopole (E0) transitions. ${}^{16}$O (6.05 MeV, $0^+$) decays by pair emission.',
      trap: '"No photon" does not mean "no decay".' },
    { id: 'rdk-010', type: 'msq', level: 2, exams: ['gate', 'net'], sub: 'selection rules',
      q: 'Which beta transitions are allowed (in the technical sense: leptons with $l = 0$)?',
      options: ['$0^+ \\to 1^+$', '$\\tfrac12^+ \\to \\tfrac12^+$', '$0^+ \\to 0^-$', '$\\tfrac32^- \\to \\tfrac72^-$'], answer: [0, 1],
      sol: 'Allowed: $\\Delta J = 0, \\pm1$ and no parity change. $0^+ \\to 1^+$ is pure Gamow-Teller; $\\tfrac12^+ \\to \\tfrac12^+$ is mixed Fermi and Gamow-Teller (like the neutron). $0^+ \\to 0^-$ changes parity: first forbidden. $\\tfrac32^- \\to \\tfrac72^-$ has $\\Delta J = 2$ without parity change: second forbidden.',
      trap: 'Parity must not change in an allowed decay.' },
    { id: 'rdk-011', type: 'nat', level: 2, exams: ['gate', 'net'], sub: 'Coulomb barrier', unit: 'MeV',
      q: 'An alpha particle and a ${}^{206}$Pb nucleus ($Z = 82$) touch when their centres are $9.0$ fm apart. The Coulomb barrier height there is ______ MeV (to one decimal place). Use $e^2/4\\pi\\varepsilon_0 = 1.44$ MeV fm.',
      answer: 26.2, tol: 0.1, calc: () => 2 * 82 * 1.44 / 9,
      sol: '$B = \\dfrac{zZe^2}{4\\pi\\varepsilon_0R} = \\dfrac{2\\times82\\times1.44}{9.0} = 26.2$ MeV. The alpha from ${}^{210}$Po has only $5.3$ MeV, far below: classically it could never leave. Tunnelling explains alpha decay (Gamow, Gurney and Condon, 1928).',
      trap: 'Using $Z = 84$ (the parent): the alpha feels the daughter\u2019s charge once it has formed.' },
    { id: 'rdk-012', type: 'mcq', level: 2, exams: ['gate', 'net'], sub: 'Kurie plot',
      q: 'In a Kurie (Fermi) plot for an allowed beta decay, one plots $\\sqrt{N(p)/(p^2F(Z, p))}$ against the electron kinetic energy $T$. If the neutrino were massless, the plot would be',
      options: ['a parabola with its vertex at $T = 0$', 'a straight line meeting the axis at the endpoint $T_0$', 'an exponential decay', 'a horizontal line'], answer: 1,
      sol: 'The spectrum is $N(p) \\propto p^2F(Z, p)(T_0 - T)^2|M|^2$ for an allowed transition (constant $|M|$, massless neutrino). Dividing by $p^2F$ and taking the square root leaves $T_0 - T$: a straight line whose intercept gives $T_0$. A neutrino mass bends the line down just before the endpoint; forbidden shapes bend it elsewhere.',
      trap: 'The Fermi function $F(Z, p)$ corrects for the Coulomb attraction or repulsion of the electron by the daughter; leaving it out curves the plot.' },
    { id: 'rdk-013', type: 'mcq', level: 2, exams: ['gate', 'net'], sub: 'parity violation',
      q: 'In the 1957 experiment of Wu and collaborators, ${}^{60}$Co nuclei were polarised at low temperature. The result was that',
      options: ['the electrons came out equally along and against the nuclear spin', 'no electrons were emitted', 'the electrons were emitted preferentially opposite to the nuclear spin, showing that the weak interaction violates parity', 'the gamma rays were circularly polarised, showing that the electromagnetic interaction violates parity'], answer: 2,
      sol: 'Under parity, momentum reverses but spin (an axial vector) does not, so a correlation $\\langle\\vec J\\cdot\\vec p_e\\rangle \\ne 0$ is forbidden if parity holds. The electrons preferred the direction opposite to $\\vec J$: maximal parity violation, explained by left-handed electrons and right-handed antineutrinos.',
      trap: 'The electromagnetic gamma emission was only used to monitor the polarisation; it conserves parity.' },
    { id: 'rdk-014', type: 'nat', level: 2, exams: ['gate', 'net'], sub: 'centrifugal barrier', unit: 'MeV',
      q: 'An alpha particle emitted with orbital angular momentum $\\ell = 2$ from a nucleus leaves a ${}^{206}$Pb daughter. Using the reduced mass of $4.0026$ u and $206$ u ($1$ u $= 931.494$ MeV$/c^2$) and $R = 9.0$ fm, the centrifugal barrier $\\hbar^2\\ell(\\ell + 1)/(2\\mu R^2)$ is ______ MeV (to two decimal places). Use $\\hbar c = 197.33$ MeV fm.',
      answer: 0.39, tol: 0.01, calc: () => { const mu = 4.0026 * 206 / 210.0026 * 931.494; return 197.327 ** 2 * 6 / (2 * mu * 81); },
      sol: '$\\mu = \\dfrac{4.0026\\times206}{210.0026}$ u $= 3.926$ u $= 3657$ MeV$/c^2$. $\\dfrac{(\\hbar c)^2\\ell(\\ell + 1)}{2\\mu c^2R^2} = \\dfrac{38\\,938\\times6}{2\\times3657\\times81} = 0.39$ MeV. Small next to the 26 MeV Coulomb barrier, but it still reduces the tunnelling rate by a factor of a few.',
      trap: 'Using $\\ell^2$ instead of $\\ell(\\ell + 1)$.' },
    { id: 'rdk-015', type: 'mcq', level: 2, exams: ['gate', 'net'], sub: 'Mossbauer effect',
      q: 'The Mössbauer effect is',
      options: ['the Doppler broadening of gamma lines in hot gases', 'the scattering of gamma rays by free electrons', 'the conversion of gamma rays into electron-positron pairs', 'the emission and absorption of gamma rays without nuclear recoil energy loss, when the nucleus is bound in a crystal that takes up the momentum as a whole'], answer: 3,
      sol: 'In a lattice, there is a finite probability that no phonon is created: the recoil momentum goes to the whole crystal, whose mass is huge, so the recoil energy is negligible. The gamma line then keeps its natural width (about $5\\times10^{-9}$ eV for the 14.4 keV line of ${}^{57}$Fe) and resonant absorption works, allowing energy shifts of $10^{-13}$ of the line energy to be measured.',
      trap: 'Compton scattering and pair production are different processes entirely.' },
    { id: 'rdk-016', type: 'nat', level: 2, exams: ['gate', 'net'], sub: 'electron capture', unit: 'MeV',
      q: 'Atomic masses: ${}^7$Be $7.016929$ u, ${}^7$Li $7.016003$ u ($1$ u $= 931.494$ MeV$/c^2$). In $10\\%$ of electron captures ${}^7$Be goes to the $0.478$ MeV excited state of ${}^7$Li. Neglecting atomic binding and recoil, the neutrino energy in that branch is ______ MeV (to three decimal places).',
      answer: 0.385, tol: 0.003, calc: () => (7.016929 - 7.016003) * 931.494 - 0.478,
      sol: '$Q_{EC} = [M({}^7\\text{Be}) - M({}^7\\text{Li})]c^2 = 0.000926\\times931.494 = 0.863$ MeV. Electron capture needs no extra electron masses with atomic masses. To the excited state the neutrino gets $0.863 - 0.478 = 0.385$ MeV (the two solar ${}^7$Be neutrino lines are near $0.862$ and $0.384$ MeV).',
      trap: 'Subtracting $2m_ec^2$ as for $\\beta^+$: EC has no positron to create.' },

    // ---------- level 3 ----------
    { id: 'rdk-017', type: 'nat', level: 3, exams: ['gate', 'net'], sub: 'Weisskopf estimates', unit: '10⁹ s⁻¹',
      q: 'The Weisskopf estimate for an E2 transition is $\\lambda = 7.3\\times10^7A^{4/3}E^5$ s$^{-1}$ ($E$ in MeV). For $A = 150$ and $E = 0.50$ MeV, $\\lambda$ = ______ $\\times10^9$ s$^{-1}$ (to two decimal places).',
      answer: 1.82, tol: 0.02, calc: () => 7.3e7 * 150 ** (4 / 3) * 0.5 ** 5 / 1e9,
      sol: '$150^{4/3} = 150\\times5.313 = 796.9$; $0.5^5 = 0.03125$. $\\lambda = 7.3\\times10^7\\times796.9\\times0.03125 = 1.82\\times10^9$ s$^{-1}$, a half-life of $0.38$ ns. Collective E2 transitions in deformed nuclei are 100 or more times faster (enhanced).',
      trap: 'Using $E^3$ (dipole) instead of $E^{2L+1} = E^5$.' },
    { id: 'rdk-018', type: 'mcq', level: 3, exams: ['gate', 'net'], sub: 'Weisskopf estimates',
      q: 'For a gamma transition of about 1 MeV in a medium-mass nucleus, the Weisskopf estimates put the single-particle rates in the order',
      options: ['E1 > M1 > E2 > M2: each extra unit of $L$ costs a large factor, and M$L$ is somewhat slower than E$L$', 'M2 > E2 > M1 > E1', 'all multipoles have the same rate', 'E2 > E1 > M2 > M1'], answer: 0,
      sol: 'Rates scale as $(kR)^{2L}$ with $kR \\sim 10^{-2}$ to $10^{-1}$, so each extra unit of $L$ costs a factor of order $10^{-3}$ to $10^{-5}$. Magnetic multipoles are weaker than electric ones of the same $L$ by a factor of order $(\\hbar/m_pcR)^2 \\sim 10^{-1}$ to $10^{-2}$. Hence E1 > M1 > E2 > M2.',
      trap: 'At equal $L$ the electric multipole wins; at unequal $L$ the lower $L$ wins.' },
    { id: 'rdk-019', type: 'nat', level: 3, exams: ['gate', 'net'], sub: 'recoil', unit: 'eV',
      q: 'A beta emitter with $A = 32$ has endpoint kinetic energy $1.00$ MeV. When the electron takes almost all the energy (neutrino energy negligible), the daughter recoils with kinetic energy ______ eV (to one decimal place). Use $m_ec^2 = 0.511$ MeV and $1$ u $= 931.494$ MeV$/c^2$.',
      answer: 33.9, tol: 0.2, calc: () => 1 * 2.022 / (2 * 32 * 931.494) * 1e6,
      sol: 'Relativistic electron: $(pc)^2 = T(T + 2m_ec^2) = 1.00\\times2.022 = 2.022$ MeV$^2$. The nucleus carries the opposite momentum: $T_R = (pc)^2/(2Mc^2) = 2.022/(2\\times29\\,808)$ MeV $= 33.9$ eV.',
      trap: 'Using the non-relativistic $p^2 = 2m_eT$ underestimates $p$ by a factor of 2.' },
    { id: 'rdk-020', type: 'msq', level: 3, exams: ['gate', 'net'], sub: 'ft values',
      q: 'Which statements about comparative half-lives ($ft$ values) are correct?',
      options: ['Superallowed $0^+ \\to 0^+$ decays between isobaric analogue states all have $ft \\approx 3.1\\times10^3$ s', 'First-forbidden transitions involve a change of parity', 'A $0^+ \\to 0^+$ Gamow-Teller transition is allowed', 'The factor $f$ absorbs the strong dependence of the rate on the endpoint energy and $Z$, so $ft$ reflects the nuclear matrix element'], answer: [0, 1, 3],
      sol: '$ft = K/|M|^2$ with $f$ the phase-space integral. The superallowed values agree to $10^{-4}$ after small corrections, confirming the conserved vector current. Forbidden transitions need $l \\ge 1$ leptons, odd $l$ changing parity. GT cannot connect $0 \\to 0$. Typical $\\log ft$: 3 to 3.5 superallowed, 4 to 7 allowed, 6 to 9 first forbidden.',
      trap: 'A small $ft$ means a fast (favoured) decay, not a slow one.' },
    { id: 'rdk-021', type: 'nat', level: 3, exams: ['gate', 'net'], sub: 'ft values', unit: 's',
      q: 'A superallowed $0^+ \\to 0^+$ branch has half-life $70.6$ s for the nuclide, a branching ratio of $99.3\\%$ to the analogue state and a phase-space factor $f = 43.3$. Its $ft$ value (using the partial half-life) is ______ s (to the nearest 10 s).',
      answer: 3080, tol: 12, calc: () => 43.3 * 70.6 / 0.993,
      sol: 'Partial half-life $t = 70.6/0.993 = 71.10$ s. $ft = 43.3\\times71.10 = 3079$ s, about 3080 s: the universal value for superallowed Fermi decays.',
      trap: 'Using the total half-life instead of the partial one changes $ft$ by the branching ratio.' },
    { id: 'rdk-022', type: 'mcq', level: 3, exams: ['gate', 'net'], sub: 'Geiger-Nuttall',
      q: 'Known alpha emitters have decay energies from about $4$ MeV to $9$ MeV. Their half-lives span roughly',
      options: ['a factor of 2', 'two orders of magnitude', '24 orders of magnitude, from microseconds to $10^{10}$ years', '100 orders of magnitude'], answer: 2,
      sol: 'Example: ${}^{232}$Th ($Q = 4.08$ MeV) has $t_{1/2} = 1.4\\times10^{10}$ y $= 4\\times10^{17}$ s; ${}^{212}$Po ($Q = 8.95$ MeV) has $0.3\\ \\mu$s. That is about 24 orders of magnitude, all from the exponential sensitivity of the tunnelling factor $e^{-2G}$ to $Q$.',
      trap: 'Thinking a factor of 2 in energy gives a factor of a few in rate, as in most physics.' },
    { id: 'rdk-023', type: 'nat', level: 3, exams: ['gate', 'net'], sub: 'Geiger-Nuttall',
      q: 'Keep only the leading term of the Gamow exponent, $2G \\approx \\pi zZ\\alpha\\sqrt{2m_\\alpha c^2/T}$, with $z = 2$, daughter $Z = 86$, $m_\\alpha c^2 = 3727$ MeV and $\\alpha = 1/137.04$. Two isotopes emit alphas of $T_1 = 5.0$ MeV and $T_2 = 6.0$ MeV. Assuming equal pre-factors, $\\log_{10}(t_1/t_2)$ = ______ (to two decimal places).',
      answer: 5.76, tol: 0.03, calc: () => Math.PI * 2 * 86 / 137.036 * Math.sqrt(2 * 3727.379) * (1 / Math.sqrt(5) - 1 / Math.sqrt(6)) / Math.LN10,
      sol: '$\\pi zZ\\alpha = \\pi\\times172/137.04 = 3.943$; $\\sqrt{2m_\\alpha c^2} = 86.34$ MeV$^{1/2}$. $\\Delta(2G) = 3.943\\times86.34\\times(5^{-1/2} - 6^{-1/2}) = 340.4\\times0.03896 = 13.26$. $t \\propto e^{2G}$, so $\\log_{10}(t_1/t_2) = 13.26/2.303 = 5.76$: almost six orders of magnitude for a 20% change in energy.',
      trap: 'Dividing by $\\ln10$ is easy to forget; $e^{13.3}$ is $10^{5.8}$, not $10^{13}$.' },
    { id: 'rdk-024', type: 'mcq', level: 3, exams: ['gate', 'net'], sub: 'electron capture',
      q: 'For a proton-rich nuclide, the atomic mass difference to its isobar with $Z - 1$ is $0.80$ MeV$/c^2$. Which decay modes are possible?',
      options: ['$\\beta^+$ only', 'electron capture only', 'both $\\beta^+$ and electron capture', 'neither'], answer: 1,
      sol: 'With atomic masses, $\\beta^+$ requires $\\Delta Mc^2 > 2m_ec^2 = 1.022$ MeV (a positron created and an extra atomic electron released). Electron capture only requires $\\Delta Mc^2 > B_e$ (a few keV at most). $0.80$ MeV allows EC only.',
      trap: 'Forgetting the second electron mass and taking the threshold as 0.511 MeV.' },
    { id: 'rdk-025', type: 'nat', level: 3, exams: ['gate', 'net'], sub: 'internal conversion', unit: 'keV',
      q: 'A $661.7$ keV isomeric transition in barium is internally converted in the K shell, whose binding energy is $37.4$ keV. The conversion electrons have kinetic energy ______ keV (to one decimal place). Neglect recoil.',
      answer: 624.3, tol: 0.1, calc: () => 661.7 - 37.4,
      sol: '$T_e = E_{transition} - B_K = 661.7 - 37.4 = 624.3$ keV. L-shell electrons ($B_L \\approx 6$ keV) appear at about 656 keV. These sharp lines on top of the continuous beta spectrum of ${}^{137}$Cs are used to calibrate electron spectrometers.',
      trap: 'Adding the binding energy instead of subtracting it.' },
    { id: 'rdk-026', type: 'msq', level: 3, exams: ['gate', 'net'], sub: 'gamma multipoles',
      q: 'Which multipoles can contribute to a gamma transition from a $\\tfrac32^-$ level to a $\\tfrac12^+$ level?',
      options: ['E1', 'M1', 'E2', 'M2'], answer: [0, 3],
      sol: '$L$ runs from $|\\tfrac32 - \\tfrac12| = 1$ to $2$. Parity changes. E$L$ has parity $(-1)^L$: E1 changes parity (allowed), E2 does not (forbidden). M$L$ has parity $(-1)^{L+1}$: M1 does not change parity (forbidden), M2 does (allowed). So E1 and M2, with E1 dominant.',
      trap: 'Magnetic multipoles have the opposite parity rule to electric ones.' },
    { id: 'rdk-027', type: 'mcq', level: 3, exams: ['gate', 'net'], sub: 'Mossbauer effect',
      q: 'The $14.4$ keV level of ${}^{57}$Fe has mean life $141$ ns. Its natural line width $\\Gamma = \\hbar/\\tau$ is about ($\\hbar = 6.58\\times10^{-16}$ eV s)',
      options: ['$4.7\\times10^{-9}$ eV', '$4.7\\times10^{-6}$ eV', '$1.9\\times10^{-3}$ eV', '$6.6\\times10^{-16}$ eV'], answer: 0,
      sol: '$\\Gamma = 6.58\\times10^{-16}/1.41\\times10^{-7} = 4.7\\times10^{-9}$ eV, so $\\Gamma/E = 3.2\\times10^{-13}$. Free-atom recoil ($E^2/2Mc^2 = 1.95\\times10^{-3}$ eV) is $4\\times10^5$ times larger than this width, hence the need for recoil-free emission.',
      trap: 'The $1.9\\times10^{-3}$ eV option is the free recoil energy, not the width.' },
    { id: 'rdk-028', type: 'nat', level: 3, exams: ['gate', 'net'], sub: 'Mossbauer effect', unit: 'mm/s',
      q: 'To shift the $14.4$ keV Mössbauer line of ${}^{57}$Fe ($\\Gamma = 4.67\\times10^{-9}$ eV) by one line width with the Doppler effect, the source must move at ______ mm/s (to three decimal places).',
      answer: 0.097, tol: 0.002, calc: () => 2.99792458e8 * 4.67e-9 / 14400 * 1000,
      sol: '$\\Delta E/E = v/c$, so $v = c\\Gamma/E = 3.00\\times10^8\\times4.67\\times10^{-9}/1.44\\times10^4 = 9.7\\times10^{-5}$ m/s $= 0.097$ mm/s. Mössbauer spectrometers sweep a few mm/s, enough to map hyperfine splittings and chemical (isomer) shifts.',
      trap: 'Using the recoil energy in place of the width.' },

    // ---------- level 4 ----------
    { id: 'rdk-029', type: 'nat', level: 4, exams: ['gate', 'net'], sub: 'Gamow factor',
      q: 'An alpha particle of kinetic energy $Q = 6.0$ MeV tunnels from radius $R = 9.0$ fm through the Coulomb barrier of a daughter with $Z = 82$. The Gamow exponent is $2G = \\dfrac{2\\sqrt{2mQ}}{\\hbar}\\,b\\left[\\arccos\\sqrt x - \\sqrt{x(1 - x)}\\right]$ with $b = zZe^2/(4\\pi\\varepsilon_0Q)$ and $x = R/b$. With $mc^2 = 3727$ MeV, $\\hbar c = 197.33$ MeV fm and $e^2/4\\pi\\varepsilon_0 = 1.44$ MeV fm, $2G$ = ______ (to one decimal place).',
      answer: 55.0, tol: 0.2, calc: () => twoG(82, 6, 9),
      sol: '$b = 2\\times82\\times1.44/6.0 = 39.36$ fm (the classical turning point); $x = 9.0/39.36 = 0.2287$. Bracket: $\\arccos(0.4782) - \\sqrt{0.2287\\times0.7713} = 1.0721 - 0.4200 = 0.6522$. $\\sqrt{2mc^2Q}/\\hbar c = \\sqrt{44\\,729}/197.33 = 1.0718$ fm$^{-1}$. $2G = 2\\times1.0718\\times39.36\\times0.6522 = 55.0$, so the transmission per hit is $e^{-55} \\approx 10^{-24}$.',
      trap: 'Using the barrier height $B$ instead of $Q$ in $b$, or leaving out the factor 2 in $2G$.' },
    { id: 'rdk-030', type: 'msq', level: 4, exams: ['gate', 'net'], sub: 'neutrinos',
      q: 'Which statements about neutrinos in nuclear beta processes are correct?',
      options: ['Antineutrinos from $\\beta^-$ decay are right-handed (positive helicity)', 'The shape of the beta spectrum just below the endpoint is sensitive to the neutrino mass', 'The neutrino from electron capture has a continuous energy spectrum', 'Parity is maximally violated in these weak decays'], answer: [0, 1, 3],
      sol: 'The V$-$A weak current produces left-handed neutrinos and right-handed antineutrinos (measured by Goldhaber et al. 1958). A non-zero mass removes the last $m_\\nu c^2$ of the spectrum and changes its shape near the endpoint (tritium experiments such as KATRIN). EC is a two-body decay with a sharp neutrino line.',
      trap: 'Continuous spectra need three bodies in the final state.' },
    { id: 'rdk-031', type: 'nat', level: 4, exams: ['gate', 'net'], sub: 'isomers', unit: '10¹⁰ s',
      q: 'The Weisskopf estimate for an M4 transition is $\\lambda = 4.5\\times10^{-6}A^2E^9$ s$^{-1}$ ($E$ in MeV). For $A = 90$ and $E = 0.100$ MeV, ignoring internal conversion, the gamma half-life is ______ $\\times10^{10}$ s (to two decimal places).',
      answer: 1.90, tol: 0.02, calc: () => Math.LN2 / (4.5e-6 * 8100 * 1e-9) / 1e10,
      sol: '$\\lambda = 4.5\\times10^{-6}\\times8100\\times10^{-9} = 3.65\\times10^{-11}$ s$^{-1}$, so $t_{1/2} = 0.693/\\lambda = 1.90\\times10^{10}$ s, about 600 years. Real M4 isomers near $A = 90$ live much less (hours to years), partly because internal conversion is strong for low-energy, high-multipole transitions.',
      trap: 'Getting $E^9 = 10^{-9}$ wrong by an order of magnitude ruins the answer.' },
    { id: 'rdk-032', type: 'mcq', level: 4, exams: ['gate', 'net'], sub: 'selection rules',
      q: 'A beta transition $2^- \\to 0^+$ (as in ${}^{90}$Y $\\to {}^{90}$Zr) is classified as',
      options: ['allowed Gamow-Teller', 'first forbidden non-unique', 'second forbidden', 'unique first forbidden, with a characteristic non-statistical spectrum shape'], answer: 3,
      sol: 'Parity changes, so the leptons carry odd $l$: first forbidden. With $\\Delta J = 2$ the only way is $l = 1$ coupled with $S = 1$ to the maximum $L = 2$: a single (unique) matrix element, and the spectrum shape factor is $\\propto p_e^2 + p_\\nu^2$, recognisable in the Kurie plot. ${}^{90}$Y is a classic example.',
      trap: 'First forbidden with $\\Delta J = 0, 1$ is non-unique; $\\Delta J = 2$ with a parity change is unique.' },
    { id: 'rdk-033', type: 'mcq', level: 4, exams: ['gate', 'net'], sub: 'ft values',
      q: 'An allowed transition has $\\log_{10}ft = 5.0$ (with $t$ in seconds) and $f = 200$. If it is the only decay branch, the half-life is',
      options: ['$500$ s', '$2.0\\times10^7$ s', '$25$ s', '$5.0\\times10^{3}$ s'], answer: 0,
      sol: '$ft = 10^5$ s, so $t = 10^5/200 = 500$ s. Typical allowed transitions have $\\log ft$ from 4 to 7; changing $\\log ft$ by one changes the half-life by a factor of 10.',
      trap: 'Multiplying by $f$ instead of dividing.' },
    { id: 'rdk-034', type: 'mcq', level: 4, exams: ['gate', 'net'], sub: 'alpha decay',
      q: 'Even-even alpha emitters decay mostly to the $0^+$ ground state of the daughter, with smaller branches to the $2^+$ and $4^+$ levels. The main reasons are',
      options: ['the alpha particle has spin 1', 'transitions to excited levels have less kinetic energy and require $\\ell > 0$, which adds a centrifugal barrier; both reduce tunnelling', 'the excited levels have the wrong isospin', 'the strong force forbids $\\ell > 0$'], answer: 1,
      sol: 'A $0^+ \\to 2^+$ alpha decay needs $\\ell = 2$ (the alpha has spin 0, and parity $(-1)^\\ell$ must be +). It also has less energy by the excitation energy. Both thicken the barrier; since $e^{-2G}$ is so sensitive, the branches fall steeply: for ${}^{238}$U, 79% to $0^+$, 21% to $2^+$, about 0.08% to $4^+$.',
      trap: 'The alpha particle has spin 0, so all its angular momentum is orbital.' },
    { id: 'rdk-035', type: 'nat', level: 4, exams: ['gate', 'net'], sub: 'alpha decay',
      q: 'An odd-$A$ alpha emitter with ground state $\\tfrac72^-$ decays to a daughter level with $\\tfrac32^+$. The lowest orbital angular momentum $\\ell$ the alpha particle can carry is ______.',
      answer: 3, tol: 0, calc: () => 3,
      sol: 'Angular momentum: $|\\tfrac72 - \\tfrac32| = 2 \\le \\ell \\le 5$. Parity: $\\pi_i = \\pi_f(-1)^\\ell$, and the parity changes, so $\\ell$ must be odd. The smallest odd value in 2 to 5 is $\\ell = 3$.',
      trap: 'Taking $\\ell = |\\Delta J| = 2$ without checking parity.' },
    { id: 'rdk-036', type: 'mcq', level: 4, exams: ['gate', 'net'], sub: 'double beta decay',
      q: 'If neutrinoless double beta decay $(Z, A) \\to (Z + 2, A) + 2e^-$ were observed, it would show that',
      options: ['neutrinos are massless', 'baryon number is violated', 'lepton number is violated by two units and the neutrino is its own antiparticle (a Majorana particle)', 'charge is not conserved'], answer: 2,
      sol: 'The final state has two electrons and no antineutrinos: total lepton number changes from 0 to 2. The usual mechanism needs a virtual neutrino emitted as an antineutrino and absorbed as a neutrino, possible only if they are the same particle with non-zero mass. Charge ($Z \\to Z + 2$ plus $2e^-$) and baryon number are conserved.',
      trap: 'The two-neutrino mode conserves lepton number; only the neutrinoless mode breaks it.' },

    // ---------- level 5 ----------
    { id: 'rdk-037', type: 'nat', level: 5, exams: ['gate', 'net'], sub: 'Gamow factor',
      q: 'Using the full Gamow exponent of the previous problems ($z = 2$, $Z = 82$, $R = 9.0$ fm, $m_\\alpha c^2 = 3727$ MeV), compare $Q = 6.0$ MeV with $Q = 6.5$ MeV. $\\log_{10}$ of the ratio of transmission probabilities $T(6.5)/T(6.0)$ is ______ (to two decimal places).',
      answer: 2.14, tol: 0.03, calc: () => (twoG(82, 6, 9) - twoG(82, 6.5, 9)) / Math.LN10,
      sol: 'At $Q = 6.0$: $2G = 55.03$. At $Q = 6.5$: $b = 36.33$ fm, $x = 0.2477$, bracket $= \\arccos(0.4977) - \\sqrt{0.2477\\times0.7523} = 1.0498 - 0.4317 = 0.6181$, $\\sqrt{2mc^2Q}/\\hbar c = 1.1156$ fm$^{-1}$, $2G = 2\\times1.1156\\times36.33\\times0.6181 = 50.11$. Difference $4.92$, so the ratio is $e^{4.92} = 10^{2.14}$: an 8% increase in $Q$ speeds the decay about 140 times.',
      trap: 'Comparing $G$ instead of $2G$ halves the exponent.' },
    { id: 'rdk-038', type: 'msq', level: 5, exams: ['gate', 'net'], sub: 'gamma multipoles',
      q: 'Which statements about electromagnetic transitions in nuclei are correct?',
      options: ['E0 transitions cannot proceed by single-photon emission', 'For the same $L$ and energy, magnetic transitions are usually slower than electric ones', 'The internal conversion coefficient grows with $Z$ and with multipolarity, and falls with transition energy', 'An M1 transition changes the parity of the nucleus'], answer: [0, 1, 2],
      sol: 'Photons have $L \\ge 1$, so E0 goes only by conversion or pair creation. Magnetic rates are smaller by roughly $10(\\hbar/m_pcR)^2$. Conversion grows with the overlap of electron wavefunctions with the nucleus (higher $Z$), with $L$ (gamma rates fall faster than conversion rates) and at low energy. M1 has parity $(-1)^{L+1} = +$: no change.',
      trap: 'Remember E$L$: $(-1)^L$; M$L$: $(-1)^{L+1}$.' },
    { id: 'rdk-039', type: 'nat', level: 5, exams: ['gate', 'net'], sub: 'kinematics', unit: 'eV',
      q: 'A free neutron at rest decays, $n \\to p + e^- + \\bar\\nu_e$, with $m_nc^2 = 939.5654$ MeV, $m_pc^2 = 938.2721$ MeV, $m_ec^2 = 0.5110$ MeV and a massless antineutrino. The maximum kinetic energy the proton can have is ______ eV (to the nearest eV).',
      answer: 751, tol: 2, calc: () => { const mn = 939.5654, mp = 938.2721, me = 0.511; const p = Math.sqrt((mn ** 2 - (mp + me) ** 2) * (mn ** 2 - (mp - me) ** 2)) / (2 * mn); return (Math.hypot(p, mp) - mp) * 1e6; },
      sol: 'The proton recoils hardest when the electron and antineutrino move together with the smallest possible invariant mass, $m_e$ (antineutrino energy tending to zero). Then it is a two-body decay $n \\to p + X$ with $m_X = m_e$: $p^*c = \\dfrac{\\sqrt{[m_n^2 - (m_p + m_e)^2][m_n^2 - (m_p - m_e)^2]}}{2m_n}c^2 = \\dfrac{\\sqrt{1469.4\\times3387.3}}{1879.13} = 1.187$ MeV. $T_p = (p^*c)^2/2m_pc^2 = 1.4096/1876.54$ MeV $= 751$ eV.',
      trap: 'Giving all of $Q = 0.782$ MeV to the proton ignores momentum conservation.' },
    { id: 'rdk-040', type: 'nat', level: 5, exams: ['gate', 'net'], sub: 'Mossbauer effect', unit: '10⁻³',
      q: 'In a Pound-Rebka type experiment, $14.4$ keV gamma rays of ${}^{57}$Fe (line width $4.67\\times10^{-9}$ eV) rise $22.5$ m in Earth\'s gravity ($g = 9.80$ m/s$^2$). The gravitational frequency shift, expressed as a fraction of the line width, is ______ $\\times10^{-3}$ (to two decimal places).',
      answer: 7.56, tol: 0.05, calc: () => 9.8 * 22.5 / 2.99792458e8 ** 2 * 14400 / 4.67e-9 * 1000,
      sol: '$\\Delta E/E = gh/c^2 = 9.80\\times22.5/(8.988\\times10^{16}) = 2.453\\times10^{-15}$. $\\Delta E = 2.453\\times10^{-15}\\times14\\,400$ eV $= 3.53\\times10^{-11}$ eV, which is $3.53\\times10^{-11}/4.67\\times10^{-9} = 7.56\\times10^{-3}$ of the width. Measuring such a tiny fraction needed careful modulation and averaging: it was done in 1960 to 10%.',
      trap: 'Comparing $gh/c^2$ directly with $\\Gamma$ in eV without multiplying by $E$.' },
    { id: 'rdk-041', type: 'msq', level: 2, exams: ['gate', 'net'], sub: 'gamma decay',
      q: 'An excited nucleus returns to its ground state without changing $Z$ or $A$. Which of these can be emitted?',
      options: ['a gamma-ray photon', 'an internal-conversion electron', 'an electron-positron pair, if the transition energy exceeds $1.022$ MeV', 'an alpha particle'], answer: [0, 1, 2],
      sol: 'Electromagnetic de-excitation can go by photon emission, by giving the energy to an atomic electron (conversion), or by internal pair creation above $2m_ec^2$. Alpha emission changes both $Z$ and $A$.',
      trap: 'Internal conversion and pair creation are electromagnetic too; they do not change the nucleus\u2019s composition.' },
    { id: 'rdk-042', type: 'msq', level: 3, exams: ['gate', 'net'], sub: 'alpha decay',
      q: 'Which statements about alpha decay are correct?',
      options: ['The alpha kinetic energy is slightly less than $Q$, because the daughter recoils', 'Alpha spectra consist of discrete lines, sometimes several (fine structure), one for each daughter level reached', 'Alpha decay is energetically allowed for most nuclei with $A \\gtrsim 150$, but is observed only where the half-life is not astronomically long', 'The alpha particle has more kinetic energy than the height of the Coulomb barrier'], answer: [0, 1, 2],
      sol: 'Momentum sharing gives $T_\\alpha = Q(A - 4)/A$. Each final level gives a line. $Q_\\alpha > 0$ for most heavy nuclei, but with small $Q$ the half-life exceeds the age of the universe. The alpha energy (4 to 9 MeV) is far below the barrier (about 25 MeV): it escapes by tunnelling.',
      trap: 'If the alpha were above the barrier, decay would take about $10^{-21}$ s.' },
  ],
  gens: [
    { id: 'rdk-g01', type: 'nat', level: 3, exams: ['gate', 'net'], sub: 'Weisskopf estimates',
      make(r) {
        const mp = choose(r, Object.keys(WK)), A = int(r, 20, 240), E = pick(r, 0.1, 2.0, 0.05), lam = WK[mp](A, E), lg = Math.log10(lam);
        return { q: `The Weisskopf estimate for an ${mp} transition is $\\lambda = ${WKTXT[mp]}$ s$^{-1}$ ($E$ in MeV). For $A = ${A}$ and $E = ${E}$ MeV, $\\log_{10}(\\lambda/\\text{s}^{-1})$ = ______ (to two decimal places).`,
          answer: round(lg, 2), tol: 0.02, mp, A, E,
          sol: `Substitute $A = ${A}$ and $E = ${E}$ MeV into $\\lambda = ${WKTXT[mp]}$: $\\lambda = ${(lam / 10 ** Math.floor(lg)).toFixed(3)}\\times10^{${Math.floor(lg)}}$ s$^{-1}$, so $\\log_{10}\\lambda = ${round(lg, 2)}$ and $t_{1/2} = 0.693/\\lambda$.`,
          trap: 'The energy power is $2L + 1$: 3 for dipoles, 5 for quadrupoles, 7 for octupoles.' };
      },
      verify: (p) => Math.log10(WK[p.mp](p.A, p.E)) },
    { id: 'rdk-g02', type: 'mcq', level: 2, exams: ['gate', 'net'], sub: 'gamma multipoles',
      make(r) {
        const ji = int(r, 0, 9), jf = int(r, ji === 0 ? 1 : 0, 9), half = r() < 0.5, pi = r() < 0.5 ? 1 : -1, pf = r() < 0.5 ? 1 : -1;
        const j2i = half ? 2 * ji + 1 : 2 * ji, j2f = half ? 2 * jf + 1 : 2 * jf;
        const L = Math.max(1, Math.abs(j2i - j2f) / 2), change = pi !== pf;
        const type = (L % 2 === 1) === change ? 'E' : 'M', ans = `${type}${L}`;
        const wr = [`${type === 'E' ? 'M' : 'E'}${L}`, `${type}${L + 1}`, `${type === 'E' ? 'M' : 'E'}${L + 1}`, L > 1 ? `${type}${L - 1}` : 'E0', L > 1 ? `${type === 'E' ? 'M' : 'E'}${L - 1}` : 'M0'];
        const o = mcqOptions(r, ans, wr.filter((w) => w !== ans));
        return { q: `The lowest (usually dominant) multipole for a gamma transition from a $${st(j2i, pi)}$ level to a $${st(j2f, pf)}$ level is`, ...o,
          sol: `$L \\ge |J_i - J_f| = ${Math.abs(j2i - j2f) / 2}$ and $L \\ge 1$ (no monopole photons), so $L = ${L}$. Parity ${change ? 'changes' : 'does not change'}. E$L$ has parity $(-1)^L$, M$L$ has $(-1)^{L+1}$: for $L = ${L}$, ${change ? 'a change' : 'no change'} means ${ans}.${L > 1 ? '' : ' (E2 or M2 admixtures may follow, much weaker.)'}`,
          trap: 'Using the electric parity rule for magnetic multipoles.', L, type };
      } },
    { id: 'rdk-g03', type: 'nat', level: 1, exams: ['gate', 'net'], sub: 'recoil',
      make(r) {
        const E = pick(r, 0.05, 3.0, 0.01), A = int(r, 10, 240), T = E * E / (2 * A * U) * 1e6;
        return { q: `A free nucleus of mass $${A}$ u at rest emits a gamma ray of $${E}$ MeV. Its recoil energy is ______ eV (to three significant figures). Use $1$ u $= 931.494$ MeV$/c^2$.`,
          answer: +T.toPrecision(3), tol: +(T * 0.008).toPrecision(2), unit: 'eV', E, A,
          sol: `$T_R = E_\\gamma^2/(2Mc^2) = ${E}^2/(2\\times${round(A * U, 1)})$ MeV $= ${T.toPrecision(3)}$ eV.`,
          trap: 'Forgetting the factor 2, or the conversion from MeV to eV.' };
      },
      verify: (p) => p.E * p.E / (2 * p.A * U) * 1e6 },
    { id: 'rdk-g04', type: 'nat', level: 2, exams: ['gate', 'net'], sub: 'Coulomb barrier',
      make(r) {
        const Zd = int(r, 60, 98), Ad = Math.round(Zd * 2.5), r0 = choose(r, [1.2, 1.3, 1.4, 1.5]), R = r0 * (Math.cbrt(Ad) + Math.cbrt(4)), B = 2 * Zd * KE2 / R;
        return { q: `Estimate the Coulomb barrier for an alpha particle leaving a daughter with $Z = ${Zd}$, $A = ${Ad}$, taking the touching distance $R = ${r0}(A_d^{1/3} + 4^{1/3})$ fm. $B$ = ______ MeV (to one decimal place). Use $e^2/4\\pi\\varepsilon_0 = 1.44$ MeV fm.`,
          answer: round(B, 1), tol: 0.1, unit: 'MeV', Zd, Ad, r0,
          sol: `$R = ${r0}\\times(${round(Math.cbrt(Ad), 3)} + 1.587) = ${round(R, 3)}$ fm. $B = 2\\times${Zd}\\times1.44/${round(R, 3)} = ${round(B, 1)}$ MeV, several times the alpha energies actually observed.`,
          trap: 'Using the parent charge, or only the daughter radius.' };
      },
      verify: (p) => 2 * p.Zd * KE2 / (p.r0 * (Math.cbrt(p.Ad) + Math.cbrt(4))) },
    { id: 'rdk-g05', type: 'nat', level: 4, exams: ['gate', 'net'], sub: 'Gamow factor',
      make(r) {
        const Z = int(r, 78, 96), Q = pick(r, 4.0, 9.0, 0.1), R = pick(r, 8.0, 10.0, 0.5), G = twoG(Z, Q, R);
        return { q: `Find the Gamow exponent $2G = \\dfrac{2\\sqrt{2mQ}}{\\hbar}b\\left[\\arccos\\sqrt x - \\sqrt{x(1 - x)}\\right]$, $b = \\dfrac{2Ze^2}{4\\pi\\varepsilon_0Q}$, $x = R/b$, for an alpha particle ($mc^2 = 3727$ MeV) with $Q = ${Q}$ MeV leaving a daughter of $Z = ${Z}$ from $R = ${R}$ fm. $2G$ = ______ (to one decimal place). Use $\\hbar c = 197.33$ MeV fm, $e^2/4\\pi\\varepsilon_0 = 1.44$ MeV fm.`,
          answer: round(G, 1), tol: Math.max(0.2, round(G * 0.004, 2)), Z, Q, R,
          sol: `$b = ${round(2 * Z * KE2 / Q, 3)}$ fm, $x = ${round(R * Q / (2 * Z * KE2), 4)}$. Bracket $= ${round(Math.acos(Math.sqrt(R * Q / (2 * Z * KE2))) - Math.sqrt(R * Q / (2 * Z * KE2) * (1 - R * Q / (2 * Z * KE2))), 4)}$. $\\sqrt{2mc^2Q}/\\hbar c = ${round(Math.sqrt(2 * MA * Q) / HBARC, 4)}$ fm$^{-1}$. $2G = ${round(G, 1)}$, transmission $e^{-2G} \\approx 10^{-${round(G / Math.LN10, 1)}}$.`,
          trap: 'Using $Z$ of the parent, or forgetting the factor 2 in $2G$.' };
      },
      verify: (p) => twoG(p.Z, p.Q, p.R) },
    { id: 'rdk-g06', type: 'nat', level: 2, exams: ['gate', 'net'], sub: 'internal conversion',
      make(r) {
        const a = pick(r, 0.02, 5.0, 0.01), mode = choose(r, ['frac', 'tau']), tau = pick(r, 0.5, 50, 0.5);
        const val = mode === 'frac' ? 100 / (1 + a) : tau * (1 + a);
        return { q: mode === 'frac' ? `A level decays by gamma emission and internal conversion with total conversion coefficient $\\alpha = ${a}$. The percentage of decays giving a gamma ray is ______ % (to one decimal place).` : `A nuclear level has a measured mean life of $${tau}$ ns and a total conversion coefficient $\\alpha = ${a}$. The partial mean life for gamma emission alone is ______ ns (to two decimal places).`,
          answer: round(val, mode === 'frac' ? 1 : 2), tol: mode === 'frac' ? 0.1 : Math.max(0.01, round(val * 0.002, 3)), a, mode, tau,
          sol: mode === 'frac' ? `$\\lambda = \\lambda_\\gamma + \\lambda_e = \\lambda_\\gamma(1 + \\alpha)$, so the gamma fraction is $1/(1 + \\alpha) = 1/${round(1 + a, 2)} = ${round(val, 1)}\\%$.` : `$\\lambda_\\gamma = \\lambda/(1 + \\alpha)$, so $\\tau_\\gamma = \\tau(1 + \\alpha) = ${tau}\\times${round(1 + a, 2)} = ${round(val, 2)}$ ns. Compare $\\tau_\\gamma$ (not $\\tau$) with Weisskopf estimates.`,
          trap: '$\\alpha$ is a ratio of rates, not a fraction of all decays.' };
      },
      verify: (p) => (p.mode === 'frac' ? 100 / (1 + p.a) : p.tau * (1 + p.a)) },
    { id: 'rdk-g07', type: 'nat', level: 3, exams: ['gate', 'net'], sub: 'ft values',
      make(r) {
        const f = +(10 ** pick(r, 0.5, 4.5, 0.05)).toPrecision(3), t = +(10 ** pick(r, -1, 6, 0.05)).toPrecision(3), br = pick(r, 0.05, 1, 0.01), lft = Math.log10(f * t / br);
        return { q: `A beta branch has phase-space factor $f = ${f}$; the nuclide has half-life $${t}$ s and this branch takes $${round(br * 100, 0)}\\%$ of decays. $\\log_{10}(ft)$ (partial half-life, $t$ in s) = ______ (to two decimal places).`,
          answer: round(lft, 2), tol: 0.02, f, t, br,
          sol: `Partial half-life $t_p = ${t}/${br} = ${(t / br).toPrecision(4)}$ s. $ft = ${f}\\times${(t / br).toPrecision(4)} = ${(f * t / br).toPrecision(4)}$ s, $\\log ft = ${round(lft, 2)}$${lft < 3.8 ? ' (superallowed range)' : lft < 6 ? ' (typical allowed)' : lft < 9 ? ' (allowed or first forbidden range)' : ' (forbidden range)'}.`,
          trap: 'Forgetting to divide the half-life by the branching ratio.' };
      },
      verify: (p) => Math.log10(p.f * p.t / p.br) },
    { id: 'rdk-g08', type: 'mcq', level: 3, exams: ['gate', 'net'], sub: 'selection rules',
      make(r) {
        const kind = int(r, 0, 3), half = r() < 0.5, ji = int(r, 0, 5), pi = r() < 0.5 ? 1 : -1;
        const dJ = kind <= 1 ? int(r, 0, 1) : 2, change = kind === 1 || kind === 2, up = r() < 0.5 || ji < dJ;
        const jf = up ? ji + dJ : ji - dJ, pf = change ? -pi : pi;
        const opts = ['allowed', 'first forbidden (non-unique)', 'unique first forbidden', 'second forbidden'];
        const j2 = (j) => (half ? 2 * j + 1 : 2 * j);
        return { q: `A beta transition goes from a $${st(j2(ji), pi)}$ state to a $${st(j2(jf), pf)}$ state. It is classified as`, options: opts, answer: kind,
          sol: `$\\Delta J = ${dJ}$, parity ${change ? 'changes' : 'unchanged'}. Allowed: $\\Delta J = 0, 1$, no parity change. First forbidden: $\\Delta J = 0, 1$ (non-unique) or $2$ (unique), with parity change. $\\Delta J = 2$ without parity change needs $l = 2$: second forbidden. So: ${opts[kind]}.`,
          trap: 'Only a parity change with $\\Delta J = 2$ is unique first forbidden.', kind };
      } },
    { id: 'rdk-g09', type: 'nat', level: 3, exams: ['gate', 'net'], sub: 'alpha decay',
      make(r) {
        const half = r() < 0.5, ji = int(r, 0, 6), jf = int(r, 0, 6), change = r() < 0.5;
        const j2i = half ? 2 * ji + 1 : 2 * ji, j2f = half ? 2 * jf + 1 : 2 * jf, lo = Math.abs(j2i - j2f) / 2, hi = (j2i + j2f) / 2;
        let l = (lo % 2 === 1) === change ? lo : lo + 1;
        const ok = l <= hi;
        if (!ok) l = -1;
        const pi = 1, pf = change ? -1 : 1;
        return { q: `An alpha decay goes from a $${st(j2i, pi)}$ parent state to a $${st(j2f, pf)}$ daughter state. The lowest orbital angular momentum $\\ell$ the alpha can carry is ______ (enter $-1$ if the decay is forbidden).`,
          answer: l, tol: 0, j2i, j2f, change,
          sol: `The alpha has spin 0, so $\\ell$ must satisfy $${lo} \\le \\ell \\le ${hi}$ and $(-1)^\\ell = \\pi_i\\pi_f = ${change ? '-1' : '+1'}$ (${change ? 'odd' : 'even'} $\\ell$). ${ok ? `The smallest such value is $\\ell = ${l}$.` : 'No value satisfies both, so the decay is forbidden (answer $-1$).'}`,
          trap: 'Ignoring the parity condition and answering $|J_i - J_f|$.' };
      },
      verify: (p) => { const lo = Math.abs(p.j2i - p.j2f) / 2, hi = (p.j2i + p.j2f) / 2; for (let l = lo; l <= hi; l++) if ((l % 2 === 1) === p.change) return l; return -1; } },
    { id: 'rdk-g10', type: 'nat', level: 3, exams: ['gate', 'net'], sub: 'Mossbauer effect',
      make(r) {
        const ISO = [['${}^{57}$Fe', 14.41, 98.3], ['${}^{119}$Sn', 23.87, 17.8], ['${}^{151}$Eu', 21.54, 9.6], ['${}^{197}$Au', 77.35, 1.91], ['${}^{161}$Dy', 25.65, 29.1], ['${}^{125}$Te', 35.49, 1.48]];
        const [n, E, th] = choose(r, ISO), mode = choose(r, ['width', 'v']);
        const tau = th * 1e-9 / Math.LN2, G = HBAR_EVS / tau, v = CL * G / (E * 1e3) * 1000;
        return { q: mode === 'width' ? `The ${E} keV Mössbauer level of ${n} has half-life $${th}$ ns. Its natural line width $\\Gamma$ is ______ $\\times10^{-9}$ eV (to two decimal places). Use $\\hbar = 6.582\\times10^{-16}$ eV s.` : `The ${E} keV Mössbauer level of ${n} has half-life $${th}$ ns. The source speed that Doppler-shifts the line by one natural width is ______ mm/s (to three decimal places). Use $\\hbar = 6.582\\times10^{-16}$ eV s.`,
          answer: mode === 'width' ? round(G * 1e9, 2) : round(v, 3), tol: mode === 'width' ? Math.max(0.01, round(G * 1e9 * 0.004, 3)) : Math.max(0.001, round(v * 0.004, 4)), E, th, mode,
          sol: `Mean life $\\tau = t_{1/2}/\\ln2 = ${round(tau * 1e9, 2)}$ ns, so $\\Gamma = \\hbar/\\tau = ${round(G * 1e9, 2)}\\times10^{-9}$ eV.${mode === 'v' ? ` Then $v = c\\Gamma/E = 2.998\\times10^8\\times${round(G * 1e9, 3)}\\times10^{-9}/${E * 1000} = ${round(v, 3)}$ mm/s.` : ''}`,
          trap: 'Using the half-life directly as the mean life.' };
      },
      verify: (p) => { const G = HBAR_EVS / (p.th * 1e-9 / Math.LN2); return p.mode === 'width' ? G * 1e9 : CL * G / (p.E * 1e3) * 1000; } },
    { id: 'rdk-g11', type: 'nat', level: 2, exams: ['gate', 'net'], sub: 'electron capture',
      make(r) {
        const dM = pick(r, 1.2, 6.0, 0.01), BK = pick(r, 0.005, 0.09, 0.001), Ex = choose(r, [0, 0, pick(r, 0.1, 1.0, 0.01)]), mode = choose(r, ['bp', 'ec']);
        const val = mode === 'bp' ? dM - Ex - 1.022 : dM - Ex - BK;
        return { q: `The atomic masses of a parent and its isobar with one less proton differ by $${dM}$ MeV$/c^2$. For the branch to the daughter level at $${Ex}$ MeV, ${mode === 'bp' ? 'the maximum positron kinetic energy in $\\beta^+$ decay' : `the neutrino energy in K-electron capture (K binding $${BK}$ MeV)`} is ______ MeV (to three decimal places). Neglect recoil; $m_ec^2 = 0.511$ MeV.`,
          answer: round(val, 3), tol: 0.002, unit: 'MeV', dM, BK, Ex, mode,
          sol: mode === 'bp' ? `With atomic masses, $\\beta^+$ must create a positron and leave a spare atomic electron: endpoint $= \\Delta Mc^2 - E_x - 2m_ec^2 = ${dM} - ${Ex} - 1.022 = ${round(val, 3)}$ MeV.` : `EC is two-body: $E_\\nu = \\Delta Mc^2 - E_x - B_K = ${dM} - ${Ex} - ${BK} = ${round(val, 3)}$ MeV, a single line.`,
          trap: mode === 'bp' ? 'Subtracting only one electron mass.' : 'Subtracting electron masses for electron capture.' };
      },
      verify: (p) => (p.mode === 'bp' ? p.dM - p.Ex - 1.022 : p.dM - p.Ex - p.BK) },
    { id: 'rdk-g12', type: 'nat', level: 3, exams: ['gate', 'net'], sub: 'Geiger-Nuttall',
      make(r) {
        const Z = int(r, 80, 96), T1 = pick(r, 4.0, 6.5, 0.1), T2 = round(T1 + pick(r, 0.3, 2.0, 0.1), 1);
        const d = Math.PI * 2 * Z * ALPHA * Math.sqrt(2 * MA) * (1 / Math.sqrt(T1) - 1 / Math.sqrt(T2)) / Math.LN10;
        return { q: `Using only the leading Gamow term $2G \\approx \\pi zZ\\alpha\\sqrt{2m_\\alpha c^2/T}$ ($z = 2$, daughter $Z = ${Z}$, $m_\\alpha c^2 = 3727$ MeV, $\\alpha = 1/137.04$) and equal pre-factors, find $\\log_{10}(t_1/t_2)$ for alpha energies $T_1 = ${T1}$ MeV and $T_2 = ${T2}$ MeV (to two decimal places).`,
          answer: round(d, 2), tol: Math.max(0.02, round(d * 0.004, 3)), Z, T1, T2,
          sol: `$\\pi zZ\\alpha\\sqrt{2m_\\alpha c^2} = ${round(Math.PI * 2 * Z * ALPHA * Math.sqrt(2 * MA), 2)}$ MeV$^{1/2}$. $T_1^{-1/2} - T_2^{-1/2} = ${round(1 / Math.sqrt(T1) - 1 / Math.sqrt(T2), 5)}$. $\\Delta(2G) = ${round(d * Math.LN10, 3)}$; divide by $\\ln10$: $${round(d, 2)}$.`,
          trap: 'Forgetting to convert from natural log to base 10.' };
      },
      verify: (p) => Math.PI * 2 * p.Z * ALPHA * Math.sqrt(2 * MA) * (1 / Math.sqrt(p.T1) - 1 / Math.sqrt(p.T2)) / Math.LN10 },
    ...more,
  ],
};
