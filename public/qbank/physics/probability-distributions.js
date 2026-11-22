// Random variables and probability distributions (CSIR NET Part A/C maths, some GATE): mean and variance, the
// binomial, Poisson, Gaussian, uniform, exponential and Cauchy distributions, counting statistics, random walks,
// the central limit theorem, change of variables, moments and characteristic functions, Bayes' theorem, covariance.
// Topic id `probability-distributions` (the GATE topic `probability` is separate). Original questions for fibub.
import { int, pick, choose, mcqOptions, round } from '../_util.js';
import more from './probability-distributions.more.gen.js';

const fact = (n) => { let f = 1; for (let i = 2; i <= n; i++) f *= i; return f; };
const binom = (n, k) => fact(n) / (fact(k) * fact(n - k));
// erf by Abramowitz and Stegun 7.1.26 (error below 1.5e-7)
const erf = (x) => { const s = Math.sign(x), a = Math.abs(x), t = 1 / (1 + 0.3275911 * a); return s * (1 - (((((1.061405429 * t - 1.453152027) * t) + 1.421413741) * t - 0.284496736) * t + 0.254829592) * t * Math.exp(-a * a)); };
const Phi = (z) => 0.5 * (1 + erf(z / Math.SQRT2));
const simpson = (f, a, b, n = 400) => { const h = (b - a) / n; let s = f(a) + f(b); for (let i = 1; i < n; i++) s += f(a + i * h) * (i % 2 ? 4 : 2); return s * h / 3; };

