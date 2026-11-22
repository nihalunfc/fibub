// Probability and statistics for physicists: rules of probability, conditional probability and Bayes' theorem,
// combinatorics (including identical particles), the binomial, Poisson, Gaussian, uniform and exponential distributions,
// mean, variance, moments and characteristic functions, random walks, the central limit theorem, counting statistics,
// propagation of errors, weighted means, least squares and chi-square.
// Original questions for GATE and CSIR NET practice (fibub). Levels: 1 warm-up ... 5 top rank.
import { int, choose, mcqOptions, round } from '../_util.js';
import more from './probability.more.gen.js';
import more2 from './probability.more2.gen.js';

const fact = (n) => (n <= 1 ? 1 : n * fact(n - 1));
const binom = (n, k) => (k < 0 || k > n ? 0 : Math.round(fact(n) / (fact(k) * fact(n - k))));
// erf, Abramowitz and Stegun 7.1.26 (absolute error below 1.5e-7)
const erf = (x) => { const s = Math.sign(x), a = Math.abs(x), t = 1 / (1 + 0.3275911 * a); const y = 1 - ((((1.061405429 * t - 1.453152027) * t + 1.421413741) * t - 0.284496736) * t + 0.254829592) * t * Math.exp(-a * a); return s * y; };
const Phi = (z) => 0.5 * (1 + erf(z / Math.SQRT2));
const integ = (f, a, b, N = 20000) => { let s = 0; const h = (b - a) / N; for (let i = 0; i < N; i++) s += f(a + (i + 0.5) * h); return s * h; };

