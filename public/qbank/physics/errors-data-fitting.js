// Measurement, errors and fitting data (CSIR NET Part C experimental methods): accuracy and precision, random and
// systematic errors, resolution, standard error, propagation through non-linear and correlated formulas, Gaussian
// confidence levels, weighted means, least-squares lines (slope, intercept, their errors and covariance),
// linearising plots, chi-square and goodness of fit, correlation coefficient, rejecting data, counting-time choices.
// Original questions for CSIR NET (and GATE) practice (fibub). Basics of probability live in the `probability` topic.
import { pick, int, choose, mcqOptions, round } from '../_util.js';
import more from './errors-data-fitting.more.gen.js';
import more2 from './errors-data-fitting.more2.gen.js';

// erf by Abramowitz-Stegun 7.1.26 (error below 1.5e-7) and by Simpson integration (used by verify).
const erf = (x) => { const s = Math.sign(x), a = Math.abs(x), t = 1 / (1 + 0.3275911 * a); return s * (1 - (((((1.061405429 * t - 1.453152027) * t) + 1.421413741) * t - 0.284496736) * t + 0.254829592) * t * Math.exp(-a * a)); };
const erfS = (x) => { const n = 400, h = x / n; let s = 1 + Math.exp(-x * x); for (let i = 1; i < n; i++) s += (i % 2 ? 4 : 2) * Math.exp(-((i * h) ** 2)); return (2 / Math.sqrt(Math.PI)) * (h / 3) * s; };
const sum = (a) => a.reduce((s, v) => s + v, 0);
const fitLine = (x, y) => { const N = x.length, Sx = sum(x), Sy = sum(y), Sxy = sum(x.map((v, i) => v * y[i])), Sxx = sum(x.map((v) => v * v)), D = N * Sxx - Sx * Sx; return { b: (N * Sxy - Sx * Sy) / D, a: (Sxx * Sy - Sx * Sxy) / D, Sx, Sy, Sxy, Sxx, D, N }; };