export default {
  topic: 'probability-distributions',
  items: [
    // ---------- level 1 ----------
    { id: 'prd-001', type: 'mcq', level: 1, exams: ['gate', 'net'], sub: 'Poisson',
      q: 'For a Poisson distribution with mean $\\lambda$, the variance is',
      options: ['$\\lambda^2$', '$\\sqrt\\lambda$', '$\\lambda$', '$1/\\lambda$'], answer: 2,
      sol: '$P(n) = \\lambda^ne^{-\\lambda}/n!$ gives $\\langle n\\rangle = \\lambda$ and $\\langle n(n-1)\\rangle = \\lambda^2$, so $\\langle n^2\\rangle = \\lambda^2 + \\lambda$ and $\\sigma^2 = \\lambda$. The standard deviation is $\\sqrt\\lambda$: that is why counting $N$ events has an uncertainty $\\sqrt N$.',
      trap: '$\\sqrt\\lambda$ is the standard deviation, not the variance.' },
    { id: 'prd-002', type: 'nat', level: 1, exams: ['gate', 'net'], sub: 'mean and variance',
      q: 'The expected value of the number shown by a fair six-sided die is ______.',
      answer: 3.5, tol: 0.01, calc: () => (1 + 2 + 3 + 4 + 5 + 6) / 6,
      sol: 'Each face has probability $1/6$: $\\langle X\\rangle = \\tfrac16(1 + 2 + 3 + 4 + 5 + 6) = 21/6 = 3.5$. The mean need not be a possible outcome.' },
    { id: 'prd-003', type: 'mcq', level: 1, exams: ['gate', 'net'], sub: 'Gaussian',
      q: 'For a Gaussian (normal) distribution, the probability that a value lies within one standard deviation of the mean is about',
      options: ['$50\\%$', '$68\\%$', '$95\\%$', '$99.7\\%$'], answer: 1,
      sol: '$P(|x - \\mu| < \\sigma) = \\mathrm{erf}(1/\\sqrt2) \\approx 0.683$. The "68-95-99.7 rule" gives about 68%, 95% and 99.7% within $1\\sigma$, $2\\sigma$ and $3\\sigma$.' },
    { id: 'prd-004', type: 'nat', level: 1, exams: ['gate', 'net'], sub: 'binomial',
      q: 'A detector registers each incoming photon with probability 0.3. For 10 photons, the mean number registered is ______.',
      answer: 3, tol: 0, calc: () => 10 * 0.3,
      sol: 'The number registered is binomial with $n = 10$, $p = 0.3$, whose mean is $np = 3$.' },
    { id: 'prd-005', type: 'mcq', level: 1, exams: ['gate', 'net'], sub: 'uniform',
      q: 'A random variable is uniformly distributed on $[0, a]$. Its variance is',
      options: ['$a^2/12$', '$a^2/4$', '$a/2$', '$a^2/3$'], answer: 0,
      sol: '$\\langle x\\rangle = a/2$ and $\\langle x^2\\rangle = \\dfrac1a\\int_0^a x^2\\,dx = a^2/3$. So $\\sigma^2 = a^2/3 - a^2/4 = a^2/12$.',
      trap: '$a^2/3$ is $\\langle x^2\\rangle$; you must subtract the square of the mean.' },
    { id: 'prd-006', type: 'mcq', level: 1, exams: ['gate', 'net'], sub: 'basic probability',
      q: 'Two fair coins are tossed. The probability of getting at least one head is',
      options: ['$1/2$', '$1/4$', '$2/3$', '$3/4$'], answer: 3,
      sol: 'The complement, no heads at all, has probability $\\tfrac12\\cdot\\tfrac12 = \\tfrac14$. So $P(\\text{at least one head}) = 1 - \\tfrac14 = \\tfrac34$. (Listing HH, HT, TH, TT gives the same.)',
      trap: '$2/3$ comes from treating "0, 1, 2 heads" as equally likely; they are not.' },

    // ---------- level 2 ----------
    { id: 'prd-007', type: 'nat', level: 2, exams: ['gate', 'net'], sub: 'binomial',
      q: 'In 20 independent trials, each succeeding with probability 0.25, the variance of the number of successes is ______.',
      answer: 3.75, tol: 0.01, calc: () => 20 * 0.25 * 0.75,
      sol: 'For the binomial distribution $\\sigma^2 = np(1-p) = 20\\times0.25\\times0.75 = 3.75$.' },
    { id: 'prd-008', type: 'mcq', level: 2, exams: ['gate', 'net'], sub: 'Poisson',
      q: 'A Geiger counter records on average 2 counts per second from a weak source. The probability of no count in a given second is',
      options: ['$e^{-2}$', '$2e^{-2}$', '$1 - e^{-2}$', '$e^{-1/2}$'], answer: 0,
      sol: 'Counts in a fixed interval are Poisson with $\\lambda = 2$: $P(0) = \\lambda^0e^{-\\lambda}/0! = e^{-2} \\approx 0.135$. $2e^{-2}$ is $P(1)$ and $1 - e^{-2}$ is the probability of at least one count.' },
    { id: 'prd-009', type: 'nat', level: 2, exams: ['gate', 'net'], sub: 'exponential',
      q: 'The waiting time $t$ between decays has the density $p(t) = \\lambda e^{-\\lambda t}$ with $\\lambda = 0.5\\ \\text{s}^{-1}$. The mean waiting time is ______ s.',
      answer: 2, tol: 0.01, unit: 's', calc: () => 1 / 0.5,
      sol: '$\\langle t\\rangle = \\int_0^\\infty t\\,\\lambda e^{-\\lambda t}\\,dt = 1/\\lambda = 2$ s. The standard deviation is also $1/\\lambda$.' },
    { id: 'prd-010', type: 'mcq', level: 2, exams: ['gate', 'net'], sub: 'random walk',
      q: 'A particle takes $N$ steps of fixed length $l$, each equally likely to the left or right, independently. Its root-mean-square distance from the start is',
      options: ['$Nl$', '$l\\sqrt N$', '$lN^2$', '$l/\\sqrt N$'], answer: 1,
      sol: 'Write $x = \\sum_i s_i$ with $s_i = \\pm l$. Then $\\langle x\\rangle = 0$ and $\\langle x^2\\rangle = \\sum_i\\langle s_i^2\\rangle + \\sum_{i\\neq j}\\langle s_i\\rangle\\langle s_j\\rangle = Nl^2$. So $x_{\\text{rms}} = l\\sqrt N$: the root of diffusion, $\\langle x^2\\rangle \\propto t$.' },
    { id: 'prd-011', type: 'nat', level: 2, exams: ['gate', 'net'], sub: 'basic probability',
      q: 'Two fair dice are thrown. The probability that the total is 7 is ______ (give a decimal).',
      answer: 0.1667, tol: 0.002, calc: () => 6 / 36,
      sol: 'Of the 36 equally likely pairs, six give 7: (1,6), (2,5), (3,4), (4,3), (5,2), (6,1). $P = 6/36 = 1/6 \\approx 0.167$. Seven is the most likely total.' },
    { id: 'prd-012', type: 'mcq', level: 2, exams: ['gate', 'net'], sub: 'mean and variance',
      q: 'If $X$ has variance $\\sigma^2$ and $Y = aX + b$ with constants $a, b$, then the variance of $Y$ is',
      options: ['$a\\sigma^2 + b$', '$a^2\\sigma^2 + b^2$', '$|a|\\sigma^2$', '$a^2\\sigma^2$'], answer: 3,
      sol: '$Y - \\langle Y\\rangle = a(X - \\langle X\\rangle)$: the shift $b$ cancels. Squaring and averaging, $\\mathrm{Var}\\,Y = a^2\\sigma^2$.',
      trap: 'Adding a constant moves the distribution without widening it.' },
    { id: 'prd-013', type: 'msq', level: 2, exams: ['gate', 'net'], sub: 'mean and variance',
      q: 'For two independent random variables $X$ and $Y$, which relations always hold?',
      options: ['$\\langle X + Y\\rangle = \\langle X\\rangle + \\langle Y\\rangle$', '$\\mathrm{Var}(X + Y) = \\mathrm{Var}\\,X + \\mathrm{Var}\\,Y$', '$\\langle XY\\rangle = \\langle X\\rangle\\langle Y\\rangle$', '$\\mathrm{Var}(X - Y) = \\mathrm{Var}\\,X - \\mathrm{Var}\\,Y$'], answer: [0, 1, 2],
      sol: 'The mean is linear for any variables. Independence makes the covariance zero, so $\\langle XY\\rangle = \\langle X\\rangle\\langle Y\\rangle$ and variances add. For a difference, $\\mathrm{Var}(X - Y) = \\mathrm{Var}\\,X + (-1)^2\\mathrm{Var}\\,Y$: variances still add, they never subtract.',
      trap: 'Errors add in quadrature for a difference as well as for a sum.' },
    { id: 'prd-014', type: 'nat', level: 2, exams: ['gate', 'net'], sub: 'counting statistics',
      q: 'A detector records on average 400 counts in a fixed time window. The standard deviation of the number of counts from one window to the next is ______.',
      answer: 20, tol: 0, calc: () => Math.sqrt(400),
      sol: 'Independent rare events give Poisson statistics, so $\\sigma = \\sqrt{\\langle N\\rangle} = \\sqrt{400} = 20$, a 5% fractional spread.' },
    { id: 'prd-015', type: 'mcq', level: 2, exams: ['gate', 'net'], sub: 'Bayes theorem',
      q: 'A rare condition affects 1% of a population. A test detects it in 99% of those who have it, and falsely signals it in 1% of those who do not. A person tests positive. The probability that they have the condition is',
      options: ['$99\\%$', '$50\\%$', '$1\\%$', '$90\\%$'], answer: 1,
      sol: 'Bayes: $P(C\\mid+) = \\dfrac{P(+\\mid C)P(C)}{P(+\\mid C)P(C) + P(+\\mid\\bar C)P(\\bar C)} = \\dfrac{0.99\\times0.01}{0.99\\times0.01 + 0.01\\times0.99} = \\tfrac12$. In 10 000 people: 99 true positives and 99 false positives.',
      trap: 'Confusing $P(+\\mid C) = 99\\%$ with $P(C\\mid+)$ ignores how rare the condition is.' },
    { id: 'prd-016', type: 'mcq', level: 2, exams: ['gate', 'net'], sub: 'normalisation',
      q: 'The probability density $p(x) = C e^{-|x|}$ on the whole real line is normalised when $C$ equals',
      options: ['$1$', '$2$', '$1/e$', '$1/2$'], answer: 3,
      sol: '$\\int_{-\\infty}^\\infty e^{-|x|}\\,dx = 2\\int_0^\\infty e^{-x}\\,dx = 2$, so $C = 1/2$. This is the Laplace (double-exponential) distribution, with variance 2.' },
    { id: 'prd-041', type: 'nat', level: 2, exams: ['gate', 'net'], sub: 'Gaussian',
      q: 'For a Gaussian distribution, the percentage of values that lie more than $2\\sigma$ away from the mean (on either side) is ______ %.',
      answer: 4.55, tol: 0.1, unit: '%', calc: () => 100 * (1 - erf(2 / Math.SQRT2)),
      sol: '$P(|x - \\mu| < 2\\sigma) = \\mathrm{erf}(2/\\sqrt2) = \\mathrm{erf}(1.414) \\approx 0.9545$. The rest, $1 - 0.9545 = 0.0455$, is 4.55%, split equally between the two tails.' },

    // ---------- level 3 ----------
    { id: 'prd-017', type: 'nat', level: 3, exams: ['gate', 'net'], sub: 'Poisson',
      q: 'Each of 1000 independent nuclei decays in a given minute with probability 0.002. Using the Poisson approximation, the probability that none decays in that minute is ______.',
      answer: 0.1353, tol: 0.002, calc: () => Math.exp(-2),
      sol: 'For large $n$ and small $p$ the binomial becomes Poisson with $\\lambda = np = 2$. $P(0) = e^{-2} \\approx 0.135$. (The exact binomial value $0.998^{1000} = e^{1000\\ln0.998} \\approx e^{-2.002} \\approx 0.135$ agrees.)' },
    { id: 'prd-018', type: 'mcq', level: 3, exams: ['net'], sub: 'Cauchy',
      q: 'The Lorentzian (Cauchy) density $p(x) = \\dfrac1\\pi\\dfrac{\\gamma}{x^2 + \\gamma^2}$ describes a natural line shape. Which statement is correct?',
      options: ['Its mean is 0 and its variance is $\\gamma^2$', 'Its variance is infinite, and its mean is not defined because $\\int|x|p\\,dx$ diverges', 'Its variance is $\\gamma^2/2$', 'Its mean is $\\gamma$'], answer: 1,
      sol: 'For large $|x|$, $p \\sim \\gamma/(\\pi x^2)$, so $\\int|x|p\\,dx$ diverges logarithmically and $\\int x^2p\\,dx$ diverges linearly. The width is described instead by the half width at half maximum, $\\gamma$. Because the variance is infinite, the central limit theorem does not apply: the average of many Cauchy variables is still Cauchy with the same width.',
      trap: 'Symmetry makes the principal value of the mean zero, but the mean as an expectation does not exist.' },
    { id: 'prd-019', type: 'nat', level: 3, exams: ['gate', 'net'], sub: 'moments',
      q: 'For a Gaussian with mean 0 and standard deviation $\\sigma = 2$, the fourth moment $\\langle x^4\\rangle$ is ______.',
      answer: 48, tol: 0, calc: () => 3 * 2 ** 4,
      sol: 'For a zero-mean Gaussian $\\langle x^{2n}\\rangle = (2n-1)!!\\,\\sigma^{2n}$, so $\\langle x^4\\rangle = 3\\sigma^4 = 3\\times16 = 48$. The ratio $\\langle x^4\\rangle/\\langle x^2\\rangle^2 = 3$ is the Gaussian kurtosis.' },
    { id: 'prd-020', type: 'mcq', level: 3, exams: ['net'], sub: 'characteristic function',
      q: 'The characteristic function $\\phi(k) = \\langle e^{ikx}\\rangle$ of a Gaussian with mean $\\mu$ and variance $\\sigma^2$ is',
      options: ['$e^{ik\\mu}$', '$e^{-\\sigma^2k^2}$', '$e^{ik\\mu - \\sigma^2k^2/2}$', '$e^{-ik\\mu + \\sigma^2k^2/2}$'], answer: 2,
      sol: 'Completing the square in $\\dfrac{1}{\\sqrt{2\\pi}\\sigma}\\int e^{ikx - (x-\\mu)^2/2\\sigma^2}dx$ gives $e^{ik\\mu - \\sigma^2k^2/2}$. Its logarithm has only first and second cumulants ($\\mu$ and $\\sigma^2$); all higher cumulants of a Gaussian vanish. The Fourier transform of a Gaussian is a Gaussian.' },
    { id: 'prd-021', type: 'nat', level: 3, exams: ['gate', 'net'], sub: 'Poisson',
      q: 'Two independent sources give Poisson counts with means 2 and 3 in a fixed interval. The probability that the total number of counts is exactly 1 is ______.',
      answer: 0.0337, tol: 0.0005, calc: () => 5 * Math.exp(-5),
      sol: 'A sum of independent Poisson variables is Poisson with the summed mean, $\\lambda = 5$. $P(1) = 5e^{-5} \\approx 0.0337$. Check directly: $P = P_1(1)P_2(0) + P_1(0)P_2(1) = 2e^{-2}e^{-3} + e^{-2}3e^{-3} = 5e^{-5}$.' },
    { id: 'prd-022', type: 'mcq', level: 3, exams: ['gate', 'net'], sub: 'change of variables',
      q: '$X$ is uniformly distributed on $(0, 1)$ and $Y = -\\ln X$. The probability density of $Y$ is',
      options: ['uniform on $(0, \\infty)$', '$e^{-y}$ for $y > 0$', '$ye^{-y}$ for $y > 0$', '$1/y$ for $y > 0$'], answer: 1,
      sol: '$p_Y(y) = p_X(x)\\left|\\dfrac{dx}{dy}\\right|$ with $x = e^{-y}$: $p_Y = 1\\cdot e^{-y}$ for $y > 0$. This is how computers turn uniform random numbers into exponential waiting times.',
      trap: 'The Jacobian $|dx/dy|$ is essential: a density is not simply re-labelled.' },
    { id: 'prd-023', type: 'nat', level: 3, exams: ['gate', 'net'], sub: 'Maxwell distribution',
      q: 'For the Maxwell speed distribution of a gas, the ratio $v_{\\text{rms}}/v_{\\text{p}}$ of the root-mean-square speed to the most probable speed is ______.',
      answer: 1.2247, tol: 0.005, calc: () => Math.sqrt(3 / 2),
      sol: '$v_{\\text{p}} = \\sqrt{2kT/m}$ (the peak of $v^2e^{-mv^2/2kT}$) and $v_{\\text{rms}} = \\sqrt{3kT/m}$ (from $\\tfrac12m\\langle v^2\\rangle = \\tfrac32kT$). The ratio is $\\sqrt{3/2} \\approx 1.225$. The mean speed $\\sqrt{8kT/\\pi m}$ lies between them.' },
    { id: 'prd-024', type: 'msq', level: 3, exams: ['gate', 'net'], sub: 'central limit theorem',
      q: 'Which statements about the central limit theorem are correct?',
      options: ['The sum of $N$ independent, identically distributed variables with finite variance tends to a Gaussian for large $N$', 'The mean of $N$ such samples has standard deviation $\\sigma/\\sqrt N$', 'It applies to Cauchy-distributed variables', 'The variance of the sum grows in proportion to $N$'], answer: [0, 1, 3],
      sol: 'Variances of independent variables add, so the sum has variance $N\\sigma^2$ and the mean $\\sigma^2/N$. The theorem needs a finite variance; the Cauchy distribution has none, and the mean of $N$ Cauchy variables has the same Cauchy distribution as one.' },
    { id: 'prd-025', type: 'nat', level: 3, exams: ['gate', 'net'], sub: 'random walk',
      q: 'A walker takes 10 unit steps, each to the left or right with probability 1/2. The probability that it ends at the starting point is ______.',
      answer: 0.2461, tol: 0.002, calc: () => binom(10, 5) / 1024,
      sol: 'Ending at the origin needs exactly 5 steps right out of 10: $P = \\binom{10}{5}/2^{10} = 252/1024 \\approx 0.246$. The Gaussian estimate $2/\\sqrt{2\\pi N} = 0.252$ (the factor 2 because only even positions are reachable) is close.' },
    { id: 'prd-026', type: 'mcq', level: 3, exams: ['gate', 'net'], sub: 'exponential',
      q: 'The lifetime $T$ of an unstable nucleus is exponentially distributed. A nucleus has already survived a time $s$. The probability that it survives a further time $t$ is',
      options: ['$e^{-\\lambda(s + t)}$', '$e^{-\\lambda s}$', '$e^{-\\lambda t}$', '$1 - e^{-\\lambda t}$'], answer: 2,
      sol: '$P(T > s + t\\mid T > s) = \\dfrac{e^{-\\lambda(s+t)}}{e^{-\\lambda s}} = e^{-\\lambda t}$: the nucleus has no memory of its age. The exponential is the only continuous distribution with this property, which is why decay has a fixed half-life.' },
    { id: 'prd-027', type: 'nat', level: 3, exams: ['gate', 'net'], sub: 'covariance',
      q: '$X$ takes the values $-1, 0, 1$ with equal probability, and $Y = X^2$. The covariance $\\langle XY\\rangle - \\langle X\\rangle\\langle Y\\rangle$ is ______.',
      answer: 0, tol: 0, calc: () => (-1 + 0 + 1) / 3 - 0 * (2 / 3),
      sol: '$\\langle XY\\rangle = \\langle X^3\\rangle = \\tfrac13(-1 + 0 + 1) = 0$ and $\\langle X\\rangle = 0$, so the covariance is 0. Yet $Y$ is completely determined by $X$: zero covariance does not mean independence.' },
    { id: 'prd-028', type: 'mcq', level: 3, exams: ['gate', 'net'], sub: 'Gaussian',
      q: 'The full width at half maximum of a Gaussian of standard deviation $\\sigma$ is',
      options: ['$2\\sigma$', '$2\\sqrt{2\\ln2}\\,\\sigma \\approx 2.355\\sigma$', '$\\sqrt{2\\ln2}\\,\\sigma \\approx 1.177\\sigma$', '$\\sqrt2\\,\\sigma$'], answer: 1,
      sol: 'Half maximum where $e^{-x^2/2\\sigma^2} = \\tfrac12$: $x = \\sigma\\sqrt{2\\ln2} \\approx 1.177\\sigma$. That is the half width; the full width is twice it, $2.355\\sigma$.',
      trap: '$1.177\\sigma$ is the half width at half maximum.' },

    // ---------- level 4 ----------
    { id: 'prd-029', type: 'nat', level: 4, exams: ['gate', 'net'], sub: 'Poisson',
      q: 'Events follow a Poisson distribution with mean 1 per interval. The probability of two or more events in an interval is ______.',
      answer: 0.2642, tol: 0.002, calc: () => 1 - 2 * Math.exp(-1),
      sol: '$P(\\geq2) = 1 - P(0) - P(1) = 1 - e^{-1} - e^{-1} = 1 - 2/e \\approx 0.264$.' },
    { id: 'prd-030', type: 'mcq', level: 4, exams: ['gate', 'net'], sub: 'sums of variables',
      q: '$X$ and $Y$ are independent and each uniform on $(0, 1)$. The density of $S = X + Y$ is',
      options: ['uniform on $(0, 2)$', 'a Gaussian centred at 1', 'zero at $S = 1$ and largest at the ends', 'triangular on $(0, 2)$, peaked at $S = 1$'], answer: 3,
      sol: 'The density of a sum is the convolution: $p_S(s) = \\int p_X(x)p_Y(s - x)\\,dx$ = the length of overlap, which is $s$ for $0 < s < 1$ and $2 - s$ for $1 < s < 2$. A triangle with peak 1 at $s = 1$. Adding more uniforms smooths it towards a Gaussian (the central limit theorem at work).' },
    { id: 'prd-031', type: 'nat', level: 4, exams: ['gate', 'net'], sub: 'moments',
      q: 'For a Gaussian with mean 0 and $\\sigma = 1$, the mean absolute value $\\langle|x|\\rangle$ is ______.',
      answer: 0.7979, tol: 0.005, calc: () => Math.sqrt(2 / Math.PI),
      sol: '$\\langle|x|\\rangle = 2\\int_0^\\infty \\dfrac{x}{\\sqrt{2\\pi}}e^{-x^2/2}dx = \\dfrac{2}{\\sqrt{2\\pi}}\\left[-e^{-x^2/2}\\right]_0^\\infty = \\sqrt{2/\\pi} \\approx 0.798$.' },
    { id: 'prd-032', type: 'mcq', level: 4, exams: ['net'], sub: 'chi-square',
      q: '$Z_1, \\dots, Z_4$ are independent standard normal variables. The variable $\\chi^2 = Z_1^2 + Z_2^2 + Z_3^2 + Z_4^2$ has mean and variance',
      options: ['$4$ and $8$', '$4$ and $4$', '$2$ and $4$', '$16$ and $32$'], answer: 0,
      sol: 'Each $Z^2$ has mean $\\langle Z^2\\rangle = 1$ and variance $\\langle Z^4\\rangle - 1 = 3 - 1 = 2$. Four independent terms: mean 4, variance 8. In general the $\\chi^2$ distribution with $\\nu$ degrees of freedom has mean $\\nu$ and variance $2\\nu$.' },
    { id: 'prd-033', type: 'nat', level: 4, exams: ['gate', 'net'], sub: 'binomial',
      q: 'For a binomial distribution with $n = 10$ and $p = 0.35$, the most probable number of successes is ______.',
      answer: 3, tol: 0, calc: () => Math.floor(11 * 0.35),
      sol: 'The ratio $P(k+1)/P(k) = \\dfrac{(n-k)p}{(k+1)(1-p)}$ is above 1 while $k < (n+1)p - 1$. So the mode is $\\lfloor(n+1)p\\rfloor = \\lfloor3.85\\rfloor = 3$. Check: $P(3) \\approx 0.252$, $P(4) \\approx 0.238$.' },
    { id: 'prd-034', type: 'msq', level: 4, exams: ['gate', 'net'], sub: 'mean and variance',
      q: 'Which distributions are paired with their correct variance?',
      options: ['Binomial ($n$, $p$): $np(1-p)$', 'Poisson (mean $\\lambda$): $\\lambda$', 'Exponential (rate $\\lambda$): $1/\\lambda$', 'Uniform on $(a, b)$: $(b-a)^2/12$'], answer: [0, 1, 3],
      sol: 'The exponential distribution with rate $\\lambda$ has mean $1/\\lambda$ and $\\langle t^2\\rangle = 2/\\lambda^2$, so its variance is $1/\\lambda^2$, not $1/\\lambda$. The other three are correct.' },
    { id: 'prd-035', type: 'nat', level: 4, exams: ['gate', 'net'], sub: 'Poisson',
      q: 'A source gives on average 3 counts per second. The probability of exactly 3 counts in one second is ______.',
      answer: 0.2240, tol: 0.002, calc: () => 27 / 6 * Math.exp(-3),
      sol: '$P(3) = \\dfrac{3^3e^{-3}}{3!} = 4.5\\times0.0498 \\approx 0.224$. Even the most likely outcome (the mean) has under a quarter of the probability.' },
    { id: 'prd-036', type: 'mcq', level: 4, exams: ['net'], sub: 'change of variables',
      q: '$x$ is Gaussian with mean 0 and variance $\\sigma^2$. The density of $y = x^2$, for $y > 0$, is',
      options: ['$\\dfrac{1}{\\sqrt{2\\pi}\\sigma}e^{-y/2\\sigma^2}$', '$\\dfrac{1}{2\\sigma^2}e^{-y/2\\sigma^2}$', '$\\dfrac{1}{\\sqrt{2\\pi\\sigma^2y}}e^{-y/2\\sigma^2}$', '$\\dfrac{y}{\\sigma^2}e^{-y^2/2\\sigma^2}$'], answer: 2,
      sol: 'Both $x = \\pm\\sqrt y$ map to the same $y$, and $|dx/dy| = 1/(2\\sqrt y)$. So $p_Y = 2\\cdot\\dfrac{1}{\\sqrt{2\\pi}\\sigma}e^{-y/2\\sigma^2}\\cdot\\dfrac{1}{2\\sqrt y}$, the $\\chi^2$ density with one degree of freedom. It diverges (integrably) at $y = 0$.',
      trap: 'Forgetting the second root $x = -\\sqrt y$ loses a factor of 2.' },
    { id: 'prd-042', type: 'mcq', level: 4, exams: ['gate', 'net'], sub: 'joint distributions',
      q: '$X$ and $Y$ are independent, each with density $e^{-t}$ for $t > 0$. The probability that $X > 2Y$ is',
      options: ['$1/2$', '$1/3$', '$2/3$', '$1/4$'], answer: 1,
      sol: '$P(X > 2Y) = \\int_0^\\infty e^{-y}P(X > 2y)\\,dy = \\int_0^\\infty e^{-y}e^{-2y}\\,dy = \\tfrac13$.' },

    // ---------- level 5 ----------
    { id: 'prd-037', type: 'nat', level: 5, exams: ['gate', 'net'], sub: 'random walk',
      q: 'A biased walker steps $+1$ with probability 0.6 and $-1$ with probability 0.4, independently, for 100 steps. The standard deviation of its final position is ______.',
      answer: 9.798, tol: 0.05, calc: () => Math.sqrt(4 * 100 * 0.6 * 0.4),
      sol: 'Each step has mean $0.6 - 0.4 = 0.2$ and $\\langle s^2\\rangle = 1$, so variance $1 - 0.04 = 0.96$ ($= 4pq$). For 100 independent steps the variance is 96 and $\\sigma = \\sqrt{96} \\approx 9.80$. The mean position is $+20$: drift grows as $N$, spread as $\\sqrt N$.' },
    { id: 'prd-038', type: 'nat', level: 5, exams: ['net'], sub: 'Poisson',
      q: 'For a Poisson distribution with mean $\\lambda = 100$, use the Gaussian limit (or Stirling\'s formula) to find the probability of exactly 100 events, to three significant figures: ______.',
      answer: 0.0399, tol: 0.0005, calc: () => 1 / Math.sqrt(2 * Math.PI * 100),
      sol: 'For large $\\lambda$ the Poisson tends to a Gaussian of mean $\\lambda$ and variance $\\lambda$, whose peak height is $1/\\sqrt{2\\pi\\lambda} = 1/\\sqrt{628.3} \\approx 0.0399$. Stirling gives the same: $\\lambda^\\lambda e^{-\\lambda}/\\lambda! \\approx 1/\\sqrt{2\\pi\\lambda}$. (Exact value 0.03986.)' },
    { id: 'prd-039', type: 'mcq', level: 5, exams: ['net'], sub: 'characteristic function',
      q: 'The cumulants $\\kappa_n$ are defined by $\\ln\\langle e^{ikx}\\rangle = \\sum_n \\kappa_n(ik)^n/n!$. For a Poisson distribution with mean $\\lambda$, every cumulant $\\kappa_n$ ($n \\geq 1$) equals',
      options: ['$\\lambda$', '$\\lambda^n$', '$n!\\,\\lambda$', '$0$ for $n > 2$'], answer: 0,
      sol: '$\\langle e^{ikn}\\rangle = \\sum_n \\dfrac{\\lambda^ne^{-\\lambda}}{n!}e^{ikn} = \\exp[\\lambda(e^{ik} - 1)]$. Its logarithm is $\\lambda(e^{ik} - 1) = \\lambda\\sum_{n\\geq1}(ik)^n/n!$, so $\\kappa_n = \\lambda$ for all $n$: mean, variance and third cumulant are all $\\lambda$. Vanishing cumulants beyond the second is the Gaussian\'s property.' },
    { id: 'prd-040', type: 'nat', level: 5, exams: ['net'], sub: 'geometric probability',
      q: 'A needle of length $d$ is dropped at random on a floor ruled with parallel lines a distance $d$ apart. The probability that it crosses a line is ______.',
      answer: 0.6366, tol: 0.003, calc: () => 2 / Math.PI,
      sol: 'Let $y \\in [0, d/2]$ be the distance from the needle\'s centre to the nearest line (uniform, density $2/d$) and $\\theta \\in [0, \\pi/2]$ its angle to the lines (density $2/\\pi$). It crosses when $y < \\tfrac d2\\sin\\theta$. $P = \\int_0^{\\pi/2}\\dfrac2\\pi\\cdot\\dfrac2d\\cdot\\dfrac d2\\sin\\theta\\,d\\theta = \\dfrac2\\pi \\approx 0.637$ (Buffon\'s needle).' },
  ],
  gens: [
    { id: 'prd-g01', type: 'nat', level: 2, exams: ['gate', 'net'], sub: 'binomial',
      make(r) {
        const n = int(r, 4, 12), k = int(r, 0, n), p = pick(r, 0.1, 0.9, 0.05);
        const answer = round(binom(n, k) * p ** k * (1 - p) ** (n - k), 4);
        return { q: `Each of ${n} independent trials succeeds with probability ${p}. Find the probability of exactly ${k} successes.`,
          answer, tol: Math.max(0.0005, answer * 0.01), n, k, p,
          sol: `Binomial: $P(k) = \\binom{n}{k}p^k(1-p)^{n-k} = \\binom{${n}}{${k}}(${p})^{${k}}(${round(1 - p, 2)})^{${n - k}} = ${binom(n, k)}\\times${round(p ** k, 6)}\\times${round((1 - p) ** (n - k), 6)} = ${answer}$.` };
      },
      verify: (x) => { let s = 1; for (let i = 0; i < x.k; i++) s *= (x.n - i) / (i + 1) * x.p; return s * (1 - x.p) ** (x.n - x.k); } },
    { id: 'prd-g02', type: 'nat', level: 2, exams: ['gate', 'net'], sub: 'Poisson',
      make(r) {
        const lam = pick(r, 0.5, 6, 0.5), k = int(r, 0, 6);
        const answer = round(lam ** k * Math.exp(-lam) / fact(k), 4);
        return { q: `A weak source gives on average ${lam} counts per second. Assuming Poisson statistics, find the probability of exactly ${k} counts in one second.`,
          answer, tol: Math.max(0.0005, answer * 0.01), lam, k,
          sol: `$P(k) = \\dfrac{\\lambda^ke^{-\\lambda}}{k!} = \\dfrac{${lam}^{${k}}e^{-${lam}}}{${k}!} = \\dfrac{${round(lam ** k, 4)}\\times${round(Math.exp(-lam), 5)}}{${fact(k)}} = ${answer}$.` };
      },
      verify: (p) => { let t = Math.exp(-p.lam); for (let i = 1; i <= p.k; i++) t *= p.lam / i; return t; } },
    { id: 'prd-g03', type: 'nat', level: 3, exams: ['gate', 'net'], sub: 'Gaussian',
      make(r) {
        const mu = int(r, 10, 90), s = int(r, 2, 8), za = choose(r, [-2, -1.5, -1, -0.5, 0]), zb = za + choose(r, [0.5, 1, 1.5, 2, 2.5, 3]);
        const a = mu + za * s, b = mu + zb * s;
        const answer = round(Phi(zb) - Phi(za), 4);
        return { q: `A measured quantity is Gaussian with mean ${mu} and standard deviation ${s}. Find the probability that a measurement lies between ${a} and ${b}. (Use $\\Phi(z) = \\tfrac12[1 + \\mathrm{erf}(z/\\sqrt2)]$; $\\Phi(0.5) = 0.6915$, $\\Phi(1) = 0.8413$, $\\Phi(1.5) = 0.9332$, $\\Phi(2) = 0.9772$, $\\Phi(2.5) = 0.9938$, $\\Phi(3) = 0.99865$.)`,
          answer, tol: 0.002, mu, s, a, b,
          sol: `Standardise: $z = (x - \\mu)/\\sigma$ gives $z_a = (${a} - ${mu})/${s} = ${za}$ and $z_b = ${zb}$. $P = \\Phi(${zb}) - \\Phi(${za}) = ${round(Phi(zb), 4)} - ${round(Phi(za), 4)} = ${answer}$, using $\\Phi(-z) = 1 - \\Phi(z)$.` };
      },
      verify: (p) => simpson((x) => Math.exp(-((x - p.mu) ** 2) / (2 * p.s * p.s)) / (Math.sqrt(2 * Math.PI) * p.s), p.a, p.b) },
    { id: 'prd-g04', type: 'nat', level: 3, exams: ['gate', 'net'], sub: 'random walk',
      make(r) {
        const N = 2 * int(r, 2, 7), m = 2 * int(r, 0, N / 2) - N;
        const k = (N + m) / 2, answer = round(binom(N, k) / 2 ** N, 4);
        return { q: `A walker takes ${N} unit steps, each to the right or left with probability 1/2. Find the probability that it ends at position $x = ${m}$.`,
          answer, tol: Math.max(0.0005, answer * 0.01), N, m,
          sol: `To end at $${m}$ it needs $n_R - n_L = ${m}$ and $n_R + n_L = ${N}$, so $n_R = ${k}$. $P = \\binom{${N}}{${k}}/2^{${N}} = ${binom(N, k)}/${2 ** N} = ${answer}$.`,
          trap: 'After an even number of steps only even positions can be reached.' };
      },
      verify: (p) => { let dist = { 0: 1 }; for (let i = 0; i < p.N; i++) { const nd = {}; for (const [x, w] of Object.entries(dist)) { nd[+x + 1] = (nd[+x + 1] || 0) + w / 2; nd[+x - 1] = (nd[+x - 1] || 0) + w / 2; } dist = nd; } return dist[p.m] || 0; } },
    { id: 'prd-g05', type: 'nat', level: 2, exams: ['gate', 'net'], sub: 'mean and variance',
      make(r) {
        const xs = [int(r, -3, 0), int(r, 1, 3), int(r, 4, 7)], w = [int(r, 1, 5), int(r, 1, 5), int(r, 1, 5)], W = w[0] + w[1] + w[2];
        const ask = choose(r, ['mean', 'variance']);
        const mean = xs.reduce((s, x, i) => s + x * w[i], 0) / W, m2 = xs.reduce((s, x, i) => s + x * x * w[i], 0) / W;
        const answer = round(ask === 'mean' ? mean : m2 - mean * mean, 4);
        return { q: `A random variable takes the values ${xs.join(', ')} with probabilities ${w.map((v) => `${v}/${W}`).join(', ')}. Find its ${ask}.`,
          answer, tol: Math.max(0.002, Math.abs(answer) * 0.005), xs, w, ask,
          sol: `$\\langle x\\rangle = \\tfrac{1}{${W}}(${xs.map((x, i) => `${w[i]}\\cdot${x < 0 ? `(${x})` : x}`).join(' + ')}) = ${round(mean, 4)}$. $\\langle x^2\\rangle = \\tfrac{1}{${W}}(${xs.map((x, i) => `${w[i]}\\cdot${x * x}`).join(' + ')}) = ${round(m2, 4)}$. Variance $= \\langle x^2\\rangle - \\langle x\\rangle^2 = ${round(m2 - mean * mean, 4)}$. The ${ask} is ${answer}.` };
      },
      verify: (p) => { const W = p.w[0] + p.w[1] + p.w[2], m = p.xs.reduce((s, x, i) => s + x * p.w[i], 0) / W; return p.ask === 'mean' ? m : p.xs.reduce((s, x, i) => s + (x - m) ** 2 * p.w[i], 0) / W; } },
    { id: 'prd-g06', type: 'nat', level: 2, exams: ['gate', 'net'], sub: 'exponential',
      make(r) {
        const tau = int(r, 2, 20), t = int(r, 1, 40), ask = choose(r, ['longer', 'shorter']);
        const surv = Math.exp(-t / tau), answer = round(ask === 'longer' ? surv : 1 - surv, 4);
        return { q: `Unstable particles have mean lifetime ${tau} ns (exponential distribution). Find the probability that a given particle lives ${ask} than ${t} ns.`,
          answer, tol: Math.max(0.0005, answer * 0.01), tau, t, ask,
          sol: `$P(T > t) = \\int_t^\\infty \\dfrac{1}{\\tau}e^{-t'/\\tau}dt' = e^{-t/\\tau} = e^{-${t}/${tau}} = ${round(surv, 4)}$. ${ask === 'longer' ? '' : `So $P(T < t) = 1 - ${round(surv, 4)} = ${answer}$.`}` };
      },
      verify: (p) => { const s = 1 - simpson((x) => Math.exp(-x / p.tau) / p.tau, 0, p.t); return p.ask === 'longer' ? s : 1 - s; } },
    { id: 'prd-g07', type: 'mcq', level: 1, exams: ['gate', 'net'], sub: 'which distribution',
      make(r) {
        const cases = [
          ['the number of radioactive decays recorded in 10 s from a long-lived source', 'Poisson'],
          ['the time between successive clicks of a Geiger counter', 'exponential'],
          ['the number of heads in 20 tosses of a coin', 'binomial'],
          ['the total error from many small, independent sources', 'Gaussian'],
          ['the shape of a spectral line broadened only by the finite lifetime of the upper level', 'Lorentzian (Cauchy)'],
          ['the speeds of molecules in a gas in equilibrium', 'Maxwell'],
          ['the phase of a wave arriving at a random time', 'uniform'],
        ];
        const pickc = choose(r, cases);
        const o = mcqOptions(r, pickc[1], cases.filter((c) => c[1] !== pickc[1]).map((c) => c[1]).sort(() => 0).slice(int(r, 0, 3), 7), (v) => v);
        return { q: `Which distribution best describes ${pickc[0]}?`, ...o,
          sol: { Poisson: 'Many independent nuclei, each with a tiny chance to decay: counts in a fixed time are Poisson, with variance equal to the mean.', exponential: 'For a Poisson process the waiting time to the next event is exponential, $p(t) = \\lambda e^{-\\lambda t}$, with no memory.', binomial: 'A fixed number of independent yes/no trials with the same probability gives the binomial distribution.', Gaussian: 'By the central limit theorem, a sum of many small independent contributions with finite variance is Gaussian.', 'Lorentzian (Cauchy)': 'Exponential decay of the amplitude in time Fourier-transforms to a Lorentzian in frequency; it has no finite variance.', Maxwell: 'Each velocity component is Gaussian, and the speed then follows $v^2e^{-mv^2/2kT}$, the Maxwell distribution.', uniform: 'With no preferred time, every phase in $[0, 2\\pi)$ is equally likely: a uniform distribution.' }[pickc[1]] };
      } },
    { id: 'prd-g08', type: 'nat', level: 3, exams: ['gate', 'net'], sub: 'counting statistics',
      make(r) {
        const R = choose(r, [5, 10, 20, 25, 40, 50, 80, 100]), f = choose(r, [0.01, 0.02, 0.05, 0.1]);
        const N = 1 / (f * f), answer = round(N / R, 3);
        return { q: `A source gives about ${R} counts per second. How long (in seconds) must you count to measure the count rate with a fractional uncertainty of ${f * 100}%? (Poisson statistics, ignore background.)`,
          answer, tol: Math.max(0.01, answer * 0.01), unit: 's', R, f,
          sol: `For $N$ counts the fractional uncertainty is $\\sqrt N/N = 1/\\sqrt N$. Setting $1/\\sqrt N = ${f}$ gives $N = 1/${f}^2 = ${round(N, 2)}$ counts. At ${R} per second that takes $${round(N, 2)}/${R} = ${answer}$ s.`,
          trap: 'Halving the uncertainty needs four times as many counts, not twice.' };
      },
      verify: (p) => 1 / (p.f * p.f * p.R) },
    { id: 'prd-g09', type: 'nat', level: 3, exams: ['gate', 'net'], sub: 'Bayes theorem',
      make(r) {
        const prior = choose(r, [0.001, 0.005, 0.01, 0.02, 0.05, 0.1]), sens = choose(r, [0.9, 0.95, 0.98, 0.99]), fp = choose(r, [0.01, 0.02, 0.05, 0.1]);
        const answer = round(sens * prior / (sens * prior + fp * (1 - prior)), 4);
        return { q: `A particle detector flags a rare event type that makes up a fraction ${prior} of all events. It flags a true event with probability ${sens} and wrongly flags an ordinary event with probability ${fp}. Given that an event is flagged, find the probability that it is a true rare event.`,
          answer, tol: Math.max(0.001, answer * 0.01), prior, sens, fp,
          sol: `Bayes: $P(\\text{true}\\mid\\text{flag}) = \\dfrac{${sens}\\times${prior}}{${sens}\\times${prior} + ${fp}\\times${round(1 - prior, 4)}} = \\dfrac{${round(sens * prior, 6)}}{${round(sens * prior + fp * (1 - prior), 6)}} = ${answer}$.`,
          trap: 'When the event is rare, false flags from the huge background can outnumber true ones.' };
      },
      verify: (p) => 1 / (1 + p.fp * (1 - p.prior) / (p.sens * p.prior)) },
    { id: 'prd-g10', type: 'nat', level: 2, exams: ['gate', 'net'], sub: 'central limit theorem',
      make(r) {
        const s = pick(r, 0.5, 5, 0.5), ask = choose(r, ['sem', 'n']);
        if (ask === 'sem') {
          const N = choose(r, [4, 9, 16, 25, 36, 49, 64, 100]), answer = round(s / Math.sqrt(N), 4);
          return { q: `Single measurements of a length scatter with standard deviation ${s} mm. Find the standard deviation of the mean of ${N} independent measurements, in mm.`,
            answer, tol: Math.max(0.001, answer * 0.01), unit: 'mm', s, N, ask,
            sol: `The variance of a mean of $N$ independent values is $\\sigma^2/N$, so $\\sigma_{\\bar x} = \\sigma/\\sqrt N = ${s}/\\sqrt{${N}} = ${answer}$ mm.` };
        }
        const target = round(s / choose(r, [2, 3, 4, 5, 10]), 4), answer = Math.round((s / target) ** 2);
        return { q: `Single measurements scatter with standard deviation ${s} mm. How many independent measurements must be averaged for the mean to have a standard deviation of ${target} mm?`,
          answer, tol: 0, s, target, ask,
          sol: `$\\sigma/\\sqrt N = ${target}$ gives $N = (\\sigma/${target})^2 = (${round(s / target, 3)})^2 = ${answer}$.` };
      },
      verify: (p) => (p.ask === 'sem' ? p.s / Math.sqrt(p.N) : Math.round((p.s / p.target) ** 2)) },
    { id: 'prd-g11', type: 'nat', level: 4, exams: ['gate', 'net'], sub: 'moments',
      make(r) {
        const kind = choose(r, ['exp', 'gauss']);
        if (kind === 'exp') {
          const lam = choose(r, [0.5, 1, 2, 4]), n = int(r, 1, 4), answer = round(fact(n) / lam ** n, 4);
          return { q: `For the exponential density $p(x) = \\lambda e^{-\\lambda x}$ ($x > 0$) with $\\lambda = ${lam}$, find the moment $\\langle x^{${n}}\\rangle$.`,
            answer, tol: Math.max(0.001, answer * 0.005), kind, lam, n,
            sol: `$\\langle x^n\\rangle = \\int_0^\\infty x^n\\lambda e^{-\\lambda x}dx = \\dfrac{n!}{\\lambda^n}$ (a Gamma integral). Here $${n}!/${lam}^{${n}} = ${answer}$.` };
        }
        const s = choose(r, [0.5, 1, 1.5, 2, 3]), n = int(r, 1, 3), df = [1, 1, 3, 15][n], answer = round(df * s ** (2 * n), 4);
        return { q: `For a Gaussian with mean 0 and standard deviation $\\sigma = ${s}$, find $\\langle x^{${2 * n}}\\rangle$.`,
          answer, tol: Math.max(0.001, answer * 0.005), kind, s, n,
          sol: `$\\langle x^{2n}\\rangle = (2n-1)!!\\,\\sigma^{2n}$. With $n = ${n}$: $(${2 * n - 1})!! = ${df}$, so $\\langle x^{${2 * n}}\\rangle = ${df}\\times${s}^{${2 * n}} = ${answer}$.` };
      },
      verify: (p) => (p.kind === 'exp' ? simpson((x) => x ** p.n * p.lam * Math.exp(-p.lam * x), 0, 60 / p.lam, 4000) : simpson((x) => x ** (2 * p.n) * Math.exp(-x * x / (2 * p.s * p.s)) / (Math.sqrt(2 * Math.PI) * p.s), -12 * p.s, 12 * p.s, 4000)) },
    { id: 'prd-g12', type: 'nat', level: 3, exams: ['gate', 'net'], sub: 'normalisation',
      make(r) {
        const n = int(r, 1, 4), a = choose(r, [0.5, 1, 2, 3]), ask = choose(r, ['C', 'mean', 'mode']);
        const C = a ** (n + 1) / fact(n);
        const answer = round(ask === 'C' ? C : ask === 'mean' ? (n + 1) / a : n / a, 4);
        const what = { C: 'the normalisation constant $C$', mean: 'the mean $\\langle x\\rangle$', mode: 'the most probable value of $x$' }[ask];
        return { q: `The density $p(x) = C\\,x^{${n}}e^{-${a}x}$ for $x > 0$ is normalised. Find ${what}.`,
          answer, tol: Math.max(0.001, answer * 0.005), n, a, ask,
          sol: `Use $\\int_0^\\infty x^ne^{-ax}dx = n!/a^{n+1}$. Normalisation: $C = a^{n+1}/n! = ${a}^{${n + 1}}/${fact(n)} = ${round(C, 4)}$. Mean: $C\\,(n+1)!/a^{n+2} = (n+1)/a = ${round((n + 1) / a, 4)}$. Mode: $d(x^ne^{-ax})/dx = 0$ at $x = n/a = ${round(n / a, 4)}$. The answer is ${answer}.` };
      },
      verify: (p) => {
        const f = (x) => x ** p.n * Math.exp(-p.a * x), Z = simpson(f, 0, 80 / p.a, 8000);
        if (p.ask === 'C') return 1 / Z;
        if (p.ask === 'mean') return simpson((x) => x * f(x), 0, 80 / p.a, 8000) / Z;
        let best = 0, bx = 0; for (let x = 0; x < 20 / p.a; x += 0.0005) if (f(x) > best) { best = f(x); bx = x; } return bx;
      } },
    ...more,
  ],
};