export default {
  topic: 'probability',
  items: [
    // ---------- level 1 ----------
    { id: 'prb-001', type: 'mcq', level: 1, exams: ['gate', 'net', 'jam'], sub: 'basic probability',
      q: 'Two fair dice are thrown. The probability that the numbers add up to 7 is',
      options: ['$\\tfrac{1}{12}$', '$\\tfrac{7}{36}$', '$\\tfrac16$', '$\\tfrac{1}{11}$'], answer: 2,
      sol: 'There are 36 equally likely ordered outcomes. Sum 7 comes from (1,6), (2,5), (3,4), (4,3), (5,2), (6,1): 6 outcomes, so $\\frac{6}{36} = \\frac16$. It is the most likely sum.',
      trap: '$\\frac{1}{11}$ treats the 11 possible sums as equally likely, which they are not.' },
    { id: 'prb-002', type: 'mcq', level: 1, exams: ['gate', 'net', 'jam'], sub: 'Poisson distribution',
      q: 'A Poisson distribution has mean $\\lambda$. Its variance is',
      options: ['$\\lambda^2$', '$\\sqrt\\lambda$', '$\\lambda(1 - \\lambda)$', '$\\lambda$'], answer: 3,
      sol: 'For $P(k) = \\lambda^ke^{-\\lambda}/k!$: $\\langle k\\rangle = \\lambda$ and $\\langle k(k - 1)\\rangle = \\lambda^2$, so $\\sigma^2 = \\lambda^2 + \\lambda - \\lambda^2 = \\lambda$. The standard deviation is $\\sqrt\\lambda$: that is the $\\sqrt N$ rule of counting experiments.',
      trap: '$\\sqrt\\lambda$ is the standard deviation, not the variance.' },
    { id: 'prb-003', type: 'mcq', level: 1, exams: ['gate', 'net', 'jam'], sub: 'binomial distribution',
      q: 'In $n$ independent trials, each a success with probability $p$, the variance of the number of successes is',
      options: ['$np(1 - p)$', '$np$', '$\\sqrt{np(1 - p)}$', '$n^2p(1 - p)$'], answer: 0,
      sol: 'Each trial is a 0/1 variable with mean $p$ and variance $p - p^2 = p(1 - p)$. Variances of independent variables add: $np(1 - p)$.',
      trap: '$np$ is the mean.' },
    { id: 'prb-004', type: 'nat', level: 1, exams: ['gate', 'net', 'jam'], sub: 'binomial distribution',
      q: 'A fair coin is tossed 4 times. The probability of exactly 2 heads is ______ (to three decimal places).',
      answer: 0.375, tol: 0.001, calc: () => binom(4, 2) / 16,
      sol: '$\\binom42\\left(\\frac12\\right)^4 = \\frac{6}{16} = 0.375$.',
      trap: 'Answering $\\tfrac12$ because "half the tosses should be heads".' },
    { id: 'prb-005', type: 'mcq', level: 1, exams: ['gate', 'net', 'jam'], sub: 'Gaussian distribution',
      q: 'For a Gaussian distribution, the fraction of values within one standard deviation of the mean is about',
      options: ['50%', '95%', '68%', '99.7%'], answer: 2,
      sol: '$P(|x - \\mu| < \\sigma) = \\text{erf}(1/\\sqrt2) \\approx 0.683$. Within $2\\sigma$: 95.4%; within $3\\sigma$: 99.7%.',
      trap: '95% is the two-sigma figure.' },
    { id: 'prb-006', type: 'msq', level: 1, exams: ['gate', 'net'], sub: 'independence',
      q: 'Events $A$ and $B$ are independent, with $0 < P(A), P(B) < 1$. Which statements are true?',
      options: ['$P(A\\cap B) = P(A)P(B)$', '$P(A|B) = P(A)$', '$A$ and $B$ are mutually exclusive', '$P(A\\cup B) = P(A) + P(B) - P(A)P(B)$'], answer: [0, 1, 3],
      sol: 'Independence means $P(A\\cap B) = P(A)P(B)$, equivalently $P(A|B) = P(A)$. The union rule $P(A) + P(B) - P(A\\cap B)$ then gives the last option. Mutually exclusive events have $P(A\\cap B) = 0 \\ne P(A)P(B)$: if one happens the other cannot, which is the opposite of independence.',
      trap: 'Exclusive and independent are different, almost opposite, ideas.' },

    // ---------- level 2 ----------
    { id: 'prb-007', type: 'nat', level: 2, exams: ['gate', 'net', 'jam'], sub: 'counting statistics',
      q: 'A detector records 400 counts in a fixed time. The fractional uncertainty of this count is ______ %.',
      answer: 5, tol: 0.01, calc: () => (Math.sqrt(400) / 400) * 100, unit: '%',
      sol: 'Counts are Poisson, so $\\sigma = \\sqrt N = 20$ and $\\sigma/N = 20/400 = 5\\%$. To halve it you need four times as many counts.',
      trap: 'Using $1/N$ instead of $1/\\sqrt N$.' },
    { id: 'prb-008', type: 'mcq', level: 2, exams: ['gate', 'net', 'jam'], sub: 'standard error',
      q: '$N$ independent measurements each have standard deviation $\\sigma$. The standard deviation of their mean is',
      options: ['$\\sigma$', '$\\sigma/N$', '$\\sigma/\\sqrt N$', '$\\sigma\\sqrt N$'], answer: 2,
      sol: '$\\text{Var}(\\bar x) = \\text{Var}\\left(\\frac1N\\sum x_i\\right) = \\frac{1}{N^2}N\\sigma^2 = \\frac{\\sigma^2}{N}$, so the standard error is $\\sigma/\\sqrt N$.',
      trap: '$\\sigma/N$ would mean the errors cancel completely; independent errors cancel only partly, which gives $\\sqrt N$.' },
    { id: 'prb-009', type: 'mcq', level: 2, exams: ['gate', 'net', 'jam'], sub: 'uniform distribution',
      q: 'A variable is uniformly distributed on $[0, 6]$. Its variance is',
      options: ['$3$', '$6$', '$12$', '$\\sqrt3$'], answer: 0,
      sol: 'For uniform on $[a, b]$: $\\sigma^2 = \\frac{(b - a)^2}{12} = \\frac{36}{12} = 3$. (A digital meter that rounds to the last digit has a reading error of $\\text{step}/\\sqrt{12}$ for this reason.)',
      trap: 'Using $(b - a)^2/4$ or the half-width as the standard deviation.' },
    { id: 'prb-010', type: 'mcq', level: 2, exams: ['gate', 'net'], sub: 'Gaussian distribution',
      q: 'The full width at half maximum of a Gaussian of standard deviation $\\sigma$ is',
      options: ['$2\\sigma$', '$\\sigma\\sqrt{2\\ln2}$', '$\\sqrt2\\,\\sigma$', '$2\\sqrt{2\\ln2}\\,\\sigma \\approx 2.355\\sigma$'], answer: 3,
      sol: '$e^{-x^2/2\\sigma^2} = \\frac12$ at $x = \\pm\\sigma\\sqrt{2\\ln2}$, so FWHM $= 2\\sqrt{2\\ln2}\\,\\sigma \\approx 2.355\\sigma$. Spectral line widths are often quoted this way.',
      trap: '$\\sigma\\sqrt{2\\ln2}$ is the half width.' },
    { id: 'prb-011', type: 'nat', level: 2, exams: ['gate', 'net'], sub: 'Bayes theorem',
      q: 'A condition affects 1% of a population. A test detects it in 99% of those who have it, and gives a false positive for 5% of those who do not. Someone tests positive. The probability that they have the condition is ______ (to three decimal places).',
      answer: 0.167, tol: 0.002, calc: () => (0.01 * 0.99) / (0.01 * 0.99 + 0.99 * 0.05),
      sol: 'Bayes: $P(C|+) = \\frac{P(+|C)P(C)}{P(+)} = \\frac{0.99\\times0.01}{0.99\\times0.01 + 0.05\\times0.99} = \\frac{0.0099}{0.0594} \\approx 0.167$. Most positives are false because the healthy group is so much larger.',
      trap: 'Answering 0.99, which is $P(+|C)$, not $P(C|+)$.' },
    { id: 'prb-012', type: 'msq', level: 2, exams: ['gate', 'net'], sub: 'Poisson distribution',
      q: 'Which statements about the Poisson distribution with mean $\\lambda$ are true?',
      options: ['It is the limit of the binomial for $n \\to \\infty$, $p \\to 0$ with $np = \\lambda$ fixed', '$P(0) = e^{-\\lambda}$', '$P(k) = \\lambda^ke^{-\\lambda}/k!$', 'Its variance is $\\lambda^2$'], answer: [0, 1, 2],
      sol: '$\\binom nkp^k(1 - p)^{n-k} \\to \\frac{\\lambda^k}{k!}e^{-\\lambda}$ in that limit (rare events, many chances). $P(0) = e^{-\\lambda}$ follows. The variance is $\\lambda$, not $\\lambda^2$.',
      trap: 'Mean equals variance for Poisson.' },
    { id: 'prb-013', type: 'mcq', level: 2, exams: ['gate', 'net', 'jam'], sub: 'random walk',
      q: 'A random walker takes 100 steps of 1 m, each equally likely to the left or the right. Its root-mean-square distance from the start is',
      options: ['100 m', '50 m', '0 m', '10 m'], answer: 3,
      sol: 'Steps are independent with mean 0 and variance 1 m², so $\\langle x^2\\rangle = N = 100$ m² and $x_{\\text{rms}} = \\sqrt{100} = 10$ m. The mean displacement is 0, but the rms is not. This $\\sqrt N$ growth is diffusion.',
      trap: 'The mean displacement (0) is not the rms displacement.' },
    { id: 'prb-014', type: 'mcq', level: 2, exams: ['gate', 'net', 'jam'], sub: 'error propagation',
      q: 'For $f = xy$ with independent uncertainties $\\sigma_x$ and $\\sigma_y$, the relative uncertainty of $f$ is',
      options: ['$\\dfrac{\\sigma_x}{x} + \\dfrac{\\sigma_y}{y}$', '$\\sqrt{\\left(\\dfrac{\\sigma_x}{x}\\right)^2 + \\left(\\dfrac{\\sigma_y}{y}\\right)^2}$', '$\\dfrac{\\sigma_x\\sigma_y}{xy}$', '$\\sqrt{\\sigma_x^2 + \\sigma_y^2}$'], answer: 1,
      sol: '$\\sigma_f^2 = (\\partial_xf)^2\\sigma_x^2 + (\\partial_yf)^2\\sigma_y^2 = y^2\\sigma_x^2 + x^2\\sigma_y^2$. Dividing by $f^2 = x^2y^2$: relative errors add in quadrature. The straight sum is a worst-case bound, used only for correlated or systematic errors.',
      trap: 'Adding linearly overestimates independent errors.' },
    { id: 'prb-015', type: 'nat', level: 2, exams: ['gate', 'net', 'jam'], sub: 'exponential distribution',
      q: 'A nucleus has decay constant $\\lambda = 0.2$ s⁻¹. The probability that it does not decay in the next 5 s is ______ (to three decimal places).',
      answer: 0.368, tol: 0.002, calc: () => Math.exp(-0.2 * 5),
      sol: 'The survival probability is $e^{-\\lambda t} = e^{-1} \\approx 0.368$. A nucleus has no memory: the result is the same whatever its age.',
      trap: 'Using $1 - \\lambda t = 0$, a linear approximation valid only for $\\lambda t \\ll 1$.' },
    { id: 'prb-016', type: 'mcq', level: 2, exams: ['gate', 'net', 'jam'], sub: 'exponential distribution',
      q: 'Waiting times between counts in a Poisson process of rate $\\lambda$ follow $p(t) = \\lambda e^{-\\lambda t}$. The mean waiting time is',
      options: ['$\\lambda$', '$1/\\lambda$', '$\\ln2/\\lambda$', '$1/\\lambda^2$'], answer: 1,
      sol: '$\\langle t\\rangle = \\int_0^\\infty t\\lambda e^{-\\lambda t}dt = 1/\\lambda$ (the mean life $\\tau$). The median is $\\ln2/\\lambda$ (the half-life), and the variance is $1/\\lambda^2$.',
      trap: '$\\ln2/\\lambda$ is the median, not the mean.' },

    // ---------- level 3 ----------
    { id: 'prb-017', type: 'nat', level: 3, exams: ['gate', 'net'], sub: 'Poisson distribution',
      q: 'Counts follow a Poisson distribution with mean 3. The probability of exactly 2 counts is ______ (to four decimal places).',
      answer: 0.224, tol: 0.0005, calc: () => (9 * Math.exp(-3)) / 2,
      sol: '$P(2) = \\frac{3^2e^{-3}}{2!} = 4.5\\times0.04979 = 0.2240$.',
      trap: 'Forgetting the $k!$ in the denominator.' },
    { id: 'prb-018', type: 'nat', level: 3, exams: ['gate', 'net', 'jam'], sub: 'binomial distribution',
      q: 'For 10 tosses of a fair coin, the standard deviation of the number of heads is ______ (to three decimal places).',
      answer: 1.581, tol: 0.002, calc: () => Math.sqrt(10 * 0.25),
      sol: '$\\sigma = \\sqrt{np(1 - p)} = \\sqrt{10\\times0.25} = \\sqrt{2.5} = 1.581$.',
      trap: 'Giving the variance 2.5.' },
    { id: 'prb-019', type: 'mcq', level: 3, exams: ['gate', 'net'], sub: 'Gaussian distribution',
      q: 'For a Gaussian variable, the probability of a value more than $2\\sigma$ above the mean is about',
      options: ['5%', '2.3%', '0.3%', '16%'], answer: 1,
      sol: '$P(|x - \\mu| > 2\\sigma) \\approx 4.6\\%$, shared equally between the two tails, so one tail holds about 2.3%. (One sigma above: about 16%.)',
      trap: '5% counts both tails.' },
    { id: 'prb-020', type: 'msq', level: 3, exams: ['gate', 'net'], sub: 'covariance',
      q: 'Which statements about random variables $X$ and $Y$ are true?',
      options: ['$\\text{Var}(X + Y) = \\text{Var}X + \\text{Var}Y + 2\\,\\text{Cov}(X, Y)$', 'If $X$ and $Y$ are independent, $\\text{Cov}(X, Y) = 0$', 'If $\\text{Cov}(X, Y) = 0$, then $X$ and $Y$ are independent', 'The correlation coefficient lies between $-1$ and $1$'], answer: [0, 1, 3],
      sol: 'Expand $\\langle(X + Y - \\mu_X - \\mu_Y)^2\\rangle$ for the first. Independence gives $\\langle XY\\rangle = \\langle X\\rangle\\langle Y\\rangle$. The converse fails: with $X$ symmetric about 0 and $Y = X^2$, $\\text{Cov} = \\langle X^3\\rangle = 0$ though $Y$ is fixed by $X$. Cauchy–Schwarz bounds the correlation by 1.',
      trap: 'Zero covariance rules out only linear dependence.' },
    { id: 'prb-021', type: 'nat', level: 3, exams: ['gate', 'net', 'jam'], sub: 'error propagation',
      q: 'With $x = 2.00 \\pm 0.02$ and $y = 4.0 \\pm 0.08$ (independent), the absolute uncertainty of $f = x^2/y$ is ______ (to three decimal places).',
      answer: 0.028, tol: 0.001, calc: () => 1 * Math.hypot(2 * 0.01, 0.02),
      sol: 'Relative errors: $\\sigma_x/x = 1\\%$, $\\sigma_y/y = 2\\%$. For $f = x^2y^{-1}$: $\\frac{\\sigma_f}{f} = \\sqrt{(2\\times1\\%)^2 + (1\\times2\\%)^2} = 2.83\\%$. With $f = 4/4 = 1$: $\\sigma_f = 0.028$.',
      trap: 'The power 2 multiplies the relative error of $x$; forgetting it gives 2.24%.' },
    { id: 'prb-022', type: 'mcq', level: 3, exams: ['gate', 'net'], sub: 'central limit theorem',
      q: 'The central limit theorem says that the sum of many independent, identically distributed random variables with finite variance is approximately',
      options: ['Poisson distributed', 'uniformly distributed', 'distributed like each individual variable', 'Gaussian distributed'], answer: 3,
      sol: 'Whatever the individual distribution (if its variance is finite), the standardised sum tends to a Gaussian, with mean $N\\mu$ and variance $N\\sigma^2$. That is why measurement errors made of many small causes are Gaussian. (The Cauchy/Lorentzian distribution has no finite variance and is a famous exception.)',
      trap: 'The theorem needs finite variance.' },
    { id: 'prb-023', type: 'nat', level: 3, exams: ['gate', 'net'], sub: 'weighted mean',
      q: 'Two measurements of a length give $10.0 \\pm 0.1$ cm and $10.6 \\pm 0.2$ cm. Their weighted mean is ______ cm (to two decimal places).',
      answer: 10.12, tol: 0.005, calc: () => (10 * 100 + 10.6 * 25) / 125, unit: 'cm',
      sol: 'Weights $w_i = 1/\\sigma_i^2$: 100 and 25. $\\bar x = \\frac{100\\times10.0 + 25\\times10.6}{125} = \\frac{1265}{125} = 10.12$ cm. The more precise value dominates.',
      trap: 'Weighting by $1/\\sigma$ instead of $1/\\sigma^2$ gives 10.2.' },
    { id: 'prb-024', type: 'mcq', level: 3, exams: ['gate', 'net'], sub: 'weighted mean',
      q: 'For the same two measurements ($10.0 \\pm 0.1$ cm and $10.6 \\pm 0.2$ cm), the uncertainty of the weighted mean is about',
      options: ['0.15 cm', '0.09 cm', '0.05 cm', '0.10 cm'], answer: 1,
      sol: '$\\sigma_{\\bar x} = \\left(\\sum1/\\sigma_i^2\\right)^{-1/2} = 125^{-1/2} \\approx 0.089$ cm: smaller than either uncertainty alone. (The two values differ by $0.6/\\sqrt{0.05} \\approx 2.7$ combined sigmas, so one might also ask whether they really agree.)',
      trap: 'Averaging the two uncertainties.' },
    { id: 'prb-025', type: 'mcq', level: 3, exams: ['gate', 'net'], sub: 'moments',
      q: 'For a Gaussian with mean 0 and $\\sigma = 3$, the fourth moment $\\langle x^4\\rangle$ is',
      options: ['$81$', '$243$', '$27$', '$162$'], answer: 1,
      sol: 'Gaussian moments: $\\langle x^{2n}\\rangle = (2n - 1)!!\\,\\sigma^{2n}$. So $\\langle x^4\\rangle = 3\\sigma^4 = 3\\times81 = 243$. The ratio $\\langle x^4\\rangle/\\sigma^4 = 3$ is the Gaussian kurtosis.',
      trap: '$\\sigma^4 = 81$ misses the factor 3.' },
    { id: 'prb-026', type: 'mcq', level: 3, exams: ['gate', 'net'], sub: 'counting statistics',
      q: 'With the source removed, a counter records 100 counts in 100 s. With the source, it records 400 counts in 100 s. The net source rate and its uncertainty are',
      options: ['$3.0 \\pm 0.10$ s⁻¹', '$3.0 \\pm 0.17$ s⁻¹', '$3.0 \\pm 0.30$ s⁻¹', '$3.0 \\pm 0.22$ s⁻¹'], answer: 3,
      sol: 'Net counts $400 - 100 = 300$ in 100 s: 3.0 s⁻¹. The uncertainties of the two counts add in quadrature (even though we subtract): $\\sqrt{400 + 100} = 22.4$ counts, i.e. $0.22$ s⁻¹.',
      trap: 'Using $\\sqrt{300}$ or $\\sqrt{400 - 100}$: variances add on subtraction.' },
    { id: 'prb-027', type: 'msq', level: 3, exams: ['gate', 'net'], sub: 'Stirling formula',
      q: 'Which statements about Stirling\'s approximation are true?',
      options: ['$\\ln N! \\approx N\\ln N - N$ for large $N$', '$N! \\approx \\sqrt{2\\pi N}\\,N^Ne^{-N}$', 'The relative error of the full formula falls roughly like $1/(12N)$', '$\\ln N! = N\\ln N$ exactly once $N \\ge 10$'], answer: [0, 1, 2],
      sol: 'The full form has relative error about $\\frac{1}{12N}$ (already 0.8% at $N = 10$). Taking logs gives $N\\ln N - N + \\frac12\\ln(2\\pi N)$, and the last term is negligible for the huge $N$ of statistical mechanics. No version is exact: at $N = 10$, $\\ln10! = 15.10$ while $10\\ln10 = 23.03$.',
      trap: 'Dropping the $-N$ term is a large error, not a small one.' },
    { id: 'prb-028', type: 'mcq', level: 3, exams: ['gate', 'net'], sub: 'combinatorics',
      q: 'In how many distinct ways can 3 identical bosons be placed in 3 single-particle states?',
      options: ['27', '6', '10', '1'], answer: 2,
      sol: 'Identical bosons: only the occupation numbers matter, and any number may share a state. Stars and bars: $\\binom{N + g - 1}{N} = \\binom{5}{3} = 10$. Distinguishable particles would give $3^3 = 27$; fermions $\\binom33 = 1$.',
      trap: '27 counts the particles as distinguishable.' },

    // ---------- level 4 ----------
    { id: 'prb-029', type: 'nat', level: 4, exams: ['gate', 'net'], sub: 'Gaussian distribution',
      q: 'For a Gaussian variable, $P(|x - \\mu| < 1.5\\sigma) = \\text{erf}(1.5/\\sqrt2)$. Its value is ______ (to three decimal places).',
      answer: 0.866, tol: 0.002, calc: () => erf(1.5 / Math.SQRT2),
      sol: '$\\text{erf}(1.0607) \\approx 0.866$. So 13.4% of values lie further than $1.5\\sigma$ from the mean. (Check against the familiar 68% at $1\\sigma$ and 95% at $2\\sigma$: 0.866 lies between.)',
      trap: 'Using $\\text{erf}(1.5)$ (0.966): the argument is $z/\\sqrt2$.' },
    { id: 'prb-030', type: 'nat', level: 4, exams: ['gate', 'net'], sub: 'Poisson distribution',
      q: 'A weak source gives on average 0.5 counts per second. The probability of at least one count in a given second is ______ (to three decimal places).',
      answer: 0.393, tol: 0.002, calc: () => 1 - Math.exp(-0.5),
      sol: '$P(\\ge1) = 1 - P(0) = 1 - e^{-0.5} = 0.393$.',
      trap: 'Answering 0.5: the mean is not a probability, and two or more counts are possible.' },
    { id: 'prb-031', type: 'mcq', level: 4, exams: ['gate', 'net'], sub: 'chi-square',
      q: 'A model is fitted to data with known uncertainties, leaving $\\nu$ degrees of freedom. For a good fit with correctly estimated errors, the reduced chi-square $\\chi^2/\\nu$ should be close to',
      options: ['0', '1', '$\\nu$', '$\\sqrt\\nu$'], answer: 1,
      sol: 'Each residual divided by its $\\sigma$ contributes about 1 on average, so $\\chi^2 \\approx \\nu$ and $\\chi^2/\\nu \\approx 1$ (with spread $\\sqrt{2/\\nu}$). Much larger: a poor model or underestimated errors. Much smaller: errors overestimated.',
      trap: 'A chi-square near 0 is suspicious, not perfect.' },
    { id: 'prb-032', type: 'nat', level: 4, exams: ['gate', 'net'], sub: 'least squares',
      q: 'A straight line $y = a + bx$ is fitted by least squares to the points $(0, 1)$, $(1, 3)$, $(2, 4)$, $(3, 8)$. The slope $b$ is ______ (to two decimal places).',
      answer: 2.2, tol: 0.01, calc: () => 11 / 5,
      sol: '$\\bar x = 1.5$, $\\bar y = 4$. $b = \\frac{\\sum(x - \\bar x)(y - \\bar y)}{\\sum(x - \\bar x)^2} = \\frac{(-1.5)(-3) + (-0.5)(-1) + (0.5)(0) + (1.5)(4)}{2.25 + 0.25 + 0.25 + 2.25} = \\frac{11}{5} = 2.2$. The line passes through $(\\bar x, \\bar y)$, so $a = 4 - 3.3 = 0.7$.',
      trap: 'Using the end points: $(8 - 1)/3 = 2.33$ ignores the middle data.' },
    { id: 'prb-033', type: 'msq', level: 4, exams: ['gate', 'net'], sub: 'characteristic function',
      q: 'The characteristic function of a random variable is $\\phi(k) = \\langle e^{ikx}\\rangle$. Which statements are true?',
      options: ['$\\phi(0) = 0$', 'It is the Fourier transform of the probability density', 'For a sum of independent variables, $\\phi$ is the product of their characteristic functions', 'The characteristic function of a Gaussian is a Gaussian in $k$'], answer: [1, 2, 3],
      sol: '$\\phi(0) = \\langle1\\rangle = 1$ (normalisation). $\\phi(k) = \\int p(x)e^{ikx}dx$. Independence gives $\\langle e^{ik(x + y)}\\rangle = \\langle e^{ikx}\\rangle\\langle e^{iky}\\rangle$. For a Gaussian, $\\phi = e^{i\\mu k - \\sigma^2k^2/2}$. Moments are derivatives at 0: $\\langle x^n\\rangle = (-i)^n\\phi^{(n)}(0)$.',
      trap: 'The value at $k = 0$ is the total probability, 1.' },
    { id: 'prb-034', type: 'mcq', level: 4, exams: ['gate', 'net', 'jam'], sub: 'counting statistics',
      q: 'How many counts must be collected for a statistical precision of 1%?',
      options: ['100', '1000', '$10^4$', '$10^6$'], answer: 2,
      sol: '$\\sqrt N/N = 1/\\sqrt N = 0.01$ gives $N = 10^4$.',
      trap: '100 counts give only 10%.' },
    { id: 'prb-035', type: 'mcq', level: 4, exams: ['gate', 'net'], sub: 'limits of distributions',
      q: 'For large $n$ with $p$ fixed (neither close to 0 nor 1), the binomial distribution is well approximated by',
      options: ['a Gaussian with mean $np$ and standard deviation $\\sqrt{np(1 - p)}$', 'a Poisson distribution with mean $np$', 'a Gaussian with mean $np$ and standard deviation $np(1 - p)$', 'a uniform distribution on $[0, n]$'], answer: 0,
      sol: 'By the central limit theorem (a sum of $n$ Bernoulli variables) the binomial tends to a Gaussian with the same mean and variance. The Poisson limit needs $p \\to 0$ with $np$ fixed instead.',
      trap: 'The standard deviation is the square root of the variance.' },
    { id: 'prb-036', type: 'nat', level: 4, exams: ['gate', 'net'], sub: 'Poisson distribution',
      q: 'Two independent sources give Poisson counts at average rates 2 s⁻¹ and 3 s⁻¹. The probability of exactly one count in total during one second is ______ (to four decimal places).',
      answer: 0.0337, tol: 0.0002, calc: () => 5 * Math.exp(-5),
      sol: 'A sum of independent Poisson variables is Poisson with the summed mean, 5. $P(1) = 5e^{-5} = 0.0337$. (Check: $P(1, 0) + P(0, 1) = 2e^{-2}e^{-3} + e^{-2}\\cdot3e^{-3} = 5e^{-5}$ ✓.)',
      trap: 'Adding the two separate probabilities of one count.' },
    { id: 'prb-037', type: 'mcq', level: 4, exams: ['gate', 'net'], sub: 'exponential distribution',
      q: 'Lifetimes follow an exponential distribution with mean $\\tau$. The median lifetime is',
      options: ['$\\tau/2$', '$\\tau$', '$\\tau/e$', '$\\tau\\ln2$'], answer: 3,
      sol: 'Half survive when $e^{-t/\\tau} = \\frac12$, i.e. $t = \\tau\\ln2 \\approx 0.693\\tau$: the half-life. The median is below the mean because the long tail pulls the mean up.',
      trap: 'For a skewed distribution, the median and the mean differ.' },

    // ---------- level 5 ----------
    { id: 'prb-038', type: 'nat', level: 5, exams: ['gate', 'net'], sub: 'random walk',
      q: 'A walker takes 100 unit steps, each to the right with probability 0.6 and to the left with probability 0.4. The standard deviation of its final position is ______ (to two decimal places).',
      answer: 9.8, tol: 0.02, calc: () => Math.sqrt(4 * 100 * 0.6 * 0.4),
      sol: 'Each step $s = \\pm1$ has $\\langle s\\rangle = 0.2$ and $\\langle s^2\\rangle = 1$, so $\\text{Var}(s) = 1 - 0.04 = 0.96 = 4pq$. For 100 steps: variance 96, $\\sigma = \\sqrt{96} = 9.80$. The mean drift is $100\\times0.2 = 20$.',
      trap: 'Using $\\sqrt{Npq} = 4.9$, which is the spread of the number of right steps, not of the position ($x = 2n_R - N$).' },
    { id: 'prb-039', type: 'nat', level: 5, exams: ['gate', 'net'], sub: 'moments',
      q: 'For a Gaussian with mean 0 and $\\sigma = 2$, the mean absolute value $\\langle|x|\\rangle$ is ______ (to three decimal places).',
      answer: 1.596, tol: 0.002, calc: () => 2 * Math.sqrt(2 / Math.PI),
      sol: '$\\langle|x|\\rangle = 2\\int_0^\\infty x\\frac{e^{-x^2/2\\sigma^2}}{\\sigma\\sqrt{2\\pi}}dx = \\frac{2\\sigma^2}{\\sigma\\sqrt{2\\pi}} = \\sigma\\sqrt{\\frac2\\pi} = 2\\times0.798 = 1.596$.',
      trap: 'Answering $\\sigma$: the mean absolute deviation is smaller, about $0.8\\sigma$.' },
    { id: 'prb-040', type: 'msq', level: 5, exams: ['gate', 'net'], sub: 'Poisson distribution',
      q: 'Which statements about the Poisson distribution are true?',
      options: ['The sum of independent Poisson variables is Poisson', '$P(k + 1)/P(k) = \\lambda/(k + 1)$', 'For non-integer $\\lambda$ the most probable value is exactly $k = \\lambda$', 'For large $\\lambda$ it is close to a Gaussian with mean $\\lambda$ and variance $\\lambda$'], answer: [0, 1, 3],
      sol: 'Characteristic functions multiply: $e^{\\lambda_1(e^{ik} - 1)}e^{\\lambda_2(e^{ik} - 1)}$ is Poisson with $\\lambda_1 + \\lambda_2$. The ratio follows from the formula, so $P$ rises while $k + 1 < \\lambda$ and falls after: the mode is $\\lfloor\\lambda\\rfloor$ (for $\\lambda = 3.5$ it is 3), which cannot equal a non-integer $\\lambda$. The Gaussian limit is the central limit theorem.',
      trap: 'Counts are integers; the mode is $\\lfloor\\lambda\\rfloor$.' },
    { id: 'prb-041', type: 'nat', level: 5, exams: ['gate', 'net'], sub: 'Poisson distribution',
      q: 'The number of particles reaching a detector is Poisson with mean 10, and each is counted independently with probability 0.8. The variance of the number of counts is ______.',
      answer: 8, tol: 0, calc: () => 10 * 0.8,
      sol: 'Thinning a Poisson process gives a Poisson process: the counts are Poisson with mean $10\\times0.8 = 8$, so the variance is 8. (Formally: $\\text{Var} = \\langle N\\rangle p(1 - p) + p^2\\text{Var}N = 10\\times0.16 + 0.64\\times10 = 8$.)',
      trap: 'Treating the particle number as fixed gives the binomial $10\\times0.8\\times0.2 = 1.6$.' },
    { id: 'prb-042', type: 'mcq', level: 5, exams: ['gate', 'net'], sub: 'maximum entropy',
      q: 'Among all probability densities on the whole real line with a given mean and variance, which one has the largest entropy $-\\int p\\ln p\\,dx$?',
      options: ['The Gaussian', 'The uniform distribution', 'The two-sided exponential (Laplace)', 'The Lorentzian'], answer: 0,
      sol: 'Maximise $-\\int p\\ln p$ with Lagrange multipliers for $\\int p = 1$, $\\int xp$ and $\\int x^2p$: $\\ln p = $ a quadratic in $x$, so $p$ is Gaussian. This is the same reasoning that gives the Boltzmann distribution (fixed mean energy) and the Maxwell velocity distribution.',
      trap: 'The uniform distribution maximises entropy on a bounded interval with no other constraint.' },
    ...more2,
  ],
  gens: [
    { id: 'prb-g01', type: 'nat', level: 2, exams: ['gate', 'net', 'jam'], sub: 'binomial distribution',
      make(r) {
        const n = int(r, 4, 12), p = choose(r, [0.1, 0.2, 0.25, 0.3, 0.5, 0.6]), k = int(r, 0, Math.min(n, 5));
        const answer = round(binom(n, k) * p ** k * (1 - p) ** (n - k), 4);
        return { q: `In ${n} independent trials, each a success with probability ${p}, find the probability of exactly ${k} successes (to four decimal places).`,
          answer, tol: Math.max(2e-4, answer * 0.003), n, p, k,
          sol: `$\\binom{${n}}{${k}}(${p})^{${k}}(${round(1 - p, 2)})^{${n - k}} = ${binom(n, k)}\\times${round(p ** k, 6)}\\times${round((1 - p) ** (n - k), 6)} \\approx ${answer}$.`,
          trap: 'Do not forget the binomial coefficient: the successes can come in any order.' };
      },
      verify: (p) => { // build the distribution by repeated convolution of one trial
        let d = [1]; for (let i = 0; i < p.n; i++) { const e = Array(d.length + 1).fill(0); d.forEach((v, j) => { e[j] += v * (1 - p.p); e[j + 1] += v * p.p; }); d = e; } return d[p.k]; } },
    { id: 'prb-g02', type: 'nat', level: 2, exams: ['gate', 'net', 'jam'], sub: 'Poisson distribution',
      make(r) {
        const lam = choose(r, [0.5, 1, 1.5, 2, 2.5, 3, 4, 5]), k = int(r, 0, 6);
        const answer = round((lam ** k * Math.exp(-lam)) / fact(k), 4);
        return { q: `Counts in a fixed interval follow a Poisson distribution with mean ${lam}. Find the probability of exactly ${k} counts (to four decimal places).`,
          answer, tol: Math.max(2e-4, answer * 0.003), lam, k,
          sol: `$P(${k}) = \\frac{${lam}^{${k}}e^{-${lam}}}{${k}!} = \\frac{${round(lam ** k, 4)}\\times${round(Math.exp(-lam), 5)}}{${fact(k)}} \\approx ${answer}$.`,
          trap: 'Remember $0! = 1$ and $\\lambda^0 = 1$.' };
      },
      verify: (p) => { let P = Math.exp(-p.lam); for (let j = 1; j <= p.k; j++) P *= p.lam / j; return P; } },
    { id: 'prb-g03', type: 'nat', level: 3, exams: ['gate', 'net'], sub: 'Gaussian distribution',
      make(r) {
        const mu = choose(r, [20, 50, 100]), s = choose(r, [2, 4, 5, 10]), a = choose(r, [-2, -1.5, -1, -0.5, 0]), b = a + choose(r, [0.5, 1, 1.5, 2, 3]);
        const lo = mu + a * s, hi = mu + b * s, answer = round(Phi(b) - Phi(a), 4);
        return { q: `A quantity is Gaussian with mean ${mu} and standard deviation ${s}. Find the probability that a measurement lies between ${lo} and ${hi} (to four decimal places).`,
          answer, tol: 1e-3, mu, s, lo, hi,
          sol: `Standardise: $z = (x - ${mu})/${s}$ runs from ${a} to ${b}. $P = \\Phi(${b}) - \\Phi(${a})$ with $\\Phi(z) = \\tfrac12[1 + \\text{erf}(z/\\sqrt2)]$: $${round(Phi(b), 4)} - ${round(Phi(a), 4)} \\approx ${answer}$.`,
          trap: 'Divide by $\\sigma$ before using the table; erf takes $z/\\sqrt2$.' };
      },
      verify: (p) => integ((x) => Math.exp(-((x - p.mu) ** 2) / (2 * p.s * p.s)) / (p.s * Math.sqrt(2 * Math.PI)), p.lo, p.hi, 20000) },
    { id: 'prb-g04', type: 'nat', level: 3, exams: ['gate', 'net', 'jam'], sub: 'error propagation',
      make(r) {
        const a = choose(r, [1, 2, 3, -1, 0.5]), b = choose(r, [1, -1, -2, 2, 0.5]), ex = choose(r, [0.5, 1, 2, 3]), ey = choose(r, [0.5, 1, 1.5, 2, 4]);
        const answer = round(Math.hypot(a * ex, b * ey), 3);
        return { q: `A result is $f = x^{${a}}y^{${b}}$. The independent relative uncertainties are ${ex}% in $x$ and ${ey}% in $y$. Find the relative uncertainty of $f$, in percent (to three significant figures).`,
          answer, unit: '%', tol: Math.max(0.002, answer * 0.003), a, b, ex, ey,
          sol: `For a product of powers, $\\frac{\\sigma_f}{f} = \\sqrt{\\left(a\\frac{\\sigma_x}{x}\\right)^2 + \\left(b\\frac{\\sigma_y}{y}\\right)^2} = \\sqrt{(${a}\\times${ex})^2 + (${b}\\times${ey})^2} \\approx ${answer}\\%$. The sign of a power does not matter: dividing adds uncertainty just like multiplying.`,
          trap: 'Each relative error is multiplied by its power before adding in quadrature.' };
      },
      verify: (p) => { // numerical partial derivatives at x = y = 2
        const f = (x, y) => x ** p.a * y ** p.b, x = 2, y = 2, h = 1e-6, fx = (f(x + h, y) - f(x - h, y)) / (2 * h), fy = (f(x, y + h) - f(x, y - h)) / (2 * h);
        return (100 * Math.hypot(fx * x * p.ex / 100, fy * y * p.ey / 100)) / f(x, y); } },
    { id: 'prb-g05', type: 'nat', level: 3, exams: ['gate', 'net'], sub: 'weighted mean',
      make(r) {
        const xs = [round(9.5 + int(r, 0, 10) / 10, 1), round(9.5 + int(r, 0, 10) / 10, 1), round(9.5 + int(r, 0, 10) / 10, 1)];
        const ss = [choose(r, [0.1, 0.2]), choose(r, [0.2, 0.3, 0.4]), choose(r, [0.1, 0.5])];
        const w = ss.map((s) => 1 / (s * s)), W = w[0] + w[1] + w[2], answer = round((w[0] * xs[0] + w[1] * xs[1] + w[2] * xs[2]) / W, 3);
        return { q: `Three measurements of a quantity are ${xs[0]} ± ${ss[0]}, ${xs[1]} ± ${ss[1]} and ${xs[2]} ± ${ss[2]}. Find their weighted mean (to three decimal places).`,
          answer, tol: 0.002, xs, ss,
          sol: `Weights $1/\\sigma^2$: ${w.map((v) => round(v, 2)).join(', ')} (total ${round(W, 2)}). $\\bar x = \\frac{\\sum w_ix_i}{\\sum w_i} \\approx ${answer}$, with uncertainty $1/\\sqrt{${round(W, 2)}} = ${round(1 / Math.sqrt(W), 3)}$.`,
          trap: 'Weights go as $1/\\sigma^2$, not $1/\\sigma$.' };
      },
      verify: (p) => { // minimise chi^2 by scanning
        let best = 0, bx = 0; for (let i = 0; i <= 20000; i++) { const x = 9 + (2 * i) / 20000; let c = 0; for (let k = 0; k < 3; k++) c += ((x - p.xs[k]) / p.ss[k]) ** 2; if (i === 0 || c < best) { best = c; bx = x; } } return bx; } },
    { id: 'prb-g06', type: 'nat', level: 4, exams: ['gate', 'net'], sub: 'least squares',
      make(r) {
        const b0 = choose(r, [1, 2, -1, 0.5, 3]), a0 = int(r, -2, 3), xs = [0, 1, 2, 3], ys = xs.map((x) => round(a0 + b0 * x + choose(r, [-0.5, 0, 0.5, 1, -1]), 1));
        const xb = 1.5, yb = ys.reduce((s, v) => s + v, 0) / 4; let num = 0, den = 0; xs.forEach((x, i) => { num += (x - xb) * (ys[i] - yb); den += (x - xb) ** 2; });
        const answer = round(num / den, 3);
        return { q: `Fit $y = a + bx$ by least squares to the points ${xs.map((x, i) => `(${x}, ${ys[i]})`).join(', ')}. Find the slope $b$ (to three decimal places).`,
          answer, tol: 0.002, ys,
          sol: `$\\bar x = 1.5$, $\\bar y = ${round(yb, 4)}$. $b = \\frac{\\sum(x - \\bar x)(y - \\bar y)}{\\sum(x - \\bar x)^2} = \\frac{${round(num, 4)}}{5} \\approx ${answer}$.`,
          trap: 'Not the slope between the end points.' };
      },
      verify: (p) => { // normal equations solved directly
        const n = 4, xs = [0, 1, 2, 3]; let Sx = 0, Sy = 0, Sxx = 0, Sxy = 0; xs.forEach((x, i) => { Sx += x; Sy += p.ys[i]; Sxx += x * x; Sxy += x * p.ys[i]; }); return (n * Sxy - Sx * Sy) / (n * Sxx - Sx * Sx); } },
    { id: 'prb-g07', type: 'nat', level: 3, exams: ['gate', 'net'], sub: 'Bayes theorem',
      make(r) {
        const prev = choose(r, [0.001, 0.005, 0.01, 0.02, 0.1]), sens = choose(r, [0.9, 0.95, 0.99]), fp = choose(r, [0.01, 0.02, 0.05, 0.1]);
        const answer = round((sens * prev) / (sens * prev + fp * (1 - prev)), 4);
        return { q: `A rare event has prior probability ${prev}. A detector flags it with probability ${sens} when it happens and gives a false alarm with probability ${fp} when it does not. Given a flag, find the probability that the event really happened (to four decimal places).`,
          answer, tol: Math.max(5e-4, answer * 0.003), prev, sens, fp,
          sol: `$P(E|F) = \\frac{${sens}\\times${prev}}{${sens}\\times${prev} + ${fp}\\times${round(1 - prev, 4)}} \\approx ${answer}$. With a small prior, false alarms dominate unless the false-alarm rate is much smaller than the prior.`,
          trap: '$P(F|E)$ is not $P(E|F)$.' };
      },
      verify: (p) => { const N = 1e6, E = N * p.prev, TP = E * p.sens, FP = (N - E) * p.fp; return TP / (TP + FP); } },
    { id: 'prb-g08', type: 'nat', level: 4, exams: ['gate', 'net'], sub: 'random walk',
      make(r) {
        const N = choose(r, [25, 50, 100, 400]), p = choose(r, [0.5, 0.55, 0.6, 0.7]), L = choose(r, [1, 2, 0.5]), what = choose(r, ['sd', 'mean']);
        const answer = round(what === 'sd' ? 2 * L * Math.sqrt(N * p * (1 - p)) : N * L * (2 * p - 1), 3);
        return { q: `A walker makes ${N} steps of length ${L} m, each to the right with probability ${p} and to the left otherwise. Find the ${what === 'sd' ? 'standard deviation' : 'mean'} of its final position, in m (to three decimal places).`,
          answer, unit: 'm', tol: Math.max(0.002, Math.abs(answer) * 0.002), N, p, L, what,
          sol: `One step has mean $L(2p - 1) = ${round(L * (2 * p - 1), 4)}$ m and variance $L^2[1 - (2p - 1)^2] = 4p(1 - p)L^2 = ${round(4 * p * (1 - p) * L * L, 4)}$ m². For ${N} independent steps ${what === 'sd' ? `the variances add: $\\sigma = \\sqrt{${N}\\times${round(4 * p * (1 - p) * L * L, 4)}} \\approx ${answer}$ m` : `the means add: $${N}\\times${round(L * (2 * p - 1), 4)} = ${answer}$ m`}.`,
          trap: 'The position is $(2n_R - N)L$, so its spread is twice that of $n_R$, times $L$.' };
      },
      verify: (p) => { // exact distribution of the number of right steps
        let m = 0, m2 = 0; for (let k = 0; k <= p.N; k++) { let lp = 0; for (let j = 1; j <= k; j++) lp += Math.log((p.N - k + j) / j); const P = Math.exp(lp + k * Math.log(p.p) + (p.N - k) * Math.log(1 - p.p)), x = (2 * k - p.N) * p.L; m += P * x; m2 += P * x * x; }
        return p.what === 'sd' ? Math.sqrt(m2 - m * m) : m; } },
    { id: 'prb-g09', type: 'nat', level: 3, exams: ['gate', 'net', 'jam'], sub: 'counting statistics',
      make(r) {
        const R = choose(r, [2, 5, 10, 25, 50, 100]), e = choose(r, [0.5, 1, 2, 5]);
        const answer = round(1 / (R * (e / 100) ** 2), 1);
        return { q: `A source gives ${R} counts per second (no background). How long, in seconds, must you count to measure the rate to a statistical precision of ${e}%?`,
          answer, unit: 's', tol: Math.max(0.1, answer * 0.002), R, e,
          sol: `$N$ counts have relative uncertainty $1/\\sqrt N$, so $N = 1/(${e / 100})^2 = ${round(1 / (e / 100) ** 2, 1)}$. At ${R} s⁻¹ that takes $t = N/R \\approx ${answer}$ s.`,
          trap: 'Halving the uncertainty costs four times the counting time.' };
      },
      verify: (p) => { // find t such that sqrt(Rt)/(Rt) = e by bisection
        let lo = 1e-6, hi = 1e9; for (let i = 0; i < 200; i++) { const t = Math.sqrt(lo * hi), rel = 1 / Math.sqrt(p.R * t); if (rel > p.e / 100) lo = t; else hi = t; } return Math.sqrt(lo * hi); } },
    { id: 'prb-g10', type: 'mcq', level: 2, exams: ['gate', 'net'], sub: 'distributions',
      make(r) {
        const D = [
          ['The variance always equals the mean.', 'Poisson'],
          ['The values are counts of successes in a fixed number of trials, and the variance is less than the mean.', 'binomial'],
          ['The standard deviation equals the mean, and values are positive waiting times.', 'exponential'],
          ['Every value in an interval is equally likely, and the variance is (width)²/12.', 'uniform'],
          ['The density is symmetric and bell-shaped, and every moment is fixed by the mean and variance.', 'Gaussian'],
          ['The density is bell-shaped but has no finite variance, with tails falling as $1/x^2$.', 'Lorentzian (Cauchy)'],
        ];
        const i = int(r, 0, D.length - 1), [desc, name] = D[i];
        const o = mcqOptions(r, name, D.filter((_, j) => j !== i).map((d) => d[1]), (s) => s);
        return { q: `Which distribution fits this description? ${desc}`, ...o,
          sol: `${desc} That is the ${name} distribution. (Poisson: variance = mean; binomial: variance $np(1 - p) <$ mean; exponential: $\\sigma = \\mu = 1/\\lambda$; uniform: $(b - a)^2/12$; Gaussian: fixed by two parameters; Lorentzian: no variance.)`,
          trap: 'Compare the variance with the mean first: it separates Poisson, binomial and exponential at once.' };
      } },
    { id: 'prb-g11', type: 'nat', level: 3, exams: ['gate', 'net', 'jam'], sub: 'exponential distribution',
      make(r) {
        const tau = choose(r, [2, 5, 10, 20]), t1 = choose(r, [0, 1, 2, 5]), t2 = t1 + choose(r, [1, 2, 5, 10]);
        const answer = round(Math.exp(-t1 / tau) - Math.exp(-t2 / tau), 4);
        return { q: `An unstable particle has mean lifetime ${tau} μs. Find the probability that it decays between ${t1} μs and ${t2} μs after it is made (to four decimal places).`,
          answer, tol: Math.max(2e-4, answer * 0.003), tau, t1, t2,
          sol: `Survival to time $t$ is $e^{-t/\\tau}$, so $P = e^{-${t1}/${tau}} - e^{-${t2}/${tau}} = ${round(Math.exp(-t1 / tau), 4)} - ${round(Math.exp(-t2 / tau), 4)} \\approx ${answer}$.`,
          trap: 'Subtract survival probabilities; do not multiply the interval by the rate unless it is very short.' };
      },
      verify: (p) => integ((t) => Math.exp(-t / p.tau) / p.tau, p.t1, p.t2, 20000) },
    ...more,
  ],
};
