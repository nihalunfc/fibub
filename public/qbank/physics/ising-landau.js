// The Ising model and Landau theory, NET depth: small clusters solved exactly, open and closed chains, spin
// correlations, frustration, the Peierls argument and lower critical dimension, mean-field and Bethe estimates of
// T_c on different lattices, the exact 2D results (Onsager-Yang magnetisation, exponents, duality), lattice-gas
// mapping, Metropolis Monte Carlo, Landau theory with a field, cubic terms, spinodals and amplitude ratios, and
// Ginzburg-Landau gradients (correlation length, Ornstein-Zernike, upper critical dimension).
// (Basic mean-field Ising, Landau m^2-m^4, exponents and scaling relations are in phase-transitions.)
// Original questions (fibub) for CSIR NET Part C and GATE. Levels: 1 warm-up ... 5 top rank.
import { pick, int, choose, mcqOptions, round } from '../_util.js';

const onsagerM = (t) => { const K = 1 / t; const s = Math.sinh(2 * K); return s <= 1 ? 0 : Math.pow(1 - Math.pow(s, -4), 1 / 8); }; // t = kT/J
const TC2D = 2 / Math.log(1 + Math.SQRT2);

export default {
  topic: 'ising-landau',
  items: [
    // ---------- level 1 ----------
    { id: 'netis-001', type: 'nat', level: 1, exams: ['gate', 'net'], sub: 'ground states',
      q: 'A ferromagnetic Ising model $H = -J\\sum_{\\langle ij\\rangle}s_is_j$ ($J > 0$) lives on a square lattice of $N$ sites with periodic boundaries. Its ground-state energy per spin is ______ $J$.',
      answer: -2, tol: 0, calc: () => -4 / 2,
      sol: 'Each site has $z = 4$ neighbours, so there are $zN/2 = 2N$ bonds. All spins aligned make every bond contribute $-J$: $E_0 = -2NJ$, i.e. $-2J$ per spin. The ground state is twofold degenerate (all up or all down).',
      trap: 'Counting $z = 4$ bonds per spin double counts each bond.' },
    { id: 'netis-002', type: 'mcq', level: 1, exams: ['gate', 'net'], sub: 'Ising basics',
      q: 'In zero field, which Ising systems with short-range ferromagnetic coupling show a spontaneous magnetisation at some $T > 0$?',
      options: ['Only the one-dimensional chain', 'The square lattice (2D) and the cubic lattice (3D), but not the 1D chain', 'All of them, in every dimension', 'None: spontaneous magnetisation needs a field'], answer: 1,
      sol: 'In 1D a single domain wall costs only $2J$ but gains entropy $k\\ln N$, so order is destroyed at any $T > 0$. In 2D a wall around a domain costs energy proportional to its length, which beats the entropy at low $T$ (Peierls): there is a transition, at $kT_c = 2.269J$ on the square lattice (Onsager). The lower critical dimension of the Ising model is 1.' },
    { id: 'netis-003', type: 'nat', level: 1, exams: ['gate', 'net'], sub: 'mean field',
      q: 'Mean-field theory predicts $kT_c = zJ$ for the Ising model. For a face-centred cubic lattice, $kT_c/J$ is ______.',
      answer: 12, tol: 0, calc: () => 12,
      sol: 'Each spin feels the average field $zJ\\langle s\\rangle$ of its $z$ neighbours; $m = \\tanh(zJm/kT)$ has a nonzero solution for $kT < zJ$. The fcc lattice has $z = 12$, so $kT_c = 12J$ in mean field (the true value is about $9.8J$).' },
    { id: 'netis-004', type: 'mcq', level: 1, exams: ['gate', 'net'], sub: 'Landau theory',
      q: 'Landau\'s free energy for an Ising-like transition, $F = F_0 + a(T - T_c)m^2 + bm^4 - hm$, contains no $m^3$ term because',
      options: ['the free energy must be symmetric under $m\\to-m$ when $h = 0$', 'cubic terms are always small', 'it would make $F$ unbounded', 'Landau theory only works in 4 dimensions'], answer: 0,
      sol: 'The Ising Hamiltonian is invariant under flipping all spins when $h = 0$, so $F(m) = F(-m)$ and only even powers appear. Where symmetry allows a cubic term (e.g. the nematic-isotropic or three-state Potts transition), the transition becomes first order.' },
    { id: 'netis-005', type: 'mcq', level: 1, exams: ['gate', 'net'], sub: 'lattice gas',
      q: 'With $n_i = (1 + s_i)/2$ ($n_i = 0$ or 1), the Ising model maps onto a lattice gas. The ferromagnetic coupling and the magnetic field correspond to',
      options: ['repulsion between atoms; temperature', 'attraction between neighbouring atoms; chemical potential', 'hard-core exclusion only; pressure', 'attraction; volume'], answer: 1,
      sol: 'Substituting $s = 2n - 1$ into $-J\\sum s_is_j - h\\sum s_i$ gives $-4J\\sum n_in_j - (2h - 2zJ)\\sum n_i + $ const. A ferromagnet ($J > 0$) is a gas with nearest-neighbour attraction $4J$, and the field plays the role of the chemical potential. The Ising critical point is a liquid-gas critical point, which is why they share exponents.' },
    { id: 'netis-006', type: 'nat', level: 1, exams: ['gate', 'net'], sub: 'Ising basics',
      q: 'How many microstates does an Ising model of $3\\times3$ spins have?',
      answer: 512, tol: 0, calc: () => 2 ** 9,
      sol: 'Each of the 9 spins is $\\pm1$ independently: $2^9 = 512$ configurations. For $10\\times10$ there are $2^{100}\\approx10^{30}$, which is why Monte Carlo sampling is needed instead of summing every state.' },

    // ---------- level 2 ----------
    { id: 'netis-007', type: 'nat', level: 2, exams: ['gate', 'net'], sub: 'small clusters',
      q: 'Two Ising spins interact through $H = -Js_1s_2$. At $kT = J$, the probability that they are parallel is ______ (to three decimal places).',
      answer: 0.881, tol: 0.001, calc: () => Math.exp(1) / (Math.exp(1) + Math.exp(-1)),
      sol: 'Four states: two parallel (energy $-J$) and two antiparallel ($+J$). $Z = 2e^{K} + 2e^{-K}$ with $K = J/kT = 1$. $P_{\\parallel} = \\dfrac{2e}{2e + 2e^{-1}} = \\dfrac{1}{1 + e^{-2}} = 0.881$. Equivalently $\\langle s_1s_2\\rangle = \\tanh K = 0.762 = 2P_\\parallel - 1$.' },
    { id: 'netis-008', type: 'nat', level: 2, exams: ['gate', 'net'], sub: 'correlations',
      q: 'In the zero-field Ising chain, $\\langle s_is_{i+r}\\rangle = (\\tanh K)^r$ with $K = J/kT$. At $K = 0.50$, $\\langle s_0s_3\\rangle$ is ______ (to three decimal places).',
      answer: 0.099, tol: 0.001, calc: () => Math.tanh(0.5) ** 3,
      sol: 'With bond variables $\\tau_i = s_is_{i+1}$ (independent in zero field, each with mean $\\tanh K$), $s_0s_3 = \\tau_0\\tau_1\\tau_2$, so the correlation is $\\tanh^3K = 0.4621^3 = 0.0987$. It decays exponentially at any $T > 0$: no long-range order.' },
    { id: 'netis-009', type: 'mcq', level: 2, exams: ['gate', 'net'], sub: 'frustration',
      q: 'Three Ising spins on a triangle have antiferromagnetic coupling $H = J(s_1s_2 + s_2s_3 + s_3s_1)$, $J > 0$. The ground-state energy and its degeneracy are',
      options: ['$-3J$, 2 states', '$-J$, 2 states', '$-3J$, 6 states', '$-J$, 6 states'], answer: 3,
      sol: 'Not all three bonds can be antiparallel (frustration). The best is two antiparallel and one parallel: $E = -J - J + J = -J$. Only all-equal states (2 of 8) have $E = +3J$, so the other 6 states all have $E = -J$. Frustration leaves a large ground-state degeneracy; on the triangular lattice it gives residual entropy $0.323k$ per spin.' },
    { id: 'netis-010', type: 'nat', level: 2, exams: ['gate', 'net'], sub: 'Monte Carlo',
      q: 'In a Metropolis simulation of the square-lattice Ising model at $kT = 2.0J$, a proposed flip raises the energy by $8J$. The probability that it is accepted is ______ (to four decimal places).',
      answer: 0.0183, tol: 0.0002, calc: () => Math.exp(-4),
      sol: 'Metropolis accepts with probability $\\min(1, e^{-\\Delta E/kT})$. Here $e^{-8J/2J} = e^{-4} = 0.0183$. Flipping a spin $s_i$ changes the energy by $\\Delta E = 2Js_i\\sum_js_j\\in\\{-8J, -4J, 0, 4J, 8J\\}$; $8J$ is a spin aligned with all four neighbours.' },
    { id: 'netis-011', type: 'mcq', level: 2, exams: ['gate', 'net'], sub: 'Monte Carlo',
      q: 'Why does the Metropolis rule $P_{acc} = \\min(1, e^{-\\Delta E/kT})$ sample the Boltzmann distribution?',
      options: ['It satisfies detailed balance with respect to $e^{-E/kT}$, and the moves are ergodic', 'It always lowers the energy', 'It visits every state equally often', 'It is exact only at $T = 0$'], answer: 0,
      sol: 'For two states with $E_2 > E_1$: $P(1\\to2)/P(2\\to1) = e^{-(E_2 - E_1)/kT}/1$, which equals $p_2/p_1$ for Boltzmann weights. Detailed balance makes the Boltzmann distribution stationary, and ergodicity (any state reachable) makes it the unique limit.' },
    { id: 'netis-012', type: 'nat', level: 2, exams: ['gate', 'net'], sub: 'Bethe approximation',
      q: 'The Bethe (cluster) approximation gives $K_c = \\tfrac12\\ln\\dfrac{z}{z - 2}$. For the square lattice ($z = 4$), the predicted $kT_c/J$ is ______ (to three decimal places).',
      answer: 2.885, tol: 0.002, calc: () => 2 / Math.log(2),
      sol: '$K_c = \\tfrac12\\ln2 = 0.3466$, so $kT_c/J = 1/K_c = 2.885$. Compared with mean field (4) and the exact Onsager value (2.269), Bethe is better because it treats one spin and its neighbours exactly. It still gives mean-field exponents.' },
    { id: 'netis-013', type: 'msq', level: 2, exams: ['gate', 'net'], sub: 'mean field',
      q: 'Which statements about mean-field theory of the Ising model are correct?',
      options: ['It always overestimates $T_c$, because it neglects fluctuations', 'It wrongly predicts a transition for the 1D chain (at $kT_c = 2J$)', 'It becomes exact for long-range interactions or above four dimensions', 'It gives the exact 2D exponent $\\beta = 1/8$'], answer: [0, 1, 2],
      sol: 'Fluctuations disorder the system, so ignoring them raises $T_c$; mean field even predicts order in 1D. For infinite-range coupling or $d > 4$ (the upper critical dimension) mean-field exponents are exact. Mean field gives $\\beta = 1/2$; $1/8$ is Onsager-Yang.' },
    { id: 'netis-014', type: 'nat', level: 2, exams: ['gate', 'net'], sub: 'Peierls argument',
      q: 'In a 1D Ising chain of $N$ spins, one domain wall costs $2J$ and can sit in about $N$ places. With $J/kT = 5$, the free energy of creating a wall becomes negative for $N$ larger than about ______ (to the nearest whole number).',
      answer: 22026, tol: 2, calc: () => Math.exp(10),
      sol: '$\\Delta F = 2J - kT\\ln N < 0$ when $N > e^{2J/kT} = e^{10} = 22026$. A long enough chain always breaks into domains: no order at $T > 0$. In 2D a domain wall of length $L$ costs $2JL$ while its entropy also grows only $\\propto L$, so order survives at low $T$.' },
    { id: 'netis-015', type: 'mcq', level: 2, exams: ['gate', 'net'], sub: 'exact 2D results',
      q: 'The critical exponents of the 2D Ising model are',
      options: ['$\\beta = 1/2$, $\\gamma = 1$, $\\nu = 1/2$, $\\alpha = 0$ (jump)', '$\\beta = 0.326$, $\\gamma = 1.237$, $\\nu = 0.630$', '$\\beta = 1/8$, $\\gamma = 7/4$, $\\nu = 1$, $\\alpha = 0$ (logarithmic)', '$\\beta = 1/4$, $\\gamma = 1$, $\\nu = 1/2$'], answer: 2,
      sol: 'Onsager (1944) and Yang (1952): $C\\sim\\ln|t|$, $m\\sim(-t)^{1/8}$, $\\chi\\sim|t|^{-7/4}$, $\\xi\\sim|t|^{-1}$, $\\eta = 1/4$, $\\delta = 15$. The first option is mean field, the second 3D Ising, the last the tricritical mean-field values.' },
    { id: 'netis-016', type: 'nat', level: 2, exams: ['gate', 'net'], sub: 'Landau theory',
      q: 'In Landau theory $F = a(T - T_c)m^2 + bm^4 - hm$. The ratio of the susceptibility above $T_c$ to that below $T_c$, at equal $|T - T_c|$, is ______.',
      answer: 2, tol: 0, calc: () => 2,
      sol: 'Above: $m_0 = 0$ and $2a(T - T_c)m = h$, so $\\chi_+ = \\dfrac{1}{2a(T - T_c)}$. Below: $m_0^2 = \\dfrac{a(T_c - T)}{2b}$ and $F\'\' = -2a(T_c - T) + 12bm_0^2 = 4a(T_c - T)$, so $\\chi_- = \\dfrac{1}{4a(T_c - T)}$. Ratio $\\chi_+/\\chi_- = 2$, a universal mean-field amplitude ratio (about 4.4 in 3D Ising, 37.7 in 2D).' },

    // ---------- level 3 ----------
    { id: 'netis-017', type: 'nat', level: 3, exams: ['net'], sub: 'small clusters',
      q: 'Four Ising spins form a ring with $H = -J(s_1s_2 + s_2s_3 + s_3s_4 + s_4s_1)$. Its partition function is $Z = (2\\cosh K)^4 + (2\\sinh K)^4$. At $K = J/kT = 1$, the probability of finding all four spins aligned is ______ (to three decimal places).',
      answer: 0.901, tol: 0.001, calc: () => 2 * Math.exp(4) / ((2 * Math.cosh(1)) ** 4 + (2 * Math.sinh(1)) ** 4),
      sol: 'Transfer matrix: $Z = \\text{Tr}\\,T^4 = \\lambda_+^4 + \\lambda_-^4$ with $\\lambda_\\pm = 2\\cosh K, 2\\sinh K$: $Z = 3.0862^4 + 2.3504^4 = 90.72 + 30.52 = 121.2$. (Check by counting: 2 states at $E = -4J$, 12 at 0, 2 at $+4J$: $2e^4 + 12 + 2e^{-4} = 121.2$.) Aligned: $2e^4/Z = 109.2/121.2 = 0.901$.' },
    { id: 'netis-018', type: 'mcq', level: 3, exams: ['net'], sub: 'open chain',
      q: 'For an open Ising chain of $N$ spins (free ends) in zero field, the partition function is',
      options: ['$(2\\cosh K)^N$', '$2(2\\cosh K)^{N-1}$', '$(2\\cosh K)^N + (2\\sinh K)^N$', '$2^N\\cosh^NK$'], answer: 1,
      sol: 'Change variables to the first spin and the $N - 1$ independent bond variables $\\tau_i = s_is_{i+1}$: $Z = 2\\prod_{i=1}^{N-1}(e^K + e^{-K}) = 2(2\\cosh K)^{N-1}$. The ring gives $(2\\cosh K)^N + (2\\sinh K)^N$; both have the same free energy per spin as $N\\to\\infty$.' },
    { id: 'netis-019', type: 'nat', level: 3, exams: ['net'], sub: 'exact 2D results',
      q: 'The Onsager-Yang spontaneous magnetisation of the square-lattice Ising model is $m = \\left[1 - \\sinh^{-4}(2J/kT)\\right]^{1/8}$. At $kT = 2.0J$, $m$ is ______ (to three decimal places).',
      answer: 0.911, tol: 0.002, calc: () => onsagerM(2),
      sol: '$\\sinh(2J/kT) = \\sinh1 = 1.1752$, so $\\sinh^4 = 1.9074$ and $1 - 1/1.9074 = 0.4757$. Then $m = 0.4757^{1/8} = 0.911$. Even at $0.88T_c$ the magnetisation is above 0.9: with $\\beta = 1/8$ it rises almost vertically below $T_c$.' },
    { id: 'netis-020', type: 'nat', level: 3, exams: ['net'], sub: 'mean field',
      q: 'For the simple cubic Ising model, the exact (numerical) critical temperature is $kT_c = 4.512J$. What fraction is this of the mean-field prediction? Answer to three decimal places.',
      answer: 0.752, tol: 0.001, calc: () => 4.512 / 6,
      sol: 'Mean field: $kT_c = zJ = 6J$. Ratio $4.512/6 = 0.752$. For the square lattice the ratio is $2.269/4 = 0.567$, and for the chain $0/2 = 0$: fluctuations matter more in lower dimensions.' },
    { id: 'netis-021', type: 'msq', level: 3, exams: ['net'], sub: 'duality',
      q: 'Kramers-Wannier duality maps the square-lattice Ising model at coupling $K$ to one at $K^*$ with $\\sinh2K\\,\\sinh2K^* = 1$. Which statements follow?',
      options: ['High-temperature and low-temperature expansions are related', 'If there is a single transition, it must be at the self-dual point $\\sinh2K_c = 1$', 'The self-dual point gives $kT_c/J = 2/\\ln(1 + \\sqrt2)$', 'Duality fixes the exponent $\\beta = 1/8$'], answer: [0, 1, 2],
      sol: 'Duality exchanges small $K$ (high $T$) and large $K^*$ (low $T$): the high-temperature (bond) expansion of one equals the low-temperature (domain wall) expansion of the other. A unique singularity must sit at $K = K^*$: $\\sinh2K_c = 1$, $K_c = \\tfrac12\\ln(1 + \\sqrt2) = 0.4407$, $kT_c = 2.269J$. Exponents need the full solution.' },
    { id: 'netis-022', type: 'nat', level: 3, exams: ['net'], sub: 'chain in a field',
      q: 'For the Ising chain in a field, $m = \\dfrac{\\sinh(\\beta h)}{\\sqrt{\\sinh^2(\\beta h) + e^{-4K}}}$. At $K = 1$ and $\\beta h = 0.10$, $m$ is ______ (to three decimal places).',
      answer: 0.595, tol: 0.002, calc: () => Math.sinh(0.1) / Math.sqrt(Math.sinh(0.1) ** 2 + Math.exp(-4)),
      sol: '$\\sinh0.1 = 0.10017$, $\\sinh^2 = 0.010033$, $e^{-4} = 0.018316$. $m = 0.10017/\\sqrt{0.028349} = 0.10017/0.16837 = 0.595$. A weak field gives a large magnetisation because neighbours are strongly correlated (the chain is close to its $T = 0$ critical point), but $m\\to0$ as $h\\to0$.' },
    { id: 'netis-023', type: 'mcq', level: 3, exams: ['net'], sub: 'Landau theory',
      q: 'At $T = T_c$ in Landau theory, $F = bm^4 - hm$. The critical isotherm is',
      options: ['$m\\propto h$', '$m\\propto h^{1/2}$', '$m\\propto h^{1/3}$, so $\\delta = 3$', '$m\\propto h^{1/15}$'], answer: 2,
      sol: '$\\partial F/\\partial m = 4bm^3 - h = 0$, so $m = (h/4b)^{1/3}$: $\\delta = 3$. (The 2D Ising value is 15, 3D about 4.8.)' },
    { id: 'netis-024', type: 'nat', level: 3, exams: ['net'], sub: 'Landau theory',
      q: 'A system has $F = a(T - T_0)m^2 - cm^3 + bm^4$ with $a = 2$, $c = 4$, $b = 1$ and $T_0 = 50$ (consistent units). The first-order transition happens at $T_1$ = ______.',
      answer: 52, tol: 0.01, calc: () => 50 + 16 / (4 * 2 * 1),
      sol: 'At $T_1$ the ordered minimum has the same free energy as $m = 0$: $F = m^2[A - cm + bm^2]$ with $A = a(T - T_0)$ must have a double root, so $c^2 = 4Ab$. $A = c^2/4b = 16/4 = 4$, so $T_1 - T_0 = 4/a = 2$ and $T_1 = 52$. The order parameter jumps from 0 to $m^* = c/2b = 2$.',
      trap: 'The transition is above $T_0$: the cubic term lets order appear before the $m^2$ coefficient changes sign.' },
    { id: 'netis-025', type: 'mcq', level: 3, exams: ['net'], sub: 'Ginzburg-Landau',
      q: 'Adding a gradient term, $F = \\int[c(\\nabla m)^2 + a(T - T_c)m^2 + bm^4]d^dr$, the correlation length above $T_c$ is $\\xi_+ = \\sqrt{c/a(T - T_c)}$. Below $T_c$, at the same $|T - T_c|$, the correlation length is',
      options: ['$\\xi_+$', '$2\\xi_+$', 'infinite', '$\\xi_+/\\sqrt2$'], answer: 3,
      sol: 'Fluctuations $\\delta m$ around the minimum cost $c(\\nabla\\delta m)^2 + \\tfrac12F\'\'\\delta m^2$. Above: $F\'\'/2 = a(T - T_c)$. Below: $F\'\'/2 = 2a(T_c - T)$ (twice as stiff, as in the susceptibility). So $\\xi_- = \\sqrt{c/2a|T - T_c|} = \\xi_+/\\sqrt2$. Both give $\\nu = 1/2$.' },
    { id: 'netis-026', type: 'nat', level: 3, exams: ['net'], sub: 'antiferromagnets',
      q: 'An antiferromagnet obeys $\\chi = C/(T + \\theta)$ above its Néel point. Measurements give $\\chi = 2.0\\times10^{-3}$ at 300 K and $1.6\\times10^{-3}$ at 400 K. The value of $\\theta$ is ______ K.',
      answer: 100, tol: 0.5, calc: () => (400 * 1.6e-3 - 300 * 2e-3) / (2e-3 - 1.6e-3),
      sol: '$\\chi(T + \\theta) = C$ at both temperatures: $2.0\\times10^{-3}(300 + \\theta) = 1.6\\times10^{-3}(400 + \\theta)$, so $0.6 + 0.002\\theta = 0.64 + 0.0016\\theta$ and $\\theta = 0.04/0.0004 = 100$ K. In two-sublattice mean field with only intersublattice coupling, $T_N = \\theta = 100$ K.',
      trap: 'For a ferromagnet the sign is $T - \\theta$; for an antiferromagnet $T + \\theta$.' },
    { id: 'netis-027', type: 'nat', level: 3, exams: ['net'], sub: 'Monte Carlo',
      q: 'A Metropolis run of the square-lattice Ising model is at $kT = 2.0J$. A spin has three neighbours parallel to it and one antiparallel. The probability that a proposed flip of it is accepted is ______ (to four decimal places).',
      answer: 0.1353, tol: 0.0002, calc: () => Math.exp(-2),
      sol: '$\\Delta E = 2Js_i\\sum_js_j = 2J(3 - 1) = 4J$. Acceptance $= e^{-4J/2J} = e^{-2} = 0.1353$. Only 5 values of $\\Delta E$ occur, so practical codes precompute the acceptance probabilities.' },
    { id: 'netis-028', type: 'mcq', level: 3, exams: ['net'], sub: 'Monte Carlo',
      q: 'In a Monte Carlo simulation of a finite $L\\times L$ Ising lattice with no field, $\\langle m\\rangle$ (with sign) is zero at all temperatures, given long enough runs. Physicists therefore measure',
      options: ['the energy only', '$\\langle|m|\\rangle$ or $\\langle m^2\\rangle$, whose finite-size behaviour reveals the transition', 'only the specific heat at $T = 0$', 'nothing: finite systems cannot show order'], answer: 1,
      sol: 'A finite system eventually tunnels between the $+m$ and $-m$ states, so $\\langle m\\rangle = 0$ strictly. $\\langle|m|\\rangle$ and $\\chi = N(\\langle m^2\\rangle - \\langle|m|\\rangle^2)/kT$ show a rounded transition whose sharpening with $L$ (finite-size scaling, e.g. the Binder cumulant crossing) locates $T_c$ and the exponents.' },

    // ---------- level 4 ----------
    { id: 'netis-029', type: 'nat', level: 4, exams: ['net'], sub: 'Landau theory',
      q: 'Below $T_c$, with $F = -|A|m^2 + bm^4 - hm$ and $|A| = b = 1$ (consistent units), the metastable branch of the hysteresis loop ends (spinodal) at field magnitude $h_s = \\tfrac43|A|\\sqrt{|A|/6b}$. Its value is ______ (to three decimal places).',
      answer: 0.544, tol: 0.002, calc: () => 4 / 3 * Math.sqrt(1 / 6),
      sol: 'Metastability ends where the local minimum merges with the maximum: $F\' = 0$ and $F\'\' = 0$. $F\'\' = -2|A| + 12bm^2 = 0$ gives $m_s^2 = |A|/6b$; then $h_s = |-2|A|m_s + 4bm_s^3| = \\tfrac43|A|m_s = \\tfrac43\\times0.4082 = 0.544$. Real magnets switch earlier because of nucleation.' },
    { id: 'netis-030', type: 'mcq', level: 4, exams: ['net'], sub: 'Ginzburg-Landau',
      q: 'The Ornstein-Zernike form of the correlation function in three dimensions, from Gaussian (Landau) fluctuations, is',
      options: ['$G(r)\\propto e^{-r/\\xi}$', '$G(r)\\propto\\dfrac{e^{-r/\\xi}}{r}$, becoming $1/r$ at $T_c$', '$G(r)\\propto r^{-1/4}$ at all $T$', '$G(r)\\propto\\xi/r^2$'], answer: 1,
      sol: 'The Fourier transform of $G$ is $\\propto\\dfrac{1}{c(q^2 + \\xi^{-2})}$ (a Lorentzian in $q$), whose 3D inverse transform is the Yukawa form $e^{-r/\\xi}/4\\pi cr$. At $T_c$ it decays as $r^{-(d - 2 + \\eta)}$ with $\\eta = 0$ in Landau theory. ($r^{-1/4}$ is the 2D Ising value at $T_c$.)' },
    { id: 'netis-031', type: 'mcq', level: 4, exams: ['net'], sub: 'Ginzburg criterion',
      q: 'The Ginzburg criterion compares fluctuations in a correlation volume with the mean-field order parameter there. It shows that Landau exponents are correct close to $T_c$ only for dimension',
      options: ['$d > 4$', '$d > 2$', '$d < 4$', '$d = 1$'], answer: 0,
      sol: 'Fluctuation free energy per correlation volume $\\sim kT_c$ is compared with the condensation energy $\\Delta F\\,\\xi^d\\propto|t|^{2}|t|^{-d/2}$. This grows as $t\\to0$ only if $2 - d/2 < 0$, i.e. $d > 4$. For $d < 4$ fluctuations dominate close enough to $T_c$ (in conventional superconductors the region is unobservably narrow because $\\xi_0$ is large).' },
    { id: 'netis-032', type: 'nat', level: 4, exams: ['net'], sub: 'mean field',
      q: 'Mean-field theory gives $m = \\tanh(mT_c/T)$. At low temperature, $1 - m\\approx2e^{-2T_c/T}$. At $T = 0.25T_c$, $1 - m$ is ______ $\\times10^{-4}$ (to two decimal places).',
      answer: 6.71, tol: 0.03, calc: () => 2 * Math.exp(-8) * 1e4,
      sol: 'With $m = 1 - \\epsilon$: $\\tanh x\\approx1 - 2e^{-2x}$ for large $x = mT_c/T\\approx T_c/T$. So $\\epsilon = 2e^{-2T_c/T} = 2e^{-8} = 6.71\\times10^{-4}$. Exponentially small deviations: excitations cost the full gap $2zJ$ in mean field (the exact theory has spin-wave-like corrections in other models).' },
    { id: 'netis-033', type: 'msq', level: 4, exams: ['net'], sub: 'tricritical point',
      q: 'Landau theory with $F = a(T - T_c)m^2 + bm^4 + dm^6$, $d > 0$, where $b$ can change sign. Which statements are correct?',
      options: ['For $b > 0$ the transition is continuous with $\\beta = 1/2$', 'For $b < 0$ the transition is first order', 'At $b = 0$ (tricritical point) $\\beta = 1/4$', 'At $b = 0$ the transition is first order with a latent heat'], answer: [0, 1, 2],
      sol: 'With $b > 0$ the sixth-order term is irrelevant near $T_c$. With $b < 0$ the free energy develops a separate minimum before the $m^2$ coefficient vanishes: first order. At $b = 0$: $2a(T - T_c)m + 6dm^5 = 0$ gives $m^4\\propto T_c - T$, $\\beta = 1/4$, still continuous (the tricritical point where the line of second-order transitions meets the first-order line), as in $^3$He-$^4$He mixtures.' },
    { id: 'netis-034', type: 'nat', level: 4, exams: ['net'], sub: 'exact 2D results',
      q: 'The square-lattice Ising critical temperature is $kT_c = 2.269J$. At what $kT/J$ does the Onsager-Yang magnetisation equal 0.50? (Invert $m^8 = 1 - \\sinh^{-4}(2J/kT)$; answer to three decimal places.)',
      answer: 2.267, tol: 0.002, calc: () => 2 / Math.asinh(Math.pow(1 - 0.5 ** 8, -0.25)),
      sol: '$m^8 = 1/256$, so $\\sinh^{-4}(2K) = 1 - 0.003906 = 0.996094$ and $\\sinh2K = 0.996094^{-1/4} = 1.000979$. $2K = \\text{arcsinh}(1.000979) = 0.882066$, $kT/J = 2/0.882066 = 2.267$. Half the saturation magnetisation is reached only 0.1% below $T_c$: that is $\\beta = 1/8$.' },
    { id: 'netis-035', type: 'mcq', level: 4, exams: ['net'], sub: 'universality',
      q: 'Which systems are expected to share the critical exponents of the 3D Ising model?',
      options: ['A uniaxial ferromagnet, the liquid-gas critical point and a binary liquid mixture at its consolidation point', 'Superfluid helium (lambda point) and a uniaxial ferromagnet', 'A Heisenberg ferromagnet and a liquid crystal', 'All 3D phase transitions'], answer: 0,
      sol: 'Universality classes depend on dimension, the symmetry (number of components) of the order parameter and the range of interactions. Uniaxial magnets, fluids and binary mixtures all have a scalar ($n = 1$) order parameter: 3D Ising, $\\beta\\approx0.326$. Superfluid helium is the 3D XY class ($n = 2$), isotropic magnets Heisenberg ($n = 3$).' },
    { id: 'netis-036', type: 'nat', level: 4, exams: ['net'], sub: 'small clusters',
      q: 'For the four-spin Ising ring of $H = -J\\sum_{i=1}^4s_is_{i+1}$ at $K = J/kT = 0.5$, the mean energy is $\\langle E\\rangle = -J\\,\\partial\\ln Z/\\partial K$ with $Z = 2e^{4K} + 12 + 2e^{-4K}$. Find $\\langle E\\rangle/J$ (to three decimal places).',
      answer: -2.145, tol: 0.003, calc: () => { const K = 0.5; return -(8 * Math.exp(4 * K) - 8 * Math.exp(-4 * K)) / (2 * Math.exp(4 * K) + 12 + 2 * Math.exp(-4 * K)); },
      sol: 'Counting: 2 states at $-4J$ (all aligned), 2 at $+4J$ (alternating), 12 at 0. $\\partial Z/\\partial K = 8e^{4K} - 8e^{-4K} = 8(7.389 - 0.1353) = 58.03$ and $Z = 14.78 + 12 + 0.27 = 27.05$. $\\langle E\\rangle = -J\\times58.03/27.05 = -2.145J$, about half the ground-state value $-4J$ at this temperature.',
      trap: 'Twelve states have zero energy: two broken bonds always come in pairs on a ring.' },
    { id: 'netis-037', type: 'nat', level: 5, exams: ['net'], sub: 'chain susceptibility',
      q: 'The zero-field susceptibility per spin of the Ising chain (moment $\\mu$) is $\\chi = \\dfrac{\\mu^2}{kT}e^{2K}$. At $K = J/kT = 1$, by what factor does it exceed the Curie value $\\mu^2/kT$ of free spins? Answer to two decimal places.',
      answer: 7.39, tol: 0.01, calc: () => Math.exp(2),
      sol: 'From fluctuations: $kT\\chi/\\mu^2 = \\sum_r\\langle s_0s_r\\rangle = \\sum_r(\\tanh K)^{|r|} = \\dfrac{1 + \\tanh K}{1 - \\tanh K} = e^{2K}$. At $K = 1$: $e^2 = 7.39$. Correlated blocks of about $e^{2K}$ spins respond together; $\\chi$ diverges only as $T\\to0$, the chain\'s critical point.' },
    { id: 'netis-038', type: 'mcq', level: 5, exams: ['net'], sub: 'Monte Carlo',
      q: 'The Binder cumulant $U_L = 1 - \\dfrac{\\langle m^4\\rangle}{3\\langle m^2\\rangle^2}$ is used to locate $T_c$ in simulations. For large $L$ it tends to',
      options: ['0 below $T_c$ and $2/3$ above', '1 at all temperatures', '$1/3$ at every temperature', '$2/3$ deep in the ordered phase and 0 in the disordered phase, with curves for different $L$ crossing near $T_c$'], answer: 3,
      sol: 'Ordered: $m\\approx\\pm m_0$, so $\\langle m^4\\rangle = \\langle m^2\\rangle^2$ and $U = 1 - 1/3 = 2/3$. Disordered: $m$ is Gaussian with $\\langle m^4\\rangle = 3\\langle m^2\\rangle^2$, so $U = 0$. At $T_c$, $U$ takes a universal value independent of $L$, so curves for different sizes cross there.' },
    { id: 'netis-039', type: 'nat', level: 5, exams: ['net'], sub: 'Landau theory',
      q: 'For $F = a(T - T_0)m^2 - cm^3 + bm^4$ with $a = 2$, $c = 4$, $b = 1$, $T_0 = 50$ (consistent units), the transition is at $T_1 = 52$ with jump $m^* = 2$. The latent heat $L = T_1\\Delta S$ is ______ (same units).',
      answer: 416, tol: 0.5, calc: () => 52 * 2 * 4,
      sol: 'At the ordered minimum $F_{ord}(T) = a(T - T_0)m^{*2} - \\dots$; differentiating at fixed $m^*$ (allowed since $\\partial F/\\partial m = 0$) gives $S_{ord} - S_{dis} = -\\partial(F_{ord} - F_{dis})/\\partial T = -am^{*2} = -8$. The ordered phase has lower entropy, so $L = T_1am^{*2} = 52\\times2\\times4 = 416$ is released on ordering.' },
    { id: 'netis-040', type: 'msq', level: 5, exams: ['net'], sub: 'transfer matrix',
      q: 'Which statements about the transfer-matrix solution of the 1D Ising chain are correct?',
      options: ['The free energy per spin is $-kT\\ln\\lambda_+$, with $\\lambda_+$ the largest eigenvalue', 'The correlation length is $\\xi = 1/\\ln(\\lambda_+/\\lambda_-)$ (in lattice units)', 'A transition would need the two largest eigenvalues to become degenerate, which the Perron-Frobenius theorem forbids for a finite positive matrix at $T > 0$', 'The square-lattice model has a $2\\times2$ transfer matrix as well'], answer: [0, 1, 2],
      sol: '$Z = \\lambda_+^N + \\lambda_-^N\\to\\lambda_+^N$. $\\langle s_0s_r\\rangle\\propto(\\lambda_-/\\lambda_+)^r = e^{-r/\\xi}$. A finite matrix with positive entries has a non-degenerate largest eigenvalue analytic in $T$, so no singularity for $T > 0$. In 2D the transfer matrix acts on whole rows: $2^L\\times2^L$, becoming infinite as $L\\to\\infty$, which is how a transition becomes possible (Onsager diagonalised it).' },
    { id: 'netis-041', type: 'mcq', level: 2, exams: ['gate', 'net'], sub: 'order parameter',
      q: 'For the liquid-gas transition, viewed as a lattice gas (Ising) transition, the natural order parameter is',
      options: ['the pressure', 'the temperature', 'the density difference $\\rho_{liquid} - \\rho_{gas}$', 'the latent heat'], answer: 2,
      sol: 'In lattice-gas language the magnetisation $m = 2n - 1$ maps to the density. Along the coexistence curve $\\rho_l - \\rho_g\\propto(T_c - T)^\\beta$ with $\\beta\\approx0.326$, the 3D Ising value.' },
    { id: 'netis-042', type: 'nat', level: 3, exams: ['net'], sub: 'mean field',
      q: 'The triangular-lattice Ising model has the exact $kT_c = 4J/\\ln3$. What fraction is this of the mean-field value $zJ$? Answer to three decimal places.',
      answer: 0.607, tol: 0.001, calc: () => 4 / Math.log(3) / 6,
      sol: '$4/\\ln3 = 3.641$ and $z = 6$, so the ratio is $3.641/6 = 0.607$. Between the square lattice (0.567) and the simple cubic (0.752): more neighbours and higher dimension make mean field better.' },
    { id: 'netis-043', type: 'mcq', level: 3, exams: ['net'], sub: 'exact 2D results',
      q: 'Near $T_c$ the specific heat of the 2D square-lattice Ising model',
      options: ['has a finite jump, as in Landau theory', 'is continuous and smooth', 'diverges as $|T - T_c|^{-1/8}$', 'diverges logarithmically, $C\\propto-\\ln|1 - T/T_c|$'], answer: 3,
      sol: 'Onsager\'s solution gives $C/Nk\\approx\\dfrac{2}{\\pi}\\left(\\dfrac{2J}{kT_c}\\right)^2[-\\ln|1 - T/T_c| + \\text{const}]$, symmetric about $T_c$: exponent $\\alpha = 0$ with a logarithm, unlike the Landau jump.' },
    { id: 'netis-044', type: 'mcq', level: 4, exams: ['net'], sub: 'Lee-Yang',
      q: 'Lee and Yang studied the zeros of the Ising partition function in the complex plane of $z = e^{-2\\beta h}$. For a ferromagnet they showed that',
      options: ['the zeros lie on the real positive axis', 'there are no zeros for finite $N$', 'all zeros lie on the unit circle $|z| = 1$, and a transition occurs where they pinch the real axis ($h = 0$) as $N\\to\\infty$', 'the zeros lie on the imaginary axis of $T$'], answer: 2,
      sol: 'The Lee-Yang circle theorem: for ferromagnetic couplings the zeros in $z$ lie on $|z| = 1$, i.e. at purely imaginary fields. For finite $N$ none touches the physical axis ($z$ real positive), so $Z$ is analytic. In the thermodynamic limit below $T_c$ they close in on $z = 1$, giving the jump in $m$ at $h = 0$.' },
  ],
  gens: [
    { id: 'netis-g01', type: 'nat', level: 1, exams: ['gate', 'net'], sub: 'ground states',
      make(r) {
        const L = choose(r, [['linear chain', 2], ['honeycomb lattice', 3], ['square lattice', 4], ['triangular lattice', 6], ['simple cubic lattice', 6], ['body-centred cubic lattice', 8], ['face-centred cubic lattice', 12]]), ask = choose(r, ['E', 'bonds']), N = choose(r, [100, 400, 1000]);
        const val = ask === 'E' ? -L[1] / 2 : L[1] * N / 2;
        return { q: ask === 'E' ? `A ferromagnetic Ising model $H = -J\\sum_{\\langle ij\\rangle}s_is_j$ on a ${L[0]} (periodic boundaries). Find its ground-state energy per spin in units of $J$.` : `How many nearest-neighbour bonds does a ${L[0]} of ${N} sites with periodic boundaries have?`,
          answer: val, tol: 0, z: L[1], ask, N,
          sol: `Coordination number $z = ${L[1]}$; bonds $= zN/2$ (each bond shared by two sites)${ask === 'E' ? `, all satisfied in the ground state: $E_0/N = -zJ/2 = ${val}J$.` : ` $= ${val}$.`}`,
          trap: 'Divide by 2: each bond belongs to two spins.' };
      },
      verify: (p) => p.ask === 'E' ? -p.z / 2 : p.z * p.N / 2 },
    { id: 'netis-g02', type: 'nat', level: 2, exams: ['gate', 'net'], sub: 'small clusters',
      make(r) {
        const K = choose(r, [0.2, 0.5, 1, 1.5, 2]), sgn = choose(r, [1, -1]), ask = choose(r, ['par', 'corr']);
        const Ks = sgn * K, val = ask === 'par' ? 1 / (1 + Math.exp(-2 * Ks)) : Math.tanh(Ks);
        return { q: `Two spins interact through $H = -Js_1s_2$ with ${sgn > 0 ? 'ferromagnetic' : 'antiferromagnetic'} coupling, $|J|/kT = ${K}$. Find ${ask === 'par' ? 'the probability that they are parallel' : '$\\langle s_1s_2\\rangle$'} (four decimal places).`,
          answer: round(val, 4), tol: 0.0005, Ks, ask,
          sol: `$Z = 2e^{K} + 2e^{-K}$ with $K = J/kT = ${Ks}$. $P_\\parallel = 1/(1 + e^{-2K}) = ${round(1 / (1 + Math.exp(-2 * Ks)), 5)}$ and $\\langle s_1s_2\\rangle = \\tanh K = ${round(Math.tanh(Ks), 5)}$.`,
          trap: 'For antiferromagnetic coupling $K < 0$ and antiparallel alignment is favoured.' };
      },
      verify: (p) => p.ask === 'par' ? 1 / (1 + Math.exp(-2 * p.Ks)) : Math.tanh(p.Ks) },
    { id: 'netis-g03', type: 'nat', level: 2, exams: ['gate', 'net'], sub: 'correlations',
      make(r) {
        const K = choose(r, [0.3, 0.5, 0.8, 1, 1.5, 2]), rr = int(r, 1, 6), ask = choose(r, ['c', 'xi']);
        const val = ask === 'c' ? Math.tanh(K) ** rr : -1 / Math.log(Math.tanh(K));
        return { q: ask === 'c' ? `In a zero-field Ising chain at $K = J/kT = ${K}$, find $\\langle s_is_{i+${rr}}\\rangle$ (four decimal places).` : `In a zero-field Ising chain at $K = J/kT = ${K}$, $\\langle s_is_{i+r}\\rangle = e^{-r/\\xi}$. Find $\\xi$ in lattice spacings (three decimal places).`,
          answer: round(val, ask === 'c' ? 4 : 3), tol: ask === 'c' ? 0.0005 : Math.max(0.002, val * 0.002), K, rr, ask,
          sol: `$\\langle s_is_{i+r}\\rangle = (\\tanh K)^r$ with $\\tanh${K} = ${round(Math.tanh(K), 5)}$. ${ask === 'c' ? `For $r = ${rr}$: $${round(val, 5)}$.` : `$\\xi = -1/\\ln\\tanh K = ${round(val, 4)}$.`}`,
          trap: 'The chain has finite correlation length at every $T > 0$.' };
      },
      verify: (p) => p.ask === 'c' ? Math.tanh(p.K) ** p.rr : -1 / Math.log(Math.tanh(p.K)) },
    { id: 'netis-g04', type: 'nat', level: 2, exams: ['gate', 'net'], sub: 'Monte Carlo',
      make(r) {
        const up = int(r, 0, 4), T = choose(r, [1, 1.5, 2, 2.269, 3, 4]);
        const dE = 2 * (up - (4 - up)), val = Math.min(1, Math.exp(-dE / T));
        return { q: `In a Metropolis simulation of the square-lattice Ising model ($H = -J\\sum s_is_j$) at $kT = ${T}J$, a spin has ${up} of its 4 neighbours parallel to it. Find the probability that a proposed flip is accepted (four decimal places).`,
          answer: round(val, 4), tol: 0.0005, up, T,
          sol: `$\\Delta E = 2Js_i\\sum_js_j = 2J(${up} - ${4 - up}) = ${dE}J$. Acceptance $= \\min(1, e^{-\\Delta E/kT}) = ${dE <= 0 ? '1 (energy does not rise)' : `e^{-${dE}/${T}} = ${round(val, 5)}`}$.`,
          trap: 'Flips that lower or keep the energy are always accepted.' };
      },
      verify: (p) => Math.min(1, Math.exp(-2 * (2 * p.up - 4) / p.T)) },
    { id: 'netis-g05', type: 'nat', level: 2, exams: ['gate', 'net'], sub: 'mean field',
      make(r) {
        const L = choose(r, [['square', 4, 2.269], ['triangular', 6, 3.641], ['honeycomb', 3, 1.519], ['simple cubic', 6, 4.512], ['bcc', 8, 6.355], ['fcc', 12, 9.794]]), ask = choose(r, ['mf', 'bethe', 'ratio']);
        const bethe = 2 / Math.log(L[1] / (L[1] - 2)), val = { mf: L[1], bethe, ratio: L[2] / L[1] }[ask];
        return { q: ask === 'mf' ? `Mean-field theory for the Ising model on the ${L[0]} lattice predicts $kT_c/J$ = ______.` : ask === 'bethe' ? `The Bethe approximation, $K_c = \\tfrac12\\ln[z/(z - 2)]$, for the ${L[0]} lattice predicts $kT_c/J$ = ______ (three decimal places).` : `The best estimate for the ${L[0]}-lattice Ising model is $kT_c = ${L[2]}J$. What fraction of the mean-field value is it? (three decimal places)`,
          answer: ask === 'mf' ? val : round(val, 3), tol: ask === 'mf' ? 0 : 0.002, z: L[1], tc: L[2], ask,
          sol: `$z = ${L[1]}$. Mean field: $kT_c = zJ = ${L[1]}J$. Bethe: $kT_c/J = 2/\\ln(${L[1]}/${L[1] - 2}) = ${round(bethe, 4)}$. Exact or numerical: ${L[2]}. ${ask === 'ratio' ? `Ratio $= ${round(L[2] / L[1], 4)}$.` : ''}`,
          trap: 'Mean field always overestimates $T_c$; the Bethe estimate is closer.' };
      },
      verify: (p) => ({ mf: p.z, bethe: 2 / Math.log(p.z / (p.z - 2)), ratio: p.tc / p.z })[p.ask] },
    { id: 'netis-g06', type: 'nat', level: 3, exams: ['net'], sub: 'exact 2D results',
      make(r) {
        const t = choose(r, [0.5, 1, 1.5, 1.8, 2, 2.1, 2.2, 2.25]);
        const val = onsagerM(t);
        return { q: `Using $m = [1 - \\sinh^{-4}(2J/kT)]^{1/8}$ for the square-lattice Ising model, find the spontaneous magnetisation at $kT = ${t}J$ (four decimal places).`,
          answer: round(val, 4), tol: 0.0005, t,
          sol: `$\\sinh(2/${t}) = ${round(Math.sinh(2 / t), 5)}$, $\\sinh^{-4} = ${round(Math.sinh(2 / t) ** -4, 6)}$, so $m = (${round(1 - Math.sinh(2 / t) ** -4, 6)})^{1/8} = ${round(val, 5)}$ (with $kT_c = 2.269J$).`,
          trap: 'Because $\\beta = 1/8$, $m$ stays close to 1 until very near $T_c$.' };
      },
      verify: (p) => onsagerM(p.t) },
    { id: 'netis-g07', type: 'nat', level: 3, exams: ['net'], sub: 'small clusters',
      make(r) {
        const K = choose(r, [0.25, 0.5, 0.75, 1, 1.5]), ask = choose(r, ['p', 'E', 'pz']);
        const Z = 2 * Math.exp(4 * K) + 12 + 2 * Math.exp(-4 * K), val = { p: 2 * Math.exp(4 * K) / Z, E: -(8 * Math.exp(4 * K) - 8 * Math.exp(-4 * K)) / Z, pz: 12 / Z }[ask];
        const txt = { p: 'the probability that all four spins are aligned', E: 'the mean energy in units of $J$', pz: 'the probability that the ring has zero energy' }[ask];
        return { q: `Four Ising spins on a ring, $H = -J\\sum_{i=1}^4s_is_{i+1}$, are at $K = J/kT = ${K}$. Find ${txt} (four decimal places).`,
          answer: round(val, 4), tol: Math.max(0.0005, Math.abs(val) * 0.001), K, ask,
          sol: `Levels: $-4J$ (2 states), 0 (12), $+4J$ (2). $Z = 2e^{${4 * K}} + 12 + 2e^{-${4 * K}} = ${round(Z, 4)}$. Answer: $${round(val, 5)}$.`,
          trap: 'Broken bonds on a ring come in pairs, so energies are $-4J$, 0, $+4J$ only.' };
      },
      verify: (p) => { const K = p.K, Z = 2 * Math.exp(4 * K) + 12 + 2 * Math.exp(-4 * K); return { p: 2 * Math.exp(4 * K) / Z, E: -(8 * Math.exp(4 * K) - 8 * Math.exp(-4 * K)) / Z, pz: 12 / Z }[p.ask]; } },
    { id: 'netis-g08', type: 'nat', level: 4, exams: ['net'], sub: 'Landau theory',
      make(r) {
        const a = choose(r, [0.5, 1, 2]), c = choose(r, [1, 2, 3, 4]), b = choose(r, [0.5, 1, 2]), T0 = choose(r, [50, 100, 200]), ask = choose(r, ['T1', 'm', 'L']);
        const T1 = T0 + c * c / (4 * a * b), m = c / (2 * b), val = { T1, m, L: T1 * a * m * m }[ask];
        const txt = { T1: 'the transition temperature $T_1$', m: 'the jump of the order parameter at $T_1$', L: 'the latent heat $T_1am^{*2}$ released on ordering' }[ask];
        return { q: `A Landau free energy $F = a(T - T_0)m^2 - cm^3 + bm^4$ has $a = ${a}$, $c = ${c}$, $b = ${b}$, $T_0 = ${T0}$ (consistent units). Find ${txt} (three significant figures).`,
          answer: +val.toPrecision(4), tol: val * 0.002, a, c, b, T0, ask,
          sol: `First-order transition where $A - cm + bm^2$ ($A = a(T - T_0)$) has a double root: $A = c^2/4b$, $m^* = c/2b = ${m}$, $T_1 = T_0 + c^2/4ab = ${round(T1, 4)}$. Latent heat $T_1am^{*2} = ${round(T1 * a * m * m, 3)}$. Answer: $${round(val, 4)}$.`,
          trap: 'The cubic term makes the transition first order and moves it above $T_0$.' };
      },
      verify: (p) => { const T1 = p.T0 + p.c ** 2 / (4 * p.a * p.b), m = p.c / (2 * p.b); return { T1, m, L: T1 * p.a * m * m }[p.ask]; } },
    { id: 'netis-g09', type: 'mcq', level: 3, exams: ['net'], sub: 'Landau theory',
      make(r) {
        const P = choose(r, [
          ['In Landau theory, the ratio $\\chi(T_c + \\Delta T)/\\chi(T_c - \\Delta T)$ for small $\\Delta T$ is', '2', ['1', '1/2', '4']],
          ['In Ginzburg-Landau theory, $\\xi(T_c - \\Delta T)/\\xi(T_c + \\Delta T)$ is', '$1/\\sqrt2$', ['$\\sqrt2$', '1', '2']],
          ['At $T_c$ in Landau theory, if the field is multiplied by 8, the order parameter is multiplied by', '2', ['8', '$2\\sqrt2$', '4']],
          ['With a sixth-order term and $b = 0$ (tricritical point), Landau theory gives $\\beta$ =', '1/4', ['1/2', '1/8', '1/3']],
          ['In Landau theory the specific heat at $T_c$', 'jumps by a finite amount', ['diverges logarithmically', 'diverges as $|t|^{-1/2}$', 'is continuous with a kink']],
        ]);
        const o = mcqOptions(r, P[1], P[2], (v) => v);
        return { q: P[0], ...o, sol: `The answer is ${P[1]}. From $F = a(T - T_c)m^2 + bm^4 - hm$: $\\chi_+ = 1/2at$, $\\chi_- = 1/4a|t|$; $\\xi\\propto(F\'\')^{-1/2}$ so $\\xi_-/\\xi_+ = 1/\\sqrt2$; at $T_c$, $m\\propto h^{1/3}$; with $bm^4$ absent $m\\propto|t|^{1/4}$; $C$ jumps by $T_ca^2/2b$.`,
          trap: 'Landau ratios are universal numbers within mean-field theory.' };
      } },
    { id: 'netis-g10', type: 'nat', level: 3, exams: ['net'], sub: 'Curie-Weiss',
      make(r) {
        const kind = choose(r, ['ferro', 'antiferro']), th = choose(r, [20, 50, 100, 150]), Cc = choose(r, [0.5, 1, 2]), T1 = choose(r, [200, 250, 300]), T2 = T1 + choose(r, [50, 100]);
        const chi = (T) => Cc / (kind === 'ferro' ? T - th : T + th), c1 = +chi(T1).toPrecision(4), c2 = +chi(T2).toPrecision(4);
        const val = kind === 'ferro' ? (c1 * T1 - c2 * T2) / (c1 - c2) : (c2 * T2 - c1 * T1) / (c1 - c2);
        return { q: `A${kind === 'ferro' ? ' ferromagnet' : 'n antiferromagnet'} above its ordering temperature obeys $\\chi = C/(T ${kind === 'ferro' ? '-' : '+'} \\theta)$ with $\\theta > 0$. It has $\\chi = ${c1}$ at ${T1} K and $\\chi = ${c2}$ at ${T2} K (arbitrary units). Find $\\theta$ in K (three significant figures).`,
          answer: +val.toPrecision(3), tol: Math.max(0.5, th * 0.01), kind, c1, c2, T1, T2,
          sol: `$\\chi(T ${kind === 'ferro' ? '-' : '+'} \\theta)$ is the same at both temperatures: $${c1}(${T1} ${kind === 'ferro' ? '-' : '+'} \\theta) = ${c2}(${T2} ${kind === 'ferro' ? '-' : '+'} \\theta)$, giving $\\theta = ${round(val, 2)}$ K.`,
          trap: 'Watch the sign: ferromagnets diverge at $T = \\theta$; antiferromagnets have an intercept at $T = -\\theta$.' };
      },
      verify: (p) => p.kind === 'ferro' ? (p.c1 * p.T1 - p.c2 * p.T2) / (p.c1 - p.c2) : (p.c2 * p.T2 - p.c1 * p.T1) / (p.c1 - p.c2) },
    { id: 'netis-g11', type: 'nat', level: 3, exams: ['net'], sub: 'chain in a field',
      make(r) {
        const K = choose(r, [0, 0.5, 1, 1.5, -0.5]), bh = choose(r, [0.05, 0.1, 0.2, 0.5, 1]);
        const val = Math.sinh(bh) / Math.sqrt(Math.sinh(bh) ** 2 + Math.exp(-4 * K));
        return { q: `For the Ising chain in a field, $m = \\sinh(\\beta h)/\\sqrt{\\sinh^2(\\beta h) + e^{-4K}}$. Find $m$ at $K = ${K}$ and $\\beta h = ${bh}$ (four decimal places).`,
          answer: round(val, 4), tol: 0.0005, K, bh,
          sol: `$\\sinh${bh} = ${round(Math.sinh(bh), 5)}$, $e^{-4K} = ${round(Math.exp(-4 * K), 5)}$: $m = ${round(Math.sinh(bh), 5)}/\\sqrt{${round(Math.sinh(bh) ** 2 + Math.exp(-4 * K), 6)}} = ${round(val, 5)}$.${K === 0 ? ' With $K = 0$ this is $\\tanh\\beta h$, free spins.' : ''}`,
          trap: K < 0 ? 'Antiferromagnetic coupling suppresses the response.' : 'Ferromagnetic correlations enhance the response to a weak field.' };
      },
      verify: (p) => Math.sinh(p.bh) / Math.sqrt(Math.sinh(p.bh) ** 2 + Math.exp(-4 * p.K)) },
    { id: 'netis-g12', type: 'mcq', level: 3, exams: ['net'], sub: 'frustration',
      make(r) {
        const P = choose(r, [
          ['three spins on a triangle with antiferromagnetic coupling', '6'],
          ['four spins on a square ring with antiferromagnetic coupling', '2'],
          ['four spins on a square ring with ferromagnetic coupling', '2'],
          ['four spins on a tetrahedron (all six pairs coupled) with antiferromagnetic coupling', '6'],
          ['two spins with antiferromagnetic coupling', '2'],
        ]);
        const o = mcqOptions(r, P[1], ['1', '2', '3', '4', '6', '8'].filter((x) => x !== P[1]), (v) => v);
        return { q: `How many ground states does an Ising cluster of ${P[0]} have (zero field)?`, ...o,
          sol: `${P[1]}. Unfrustrated clusters (any ferromagnet, or an antiferromagnet on a bipartite graph like the square ring) have just the two global flips. On the triangle at most two bonds can be satisfied: 6 of 8 states. On the tetrahedron the best is two up, two down: $\\binom42 = 6$ states with energy $-2|J|$.`,
          trap: 'Frustration (an odd loop of antiferromagnetic bonds) multiplies the ground-state degeneracy.' };
      } },
  ],
};
