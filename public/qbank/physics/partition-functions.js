// Partition functions: Z and thermodynamics (F, U, S, C), factorisation, two-level systems and the Schottky anomaly,
// quantum harmonic oscillator, rotors (symmetry number, ortho/para), paramagnets (tanh, Brillouin, Curie law),
// adiabatic demagnetisation. Original questions for GATE and CSIR NET practice (fibub), MSc level.
import { pick, int, choose, mcqOptions, round, C } from '../_util.js';

const kB = 8.617333e-5; // eV/K
const muB = 9.2740100783e-24; // J/T
const schottky = (x) => (x * x * Math.exp(x)) / (1 + Math.exp(x)) ** 2;
const einstein = (x) => (x * x * Math.exp(x)) / (Math.exp(x) - 1) ** 2;
const orthoPara = (t) => { let o = 0, p = 0; for (let J = 0; J < 40; J++) { const w = (2 * J + 1) * Math.exp(-J * (J + 1) * t); if (J % 2) o += 3 * w; else p += w; } return o / p; };

export default {
  topic: 'partition-functions',
  items: [
    // ---- level 1 ----
    { id: 'pfun-001', type: 'mcq', level: 1, exams: ['gate', 'net'], sub: 'definition',
      q: 'A system has energy levels $E_j$ with degeneracies $g_j$. Its canonical partition function is',
      options: ['$Z = \\sum_j E_j\\,e^{-E_j/kT}$', '$Z = \\sum_j g_j\\,e^{-E_j/kT}$', '$Z = \\sum_j g_j\\,e^{E_j/kT}$', '$Z = \\prod_j g_j\\,e^{-E_j/kT}$'], answer: 1,
      sol: 'Sum the Boltzmann factor over every microstate. A level with $g_j$ states contributes $g_j$ equal terms: $Z = \\sum_j g_je^{-\\beta E_j}$.',
      trap: 'Summing over levels without the degeneracy undercounts states.' },
    { id: 'pfun-002', type: 'mcq', level: 1, exams: ['gate', 'net'], sub: 'thermodynamics',
      q: 'The Helmholtz free energy is obtained from the canonical partition function as',
      options: ['$F = kT\\ln Z$', '$F = -\\ln Z/kT$', '$F = -kT\\ln Z$', '$F = -kT\\,Z$'], answer: 2,
      sol: '$F = -kT\\ln Z$. Everything else follows: $S = -(\\partial F/\\partial T)_V$, $P = -(\\partial F/\\partial V)_T$, $U = F + TS$.' },
    { id: 'pfun-003', type: 'mcq', level: 1, exams: ['gate', 'net'], sub: 'factorisation',
      q: 'Two independent, distinguishable subsystems have partition functions $Z_1$ and $Z_2$. The partition function of the combined system is',
      options: ['$Z_1Z_2$', '$Z_1 + Z_2$', '$Z_1Z_2/2$', '$\\sqrt{Z_1Z_2}$'], answer: 0,
      sol: 'Energies add, $E = E_1 + E_2$, so Boltzmann factors multiply and the double sum factorises: $Z = Z_1Z_2$. Then $\\ln Z$, $F$, $U$, $S$ all add.' },
    { id: 'pfun-004', type: 'mcq', level: 1, exams: ['gate', 'net'], sub: 'factorisation',
      q: 'For $N$ identical, non-interacting particles of a dilute classical gas, each with single-particle partition function $Z_1$, the $N$-particle partition function is',
      options: ['$Z_1^N$', '$NZ_1$', '$Z_1^N/N$', '$Z_1^N/N!$'], answer: 3,
      sol: 'Swapping identical particles gives the same state; in the dilute limit each state is counted $N!$ times in $Z_1^N$, so $Z_N = Z_1^N/N!$. Without the $N!$ the entropy is not extensive (Gibbs paradox). Atoms fixed on lattice sites are distinguishable by position and use $Z_1^N$.' },
    { id: 'pfun-005', type: 'mcq', level: 1, exams: ['gate', 'net'], sub: 'limits',
      q: 'A quantum system has only 4 states in total, all at finite energy. As $T \\to$ very large, its partition function tends to',
      options: ['0', '1', 'a value growing without limit', '4'], answer: 3,
      sol: 'Every Boltzmann factor $e^{-E/kT} \\to 1$, so $Z \\to$ the number of states, 4. Its entropy tends to $k\\ln4$.' },
    { id: 'pfun-006', type: 'msq', level: 1, exams: ['gate', 'net'], sub: 'limits', format: 'multi',
      q: 'A system has a non-degenerate ground state at energy $0$ and all other states above it. As $T \\to 0$, which statements are correct?',
      options: ['$Z \\to 1$', '$U \\to 0$', '$S \\to 0$', '$F \\to -$ a very large value'], answer: [0, 1, 2],
      sol: 'Only the ground-state term survives: $Z \\to 1$, $\\ln Z \\to 0$, so $F = -kT\\ln Z \\to 0$, $U \\to 0$ and $S = (U - F)/T \\to 0$ (third law for a non-degenerate ground state).' },

    // ---- level 2 ----
    { id: 'pfun-007', type: 'nat', level: 2, exams: ['gate', 'net'], sub: 'two-level',
      q: 'A two-level system has non-degenerate levels at $0$ and $\\varepsilon$. At $kT = \\varepsilon$, its mean energy in units of $\\varepsilon$ is ______.',
      answer: 0.269, tol: 0.003, calc: () => 1 / (Math.E + 1),
      sol: '$Z = 1 + e^{-1}$, $U = \\varepsilon e^{-1}/(1 + e^{-1}) = \\varepsilon/(e + 1) = 0.269\\varepsilon$.' },
    { id: 'pfun-008', type: 'mcq', level: 2, exams: ['gate', 'net'], sub: 'two-level',
      q: 'The mean energy of a two-level system (levels $0$ and $\\varepsilon$, non-degenerate) at temperature $T$ is',
      options: ['$\\dfrac{\\varepsilon}{e^{\\varepsilon/kT} - 1}$', '$\\varepsilon\\tanh(\\varepsilon/kT)$', '$\\dfrac{\\varepsilon}{e^{\\varepsilon/kT} + 1}$', '$\\dfrac{\\varepsilon}{2}$'], answer: 2,
      sol: '$U = -\\partial\\ln(1 + e^{-\\beta\\varepsilon})/\\partial\\beta = \\varepsilon e^{-\\beta\\varepsilon}/(1 + e^{-\\beta\\varepsilon}) = \\varepsilon/(e^{\\beta\\varepsilon} + 1)$. It rises to $\\varepsilon/2$ at high $T$, never beyond.',
      trap: 'The minus-one form belongs to the harmonic oscillator, which has infinitely many levels.' },
    { id: 'pfun-009', type: 'mcq', level: 2, exams: ['gate', 'net'], sub: 'oscillator',
      q: 'The partition function of a quantum harmonic oscillator with levels $(n + \\tfrac12)\\hbar\\omega$ is',
      options: ['$\\dfrac{1}{1 - e^{-\\beta\\hbar\\omega}}$', '$\\dfrac{e^{-\\beta\\hbar\\omega/2}}{1 - e^{-\\beta\\hbar\\omega}}$', '$\\dfrac{e^{\\beta\\hbar\\omega/2}}{1 - e^{-\\beta\\hbar\\omega}}$', '$\\dfrac{kT}{\\hbar\\omega}$'], answer: 1,
      sol: 'Geometric series: $Z = e^{-x/2}\\sum_n e^{-nx} = e^{-x/2}/(1 - e^{-x}) = 1/[2\\sinh(x/2)]$ with $x = \\beta\\hbar\\omega$. $kT/\\hbar\\omega$ is its high-temperature (classical) limit; the first option omits the zero-point energy.' },
    { id: 'pfun-010', type: 'nat', level: 2, exams: ['gate', 'net'], sub: 'oscillator',
      q: 'For a quantum oscillator with $\\hbar\\omega = kT$, the mean number of quanta $\\langle n\\rangle$ is ______.',
      answer: 0.582, tol: 0.003, calc: () => 1 / (Math.E - 1),
      sol: '$\\langle n\\rangle = 1/(e^{\\beta\\hbar\\omega} - 1) = 1/(e - 1) = 0.582$. The mean energy is $\\hbar\\omega(\\langle n\\rangle + \\tfrac12) = 1.082\\,kT$, close to the classical $kT$.' },
    { id: 'pfun-011', type: 'mcq', level: 2, exams: ['gate', 'net'], sub: 'paramagnet',
      q: '$N$ spin-1/2 moments, each with energy $\\mp\\mu B$ when parallel or antiparallel to the field, are at temperature $T$. The magnetisation is',
      options: ['$N\\mu\\coth(\\mu B/kT)$', '$N\\mu\\tanh(\\mu B/kT)$', '$N\\mu^2B/3kT$ exactly', '$N\\mu\\,e^{-\\mu B/kT}$'], answer: 1,
      sol: '$Z_1 = 2\\cosh x$ with $x = \\mu B/kT$. $\\langle\\mu_z\\rangle = \\mu(e^x - e^{-x})/(e^x + e^{-x}) = \\mu\\tanh x$. It saturates at $N\\mu$ and is linear ($N\\mu^2B/kT$) for small $x$.' },
    { id: 'pfun-012', type: 'nat', level: 2, exams: ['gate', 'net'], sub: 'paramagnet',
      q: 'For spin-1/2 moments in a field with $\\mu B/kT = 0.5$, the fraction of moments pointing along the field is ______.',
      answer: 0.731, tol: 0.003, calc: () => Math.exp(0.5) / (2 * Math.cosh(0.5)),
      sol: '$P_\\uparrow = e^{x}/(e^x + e^{-x}) = 1/(1 + e^{-2x}) = 1/(1 + e^{-1}) = 0.731$.' },
    { id: 'pfun-013', type: 'mcq', level: 2, exams: ['gate', 'net'], sub: 'rotor',
      q: 'For a heteronuclear diatomic molecule with rotational temperature $\\theta_r = \\hbar^2/2Ik$, the rotational partition function at $T \\gg \\theta_r$ is',
      options: ['$T/2\\theta_r$', '$\\theta_r/T$', '$\\sqrt{T/\\theta_r}$', '$T/\\theta_r$'], answer: 3,
      sol: '$Z = \\sum_J(2J + 1)e^{-J(J+1)\\theta_r/T}$. With $u = J(J+1)$, $du = (2J + 1)dJ$, the sum becomes $\\int_0^\\infty e^{-u\\theta_r/T}du = T/\\theta_r$. Homonuclear molecules get an extra $1/2$ (symmetry number).' },
    { id: 'pfun-014', type: 'nat', level: 2, exams: ['gate', 'net'], sub: 'rotor',
      q: 'HCl has $\\theta_r = 15.2$ K. Using the high-temperature result, its rotational partition function at $300$ K is ______.',
      answer: 19.7, tol: 0.2, calc: () => 300 / 15.2,
      sol: 'HCl is heteronuclear ($\\sigma = 1$): $Z_{\\rm rot} \\approx T/\\theta_r = 300/15.2 = 19.7$. About 20 rotational levels are appreciably populated.' },
    { id: 'pfun-015', type: 'nat', level: 2, exams: ['gate', 'net'], sub: 'degeneracy',
      q: 'An atom has a non-degenerate ground level and a triply degenerate excited level at energy $\\varepsilon$ above it. At $kT = \\varepsilon$, the probability that the atom is in the excited level is ______.',
      answer: 0.525, tol: 0.004, calc: () => 3 * Math.exp(-1) / (1 + 3 * Math.exp(-1)),
      sol: '$Z = 1 + 3e^{-1} = 2.104$. $P = 3e^{-1}/Z = 1.104/2.104 = 0.525$. More than half are excited even though $kT$ only equals the gap, because there are three upper states.',
      trap: 'Forgetting the degeneracy gives 0.269.' },
    { id: 'pfun-016', type: 'mcq', level: 2, exams: ['gate', 'net'], sub: 'thermodynamics',
      q: 'A gas has $Z = A\\,V^N T^{5N/2}$, with $A$ independent of $T$ and $V$. Its internal energy is',
      options: ['$\\tfrac32NkT$', '$\\tfrac52NkT$', '$NkT$', '$\\tfrac72NkT$'], answer: 1,
      sol: '$U = kT^2\\,\\partial\\ln Z/\\partial T = kT^2\\cdot\\tfrac{5N}{2T} = \\tfrac52NkT$, a rigid diatomic gas. The $V^N$ gives $P = kT\\,\\partial\\ln Z/\\partial V = NkT/V$.' },
    { id: 'pfun-017', type: 'msq', level: 2, exams: ['gate', 'net'], sub: 'thermodynamics', format: 'multi',
      q: 'Which of the following correctly give a thermodynamic quantity from $Z(T, V, N)$?',
      options: ['$U = kT^2(\\partial\\ln Z/\\partial T)_V$', '$P = kT(\\partial\\ln Z/\\partial V)_T$', '$S = k\\ln Z$', '$\\mu = -kT(\\partial\\ln Z/\\partial N)_{T,V}$'], answer: [0, 1, 3],
      sol: 'From $F = -kT\\ln Z$: $P = -\\partial F/\\partial V = kT\\,\\partial_V\\ln Z$; $\\mu = \\partial F/\\partial N = -kT\\,\\partial_N\\ln Z$; $U = -\\partial_\\beta\\ln Z = kT^2\\partial_T\\ln Z$. The entropy is $S = k\\ln Z + U/T$, not $k\\ln Z$ alone.' },
    { id: 'pfun-018', type: 'mcq', level: 2, exams: ['gate', 'net'], sub: 'two-level',
      q: 'At what temperature is one third of a collection of two-level systems (non-degenerate levels $0$ and $\\varepsilon$) in the upper level?',
      options: ['$kT = \\varepsilon/\\ln3$', '$kT = \\varepsilon\\ln2$', '$kT = \\varepsilon/3$', '$kT = \\varepsilon/\\ln2$'], answer: 3,
      sol: '$\\frac{e^{-x}}{1 + e^{-x}} = \\frac13 \\Rightarrow e^{-x} = \\frac12 \\Rightarrow x = \\varepsilon/kT = \\ln2$, so $kT = \\varepsilon/\\ln2 \\approx 1.44\\,\\varepsilon$.',
      trap: '$\\varepsilon/\\ln3$ would give an upper fraction of 1/4 (ratio 1/3, not fraction 1/3).' },

    // ---- level 3 ----
    { id: 'pfun-019', type: 'nat', level: 3, exams: ['gate', 'net'], sub: 'two-level',
      q: 'The heat capacity of one two-level unit (levels $0$ and $\\varepsilon$), in units of $k$, at $kT = \\varepsilon$ is ______.',
      answer: 0.197, tol: 0.002, calc: () => schottky(1),
      sol: '$C/k = x^2e^x/(1 + e^x)^2$ with $x = \\varepsilon/kT = 1$: $e/(1 + e)^2 = 2.718/13.83 = 0.197$.' },
    { id: 'pfun-020', type: 'nat', level: 3, exams: ['gate', 'net'], sub: 'two-level',
      q: 'For the same two-level unit at $kT = \\varepsilon$, the entropy in units of $k$ is ______.',
      answer: 0.582, tol: 0.003, calc: () => Math.log(1 + Math.exp(-1)) + 1 / (Math.E + 1),
      sol: '$S/k = \\ln Z + \\beta U = \\ln(1 + e^{-1}) + 1/(e + 1) = 0.3133 + 0.2689 = 0.582$, on its way to $\\ln2 = 0.693$ at high $T$.' },
    { id: 'pfun-021', type: 'mcq', level: 3, exams: ['gate', 'net'], sub: 'oscillator',
      q: 'The heat capacity of a quantum harmonic oscillator (frequency $\\omega$, $x = \\hbar\\omega/kT$) is',
      options: ['$k\\dfrac{x^2e^x}{(e^x - 1)^2}$', '$k\\dfrac{x^2e^x}{(e^x + 1)^2}$', '$k\\,x^2e^{-x}$ at all $T$', '$k$ at all $T$'], answer: 0,
      sol: '$U = \\hbar\\omega/2 + \\hbar\\omega/(e^x - 1)$; $dU/dT = k x^2e^x/(e^x - 1)^2$ (the Einstein function). It tends to $k$ when $x \\to 0$ and to $kx^2e^{-x}$ when $x$ is large. The plus sign belongs to the two-level (Schottky) result.' },
    { id: 'pfun-022', type: 'nat', level: 3, exams: ['gate', 'net'], sub: 'oscillator',
      q: 'In the Einstein model of a solid, the heat capacity at $T = \\theta_E$ is what fraction of the Dulong-Petit value $3Nk$?',
      answer: 0.921, tol: 0.003, calc: () => einstein(1),
      sol: '$C/3Nk = x^2e^x/(e^x - 1)^2$ with $x = \\theta_E/T = 1$: $e/(e - 1)^2 = 2.718/2.952 = 0.921$.' },
    { id: 'pfun-023', type: 'mcq', level: 3, exams: ['gate', 'net'], sub: 'paramagnet',
      q: 'A spin-1 ion in a field has levels $-m\\,\\mu B$ with $m = -1, 0, +1$. With $x = \\mu B/kT$, the mean value $\\langle m\\rangle$ is',
      options: ['$\\tanh x$', '$\\dfrac{2\\sinh x}{2\\cosh x - 1}$', '$\\dfrac{2\\sinh x}{1 + 2\\cosh x}$', '$\\coth x - 1/x$'], answer: 2,
      sol: '$Z = e^{x} + 1 + e^{-x} = 1 + 2\\cosh x$; $\\langle m\\rangle = \\partial\\ln Z/\\partial x = 2\\sinh x/(1 + 2\\cosh x)$. ($\\tanh x$ is spin-1/2; $\\coth x - 1/x$ is the classical Langevin function.)' },
    { id: 'pfun-024', type: 'nat', level: 3, exams: ['gate', 'net'], sub: 'paramagnet',
      q: 'For the spin-1 ion above with $x = \\mu B/kT = 1$, $\\langle m\\rangle$ is ______.',
      answer: 0.575, tol: 0.003, calc: () => 2 * Math.sinh(1) / (1 + 2 * Math.cosh(1)),
      sol: '$2\\sinh1/(1 + 2\\cosh1) = 2.3504/(1 + 3.0862) = 0.575$.' },
    { id: 'pfun-025', type: 'msq', level: 3, exams: ['gate', 'net'], sub: 'paramagnet', format: 'statements',
      q: 'For ideal paramagnetic ions of total angular momentum $J$ and Landé factor $g$, which statements are correct?',
      options: ['The saturation moment per ion is $gJ\\mu_B$', 'The high-temperature susceptibility is proportional to $g^2J(J+1)/T$', 'The magnetisation depends on $B$ and $T$ only through $B/T$', 'The susceptibility is independent of temperature'], answer: [0, 1, 2],
      sol: 'Levels $m_Jg\\mu_BB$ give $M = NgJ\\mu_B\\,B_J(gJ\\mu_BB/kT)$, saturating at $NgJ\\mu_B$ and depending only on $B/T$. Expanding, $\\chi = \\mu_0Ng^2\\mu_B^2J(J+1)/3kT$: Curie’s law, strongly temperature dependent.' },
    { id: 'pfun-026', type: 'mcq', level: 3, exams: ['gate', 'net'], sub: 'translation',
      q: 'For a particle of mass $m$ in a one-dimensional box of length $L$ at a temperature where many levels are occupied, $Z_1$ is',
      options: ['$L/\\lambda$, with $\\lambda = h/\\sqrt{2\\pi mkT}$', '$\\lambda/L$', '$L\\sqrt{2mkT}/\\hbar$', '$(L/\\lambda)^3$'], answer: 0,
      sol: '$Z_1 = \\sum_n e^{-n^2h^2/8mL^2kT} \\approx \\int_0^\\infty e^{-an^2}dn = \\tfrac12\\sqrt{\\pi/a}$ with $a = h^2/8mL^2kT$, giving $L\\sqrt{2\\pi mkT}/h = L/\\lambda$. In 3D it becomes $V/\\lambda^3$.' },
    { id: 'pfun-027', type: 'nat', level: 3, exams: ['gate', 'net'], sub: 'vibration',
      q: 'A diatomic gas has vibrational temperature $\\theta_v = 800$ K. At $300$ K, the fraction of molecules in the first excited vibrational level ($v = 1$) is ______.',
      answer: 0.0647, tol: 0.001, calc: () => { const x = 800 / 300; return Math.exp(-x) * (1 - Math.exp(-x)); },
      sol: '$P_v = e^{-vx}(1 - e^{-x})$ with $x = 800/300 = 2.667$ (the zero-point factor cancels). $e^{-2.667} = 0.0695$, so $P_1 = 0.0695\\times0.9305 = 0.0647$.' },
    { id: 'pfun-028', type: 'msq', level: 3, exams: ['gate', 'net'], sub: 'factorisation', format: 'statements',
      q: 'For a dilute gas of diatomic molecules, $Z_1 = Z_{\\rm trans}Z_{\\rm rot}Z_{\\rm vib}Z_{\\rm el}$. Which statements are correct?',
      options: ['Only $Z_{\\rm trans}$ depends on the volume', 'The pressure comes entirely from the translational part', 'The heat capacity is a sum of translational, rotational, vibrational and electronic parts', 'The rotational part makes the gas non-ideal'], answer: [0, 1, 2],
      sol: '$Z_{\\rm trans} = V/\\lambda^3$; the internal factors depend on $T$ only, so $P = NkT\\,\\partial_V\\ln Z_1 = NkT/V$ whatever the molecule. Since $\\ln Z$ is a sum, $U$ and $C_V$ are sums. Internal motion does not affect the equation of state.' },
    { id: 'pfun-029', type: 'mcq', level: 3, exams: ['gate', 'net'], sub: 'two-level',
      q: 'Which statement about the Schottky heat capacity of a two-level system is correct?',
      options: ['It rises linearly with $T$ at low temperature', 'It approaches $k/2$ at high temperature', 'It has a single maximum near $kT \\approx 0.42\\,\\varepsilon$ and falls as $1/T^2$ at high $T$', 'It is constant above $kT = \\varepsilon$'], answer: 2,
      sol: '$C/k = x^2e^x/(1 + e^x)^2$: at low $T$ (large $x$) $\\approx x^2e^{-x}$, exponentially small because of the gap; at high $T$ $\\approx x^2/4 \\propto 1/T^2$ because the system cannot hold more than $\\varepsilon/2$. The peak, $C \\approx 0.44k$, is at $x \\approx 2.4$.' },
    { id: 'pfun-030', type: 'nat', level: 3, exams: ['gate', 'net'], sub: 'oscillator',
      q: 'The mean energy of a quantum oscillator with $\\hbar\\omega = kT$ (zero-point energy included), in units of $kT$, is ______.',
      answer: 1.082, tol: 0.003, calc: () => 0.5 + 1 / (Math.E - 1),
      sol: '$U = \\hbar\\omega\\left(\\tfrac12 + \\frac{1}{e^x - 1}\\right) = kT(0.5 + 0.582) = 1.082\\,kT$. The high-$T$ expansion $U \\approx kT + (\\hbar\\omega)^2/12kT = 1.083\\,kT$ agrees.' },

    // ---- level 4 ----
    { id: 'pfun-031', type: 'nat', level: 4, exams: ['gate', 'net'], sub: 'paramagnet',
      q: 'The entropy per spin of an ideal spin-1/2 paramagnet is $S/Nk = \\ln(2\\cosh x) - x\\tanh x$ with $x = \\mu B/kT$. At $x = 1$, $S/Nk$ is ______.',
      answer: 0.365, tol: 0.003, calc: () => Math.log(2 * Math.cosh(1)) - Math.tanh(1),
      sol: '$\\ln(2\\times1.5431) = 1.1269$ and $\\tanh1 = 0.7616$, so $S/Nk = 0.365$, about half of the zero-field value $\\ln2 = 0.693$.' },
    { id: 'pfun-032', type: 'nat', level: 4, exams: ['gate', 'net'], sub: 'demagnetisation', unit: 'K',
      q: 'An ideal paramagnetic salt at $1.0$ K in a field of $2.0$ T is thermally isolated and the field is slowly lowered to $0.05$ T. Ignoring lattice heat and internal fields, the final temperature is ______ K.',
      answer: 0.025, tol: 0.0005, calc: () => 1.0 * 0.05 / 2.0,
      sol: 'For an ideal paramagnet $Z$, and so $S$, depends only on $B/T$. Slow and isolated means $S$ constant, so $B/T$ is constant: $T_f = 1.0\\times0.05/2.0 = 0.025$ K. In real salts internal fields set a floor.' },
    { id: 'pfun-033', type: 'mcq', level: 4, exams: ['gate', 'net'], sub: 'rotor',
      q: 'Applying the Euler-Maclaurin formula to $Z_{\\rm rot} = \\sum_J(2J + 1)e^{-J(J+1)\\theta_r/T}$ gives, for $T \\gg \\theta_r$,',
      options: ['$T/\\theta_r - 1/3$', '$T/\\theta_r + 1/2$', '$T/\\theta_r + 1/3 + \\theta_r/15T + \\ldots$', '$T/\\theta_r\\,e^{-\\theta_r/T}$'], answer: 2,
      sol: 'With $f(u) = e^{-u\\theta_r/T}$ in $u = J(J+1)$: $\\sum \\approx \\int + \\tfrac12f(0) - \\tfrac1{12}f\'(0)\\ldots$ worked out in $J$ gives $Z = T/\\theta_r + 1/3 + \\theta_r/15T + \\ldots$ (Mulholland). The $1/3$ does not change $C_V$ at leading order.' },
    { id: 'pfun-034', type: 'mcq', level: 4, exams: ['gate', 'net'], sub: 'oscillator',
      q: 'The free energy of a single quantum oscillator is',
      options: ['$F = kT\\ln(1 - e^{-\\hbar\\omega/kT})$', '$F = \\tfrac12\\hbar\\omega + kT\\ln(1 - e^{-\\hbar\\omega/kT})$', '$F = \\tfrac12\\hbar\\omega - kT\\ln(1 - e^{-\\hbar\\omega/kT})$', '$F = -kT\\ln(kT/\\hbar\\omega)$ at all $T$'], answer: 1,
      sol: '$F = -kT\\ln Z = -kT[-x/2 - \\ln(1 - e^{-x})] = \\tfrac12\\hbar\\omega + kT\\ln(1 - e^{-x})$. The log is negative, so $F$ falls below $\\hbar\\omega/2$ as $T$ rises. $-kT\\ln(kT/\\hbar\\omega)$ is only the classical limit.' },
    { id: 'pfun-035', type: 'nat', level: 4, exams: ['gate', 'net'], sub: 'oscillator',
      q: 'Using the result above, the free energy of a quantum oscillator at $kT = \\hbar\\omega$, in units of $\\hbar\\omega$, is ______.',
      answer: 0.0413, tol: 0.002, calc: () => 0.5 + Math.log(1 - Math.exp(-1)),
      sol: '$F/\\hbar\\omega = 0.5 + \\ln(1 - e^{-1}) = 0.5 + \\ln0.6321 = 0.5 - 0.4587 = 0.0413$.' },
    { id: 'pfun-036', type: 'msq', level: 4, exams: ['gate', 'net'], sub: 'two-level', format: 'statements',
      q: 'For $N$ two-level units (levels $0$ and $\\varepsilon$) in a bath, which statements are correct?',
      options: ['The heat capacity peaks at about $0.44Nk$', 'The peak is near $kT \\approx 0.42\\varepsilon$', 'At high temperature the heat capacity falls as $1/T^2$', 'At low temperature the heat capacity is proportional to $T$'], answer: [0, 1, 2],
      sol: 'Maximising $x^2e^x/(1 + e^x)^2$ gives $x \\approx 2.40$ ($kT = 0.417\\varepsilon$) and value $0.439$. High $T$: $\\approx x^2/4$. Low $T$: $\\approx x^2e^{-x}$, activated, not linear. Such a bump on top of a lattice $T^3$ is how crystal-field splittings are measured.' },
    { id: 'pfun-037', type: 'mcq', level: 4, exams: ['gate', 'net'], sub: 'fluctuation',
      q: 'For a paramagnet in the canonical ensemble, the zero-field susceptibility per unit volume is related to fluctuations of the total moment $M$ by',
      options: ['$\\chi = \\mu_0\\langle M\\rangle^2/VkT$', '$\\chi = \\mu_0\\langle(\\Delta M)^2\\rangle\\,kT/V$', '$\\chi = \\mu_0\\langle(\\Delta M)^2\\rangle/VkT$', '$\\chi = \\langle(\\Delta M)^2\\rangle/\\mu_0 V$'], answer: 2,
      sol: 'With energy $-MB$, $\\langle M\\rangle = kT\\,\\partial\\ln Z/\\partial B$ and $\\partial\\langle M\\rangle/\\partial B = \\langle(\\Delta M)^2\\rangle/kT$. Hence $\\chi = \\mu_0\\langle(\\Delta M)^2\\rangle/VkT$: a fluctuation-response relation, like $C_V = \\langle(\\Delta E)^2\\rangle/kT^2$.' },
    { id: 'pfun-038', type: 'mcq', level: 4, exams: ['gate', 'net'], sub: 'rotor',
      q: 'In hydrogen, ortho-H$_2$ (nuclear spin 1) has only odd $J$ and para-H$_2$ (nuclear spin 0) only even $J$. In equilibrium at high temperature the ortho : para ratio is',
      options: ['1 : 1', '1 : 3', '2 : 1', '3 : 1'], answer: 3,
      sol: 'Nuclear spin weights: triplet 3, singlet 1. At high $T$ odd and even $J$ sums are equal, so ortho : para $= 3 : 1$. At low $T$ only $J = 0$ (para) survives.' },
    { id: 'pfun-039', type: 'nat', level: 4, exams: ['gate', 'net'], sub: 'paramagnet',
      q: 'Compare the low-field susceptibility of (i) two-state moments that can only be $\\pm\\mu$ along the field with (ii) classical moments of magnitude $\\mu$ free to point in any direction. The ratio $\\chi_{\\rm (i)}/\\chi_{\\rm (ii)}$ at the same $T$ is ______.',
      answer: 3, tol: 0, calc: () => 1 / (1 / 3),
      sol: '(i) $\\langle\\mu_z\\rangle = \\mu\\tanh x \\approx \\mu x$. (ii) Langevin: $\\mu L(x) = \\mu(\\coth x - 1/x) \\approx \\mu x/3$. Ratio 3: a classical moment spends most of its time at an angle to the field.' },
    { id: 'pfun-040', type: 'nat', level: 4, exams: ['gate', 'net'], sub: 'electronic',
      q: 'A radical has two electronic levels of equal degeneracy separated by $\\Delta/k = 174$ K. At $100$ K their contribution to the molar heat capacity, in units of $R$, is ______.',
      answer: 0.385, tol: 0.003, calc: () => schottky(1.74),
      sol: 'Equal degeneracies cancel, giving the two-level form $C/R = x^2e^x/(1 + e^x)^2$ with $x = 1.74$: $3.0276\\times5.697/6.697^2 = 0.385$.' },

    // ---- level 5 ----
    { id: 'pfun-041', type: 'nat', level: 5, exams: ['gate', 'net'], sub: 'rotor',
      q: 'Hydrogen has $\\theta_r = 85.3$ K. In true equilibrium at $77$ K (including nuclear-spin weights 3 for odd $J$, 1 for even $J$), the ortho : para ratio is ______.',
      answer: 0.976, tol: 0.01, calc: () => orthoPara(85.3 / 77),
      sol: '$\\theta_r/T = 1.108$. Even: $1 + 5e^{-6.647} + \\ldots = 1.0065$. Odd: $3[3e^{-2.216} + 7e^{-13.29} + \\ldots] = 3\\times0.3273 = 0.9819$. Ratio $0.9819/1.0065 \\approx 0.976$, far below the 3 : 1 of room temperature. Normal hydrogen cooled quickly keeps 3 : 1 and slowly releases heat as it converts.' },
    { id: 'pfun-042', type: 'mcq', level: 5, exams: ['gate', 'net'], sub: 'oscillator',
      q: 'An isotropic 2D oscillator has levels $E_n = n\\hbar\\omega$ (zero-point energy dropped) with degeneracy $n + 1$. Its mean energy is',
      options: ['$\\dfrac{\\hbar\\omega}{e^{\\beta\\hbar\\omega} - 1}$', '$\\dfrac{2\\hbar\\omega}{e^{\\beta\\hbar\\omega} - 1}$', '$\\dfrac{2\\hbar\\omega}{e^{\\beta\\hbar\\omega} + 1}$', '$\\dfrac{\\hbar\\omega}{(e^{\\beta\\hbar\\omega} - 1)^2}$'], answer: 1,
      sol: '$Z = \\sum(n + 1)y^n = 1/(1 - y)^2$, $y = e^{-\\beta\\hbar\\omega}$: the product of two 1D oscillators, as it must be. $U = -\\partial_\\beta\\ln Z = 2\\hbar\\omega/(e^{\\beta\\hbar\\omega} - 1)$.' },
    { id: 'pfun-043', type: 'msq', level: 5, exams: ['gate', 'net'], sub: 'limits', format: 'statements',
      q: 'For a quantum harmonic oscillator, which statements about the limits are correct?',
      options: ['When $kT \\gg \\hbar\\omega$, $Z \\approx kT/\\hbar\\omega$, the classical phase-space result', 'When $kT \\gg \\hbar\\omega$, $S/k \\approx 1 + \\ln(kT/\\hbar\\omega)$', 'When $kT \\ll \\hbar\\omega$, $C \\approx k(\\hbar\\omega/kT)^2e^{-\\hbar\\omega/kT}$', 'When $kT \\ll \\hbar\\omega$, the entropy tends to $k\\ln2$'], answer: [0, 1, 2],
      sol: 'High $T$: $Z = 1/2\\sinh(x/2) \\approx 1/x$; $S/k = \\ln Z + \\beta U \\approx -\\ln x + 1$. Low $T$: $C \\approx kx^2e^{-x}$ and the unique ground state gives $S \\to 0$.' },
    { id: 'pfun-044', type: 'nat', level: 5, exams: ['gate', 'net'], sub: 'degeneracy',
      q: 'A system has a non-degenerate ground state and a doubly degenerate level at $\\varepsilon$. Its entropy, in units of $k$, at $kT = \\varepsilon$ is ______.',
      answer: 0.976, tol: 0.004, calc: () => { const z = 1 + 2 * Math.exp(-1); return Math.log(z) + 2 * Math.exp(-1) / z; },
      sol: '$Z = 1 + 2e^{-1} = 1.7358$, $\\beta U = 2e^{-1}/Z = 0.4239$. $S/k = \\ln1.7358 + 0.4239 = 0.5515 + 0.4239 = 0.976$, heading for $\\ln3 = 1.099$ at high $T$.' },
    { id: 'pfun-045', type: 'msq', level: 3, exams: ['gate', 'net'], sub: 'zero of energy', format: 'statements',
      q: 'Every energy level of a system is shifted up by the same constant $E_0$. Which quantities change?',
      options: ['The partition function $Z$', 'The free energy $F$', 'The entropy $S$', 'The heat capacity $C_V$'], answer: [0, 1],
      sol: '$Z \\to Ze^{-\\beta E_0}$, so $F \\to F + E_0$ and $U \\to U + E_0$. Probabilities $e^{-\\beta E_i}/Z$ are unchanged, so $S = -k\\sum p\\ln p$ and $C_V = \\partial U/\\partial T$ do not change. This is why the oscillator zero-point energy never affects $C_V$.' },
    { id: 'pfun-046', type: 'msq', level: 4, exams: ['gate', 'net'], sub: 'paramagnet', format: 'statements',
      q: 'For $N$ ideal spin-1/2 moments ($\\pm\\mu$) in a field $B$ at temperature $T$, with $x = \\mu B/kT$, which statements are correct?',
      options: ['$U = -N\\mu B\\tanh x$', 'The heat capacity has the Schottky form with gap $2\\mu B$', 'The entropy at fixed $B$ falls as $T$ is lowered', 'The susceptibility at small $x$ is independent of $T$'], answer: [0, 1, 2],
      sol: '$Z_1 = 2\\cosh x$, $U = -N\\mu B\\tanh x$. The two levels $\\mp\\mu B$ are $2\\mu B$ apart, so $C$ is the two-level Schottky curve. $S/Nk = \\ln(2\\cosh x) - x\\tanh x$ falls as $x$ grows. At small $x$, $M \\approx N\\mu^2B/kT$: Curie law, $\\chi \\propto 1/T$.' },
  ],
  gens: [
    { id: 'pfun-g01', type: 'nat', level: 2, exams: ['gate', 'net'], sub: 'two-level',
      make(r) {
        const eps = int(r, 5, 60), T = choose(r, [50, 100, 200, 300, 400]);
        const x = eps * 1e-3 / (kB * T), U = eps / (Math.exp(x) + 1);
        return { q: `Non-degenerate levels at $0$ and $${eps}$ meV form a two-level system at $${T}$ K. Its mean energy is ______ meV. ($k = 8.617\\times10^{-5}$ eV/K)`,
          answer: round(U, 3), tol: Math.max(0.005, round(U * 0.01, 3)), unit: 'meV', eps, T,
          sol: `$x = \\varepsilon/kT = ${eps}/${round(kB * T * 1000, 3)} = ${round(x, 4)}$. $U = \\varepsilon/(e^x + 1) = ${eps}/(${round(Math.exp(x), 4)} + 1) \\approx ${round(U, 3)}$ meV.` };
      },
      verify: (p) => p.eps / (Math.exp(p.eps * 1e-3 / (kB * p.T)) + 1) },
    { id: 'pfun-g02', type: 'nat', level: 3, exams: ['gate', 'net'], sub: 'two-level',
      make(r) {
        const x = choose(r, [0.5, 1, 1.5, 2, 2.4, 3, 4, 5]);
        const c = schottky(x);
        return { q: `A two-level unit with gap $\\varepsilon$ is at a temperature where $\\varepsilon/kT = ${x}$. Its heat capacity in units of $k$ is ______.`,
          answer: round(c, 4), tol: 0.002, x,
          sol: `$C/k = \\frac{x^2e^x}{(1 + e^x)^2} = \\frac{${x * x}\\times${round(Math.exp(x), 4)}}{${round((1 + Math.exp(x)) ** 2, 3)}} \\approx ${round(c, 4)}$.${x === 2.4 ? ' This is the Schottky peak.' : ''}` };
      },
      verify: (p) => schottky(p.x) },
    { id: 'pfun-g03', type: 'nat', level: 2, exams: ['gate', 'net'], sub: 'oscillator',
      make(r) {
        const nu = choose(r, [200, 300, 500, 560, 800, 1000, 1500, 2000]), T = choose(r, [300, 500, 1000, 1500]);
        const theta = 1.438777 * nu, x = theta / T, n = 1 / (Math.exp(x) - 1);
        return { q: `A molecular vibration has wavenumber $${nu}$ cm$^{-1}$. At $${T}$ K the mean number of vibrational quanta $\\langle n\\rangle$ is ______. ($hc/k = 1.4388$ cm K)`,
          answer: round(n, 4), tol: Math.max(0.0005, round(n * 0.01, 4)), nu, T,
          sol: `$\\theta_v = hc\\tilde\\nu/k = 1.4388\\times${nu} = ${round(theta, 1)}$ K, $x = ${round(x, 4)}$. $\\langle n\\rangle = 1/(e^x - 1) \\approx ${round(n, 4)}$.` };
      },
      verify: (p) => 1 / (Math.exp(1.438777 * p.nu / p.T) - 1) },
    { id: 'pfun-g04', type: 'nat', level: 3, exams: ['gate', 'net'], sub: 'paramagnet',
      make(r) {
        const B = choose(r, [1, 2, 5, 8, 10]), T = choose(r, [0.5, 1, 2, 4, 10, 20]);
        const x = muB * B / (C.kB * T), m = Math.tanh(x);
        return { q: `Ideal spin-1/2 moments of size one Bohr magneton sit in a field of $${B}$ T at $${T}$ K. The magnetisation as a fraction of its saturation value is ______. ($\\mu_B = 9.274\\times10^{-24}$ J/T)`,
          answer: round(m, 4), tol: Math.max(0.002, round(m * 0.01, 4)), B, T,
          sol: `$x = \\mu_BB/kT = \\frac{9.274\\times10^{-24}\\times${B}}{1.381\\times10^{-23}\\times${T}} = ${round(x, 4)}$. $M/M_s = \\tanh x \\approx ${round(m, 4)}$.${x < 0.2 ? ' Small $x$: Curie’s law $M/M_s \\approx x$ is already accurate.' : ''}` };
      },
      verify: (p) => Math.tanh(muB * p.B / (C.kB * p.T)) },
    { id: 'pfun-g05', type: 'nat', level: 2, exams: ['gate', 'net'], sub: 'rotor',
      make(r) {
        const [name, th, s] = choose(r, [['N$_2$', 2.88, 2], ['O$_2$', 2.08, 2], ['CO', 2.77, 1], ['HCl', 15.2, 1], ['Cl$_2$', 0.351, 2], ['NO', 2.45, 1], ['HBr', 12.2, 1]]);
        const T = choose(r, [200, 300, 500, 1000]), Z = T / (s * th);
        return { q: `${name} has rotational temperature $\\theta_r = ${th}$ K. Using the high-temperature formula, its rotational partition function at $${T}$ K is ______.`,
          answer: round(Z, 1), tol: Math.max(0.1, round(Z * 0.01, 1)), T, th, s,
          sol: `$Z_{\\rm rot} = T/(\\sigma\\theta_r)$ with $\\sigma = ${s}$ (${s === 2 ? 'homonuclear: a half turn gives the same molecule' : 'heteronuclear'}): $${T}/(${s}\\times${th}) \\approx ${round(Z, 1)}$.`,
          trap: s === 2 ? 'Do not forget the symmetry number 2 for a homonuclear molecule.' : 'A heteronuclear molecule has symmetry number 1.' };
      },
      verify: (p) => p.T / (p.s * p.th) },
    { id: 'pfun-g06', type: 'nat', level: 3, exams: ['gate', 'net'], sub: 'rotor',
      make(r) {
        const [name, th] = choose(r, [['HCl', 15.2], ['CO', 2.77], ['HBr', 12.2], ['HF', 30.2], ['NO', 2.45]]), T = choose(r, [100, 200, 300, 500, 1000]);
        let best = 0, bw = 0; for (let J = 0; J < 200; J++) { const w = (2 * J + 1) * Math.exp(-J * (J + 1) * th / T); if (w > bw) { bw = w; best = J; } }
        return { q: `For ${name} ($\\theta_r = ${th}$ K) at $${T}$ K, which rotational level $J$ is the most populated?`,
          answer: best, tol: 0, T, th,
          sol: `The population goes as $(2J + 1)e^{-J(J+1)\\theta_r/T}$. Setting the derivative to zero: $J_{\\max} \\approx \\sqrt{T/2\\theta_r} - \\tfrac12 = ${round(Math.sqrt(T / (2 * th)) - 0.5, 2)}$. Comparing neighbouring integers, the largest weight is at $J = ${best}$.` };
      },
      verify: (p) => { let b = 0, bw = 0; for (let J = 0; J < 200; J++) { const w = (2 * J + 1) * Math.exp(-J * (J + 1) * p.th / p.T); if (w > bw) { bw = w; b = J; } } return b; } },
    { id: 'pfun-g07', type: 'nat', level: 3, exams: ['gate', 'net'], sub: 'demagnetisation',
      make(r) {
        const T1 = choose(r, [0.5, 1, 1.5, 2, 4]), B1 = choose(r, [1, 2, 3, 5, 8]), B2 = choose(r, [0.01, 0.02, 0.05, 0.1]);
        const T2 = T1 * B2 / B1;
        return { q: `An ideal paramagnetic salt is magnetised at $${T1}$ K in $${B1}$ T, isolated, and the field is lowered slowly to $${B2}$ T. Ignoring lattice heat capacity and internal fields, the final temperature is ______ mK.`,
          answer: round(T2 * 1000, 2), tol: Math.max(0.01, round(T2 * 10, 2)), unit: 'mK', T1, B1, B2,
          sol: `$S$ depends only on $B/T$ for an ideal paramagnet, and an isolated slow change keeps $S$ fixed: $T_2 = T_1B_2/B_1 = ${T1}\\times${B2}/${B1} = ${round(T2, 6)}$ K $= ${round(T2 * 1000, 2)}$ mK.` };
      },
      verify: (p) => p.T1 * p.B2 / p.B1 * 1000 },
    { id: 'pfun-g08', type: 'mcq', level: 3, exams: ['gate', 'net'], sub: 'thermodynamics',
      make(r) {
        const forms = [
          ['$Z = A\\,V^N T^{3N/2}$', '$\\tfrac32 NkT$'],
          ['$Z = A\\,V^N T^{5N/2}$', '$\\tfrac52 NkT$'],
          ['$Z = A\\,V^N T^{3N}$', '$3NkT$'],
          ['$Z = (1 - e^{-\\varepsilon/kT})^{-N}$', '$\\dfrac{N\\varepsilon}{e^{\\varepsilon/kT} - 1}$'],
          ['$Z = (1 + e^{-\\varepsilon/kT})^{N}$', '$\\dfrac{N\\varepsilon}{e^{\\varepsilon/kT} + 1}$'],
          ['$Z = (2\\cosh(\\varepsilon/kT))^N$', '$-N\\varepsilon\\tanh(\\varepsilon/kT)$'],
          ['$Z = [2\\sinh(\\varepsilon/2kT)]^{-N}$', '$\\dfrac{N\\varepsilon}{2}\\coth(\\varepsilon/2kT)$'],
        ];
        const i = int(r, 0, forms.length - 1), [z, u] = forms[i];
        const ws = forms.filter((_, j) => j !== i).map((f) => f[1]), k = int(r, 0, ws.length - 1);
        const o = mcqOptions(r, u, ws.slice(k).concat(ws.slice(0, k)));
        return { q: `A system of $N$ units has partition function ${z} ($A$ and $\\varepsilon$ are constants). Its internal energy is`, options: o.options, answer: o.answer,
          sol: `Use $U = kT^2\\,\\partial\\ln Z/\\partial T = -\\partial\\ln Z/\\partial\\beta$. For ${z} this gives $U = $ ${u}.`,
          trap: 'Differentiate $\\ln Z$, not $Z$, and remember $\\partial/\\partial\\beta = -kT^2\\,\\partial/\\partial T$.' };
      } },
    { id: 'pfun-g09', type: 'nat', level: 3, exams: ['gate', 'net'], sub: 'oscillator',
      make(r) {
        const thE = choose(r, [150, 200, 240, 300, 400, 1300]), T = choose(r, [50, 100, 150, 200, 300, 500]);
        const c = einstein(thE / T);
        return { q: `An Einstein solid has $\\theta_E = ${thE}$ K. At $${T}$ K, its heat capacity as a fraction of $3Nk$ is ______.`,
          answer: round(c, 4), tol: Math.max(0.001, round(c * 0.01, 4)), thE, T,
          sol: `$x = \\theta_E/T = ${round(thE / T, 4)}$; $C/3Nk = x^2e^x/(e^x - 1)^2 \\approx ${round(c, 4)}$.` };
      },
      verify: (p) => einstein(p.thE / p.T) },
    { id: 'pfun-g10', type: 'nat', level: 4, exams: ['gate', 'net'], sub: 'paramagnet',
      make(r) {
        const x = choose(r, [0.2, 0.5, 1, 1.5, 2, 3]), J = choose(r, [0.5, 1, 1.5]);
        const ms = []; for (let m = -J; m <= J + 1e-9; m++) ms.push(m);
        const Z = ms.reduce((s, m) => s + Math.exp(m * x), 0), mm = ms.reduce((s, m) => s + m * Math.exp(m * x), 0) / Z;
        return { q: `An ion with angular momentum $J = ${J}$ has levels $E = -m\\,\\varepsilon$, $m = -J, \\ldots, +J$, in a field. With $\\varepsilon/kT = ${x}$, the mean value $\\langle m\\rangle$ is ______.`,
          answer: round(mm, 4), tol: 0.003, x, J,
          sol: `$Z = \\sum_m e^{mx} = ${ms.map((m) => `e^{${round(m * x, 2)}}`).join(' + ')} = ${round(Z, 4)}$. $\\langle m\\rangle = \\frac1Z\\sum_m m\\,e^{mx} \\approx ${round(mm, 4)}$ (saturation value ${J}).` };
      },
      verify: (p) => { let z = 0, s = 0; for (let m = -p.J; m <= p.J + 1e-9; m++) { z += Math.exp(m * p.x); s += m * Math.exp(m * p.x); } return s / z; } },
    { id: 'pfun-g11', type: 'nat', level: 2, exams: ['gate', 'net'], sub: 'degeneracy',
      make(r) {
        const g0 = int(r, 1, 3), g1 = int(r, 1, 6), t = choose(r, [0.5, 1, 2, 3]);
        const P = g1 * Math.exp(-1 / t) / (g0 + g1 * Math.exp(-1 / t));
        return { q: `A ground level of degeneracy ${g0} lies an energy $\\varepsilon$ below an excited level of degeneracy ${g1}. At $kT = ${t}\\varepsilon$, the probability of being in the excited level is ______.`,
          answer: round(P, 4), tol: 0.003, g0, g1, t,
          sol: `$Z = ${g0} + ${g1}e^{-${round(1 / t, 4)}} = ${round(g0 + g1 * Math.exp(-1 / t), 4)}$; $P = ${g1}e^{-${round(1 / t, 4)}}/Z \\approx ${round(P, 4)}$. At very high $T$ it tends to $${g1}/${g0 + g1}$.` };
      },
      verify: (p) => p.g1 * Math.exp(-1 / p.t) / (p.g0 + p.g1 * Math.exp(-1 / p.t)) },
    { id: 'pfun-g12', type: 'nat', level: 3, exams: ['gate', 'net'], sub: 'vibration',
      make(r) {
        const [name, th] = choose(r, [['Cl$_2$', 805], ['Br$_2$', 463], ['I$_2$', 308], ['O$_2$', 2256], ['N$_2$', 3374]]), T = choose(r, [300, 500, 1000, 2000].filter((t) => th / t <= 6));
        const f = Math.exp(-th / T) * 100;
        return { q: `${name} has $\\theta_v = ${th}$ K. At $${T}$ K, what percentage of molecules are in an excited vibrational level ($v \\ge 1$)?`,
          answer: round(f, 3), tol: Math.max(0.001, round(f * 0.01, 3)), unit: '%', th, T,
          sol: `$P(v \\ge 1) = 1 - P_0 = 1 - (1 - e^{-x}) = e^{-x}$ with $x = ${th}/${T} = ${round(th / T, 4)}$: $e^{-${round(th / T, 4)}} = ${round(f / 100, 5)}$, i.e. $${round(f, 3)}\\%$.` };
      },
      verify: (p) => Math.exp(-p.th / p.T) * 100 },
  ],
};
