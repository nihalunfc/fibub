// Extra question shapes for numerical-methods (templates num-m31..m35). Imported by numerical-methods.js.
import { int, choose, round } from '../_util.js';
import { msqOf } from './_more.js';
import { oneOf, matchOne, orderOpts } from './_odd.js';

export default [
  { id: 'num-m31', type: 'msq', level: 3, exams: ['gate', 'net'], sub: 'error orders', format: 'statements',
    make(r) {
      const k = choose(r, [2, 3, 10]), not = r() < 0.5;
      const m = msqOf(r, [
        [`dividing the step by ${k} cuts the composite trapezoidal error by about ${k ** 2}`, true, 'The trapezoidal rule has global error $O(h^2)$.'],
        [`dividing the step by ${k} cuts the composite Simpson error by about ${k ** 4}`, true, 'Simpson\'s rule has global error $O(h^4)$.'],
        [`dividing the step by ${k} cuts the global error of Euler's method by about ${k}`, true, 'Euler\'s method is first order: global error $O(h)$.'],
        [`dividing the step by ${k} cuts the global error of classical RK4 by about ${k ** 4}`, true, 'RK4 is fourth order.'],
        [`dividing the step by ${k} cuts the global error of Euler's method by about ${k ** 2}`, false, `Euler's local error is $O(h^2)$ but it accumulates over $1/h$ steps, so the global error falls only by ${k}.`],
        ['Simpson\'s rule integrates every cubic exactly', true, 'Its error involves the fourth derivative, which vanishes for a cubic.'],
        ['the trapezoidal rule integrates every quadratic exactly', false, 'Its error involves $f\'\'$; for $x^2$ on $[0, 1]$ one panel gives $1/2$ instead of $1/3$.'],
        ['Newton-Raphson converges quadratically near a simple root', true, 'The error is roughly squared each step.'],
        ['Newton-Raphson converges from any starting point', false, 'It can cycle or run away (for example $\\sqrt[3]{x}$, or a start near a turning point).'],
        ['the central difference $[f(x + h) - f(x - h)]/2h$ has error $O(h^2)$', true, 'The odd terms of the Taylor series cancel.'],
        ['the forward difference $[f(x + h) - f(x)]/h$ has error $O(h^2)$', false, 'Its error is $\\tfrac h2f\'\'$: first order.'],
      ], { not });
      return { q: `For smooth functions and small steps, which statements are ${not ? '<b>NOT</b> correct' : 'correct'}?`, ...m,
        trap: 'A method of order $p$ has global error $\\propto h^p$, so dividing $h$ by $k$ divides the error by $k^p$.' };
    } },
  { id: 'num-m32', type: 'mcq', level: 3, exams: ['gate', 'net'], sub: 'Newton-Raphson', format: 'match',
    make(r) {
      const a = int(r, 2, 6), x0 = a + int(r, 1, 4);
      const L = { quad: 'converges, the number of correct digits roughly doubling each step', lin: 'converges, but only linearly: the error halves each step', cyc: 'cycles between two values for ever', div: 'diverges, with $|x_n|$ doubling each step' };
      const cas = choose(r, [
        [`$f(x) = x^2 - ${a * a}$ from $x_0 = ${x0}$`, 'quad', `A simple root at $${a}$: $x_{n+1} = \\tfrac12(x_n + ${a * a}/x_n)$ converges quadratically.`],
        [`$f(x) = (x - ${a})^2$ from $x_0 = ${x0}$`, 'lin', `A double root: $x_{n+1} - ${a} = \\tfrac12(x_n - ${a})$, so Newton is only linear here.`],
        ['$f(x) = x^3 - 2x + 2$ from $x_0 = 0$', 'cyc', '$x_1 = 0 - 2/(-2) = 1$, then $x_2 = 1 - 1/1 = 0$: it bounces between 0 and 1.'],
        [`$f(x) = \\sqrt[3]{x}$ (real cube root) from $x_0 = ${a}$`, 'div', '$f/f\' = 3x$, so $x_{n+1} = x_n - 3x_n = -2x_n$: the iterates double in size and alternate in sign.'],
      ]);
      return { q: `Newton-Raphson iteration $x_{n+1} = x_n - f(x_n)/f'(x_n)$ is applied to ${cas[0]}. The iteration`, ...matchOne(r, L, cas),
        trap: 'Quadratic convergence needs a simple root and a good start; multiple roots and bad starts break it.' };
    } },
  { id: 'num-m33', type: 'mcq', level: 3, exams: ['gate', 'net'], sub: 'stability', format: 'match',
    make(r) {
      const lam = choose(r, [2, 4, 5, 8, 10, 20]), f = choose(r, [0.5, 1.5, 2, 3]), h = round(f / lam, 4), g = round(1 - f, 2);
      const L = { mono: 'decays smoothly towards 0, without changing sign', alt: 'decays towards 0 while flipping sign every step', flat: 'flips sign every step with constant magnitude', grow: 'flips sign every step with growing magnitude' };
      const key = { 0.5: 'mono', 1.5: 'alt', 2: 'flat', 3: 'grow' }[f];
      return { q: `Euler's method $y_{n+1} = y_n + h\\,f(y_n)$ is used for $y' = -${lam}y$, $y(0) = 1$, with step $h = ${h}$. The numerical solution`, ...matchOne(r, L, [null, key, `Each step multiplies $y$ by $1 - ${lam}h = 1 - ${f} = ${g}$. ${f < 1 ? 'A factor between 0 and 1 gives smooth decay.' : f < 2 ? 'A factor between $-1$ and 0 gives decay with alternating sign.' : f === 2 ? 'A factor of exactly $-1$ gives $\\pm1$ for ever.' : 'A factor below $-1$ makes the solution blow up: the step exceeds the stability limit $h \\lt 2/\\lambda = ' + round(2 / lam, 4) + '$.'} The true solution $e^{-${lam}t}$ always decays smoothly.`]),
        trap: 'Explicit Euler on $y\' = -\\lambda y$ is stable only for $h \\lt 2/\\lambda$, and oscillates once $h \\gt 1/\\lambda$.' };
    } },
  { id: 'num-m34', type: 'mcq', level: 4, exams: ['gate', 'net'], sub: 'round-off', format: 'order of magnitude',
    make(r) {
      const eps = 2.2e-16;
      const C = choose(r, [
        ['the forward difference $[f(x + h) - f(x)]/h$', Math.sqrt(eps), 'Truncation error $\\sim h$, round-off $\\sim\\epsilon/h$: the total is smallest at $h \\sim \\sqrt\\epsilon \\approx 1.5\\times10^{-8}$.'],
        ['the central difference $[f(x + h) - f(x - h)]/2h$', eps ** (1 / 3), 'Truncation $\\sim h^2$, round-off $\\sim\\epsilon/h$: the best step is $h \\sim \\epsilon^{1/3} \\approx 6\\times10^{-6}$.'],
        ['the second difference $[f(x + h) - 2f(x) + f(x - h)]/h^2$ for $f\'\'$', eps ** 0.25, 'Truncation $\\sim h^2$, round-off $\\sim\\epsilon/h^2$: the best step is $h \\sim \\epsilon^{1/4} \\approx 1.2\\times10^{-4}$.'],
      ]);
      const o = orderOpts(r, C[1]);
      return { q: `In double precision (machine epsilon $\\epsilon \\approx 2\\times10^{-16}$), for a function and its derivatives of order 1 near $x = 1$, the step $h$ that gives the most accurate value from ${C[0]} is of order`, ...o,
        sol: `${C[2]} So $h$ is of order $10^{${o.n}}$. Smaller steps make things worse, because the subtraction of nearly equal numbers loses digits.`,
        trap: 'Smaller is not always better: below the optimum, round-off error grows as $h$ shrinks.' };
    } },
  { id: 'num-m35', type: 'mcq', level: 2, exams: ['gate', 'net'], sub: 'quadrature', format: 'which is NOT',
    make(r) {
      const n = int(r, 2, 5), not = r() < 0.6;
      const M = choose(r, [
        [`Gauss-Legendre quadrature with ${n} points on $[-1, 1]$`, [
          [`it integrates every polynomial of degree ${2 * n - 1} exactly`, true, `$n$ nodes and $n$ weights give $2n$ free parameters: exact up to degree $2n - 1 = ${2 * n - 1}$.`],
          [`its nodes are the zeros of the Legendre polynomial $P_{${n}}$`, true, 'That choice makes the rule exact to the highest degree.'],
          ['all its weights are positive', true, 'A standard property of Gauss rules.'],
          [`it integrates every polynomial of degree ${2 * n} exactly`, false, `$\\int P_{${n}}^2dx \\gt 0$ but the rule gives 0 (it vanishes at every node), so degree $2n = ${2 * n}$ fails.`],
          ['its nodes are equally spaced', false, 'The nodes cluster towards the ends of the interval.'],
          ['its nodes include the end points $\\pm1$', false, 'All Gauss-Legendre nodes lie strictly inside $(-1, 1)$.'],
        ]],
        [`the composite Simpson rule with ${2 * n} panels`, [
          ['it needs an even number of panels', true, 'It fits a parabola over each pair of panels.'],
          ['its weights run $1, 4, 2, 4, \\dots, 2, 4, 1$ (times $h/3$)', true, 'Interior points alternate between odd (4) and even (2).'],
          ['it integrates every cubic exactly', true, 'Odd symmetry makes the cubic error term vanish.'],
          ['its error falls as $h^4$', true, 'Global error $O(h^4)$ for smooth integrands.'],
          ['it integrates $x^4$ exactly', false, 'The error term is proportional to $f^{(4)}$, which is 24 for $x^4$.'],
          ['its error falls as $h^2$', false, 'That is the trapezoidal rule; Simpson is fourth order.'],
          ['it works with an odd number of panels just as well', false, 'Each parabola spans two panels, so the count must be even.'],
        ]],
      ]);
      return { q: `For ${M[0]}, which statement is ${not ? '<b>NOT</b> correct' : 'correct'}?`, ...oneOf(r, M[1], not),
        trap: 'Gauss rules with $n$ points reach degree $2n - 1$; Simpson reaches degree 3.' };
    } },
];
