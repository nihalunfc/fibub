// Phase transitions: Ehrenfest classification, Clausius-Clapeyron and Ehrenfest relations, Gibbs phase rule,
// order parameters and symmetry breaking, Landau theory (second and first order), mean-field Ising model, Curie-Weiss law,
// critical exponents, scaling relations, universality, the exact 1D and 2D Ising results.
// Original questions for GATE and CSIR NET practice (fibub), MSc level.
import { pick, int, choose, mcqOptions, round, shuffle, C } from '../_util.js';
import more from './phase-transitions.more.gen.js';
import more2 from './phase-transitions.more2.gen.js';
import r4 from './phase-transitions.r4.gen.js';

const kBe = 8.617333e-5;
const mf = (t) => { if (t >= 1) return 0; let m = 1; for (let i = 0; i < 2000; i++) m = Math.tanh(m / t); return m; }; // m = tanh(m/t)

export default {
  topic: 'phase-transitions',
  items: [
    // ---- level 1 ----
    { id: 'phtr-001', type: 'mcq', level: 1, exams: ['gate', 'net'], sub: 'classification',
      q: 'In Ehrenfest’s classification, a first-order phase transition is one in which',
      options: ['the Gibbs energy itself jumps', 'first derivatives of the Gibbs energy, such as $S$ and $V$, jump', 'only the second derivatives, such as $C_P$, jump', 'nothing measurable changes'], answer: 1,
      sol: '$G$ is continuous across any transition (the phases coexist with equal $G$). In a first-order transition $S = -\\partial G/\\partial T$ and $V = \\partial G/\\partial P$ jump, giving a latent heat $L = T\\Delta S$ and a volume change: melting, boiling.' },
    { id: 'phtr-002', type: 'mcq', level: 1, exams: ['gate', 'net'], sub: 'classification',
      q: 'Which feature marks a continuous (second-order) phase transition?',
      options: ['A large latent heat', 'Coexistence of two phases with different densities', 'No latent heat, with the order parameter growing continuously from zero below $T_c$', 'A jump in the volume'], answer: 2,
      sol: 'In a continuous transition $S$ and $V$ are continuous (no latent heat), while response functions such as $C$ or $\\chi$ jump or diverge. The order parameter rises smoothly from zero.' },
    { id: 'phtr-003', type: 'mcq', level: 1, exams: ['gate', 'net'], sub: 'order parameter',
      q: 'The natural order parameter for the ferromagnet-paramagnet transition is',
      options: ['the spontaneous magnetisation', 'the susceptibility', 'the temperature', 'the heat capacity'], answer: 0,
      sol: 'An order parameter is zero in the disordered (symmetric) phase and non-zero in the ordered phase: the spontaneous magnetisation $M$ at zero field. For liquid-gas it is $\\rho_l - \\rho_g$; for a superconductor the gap or pair amplitude.' },
    { id: 'phtr-004', type: 'mcq', level: 1, exams: ['gate', 'net'], sub: 'phase rule',
      q: 'By the Gibbs phase rule, how many intensive variables can be changed independently at the triple point of a pure substance?',
      options: ['2', '1', '3', '0'], answer: 3,
      sol: '$F = C - P + 2 = 1 - 3 + 2 = 0$. The triple point has a fixed $T$ and $P$, which is why the triple point of water defined the kelvin for decades.' },
    { id: 'phtr-005', type: 'mcq', level: 1, exams: ['gate', 'net'], sub: 'Clapeyron',
      q: 'The Clausius-Clapeyron equation gives the slope of a coexistence curve as',
      options: ['$dP/dT = L\\,\\Delta v/T$', '$dP/dT = T\\Delta v/L$', '$dP/dT = \\Delta v/L$', '$dP/dT = L/(T\\Delta v)$'], answer: 3,
      sol: 'Equal chemical potentials along the curve: $-s_1dT + v_1dP = -s_2dT + v_2dP$, so $dP/dT = \\Delta s/\\Delta v = L/(T\\Delta v)$, with $L$ and $\\Delta v$ per unit mass (or per mole) for the same change.' },
    { id: 'phtr-006', type: 'msq', level: 1, exams: ['gate', 'net'], sub: 'classification', format: 'multi',
      q: 'Which of these are continuous (second-order) transitions?',
      options: ['Iron losing its ferromagnetism at the Curie point in zero field', 'Water passing through its liquid-gas critical point', 'A metal becoming superconducting in zero magnetic field', 'Ice melting at 273 K and 1 atm'], answer: [0, 1, 2],
      sol: 'The first three have no latent heat and a growing order parameter or diverging response. Melting has a latent heat of 334 kJ/kg: first order.' },

    // ---- level 2 ----
    { id: 'phtr-007', type: 'mcq', level: 2, exams: ['gate', 'net'], sub: 'Landau',
      q: 'In Landau theory $F(m) = F_0 + a(T - T_c)m^2 + bm^4$ with $a, b > 0$. Below $T_c$ the equilibrium order parameter is',
      options: ['$m = \\sqrt{a(T_c - T)/b}$', '$m = \\sqrt{a(T_c - T)/2b}$', '$m = a(T_c - T)/2b$', '$m = 0$'], answer: 1,
      sol: '$\\partial F/\\partial m = 2a(T - T_c)m + 4bm^3 = 0$ gives $m^2 = a(T_c - T)/2b$. The $m = 0$ solution is a maximum below $T_c$.' },
    { id: 'phtr-008', type: 'mcq', level: 2, exams: ['gate', 'net'], sub: 'exponents',
      q: 'In mean-field (Landau) theory the order parameter vanishes as $m \\propto (T_c - T)^\\beta$ with',
      options: ['$\\beta = 1$', '$\\beta = 1/8$', '$\\beta = 1/2$', '$\\beta = 1/3$'], answer: 2,
      sol: '$m^2 \\propto T_c - T$, so $\\beta = 1/2$. The exact 2D Ising value is $1/8$ and the 3D value is about $0.33$: fluctuations, ignored by mean field, change the exponents.' },
    { id: 'phtr-009', type: 'nat', level: 2, exams: ['gate', 'net'], sub: 'Landau',
      q: 'In Landau theory, $m(0.96\\,T_c)/m(0.99\\,T_c)$ is ______.',
      answer: 2, tol: 0.001, calc: () => Math.sqrt(0.04 / 0.01),
      sol: '$m \\propto (T_c - T)^{1/2}$: $\\sqrt{0.04/0.01} = 2$.' },
    { id: 'phtr-010', type: 'mcq', level: 2, exams: ['gate', 'net'], sub: 'Curie-Weiss',
      q: 'Above the Curie temperature, the susceptibility of a ferromagnet in mean-field theory follows',
      options: ['$\\chi = C/T$', '$\\chi = C/(T + T_c)$', '$\\chi = C(T - T_c)$', '$\\chi = C/(T - T_c)$'], answer: 3,
      sol: 'The Weiss molecular field $\\lambda M$ adds to the applied field: $M = (C/T)(H + \\lambda M)$, giving $\\chi = C/(T - \\lambda C)$ with $T_c = \\lambda C$. So $\\gamma = 1$ in mean field. ($C/(T + \\theta)$ describes antiferromagnets above $T_N$.)' },
    { id: 'phtr-011', type: 'nat', level: 2, exams: ['gate', 'net'], sub: 'mean-field Ising', unit: 'K',
      q: 'For the Ising model $H = -J\\sum_{\\langle ij\\rangle}s_is_j$ ($s = \\pm1$) on a square lattice with $J = 1.0$ meV, mean-field theory predicts $kT_c = zJ$. The predicted $T_c$ is ______ K.',
      answer: 46.4, tol: 0.5, calc: () => 4 * 1e-3 / kBe,
      sol: 'Each spin feels the mean field of $z = 4$ neighbours, $zJm$; self-consistency $m = \\tanh(zJm/kT)$ has a non-zero solution below $kT_c = zJ = 4$ meV, i.e. $T_c = 4\\times10^{-3}/8.617\\times10^{-5} = 46.4$ K. (Onsager’s exact answer is 43% lower.)' },
    { id: 'phtr-012', type: 'mcq', level: 2, exams: ['gate', 'net'], sub: 'Ising',
      q: 'The one-dimensional Ising model with nearest-neighbour coupling and no field',
      options: ['orders below $kT_c = 2J$', 'has no phase transition at any $T > 0$', 'orders below $kT_c = J$', 'has a first-order transition'], answer: 1,
      sol: 'A single domain wall costs only $2J$ but can sit at any of $N$ places, gaining entropy $k\\ln N$; at any $T > 0$ walls appear and destroy long-range order. The exact solution confirms $T_c = 0$. Mean field wrongly predicts $kT_c = 2J$.' },
    { id: 'phtr-013', type: 'nat', level: 2, exams: ['gate', 'net'], sub: 'Clapeyron', unit: 'MPa/K',
      q: 'Ice melts at $273.15$ K with $L = 3.34\\times10^5$ J/kg. The specific volumes are $1.091\\times10^{-3}$ m$^3$/kg (ice) and $1.000\\times10^{-3}$ m$^3$/kg (water). The slope $dP/dT$ of the melting curve is ______ MPa/K.',
      answer: -13.4, tol: 0.15, calc: () => 3.34e5 / (273.15 * (1.0e-3 - 1.091e-3)) / 1e6,
      sol: '$dP/dT = L/(T\\Delta v) = 3.34\\times10^5/(273.15\\times(-9.1\\times10^{-5})) = -1.34\\times10^7$ Pa/K. Negative because ice is less dense than water: pressure lowers the melting point, by about 0.0075 K per atmosphere.' },
    { id: 'phtr-014', type: 'mcq', level: 2, exams: ['gate', 'net'], sub: 'classification',
      q: 'In an Ehrenfest second-order transition, which quantities are discontinuous?',
      options: ['$S$ and $V$', '$C_P$, the thermal expansivity $\\alpha$ and the compressibility $\\kappa_T$', 'The Gibbs energy', 'The latent heat and the volume'], answer: 1,
      sol: 'Second derivatives of $G$ jump: $C_P = -T\\partial^2G/\\partial T^2$, $V\\alpha = \\partial^2G/\\partial T\\partial P$, $-V\\kappa_T = \\partial^2G/\\partial P^2$. $G$, $S$ and $V$ are continuous.' },
    { id: 'phtr-015', type: 'mcq', level: 2, exams: ['gate', 'net'], sub: 'exponents',
      q: 'At $T = T_c$ the magnetisation responds to a small field as $M \\propto h^{1/\\delta}$. In mean-field theory $\\delta$ is',
      options: ['1', '2', '15', '3'], answer: 3,
      sol: 'At $T_c$ the quadratic term vanishes: $\\partial F/\\partial m = 4bm^3 - h = 0$, so $m \\propto h^{1/3}$ and $\\delta = 3$. (2D Ising: $\\delta = 15$.)' },
    { id: 'phtr-016', type: 'mcq', level: 2, exams: ['gate', 'net'], sub: 'exponents',
      q: 'Near $T_c$, with $t = (T - T_c)/T_c$, the standard critical exponents are defined by',
      options: ['$C \\propto |t|^{-\\alpha}$, $m \\propto (-t)^{\\beta}$, $\\chi \\propto |t|^{-\\gamma}$, $\\xi \\propto |t|^{-\\nu}$', '$C \\propto |t|^{\\alpha}$, $m \\propto t^{-\\beta}$, $\\chi \\propto |t|^{\\gamma}$, $\\xi \\propto |t|^{\\nu}$', '$C \\propto e^{-\\alpha/t}$, $m \\propto e^{-\\beta/t}$, $\\chi \\propto e^{\\gamma/t}$, $\\xi \\propto e^{\\nu/t}$', '$C \\propto t^\\alpha$ only above $T_c$'], answer: 0,
      sol: 'Positive exponents describe the divergence of $C$, $\\chi$ and $\\xi$ and the vanishing of $m$. Mean field: $\\alpha = 0$ (a jump), $\\beta = 1/2$, $\\gamma = 1$, $\\nu = 1/2$, $\\delta = 3$.' },
    { id: 'phtr-017', type: 'nat', level: 2, exams: ['gate', 'net'], sub: 'exponents',
      q: 'At the critical temperature of a mean-field magnet, the field is increased 8 times. The magnetisation increases by a factor of ______.',
      answer: 2, tol: 0.001, calc: () => 8 ** (1 / 3),
      sol: '$M \\propto h^{1/\\delta} = h^{1/3}$: $8^{1/3} = 2$.' },
    { id: 'phtr-018', type: 'msq', level: 2, exams: ['gate', 'net'], sub: 'symmetry breaking', format: 'statements',
      q: 'Which statements about spontaneous symmetry breaking at a ferromagnetic transition are correct?',
      options: ['The Hamiltonian is symmetric under reversing all spins, but the low-temperature state is not', 'Below $T_c$ the system picks one of the equivalent ordered states', 'In zero field the average magnetisation of a finite system, over infinite time, is zero', 'The symmetry is broken by the Hamiltonian itself'], answer: [0, 1, 2],
      sol: 'The ordered state has lower symmetry than $H$. In the thermodynamic limit the time to flip between $+m$ and $-m$ becomes infinite, so the system stays in one; a finite system eventually samples both and averages to zero. The Hamiltonian stays symmetric.' },

    // ---- level 3 ----
    { id: 'phtr-019', type: 'nat', level: 3, exams: ['gate', 'net'], sub: 'Landau', unit: 'J K⁻¹ m⁻³',
      q: 'A system has Landau free energy density $f = f_0 + a(T - T_c)m^2 + bm^4$ with $a = 1.0\\times10^3$ J m$^{-3}$K$^{-1}$, $b = 1.0\\times10^5$ J m$^{-3}$ and $T_c = 100$ K. The jump in heat capacity per unit volume at $T_c$ is ______ J K$^{-1}$m$^{-3}$.',
      answer: 500, tol: 3, calc: () => (1e3) ** 2 * 100 / (2 * 1e5),
      sol: 'Below $T_c$, $m^2 = a(T_c - T)/2b$ and $f - f_0 = -a^2(T_c - T)^2/4b$. $c = -T\\partial^2f/\\partial T^2 = Ta^2/2b$ below, 0 above (beyond $f_0$). Jump $= a^2T_c/2b = 10^6\\times100/(2\\times10^5) = 500$ J K$^{-1}$m$^{-3}$; the ordered side is higher.' },
    { id: 'phtr-020', type: 'mcq', level: 3, exams: ['gate', 'net'], sub: 'mean-field Ising',
      q: 'In mean-field theory of the Ising model ($z$ neighbours, coupling $J$, zero field) the magnetisation per spin satisfies',
      options: ['$m = \\tanh(zJm/kT)$', '$m = \\coth(zJm/kT) - kT/zJm$', '$m = zJ/kT$', '$m = e^{-zJ/kT}$'], answer: 0,
      sol: 'Replace the neighbours by their average $m$: each spin sees an effective field $zJm$, so $m = \\langle s\\rangle = \\tanh(\\beta zJm)$. Graphically, a non-zero crossing exists only when the slope $\\beta zJ$ at the origin exceeds 1: $kT_c = zJ$. (The Langevin form belongs to classical vector spins.)' },
    { id: 'phtr-021', type: 'nat', level: 3, exams: ['gate', 'net'], sub: 'mean-field Ising',
      q: 'Solve the mean-field equation $m = \\tanh(m\\,T_c/T)$ at $T = 0.5\\,T_c$. The spontaneous magnetisation $m$ is ______.',
      answer: 0.957, tol: 0.002, calc: () => mf(0.5),
      sol: 'Iterate $m \\to \\tanh(2m)$ from $m = 1$: $0.964, 0.958, 0.9575, \\ldots$ converging to $m \\approx 0.957$. Already 96% saturated at half of $T_c$.' },
    { id: 'phtr-022', type: 'mcq', level: 3, exams: ['gate', 'net'], sub: 'scaling',
      q: 'The Rushbrooke scaling relation is $\\alpha + 2\\beta + \\gamma = 2$. Which set of exponents satisfies it?',
      options: ['$\\alpha = 0,\\ \\beta = 1/2,\\ \\gamma = 2$', '$\\alpha = 0,\\ \\beta = 1/8,\\ \\gamma = 1$', '$\\alpha = 1/2,\\ \\beta = 1/2,\\ \\gamma = 1$', '$\\alpha = 0,\\ \\beta = 1/2,\\ \\gamma = 1$ (mean field)'], answer: 3,
      sol: 'Mean field: $0 + 1 + 1 = 2$. 2D Ising ($0, 1/8, 7/4$) also works: $0 + 1/4 + 7/4 = 2$. The others give 3, 1.25 and 2.5.' },
    { id: 'phtr-023', type: 'nat', level: 3, exams: ['gate', 'net'], sub: 'scaling',
      q: 'For the 2D Ising model $\\beta = 1/8$ and $\\gamma = 7/4$. Using the Widom relation $\\gamma = \\beta(\\delta - 1)$, $\\delta$ is ______.',
      answer: 15, tol: 0, calc: () => 1 + 1.75 / 0.125,
      sol: '$\\delta = 1 + \\gamma/\\beta = 1 + 14 = 15$.' },
    { id: 'phtr-024', type: 'nat', level: 3, exams: ['gate', 'net'], sub: 'scaling',
      q: 'For the 3D Ising universality class $\\beta = 0.326$ and $\\gamma = 1.237$. From the Rushbrooke relation, $\\alpha$ is ______.',
      answer: 0.111, tol: 0.002, calc: () => 2 - 2 * 0.326 - 1.237,
      sol: '$\\alpha = 2 - 2\\beta - \\gamma = 2 - 0.652 - 1.237 = 0.111$: a weak divergence of the heat capacity, seen in fluids near their critical point.' },
    { id: 'phtr-025', type: 'mcq', level: 3, exams: ['gate', 'net'], sub: 'Ising',
      q: 'Onsager’s exact result for the square-lattice Ising model is $kT_c/J = 2/\\ln(1 + \\sqrt2) \\approx 2.27$. Compared with mean-field theory, this is',
      options: ['higher, because mean field overestimates fluctuations', 'lower, because mean field ignores the fluctuations that oppose ordering', 'the same', 'lower, because mean field counts too few neighbours'], answer: 1,
      sol: 'Mean field gives $kT_c/J = z = 4$. Real fluctuations (local disorder) make ordering harder, so the true $T_c$ is lower: $2.27/4 = 0.57$ of the mean-field value.' },
    { id: 'phtr-026', type: 'msq', level: 3, exams: ['gate', 'net'], sub: 'Landau', format: 'statements',
      q: 'A Landau expansion $F = a(T - T_0)m^2 - cm^3 + bm^4$ ($b, c > 0$) contains a cubic term. Which statements are correct?',
      options: ['The transition becomes first order', 'It occurs above $T_0$', 'The order parameter jumps at the transition', 'A cubic term is allowed only if $m$ and $-m$ are physically equivalent'], answer: [0, 1, 2],
      sol: 'The cubic term makes a second minimum at $m > 0$ that reaches the height of $F(0)$ while $a(T - T_0)$ is still positive, so $m$ jumps from 0 at some $T^* > T_0$: first order. A cubic term is forbidden when $m \\to -m$ is a symmetry (as for a ferromagnet); it appears for, e.g., the nematic liquid crystal or the 3-state Potts model.' },
    { id: 'phtr-027', type: 'nat', level: 3, exams: ['gate', 'net'], sub: 'Landau',
      q: 'In Landau theory with a small field term $-hm$, the susceptibility $\\chi = \\partial m/\\partial h$ diverges on both sides of $T_c$. At equal distances $|T - T_c|$, the ratio $\\chi(T > T_c)/\\chi(T < T_c)$ is ______.',
      answer: 2, tol: 0.001, calc: () => (1 / 2) / (1 / 4),
      sol: 'Above: $2a(T - T_c)m = h$, so $\\chi = 1/[2a(T - T_c)]$. Below: expand about $m_0$, with $F\'\' = 2a(T - T_c) + 12bm_0^2 = 4a(T_c - T)$, so $\\chi = 1/[4a(T_c - T)]$. Ratio 2.' },
    { id: 'phtr-028', type: 'nat', level: 3, exams: ['gate', 'net'], sub: 'Curie-Weiss', unit: 'K',
      q: 'A ferromagnet above its Curie point has susceptibility $0.010$ at $300$ K and $0.0050$ at $400$ K. Assuming the Curie-Weiss law, $T_c$ is ______ K.',
      answer: 200, tol: 1, calc: () => (0.01 * 300 - 0.005 * 400) / (0.01 - 0.005),
      sol: '$\\chi(T - T_c) = C$ at both temperatures: $0.010(300 - T_c) = 0.0050(400 - T_c)$, so $3 - 0.01T_c = 2 - 0.005T_c$ and $T_c = 200$ K. (Plotting $1/\\chi$ against $T$ gives a line crossing zero at $T_c$.)' },
    { id: 'phtr-029', type: 'mcq', level: 3, exams: ['gate', 'net'], sub: 'correlation length',
      q: 'As $T \\to T_c$ in a continuous transition, the correlation length',
      options: ['vanishes', 'stays equal to the lattice spacing', 'diverges, as $|t|^{-\\nu}$ ($\\nu = 1/2$ in mean field)', 'oscillates'], answer: 2,
      sol: 'Fluctuations become correlated over larger and larger distances; at $T_c$ there is no length scale left, which is the root of scaling and universality. Critical opalescence in fluids happens when $\\xi$ reaches optical wavelengths.' },
    { id: 'phtr-030', type: 'msq', level: 3, exams: ['gate', 'net'], sub: 'liquid-gas', format: 'statements',
      q: 'Which statements about the liquid-gas transition are correct?',
      options: ['The coexistence curve ends at the critical point', 'A fluid can be taken from liquid to gas without any phase transition by going round the critical point', 'The latent heat of vaporisation goes to zero at the critical point', 'The liquid-gas transition is continuous at every point of the coexistence curve'], answer: [0, 1, 2],
      sol: 'Below $T_c$ boiling is first order, with a latent heat and density jump that both shrink to zero at the critical point, where the curve ends. Since liquid and gas have the same symmetry, a path round the end avoids any transition (unlike the solid-liquid line).' },

    // ---- level 4 ----
    { id: 'phtr-031', type: 'nat', level: 4, exams: ['gate', 'net'], sub: 'Landau',
      q: 'A Landau free energy $F = \\alpha(T - T_0)m^2 - Bm^4 + Dm^6$ has $\\alpha = 0.5$, $B = 3$ and $D = 2$ (consistent units). The first-order transition occurs at $T^* - T_0 = $ ______.',
      answer: 2.25, tol: 0.01, calc: () => 3 ** 2 / (4 * 0.5 * 2),
      sol: 'At $T^*$ the ordered minimum has $F = 0$ and $F\' = 0$: $A - Bm^2 + Dm^4 = 0$ and $A - 2Bm^2 + 3Dm^4 = 0$ with $A = \\alpha(T - T_0)$. Subtracting: $m^2 = B/2D$, then $A = B^2/4D$. So $T^* - T_0 = B^2/(4\\alpha D) = 9/4 = 2.25$, with a jump $m^2 = 3/4$.' },
    { id: 'phtr-032', type: 'msq', level: 4, exams: ['gate', 'net'], sub: 'Ehrenfest', format: 'statements',
      q: 'Along the line of an Ehrenfest second-order transition (where $S$ and $V$ are continuous), which relations hold?',
      options: ['$dP/dT = \\Delta\\alpha/\\Delta\\kappa_T$', '$dP/dT = \\Delta C_P/(TV\\Delta\\alpha)$', '$dP/dT = L/(T\\Delta v)$ with a non-zero $L$', '$\\Delta C_P = TV(\\Delta\\alpha)^2/\\Delta\\kappa_T$'], answer: [0, 1, 3],
      sol: 'Differentiating $\\Delta V = 0$ along the line gives $\\Delta\\alpha\\,dT - \\Delta\\kappa_T\\,dP = 0$; differentiating $\\Delta S = 0$ gives $\\Delta C_P\\,dT/T - V\\Delta\\alpha\\,dP = 0$. Eliminating $dP/dT$ links the three jumps. Clapeyron with a latent heat is for first-order lines.' },
    { id: 'phtr-033', type: 'nat', level: 4, exams: ['gate', 'net'], sub: 'Ising',
      q: 'The exact zero-field correlation length of the 1D Ising chain is $\\xi = -a/\\ln\\tanh(J/kT)$. At $J/kT = 1$, $\\xi/a$ is ______.',
      answer: 3.67, tol: 0.02, calc: () => -1 / Math.log(Math.tanh(1)),
      sol: '$\\tanh1 = 0.7616$, $\\ln0.7616 = -0.2723$, $\\xi = 3.67a$. It grows as $\\tfrac12e^{2J/kT}$ at low $T$ but is finite at every $T > 0$: no transition.' },
    { id: 'phtr-034', type: 'mcq', level: 4, exams: ['gate', 'net'], sub: 'dimensions',
      q: 'For short-range interactions, which statement about the lower critical dimension $d_l$ (below which there is no long-range order at $T > 0$) is correct?',
      options: ['$d_l = 1$ for Ising (discrete) symmetry and $d_l = 2$ for continuous symmetry (Mermin-Wagner)', '$d_l = 4$ for all systems', '$d_l = 3$ for Ising and $d_l = 1$ for Heisenberg', 'There is no lower critical dimension'], answer: 0,
      sol: 'Discrete symmetry: domain walls cost energy growing as $L^{d-1}$, so order survives for $d \\ge 2$ (2D Ising orders; 1D does not). Continuous symmetry: long-wavelength spin waves cost so little that order is destroyed in $d \\le 2$. Above $d_u = 4$ mean-field exponents become exact.' },
    { id: 'phtr-035', type: 'nat', level: 4, exams: ['gate', 'net'], sub: 'scaling',
      q: 'The hyperscaling relation is $d\\nu = 2 - \\alpha$. For the 3D Ising class with $\\nu = 0.630$, $\\alpha$ is ______.',
      answer: 0.11, tol: 0.002, calc: () => 2 - 3 * 0.63,
      sol: '$\\alpha = 2 - 3\\times0.630 = 0.110$, consistent with the Rushbrooke estimate from $\\beta$ and $\\gamma$. Mean field ($\\nu = 1/2$, $\\alpha = 0$) satisfies hyperscaling only at $d = 4$.' },
    { id: 'phtr-036', type: 'mcq', level: 4, exams: ['gate', 'net'], sub: 'universality',
      q: 'The liquid-gas critical point of CO$_2$ and the Curie point of a uniaxial ferromagnet share the same critical exponents. This is because',
      options: ['both have the same critical temperature', 'both have a scalar order parameter, short-range forces and $d = 3$: the same universality class (3D Ising)', 'both obey the van der Waals equation', 'it is a coincidence'], answer: 1,
      sol: 'Near $T_c$ only large-scale fluctuations matter, so exponents depend only on dimension, the symmetry of the order parameter and the range of the forces. A lattice gas maps exactly onto the Ising model, density playing the role of magnetisation.' },
    { id: 'phtr-037', type: 'nat', level: 4, exams: ['gate', 'net'], sub: 'mean-field Ising',
      q: 'In mean-field Ising theory the heat capacity per spin jumps at $T_c$ (no field). The jump $\\Delta C/k$ is ______.',
      answer: 1.5, tol: 0.001, calc: () => 1.5,
      sol: 'Energy per spin $= -\\tfrac12zJm^2$. Near $T_c$, $m = \\tanh(m/t)$ gives $m^2 \\approx 3(1 - t)$, so $E \\approx -\\tfrac32zJ(1 - T/T_c)$ and $C = dE/dT = \\tfrac32zJ/T_c = \\tfrac32k$ (using $kT_c = zJ$). Above $T_c$, $C = 0$. Jump $= 1.5k$.' },
    { id: 'phtr-038', type: 'mcq', level: 4, exams: ['gate', 'net'], sub: 'Clapeyron',
      q: 'Far below the critical point, treating the vapour as ideal and $v_{\\rm liquid} \\ll v_{\\rm vapour}$, the Clapeyron equation integrates to',
      options: ['$P \\propto e^{-L/RT}$ with $L$ the molar latent heat', '$P \\propto T^{L/R}$', '$P \\propto e^{LT/R}$', '$P \\propto L/T$'], answer: 0,
      sol: '$dP/dT = L/(Tv_g) = LP/RT^2$, so $d\\ln P/dT = L/RT^2$ and $P = P_0e^{-L/RT}$: a vapour pressure that rises steeply, like a Boltzmann factor with $L$ the energy to free one mole from the liquid.' },

    // ---- level 5 ----
    { id: 'phtr-039', type: 'nat', level: 5, exams: ['gate', 'net'], sub: 'Ising',
      q: 'The 1D Ising chain has free energy per spin $f = -kT\\ln[2\\cosh(J/kT)]$ in zero field, so $C/Nk = (J/kT)^2\\,\\mathrm{sech}^2(J/kT)$. At $J/kT = 1$, $C/Nk$ is ______.',
      answer: 0.42, tol: 0.003, calc: () => 1 / Math.cosh(1) ** 2,
      sol: '$\\cosh1 = 1.5431$, $\\cosh^21 = 2.381$, so $C/Nk = 1/2.381 = 0.420$. The curve is a smooth Schottky-like bump: no singularity, as expected without a transition.' },
    { id: 'phtr-040', type: 'nat', level: 5, exams: ['gate', 'net'], sub: 'mean-field Ising',
      q: 'Solve $m = \\tanh(m\\,T_c/T)$ at $T = 0.99\\,T_c$. The magnetisation is ______.',
      answer: 0.173, tol: 0.002, calc: () => mf(0.99),
      sol: 'Near $T_c$ expand $\\tanh x \\approx x - x^3/3$: $m = m/t - m^3/3t^3$ gives $m^2 = 3t^2(1 - t) \\approx 3\\times0.98\\times0.01$, $m \\approx 0.172$. The full solution is $0.173$. Even 1% below $T_c$, $m$ is already 17% because $\\beta = 1/2$ makes $m$ rise steeply.' },
    { id: 'phtr-041', type: 'msq', level: 5, exams: ['gate', 'net'], sub: 'universality', format: 'statements',
      q: 'Which statements about critical exponents are correct?',
      options: ['They are the same for all systems in one universality class, though $T_c$ differs', 'Mean-field exponents are exact above four dimensions for short-range forces', 'The 2D Ising heat capacity diverges logarithmically ($\\alpha = 0$)', 'They depend on the strength of the coupling $J$'], answer: [0, 1, 2],
      sol: 'Universality: exponents depend on dimension, order-parameter symmetry and interaction range, not on $J$ or $T_c$. Above $d_u = 4$ fluctuations are irrelevant and Landau theory is exact. Onsager found $C \\sim -\\ln|t|$, which counts as $\\alpha = 0$.' },
    { id: 'phtr-042', type: 'mcq', level: 5, exams: ['gate', 'net'], sub: 'Ising',
      q: 'For the 1D Ising chain in a field $h$, the transfer matrix is $T = \\begin{pmatrix} e^{K + H} & e^{-K} \\\\ e^{-K} & e^{K - H} \\end{pmatrix}$ with $K = J/kT$, $H = h/kT$. In the thermodynamic limit the free energy per spin is',
      options: ['$-kT\\ln\\lambda_+$, with $\\lambda_+$ the larger eigenvalue of $T$', '$-kT\\ln(\\mathrm{tr}\\,T)$', '$-kT\\ln\\det T$', '$-kT(\\lambda_+ + \\lambda_-)$'], answer: 0,
      sol: '$Z_N = \\mathrm{tr}\\,T^N = \\lambda_+^N + \\lambda_-^N \\approx \\lambda_+^N$, so $f = -kT\\ln\\lambda_+$ with $\\lambda_+ = e^K\\cosh H + \\sqrt{e^{2K}\\sinh^2H + e^{-2K}}$. At $H = 0$ it reduces to $2\\cosh K$. The finite gap between $\\lambda_+$ and $\\lambda_-$ means a finite correlation length.' },
    { id: 'phtr-043', type: 'msq', level: 2, exams: ['gate', 'net'], sub: 'Clapeyron', format: 'multi',
      q: 'Which statements about coexistence curves on a $P$-$T$ phase diagram are correct?',
      options: ['The melting curve of water has a negative slope', 'The boiling curve of every substance has a positive slope', 'Along a coexistence curve the two phases have equal chemical potential', 'The slope of a coexistence curve is zero at the triple point'], answer: [0, 1, 2],
      sol: 'Clapeyron: slope $= \\Delta s/\\Delta v$. Water expands on freezing, so its melting slope is negative. Vaporisation always has $\\Delta s > 0$ and $\\Delta v > 0$, so a positive slope. Coexistence means $\\mu_1 = \\mu_2$. At the triple point three curves meet with finite, different slopes.' },
    { id: 'phtr-044', type: 'msq', level: 4, exams: ['gate', 'net'], sub: 'mean field', format: 'statements',
      q: 'Which statements about mean-field (Weiss/Landau) theory are correct?',
      options: ['It ignores correlated fluctuations of the order parameter', 'It overestimates $T_c$', 'It predicts a phase transition even in one dimension', 'It gives exact exponents in two and three dimensions'], answer: [0, 1, 2],
      sol: 'Replacing neighbours by their average drops fluctuations, which favour disorder; so $T_c$ comes out too high (4 vs 2.27 for the square lattice) and a transition is wrongly predicted in 1D. Its exponents are exact only above four dimensions (or for long-range forces).' },
    ...more2,
    ...r4.items,
  ],
  gens: [
    { id: 'phtr-g01', type: 'nat', level: 2, exams: ['gate', 'net'], sub: 'mean-field Ising',
      make(r) {
        const [lat, z] = choose(r, [['linear chain', 2], ['honeycomb', 3], ['square', 4], ['triangular', 6], ['simple cubic', 6], ['body-centred cubic', 8], ['face-centred cubic', 12]]), J = choose(r, [0.5, 1, 2, 5, 10]);
        const T = z * J * 1e-3 / kBe;
        return { q: `For the Ising model on a ${lat} lattice ($z = ${z}$) with $J = ${J}$ meV, the mean-field critical temperature is ______ K.`,
          answer: round(T, 1), tol: Math.max(0.2, round(T * 0.01, 1)), unit: 'K', z, J,
          sol: `$kT_c = zJ = ${z}\\times${J}$ meV $= ${round(z * J, 2)}$ meV, so $T_c = ${round(z * J * 1e-3, 4)}/8.617\\times10^{-5} \\approx ${round(T, 1)}$ K.${z === 2 ? ' (The exact chain has no transition at all.)' : ''}` };
      },
      verify: (p) => p.z * p.J * 1e-3 / kBe },
    { id: 'phtr-g02', type: 'nat', level: 3, exams: ['gate', 'net'], sub: 'mean-field Ising',
      make(r) {
        const t = choose(r, [0.1, 0.3, 0.5, 0.6, 0.7, 0.8, 0.9, 0.95]);
        const m = mf(t);
        return { q: `In mean-field Ising theory $m = \\tanh(m\\,T_c/T)$. Find the spontaneous magnetisation at $T = ${t}\\,T_c$.`,
          answer: round(m, 4), tol: 0.002, t,
          sol: `Iterate $m \\to \\tanh(m/${t})$ from $m = 1$; it converges to $m \\approx ${round(m, 4)}$. ${t >= 0.9 ? `Check with the expansion near $T_c$: $m \\approx \\sqrt{3t^2(1 - t)} = ${round(Math.sqrt(3 * t * t * (1 - t)), 4)}$.` : `At low $T$, $1 - m \\approx 2e^{-2/t}$, i.e. $${round(1 - 2 * Math.exp(-2 / t), 4)}$.`}` };
      },
      verify: (p) => mf(p.t) },
    { id: 'phtr-g03', type: 'nat', level: 2, exams: ['gate', 'net'], sub: 'Clapeyron',
      make(r) {
        const [what, L, T, v1, v2, unit] = choose(r, [
          ['water boiling', 2.257e6, 373.15, 1.043e-3, 1.673, 'J/kg'],
          ['ice melting', 3.34e5, 273.15, 1.091e-3, 1.000e-3, 'J/kg'],
          ['lead melting', 2.30e4, 600.6, 9.06e-5, 9.43e-5, 'J/kg'],
          ['mercury freezing (liquid to solid)', -1.14e4, 234.3, 7.37e-5, 7.11e-5, 'J/kg'],
          ['benzene melting', 1.27e5, 278.7, 1.120e-3, 1.140e-3, 'J/kg'],
        ]);
        const s = L / (T * (v2 - v1)), kPa = s / 1000;
        return { q: `For ${what} at $${T}$ K, $L = ${L.toExponential(3).replace(/e\+?(-?\d+)/, '\\times10^{$1}')}$ J/kg and the specific volume changes from $${v1.toExponential(3).replace(/e\+?(-?\d+)/, '\\times10^{$1}')}$ to $${v2.toExponential(3).replace(/e\+?(-?\d+)/, '\\times10^{$1}')}$ m$^3$/kg. The slope $dP/dT$ of the coexistence curve is ______ kPa/K.`,
          answer: round(kPa, 3), tol: Math.max(0.001, Math.abs(round(kPa * 0.01, 3))), unit: 'kPa/K', L, T, v1, v2,
          sol: `$dP/dT = L/(T\\Delta v) = \\frac{${L}}{${T}\\times(${(v2 - v1).toExponential(3).replace(/e\+?(-?\d+)/, '\\times10^{$1}')})} \\approx ${round(kPa, 3)}$ kPa/K.${kPa < 0 ? ' Negative: the high-temperature phase is the denser one, so raising the pressure lowers the transition temperature.' : ''}` };
      },
      verify: (p) => p.L / (p.T * (p.v2 - p.v1)) / 1000 },
    { id: 'phtr-g04', type: 'nat', level: 3, exams: ['gate', 'net'], sub: 'Clapeyron',
      make(r) {
        const [liq, L, Tb] = choose(r, [['water', 40.7, 373.15], ['ethanol', 38.6, 351.4], ['benzene', 30.7, 353.2], ['nitrogen', 5.57, 77.36], ['ammonia', 23.3, 239.8]]), dT = choose(r, [-20, -10, -5, 5, 10]);
        const T2 = Tb + dT, ratio = Math.exp(-(L * 1000 / C.R) * (1 / T2 - 1 / Tb));
        return { q: `The normal boiling point of ${liq} is $${Tb}$ K and its molar latent heat is $${L}$ kJ/mol. Treating the vapour as ideal and $L$ as constant, its vapour pressure at $${round(T2, 2)}$ K is ______ atm.`,
          answer: round(ratio, 4), tol: Math.max(0.002, round(ratio * 0.01, 4)), unit: 'atm', L, Tb, dT,
          sol: `$\\ln\\frac{P_2}{P_1} = -\\frac{L}{R}\\left(\\frac1{T_2} - \\frac1{T_1}\\right) = -\\frac{${L * 1000}}{8.314}\\left(\\frac{1}{${round(T2, 2)}} - \\frac{1}{${Tb}}\\right) = ${round(Math.log(ratio), 4)}$. With $P_1 = 1$ atm, $P_2 \\approx ${round(ratio, 4)}$ atm.` };
      },
      verify: (p) => { const T2 = p.Tb + p.dT; return Math.exp(-(p.L * 1000 / C.R) * (1 / T2 - 1 / p.Tb)); } },
    { id: 'phtr-g05', type: 'nat', level: 3, exams: ['gate', 'net'], sub: 'Landau',
      make(r) {
        const a = choose(r, [100, 200, 500, 1000]), b = choose(r, [1e4, 2e4, 5e4, 1e5]), Tc = choose(r, [50, 100, 300, 600]), q = choose(r, ['m', 'dC']), dT = choose(r, [1, 2, 5, 10]);
        const v = q === 'm' ? Math.sqrt(a * dT / (2 * b)) : a * a * Tc / (2 * b);
        return { q: `A Landau free energy density is $f = f_0 + a(T - T_c)m^2 + bm^4$ with $a = ${a}$ J m$^{-3}$K$^{-1}$, $b = ${b}$ J m$^{-3}$, $T_c = ${Tc}$ K. ${q === 'm' ? `Find the equilibrium order parameter at $T = T_c - ${dT}$ K.` : 'Find the jump in heat capacity per unit volume at $T_c$, in J K$^{-1}$m$^{-3}$.'}`,
          answer: round(v, 4), tol: Math.max(0.001, round(v * 0.01, 4)), a, b, Tc, qq: q, dT,
          sol: q === 'm' ? `$m^2 = a(T_c - T)/2b = ${a}\\times${dT}/(2\\times${b}) = ${round(a * dT / (2 * b), 6)}$, so $m \\approx ${round(v, 4)}$.` : `Below $T_c$, $f - f_0 = -a^2(T_c - T)^2/4b$, so $c = Ta^2/2b$; at $T_c$ the jump is $a^2T_c/2b = ${a}^2\\times${Tc}/(2\\times${b}) = ${round(v, 4)}$ J K$^{-1}$m$^{-3}$.` };
      },
      verify: (p) => (p.qq === 'm' ? Math.sqrt(p.a * p.dT / (2 * p.b)) : p.a * p.a * p.Tc / (2 * p.b)) },
    { id: 'phtr-g06', type: 'nat', level: 3, exams: ['gate', 'net'], sub: 'scaling',
      make(r) {
        const [cls, be, ga, nu, d] = choose(r, [['2D Ising', 0.125, 1.75, 1, 2], ['3D Ising', 0.3265, 1.2372, 0.63, 3], ['3D XY', 0.3486, 1.3178, 0.6717, 3], ['3D Heisenberg', 0.3689, 1.3960, 0.7112, 3], ['mean field', 0.5, 1, 0.5, 4]]);
        const which = choose(r, ['alpha (Rushbrooke)', 'delta (Widom)', 'alpha (hyperscaling)']);
        const v = which === 'alpha (Rushbrooke)' ? 2 - 2 * be - ga : which === 'delta (Widom)' ? 1 + ga / be : 2 - d * nu;
        const rel = which === 'alpha (Rushbrooke)' ? '$\\alpha + 2\\beta + \\gamma = 2$' : which === 'delta (Widom)' ? '$\\gamma = \\beta(\\delta - 1)$' : '$d\\nu = 2 - \\alpha$';
        return { q: `For the ${cls} universality class, $\\beta = ${be}$, $\\gamma = ${ga}$, $\\nu = ${nu}$ (in $d = ${d}$). Using ${rel}, find $${which.startsWith('delta') ? '\\delta' : '\\alpha'}$.`,
          answer: round(v, 4), tol: which.startsWith('delta') ? Math.max(0.01, round(v * 0.005, 3)) : 0.003, be, ga, nu, d, which,
          sol: which === 'alpha (Rushbrooke)' ? `$\\alpha = 2 - 2\\beta - \\gamma = 2 - ${round(2 * be, 4)} - ${ga} = ${round(v, 4)}$.` : which === 'delta (Widom)' ? `$\\delta = 1 + \\gamma/\\beta = 1 + ${ga}/${be} = ${round(v, 4)}$.` : `$\\alpha = 2 - d\\nu = 2 - ${d}\\times${nu} = ${round(v, 4)}$.${v < 0 ? ' Negative: the heat capacity has a finite cusp, not a divergence.' : ''}` };
      },
      verify: (p) => (p.which === 'alpha (Rushbrooke)' ? 2 - 2 * p.be - p.ga : p.which === 'delta (Widom)' ? 1 + p.ga / p.be : 2 - p.d * p.nu) },
    { id: 'phtr-g07', type: 'nat', level: 3, exams: ['gate', 'net'], sub: 'Curie-Weiss',
      make(r) {
        const Tc = choose(r, [50, 100, 150, 200, 300, 600]), Cc = choose(r, [0.5, 1, 2, 5]), T1 = Tc + choose(r, [20, 50, 100]), T2 = T1 + choose(r, [50, 100, 200]);
        const x1 = Cc / (T1 - Tc), x2 = Cc / (T2 - Tc);
        return { q: `Above its Curie point a ferromagnet has susceptibility $${round(x1, 5)}$ at $${T1}$ K and $${round(x2, 5)}$ at $${T2}$ K. Assuming the Curie-Weiss law, $T_c$ is ______ K.`,
          answer: Tc, tol: Math.max(0.5, Tc * 0.005), x1: round(x1, 5), x2: round(x2, 5), T1, T2,
          sol: `$\\chi(T - T_c) = C$: $${round(x1, 5)}(${T1} - T_c) = ${round(x2, 5)}(${T2} - T_c)$, so $T_c = \\frac{\\chi_1T_1 - \\chi_2T_2}{\\chi_1 - \\chi_2} \\approx ${Tc}$ K (and $C \\approx ${Cc}$ K).` };
      },
      verify: (p) => (p.x1 * p.T1 - p.x2 * p.T2) / (p.x1 - p.x2) },
    { id: 'phtr-g08', type: 'nat', level: 4, exams: ['gate', 'net'], sub: 'Landau',
      make(r) {
        const al = choose(r, [0.5, 1, 2]), B = choose(r, [1, 2, 3, 4]), D = choose(r, [1, 2, 4]), q = choose(r, ['T', 'm']);
        const v = q === 'T' ? B * B / (4 * al * D) : Math.sqrt(B / (2 * D));
        return { q: `A Landau free energy $F = \\alpha(T - T_0)m^2 - Bm^4 + Dm^6$ has $\\alpha = ${al}$, $B = ${B}$, $D = ${D}$ (consistent units). ${q === 'T' ? 'Find $T^* - T_0$, where the first-order transition happens.' : 'Find the jump in the order parameter $m$ at the first-order transition.'}`,
          answer: round(v, 4), tol: Math.max(0.002, round(v * 0.005, 4)), al, B, D, qq: q,
          sol: `At $T^*$ the ordered minimum is level with $m = 0$: $F = 0$ and $F\' = 0$ give $A - Bm^2 + Dm^4 = 0$ and $A - 2Bm^2 + 3Dm^4 = 0$ (with $A = \\alpha(T - T_0)$), so $m^2 = B/2D = ${round(B / (2 * D), 4)}$ and $A = \\alpha(T^* - T_0) = B^2/4D$. ${q === 'T' ? `So $T^* - T_0 = B^2/(4\\alpha D) = ${round(v, 4)}$.` : `So $m = \\sqrt{B/2D} = ${round(v, 4)}$.`}` };
      },
      verify: (p) => (p.qq === 'T' ? p.B * p.B / (4 * p.al * p.D) : Math.sqrt(p.B / (2 * p.D))) },
    { id: 'phtr-g09', type: 'nat', level: 4, exams: ['gate', 'net'], sub: 'Ising',
      make(r) {
        const K = choose(r, [0.25, 0.5, 0.75, 1, 1.5, 2]), q = choose(r, ['xi', 'C']);
        const v = q === 'xi' ? -1 / Math.log(Math.tanh(K)) : (K / Math.cosh(K)) ** 2;
        return { q: `For the zero-field 1D Ising chain at $J/kT = ${K}$, find ${q === 'xi' ? 'the correlation length in lattice spacings, $\\xi/a = -1/\\ln\\tanh(J/kT)$' : 'the heat capacity per spin, $C/Nk = (J/kT)^2\\mathrm{sech}^2(J/kT)$'}.`,
          answer: round(v, 4), tol: Math.max(0.002, round(v * 0.005, 4)), K, qq: q,
          sol: q === 'xi' ? `$\\tanh${K} = ${round(Math.tanh(K), 5)}$, $\\ln = ${round(Math.log(Math.tanh(K)), 5)}$, so $\\xi/a \\approx ${round(v, 4)}$. Finite at every $T > 0$.` : `$\\cosh${K} = ${round(Math.cosh(K), 5)}$, so $C/Nk = ${K * K}/${round(Math.cosh(K) ** 2, 5)} \\approx ${round(v, 4)}$. A smooth bump, no singularity.` };
      },
      verify: (p) => (p.qq === 'xi' ? -1 / Math.log(Math.tanh(p.K)) : (p.K / Math.cosh(p.K)) ** 2) },
    { id: 'phtr-g10', type: 'mcq', level: 2, exams: ['gate', 'net'], sub: 'classification',
      make(r) {
        const L = [
          ['water boiling at 1 atm', 'first order'], ['iron at its Curie point in zero field', 'continuous'], ['the superconducting transition of tin in zero field', 'continuous'],
          ['the superconducting transition of tin in a magnetic field', 'first order'], ['ice melting', 'first order'], ['the lambda transition of liquid $^4$He', 'continuous'],
          ['a fluid at its liquid-gas critical point', 'continuous'], ['the bcc to fcc structural change in iron at 1185 K', 'first order'], ['the order-disorder transition of $\\beta$-brass (CuZn)', 'continuous'],
          ['a ferromagnet below $T_c$ when the field is reversed through zero', 'first order'],
        ];
        const [what, ans] = choose(r, L);
        const all = ['first order', 'continuous', 'no transition (a smooth crossover)', 'infinite order (Kosterlitz-Thouless)'];
        const o = mcqOptions(r, ans, all.filter((x) => x !== ans));
        return { q: `The phase transition in ${what} is best described as`, options: o.options, answer: o.answer,
          sol: ans === 'first order' ? 'It has a latent heat or a jump in a first derivative of the free energy (volume, entropy or magnetisation), with phase coexistence: first order.' : 'There is no latent heat; the order parameter grows continuously from zero and response functions (heat capacity, susceptibility, compressibility) are singular: a continuous transition.' };
      } },
    { id: 'phtr-g11', type: 'mcq', level: 3, exams: ['gate', 'net'], sub: 'exponents',
      make(r) {
        const E = [['\\beta', '1/2'], ['\\gamma', '1'], ['\\delta', '3'], ['\\nu', '1/2'], ['\\alpha', '0 (a finite jump)']];
        const I = [['\\beta', '1/8'], ['\\gamma', '7/4'], ['\\delta', '15'], ['\\nu', '1'], ['\\alpha', '0 (logarithmic divergence)']];
        const which = choose(r, ['mean-field theory', 'the exact 2D Ising solution']), i = int(r, 0, 4);
        const [sym, val] = (which === 'mean-field theory' ? E : I)[i];
        const pool = ['1/2', '1', '3', '1/8', '7/4', '15', '0 (a finite jump)', '0 (logarithmic divergence)', '1/3', '2'];
        const o = mcqOptions(r, val, shuffle(r, pool.filter((x) => x !== val)), (v) => (v.includes('(') ? `$0$ (${v.slice(3, -1)})` : `$${v}$`));
        return { q: `In ${which}, the critical exponent $${sym}$ equals`, options: o.options, answer: o.answer,
          sol: `${which === 'mean-field theory' ? 'Mean field: $\\alpha = 0$ (jump), $\\beta = 1/2$, $\\gamma = 1$, $\\delta = 3$, $\\nu = 1/2$.' : '2D Ising (Onsager, Yang): $\\alpha = 0$ (log), $\\beta = 1/8$, $\\gamma = 7/4$, $\\delta = 15$, $\\nu = 1$.'} Both sets satisfy $\\alpha + 2\\beta + \\gamma = 2$ and $\\gamma = \\beta(\\delta - 1)$.` };
      } },
    ...more,
    ...r4.gens,
  ],
};
