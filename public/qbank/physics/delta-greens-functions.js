// The Dirac delta and Green's functions: sifting, scaling and composition rules, derivatives of the delta, delta
// sequences and the Fourier representation, the delta in three dimensions, Green's functions for boundary value
// problems (jump conditions, reciprocity, existence), causal Green's functions of oscillators and first-order systems,
// the Poisson, Helmholtz, screened and heat kernels.
// Original questions for GATE and CSIR NET practice (fibub). Levels: 1 warm-up ... 5 top rank.
import { int, choose, mcqOptions, round } from '../_util.js';
import more from './delta-greens-functions.more.gen.js';
import more2 from './delta-greens-functions.more2.gen.js';
import r4 from './delta-greens-functions.r4.gen.js';

const sgn = (v) => (v < 0 ? `- ${-v}` : `+ ${v}`);
const tm = (c, v) => (c === 0 ? '' : ` ${c < 0 ? '-' : '+'} ${Math.abs(c) === 1 ? '' : Math.abs(c)}${v}`); // signed term
const pw = (n) => (n === 1 ? 'x' : `x^{${n}}`);
const sh = (v) => (v === 0 ? '' : ` ${sgn(v)}`); // x - a written as x + sh(-a)
// RK4 for x'' = F(t) - g x' - w2 x (unit mass), from (x0, v0) to time T
const rk4 = (F, g, w2, x0, v0, T, n = 4000) => {
  let x = x0, v = v0, t = 0; const h = T / n, f = (t, x, v) => [v, F(t) - g * v - w2 * x];
  for (let i = 0; i < n; i++) { const k1 = f(t, x, v), k2 = f(t + h / 2, x + (h / 2) * k1[0], v + (h / 2) * k1[1]), k3 = f(t + h / 2, x + (h / 2) * k2[0], v + (h / 2) * k2[1]), k4 = f(t + h, x + h * k3[0], v + h * k3[1]); x += (h / 6) * (k1[0] + 2 * k2[0] + 2 * k3[0] + k4[0]); v += (h / 6) * (k1[1] + 2 * k2[1] + 2 * k3[1] + k4[1]); t += h; }
  return x;
};

