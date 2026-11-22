// Nonlinear dynamics and chaos (CSIR NET Part C, some GATE): the logistic map (fixed points, cycles, period doubling,
// superstable orbits, windows), Feigenbaum constants, Lyapunov exponents of maps and flows, sensitive dependence and
// predictability, the Lorenz system, the Hénon map, strange attractors and fractal dimensions (similarity, box
// counting, Kaplan-Yorke), Poincaré sections, KAM and the route to Hamiltonian chaos. Original questions for fibub.
import { int, pick, choose, mcqOptions, round } from '../_util.js';
import more from './nonlinear-dynamics-chaos.more.gen.js';
import more2 from './nonlinear-dynamics-chaos.more2.gen.js';
import r4 from './nonlinear-dynamics-chaos.r4.gen.js';

const LOG = 'The logistic map is $x_{n+1} = rx_n(1 - x_n)$, with $0 \\leq x \\leq 1$ and $0 < r \\leq 4$.';
const LYA = 'For a one-dimensional map the Lyapunov exponent is $\\lambda = \\lim_{n\\to\\infty}\\dfrac1n\\sum_{i=0}^{n-1}\\ln|f\'(x_i)|$.';

export default {
  topic: 'nonlinear-dynamics-chaos',
  items: [
    // ---------- level 1 ----------
    { id: 'chs-001', type: 'mcq', level: 1, exams: ['gate', 'net'], sub: 'logistic map',
      q: `${LOG} Its fixed points are`,
      options: ['$x = 0$ and $x = 1 - 1/r$', '$x = 0$ and $x = 1/r$', '$x = 1/2$ only', '$x = 0$ and $x = r - 1$'], answer: 0,
      sol: '$x = rx(1 - x)$ gives $x = 0$ or $1 = r(1 - x)$, i.e. $x = 1 - 1/r$. The second lies in $[0, 1]$ only for $r \\geq 1$.' },
    { id: 'chs-002', type: 'mcq', level: 1, exams: ['gate', 'net'], sub: 'Lyapunov exponents',
      q: 'Sensitive dependence on initial conditions, the hallmark of chaos, means that the largest Lyapunov exponent is',
      options: ['zero', 'negative', 'positive', 'imaginary'], answer: 2,
      sol: 'Two nearby starting points separate as $\\delta_n \\approx \\delta_0e^{\\lambda n}$. A positive $\\lambda$ means exponential separation (chaos); negative means the orbits converge (a stable fixed point or cycle); zero is typical of periodic or quasi-periodic motion along the flow.' },
    { id: 'chs-003', type: 'nat', level: 1, exams: ['gate', 'net'], sub: 'logistic map',
      q: `${LOG} For $r = 2.5$, iterates from almost any $x_0$ in $(0, 1)$ settle to the value ______.`,
      answer: 0.6, tol: 0.001, calc: () => 1 - 1 / 2.5,
      sol: 'For $1 < r < 3$ the non-zero fixed point $x^* = 1 - 1/r$ is stable: $x^* = 1 - 0.4 = 0.6$. Its multiplier $f\'(x^*) = 2 - r = -0.5$ has magnitude below 1, so the iterates approach it, alternating sides.' },
    { id: 'chs-004', type: 'mcq', level: 1, exams: ['gate', 'net'], sub: 'flows',
      q: 'What is the smallest dimension of phase space in which an autonomous system of ODEs $\\dot{\\vec x} = \\vec f(\\vec x)$ can be chaotic?',
      options: ['$1$', '$2$', '$4$', '$3$'], answer: 3,
      sol: 'In one dimension trajectories can only move monotonically to fixed points. In two, the Poincaré-Bendixson theorem limits bounded motion to fixed points and limit cycles. Three dimensions are needed (e.g. the Lorenz system). Maps are different: a one-dimensional non-invertible map such as the logistic map can be chaotic.' },
    { id: 'chs-005', type: 'nat', level: 1, exams: ['gate', 'net'], sub: 'fractals',
      q: 'The middle-thirds Cantor set is made of 2 copies of itself, each scaled down by a factor 3. Its similarity dimension is ______.',
      answer: 0.6309, tol: 0.002, calc: () => Math.log(2) / Math.log(3),
      sol: 'For $N$ copies scaled by $1/s$: $N = s^D$, so $D = \\ln N/\\ln s = \\ln2/\\ln3 \\approx 0.631$. More than a set of points (dimension 0), less than a line (1).' },
    { id: 'chs-006', type: 'mcq', level: 1, exams: ['gate', 'net'], sub: 'Feigenbaum',
      q: 'In the period-doubling route to chaos, the ratio of successive intervals between bifurcations, $(r_n - r_{n-1})/(r_{n+1} - r_n)$, tends to Feigenbaum\'s constant',
      options: ['$\\alpha \\approx 2.503$', '$\\delta \\approx 4.669$', '$r_\\infty \\approx 3.570$', '$\\phi \\approx 1.618$'], answer: 1,
      sol: '$\\delta = 4.6692\\ldots$ is universal: the same for every smooth one-humped map (and seen in fluid and electronic experiments). $\\alpha = 2.5029$ is the second Feigenbaum constant, for the scaling of the orbit widths; $3.5699$ is where the logistic map\'s cascade ends.' },

    // ---------- level 2 ----------
    { id: 'chs-007', type: 'mcq', level: 2, exams: ['gate', 'net'], sub: 'logistic map',
      q: `${LOG} The fixed point $x^* = 1 - 1/r$ is stable for`,
      options: ['$0 < r < 1$', '$1 < r < 3$', '$3 < r < 4$', '$r$ close to 4 only'], answer: 1,
      sol: '$f\'(x) = r(1 - 2x)$, so $f\'(x^*) = r(1 - 2 + 2/r) = 2 - r$. Stability needs $|2 - r| < 1$: $1 < r < 3$. At $r = 1$ it exchanges stability with $x = 0$ (transcritical); at $r = 3$ the multiplier reaches $-1$ and the first period doubling happens.' },
    { id: 'chs-008', type: 'nat', level: 2, exams: ['gate', 'net'], sub: 'logistic map',
      q: `${LOG} For $r = 2.8$, the multiplier $f\'(x^*)$ at the non-zero fixed point is ______.`,
      answer: -0.8, tol: 0.001, calc: () => 2 - 2.8,
      sol: '$f\'(x^*) = 2 - r = -0.8$. Its magnitude is below 1, so the point is stable, and the negative sign means the iterates approach it alternately from above and below. Each step shrinks the distance by 0.8.' },
    { id: 'chs-009', type: 'mcq', level: 2, exams: ['gate', 'net'], sub: 'Lyapunov exponents',
      q: 'The doubling map $x_{n+1} = 2x_n \\bmod 1$ has Lyapunov exponent',
      options: ['$\\ln2$', '$2$', '$0$', '$-\\ln2$'], answer: 0,
      sol: '$|f\'(x)| = 2$ everywhere, so $\\lambda = \\ln2 \\approx 0.693$ per step: errors double each iteration. In binary, the map shifts the digits of $x$ one place left, so each step reveals one more digit of the initial condition: one bit of information per step.' },
    { id: 'chs-010', type: 'nat', level: 2, exams: ['gate', 'net'], sub: 'fractals',
      q: 'Each step of building the Koch curve replaces every segment by 4 segments, each one-third as long. The similarity dimension of the Koch curve is ______.',
      answer: 1.2619, tol: 0.002, calc: () => Math.log(4) / Math.log(3),
      sol: '$D = \\ln4/\\ln3 \\approx 1.262$. The length grows by $4/3$ at each stage and becomes infinite, but the curve does not fill an area: its dimension is between 1 and 2.' },
    { id: 'chs-011', type: 'nat', level: 2, exams: ['gate', 'net'], sub: 'Lorenz system',
      q: 'The Lorenz equations are $\\dot x = \\sigma(y - x)$, $\\dot y = rx - y - xz$, $\\dot z = xy - bz$, with $\\sigma = 10$, $b = 8/3$, $r = 28$. Phase-space volumes shrink as $V(t) = V_0e^{-kt}$. The value of $k$ is ______.',
      answer: 13.667, tol: 0.01, calc: () => 10 + 1 + 8 / 3,
      sol: 'The rate of change of volume is the divergence: $\\partial_x\\dot x + \\partial_y\\dot y + \\partial_z\\dot z = -\\sigma - 1 - b = -13.67$, the same everywhere. So $k = \\sigma + 1 + b \\approx 13.67$; volumes shrink by $e^{-13.67}$ per unit time, and the attractor has zero volume.' },
    { id: 'chs-012', type: 'mcq', level: 2, exams: ['gate', 'net'], sub: 'period doubling',
      q: `${LOG} At $r = 3$, what happens?`,
      options: ['The fixed point $x = 0$ becomes stable', 'The map becomes chaotic', 'A period-3 orbit appears', 'The fixed point $1 - 1/r$ loses stability as its multiplier passes $-1$, and a stable 2-cycle is born'], answer: 3,
      sol: 'At $r = 3$, $f\'(x^*) = 2 - r = -1$: a flip (period-doubling) bifurcation. Beyond it the iterates alternate between two values. The next doubling, to period 4, comes at $r = 1 + \\sqrt6 \\approx 3.449$, and chaos sets in near $r_\\infty \\approx 3.5699$.' },
    { id: 'chs-013', type: 'msq', level: 2, exams: ['gate', 'net'], sub: 'chaos',
      q: 'Which properties describe deterministic chaos?',
      options: ['The rule of evolution is completely deterministic', 'The long-term behaviour is aperiodic', 'Nearby initial conditions separate exponentially fast', 'It needs random noise to appear'], answer: [0, 1, 2],
      sol: 'Chaos is aperiodic long-term behaviour in a deterministic system that shows sensitive dependence on initial conditions. No randomness is put in: the apparent randomness comes from stretching and folding of phase space, which amplifies tiny uncertainties in the initial state.' },
    { id: 'chs-014', type: 'nat', level: 2, exams: ['gate', 'net'], sub: 'predictability',
      q: 'A chaotic map has Lyapunov exponent 0.5 per iteration. An initial uncertainty of $10^{-6}$ grows to order 1 after about ______ iterations.',
      answer: 27.6, tol: 0.3, calc: () => Math.log(1e6) / 0.5,
      sol: '$10^{-6}e^{0.5n} = 1$ gives $n = \\ln(10^6)/0.5 = 13.82/0.5 \\approx 27.6$. Improving the initial accuracy a million times more ($10^{-12}$) only doubles this horizon: predictability grows logarithmically with precision.' },
    { id: 'chs-015', type: 'mcq', level: 2, exams: ['gate', 'net'], sub: 'attractors',
      q: 'A strange attractor differs from a limit cycle or a stable fixed point in that it',
      options: ['repels nearby trajectories', 'exists only in Hamiltonian systems', 'has a fractal structure (non-integer dimension) and motion on it is sensitive to initial conditions', 'always contains exactly one fixed point'], answer: 2,
      sol: 'Like any attractor it pulls in a set of initial conditions (dissipative systems only). Inside it, nearby orbits separate exponentially, while the repeated stretching and folding gives it a Cantor-like layered structure of non-integer dimension (about 2.06 for the Lorenz attractor).' },
    { id: 'chs-016', type: 'mcq', level: 2, exams: ['net'], sub: 'Hénon map',
      q: 'The Hénon map is $x_{n+1} = 1 - ax_n^2 + y_n$, $y_{n+1} = bx_n$. Each iteration multiplies areas in the plane by',
      options: ['$|b|$', '$a$', '$1$', '$2ax$'], answer: 0,
      sol: 'The Jacobian matrix is $\\begin{pmatrix}-2ax & 1\\\\ b & 0\\end{pmatrix}$, with determinant $-b$, the same everywhere. So areas scale by $|b|$ per step (0.3 for the classic $a = 1.4$, $b = 0.3$): the map is dissipative and has a strange attractor.' },
    { id: 'chs-042', type: 'mcq', level: 2, exams: ['gate', 'net'], sub: 'maps',
      q: 'Which of these maps is invertible (each point has exactly one pre-image)?',
      options: ['The logistic map $x \\mapsto rx(1 - x)$', 'The tent map', 'The Hénon map with $b \\neq 0$', 'The doubling map $x \\mapsto 2x \\bmod 1$'], answer: 2,
      sol: 'The logistic, tent and doubling maps are two-to-one: two values of $x$ map to the same image (folding). The Hénon map can be inverted explicitly: $x_n = y_{n+1}/b$ and $y_n = x_{n+1} - 1 + ax_n^2$. That is why it can model a Poincaré section of a real (invertible) flow.' },

    // ---------- level 3 ----------
    { id: 'chs-017', type: 'nat', level: 3, exams: ['gate', 'net'], sub: 'period doubling',
      q: `${LOG} The 2-cycle points are $x_\\pm = \\dfrac{(r + 1)\\pm\\sqrt{(r - 3)(r + 1)}}{2r}$. For $r = 3.2$, the larger point of the cycle is ______.`,
      answer: 0.7995, tol: 0.001, calc: () => (4.2 + Math.sqrt(0.2 * 4.2)) / 6.4,
      sol: '$x_+ = \\dfrac{4.2 + \\sqrt{0.2\\times4.2}}{6.4} = \\dfrac{4.2 + 0.9165}{6.4} = 0.7995$; the other is $0.5130$. Check: $3.2\\times0.5130\\times0.4870 = 0.7995$, and $3.2\\times0.7995\\times0.2005 = 0.5130$.' },
    { id: 'chs-018', type: 'mcq', level: 3, exams: ['net'], sub: 'period doubling',
      q: `${LOG} The stable 2-cycle born at $r = 3$ itself loses stability (giving period 4) at`,
      options: ['$r = 3.000$', '$r = 1 + \\sqrt6 \\approx 3.449$', '$r = 3.570$', '$r = 1 + \\sqrt8 \\approx 3.828$'], answer: 1,
      sol: 'The 2-cycle\'s multiplier is $f\'(x_+)f\'(x_-) = r^2(1 - 2x_+)(1 - 2x_-) = 4 + 2r - r^2$. It reaches $-1$ when $r^2 - 2r - 5 = 0$: $r = 1 + \\sqrt6$. $3.570$ is the end of the cascade and $1 + \\sqrt8$ the start of the period-3 window.' },
    { id: 'chs-019', type: 'nat', level: 3, exams: ['gate', 'net'], sub: 'Lyapunov exponents',
      q: `${LYA} The tent map $x\\mapsto\\mu\\min(x, 1 - x)$ with $\\mu = 1.8$ has Lyapunov exponent ______.`,
      answer: 0.5878, tol: 0.005, calc: () => Math.log(1.8),
      sol: '$|f\'(x)| = \\mu$ at every point (except the peak), so every term in the sum is $\\ln\\mu$ and $\\lambda = \\ln1.8 \\approx 0.588$. Positive, so chaotic. The tent map is chaotic for every $1 < \\mu \\leq 2$.' },
    { id: 'chs-020', type: 'nat', level: 3, exams: ['net'], sub: 'Feigenbaum',
      q: 'The first three period-doubling points of the logistic map are $r_1 = 3$, $r_2 = 3.4495$ and $r_3 = 3.5441$. The estimate of Feigenbaum\'s $\\delta$ from them, $(r_2 - r_1)/(r_3 - r_2)$, is ______.',
      answer: 4.75, tol: 0.03, calc: () => (3.4495 - 3) / (3.5441 - 3.4495),
      sol: '$\\dfrac{0.4495}{0.0946} \\approx 4.75$, already close to the limit $\\delta = 4.669$ that later ratios approach.' },
    { id: 'chs-021', type: 'nat', level: 3, exams: ['net'], sub: 'Lorenz system',
      q: 'For the Lorenz system $\\dot x = \\sigma(y - x)$, $\\dot y = rx - y - xz$, $\\dot z = xy - bz$ with $r = 28$, the two non-trivial fixed points $C_\\pm$ have $z$-coordinate ______.',
      answer: 27, tol: 0, calc: () => 28 - 1,
      sol: '$\\dot x = 0$ gives $y = x$. Then $\\dot y = x(r - 1 - z) = 0$ gives $z = r - 1 = 27$ (for $x \\neq 0$), and $\\dot z = 0$ gives $x^2 = bz$, so $x = y = \\pm\\sqrt{b(r - 1)} = \\pm8.49$ for $b = 8/3$. These are the centres of the two "wings" of the butterfly; they are unstable for $r > 24.74$.' },
    { id: 'chs-022', type: 'mcq', level: 3, exams: ['net'], sub: 'maps',
      q: 'For a continuous map of an interval to itself, the existence of an orbit of period 3 implies',
      options: ['that the map is linear', 'that there are no other periodic orbits', 'that every orbit is periodic', 'that there are periodic orbits of every period (and chaotic orbits)'], answer: 3,
      sol: 'Sharkovskii\'s theorem (and the Li-Yorke paper "Period three implies chaos"): period 3 comes first in Sharkovskii\'s ordering, so it forces every other period. For the logistic map the period-3 window opens at $r = 1 + \\sqrt8$, deep in the chaotic region.' },
    { id: 'chs-023', type: 'nat', level: 3, exams: ['gate', 'net'], sub: 'fractals',
      q: 'The Sierpinski triangle consists of 3 copies of itself, each scaled by one half. Its similarity dimension is ______.',
      answer: 1.585, tol: 0.002, calc: () => Math.log(3) / Math.log(2),
      sol: '$D = \\ln3/\\ln2 \\approx 1.585$. Its area is zero (each step removes a quarter of the remainder) but it is more than a curve.' },
    { id: 'chs-024', type: 'msq', level: 3, exams: ['net'], sub: 'Lorenz system',
      q: 'For the Lorenz attractor at the classic parameters, which statements are correct?',
      options: ['The sum of the three Lyapunov exponents equals $-(\\sigma + 1 + b)$', 'Exactly one Lyapunov exponent is positive', 'Trajectories cross each other where the two wings meet', 'Its fractal dimension is slightly above 2'], answer: [0, 1, 3],
      sol: 'The exponents sum to the average divergence, $-(\\sigma + 1 + b) \\approx -13.67$; numerically they are about $0.91, 0, -14.57$. Trajectories never cross in phase space (uniqueness); the wings only look as if they meet in a 2-D projection. The Kaplan-Yorke dimension is $2 + 0.91/14.57 \\approx 2.06$.' },
    { id: 'chs-025', type: 'mcq', level: 3, exams: ['net'], sub: 'Hamiltonian chaos',
      q: 'The KAM (Kolmogorov-Arnold-Moser) theorem says that when an integrable Hamiltonian system is perturbed slightly,',
      options: ['all invariant tori are destroyed at once', 'most invariant tori, those with sufficiently irrational frequency ratios, survive slightly deformed', 'the motion becomes dissipative', 'only tori with rational frequency ratios survive'], answer: 1,
      sol: 'Tori whose frequency ratio is badly approximated by rationals survive small perturbations; resonant (rational) tori break up into chains of islands with chaotic layers between them. As the perturbation grows, more tori break; the last to go have frequency ratios related to the golden mean.' },
    { id: 'chs-026', type: 'nat', level: 3, exams: ['net'], sub: 'Lyapunov exponents',
      q: `${LOG} At $r = 4$ the map is fully chaotic. Its Lyapunov exponent is ______.`,
      answer: 0.6931, tol: 0.003, calc: () => Math.log(2),
      sol: 'The substitution $x = \\sin^2(\\pi\\theta/2)$ turns $x\\mapsto4x(1 - x)$ into the tent map $\\theta\\mapsto2\\min(\\theta, 1 - \\theta)$, whose $|f\'| = 2$ everywhere. Lyapunov exponents do not change under such a smooth change of variables, so $\\lambda = \\ln2 \\approx 0.693$.' },
    { id: 'chs-027', type: 'mcq', level: 3, exams: ['gate', 'net'], sub: 'Poincaré sections',
      q: 'On a Poincaré section of a three-dimensional flow, a periodic orbit appears as',
      options: ['a closed curve', 'a scattered cloud of points with fractal structure', 'a finite set of points', 'a straight line'], answer: 2,
      sol: 'A periodic orbit crosses the section at the same few points again and again: one point for a simple loop, $k$ points if it winds $k$ times. A quasi-periodic orbit on a torus fills a closed curve, and a chaotic orbit gives a scattered, fractal set of points.' },
    { id: 'chs-028', type: 'nat', level: 3, exams: ['gate', 'net'], sub: 'logistic map',
      q: `${LOG} A fixed point is superstable when $f\'(x^*) = 0$, i.e. it sits at the peak $x = 1/2$. The value of $r$ for which $x^* = 1 - 1/r$ is superstable is ______.`,
      answer: 2, tol: 0, calc: () => 1 / (1 - 0.5),
      sol: '$1 - 1/r = 1/2$ gives $r = 2$. There $f\'(x^*) = 2 - r = 0$, and the convergence is quadratic (the error is squared at each step), as in Newton\'s method.' },
    { id: 'chs-041', type: 'nat', level: 3, exams: ['net'], sub: 'period doubling',
      q: `${LOG} The multiplier of the 2-cycle, $f\'(x_+)f\'(x_-)$, equals $4 + 2r - r^2$. Its value at $r = 3.2$ is ______.`,
      answer: 0.16, tol: 0.005, calc: () => 4 + 6.4 - 3.2 * 3.2,
      sol: '$4 + 6.4 - 10.24 = 0.16$. Direct check with $x_+ = 0.7995$, $x_- = 0.5130$: $f\' = r(1 - 2x)$ gives $-1.917$ and $-0.083$, product $0.160$. Its magnitude is below 1, so the 2-cycle is stable at $r = 3.2$.' },

    // ---------- level 4 ----------
    { id: 'chs-029', type: 'nat', level: 4, exams: ['net'], sub: 'period doubling',
      q: `${LOG} The 2-cycle is superstable when it contains $x = 1/2$, i.e. $f(f(1/2)) = 1/2$. The value of $r > 3$ for which this happens is ______.`,
      answer: 3.236, tol: 0.002, calc: () => 1 + Math.sqrt(5),
      sol: '$f(1/2) = r/4$ and $f(r/4) = \\dfrac{r^2}{4}\\left(1 - \\dfrac r4\\right) = \\dfrac12$, so $r^3 - 4r^2 + 8 = 0$. Factor out $r = 2$ (the superstable fixed point): $(r - 2)(r^2 - 2r - 4) = 0$, giving $r = 1 + \\sqrt5 \\approx 3.236$.' },
    { id: 'chs-030', type: 'nat', level: 4, exams: ['gate', 'net'], sub: 'Lyapunov exponents',
      q: `${LOG} ${LYA} For $r = 2.5$, where the orbit converges to the fixed point, the Lyapunov exponent is ______.`,
      answer: -0.6931, tol: 0.005, calc: () => Math.log(Math.abs(2 - 2.5)),
      sol: 'Once the orbit sits at $x^*$, every term is $\\ln|f\'(x^*)| = \\ln|2 - r| = \\ln0.5 = -0.693$. A negative exponent means nearby orbits converge: no chaos. At $r = 2$ (superstable) it goes to $-\\infty$, and it touches 0 at each bifurcation.' },
    { id: 'chs-031', type: 'mcq', level: 4, exams: ['net'], sub: 'windows',
      q: `${LOG} The period-3 window opens at $r = 1 + \\sqrt8 \\approx 3.828$. By what kind of bifurcation does the stable 3-cycle appear?`,
      options: ['Period doubling', 'A tangent (saddle-node) bifurcation of the third iterate $f^3$', 'A Hopf bifurcation', 'A pitchfork bifurcation of $f$'], answer: 1,
      sol: 'Just below $r = 1 + \\sqrt8$ the graph of $f^3$ nearly touches the diagonal at three places; at the bifurcation it becomes tangent and a stable and an unstable 3-cycle are born together. Just before, orbits linger in the narrow channels (intermittency) between chaotic bursts.' },
    { id: 'chs-032', type: 'nat', level: 4, exams: ['net'], sub: 'fractals',
      q: 'Covering an attractor with boxes of side $\\epsilon$ needs $N = 200$ boxes for $\\epsilon = 0.1$ and $N = 6000$ for $\\epsilon = 0.01$. The box-counting dimension estimated from these two points is ______.',
      answer: 1.477, tol: 0.005, calc: () => Math.log(6000 / 200) / Math.log(10),
      sol: '$N \\propto \\epsilon^{-D}$, so $D = \\dfrac{\\ln(N_2/N_1)}{\\ln(\\epsilon_1/\\epsilon_2)} = \\dfrac{\\ln30}{\\ln10} = \\log_{10}30 \\approx 1.477$.' },
    { id: 'chs-033', type: 'mcq', level: 4, exams: ['net'], sub: 'Lorenz system',
      q: 'In the Lorenz system, what happens as $r$ increases through 1?',
      options: ['A Hopf bifurcation creates a limit cycle', 'The system becomes chaotic', 'The origin becomes a centre', 'The origin loses stability and the two fixed points $C_\\pm$ appear (a pitchfork bifurcation)'], answer: 3,
      sol: 'For $r < 1$ the origin is globally stable (the fluid stays at rest). At $r = 1$ an eigenvalue of the origin passes through 0 and the symmetric pair $C_\\pm$ (steady convection rolls turning either way) branch off: a supercritical pitchfork, thanks to the symmetry $(x, y)\\to(-x, -y)$. Chaos comes much later, near $r \\approx 24.7$.' },
    { id: 'chs-034', type: 'nat', level: 4, exams: ['net'], sub: 'Hénon map',
      q: 'For the Hénon map $x\' = 1 - ax^2 + y$, $y\' = bx$ with $a = 1.4$, $b = 0.3$, the fixed point with positive $x$ has $x =$ ______.',
      answer: 0.6314, tol: 0.002, calc: () => (-0.7 + Math.sqrt(0.49 + 5.6)) / 2.8,
      sol: 'A fixed point has $y = bx$ and $x = 1 - ax^2 + bx$, i.e. $ax^2 + (1 - b)x - 1 = 0$: $x = \\dfrac{-(1 - b) + \\sqrt{(1 - b)^2 + 4a}}{2a} = \\dfrac{-0.7 + \\sqrt{6.09}}{2.8} = 0.631$. It is a saddle that sits inside the attractor.' },
    { id: 'chs-035', type: 'msq', level: 4, exams: ['net'], sub: 'Lyapunov exponents',
      q: 'For a strange attractor of a smooth three-dimensional dissipative flow, which statements about the Lyapunov exponents are correct?',
      options: ['The signs are $(+, 0, -)$', 'Their sum is negative', 'All three can be positive', 'The zero exponent belongs to the direction along the flow'], answer: [0, 1, 3],
      sol: 'Chaos needs one positive exponent; a perturbation along the trajectory neither grows nor shrinks on average (exponent 0, for any flow that does not end at a fixed point); dissipation makes the sum negative, so the third is negative. All positive would mean volumes grow, impossible on a bounded attractor of a dissipative flow.' },
    { id: 'chs-036', type: 'mcq', level: 4, exams: ['net'], sub: 'Hamiltonian chaos',
      q: 'For the Chirikov standard map $p\' = p + K\\sin\\theta$, $\\theta\' = \\theta + p\'$, the last invariant curve that blocks unbounded growth of $p$ breaks at about',
      options: ['$K = 0.5$', '$K = 4.669$', '$K \\approx 0.97$', '$K = 2\\pi$'], answer: 2,
      sol: 'Greene\'s criterion puts the break-up of the last KAM curve (with golden-mean winding number) at $K_c \\approx 0.9716$. Below it, momentum stays bounded; above it, chaotic orbits can diffuse to arbitrarily large $p$ (global chaos). 4.669 is Feigenbaum\'s constant, unrelated.' },

    // ---------- level 5 ----------
    { id: 'chs-037', type: 'nat', level: 5, exams: ['net'], sub: 'Feigenbaum',
      q: 'Using $r_2 = 3.4495$, $r_3 = 3.5441$ and $\\delta = 4.669$, estimate the end of the period-doubling cascade $r_\\infty$ of the logistic map, assuming later intervals shrink by the factor $\\delta$ each time: ______.',
      answer: 3.5699, tol: 0.002, calc: () => 3.5441 + (3.5441 - 3.4495) / (4.669 - 1),
      sol: 'After $r_3$ the remaining intervals form a geometric series: $(r_3 - r_2)(1/\\delta + 1/\\delta^2 + \\dots) = \\dfrac{r_3 - r_2}{\\delta - 1} = \\dfrac{0.0946}{3.669} = 0.0258$. So $r_\\infty \\approx 3.5441 + 0.0258 = 3.5699$, matching the accurate value 3.56995.' },
    { id: 'chs-038', type: 'mcq', level: 5, exams: ['net'], sub: 'invariant density',
      q: `${LOG} At $r = 4$, a long orbit visits different parts of $[0, 1]$ with the invariant density`,
      options: ['$\\rho(x) = 1$ (uniform)', '$\\rho(x) = 6x(1 - x)$', '$\\rho(x) = 2x$', '$\\rho(x) = \\dfrac{1}{\\pi\\sqrt{x(1 - x)}}$'], answer: 3,
      sol: 'With $x = \\sin^2(\\pi\\theta/2)$ the map becomes the tent map, whose invariant density in $\\theta$ is uniform. Then $\\rho(x) = \\left|\\dfrac{d\\theta}{dx}\\right| = \\dfrac{1}{\\pi\\sqrt{x(1 - x)}}$: the orbit spends most time near the edges $x = 0$ and $x = 1$. Averaging $\\ln|4(1 - 2x)|$ with this density gives $\\lambda = \\ln2$.' },
    { id: 'chs-039', type: 'nat', level: 5, exams: ['net'], sub: 'Lyapunov exponents',
      q: 'A skew tent map rises with slope $1/a$ on $[0, a]$ and falls with slope $-1/(1 - a)$ on $[a, 1]$, and its invariant density is uniform. For $a = 0.25$, its Lyapunov exponent is ______.',
      answer: 0.5623, tol: 0.003, calc: () => 0.25 * Math.log(4) + 0.75 * Math.log(4 / 3),
      sol: 'With a uniform density, the orbit spends a fraction $a$ of its time on the steep branch and $1 - a$ on the other: $\\lambda = a\\ln\\dfrac1a + (1 - a)\\ln\\dfrac1{1 - a} = 0.25\\ln4 + 0.75\\ln\\tfrac43 = 0.347 + 0.216 = 0.562$. This is the entropy of the partition; it is largest, $\\ln2$, for the symmetric tent ($a = 1/2$).' },
    { id: 'chs-040', type: 'mcq', level: 5, exams: ['net'], sub: 'fractals',
      q: 'The Lyapunov exponents of the Lorenz attractor are about $0.906$, $0$ and $-14.572$. The Kaplan-Yorke dimension $D = j + \\dfrac{\\sum_{i\\leq j}\\lambda_i}{|\\lambda_{j+1}|}$, with $j$ the largest index for which the partial sum is still non-negative, is about',
      options: ['$2.06$', '$1.06$', '$2.94$', '$3.00$'], answer: 0,
      sol: 'Partial sums: $0.906$ ($j = 1$), $0.906$ ($j = 2$), $-13.67$ ($j = 3$, negative). So $j = 2$ and $D = 2 + 0.906/14.572 \\approx 2.06$: a surface-like object with fine fractal layering.' },
    ...more2,
    ...r4.items,
  ],
  gens: [
    { id: 'chs-g01', type: 'nat', level: 2, exams: ['gate', 'net'], sub: 'logistic map',
      make(r) {
        const rr = pick(r, 1.2, 3.8, 0.1), ask = choose(r, ['x', 'mult']);
        const answer = round(ask === 'x' ? 1 - 1 / rr : 2 - rr, 4);
        return { q: `${LOG} For $r = ${rr}$, find ${ask === 'x' ? 'the non-zero fixed point $x^*$' : 'the multiplier $f\'(x^*)$ at the non-zero fixed point'}.`,
          answer, tol: 0.001, rr, ask,
          sol: `$x^* = 1 - 1/r = ${round(1 - 1 / rr, 4)}$ and $f'(x^*) = r(1 - 2x^*) = 2 - r = ${round(2 - rr, 4)}$. Since $|2 - r| ${Math.abs(2 - rr) < 1 ? '< 1$, the point is stable' : '\\geq 1$, the point is unstable'}. Answer: ${answer}.` };
      },
      verify: (p) => { const x = 1 - 1 / p.rr; return p.ask === 'x' ? x : p.rr * (1 - 2 * x); } },
    { id: 'chs-g02', type: 'nat', level: 1, exams: ['gate', 'net'], sub: 'logistic map',
      make(r) {
        const rr = choose(r, [2, 2.5, 3, 3.2, 3.5, 3.9, 4]), x0 = pick(r, 0.1, 0.9, 0.1), n = int(r, 1, 3);
        let x = x0; const xs = []; for (let i = 0; i < n; i++) { x = rr * x * (1 - x); xs.push(round(x, 6)); }
        const answer = round(x, 5);
        return { q: `${LOG} With $r = ${rr}$ and $x_0 = ${x0}$, find $x_{${n}}$.`, answer, tol: 0.0005, rr, x0, n,
          sol: `${xs.map((v, i) => `$x_{${i + 1}} = ${v}$`).join(', ')}. Each step multiplies $r$ by the current $x$ and by $1 - x$.` };
      },
      verify: (p) => { let x = p.x0; for (let i = 0; i < p.n; i++) x = p.rr * x - p.rr * x * x; return x; } },
    { id: 'chs-g03', type: 'nat', level: 3, exams: ['net'], sub: 'period doubling',
      make(r) {
        const rr = pick(r, 3.05, 3.44, 0.01), which = choose(r, ['larger', 'smaller']);
        const s = Math.sqrt((rr - 3) * (rr + 1)), xp = (rr + 1 + s) / (2 * rr), xm = (rr + 1 - s) / (2 * rr);
        const answer = round(which === 'larger' ? xp : xm, 4);
        return { q: `${LOG} For $r = ${rr}$ the map has a stable 2-cycle. Find the ${which} of its two points.`,
          answer, tol: 0.001, rr, which,
          sol: `Solve $f(f(x)) = x$ and remove the fixed points: the 2-cycle satisfies $r^2x^2 - r(r + 1)x + (r + 1) = 0$, so $x_\\pm = \\dfrac{(r + 1)\\pm\\sqrt{(r - 3)(r + 1)}}{2r} = \\dfrac{${round(rr + 1, 2)}\\pm${round(s, 4)}}{${round(2 * rr, 2)}}$: $${round(xp, 4)}$ and $${round(xm, 4)}$.` };
      },
      verify: (p) => { let x = 0.3; for (let i = 0; i < 6000; i++) x = p.rr * x * (1 - x); const y = p.rr * x * (1 - x); return p.which === 'larger' ? Math.max(x, y) : Math.min(x, y); } },
    { id: 'chs-g04', type: 'nat', level: 2, exams: ['gate', 'net'], sub: 'Lyapunov exponents',
      make(r) {
        const kind = choose(r, ['tent', 'shift']);
        if (kind === 'tent') {
          const mu = pick(r, 1.1, 2, 0.1), answer = round(Math.log(mu), 4);
          return { q: `${LYA} Find the Lyapunov exponent of the tent map $x\\mapsto${mu}\\min(x, 1 - x)$.`, answer, tol: 0.003, kind, mu,
            sol: `$|f'| = ${mu}$ on both branches, so $\\lambda = \\ln${mu} = ${answer}$.` };
        }
        const k = int(r, 2, 10), answer = round(Math.log(k), 4);
        return { q: `${LYA} Find the Lyapunov exponent of the map $x\\mapsto${k}x \\bmod 1$.`, answer, tol: 0.003, kind, k,
          sol: `$|f'| = ${k}$ everywhere, so $\\lambda = \\ln${k} = ${answer}$: in base ${k} the map shifts the digits of $x$ one place each step.` };
      },
      verify: (p) => Math.log(p.kind === 'tent' ? p.mu : p.k) },
    { id: 'chs-g05', type: 'nat', level: 2, exams: ['gate', 'net'], sub: 'fractals',
      make(r) {
        const F = choose(r, [['the middle-thirds Cantor set', 2, 3], ['the Koch curve', 4, 3], ['the Sierpinski triangle', 3, 2], ['the Sierpinski carpet', 8, 3], ['the Menger sponge', 20, 3], ['the Vicsek fractal', 5, 3], ['a "Cantor dust" in the plane (product of two Cantor sets)', 4, 3], ['the middle-half Cantor set (keep the outer quarters)', 2, 4], ['the quadratic Koch curve (8 segments of 1/4 each)', 8, 4]]);
        const answer = round(Math.log(F[1]) / Math.log(F[2]), 4);
        return { q: `${F[0][0].toUpperCase() + F[0].slice(1)} is made of ${F[1]} copies of itself, each scaled down by a factor ${F[2]}. Find its similarity dimension.`,
          answer, tol: 0.002, N: F[1], s: F[2],
          sol: `$N = s^D$ gives $D = \\dfrac{\\ln N}{\\ln s} = \\dfrac{\\ln${F[1]}}{\\ln${F[2]}} = ${answer}$.` };
      },
      verify: (p) => Math.log10(p.N) / Math.log10(p.s) },
    { id: 'chs-g06', type: 'nat', level: 3, exams: ['gate', 'net'], sub: 'predictability',
      make(r) {
        const lam = pick(r, 0.1, 2, 0.1), e0 = choose(r, [6, 8, 10, 12, 15]), tol = choose(r, [0, 1, 2]), unit = choose(r, ['iterations', 'days']);
        const answer = round(Math.log(10 ** (e0 - tol)) / lam, 3);
        return { q: `A chaotic system has largest Lyapunov exponent ${lam} per ${unit === 'days' ? 'day' : 'iteration'}. An initial error of $10^{-${e0}}$ is acceptable up to $10^{-${tol}}$. How many ${unit} can be predicted?`,
          answer, tol: Math.max(0.05, answer * 0.005), lam, e0, tl: tol,
          sol: `The error grows as $\\delta_0e^{\\lambda t}$. Set $10^{-${e0}}e^{${lam}t} = 10^{-${tol}}$: $t = \\dfrac{${e0 - tol}\\ln10}{${lam}} = ${answer}$ ${unit}.`,
          trap: 'Doubling the precision of the initial data adds only $\\ln2/\\lambda$ to the horizon.' };
      },
      verify: (p) => (p.e0 - p.tl) * Math.LN10 / p.lam },
    { id: 'chs-g07', type: 'nat', level: 3, exams: ['net'], sub: 'Lorenz system',
      make(r) {
        const s = choose(r, [8, 10, 12, 16]), b = choose(r, [1, 2, 8 / 3, 3]), rr = choose(r, [5, 10, 13, 20, 28, 35]), ask = choose(r, ['xy', 'z', 'k']);
        const bs = b === 8 / 3 ? '8/3' : String(b);
        const answer = round(ask === 'xy' ? Math.sqrt(b * (rr - 1)) : ask === 'z' ? rr - 1 : s + 1 + b, 4);
        const what = { xy: 'the positive $x$-coordinate of the fixed point $C_+$', z: 'the $z$-coordinate of the fixed points $C_\\pm$', k: 'the rate $k$ in $V(t) = V_0e^{-kt}$ at which phase-space volumes shrink' }[ask];
        return { q: `For the Lorenz system $\\dot x = \\sigma(y - x)$, $\\dot y = rx - y - xz$, $\\dot z = xy - bz$ with $\\sigma = ${s}$, $b = ${bs}$, $r = ${rr}$, find ${what}.`,
          answer, tol: Math.max(0.002, answer * 0.002), s, b, rr, ask,
          sol: `Fixed points: $y = x$, $z = r - 1 = ${rr - 1}$, $x^2 = b(r - 1)$, so $x = \\pm\\sqrt{${bs}\\times${rr - 1}} = \\pm${round(Math.sqrt(b * (rr - 1)), 4)}$. The divergence of the flow is $-(\\sigma + 1 + b) = -${round(s + 1 + b, 4)}$, so $k = ${round(s + 1 + b, 4)}$. Answer: ${answer}.` };
      },
      verify: (p) => { if (p.ask === 'k') { const h = 1e-6, F = (x, y, z) => [p.s * (y - x), p.rr * x - y - x * z, x * y - p.b * z], X = [1, 2, 3], d = (i) => { const a = X.slice(), c = X.slice(); a[i] += h; c[i] -= h; return (F(...a)[i] - F(...c)[i]) / (2 * h); }; return -(d(0) + d(1) + d(2)); } const z = p.rr - 1; return p.ask === 'z' ? z : Math.sqrt(p.b * z); } },
    { id: 'chs-g08', type: 'nat', level: 4, exams: ['net'], sub: 'Feigenbaum',
      make(r) {
        const r1 = round(2.8 + r() * 0.4, 3), gap = round(0.2 + r() * 0.3, 3), ask = choose(r, ['next', 'inf']), d = 4.669;
        const r2 = round(r1 + gap, 3);
        const answer = round(ask === 'next' ? r2 + (r2 - r1) / d : r2 + (r2 - r1) / (d - 1), 4);
        return { q: `A one-humped map has period-doubling bifurcations at $r_1 = ${r1}$ and $r_2 = ${r2}$. Assuming each later interval is smaller by Feigenbaum's $\\delta = 4.669$, estimate ${ask === 'next' ? 'the next bifurcation point $r_3$' : 'the accumulation point $r_\\infty$ where chaos begins'}.`,
          answer, tol: 0.002, r1, r2, ask,
          sol: `${ask === 'next' ? `$r_3 \\approx r_2 + (r_2 - r_1)/\\delta = ${r2} + ${round(r2 - r1, 3)}/4.669 = ${answer}$.` : `The intervals after $r_2$ sum to $(r_2 - r_1)(1/\\delta + 1/\\delta^2 + \\dots) = (r_2 - r_1)/(\\delta - 1)$, so $r_\\infty \\approx ${r2} + ${round(r2 - r1, 3)}/3.669 = ${answer}$.`}` };
      },
      verify: (p) => { const g = p.r2 - p.r1; if (p.ask === 'next') return p.r2 + g / 4.669; let s = p.r2, t = g; for (let i = 0; i < 200; i++) { t /= 4.669; s += t; } return s; } },
    { id: 'chs-g09', type: 'nat', level: 3, exams: ['net'], sub: 'Hénon map',
      make(r) {
        const a = choose(r, [0.8, 1, 1.2, 1.4]), b = choose(r, [0.1, 0.2, 0.3, 0.4]), ask = choose(r, ['area', 'fixed']);
        if (ask === 'area') {
          const k = int(r, 2, 6), answer = round(b ** k, 8);
          return { q: `For the Hénon map $x' = 1 - ${a}x^2 + y$, $y' = ${b}x$, by what factor is the area of a small patch multiplied after ${k} iterations?`, answer, tol: answer * 0.005, a, b, k, ask,
            sol: `The Jacobian determinant is $-b$ everywhere, so each step multiplies areas by $|b| = ${b}$. After ${k} steps: $${b}^{${k}} = ${answer}$.` };
        }
        const answer = round((-(1 - b) + Math.sqrt((1 - b) ** 2 + 4 * a)) / (2 * a), 4);
        return { q: `For the Hénon map $x' = 1 - ${a}x^2 + y$, $y' = ${b}x$, find the $x$-coordinate of the fixed point with $x > 0$.`, answer, tol: 0.001, a, b, ask,
          sol: `Fixed point: $y = ${b}x$ and $x = 1 - ${a}x^2 + ${b}x$, i.e. $${a}x^2 + ${round(1 - b, 2)}x - 1 = 0$. $x = \\dfrac{-${round(1 - b, 2)} + \\sqrt{${round((1 - b) ** 2, 4)} + ${round(4 * a, 2)}}}{${round(2 * a, 2)}} = ${answer}$.` };
      },
      verify: (p) => { if (p.ask === 'area') { let A = 1; for (let i = 0; i < p.k; i++) A *= Math.abs(-p.b); return A; } let lo = 0, hi = 2; for (let i = 0; i < 80; i++) { const m = (lo + hi) / 2; if (1 - p.a * m * m + p.b * m - m > 0) lo = m; else hi = m; } return lo; } },
    { id: 'chs-g10', type: 'nat', level: 4, exams: ['net'], sub: 'fractals',
      make(r) {
        const D = pick(r, 1.1, 2.6, 0.05), e1 = choose(r, [0.1, 0.05, 0.2]), f = choose(r, [10, 4, 8]), N1 = int(r, 50, 500);
        const e2 = round(e1 / f, 5), N2 = Math.round(N1 * f ** D);
        const answer = round(Math.log(N2 / N1) / Math.log(f), 3);
        return { q: `Covering a set with boxes of side ${e1} takes ${N1} boxes; with boxes of side ${e2} it takes ${N2}. Estimate the box-counting dimension.`,
          answer, tol: 0.005, N1, N2, f,
          sol: `$N \\propto \\epsilon^{-D}$, so $D = \\dfrac{\\ln(N_2/N_1)}{\\ln(\\epsilon_1/\\epsilon_2)} = \\dfrac{\\ln(${N2}/${N1})}{\\ln${f}} = ${answer}$.` };
      },
      verify: (p) => Math.log10(p.N2 / p.N1) / Math.log10(p.f) },
    { id: 'chs-g11', type: 'mcq', level: 2, exams: ['gate', 'net'], sub: 'logistic map',
      make(r) {
        const cases = [
          [0.8, 'decays to the fixed point $x = 0$', 'For $r < 1$, $f\'(0) = r < 1$ and the population dies out.'],
          [2.2, 'settles to a stable fixed point', `For $1 < r < 3$ the orbit converges to $1 - 1/r$.`],
          [3.2, 'settles to a stable 2-cycle', 'Between $r = 3$ and $1 + \\sqrt6 \\approx 3.449$ the attractor is a 2-cycle.'],
          [3.5, 'settles to a stable 4-cycle', 'Between $3.449$ and $3.544$ the attractor is a 4-cycle.'],
          [3.835, 'settles to a stable 3-cycle', 'The period-3 window runs from $1 + \\sqrt8 \\approx 3.828$ to about 3.841.'],
          [4, 'is chaotic, filling the whole interval', 'At $r = 4$ the map is fully chaotic with $\\lambda = \\ln2$.'],
        ];
        const c = choose(r, cases);
        const o = mcqOptions(r, c[1], cases.filter((x) => x !== c).map((x) => x[1]), (v) => v);
        return { q: `${LOG} For $r = ${c[0]}$, the long-term behaviour of a typical orbit is that it`, ...o, sol: c[2] };
      } },
    { id: 'chs-g12', type: 'nat', level: 4, exams: ['gate', 'net'], sub: 'Lyapunov exponents',
      make(r) {
        const rr = choose(r, [1.2, 1.5, 1.8, 2.2, 2.5, 2.8, 2.9]);
        const answer = round(Math.log(Math.abs(2 - rr)), 4);
        return { q: `${LOG} ${LYA} For $r = ${rr}$, find the Lyapunov exponent of a typical orbit.`, answer, tol: 0.005, rr,
          sol: `For $1 < r < 3$ the orbit converges to $x^* = 1 - 1/r$, where $|f'(x^*)| = |2 - r| = ${round(Math.abs(2 - rr), 4)}$. The average of $\\ln|f'|$ is then $\\ln${round(Math.abs(2 - rr), 4)} = ${answer}$: negative, so not chaotic.` };
      },
      verify: (p) => { let x = 0.3, s = 0; for (let i = 0; i < 3000; i++) x = p.rr * x * (1 - x); for (let i = 0; i < 2000; i++) { s += Math.log(Math.abs(p.rr * (1 - 2 * x))); x = p.rr * x * (1 - x); } return s / 2000; } },
    ...more,
    ...r4.gens,
  ],
};
