// Numerical methods (CSIR NET Part C maths, some GATE): roots by bisection, Newton-Raphson, secant and fixed-point
// iteration (orders of convergence and failure modes), interpolation, numerical differentiation, trapezoidal,
// Simpson and Gauss quadrature (error orders, Richardson extrapolation), Euler, Heun and Runge-Kutta methods for
// ODEs, stability and symplectic integrators, linear systems. Original questions for fibub.
import { int, pick, choose, mcqOptions, round } from '../_util.js';
import more from './numerical-methods.more.gen.js';
import more2 from './numerical-methods.more2.gen.js';

const trap = (f, a, b, n) => { const h = (b - a) / n; let s = (f(a) + f(b)) / 2; for (let i = 1; i < n; i++) s += f(a + i * h); return s * h; };
const simp = (f, a, b, n) => { const h = (b - a) / n; let s = f(a) + f(b); for (let i = 1; i < n; i++) s += f(a + i * h) * (i % 2 ? 4 : 2); return s * h / 3; };

export default {
  topic: 'numerical-methods',
  items: [
    // ---------- level 1 ----------
    { id: 'num-001', type: 'mcq', level: 1, exams: ['gate', 'net'], sub: 'Newton-Raphson',
      q: 'The Newton-Raphson iteration for solving $f(x) = 0$ is',
      options: ['$x_{n+1} = x_n - f(x_n)/f\'(x_n)$', '$x_{n+1} = x_n - f\'(x_n)/f(x_n)$', '$x_{n+1} = x_n + f(x_n)/f\'(x_n)$', '$x_{n+1} = x_n - f(x_n)/f\'\'(x_n)$'], answer: 0,
      sol: 'Replace $f$ by its tangent at $x_n$: $f(x) \\approx f(x_n) + f\'(x_n)(x - x_n)$. Setting this to zero gives $x_{n+1} = x_n - f(x_n)/f\'(x_n)$, where the tangent crosses the axis.' },
    { id: 'num-002', type: 'mcq', level: 1, exams: ['gate', 'net'], sub: 'Simpson rule',
      q: 'The composite Simpson\'s 1/3 rule needs the number of sub-intervals to be',
      options: ['odd', 'even', 'a multiple of 3', 'any whole number'], answer: 1,
      sol: 'Simpson\'s 1/3 rule fits a parabola through each pair of adjacent sub-intervals (three points), so the sub-intervals must come in pairs: an even number, giving the weights $1, 4, 2, 4, \\dots, 4, 1$. A multiple of 3 is needed by Simpson\'s 3/8 rule.' },
    { id: 'num-003', type: 'nat', level: 1, exams: ['gate', 'net'], sub: 'bisection',
      q: 'The bisection method starts with an interval of length 1 that brackets a root. The smallest number of bisections that makes the interval shorter than $10^{-3}$ is ______.',
      answer: 10, tol: 0, calc: () => Math.ceil(Math.log2(1e3)),
      sol: 'Each bisection halves the interval: after $n$ steps its length is $2^{-n}$. We need $2^{-n} < 10^{-3}$, i.e. $n > 3\\log_2 10 = 9.97$, so $n = 10$ ($2^{-10} = 1/1024$).' },
    { id: 'num-004', type: 'mcq', level: 1, exams: ['gate', 'net'], sub: 'trapezoidal rule',
      q: 'The trapezoidal rule gives the exact integral for all polynomials of degree up to',
      options: ['$3$', '$2$', '$1$', '$0$'], answer: 2,
      sol: 'It replaces the function by straight lines between the points, so it is exact for straight lines (degree 1). For $x^2$ it already errs: the error is $-\\tfrac{(b-a)h^2}{12}f\'\'(\\xi)$, which vanishes only when $f\'\' = 0$.' },
    { id: 'num-005', type: 'mcq', level: 1, exams: ['gate', 'net'], sub: 'Euler method',
      q: 'For $dy/dx = f(x, y)$ with step $h$, the (explicit) Euler method is',
      options: ['$y_{n+1} = y_n + hf(x_{n+1}, y_{n+1})$', '$y_{n+1} = y_n + \\tfrac h2[f(x_n, y_n) + f(x_{n+1}, y_{n+1})]$', '$y_{n+1} = y_n - hf(x_n, y_n)$', '$y_{n+1} = y_n + hf(x_n, y_n)$'], answer: 3,
      sol: 'Explicit Euler follows the slope at the start of the step: $y_{n+1} = y_n + hf(x_n, y_n)$, the first two terms of the Taylor series. Using the slope at the end is implicit (backward) Euler; averaging the two slopes is the trapezoidal (Crank-Nicolson) method.' },
    { id: 'num-006', type: 'nat', level: 1, exams: ['gate', 'net'], sub: 'Euler method',
      q: 'For $dy/dx = y$ with $y(0) = 1$, one Euler step of size $h = 0.1$ gives $y(0.1) \\approx$ ______.',
      answer: 1.1, tol: 0.001, calc: () => 1 + 0.1 * 1,
      sol: '$y_1 = y_0 + hf(x_0, y_0) = 1 + 0.1\\times1 = 1.1$. The exact value is $e^{0.1} = 1.10517$; Euler always undershoots this growing curve, because the slope keeps increasing during the step.' },

    // ---------- level 2 ----------
    { id: 'num-007', type: 'nat', level: 2, exams: ['gate', 'net'], sub: 'Newton-Raphson',
      q: 'Newton-Raphson is used on $f(x) = x^2 - 2$ starting from $x_0 = 1$. The second iterate $x_2$ is ______.',
      answer: 1.4167, tol: 0.0005, calc: () => { let x = 1; for (let i = 0; i < 2; i++) x -= (x * x - 2) / (2 * x); return x; },
      sol: 'The iteration is $x_{n+1} = x_n - \\dfrac{x_n^2 - 2}{2x_n} = \\dfrac12\\left(x_n + \\dfrac{2}{x_n}\\right)$ (the Babylonian square root). $x_1 = \\tfrac12(1 + 2) = 1.5$, $x_2 = \\tfrac12(1.5 + 1.3333) = 1.41667$. $\\sqrt2 = 1.41421$: already 3 correct figures.' },
    { id: 'num-008', type: 'nat', level: 2, exams: ['gate', 'net'], sub: 'trapezoidal rule',
      q: 'The composite trapezoidal rule with step $h = 0.5$ estimates $\\int_0^1 x^2\\,dx$ as ______.',
      answer: 0.375, tol: 0.001, calc: () => trap((x) => x * x, 0, 1, 2),
      sol: '$T = \\tfrac h2[f(0) + 2f(0.5) + f(1)] = 0.25(0 + 0.5 + 1) = 0.375$. The exact value is $1/3$; the error $0.0417$ matches $\\tfrac{(b-a)h^2}{12}f\'\' = \\tfrac{1\\times0.25\\times2}{12}$. The chords lie above a convex curve, so the rule overestimates.' },
    { id: 'num-009', type: 'nat', level: 2, exams: ['gate', 'net'], sub: 'Simpson rule',
      q: 'Simpson\'s 1/3 rule with $h = 1$ (two sub-intervals) estimates $\\int_0^2 x^4\\,dx$ as ______.',
      answer: 6.667, tol: 0.005, calc: () => simp((x) => x ** 4, 0, 2, 2),
      sol: '$S = \\tfrac h3[f(0) + 4f(1) + f(2)] = \\tfrac13(0 + 4 + 16) = 20/3 \\approx 6.667$. The exact value is $32/5 = 6.4$. Simpson is exact up to cubics; a quartic shows its error, $\\tfrac{(b-a)h^4}{180}f^{(4)} = \\tfrac{2\\times24}{180} = 0.267$.' },
    { id: 'num-010', type: 'mcq', level: 2, exams: ['gate', 'net'], sub: 'convergence',
      q: 'Near a simple root, the order of convergence of the Newton-Raphson method is',
      options: ['$1$', '$1.618$', '$2$', '$3$'], answer: 2,
      sol: 'Expanding about the root $r$ with error $e_n = x_n - r$: $e_{n+1} \\approx \\dfrac{f\'\'(r)}{2f\'(r)}e_n^2$. The error is squared each step (quadratic convergence): the number of correct digits roughly doubles. 1.618 is the secant method; 1 is bisection.' },
    { id: 'num-011', type: 'mcq', level: 2, exams: ['gate', 'net'], sub: 'convergence',
      q: 'The order of convergence of the secant method (near a simple root) is',
      options: ['$1$', '$(1 + \\sqrt5)/2 \\approx 1.618$', '$2$', '$1/2$'], answer: 1,
      sol: 'The secant error obeys $e_{n+1} \\approx Ce_ne_{n-1}$. Trying $e_{n+1} \\propto e_n^p$ gives $p^2 = p + 1$, so $p = (1 + \\sqrt5)/2$, the golden ratio. It is slower per step than Newton but needs only one new function value per step and no derivative.' },
    { id: 'num-012', type: 'mcq', level: 2, exams: ['gate', 'net'], sub: 'ODE methods',
      q: 'When an ODE is integrated over a fixed interval with the explicit Euler method, the global error scales with the step size $h$ as',
      options: ['$O(h)$', '$O(h^2)$', '$O(h^3)$', '$O(h^4)$'], answer: 0,
      sol: 'Each step makes a local error $O(h^2)$ (the neglected Taylor term). Over a fixed interval there are $N \\propto 1/h$ steps, so the errors accumulate to $O(h)$: Euler is a first-order method.',
      trap: '$O(h^2)$ is the local (per step) error, not the global one.' },
    { id: 'num-013', type: 'mcq', level: 2, exams: ['gate', 'net'], sub: 'ODE methods',
      q: 'The global error of the classical fourth-order Runge-Kutta method scales as',
      options: ['$O(h)$', '$O(h^2)$', '$O(h^5)$', '$O(h^4)$'], answer: 3,
      sol: 'RK4 matches the Taylor series up to $h^4$, so its local error is $O(h^5)$ and the global error, after $\\propto 1/h$ steps, is $O(h^4)$. Halving $h$ cuts the error about 16 times, at the cost of 4 function evaluations per step.' },
    { id: 'num-014', type: 'mcq', level: 2, exams: ['gate', 'net'], sub: 'fixed-point iteration',
      q: 'The iteration $x_{n+1} = g(x_n)$ converges to a fixed point $x^* = g(x^*)$, for starting values close enough, if',
      options: ['$g(x^*) = 0$', '$|g\'(x^*)| > 1$', '$g\'\'(x^*) = 0$', '$|g\'(x^*)| < 1$'], answer: 3,
      sol: 'With $e_n = x_n - x^*$: $e_{n+1} = g(x^* + e_n) - x^* \\approx g\'(x^*)e_n$. The error shrinks by the factor $|g\'(x^*)|$ each step, so we need it below 1. If $g\'(x^*) = 0$ (as for Newton\'s method, viewed as a fixed-point iteration) the convergence is faster than linear.' },
    { id: 'num-015', type: 'msq', level: 2, exams: ['gate', 'net'], sub: 'quadrature',
      q: 'Which of these rules integrate every cubic polynomial exactly (on a single panel)?',
      options: ['Simpson\'s 1/3 rule', 'Simpson\'s 3/8 rule', 'The trapezoidal rule', 'Two-point Gauss-Legendre quadrature'], answer: [0, 1, 3],
      sol: 'Simpson\'s 1/3 rule is built for quadratics but by symmetry also integrates $x^3$ exactly. The 3/8 rule fits a cubic. An $n$-point Gauss rule is exact up to degree $2n - 1 = 3$ for $n = 2$. The trapezoidal rule is exact only for straight lines.' },
    { id: 'num-016', type: 'nat', level: 2, exams: ['gate', 'net'], sub: 'differentiation',
      q: 'The central difference $\\dfrac{f(x+h) - f(x-h)}{2h}$ with $h = 0.1$ estimates the derivative of $f(x) = x^3$ at $x = 1$ as ______.',
      answer: 3.01, tol: 0.001, calc: () => (1.1 ** 3 - 0.9 ** 3) / 0.2,
      sol: '$\\dfrac{1.331 - 0.729}{0.2} = \\dfrac{0.602}{0.2} = 3.01$. The exact value is 3, and the error $h^2f\'\'\'/6 = 0.01\\times6/6 = 0.01$ matches: the central difference is second-order accurate.' },
    { id: 'num-042', type: 'mcq', level: 2, exams: ['gate', 'net'], sub: 'bisection',
      q: 'Which root-finding method must start from an interval on which the function changes sign, and then can never fail to converge?',
      options: ['Bisection', 'Newton-Raphson', 'Secant', 'Fixed-point iteration'], answer: 0,
      sol: 'Bisection keeps a bracket $[a, b]$ with $f(a)f(b) < 0$ and halves it every step; for a continuous function a root always stays inside, so it converges (linearly, gaining one binary digit per step). The other methods are faster but can diverge or cycle.' },

    // ---------- level 3 ----------
    { id: 'num-017', type: 'nat', level: 3, exams: ['gate', 'net'], sub: 'Newton-Raphson',
      q: 'Newton-Raphson for the cube root of 10 uses $f(x) = x^3 - 10$. Starting from $x_0 = 2$, the first iterate $x_1$ is ______.',
      answer: 2.1667, tol: 0.0005, calc: () => 2 - (8 - 10) / 12,
      sol: '$x_1 = x_0 - \\dfrac{x_0^3 - 10}{3x_0^2} = 2 - \\dfrac{8 - 10}{12} = 2 + \\dfrac16 = 2.1667$. The true value is $10^{1/3} = 2.1544$.' },
    { id: 'num-018', type: 'mcq', level: 3, exams: ['gate', 'net'], sub: 'Newton-Raphson',
      q: 'Newton-Raphson is applied to $f(x) = x^2$, whose root $x = 0$ is a double root. Starting from $x_0 = 1$, the iterates',
      options: ['converge quadratically', 'converge linearly, the error halving each step', 'diverge', 'reach the root in one step'], answer: 1,
      sol: '$x_{n+1} = x_n - \\dfrac{x_n^2}{2x_n} = \\dfrac{x_n}{2}$: the error halves each step, which is linear convergence. At a root of multiplicity $m$ Newton converges linearly with ratio $(m-1)/m$; the modified step $x - mf/f\'$ restores quadratic convergence.',
      trap: 'Quadratic convergence needs $f\'(r) \\neq 0$; at a multiple root $f\'(r) = 0$.' },
    { id: 'num-019', type: 'nat', level: 3, exams: ['gate', 'net'], sub: 'stability',
      q: 'The explicit Euler method is used on $dy/dt = -50y$. The largest step size $h$ for which the numerical solution does not grow is ______.',
      answer: 0.04, tol: 0.0005, calc: () => 2 / 50,
      sol: 'Euler gives $y_{n+1} = (1 - 50h)y_n$. The solution stays bounded when $|1 - 50h| \\leq 1$, i.e. $0 < h \\leq 2/50 = 0.04$. For $0.02 < h < 0.04$ it oscillates in sign while decaying; beyond 0.04 it blows up, although the true solution decays. Such "stiff" problems call for implicit methods.' },
    { id: 'num-020', type: 'nat', level: 3, exams: ['gate', 'net'], sub: 'ODE methods',
      q: 'Heun\'s method (improved Euler, a second-order Runge-Kutta method) is used for $dy/dx = y$, $y(0) = 1$, with one step $h = 0.1$. It gives $y(0.1) \\approx$ ______.',
      answer: 1.105, tol: 0.0005, calc: () => 1 + 0.05 * (1 + 1.1),
      sol: 'Predictor: $k_1 = f(0, 1) = 1$, so $y^* = 1 + 0.1 = 1.1$. Corrector slope $k_2 = f(0.1, 1.1) = 1.1$. $y_1 = 1 + \\tfrac{0.1}{2}(1 + 1.1) = 1.105$. Exact: $1.10517$; the error dropped from 0.005 (Euler) to 0.00017.' },
    { id: 'num-021', type: 'mcq', level: 3, exams: ['gate', 'net'], sub: 'quadrature',
      q: 'For a smooth integrand, halving the step size in the composite Simpson\'s 1/3 rule reduces the error by a factor of about',
      options: ['$2$', '$4$', '$8$', '$16$'], answer: 3,
      sol: 'The composite Simpson error is $-\\dfrac{(b-a)h^4}{180}f^{(4)}(\\xi)$, so it scales as $h^4$: halving $h$ divides it by $2^4 = 16$. (The trapezoidal rule, $\\propto h^2$, gains only a factor 4.)' },
    { id: 'num-022', type: 'nat', level: 3, exams: ['gate', 'net'], sub: 'bisection',
      q: 'A root of $f$ lies in $[1, 2]$. The number of bisection steps needed to shrink the bracketing interval below $10^{-6}$ is ______.',
      answer: 20, tol: 0, calc: () => Math.ceil(6 * Math.log2(10)),
      sol: 'After $n$ steps the interval is $2^{-n}$. We need $2^{-n} < 10^{-6}$: $n > 6\\log_2 10 = 19.93$, so $n = 20$ ($2^{-20} \\approx 9.5\\times10^{-7}$). Bisection gains about 3.3 steps per decimal digit, regardless of the function.' },
    { id: 'num-023', type: 'mcq', level: 3, exams: ['gate', 'net'], sub: 'interpolation',
      q: 'The interpolating polynomial through 4 data points with distinct $x$ values',
      options: ['is unique and has degree at most 3', 'has degree exactly 4', 'is unique only if the points are equally spaced', 'can have any degree up to 4, depending on the method'], answer: 0,
      sol: 'A polynomial of degree $\\leq3$ has 4 coefficients, fixed by 4 conditions through a Vandermonde system that is invertible for distinct $x$. Lagrange, Newton divided differences and the direct solve give the same polynomial. Its degree can be below 3 if the data happen to lie on a lower-degree curve.' },
    { id: 'num-024', type: 'nat', level: 3, exams: ['gate', 'net'], sub: 'interpolation',
      q: 'The quadratic through the points $(0, 1)$, $(1, 3)$, $(2, 7)$ is used to extrapolate. Its value at $x = 3$ is ______.',
      answer: 13, tol: 0, calc: () => 9 + 3 + 1,
      sol: 'Forward differences: $\\Delta = 2, 4$ and $\\Delta^2 = 2$. Newton\'s form: $p(x) = 1 + 2x + \\tfrac{2}{2}x(x-1) = x^2 + x + 1$. Then $p(3) = 13$. (Continuing the difference table, the next first difference is $4 + 2 = 6$, so $7 + 6 = 13$.)' },
    { id: 'num-025', type: 'mcq', level: 3, exams: ['gate', 'net'], sub: 'linear systems',
      q: 'For the Jacobi and Gauss-Seidel iterations for $A\\vec x = \\vec b$, a simple sufficient condition for convergence from any starting vector is that $A$ is',
      options: ['symmetric', 'strictly diagonally dominant', 'upper triangular with zeros on the diagonal', 'singular'], answer: 1,
      sol: 'If $|a_{ii}| > \\sum_{j\\neq i}|a_{ij}|$ for every row, the iteration matrix has norm below 1, so both methods converge. Symmetric positive-definite matrices also guarantee Gauss-Seidel convergence, but symmetry alone does not.' },
    { id: 'num-026', type: 'nat', level: 3, exams: ['gate', 'net'], sub: 'Simpson rule',
      q: 'Simpson\'s 1/3 rule with two sub-intervals ($h = \\pi/2$) estimates $\\int_0^\\pi\\sin x\\,dx$ as ______.',
      answer: 2.0944, tol: 0.002, calc: () => simp(Math.sin, 0, Math.PI, 2),
      sol: '$S = \\dfrac{\\pi/2}{3}[\\sin0 + 4\\sin(\\pi/2) + \\sin\\pi] = \\dfrac\\pi6\\times4 = \\dfrac{2\\pi}{3} \\approx 2.094$. The exact value is 2, so the error is 4.7% with only three points; four sub-intervals bring it to 0.23%.' },
    { id: 'num-027', type: 'msq', level: 3, exams: ['gate', 'net'], sub: 'Newton-Raphson',
      q: 'Which statements about the Newton-Raphson method are correct?',
      options: ['It can diverge from a poor starting point', 'It needs the derivative of the function (or an approximation of it)', 'It converges quadratically to roots of any multiplicity', 'For $f(x) = x^3 - 2x + 2$ starting from $x_0 = 0$, it cycles between 0 and 1 forever'], answer: [0, 1, 3],
      sol: 'Divergence and the need for $f\'$ are standard. At a multiple root the convergence is only linear. For the cubic: $x_1 = 0 - \\dfrac{2}{-2} = 1$, then $x_2 = 1 - \\dfrac{f(1)}{f\'(1)} = 1 - \\dfrac{1}{1} = 0$: a 2-cycle.' },
    { id: 'num-028', type: 'nat', level: 3, exams: ['gate', 'net'], sub: 'Richardson extrapolation',
      q: 'The trapezoidal rule gives $T(0.5) = 0.375$ and $T(0.25) = 0.34375$ for $\\int_0^1x^2\\,dx$. Richardson extrapolation, using the $h^2$ error law, gives ______.',
      answer: 0.3333, tol: 0.0005, calc: () => (4 * 0.34375 - 0.375) / 3,
      sol: 'With $T(h) = I + ch^2 + \\dots$: $I \\approx \\dfrac{4T(h/2) - T(h)}{3} = \\dfrac{1.375 - 0.375}{3} = \\dfrac13$, exact here (it is Simpson\'s rule in disguise). Repeating the idea at higher orders is Romberg integration.' },
    { id: 'num-041', type: 'nat', level: 3, exams: ['gate', 'net'], sub: 'least squares',
      q: 'A straight line $y = mx + c$ is fitted by least squares to the points $(0, 0)$, $(1, 1)$, $(2, 3)$. The slope $m$ is ______.',
      answer: 1.5, tol: 0.001, calc: () => { const xs = [0, 1, 2], ys = [0, 1, 3], xb = 1, yb = 4 / 3; return xs.reduce((s, x, i) => s + (x - xb) * (ys[i] - yb), 0) / xs.reduce((s, x) => s + (x - xb) ** 2, 0); },
      sol: '$m = \\dfrac{\\sum(x_i - \\bar x)(y_i - \\bar y)}{\\sum(x_i - \\bar x)^2}$ with $\\bar x = 1$, $\\bar y = 4/3$. Numerator: $(-1)(-\\tfrac43) + 0 + (1)(\\tfrac53) = 3$; denominator $1 + 0 + 1 = 2$. So $m = 1.5$ and $c = \\bar y - m\\bar x = -\\tfrac16$.' },

    // ---------- level 4 ----------
    { id: 'num-029', type: 'nat', level: 4, exams: ['net'], sub: 'convergence',
      q: 'Newton-Raphson is used to find $\\sqrt2$ from $f(x) = x^2 - 2$. At some step the error is $e_n = 10^{-3}$. Using $e_{n+1} \\approx \\dfrac{f\'\'(r)}{2f\'(r)}e_n^2$, the next error $e_{n+1}$ in units of $10^{-7}$ is ______.',
      answer: 3.54, tol: 0.05, calc: () => 2 / (2 * 2 * Math.SQRT2) * 1e-6 / 1e-7,
      sol: '$f\' = 2x$ and $f\'\' = 2$, so at $r = \\sqrt2$: $\\dfrac{f\'\'}{2f\'} = \\dfrac{2}{4\\sqrt2} = 0.3536$. Then $e_{n+1} \\approx 0.3536\\times10^{-6} = 3.54\\times10^{-7}$: three correct digits become six.' },
    { id: 'num-030', type: 'mcq', level: 4, exams: ['gate', 'net'], sub: 'stability',
      q: 'The harmonic oscillator $\\dot x = v$, $\\dot v = -x$ is integrated with explicit Euler, step $h$. Each step changes the quantity $x^2 + v^2$ (twice the energy) by the factor',
      options: ['$1$ (it is conserved)', '$1 - h^2$', '$1 + h^2$', '$1 + h$'], answer: 2,
      sol: '$x_{n+1} = x_n + hv_n$, $v_{n+1} = v_n - hx_n$. Then $x_{n+1}^2 + v_{n+1}^2 = x_n^2 + v_n^2 + h^2(x_n^2 + v_n^2)$, the cross terms cancelling. So the energy grows by $(1 + h^2)$ every step and the orbit spirals outwards. Symplectic methods such as leapfrog avoid this drift.' },
    { id: 'num-031', type: 'nat', level: 4, exams: ['gate', 'net'], sub: 'quadrature',
      q: 'Two-point Gauss-Legendre quadrature (nodes $\\pm1/\\sqrt3$, weights 1) is applied to $\\int_{-1}^1x^4\\,dx$. Its estimate is ______.',
      answer: 0.2222, tol: 0.001, calc: () => 2 * (1 / Math.sqrt(3)) ** 4,
      sol: '$G = (1/\\sqrt3)^4 + (-1/\\sqrt3)^4 = 2/9 \\approx 0.222$. The exact value is $2/5 = 0.4$. Two points are exact only up to degree $2n - 1 = 3$; $x^4$ is beyond that.' },
    { id: 'num-032', type: 'mcq', level: 4, exams: ['gate', 'net'], sub: 'symplectic integrators',
      q: 'For a long simulation of planetary orbits, which integrator keeps the energy error bounded (no steady drift) over very many orbits?',
      options: ['Explicit Euler', 'Velocity Verlet (leapfrog)', 'Classical RK4 with a fixed step', 'Implicit (backward) Euler'], answer: 1,
      sol: 'Velocity Verlet is symplectic: each step is an exact canonical transformation of a slightly modified Hamiltonian, so phase-space area is kept and the energy error oscillates without growing. RK4 is far more accurate per step but not symplectic, so its energy drifts slowly; explicit Euler spirals out and implicit Euler spirals in.' },
    { id: 'num-033', type: 'nat', level: 4, exams: ['gate', 'net'], sub: 'linear systems',
      q: 'Gaussian elimination on a dense $n\\times n$ system takes about $n^3/3$ multiplications. If solving a $100\\times100$ system takes 1 ms, a $200\\times200$ system takes about ______ ms.',
      answer: 8, tol: 0, calc: () => (200 / 100) ** 3,
      sol: 'The cost scales as $n^3$: doubling $n$ multiplies it by $2^3 = 8$, so about 8 ms. (Back substitution, $\\propto n^2$, is negligible for large $n$.)' },
    { id: 'num-034', type: 'mcq', level: 4, exams: ['gate', 'net'], sub: 'fixed-point iteration',
      q: 'The iteration $x_{n+1} = \\cos x_n$ converges to $x^* \\approx 0.739$. For large $n$ the ratio of successive errors $|e_{n+1}/e_n|$ approaches about',
      options: ['$0.67$', '$0.33$', '$0.74$', '$1.0$'], answer: 0,
      sol: 'Linear convergence with ratio $|g\'(x^*)| = |\\sin x^*| = \\sin0.739 \\approx 0.674$. Each step removes only a third of the error, so it takes about 6 steps per correct digit. Newton on $x - \\cos x$ would converge quadratically.',
      trap: '0.74 is the fixed point itself, not the ratio.' },
    { id: 'num-035', type: 'nat', level: 4, exams: ['gate', 'net'], sub: 'ODE methods',
      q: 'One step of classical RK4 with $h = 0.1$ for $dy/dx = y$, $y(0) = 1$ gives $y(0.1)$ = ______ (to 5 decimal places).',
      answer: 1.10517, tol: 0.00001, calc: () => { const h = 0.1, k1 = 1, k2 = 1 + h / 2 * k1, k3 = 1 + h / 2 * k2, k4 = 1 + h * k3; return 1 + h / 6 * (k1 + 2 * k2 + 2 * k3 + k4); },
      sol: '$k_1 = 1$, $k_2 = 1 + 0.05 = 1.05$, $k_3 = 1 + 0.05\\times1.05 = 1.0525$, $k_4 = 1 + 0.1\\times1.0525 = 1.10525$. $y_1 = 1 + \\tfrac{0.1}{6}(1 + 2.1 + 2.105 + 1.10525) = 1.1051708$. For $y\' = y$ RK4 reproduces the Taylor series up to $h^4/24$; the exact $e^{0.1} = 1.1051709$.' },
    { id: 'num-036', type: 'msq', level: 4, exams: ['gate', 'net'], sub: 'stability',
      q: 'For the test equation $dy/dt = -\\lambda y$ ($\\lambda > 0$), which statements are correct?',
      options: ['Backward Euler gives $y_{n+1} = y_n/(1 + \\lambda h)$, which decays for every $h > 0$', 'Backward Euler is first-order accurate', 'Explicit Euler grows without bound when $h > 2/\\lambda$', 'For a nonlinear $f(y)$, backward Euler needs no equation solving at each step'], answer: [0, 1, 2],
      sol: 'Backward Euler: $y_{n+1} = y_n - \\lambda hy_{n+1}$, so $y_{n+1} = y_n/(1 + \\lambda h)$, with $|1/(1 + \\lambda h)| < 1$ always (A-stable). It is still only first-order. Explicit Euler has factor $1 - \\lambda h$, of magnitude above 1 when $h > 2/\\lambda$. For nonlinear $f$, $y_{n+1}$ appears inside $f$, so each step needs a root solve (often Newton): the price of implicit stability.' },

    // ---------- level 5 ----------
    { id: 'num-037', type: 'nat', level: 5, exams: ['net'], sub: 'trapezoidal rule',
      q: 'Using the error bound $|E| \\leq \\dfrac{(b-a)h^2}{12}\\max|f\'\'|$, the smallest number of equal sub-intervals that guarantees an error below $10^{-6}$ for $\\int_0^1 e^x\\,dx$ with the composite trapezoidal rule is ______.',
      answer: 476, tol: 0, calc: () => Math.ceil(Math.sqrt(Math.E / 12 * 1e6)),
      sol: 'On $[0, 1]$, $\\max|f\'\'| = e$ and $h = 1/n$. Need $\\dfrac{e}{12n^2} \\leq 10^{-6}$: $n^2 \\geq e\\times10^6/12 = 226\\,523$, $n \\geq 475.9$. So $n = 476$. Simpson\'s rule would need only 12 (its bound $e/180n^4$ gives $n \\geq 11.1$, rounded up to an even number).' },
    { id: 'num-038', type: 'mcq', level: 5, exams: ['net'], sub: 'Newton-Raphson',
      q: 'Newton-Raphson is applied to $f(x) = x^{1/3}$ (real cube root), whose only root is $x = 0$, starting from $x_0 = 0.1$. The iterates',
      options: ['converge quadratically to 0', 'converge linearly to 0', 'diverge, $|x_n|$ doubling each step with alternating sign', 'cycle between $0.1$ and $-0.1$'], answer: 2,
      sol: '$f\'(x) = \\tfrac13x^{-2/3}$, so $x_{n+1} = x_n - \\dfrac{x_n^{1/3}}{\\tfrac13x_n^{-2/3}} = x_n - 3x_n = -2x_n$. From 0.1: $-0.2, 0.4, -0.8, \\dots$. The tangent at any point overshoots the root by twice the distance, because $f\'$ blows up at the root.' },
    { id: 'num-039', type: 'nat', level: 5, exams: ['net'], sub: 'differentiation',
      q: 'A central-difference derivative has truncation error $\\tfrac{h^2}{6}|f\'\'\'|$ and round-off error $\\epsilon/h$, where $\\epsilon = 10^{-16}$ is the machine precision (take $|f| \\approx |f\'\'\'| \\approx 1$). The step $h$ that minimises the total error, in units of $10^{-6}$, is ______.',
      answer: 6.69, tol: 0.1, calc: () => Math.cbrt(3e-16) / 1e-6,
      sol: '$E(h) = \\tfrac{h^2}{6} + \\dfrac{\\epsilon}{h}$; $E\'(h) = \\tfrac h3 - \\dfrac{\\epsilon}{h^2} = 0$ gives $h^3 = 3\\epsilon$, $h = (3\\times10^{-16})^{1/3} = 6.69\\times10^{-6}$. Smaller steps make the answer worse, because the subtraction $f(x+h) - f(x-h)$ loses digits.' },
    { id: 'num-040', type: 'mcq', level: 5, exams: ['net'], sub: 'Simpson rule',
      q: 'Simpson\'s 1/3 rule with $h = 1$ is applied to $\\int_0^2x^4\\,dx$. Using the error formula $E = -\\dfrac{(b-a)h^4}{180}f^{(4)}$, the rule',
      options: ['underestimates by $0.0167$', 'is exact', 'overestimates by $1.067$', 'overestimates by $0.267$'], answer: 3,
      sol: '$f^{(4)} = 24$, so $E = I - S = -\\dfrac{2\\times1\\times24}{180} = -0.267$: $S$ is larger than $I$ by $0.267$. Directly: $S = 20/3 = 6.667$ and $I = 6.4$. (With $h = 0.5$ the error would be $16$ times smaller, $0.0167$.)' },
    ...more2,
  ],
  gens: [
    { id: 'num-g01', type: 'nat', level: 2, exams: ['gate', 'net'], sub: 'Newton-Raphson',
      make(r) {
        const n = choose(r, [2, 3]), c = n === 2 ? choose(r, [3, 5, 6, 7, 8, 10, 11, 12]) : choose(r, [2, 3, 5, 7, 9, 20, 30]);
        const x0 = n === 2 ? Math.round(Math.sqrt(c)) || 1 : Math.round(Math.cbrt(c)) || 1, steps = int(r, 1, 2);
        let x = x0; const xs = [x0];
        for (let i = 0; i < steps; i++) { x = x - (x ** n - c) / (n * x ** (n - 1)); xs.push(x); }
        const answer = round(x, 5);
        return { q: `Newton-Raphson is used on $f(x) = x^{${n}} - ${c}$ from $x_0 = ${x0}$. Find $x_{${steps}}$.`,
          answer, tol: 0.0005, n, c, x0, steps,
          sol: `$x_{k+1} = x_k - \\dfrac{x_k^{${n}} - ${c}}{${n}x_k^{${n - 1}}}$. ${xs.slice(1).map((v, i) => `$x_{${i + 1}} = ${round(v, 6)}$`).join(', ')}. The true root is $${c}^{1/${n}} = ${round(c ** (1 / n), 6)}$.` };
      },
      verify: (p) => { let x = p.x0; for (let i = 0; i < p.steps; i++) x = ((p.n - 1) * x + p.c / x ** (p.n - 1)) / p.n; return x; } },
    { id: 'num-g02', type: 'nat', level: 2, exams: ['gate', 'net'], sub: 'bisection',
      make(r) {
        const L = choose(r, [0.5, 1, 2, 4, 10]), k = int(r, 2, 8);
        const answer = Math.ceil(Math.log2(L * 10 ** k) - 1e-12);
        return { q: `A root is bracketed in an interval of length ${L}. How many bisection steps are needed to make the bracket shorter than $10^{-${k}}$?`,
          answer, tol: 0, L, k,
          sol: `After $n$ steps the bracket is $${L}/2^n$. Need $${L}/2^n < 10^{-${k}}$: $n > \\log_2(${L}\\times10^{${k}}) = ${round(Math.log2(L * 10 ** k), 3)}$, so $n = ${answer}$.` };
      },
      verify: (p) => { let n = 0, w = p.L; while (w >= 10 ** -p.k) { w /= 2; n++; } return n; } },
    { id: 'num-g03', type: 'nat', level: 2, exams: ['gate', 'net'], sub: 'trapezoidal rule',
      make(r) {
        const F = choose(r, [['x^2', (x) => x * x], ['x^3', (x) => x ** 3], ['e^x', Math.exp], ['1/(1+x)', (x) => 1 / (1 + x)], ['\\sqrt{x}', Math.sqrt]]);
        const b = choose(r, [1, 2]), n = choose(r, [2, 4]);
        const answer = round(trap(F[1], 0, b, n), 4), h = b / n;
        const pts = []; for (let i = 0; i <= n; i++) pts.push(round(F[1](i * h), 4));
        return { q: `Use the composite trapezoidal rule with ${n} equal sub-intervals to estimate $\\int_0^{${b}} ${F[0]}\\,dx$.`,
          answer, tol: Math.max(0.002, answer * 0.002), fi: F[0], b, n,
          sol: `$h = ${b}/${n} = ${h}$. Values: ${pts.join(', ')}. $T = \\tfrac h2[f_0 + 2(f_1 + \\dots + f_{${n - 1}}) + f_{${n}}] = ${h / 2}\\times${round(answer / (h / 2), 4)} = ${answer}$.` };
      },
      verify: (p) => { const f = { 'x^2': (x) => x * x, 'x^3': (x) => x ** 3, 'e^x': Math.exp, '1/(1+x)': (x) => 1 / (1 + x), '\\sqrt{x}': Math.sqrt }[p.fi]; const h = p.b / p.n; let s = 0; for (let i = 0; i < p.n; i++) s += (f(i * h) + f((i + 1) * h)) * h / 2; return s; } },
    { id: 'num-g04', type: 'nat', level: 3, exams: ['gate', 'net'], sub: 'Simpson rule',
      make(r) {
        const F = choose(r, [['x^4', (x) => x ** 4], ['e^x', Math.exp], ['1/(1+x)', (x) => 1 / (1 + x)], ['\\sin x', Math.sin], ['x^2e^{-x}', (x) => x * x * Math.exp(-x)]]);
        const b = choose(r, [1, 2]), n = choose(r, [2, 4]);
        const answer = round(simp(F[1], 0, b, n), 5), h = b / n;
        const ws = []; for (let i = 0; i <= n; i++) ws.push(i === 0 || i === n ? 1 : i % 2 ? 4 : 2);
        return { q: `Use Simpson's 1/3 rule with ${n} equal sub-intervals to estimate $\\int_0^{${b}} ${F[0]}\\,dx$.`,
          answer, tol: Math.max(0.002, Math.abs(answer) * 0.002), fi: F[0], b, n,
          sol: `$h = ${h}$; weights ${ws.join(', ')}. $S = \\tfrac h3\\sum w_if(x_i)$, with $f$ at ${ws.map((_, i) => round(F[1](i * h), 5)).join(', ')}. $S = ${answer}$.` };
      },
      verify: (p) => { const f = { 'x^4': (x) => x ** 4, 'e^x': Math.exp, '1/(1+x)': (x) => 1 / (1 + x), '\\sin x': Math.sin, 'x^2e^{-x}': (x) => x * x * Math.exp(-x) }[p.fi]; const h = p.b / p.n; let s = 0; for (let i = 0; i < p.n; i += 2) s += h / 3 * (f(i * h) + 4 * f((i + 1) * h) + f((i + 2) * h)); return s; } },
    { id: 'num-g05', type: 'nat', level: 2, exams: ['gate', 'net'], sub: 'Euler method',
      make(r) {
        const kind = choose(r, ['ky', 'x+y', 'x-y']), k = choose(r, [-2, -1, 0.5, 1, 2]), h = choose(r, [0.1, 0.2, 0.25]), N = int(r, 2, 3), y0 = choose(r, [1, 2]);
        const f = (x, y) => (kind === 'ky' ? k * y : kind === 'x+y' ? x + y : x - y);
        let x = 0, y = y0; const ys = [];
        for (let i = 0; i < N; i++) { y += h * f(x, y); x += h; ys.push(round(y, 6)); }
        const answer = round(y, 5), rhs = kind === 'ky' ? `${k}y` : kind;
        return { q: `Use the explicit Euler method with step $h = ${h}$ to integrate $dy/dx = ${rhs}$, $y(0) = ${y0}$, for ${N} steps. Find $y(${round(N * h, 2)})$.`,
          answer, tol: Math.max(0.001, Math.abs(answer) * 0.002), kind, k, h, N, y0,
          sol: `$y_{n+1} = y_n + h\\,f(x_n, y_n)$. Successive values: ${ys.map((v, i) => `$y_{${i + 1}} = ${v}$`).join(', ')}. So $y(${round(N * h, 2)}) \\approx ${answer}$.` };
      },
      verify: (p) => { let x = 0, y = p.y0; for (let i = 0; i < p.N; i++) { const s = p.kind === 'ky' ? p.k * y : p.kind === 'x+y' ? x + y : x - y; y = y + p.h * s; x = x + p.h; } return y; } },
    { id: 'num-g06', type: 'nat', level: 3, exams: ['gate', 'net'], sub: 'ODE methods',
      make(r) {
        const meth = choose(r, ['heun', 'mid', 'rk4']), a = choose(r, [-1, 1, 2]), h = choose(r, [0.1, 0.2]);
        const f = (x, y) => x + a * y; let y;
        if (meth === 'heun') { const k1 = f(0, 1), k2 = f(h, 1 + h * k1); y = 1 + h / 2 * (k1 + k2); }
        else if (meth === 'mid') { const k1 = f(0, 1), k2 = f(h / 2, 1 + h / 2 * k1); y = 1 + h * k2; }
        else { const k1 = f(0, 1), k2 = f(h / 2, 1 + h / 2 * k1), k3 = f(h / 2, 1 + h / 2 * k2), k4 = f(h, 1 + h * k3); y = 1 + h / 6 * (k1 + 2 * k2 + 2 * k3 + k4); }
        const name = { heun: "Heun's method (improved Euler)", mid: 'the midpoint method (RK2)', rk4: 'classical RK4' }[meth];
        const recipe = { heun: '$k_1 = f(x_0, y_0)$, $k_2 = f(x_0 + h, y_0 + hk_1)$, $y_1 = y_0 + \\tfrac h2(k_1 + k_2)$', mid: '$k_1 = f(x_0, y_0)$, $k_2 = f(x_0 + \\tfrac h2, y_0 + \\tfrac h2k_1)$, $y_1 = y_0 + hk_2$', rk4: '$k_1 = f(x_0, y_0)$, $k_2 = f(x_0 + \\tfrac h2, y_0 + \\tfrac h2k_1)$, $k_3 = f(x_0 + \\tfrac h2, y_0 + \\tfrac h2k_2)$, $k_4 = f(x_0 + h, y_0 + hk_3)$, $y_1 = y_0 + \\tfrac h6(k_1 + 2k_2 + 2k_3 + k_4)$' }[meth];
        const answer = round(y, 6);
        return { q: `Take one step of ${name} with $h = ${h}$ for $dy/dx = x ${a < 0 ? '-' : '+'} ${Math.abs(a) === 1 ? '' : Math.abs(a)}y$, $y(0) = 1$. Find $y(${h})$.`,
          answer, tol: 0.0002, meth, a, h,
          sol: `${recipe}. With $f(x, y) = x ${a < 0 ? '-' : '+'} ${Math.abs(a) === 1 ? '' : Math.abs(a)}y$ this gives $y(${h}) \\approx ${answer}$.` };
      },
      verify: (p) => {
        // compare with the method written as a Butcher tableau
        const T = { heun: [[[], [1]], [0.5, 0.5], [0, 1]], mid: [[[], [0.5]], [0, 1], [0, 0.5]], rk4: [[[], [0.5], [0, 0.5], [0, 0, 1]], [1 / 6, 1 / 3, 1 / 3, 1 / 6], [0, 0.5, 0.5, 1]] }[p.meth];
        const [A, b, c] = T, f = (x, y) => x + p.a * y, k = [];
        for (let i = 0; i < b.length; i++) { const yi = 1 + p.h * A[i].reduce((s, aij, j) => s + aij * k[j], 0); k.push(f(c[i] * p.h, yi)); }
        return 1 + p.h * b.reduce((s, bi, i) => s + bi * k[i], 0);
      } },
    { id: 'num-g07', type: 'nat', level: 3, exams: ['gate', 'net'], sub: 'stability',
      make(r) {
        const lam = choose(r, [5, 10, 20, 25, 40, 50, 100, 200, 500, 1000]), meth = choose(r, ['euler', 'osc']);
        const answer = round(2 / lam, 6);
        return meth === 'euler'
          ? { q: `The explicit Euler method is applied to $dy/dt = -${lam}y$. Find the largest step $h$ for which the numerical solution does not grow.`, answer, tol: answer * 0.01, lam,
            sol: `$y_{n+1} = (1 - ${lam}h)y_n$; boundedness needs $|1 - ${lam}h| \\leq 1$, so $h \\leq 2/${lam} = ${answer}$.` }
          : { q: `A stiff system has a fast decay mode $e^{-${lam}t}$ and slow modes on a time scale of seconds. With explicit Euler, what is the largest stable step size (in s), whatever accuracy the slow modes need?`, answer, tol: answer * 0.01, lam,
            sol: `Each mode $e^{-\\lambda t}$ is amplified by $1 - \\lambda h$ per step; the fastest mode sets the limit, $h \\leq 2/\\lambda = 2/${lam} = ${answer}$ s. Implicit methods remove this limit, which is why they are used for stiff problems.` };
      },
      verify: (p) => { let lo = 0, hi = 1; for (let i = 0; i < 60; i++) { const m = (lo + hi) / 2; if (Math.abs(1 - p.lam * m) <= 1) lo = m; else hi = m; } return lo; } },
    { id: 'num-g08', type: 'nat', level: 2, exams: ['gate', 'net'], sub: 'differentiation',
      make(r) {
        const F = choose(r, [['x^3', (x) => x ** 3], ['e^x', Math.exp], ['\\sin x', Math.sin], ['\\ln x', Math.log], ['x^4', (x) => x ** 4]]);
        const x0 = choose(r, [1, 2]), h = choose(r, [0.1, 0.05, 0.2]), kind = choose(r, ['forward', 'central', 'second']);
        const f = F[1];
        const val = kind === 'forward' ? (f(x0 + h) - f(x0)) / h : kind === 'central' ? (f(x0 + h) - f(x0 - h)) / (2 * h) : (f(x0 + h) - 2 * f(x0) + f(x0 - h)) / (h * h);
        const formula = { forward: '\\dfrac{f(x+h) - f(x)}{h}', central: '\\dfrac{f(x+h) - f(x-h)}{2h}', second: '\\dfrac{f(x+h) - 2f(x) + f(x-h)}{h^2}' }[kind];
        const answer = round(val, 5);
        return { q: `Estimate ${kind === 'second' ? 'the second derivative' : 'the derivative'} of $f(x) = ${F[0]}$ at $x = ${x0}$ with $${formula}$ and $h = ${h}$.`,
          answer, tol: Math.max(0.0005, Math.abs(answer) * 0.001), fi: F[0], x0, h, kind,
          sol: `$f(${x0} - ${h}) = ${round(f(x0 - h), 6)}$, $f(${x0}) = ${round(f(x0), 6)}$, $f(${x0} + ${h}) = ${round(f(x0 + h), 6)}$. Substituting: $${answer}$. The ${kind === 'forward' ? 'forward difference has error $O(h)$' : 'central formulas have error $O(h^2)$'}.` };
      },
      verify: (p) => { const f = { 'x^3': (x) => x ** 3, 'e^x': Math.exp, '\\sin x': Math.sin, '\\ln x': Math.log, 'x^4': (x) => x ** 4 }[p.fi], x = p.x0, h = p.h; return p.kind === 'forward' ? (f(x + h) - f(x)) / h : p.kind === 'central' ? (f(x + h) - f(x - h)) / (2 * h) : (f(x + h) + f(x - h) - 2 * f(x)) / (h * h); } },
    { id: 'num-g09', type: 'nat', level: 3, exams: ['gate', 'net'], sub: 'interpolation',
      make(r) {
        const xs = [0, 1, 2], ys = [int(r, -3, 5), int(r, -3, 5), int(r, -3, 5)], X = choose(r, [0.5, 1.5, 3, -1, 2.5]);
        const L = (i) => xs.reduce((p, xj, j) => (j === i ? p : p * (X - xj) / (xs[i] - xj)), 1);
        const answer = round(ys.reduce((s, y, i) => s + y * L(i), 0), 4);
        const d1 = [ys[1] - ys[0], ys[2] - ys[1]], d2 = d1[1] - d1[0];
        return { q: `Fit the quadratic interpolating polynomial through $(0, ${ys[0]})$, $(1, ${ys[1]})$, $(2, ${ys[2]})$ and evaluate it at $x = ${X}$.`,
          answer, tol: 0.002, ys, X,
          sol: `Forward differences: $\\Delta y = ${d1[0]}, ${d1[1]}$; $\\Delta^2y = ${d2}$. Newton's form: $p(x) = ${ys[0]} + ${d1[0]}x + \\tfrac{${d2}}{2}x(x-1)$. At $x = ${X}$: $${ys[0]} + ${d1[0]}(${X}) + ${d2 / 2}(${X})(${round(X - 1, 2)}) = ${answer}$.` };
      },
      verify: (p) => { const [a, b, c] = p.ys, d1 = b - a, d2 = c - 2 * b + a; return a + d1 * p.X + d2 / 2 * p.X * (p.X - 1); } },
    { id: 'num-g10', type: 'mcq', level: 2, exams: ['gate', 'net'], sub: 'error orders',
      make(r) {
        const M = [
          ['the composite trapezoidal rule (global error)', '$O(h^2)$'], ['the composite Simpson 1/3 rule (global error)', '$O(h^4)$'],
          ['the explicit Euler method for ODEs (global error)', '$O(h)$'], ['classical RK4 (global error)', '$O(h^4)$'],
          ['the forward difference $[f(x+h) - f(x)]/h$', '$O(h)$'], ['the central difference $[f(x+h) - f(x-h)]/2h$', '$O(h^2)$'],
          ['Heun\'s method / RK2 (global error)', '$O(h^2)$'], ['the explicit Euler method (local error per step)', '$O(h^2)$'],
          ['the composite midpoint rule (global error)', '$O(h^2)$'], ['the five-point central difference for $f\'$', '$O(h^4)$'],
        ];
        const m = choose(r, M);
        const o = mcqOptions(r, m[1], ['$O(h)$', '$O(h^2)$', '$O(h^3)$', '$O(h^4)$', '$O(h^5)$'].filter((x) => x !== m[1]).slice(int(r, 0, 1)), (v) => v);
        return { q: `How does the error of ${m[0]} scale with the step size $h$?`, ...o,
          sol: `${m[0][0].toUpperCase() + m[0].slice(1)}: ${m[1]}. Rule of thumb: a method that matches the Taylor series up to $h^p$ has local error $O(h^{p+1})$ per step and global error $O(h^p)$ over a fixed interval; central (symmetric) formulas cancel the odd error terms and gain an order.`,
          trap: 'Keep local and global errors apart: summing $1/h$ local errors of $O(h^{p+1})$ gives $O(h^p)$.' };
      } },
    { id: 'num-g11', type: 'nat', level: 3, exams: ['gate', 'net'], sub: 'Richardson extrapolation',
      make(r) {
        const I = round(1 + r() * 4, 3), c = round((r() - 0.5) * 0.4, 3) || 0.05, p = choose(r, [2, 4]), h = choose(r, [0.2, 0.4, 0.5]);
        const T1 = round(I + c * h ** p, 6), T2 = round(I + c * (h / 2) ** p, 6), k = 2 ** p;
        const answer = round((k * T2 - T1) / (k - 1), 5);
        return { q: `A method with error $\\propto h^{${p}}$ gives $A(${h}) = ${T1}$ and $A(${h / 2}) = ${T2}$. Use Richardson extrapolation to estimate the exact value.`,
          answer, tol: 0.0005, T1, T2, p,
          sol: `With $A(h) = I + ch^{${p}}$: $I \\approx \\dfrac{2^{${p}}A(h/2) - A(h)}{2^{${p}} - 1} = \\dfrac{${k}\\times${T2} - ${T1}}{${k - 1}} = ${answer}$.` };
      },
      verify: (x) => { const k = 2 ** x.p, c = (x.T1 - x.T2) / (1 - 1 / k); return x.T1 - c; } },
    { id: 'num-g12', type: 'nat', level: 3, exams: ['gate', 'net'], sub: 'fixed-point iteration',
      make(r) {
        const c = choose(r, [2, 3, 5, 6, 12]), x0 = choose(r, [0, 1, 2]), N = int(r, 2, 3), kind = choose(r, ['sqrt', 'lin']);
        const a = choose(r, [0.5, -0.5, 0.25, 0.8]), b = int(r, 1, 6);
        const g = kind === 'sqrt' ? (x) => Math.sqrt(x + c) : (x) => a * x + b;
        let x = x0; const xs = []; for (let i = 0; i < N; i++) { x = g(x); xs.push(round(x, 6)); }
        const answer = round(x, 5);
        const gt = kind === 'sqrt' ? `\\sqrt{x_n + ${c}}` : `${a}x_n + ${b}`;
        const fix = kind === 'sqrt' ? (1 + Math.sqrt(1 + 4 * c)) / 2 : b / (1 - a);
        return { q: `Iterate $x_{n+1} = ${gt}$ from $x_0 = ${x0}$. Find $x_{${N}}$.`,
          answer, tol: 0.0005, kind, c, x0, N, a, b,
          sol: `${xs.map((v, i) => `$x_{${i + 1}} = ${v}$`).join(', ')}. The iterates approach the fixed point $x^* = ${round(fix, 5)}$, since $|g'(x^*)| = ${round(kind === 'sqrt' ? 1 / (2 * Math.sqrt(fix + c)) : Math.abs(a), 4)} < 1$; the error shrinks by about that factor each step.` };
      },
      verify: (p) => { let x = p.x0; for (let i = 0; i < p.N; i++) x = p.kind === 'sqrt' ? (x + p.c) ** 0.5 : p.a * x + p.b; return x; } },
    ...more,
  ],
};
