// Fourier and Laplace transforms: definitions and conventions, standard pairs, shift, scaling and derivative rules,
// convolution, Parseval, width-bandwidth reciprocity, Laplace solution of ODEs and integral equations, initial and
// final value theorems, Bromwich inversion, causality (GATE level). Fourier series: JAM topic `fourier-series`.
// Every Fourier question states its convention. Original questions for GATE and CSIR NET practice (fibub).
// Levels: 1 warm-up ... 5 top rank.
import { int, choose, round } from '../_util.js';
import more from './fourier-laplace-transforms.more.gen.js';
import more2 from './fourier-laplace-transforms.more2.gen.js';
import r4 from './fourier-laplace-transforms.r4.gen.js';
import r5 from './fourier-laplace-transforms.r5.gen.js';

const fact = (n) => (n <= 1 ? 1 : n * fact(n - 1));
const FT = 'Use $\\tilde f(k) = \\int_{-\\infty}^{\\infty}f(x)e^{-ikx}dx$.';

import { tidyPhys } from './_signs.js';

const topicBank = {
  topic: 'fourier-laplace-transforms',
  items: [
    // ---------- level 1 ----------
    { id: 'flt-001', type: 'mcq', level: 1, exams: ['jam', 'gate', 'net'], sub: 'Laplace pairs',
      q: 'The Laplace transform of $e^{at}$ (for $s > a$) is',
      options: ['$\\dfrac{1}{s - a}$', '$\\dfrac{1}{s + a}$', '$\\dfrac{a}{s^2 + a^2}$', '$\\dfrac{s}{s - a}$'], answer: 0,
      sol: '$\\int_0^\\infty e^{at}e^{-st}dt = \\int_0^\\infty e^{-(s - a)t}dt = \\frac{1}{s - a}$, which converges only when $s > a$.',
      trap: 'The sign: $e^{-at}$ gives $1/(s + a)$.' },
    { id: 'flt-002', type: 'nat', level: 1, exams: ['jam', 'gate', 'net'], sub: 'Laplace pairs',
      q: 'If $F(s)$ is the Laplace transform of $t^2$, the value of $F(2)$ is ______.',
      answer: 0.25, tol: 0.001, calc: () => 2 / 2 ** 3,
      sol: '$\\mathcal L\\{t^n\\} = \\frac{n!}{s^{n+1}}$, so $\\mathcal L\\{t^2\\} = \\frac{2}{s^3}$ and $F(2) = \\frac28 = 0.25$.',
      trap: 'Forgetting the factorial gives $1/8$.' },
    { id: 'flt-003', type: 'mcq', level: 1, exams: ['jam', 'gate', 'net'], sub: 'Laplace pairs',
      q: 'The Laplace transform of $\\sin\\omega t$ is',
      options: ['$\\dfrac{s}{s^2 + \\omega^2}$', '$\\dfrac{\\omega}{s^2 + \\omega^2}$', '$\\dfrac{\\omega}{s^2 - \\omega^2}$', '$\\dfrac{1}{s^2 + \\omega^2}$'], answer: 1,
      sol: '$\\sin\\omega t = \\text{Im}\\,e^{i\\omega t}$ and $\\mathcal L\\{e^{i\\omega t}\\} = \\frac{1}{s - i\\omega} = \\frac{s + i\\omega}{s^2 + \\omega^2}$. Imaginary part: $\\frac{\\omega}{s^2 + \\omega^2}$. (The real part, $\\frac{s}{s^2 + \\omega^2}$, is for $\\cos\\omega t$.)',
      trap: 'Mixing up sine and cosine: sine has $\\omega$ on top, so $F(s) \\to 0$ like $\\omega/s^2$, matching $\\sin \\approx \\omega t$ near $t = 0$.' },
    { id: 'flt-004', type: 'mcq', level: 1, exams: ['gate', 'net'], sub: 'Fourier pairs',
      q: 'With $\\tilde f(k) = \\int_{-\\infty}^{\\infty}f(x)e^{-ikx}dx$, the Fourier transform of $\\delta(x - a)$ is',
      options: ['$1$', '$e^{ika}$', '$e^{-ika}$', '$\\delta(k - a)$'], answer: 2,
      sol: 'The delta function picks out the integrand at $x = a$: $\\int\\delta(x - a)e^{-ikx}dx = e^{-ika}$. A spike in $x$ contains every $k$ with equal strength; only the phase depends on where the spike is.',
      trap: 'The sign of the exponent follows the convention; with $e^{+ikx}$ in the definition you would get $e^{ika}$.' },
    { id: 'flt-005', type: 'mcq', level: 1, exams: ['jam', 'gate', 'net'], sub: 'Fourier pairs',
      q: 'The Fourier transform of a Gaussian $e^{-x^2/(2\\sigma^2)}$ is',
      options: ['a Lorentzian', 'a sinc function', 'a decaying exponential', 'a Gaussian'], answer: 3,
      sol: 'Completing the square in the exponent gives $\\tilde f(k) = \\sqrt{2\\pi}\\,\\sigma\\,e^{-\\sigma^2k^2/2}$ (with $\\tilde f = \\int fe^{-ikx}dx$): again a Gaussian, of width $1/\\sigma$.',
      trap: 'The Lorentzian is the transform of $e^{-a|x|}$; the sinc is the transform of a rectangle.' },
    { id: 'flt-006', type: 'nat', level: 1, exams: ['jam', 'gate', 'net'], sub: 'Laplace rules',
      q: 'The Laplace transform of $te^{-2t}$, evaluated at $s = 1$, is ______ (to three decimal places).',
      answer: 0.111, tol: 0.002, calc: () => 1 / 9,
      sol: 'Shift rule: $\\mathcal L\\{e^{-2t}f(t)\\} = F(s + 2)$. With $F = \\mathcal L\\{t\\} = 1/s^2$: $\\frac{1}{(s + 2)^2}$. At $s = 1$: $\\frac19 \\approx 0.111$.',
      trap: 'The exponential shifts $s$ to $s + 2$ (not $s - 2$) for a decaying factor.' },

    // ---------- level 2 ----------
    { id: 'flt-007', type: 'nat', level: 2, exams: ['gate', 'net'], sub: 'Fourier pairs',
      q: `The rectangular pulse $f(x) = 1$ for $|x| < 2$ and $0$ otherwise is transformed. ${FT} The smallest positive $k$ at which $\\tilde f(k) = 0$ is ______ (to two decimal places).`,
      answer: 1.57, tol: 0.01, calc: () => Math.PI / 2,
      sol: '$\\tilde f(k) = \\int_{-2}^{2}e^{-ikx}dx = \\frac{2\\sin2k}{k}$. It first vanishes where $2k = \\pi$: $k = \\pi/2 \\approx 1.57$. A wider pulse has its first zero nearer the origin: narrower spectrum.',
      trap: 'Using the full width 4 instead of the half-width 2 gives $\\pi/4$.' },
    { id: 'flt-008', type: 'mcq', level: 2, exams: ['gate', 'net'], sub: 'Fourier rules',
      q: 'With $\\tilde f(k) = \\int f(x)e^{-ikx}dx$, the transform of the shifted function $f(x - a)$ is',
      options: ['$e^{ika}\\tilde f(k)$', '$e^{-ika}\\tilde f(k)$', '$\\tilde f(k - a)$', '$\\tilde f(k)$'], answer: 1,
      sol: 'Substitute $u = x - a$: $\\int f(u)e^{-ik(u + a)}du = e^{-ika}\\tilde f(k)$. Shifting in $x$ only changes the phase; $|\\tilde f|$ is unchanged.',
      trap: '$\\tilde f(k - a)$ is the transform of $e^{iax}f(x)$: a shift in $k$, not in $x$.' },
    { id: 'flt-009', type: 'msq', level: 2, exams: ['jam', 'gate', 'net'], sub: 'Laplace rules',
      q: 'With $F = \\mathcal L\\{f\\}$, $G = \\mathcal L\\{g\\}$ and $u$ the unit step, which rules are correct?',
      options: ['$\\mathcal L\\{t\\,f(t)\\} = -F\'(s)$', '$\\mathcal L\\{f(t)g(t)\\} = F(s)G(s)$', '$\\mathcal L\\{e^{at}f(t)\\} = F(s - a)$', '$\\mathcal L\\{f(t - a)u(t - a)\\} = e^{-as}F(s)$ for $a > 0$'], answer: [0, 2, 3],
      sol: 'Differentiating $\\int fe^{-st}dt$ with respect to $s$ brings down $-t$. Multiplying by $e^{at}$ replaces $s$ by $s - a$. Delaying by $a$ multiplies by $e^{-as}$. A product of transforms corresponds to the convolution $\\int_0^t f(\\tau)g(t - \\tau)d\\tau$, not to the product $fg$.',
      trap: 'Products in one domain are convolutions in the other.' },
    { id: 'flt-010', type: 'nat', level: 2, exams: ['jam', 'gate', 'net'], sub: 'inverse Laplace',
      q: 'If $\\mathcal L\\{f\\} = \\dfrac{1}{s(s + 1)}$, the value of $f(2)$ is ______ (to three decimal places).',
      answer: 0.865, tol: 0.003, calc: () => 1 - Math.exp(-2),
      sol: 'Partial fractions: $\\frac{1}{s(s + 1)} = \\frac1s - \\frac{1}{s + 1}$, so $f = 1 - e^{-t}$ and $f(2) = 1 - e^{-2} \\approx 0.865$. (It is the step response of a first-order system.)',
      trap: 'Getting the sign of the second fraction wrong gives $1 + e^{-t}$, which does not start at 0.' },
    { id: 'flt-011', type: 'mcq', level: 2, exams: ['gate', 'net'], sub: 'Fourier pairs',
      q: 'With $\\tilde f(k) = \\int f(x)e^{-ikx}dx$, the transform of $e^{-a|x|}$ ($a > 0$) is',
      options: ['$\\dfrac{1}{a + ik}$', '$\\dfrac{a}{a^2 + k^2}$', '$\\dfrac{2a}{a^2 + k^2}$', '$\\dfrac{2}{a^2 + k^2}$'], answer: 2,
      sol: 'Split at 0: $\\int_0^\\infty e^{-(a + ik)x}dx + \\int_{-\\infty}^0 e^{(a - ik)x}dx = \\frac{1}{a + ik} + \\frac{1}{a - ik} = \\frac{2a}{a^2 + k^2}$, a Lorentzian. Check: $\\tilde f(0) = \\int e^{-a|x|}dx = 2/a$ ✓.',
      trap: '$\\frac{1}{a + ik}$ is only the $x > 0$ half (the transform of $e^{-ax}u(x)$).' },
    { id: 'flt-012', type: 'nat', level: 2, exams: ['jam', 'gate', 'net'], sub: 'Laplace pairs',
      q: 'The Laplace transform of $\\cosh2t$, evaluated at $s = 3$, is ______ (to two decimal places).',
      answer: 0.6, tol: 0.01, calc: () => 3 / (9 - 4),
      sol: '$\\cosh2t = \\tfrac12(e^{2t} + e^{-2t})$, so $\\mathcal L = \\tfrac12\\left(\\frac{1}{s - 2} + \\frac{1}{s + 2}\\right) = \\frac{s}{s^2 - 4}$. At $s = 3$: $\\frac35 = 0.6$.',
      trap: 'Using $s^2 + 4$ (the cosine formula) gives $3/13$.' },
    { id: 'flt-013', type: 'mcq', level: 2, exams: ['jam', 'gate', 'net'], sub: 'Laplace and ODEs',
      q: 'For $y\' + 2y = 0$ with $y(0) = 3$, the Laplace transform $Y(s)$ is',
      options: ['$\\dfrac{3}{s - 2}$', '$\\dfrac{3s}{s + 2}$', '$\\dfrac{1}{s + 2}$', '$\\dfrac{3}{s + 2}$'], answer: 3,
      sol: '$\\mathcal L\\{y\'\\} = sY - y(0)$, so $sY - 3 + 2Y = 0$ and $Y = \\frac{3}{s + 2}$, i.e. $y = 3e^{-2t}$.',
      trap: 'Dropping the initial value $y(0)$ from $\\mathcal L\\{y\'\\}$ loses the 3.' },
    { id: 'flt-014', type: 'mcq', level: 2, exams: ['gate', 'net'], sub: 'Fourier rules',
      q: 'With $\\tilde f(k) = \\int f(x)e^{-ikx}dx$ and $f \\to 0$ at $\\pm\\infty$, the transform of $f\'(x)$ is',
      options: ['$ik\\tilde f(k)$', '$-ik\\tilde f(k)$', '$\\tilde f\'(k)$', '$k\\tilde f(k)$'], answer: 0,
      sol: 'Integrate by parts: $\\int f\'e^{-ikx}dx = [fe^{-ikx}] + ik\\int fe^{-ikx}dx = ik\\tilde f(k)$. Derivatives become multiplication by $ik$, which is why the Fourier transform turns linear ODEs with constant coefficients into algebra (and why $\\hat p = -i\\hbar\\,d/dx$ is $\\hbar k$ in momentum space).',
      trap: 'The sign follows the convention: with $e^{+ikx}$ it would be $-ik$.' },
    { id: 'flt-015', type: 'msq', level: 2, exams: ['gate', 'net'], sub: 'Fourier rules',
      q: 'With $\\tilde f(k) = \\int f(x)e^{-ikx}dx$, which statements are true?',
      options: ['For every complex $f$, $|\\tilde f(k)|$ is an even function of $k$', 'If $f$ is real and even, $\\tilde f$ is real and even', 'If $f$ is real and odd, $\\tilde f$ is purely imaginary and odd', 'If $f$ is real, $\\tilde f(-k) = \\tilde f(k)^*$'], answer: [1, 2, 3],
      sol: 'For real $f$, conjugating $\\int fe^{-ikx}dx$ gives $\\int fe^{ikx}dx = \\tilde f(-k)$. Even $f$: only $\\cos kx$ survives, real and even. Odd $f$: only $-i\\sin kx$ survives, imaginary and odd. But a complex $f$ such as $e^{-x^2}e^{ik_0x}$ has a spectrum centred at $k_0$, not symmetric.',
      trap: 'The symmetry $|\\tilde f(-k)| = |\\tilde f(k)|$ needs $f$ real.' },
    { id: 'flt-016', type: 'nat', level: 2, exams: ['gate', 'net'], sub: 'limit theorems',
      q: 'If $\\mathcal L\\{f\\} = \\dfrac{2s + 3}{s(s + 1)(s + 3)}$, then $\\displaystyle\\lim_{t\\to\\infty}f(t)$ is ______.',
      answer: 1, tol: 0,
      sol: 'The final value theorem $\\lim_{t\\to\\infty}f = \\lim_{s\\to0}sF(s)$ applies because the other poles ($-1$, $-3$) are in the left half-plane. $sF = \\frac{2s + 3}{(s + 1)(s + 3)} \\to \\frac{3}{3} = 1$.',
      trap: 'The theorem fails if $sF$ has poles on the imaginary axis or to the right (for example for $\\sin t$).' },

    // ---------- level 3 ----------
    { id: 'flt-017', type: 'nat', level: 3, exams: ['gate', 'net'], sub: 'Parseval',
      q: `For $f(x) = e^{-|x|}$, ${FT.replace('Use', 'use')} The value of $\\int_{-\\infty}^{\\infty}|\\tilde f(k)|^2dk$ is ______ (to two decimal places).`,
      answer: 6.28, tol: 0.01, calc: () => 2 * Math.PI,
      sol: 'Parseval (Plancherel) in this convention: $\\int|\\tilde f|^2dk = 2\\pi\\int|f|^2dx$. Here $\\int e^{-2|x|}dx = 1$, so the answer is $2\\pi \\approx 6.28$. (Directly: $\\int\\frac{4}{(1 + k^2)^2}dk = 4\\cdot\\frac\\pi2 = 2\\pi$ ✓.)',
      trap: 'Forgetting the $2\\pi$ that comes with the non-symmetric convention.' },
    { id: 'flt-018', type: 'nat', level: 3, exams: ['gate', 'net'], sub: 'convolution',
      q: 'Let $r(x) = 1$ for $|x| < 1$ and $0$ otherwise. The convolution $(r * r)(x) = \\int r(y)r(x - y)\\,dy$ at $x = 0.5$ is ______ (to two decimal places).',
      answer: 1.5, tol: 0.01, calc: () => 2 - 0.5,
      sol: 'The integrand is 1 where both $|y| < 1$ and $|x - y| < 1$, i.e. on the overlap of $(-1, 1)$ and $(x - 1, x + 1)$, of length $2 - |x|$ for $|x| < 2$. At $x = 0.5$: $1.5$. The convolution of two boxes is a triangle; its transform is the square of the box\'s transform, $(2\\sin k/k)^2$.',
      trap: 'Convolution is the overlap area as one box slides past the other, not the product of the boxes.' },
    { id: 'flt-019', type: 'mcq', level: 3, exams: ['gate', 'net'], sub: 'uncertainty',
      q: 'A Gaussian $f(x) \\propto e^{-x^2/(2\\sigma^2)}$ has transform $\\tilde f(k) \\propto e^{-k^2/(2\\sigma_k^2)}$. Then',
      options: ['$\\sigma_k = \\sigma$', '$\\sigma_k = 1/\\sigma$', '$\\sigma_k = \\sigma^2$', '$\\sigma_k = 2\\pi/\\sigma$'], answer: 1,
      sol: 'Completing the square: $\\int e^{-x^2/(2\\sigma^2)}e^{-ikx}dx = \\sqrt{2\\pi}\\sigma e^{-\\sigma^2k^2/2}$, so $\\sigma_k = 1/\\sigma$ and $\\sigma\\sigma_k = 1$. The probability densities $|f|^2$ and $|\\tilde f|^2$ have widths $\\sigma/\\sqrt2$ and $1/(\\sqrt2\\sigma)$, whose product $\\tfrac12$ gives $\\Delta x\\,\\Delta p = \\hbar/2$.',
      trap: 'Squeezing a function in $x$ spreads its transform in $k$; they never shrink together.' },
    { id: 'flt-020', type: 'nat', level: 3, exams: ['jam', 'gate', 'net'], sub: 'Laplace and ODEs',
      q: 'Solve $y\'\' + 3y\' + 2y = 0$ with $y(0) = 1$, $y\'(0) = 0$ by Laplace transform. The value of $y(1)$ is ______ (to three decimal places).',
      answer: 0.600, tol: 0.003, calc: () => 2 * Math.exp(-1) - Math.exp(-2),
      sol: '$\\mathcal L\\{y\'\'\\} = s^2Y - s y(0) - y\'(0) = s^2Y - s$ and $\\mathcal L\\{y\'\\} = sY - 1$. So $(s^2 + 3s + 2)Y = s + 3$ and $Y = \\frac{s + 3}{(s + 1)(s + 2)} = \\frac{2}{s + 1} - \\frac{1}{s + 2}$. Hence $y = 2e^{-t} - e^{-2t}$ and $y(1) = 0.7358 - 0.1353 \\approx 0.600$. Check: $y(0) = 1$, $y\'(0) = -2 + 2 = 0$ ✓.',
      trap: 'The $3y\'$ term also carries $-3y(0)$; missing it gives $Y = s/((s+1)(s+2))$.' },
    { id: 'flt-021', type: 'msq', level: 3, exams: ['gate', 'net'], sub: 'Laplace existence',
      q: 'Which of these functions have a Laplace transform (for all large enough $s$)?',
      options: ['$e^{t^2}$', '$t^{-1/2}$', '$e^{5t}\\sin t$', '$1/t$'], answer: [1, 2],
      sol: 'We need $\\int_0^\\infty|f|e^{-st}dt$ to converge for large $s$. $e^{t^2}$ outgrows every $e^{st}$. $t^{-1/2}$ is integrable at 0: $\\mathcal L = \\Gamma(\\tfrac12)/s^{1/2} = \\sqrt{\\pi/s}$. $e^{5t}\\sin t$ is of exponential order: $\\frac{1}{(s - 5)^2 + 1}$ for $s > 5$. $1/t$ diverges logarithmically at $t = 0$.',
      trap: 'Two ways to fail: growing too fast at infinity, or blowing up too strongly at $t = 0$.' },
    { id: 'flt-022', type: 'mcq', level: 3, exams: ['gate', 'net'], sub: 'inverse Fourier',
      q: 'With $f(x) = \\dfrac{1}{2\\pi}\\int_{-\\infty}^{\\infty}\\tilde f(k)e^{ikx}dk$, the function whose transform is $\\tilde f(k) = \\dfrac{1}{1 + k^2}$ is',
      options: ['$\\tfrac12e^{-|x|}$', '$e^{-|x|}$', '$\\pi e^{-|x|}$', '$e^{-x^2}$'], answer: 0,
      sol: 'From the pair $e^{-a|x|} \\leftrightarrow \\frac{2a}{a^2 + k^2}$ with $a = 1$: $e^{-|x|} \\leftrightarrow \\frac{2}{1 + k^2}$, so $\\frac{1}{1 + k^2}$ comes from $\\tfrac12e^{-|x|}$. (By residues: for $x > 0$ close up round $k = i$: $\\frac{1}{2\\pi}\\cdot2\\pi i\\cdot\\frac{e^{-x}}{2i} = \\tfrac12e^{-x}$.)',
      trap: 'Dropping the factor 2 in the pair, or the $1/2\\pi$ in the inverse.' },
    { id: 'flt-023', type: 'nat', level: 3, exams: ['jam', 'gate', 'net'], sub: 'Laplace rules',
      q: 'The Laplace transform of $t\\sin t$, evaluated at $s = 1$, is ______ (to two decimal places).',
      answer: 0.5, tol: 0.01, calc: () => 2 / 4,
      sol: '$\\mathcal L\\{tf\\} = -F\'(s)$ with $F = \\frac{1}{s^2 + 1}$: $-F\' = \\frac{2s}{(s^2 + 1)^2}$. At $s = 1$: $\\frac{2}{4} = 0.5$.',
      trap: 'Forgetting the minus sign in $-F\'$ gives $-0.5$; a transform of a function that is positive near 0 should be positive for large $s$.' },
    { id: 'flt-024', type: 'mcq', level: 3, exams: ['jam', 'gate', 'net'], sub: 'Laplace rules',
      q: 'If $\\mathcal L\\{f\\} = F(s)$, then $\\mathcal L\\left\\{\\int_0^t f(\\tau)\\,d\\tau\\right\\}$ is',
      options: ['$sF(s)$', '$F(s) - f(0)$', '$F(s)/s$', '$-F\'(s)$'], answer: 2,
      sol: 'Let $g = \\int_0^t f$, so $g\' = f$ and $g(0) = 0$. Then $sG - 0 = F$, giving $G = F/s$. (Equivalently, $g = f * 1$ and $\\mathcal L\\{1\\} = 1/s$.)',
      trap: 'Integration divides by $s$; differentiation multiplies.' },
    { id: 'flt-025', type: 'nat', level: 3, exams: ['gate', 'net'], sub: 'inverse Laplace',
      q: 'If $\\mathcal L\\{f\\} = \\dfrac{1}{s^2(s + 1)}$, the value of $f(1)$ is ______ (to three decimal places).',
      answer: 0.368, tol: 0.003, calc: () => Math.exp(-1),
      sol: 'Partial fractions: $\\frac{1}{s^2(s + 1)} = \\frac{1}{s^2} - \\frac1s + \\frac{1}{s + 1}$, so $f = t - 1 + e^{-t}$ and $f(1) = e^{-1} \\approx 0.368$. Check: $f(0) = 0$ and $f\'(0) = 0$, as the $1/s^3$ fall-off of $F$ demands.',
      trap: 'Missing the $-1/s$ term; the coefficients must add to give no $1/s$ behaviour overall at large $s$.' },
    { id: 'flt-026', type: 'mcq', level: 3, exams: ['gate', 'net'], sub: 'Fourier pairs',
      q: 'With $\\tilde f(k) = \\int f(x)e^{-ikx}dx$ and $a > 0$, the transform of $f(x) = \\dfrac{\\sin ax}{\\pi x}$ is',
      options: ['$\\dfrac{2\\sin ka}{k}$', '$e^{-a|k|}$', 'a Gaussian of width $a$', '$1$ for $|k| < a$ and $0$ for $|k| > a$'], answer: 3,
      sol: 'Duality: the box $1$ for $|k| < a$ has inverse transform $\\frac{1}{2\\pi}\\int_{-a}^{a}e^{ikx}dk = \\frac{\\sin ax}{\\pi x}$. So the sinc function transforms into the box. (This is the ideal low-pass filter.)',
      trap: '$\\frac{2\\sin ka}{k}$ is the transform of the box itself, going the other way.' },
    { id: 'flt-027', type: 'msq', level: 3, exams: ['gate', 'net'], sub: 'delta function',
      q: 'With $\\tilde f(k) = \\int f(x)e^{-ikx}dx$, which statements are true?',
      options: ['$\\int_{-\\infty}^{\\infty}e^{ikx}dk = 2\\pi\\delta(x)$', 'The transform of $f(x) = 1$ is $2\\pi\\delta(k)$', 'The transform of a periodic function is a smooth function of $k$', 'The transform of $\\cos k_0x$ is $\\pi[\\delta(k - k_0) + \\delta(k + k_0)]$'], answer: [0, 1, 3],
      sol: 'Transform-then-invert of $\\delta(x)$: $\\delta(x) = \\frac{1}{2\\pi}\\int e^{ikx}dk$. The constant 1 is the inverse of $2\\pi\\delta(k)$. $\\cos k_0x = \\frac12(e^{ik_0x} + e^{-ik_0x})$ gives two spikes of weight $\\pi$. A periodic function contains only the harmonic wavenumbers, so its transform is a comb of delta functions, not a smooth function.',
      trap: 'Missing the $2\\pi$: it appears wherever the convention puts it, so track it.' },
    { id: 'flt-028', type: 'nat', level: 3, exams: ['gate', 'net'], sub: 'Laplace rules',
      q: 'The Laplace transform of $(t - 2)u(t - 2)$ ($u$ the unit step), evaluated at $s = 1$, is ______ (to three decimal places).',
      answer: 0.135, tol: 0.002, calc: () => Math.exp(-2),
      sol: 'Second shift theorem: $\\mathcal L\\{f(t - a)u(t - a)\\} = e^{-as}F(s)$ with $f = t$, $F = 1/s^2$. So $\\frac{e^{-2s}}{s^2}$; at $s = 1$: $e^{-2} \\approx 0.135$.',
      trap: '$(t - 2)u(t - 2)$ is a ramp starting at $t = 2$, not $t\\,u(t - 2)$; the latter would add $2e^{-2s}/s$.' },

    // ---------- level 4 ----------
    { id: 'flt-029', type: 'nat', level: 4, exams: ['gate', 'net'], sub: 'periodic functions',
      q: 'A square wave has $f(t) = 1$ for $0 < t < 1$ and $f(t) = 0$ for $1 < t < 2$, repeating with period 2. Its Laplace transform at $s = \\ln2$ is ______ (to three decimal places).',
      answer: 0.962, tol: 0.003, calc: () => 1 / (1.5 * Math.LN2),
      sol: 'For period $T$: $F(s) = \\frac{1}{1 - e^{-sT}}\\int_0^T f e^{-st}dt = \\frac{(1 - e^{-s})/s}{1 - e^{-2s}} = \\frac{1}{s(1 + e^{-s})}$. At $s = \\ln2$, $e^{-s} = \\tfrac12$: $F = \\frac{1}{1.5\\ln2} \\approx 0.962$.',
      trap: 'Using only the first period, $(1 - e^{-s})/s \\approx 0.721$, forgets the repeats.' },
    { id: 'flt-030', type: 'mcq', level: 4, exams: ['gate', 'net'], sub: 'line shapes',
      q: 'A signal $f(t) = e^{-\\gamma t}\\cos\\omega_0t$ for $t > 0$ (zero before), with $\\gamma \\ll \\omega_0$, has a power spectrum $|\\tilde f(\\omega)|^2$ near $\\omega_0$ that is',
      options: ['a Gaussian of width $\\gamma$', 'a Lorentzian of full width at half maximum $2\\gamma$', 'a Lorentzian of full width at half maximum $\\gamma$', 'a sinc squared'], answer: 1,
      sol: 'Near $\\omega_0$ the $e^{i\\omega_0t}$ half dominates: $\\int_0^\\infty e^{-\\gamma t}e^{i\\omega_0t}e^{-i\\omega t}dt\\cdot\\tfrac12 = \\frac{1/2}{\\gamma + i(\\omega - \\omega_0)}$. Its square modulus $\\propto\\frac{1}{\\gamma^2 + (\\omega - \\omega_0)^2}$ falls to half at $|\\omega - \\omega_0| = \\gamma$: FWHM $= 2\\gamma$. Lifetime $\\tau = 1/(2\\gamma)$ for the energy gives $\\Gamma\\tau = 1$ (natural line width).',
      trap: 'Half maximum of $|\\tilde f|^2$, not of $|\\tilde f|$; the latter gives width $2\\sqrt3\\gamma$.' },
    { id: 'flt-031', type: 'nat', level: 4, exams: ['gate', 'net'], sub: 'Green functions',
      q: 'The solution of $y\'\' - y = -\\delta(x)$ that vanishes at $x \\to \\pm\\infty$ is found by Fourier transform. Its value at $x = \\ln2$ is ______ (to three decimal places).',
      answer: 0.25, tol: 0.002, calc: () => 0.5 * Math.exp(-Math.LN2),
      sol: 'Transforming ($d/dx \\to ik$): $(-k^2 - 1)\\tilde y = -1$, so $\\tilde y = \\frac{1}{1 + k^2}$ and $y = \\tfrac12e^{-|x|}$. At $x = \\ln2$: $\\tfrac12\\cdot\\tfrac12 = 0.25$. Check: $y\'$ jumps from $+\\tfrac12$ to $-\\tfrac12$ at 0, a jump of $-1$, matching $-\\delta$.',
      trap: 'Forgetting the factor $\\tfrac12$ from the inverse transform of $1/(1 + k^2)$.' },
    { id: 'flt-032', type: 'msq', level: 4, exams: ['gate', 'net'], sub: 'Laplace pairs',
      q: 'Using $\\mathcal L\\{t^a\\} = \\Gamma(a + 1)/s^{a+1}$ for $a > -1$, which statements are true?',
      options: ['$\\mathcal L\\{\\sqrt t\\} = \\dfrac{\\sqrt\\pi}{2s^{3/2}}$', '$\\mathcal L\\{t^{-3/2}\\}$ exists', '$\\mathcal L\\{1/\\sqrt t\\} = \\sqrt{\\pi/s}$', '$\\mathcal L\\{t^3\\} = 6/s^4$'], answer: [0, 2, 3],
      sol: '$\\Gamma(\\tfrac32) = \\tfrac12\\sqrt\\pi$ gives the first; $\\Gamma(\\tfrac12) = \\sqrt\\pi$ the third; $\\Gamma(4) = 3! = 6$ the fourth. For $a = -\\tfrac32 < -1$ the integral $\\int_0 t^{-3/2}dt$ diverges at $t = 0$, so there is no transform.',
      trap: 'The Gamma formula needs $a > -1$; outside that range it gives a number but no transform.' },
    { id: 'flt-033', type: 'mcq', level: 4, exams: ['gate', 'net'], sub: 'inverse Laplace',
      q: 'The inverse Laplace transform of $\\dfrac{1}{s^2 + 2s + 5}$ is',
      options: ['$e^{-t}\\sin2t$', '$\\tfrac12e^{t}\\sin2t$', '$\\tfrac12e^{-t}\\sin2t$', '$\\tfrac12e^{-t}\\cos2t$'], answer: 2,
      sol: 'Complete the square: $s^2 + 2s + 5 = (s + 1)^2 + 4$. Since $\\mathcal L\\{\\sin2t\\} = \\frac{2}{s^2 + 4}$, shifting $s \\to s + 1$ multiplies by $e^{-t}$: $\\frac{1}{(s + 1)^2 + 4} \\leftrightarrow \\tfrac12e^{-t}\\sin2t$. (By Bromwich: residues of $\\frac{e^{st}}{(s + 1)^2 + 4}$ at $s = -1 \\pm 2i$ add to the same.)',
      trap: 'Forgetting the $\\tfrac12$ (from $\\omega = 2$ on top of the sine pair) or the sign of the shift.' },
    { id: 'flt-034', type: 'nat', level: 4, exams: ['gate', 'net'], sub: 'Parseval',
      q: 'Using Parseval\'s theorem with $f(x) = e^{-|x|}$, the value of $\\displaystyle\\int_{-\\infty}^{\\infty}\\frac{dk}{(1 + k^2)^2}$ is ______ (to three decimal places).',
      answer: 1.571, tol: 0.003, calc: () => Math.PI / 2,
      sol: '$\\tilde f(k) = \\frac{2}{1 + k^2}$ (with $\\tilde f = \\int fe^{-ikx}dx$). Parseval: $\\int|\\tilde f|^2dk = 2\\pi\\int|f|^2dx = 2\\pi\\cdot1$. So $4\\int\\frac{dk}{(1 + k^2)^2} = 2\\pi$, and the integral is $\\pi/2 \\approx 1.571$, agreeing with a residue calculation.',
      trap: 'Forgetting to square the 2 in $\\tilde f$ gives $\\pi$.' },
    { id: 'flt-035', type: 'mcq', level: 4, exams: ['gate', 'net'], sub: 'limit theorems',
      q: 'If $\\mathcal L\\{f\\} = \\dfrac{3s + 1}{s^2 + 2s + 5}$, then $f(0^+)$ is',
      options: ['$\\tfrac15$', '$0$', '$1$', '$3$'], answer: 3,
      sol: 'Initial value theorem: $f(0^+) = \\lim_{s\\to\\infty}sF(s) = \\lim\\frac{3s^2 + s}{s^2 + 2s + 5} = 3$. (Check: $F = \\frac{3(s + 1) - 2}{(s + 1)^2 + 4}$ gives $f = e^{-t}(3\\cos2t - \\sin2t)$, so $f(0) = 3$.)',
      trap: '$\\tfrac15$ is $F(0)$, which is $\\int_0^\\infty f\\,dt$, not a value of $f$.' },
    { id: 'flt-036', type: 'msq', level: 4, exams: ['gate', 'net'], sub: 'Fourier and Laplace',
      q: 'Which statements about Laplace and Fourier transforms are true?',
      options: ['For a causal $f$ that decays, $F(s)$ at $s = i\\omega$ equals $\\int f(t)e^{-i\\omega t}dt$', 'The Laplace transform of $e^{2t}$ converges for $\\text{Re}\\,s > 2$', '$e^{2t}u(t)$ has an ordinary Fourier transform', 'A pole of $F(s)$ with positive real part means $f(t)$ grows exponentially'], answer: [0, 1, 3],
      sol: 'For $f = 0$ when $t < 0$, the Fourier integral is the Laplace integral on the imaginary axis, provided that axis lies in the region of convergence. $\\int e^{2t}e^{-st}dt$ needs $\\text{Re}\\,s > 2$; so $s = i\\omega$ is outside and $e^{2t}u(t)$ has no ordinary Fourier transform. A pole at $s_0$ gives a term $e^{s_0t}$ in $f$, growing if $\\text{Re}\\,s_0 > 0$ (an unstable system).',
      trap: 'Laplace exists for growing functions because $e^{-st}$ can beat them; Fourier, with $s = i\\omega$, cannot.' },

    // ---------- level 5 ----------
    { id: 'flt-037', type: 'nat', level: 5, exams: ['gate', 'net'], sub: 'Parseval',
      q: 'Using Parseval\'s theorem for the triangle $r * r$ (with $r$ the unit box on $|x| < 1$), the value of $\\displaystyle\\int_{-\\infty}^{\\infty}\\frac{\\sin^4x}{x^4}\\,dx$ is ______ (to three decimal places).',
      answer: 2.094, tol: 0.003, calc: () => (2 * Math.PI) / 3,
      sol: '$\\tilde r = \\frac{2\\sin k}{k}$, so the triangle $t = r * r$ ($t = 2 - |x|$ for $|x| < 2$) has $\\tilde t = \\frac{4\\sin^2k}{k^2}$. Parseval: $\\int|\\tilde t|^2dk = 2\\pi\\int t^2dx = 2\\pi\\cdot2\\int_0^2(2 - x)^2dx = 2\\pi\\cdot\\frac{16}{3}$. So $16\\int\\frac{\\sin^4k}{k^4}dk = \\frac{32\\pi}{3}$, giving $\\frac{2\\pi}{3} \\approx 2.094$.',
      trap: 'The convolution theorem squares the transform; Parseval then squares it again, hence the fourth power.' },
    { id: 'flt-038', type: 'mcq', level: 5, exams: ['gate', 'net'], sub: 'causality',
      q: 'A causal response function ($\\chi(t) = 0$ for $t < 0$, bounded) has $\\tilde\\chi(\\omega) = \\int_{-\\infty}^{\\infty}\\chi(t)e^{i\\omega t}dt$. As a function of complex $\\omega$, $\\tilde\\chi$ is analytic in',
      options: ['the upper half-plane, $\\text{Im}\\,\\omega > 0$', 'the lower half-plane, $\\text{Im}\\,\\omega < 0$', 'the whole complex plane', 'no open region; only on the real axis'], answer: 0,
      sol: 'Write $\\omega = \\omega_r + i\\omega_i$: $e^{i\\omega t} = e^{i\\omega_rt}e^{-\\omega_it}$. Since only $t > 0$ contributes, the factor $e^{-\\omega_it}$ makes the integral converge (and be differentiable) when $\\omega_i > 0$. Analyticity in the upper half-plane is what leads to the Kramers-Kronig relations between $\\text{Re}\\,\\tilde\\chi$ and $\\text{Im}\\,\\tilde\\chi$.',
      trap: 'The half-plane depends on the sign convention; with $e^{-i\\omega t}$ it would be the lower half-plane.' },
    { id: 'flt-039', type: 'nat', level: 5, exams: ['gate', 'net'], sub: 'integral equations',
      q: 'The function $y(t)$ satisfies $y(t) = t + \\displaystyle\\int_0^t (t - \\tau)\\,y(\\tau)\\,d\\tau$. The value of $y(1)$ is ______ (to three decimal places).',
      answer: 1.175, tol: 0.003, calc: () => Math.sinh(1),
      sol: 'The integral is the convolution $t * y$, whose transform is $\\frac{1}{s^2}Y$. So $Y = \\frac{1}{s^2} + \\frac{Y}{s^2}$, giving $Y = \\frac{1}{s^2 - 1}$ and $y = \\sinh t$. Then $y(1) = \\sinh1 \\approx 1.175$. Check: differentiating twice gives $y\'\' = y$ with $y(0) = 0$, $y\'(0) = 1$ ✓.',
      trap: 'Treating the integral as $t\\int_0^t y$ misses the convolution structure.' },
    { id: 'flt-040', type: 'msq', level: 5, exams: ['gate', 'net'], sub: 'smoothness and decay',
      q: 'Which statements about how fast $\\tilde f(k)$ decays as $|k| \\to \\infty$ are true?',
      options: ['If $f$ has a jump discontinuity, $\\tilde f$ falls off like $1/k$', 'If $f$ and $f\'$ are continuous but $f\'\'$ jumps, $\\tilde f$ falls off like $1/k^3$', 'A non-zero function can vanish outside a finite interval in $x$ and also have $\\tilde f$ vanishing outside a finite interval in $k$', 'The transform of a Gaussian falls faster than any power of $1/k$'], answer: [0, 1, 3],
      sol: 'Each integration by parts gains a factor $1/(ik)$ until a discontinuity stops it: a jump in $f^{(n)}$ leaves a $1/k^{n+1}$ tail ($n = 0$: box, $1/k$; $n = 2$: $1/k^3$). The Gaussian is smooth to all orders, and its transform is a Gaussian, decaying faster than any power. A function confined in $x$ has an entire (analytic) transform, which cannot vanish on an interval unless it is identically zero: no function is confined in both.',
      trap: 'This is the mathematical root of the uncertainty principle: perfect confinement in both domains is impossible.' },
    ...more2,
    ...r4.items,
    ...r5.items,
  ],
  gens: [
    { id: 'flt-g01', type: 'nat', level: 1, exams: ['jam', 'gate', 'net'], sub: 'Laplace pairs',
      make(r) {
        const n = int(r, 0, 3), a = int(r, -2, 2), s = a + int(r, 1, 3);
        const answer = round(fact(n) / (s - a) ** (n + 1), 4);
        const tn = n === 0 ? '' : n === 1 ? 't' : `t^{${n}}`;
        const ex = a === 0 ? '' : `e^{${a === 1 ? '' : a === -1 ? '-' : a}t}`;
        return { q: `Find the Laplace transform of $${tn || ex ? tn + ex : '1'}$ at $s = ${s}$ (to four decimal places).`,
          answer, tol: Math.max(1e-4, answer * 0.005), n, a, s,
          sol: `$\\mathcal L\\{t^n\\} = n!/s^{n+1}$, and the factor $e^{at}$ shifts $s \\to s - a$: $\\mathcal L\\{t^{${n}}e^{${a}t}\\} = \\frac{${n}!}{(s - (${a}))^{${n + 1}}}$. At $s = ${s}$: $\\frac{${fact(n)}}{${s - a}^{${n + 1}}} \\approx ${answer}$.`,
          trap: 'A factor $e^{at}$ moves $s$ to $s - a$; watch the sign for negative $a$.' };
      },
      verify: (p) => { let sum = 0; const N = 200000, T = 60; for (let i = 0; i < N; i++) { const t = (T * (i + 0.5)) / N; sum += t ** p.n * Math.exp((p.a - p.s) * t); } return (sum * T) / N; } },
    { id: 'flt-g02', type: 'nat', level: 2, exams: ['gate', 'net'], sub: 'Fourier pairs',
      make(r) {
        const a = choose(r, [0.5, 1, 1.5, 2, 2.5, 3, 4, 5]);
        const answer = round(Math.PI / a, 3);
        return { q: `The pulse $f(x) = 1$ for $|x| < ${a}$ (zero outside) has transform $\\tilde f(k) = \\int f(x)e^{-ikx}dx$. Find the smallest positive $k$ with $\\tilde f(k) = 0$ (to three decimal places).`,
          answer, tol: 0.003, a,
          sol: `$\\tilde f(k) = \\int_{-${a}}^{${a}}e^{-ikx}dx = \\frac{2\\sin(${a}k)}{k}$, which first vanishes at $${a}k = \\pi$: $k = \\pi/${a} \\approx ${answer}$.`,
          trap: 'Use the half-width $a$, not the full width $2a$.' };
      },
      verify: (p) => { // bisection for first zero of sin(a k)/k
        let lo = 0.5 / p.a, hi = 4 / p.a; const g = (k) => Math.sin(p.a * k); for (let i = 0; i < 80; i++) { const m = (lo + hi) / 2; if (g(lo) * g(m) <= 0) hi = m; else lo = m; } return (lo + hi) / 2; } },
    { id: 'flt-g03', type: 'nat', level: 2, exams: ['jam', 'gate', 'net'], sub: 'inverse Laplace',
      make(r) {
        const a = int(r, 1, 4), t = choose(r, [0.5, 1, 1.5, 2]);
        const answer = round((1 - Math.exp(-a * t)) / a, 4);
        return { q: `If $\\mathcal L\\{f\\} = \\dfrac{1}{s(s + ${a})}$, find $f(${t})$ (to four decimal places).`,
          answer, tol: Math.max(1e-4, answer * 0.005), a, t,
          sol: `$\\frac{1}{s(s + ${a})} = \\frac{1}{${a}}\\left(\\frac1s - \\frac{1}{s + ${a}}\\right)$, so $f = \\frac{1 - e^{-${a}t}}{${a}}$ and $f(${t}) = \\frac{1 - e^{-${a * t}}}{${a}} \\approx ${answer}$.`,
          trap: 'Do not forget the factor $1/a$ from the partial fractions.' };
      },
      verify: (p) => { let s = 0; const N = 20000; for (let i = 0; i < N; i++) s += Math.exp(-p.a * (p.t * (i + 0.5)) / N); return (s * p.t) / N; } },
    { id: 'flt-g04', type: 'nat', level: 3, exams: ['jam', 'gate', 'net'], sub: 'Laplace and ODEs',
      make(r) {
        const a = int(r, 1, 3), b = a + int(r, 1, 3), t = choose(r, [0.5, 1, 1.5]);
        const answer = round((b * Math.exp(-a * t) - a * Math.exp(-b * t)) / (b - a), 4);
        return { q: `Solve $y'' + ${a + b}y' + ${a * b}y = 0$ with $y(0) = 1$, $y'(0) = 0$ by Laplace transform, and give $y(${t})$ (to four decimal places).`,
          answer, tol: Math.max(1e-4, answer * 0.005), a, b, t,
          sol: `Transforming: $(s^2 + ${a + b}s + ${a * b})Y = s + ${a + b}$, so $Y = \\frac{s + ${a + b}}{(s + ${a})(s + ${b})} = \\frac{${b}/${b - a}}{s + ${a}} - \\frac{${a}/${b - a}}{s + ${b}}$. Hence $y = \\frac{${b}e^{-${a}t} - ${a}e^{-${b}t}}{${b - a}}$ and $y(${t}) \\approx ${answer}$.`,
          trap: `Both $s^2Y$ and $sY$ bring initial-value terms: $-s\\,y(0)$ and $-${a + b}\\,y(0)$.` };
      },
      verify: (p) => { // RK4 integration
        let y = 1, v = 0; const n = 4000, h = p.t / n, c1 = p.a + p.b, c0 = p.a * p.b, f = (y, v) => [v, -c1 * v - c0 * y];
        for (let i = 0; i < n; i++) { const k1 = f(y, v), k2 = f(y + h / 2 * k1[0], v + h / 2 * k1[1]), k3 = f(y + h / 2 * k2[0], v + h / 2 * k2[1]), k4 = f(y + h * k3[0], v + h * k3[1]);
          y += (h / 6) * (k1[0] + 2 * k2[0] + 2 * k3[0] + k4[0]); v += (h / 6) * (k1[1] + 2 * k2[1] + 2 * k3[1] + k4[1]); } return y; } },
    { id: 'flt-g05', type: 'mcq', level: 2, exams: ['jam', 'gate', 'net'], sub: 'Laplace pairs',
      make(r) {
        const w = int(r, 2, 6), kind = int(r, 0, 3);
        const fn = [`\\sin ${w}t`, `\\cos ${w}t`, `\\sinh ${w}t`, `\\cosh ${w}t`][kind];
        const options = [`$\\dfrac{${w}}{s^2 + ${w * w}}$`, `$\\dfrac{s}{s^2 + ${w * w}}$`, `$\\dfrac{${w}}{s^2 - ${w * w}}$`, `$\\dfrac{s}{s^2 - ${w * w}}$`];
        return { q: `The Laplace transform of $${fn}$ is`, options, answer: kind,
          sol: `Write the function with exponentials: $\\sin$ and $\\cos$ come from $e^{\\pm i${w}t}$ (giving $s^2 + ${w * w}$), $\\sinh$ and $\\cosh$ from $e^{\\pm ${w}t}$ (giving $s^2 - ${w * w}$). The odd functions ($\\sin$, $\\sinh$) have $${w}$ on top, the even ones $s$. So $\\mathcal L\\{${fn}\\} = $ ${options[kind]}.`,
          trap: 'Odd function, constant on top (it starts at 0); even function, $s$ on top (it starts at 1).' };
      } },
    { id: 'flt-g06', type: 'nat', level: 3, exams: ['gate', 'net'], sub: 'Parseval',
      make(r) {
        const a = choose(r, [0.5, 1, 2, 3, 4]);
        const answer = round((2 * Math.PI) / a, 3);
        return { q: `For $f(x) = e^{-${a}|x|}$ and $\\tilde f(k) = \\int f(x)e^{-ikx}dx$, find $\\int_{-\\infty}^{\\infty}|\\tilde f(k)|^2dk$ (to three decimal places).`,
          answer, tol: 0.003, a,
          sol: `Parseval in this convention: $\\int|\\tilde f|^2dk = 2\\pi\\int|f|^2dx = 2\\pi\\int e^{-${2 * a}|x|}dx = 2\\pi\\cdot\\frac{2}{${2 * a}} = \\frac{2\\pi}{${a}} \\approx ${answer}$.`,
          trap: 'The $2\\pi$ is part of Parseval when the transform has no $1/\\sqrt{2\\pi}$.' };
      },
      verify: (p) => { // integrate (2a/(a^2+k^2))^2 with k = a tan(t)
        let s = 0; const N = 100000; for (let i = 0; i < N; i++) { const t = -Math.PI / 2 + (Math.PI * (i + 0.5)) / N, k = p.a * Math.tan(t); s += (2 * p.a / (p.a * p.a + k * k)) ** 2 * p.a / Math.cos(t) ** 2; } return (s * Math.PI) / N; } },
    { id: 'flt-g07', type: 'nat', level: 4, exams: ['gate', 'net'], sub: 'Green functions',
      make(r) {
        const a = int(r, 1, 3), x0 = choose(r, [0, 0.25, 0.5, 1, -0.5, -1]);
        const answer = round(Math.exp(-a * Math.abs(x0)) / (2 * a), 4);
        return { q: `The solution of $y'' - ${a * a}y = -\\delta(x)$ that vanishes as $x \\to \\pm\\infty$ is found with a Fourier transform. Find $y(${x0})$ (to four decimal places).`,
          answer, tol: Math.max(1e-4, answer * 0.005), a, x0,
          sol: `With $d/dx \\to ik$: $(-k^2 - ${a * a})\\tilde y = -1$, so $\\tilde y = \\frac{1}{k^2 + ${a * a}}$, whose inverse is $y = \\frac{e^{-${a}|x|}}{${2 * a}}$. At $x = ${x0}$: $\\approx ${answer}$. (The jump in $y'$ at 0 is $-1$, as the delta function requires.)`,
          trap: 'The inverse of $1/(k^2 + a^2)$ is $e^{-a|x|}/(2a)$; the factor $1/(2a)$ is easy to drop.' };
      },
      verify: (p) => { // inverse transform numerically: (1/2pi) int cos(kx)/(k^2+a^2) dk, k = a tan t
        let s = 0; const N = 200000; for (let i = 0; i < N; i++) { const t = -Math.PI / 2 + (Math.PI * (i + 0.5)) / N, k = p.a * Math.tan(t); s += Math.cos(k * p.x0) / (k * k + p.a * p.a) * p.a / Math.cos(t) ** 2; } return (s * Math.PI) / N / (2 * Math.PI); } },
    { id: 'flt-g08', type: 'nat', level: 3, exams: ['gate', 'net'], sub: 'limit theorems',
      make(r) {
        const p = int(r, 1, 4), q = int(r, 1, 6), a = int(r, 1, 3), b = a + int(r, 1, 3);
        const answer = round(q / (a * b), 4);
        return { q: `If $\\mathcal L\\{f\\} = \\dfrac{${p}s + ${q}}{s(s + ${a})(s + ${b})}$, find $\\lim_{t\\to\\infty}f(t)$ (to four decimal places).`,
          answer, tol: Math.max(1e-4, answer * 0.005), p, num: q, a, b,
          sol: `The poles other than $s = 0$ ($-${a}$, $-${b}$) are in the left half-plane, so the final value theorem applies: $\\lim_{t\\to\\infty}f = \\lim_{s\\to0}sF(s) = \\frac{${q}}{${a}\\cdot${b}} \\approx ${answer}$.`,
          trap: 'Only the constant term of the numerator survives as $s \\to 0$.' };
      },
      verify: (pp) => { // partial fractions: f(t) = A + B e^{-at} + C e^{-bt}; evaluate at large t
        const { p, num: q, a, b } = pp, B = (p * -a + q) / (-a * (b - a)), C = (p * -b + q) / (-b * (a - b)), A = q / (a * b), t = 60;
        return A + B * Math.exp(-a * t) + C * Math.exp(-b * t); } },
    ...more,
    ...r4.gens,
    ...r5.gens,
  ],
};

// Tidy signs in generated text ("+ -3" -> "- 3", "1x" -> "x"); see _signs.js.
export default tidyPhys(topicBank, ["flt-g01","flt-g02","flt-g03","flt-g04","flt-g07","flt-g08","flt-m33","flt-r4g1","flt-r4g3"]);
