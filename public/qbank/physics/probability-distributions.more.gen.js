// Extra question shapes for probability-distributions (templates prd-m31..m35). Imported by probability-distributions.js.
import { int, choose, mcqOptions, shuffle } from '../_util.js';
import { msqOf, frac } from './_more.js';
import { oneOf, matchOne, orderOpts } from './_odd.js';

export default [
  { id: 'prd-m31', type: 'msq', level: 2, exams: ['gate', 'net'], sub: 'Poisson', format: 'statements',
    make(r) {
      const mu = choose(r, [1.5, 2.5, 3.5, 4.5]), fl = Math.floor(mu), not = r() < 0.5;
      const m = msqOf(r, [
        [`the mean count is ${mu}`, true, 'The Poisson parameter is the mean.'],
        [`the variance of the count is ${mu}`, true, 'For a Poisson distribution the variance equals the mean.'],
        [`the standard deviation of the count is ${mu}`, false, `The standard deviation is $\\sqrt{${mu}} = ${Math.sqrt(mu).toFixed(2)}$.`],
        [`the probability of no counts is $e^{-${mu}}$`, true, '$P(0) = \\mu^0e^{-\\mu}/0!$.'],
        [`the probability of exactly one count is $${mu}e^{-${mu}}$`, true, '$P(1) = \\mu e^{-\\mu}$.'],
        [`the probability of exactly two counts is $${mu}^2e^{-${mu}}$`, false, `$P(2) = \\mu^2e^{-\\mu}/2!$: the factor $1/2$ is missing.`],
        [`the most probable count is ${fl}`, true, `$P(n)/P(n - 1) = \\mu/n$ exceeds 1 while $n \\lt ${mu}$, so the peak is at $n = ${fl}$.`],
        [`the most probable count is ${fl + 1}`, false, `$P(${fl + 1})/P(${fl}) = ${mu}/${fl + 1} \\lt 1$, so the peak is at ${fl}.`],
        ['the waiting times between successive counts are exponentially distributed', true, 'A Poisson process has exponential gaps with mean $1/\\text{rate}$.'],
      ], { not });
      return { q: `Counts recorded in a fixed time from a steady source follow a Poisson distribution with mean ${mu}. Which statements are ${not ? '<b>NOT</b> correct' : 'correct'}?`, ...m,
        trap: 'The Poisson variance equals the mean, so the standard deviation is its square root.' };
    } },
  { id: 'prd-m32', type: 'mcq', level: 3, exams: ['gate', 'net'], sub: 'mean and variance',
    make(r) {
      const L = choose(r, [2, 3, 6]), lam = choose(r, [2, 4, 5]), s = choose(r, [2, 3]), b = choose(r, [2, 4, 6]);
      const inf = 'infinite (the variance does not exist)';
      const C = choose(r, [
        [`uniform on $[0, ${L}]$`, frac(L * L, 12), [frac(L * L, 4), frac(L * L, 3), frac(L, 12)], `$\\sigma^2 = L^2/12 = ${L * L}/12$.`],
        [`$p(x) = ${lam}e^{-${lam}x}$ for $x \\ge 0$`, frac(1, lam * lam), [frac(1, lam), frac(2, lam * lam), `${lam * lam}`], `For an exponential with rate $\\lambda$, $\\langle x\\rangle = 1/\\lambda$ and $\\langle x^2\\rangle = 2/\\lambda^2$, so $\\sigma^2 = 1/\\lambda^2 = 1/${lam * lam}$.`],
        [`$p(x) \\propto e^{-x^2/${2 * s * s}}$`, `${s * s}`, [`${s}`, `${2 * s * s}`, frac(s * s, 2)], `$e^{-x^2/(2\\sigma^2)}$ with $2\\sigma^2 = ${2 * s * s}$, so $\\sigma^2 = ${s * s}$.`],
        [`$p(x) \\propto e^{-x^2/${b}}$`, frac(b, 2), [`${b}`, `${b * b}`, `${2 * b}`], `Compare with $e^{-x^2/(2\\sigma^2)}$: $2\\sigma^2 = ${b}$, so $\\sigma^2 = ${frac(b, 2)}$.`],
        [`$p(x) = \\dfrac{1}{${2 * b}}e^{-|x|/${b}}$`, `${2 * b * b}`, [`${b * b}`, `${b}`, `${4 * b * b}`], `$\\langle x^2\\rangle = \\int_0^\\infty x^2e^{-x/b}dx/b = 2b^2 = ${2 * b * b}$ (mean 0).`],
        [`$p(x) = \\dfrac{${b}}{\\pi(x^2 + ${b * b})}$`, inf, [`${b * b}`, `${2 * b * b}`, `${b}`], 'For the Lorentzian (Cauchy) distribution $\\int x^2p\\,dx$ diverges, because $x^2p \\to b/\\pi$ at large $|x|$. Its width is described by the half-width $b$ instead.'],
      ]);
      const show = (v) => (v === inf ? v : `$${v}$`);
      const o = mcqOptions(r, show(C[1]), shuffle(r, [...C[2], inf].filter((v) => v !== C[1]).map(show)));
      return { q: `The variance of a random variable with probability density ${C[0]} is`, ...o, sol: C[3],
        trap: 'Match the Gaussian to $e^{-x^2/(2\\sigma^2)}$ exactly; and heavy-tailed densities may have no variance at all.' };
    } },
  { id: 'prd-m33', type: 'mcq', level: 3, exams: ['gate', 'net'], sub: 'central limit theorem', format: 'limiting case',
    make(r) {
      const D = choose(r, [['a Gaussian', true], ['a uniform distribution', true], ['an exponential distribution', true], ['a Lorentzian (Cauchy) distribution', false]]);
      const mean = r() < 0.5, N = choose(r, [10, 100, 1000]);
      const L = { inv: 'proportional to $1/\\sqrt N$', lin: 'proportional to $N$', sqrt: 'proportional to $\\sqrt N$', same: 'independent of $N$' };
      const key = D[1] ? (mean ? 'inv' : 'sqrt') : (mean ? 'same' : 'lin');
      const sol = D[1]
        ? `${D[0][0].toUpperCase() + D[0].slice(1)} has a finite variance $\\sigma^2$. Variances of independent variables add, so the sum has variance $N\\sigma^2$ (width $\\sqrt N\\sigma$) and the mean, the sum divided by $N$, has width $\\sigma/\\sqrt N$.`
        : 'The Cauchy distribution has no variance, so the central limit theorem does not apply. Its characteristic function is $e^{-b|k|}$, so a sum of $N$ copies has $e^{-Nb|k|}$: another Cauchy distribution with width $Nb$. The mean therefore has width $b$, exactly as one sample: averaging does not help.';
      return { q: `$N$ independent samples (say $N = ${N}$) are drawn from ${D[0]}. The width of the distribution of their ${mean ? 'mean' : 'sum'} is`, ...matchOne(r, L, [null, key, sol]),
        trap: 'The $1/\\sqrt N$ rule for averages needs a finite variance.' };
    } },
  { id: 'prd-m34', type: 'mcq', level: 2, exams: ['gate', 'net'], sub: 'Poisson', format: 'order of magnitude',
    make(r) {
      const prod = choose(r, [5, 10, 20, 30]), R = choose(r, [0.5, 1, 2, 5]), t = prod / R;
      const p = Math.exp(-prod), o = orderOpts(r, p);
      return { q: `A detector records background counts at an average rate of ${R} per second. The probability that it records no count at all in ${t} s is of order`, ...o,
        sol: `Counts in a time $t$ are Poisson with mean $\\mu = Rt = ${R}\\times${t} = ${prod}$, so $P(0) = e^{-${prod}} \\approx ${p.toExponential(1).replace(/e(-?)\+?(\d+)/, '\\times10^{$1$2}')}$, of order $10^{${o.n}}$.`,
        trap: 'Use $P(0) = e^{-\\mu}$; $e^{-10} \\approx 4.5\\times10^{-5}$, so each extra 10 in $\\mu$ costs a bit over 4 powers of ten.' };
    } },
  { id: 'prd-m35', type: 'mcq', level: 2, exams: ['gate', 'net'], sub: 'Gaussian', format: 'which is NOT',
    make(r) {
      const [a, b, c] = choose(r, [[3, 4, 5], [5, 12, 13], [6, 8, 10], [8, 15, 17]]), not = r() < 0.6;
      const m = oneOf(r, [
        [`$X + Y$ is Gaussian with standard deviation ${c}`, true, `Variances add: $\\sqrt{${a * a} + ${b * b}} = ${c}$.`],
        [`$X - Y$ is Gaussian with standard deviation ${c}`, true, `$\\text{Var}(X - Y) = \\text{Var}X + \\text{Var}Y$ as well: ${c}.`],
        [`$2X$ has standard deviation ${2 * a}`, true, 'Scaling by 2 doubles the spread.'],
        ['$(X - \\mu_X)/\\sigma_X$ has mean 0 and variance 1', true, 'Standardising a Gaussian.'],
        ['for $X$ the mean, median and mode coincide', true, 'A Gaussian is symmetric with a single peak.'],
        [`$X + Y$ has standard deviation ${a + b}`, false, `Standard deviations do not add; variances do, giving ${c}.`],
        [`$X - Y$ has standard deviation ${b - a}`, false, `Subtracting still adds the variances: ${c}.`],
        [`$2X$ has standard deviation $${a}\\sqrt2$`, false, `That would be the spread of $X_1 + X_2$ for two independent copies; $2X$ has ${2 * a}.`],
        ['the product $XY$ is Gaussian', false, 'A product of independent Gaussians is not Gaussian (its density has a logarithmic peak at 0 when the means are 0).'],
      ], not);
      return { q: `$X$ and $Y$ are independent Gaussian random variables with standard deviations ${a} and ${b}. Which statement is ${not ? '<b>NOT</b> correct' : 'correct'}?`, ...m,
        trap: 'For independent variables, variances add for both sums and differences.' };
    } },
];
