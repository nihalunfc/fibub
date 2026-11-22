// Extra question shapes for probability (templates prb-m31..m35). Imported by probability.js.
import { int, choose, mcqOptions, shuffle, round, fmt } from '../_util.js';
import { msqOf } from './_more.js';
import { oneOf, matchOne, orderOpts } from './_odd.js';

export default [
  { id: 'prb-m31', type: 'msq', level: 2, exams: ['jam', 'gate', 'net'], sub: 'rules of probability', format: 'statements',
    make(r) {
      const pa = choose(r, [0.2, 0.3, 0.4, 0.5]), pb = choose(r, [0.1, 0.2, 0.6]), k = int(r, 2, 4), N = choose(r, [4, 9, 16, 25, 100]), not = r() < 0.5;
      const pu = round(pa + pb - pa * pb, 2);
      const m = msqOf(r, [
        [`for independent events with $P(A) = ${pa}$ and $P(B) = ${pb}$, $P(A \\cup B) = ${pu}$`, true, `$P(A \\cup B) = P(A) + P(B) - P(A)P(B) = ${pa} + ${pb} - ${round(pa * pb, 2)} = ${pu}$.`],
        [`for independent events with $P(A) = ${pa}$ and $P(B) = ${pb}$, $P(A \\cup B) = ${round(pa + pb, 2)}$`, false, `Adding is right only for mutually exclusive events; independent events overlap with probability $${round(pa * pb, 2)}$.`],
        ['two mutually exclusive events, each with non-zero probability, are independent', false, 'If one happens the other cannot, so $P(A \\cap B) = 0 \\ne P(A)P(B)$.'],
        ['$\\text{Var}(X + Y) = \\text{Var}\\,X + \\text{Var}\\,Y$ for independent $X$ and $Y$', true, 'The covariance term vanishes for independent variables.'],
        [`$\\text{Var}(${k}X) = ${k}\\,\\text{Var}\\,X$`, false, `Variance scales with the square: $\\text{Var}(${k}X) = ${k * k}\\,\\text{Var}\\,X$.`],
        ['uncorrelated random variables are always independent', false, 'Zero covariance does not imply independence: $X$ symmetric about 0 and $Y = X^2$ are uncorrelated but dependent.'],
        ['a Poisson random variable has equal mean and variance', true, 'Both equal the parameter $\\mu$.'],
        [`the standard error of the mean of ${N} independent readings, each with spread $\\sigma$, is $\\sigma/${Math.sqrt(N)}$`, true, `$\\sigma/\\sqrt N = \\sigma/\\sqrt{${N}}$.`],
        [`the standard error of the mean of ${N} independent readings, each with spread $\\sigma$, is $\\sigma/${N}$`, false, `It falls as $1/\\sqrt N$: $\\sigma/${Math.sqrt(N)}$.`],
      ], { not });
      return { q: `Which statements are ${not ? '<b>NOT</b> correct' : 'correct'}?`, ...m,
        trap: 'Independent is not the same as mutually exclusive; and variances, not standard deviations, add.' };
    } },
  { id: 'prb-m32', type: 'mcq', level: 3, exams: ['gate', 'net'], sub: 'fluctuations', format: 'order of magnitude',
    make(r) {
      const V = choose(r, [['$1\\ \\text{cm}^3$', 1e-6], ['$1\\ \\text{mm}^3$', 1e-9], ['$1\\ \\mu\\text{m}^3$', 1e-18], ['a cube of side 10 nm', 1e-24], ['a cube of side 100 nm', 1e-21], ['$1$ litre', 1e-3]]);
      const n = 2.69e25, N = n * V[1], f = 1 / Math.sqrt(N);
      const o = orderOpts(r, f);
      return { q: `Air at room conditions holds about $2.7\\times10^{25}$ molecules per m$^3$. The relative fluctuation $\\Delta N/N$ in the number of molecules inside ${V[0]} of it is of order`, ...o,
        sol: `The number in a small volume follows Poisson statistics, so $\\Delta N = \\sqrt N$ and $\\Delta N/N = 1/\\sqrt N$. Here $N = 2.7\\times10^{25}\\times${fmt(V[1])} \\approx ${fmt(N, 2)}$, so $1/\\sqrt N \\approx ${fmt(f, 2)}$, of order $10^{${o.n}}$. Macroscopic volumes have utterly negligible fluctuations; only nanoscale volumes show them.`,
        trap: 'The fluctuation is $1/\\sqrt N$, not $1/N$: halve the exponent of $N$.' };
    } },
  { id: 'prb-m33', type: 'mcq', level: 2, exams: ['gate', 'net'], sub: 'approximations', format: 'limiting case',
    make(r) {
      const poi = r() < 0.5;
      const n = poi ? choose(r, [500, 1000, 2000, 5000]) : choose(r, [400, 900, 1600]);
      const mu = int(r, 1, 4), p = poi ? mu / n : choose(r, [0.5, 0.4, 0.3]);
      const L = {
        poi: 'the Poisson distribution with the same mean $np$',
        gau: 'a Gaussian with mean $np$ and variance $np(1 - p)$',
        bin: 'none: no simpler distribution is accurate here, so the exact binomial must be used',
        uni: 'a uniform distribution over $0, 1, \\dots, n$',
      };
      return { q: `A binomial count has $n = ${n}$ trials with success probability $p = ${round(p, 5)}$ each. The best simple approximation to its distribution is`, ...matchOne(r, L, [null, poi ? 'poi' : 'gau', poi
        ? `Here $n$ is large and $p$ small with $np = ${mu}$ fixed and small: the Poisson limit. A Gaussian would be poor, because with mean ${mu} and spread $\\approx\\sqrt{${mu}}$ the distribution is strongly skewed and cannot go below 0.`
        : `Here $np = ${round(n * p, 1)}$ and $np(1 - p) = ${round(n * p * (1 - p), 1)}$ are both large, so the central limit theorem gives a Gaussian with $\\sigma = ${round(Math.sqrt(n * p * (1 - p)), 2)}$. A Poisson with the same mean would have variance $np = ${round(n * p, 1)}$, too big by the factor $1/(1 - p)$.`]),
        trap: 'Poisson needs small $p$ (variance close to the mean); a Gaussian needs $np(1 - p) \\gg 1$.' };
    } },
  { id: 'prb-m34', type: 'mcq', level: 2, exams: ['jam', 'gate', 'net'], sub: 'sample statistics', format: 'which is NOT',
    make(r) {
      const d = [int(r, 1, 5)]; for (const step of [int(r, 1, 4), int(r, 1, 4), int(r, 1, 4), int(r, 1, 4)]) d.push(d[d.length - 1] + step);
      const N = 5, mean = d.reduce((a, b) => a + b, 0) / N, ss = d.reduce((a, x) => a + (x - mean) ** 2, 0);
      const sv = round(ss / (N - 1), 2), pv = round(ss / N, 2), not = r() < 0.6;
      const m = oneOf(r, [
        [`the mean is ${round(mean, 2)}`, true, `$(${d.join(' + ')})/5 = ${round(mean, 2)}$.`],
        [`the median is ${d[2]}`, true, 'The middle value of the five, once sorted.'],
        [`the sample variance (dividing by $N - 1$) is ${sv}`, true, `$\\sum(x - \\bar x)^2 = ${round(ss, 2)}$, divided by 4.`],
        [`the range is ${d[4] - d[0]}`, true, `Largest minus smallest: $${d[4]} - ${d[0]}$.`],
        [`the mean is ${round(mean + 1, 2)}`, false, `The mean is ${round(mean, 2)}.`],
        [`the median is ${d[1]}`, false, `The median is the third value, ${d[2]}.`],
        [`the sample variance (dividing by $N - 1$) is ${pv}`, false, `${pv} is the result of dividing by $N = 5$; dividing by 4 gives ${sv}.`],
        [`the range is ${d[4] - d[1]}`, false, `The range is $${d[4]} - ${d[0]} = ${d[4] - d[0]}$.`],
      ], not);
      return { q: `Five readings are ${shuffle(r, d).join(', ')}. Which statement is ${not ? '<b>NOT</b> correct' : 'correct'}?`, ...m,
        trap: 'Sort the data before taking the median, and note which variance (divide by $N$ or $N - 1$) is asked for.' };
    } },
  { id: 'prb-m35', type: 'mcq', level: 2, exams: ['jam', 'gate', 'net'], sub: 'Gaussian distribution',
    make(r) {
      const k = int(r, 1, 3), two = r() < 0.5, mu = choose(r, [50, 100, 220, 470]), s = choose(r, [1, 2, 5]);
      const one = { 1: 15.9, 2: 2.3, 3: 0.13 }, both = { 1: 31.7, 2: 4.6, 3: 0.27 };
      const ans = two ? both[k] : one[k];
      const all = [15.9, 2.3, 0.13, 31.7, 4.6, 0.27, 68.3, 95.4].filter((v) => v !== ans);
      const o = mcqOptions(r, ans, shuffle(r, all), (v) => `about ${v}%`);
      return { q: `Resistors from a factory have resistance normally distributed with mean ${mu} Ω and standard deviation ${s} Ω. The fraction with resistance ${two ? `outside the range ${mu - k * s} Ω to ${mu + k * s} Ω` : `above ${mu + k * s} Ω`} is`, ...o,
        sol: `${two ? `The range is $\\mu \\pm ${k}\\sigma$` : `The threshold is $\\mu + ${k}\\sigma$`}. For a Gaussian, the fractions within $\\pm1\\sigma$, $\\pm2\\sigma$, $\\pm3\\sigma$ are 68.3%, 95.4% and 99.73%. So the fraction outside $\\pm${k}\\sigma$ is ${both[k]}%${two ? '' : `, and by symmetry half of it, ${one[k]}%, lies above`}.`,
        trap: 'Decide whether one tail or both tails are asked for: the two differ by a factor 2.' };
    } },
];
