// Magnetism of solids at MSc level: Langevin diamagnetism, Hund's rules, Landé g and effective moments, quenching
// of orbital moments, Curie and Brillouin paramagnetism, Pauli and Landau susceptibility of electrons, Van Vleck
// paramagnetism, Weiss mean-field theory (molecular field, Curie-Weiss law, critical exponents), antiferro- and
// ferrimagnets, exchange versus dipolar energy, spin waves and the Bloch law, ferromagnetic resonance, domains and
// hysteresis. (H, B, M, bound currents and basic hysteresis: JAM topic magnetic-materials.)
// Original questions for GATE and CSIR NET practice (fibub). Levels: 1 warm-up ... 5 top rank.
import { int, pick, choose, round, mcqOptions, C } from '../_util.js';

const muB = C.e * C.hbar / (2 * C.me);
const landeG = (L, S, J) => 1 + (J * (J + 1) + S * (S + 1) - L * (L + 1)) / (2 * J * (J + 1));
const LET = 'SPDFGHI';
// Hund's rules for n electrons in a shell of orbital quantum number l: { S, L, J }
function hund(l, n) {
  const half = 2 * l + 1;
  const S = n <= half ? n / 2 : (2 * half - n) / 2;
  const k = n <= half ? n : n - half;
  let L = 0;
  for (let i = 0; i < k; i++) L += l - i;
  const J = n < half ? Math.abs(L - S) : L + S;
  return { S, L, J };
}
const half = (x) => (Number.isInteger(x) ? String(x) : `${Math.round(2 * x)}/2`);
const term = ({ S, L, J }) => `${'$'}^{${2 * S + 1}}${LET[L]}_{${half(J)}}${'$'}`;