export default {
  topic: 'delta-greens-functions',
  items: [
    // ---------- level 1 ----------
    { id: 'dgf-001', type: 'nat', level: 1, exams: ['gate', 'net', 'jam'], sub: 'sifting',
      q: 'The value of $\\displaystyle\\int_{-\\infty}^{\\infty}(x^2 + 3)\\,\\delta(x - 2)\\,dx$ is ______.',
      answer: 7, tol: 0, calc: () => 4 + 3,
      sol: 'The delta picks out the value of the rest of the integrand where its argument vanishes: $x = 2$, giving $4 + 3 = 7$.',
      trap: 'Evaluating at $x = 0$ out of habit gives 3.' },
    { id: 'dgf-002', type: 'mcq', level: 1, exams: ['gate', 'net', 'jam'], sub: 'scaling',
      q: 'The distribution $\\delta(3x)$ equals',
      options: ['$3\\,\\delta(x)$', '$\\delta(x)$', '$\\delta(x)/3$', '$\\delta(x/3)$'], answer: 2,
      sol: 'Substitute $u = 3x$: $\\int f(x)\\delta(3x)\\,dx = \\int f(u/3)\\delta(u)\\frac{du}{3} = \\frac{f(0)}{3}$. So $\\delta(ax) = \\delta(x)/|a|$. The spike is three times narrower, so it holds a third of the area.',
      trap: 'Pulling the 3 out as a factor: the delta is not linear in its argument.' },
    { id: 'dgf-003', type: 'mcq', level: 1, exams: ['gate', 'net', 'jam'], sub: 'step function',
      q: 'The derivative of the Heaviside step function $\\theta(x)$ (0 for $x < 0$, 1 for $x > 0$) is',
      options: ['$0$ everywhere', '$\\delta(x)$', '$\\delta\'(x)$', '$1/x$'], answer: 1,
      sol: 'For any smooth $f$ that vanishes at infinity: $\\int f\\theta\'\\,dx = -\\int f\'\\theta\\,dx = -\\int_0^\\infty f\'\\,dx = f(0)$. That is the action of $\\delta(x)$. A unit jump differentiates into a unit spike.',
      trap: 'The derivative is 0 everywhere except at one point, but that point carries all the area.' },
    { id: 'dgf-004', type: 'mcq', level: 1, exams: ['gate', 'net'], sub: 'dimensions',
      q: 'If $x$ is a length measured in metres, the unit of $\\delta(x)$ is',
      options: ['m', 'dimensionless', 'm²', 'm⁻¹'], answer: 3,
      sol: '$\\int\\delta(x)\\,dx = 1$ is a pure number and $dx$ is in metres, so $\\delta(x)$ is in m⁻¹. Likewise $\\delta^3(\\mathbf r)$ is in m⁻³, which is why a point charge density is $q\\,\\delta^3(\\mathbf r)$ in C/m³.',
      trap: 'Treating the delta as a pure number like 0 or 1.' },
    { id: 'dgf-005', type: 'mcq', level: 1, exams: ['gate', 'net', 'jam'], sub: 'sifting',
      q: 'The value of $\\displaystyle\\int_{-\\infty}^{\\infty}\\cos x\\,\\delta(x - \\pi)\\,dx$ is',
      options: ['$1$', '$0$', '$-1$', '$\\pi$'], answer: 2,
      sol: 'Sifting: $\\cos\\pi = -1$.',
      trap: 'Answering $\\pi$, the location of the spike, instead of the value of the function there.' },
    { id: 'dgf-006', type: 'msq', level: 1, exams: ['gate', 'net'], sub: 'properties',
      q: 'Which of these hold (as distributions)?',
      options: ['$x\\,\\delta(x) = 0$', '$\\delta(-x) = \\delta(x)$', '$\\int_1^2\\delta(x)\\,dx = 1$', '$f(x)\\,\\delta(x - a) = f(a)\\,\\delta(x - a)$'], answer: [0, 1, 3],
      sol: '$\\int g(x)\\,x\\,\\delta(x)dx = 0\\cdot g(0) = 0$. $\\delta(-x) = \\delta(x)/|-1|$. The product rule $f\\delta(x - a) = f(a)\\delta(x - a)$ is sifting. But $[1, 2]$ does not contain $x = 0$, so that integral is 0.',
      trap: 'The delta contributes only if its spike lies inside the range of integration.' },

    // ---------- level 2 ----------
    { id: 'dgf-007', type: 'nat', level: 2, exams: ['gate', 'net'], sub: 'composition',
      q: 'The value of $\\displaystyle\\int_{-\\infty}^{\\infty}x^2\\,\\delta(x^2 - 4)\\,dx$ is ______.',
      answer: 2, tol: 0, calc: () => (4 + 4) / 4,
      sol: 'For $\\delta(g(x))$ use $\\sum_i\\frac{\\delta(x - x_i)}{|g\'(x_i)|}$ over the simple roots. $g = x^2 - 4$ has roots $\\pm2$ with $|g\'| = 4$. So the integral is $\\frac{4}{4} + \\frac{4}{4} = 2$.',
      trap: 'Keeping only the root $x = 2$, or forgetting to divide by $|g\'|$.' },
    { id: 'dgf-008', type: 'mcq', level: 2, exams: ['gate', 'net'], sub: 'derivative of delta',
      q: 'For a smooth $f$, $\\displaystyle\\int_{-\\infty}^{\\infty}f(x)\\,\\delta\'(x)\\,dx$ equals',
      options: ['$f\'(0)$', '$f(0)$', '$0$', '$-f\'(0)$'], answer: 3,
      sol: 'Integrate by parts; the boundary term vanishes: $\\int f\\delta\'\\,dx = [f\\delta] - \\int f\'\\delta\\,dx = -f\'(0)$. In general $\\int f\\delta^{(n)}dx = (-1)^nf^{(n)}(0)$.',
      trap: 'The sign: each derivative moved across costs a factor $-1$.' },
    { id: 'dgf-009', type: 'nat', level: 2, exams: ['gate', 'net'], sub: 'derivative of delta',
      q: 'The value of $\\displaystyle\\int_{-\\infty}^{\\infty}e^{2x}\\,\\delta\'(x)\\,dx$ is ______.',
      answer: -2, tol: 0, calc: () => -2 * Math.exp(0),
      sol: '$\\int f\\delta\' = -f\'(0)$ with $f = e^{2x}$, $f\' = 2e^{2x}$: $-2$.',
      trap: 'Answering $+2$ by forgetting the minus sign from integration by parts.' },
    { id: 'dgf-010', type: 'mcq', level: 2, exams: ['gate', 'net'], sub: 'Fourier representation',
      q: 'Which integral representation of $\\delta(x)$ is correct?',
      options: ['$\\delta(x) = \\dfrac{1}{2\\pi}\\displaystyle\\int_{-\\infty}^{\\infty}e^{ikx}\\,dk$', '$\\delta(x) = \\displaystyle\\int_{-\\infty}^{\\infty}e^{ikx}\\,dk$', '$\\delta(x) = \\dfrac{1}{\\sqrt{2\\pi}}\\displaystyle\\int_{-\\infty}^{\\infty}e^{-k^2x}\\,dk$', '$\\delta(x) = \\dfrac{1}{2\\pi}\\displaystyle\\int_{0}^{\\infty}\\cos kx\\,dk$'], answer: 0,
      sol: 'The Fourier transform of $\\delta$ is $\\int\\delta(x)e^{-ikx}dx = 1$; inverting, $\\delta(x) = \\frac{1}{2\\pi}\\int e^{ikx}dk$. (Using cosines, $\\frac1\\pi\\int_0^\\infty\\cos kx\\,dk$; the last option has the wrong factor.)',
      trap: 'The $2\\pi$: check by integrating over $x$, which gives $2\\pi\\delta(k)$ and then 1.' },
    { id: 'dgf-011', type: 'msq', level: 2, exams: ['gate', 'net'], sub: 'delta sequences',
      q: 'As $\\varepsilon \\to 0^+$, which of these tend to $\\delta(x)$?',
      options: ['$\\dfrac{1}{\\varepsilon\\sqrt\\pi}e^{-x^2/\\varepsilon^2}$', '$\\dfrac{1}{\\pi}\\dfrac{\\varepsilon}{x^2 + \\varepsilon^2}$', '$\\dfrac{1}{2\\varepsilon}$ for $|x| < \\varepsilon$, and 0 otherwise', '$\\dfrac{1}{\\varepsilon}e^{-|x|/\\varepsilon}$'], answer: [0, 1, 2],
      sol: 'A delta sequence needs area 1 and a width shrinking to zero. The Gaussian, the Lorentzian and the box all have area 1. $\\int\\frac1\\varepsilon e^{-|x|/\\varepsilon}dx = 2$, so that sequence tends to $2\\delta(x)$; it needs $\\frac{1}{2\\varepsilon}$ in front.',
      trap: 'Check the area before trusting the shape.' },
    { id: 'dgf-012', type: 'mcq', level: 2, exams: ['gate', 'net'], sub: 'scaling',
      q: 'The value of $\\displaystyle\\int_{-\\infty}^{\\infty}x^3\\,\\delta(2x - 6)\\,dx$ is',
      options: ['$27$', '$13.5$', '$54$', '$108$'], answer: 1,
      sol: '$\\delta(2x - 6) = \\delta(2(x - 3)) = \\frac12\\delta(x - 3)$. So the integral is $\\frac12\\cdot27 = 13.5$.',
      trap: 'Evaluating $x^3$ at the root but forgetting the $1/|a|$ factor.' },
    { id: 'dgf-013', type: 'mcq', level: 2, exams: ['gate', 'net'], sub: 'Green\'s function',
      q: 'For a linear differential operator $\\hat L$, the Green\'s function $G(x, x\')$ is defined by',
      options: ['$\\hat LG(x, x\') = 0$', '$\\hat LG(x, x\') = 1$', '$\\hat LG(x, x\') = \\delta(x - x\')$, with the boundary conditions of the problem', '$G(x, x\') = \\hat L\\delta(x - x\')$'], answer: 2,
      sol: '$G$ is the response at $x$ to a unit point source at $x\'$, satisfying the same homogeneous boundary conditions as the problem. Then $u(x) = \\int G(x, x\')f(x\')\\,dx\'$ solves $\\hat Lu = f$, because $\\hat L$ acts on $x$ and $\\int\\delta(x - x\')f(x\')dx\' = f(x)$.',
      trap: 'Forgetting that $G$ also carries the boundary conditions.' },
    { id: 'dgf-014', type: 'mcq', level: 2, exams: ['gate', 'net'], sub: 'delta in 3D',
      q: 'The Laplacian of $1/r$ (with $r = |\\mathbf r|$) is',
      options: ['$0$ everywhere', '$4\\pi\\,\\delta^3(\\mathbf r)$', '$-\\delta^3(\\mathbf r)$', '$-4\\pi\\,\\delta^3(\\mathbf r)$'], answer: 3,
      sol: 'For $r \\ne 0$, $\\nabla^2(1/r) = 0$. But the flux of $\\nabla(1/r) = -\\hat r/r^2$ through any sphere is $-4\\pi$, so by the divergence theorem the volume integral of $\\nabla^2(1/r)$ is $-4\\pi$: all concentrated at the origin. Hence $\\nabla^2\\frac1r = -4\\pi\\delta^3(\\mathbf r)$; Coulomb\'s law and Gauss\'s law are this identity.',
      trap: '"Zero everywhere" misses the point source.' },
    { id: 'dgf-015', type: 'mcq', level: 2, exams: ['gate', 'net'], sub: 'delta in 3D',
      q: 'If $|\\mathbf r_0| = 2$, then $\\displaystyle\\int_{\\text{all space}}e^{-r}\\,\\delta^3(\\mathbf r - \\mathbf r_0)\\,d^3r$ equals',
      options: ['$e^{-2}/(16\\pi)$', '$4\\pi e^{-2}$', '$e^{-2}$', '$1$'], answer: 2,
      sol: 'The three-dimensional delta sifts just like the one-dimensional one: the integral is $e^{-|\\mathbf r_0|} = e^{-2} \\approx 0.135$. No $4\\pi r^2$ factor appears, because $\\delta^3$ already absorbs the volume element.',
      trap: 'Adding a $4\\pi r^2$ Jacobian by hand.' },
    { id: 'dgf-016', type: 'mcq', level: 2, exams: ['gate', 'net'], sub: 'jump conditions',
      q: '$G(x, x\')$ solves $\\dfrac{d^2G}{dx^2} = \\delta(x - x\')$ on $[0, L]$ with $G = 0$ at both ends. Across $x = x\'$, the slope $\\partial G/\\partial x$',
      options: ['is continuous', 'jumps by $+1$', 'jumps by $-1$', 'becomes infinite'], answer: 1,
      sol: 'Integrate the equation from $x\' - \\varepsilon$ to $x\' + \\varepsilon$: $[G_x]_{x\'-}^{x\'+} = 1$. $G$ itself is continuous (a jump in $G$ would make $G\'\'$ contain $\\delta\'$).',
      trap: 'Thinking $G$ jumps: it is the derivative that jumps, giving a kink (a "tent" shape).' },

    // ---------- level 3 ----------
    { id: 'dgf-017', type: 'nat', level: 3, exams: ['gate', 'net'], sub: 'boundary value problems',
      q: 'Solve $y\'\' = 1$ on $[0, 1]$ with $y(0) = y(1) = 0$ (for example with the Green\'s function $G = x_<(x_> - 1)$). The value $y(0.3)$ is ______ (to three decimal places).',
      answer: -0.105, tol: 0.001, calc: () => (0.3 * (0.3 - 1)) / 2,
      sol: '$y(x) = \\int_0^1G(x, x\')\\cdot1\\,dx\' = (x - 1)\\int_0^xx\'dx\' + x\\int_x^1(x\' - 1)dx\' = \\frac{(x - 1)x^2}{2} - \\frac{x(1 - x)^2}{2} = \\frac{x(x - 1)}{2}$. Check: $y\'\' = 1$ and both ends are 0. At $x = 0.3$: $\\frac{0.3\\times(-0.7)}{2} = -0.105$.',
      trap: 'Sign: $G \\le 0$ here, because $y\'\' > 0$ with zero ends means the curve sags below the axis.' },
    { id: 'dgf-018', type: 'mcq', level: 3, exams: ['gate', 'net'], sub: 'boundary value problems',
      q: 'The Green\'s function for $\\dfrac{d^2}{dx^2}$ on $[0, 1]$ with $G(0, x\') = G(1, x\') = 0$ is ($x_<$ and $x_>$ are the smaller and larger of $x$ and $x\'$)',
      options: ['$x_>(x_< - 1)$', '$x_<(x_> - 1)$', '$|x - x\'|$', '$\\tfrac12|x - x\'|$'], answer: 1,
      sol: 'Left of $x\'$ the solution of $G\'\' = 0$ vanishing at 0 is $Ax$; right of it, vanishing at 1, is $B(x - 1)$. Continuity at $x\'$ and a slope jump of $+1$ give $A = x\' - 1$, $B = x\'$. So $G = x_<(x_> - 1)$. $\\tfrac12|x - x\'|$ is the whole-line Green\'s function, which ignores the end conditions.',
      trap: 'Using the free-space Green\'s function in a bounded problem.' },
    { id: 'dgf-019', type: 'nat', level: 3, exams: ['gate', 'net'], sub: 'composition',
      q: 'The value of $\\displaystyle\\int_0^4x^2\\,\\delta(\\sin x)\\,dx$ is ______ (to two decimal places).',
      answer: 9.87, tol: 0.01, calc: () => Math.PI ** 2,
      sol: '$\\sin x = 0$ at $x = 0, \\pi, 2\\pi, \\ldots$; inside $(0, 4)$ only $x = \\pi$ (as $2\\pi \\approx 6.28 > 4$, and the endpoint 0 has $x^2 = 0$ anyway). There $|\\cos\\pi| = 1$. Result: $\\pi^2 \\approx 9.87$.',
      trap: 'Including $2\\pi$, which lies outside the range.' },
    { id: 'dgf-020', type: 'msq', level: 3, exams: ['gate', 'net'], sub: 'causal Green\'s functions',
      q: 'For the underdamped oscillator $m\\ddot x + m\\gamma\\dot x + m\\omega_0^2x = F(t)$, let $G(t)$ be the causal (retarded) Green\'s function, so that $x(t) = \\int G(t - t\')F(t\')\\,dt\'$. Which statements are true?',
      options: ['$G(t) = 0$ for $t < 0$', '$G$ contains a delta function at $t = 0$', '$G(t) = \\theta(t)\\dfrac{e^{-\\gamma t/2}\\sin\\omega_1t}{m\\omega_1}$ with $\\omega_1 = \\sqrt{\\omega_0^2 - \\gamma^2/4}$', '$G$ is continuous at $t = 0$ while $\\dot G$ jumps by $1/m$'], answer: [0, 2, 3],
      sol: 'Causality: no response before the kick. Integrating the equation across $t = 0$: $m[\\dot G] = 1$, so $\\dot G$ jumps from 0 to $1/m$ while $G$ stays 0: a kicked mass starts at rest position with velocity $1/m$. For $t > 0$ it is a free damped oscillation with those initial values, which gives the formula. A delta in $G$ itself would make $\\ddot G$ contain $\\delta\'\'$, which nothing on the right-hand side balances.',
      trap: 'The impulse changes velocity, not position.' },
    { id: 'dgf-021', type: 'nat', level: 3, exams: ['gate', 'net'], sub: 'impulse response',
      q: 'A 2 kg mass on a spring of stiffness 8 N/m rests at equilibrium. At $t = 0$ it receives an impulse of 4 N s. Its displacement at $t = 0.5$ s is ______ m (to three decimal places).',
      answer: 0.841, tol: 0.002, calc: () => (4 / (2 * 2)) * Math.sin(2 * 0.5), unit: 'm',
      sol: '$\\omega_0 = \\sqrt{8/2} = 2$ rad/s. The response is $P\\,G(t) = \\frac{P}{m\\omega_0}\\sin\\omega_0t = \\frac{4}{2\\times2}\\sin2t = \\sin2t$. At $t = 0.5$: $\\sin1 = 0.841$ m.',
      trap: 'Dividing by $k$ instead of $m\\omega_0$.' },
    { id: 'dgf-022', type: 'mcq', level: 3, exams: ['gate', 'net'], sub: 'Poisson equation',
      q: 'The Green\'s function satisfying $\\nabla^2G(\\mathbf r, \\mathbf r\') = \\delta^3(\\mathbf r - \\mathbf r\')$ in all space, vanishing at infinity, is',
      options: ['$\\dfrac{1}{4\\pi|\\mathbf r - \\mathbf r\'|}$', '$-\\dfrac{1}{4\\pi|\\mathbf r - \\mathbf r\'|}$', '$-\\dfrac{1}{|\\mathbf r - \\mathbf r\'|}$', '$\\dfrac{1}{2\\pi}\\ln|\\mathbf r - \\mathbf r\'|$'], answer: 1,
      sol: 'From $\\nabla^2\\frac1r = -4\\pi\\delta^3$: $\\nabla^2\\left(-\\frac{1}{4\\pi r}\\right) = \\delta^3$. Applied to $\\nabla^2V = -\\rho/\\varepsilon_0$ this gives Coulomb\'s potential $V = \\frac{1}{4\\pi\\varepsilon_0}\\int\\frac{\\rho(\\mathbf r\')}{|\\mathbf r - \\mathbf r\'|}d^3r\'$. The logarithm is the two-dimensional Green\'s function.',
      trap: 'The sign depends on whether the equation is $\\nabla^2G = \\delta$ or $-\\nabla^2G = \\delta$; read it.' },
    { id: 'dgf-023', type: 'mcq', level: 3, exams: ['gate', 'net'], sub: 'Poisson equation',
      q: 'In two dimensions, a solution of $\\nabla^2G = \\delta^2(\\mathbf r - \\mathbf r\')$ is',
      options: ['$\\dfrac{1}{2\\pi}\\ln|\\mathbf r - \\mathbf r\'|$', '$-\\dfrac{1}{4\\pi|\\mathbf r - \\mathbf r\'|}$', '$\\dfrac{1}{2\\pi|\\mathbf r - \\mathbf r\'|}$', '$|\\mathbf r - \\mathbf r\'|^2/4$'], answer: 0,
      sol: 'With $\\rho = |\\mathbf r - \\mathbf r\'|$: $\\nabla(\\frac{1}{2\\pi}\\ln\\rho) = \\frac{\\hat\\rho}{2\\pi\\rho}$, whose flux through any circle is $\\frac{1}{2\\pi\\rho}\\cdot2\\pi\\rho = 1$. So its Laplacian is a unit delta. This is the potential of a line charge (per unit length).',
      trap: 'Using the 3D form $1/r$, whose flux through a circle is not constant.' },
    { id: 'dgf-024', type: 'mcq', level: 3, exams: ['gate', 'net'], sub: 'Fourier representation',
      q: 'Using $\\frac{1}{2\\pi}\\int e^{ik(x - a)}dk = \\delta(x - a)$, the double integral $\\displaystyle\\frac{1}{2\\pi}\\int_{-\\infty}^{\\infty}dx\\int_{-\\infty}^{\\infty}dk\\;x^2e^{ik(x - 3)}$ equals',
      options: ['$3$', '$6$', '$9$', '$2\\pi\\cdot9$'], answer: 2,
      sol: 'Do the $k$ integral first: it gives $\\delta(x - 3)$ (the $\\frac{1}{2\\pi}$ is already there). Then $\\int x^2\\delta(x - 3)dx = 9$.',
      trap: 'Leaving an extra $2\\pi$.' },
    { id: 'dgf-025', type: 'msq', level: 3, exams: ['gate', 'net'], sub: 'Green\'s function',
      q: 'Which statements about Green\'s functions are true?',
      options: ['$G$ depends on both the operator and the boundary conditions', 'Once $G$ is known, the solution for any source follows by superposition', 'The method works just as well for non-linear equations', 'For a self-adjoint operator with homogeneous boundary conditions, $G(x, x\') = G(x\', x)$'], answer: [0, 1, 3],
      sol: 'The whole method rests on linearity: a source is a sum of point sources, so the response is the same sum of point responses. It fails for non-linear equations. Reciprocity $G(x, x\') = G(x\', x)$ holds for self-adjoint (Sturm–Liouville) problems: the response at $A$ to a source at $B$ equals the response at $B$ to a source at $A$. Causal Green\'s functions in time are not symmetric.',
      trap: 'Non-linear equations break superposition.' },
    { id: 'dgf-026', type: 'nat', level: 3, exams: ['gate', 'net'], sub: 'composition',
      q: 'The value of $\\displaystyle\\int_{-\\infty}^{\\infty}x^3\\,\\delta(x^2 - 3x + 2)\\,dx$ is ______.',
      answer: 9, tol: 0, calc: () => 1 / 1 + 8 / 1,
      sol: '$g = (x - 1)(x - 2)$, $g\' = 2x - 3$: $|g\'(1)| = 1$, $|g\'(2)| = 1$. The integral is $\\frac{1}{1} + \\frac{8}{1} = 9$.',
      trap: 'Forgetting the absolute value: $g\'(1) = -1$, and a negative weight would give $7$.' },
    { id: 'dgf-027', type: 'mcq', level: 3, exams: ['gate', 'net'], sub: 'causal Green\'s functions',
      q: 'The causal Green\'s function of $\\dfrac{dy}{dt} + ay = f(t)$ (with $a > 0$) is',
      options: ['$\\theta(t)e^{-at}$', '$e^{-a|t|}/2a$', '$\\theta(t)e^{at}$', '$\\theta(-t)e^{-at}$'], answer: 0,
      sol: '$G\' + aG = \\delta(t)$ with $G = 0$ for $t < 0$. Integrating across 0: $G(0^+) = 1$. For $t > 0$, $G = e^{-at}$. So $G = \\theta(t)e^{-at}$: an RC circuit or a cooling body responding to a sudden kick.',
      trap: '$e^{-a|t|}/2a$ is the symmetric Green\'s function of a second-order operator, not a causal first-order one.' },
    { id: 'dgf-028', type: 'nat', level: 3, exams: ['gate', 'net'], sub: 'causal Green\'s functions',
      q: 'For $\\dfrac{dy}{dt} + 2y = \\theta(t)$ with $y = 0$ for $t < 0$, the value $y(1)$ is ______ (to three decimal places).',
      answer: 0.432, tol: 0.002, calc: () => (1 - Math.exp(-2)) / 2,
      sol: '$y(t) = \\int_0^tG(t - t\')\\cdot1\\,dt\' = \\int_0^te^{-2(t - t\')}dt\' = \\frac{1 - e^{-2t}}{2}$. At $t = 1$: $\\frac{1 - 0.1353}{2} = 0.432$.',
      trap: 'Using the steady value $\\tfrac12$ before the transient has died away.' },

    // ---------- level 4 ----------
    { id: 'dgf-029', type: 'nat', level: 4, exams: ['gate', 'net'], sub: 'boundary value problems',
      q: 'The Green\'s function of $y\'\' + k^2y$ on $[0, L]$ with $y(0) = y(L) = 0$ is $G = \\dfrac{\\sin(kx_<)\\sin(k(x_> - L))}{k\\sin kL}$. With $L = \\pi$ and $k = \\tfrac12$, solve $y\'\' + k^2y = \\delta(x - \\pi/2)$ and give $y(\\pi/2)$: ______',
      answer: -1, tol: 0.01, calc: () => (Math.sin(Math.PI / 4) * Math.sin(Math.PI / 4 - Math.PI / 2)) / (0.5 * Math.sin(Math.PI / 2)),
      sol: '$y(\\pi/2) = G(\\pi/2, \\pi/2) = \\frac{\\sin(\\pi/4)\\sin(-\\pi/4)}{\\frac12\\sin(\\pi/2)} = \\frac{-\\frac12}{\\frac12} = -1$. Check the jump: $\\partial_xG$ just right minus just left is $\\frac{\\sin(kx\')\\cos(k(x\' - L)) - \\cos(kx\')\\sin(k(x\' - L))}{\\sin kL} = 1$ ✓.',
      trap: 'Dropping the $k$ in the denominator.' },
    { id: 'dgf-030', type: 'mcq', level: 4, exams: ['gate', 'net'], sub: 'existence',
      q: 'The Green\'s function in the previous setting ($y\'\' + k^2y$, zero ends at 0 and $L$) fails to exist when',
      options: ['$kL = n\\pi$ for an integer $n \\ge 1$', '$kL = (n + \\tfrac12)\\pi$', '$k = 0$', '$k$ is negative'], answer: 0,
      sol: 'When $\\sin kL = 0$ the homogeneous equation has the non-zero solution $\\sin kx$ satisfying both end conditions. Then a solution of $\\hat Ly = f$ exists only if $f$ is orthogonal to $\\sin kx$, and $G$ cannot be built: physically, driving a string exactly at a normal-mode frequency (resonance). At $k = 0$ the formula has a finite limit, $x_<(x_> - L)/L$.',
      trap: '$k \\to 0$ gives $0/0$ in the formula but a perfectly good limit.' },
    { id: 'dgf-031', type: 'nat', level: 4, exams: ['gate', 'net'], sub: 'derivative of delta',
      q: 'The value of $\\displaystyle\\int_{-\\infty}^{\\infty}x^2\\,\\delta\'(x - 1)\\,dx$ is ______.',
      answer: -2, tol: 0, calc: () => -2 * 1,
      sol: '$\\int f\\delta\'(x - a)dx = -f\'(a)$. With $f = x^2$, $f\'(1) = 2$: the integral is $-2$.',
      trap: 'Evaluating $f(1) = 1$ as if it were an ordinary delta.' },
    { id: 'dgf-032', type: 'msq', level: 4, exams: ['gate', 'net'], sub: 'Fourier transforms',
      q: 'With $\\tilde f(k) = \\int_{-\\infty}^{\\infty}f(x)e^{-ikx}dx$, which transform pairs are correct?',
      options: ['$\\delta(x - a) \\to e^{-ika}$', '$1 \\to 2\\pi\\delta(k)$', '$\\cos k_0x \\to \\pi[\\delta(k - k_0) + \\delta(k + k_0)]$', '$\\theta(x) \\to \\dfrac{1}{ik}$, with no delta-function part'], answer: [0, 1, 2],
      sol: 'Sifting gives the first. $\\int e^{-ikx}dx = 2\\pi\\delta(k)$, and $\\cos k_0x = \\frac12(e^{ik_0x} + e^{-ik_0x})$ gives the third. The step has average value $\\tfrac12$, so its transform is $\\pi\\delta(k) + \\frac{1}{ik}$ (principal value); the $\\pi\\delta(k)$ carries that average.',
      trap: 'The step\'s transform needs $\\pi\\delta(k)$ for its non-zero mean.' },
    { id: 'dgf-033', type: 'nat', level: 4, exams: ['gate', 'net'], sub: 'screened Poisson',
      q: 'The Green\'s function of $(\\nabla^2 - \\mu^2)G = -\\delta^3(\\mathbf r)$ that vanishes at infinity is $G = \\dfrac{e^{-\\mu r}}{4\\pi r}$. With $\\mu = 1$ m⁻¹, $G$ at $r = 1$ m is ______ m⁻¹ (to four decimal places).',
      answer: 0.0293, tol: 0.0002, calc: () => Math.exp(-1) / (4 * Math.PI), unit: 'm⁻¹',
      sol: '$G = \\frac{e^{-1}}{4\\pi} = \\frac{0.3679}{12.566} = 0.0293$ m⁻¹. This is the Yukawa (screened Coulomb, Debye) potential: compared with Coulomb\'s $\\frac{1}{4\\pi r}$ it is cut off beyond the screening length $1/\\mu$.',
      trap: 'Using $e^{+\\mu r}$, which solves the equation too but blows up at infinity.' },
    { id: 'dgf-034', type: 'mcq', level: 4, exams: ['gate', 'net'], sub: 'heat kernel',
      q: 'The Green\'s function of $\\partial_tu = \\kappa\\partial_x^2u$ on the whole line (the response to $u(x, 0) = \\delta(x)$) is',
      options: ['$\\dfrac{1}{\\sqrt{4\\pi\\kappa t}}e^{-x^2/4\\kappa t}$ for $t > 0$', '$\\dfrac{1}{\\sqrt{2\\pi\\kappa t}}e^{-x^2/2\\kappa t}$ for $t > 0$', '$\\dfrac{1}{4\\pi\\kappa t}e^{-x^2/4\\kappa t}$ for $t > 0$', '$\\theta(t)e^{-\\kappa x^2t}$'], answer: 0,
      sol: 'Fourier transform in $x$: $\\tilde u = e^{-\\kappa k^2t}$; inverting the Gaussian gives $(4\\pi\\kappa t)^{-1/2}e^{-x^2/4\\kappa t}$. Its area is 1 at every $t$ (heat is conserved), and as $t \\to 0^+$ it tends to $\\delta(x)$. The third option is the two-dimensional kernel.',
      trap: '$1/(4\\pi\\kappa t)$ is the 2D normalisation.' },
    { id: 'dgf-035', type: 'nat', level: 4, exams: ['gate', 'net'], sub: 'causal Green\'s functions',
      q: 'An undamped oscillator $\\ddot x + 4x = F(t)$ (unit mass, $\\omega_0 = 2$) is at rest until a constant force $F = 8$ is switched on at $t = 0$. At $t = \\pi/2$ its displacement is ______.',
      answer: 4, tol: 0.01, calc: () => (8 / 4) * (1 - Math.cos(Math.PI)),
      sol: '$x(t) = \\int_0^t\\frac{\\sin2(t - t\')}{2}\\cdot8\\,dt\' = \\frac{8}{4}(1 - \\cos2t)$. At $t = \\pi/2$: $2(1 - \\cos\\pi) = 4$, twice the static displacement $F/\\omega_0^2 = 2$: a suddenly applied load overshoots to double.',
      trap: 'Answering the static value 2.' },
    { id: 'dgf-036', type: 'mcq', level: 4, exams: ['gate', 'net'], sub: 'composition',
      q: 'The value of $\\displaystyle\\int_{-\\infty}^{\\infty}x\\,\\delta(x^3 - 8)\\,dx$ is',
      options: ['$2$', '$\\tfrac16$', '$\\tfrac{1}{12}$', '$\\tfrac23$'], answer: 1,
      sol: 'The only real root is $x = 2$, with $g\'(2) = 3x^2 = 12$. So the integral is $\\frac{2}{12} = \\frac16$.',
      trap: 'Counting complex roots: only real zeros of the argument matter.' },
    { id: 'dgf-037', type: 'mcq', level: 4, exams: ['gate', 'net'], sub: 'boundary value problems',
      q: 'The Green\'s function of $-\\dfrac{d^2}{dx^2} + \\mu^2$ ($\\mu > 0$) on the whole line, decaying at $\\pm\\infty$, is',
      options: ['$\\dfrac{\\sin\\mu|x - x\'|}{\\mu}$', '$\\dfrac{e^{-\\mu|x - x\'|}}{2\\mu}$', '$\\dfrac{e^{-\\mu|x - x\'|}}{\\mu}$', '$\\dfrac{\\cosh\\mu(x - x\')}{2\\mu}$'], answer: 1,
      sol: 'Away from $x\'$ the decaying solutions are $e^{\\mp\\mu x}$, so $G = Ae^{-\\mu|x - x\'|}$. The equation demands a slope jump of $-1$ at $x\'$; the slope jumps by $-2\\mu A$, so $A = \\frac{1}{2\\mu}$.',
      trap: 'Missing the 2: the kink has a slope change on both sides.' },

    // ---------- level 5 ----------
    { id: 'dgf-038', type: 'nat', level: 5, exams: ['gate', 'net'], sub: 'boundary value problems',
      q: 'Solve $-y\'\' + 4y = e^{-|x|}$ on the whole line with $y \\to 0$ at $\\pm\\infty$, using the Green\'s function of $-\\frac{d^2}{dx^2} + \\mu^2$. The value $y(0)$ is ______ (to four decimal places).',
      answer: 0.1667, tol: 0.0005, calc: () => 1 / (2 * 3),
      sol: 'With $\\mu = 2$, $G = \\frac{e^{-2|x - x\'|}}{4}$. At $x = 0$: $y(0) = \\frac14\\int e^{-3|x\'|}dx\' = \\frac14\\cdot\\frac23 = \\frac16 \\approx 0.1667$. (Check by solving directly: $y = \\frac13e^{-|x|} - \\frac16e^{-2|x|}$ satisfies the equation, has a smooth peak, and $y(0) = \\frac16$.)',
      trap: 'Using $\\mu = 4$ instead of $\\sqrt4 = 2$.' },
    { id: 'dgf-039', type: 'msq', level: 5, exams: ['gate', 'net'], sub: 'causality',
      q: 'With $\\tilde G(\\omega) = \\int G(t)e^{i\\omega t}dt$, which statements are true?',
      options: ['If $G(t) = 0$ for $t < 0$ and $G$ is bounded, $\\tilde G(\\omega)$ is analytic in the upper half $\\omega$-plane', 'For the damped oscillator, the poles of $\\tilde G$ lie in the lower half-plane', 'The advanced Green\'s function vanishes for $t > 0$', 'The retarded and advanced Green\'s functions satisfy different differential equations'], answer: [0, 1, 2],
      sol: 'For $\\text{Im}\\,\\omega > 0$, $e^{i\\omega t}$ decays for $t > 0$, so the integral over $t > 0$ converges and is analytic there. The oscillator gives $\\tilde G \\propto \\frac{1}{\\omega_0^2 - \\omega^2 - i\\gamma\\omega}$, with poles at $\\omega = \\pm\\omega_1 - i\\gamma/2$, below the axis. Retarded and advanced functions solve the same equation $\\hat LG = \\delta$ and differ only in their boundary conditions in time; their difference solves the homogeneous equation. This analyticity is what gives the Kramers–Kronig relations.',
      trap: 'Same equation, different boundary conditions.' },
    { id: 'dgf-040', type: 'nat', level: 5, exams: ['gate', 'net'], sub: 'delta in 3D',
      q: 'The value of $\\displaystyle\\int_{\\text{all space}}r^2\\,\\delta(r - 2)\\,d^3r$ (with $r = |\\mathbf r|$) is ______ (to one decimal place).',
      answer: 201.1, tol: 0.2, calc: () => 4 * Math.PI * 16,
      sol: 'In spherical coordinates $d^3r = r^2\\sin\\theta\\,dr\\,d\\theta\\,d\\phi$, and the angles give $4\\pi$: $4\\pi\\int_0^\\infty r^4\\delta(r - 2)dr = 4\\pi\\cdot16 = 64\\pi \\approx 201.1$. Here $\\delta(r - 2)$ is a one-dimensional delta in $r$, a thin shell, so the Jacobian $r^2$ must be kept (unlike $\\delta^3$).',
      trap: 'Answering 4: $\\delta(r - R)$ is a shell, not a point, so the volume element stays.' },
    { id: 'dgf-041', type: 'mcq', level: 5, exams: ['gate', 'net'], sub: 'delta in 3D',
      q: 'The divergence of $\\hat{\\mathbf r}/r^2$ is',
      options: ['$0$ everywhere', '$\\delta^3(\\mathbf r)/r^2$', '$2/r^3$', '$4\\pi\\,\\delta^3(\\mathbf r)$'], answer: 3,
      sol: 'For $r \\ne 0$, $\\nabla\\cdot(\\hat r/r^2) = \\frac{1}{r^2}\\frac{d}{dr}(r^2\\cdot r^{-2}) = 0$. The flux through any sphere is $4\\pi$, so the divergence is $4\\pi\\delta^3(\\mathbf r)$. With $\\mathbf E = \\frac{q}{4\\pi\\varepsilon_0}\\frac{\\hat r}{r^2}$, this is Gauss\'s law $\\nabla\\cdot\\mathbf E = \\rho/\\varepsilon_0$ for a point charge.',
      trap: 'The formula $\\frac{1}{r^2}\\partial_r(r^2E_r)$ hides the origin.' },
    { id: 'dgf-042', type: 'nat', level: 5, exams: ['gate', 'net'], sub: 'composition',
      q: 'The value of $\\displaystyle\\int_0^{2\\pi}(1 + \\theta)\\,\\delta(\\cos\\theta)\\,d\\theta$ is ______ (to three decimal places).',
      answer: 8.283, tol: 0.002, calc: () => 2 + 2 * Math.PI,
      sol: '$\\cos\\theta = 0$ at $\\theta = \\pi/2$ and $3\\pi/2$ in $[0, 2\\pi]$, each with $|\\sin\\theta| = 1$. So the integral is $(1 + \\frac\\pi2) + (1 + \\frac{3\\pi}{2}) = 2 + 2\\pi \\approx 8.283$.',
      trap: 'Missing the second zero at $3\\pi/2$.' },
    ...more2,
    ...r4.items,
  ],
  gens: [
    { id: 'dgf-g01', type: 'nat', level: 1, exams: ['gate', 'net', 'jam'], sub: 'sifting',
      make(r) {
        const a = int(r, 1, 5), b = int(r, -4, 4), c = int(r, -5, 5), x0 = int(r, -3, 4);
        const answer = a * x0 * x0 + b * x0 + c;
        return { q: `Find $\\displaystyle\\int_{-\\infty}^{\\infty}(${a === 1 ? '' : a}x^2${tm(b, 'x')}${sh(c)})\\,\\delta(x${sh(-x0)})\\,dx$.`, answer, tol: 0, a, b, c, x0,
          sol: `The delta fires at $x = ${x0}$: $${a}(${x0})^2 + (${b})(${x0}) + (${c}) = ${answer}$.`,
          trap: `The spike is where the argument of the delta vanishes, at $x = ${x0}$, not at $x = 0$.` };
      },
      verify: (p) => p.c + p.x0 * (p.b + p.a * p.x0) },
    { id: 'dgf-g02', type: 'nat', level: 2, exams: ['gate', 'net'], sub: 'scaling',
      make(r) {
        const k = choose(r, [2, 3, 4, -2, -3]), x0 = choose(r, [-2, -1, 1, 2, 3]), m = k * x0, n = int(r, 1, 3);
        const answer = round(x0 ** n / Math.abs(k), 4);
        return { q: `Find $\\displaystyle\\int_{-\\infty}^{\\infty}${pw(n)}\\,\\delta(${k}x${sh(-m)})\\,dx$ (to four decimal places).`, answer, tol: 1e-3, k, x0, n,
          sol: `$\\delta(${k}x${sh(-m)}) = \\delta(${k}(x - ${x0})) = \\frac{1}{|${k}|}\\delta(x - ${x0})$. So the integral is $\\frac{(${x0})^{${n}}}{${Math.abs(k)}} = ${answer}$.`,
          trap: 'Divide by $|k|$, the absolute value, even when $k$ is negative.' };
      },
      verify: (p) => p.x0 ** p.n / Math.abs(p.k) },
    { id: 'dgf-g03', type: 'nat', level: 3, exams: ['gate', 'net'], sub: 'composition',
      make(r) {
        const pp = int(r, -3, 1), qq = pp + int(r, 1, 4), n = int(r, 1, 3), c = int(r, 1, 4);
        const f = (x) => x ** n + c, answer = round((f(pp) + f(qq)) / (qq - pp), 4);
        return { q: `Find $\\displaystyle\\int_{-\\infty}^{\\infty}(${pw(n)} + ${c})\\,\\delta\\big((x${sh(-pp)})(x${sh(-qq)})\\big)\\,dx$ (to four decimal places).`, answer, tol: 1e-3, pp, qq, n, c,
          sol: `The argument $g = (x - (${pp}))(x - (${qq}))$ has simple roots $${pp}$ and $${qq}$ with $|g'| = |2x - (${pp + qq})| = ${qq - pp}$ at both. So the integral is $\\frac{f(${pp}) + f(${qq})}{${qq - pp}} = \\frac{${f(pp)} + ${f(qq)}}{${qq - pp}} \\approx ${answer}$.`,
          trap: 'Both roots count, each divided by $|g\'|$ there.' };
      },
      verify: (p) => { const f = (x) => x ** p.n + p.c, g1 = Math.abs(2 * p.pp - p.pp - p.qq), g2 = Math.abs(2 * p.qq - p.pp - p.qq); return f(p.pp) / g1 + f(p.qq) / g2; } },
    { id: 'dgf-g04', type: 'nat', level: 2, exams: ['gate', 'net'], sub: 'derivative of delta',
      make(r) {
        const n = int(r, 2, 4), a = choose(r, [-2, -1, 1, 2, 3]), twice = r() < 0.4;
        const answer = twice ? n * (n - 1) * a ** (n - 2) : -n * a ** (n - 1);
        return { q: `Find $\\displaystyle\\int_{-\\infty}^{\\infty}x^{${n}}\\,\\delta${twice ? "''" : "'"}(x${sh(-a)})\\,dx$.`, answer, tol: 0, n, a, twice,
          sol: `${twice ? `$\\int f\\delta''(x - a)dx = +f''(a)$ (two integrations by parts, two minus signs). $f'' = ${n * (n - 1)}x^{${n - 2}}$` : `$\\int f\\delta'(x - a)dx = -f'(a)$. $f' = ${n}x^{${n - 1}}$`}, at $x = ${a}$: the integral is $${answer}$.`,
          trap: 'Each derivative on the delta gives a factor $-1$ when moved onto $f$.' };
      },
      verify: (p) => { // differentiate the coefficient list of x^n term by term
        let c = Array(p.n + 1).fill(0); c[p.n] = 1; const d = (c) => c.slice(1).map((v, k) => v * (k + 1));
        c = d(c); if (p.twice) c = d(c); const val = c.reduce((s, v, k) => s + v * p.a ** k, 0); return p.twice ? val : -val; } },
    { id: 'dgf-g05', type: 'nat', level: 3, exams: ['gate', 'net'], sub: 'boundary value problems',
      make(r) {
        const L = choose(r, [1, 2, 3, 4]), F = choose(r, [-6, -2, 1, 2, 3, 5]), x = round(L * choose(r, [0.2, 0.25, 0.5, 0.6, 0.75]), 3);
        const answer = round((F * x * (x - L)) / 2, 4);
        return { q: `Using the Green's function $G = \\frac{x_<(x_> - L)}{L}$ of $\\frac{d^2}{dx^2}$ with zero ends, solve $y'' = ${F}$ on $[0, ${L}]$ with $y(0) = y(${L}) = 0$ and give $y(${x})$ (to four decimal places).`,
          answer, tol: Math.max(1e-3, Math.abs(answer) * 0.002), L, F, x,
          sol: `$y = ${F}\\int_0^{${L}}G\\,dx' = \\frac{${F}x(x - ${L})}{2}$ (check: $y'' = ${F}$, zero at both ends). At $x = ${x}$: $\\frac{${F}\\times${x}\\times(${round(x - L, 3)})}{2} = ${answer}$.`,
          trap: 'A positive source with zero ends makes $y$ negative inside.' };
      },
      verify: (p) => { // integrate the Green's function numerically
        const G = (x, s) => (Math.min(x, s) * (Math.max(x, s) - p.L)) / p.L; let s = 0; const N = 20000; for (let i = 0; i < N; i++) s += G(p.x, (p.L * (i + 0.5)) / N); return (p.F * s * p.L) / N; } },
    { id: 'dgf-g06', type: 'nat', level: 3, exams: ['gate', 'net'], sub: 'impulse response',
      make(r) {
        const m = choose(r, [0.5, 1, 2]), w0 = choose(r, [2, 3, 4]), g = choose(r, [0, 0.4, 0.8]), P = choose(r, [1, 2, 3]), t = choose(r, [0.3, 0.5, 1, 1.5]);
        const w1 = Math.sqrt(w0 * w0 - (g * g) / 4), answer = round((P / (m * w1)) * Math.exp((-g * t) / 2) * Math.sin(w1 * t), 4);
        return { q: `A mass ${m} kg obeys $\\ddot x${g ? ` + ${g}\\dot x` : ''} + ${w0 * w0}x = F(t)/m$ and is at rest at equilibrium. At $t = 0$ it gets an impulse of ${P} N s. Find $x$ at $t = ${t}$ s, in m (to four decimal places).`,
          answer, unit: 'm', tol: Math.max(1e-3, Math.abs(answer) * 0.003), m, w0, g, P, t,
          sol: `$x = P\\,G(t)$ with $G = \\frac{e^{-\\gamma t/2}\\sin\\omega_1t}{m\\omega_1}$, $\\omega_1 = \\sqrt{${w0 * w0} - ${round((g * g) / 4, 4)}} = ${round(w1, 4)}$ rad/s. So $x = \\frac{${P}}{${m}\\times${round(w1, 4)}}e^{-${round((g * t) / 2, 4)}}\\sin(${round(w1 * t, 4)}) \\approx ${answer}$ m.`,
          trap: 'The impulse sets the initial velocity $P/m$, not the initial position.' };
      },
      verify: (p) => rk4(() => 0, p.g, p.w0 * p.w0, 0, p.P / p.m, p.t) },
    { id: 'dgf-g07', type: 'nat', level: 3, exams: ['gate', 'net'], sub: 'causal Green\'s functions',
      make(r) {
        const a = choose(r, [0.5, 1.5, 2, 3]), F = choose(r, [1, 2, 4, 5]), T = choose(r, [0.5, 1, 2]), t = T + choose(r, [0.5, 1, 2]);
        const answer = round((F / a) * (Math.exp(a * T) - 1) * Math.exp(-a * t), 4);
        return { q: `A system obeys $\\dot y + ${a}y = f(t)$ with $y = 0$ before $t = 0$. The input is $f = ${F}$ for $0 < t < ${T}$ and zero afterwards. Using $G(t) = \\theta(t)e^{-${a}t}$, find $y(${t})$ (to four decimal places).`,
          answer, tol: Math.max(1e-3, answer * 0.003), a, F, T, t,
          sol: `$y(t) = \\int_0^{${T}}e^{-${a}(t - t')}\\,${F}\\,dt' = \\frac{${F}}{${a}}\\left(e^{${round(a * T, 3)}} - 1\\right)e^{-${a}t}$ for $t > ${T}$. At $t = ${t}$: $\\approx ${answer}$.`,
          trap: 'After the pulse ends, the integral runs only up to the end of the pulse.' };
      },
      verify: (p) => { let y = 0; const n = 20000, h = p.t / n; for (let i = 0; i < n; i++) { const tm = (i + 0.5) * h, f = tm < p.T ? p.F : 0, k1 = f - p.a * y, k2 = f - p.a * (y + (h / 2) * k1); y += h * k2; } return y; } },
    { id: 'dgf-g08', type: 'mcq', level: 3, exams: ['gate', 'net'], sub: 'Green\'s function',
      make(r) {
        const L = [
          ['\\frac{d}{dt} + a', 'causal, $a > 0$', '$\\theta(t)e^{-at}$'],
          ['\\frac{d^2}{dt^2} + \\omega^2', 'causal', '$\\theta(t)\\frac{\\sin\\omega t}{\\omega}$'],
          ['\\frac{d^2}{dt^2}', 'causal', '$t\\,\\theta(t)$'],
          ['-\\frac{d^2}{dx^2} + \\mu^2', 'whole line, decaying at both ends', '$\\frac{e^{-\\mu|x|}}{2\\mu}$'],
          ['\\nabla^2', 'three dimensions, vanishing at infinity', '$-\\frac{1}{4\\pi r}$'],
          ['\\nabla^2 - \\mu^2', 'three dimensions, vanishing at infinity', '$-\\frac{e^{-\\mu r}}{4\\pi r}$'],
        ];
        const i = int(r, 0, L.length - 1), [op, cond, right] = L[i];
        const o = mcqOptions(r, right, L.filter((_, j) => j !== i).map((x) => x[2]), (s) => s);
        return { q: `Which function solves $\\hat LG = \\delta$ (source at the origin) for $\\hat L = ${op}$ (${cond})?`, ...o,
          sol: `For $\\hat L = ${op}$ (${cond}): $G = $ ${right}. Check by applying the operator away from the origin (it gives 0) and integrating across the origin (the jump in the derivative, or the flux through a small sphere, gives exactly 1).`,
          trap: 'Match both the operator and the condition (causal, decaying, or vanishing at infinity).' };
      } },
    { id: 'dgf-g09', type: 'nat', level: 2, exams: ['gate', 'net'], sub: 'delta in 3D',
      make(r) {
        const a = int(r, 1, 3), b = choose(r, [-3, -2, -1, 1, 2, 3]), c = int(r, -4, 4), x0 = int(r, -2, 2), y0 = int(r, -2, 2), z0 = int(r, -2, 2);
        const answer = a * x0 * x0 + b * y0 * z0 + c;
        return { q: `Find $\\displaystyle\\int_{\\text{all space}}(${a === 1 ? '' : a}x^2${tm(b, 'yz')}${sh(c)})\\,\\delta^3(\\mathbf r - \\mathbf r_0)\\,d^3r$ with $\\mathbf r_0 = (${x0}, ${y0}, ${z0})$.`, answer, tol: 0, a, b, c, x0, y0, z0,
          sol: `$\\delta^3(\\mathbf r - \\mathbf r_0) = \\delta(x - x_0)\\delta(y - y_0)\\delta(z - z_0)$ sifts out the value at $\\mathbf r_0$: $${a}(${x0})^2 + (${b})(${y0})(${z0}) + (${c}) = ${answer}$.`,
          trap: 'No Jacobian is needed with $\\delta^3$: it is defined with respect to $d^3r$.' };
      },
      verify: (p) => p.a * p.x0 ** 2 + p.b * p.y0 * p.z0 + p.c },
    { id: 'dgf-g10', type: 'nat', level: 4, exams: ['gate', 'net'], sub: 'composition',
      make(r) {
        const N = int(r, 2, 6), pw = int(r, 1, 2);
        const answer = round((pw === 1 ? (N * (N + 1)) / 2 : (N * (N + 1) * (2 * N + 1)) / 6) / Math.PI, 4);
        return { q: `Find $\\displaystyle\\int_{1/2}^{${N} + 1/2}${pw === 1 ? 'x' : 'x^2'}\\,\\delta(\\sin\\pi x)\\,dx$ (to four decimal places).`, answer, tol: 1e-3, N, pw,
          sol: `$\\sin\\pi x = 0$ at the integers; inside the range these are $x = 1, \\ldots, ${N}$, each with $|g'| = |\\pi\\cos\\pi k| = \\pi$. So the integral is $\\frac{1}{\\pi}\\sum_{k=1}^{${N}}k^{${pw}} = ${pw === 1 ? `\\frac{${(N * (N + 1)) / 2}}{\\pi}` : `\\frac{${(N * (N + 1) * (2 * N + 1)) / 6}}{\\pi}`} \\approx ${answer}$.`,
          trap: 'Each zero is weighted by $1/\\pi$, from the derivative of $\\sin\\pi x$.' };
      },
      verify: (p) => { let s = 0; for (let k = 1; k <= p.N; k++) s += k ** p.pw / Math.abs(Math.PI * Math.cos(Math.PI * k)); return s; } },
    { id: 'dgf-g11', type: 'nat', level: 4, exams: ['gate', 'net'], sub: 'causal Green\'s functions',
      make(r) {
        const w0 = choose(r, [1, 2, 3, 4]), F = choose(r, [2, 4, 6, 9]), t = choose(r, [0.25, 0.5, 1, 1.5, 2]);
        const answer = round((F / (w0 * w0)) * (1 - Math.cos(w0 * t)), 4);
        return { q: `An undamped oscillator $\\ddot x + ${w0 * w0}x = F(t)$ (unit mass) is at rest until a constant force $F = ${F}$ is switched on at $t = 0$. Using $G(t) = \\theta(t)\\frac{\\sin ${w0}t}{${w0}}$, find $x(${t})$ (to four decimal places).`,
          answer, tol: Math.max(1e-3, answer * 0.003), w0, F, t,
          sol: `$x(t) = \\int_0^t\\frac{\\sin ${w0}(t - t')}{${w0}}${F}\\,dt' = \\frac{${F}}{${w0 * w0}}(1 - \\cos ${w0}t)$. At $t = ${t}$: $\\approx ${answer}$. It swings between 0 and twice the static value $${F}/${w0 * w0}$.`,
          trap: 'A suddenly applied force does not give the static displacement at once.' };
      },
      verify: (p) => rk4(() => p.F, 0, p.w0 * p.w0, 0, 0, p.t) },
    ...more,
    ...r4.gens,
  ],
};