export default {
  topic: 'errors-data-fitting',
  items: [
    // ---------- level 1 ----------
    { id: 'edf-001', type: 'mcq', level: 1, exams: ['gate', 'net'], sub: 'accuracy and precision',
      q: 'Ten readings of a known 5.00 V reference give values from 5.31 V to 5.33 V. The voltmeter is',
      options: ['accurate but not precise', 'precise but not accurate', 'both accurate and precise', 'neither accurate nor precise'], answer: 1,
      sol: 'Precision is the spread of repeated readings: 0.02 V here, very small. Accuracy is closeness to the true value: the readings sit about 0.32 V too high. Small spread with a large offset means a systematic error (a calibration or zero error): precise but not accurate.',
      trap: 'A small spread says nothing about the offset; averaging more readings will not remove it.' },
    { id: 'edf-002', type: 'mcq', level: 1, exams: ['gate', 'net', 'jam'], sub: 'random and systematic errors',
      q: 'Which of these reduces the random error of a result but leaves a systematic error untouched?',
      options: ['Calibrating the instrument against a standard', 'Correcting for the zero error of the scale', 'Averaging a larger number of repeated readings', 'Measuring the same quantity by a different method'], answer: 2,
      sol: 'The standard error of a mean falls as $\\sigma/\\sqrt N$, so more readings reduce random scatter. A systematic error shifts every reading the same way, so it survives any amount of averaging; calibration, zero correction and an independent method are the ways to find and remove it.',
      trap: 'Averaging never removes a bias.' },
    { id: 'edf-003', type: 'mcq', level: 1, exams: ['gate', 'net'], sub: 'standard deviation',
      q: 'The sample standard deviation of $N$ readings is computed with $N - 1$ rather than $N$ in the denominator because',
      options: ['one degree of freedom is used up in estimating the mean from the same data', 'it makes the standard deviation smaller', 'the first reading is always discarded', 'it converts the standard deviation into the standard error'], answer: 0,
      sol: 'Deviations are taken from the sample mean $\\bar x$, which is itself fitted to the data, so $\\sum(x_i - \\bar x)^2$ is on average $(N-1)\\sigma^2$, not $N\\sigma^2$. Dividing by $N-1$ gives an unbiased estimate of $\\sigma^2$. The same rule gives $N - p$ degrees of freedom after fitting $p$ parameters.',
      trap: 'Dividing by $N-1$ makes the estimate slightly larger, not smaller.' },
    { id: 'edf-004', type: 'nat', level: 1, exams: ['gate', 'net', 'jam'], sub: 'standard error',
      q: 'Five readings of a length are 9.8, 10.1, 10.0, 10.3 and 9.8 cm. The standard error of their mean (using the sample standard deviation) is ______ cm (to three decimal places).',
      answer: 0.095, tol: 0.002, unit: 'cm', calc: () => Math.sqrt((0.04 + 0.01 + 0 + 0.09 + 0.04) / 4) / Math.sqrt(5),
      sol: 'Mean $= 50.0/5 = 10.0$ cm. Deviations: $-0.2, 0.1, 0, 0.3, -0.2$; squares sum to $0.18$. Sample standard deviation $s = \\sqrt{0.18/4} = 0.212$ cm. Standard error $s/\\sqrt5 = 0.212/2.236 = 0.095$ cm.',
      trap: 'The standard deviation (0.21 cm) describes one reading; the standard error describes the mean.' },
    { id: 'edf-005', type: 'mcq', level: 1, exams: ['gate', 'net', 'jam'], sub: 'Gaussian confidence',
      q: 'For Gaussian errors, the fraction of readings expected within $\\pm2\\sigma$ of the mean is about',
      options: ['68.3%', '90.0%', '99.7%', '95.4%'], answer: 3,
      sol: 'The probability within $\\pm k\\sigma$ is $\\operatorname{erf}(k/\\sqrt2)$: 68.3% for $k = 1$, 95.4% for $k = 2$, 99.7% for $k = 3$.',
      trap: '68% is one sigma; 99.7% is three.' },
    { id: 'edf-006', type: 'mcq', level: 1, exams: ['gate', 'net'], sub: 'resolution',
      q: 'A digital meter shows whole millivolts. If the true value is equally likely to lie anywhere in the 1 mV interval the display rounds to, the standard uncertainty from this rounding alone is',
      options: ['0.5 mV', '0.29 mV', '1 mV', '0.14 mV'], answer: 1,
      sol: 'A uniform distribution of full width $\\Delta$ has standard deviation $\\Delta/\\sqrt{12}$. With $\\Delta = 1$ mV: $1/3.464 = 0.29$ mV. (Equivalently, half-width $a = 0.5$ mV gives $a/\\sqrt3$.)',
      trap: 'The half-width 0.5 mV is the maximum error, not the standard deviation.' },

    // ---------- level 2 ----------
    { id: 'edf-007', type: 'nat', level: 2, exams: ['gate', 'net', 'jam'], sub: 'error propagation',
      q: 'A quantity $f = x^2y$ is formed from independent measurements with relative uncertainties 1% in $x$ and 2% in $y$. The relative uncertainty of $f$ is ______ % (to two decimal places).',
      answer: 2.83, tol: 0.02, unit: '%', calc: () => Math.sqrt((2 * 1) ** 2 + 2 ** 2),
      sol: 'For products of powers, relative uncertainties add in quadrature, each multiplied by its power: $\\sigma_f/f = \\sqrt{(2\\times1\\%)^2 + (1\\times2\\%)^2} = \\sqrt{8}\\,\\% = 2.83\\%$.',
      trap: 'Adding linearly (4%) is the worst case, not the standard uncertainty for independent errors.' },
    { id: 'edf-008', type: 'mcq', level: 2, exams: ['gate', 'net'], sub: 'error propagation',
      q: 'Two masses are $A = 50.0 \\pm 0.3$ g and $B = 48.0 \\pm 0.4$ g (independent). The relative uncertainty of the difference $A - B$ is',
      options: ['35%', '1.4%', '25%', '0.7%'], answer: 2,
      sol: '$A - B = 2.0$ g with $\\sigma = \\sqrt{0.3^2 + 0.4^2} = 0.5$ g, so the relative uncertainty is $0.5/2.0 = 25\\%$. Subtracting nearly equal numbers keeps the absolute error but destroys the relative precision.',
      trap: '35% comes from adding 0.3 and 0.4 linearly; 1% or less comes from using the relative errors of $A$ and $B$.' },
    { id: 'edf-009', type: 'mcq', level: 2, exams: ['gate', 'net'], sub: 'least squares',
      q: 'For data $(x_i, y_i \\pm \\sigma_i)$ with negligible errors in $x$, the least-squares fit of a model $y(x)$ chooses the parameters that minimise',
      options: ['$\\sum_i |y_i - y(x_i)|$', '$\\sum_i (y_i - y(x_i))/\\sigma_i$', '$\\sum_i (x_i - \\bar x)^2$', '$\\sum_i \\big[(y_i - y(x_i))/\\sigma_i\\big]^2$'], answer: 3,
      sol: 'For Gaussian errors the likelihood is $\\prod e^{-(y_i - y(x_i))^2/2\\sigma_i^2}$, which is largest when $\\chi^2 = \\sum[(y_i - y(x_i))/\\sigma_i]^2$ is smallest. Points with small $\\sigma_i$ get more weight.',
      trap: 'The plain sum of residuals can be zero for a terrible fit; signs cancel.' },
    { id: 'edf-010', type: 'nat', level: 2, exams: ['gate', 'net'], sub: 'least squares',
      q: 'A least-squares straight line $y = a + bx$ is fitted to $(1, 2.1)$, $(2, 3.9)$, $(3, 6.2)$, $(4, 7.8)$. The intercept $a$ is ______ (to two decimal places).',
      answer: 0.15, tol: 0.01, calc: () => { const f = fitLine([1, 2, 3, 4], [2.1, 3.9, 6.2, 7.8]); return f.a; },
      sol: '$N = 4$, $\\sum x = 10$, $\\sum y = 20.0$, $\\sum xy = 59.7$, $\\sum x^2 = 30$. $\\Delta = N\\sum x^2 - (\\sum x)^2 = 20$. $b = (4\\times59.7 - 10\\times20)/20 = 1.94$. The line passes through $(\\bar x, \\bar y) = (2.5, 5.0)$, so $a = 5.0 - 1.94\\times2.5 = 0.15$.',
      trap: 'Every least-squares line with an intercept passes through the centroid $(\\bar x, \\bar y)$; use it to get $a$ quickly.' },
    { id: 'edf-011', type: 'mcq', level: 2, exams: ['gate', 'net', 'jam'], sub: 'linearising',
      q: 'The current in a discharging circuit is expected to follow $I = I_0e^{-t/\\tau}$. Which plot is a straight line, and what does its slope give?',
      options: ['$\\ln I$ against $t$; slope $-1/\\tau$', '$I$ against $\\ln t$; slope $-\\tau$', '$\\ln I$ against $\\ln t$; slope $-1/\\tau$', '$1/I$ against $t$; slope $\\tau$'], answer: 0,
      sol: 'Taking logs, $\\ln I = \\ln I_0 - t/\\tau$: linear in $t$ with slope $-1/\\tau$ and intercept $\\ln I_0$.',
      trap: 'A log-log plot linearises power laws, not exponentials.' },
    { id: 'edf-012', type: 'mcq', level: 2, exams: ['gate', 'net', 'jam'], sub: 'linearising',
      q: 'Data are suspected to follow $y = Cx^n$ with unknown $C$ and $n$. A straight-line fit of which quantities gives $n$ directly as the slope?',
      options: ['$y$ against $x^2$', '$\\ln y$ against $x$', '$\\ln y$ against $\\ln x$', '$1/y$ against $1/x$'], answer: 2,
      sol: '$\\ln y = \\ln C + n\\ln x$: slope $n$, intercept $\\ln C$. Any base of logarithm works for the slope.',
      trap: '$\\ln y$ against $x$ is for exponentials.' },
    { id: 'edf-013', type: 'mcq', level: 2, exams: ['gate', 'net'], sub: 'chi-square',
      q: 'A straight line (two parameters) fitted to 12 points with known errors gives $\\chi^2 = 30$. The reduced chi-square is',
      options: ['2.5', '2.7', '3.0', '15'], answer: 2,
      sol: 'Degrees of freedom $\\nu = N - p = 12 - 2 = 10$, so $\\chi^2/\\nu = 3.0$: the scatter is about $\\sqrt3$ times larger than the stated errors explain.',
      trap: 'Dividing by $N$ (2.5) or $N - 1$ (2.7) forgets that two parameters were fitted.' },
    { id: 'edf-014', type: 'msq', level: 2, exams: ['gate', 'net'], sub: 'random and systematic errors',
      q: 'Which of these are systematic errors?',
      options: ['A screw gauge whose jaws read 0.02 mm when closed', 'Reading a needle always from slightly to the left of the scale', 'The last digit of a voltmeter flickering between two values', 'A steel tape calibrated at 20 °C used outdoors at 40 °C'], answer: [0, 1, 3],
      sol: 'A zero error, a consistent parallax and thermal expansion of the tape all push every reading in the same direction: systematic. A flickering last digit scatters readings both ways: random.',
      trap: 'Parallax is systematic when it is always from the same side; random only if the eye position varies.' },
    { id: 'edf-015', type: 'mcq', level: 2, exams: ['gate', 'net', 'jam'], sub: 'significant figures',
      q: 'A calculation gives $g = 9.8164$ m s$^{-2}$ with a standard uncertainty of $0.0372$ m s$^{-2}$. The correct way to report it is',
      options: ['$9.8164 \\pm 0.0372$ m s$^{-2}$', '$9.82 \\pm 0.04$ m s$^{-2}$', '$9.8 \\pm 0.0372$ m s$^{-2}$', '$9.816 \\pm 0.04$ m s$^{-2}$'], answer: 1,
      sol: 'Round the uncertainty to one (or two) significant figures, here 0.04, then round the value to the same decimal place: 9.82. The digits beyond are not known.',
      trap: 'The value and its uncertainty must end at the same decimal place.' },
    { id: 'edf-016', type: 'mcq', level: 2, exams: ['gate', 'net'], sub: 'counting',
      q: 'A counter records 900 counts in 300 s (background negligible). The count rate is',
      options: ['$3.0 \\pm 0.1$ s$^{-1}$', '$3.0 \\pm 1.7$ s$^{-1}$', '$3.0 \\pm 0.03$ s$^{-1}$', '$3.0 \\pm 30$ s$^{-1}$'], answer: 0,
      sol: 'Counts are Poisson: $\\sigma_N = \\sqrt{900} = 30$. The time is exact, so $R = (900 \\pm 30)/300 = 3.0 \\pm 0.1$ s$^{-1}$.',
      trap: 'Taking $\\sqrt R = 1.7$ is wrong: the square root rule applies to the number of counts, not to a rate.' },

    // ---------- level 3 ----------
    { id: 'edf-017', type: 'nat', level: 3, exams: ['gate', 'net'], sub: 'error propagation',
      q: 'A pendulum has length $L = 1.000 \\pm 0.002$ m. Fifty oscillations take $100.0 \\pm 0.2$ s. Using $g = 4\\pi^2L/T^2$, the uncertainty in $g$ is ______ m s$^{-2}$ (to three decimal places).',
      answer: 0.044, tol: 0.002, unit: 'm s⁻²', calc: () => 4 * Math.PI ** 2 * 1 / 4 * Math.sqrt(0.002 ** 2 + (2 * 0.002) ** 2),
      sol: '$T = 2.000 \\pm 0.004$ s (timing 50 swings divides the error by 50). $g = 4\\pi^2(1.000)/4 = 9.870$ m s$^{-2}$. $\\sigma_g/g = \\sqrt{(0.002)^2 + (2\\times0.002)^2} = 4.47\\times10^{-3}$, so $\\sigma_g = 0.044$ m s$^{-2}$.',
      trap: 'The period enters squared, so its relative error counts twice.' },
    { id: 'edf-018', type: 'mcq', level: 3, exams: ['gate', 'net'], sub: 'correlated errors',
      q: 'Two lengths $L_1$ and $L_2$ are measured with the same tape, which has an unknown scale error of 0.5% (every reading too long by the same factor). The scale error contributes to the ratio $L_1/L_2$ an uncertainty of',
      options: ['0.71%', '0.5%', '1.0%', 'zero'], answer: 3,
      sol: 'Both readings carry the same factor $(1 + \\epsilon)$, so $L_1(1+\\epsilon)/[L_2(1+\\epsilon)] = L_1/L_2$: the error cancels exactly. Fully correlated errors must be propagated with their covariance, not in quadrature.',
      trap: '0.71% treats the two scale errors as independent, which they are not.' },
    { id: 'edf-019', type: 'nat', level: 3, exams: ['gate', 'net'], sub: 'weighted mean',
      q: 'Three labs report $4.2 \\pm 0.2$, $4.6 \\pm 0.4$ and $4.0 \\pm 0.1$ (same units). Their weighted mean is ______ (to two decimal places).',
      answer: 4.07, tol: 0.01, calc: () => (4.2 * 25 + 4.6 * 6.25 + 4.0 * 100) / (25 + 6.25 + 100),
      sol: 'Weights $w = 1/\\sigma^2$: 25, 6.25, 100 (sum 131.25). $\\bar x = (4.2\\times25 + 4.6\\times6.25 + 4.0\\times100)/131.25 = 533.75/131.25 = 4.067$.',
      trap: 'The plain average 4.27 ignores that the third lab is four times more precise than the second.' },
    { id: 'edf-020', type: 'mcq', level: 3, exams: ['gate', 'net'], sub: 'weighted mean',
      q: 'For the three results $4.2 \\pm 0.2$, $4.6 \\pm 0.4$ and $4.0 \\pm 0.1$, the uncertainty of the weighted mean is',
      options: ['0.10', '0.23', '0.087', '0.058'], answer: 2,
      sol: '$\\sigma_{\\bar x} = (\\sum 1/\\sigma_i^2)^{-1/2} = 131.25^{-1/2} = 0.087$. It is smaller than the best single error (0.1), as it must be.',
      trap: 'The combined result can never be less precise than its best input.' },
    { id: 'edf-021', type: 'nat', level: 3, exams: ['gate', 'net'], sub: 'least squares',
      q: 'A straight line is fitted to five points at $x = 1, 2, 3, 4, 5$, each $y$ having the same standard error $0.2$. The standard error of the fitted slope is ______ (to three decimal places).',
      answer: 0.063, tol: 0.001, calc: () => 0.2 * Math.sqrt(5 / (5 * 55 - 225)),
      sol: '$\\sigma_b = \\sigma\\sqrt{N/\\Delta}$ with $\\Delta = N\\sum x^2 - (\\sum x)^2 = 5\\times55 - 15^2 = 50$. $\\sigma_b = 0.2\\sqrt{5/50} = 0.2\\times0.316 = 0.063$. Equivalently $\\sigma/\\sqrt{\\sum(x_i - \\bar x)^2} = 0.2/\\sqrt{10}$.',
      trap: 'The slope error does not depend on the $y$ values, only on $\\sigma$ and the spread of the $x$ values.' },
    { id: 'edf-022', type: 'mcq', level: 3, exams: ['gate', 'net'], sub: 'residuals',
      q: 'After a straight-line fit, the residuals are positive at both ends of the range and negative in the middle, although $\\chi^2/\\nu$ is close to 2. The most likely conclusion is',
      options: ['the error bars are too small by a factor of 2', 'the data have curvature that a straight line cannot describe', 'there is one outlier', 'the fit is good and the pattern is chance'], answer: 1,
      sol: 'Random errors give residuals that change sign at random. A smooth U-shaped pattern is systematic: the model is missing a term (for instance $cx^2$). Fit a better model and look again before blaming the error bars.',
      trap: 'Inflating the error bars would lower $\\chi^2$ but leave the pattern, and the physics, wrong.' },
    { id: 'edf-023', type: 'mcq', level: 3, exams: ['gate', 'net'], sub: 'chi-square',
      q: 'A fit with 20 degrees of freedom gives $\\chi^2 = 4$. The most reasonable interpretation is',
      options: ['the model is wrong', 'the fit is excellent and the errors are correct', 'the data should be refitted with more parameters', 'the stated errors are too large (or the points are not independent)'], answer: 3,
      sol: '$\\chi^2/\\nu = 0.2$, while a good fit with correct errors gives about $1 \\pm \\sqrt{2/\\nu} = 1 \\pm 0.32$. Such a small value means the scatter is much smaller than the errors claim: errors overestimated or correlated (for example, smoothed data).',
      trap: 'A very small $\\chi^2$ is as suspicious as a very large one.' },
    { id: 'edf-024', type: 'nat', level: 3, exams: ['gate', 'net'], sub: 'Gaussian confidence',
      q: 'A theory predicts 10.0; an experiment gives $10.6 \\pm 0.25$ (Gaussian). The probability that chance alone gives a deviation at least this large in either direction is ______ % (to two decimal places). Use $\\Phi(2.4) = 0.9918$ for the standard normal cumulative distribution.',
      answer: 1.64, tol: 0.05, unit: '%', calc: () => 2 * (1 - 0.9918) * 100,
      sol: '$z = (10.6 - 10.0)/0.25 = 2.4$. Two-sided probability $= 2[1 - \\Phi(2.4)] = 2\\times0.0082 = 0.0164 = 1.64\\%$. The disagreement is significant at the 5% level but not at the 1% level.',
      trap: 'One-sided (0.82%) is the answer to a different question.' },
    { id: 'edf-025', type: 'msq', level: 3, exams: ['gate', 'net'], sub: 'least squares',
      q: 'For an unweighted least-squares straight line $y = a + bx$ through $N$ points, which statements are true?',
      options: ['The line passes through $(\\bar x, \\bar y)$', 'The residuals add up to zero', 'The fitted $a$ and $b$ are uncorrelated whatever the $x$ values', '$\\sum(\\text{residual})^2/(N - 2)$ estimates the variance of a single $y$'], answer: [0, 1, 3],
      sol: 'Setting $\\partial S/\\partial a = 0$ gives $\\sum(y_i - a - bx_i) = 0$: residuals sum to zero and the line passes through the centroid. With two fitted parameters, $\\sum r^2/(N - 2)$ is the unbiased variance estimate. $\\text{cov}(a, b) = -\\bar x\\,\\sigma_b^2$, which is zero only when $\\bar x = 0$.',
      trap: 'Shift the origin to $\\bar x$ if you want uncorrelated parameters.' },
    { id: 'edf-026', type: 'mcq', level: 3, exams: ['gate', 'net'], sub: 'linearising',
      q: 'Decay data are fitted as $\\ln N$ against $t$. A point with $N = 625$ counts (Poisson) has an uncertainty in $\\ln N$ of',
      options: ['25', '0.04', '0.0016', '3.2'], answer: 1,
      sol: '$\\sigma_{\\ln N} = \\sigma_N/N = \\sqrt N/N = 1/\\sqrt N = 1/25 = 0.04$. Points with fewer counts have larger errors in $\\ln N$, so a correct fit weights each point by $N$.',
      trap: 'Taking logs changes the error bars: equal weights on a log plot are wrong for counting data.' },
    { id: 'edf-027', type: 'mcq', level: 3, exams: ['gate', 'net'], sub: 'rejecting data',
      q: 'Chauvenet\'s criterion rejects a reading if the expected number of readings at least as far from the mean, in a set of $N$, is below one half. For $N = 10$, a reading is rejected when its distance from the mean exceeds about',
      options: ['$1.0\\sigma$', '$2.6\\sigma$', '$3.0\\sigma$', '$1.96\\sigma$'], answer: 3,
      sol: 'Need $N\\,P(|z| > z_c) = 0.5$, so $P = 0.05$, and the two-sided 5% point of a Gaussian is $z_c = 1.96$. For larger $N$ the threshold grows (about 2.8 for $N = 100$).',
      trap: 'The threshold depends on $N$; there is no universal "three sigma" rule here.' },
    { id: 'edf-028', type: 'mcq', level: 3, exams: ['gate', 'net'], sub: 'correlation',
      q: 'The linear correlation coefficient $r$ of the points $(1, 1)$, $(2, 3)$, $(3, 2)$, $(4, 4)$ is',
      options: ['0.80', '0.64', '0.89', '1.00'], answer: 0,
      sol: '$\\bar x = \\bar y = 2.5$. $\\sum\\delta x\\,\\delta y = 2.25 - 0.25 - 0.25 + 2.25 = 4$, $\\sum\\delta x^2 = \\sum\\delta y^2 = 5$. $r = 4/\\sqrt{5\\times5} = 0.80$.',
      trap: '0.64 is $r^2$, the fraction of the variance explained by the line.' },

    // ---------- level 4 ----------
    { id: 'edf-029', type: 'nat', level: 4, exams: ['gate', 'net'], sub: 'error propagation',
      q: 'With independent $x = 2.0 \\pm 0.1$ and $y = 3.0 \\pm 0.1$, the standard uncertainty of $f = x/(x + y)$ is ______ (to four decimal places).',
      answer: 0.0144, tol: 0.0003, calc: () => Math.hypot(3 / 25 * 0.1, 2 / 25 * 0.1),
      sol: '$x$ appears in both numerator and denominator, so differentiate the whole function: $\\partial f/\\partial x = y/(x+y)^2 = 3/25 = 0.12$, $\\partial f/\\partial y = -x/(x+y)^2 = -0.08$. $\\sigma_f = \\sqrt{(0.12\\times0.1)^2 + (0.08\\times0.1)^2} = \\sqrt{2.08\\times10^{-4}} = 0.0144$.',
      trap: 'Combining the relative errors of $x$ and of $x + y$ as if independent gives 0.0216, too big.' },
    { id: 'edf-030', type: 'mcq', level: 4, exams: ['gate', 'net'], sub: 'least squares',
      q: 'A straight line is fitted to data with all $x_i > 0$. The covariance of the fitted intercept $a$ and slope $b$ is',
      options: ['positive', 'zero', 'negative', 'of the same sign as $b$'], answer: 2,
      sol: '$\\text{cov}(a, b) = -\\bar x\\,\\sigma_b^2$. With $\\bar x > 0$ it is negative: if the slope comes out a little too steep, the line pivots about the centroid and the intercept comes out too low.',
      trap: 'The sign depends on where the data sit, not on the slope.' },
    { id: 'edf-031', type: 'mcq', level: 4, exams: ['gate', 'net'], sub: 'maximum likelihood',
      q: 'Four equal counting intervals give 3, 5, 4 and 8 counts. The maximum-likelihood estimate of the Poisson mean per interval and its standard error are',
      options: ['$5.0 \\pm 2.2$', '$5.0 \\pm 1.1$', '$5.0 \\pm 1.0$', '$5.0 \\pm 0.6$'], answer: 1,
      sol: '$\\ln L = \\sum(n_i\\ln\\mu - \\mu) + $ const, so $d\\ln L/d\\mu = 0$ gives $\\hat\\mu = \\bar n = 20/4 = 5.0$. Its variance is $\\mu/4$ (from $-1/(d^2\\ln L/d\\mu^2) = \\mu^2/\\sum n_i$), so $\\sigma = \\sqrt{5/4} = 1.1$.',
      trap: '$\\sqrt5 = 2.2$ is the spread of one interval, not of the mean of four.' },
    { id: 'edf-032', type: 'mcq', level: 4, exams: ['gate', 'net'], sub: 'least squares',
      q: 'A line through the origin, $y = kx$, is fitted to points at $x = 1, 2, 3$, each $y$ with error $0.3$. The standard error of $k$ is',
      options: ['0.035', '0.10', '0.17', '0.080'], answer: 3,
      sol: 'Minimising $\\sum(y_i - kx_i)^2$ gives $k = \\sum xy/\\sum x^2$, a linear combination of the $y_i$ with coefficients $x_i/\\sum x^2$. So $\\sigma_k = \\sigma/\\sqrt{\\sum x^2} = 0.3/\\sqrt{14} = 0.080$.',
      trap: 'Dividing by $\\sum x^2 = 14$ instead of its square root gives 0.021; dividing by $\\sqrt N$ gives 0.17.' },
    { id: 'edf-033', type: 'nat', level: 4, exams: ['gate', 'net'], sub: 'resolution',
      q: 'The mean of several readings has a statistical standard error of 0.12 mm. The instrument resolution is 0.5 mm (a uniform rounding distribution of that full width). The combined standard uncertainty is ______ mm (to three decimal places).',
      answer: 0.188, tol: 0.002, unit: 'mm', calc: () => Math.sqrt(0.12 ** 2 + 0.5 ** 2 / 12),
      sol: 'Resolution term $0.5/\\sqrt{12} = 0.144$ mm. Independent contributions add in quadrature: $\\sqrt{0.12^2 + 0.144^2} = \\sqrt{0.0352} = 0.188$ mm.',
      trap: 'Averaging does not reduce the resolution term below $\\Delta/\\sqrt{12}$ when every reading rounds to the same value.' },
    { id: 'edf-034', type: 'mcq', level: 4, exams: ['gate', 'net'], sub: 'chi-square',
      q: 'Near the minimum of $\\chi^2(a, b)$ for a two-parameter fit, the contour that encloses the joint 68.3% confidence region for $(a, b)$ together is',
      options: ['$\\chi^2_{\\min} + 1$', '$\\chi^2_{\\min} + 2.30$', '$\\chi^2_{\\min} + 4$', '$\\chi^2_{\\min} + 1.41$'], answer: 1,
      sol: '$\\Delta\\chi^2$ follows a chi-square distribution with as many degrees of freedom as parameters considered jointly. For one parameter, 68.3% is $\\Delta\\chi^2 = 1$; for two, the 68.3% point of $\\chi^2_2$ is $-2\\ln(1-0.683) = 2.30$.',
      trap: '$\\Delta\\chi^2 = 1$ gives the error on one parameter with the other free, not the joint region.' },
    { id: 'edf-035', type: 'msq', level: 4, exams: ['gate', 'net'], sub: 'chi-square',
      q: 'For the chi-square distribution with $\\nu$ degrees of freedom, which statements are true?',
      options: ['Its mean is $\\nu$', 'Its variance is $2\\nu$', 'For large $\\nu$ it is close to a Gaussian', 'For $\\nu = 100$, a good fit often gives $\\chi^2/\\nu$ anywhere between 0.5 and 1.5'], answer: [0, 1, 2],
      sol: 'Each squared standard normal has mean 1 and variance 2, so the sum of $\\nu$ has mean $\\nu$ and variance $2\\nu$, and tends to a Gaussian. The reduced value then has standard deviation $\\sqrt{2/\\nu} = 0.14$ for $\\nu = 100$, so 0.5 or 1.5 are more than three standard deviations away.',
      trap: 'The acceptable range of $\\chi^2/\\nu$ narrows as $\\nu$ grows.' },
    { id: 'edf-036', type: 'mcq', level: 4, exams: ['gate', 'net'], sub: 'linearising',
      q: 'The exponent of a power law is found from two points as $n = \\ln(y_2/y_1)/\\ln(x_2/x_1)$ with $x_2 = 2x_1$ (exact). Each $y$ has an independent relative error of 2%. The standard error of $n$ is about',
      options: ['0.020', '0.029', '0.058', '0.041'], answer: 3,
      sol: '$\\sigma_{\\ln y} = 0.02$ for each point, so $\\sigma_{\\ln(y_2/y_1)} = 0.02\\sqrt2 = 0.0283$. Divide by $\\ln 2 = 0.693$: $\\sigma_n = 0.041$.',
      trap: 'The short lever arm ($\\ln2$) amplifies the error; spread the $x$ values widely.' },

    // ---------- level 5 ----------
    { id: 'edf-037', type: 'nat', level: 5, exams: ['net'], sub: 'counting',
      q: 'A source plus background gives about 64 counts/s; background alone about 16 counts/s. With 30 minutes in total, the net rate is most precise if the source-plus-background run lasts ______ minutes.',
      answer: 20, tol: 0.2, unit: 'min', calc: () => 30 * 2 / 3,
      sol: 'Net rate $R = G/t_g - B/t_b$ with variance $R_g/t_g + R_b/t_b$. Minimising with $t_g + t_b = T$ gives $t_g/t_b = \\sqrt{R_g/R_b} = \\sqrt{64/16} = 2$. So $t_g = 20$ min and $t_b = 10$ min.',
      trap: 'Splitting the time equally is not optimal; the busier run deserves more time, but only as the square root of the rate ratio.' },
    { id: 'edf-038', type: 'mcq', level: 5, exams: ['gate', 'net'], sub: 'least squares',
      q: 'Ten points without quoted errors are fitted with a straight line; the sum of squared residuals is 0.48. The best estimate of the standard deviation of a single $y$ value is',
      options: ['0.219', '0.231', '0.060', '0.245'], answer: 3,
      sol: 'With two fitted parameters, $\\nu = 10 - 2 = 8$: $s^2 = 0.48/8 = 0.060$ and $s = 0.245$. (This assumes the line is the right model, so that $\\chi^2/\\nu = 1$.)',
      trap: 'Dividing by 10 (0.219) or 9 (0.231) ignores the two fitted parameters; 0.060 is the variance, not the standard deviation.' },
    { id: 'edf-039', type: 'nat', level: 5, exams: ['net'], sub: 'error propagation',
      q: 'An angle is $\\theta = 90^\\circ + \\delta$ with $\\delta$ Gaussian, mean 0 and standard deviation $2^\\circ$. First-order propagation predicts zero spread in $f = \\sin\\theta$. Keeping the second-order term, the standard deviation of $f$ is $k\\times10^{-4}$. The value of $k$ is ______ (to two decimal places).',
      answer: 8.62, tol: 0.05, calc: () => (2 * Math.PI / 180) ** 2 / Math.SQRT2 * 1e4,
      sol: '$\\sin(90^\\circ + \\delta) = \\cos\\delta \\approx 1 - \\delta^2/2$. For Gaussian $\\delta$, $\\text{var}(\\delta^2) = \\langle\\delta^4\\rangle - \\langle\\delta^2\\rangle^2 = 3\\sigma^4 - \\sigma^4 = 2\\sigma^4$, so $\\text{sd}(f) = \\tfrac12\\sqrt2\\,\\sigma^2 = \\sigma^2/\\sqrt2$. With $\\sigma = 0.034907$ rad: $\\sigma^2 = 1.2185\\times10^{-3}$, divided by $\\sqrt2$: $8.62\\times10^{-4}$. (The mean also shifts, to $1 - \\sigma^2/2$.)',
      trap: 'Linear propagation fails at a stationary point of the function; go to second order.' },
    { id: 'edf-040', type: 'mcq', level: 5, exams: ['gate', 'net'], sub: 'error propagation',
      q: 'A quantity $x$ has mean $\\mu$ and standard deviation $\\sigma$ (not small). Which statement about the average of $f(x)$ over many measurements is correct?',
      options: ['$\\langle x^2\\rangle = \\mu^2$ exactly', '$\\langle\\ln x\\rangle$ is approximately $\\ln\\mu + \\sigma^2/(2\\mu^2)$', '$\\langle x^2\\rangle = \\mu^2 + \\sigma^2$, so squaring before averaging gives a larger result', '$\\langle 1/x\\rangle = 1/\\mu$ to second order in $\\sigma$'], answer: 2,
      sol: '$\\langle x^2\\rangle = \\langle x\\rangle^2 + \\text{var}(x) = \\mu^2 + \\sigma^2$ exactly. In general $\\langle f\\rangle \\approx f(\\mu) + \\tfrac12f\'\'(\\mu)\\sigma^2$: $\\ln$ is concave so $\\langle\\ln x\\rangle \\approx \\ln\\mu - \\sigma^2/2\\mu^2$, and $1/x$ is convex so $\\langle1/x\\rangle \\approx (1/\\mu)(1 + \\sigma^2/\\mu^2)$.',
      trap: 'Averaging a non-linear function is not the same as applying it to the average.' },
    ...more2,
  ],
  gens: [
    { id: 'edf-g01', type: 'nat', level: 2, exams: ['gate', 'net', 'jam'], sub: 'error propagation',
      make(r) {
        const a = int(r, 1, 3), b = int(r, 1, 2), c = choose(r, [0.5, 1, 2, 3]);
        const px = pick(r, 0.2, 2, 0.1), py = pick(r, 0.2, 3, 0.1), pz = pick(r, 0.5, 4, 0.5);
        const rel = Math.sqrt((a * px) ** 2 + (b * py) ** 2 + (c * pz) ** 2);
        const pw = (v, n) => (n === 1 ? v : `${v}^{${n}}`);
        const den = c === 0.5 ? '\\sqrt{z}' : pw('z', c);
        return { q: `A result is $f = \\dfrac{${pw('x', a)}\\,${pw('y', b)}}{${den}}$, with independent relative uncertainties ${px}% in $x$, ${py}% in $y$ and ${pz}% in $z$. The relative uncertainty of $f$ is ______ % (to two decimal places).`,
          answer: round(rel, 2), tol: 0.02, unit: '%', a, b, c, px, py, pz,
          sol: `For a product of powers, $\\dfrac{\\sigma_f}{f} = \\sqrt{(${a}\\times${px})^2 + (${b}\\times${py})^2 + (${c}\\times${pz})^2}\\,\\% = \\sqrt{${round((a * px) ** 2 + (b * py) ** 2 + (c * pz) ** 2, 4)}}\\,\\% = ${round(rel, 3)}\\%$. Division contributes exactly like multiplication.`,
          trap: 'Each relative error is multiplied by the magnitude of its power; a square root halves it.' };
      },
      verify: (p) => Math.sqrt((p.a * p.px) ** 2 + (p.b * p.py) ** 2 + (p.c * p.pz) ** 2) },
    { id: 'edf-g02', type: 'nat', level: 3, exams: ['gate', 'net'], sub: 'least squares',
      make(r) {
        const x0 = int(r, 0, 3), dx = choose(r, [1, 2, 0.5]), a0 = int(r, -5, 8), b0 = choose(r, [0.5, 1.2, 1.5, 2, 2.5, 3, -1, -1.5]);
        const x = [0, 1, 2, 3, 4].map((i) => x0 + i * dx);
        const y = x.map((v) => round(a0 + b0 * v + int(r, -3, 3) * 0.1, 2));
        const mode = choose(r, ['slope', 'intercept']);
        const f = fitLine(x, y), ans = mode === 'slope' ? f.b : f.a;
        return { q: `A least-squares line $y = a + bx$ is fitted to the points ${x.map((v, i) => `$(${v}, ${y[i]})$`).join(', ')}. The ${mode} ${mode === 'slope' ? '$b$' : '$a$'} is ______ (to three decimal places).`,
          answer: round(ans, 3), tol: 0.005, x, y, mode,
          sol: `$N = 5$, $\\sum x = ${f.Sx}$, $\\sum y = ${round(f.Sy, 3)}$, $\\sum xy = ${round(f.Sxy, 3)}$, $\\sum x^2 = ${round(f.Sxx, 3)}$, $\\Delta = N\\sum x^2 - (\\sum x)^2 = ${round(f.D, 3)}$. $b = (N\\sum xy - \\sum x\\sum y)/\\Delta = ${round(f.b, 4)}$; $a = \\bar y - b\\bar x = ${round(f.Sy / 5, 4)} - (${round(f.b, 4)})(${round(f.Sx / 5, 4)}) = ${round(f.a, 4)}$.`,
          trap: 'Find the slope first; the intercept follows because the line passes through $(\\bar x, \\bar y)$.' };
      },
      verify: (p) => { const xm = sum(p.x) / 5, ym = sum(p.y) / 5; const b = sum(p.x.map((v, i) => (v - xm) * (p.y[i] - ym))) / sum(p.x.map((v) => (v - xm) ** 2)); return p.mode === 'slope' ? b : ym - b * xm; } },
    { id: 'edf-g03', type: 'nat', level: 3, exams: ['gate', 'net'], sub: 'least squares',
      make(r) {
        const k0 = pick(r, 5, 60, 0.5), sig = choose(r, [0.1, 0.2, 0.05]);
        const m = [0.1, 0.2, 0.3, 0.4];
        const ext = m.map((v) => round((v * 9.8) / k0 * 100 + int(r, -2, 2) * 0.02, 2));   // cm
        const mode = choose(r, ['k', 'err']);
        const F = m.map((v) => round(v * 9.8, 3));
        const Sxx = sum(ext.map((e) => e * e)), Sxy = sum(ext.map((e, i) => e * F[i]));
        const slope = Sxy / Sxx, err = sig / Math.sqrt(Sxx);     // N per cm
        const ans = mode === 'k' ? slope : err;
        return { q: `A spring is loaded with forces ${F.join(', ')} N and stretches by ${ext.join(', ')} cm. Fitting $F = kx$ (a line through the origin, equal errors of ${sig} N in each force, extensions exact), ${mode === 'k' ? 'the spring constant is ______ N/cm (to three significant figures)' : 'the standard error of $k$ is ______ N/cm (to three significant figures)'}.`,
          answer: +ans.toPrecision(3), tol: +(Math.abs(ans) * 0.006).toPrecision(2), unit: 'N/cm', F, ext, sig, mode,
          sol: `Minimising $\\sum(F_i - kx_i)^2$ gives $k = \\sum xF/\\sum x^2 = ${round(Sxy, 4)}/${round(Sxx, 4)} = ${+slope.toPrecision(4)}$ N/cm, and since $k$ is linear in the $F_i$, $\\sigma_k = \\sigma_F/\\sqrt{\\sum x^2} = ${sig}/\\sqrt{${round(Sxx, 4)}} = ${+err.toPrecision(4)}$ N/cm.`,
          trap: 'A fit forced through the origin is not the same as the ordinary slope formula.' };
      },
      verify: (p) => { const Sxx = sum(p.ext.map((e) => e * e)); return p.mode === 'k' ? sum(p.ext.map((e, i) => e * p.F[i])) / Sxx : p.sig / Math.sqrt(Sxx); } },
    { id: 'edf-g04', type: 'nat', level: 3, exams: ['gate', 'net'], sub: 'weighted mean',
      make(r) {
        const base = pick(r, 1, 20, 0.1);
        const v = [0, 1, 2].map(() => round(base + int(r, -6, 6) * 0.05, 2)), s = [0, 1, 2].map(() => choose(r, [0.05, 0.1, 0.15, 0.2, 0.3]));
        const w = s.map((x) => 1 / x ** 2), W = sum(w), mean = sum(v.map((x, i) => x * w[i])) / W, err = 1 / Math.sqrt(W);
        const mode = choose(r, ['mean', 'err']);
        const ans = mode === 'mean' ? mean : err;
        return { q: `Three independent measurements of the same quantity give ${v.map((x, i) => `$${x} \\pm ${s[i]}$`).join(', ')}. ${mode === 'mean' ? 'Their weighted mean is ______ (to three decimal places).' : 'The standard error of their weighted mean is ______ (to three decimal places).'}`,
          answer: round(ans, 3), tol: mode === 'mean' ? 0.002 : 0.001, v, s, mode,
          sol: `Weights $w_i = 1/\\sigma_i^2$: ${w.map((x) => round(x, 2)).join(', ')} (sum ${round(W, 2)}). Weighted mean $= \\sum w_ix_i/\\sum w_i = ${round(mean, 4)}$; its error $= (\\sum w_i)^{-1/2} = ${round(err, 4)}$.`,
          trap: 'Weights go as one over the square of the error, not one over the error.' };
      },
      verify: (p) => { const w = p.s.map((x) => 1 / x ** 2), W = sum(w); return p.mode === 'mean' ? sum(p.v.map((x, i) => x * w[i])) / W : 1 / Math.sqrt(W); } },
    { id: 'edf-g05', type: 'mcq', level: 3, exams: ['gate', 'net'], sub: 'chi-square',
      make(r) {
        const N = int(r, 8, 40), p = choose(r, [1, 2, 3]), nu = N - p;
        const red = choose(r, [0.15, 0.25, 0.95, 1.05, 1.1, 3.5, 5, 8]);
        const chi = round(red * nu, 1);
        const kind = red < 0.4 ? 0 : red < 2 ? 1 : 2;
        const S = ['The stated errors are probably too large, or the points are not independent', 'The fit is acceptable and the errors are consistent with the scatter', 'The model is poor or the stated errors are too small', 'The fit cannot be judged without knowing the slope'];
        const o = mcqOptions(r, S[kind], S.filter((_, i) => i !== kind));
        return { q: `A ${p}-parameter model is fitted to ${N} data points with quoted errors, giving $\\chi^2 = ${chi}$. Which conclusion is most reasonable?`, options: o.options, answer: o.answer,
          sol: `$\\nu = ${N} - ${p} = ${nu}$, so $\\chi^2/\\nu = ${round(chi / nu, 2)}$. A good fit with correct errors gives $\\chi^2/\\nu \\approx 1 \\pm \\sqrt{2/\\nu} = 1 \\pm ${round(Math.sqrt(2 / nu), 2)}$. ${['Far below 1: the scatter is smaller than the errors claim.', 'Within the expected range.', 'Far above 1: the points scatter more than the errors allow.'][kind]}`,
          trap: 'Divide by the degrees of freedom $N - p$, and remember that too small a $\\chi^2$ is also a warning.' };
      } },
    { id: 'edf-g06', type: 'nat', level: 3, exams: ['gate', 'net'], sub: 'Gaussian confidence',
      make(r) {
        const mode = choose(r, ['outside', 'between', 'above']);
        const mu = pick(r, 10, 100, 0.5), s = pick(r, 0.5, 5, 0.1), k1 = pick(r, 0.5, 3, 0.1), k2 = pick(r, 0.2, 2.5, 0.1);
        let ans, q, sol;
        if (mode === 'outside') { ans = (1 - erf(k1 / Math.SQRT2)) * 100; q = `deviate from the mean by more than ${round(k1 * s, 3)} in either direction`; sol = `$${round(k1 * s, 3)}/${s} = ${k1}\\sigma$. $P(|z| > ${k1}) = 1 - \\operatorname{erf}(${k1}/\\sqrt2) = ${round(ans, 3)}\\%$.`; }
        else if (mode === 'between') { ans = 50 * (erf(k1 / Math.SQRT2) + erf(k2 / Math.SQRT2)); q = `lie between ${round(mu - k2 * s, 3)} and ${round(mu + k1 * s, 3)}`; sol = `In units of $\\sigma$ the interval is $-${k2}$ to $+${k1}$. $P = \\tfrac12[\\operatorname{erf}(${k1}/\\sqrt2) + \\operatorname{erf}(${k2}/\\sqrt2)] = ${round(ans, 3)}\\%$.`; }
        else { ans = 50 * (1 - erf(k1 / Math.SQRT2)); q = `exceed ${round(mu + k1 * s, 3)}`; sol = `$z = ${k1}$. One tail: $\\tfrac12[1 - \\operatorname{erf}(${k1}/\\sqrt2)] = ${round(ans, 3)}\\%$.`; }
        return { q: `Readings are Gaussian with mean ${mu} and standard deviation ${s}. The percentage of readings expected to ${q} is ______ % (to three significant figures).`,
          answer: +ans.toPrecision(3), tol: +Math.max(0.002, ans * 0.006).toPrecision(2), unit: '%', mode, k1, k2, sol, trap: 'Decide first whether the question is one-tailed or two-tailed.' };
      },
      verify: (p) => (p.mode === 'outside' ? (1 - erfS(p.k1 / Math.SQRT2)) * 100 : p.mode === 'between' ? 50 * (erfS(p.k1 / Math.SQRT2) + erfS(p.k2 / Math.SQRT2)) : 50 * (1 - erfS(p.k1 / Math.SQRT2))) },
    { id: 'edf-g07', type: 'mcq', level: 2, exams: ['gate', 'net', 'jam'], sub: 'linearising',
      make(r) {
        const L = [
          ['$A = A_0e^{-\\lambda t}$ (activity of a source)', '$\\ln A$ against $t$, slope $-\\lambda$'],
          ['$F = kr^{n}$ (a force law with unknown $n$)', '$\\ln F$ against $\\ln r$, slope $n$'],
          ['$T = 2\\pi\\sqrt{L/g}$ (a simple pendulum)', '$T^2$ against $L$, slope $4\\pi^2/g$'],
          ['$\\rho = \\rho_0e^{E_g/2k_BT}$ (an intrinsic semiconductor)', '$\\ln\\rho$ against $1/T$, slope $E_g/2k_B$'],
          ['$1/v + 1/u = 1/f$ (a thin lens, real-is-positive)', '$1/v$ against $1/u$, slope $-1$'],
          ['$R = R_0(1 + \\alpha\\theta)$ (a metal resistor)', '$R$ against $\\theta$, slope $R_0\\alpha$'],
          ['$I = I_0\\cos^2\\theta$ (Malus\'s law)', '$I$ against $\\cos^2\\theta$, slope $I_0$'],
          ['$v = \\sqrt{T/\\mu}$ (waves on a string of tension $T$)', '$v^2$ against $T$, slope $1/\\mu$'],
          ['$p = p_0e^{-Mgh/RT}$ (an isothermal atmosphere)', '$\\ln p$ against $h$, slope $-Mg/RT$'],
          ['$\\lambda_{\\max}T = b$ (Wien\'s law)', '$\\lambda_{\\max}$ against $1/T$, slope $b$'],
        ];
        const i = int(r, 0, L.length - 1);
        const wrong = [0, 1, 2, 3, 4, 5, 6, 7, 8, 9].filter((j) => j !== i).map((j) => L[j][1]);
        const w3 = [wrong[int(r, 0, 2)], wrong[int(r, 3, 5)], wrong[int(r, 6, 8)]];
        const o = mcqOptions(r, L[i][1], w3);
        return { q: `To test the relation ${L[i][0]} with a straight-line fit, which plot should be used?`, options: o.options, answer: o.answer,
          sol: `Rearranging gives ${L[i][1]}: the measured quantities appear linearly, and the slope carries the constant to be found.`,
          trap: 'Exponentials need a log on one axis; power laws need logs on both.' };
      } },
    { id: 'edf-g08', type: 'nat', level: 2, exams: ['gate', 'net', 'jam'], sub: 'standard error',
      make(r) {
        const s = pick(r, 0.2, 5, 0.1), t = pick(r, 0.02, 0.6, 0.01);
        const x = (s / t) ** 2, N = Math.max(1, Math.ceil(x - 1e-9));
        return { q: `Single readings of a quantity scatter with standard deviation ${s}. What is the smallest number of readings whose mean has a standard error of at most ${t}? ______`,
          answer: N, tol: 0, s, t,
          sol: `$\\sigma/\\sqrt N \\le ${t}$ means $N \\ge (${s}/${t})^2 = ${round(x, 3)}$, so $N = ${N}$.`,
          trap: 'Halving the error needs four times as many readings.' };
      },
      verify: (p) => Math.max(1, Math.ceil((p.s / p.t) ** 2 - 1e-9)) },
    { id: 'edf-g09', type: 'nat', level: 3, exams: ['gate', 'net'], sub: 'resolution',
      make(r) {
        const n = int(r, 4, 25), s = pick(r, 0.05, 1, 0.01), d = choose(r, [0.01, 0.02, 0.05, 0.1, 0.2, 0.5, 1]);
        const tot = Math.sqrt(s * s / n + d * d / 12);
        return { q: `${n} readings have a sample standard deviation of ${s} mm. The instrument reads in steps of ${d} mm (treat rounding as uniform over one step). The combined standard uncertainty of the mean is ______ mm (to three significant figures).`,
          answer: +tot.toPrecision(3), tol: +(tot * 0.006).toPrecision(2), unit: 'mm', n, s, d,
          sol: `Statistical: $${s}/\\sqrt{${n}} = ${round(s / Math.sqrt(n), 4)}$ mm. Resolution: $${d}/\\sqrt{12} = ${round(d / Math.sqrt(12), 4)}$ mm. In quadrature: $${+tot.toPrecision(4)}$ mm.`,
          trap: 'Use the standard error of the mean, not the standard deviation, for the statistical part.' };
      },
      verify: (p) => Math.sqrt(p.s ** 2 / p.n + p.d ** 2 / 12) },
    { id: 'edf-g10', type: 'nat', level: 3, exams: ['gate', 'net'], sub: 'error propagation',
      make(r) {
        const L = pick(r, 0.3, 2, 0.01), dL = choose(r, [0.001, 0.002, 0.005]), n = choose(r, [10, 20, 25, 50]), dt = choose(r, [0.1, 0.2, 0.3]);
        const T = 2 * Math.PI * Math.sqrt(L / 9.81), t = round(n * T, 1);
        const Tm = t / n, g = 4 * Math.PI ** 2 * L / Tm ** 2, rel = Math.sqrt((dL / L) ** 2 + (2 * dt / t) ** 2), dg = g * rel;
        return { q: `A pendulum of length $${L} \\pm ${dL}$ m makes ${n} oscillations in $${t} \\pm ${dt}$ s. Using $g = 4\\pi^2L/T^2$, the standard uncertainty of $g$ is ______ m s$^{-2}$ (to two significant figures).`,
          answer: +dg.toPrecision(2), tol: +(dg * 0.05).toPrecision(2), unit: 'm s⁻²', L, dL, n, t, dt,
          sol: `$T = ${t}/${n} = ${round(Tm, 4)}$ s, $g = ${round(g, 3)}$ m s$^{-2}$. $\\sigma_g/g = \\sqrt{(${dL}/${L})^2 + (2\\times${dt}/${t})^2} = ${+rel.toPrecision(3)}$, so $\\sigma_g = ${+dg.toPrecision(3)}$ m s$^{-2}$.`,
          trap: 'The timing error is shared over all the oscillations, and the period counts twice.' };
      },
      verify: (p) => { const Tm = p.t / p.n, g = 4 * Math.PI ** 2 * p.L / Tm ** 2; return g * Math.sqrt((p.dL / p.L) ** 2 + (2 * p.dt / p.t) ** 2); } },
    { id: 'edf-g11', type: 'nat', level: 4, exams: ['gate', 'net'], sub: 'correlation',
      make(r) {
        const b = choose(r, [1, 2, -1, 0.5, -2]);
        const x = [1, 2, 3, 4, 5], y = x.map((v) => round(b * v + int(r, -3, 3) * 0.5, 1));
        const xm = 3, ym = sum(y) / 5;
        const sxy = sum(x.map((v, i) => (v - xm) * (y[i] - ym))), syy = sum(y.map((v) => (v - ym) ** 2));
        const rr = syy === 0 ? 0 : sxy / Math.sqrt(10 * syy);
        return { q: `The linear correlation coefficient $r$ of the points ${x.map((v, i) => `$(${v}, ${y[i]})$`).join(', ')} is ______ (to three decimal places).`,
          answer: round(rr, 3), tol: 0.003, y,
          sol: `$\\bar x = 3$, $\\bar y = ${round(ym, 3)}$. $\\sum\\delta x\\delta y = ${round(sxy, 3)}$, $\\sum\\delta x^2 = 10$, $\\sum\\delta y^2 = ${round(syy, 3)}$. $r = ${round(sxy, 3)}/\\sqrt{10\\times${round(syy, 3)}} = ${round(rr, 4)}$.`,
          trap: '$r$ measures how well a straight line fits, not how steep it is.' };
      },
      verify: (p) => { const ym = sum(p.y) / 5, x = [1, 2, 3, 4, 5]; const a = sum(x.map((v, i) => (v - 3) * (p.y[i] - ym))), c = sum(p.y.map((v) => (v - ym) ** 2)); return c === 0 ? 0 : a / Math.sqrt(10 * c); } },
    { id: 'edf-g12', type: 'nat', level: 3, exams: ['gate', 'net'], sub: 'error propagation',
      make(r) {
        const mode = choose(r, ['ln', 'exp', 'sin', 'inv2']);
        let q, ans, sol, x, s, k;
        if (mode === 'ln') { x = pick(r, 2, 50, 0.5); s = pick(r, 0.05, 1, 0.05); ans = s / x; q = `$f = \\ln x$ with $x = ${x} \\pm ${s}$`; sol = `$\\sigma_f = |df/dx|\\sigma_x = \\sigma_x/x = ${s}/${x} = ${+ans.toPrecision(4)}$.`; }
        else if (mode === 'exp') { k = pick(r, 0.1, 2, 0.1); x = pick(r, 0.5, 4, 0.1); s = pick(r, 0.01, 0.2, 0.01); ans = k * Math.exp(k * x) * s; q = `$f = e^{${k}x}$ with $x = ${x} \\pm ${s}$`; sol = `$\\sigma_f = ${k}e^{${k}\\times${x}}\\sigma_x = ${k}\\times${round(Math.exp(k * x), 4)}\\times${s} = ${+ans.toPrecision(4)}$.`; }
        else if (mode === 'sin') { x = int(r, 10, 80); s = pick(r, 0.5, 3, 0.5); ans = Math.cos(x * Math.PI / 180) * s * Math.PI / 180; q = `$f = \\sin\\theta$ with $\\theta = ${x}^\\circ \\pm ${s}^\\circ$`; sol = `Convert the error to radians: $${s}^\\circ = ${round(s * Math.PI / 180, 5)}$ rad. $\\sigma_f = |\\cos\\theta|\\sigma_\\theta = ${round(Math.cos(x * Math.PI / 180), 4)}\\times${round(s * Math.PI / 180, 5)} = ${+ans.toPrecision(4)}$.`; }
        else { x = pick(r, 1, 10, 0.5); s = pick(r, 0.01, 0.2, 0.01); ans = 2 * s / x ** 3; q = `$f = 1/x^2$ with $x = ${x} \\pm ${s}$`; sol = `$\\sigma_f = |{-2}/x^3|\\sigma_x = 2\\times${s}/${x}^3 = ${+ans.toPrecision(4)}$.`; }
        return { q: `For ${q}, the standard uncertainty of $f$ is ______ (to three significant figures).`,
          answer: +ans.toPrecision(3), tol: +(ans * 0.006).toPrecision(2), mode, x, s, k, sol,
          trap: 'Angles must be in radians when you differentiate trigonometric functions.' };
      },
      verify: (p) => (p.mode === 'ln' ? p.s / p.x : p.mode === 'exp' ? p.k * Math.exp(p.k * p.x) * p.s : p.mode === 'sin' ? Math.cos(p.x * Math.PI / 180) * p.s * Math.PI / 180 : 2 * p.s / p.x ** 3) },
    ...more,
  ],
};
