// Time-dependent perturbation theory: first-order amplitudes, step, exponential and Gaussian pulses, harmonic
// perturbations and resonance, absorption and stimulated emission, Fermi's golden rule and densities of states,
// Rabi oscillations (resonant and detuned, π pulses, magnetic resonance), selection rules for dipole transitions,
// spontaneous emission and natural linewidths, sudden and adiabatic limits, kicked oscillators and Landau-Zener.
// Original questions for GATE and CSIR NET practice (fibub). Levels: 1 warm-up ... 5 top rank.
import { int, choose, mcqOptions, round, shuffle } from '../_util.js';

const HBAR_EVS = 6.582119569e-16; // ħ in eV s
// Sudden expansion of an infinite well from a to k·a: probability ground → ground.
function wellOverlap(k) {
  let s = 0; const N = 4000;
  for (let i = 0; i < N; i++) { const x = (i + 0.5) / N; s += Math.sin(Math.PI * x) * Math.sin(Math.PI * x / k); }
  const amp = (2 / Math.sqrt(k)) * s / N;
  return amp * amp;
}

export default {
  topic: 'time-dependent-perturbation',
  items: [
    // ---------- level 1 ----------
    { id: 'qtd-001', type: 'mcq', level: 1, exams: ['gate', 'net'], sub: 'first order',
      q: 'A system starts in state $|i\\rangle$ at $t = 0$ and feels a weak perturbation $V(t)$. To first order, the amplitude to be in $|f\\rangle \\ne |i\\rangle$ at time $t$ is',
      options: ['$c_f(t) = \\dfrac{1}{i\\hbar}\\int_0^t\\langle f|V(t\')|i\\rangle e^{i\\omega_{fi}t\'}dt\'$', '$c_f(t) = \\langle f|V(t)|i\\rangle$', '$c_f(t) = \\dfrac{1}{i\\hbar}\\langle f|V|i\\rangle\\,t$ always', '$c_f(t) = \\dfrac{|\\langle f|V|i\\rangle|^2}{E_f - E_i}$'], answer: 0,
      sol: 'In the interaction picture, $i\\hbar\\dot c_f = \\sum_n V_{fn}(t)e^{i\\omega_{fn}t}c_n$. Putting $c_n \\approx \\delta_{ni}$ on the right and integrating gives the first option, with $\\omega_{fi} = (E_f - E_i)/\\hbar$. The probability is $|c_f|^2$. The third option is the special case $\\omega_{fi} = 0$ with constant $V$.' },
    { id: 'qtd-002', type: 'mcq', level: 1, exams: ['gate', 'net'], sub: 'golden rule',
      q: 'Fermi\'s golden rule for the transition rate from $|i\\rangle$ into a continuum of final states with density $\\rho(E_f)$ is',
      options: ['$\\Gamma = \\dfrac{2\\pi}{\\hbar}|V_{fi}|\\rho(E_f)$', '$\\Gamma = \\dfrac{2\\pi}{\\hbar}|V_{fi}|^2\\rho(E_f)$', '$\\Gamma = \\dfrac{\\hbar}{2\\pi}|V_{fi}|^2\\rho(E_f)$', '$\\Gamma = \\dfrac{2\\pi}{\\hbar}\\dfrac{|V_{fi}|^2}{\\rho(E_f)}$'], answer: 1,
      sol: 'Summing $|c_f(t)|^2$ over a band of final states turns $\\dfrac{\\sin^2(\\Delta\\omega t/2)}{(\\Delta\\omega/2)^2}$ into $2\\pi t\\,\\delta(\\Delta\\omega)$, so the probability grows linearly with a rate $\\Gamma = \\tfrac{2\\pi}{\\hbar}|V_{fi}|^2\\rho(E_f)$. Dimension check: $\\text{energy}^2\\times\\text{energy}^{-1}/(\\text{energy}\\cdot\\text{time}) = \\text{time}^{-1}$.' },
    { id: 'qtd-003', type: 'mcq', level: 1, exams: ['gate', 'net'], sub: 'rabi',
      q: 'A two-level atom starts in the lower state and is driven exactly on resonance with Rabi frequency $\\Omega$. The probability of the upper state at time $t$ (rotating-wave approximation) is',
      options: ['$\\Omega t$', '$1 - e^{-\\Omega t}$', '$\\sin^2(\\Omega t/2)$', '$\\tfrac12$ at all times'], answer: 2,
      sol: 'On resonance the amplitudes obey $\\dot c_1 = -\\tfrac{i}{2}\\Omega c_2$, $\\dot c_2 = -\\tfrac{i}{2}\\Omega c_1$, so $c_2 = -i\\sin(\\Omega t/2)$. The population swings fully between the levels (Rabi flopping); a pulse with $\\Omega t = \\pi$ (a $\\pi$ pulse) inverts the atom. First-order theory gives only the start, $(\\Omega t/2)^2$.' },
    { id: 'qtd-004', type: 'nat', level: 1, exams: ['gate', 'net'], sub: 'rabi',
      q: 'A resonant drive has Rabi frequency $\\Omega = 2\\pi\\times1.0$ MHz. The duration of a $\\pi$ pulse is ______ $\\mu$s (to two decimal places).',
      answer: 0.5, tol: 0.005, calc: () => Math.PI / (2 * Math.PI * 1e6) * 1e6,
      sol: 'Full inversion needs $\\Omega t = \\pi$: $t = \\pi/(2\\pi\\times10^6\\ \\text{s}^{-1}) = 0.5\\ \\mu$s. A $\\pi/2$ pulse (0.25 $\\mu$s) makes an equal superposition.' },
    { id: 'qtd-005', type: 'mcq', level: 1, exams: ['gate', 'net'], sub: 'sudden approximation',
      q: 'In the sudden approximation, a Hamiltonian changes from $H_1$ to $H_2$ in a time much shorter than any internal period. The probability of finding the system in an eigenstate $|n_2\\rangle$ of $H_2$ just afterwards is',
      options: ['$1$ if $n_2$ has the same label as the initial state', '$|\\langle n_2|H_2|\\psi\\rangle|^2$', 'zero for every state except the ground state of $H_2$', '$|\\langle n_2|\\psi\\rangle|^2$, with $|\\psi\\rangle$ the state just before the change'], answer: 3,
      sol: 'There is no time for the state to evolve, so $|\\psi\\rangle$ is unchanged; it is simply re-expanded in the new eigenbasis. The probabilities are the squared overlaps, which sum to 1. The opposite (slow) limit is the adiabatic theorem.' },
    { id: 'qtd-006', type: 'msq', level: 1, exams: ['gate', 'net', 'jam'], sub: 'selection rules',
      q: 'For electric dipole transitions between hydrogen states $|nlm\\rangle$, which selection rules hold?',
      options: ['$\\Delta l = \\pm1$', '$\\Delta m = 0, \\pm1$', 'The parity changes.', '$\\Delta n = \\pm1$ only'], answer: [0, 1, 2],
      sol: 'The operator $\\vec r$ is a vector (rank 1) and odd, so it connects states with $\\Delta l = \\pm1$, $\\Delta m = 0, \\pm1$ and opposite parity. There is no rule on $n$: Lyman $\\alpha$ ($2p \\to 1s$) and Lyman $\\beta$ ($3p \\to 1s$) are both allowed.' },

    // ---------- level 2 ----------
    { id: 'qtd-007', type: 'nat', level: 2, exams: ['gate', 'net'], sub: 'step perturbation',
      q: 'A constant perturbation with $|V_{fi}| = 0.10$ meV is switched on at $t = 0$ between levels $1.0$ meV apart. The largest first-order probability of finding the system in $|f\\rangle$ at any later time is ______ (to three decimal places).',
      answer: 0.04, tol: 0.001, calc: () => 4 * 0.01 / 1,
      sol: '$c_f = \\tfrac{V_{fi}}{i\\hbar}\\int_0^te^{i\\omega t\'}dt\'$ gives $|c_f|^2 = \\dfrac{4|V_{fi}|^2}{(\\hbar\\omega)^2}\\sin^2\\dfrac{\\omega t}{2}$. The maximum is $4(0.1)^2/1^2 = 0.04$: off resonance the probability only oscillates, it never builds up.' },
    { id: 'qtd-008', type: 'mcq', level: 2, exams: ['gate', 'net'], sub: 'golden rule',
      q: 'For a transition from one level into a broad continuum, after times long compared with $\\hbar$ divided by the width of the continuum (but short enough that the initial state is not depleted), the total transition probability grows as',
      options: ['$t$', '$t^2$', '$\\sin^2(\\omega t/2)$', '$e^{-t}$'], answer: 0,
      sol: 'Each final state contributes $\\propto\\sin^2(\\Delta\\omega t/2)/\\Delta\\omega^2$, whose peak height grows as $t^2$ but whose width shrinks as $1/t$. Integrated over the continuum: $\\propto t$, a constant rate (the golden rule). At very short times every state still grows as $t^2$.' },
    { id: 'qtd-009', type: 'nat', level: 2, exams: ['gate', 'net'], sub: 'spontaneous emission',
      q: 'An excited atomic level has lifetime $\\tau = 1.6$ ns. The natural linewidth (full width at half maximum) of the emitted line, $\\Delta\\nu = 1/2\\pi\\tau$, is ______ MHz (to one decimal place).',
      answer: 99.5, tol: 0.5, calc: () => 1 / (2 * Math.PI * 1.6e-9) / 1e6,
      sol: 'The amplitude decays as $e^{-t/2\\tau}$, so its Fourier transform is a Lorentzian with full width $\\Delta\\omega = 1/\\tau$, i.e. $\\Delta\\nu = 1/(2\\pi\\times1.6\\times10^{-9}) = 9.95\\times10^7$ Hz $= 99.5$ MHz. In energy, $\\Gamma = \\hbar/\\tau = 0.41\\ \\mu$eV.' },
    { id: 'qtd-010', type: 'mcq', level: 2, exams: ['gate', 'net'], sub: 'harmonic perturbation',
      q: 'A perturbation $V(t) = 2W\\cos\\omega t$ acts on a system in state $|i\\rangle$. To first order, transitions to $|f\\rangle$ become large when',
      options: ['$\\omega$ is much larger than $|\\omega_{fi}|$', '$\\omega \\approx \\omega_{fi}$ (absorption, $E_f > E_i$) or $\\omega \\approx -\\omega_{fi}$ (stimulated emission, $E_f < E_i$)', '$\\omega = 0$ only', '$\\omega = 2\\omega_{fi}$'], answer: 1,
      sol: '$2\\cos\\omega t = e^{i\\omega t} + e^{-i\\omega t}$, so $c_f$ contains $\\dfrac{e^{i(\\omega_{fi} \\pm \\omega)t} - 1}{\\omega_{fi} \\pm \\omega}$. One term resonates when $\\omega = \\omega_{fi}$ (the system takes $\\hbar\\omega$), the other when $\\omega = -\\omega_{fi}$ (it gives $\\hbar\\omega$ to the field). The rates are equal: $|W_{fi}|^2 = |W_{if}|^2$.' },
    { id: 'qtd-011', type: 'mcq', level: 2, exams: ['gate', 'net'], sub: 'rabi',
      q: 'A two-level atom is driven with Rabi frequency $\\Omega$ and detuning $\\Delta = \\sqrt3\\,\\Omega$. The largest probability of finding it in the upper state is',
      options: ['$1$', '$3/4$', '$1/4$', '$1/2$'], answer: 2,
      sol: '$P(t) = \\dfrac{\\Omega^2}{\\Omega^2 + \\Delta^2}\\sin^2\\dfrac{\\sqrt{\\Omega^2 + \\Delta^2}\\,t}{2}$, so $P_{\\max} = \\dfrac{\\Omega^2}{\\Omega^2 + 3\\Omega^2} = \\dfrac14$. Off resonance the oscillation is faster but never complete.' },
    { id: 'qtd-012', type: 'mcq', level: 2, exams: ['gate', 'net'], sub: 'adiabatic theorem',
      q: 'The adiabatic theorem says that if a Hamiltonian changes slowly enough, a system that starts in the $n$-th eigenstate',
      options: ['ends in the ground state', 'ends in an equal mixture of all states', 'makes a transition to $n + 1$', 'stays in the $n$-th instantaneous eigenstate (picking up only a phase)'], answer: 3,
      sol: '"Slowly" means the change over one period $\\hbar/\\Delta E$ to the neighbouring levels is small (and the level stays non-degenerate). The state then follows the instantaneous eigenstate, gaining dynamical and geometric (Berry) phases. Example: a slowly widened well keeps the particle in its $n$-th level, which is lowered as the well widens.' },
    { id: 'qtd-013', type: 'msq', level: 2, exams: ['gate', 'net'], sub: 'first order',
      q: 'Which statements about first-order time-dependent perturbation theory are correct?',
      options: ['It requires $|c_f(t)|^2 \\ll 1$.', 'It fails for a resonant drive once the Rabi angle $\\Omega t$ is no longer small.', 'It applies only to time-independent perturbations.', 'Its transition probability is proportional to $|V_{fi}|^2$.'], answer: [0, 1, 3],
      sol: 'The method keeps $c_i \\approx 1$, so it needs small transition probabilities; on resonance the exact Rabi result $\\sin^2(\\Omega t/2)$ agrees only while $\\Omega t \\ll 1$. It handles any time dependence (pulses, oscillating fields) and always gives $|c_f|^2 \\propto |V_{fi}|^2$.' },
    { id: 'qtd-014', type: 'nat', level: 2, exams: ['gate', 'net', 'jam'], sub: 'spontaneous emission',
      q: 'Hydrogen atoms in the $2p$ state decay to $1s$ with lifetime $1.6$ ns. The fraction still excited after $5.0$ ns is ______ (to three decimal places).',
      answer: 0.044, tol: 0.001, calc: () => Math.exp(-5 / 1.6),
      sol: 'A constant decay rate $\\Gamma = 1/\\tau$ (from the golden rule) gives $P(t) = e^{-t/\\tau} = e^{-3.125} = 0.044$.' },
    { id: 'qtd-015', type: 'mcq', level: 2, exams: ['gate', 'net'], sub: 'selection rules',
      q: 'Light linearly polarised along $z$ (perturbation $\\propto z$) acts on hydrogen in $1s$. Which $2p$ state can it excite?',
      options: ['$2p$, $m = 0$ only', '$2p$, $m = \\pm1$ only', 'all three $2p$ states', 'none, because $\\Delta n \\ne 0$'], answer: 0,
      sol: '$z \\propto rY_{10}$ has $m = 0$, so $\\langle 2p, m|z|1s\\rangle \\propto \\int Y_{1m}^*Y_{10}\\,d\\Omega = \\delta_{m0}$. Light polarised in the $xy$-plane ($x \\pm iy$) drives $\\Delta m = \\pm1$.' },
    { id: 'qtd-016', type: 'mcq', level: 2, exams: ['gate', 'net'], sub: 'sudden approximation',
      q: 'An oscillator in its ground state has its spring stiffened suddenly so that $\\omega \\to 4\\omega$. The probability that it is found in the new ground state is',
      options: ['$1/4$', '$0.8$', '$0.5$', '$1$'], answer: 1,
      sol: 'Overlap of Gaussians with width parameters $\\alpha_{1,2} = m\\omega_{1,2}/\\hbar$: $|\\langle0_2|0_1\\rangle|^2 = \\dfrac{2\\sqrt{\\alpha_1\\alpha_2}}{\\alpha_1 + \\alpha_2} = \\dfrac{2\\sqrt{4}}{5} = 0.8$. The rest goes into even excited states ($n = 2, 4, \\dots$) because the change is symmetric.' },

    // ---------- level 3 ----------
    { id: 'qtd-017', type: 'nat', level: 3, exams: ['gate', 'net'], sub: 'sudden approximation',
      q: 'A particle in the ground state of an infinite well $0 < x < a$ suddenly finds the right wall moved to $x = 3a$. The probability that it is in the ground state of the new well is ______ (to three decimal places).',
      answer: 0.128, tol: 0.002, calc: () => (9 / (8 * Math.PI)) ** 2,
      sol: '$\\langle\\phi_1|\\psi_1\\rangle = \\sqrt{\\tfrac2a}\\sqrt{\\tfrac{2}{3a}}\\int_0^a\\sin\\tfrac{\\pi x}{a}\\sin\\tfrac{\\pi x}{3a}dx$. Product to sum: $\\tfrac12\\int_0^a\\left[\\cos\\tfrac{2\\pi x}{3a} - \\cos\\tfrac{4\\pi x}{3a}\\right]dx = \\tfrac{3a}{2\\pi}\\cdot\\tfrac{\\sqrt3}{2}\\cdot\\tfrac34 = \\tfrac{9\\sqrt3a}{16\\pi}$. Times $\\tfrac{2}{\\sqrt3a}$: $\\tfrac{9}{8\\pi} = 0.358$, probability $0.128$.' },
    { id: 'qtd-018', type: 'nat', level: 3, exams: ['gate', 'net'], sub: 'pulses',
      q: 'A perturbation $V(t) = V_0e^{-t/\\tau}$ is switched on at $t = 0$ between states with $\\omega_{fi}\\tau = 1$. If $|V_0|\\tau/\\hbar = 0.10$, the first-order probability of $|f\\rangle$ as $t \\to \\infty$ is ______ (to four decimal places).',
      answer: 0.005, tol: 0.0001, calc: () => 0.01 / (1 + 1),
      sol: '$c_f = \\dfrac{V_0}{i\\hbar}\\int_0^\\infty e^{(i\\omega - 1/\\tau)t}dt = \\dfrac{V_0}{i\\hbar}\\cdot\\dfrac{\\tau}{1 - i\\omega\\tau}$. So $|c_f|^2 = \\dfrac{|V_0|^2\\tau^2}{\\hbar^2(1 + \\omega^2\\tau^2)} = \\dfrac{0.01}{2} = 0.005$.' },
    { id: 'qtd-019', type: 'nat', level: 3, exams: ['gate', 'net'], sub: 'pulses',
      q: 'A Gaussian pulse $V(t) = V_0e^{-t^2/\\tau^2}$ acts from $t = -\\infty$ to $\\infty$, with $|V_0|\\tau/\\hbar = 0.10$ and $\\omega_{fi}\\tau = 2$. The first-order transition probability is ______ (to five decimal places).',
      answer: 0.00425, tol: 0.00003, calc: () => Math.PI * 0.01 * Math.exp(-2),
      sol: '$\\int_{-\\infty}^\\infty e^{-t^2/\\tau^2}e^{i\\omega t}dt = \\sqrt\\pi\\,\\tau e^{-\\omega^2\\tau^2/4}$. So $P = \\pi\\dfrac{|V_0|^2\\tau^2}{\\hbar^2}e^{-\\omega^2\\tau^2/2} = \\pi(0.01)e^{-2} = 0.00425$.' },
    { id: 'qtd-020', type: 'mcq', level: 3, exams: ['gate', 'net'], sub: 'pulses',
      q: 'For the Gaussian pulse $V_0e^{-t^2/\\tau^2}$, what happens to the first-order transition probability when $\\omega_{fi}\\tau \\gg 1$ (a pulse much longer than the transition period) at fixed $V_0$?',
      options: ['It grows as $\\tau^2$ without limit.', 'It approaches $|V_0|^2/(\\hbar\\omega_{fi})^2$.', 'It falls to zero, as $\\tau^2e^{-\\omega^2\\tau^2/2}$: the adiabatic limit.', 'It becomes independent of $\\omega_{fi}$.'], answer: 2,
      sol: '$P = \\pi(V_0\\tau/\\hbar)^2e^{-\\omega^2\\tau^2/2}$: the Gaussian factor wins. A smooth, slow pulse has almost no Fourier component at $\\omega_{fi}$, so the system just follows it and returns to $|i\\rangle$ (adiabatic). A short pulse ($\\omega\\tau \\ll 1$) gives the sudden limit $P \\approx \\pi(V_0\\tau/\\hbar)^2$.' },
    { id: 'qtd-021', type: 'nat', level: 3, exams: ['gate', 'net'], sub: 'golden rule',
      q: 'A discrete state couples with $|V| = 1.0\\ \\mu$eV to a continuum of density $\\rho = 1.0\\times10^6$ states per eV. The golden-rule decay rate is $k\\times10^9$ s$^{-1}$ with $k =$ ______ (to two decimal places). Use $\\hbar = 6.582\\times10^{-16}$ eV s.',
      answer: 9.55, tol: 0.03, calc: () => 2 * Math.PI * 1e-12 * 1e6 / HBAR_EVS / 1e9,
      sol: '$\\Gamma = \\tfrac{2\\pi}{\\hbar}|V|^2\\rho = \\dfrac{2\\pi\\times10^{-12}\\ \\text{eV}^2\\times10^6\\ \\text{eV}^{-1}}{6.582\\times10^{-16}\\ \\text{eV s}} = 9.55\\times10^9$ s$^{-1}$: a lifetime of about 0.10 ns.' },
    { id: 'qtd-022', type: 'mcq', level: 3, exams: ['gate', 'net'], sub: 'rabi',
      q: 'With Rabi frequency $\\Omega$ and detuning $\\Delta$, the upper-state population oscillates at the generalised Rabi frequency',
      options: ['$\\Omega + \\Delta$', '$\\Omega$', '$\\Omega^2/\\Delta$', '$\\sqrt{\\Omega^2 + \\Delta^2}$'], answer: 3,
      sol: 'In the frame rotating with the drive, the Hamiltonian is $\\tfrac\\hbar2\\begin{pmatrix}-\\Delta & \\Omega\\\\\\Omega & \\Delta\\end{pmatrix}$, whose eigenvalues are $\\pm\\tfrac\\hbar2\\sqrt{\\Omega^2 + \\Delta^2}$. The population oscillates at their difference over $\\hbar$, $\\sqrt{\\Omega^2 + \\Delta^2}$, with amplitude $\\Omega^2/(\\Omega^2 + \\Delta^2)$.' },
    { id: 'qtd-023', type: 'msq', level: 3, exams: ['gate', 'net'], sub: 'spontaneous emission',
      q: 'Which statements about spontaneous and stimulated emission are correct?',
      options: ['The spontaneous dipole emission rate scales as $\\omega^3|\\vec d_{fi}|^2$.', 'The $2s \\to 1s$ decay of hydrogen is forbidden for single-photon dipole emission.', 'A stimulated photon has the same frequency, direction and polarisation as the stimulating one.', 'The spontaneous emission rate does not depend on the transition frequency.'], answer: [0, 1, 2],
      sol: '$A = \\omega^3|\\vec d|^2/(3\\pi\\epsilon_0\\hbar c^3)$: the $\\omega^3$ comes from the density of photon modes ($\\propto\\omega^2$) times the field strength per photon ($\\propto\\omega$). $2s \\to 1s$ has $\\Delta l = 0$, so $2s$ lives about 0.12 s and decays by two photons. Stimulated emission adds a photon to the same mode, which is the basis of the laser.' },
    { id: 'qtd-024', type: 'nat', level: 3, exams: ['gate', 'net'], sub: 'sudden approximation',
      q: 'An oscillator in its ground state receives a sudden momentum kick $p_0$ with $p_0^2/2m\\hbar\\omega = 0.5$. The probability that it is still in the ground state is ______ (to three decimal places).',
      answer: 0.607, tol: 0.002, calc: () => Math.exp(-0.5),
      sol: 'The kick multiplies $\\psi$ by $e^{ip_0x/\\hbar}$. $\\langle0|e^{ip_0x/\\hbar}|0\\rangle = e^{-p_0^2\\langle x^2\\rangle/2\\hbar^2} = e^{-p_0^2/4m\\hbar\\omega}$ for a Gaussian. Squared: $e^{-p_0^2/2m\\hbar\\omega} = e^{-0.5} = 0.607$. The kicked state is a coherent state with $|\\alpha|^2 = 0.5$, and $P(n) = e^{-|\\alpha|^2}|\\alpha|^{2n}/n!$.' },
    { id: 'qtd-025', type: 'mcq', level: 3, exams: ['gate', 'net'], sub: 'first order',
      q: 'Writing $|\\psi(t)\\rangle = \\sum_nc_n(t)e^{-iE_nt/\\hbar}|n\\rangle$ for $H = H_0 + V(t)$, the exact equations for the coefficients are',
      options: ['$i\\hbar\\dot c_f = \\sum_nV_{fn}(t)e^{i\\omega_{fn}t}c_n$', '$i\\hbar\\dot c_f = E_fc_f$', '$i\\hbar\\dot c_f = \\sum_nV_{fn}(t)c_n$', '$\\dot c_f = -\\sum_n\\omega_{fn}c_n$'], answer: 0,
      sol: 'Substitute into $i\\hbar\\partial_t|\\psi\\rangle = (H_0 + V)|\\psi\\rangle$: the $H_0$ terms cancel against the time derivative of the phases, leaving $i\\hbar\\dot c_f = \\sum_nV_{fn}e^{i\\omega_{fn}t}c_n$ with $\\omega_{fn} = (E_f - E_n)/\\hbar$. Perturbation theory solves these by iteration.' },
    { id: 'qtd-026', type: 'nat', level: 3, exams: ['gate', 'net'], sub: 'magnetic resonance',
      q: 'In proton NMR ($\\gamma = 2.675\\times10^8$ rad s$^{-1}$ T$^{-1}$), a resonant rotating field of amplitude $B_1 = 0.10$ mT gives Rabi frequency $\\Omega = \\gamma B_1$. The length of a $\\pi/2$ pulse is ______ $\\mu$s (to one decimal place).',
      answer: 58.7, tol: 0.3, calc: () => (Math.PI / 2) / (2.675e8 * 1e-4) * 1e6,
      sol: '$\\Omega = 2.675\\times10^8\\times10^{-4} = 2.675\\times10^4$ rad/s. A $\\pi/2$ pulse needs $\\Omega t = \\pi/2$: $t = 1.571/2.675\\times10^4 = 5.87\\times10^{-5}$ s $= 58.7\\ \\mu$s. It tips the magnetisation into the transverse plane.' },
    { id: 'qtd-027', type: 'nat', level: 3, exams: ['gate', 'net'], sub: 'first order',
      q: 'Two degenerate states ($\\omega_{fi} = 0$) are coupled by a constant $V$ switched on at $t = 0$. The exact probability of $|f\\rangle$ is $\\sin^2(|V|t/\\hbar)$. At $|V|t/\\hbar = 0.5$, this exact value is ______ (to three decimal places).',
      answer: 0.23, tol: 0.002, calc: () => Math.sin(0.5) ** 2,
      sol: '$\\sin^2(0.5) = 0.4794^2 = 0.230$. First-order theory gives $(|V|t/\\hbar)^2 = 0.25$, already 9% too high: perturbation theory grows without bound, while the true probability saturates and returns.' },
    { id: 'qtd-028', type: 'mcq', level: 3, exams: ['gate', 'net'], sub: 'golden rule',
      q: 'In a decay that emits one free non-relativistic particle (in 3D) with kinetic energy $E$, the density of final states $\\rho(E)$ is proportional to',
      options: ['$E$', '$E^{1/2}$', '$E^{-1/2}$', 'a constant'], answer: 1,
      sol: 'States fill momentum space uniformly: $dN \\propto p^2dp$. With $E = p^2/2m$, $dp/dE \\propto 1/p$, so $\\rho = dN/dE \\propto p \\propto E^{1/2}$. (In 2D it is constant; in 1D $\\propto E^{-1/2}$; for photons $\\propto E^2$.)' },
    { id: 'qtd-041', type: 'mcq', level: 3, exams: ['gate', 'net'], sub: 'selection rules',
      q: 'The hydrogen $2s$ state is metastable (lifetime about 0.1 s, compared with 1.6 ns for $2p$) mainly because',
      options: ['it lies below $2p$ in energy', 'single-photon electric dipole decay to $1s$ is forbidden ($\\Delta l = 0$), so it decays by two-photon emission', 'its electron has no angular momentum and so cannot radiate at all', 'the nucleus absorbs the photon'], answer: 1,
      sol: '$2s$ and $1s$ both have $l = 0$ and even parity, so $\\langle1s|\\vec r|2s\\rangle = 0$. The fastest route left is the simultaneous emission of two photons (a second-order process), about $8$ s$^{-1}$. In the Schrödinger theory $2s$ and $2p$ have the same energy.' },

    // ---------- level 4 ----------
    { id: 'qtd-029', type: 'nat', level: 4, exams: ['gate', 'net'], sub: 'spontaneous emission',
      q: 'For hydrogen $2p\\,(m = 0) \\to 1s$, $|\\langle1s|z|2p_0\\rangle| = 0.745\\,a_0$ and $\\hbar\\omega = 10.2$ eV. With $A = \\dfrac{4\\alpha\\omega^3|\\vec r_{fi}|^2}{3c^2}$ ($\\alpha = 1/137.04$, $a_0 = 5.292\\times10^{-11}$ m, $\\hbar = 6.582\\times10^{-16}$ eV s), the lifetime $1/A$ is ______ ns (to two decimal places).',
      answer: 1.6, tol: 0.02, calc: () => { const w = 10.2 / HBAR_EVS, r = 0.745 * 5.292e-11; return 1 / ((4 / 137.04) * w ** 3 * r * r / (3 * 2.99792458e8 ** 2)) * 1e9; },
      sol: '$\\omega = 10.2/6.582\\times10^{-16} = 1.550\\times10^{16}$ s$^{-1}$, $\\omega^3 = 3.72\\times10^{48}$ s$^{-3}$. $|r|^2 = (3.94\\times10^{-11})^2 = 1.554\\times10^{-21}$ m$^2$. $A = \\tfrac{4}{3\\times137.04\\times(3\\times10^8)^2}\\times3.72\\times10^{48}\\times1.554\\times10^{-21} = 6.26\\times10^8$ s$^{-1}$, so $\\tau = 1.60$ ns.' },
    { id: 'qtd-030', type: 'msq', level: 4, exams: ['gate', 'net'], sub: 'selection rules',
      q: 'Hydrogen in $1s$ is driven by light linearly polarised along $x$ (perturbation $\\propto x$). Which states can be reached at first order?',
      options: ['$2p$, $m = 1$', '$2p$, $m = 0$', '$2p$, $m = -1$', '$2s$'], answer: [0, 2],
      sol: '$x = \\tfrac12[(x + iy) + (x - iy)] \\propto r(Y_{1,-1} - Y_{11})$ carries $m = \\pm1$ only, so it reaches $2p_{\\pm1}$ (an $x$-polarised wave is a sum of two circular ones). $2p_0$ needs $z$; $2s$ has the wrong parity.' },
    { id: 'qtd-031', type: 'nat', level: 4, exams: ['gate', 'net'], sub: 'rabi',
      q: 'A two-level atom has Rabi frequency $\\Omega = 2\\pi\\times1.0$ MHz and detuning $\\Delta = 2\\pi\\times0.75$ MHz. Starting in the lower state, its upper-state probability after $0.40\\ \\mu$s is ______ (to three decimal places).',
      answer: 0.64, tol: 0.003, calc: () => { const W = Math.hypot(1, 0.75); return Math.sin(Math.PI * W * 0.4) ** 2 / (W * W); },
      sol: 'Generalised Rabi frequency $\\Omega\' = 2\\pi\\sqrt{1 + 0.5625} = 2\\pi\\times1.25$ MHz. $P = \\dfrac{\\Omega^2}{\\Omega\'^2}\\sin^2\\dfrac{\\Omega\'t}{2} = \\dfrac{1}{1.5625}\\sin^2(\\pi\\times1.25\\times0.4) = 0.64\\sin^2(\\pi/2) = 0.64$, the largest value it can reach.' },
    { id: 'qtd-032', type: 'nat', level: 4, exams: ['gate', 'net'], sub: 'harmonic perturbation',
      q: 'A weak drive is applied for $t = 2.0\\ \\mu$s. The first-order transition probability vs drive frequency $\\nu$ has its central peak between the first zeros at $|\\nu - \\nu_0| = 1/t$. The full width between those zeros is ______ MHz (to two decimal places).',
      answer: 1.0, tol: 0.01, calc: () => 2 / 2e-6 / 1e6,
      sol: '$P \\propto \\dfrac{\\sin^2(\\Delta\\omega t/2)}{(\\Delta\\omega/2)^2}$ first vanishes at $\\Delta\\omega t/2 = \\pi$, i.e. $|\\Delta\\nu| = 1/t = 0.5$ MHz. Full width $2/t = 1.0$ MHz. Longer interaction gives a narrower resonance: the energy-time relation, and the reason Ramsey and atomic-clock methods use long interrogation times.' },
    { id: 'qtd-033', type: 'mcq', level: 4, exams: ['gate', 'net'], sub: 'golden rule',
      q: 'The step that turns first-order theory into the golden rule uses the large-$t$ limit',
      options: ['$\\dfrac{\\sin^2(xt/2)}{(x/2)^2} \\to 1$', '$\\dfrac{\\sin^2(xt/2)}{(x/2)^2} \\to t^2$ for every $x$', '$\\dfrac{\\sin^2(xt/2)}{(x/2)^2} \\to 2\\pi t\\,\\delta(x)$', '$\\dfrac{\\sin^2(xt/2)}{(x/2)^2} \\to \\delta(x)/t$'], answer: 2,
      sol: 'The function has height $t^2$ at $x = 0$, width $\\sim2\\pi/t$, and area $\\int\\dfrac{\\sin^2(xt/2)}{(x/2)^2}dx = 2\\pi t$. As $t \\to \\infty$ it acts like $2\\pi t\\,\\delta(x)$, giving a probability linear in $t$ and the rate $\\tfrac{2\\pi}{\\hbar}|V|^2\\rho$ (after $x = \\omega$ and $dE = \\hbar\\,d\\omega$).' },
    { id: 'qtd-034', type: 'nat', level: 4, exams: ['gate', 'net'], sub: 'pulses',
      q: 'An oscillator in its ground state is pushed by $F(t) = F_0e^{-t^2/\\tau^2}$ (perturbation $-F(t)x$), with $F_0^2\\tau^2/2m\\hbar\\omega = 0.05$ and $\\omega\\tau = 1$. The first-order probability of ending in $|1\\rangle$ is ______ (to four decimal places).',
      answer: 0.0953, tol: 0.0005, calc: () => Math.PI * 0.05 * Math.exp(-0.5),
      sol: '$\\langle1|x|0\\rangle = \\sqrt{\\hbar/2m\\omega}$, so $P = \\dfrac{1}{\\hbar^2}\\cdot\\dfrac{\\hbar}{2m\\omega}\\left|\\int F(t)e^{i\\omega t}dt\\right|^2 = \\dfrac{\\pi F_0^2\\tau^2}{2m\\hbar\\omega}e^{-\\omega^2\\tau^2/2} = \\pi(0.05)e^{-0.5} = 0.0953$. (Exactly, the final state is coherent with $|\\alpha|^2$ equal to this number.)' },
    { id: 'qtd-035', type: 'mcq', level: 4, exams: ['gate', 'net'], sub: 'adiabatic theorem',
      q: 'A Hamiltonian changes over a time $T$, and the relevant level spacing is $\\Delta E$. The sudden approximation is good when',
      options: ['$T \\gg \\hbar/\\Delta E$', '$T = \\hbar/\\Delta E$', '$T\\Delta E \\gg h$ and the change is small', '$T \\ll \\hbar/\\Delta E$'], answer: 3,
      sol: 'The internal motion has periods $\\sim h/\\Delta E$. If the change is over before the state can evolve ($T \\ll \\hbar/\\Delta E$), the wavefunction is frozen (sudden). If $T \\gg \\hbar/\\Delta E$, it follows the eigenstates (adiabatic).' },
    { id: 'qtd-036', type: 'mcq', level: 4, exams: ['gate', 'net'], sub: 'sudden approximation',
      q: 'A particle in the ground state of an infinite well $0 < x < a$ suddenly finds the right wall at $x = 2a$. The probability of finding it in the second level ($n = 2$) of the new well is',
      options: ['$1/2$', '$0$', '$0.36$', '$1/4$'], answer: 0,
      sol: 'The new $n = 2$ state is $\\sqrt{1/a}\\sin(\\pi x/a)$ on $0 < x < 2a$: inside the old well it has the same shape as the old ground state. Overlap $= \\sqrt{\\tfrac2a}\\sqrt{\\tfrac1a}\\int_0^a\\sin^2\\tfrac{\\pi x}{a}dx = \\tfrac{\\sqrt2}{a}\\cdot\\tfrac a2 = \\tfrac{1}{\\sqrt2}$, probability $\\tfrac12$. (The new ground state gets $32/9\\pi^2 = 0.36$.)' },
    { id: 'qtd-042', type: 'nat', level: 4, exams: ['gate', 'net'], sub: 'magnetic resonance',
      q: 'Electron spin resonance: a resonant rotating field of amplitude $B_1 = 0.10$ mT acts on a free electron ($g = 2$, $\\mu_B = 9.274\\times10^{-24}$ J/T, $\\hbar = 1.0546\\times10^{-34}$ J s), with Rabi frequency $\\Omega = g\\mu_BB_1/\\hbar$. The $\\pi$-pulse length is ______ ns (to the nearest whole number).',
      answer: 179, tol: 1, calc: () => Math.PI / (2 * 9.274e-24 * 1e-4 / 1.0546e-34) * 1e9,
      sol: '$\\Omega = 2\\times9.274\\times10^{-24}\\times10^{-4}/1.0546\\times10^{-34} = 1.759\\times10^7$ rad/s. $t_\\pi = \\pi/\\Omega = 1.79\\times10^{-7}$ s $= 179$ ns, about 660 times shorter than for protons in the same $B_1$.' },

    // ---------- level 5 ----------
    { id: 'qtd-037', type: 'nat', level: 5, exams: ['net', 'gate'], sub: 'sudden approximation',
      q: 'After the sudden doubling of an infinite well (from width $a$ to $2a$, particle initially in the old ground state), the expectation value of the energy in units of the new ground-state energy $\\pi^2\\hbar^2/2m(2a)^2$ is ______.',
      answer: 4, tol: 0, calc: () => 4,
      sol: 'Immediately after, $\\psi$ is unchanged and $V = 0$ wherever $\\psi \\ne 0$, so $\\langle H_{\\text{new}}\\rangle = \\langle T\\rangle = \\pi^2\\hbar^2/2ma^2$, which is $4$ times the new ground energy. It stays 4 forever (energy is conserved after the change), even though the probabilities are spread over many levels: $\\tfrac12$ in $n = 2$, $0.36$ in $n = 1$, and the rest in odd $n \\ge 3$.' },
    { id: 'qtd-038', type: 'nat', level: 5, exams: ['net', 'gate'], sub: 'landau-zener',
      q: 'Two diabatic levels are swept through a crossing with $d(E_1 - E_2)/dt = 1.0\\ \\mu$eV/ns and coupling $V = 0.10\\ \\mu$eV. The Landau-Zener probability of staying on the diabatic level (jumping the gap), $P = \\exp\\left(-\\dfrac{2\\pi V^2}{\\hbar|d(E_1 - E_2)/dt|}\\right)$, is ______ (to three decimal places). Use $\\hbar = 6.582\\times10^{-16}$ eV s.',
      answer: 0.909, tol: 0.003, calc: () => Math.exp(-2 * Math.PI * 1e-14 / (HBAR_EVS * 1e3)),
      sol: '$\\hbar\\alpha = 6.582\\times10^{-16}\\ \\text{eV s}\\times10^{3}\\ \\text{eV/s} = 6.582\\times10^{-13}$ eV$^2$. $2\\pi V^2 = 6.283\\times10^{-14}$ eV$^2$. Exponent $0.0955$, so $P = e^{-0.0955} = 0.909$: the sweep is fast compared with the gap $2V$, so the system mostly jumps across (nearly sudden). A slower sweep or bigger $V$ makes it follow the adiabatic level.' },
    { id: 'qtd-039', type: 'msq', level: 5, exams: ['net', 'gate'], sub: 'golden rule',
      q: 'Which statements about Fermi\'s golden rule are correct?',
      options: ['The rate is proportional to $|V_{fi}|^2$.', 'It needs a continuum (or a band of final states broader than $\\hbar/t$).', 'It holds for times long compared with $\\hbar$ over the continuum width but short compared with the decay time, and then gives exponential decay when extended.', 'It predicts Rabi oscillations between two discrete levels.'], answer: [0, 1, 2],
      sol: 'The rate $\\tfrac{2\\pi}{\\hbar}|V_{fi}|^2\\rho$ comes from integrating the $\\sin^2$ function over many final states. For two discrete levels there is no continuum, and the exact answer is Rabi oscillation, which no constant rate describes. Extending a constant rate self-consistently (Wigner-Weisskopf) gives $e^{-\\Gamma t}$.' },
    { id: 'qtd-040', type: 'nat', level: 5, exams: ['net', 'gate'], sub: 'sudden approximation',
      q: 'The centre of an oscillator potential jumps suddenly by $d$, with $m\\omega d^2/\\hbar = 2$, while the particle is in the ground state. The probability that it is found in the first excited state of the shifted oscillator is ______ (to three decimal places).',
      answer: 0.368, tol: 0.002, calc: () => Math.exp(-1),
      sol: 'Seen from the new centre the old ground state is displaced by $d$: a coherent state with $|\\alpha|^2 = m\\omega d^2/2\\hbar = 1$. Its number distribution is Poisson: $P(n) = e^{-|\\alpha|^2}|\\alpha|^{2n}/n!$, so $P(1) = e^{-1} = 0.368$ (and $P(0)$ is also $0.368$). The mean energy rises by $\\tfrac12m\\omega^2d^2 = \\hbar\\omega$.' },
  ],
  gens: [
    { id: 'qtd-g01', type: 'nat', level: 2, exams: ['gate', 'net'], sub: 'rabi',
      make(r) {
        const f = choose(r, [0.5, 1, 2, 2.5, 4]), t = choose(r, [0.05, 0.1, 0.125, 0.2, 0.3]);
        const v = Math.sin(Math.PI * f * t) ** 2;
        return { q: `A two-level atom is driven on resonance with Rabi frequency $\\Omega = 2\\pi\\times${f}$ MHz, starting in the lower state. Its upper-state probability after $${t}\\ \\mu$s is ______ (to three decimal places).`,
          answer: round(v, 3), tol: 0.002, f, t,
          sol: `$P = \\sin^2(\\Omega t/2) = \\sin^2(\\pi\\times${f}\\times${t}) = \\sin^2(${round(Math.PI * f * t, 4)}) = ${round(v, 3)}$.` };
      },
      verify: (p) => (1 - Math.cos(2 * Math.PI * p.f * p.t)) / 2 },
    { id: 'qtd-g02', type: 'nat', level: 2, exams: ['gate', 'net'], sub: 'rabi',
      make(r) {
        const O = int(r, 1, 5), D = int(r, 0, 6);
        const v = O * O / (O * O + D * D);
        return { q: `A two-level atom is driven with Rabi frequency $\\Omega = 2\\pi\\times${O}$ MHz and detuning $\\Delta = 2\\pi\\times${D}$ MHz. The largest upper-state probability it reaches is ______ (to three decimal places).`,
          answer: round(v, 3), tol: 0.002, O, D,
          sol: `$P_{\\max} = \\Omega^2/(\\Omega^2 + \\Delta^2) = ${O * O}/(${O * O} + ${D * D}) = ${round(v, 3)}$, reached when $\\sqrt{\\Omega^2 + \\Delta^2}\\,t = \\pi$.` };
      },
      verify: (p) => 1 / (1 + (p.D / p.O) ** 2) },
    { id: 'qtd-g03', type: 'nat', level: 2, exams: ['gate', 'net'], sub: 'rabi',
      make(r) {
        const f = choose(r, [0.1, 0.25, 0.5, 2, 5, 10]), kind = choose(r, ['\\pi', '\\pi/2', '2\\pi']);
        const ang = { '\\pi': Math.PI, '\\pi/2': Math.PI / 2, '2\\pi': 2 * Math.PI }[kind];
        const v = ang / (2 * Math.PI * f) * 1000; // ns, f in MHz
        return { q: `With a resonant Rabi frequency $\\Omega = 2\\pi\\times${f}$ MHz, the length of a $${kind}$ pulse is ______ ns (to one decimal place).`,
          answer: round(v, 1), tol: Math.max(0.1, v * 0.002), f, ang,
          sol: `The pulse area is $\\Omega t = ${kind}$, so $t = ${kind}/\\Omega = ${round(ang / Math.PI, 2)}/(2\\times${f}\\ \\text{MHz}) = ${round(v, 1)}$ ns.${kind === '2\\pi' ? ' A $2\\pi$ pulse returns the population but flips the sign of the amplitude.' : ''}` };
      },
      verify: (p) => p.ang / (2 * Math.PI * p.f) * 1000 },
    { id: 'qtd-g04', type: 'nat', level: 3, exams: ['gate', 'net'], sub: 'step perturbation',
      make(r) {
        const V = choose(r, [0.02, 0.05, 0.1, 0.2]), w = choose(r, [1, 2, 4, 5]), frac = choose(r, [0.25, 0.5, 1, 1.5]);
        const v = 4 * V * V / (w * w) * Math.sin(Math.PI * frac / 2) ** 2;
        return { q: `A constant perturbation with $|V_{fi}| = ${V}$ meV is switched on at $t = 0$ between levels $${w}$ meV apart. The first-order probability of $|f\\rangle$ at $t = ${frac}\\times(2\\pi\\hbar/\\Delta E)$ is ______ (to five decimal places).`,
          answer: round(v, 5), tol: Math.max(0.00002, v * 0.003), V, w, frac,
          sol: `$|c_f|^2 = \\dfrac{4|V|^2}{(\\hbar\\omega)^2}\\sin^2\\dfrac{\\omega t}{2}$ with $\\omega t = 2\\pi\\times${frac}$: $\\dfrac{4\\times${V}^2}{${w}^2}\\sin^2(${round(Math.PI * frac, 4)}) = ${round(v, 5)}$.${frac === 1 ? ' After a whole period the amplitude has returned to zero.' : ''}` };
      },
      verify: (p) => (2 * p.V * p.V / (p.w * p.w)) * (1 - Math.cos(Math.PI * p.frac)) },
    { id: 'qtd-g05', type: 'nat', level: 2, exams: ['gate', 'net'], sub: 'spontaneous emission',
      make(r) {
        const tau = choose(r, [1.6, 5.4, 16, 26, 100, 0.5]), ask = choose(r, ['freq', 'energy']);
        const v = ask === 'freq' ? 1 / (2 * Math.PI * tau * 1e-9) / 1e6 : HBAR_EVS / (tau * 1e-9) * 1e9;
        return { q: `An excited level has lifetime $${tau}$ ns. Its natural linewidth ${ask === 'freq' ? '$\\Delta\\nu = 1/2\\pi\\tau$ is ______ MHz' : '$\\Gamma = \\hbar/\\tau$ is ______ neV'} (to two decimal places). ${ask === 'energy' ? 'Use $\\hbar = 6.582\\times10^{-16}$ eV s.' : ''}`,
          answer: round(v, 2), tol: Math.max(0.01, v * 0.003), tau, ask,
          sol: ask === 'freq' ? `$\\Delta\\nu = 1/(2\\pi\\times${tau}\\times10^{-9}\\ \\text{s}) = ${round(v, 2)}$ MHz.` : `$\\Gamma = 6.582\\times10^{-16}/(${tau}\\times10^{-9})$ eV $= ${round(v, 2)}$ neV.` };
      },
      verify: (p) => (p.ask === 'freq' ? 1e3 / (2 * Math.PI * p.tau) : HBAR_EVS * 1e18 / p.tau) },
    { id: 'qtd-g06', type: 'nat', level: 3, exams: ['gate', 'net'], sub: 'golden rule',
      make(r) {
        const V = choose(r, [0.1, 0.5, 1, 2, 5]), rho = choose(r, [1e3, 1e4, 1e5, 1e6]);
        const G = 2 * Math.PI * (V * 1e-6) ** 2 * rho / HBAR_EVS, tau = 1e9 / G;
        const rs = `10^{${Math.round(Math.log10(rho))}}`;
        return { q: `A level couples with $|V| = ${V}\\ \\mu$eV to a continuum with $\\rho = ${rs}$ states per eV. Its golden-rule lifetime is ______ ns (to three significant figures). Use $\\hbar = 6.582\\times10^{-16}$ eV s.`,
          answer: +tau.toPrecision(3), tol: tau * 0.004, V, rho,
          sol: `$\\Gamma = \\tfrac{2\\pi}{\\hbar}|V|^2\\rho = \\dfrac{2\\pi\\times(${V}\\times10^{-6})^2\\times${rs}}{6.582\\times10^{-16}}$ s$^{-1}$ $= ${G.toExponential(3).replace('e+', '\\times10^{').replace(/$/, '}')}$ s$^{-1}$, so $\\tau = 1/\\Gamma = ${+tau.toPrecision(3)}$ ns.` };
      },
      verify: (p) => 1e9 * HBAR_EVS / (2 * Math.PI * (p.V * 1e-6) ** 2 * p.rho) },
    { id: 'qtd-g07', type: 'nat', level: 3, exams: ['gate', 'net'], sub: 'sudden approximation',
      make(r) {
        const k = choose(r, [1.5, 2, 3, 4, 5]);
        const v = wellOverlap(k);
        return { q: `A particle in the ground state of an infinite well $0 < x < a$ suddenly finds the right wall at $x = ${k}a$. The probability that it is in the ground state of the new well is ______ (to three decimal places).`,
          answer: round(v, 3), tol: 0.002, k,
          sol: `$P = \\left|\\sqrt{\\tfrac2a}\\sqrt{\\tfrac{2}{${k}a}}\\int_0^a\\sin\\tfrac{\\pi x}{a}\\sin\\tfrac{\\pi x}{${k}a}dx\\right|^2$. Using $\\sin A\\sin B = \\tfrac12[\\cos(A - B) - \\cos(A + B)]$ and integrating gives $${round(v, 3)}$.${k === 2 ? ' (The new $n = 2$ state takes another $\\tfrac12$.)' : ''}` };
      },
      verify: (p) => { const k = p.k, a1 = Math.PI * (1 - 1 / k), a2 = Math.PI * (1 + 1 / k); const I = 0.5 * (Math.sin(a1) / a1 - Math.sin(a2) / a2); return (4 / k) * I * I; } },
    { id: 'qtd-g08', type: 'nat', level: 3, exams: ['gate', 'net'], sub: 'sudden approximation',
      make(r) {
        const ratio = choose(r, [0.25, 0.5, 2, 3, 4, 9, 16]);
        const v = 2 * Math.sqrt(ratio) / (1 + ratio);
        return { q: `An oscillator in its ground state has its frequency changed suddenly from $\\omega$ to ${ratio}$\\omega$. The probability of finding it in the new ground state is ______ (to three decimal places).`,
          answer: round(v, 3), tol: 0.002, ratio,
          sol: `$|\\langle0\'|0\\rangle|^2 = \\dfrac{2\\sqrt{\\omega_1\\omega_2}}{\\omega_1 + \\omega_2} = \\dfrac{2\\sqrt{${ratio}}}{1 + ${ratio}} = ${round(v, 3)}$. The answer is the same for $\\omega \\to k\\omega$ and $\\omega \\to \\omega/k$.` };
      },
      verify: (p) => 2 * Math.sqrt(p.ratio) / (1 + p.ratio) },
    { id: 'qtd-g09', type: 'nat', level: 3, exams: ['gate', 'net'], sub: 'sudden approximation',
      make(r) {
        const a2 = choose(r, [0.25, 0.5, 1, 1.5, 2, 3]), n = int(r, 0, 3), how = choose(r, ['kick', 'shift']);
        const fact = [1, 1, 2, 6][n], v = Math.exp(-a2) * a2 ** n / fact;
        const what = how === 'kick' ? `receives a sudden momentum kick with $p_0^2/2m\\hbar\\omega = ${a2}$` : `has its potential centre moved suddenly by $d$ with $m\\omega d^2/2\\hbar = ${a2}$`;
        return { q: `An oscillator in its ground state ${what}. The probability of finding it in level $n = ${n}$ ${how === 'shift' ? 'of the new oscillator ' : ''}is ______ (to three decimal places).`,
          answer: round(v, 3), tol: 0.002, a2, n,
          sol: `The new state is a coherent state with $|\\alpha|^2 = ${a2}$, so $P(n) = e^{-|\\alpha|^2}|\\alpha|^{2n}/n! = e^{-${a2}}(${a2})^{${n}}/${fact} = ${round(v, 3)}$ (a Poisson distribution with mean ${a2}).` };
      },
      verify: (p) => Math.exp(-p.a2) * p.a2 ** p.n / [1, 1, 2, 6][p.n] },
    { id: 'qtd-g10', type: 'nat', level: 4, exams: ['gate', 'net'], sub: 'pulses',
      make(r) {
        const s = choose(r, [0.02, 0.05, 0.1]), wt = choose(r, [0, 0.5, 1, 1.5, 2, 3]);
        const v = Math.PI * s * s * Math.exp(-wt * wt / 2);
        return { q: `A Gaussian pulse $V_0e^{-t^2/\\tau^2}$ with $|V_0|\\tau/\\hbar = ${s}$ acts on a two-level system with $\\omega_{fi}\\tau = ${wt}$. The first-order transition probability is ______ (to five decimal places).`,
          answer: round(v, 5), tol: Math.max(0.00001, v * 0.003), s, wt,
          sol: `$P = \\pi(|V_0|\\tau/\\hbar)^2e^{-\\omega^2\\tau^2/2} = \\pi\\times${s}^2\\times e^{-${wt * wt / 2}} = ${round(v, 5)}$.${wt >= 2 ? ' The long, smooth pulse is nearly adiabatic.' : ''}` };
      },
      verify: (p) => Math.PI * p.s ** 2 * Math.exp(-(p.wt ** 2) / 2) },
    { id: 'qtd-g11', type: 'mcq', level: 3, exams: ['gate', 'net'], sub: 'selection rules',
      make(r) {
        const pol = choose(r, ['z', 'x', 'σ+']);
        const st = [];
        for (let n = 1; n <= 3; n++) for (let l = 0; l < n; l++) for (let m = -l; m <= l; m++) st.push([n, l, m]);
        const lab = ([n, l, m]) => `|${n},${l},${m}\\rangle`;
        const ok = (a, b) => Math.abs(a[1] - b[1]) === 1 && (pol === 'z' ? a[2] === b[2] : pol === 'x' ? Math.abs(a[2] - b[2]) === 1 : b[2] - a[2] === 1);
        const good = [], bad = [];
        for (const a of st) for (const b of st) if (b[0] > a[0]) (ok(a, b) ? good : bad).push(`$${lab(a)} \\to ${lab(b)}$`);
        const c = choose(r, good), w = shuffle(r, bad).slice(0, 3);
        const o = mcqOptions(r, c, w);
        const pname = { z: 'linearly polarised along $z$ (perturbation $\\propto z$)', x: 'linearly polarised along $x$ (perturbation $\\propto x$)', 'σ+': 'circularly polarised, perturbation $\\propto x + iy$' }[pol];
        return { q: `Hydrogen absorbs light ${pname}. Which ONE of these transitions $|n, l, m\\rangle \\to |n\', l\', m\'\\rangle$ is allowed at first order?`, ...o,
          sol: `The operator is a dipole, so $\\Delta l = \\pm1$, and ${pol === 'z' ? '$z \\propto Y_{10}$ needs $\\Delta m = 0$' : pol === 'x' ? '$x \\propto Y_{1,-1} - Y_{11}$ needs $\\Delta m = \\pm1$' : '$x + iy \\propto Y_{11}$ needs $\\Delta m = +1$'}. Only ${c} satisfies both.` };
      } },
    { id: 'qtd-g12', type: 'nat', level: 4, exams: ['net', 'gate'], sub: 'landau-zener',
      make(r) {
        const V = choose(r, [0.05, 0.1, 0.2, 0.3, 0.5]), a = choose(r, [0.5, 1, 2, 5, 10]); // µeV, µeV/ns
        const ex = 2 * Math.PI * (V * 1e-6) ** 2 / (HBAR_EVS * a * 1e3), v = Math.exp(-ex), ad = r() < 0.5;
        return { q: `A two-level system is swept through an avoided crossing with $|d(E_1 - E_2)/dt| = ${a}\\ \\mu$eV/ns and coupling $V = ${V}\\ \\mu$eV. The Landau-Zener probability of ${ad ? 'following the adiabatic level (ending in the other diabatic state)' : 'jumping the gap (staying on the diabatic level)'} is ______ (to three decimal places). Use $\\hbar = 6.582\\times10^{-16}$ eV s.`,
          answer: round(ad ? 1 - v : v, 3), tol: 0.002, V, a, ad,
          sol: `$P_{\\text{jump}} = \\exp\\left(-\\dfrac{2\\pi V^2}{\\hbar\\alpha}\\right)$ with $\\hbar\\alpha = 6.582\\times10^{-16}\\times${a}\\times10^3 = ${(HBAR_EVS * a * 1e3).toExponential(3).replace('e-', '\\times10^{-') + '}'}$ eV$^2$: exponent $${round(ex, 4)}$, $P_{\\text{jump}} = ${round(v, 3)}$${ad ? `, so the adiabatic probability is $${round(1 - v, 3)}$` : ''}.` };
      },
      verify: (p) => { const v = Math.exp(-2 * Math.PI * (p.V * 1e-6) ** 2 / (HBAR_EVS * p.a * 1e3)); return p.ad ? 1 - v : v; } },
  ],
};
