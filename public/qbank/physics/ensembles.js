// Statistical ensembles: microstates and macrostates, Boltzmann and Gibbs entropy, microcanonical temperature,
// canonical and grand canonical ensembles, fluctuations, Liouville's theorem, phase-space counting, negative temperature.
// Original questions for GATE and CSIR NET practice (fibub), MSc level. Levels: 1 warm-up ... 5 top rank.
import { pick, int, choose, mcqOptions, round, C } from '../_util.js';

const kB = 8.617333e-5; // eV/K
const binom = (n, k) => { if (k < 0 || k > n) return 0; let r = 1; for (let i = 1; i <= k; i++) r = (r * (n - k + i)) / i; return Math.round(r); };

export default {
  topic: 'ensembles',
  items: [
    // ---- level 1 ----
    { id: 'ensm-001', type: 'mcq', level: 1, exams: ['gate', 'net'], sub: 'ensembles',
      q: 'In the microcanonical ensemble, which set of quantities is held fixed for every member system?',
      options: ['$T$, $V$ and $N$', '$E$, $V$ and $N$', '$\\mu$, $V$ and $T$', '$T$, $P$ and $N$'], answer: 1,
      sol: 'The microcanonical ensemble describes an isolated system: no energy or particles cross the walls, so $E$, $V$ and $N$ are fixed. ($T, V, N$ is canonical; $\\mu, V, T$ is grand canonical; $T, P, N$ is the isothermal-isobaric ensemble.)' },
    { id: 'ensm-002', type: 'mcq', level: 1, exams: ['gate', 'net'], sub: 'ensembles',
      q: 'A small system exchanges energy, but not particles, with a very large heat bath at temperature $T$. The probability of finding it in a microstate of energy $E_i$ is proportional to',
      options: ['$E_i\\,e^{-E_i/kT}$', '$1/E_i$', '$e^{-E_i/kT}$', 'a constant, the same for every microstate'], answer: 2,
      sol: 'This is the canonical ensemble. The bath has $\\Omega_R(E_{\\rm tot} - E_i)$ states; expanding $\\ln\\Omega_R$ to first order gives $P_i \\propto e^{-E_i/kT}$, the Boltzmann factor.',
      trap: 'A constant probability is the microcanonical rule for an isolated system, not for a system in a bath.' },
    { id: 'ensm-003', type: 'mcq', level: 1, exams: ['gate', 'net'], sub: 'entropy',
      q: 'Boltzmann’s formula connects the entropy of an isolated system to the number $\\Omega$ of accessible microstates as',
      options: ['$S = k\\,\\Omega$', '$S = k\\,e^{\\Omega}$', '$S = \\Omega/k$', '$S = k\\ln\\Omega$'], answer: 3,
      sol: '$S = k\\ln\\Omega$. The logarithm makes entropy additive: two independent systems have $\\Omega = \\Omega_1\\Omega_2$, so $S = S_1 + S_2$.' },
    { id: 'ensm-004', type: 'mcq', level: 1, exams: ['gate', 'net'], sub: 'ensembles',
      q: 'In the grand canonical ensemble the system exchanges with its reservoir',
      options: ['both energy and particles', 'energy only', 'particles only', 'neither energy nor particles'], answer: 0,
      sol: 'Grand canonical: the walls pass both energy and particles, so the reservoir fixes $T$ and the chemical potential $\\mu$. Both $E$ and $N$ fluctuate.' },
    { id: 'ensm-005', type: 'mcq', level: 1, exams: ['gate', 'net'], sub: 'postulates',
      q: 'The postulate of equal a priori probabilities states that, for an isolated system in equilibrium,',
      options: ['every energy level is equally likely', 'every accessible microstate is equally likely', 'every macrostate is equally likely', 'the lowest-energy state is the most likely'], answer: 1,
      sol: 'All microstates consistent with the fixed $E, V, N$ are equally probable. Macrostates are then not equally likely: a macrostate with more microstates is more probable, which is why entropy tends to increase.',
      trap: 'Microstates are equally likely; macrostates are not.' },
    { id: 'ensm-006', type: 'msq', level: 1, exams: ['gate', 'net'], sub: 'ensembles', format: 'multi',
      q: 'For a system described by the canonical ensemble, which statements are correct?',
      options: ['The temperature is fixed by the bath', 'The energy of the system fluctuates', 'The number of particles fluctuates', 'Microstates of lower energy are more probable'], answer: [0, 1, 3],
      sol: 'The bath fixes $T$; energy flows in and out, so $E$ fluctuates; $P_i \\propto e^{-E_i/kT}$ falls with energy, so lower-energy microstates are more likely. The walls do not pass particles, so $N$ is fixed.' },

    // ---- level 2 ----
    { id: 'ensm-007', type: 'nat', level: 2, exams: ['gate', 'net'], sub: 'counting',
      q: 'Six distinguishable spin-1/2 particles sit in a magnetic field. The number of microstates with exactly two spins pointing up is ______.',
      answer: 15, tol: 0, calc: () => binom(6, 2),
      sol: 'Choose which 2 of the 6 particles point up: $\\binom{6}{2} = \\frac{6\\cdot5}{2} = 15$.' },
    { id: 'ensm-008', type: 'mcq', level: 2, exams: ['gate', 'net'], sub: 'counting',
      q: 'For $N = 100$ independent two-state particles with zero field (both states have the same energy), the macrostate "$n$ particles in the upper state" with the largest entropy has',
      options: ['$n = 0$', '$n = 25$', '$n = 100$', '$n = 50$'], answer: 3,
      sol: '$\\Omega(n) = \\binom{100}{n}$ is largest at the middle, $n = 50$. This macrostate alone holds about 8% of all $2^{100}$ microstates, and the states near it hold nearly all of them.' },
    { id: 'ensm-009', type: 'mcq', level: 2, exams: ['gate', 'net'], sub: 'temperature',
      q: 'Two isolated systems with $\\Omega_1(E_1)$ and $\\Omega_2(E_2)$ are brought into thermal contact, with $E_1 + E_2$ fixed. The most probable division of energy satisfies',
      options: ['$\\Omega_1 = \\Omega_2$', '$E_1 = E_2$', '$\\dfrac{\\partial\\ln\\Omega_1}{\\partial E_1} = \\dfrac{\\partial\\ln\\Omega_2}{\\partial E_2}$', '$\\dfrac{\\partial\\Omega_1}{\\partial E_1} = \\dfrac{\\partial\\Omega_2}{\\partial E_2}$'], answer: 2,
      sol: 'Maximise $\\ln[\\Omega_1(E_1)\\Omega_2(E - E_1)]$ over $E_1$: $\\partial\\ln\\Omega_1/\\partial E_1 - \\partial\\ln\\Omega_2/\\partial E_2 = 0$. With $S = k\\ln\\Omega$ and $1/T = \\partial S/\\partial E$, this is $T_1 = T_2$.',
      trap: 'Equal energies or equal numbers of states are not the condition; equal slopes of $\\ln\\Omega$ are.' },
    { id: 'ensm-010', type: 'mcq', level: 2, exams: ['gate', 'net'], sub: 'temperature',
      q: 'In statistical mechanics the temperature of an isolated system is defined by',
      options: ['$\\dfrac1T = \\left(\\dfrac{\\partial S}{\\partial E}\\right)_{V,N}$', '$T = \\left(\\dfrac{\\partial S}{\\partial E}\\right)_{V,N}$', '$\\dfrac1T = \\left(\\dfrac{\\partial E}{\\partial S}\\right)_{V,N}$', '$T = \\dfrac{S}{E}$'], answer: 0,
      sol: '$1/T = (\\partial S/\\partial E)_{V,N}$, equivalently $T = (\\partial E/\\partial S)_{V,N}$, which matches $dE = T\\,dS - P\\,dV + \\mu\\,dN$.' },
    { id: 'ensm-011', type: 'nat', level: 2, exams: ['gate', 'net'], sub: 'entropy',
      q: 'A system is found in three microstates with probabilities $1/2$, $1/4$ and $1/4$. Its Gibbs entropy $S = -k\\sum_i p_i\\ln p_i$, in units of $k$, is ______.',
      answer: 1.04, tol: 0.01, calc: () => -(0.5 * Math.log(0.5) + 2 * 0.25 * Math.log(0.25)),
      sol: '$S/k = -[\\tfrac12\\ln\\tfrac12 + 2\\cdot\\tfrac14\\ln\\tfrac14] = \\tfrac12\\ln2 + \\tfrac12\\ln4 = \\tfrac32\\ln2 \\approx 1.04$. A uniform distribution over 3 states would give the maximum, $\\ln3 \\approx 1.10$.' },
    { id: 'ensm-012', type: 'nat', level: 2, exams: ['gate', 'net'], sub: 'Boltzmann factor',
      q: 'Two non-degenerate states of a molecule differ in energy by $0.050$ eV. At $300$ K, the ratio of the population of the upper state to that of the lower state is ______. ($k = 8.617\\times10^{-5}$ eV/K)',
      answer: 0.145, tol: 0.003, calc: () => Math.exp(-0.05 / (kB * 300)),
      sol: '$kT = 8.617\\times10^{-5}\\times300 = 0.02585$ eV. Ratio $= e^{-0.050/0.02585} = e^{-1.934} \\approx 0.145$.' },
    { id: 'ensm-013', type: 'mcq', level: 2, exams: ['gate', 'net'], sub: 'Liouville',
      q: 'Liouville’s theorem for a Hamiltonian system states that',
      options: ['the energy of every phase point is the same', 'the density of phase points is constant along the flow, so phase-space volume is conserved', 'every trajectory visits every point of the energy surface', 'phase points crowd towards the lowest-energy region'], answer: 1,
      sol: '$d\\rho/dt = \\partial\\rho/\\partial t + \\{\\rho, H\\} = 0$: the phase-space flow is incompressible. A blob of phase points changes shape but keeps its volume.',
      trap: 'Visiting every point of the energy surface is the ergodic hypothesis, a different (and much harder) statement.' },
    { id: 'ensm-014', type: 'mcq', level: 2, exams: ['gate', 'net'], sub: 'postulates',
      q: 'The ergodic hypothesis is the assumption that',
      options: ['entropy always increases', 'the system is in contact with a heat bath', 'the long-time average of a quantity equals its ensemble average', 'all energy levels are equally spaced'], answer: 2,
      sol: 'A real measurement averages over time; theory averages over an ensemble. Ergodicity says a single system, followed long enough, spends equal times in equal phase-space areas of its energy surface, so the two averages agree.' },
    { id: 'ensm-015', type: 'mcq', level: 2, exams: ['gate', 'net'], sub: 'phase space',
      q: 'A one-dimensional harmonic oscillator $H = p^2/2m + m\\omega^2x^2/2$ has energy at most $E$. Dividing the phase-space area of this region by $h$ gives the number of quantum states below $E$ as about',
      options: ['$E/\\hbar\\omega$', '$2\\pi E/\\omega$', '$E/h\\omega$', '$\\hbar\\omega/E$'], answer: 0,
      sol: 'The region $H \\le E$ is an ellipse with semi-axes $\\sqrt{2mE}$ (in $p$) and $\\sqrt{2E/m\\omega^2}$ (in $x$), area $\\pi\\sqrt{2mE}\\sqrt{2E/m\\omega^2} = 2\\pi E/\\omega$. Divide by $h = 2\\pi\\hbar$: $E/\\hbar\\omega$, matching the levels $(n + \\tfrac12)\\hbar\\omega$.',
      trap: '$2\\pi E/\\omega$ is the area itself, which has units of action, not a number.' },
    { id: 'ensm-016', type: 'mcq', level: 2, exams: ['gate', 'net'], sub: 'grand canonical',
      q: 'In the grand canonical ensemble the probability of a microstate with $N$ particles and energy $E$ is proportional to',
      options: ['$e^{-\\beta(E + \\mu N)}$', '$e^{-\\beta E}\\,\\mu^N$', '$e^{-\\beta E}/N!$', '$e^{-\\beta(E - \\mu N)}$'], answer: 3,
      sol: 'The reservoir loses energy $E$ and $N$ particles; $\\ln\\Omega_R$ falls by $\\beta E - \\beta\\mu N$ (since $\\partial S_R/\\partial N_R = -\\mu/T$). So $P \\propto e^{-\\beta(E - \\mu N)} = z^N e^{-\\beta E}$ with fugacity $z = e^{\\beta\\mu}$.',
      trap: 'Sign: a higher $\\mu$ favours more particles, so $\\mu N$ enters with a minus sign inside the bracket.' },
    { id: 'ensm-017', type: 'nat', level: 2, exams: ['gate', 'net'], sub: 'counting',
      q: 'An Einstein solid has 3 oscillators sharing 3 identical energy quanta. The number of microstates is ______.',
      answer: 10, tol: 0, calc: () => binom(5, 3),
      sol: 'Distribute $q$ indistinguishable quanta among $N$ distinguishable oscillators: $\\Omega = \\binom{q + N - 1}{q} = \\binom{5}{3} = 10$ (stars and bars). Check by listing: (3,0,0)×3, (2,1,0)×6, (1,1,1)×1.' },
    { id: 'ensm-018', type: 'nat', level: 2, exams: ['gate', 'net'], sub: 'entropy', unit: 'J/K',
      q: 'One mole of spin-1/2 particles in zero field has $2^{N_A}$ equally likely microstates. Its entropy is ______ J/K.',
      answer: 5.76, tol: 0.02, calc: () => C.R * Math.log(2),
      sol: '$S = k\\ln 2^{N_A} = N_Ak\\ln2 = R\\ln2 = 8.314\\times0.693 \\approx 5.76$ J/K.' },

    // ---- level 3 ----
    { id: 'ensm-019', type: 'mcq', level: 3, exams: ['gate', 'net'], sub: 'fluctuations',
      q: 'In the canonical ensemble the mean square fluctuation of the energy is',
      options: ['$kT\\,C_V$', '$k^2T\\,C_V$', '$kT^2C_V$', '$kT^2/C_V$'], answer: 2,
      sol: '$\\langle E\\rangle = -\\partial\\ln Z/\\partial\\beta$ and $\\langle(\\Delta E)^2\\rangle = \\partial^2\\ln Z/\\partial\\beta^2 = -\\partial\\langle E\\rangle/\\partial\\beta = kT^2\\,\\partial\\langle E\\rangle/\\partial T = kT^2C_V$.',
      trap: 'Check units: $kT^2C_V$ has units of J$^2$ because $k$ and $C_V$ are both J/K.' },
    { id: 'ensm-020', type: 'nat', level: 3, exams: ['gate', 'net'], sub: 'fluctuations',
      q: 'A classical monatomic ideal gas of $N = 600$ atoms is in contact with a heat bath. The relative energy fluctuation $\\Delta E_{\\rm rms}/\\langle E\\rangle$ is ______.',
      answer: 0.0333, tol: 0.0005, calc: () => Math.sqrt(2 / (3 * 600)),
      sol: '$\\langle(\\Delta E)^2\\rangle = kT^2\\cdot\\tfrac32Nk$ and $\\langle E\\rangle = \\tfrac32NkT$. Ratio $= \\sqrt{\\tfrac32N}\\,k T/(\\tfrac32NkT) = \\sqrt{2/3N} = \\sqrt{1/900} = 1/30 \\approx 0.0333$. For a mole it is about $10^{-12}$, which is why ensembles agree for large systems.' },
    { id: 'ensm-021', type: 'mcq', level: 3, exams: ['gate', 'net'], sub: 'fluctuations',
      q: 'For a classical ideal gas in the grand canonical ensemble, the mean square fluctuation of the particle number $\\langle(\\Delta N)^2\\rangle$ equals',
      options: ['$\\langle N\\rangle^2$', '$\\sqrt{\\langle N\\rangle}$', '$\\langle N\\rangle$', '$1$'], answer: 2,
      sol: '$\\langle(\\Delta N)^2\\rangle = kT(\\partial\\langle N\\rangle/\\partial\\mu)_{T,V}$. For the ideal gas $\\langle N\\rangle = (V/\\lambda^3)e^{\\beta\\mu}$, so $\\partial\\langle N\\rangle/\\partial\\mu = \\beta\\langle N\\rangle$ and the variance is $\\langle N\\rangle$: Poisson statistics. Relative size $1/\\sqrt{\\langle N\\rangle}$.',
      trap: '$\\sqrt{\\langle N\\rangle}$ is the rms fluctuation, not its square.' },
    { id: 'ensm-022', type: 'nat', level: 3, exams: ['gate', 'net'], sub: 'microcanonical', unit: 'K',
      q: '$N$ independent two-level systems (energies $0$ and $\\varepsilon = 0.010$ eV) are isolated with a quarter of them excited. Using $S = k\\ln\\binom{N}{n}$ with Stirling’s formula, the temperature is ______ K. ($k = 8.617\\times10^{-5}$ eV/K)',
      answer: 105.6, tol: 1, calc: () => 0.01 / (kB * Math.log(3)),
      sol: 'With $E = n\\varepsilon$, $S/k \\approx N\\ln N - n\\ln n - (N-n)\\ln(N-n)$, so $\\frac{1}{kT} = \\frac{1}{\\varepsilon}\\frac{\\partial(S/k)}{\\partial n} = \\frac1\\varepsilon\\ln\\frac{N-n}{n}$. With $n = N/4$, $\\ln3$: $T = \\frac{0.010}{8.617\\times10^{-5}\\times1.0986} \\approx 105.6$ K.' },
    { id: 'ensm-023', type: 'msq', level: 3, exams: ['gate', 'net'], sub: 'negative temperature', format: 'statements',
      q: 'For an isolated collection of $N$ two-level systems (energies $0$ and $\\varepsilon$) with $n$ excited, which statements are correct?',
      options: ['The temperature is negative when $n > N/2$', 'A negative-temperature state gives heat to any positive-temperature system it touches', 'An ideal gas of free particles can also reach negative temperature', 'At $n = N/2$, $1/T = 0$'], answer: [0, 1, 3],
      sol: '$1/kT = \\varepsilon^{-1}\\ln[(N-n)/n]$ is negative for $n > N/2$ and zero at $n = N/2$. Negative $T$ is "hotter than infinite": a $\\beta < 0$ system gains entropy by giving energy away, so heat flows out of it into anything at positive $T$. A free gas has no upper bound on energy, so $S(E)$ never turns over and $T$ cannot be negative.',
      trap: 'Negative temperature needs a bounded energy spectrum (spins, two-level atoms), never a free gas.' },
    { id: 'ensm-024', type: 'mcq', level: 3, exams: ['gate', 'net'], sub: 'microcanonical',
      q: 'A hypothetical gas has $\\Omega(E, V) \\propto V^N E^{2N}$. Its heat capacity at constant volume per particle is',
      options: ['$\\tfrac32 k$', '$k$', '$4k$', '$2k$'], answer: 3,
      sol: '$S = Nk\\ln V + 2Nk\\ln E + \\text{const}$, so $1/T = \\partial S/\\partial E = 2Nk/E$, giving $E = 2NkT$ and $C_V = 2Nk$: $2k$ per particle. (An ordinary monatomic gas has $E^{3N/2}$ and $\\tfrac32k$.) The same $S$ gives $P/T = Nk/V$, the ideal gas law.' },
    { id: 'ensm-025', type: 'nat', level: 3, exams: ['gate', 'net'], sub: 'phase space',
      q: 'In a ball of radius $R$ in $d = 100$ dimensions, the fraction of the volume lying in the outer shell $0.99R < r < R$ is ______.',
      answer: 0.634, tol: 0.005, calc: () => 1 - 0.99 ** 100,
      sol: 'Volume scales as $R^d$, so the inner ball holds $0.99^{100} = e^{100\\ln0.99} \\approx 0.366$ of the volume. The shell holds $1 - 0.366 = 0.634$. For $d = 3N \\sim 10^{24}$ essentially all the volume is at the surface, so counting states "with energy below $E$" or "within a thin shell at $E$" gives the same entropy.' },
    { id: 'ensm-026', type: 'mcq', level: 3, exams: ['gate', 'net'], sub: 'ensembles',
      q: 'Why do the microcanonical, canonical and grand canonical ensembles give the same thermodynamics for a macroscopic system?',
      options: ['Because the Hamiltonian is the same', 'Because the relative fluctuations of $E$ and $N$ scale as $1/\\sqrt N$ and vanish in the thermodynamic limit', 'Because the temperature is always fixed', 'Because each ensemble has the same partition function'], answer: 1,
      sol: 'In the canonical ensemble $E$ is not fixed, but its distribution is so sharply peaked ($\\Delta E/E \\sim N^{-1/2}$) that it is effectively fixed. Exceptions occur where fluctuations become large, such as at a critical point.' },
    { id: 'ensm-027', type: 'mcq', level: 3, exams: ['gate', 'net'], sub: 'maximum entropy',
      q: 'Maximising $S = -k\\sum p_i\\ln p_i$ subject to $\\sum p_i = 1$ and a fixed mean energy $\\sum p_iE_i = U$ gives',
      options: ['$p_i = $ constant', '$p_i \\propto E_i$', '$p_i \\propto e^{-\\beta E_i}$, with $\\beta$ the Lagrange multiplier for the energy constraint', '$p_i \\propto 1/E_i$'], answer: 2,
      sol: 'Lagrange: $-k(\\ln p_i + 1) - \\alpha - \\lambda E_i = 0$ gives $p_i \\propto e^{-\\lambda E_i/k}$; call $\\beta = \\lambda/k$. Comparing with thermodynamics, $\\beta = 1/kT$. With only the normalisation constraint the answer would be uniform (microcanonical).' },
    { id: 'ensm-028', type: 'mcq', level: 3, exams: ['gate', 'net'], sub: 'grand canonical',
      q: 'The grand potential $\\Phi_G = -kT\\ln\\mathcal Z$ of a simple fluid equals',
      options: ['$-PV$', '$PV$', '$U - TS$', '$\\mu N$'], answer: 0,
      sol: '$\\Phi_G = U - TS - \\mu N$. Euler’s relation $U = TS - PV + \\mu N$ for an extensive system gives $\\Phi_G = -PV$. So $PV/kT = \\ln\\mathcal Z$.',
      trap: '$U - TS$ is the Helmholtz energy, $\\mu N$ is the Gibbs energy.' },
    { id: 'ensm-029', type: 'nat', level: 3, exams: ['gate', 'net'], sub: 'canonical',
      q: 'A system has three non-degenerate levels at $0$, $\\varepsilon$ and $2\\varepsilon$ and is in contact with a bath at $kT = \\varepsilon$. The probability of finding it in the ground state is ______.',
      answer: 0.665, tol: 0.004, calc: () => 1 / (1 + Math.exp(-1) + Math.exp(-2)),
      sol: '$Z = 1 + e^{-1} + e^{-2} = 1 + 0.3679 + 0.1353 = 1.5032$. $P_0 = 1/Z \\approx 0.665$.' },

    // ---- level 4 ----
    { id: 'ensm-030', type: 'nat', level: 4, exams: ['gate', 'net'], sub: 'counting',
      q: 'Two Einstein solids A and B, each of 3 oscillators, share 6 quanta in total. In equilibrium, the probability that A holds exactly 3 quanta is ______.',
      answer: 0.216, tol: 0.003, calc: () => binom(5, 3) ** 2 / binom(11, 6),
      sol: '$\\Omega_A(3) = \\Omega_B(3) = \\binom{5}{3} = 10$. All $\\binom{6 + 6 - 1}{6} = \\binom{11}{6} = 462$ microstates of the combined 6-oscillator solid are equally likely. $P = 10\\times10/462 \\approx 0.216$. It is the most likely split, but for tiny systems it is far from certain.' },
    { id: 'ensm-031', type: 'nat', level: 4, exams: ['gate', 'net'], sub: 'fluctuations',
      q: '$N = 100$ independent two-level systems (energies $0$ and $\\varepsilon$) are in a bath with $kT = \\varepsilon/\\ln3$. The variance of the total energy, $\\langle(\\Delta E)^2\\rangle/\\varepsilon^2$, is ______.',
      answer: 18.75, tol: 0.05, calc: () => 100 * 0.25 * 0.75,
      sol: 'Each unit is excited with probability $p = e^{-\\beta\\varepsilon}/(1 + e^{-\\beta\\varepsilon}) = (1/3)/(4/3) = 1/4$. A single unit has energy variance $\\varepsilon^2p(1-p)$, and independent units add: $100\\times\\tfrac14\\times\\tfrac34 = 18.75$.' },
    { id: 'ensm-032', type: 'nat', level: 4, exams: ['gate', 'net'], sub: 'grand canonical',
      q: 'An adsorption site is empty (energy 0) or holds one atom (energy $-0.10$ eV). The gas above fixes $\\mu = -0.15$ eV and $kT = 0.025$ eV. The mean occupation of the site is ______.',
      answer: 0.119, tol: 0.002, calc: () => 1 / (Math.exp((-0.15 + 0.10) / -0.025) + 1),
      sol: '$\\mathcal Z = 1 + e^{-\\beta(-0.10 - \\mu)} = 1 + e^{\\beta(0.10 + \\mu)} = 1 + e^{-0.05/0.025} = 1 + e^{-2}$. $\\langle n\\rangle = e^{-2}/(1 + e^{-2}) = 1/(e^2 + 1) \\approx 0.119$. As the gas pressure (and $\\mu$) rises, $\\langle n\\rangle \\to 1$: the Langmuir isotherm.',
      trap: 'The bound energy is negative; $E - \\mu N = -0.10 + 0.15 = +0.05$ eV, so occupation is suppressed here.' },
    { id: 'ensm-033', type: 'msq', level: 4, exams: ['gate', 'net'], sub: 'Liouville', format: 'statements',
      q: 'Which statements about Liouville’s theorem are correct?',
      options: ['It implies that the fine-grained Gibbs entropy $-k\\int\\rho\\ln\\rho\\,d\\Gamma$ is constant under Hamiltonian evolution', 'The volume of any region of phase space is preserved as its points move', 'It also holds for a damped harmonic oscillator', 'It can be written $\\partial\\rho/\\partial t = -\\{\\rho, H\\}$'], answer: [0, 1, 3],
      sol: 'The flow is incompressible ($\\nabla\\cdot\\dot{\\mathbf z} = \\sum(\\partial^2H/\\partial q\\partial p - \\partial^2H/\\partial p\\partial q) = 0$), so volumes and the fine-grained entropy are conserved, and $d\\rho/dt = \\partial\\rho/\\partial t + \\{\\rho, H\\} = 0$. Damping is not Hamiltonian: phase volume shrinks onto the rest point.',
      trap: 'Entropy growth in thermodynamics comes from coarse-graining, not from a failure of Liouville’s theorem.' },
    { id: 'ensm-034', type: 'mcq', level: 4, exams: ['gate', 'net'], sub: 'microcanonical',
      q: 'For $N$ classical one-dimensional harmonic oscillators, the phase-space volume with $H \\le E$ is $\\Gamma(E) = (2\\pi/\\omega)^N E^N/N!$. The microcanonical temperature gives',
      options: ['$E = \\tfrac12NkT$', '$E = \\tfrac32NkT$', '$E = NkT$', '$E = 2NkT$'], answer: 2,
      sol: '$S = k\\ln\\Gamma = Nk\\ln E + \\ldots$, so $1/T = Nk/E$ and $E = NkT$: $\\tfrac12kT$ for each of the two quadratic terms per oscillator, as equipartition says.' },
    { id: 'ensm-035', type: 'mcq', level: 4, exams: ['gate', 'net'], sub: 'canonical',
      q: 'The entropy in the canonical ensemble can be written in terms of $Z$ and $\\beta = 1/kT$ as',
      options: ['$S = k\\ln Z$', '$S = k(\\ln Z - \\beta\\,\\partial\\ln Z/\\partial\\beta)$', '$S = -k\\beta\\,\\partial\\ln Z/\\partial\\beta$', '$S = k(\\ln Z + \\partial\\ln Z/\\partial\\beta)$'], answer: 1,
      sol: '$S = (U - F)/T$ with $F = -kT\\ln Z$ and $U = -\\partial\\ln Z/\\partial\\beta$: $S = k\\ln Z + U/T = k(\\ln Z - \\beta\\,\\partial\\ln Z/\\partial\\beta)$. The same follows from $S = -k\\sum p_i\\ln p_i$ with $p_i = e^{-\\beta E_i}/Z$.' },
    { id: 'ensm-036', type: 'mcq', level: 4, exams: ['gate', 'net'], sub: 'grand canonical',
      q: 'For a classical ideal gas in the grand canonical ensemble, the probability of finding exactly $N$ particles in the volume is',
      options: ['$\\dfrac{\\bar N^N e^{-\\bar N}}{N!}$, a Poisson distribution', 'a Gaussian of width $\\bar N$', 'uniform from 0 to $2\\bar N$', '$e^{-N/\\bar N}/\\bar N$, an exponential'], answer: 0,
      sol: '$Z_N = Z_1^N/N!$, so $P(N) = z^NZ_1^N/(N!\\,\\mathcal Z)$ with $\\mathcal Z = e^{zZ_1}$. Since $\\bar N = zZ_1$, $P(N) = \\bar N^Ne^{-\\bar N}/N!$. Its variance is $\\bar N$, as found from $kT\\,\\partial\\bar N/\\partial\\mu$.' },
    { id: 'ensm-037', type: 'msq', level: 4, exams: ['gate', 'net'], sub: 'fluctuations', format: 'statements',
      q: 'For a fluid in the grand canonical ensemble with isothermal compressibility $\\kappa_T$, which statements are correct?',
      options: ['$\\langle(\\Delta N)^2\\rangle/\\langle N\\rangle^2 = kT\\kappa_T/V$', 'Density fluctuations become very large near the liquid-gas critical point', 'For a classical ideal gas $\\langle(\\Delta N)^2\\rangle = \\langle N\\rangle$', 'The relative fluctuation $\\Delta N/\\langle N\\rangle$ grows with the size of the system'], answer: [0, 1, 2],
      sol: 'The standard result $\\langle(\\Delta N)^2\\rangle = \\langle N\\rangle^2kT\\kappa_T/V$ connects fluctuations to a response function. At the critical point $\\kappa_T \\to$ very large, giving critical opalescence. For the ideal gas $\\kappa_T = 1/P$, so the variance is $N^2kT/PV = N$. The relative fluctuation falls as $V^{-1/2}$.' },

    // ---- level 5 ----
    { id: 'ensm-038', type: 'nat', level: 5, exams: ['gate', 'net'], sub: 'negative temperature', unit: 'K',
      q: 'An isolated system of many two-level nuclei (splitting $\\varepsilon = 1.0$ meV) is prepared with 60% of them in the upper level. Its spin temperature is ______ K. ($k = 8.617\\times10^{-5}$ eV/K)',
      answer: -28.6, tol: 0.3, calc: () => 1e-3 / (kB * Math.log(0.4 / 0.6)),
      sol: '$\\frac1{kT} = \\frac1\\varepsilon\\ln\\frac{N-n}{n} = \\frac{1}{\\varepsilon}\\ln\\frac{0.4}{0.6} = -\\frac{0.4055}{\\varepsilon}$. $T = -\\frac{1.0\\times10^{-3}}{8.617\\times10^{-5}\\times0.4055} \\approx -28.6$ K. Equivalently, the Boltzmann ratio $n_{\\rm up}/n_{\\rm low} = 1.5 = e^{-\\varepsilon/kT}$ needs $T < 0$.',
      trap: 'Population inversion means negative temperature, not a very large positive one.' },
    { id: 'ensm-039', type: 'mcq', level: 5, exams: ['gate', 'net'], sub: 'negative temperature',
      q: 'A spin system at $T_1 = -200$ K is put in thermal contact with a lattice at $T_2 = +300$ K. Which way does heat flow?',
      options: ['From the lattice to the spins, since 300 > −200', 'No heat flows, since the temperatures have opposite signs', 'It depends on the heat capacities only', 'From the spins to the lattice'], answer: 3,
      sol: 'Compare $\\beta = 1/kT$: heat flows from smaller $\\beta$ to larger $\\beta$, which raises total entropy. $\\beta_1 < 0 < \\beta_2$, so energy leaves the spins. In order of hotness: $+0$ K $<$ … $< +\\infty \\equiv -\\infty <$ … $< -0$ K.',
      trap: 'Ordering by the number $T$ fails across the infinity point; order by $-\\beta$.' },
    { id: 'ensm-040', type: 'nat', level: 5, exams: ['gate', 'net'], sub: 'canonical',
      q: 'A two-level system (levels $0$ and $\\varepsilon$) exchanges energy with a small "reservoir": an Einstein solid of 3 oscillators whose quantum is also $\\varepsilon$. The total energy is $4\\varepsilon$. The exact probability that the two-level system is excited is ______.',
      answer: 0.4, tol: 0.005, calc: () => binom(5, 3) / (binom(5, 3) + binom(6, 4)),
      sol: 'Every microstate of the whole is equally likely. Excited: the solid holds 3 quanta, $\\Omega_R = \\binom{5}{3} = 10$. Ground: it holds 4, $\\binom{6}{4} = 15$. $P = 10/25 = 0.4$. A big reservoir would give the Boltzmann ratio; this tiny one shows where it comes from: $P_1/P_0 = \\Omega_R(E - \\varepsilon)/\\Omega_R(E)$.' },
    { id: 'ensm-041', type: 'mcq', level: 5, exams: ['gate', 'net'], sub: 'fluctuations',
      q: 'For a single orbital in contact with a particle reservoir, the variance of its occupation $n$ is $\\langle n\\rangle(1 - \\langle n\\rangle)$ for fermions. For bosons it is',
      options: ['$\\langle n\\rangle(1 - \\langle n\\rangle)$', '$\\langle n\\rangle(1 + \\langle n\\rangle)$', '$\\langle n\\rangle$', '$\\langle n\\rangle^2$'], answer: 1,
      sol: 'With $\\mathcal Z = \\sum_n x^n = 1/(1 - x)$, $x = e^{-\\beta(\\varepsilon - \\mu)}$: $\\langle n\\rangle = x/(1-x)$ and $\\langle(\\Delta n)^2\\rangle = x\\,d\\langle n\\rangle/dx = x/(1-x)^2 = \\langle n\\rangle(1 + \\langle n\\rangle)$. The extra $\\langle n\\rangle^2$ is photon bunching; for fermions Pauli blocking gives the minus sign; classical particles give just $\\langle n\\rangle$.' },
    { id: 'ensm-042', type: 'nat', level: 3, exams: ['gate', 'net'], sub: 'counting',
      q: 'For $N = 10$ distinguishable two-state particles, the most probable macrostate holds what percentage of all microstates? (Give a number in %.)',
      answer: 24.6, tol: 0.2, calc: () => 100 * binom(10, 5) / 1024,
      sol: '$\\binom{10}{5} = 252$ of $2^{10} = 1024$ microstates: $24.6\\%$. The share falls as $\\sqrt{2/\\pi N}$, yet the macrostates within a few $\\sqrt N$ of the middle hold almost everything.' },
    { id: 'ensm-043', type: 'msq', level: 2, exams: ['gate', 'net'], sub: 'entropy', format: 'multi',
      q: 'Which properties does the Boltzmann entropy $S = k\\ln\\Omega$ have?',
      options: ['It is additive for independent systems', 'It is zero when the system has exactly one accessible microstate', 'It can be negative for a system with many microstates', 'It increases when a constraint inside an isolated system is removed'], answer: [0, 1, 3],
      sol: '$\\Omega_{12} = \\Omega_1\\Omega_2$ gives $S_{12} = S_1 + S_2$. One microstate: $\\ln1 = 0$ (the third law picture). $\\Omega \\ge 1$, so $S \\ge 0$. Removing a constraint (a partition, say) can only add accessible microstates, so $S$ rises or stays the same.' },
    { id: 'ensm-044', type: 'msq', level: 3, exams: ['gate', 'net'], sub: 'canonical', format: 'multi',
      q: 'For a system in the canonical ensemble with partition function $Z(\\beta)$, which expressions are correct?',
      options: ['$\\langle E\\rangle = -\\partial\\ln Z/\\partial\\beta$', '$\\langle(\\Delta E)^2\\rangle = \\partial^2\\ln Z/\\partial\\beta^2$', '$F = -kT\\ln Z$', '$\\langle E\\rangle = kT\\ln Z$'], answer: [0, 1, 2],
      sol: 'Differentiating $Z = \\sum e^{-\\beta E_i}$ brings down $-E_i$: $-\\partial_\\beta\\ln Z = \\langle E\\rangle$; once more gives $\\langle E^2\\rangle - \\langle E\\rangle^2$. $F = -kT\\ln Z$ is the bridge to thermodynamics. $kT\\ln Z = -F$, not $\\langle E\\rangle$.' },
    { id: 'ensm-045', type: 'msq', level: 4, exams: ['gate', 'net'], sub: 'ensembles', format: 'statements',
      q: 'Which of the following are correct statements about the statistical ensembles?',
      options: ['In the canonical ensemble the energy distribution of a large system is sharply peaked at $\\langle E\\rangle$', 'The microcanonical density of states $\\Omega(E)$ is the inverse Laplace transform of $Z(\\beta)$', 'The grand partition function is $\\mathcal Z = \\sum_N z^N Z_N$ with $z = e^{\\beta\\mu}$', 'The canonical ensemble cannot be used for a system of indistinguishable particles'], answer: [0, 1, 2],
      sol: '$P(E) \\propto \\Omega(E)e^{-\\beta E}$: a rapidly rising times a falling function, peaked with width $\\sim\\sqrt N$. $Z(\\beta) = \\int\\Omega(E)e^{-\\beta E}dE$ is a Laplace transform. $\\mathcal Z$ sums canonical $Z_N$ weighted by $z^N$. Indistinguishability is handled inside $Z_N$ (the $1/N!$ or exact quantum counting), so the canonical ensemble works fine.' },
    { id: 'ensm-046', type: 'msq', level: 5, exams: ['gate', 'net'], sub: 'microcanonical', format: 'statements',
      q: 'For $N \\gg 1$ two-level systems (levels $0$, $\\varepsilon$) isolated with energy $E$, which statements are correct?',
      options: ['$S(E)$ is largest at $E = N\\varepsilon/2$', 'The heat capacity in the microcanonical description is positive for $E < N\\varepsilon/2$', 'As $E \\to N\\varepsilon$ the temperature tends to $-0$ K', '$S(E)$ is symmetric about $E = N\\varepsilon/2$'], answer: [0, 1, 2, 3],
      sol: '$S/k = \\ln\\binom{N}{n}$ is symmetric about $n = N/2$ and peaks there. Below the peak $T > 0$ and $E(T) = N\\varepsilon/(e^{\\varepsilon/kT} + 1)$ rises with $T$, so $C > 0$. Near full excitation $\\partial S/\\partial E \\to -$ large, so $1/T \\to -$ large and $T \\to 0^-$, the hottest possible state. All four hold.' },
  ],
  gens: [
    { id: 'ensm-g01', type: 'nat', level: 2, exams: ['gate', 'net'], sub: 'Boltzmann factor',
      make(r) {
        const g1 = int(r, 1, 3), g2 = int(r, 1, 5), dE = int(r, 5, 80), T = choose(r, [200, 300, 500, 1000]);
        const ratio = (g2 / g1) * Math.exp(-dE * 1e-3 / (kB * T));
        return { q: `A lower level of degeneracy ${g1} and an upper level of degeneracy ${g2} are $${dE}$ meV apart. In equilibrium at $${T}$ K, the population ratio $N_{\\rm upper}/N_{\\rm lower}$ is ______. ($k = 8.617\\times10^{-5}$ eV/K)`,
          answer: round(ratio, 4), tol: Math.max(0.0005, round(ratio * 0.01, 4)), g1, g2, dE, T,
          sol: `$kT = ${round(kB * T * 1000, 3)}$ meV. $\\frac{N_2}{N_1} = \\frac{g_2}{g_1}e^{-\\Delta E/kT} = \\frac{${g2}}{${g1}}e^{-${round(dE / (kB * T * 1000), 4)}} \\approx ${round(ratio, 4)}$.`,
          trap: 'Each level counts once per state it contains: multiply the Boltzmann factor by the degeneracy ratio.' };
      },
      verify: (p) => (p.g2 / p.g1) * Math.exp(-p.dE * 1e-3 / (kB * p.T)) },
    { id: 'ensm-g02', type: 'nat', level: 2, exams: ['gate', 'net'], sub: 'counting',
      make(r) {
        const N = int(r, 6, 14), n = int(r, 1, Math.floor(N / 2));
        const om = binom(N, n);
        return { q: `$${N}$ distinguishable two-state magnetic moments are in a field; exactly $${n}$ point against it. How many microstates belong to this macrostate?`,
          answer: om, tol: 0, N, n,
          sol: `Choose which ${n} of the ${N} moments are reversed: $\\binom{${N}}{${n}} = \\frac{${N}!}{${n}!\\,${N - n}!} = ${om}$. Its entropy is $k\\ln${om} = ${round(Math.log(om), 3)}\\,k$.` };
      },
      verify: (p) => binom(p.N, p.n) },
    { id: 'ensm-g03', type: 'nat', level: 2, exams: ['gate', 'net'], sub: 'counting',
      make(r) {
        const N = int(r, 2, 6), q = int(r, 2, 8);
        const om = binom(q + N - 1, q);
        return { q: `An Einstein solid of $${N}$ oscillators holds $${q}$ quanta of energy. Its number of microstates is ______.`,
          answer: om, tol: 0, N, qq: q,
          sol: `Stars and bars: arrange ${q} quanta and ${N - 1} dividers in a row, $\\Omega = \\binom{q + N - 1}{q} = \\binom{${q + N - 1}}{${q}} = ${om}$.`,
          trap: 'Quanta are indistinguishable; oscillators are not. $N^q$ would treat the quanta as labelled.' };
      },
      verify: (p) => binom(p.qq + p.N - 1, p.qq) },
    { id: 'ensm-g04', type: 'nat', level: 3, exams: ['gate', 'net'], sub: 'microcanonical',
      make(r) {
        const f = choose(r, [0.05, 0.1, 0.15, 0.2, 0.25, 0.3, 0.35, 0.4, 0.6, 0.7, 0.8]), eps = int(r, 2, 50);
        const T = eps * 1e-3 / (kB * Math.log((1 - f) / f));
        return { q: `An isolated system of many two-level units (splitting $${eps}$ meV) has a fraction $${f}$ of the units excited. From $S = k\\ln\\binom{N}{n}$, its temperature is ______ K. ($k = 8.617\\times10^{-5}$ eV/K)`,
          answer: round(T, 1), tol: Math.max(0.2, Math.abs(round(T * 0.01, 1))), unit: 'K', f, eps,
          sol: `$\\frac{1}{kT} = \\frac{\\partial S/k}{\\partial E} = \\frac1\\varepsilon\\ln\\frac{1-f}{f} = \\frac{${round(Math.log((1 - f) / f), 4)}}{\\varepsilon}$, so $T = \\frac{${eps}\\times10^{-3}}{8.617\\times10^{-5}\\times(${round(Math.log((1 - f) / f), 4)})} \\approx ${round(T, 1)}$ K.${f > 0.5 ? ' More than half are excited: the temperature is negative.' : ''}`,
          trap: f > 0.5 ? 'Population inversion gives a negative temperature.' : 'Use the natural log of (unexcited/excited), not its inverse.' };
      },
      verify: (p) => p.eps * 1e-3 / (kB * Math.log((1 - p.f) / p.f)) },
    { id: 'ensm-g05', type: 'nat', level: 3, exams: ['gate', 'net'], sub: 'fluctuations',
      make(r) {
        const [kind, f] = choose(r, [['monatomic', 3], ['rigid diatomic', 5], ['rigid non-linear polyatomic', 6]]), N = choose(r, [100, 150, 200, 400, 600, 1000, 2500, 10000]);
        const rel = Math.sqrt(2 / (f * N));
        return { q: `A classical ${kind} ideal gas of $N = ${N}$ molecules is in contact with a heat bath. The relative energy fluctuation $\\Delta E_{\\rm rms}/\\langle E\\rangle$ is ______.`,
          answer: round(rel, 5), tol: Math.max(1e-5, round(rel * 0.01, 5)), N, f,
          sol: `$\\langle E\\rangle = \\tfrac{${f}}{2}NkT$ and $C_V = \\tfrac{${f}}{2}Nk$, so $\\langle(\\Delta E)^2\\rangle = kT^2C_V$ and $\\frac{\\Delta E}{\\langle E\\rangle} = \\sqrt{\\frac{2}{${f}N}} = \\sqrt{\\frac{2}{${f * N}}} \\approx ${round(rel, 5)}$.` };
      },
      verify: (p) => Math.sqrt(2 / (p.f * p.N)) },
    { id: 'ensm-g06', type: 'nat', level: 2, exams: ['gate', 'net'], sub: 'entropy',
      make(r) {
        const sets = [[0.5, 0.25, 0.25], [0.5, 0.5], [0.6, 0.3, 0.1], [0.4, 0.3, 0.2, 0.1], [0.25, 0.25, 0.25, 0.25], [0.7, 0.2, 0.1], [0.8, 0.1, 0.1], [0.5, 0.2, 0.2, 0.1], [0.9, 0.1]];
        const p = choose(r, sets), S = -p.reduce((s, x) => s + x * Math.log(x), 0);
        return { q: `A system occupies ${p.length} microstates with probabilities ${p.map((x) => `$${x}$`).join(', ')}. Its Gibbs entropy in units of $k$ is ______.`,
          answer: round(S, 3), tol: 0.005, p,
          sol: `$S/k = -\\sum p_i\\ln p_i = ${p.map((x) => `${x}\\ln\\frac{1}{${x}}`).join(' + ')} \\approx ${round(S, 3)}$. The largest possible value for ${p.length} states is $\\ln ${p.length} = ${round(Math.log(p.length), 3)}$, reached only when all are equally likely.` };
      },
      verify: (p) => -p.p.reduce((s, x) => s + x * Math.log(x), 0) },
    { id: 'ensm-g07', type: 'mcq', level: 3, exams: ['gate', 'net'], sub: 'grand canonical',
      make(r) {
        const eb = choose(r, [0.1, 0.15, 0.2, 0.25]), kT = choose(r, [0.025, 0.05]), d = kT * choose(r, [-3, -2, -1, -0.5, 0.5, 1, 2, 3]), mu = round(d - eb, 4);
        const x = Math.exp(d / kT), n = x / (1 + x);
        const fmtn = (v) => `$${round(v, 3).toFixed(3)}$`;
        const wrong = [1 - n, Math.min(x, 0.98), n / 2, 0.5, Math.min(0.99, 2 * n), n * n];
        const o = mcqOptions(r, round(n, 3), wrong.map((w) => round(w, 3)), fmtn);
        return { q: `A surface site is empty or holds one atom bound with energy $-${eb}$ eV. The gas fixes the chemical potential at $\\mu = ${mu}$ eV, and $kT = ${kT}$ eV. The mean occupation of the site is`,
          options: o.options, answer: o.answer,
          sol: `Grand sum $\\mathcal Z = 1 + e^{-\\beta(E - \\mu)}$ with $E - \\mu = -${eb} - (${mu}) = ${round(-eb - mu, 3)}$ eV. $\\langle n\\rangle = \\frac{1}{e^{\\beta(E - \\mu)} + 1} = \\frac{1}{e^{${round((-eb - mu) / kT, 3)}} + 1} \\approx ${round(n, 3)}$.`,
          trap: 'Keep the sign of the binding energy: $E - \\mu$, with $E$ negative.' };
      } },
    { id: 'ensm-g08', type: 'nat', level: 3, exams: ['gate', 'net'], sub: 'canonical',
      make(r) {
        const a = int(r, 1, 3), b = a + int(r, 1, 3), t = choose(r, [0.5, 1, 2, 3]);
        const Z = 1 + Math.exp(-a / t) + Math.exp(-b / t), P = 1 / Z;
        return { q: `A system has three non-degenerate levels at $0$, $${a}\\varepsilon$ and $${b}\\varepsilon$, in a bath with $kT = ${t}\\varepsilon$. The probability that it is in the ground state is ______.`,
          answer: round(P, 4), tol: 0.003, a, b, t,
          sol: `$Z = 1 + e^{-${round(a / t, 3)}} + e^{-${round(b / t, 3)}} = ${round(Z, 4)}$, so $P_0 = 1/Z \\approx ${round(P, 4)}$.` };
      },
      verify: (p) => 1 / (1 + Math.exp(-p.a / p.t) + Math.exp(-p.b / p.t)) },
    { id: 'ensm-g09', type: 'mcq', level: 2, exams: ['gate', 'net'], sub: 'ensembles',
      make(r) {
        const S = [
          ['a sealed, thermally insulated flask of gas', 'microcanonical'],
          ['a gas in a rigid, closed metal can standing in a large water bath', 'canonical'],
          ['the molecules inside an imaginary open box drawn in the middle of a large room', 'grand canonical'],
          ['electrons in a small metal grain connected by a wire to a large metal block at fixed temperature', 'grand canonical'],
          ['a gas under a freely sliding piston, the cylinder sitting in a large bath', 'isothermal-isobaric'],
          ['a single protein molecule in a test tube of water at fixed temperature', 'canonical'],
          ['an isolated cloud of atoms in an ideal magnetic trap with no heating or loss', 'microcanonical'],
          ['adsorption sites on a surface exposed to a gas at fixed pressure and temperature', 'grand canonical'],
        ];
        const [what, ans] = choose(r, S);
        const o = mcqOptions(r, ans, ['microcanonical', 'canonical', 'grand canonical', 'isothermal-isobaric'].filter((x) => x !== ans));
        const why = { microcanonical: 'no energy and no particles cross the boundary, so $E, V, N$ are fixed', canonical: 'energy crosses the boundary but particles do not, so $T, V, N$ are fixed', 'grand canonical': 'both energy and particles cross the boundary, so $T, V, \\mu$ are fixed', 'isothermal-isobaric': 'energy and volume change while $N$ is fixed, so $T, P, N$ are fixed' }[ans];
        return { q: `The natural ensemble for describing ${what} is the`, options: o.options, answer: o.answer,
          sol: `Ask what crosses the boundary: here ${why}. That is the ${ans} ensemble.` };
      } },
    { id: 'ensm-g10', type: 'nat', level: 4, exams: ['gate', 'net'], sub: 'fluctuations',
      make(r) {
        const N = choose(r, [50, 100, 200, 400, 1000]), x = choose(r, [1, 2, 3, 0.5]);
        const p = Math.exp(-x) / (1 + Math.exp(-x)), v = N * p * (1 - p);
        return { q: `$N = ${N}$ independent two-level systems (levels $0$ and $\\varepsilon$) are held at temperature $T$ with $\\varepsilon/kT = ${x}$. The energy variance $\\langle(\\Delta E)^2\\rangle/\\varepsilon^2$ is ______.`,
          answer: round(v, 3), tol: Math.max(0.01, round(v * 0.01, 3)), N, x,
          sol: `Each unit is excited with $p = \\frac{e^{-${x}}}{1 + e^{-${x}}} = ${round(p, 4)}$ and has variance $\\varepsilon^2p(1-p)$. For $N$ independent units: $${N}\\times${round(p, 4)}\\times${round(1 - p, 4)} \\approx ${round(v, 3)}$. Check: this is $kT^2C/\\varepsilon^2$ for the Schottky heat capacity.` };
      },
      verify: (p) => { const q = Math.exp(-p.x) / (1 + Math.exp(-p.x)); return p.N * q * (1 - q); } },
    { id: 'ensm-g11', type: 'nat', level: 4, exams: ['gate', 'net'], sub: 'counting',
      make(r) {
        const NA = int(r, 2, 4), NB = int(r, 2, 4), q = int(r, 3, 7), qA = int(r, 0, q);
        const P = binom(qA + NA - 1, qA) * binom(q - qA + NB - 1, q - qA) / binom(q + NA + NB - 1, q);
        return { q: `Einstein solids A ($${NA}$ oscillators) and B ($${NB}$ oscillators) share $${q}$ quanta in equilibrium. The probability that A holds exactly $${qA}$ of them is ______.`,
          answer: round(P, 4), tol: 0.002, NA, NB, qq: q, qA,
          sol: `$\\Omega_A = \\binom{${qA + NA - 1}}{${qA}} = ${binom(qA + NA - 1, qA)}$, $\\Omega_B = \\binom{${q - qA + NB - 1}}{${q - qA}} = ${binom(q - qA + NB - 1, q - qA)}$; all $\\binom{${q + NA + NB - 1}}{${q}} = ${binom(q + NA + NB - 1, q)}$ joint microstates are equally likely. $P = ${binom(qA + NA - 1, qA) * binom(q - qA + NB - 1, q - qA)}/${binom(q + NA + NB - 1, q)} \\approx ${round(P, 4)}$.` };
      },
      verify: (p) => binom(p.qA + p.NA - 1, p.qA) * binom(p.qq - p.qA + p.NB - 1, p.qq - p.qA) / binom(p.qq + p.NA + p.NB - 1, p.qq) },
    { id: 'ensm-g12', type: 'nat', level: 3, exams: ['gate', 'net'], sub: 'phase space',
      make(r) {
        const L = choose(r, [1, 2, 5, 10]), E = choose(r, [0.5, 1, 2, 5, 10]);
        const n = 2 * L * 1e-9 * Math.sqrt(2 * C.me * E * C.e) / C.h;
        return { q: `An electron moves on a line segment of length $L = ${L}$ nm (ignore spin). Counting phase-space area $/h$, the number of quantum states with energy below $${E}$ eV is about ______.`,
          answer: round(n, 2), tol: Math.max(0.05, round(n * 0.01, 2)), L, E,
          sol: `The region is $0 < x < L$, $|p| < p_{\\max} = \\sqrt{2mE}$, area $2Lp_{\\max}$. $p_{\\max} = \\sqrt{2\\times9.109\\times10^{-31}\\times${E}\\times1.602\\times10^{-19}} = ${(Math.sqrt(2 * C.me * E * C.e)).toExponential(3).replace('e', '\\times10^{') + '}'}$ kg m/s. $N = 2Lp_{\\max}/h \\approx ${round(n, 2)}$, the same as the largest box quantum number $n = L\\sqrt{8mE}/h$.` };
      },
      verify: (p) => 2 * p.L * 1e-9 * Math.sqrt(2 * C.me * p.E * C.e) / C.h },
  ],
};