export default {
  topic: 'magnetism',
  items: [
    // ---------- level 1 ----------
    { id: 'mgx-001', type: 'mcq', level: 1, exams: ['gate', 'net', 'jam'], sub: 'diamagnetism',
      q: 'The magnetic susceptibility of a typical diamagnetic solid such as copper or quartz is',
      options: ['small, positive and proportional to $1/T$', 'large and positive below a critical temperature', 'exactly $-1$', 'small (about $-10^{-5}$), negative and almost independent of temperature'], answer: 3,
      sol: 'Diamagnetism comes from the orbital response of filled shells (Lenz\'s law at the atomic scale). It is weak, $\\chi \\sim -10^{-6}$ to $-10^{-5}$ in SI, and does not depend on temperature because it does not involve thermal alignment of moments. $\\chi = -1$ is a superconductor.' },
    { id: 'mgx-002', type: 'mcq', level: 1, exams: ['gate', 'net', 'jam'], sub: 'Curie law',
      q: 'For a dilute paramagnet of non-interacting moments in a weak field, the susceptibility varies with temperature as',
      options: ['$\\chi \\propto T$', '$\\chi \\propto 1/T$', '$\\chi \\propto e^{-\\Delta/k_BT}$', '$\\chi$ independent of $T$'], answer: 1,
      sol: 'Thermal agitation opposes alignment. For $\\mu B \\ll k_BT$ the mean moment along $B$ is $\\mu^2B/3k_BT$ (classically) or $g^2\\mu_B^2J(J+1)B/3k_BT$ (quantum): the Curie law $\\chi = C/T$.' },
    { id: 'mgx-003', type: 'nat', level: 1, exams: ['gate', 'net', 'jam'], sub: 'effective moment',
      q: 'The Mn$^{2+}$ ion has five unpaired 3d electrons ($S = 5/2$, orbital moment quenched). Its spin-only effective moment $2\\sqrt{S(S+1)}$ is ______ $\\mu_B$ (to two decimal places).',
      answer: 5.92, tol: 0.01, calc: () => 2 * Math.sqrt(2.5 * 3.5),
      sol: '$\\mu_{\\rm eff} = g\\sqrt{S(S+1)}\\,\\mu_B$ with $g = 2$: $2\\sqrt{2.5\\times3.5} = 2\\sqrt{8.75} = 5.92\\,\\mu_B$, close to measured values for Mn$^{2+}$ salts. (Its maximum component along a field is $gS = 5\\,\\mu_B$.)' },
    { id: 'mgx-004', type: 'mcq', level: 1, exams: ['gate', 'net', 'jam'], sub: 'Curie-Weiss law',
      q: 'Above its Curie temperature $T_C$, the susceptibility of a ferromagnet in mean-field theory is',
      options: ['$\\chi = \\dfrac{C}{T + T_C}$', '$\\chi = \\dfrac{C}{T}$', '$\\chi = \\dfrac{C}{T - T_C}$', '$\\chi = C(T - T_C)$'], answer: 2,
      sol: 'The molecular field $\\lambda M$ adds to the applied field: $M = \\dfrac{C}{T}(H + \\lambda M)$, so $\\chi = \\dfrac{C}{T - \\lambda C}$ with $T_C = \\lambda C$. It diverges as $T \\to T_C^+$. The plus sign belongs to antiferromagnets.' },
    { id: 'mgx-005', type: 'msq', level: 1, exams: ['gate', 'net', 'jam'], sub: 'Hund\'s rules',
      q: 'Which statements of Hund\'s rules for the ground state of an ion with one partly filled shell are correct?',
      options: ['$J = L + S$ always, because it maximises the moment.', 'Choose the largest total spin $S$ allowed by the Pauli principle.', 'For that $S$, choose the largest total orbital angular momentum $L$.', '$J = |L - S|$ if the shell is less than half full and $J = L + S$ if more than half full.'], answer: [1, 2, 3],
      sol: 'Parallel spins keep electrons apart (exchange), lowering the Coulomb energy; then maximal $L$ keeps them circulating the same way. Spin-orbit coupling $\\lambda\\mathbf L\\cdot\\mathbf S$ has $\\lambda > 0$ for less than half filling (smallest $J$ lowest) and $\\lambda < 0$ beyond (largest $J$ lowest).' },
    { id: 'mgx-006', type: 'mcq', level: 1, exams: ['gate', 'net', 'jam'], sub: 'antiferromagnetism',
      q: 'As an antiferromagnet is cooled through its Néel temperature $T_N$, its (powder) susceptibility',
      options: ['has a cusp (a maximum) at $T_N$', 'diverges at $T_N$', 'drops to $-1$', 'rises smoothly as $1/T$ through $T_N$'], answer: 0,
      sol: 'Above $T_N$, $\\chi = C/(T + \\theta)$ rises on cooling. Below $T_N$ the sublattices lock antiparallel and resist rotation, so $\\chi$ falls (strongly for fields along the spin axis). The result is a cusp at $T_N$, not a divergence: there is no net spontaneous moment.' },

    // ---------- level 2 ----------
    { id: 'mgx-007', type: 'nat', level: 2, exams: ['gate', 'net'], sub: 'Landé g factor',
      q: 'The Ce$^{3+}$ ion (4f$^1$) has ground term $^2F_{5/2}$. Its Landé $g$ factor is ______ (to three decimal places).',
      answer: 0.857, tol: 0.002, calc: () => landeG(3, 0.5, 2.5),
      sol: '$g = 1 + \\dfrac{J(J+1) + S(S+1) - L(L+1)}{2J(J+1)}$ with $L = 3$, $S = \\tfrac12$, $J = \\tfrac52$: $g = 1 + \\dfrac{8.75 + 0.75 - 12}{17.5} = 1 - \\dfrac{2.5}{17.5} = 0.857 = 6/7$. Below 1 because the spin points against the larger orbital moment.' },
    { id: 'mgx-008', type: 'mcq', level: 2, exams: ['gate', 'net'], sub: 'Hund\'s rules',
      q: 'The ground term of the Gd$^{3+}$ ion (4f$^7$) is',
      options: ['$^7F_6$', '$^8S_{7/2}$', '$^6H_{5/2}$', '$^8F_{13/2}$'], answer: 1,
      sol: 'A half-filled f shell has all seven spins parallel: $S = 7/2$, $2S + 1 = 8$. One electron in each $m_l$ from $+3$ to $-3$ gives $L = 0$ (S term), so $J = S = 7/2$: $^8S_{7/2}$. With no orbital moment, Gd$^{3+}$ has $g = 2$ and a spin-only moment.' },
    { id: 'mgx-009', type: 'nat', level: 2, exams: ['gate', 'net'], sub: 'effective moment',
      q: 'For Ce$^{3+}$ ($^2F_{5/2}$, $g = 6/7$), the effective moment $g\\sqrt{J(J+1)}$ that sets its Curie constant is ______ $\\mu_B$ (to two decimal places).',
      answer: 2.54, tol: 0.01, calc: () => (6 / 7) * Math.sqrt(2.5 * 3.5),
      sol: '$\\sqrt{J(J+1)} = \\sqrt{2.5\\times3.5} = 2.958$; times $6/7$ gives $2.54\\,\\mu_B$. For rare-earth ions the 4f shell is shielded from the crystal field, so $J$ (not $S$) determines the moment.' },
    { id: 'mgx-010', type: 'mcq', level: 2, exams: ['gate', 'net'], sub: 'Pauli paramagnetism',
      q: 'The spin (Pauli) paramagnetism of conduction electrons in a metal is',
      options: ['proportional to $1/T$, like a Curie law, but $10^2$ times larger', 'zero, because the spins pair up', 'roughly independent of temperature and of order $\\mu_0\\mu_B^2g(E_F)$', 'negative, about $-\\tfrac13$ of the Curie value'], answer: 2,
      sol: 'Only electrons within about $\\mu_BB$ of $E_F$ can flip, so instead of $n$ moments responding with weight $1/k_BT$, $g(E_F)\\mu_BB$ electrons respond fully: $\\chi_P = \\mu_0\\mu_B^2g(E_F) = \\tfrac32n\\mu_0\\mu_B^2/E_F$, about $T/T_F$ times the Curie value and independent of $T$. The orbital (Landau) diamagnetism is $-\\tfrac13\\chi_P$ for free electrons.' },
    { id: 'mgx-011', type: 'mcq', level: 2, exams: ['gate', 'net'], sub: 'Curie law',
      q: 'A paramagnetic salt obeying the Curie law has $\\chi = 3.0\\times10^{-4}$ at $300$ K. At $4.0$ K (still in weak field) its susceptibility is',
      options: ['$4.0\\times10^{-6}$', '$3.0\\times10^{-4}$', '$2.25\\times10^{-2}$', '$1.2\\times10^{-3}$'], answer: 2,
      sol: '$\\chi \\propto 1/T$: $3.0\\times10^{-4}\\times300/4.0 = 2.25\\times10^{-2}$. Cooling paramagnetic salts this way is the basis of magnetic thermometry and adiabatic demagnetisation.' },
    { id: 'mgx-012', type: 'msq', level: 2, exams: ['gate', 'net'], sub: 'diamagnetism',
      q: 'Which statements about Langevin (core) diamagnetism are correct?',
      options: ['It is strongly temperature dependent, like the Curie law.', 'It arises because an applied field changes the orbital motion of electrons, inducing a moment opposed to the field.', 'Every material has a diamagnetic contribution, though it may be masked by paramagnetism.', 'It is proportional to the number of electrons per atom times their mean square orbital radius.'], answer: [1, 2, 3],
      sol: 'Switching on $B$ adds a Larmor precession to each orbit, inducing a moment $-\\dfrac{e^2B}{6m}\\langle r^2\\rangle$ per electron (Lenz). So $\\chi = -\\mu_0n\\dfrac{Ze^2\\langle r^2\\rangle}{6m}$, set by atomic sizes, not by temperature. All matter has it.' },
    { id: 'mgx-013', type: 'mcq', level: 2, exams: ['gate', 'net'], sub: 'Curie-Weiss law',
      q: 'For a material above its ordering temperature, $1/\\chi$ is plotted against $T$ and the straight line extrapolates to $1/\\chi = 0$ at $T = -45$ K. The material most likely orders',
      options: ['ferromagnetically', 'antiferromagnetically', 'as a superconductor', 'never; it is diamagnetic'], answer: 1,
      sol: '$\\chi = C/(T - \\theta)$ with $\\theta = -45$ K, i.e. $C/(T + 45)$. A negative Curie-Weiss temperature means the interactions favour antiparallel neighbours: antiferromagnetic (or ferrimagnetic) order at low $T$. A ferromagnet gives $\\theta > 0$.' },
    { id: 'mgx-014', type: 'nat', level: 2, exams: ['gate', 'net'], sub: 'molecular field',
      q: 'In the mean-field model of a ferromagnet of spin-$\\tfrac12$ moments ($g = 2$), $k_BT_C = \\mu_BB_E$, where $B_E$ is the molecular (exchange) field at $T = 0$. For $T_C = 1000$ K, $B_E$ is about ______ T (to the nearest 10 T).',
      answer: 1490, tol: 15, calc: () => C.kB * 1000 / muB,
      sol: 'With $M = n\\mu_B\\tanh(\\mu_BB_{\\rm eff}/k_BT)$ and $B_{\\rm eff} = \\lambda M$, the non-zero solution appears at $k_BT_C = \\mu_B\\lambda n\\mu_B = \\mu_BB_E$. So $B_E = k_BT_C/\\mu_B = 1.381\\times10^{-23}\\times1000/9.274\\times10^{-24} = 1490$ T, far larger than any laboratory field: the "field" is really the exchange interaction.' },
    { id: 'mgx-015', type: 'mcq', level: 2, exams: ['gate', 'net'], sub: 'quenching',
      q: 'The measured moments of iron-group (3d) ions in salts fit $2\\sqrt{S(S+1)}\\,\\mu_B$ much better than $g\\sqrt{J(J+1)}\\,\\mu_B$. The reason is that',
      options: ['the crystal field acting on the outer 3d orbitals is stronger than spin-orbit coupling and quenches the orbital moment', 'the 3d electrons have no orbital angular momentum in the free ion', 'Hund\'s rules do not apply to 3d ions', 'spin-orbit coupling in 3d ions is larger than the crystal field'], answer: 0,
      sol: 'The 3d shell is outermost, so neighbouring ions split it strongly; real crystal-field states are standing-wave combinations of $\\pm m_l$ with $\\langle L_z\\rangle = 0$. With $L$ quenched, $J$ is not a good quantum number and only the spin contributes. The 4f shell of rare earths is buried, so there $J$ survives.' },
    { id: 'mgx-016', type: 'mcq', level: 2, exams: ['gate', 'net'], sub: 'ferrimagnetism',
      q: 'Magnetite (Fe$_3$O$_4$) has two magnetic sublattices with antiparallel moments of different size. Such a material is',
      options: ['an antiferromagnet with zero net moment', 'a paramagnet', 'a ferrimagnet with a spontaneous net moment below its ordering temperature', 'a diamagnet'], answer: 2,
      sol: 'Antiparallel sublattices with unequal moments leave a net spontaneous magnetisation, so a ferrimagnet behaves outwardly like a weak ferromagnet (domains, hysteresis), but its $1/\\chi$ above $T_C$ is curved, not a Curie-Weiss line. Ferrites are ferrimagnets and are insulators, so they suit high-frequency cores.' },
    { id: 'mgx-041', type: 'msq', level: 2, exams: ['gate', 'net'], sub: 'Curie law',
      q: 'For $N$ non-interacting ions per unit volume with total angular momentum $J$ and factor $g$, which statements about the weak-field susceptibility are correct?',
      options: ['A plot of $\\chi T$ against $T$ is flat.', 'The effective moment is $g\\sqrt{J(J+1)}\\,\\mu_B$, larger than the saturation moment $gJ\\mu_B$.', 'In SI units $\\chi$ has units of A/m.', '$\\chi = \\dfrac{\\mu_0Ng^2\\mu_B^2J(J+1)}{3k_BT}$.'], answer: [0, 1, 3],
      sol: 'Expanding the Brillouin function for small $x = g\\mu_BJB/k_BT$ gives $M = Ng^2\\mu_B^2J(J+1)B/3k_BT$, so $\\chi = \\mu_0M/B$ as stated and $\\chi T = C$ is constant. $\\sqrt{J(J+1)} > J$, so $\\mu_{\\rm eff} > gJ\\mu_B$. $\\chi = M/H$ is dimensionless in SI.' },

    // ---------- level 3 ----------
    { id: 'mgx-017', type: 'nat', level: 3, exams: ['gate', 'net'], sub: 'saturation magnetisation',
      q: 'Iron has $8.5\\times10^{28}$ atoms per m$^3$ and a saturation moment of $2.2\\,\\mu_B$ per atom. Its saturation magnetisation is ______ $\\times10^6$ A/m (to two decimal places).',
      answer: 1.73, tol: 0.02, calc: () => 8.5e28 * 2.2 * muB / 1e6,
      sol: '$M_s = n\\mu = 8.5\\times10^{28}\\times2.2\\times9.274\\times10^{-24} = 1.73\\times10^6$ A/m, so $\\mu_0M_s = 2.2$ T. The non-integer $2.2\\,\\mu_B$ shows the moments come from itinerant d electrons, not localised ions.' },
    { id: 'mgx-018', type: 'nat', level: 3, exams: ['gate', 'net'], sub: 'Curie law',
      q: 'A salt has $1.0\\times10^{28}$ magnetic ions per m$^3$, each with $\\mu_{\\rm eff} = 5.92\\,\\mu_B$. Its Curie constant $C = \\mu_0n\\mu_{\\rm eff}^2/3k_B$ (with $\\chi = C/T$ dimensionless, SI) is ______ K (to three decimal places).',
      answer: 0.915, tol: 0.005, calc: () => C.mu0 * 1e28 * (5.92 * muB) ** 2 / (3 * C.kB),
      sol: '$\\mu_{\\rm eff} = 5.92\\times9.274\\times10^{-24} = 5.49\\times10^{-23}$ J/T; squared $3.01\\times10^{-45}$. $C = \\dfrac{1.257\\times10^{-6}\\times10^{28}\\times3.01\\times10^{-45}}{3\\times1.381\\times10^{-23}} = 0.915$ K. So $\\chi(300\\text{ K}) = 3.0\\times10^{-3}$.' },
    { id: 'mgx-019', type: 'mcq', level: 3, exams: ['gate', 'net'], sub: 'Brillouin function',
      q: 'The magnetisation of ions with angular momentum $J$ is $M = Ng\\mu_BJ\\,B_J(x)$ with $x = g\\mu_BJB/k_BT$. For $x \\ll 1$ the Brillouin function is approximately',
      options: ['$1$', '$\\dfrac{x}{3}$', '$\\dfrac{J+1}{3J}\\,x$', '$\\tanh x$'], answer: 2,
      sol: 'Expanding, $B_J(x) \\approx \\dfrac{J+1}{3J}x$, which gives the Curie law with $J(J+1)$. For $J = \\tfrac12$ it is $x$ (from $\\tanh x$), and as $J \\to \\infty$ it tends to the classical Langevin result $x/3$. For $x \\gg 1$, $B_J \\to 1$ (saturation).' },
    { id: 'mgx-020', type: 'msq', level: 3, exams: ['gate', 'net'], sub: 'mean-field theory',
      q: 'For the Weiss mean-field theory of a ferromagnet, which statements are correct?',
      options: ['Just below $T_C$, $M \\propto (T_C - T)^{1/2}$.', 'Above $T_C$, $\\chi = C/(T - T_C)$.', 'At $T = 0$ the magnetisation equals the saturation value $M_s$.', 'At low temperature it predicts $M_s - M \\propto T^{3/2}$.'], answer: [0, 1, 2],
      sol: 'Expanding $B_J$ near $T_C$ gives $M^2 \\propto (T_C - T)$: exponent $\\beta = \\tfrac12$. The Curie-Weiss law follows from the molecular field. Mean-field theory gives an exponentially small deviation $M_s - M \\propto e^{-2T_C/T}$ at low $T$ (for $J = \\tfrac12$); the observed $T^{3/2}$ (Bloch law) needs spin waves.' },
    { id: 'mgx-021', type: 'nat', level: 3, exams: ['gate', 'net'], sub: 'Pauli paramagnetism',
      q: 'For a free-electron metal with $n = 2.65\\times10^{28}$ m$^{-3}$ and $E_F = 3.24$ eV, the Pauli susceptibility $\\chi_P = 3n\\mu_0\\mu_B^2/2E_F$ is ______ $\\times10^{-6}$ (to two decimal places).',
      answer: 8.28, tol: 0.08, calc: () => 3 * 2.65e28 * C.mu0 * muB ** 2 / (2 * 3.24 * C.e) * 1e6,
      sol: '$\\chi_P = \\dfrac{3\\times2.65\\times10^{28}\\times1.257\\times10^{-6}\\times(9.274\\times10^{-24})^2}{2\\times3.24\\times1.602\\times10^{-19}} = \\dfrac{8.59\\times10^{-24}}{1.038\\times10^{-18}} = 8.28\\times10^{-6}$. Adding Landau diamagnetism ($-\\tfrac13$ of this) leaves $5.5\\times10^{-6}$, before core diamagnetism.' },
    { id: 'mgx-022', type: 'mcq', level: 3, exams: ['gate', 'net'], sub: 'spin waves',
      q: 'At small wave vector $k$, spin-wave (magnon) energies vary as',
      options: ['$k^2$ in a ferromagnet and $k$ in an antiferromagnet', '$k$ in a ferromagnet and $k^2$ in an antiferromagnet', '$k^2$ in both', '$k$ in both'], answer: 0,
      sol: 'For a Heisenberg ferromagnet $\\hbar\\omega = 2JS(z - \\sum_\\delta\\cos\\mathbf k\\cdot\\boldsymbol\\delta) \\approx 2JSa^2k^2$ (simple cubic). For an antiferromagnet the two sublattices couple the equations and $\\hbar\\omega \\propto |\\sin ka| \\approx ka$, linear like phonons. Hence the ferromagnetic $T^{3/2}$ Bloch law and antiferromagnetic $T^3$ magnon heat capacity.' },
    { id: 'mgx-023', type: 'nat', level: 3, exams: ['gate', 'net'], sub: 'spin waves',
      q: 'A ferromagnet follows the Bloch law $M_s(0) - M_s(T) \\propto T^{3/2}$. Its magnetisation is $1.0\\%$ below saturation at $100$ K. At $400$ K (still well below $T_C$) it is ______ % below saturation.',
      answer: 8, tol: 0.05, calc: () => 1 * 4 ** 1.5,
      sol: 'The number of thermally excited magnons in 3D with $\\omega \\propto k^2$ is $\\propto T^{3/2}$, and each lowers $M$ by $g\\mu_B$. Quadrupling $T$ multiplies the deficit by $4^{3/2} = 8$: $8\\%$.' },
    { id: 'mgx-024', type: 'msq', level: 3, exams: ['gate', 'net'], sub: 'hysteresis',
      q: 'Which statements about the hysteresis loop of a ferromagnet are correct?',
      options: ['The coercive field is the field at which the magnetisation first reaches saturation.', 'The area of the $B$-$H$ loop is the energy lost as heat per unit volume per cycle.', 'Permanent magnets need a large coercivity.', 'Transformer cores need a narrow loop (low coercivity).'], answer: [1, 2, 3],
      sol: 'Work per unit volume is $\\oint H\\,dB$, the loop area, dissipated in irreversible domain-wall jumps. Hard magnets resist demagnetisation (large $H_c$); soft magnets waste little energy each cycle (small $H_c$). The coercive field is where $M$ (or $B$) returns to zero on the reverse sweep.' },
    { id: 'mgx-025', type: 'nat', level: 3, exams: ['gate', 'net'], sub: 'diamagnetism',
      q: 'A solid has $5.0\\times10^{28}$ atoms per m$^3$, each with $Z = 10$ electrons of mean square distance from the nucleus $\\langle r^2\\rangle = 0.010$ nm$^2$. Its Langevin susceptibility $\\chi = -\\mu_0nZe^2\\langle r^2\\rangle/6m_e$ is ______ $\\times10^{-5}$ (to two decimal places, with sign).',
      answer: -2.95, tol: 0.03, calc: () => -C.mu0 * 5e28 * 10 * C.e ** 2 * 1e-20 / (6 * C.me) * 1e5,
      sol: '$\\chi = -\\dfrac{1.257\\times10^{-6}\\times5.0\\times10^{28}\\times10\\times(1.602\\times10^{-19})^2\\times1.0\\times10^{-20}}{6\\times9.109\\times10^{-31}} = -\\dfrac{1.61\\times10^{-34}}{5.47\\times10^{-30}} = -2.95\\times10^{-5}$. Note $\\langle r^2\\rangle = \\langle x^2 + y^2 + z^2\\rangle$; the $1/6$ already includes the average of $x^2 + y^2 = \\tfrac23r^2$.',
      trap: 'Forgetting to convert nm$^2$ to m$^2$ ($10^{-18}$).' },
    { id: 'mgx-026', type: 'mcq', level: 3, exams: ['gate', 'net'], sub: 'Hund\'s rules',
      q: 'Which of these free ions has no permanent magnetic moment in its ground state?',
      options: ['Ti$^{3+}$ (3d$^1$)', 'Cu$^{2+}$ (3d$^9$)', 'Fe$^{3+}$ (3d$^5$)', 'Zn$^{2+}$ (3d$^{10}$)'], answer: 3,
      sol: 'A full shell has $S = L = J = 0$. 3d$^1$ and 3d$^9$ each have one unpaired spin (an electron or a hole), and 3d$^5$ has five. So only Zn$^{2+}$ is purely diamagnetic.' },
    { id: 'mgx-027', type: 'nat', level: 3, exams: ['gate', 'net'], sub: 'Brillouin function',
      q: 'Spin-$\\tfrac12$ ions ($g = 2$) are held at $4.2$ K in a field of $1.0$ T. Their magnetisation is a fraction ______ of saturation (to three decimal places).',
      answer: 0.159, tol: 0.002, calc: () => Math.tanh(muB * 1 / (C.kB * 4.2)),
      sol: 'For $J = \\tfrac12$, $M/M_s = \\tanh(\\mu_BB/k_BT)$. $\\mu_BB/k_BT = 9.274\\times10^{-24}/(1.381\\times10^{-23}\\times4.2) = 0.160$, and $\\tanh0.160 = 0.159$. Still nearly linear; saturation needs $\\mu_BB \\gg k_BT$, i.e. many tesla at 1 K.' },
    { id: 'mgx-028', type: 'mcq', level: 3, exams: ['gate', 'net'], sub: 'domains',
      q: 'A ferromagnetic crystal breaks up into domains mainly because this',
      options: ['raises the exchange energy', 'lowers the magnetostatic (stray-field) energy by more than the cost of the domain walls', 'lowers the anisotropy energy to zero', 'increases the entropy at $T = 0$'], answer: 1,
      sol: 'A uniformly magnetised block has a large stray field with energy $\\sim\\tfrac12\\mu_0M_s^2V$. Splitting into domains with closure domains cancels most of this. Each wall costs exchange and anisotropy energy per area, so the domain size settles where the two balance.' },
    { id: 'mgx-042', type: 'msq', level: 3, exams: ['gate', 'net'], sub: 'Landé g factor',
      q: 'For the Landé factor $g = 1 + \\dfrac{J(J+1) + S(S+1) - L(L+1)}{2J(J+1)}$, which statements are correct?',
      options: ['$g$ can exceed 2.', '$g$ always lies between 1 and 2.', '$g = 2$ for any state with $L = 0$.', '$g = 1$ for any state with $S = 0$.'], answer: [0, 2, 3],
      sol: '$L = 0$ makes $J = S$ and $g = 1 + 1 = 2$; $S = 0$ makes $J = L$ and $g = 1$. For $^6D_{1/2}$ ($L = 2$, $S = 5/2$, $J = 1/2$): $g = 1 + (0.75 + 8.75 - 6)/1.5 = 3.33$. It can also be below 1 (Ce$^{3+}$, $6/7$) or even zero ($^4D_{1/2}$).' },

    // ---------- level 4 ----------
    { id: 'mgx-029', type: 'nat', level: 4, exams: ['gate', 'net'], sub: 'molecular field',
      q: 'A ferromagnet has $T_C = 600$ K, and just above it, at $650$ K, its susceptibility is $2.0\\times10^{-3}$ (Curie-Weiss law, SI). The Weiss molecular-field constant $\\lambda$ (with $B_{\\rm mol} = \\mu_0\\lambda M$) is ______.',
      answer: 6000, tol: 30, calc: () => 600 / (2e-3 * 50),
      sol: '$\\chi = C/(T - T_C)$ gives $C = 2.0\\times10^{-3}\\times50 = 0.10$ K. Mean field: $T_C = \\lambda C$, so $\\lambda = 600/0.10 = 6000$. A dipolar (Lorentz) field would give $\\lambda = \\tfrac13$: the huge value shows the interaction is exchange.' },
    { id: 'mgx-030', type: 'nat', level: 4, exams: ['gate', 'net'], sub: 'effective moment',
      q: 'Using Hund\'s rules, the effective moment $g\\sqrt{J(J+1)}$ of the Dy$^{3+}$ ion (4f$^9$) is ______ $\\mu_B$ (to two decimal places).',
      answer: 10.65, tol: 0.03, calc: () => landeG(5, 2.5, 7.5) * Math.sqrt(7.5 * 8.5),
      sol: '9 electrons: the first 7 fill every $m_l$ with spin up ($L = 0$), the remaining 2 go spin down into $m_l = 3, 2$: $S = 7/2 - 1 = 5/2$, $L = 5$ (H). More than half full, so $J = L + S = 15/2$: $^6H_{15/2}$. $g = 1 + \\dfrac{63.75 + 8.75 - 30}{127.5} = 4/3$. $\\mu_{\\rm eff} = \\tfrac43\\sqrt{63.75} = 10.65\\,\\mu_B$, among the largest of any ion.' },
    { id: 'mgx-031', type: 'msq', level: 4, exams: ['gate', 'net'], sub: 'antiferromagnetism',
      q: 'For a two-sublattice antiferromagnet in mean-field theory (nearest-neighbour coupling only), which statements are correct?',
      options: ['Below $T_N$ the perpendicular susceptibility $\\chi_\\perp$ stays roughly constant at its value at $T_N$.', 'For every real antiferromagnet the Curie-Weiss $\\theta$ equals $T_N$.', 'A powder sample at $T \\to 0$ has $\\chi$ about two thirds of its value at $T_N$.', 'Below $T_N$ the parallel susceptibility $\\chi_\\parallel$ falls to zero as $T \\to 0$.'], answer: [0, 2, 3],
      sol: 'A field along the spins can only change the sublattice magnetisations, which are saturated at $T = 0$, so $\\chi_\\parallel \\to 0$. A perpendicular field cants both sublattices against the exchange field, giving $\\chi_\\perp = 1/\\lambda = \\chi(T_N)$, independent of $T$. Powder: $\\tfrac13\\chi_\\parallel + \\tfrac23\\chi_\\perp \\to \\tfrac23\\chi(T_N)$. Simple mean field gives $\\theta = T_N$, but next-neighbour couplings make $\\theta/T_N$ range from about 1.5 to 5 in real materials.' },
    { id: 'mgx-032', type: 'nat', level: 4, exams: ['gate', 'net'], sub: 'Curie-Weiss law',
      q: 'A material obeys $\\chi = C/(T - \\theta)$. Its susceptibility is $5.0\\times10^{-3}$ at $200$ K and $2.5\\times10^{-3}$ at $300$ K. Then $\\theta$ is ______ K (with sign).',
      answer: 100, tol: 1, calc: () => { const a = 5e-3, b = 2.5e-3; return (a * 200 - b * 300) / (a - b); },
      sol: '$C = \\chi(T - \\theta)$ at both temperatures: $5.0\\times10^{-3}(200 - \\theta) = 2.5\\times10^{-3}(300 - \\theta)$. So $1.0 - 0.005\\theta = 0.75 - 0.0025\\theta$, $\\theta = 100$ K (positive: ferromagnetic interactions), and $C = 0.50$ K.' },
    { id: 'mgx-033', type: 'mcq', level: 4, exams: ['gate', 'net'], sub: 'itinerant magnetism',
      q: 'In the Stoner model of itinerant ferromagnetism with on-site repulsion $U$ and density of states per spin per atom at the Fermi level $g_\\sigma(E_F)$, a ferromagnetic instability occurs when',
      options: ['$Ug_\\sigma(E_F) > 1$', '$Ug_\\sigma(E_F) < 1$', '$U > E_F$', '$g_\\sigma(E_F) = 0$'], answer: 0,
      sol: 'Shifting $\\delta n$ electrons from one spin band to the other costs kinetic energy $\\propto\\delta n^2/g_\\sigma$ and saves exchange energy $\\propto U\\delta n^2$. The paramagnet is unstable when $Ug_\\sigma(E_F) > 1$; below this the Pauli susceptibility is enhanced to $\\chi_P/(1 - Ug_\\sigma)$. Fe, Co and Ni satisfy it thanks to their narrow d bands (large $g$).' },
    { id: 'mgx-034', type: 'nat', level: 4, exams: ['gate', 'net'], sub: 'Pauli paramagnetism',
      q: 'Conduction electrons in a semiconductor have $m^* = 0.50\\,m_e$ and $g = 2$. Their Landau diamagnetism is $-\\tfrac13(m_e/m^*)^2$ times their Pauli paramagnetism. The total electronic susceptibility, as a multiple of $\\chi_P$, is ______ (to two decimal places, with sign).',
      answer: -0.33, tol: 0.01, calc: () => 1 - (1 / 3) * (1 / 0.5) ** 2,
      sol: 'Landau diamagnetism scales with the orbital (cyclotron) moment $\\propto 1/m^*$, squared; Pauli uses the free spin moment $\\mu_B$. So $\\chi_{\\rm tot}/\\chi_P = 1 - \\tfrac13\\times4 = -0.33$: light electrons make the electron gas diamagnetic overall, as in bismuth and InSb.' },
    { id: 'mgx-035', type: 'nat', level: 4, exams: ['gate', 'net'], sub: 'ferromagnetic resonance',
      q: 'A small ferromagnetic sphere with $g = 2.00$ is in an internal field of $0.35$ T. The ferromagnetic resonance frequency $g\\mu_BB/h$ is ______ GHz (to two decimal places).',
      answer: 9.80, tol: 0.05, calc: () => 2 * muB * 0.35 / C.h / 1e9,
      sol: 'The uniform precession of the magnetisation ($k = 0$ magnon) has $\\hbar\\omega = g\\mu_BB$. $f = 2.00\\times9.274\\times10^{-24}\\times0.35/6.626\\times10^{-34} = 9.80$ GHz (X band). For a sphere the demagnetising fields cancel, so $B$ is the applied field.' },
    { id: 'mgx-036', type: 'mcq', level: 4, exams: ['gate', 'net'], sub: 'exchange',
      q: 'The ordering of iron\'s moments that survives up to $1043$ K is caused by',
      options: ['magnetic dipole-dipole forces between neighbouring moments', 'exchange: the Coulomb repulsion between electrons combined with the Pauli principle', 'the nuclear magnetic moments', 'the Earth\'s magnetic field during crystallisation'], answer: 1,
      sol: 'The dipolar energy between moments of $\\sim2\\mu_B$ a quarter of a nanometre apart is about $\\mu_0\\mu^2/4\\pi a^3 \\sim 10^{-4}$ eV, equivalent to less than 1 K. Exchange arises because the spatial symmetry of the wavefunction, tied to spin by the Pauli principle, changes the Coulomb energy by up to $\\sim0.1$ eV: enough for $T_C \\sim 1000$ K.' },

    // ---------- level 5 ----------
    { id: 'mgx-037', type: 'nat', level: 5, exams: ['gate', 'net'], sub: 'exchange',
      q: 'Two moments of $1\\,\\mu_B$ each are $0.25$ nm apart. The scale of their dipolar interaction energy, $\\mu_0\\mu_B^2/4\\pi a^3$, expressed as a temperature, is ______ K (to three decimal places).',
      answer: 0.040, tol: 0.001, calc: () => 1e-7 * muB ** 2 / (0.25e-9) ** 3 / C.kB,
      sol: '$\\dfrac{\\mu_0}{4\\pi}\\dfrac{\\mu_B^2}{a^3} = 10^{-7}\\times\\dfrac{(9.274\\times10^{-24})^2}{(2.5\\times10^{-10})^3} = 10^{-7}\\times\\dfrac{8.60\\times10^{-47}}{1.5625\\times10^{-29}} = 5.5\\times10^{-25}$ J. Divided by $k_B$: $0.040$ K. Dipolar order appears only in a few salts below about 0.1 K; room-temperature magnets need exchange.' },
    { id: 'mgx-038', type: 'msq', level: 5, exams: ['gate', 'net'], sub: 'mean-field theory',
      q: 'Which statements about critical exponents of a ferromagnet are correct?',
      options: ['Mean-field theory gives $\\beta = \\tfrac12$ for $M \\propto (T_C - T)^\\beta$.', 'Mean-field theory gives $\\gamma = 1$ for $\\chi \\propto (T - T_C)^{-\\gamma}$.', 'Mean-field theory gives $M \\propto B^{1/3}$ on the critical isotherm $T = T_C$.', 'Mean-field theory is exact for the one-dimensional Ising chain, which orders at $T_C = 2J/k_B$.'], answer: [0, 1, 2],
      sol: 'Landau expansion $F = a(T - T_C)M^2 + bM^4 - BM$: minimising gives $M^2 \\propto T_C - T$ ($\\beta = \\tfrac12$), $\\chi \\propto 1/(T - T_C)$ ($\\gamma = 1$) and at $T_C$, $4bM^3 = B$ ($\\delta = 3$). Real 3D magnets have $\\beta \\approx 0.33$ to $0.37$. The 1D Ising chain does not order at any $T > 0$; mean field fails worst in low dimensions.' },
    { id: 'mgx-039', type: 'nat', level: 5, exams: ['gate', 'net'], sub: 'Brillouin function',
      q: 'Spin-$\\tfrac12$ ions ($g = 2$) in a field of $5.0$ T reach half their saturation magnetisation at a temperature of ______ K (to two decimal places).',
      answer: 6.11, tol: 0.03, calc: () => muB * 5 / (C.kB * Math.atanh(0.5)),
      sol: '$\\tanh(\\mu_BB/k_BT) = 0.5$ gives $\\mu_BB/k_BT = \\tanh^{-1}0.5 = \\tfrac12\\ln3 = 0.549$. $T = \\dfrac{9.274\\times10^{-24}\\times5.0}{1.381\\times10^{-23}\\times0.549} = 6.11$ K.',
      trap: 'Using the Curie (linear) law, $\\mu_BB/k_BT = 0.5$, gives 6.72 K; the response is already non-linear at half saturation.' },
    { id: 'mgx-040', type: 'mcq', level: 5, exams: ['gate', 'net'], sub: 'Van Vleck paramagnetism',
      q: 'Eu$^{3+}$ (4f$^6$) has ground term $^7F_0$ with $J = 0$, yet europium(III) salts are paramagnetic at room temperature. The main reason is',
      options: ['the crystal field restores an orbital moment in the $J = 0$ state', 'the nucleus carries a large magnetic moment', 'the ion is really Eu$^{2+}$ with $^8S_{7/2}$', 'the $J = 1, 2, \\dots$ levels lie only a few hundred kelvin above, so they are thermally occupied, and the field also mixes them into the ground state (Van Vleck paramagnetism)'], answer: 3,
      sol: 'A $J = 0$ state has no first-order moment, but $\\mathbf L + 2\\mathbf S$ has matrix elements to the $^7F_1$ level about 500 K higher. Second-order mixing gives a temperature-independent Van Vleck susceptibility $\\propto|\\langle1|\\mu_z|0\\rangle|^2/\\Delta$, and at room temperature the excited multiplets are also thermally populated. Sm$^{3+}$ shows a similar effect.' },
  ],
  gens: [
    { id: 'mgx-g01', type: 'nat', level: 2, exams: ['gate', 'net'], sub: 'Landé g factor',
      make(r) {
        const shell = choose(r, ['3d', '4f']), l = shell === '3d' ? 2 : 3, n = int(r, 1, 4 * l + 1);
        const t = hund(l, n), g = t.J === 0 ? 0 : landeG(t.L, t.S, t.J);
        const nn = t.J === 0 ? (n === 2 * l + 1 ? n - 1 : n + 1) : n; // avoid J = 0
        const tt = hund(l, nn), gg = landeG(tt.L, tt.S, tt.J);
        return { q: `An ion with configuration ${shell}$^{${nn}}$ has the Hund's-rule ground term ${term(tt)} (free ion, spin-orbit coupling dominant). Its Landé $g$ factor is ______ (to three decimal places).`,
          answer: round(gg, 3), tol: 0.002, L: tt.L, S: tt.S, J: tt.J, g,
          sol: `$L = ${tt.L}$, $S = ${half(tt.S)}$, $J = ${half(tt.J)}$. $g = 1 + \\dfrac{J(J+1) + S(S+1) - L(L+1)}{2J(J+1)} = 1 + \\dfrac{${round(tt.J * (tt.J + 1), 3)} + ${round(tt.S * (tt.S + 1), 3)} - ${tt.L * (tt.L + 1)}}{${round(2 * tt.J * (tt.J + 1), 3)}} = ${round(gg, 3)}$.` };
      },
      verify: (p) => landeG(p.L, p.S, p.J) },
    { id: 'mgx-g02', type: 'nat', level: 3, exams: ['gate', 'net'], sub: 'effective moment',
      make(r) {
        const ions = [[1, 'Ce'], [2, 'Pr'], [3, 'Nd'], [5, 'Sm'], [7, 'Gd'], [8, 'Tb'], [9, 'Dy'], [10, 'Ho'], [11, 'Er'], [12, 'Tm'], [13, 'Yb']];
        const [n, el] = choose(r, ions);
        const t = hund(3, n), g = landeG(t.L, t.S, t.J), mu = g * Math.sqrt(t.J * (t.J + 1));
        return { q: `Using Hund's rules, find the effective moment $g\\sqrt{J(J+1)}$ of the ${el}$^{3+}$ ion (4f$^{${n}}$), in units of $\\mu_B$, to two decimal places.`,
          answer: round(mu, 2), tol: 0.02, n,
          sol: `${n <= 7 ? `${n} electron${n > 1 ? 's' : ''} with parallel spins in $m_l = 3, 2, \\dots$: $S = ${half(t.S)}$, $L = ${t.L}$.` : `The first 7 fill the shell with spin up ($L = 0$); the other ${n - 7} go spin down into $m_l = 3, 2, \\dots$: $S = ${half(t.S)}$, $L = ${t.L}$.`} ${n < 7 ? 'Less than half full: $J = |L - S|' : n === 7 ? 'Half full: $J = S' : 'More than half full: $J = L + S'} = ${half(t.J)}$, term ${term(t)}. $g = ${round(g, 4)}$ and $\\mu_{\\rm eff} = ${round(g, 4)}\\sqrt{${round(t.J * (t.J + 1), 3)}} = ${round(mu, 2)}\\,\\mu_B$.`,
          trap: n < 7 ? 'Taking $J = L + S$ for a less-than-half-filled shell.' : 'Taking $J = |L - S|$ for a more-than-half-filled shell.' };
      },
      verify: (p) => { const t = hund(3, p.n); return landeG(t.L, t.S, t.J) * Math.sqrt(t.J * (t.J + 1)); } },
    { id: 'mgx-g03', type: 'mcq', level: 3, exams: ['gate', 'net'], sub: 'Hund\'s rules',
      make(r) {
        const shell = choose(r, ['3d', '4f']), l = shell === '3d' ? 2 : 3, n = int(r, 1, 4 * l + 1);
        const t = hund(l, n), half_ = 2 * l + 1;
        const wrongJ = { ...t, J: n < half_ ? t.L + t.S : Math.abs(t.L - t.S) };
        const cands = [wrongJ, { S: t.S, L: Math.max(0, t.L - 1), J: Math.abs(Math.max(0, t.L - 1) - t.S) || t.S + Math.max(0, t.L - 1) }, { S: Math.max(0, t.S - 1), L: t.L, J: n < half_ ? Math.abs(t.L - Math.max(0, t.S - 1)) : t.L + Math.max(0, t.S - 1) }, { S: t.S, L: t.L + 1, J: n < half_ ? Math.abs(t.L + 1 - t.S) : t.L + 1 + t.S }, { S: t.S, L: t.L + 2, J: t.L + 2 + t.S }, { S: t.S + 1, L: t.L, J: t.L + t.S + 1 }].filter((c) => c.L <= 6);
        const { options, answer } = mcqOptions(r, term(t), cands.map(term), (v) => v);
        return { q: `The Hund's-rule ground term of a free ion with configuration ${shell}$^{${n}}$ is`, options, answer, n, l,
          sol: `Maximise $S$: $S = ${half(t.S)}$. Then maximise $L$ by filling $m_l = ${l}, ${l - 1}, \\dots$: $L = ${t.L}$ (${LET[t.L]}). The shell is ${n < half_ ? 'less than half full, so $J = |L - S|' : n === half_ ? 'exactly half full, so $L = 0$ and $J = S' : 'more than half full, so $J = L + S'} = ${half(t.J)}$. Ground term ${term(t)}.` };
      } },
    { id: 'mgx-g04', type: 'nat', level: 2, exams: ['gate', 'net', 'jam'], sub: 'effective moment',
      make(r) {
        const ions = [['Ti$^{3+}$', 1], ['V$^{3+}$', 2], ['Cr$^{3+}$', 3], ['Mn$^{3+}$', 4], ['Fe$^{3+}$', 5], ['Fe$^{2+}$', 6], ['Co$^{2+}$', 7], ['Ni$^{2+}$', 8], ['Cu$^{2+}$', 9], ['V$^{2+}$', 3], ['Mn$^{2+}$', 5]];
        const [ion, n] = choose(r, ions);
        const S = hund(2, n).S, mu = 2 * Math.sqrt(S * (S + 1));
        return { q: `For the high-spin ${ion} ion (3d$^{${n}}$) with its orbital moment quenched, the spin-only effective moment $2\\sqrt{S(S+1)}$ is ______ $\\mu_B$ (to two decimal places).`,
          answer: round(mu, 2), tol: 0.01, n,
          sol: `${n <= 5 ? `${n} parallel spins` : `5 up and ${n - 5} down`}: $${2 * S}$ unpaired electrons, $S = ${half(S)}$. $\\mu = 2\\sqrt{${round(S * (S + 1), 3)}} = ${round(mu, 2)}\\,\\mu_B$.` };
      },
      verify: (p) => { const S = hund(2, p.n).S; return 2 * Math.sqrt(S * (S + 1)); } },
    { id: 'mgx-g05', type: 'nat', level: 3, exams: ['gate', 'net'], sub: 'Curie law',
      make(r) {
        const n = pick(r, 0.5, 5, 0.1), mu = choose(r, [1.73, 2.83, 3.87, 4.90, 5.92, 7.94, 10.6]), T = choose(r, [4.2, 20, 77, 150, 300]);
        const Cc = C.mu0 * n * 1e28 * (mu * muB) ** 2 / (3 * C.kB), chi = Cc / T;
        return { q: `A paramagnetic salt has $${n}\\times10^{28}$ magnetic ions per m$^3$ with $\\mu_{\\rm eff} = ${mu}\\,\\mu_B$. Its SI susceptibility at $${T}$ K (Curie law) is ______ $\\times10^{-3}$ (to three significant figures).`,
          answer: +(chi * 1e3).toPrecision(3), tol: +(chi * 1e3 * 0.01).toPrecision(2), n, mu, T,
          sol: `$C = \\dfrac{\\mu_0n\\mu_{\\rm eff}^2}{3k_B} = ${+Cc.toPrecision(4)}$ K, so $\\chi = C/T = ${+(chi * 1e3).toPrecision(3)}\\times10^{-3}$.` };
      },
      verify: (p) => C.mu0 * p.n * 1e28 * (p.mu * muB) ** 2 / (3 * C.kB) / p.T * 1e3 },
    { id: 'mgx-g06', type: 'nat', level: 4, exams: ['gate', 'net'], sub: 'Curie-Weiss law',
      make(r) {
        const th = choose(r, [-150, -80, -40, -20, 15, 40, 90, 140]), Cc = pick(r, 0.2, 2, 0.1);
        const T1 = Math.max(th, 0) + choose(r, [50, 100]), T2 = T1 + choose(r, [100, 150, 200]);
        const c1 = Cc / (T1 - th), c2 = Cc / (T2 - th);
        const s1 = +(c1 * 1e3).toPrecision(4), s2 = +(c2 * 1e3).toPrecision(4);
        const thq = (s1 * T1 - s2 * T2) / (s1 - s2);
        return { q: `A magnetic insulator obeys $\\chi = C/(T - \\theta)$. Its susceptibility is $${s1}\\times10^{-3}$ at $${T1}$ K and $${s2}\\times10^{-3}$ at $${T2}$ K. Find $\\theta$ in kelvin (with sign, to the nearest kelvin).`,
          answer: Math.round(thq), tol: 1, s1, s2, T1, T2,
          sol: `$\\chi_1(T_1 - \\theta) = \\chi_2(T_2 - \\theta)$ gives $\\theta = \\dfrac{\\chi_1T_1 - \\chi_2T_2}{\\chi_1 - \\chi_2} = ${Math.round(thq)}$ K: ${thq > 0 ? 'positive, so the interactions are ferromagnetic' : 'negative, so the interactions are antiferromagnetic'}.` };
      },
      verify: (p) => (p.s1 * p.T1 - p.s2 * p.T2) / (p.s1 - p.s2) },
    { id: 'mgx-g07', type: 'nat', level: 3, exams: ['gate', 'net'], sub: 'saturation magnetisation',
      make(r) {
        const [el, n, m] = choose(r, [['iron', 8.48, 2.22], ['cobalt', 9.09, 1.72], ['nickel', 9.14, 0.61], ['gadolinium', 3.02, 7.63]]);
        const toM = r() < 0.5, Ms = n * 1e28 * m * muB / 1e6;
        return toM
          ? { q: `${el[0].toUpperCase() + el.slice(1)} has $${n}\\times10^{28}$ atoms per m$^3$ and a low-temperature moment of $${m}\\,\\mu_B$ per atom. Its saturation magnetisation is ______ $\\times10^6$ A/m (to three decimal places).`,
            answer: round(Ms, 3), tol: Math.max(0.002, round(Ms * 0.005, 3)), toM, n, m,
            sol: `$M_s = n\\mu = ${n}\\times10^{28}\\times${m}\\times9.274\\times10^{-24} = ${round(Ms, 3)}\\times10^6$ A/m.` }
          : { q: `${el[0].toUpperCase() + el.slice(1)} has $${n}\\times10^{28}$ atoms per m$^3$ and a saturation magnetisation of $${round(Ms, 3)}\\times10^6$ A/m at low temperature. Its moment per atom is ______ $\\mu_B$ (to two decimal places).`,
            answer: round(round(Ms, 3) * 1e6 / (n * 1e28 * muB), 2), tol: 0.01, toM, n, Msq: round(Ms, 3),
            sol: `$\\mu = M_s/n = ${round(Ms, 3)}\\times10^6/(${n}\\times10^{28}) = ${+(round(Ms, 3) * 1e6 / (n * 1e28)).toPrecision(4)}$ J/T $= ${round(round(Ms, 3) * 1e6 / (n * 1e28 * muB), 2)}\\,\\mu_B$.` };
      },
      verify: (p) => (p.toM ? p.n * 1e28 * p.m * muB / 1e6 : p.Msq * 1e6 / (p.n * 1e28 * muB)) },
    { id: 'mgx-g08', type: 'nat', level: 4, exams: ['gate', 'net'], sub: 'Brillouin function',
      make(r) {
        const B = choose(r, [0.5, 1, 2, 5, 8, 10]), want = choose(r, ['frac', 'T']);
        if (want === 'frac') {
          const T = choose(r, [0.5, 1, 2, 4.2, 10]), f = Math.tanh(muB * B / (C.kB * T));
          return { q: `Spin-$\\tfrac12$ ions ($g = 2$) at $${T}$ K are in a field of $${B}$ T. Their magnetisation as a fraction of saturation is ______ (to three decimal places).`,
            answer: round(f, 3), tol: Math.max(0.002, round(f * 0.005, 3)), want, B, T,
            sol: `$M/M_s = \\tanh(\\mu_BB/k_BT)$, with $\\mu_BB/k_BT = 0.6717\\times${B}/${T} = ${round(muB * B / (C.kB * T), 4)}$. $\\tanh$ of that $= ${round(f, 3)}$.` };
        }
        const f = choose(r, [0.1, 0.25, 0.5, 0.75, 0.9]), T = muB * B / (C.kB * Math.atanh(f));
        return { q: `Spin-$\\tfrac12$ ions ($g = 2$) are in a field of $${B}$ T. They reach $${f * 100}\\%$ of saturation magnetisation at ______ K (to three significant figures).`,
          answer: +T.toPrecision(3), tol: +(T * 0.01).toPrecision(2), want, B, f,
          sol: `$\\tanh(\\mu_BB/k_BT) = ${f}$, so $\\mu_BB/k_BT = \\tanh^{-1}${f} = ${round(Math.atanh(f), 4)}$ and $T = 0.6717\\times${B}/${round(Math.atanh(f), 4)} = ${+T.toPrecision(3)}$ K.` };
      },
      verify: (p) => (p.want === 'frac' ? Math.tanh(muB * p.B / (C.kB * p.T)) : muB * p.B / (C.kB * Math.atanh(p.f))) },
    { id: 'mgx-g09', type: 'nat', level: 3, exams: ['gate', 'net'], sub: 'Pauli paramagnetism',
      make(r) {
        const [el, na, Z] = choose(r, [['potassium', 1.40, 1], ['sodium', 2.54, 1], ['lithium', 4.63, 1], ['copper', 8.47, 1], ['magnesium', 4.30, 2], ['aluminium', 6.02, 3]]);
        const n = na * Z * 1e28, EF = C.hbar ** 2 / (2 * C.me) * (3 * Math.PI ** 2 * n) ** (2 / 3);
        const chi = 1.5 * n * C.mu0 * muB ** 2 / EF * 1e6;
        return { q: `Treat ${el} (${na}$\\times10^{28}$ atoms per m$^3$, valence ${Z}) as a free electron gas. Its Pauli spin susceptibility is ______ $\\times10^{-6}$ (to two decimal places).`,
          answer: round(chi, 2), tol: Math.max(0.02, round(chi * 0.01, 2)), n,
          sol: `$n = ${round(n / 1e28, 2)}\\times10^{28}$ m$^{-3}$, $E_F = \\dfrac{\\hbar^2}{2m}(3\\pi^2n)^{2/3} = ${round(EF / C.e, 2)}$ eV. $\\chi_P = \\dfrac{3n\\mu_0\\mu_B^2}{2E_F} = ${round(chi, 2)}\\times10^{-6}$, independent of temperature.` };
      },
      verify: (p) => 1.5 * p.n * C.mu0 * muB ** 2 / (C.hbar ** 2 / (2 * C.me) * (3 * Math.PI ** 2 * p.n) ** (2 / 3)) * 1e6 },
    { id: 'mgx-g10', type: 'nat', level: 3, exams: ['gate', 'net'], sub: 'molecular field',
      make(r) {
        const [el, Tc] = choose(r, [['nickel', 627], ['iron', 1043], ['cobalt', 1388], ['gadolinium', 292], ['CrO$_2$', 390], ['EuO', 69]]);
        const B = C.kB * Tc / muB;
        return { q: `Model ${el} ($T_C = ${Tc}$ K) as spin-$\\tfrac12$ moments ($g = 2$) in a Weiss molecular field, so that $k_BT_C = \\mu_BB_E$. The molecular field $B_E$ at $T = 0$ is about ______ T (to three significant figures).`,
          answer: +B.toPrecision(3), tol: +(B * 0.01).toPrecision(2), Tc,
          sol: `$B_E = k_BT_C/\\mu_B = 1.381\\times10^{-23}\\times${Tc}/9.274\\times10^{-24} = ${+B.toPrecision(3)}$ T: far beyond any applied field, so the "field" stands for exchange.` };
      },
      verify: (p) => C.kB * p.Tc / muB },
    { id: 'mgx-g11', type: 'nat', level: 3, exams: ['gate', 'net'], sub: 'spin waves',
      make(r) {
        const d1 = pick(r, 0.2, 2, 0.1), T1 = choose(r, [20, 40, 50, 80, 100]), k = choose(r, [1.5, 2, 2.5, 3, 4]);
        const kind = choose(r, ['ferro', 'heat']);
        const ans = kind === 'ferro' ? d1 * k ** 1.5 : d1 * k ** 3;
        return { q: kind === 'ferro' ? `A ferromagnet's magnetisation is $${d1}\\%$ below saturation at $${T1}$ K. If it follows the Bloch $T^{3/2}$ law, at $${T1 * k}$ K it is ______ % below saturation (to two decimal places).` : `The magnon heat capacity of an antiferromagnet ($\\omega \\propto k$ at small $k$, 3D) is $${d1}$ mJ mol$^{-1}$ K$^{-1}$ at $${T1}$ K. At $${T1 * k}$ K (still at low temperature) it is ______ mJ mol$^{-1}$ K$^{-1}$ (to two decimal places).`,
          answer: round(ans, 2), tol: Math.max(0.01, round(ans * 0.005, 2)), d1, k, kind,
          sol: kind === 'ferro' ? `Thermal magnons with $\\omega \\propto k^2$ number $\\propto T^{3/2}$: deficit $= ${d1}\\times${k}^{3/2} = ${round(ans, 2)}\\%$.` : `Linear magnons behave like phonons (Debye-like): $C \\propto T^3$. $${d1}\\times${k}^3 = ${round(ans, 2)}$ mJ mol$^{-1}$ K$^{-1}$.`,
          trap: kind === 'ferro' ? 'Using $T^3$ (antiferromagnet or phonons) or $T^2$.' : 'Using $T^{3/2}$, which belongs to ferromagnetic magnons.' };
      },
      verify: (p) => (p.kind === 'ferro' ? p.d1 * p.k ** 1.5 : p.d1 * p.k ** 3) },
    { id: 'mgx-g12', type: 'nat', level: 4, exams: ['gate', 'net'], sub: 'ferromagnetic resonance',
      make(r) {
        const g = choose(r, [2.0, 2.05, 2.1, 2.17, 2.2]), toF = r() < 0.5;
        if (toF) {
          const B = choose(r, [0.1, 0.2, 0.33, 0.5, 1, 1.25]), f = g * muB * B / C.h / 1e9;
          return { q: `A small ferromagnetic sphere with $g = ${g}$ sits in a field of $${B}$ T. Its uniform-precession (FMR) frequency is ______ GHz (to two decimal places).`,
            answer: round(f, 2), tol: Math.max(0.02, round(f * 0.005, 2)), toF, g, B,
            sol: `$f = g\\mu_BB/h = ${g}\\times13.996\\text{ GHz/T}\\times${B}/2 = ${round(f, 2)}$ GHz (for a sphere the demagnetising fields cancel).` };
        }
        const f = choose(r, [9.4, 24, 35, 94]), B = f * 1e9 * C.h / (g * muB);
        return { q: `Ferromagnetic resonance of a small sphere with $g = ${g}$ is observed at $${f}$ GHz. The resonance field is ______ T (to three decimal places).`,
          answer: round(B, 3), tol: Math.max(0.002, round(B * 0.005, 3)), toF, g, f,
          sol: `$B = hf/g\\mu_B = 6.626\\times10^{-34}\\times${f}\\times10^9/(${g}\\times9.274\\times10^{-24}) = ${round(B, 3)}$ T.` };
      },
      verify: (p) => (p.toF ? p.g * muB * p.B / C.h / 1e9 : p.f * 1e9 * C.h / (p.g * muB)) },
  ],
};
