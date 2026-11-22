// Extra question shapes for errors-data-fitting (templates edf-m31..m35). Imported by errors-data-fitting.js.
import { choose, mcqOptions } from '../_util.js';
import { msqOf } from './_more.js';
import { oneOf, orderOpts, matchOne } from './_odd.js';
import { vs, nt, sci } from './_vary.js';

export default [
  { id: 'edf-m31', type: 'msq', level: 2, exams: ['gate', 'net'], sub: 'error propagation', format: 'statements',
    make(r) {
      const n = choose(r, [2, 3, 4]), p = choose(r, [0.5, 1, 2]), N = choose(r, [4, 9, 16, 25]), not = r() < 0.5;
      const m = msqOf(r, [
        vs(r, `if $q = x^{${n}}$ and $x$ has a 1-sigma error of ${p}%, then $q$ has an error of ${n * p}%`, `if $q = x^{${n}}$ and $x$ has a 1-sigma error of ${p}%, then $q$ has an error of ${+(n * n * p).toFixed(1)}%`, `$\\delta q/q = |n|\\,\\delta x/x = ${n}\\times${p}\\% = ${n * p}\\%$.`),
        vs(r, `averaging ${N} independent readings reduces the random error of the mean by a factor ${Math.sqrt(N)}`, `averaging ${N} independent readings reduces the random error of the mean by a factor ${N}`, `The standard error is $\\sigma/\\sqrt N$: factor $\\sqrt{${N}} = ${Math.sqrt(N)}$.`),
        ['for $q = xy$ with independent errors, the relative errors add in quadrature', true, '$(\\delta q/q)^2 = (\\delta x/x)^2 + (\\delta y/y)^2$.'],
        ['for $q = x - y$ with independent errors, the absolute errors add in quadrature', true, '$\\delta q = \\sqrt{\\delta x^2 + \\delta y^2}$: subtraction never cancels errors.'],
        ['a systematic error is reduced by taking more readings', false, 'Every reading carries the same bias; averaging does not remove it.'],
        ['subtracting two nearly equal measured quantities gives a result with a small relative error', false, 'The absolute errors combine while the difference is small: the relative error becomes large.'],
        ['the standard deviation of the readings themselves does not shrink as more readings are taken', true, 'It describes the spread of single readings; it is the error of the mean that shrinks.'],
      ], { not });
      return { q: `Which of the following statements about measurement errors are ${nt(not)}?`, ...m,
        trap: 'Powers multiply the relative error by $|n|$, not $n^2$; averaging helps only random errors.' };
    } },
  { id: 'edf-m32', type: 'mcq', level: 2, exams: ['gate', 'net'], sub: 'least squares',
    make(r) {
      const not = r() < 0.5;
      const m = oneOf(r, [
        ['the least-squares straight line passes through the point $(\\bar x, \\bar y)$', true, 'The intercept equation gives $\\bar y = m\\bar x + c$.'],
        ['the residuals of a least-squares line with an intercept add up to zero', true, 'That is the condition $\\partial S/\\partial c = 0$.'],
        ['ordinary least squares minimises the sum of squared vertical deviations', true, 'It assumes the errors are in $y$ only.'],
        ['with correct error bars, a good fit has reduced chi-square close to 1', true, 'Each degree of freedom contributes about 1 on average.'],
        ['a correlation coefficient of zero means the two variables are unrelated in every way', false, 'It rules out only a linear relation; $y = x^2$ on symmetric $x$ gives $r = 0$.'],
        ['the least-squares slope is insensitive to a single outlier', false, 'Squaring gives large deviations heavy weight; one outlier can swing the line.'],
        ['a reduced chi-square much less than 1 shows an excellent model', false, 'It usually means the error bars were overestimated.'],
      ], not);
      return { q: `Which statement about fitting a straight line is ${nt(not)}?`, ...m,
        trap: 'Reduced chi-square far below 1 is suspicious, not excellent.' };
    } },
  { id: 'edf-m33', type: 'mcq', level: 3, exams: ['gate', 'net'], sub: 'residuals', format: 'graph in words',
    make(r) {
      const L = {
        rand: 'random scatter about zero with no pattern',
        u: 'a systematic U-shaped (or arch-shaped) pattern',
        fan: 'scatter that grows steadily with $x$ (a fan shape)',
        one: 'one point far from all the others',
        step: 'a sudden jump between two groups of points',
      };
      const cas = choose(r, [
        ['a correct straight-line model with constant random errors', 'rand', 'Residuals then contain only noise.'],
        ['a straight line fitted to data that really follow a parabola', 'u', 'The line is above the curve in the middle and below at the ends (or the reverse).'],
        ['a correct model, but errors proportional to the size of $y$ (all points weighted equally)', 'fan', 'Heteroscedastic errors: a weighted fit is needed.'],
        ['a correct model with one mistyped reading', 'one', 'An outlier: check it rather than simply deleting it.'],
        ['a correct model, but the apparatus was recalibrated half way through', 'step', 'A systematic offset between the two runs.'],
      ]);
      return { q: `A plot of residuals (data minus fit) against $x$ for ${cas[0]} typically shows`, ...matchOne(r, L, cas),
        trap: 'A pattern in the residuals means the model (or the weighting) is wrong; good residuals look like noise.' };
    } },
  { id: 'edf-m34', type: 'mcq', level: 2, exams: ['gate', 'net'], sub: 'counting', format: 'limiting case',
    make(r) {
      const p = choose(r, [10, 5, 2, 1, 0.5]), N = (100 / p) ** 2, show = (x) => `${Math.round(x)}`;
      const o = mcqOptions(r, N, [100 / p, (100 / p) ** 2 / 2, 2 * N, Math.sqrt(100 / p)], show);
      return { q: `Counts from a radioactive source follow Poisson statistics. The fewest counts that give a relative uncertainty of ${p}% (one standard deviation) is`,
        options: o.options, answer: o.answer,
        sol: `For $N$ counts, $\\sigma = \\sqrt N$ and the relative error is $1/\\sqrt N$. Setting $1/\\sqrt N = ${p / 100}$: $N = (100/${p})^2 = ${show(N)}$.`,
        trap: 'Halving the relative error needs four times as many counts.' };
    } },
  { id: 'edf-m35', type: 'mcq', level: 3, exams: ['gate', 'net'], sub: 'Gaussian confidence', format: 'order of magnitude',
    make(r) {
      const [k, P] = choose(r, [[3, 2.70e-3], [4, 6.33e-5], [5, 5.73e-7], [6, 1.97e-9]]), M = choose(r, [1, 1000, 1e6]);
      const x = P * M, o = orderOpts(r, x);
      return { q: M === 1
        ? `For a Gaussian distribution, the probability that one measurement deviates from the mean by more than ${k} standard deviations (either side) is of order`
        : `In $${sci(M)}$ independent Gaussian measurements, the expected number deviating from the mean by more than ${k} standard deviations (either side) is of order`,
        options: o.options, answer: o.answer,
        sol: `The two-sided tail beyond ${k}$\\sigma$ is $P = \\text{erfc}(${k}/\\sqrt2) = ${sci(P)}$.${M === 1 ? '' : ` Times $${sci(M)}$ measurements: $${sci(x)}$.`} Useful values: 32% beyond $1\\sigma$, 4.6% beyond $2\\sigma$, 0.27% beyond $3\\sigma$.`,
        trap: 'The tails fall off much faster than exponentially: each extra sigma costs one to two orders of magnitude.' };
    } },
];
