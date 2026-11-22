// Series solutions and special functions: ordinary and regular singular points, Frobenius and the indicial equation,
// Legendre polynomials (Rodrigues, generating function, orthogonality, expansions), associated Legendre functions,
// Bessel functions (series, recurrences, zeros, orthogonality), Hermite and Laguerre polynomials, the gamma function.
// Original questions for GATE and CSIR NET practice (fibub). Levels: 1 warm-up ... 5 top rank.
import { int, choose, mcqOptions, round } from '../_util.js';

const fact = (n) => (n <= 1 ? 1 : n * fact(n - 1));
// Legendre P_n(x) by Bonnet's recurrence (n+1)P_{n+1} = (2n+1)xP_n - nP_{n-1}
const P = (n, x) => { let a = 1, b = x; if (n === 0) return 1; for (let k = 1; k < n; k++) { const c = ((2 * k + 1) * x * b - k * a) / (k + 1); a = b; b = c; } return b; };
// Hermite (physicists') H_{n+1} = 2xH_n - 2nH_{n-1}
const H = (n, x) => { let a = 1, b = 2 * x; if (n === 0) return 1; for (let k = 1; k < n; k++) { const c = 2 * x * b - 2 * k * a; a = b; b = c; } return b; };
// Hermite from the explicit sum n! sum (-1)^m (2x)^(n-2m) / (m!(n-2m)!)
const Hsum = (n, x) => { let s = 0; for (let m = 0; 2 * m <= n; m++) s += ((-1) ** m * (2 * x) ** (n - 2 * m)) / (fact(m) * fact(n - 2 * m)); return fact(n) * s; };
// Gamma function (Lanczos, g = 7), valid for all real x except non-positive integers
const G = [0.99999999999980993, 676.5203681218851, -1259.1392167224028, 771.32342877765313, -176.61502916214059, 12.507343278686905, -0.13857109526572012, 9.9843695780195716e-6, 1.5056327351493116e-7];
const gamma = (x) => { if (x < 0.5) return Math.PI / (Math.sin(Math.PI * x) * gamma(1 - x)); x -= 1; let a = G[0]; const t = x + 7.5; for (let i = 1; i < 9; i++) a += G[i] / (x + i); return Math.sqrt(2 * Math.PI) * t ** (x + 0.5) * Math.exp(-t) * a; };
// Bessel J_nu(x) from its power series (fine for x up to about 15)
const J = (nu, x) => { let s = 0; for (let m = 0; m < 60; m++) { const g = gamma(m + nu + 1); if (!Number.isFinite(g)) continue; s += ((-1) ** m * (x / 2) ** (2 * m + nu)) / (fact(m) * g); } return s; };
// midpoint rule on [a, b]
const integ = (f, a, b, N = 20000) => { let s = 0; const h = (b - a) / N; for (let i = 0; i < N; i++) s += f(a + (i + 0.5) * h); return s * h; };
const sgn = (v) => (v < 0 ? `- ${-v}` : `+ ${v}`);

export default {
  topic: 'special-functions',
  items: [
    // ---------- level 1 ----------
    { id: 'sfn-001', type: 'mcq', level: 1, exams: ['gate', 'net'], sub: 'Legendre polynomials',
      q: 'The Legendre polynomial $P_2(x)$ is',
      options: ['$\\tfrac12(3x^2 - 1)$', '$3x^2 - 1$', '$\\tfrac12(5x^3 - 3x)$', '$x^2 - \\tfrac13$'], answer: 0,
      sol: 'From Rodrigues\' formula $P_2 = \\frac{1}{2^2\\,2!}\\frac{d^2}{dx^2}(x^2 - 1)^2 = \\frac18\\frac{d^2}{dx^2}(x^4 - 2x^2 + 1) = \\frac18(12x^2 - 4) = \\frac12(3x^2 - 1)$. Check: $P_2(1) = 1$, as every $P_n(1)$ must be.',
      trap: '$x^2 - \\tfrac13$ is orthogonal to 1 and $x$ too, but it is not normalised so that $P_n(1) = 1$.' },
    { id: 'sfn-002', type: 'mcq', level: 1, exams: ['gate', 'net', 'jam'], sub: 'Legendre polynomials',
      q: 'For every non-negative integer $n$, the value of $P_n(1)$ is',
      options: ['$0$', '$1$', '$n$', '$(-1)^n$'], answer: 1,
      sol: 'Put $x = 1$ in the generating function: $(1 - 2t + t^2)^{-1/2} = (1 - t)^{-1} = \\sum t^n$. Every coefficient is 1, so $P_n(1) = 1$. (And $P_n(-1) = (-1)^n$ from parity.)',
      trap: '$(-1)^n$ is $P_n(-1)$, not $P_n(1)$.' },
    { id: 'sfn-003', type: 'mcq', level: 1, exams: ['gate', 'net'], sub: 'orthogonality',
      q: 'The Hermite polynomials $H_n(x)$ (physicists\' convention) are orthogonal on $(-\\infty, \\infty)$ with the weight',
      options: ['$1$', '$e^{-x}$', '$e^{-x^2}$', '$\\dfrac{1}{\\sqrt{1 - x^2}}$'], answer: 2,
      sol: '$\\int_{-\\infty}^{\\infty}H_mH_ne^{-x^2}dx = 2^nn!\\sqrt\\pi\\,\\delta_{mn}$. The weight $e^{-x^2}$ is what makes the integrals converge on the whole line; it is also why oscillator eigenfunctions are $H_n(x)e^{-x^2/2}$ (the square of $e^{-x^2/2}$ is the weight).',
      trap: '$e^{-x}$ on $[0, \\infty)$ belongs to Laguerre, $1/\\sqrt{1 - x^2}$ to Chebyshev.' },
    { id: 'sfn-004', type: 'nat', level: 1, exams: ['gate', 'net'], sub: 'Hermite polynomials',
      q: 'With $H_2(x) = 4x^2 - 2$, the value of $H_2(1)$ is ______.',
      answer: 2, tol: 0, calc: () => 4 - 2,
      sol: '$H_2(1) = 4(1)^2 - 2 = 2$. (Hermite polynomials are not normalised to 1 at $x = 1$; that rule is special to Legendre.)',
      trap: 'Assuming $H_n(1) = 1$ by analogy with Legendre.' },
    { id: 'sfn-005', type: 'mcq', level: 1, exams: ['gate', 'net', 'jam'], sub: 'Bessel functions',
      q: 'The value of the Bessel function $J_3(0)$ is',
      options: ['$1$', '$\\tfrac13$', '$\\infty$', '$0$'], answer: 3,
      sol: 'The series $J_n(x) = \\sum_m\\frac{(-1)^m}{m!(m + n)!}\\left(\\frac x2\\right)^{2m + n}$ starts with $x^n$, so $J_n(0) = 0$ for every $n \\ge 1$. Only $J_0(0) = 1$.',
      trap: 'It is $Y_n$ (the second solution), not $J_n$, that blows up at the origin.' },
    { id: 'sfn-006', type: 'msq', level: 1, exams: ['gate', 'net'], sub: 'parity',
      q: 'Which of these functions are even in $x$?',
      options: ['$P_2(x)$', '$P_3(x)$', '$H_4(x)$', '$J_0(x)$'], answer: [0, 2, 3],
      sol: '$P_n(-x) = (-1)^nP_n(x)$ and $H_n(-x) = (-1)^nH_n(x)$, so $P_2$ and $H_4$ are even and $P_3$ is odd. $J_0$ has a series in $x^2$ only, so it is even too.',
      trap: 'Bessel functions are not polynomials, but $J_n(-x) = (-1)^nJ_n(x)$ still holds.' },

    // ---------- level 2 ----------
    { id: 'sfn-007', type: 'nat', level: 2, exams: ['gate', 'net'], sub: 'orthogonality',
      q: 'The value of $\\displaystyle\\int_{-1}^{1}[P_3(x)]^2\\,dx$ is ______ (to three decimal places).',
      answer: 0.286, tol: 0.002, calc: () => 2 / 7,
      sol: 'The norm is $\\int_{-1}^{1}P_n^2dx = \\frac{2}{2n + 1}$. For $n = 3$: $\\frac27 \\approx 0.286$.',
      trap: 'Answering 1: Legendre polynomials are normalised by $P_n(1) = 1$, not to unit norm.' },
    { id: 'sfn-008', type: 'mcq', level: 2, exams: ['gate', 'net'], sub: 'Legendre expansions',
      q: 'Written as a Legendre series, $x^2$ equals',
      options: ['$P_2(x)$', '$\\tfrac23P_2(x)$', '$\\tfrac13P_0(x) + \\tfrac23P_2(x)$', '$\\tfrac23P_0(x) + \\tfrac13P_2(x)$'], answer: 2,
      sol: 'From $P_2 = \\frac12(3x^2 - 1)$: $x^2 = \\frac{2P_2 + 1}{3} = \\frac13P_0 + \\frac23P_2$. Check at $x = 1$: $\\frac13 + \\frac23 = 1$ ✓.',
      trap: 'Forgetting the constant part: $x^2$ has a non-zero average on $[-1, 1]$, so it needs $P_0$.' },
    { id: 'sfn-009', type: 'mcq', level: 2, exams: ['gate', 'net', 'jam'], sub: 'gamma function',
      q: 'The ratio $\\Gamma(7/2)/\\Gamma(1/2)$ equals',
      options: ['$\\tfrac{15}{8}$', '$\\tfrac{15}{4}$', '$6$', '$\\tfrac{3}{4}$'], answer: 0,
      sol: '$\\Gamma(x + 1) = x\\Gamma(x)$ three times: $\\Gamma(\\tfrac72) = \\tfrac52\\cdot\\tfrac32\\cdot\\tfrac12\\,\\Gamma(\\tfrac12) = \\tfrac{15}{8}\\Gamma(\\tfrac12)$.',
      trap: '$6 = \\Gamma(4)$: the recurrence steps down by 1 from $\\tfrac72$, not from 4.' },
    { id: 'sfn-010', type: 'mcq', level: 2, exams: ['gate', 'net'], sub: 'singular points',
      q: 'For Legendre\'s equation $(1 - x^2)y\'\' - 2xy\' + \\ell(\\ell + 1)y = 0$, the point $x = 0$ is',
      options: ['a regular singular point', 'an ordinary point', 'an irregular singular point', 'a branch point of every solution'], answer: 1,
      sol: 'In standard form $y\'\' - \\frac{2x}{1 - x^2}y\' + \\frac{\\ell(\\ell + 1)}{1 - x^2}y = 0$, both coefficients are analytic at $x = 0$, so it is an ordinary point and a plain power series $\\sum a_kx^k$ works. The singular points are $x = \\pm1$ (both regular).',
      trap: 'Confusing Legendre with Bessel, whose equation is singular at $x = 0$.' },
    { id: 'sfn-011', type: 'mcq', level: 2, exams: ['gate', 'net'], sub: 'Hermite polynomials',
      q: 'Using $H_{n+1} = 2xH_n - 2nH_{n-1}$ with $H_1 = 2x$ and $H_2 = 4x^2 - 2$, the polynomial $H_3(x)$ is',
      options: ['$8x^3 - 4x$', '$8x^3 - 6x$', '$4x^3 - 12x$', '$8x^3 - 12x$'], answer: 3,
      sol: 'With $n = 2$: $H_3 = 2x(4x^2 - 2) - 4(2x) = 8x^3 - 4x - 8x = 8x^3 - 12x$.',
      trap: 'Dropping the $-2nH_{n-1}$ term gives $8x^3 - 4x$.' },
    { id: 'sfn-012', type: 'nat', level: 2, exams: ['gate', 'net'], sub: 'Bessel functions',
      q: 'Given $J_{1/2}(x) = \\sqrt{\\dfrac{2}{\\pi x}}\\sin x$, the value of $J_{1/2}(\\pi/2)$ is ______ (to three decimal places).',
      answer: 0.637, tol: 0.002, calc: () => Math.sqrt(2 / (Math.PI * Math.PI / 2)),
      sol: '$\\sqrt{\\frac{2}{\\pi\\cdot\\pi/2}}\\sin\\frac\\pi2 = \\sqrt{\\frac{4}{\\pi^2}} = \\frac2\\pi \\approx 0.637$.',
      trap: 'Using degrees: the argument of a Bessel function is a pure number (radians).' },
    { id: 'sfn-013', type: 'mcq', level: 2, exams: ['gate', 'net'], sub: 'recurrences',
      q: 'Which recurrence relation do the Bessel functions satisfy?',
      options: ['$J_{n-1}(x) + J_{n+1}(x) = 2J_n\'(x)$', '$J_{n-1}(x) + J_{n+1}(x) = \\dfrac{2n}{x}J_n(x)$', '$J_{n-1}(x) - J_{n+1}(x) = \\dfrac{2n}{x}J_n(x)$', '$J_{n+1}(x) = 2xJ_n(x) - 2nJ_{n-1}(x)$'], answer: 1,
      sol: 'The two standard recurrences are $J_{n-1} + J_{n+1} = \\frac{2n}{x}J_n$ and $J_{n-1} - J_{n+1} = 2J_n\'$. Both follow from differentiating the generating function $e^{(x/2)(t - 1/t)}$ with respect to $t$ and to $x$. The last option is the Hermite recurrence.',
      trap: 'The sum goes with $2n/x$, the difference with the derivative; swapping them is the usual slip.' },
    { id: 'sfn-014', type: 'msq', level: 2, exams: ['gate', 'net'], sub: 'Legendre polynomials',
      q: 'Which statements about the Legendre polynomials are true?',
      options: ['$P_n(-x) = (-1)^nP_n(x)$', '$\\int_{-1}^{1}P_n(x)\\,dx = 0$ for every $n \\ge 1$', '$P_n(0) = 0$ for every $n$', '$P_n$ has exactly $n$ distinct zeros, all inside $(-1, 1)$'], answer: [0, 1, 3],
      sol: 'Parity follows from the generating function ($x \\to -x$, $t \\to -t$). The integral is $\\int P_nP_0\\,dx = 0$ by orthogonality. The zeros are real, simple and inside $(-1, 1)$ (Sturm–Liouville theory). But $P_n(0) = 0$ only for odd $n$: $P_0(0) = 1$, $P_2(0) = -\\tfrac12$.',
      trap: 'Only the odd polynomials vanish at the origin.' },
    { id: 'sfn-015', type: 'mcq', level: 2, exams: ['gate', 'net'], sub: 'generating function',
      q: 'Using the generating function $\\sum_{n\\ge0}P_n(x)t^n = (1 - 2xt + t^2)^{-1/2}$, the sum $\\sum_{n\\ge0}P_n(\\tfrac12)\\left(\\tfrac12\\right)^n$ equals',
      options: ['$1$', '$\\tfrac{\\sqrt3}{2}$', '$2$', '$\\tfrac{2}{\\sqrt3}$'], answer: 3,
      sol: 'Put $x = t = \\tfrac12$: $1 - 2\\cdot\\tfrac12\\cdot\\tfrac12 + \\tfrac14 = \\tfrac34$, and $(\\tfrac34)^{-1/2} = \\tfrac{2}{\\sqrt3} \\approx 1.155$.',
      trap: 'Forgetting the power $-\\tfrac12$ gives $\\tfrac43$ or $\\tfrac{\\sqrt3}{2}$.' },
    { id: 'sfn-016', type: 'mcq', level: 2, exams: ['gate', 'net', 'jam'], sub: 'recurrences',
      q: 'The derivative $\\dfrac{d}{dx}J_0(x)$ equals',
      options: ['$J_1(x)$', '$-J_1(x)$', '$\\tfrac12[J_{-1}(x) + J_1(x)]$', '$\\tfrac{1}{x}J_1(x)$'], answer: 1,
      sol: 'From $J_{n-1} - J_{n+1} = 2J_n\'$ with $n = 0$ and $J_{-1} = -J_1$: $2J_0\' = -J_1 - J_1$, so $J_0\' = -J_1$. Check at small $x$: $J_0 \\approx 1 - x^2/4$ has slope $-x/2$, and $J_1 \\approx x/2$.',
      trap: 'Missing the minus sign, which is the same one as in $\\frac{d}{dx}\\cos x = -\\sin x$.' },

    // ---------- level 3 ----------
    { id: 'sfn-017', type: 'nat', level: 3, exams: ['gate', 'net'], sub: 'Legendre expansions',
      q: 'The value of $\\displaystyle\\int_{-1}^{1}x^3P_3(x)\\,dx$ is ______ (to four decimal places).',
      answer: 0.1143, tol: 0.0005, calc: () => 4 / 35,
      sol: 'Write $x^3$ in Legendre form. $P_3 = \\frac12(5x^3 - 3x)$, so $x^3 = \\frac{2P_3 + 3x}{5} = \\frac25P_3 + \\frac35P_1$. By orthogonality only $\\frac25P_3$ survives: $\\frac25\\cdot\\frac{2}{7} = \\frac{4}{35} \\approx 0.1143$.',
      trap: 'Integrating $x^3\\cdot x^3$ alone, forgetting the $-3x$ part of $P_3$.' },
    { id: 'sfn-018', type: 'nat', level: 3, exams: ['gate', 'net'], sub: 'orthogonality',
      q: 'The value of $\\dfrac{1}{\\sqrt\\pi}\\displaystyle\\int_{-\\infty}^{\\infty}[H_3(x)]^2e^{-x^2}\\,dx$ is ______.',
      answer: 48, tol: 0, calc: () => 2 ** 3 * fact(3),
      sol: 'The Hermite norm is $\\int H_n^2e^{-x^2}dx = 2^nn!\\sqrt\\pi$. For $n = 3$: $8\\cdot6 = 48$. Check directly with $H_3 = 8x^3 - 12x$ and $\\int x^{2k}e^{-x^2}dx = \\sqrt\\pi\\frac{(2k - 1)!!}{2^k}$: $64\\cdot\\frac{15}{8} - 192\\cdot\\frac34 + 144\\cdot\\frac12 = 120 - 144 + 72 = 48$ ✓.',
      trap: 'Using the Legendre-style norm $2/(2n + 1)$ for a different family.' },
    { id: 'sfn-019', type: 'mcq', level: 3, exams: ['gate', 'net'], sub: 'Frobenius method',
      q: 'For Bessel\'s equation of order $\\nu$, $x^2y\'\' + xy\' + (x^2 - \\nu^2)y = 0$, the roots of the indicial equation at $x = 0$ are',
      options: ['$s = 0$ and $s = 1$', '$s = \\nu$ and $s = \\nu + 1$', '$s = \\pm i\\nu$', '$s = \\pm\\nu$'], answer: 3,
      sol: 'Put $y = x^s\\sum a_kx^k$. The lowest power gives $s(s - 1) + s - \\nu^2 = 0$, i.e. $s^2 = \\nu^2$, so $s = \\pm\\nu$. When $2\\nu$ is not an integer these give $J_\\nu$ and $J_{-\\nu}$ independently.',
      trap: 'Dropping the $xy\'$ term: it adds $s$ and turns $s(s - 1)$ into $s^2$.' },
    { id: 'sfn-020', type: 'msq', level: 3, exams: ['gate', 'net'], sub: 'Frobenius method',
      q: 'Consider $4xy\'\' + 2y\' + y = 0$. Which statements are true?',
      options: ['$x = 0$ is a regular singular point', 'The indicial roots are $0$ and $\\tfrac12$', '$y = \\cos\\sqrt x$ is a solution', 'Because the roots differ by $\\tfrac12$, the second solution needs a $\\ln x$ term'], answer: [0, 1, 2],
      sol: 'Standard form: $y\'\' + \\frac{1}{2x}y\' + \\frac{1}{4x}y = 0$; $x\\cdot\\frac{1}{2x}$ and $x^2\\cdot\\frac{1}{4x}$ are analytic, so $x = 0$ is regular singular. With $y = x^s$: $4s(s - 1) + 2s = 0$, so $s = 0, \\tfrac12$. Check $\\cos\\sqrt x$: $y\' = -\\frac{\\sin\\sqrt x}{2\\sqrt x}$, $4xy\'\' = -\\cos\\sqrt x + \\frac{\\sin\\sqrt x}{\\sqrt x}$, $2y\' = -\\frac{\\sin\\sqrt x}{\\sqrt x}$; the sum with $y$ is 0 ✓. A logarithm can appear only when the roots differ by an integer; $\\tfrac12$ is not, so the other solution is simply $\\sin\\sqrt x$.',
      trap: 'The log case needs an integer difference of roots (including 0), not any difference.' },
    { id: 'sfn-021', type: 'mcq', level: 3, exams: ['gate', 'net'], sub: 'Legendre polynomials',
      q: 'Given $P_4(x) = \\tfrac18(35x^4 - 30x^2 + 3)$, the value of $P_4(0)$ is',
      options: ['$-\\tfrac38$', '$\\tfrac38$', '$0$', '$\\tfrac58$'], answer: 1,
      sol: '$P_4(0) = \\frac38$. In general $P_{2m}(0) = (-1)^m\\frac{(2m - 1)!!}{(2m)!!}$: $P_2(0) = -\\frac12$, $P_4(0) = +\\frac{3}{8}$, $P_6(0) = -\\frac{5}{16}$. The signs alternate.',
      trap: 'Carrying the sign of $P_2(0) = -\\tfrac12$ over to $P_4(0)$.' },
    { id: 'sfn-022', type: 'mcq', level: 3, exams: ['gate', 'net'], sub: 'Hermite polynomials',
      q: 'The value of $H_4(0)$ is',
      options: ['$0$', '$-12$', '$12$', '$16$'], answer: 2,
      sol: 'From the recurrence at $x = 0$: $H_{n+1}(0) = -2nH_{n-1}(0)$. $H_0(0) = 1$, $H_2(0) = -2$, $H_4(0) = -6\\cdot(-2) = 12$. (Indeed $H_4 = 16x^4 - 48x^2 + 12$.)',
      trap: 'Odd Hermite polynomials vanish at 0; even ones do not.' },
    { id: 'sfn-023', type: 'mcq', level: 3, exams: ['gate', 'net'], sub: 'Rodrigues formula',
      q: 'Rodrigues\' formula for the Legendre polynomials is',
      options: ['$P_n(x) = \\dfrac{(-1)^n}{2^nn!}e^{x^2}\\dfrac{d^n}{dx^n}e^{-x^2}$', '$P_n(x) = \\dfrac{1}{n!}\\dfrac{d^n}{dx^n}(x^2 - 1)^n$', '$P_n(x) = \\dfrac{1}{2^nn!}\\dfrac{d^n}{dx^n}(x^2 - 1)^n$', '$P_n(x) = \\dfrac{1}{2^n}\\dfrac{d^n}{dx^n}(1 - x^2)^n$'], answer: 2,
      sol: '$\\frac{d^n}{dx^n}(x^2 - 1)^n$ is a polynomial of degree $n$ orthogonal to all lower powers (integrate by parts $n$ times; the boundary terms vanish at $\\pm1$). The factor $\\frac{1}{2^nn!}$ makes $P_n(1) = 1$. The first option is (up to a constant) Hermite\'s Rodrigues formula.',
      trap: 'Without the $2^n$ the value at $x = 1$ is $2^n$, not 1.' },
    { id: 'sfn-024', type: 'mcq', level: 3, exams: ['gate', 'net'], sub: 'Laguerre polynomials',
      q: 'With $L_0 = 1$ and $L_1 = 1 - x$, the expansion of $f(x) = x$ in Laguerre polynomials is',
      options: ['$L_1(x)$', '$L_0(x) + L_1(x)$', '$-L_1(x)$', '$L_0(x) - L_1(x)$'], answer: 3,
      sol: '$L_0 - L_1 = 1 - (1 - x) = x$. Check with orthogonality (weight $e^{-x}$ on $[0, \\infty)$, $L_n$ orthonormal): $c_1 = \\int_0^\\infty xL_1e^{-x}dx = \\int_0^\\infty(x - x^2)e^{-x}dx = 1 - 2 = -1$ ✓.',
      trap: 'Forgetting the $L_0$ part: $-L_1 = x - 1$, not $x$.' },
    { id: 'sfn-025', type: 'msq', level: 3, exams: ['gate', 'net'], sub: 'orthogonality',
      q: 'Which pairings of a family with its orthogonality weight and interval are correct?',
      options: ['Legendre $P_n(x)$: weight 1 on $[-1, 1]$', 'Hermite $H_n(x)$: weight $e^{-x^2}$ on $(-\\infty, \\infty)$', 'Laguerre $L_n(x)$: weight $e^{-x}$ on $[0, \\infty)$', 'Bessel $J_n(\\alpha_kx/a)$ for different zeros $\\alpha_k$ of $J_n$: weight 1 on $[0, a]$'], answer: [0, 1, 2],
      sol: 'The first three are standard. For Bessel functions with different zeros, $\\int_0^axJ_n(\\alpha_kx/a)J_n(\\alpha_lx/a)\\,dx = 0$ for $k \\ne l$: the weight is $x$, which comes from the area element $r\\,dr$ of a disc (Bessel\'s equation in Sturm–Liouville form is $(xy\')\' + \\ldots$).',
      trap: 'The Bessel weight $x$ is easy to forget because the other families hide it in the polynomial.' },
    { id: 'sfn-026', type: 'nat', level: 3, exams: ['gate', 'net'], sub: 'recurrences',
      q: 'Given $J_0(2) = 0.2239$ and $J_1(2) = 0.5767$, use a recurrence to find $J_2(2)$ to four decimal places: ______',
      answer: 0.3528, tol: 0.0005, calc: () => (2 * 1 / 2) * 0.5767 - 0.2239,
      sol: '$J_{n-1} + J_{n+1} = \\frac{2n}{x}J_n$ with $n = 1$, $x = 2$: $J_2(2) = \\frac{2}{2}J_1(2) - J_0(2) = 0.5767 - 0.2239 = 0.3528$.',
      trap: 'Using the derivative recurrence instead: $J_0 - J_2 = 2J_1\'$ needs the slope, which is not given.' },
    { id: 'sfn-027', type: 'mcq', level: 3, exams: ['gate', 'net'], sub: 'generating function',
      q: 'The function $\\exp\\!\\left[\\dfrac x2\\left(t - \\dfrac1t\\right)\\right] = \\sum_{n=-\\infty}^{\\infty}c_n(x)t^n$ generates',
      options: ['the Bessel functions, $c_n = J_n(x)$', 'the Hermite polynomials, $c_n = H_n(x)/n!$', 'the Legendre polynomials, $c_n = P_n(x)$', 'the modified Bessel functions, $c_n = I_n(x)$'], answer: 0,
      sol: 'Multiply $e^{xt/2} = \\sum\\frac{(x/2)^jt^j}{j!}$ by $e^{-x/(2t)} = \\sum\\frac{(-1)^k(x/2)^kt^{-k}}{k!}$; the coefficient of $t^n$ is $\\sum_k\\frac{(-1)^k(x/2)^{n + 2k}}{k!(n + k)!} = J_n(x)$. Hermite\'s generating function is $e^{2xt - t^2}$; $I_n$ comes from $e^{(x/2)(t + 1/t)}$.',
      trap: 'The sign inside decides between $J_n$ (minus) and $I_n$ (plus).' },
    { id: 'sfn-028', type: 'nat', level: 3, exams: ['gate', 'net', 'jam'], sub: 'gamma function',
      q: 'Using the gamma function, $\\displaystyle\\int_0^\\infty x^4e^{-x^2}\\,dx$ is ______ (to three decimal places).',
      answer: 0.665, tol: 0.002, calc: () => (3 * Math.sqrt(Math.PI)) / 8,
      sol: 'Put $u = x^2$, $dx = \\frac{du}{2\\sqrt u}$: $\\int_0^\\infty u^2e^{-u}\\frac{du}{2u^{1/2}} = \\frac12\\Gamma(\\tfrac52) = \\frac12\\cdot\\frac34\\sqrt\\pi = \\frac{3\\sqrt\\pi}{8} \\approx 0.665$.',
      trap: 'Writing $\\Gamma(5)$ or $\\Gamma(2)$: after $u = x^2$ the power is $u^{3/2}$, so the argument is $\\tfrac52$.' },

    // ---------- level 4 ----------
    { id: 'sfn-029', type: 'nat', level: 4, exams: ['gate', 'net'], sub: 'Legendre expansions',
      q: 'In the Legendre series $|x| = \\sum_\\ell c_\\ell P_\\ell(x)$ on $[-1, 1]$, the coefficient $c_2$ is ______ (to three decimal places).',
      answer: 0.625, tol: 0.002, calc: () => (5 / 2) * 2 * integ((x) => x * P(2, x), 0, 1),
      sol: '$c_\\ell = \\frac{2\\ell + 1}{2}\\int_{-1}^{1}f P_\\ell\\,dx$. As $|x|P_2$ is even: $c_2 = \\frac52\\cdot2\\int_0^1x\\cdot\\frac{3x^2 - 1}{2}dx = \\frac52\\left(\\frac34 - \\frac12\\right) = \\frac58 = 0.625$.',
      trap: 'Leaving out the factor $\\frac{2\\ell + 1}{2}$ (the inverse of the norm).' },
    { id: 'sfn-030', type: 'nat', level: 4, exams: ['gate', 'net'], sub: 'recurrences',
      q: 'The value of $\\displaystyle\\int_{-1}^{1}xP_2(x)P_3(x)\\,dx$ is ______ (to four decimal places).',
      answer: 0.1714, tol: 0.0005, calc: () => 6 / 35,
      sol: 'Use $xP_n = \\frac{(n + 1)P_{n+1} + nP_{n-1}}{2n + 1}$ with $n = 2$: $xP_2 = \\frac{3P_3 + 2P_1}{5}$. Then $\\int xP_2P_3 = \\frac35\\cdot\\frac27 = \\frac{6}{35} \\approx 0.1714$.',
      trap: 'Thinking the integral is 0 by orthogonality: the extra $x$ shifts the degree by one.' },
    { id: 'sfn-031', type: 'mcq', level: 4, exams: ['gate', 'net'], sub: 'Frobenius method',
      q: 'For Bessel\'s equation of order 0 the indicial roots are equal ($s = 0, 0$). Near $x = 0$, the second solution $Y_0(x)$ behaves like',
      options: ['$x^{-1}$', '$\\ln x$', '$x$', 'a constant'], answer: 1,
      sol: 'With a repeated root, Frobenius gives one series $J_0$ and a second solution $J_0(x)\\ln x + \\sum b_kx^k$. So $Y_0 \\approx \\frac2\\pi\\ln x$ as $x \\to 0$. That is why a solution regular at the axis of a cylinder must use $J_0$ only.',
      trap: '$x^{-n}$ is the small-$x$ behaviour of $Y_n$ for $n \\ge 1$, not of $Y_0$.' },
    { id: 'sfn-032', type: 'msq', level: 4, exams: ['gate', 'net'], sub: 'Hermite polynomials',
      q: 'Which statements about the Hermite polynomials are true?',
      options: ['$H_n\'(x) = 2nH_{n-1}(x)$', '$H_{n+1}(x) = 2xH_n(x) - 2nH_{n-1}(x)$', 'The oscillator eigenfunctions are $\\psi_n(\\xi) \\propto H_n(\\xi)e^{-\\xi^2/2}$ with $\\xi = x\\sqrt{m\\omega/\\hbar}$', '$H_n(-x) = H_n(x)$ for every $n$'], answer: [0, 1, 2],
      sol: 'Differentiating $e^{2xt - t^2} = \\sum H_nt^n/n!$ with respect to $x$ gives $H_n\' = 2nH_{n-1}$; differentiating with respect to $t$ gives the three-term recurrence. The oscillator states use $H_n$ times the Gaussian. Parity is $H_n(-x) = (-1)^nH_n(x)$, so odd $n$ are odd functions.',
      trap: 'Only even-$n$ Hermite polynomials are even.' },
    { id: 'sfn-033', type: 'nat', level: 4, exams: ['gate', 'net'], sub: 'Bessel zeros',
      q: 'A circular drumhead is fixed at its rim. The first two zeros of $J_0$ are $2.4048$ and $5.5201$. The ratio of the frequency of the second axially symmetric mode to that of the first is ______ (to three decimal places).',
      answer: 2.295, tol: 0.002, calc: () => 5.5201 / 2.4048,
      sol: 'Axially symmetric modes are $J_0(kr)$ with $J_0(ka) = 0$, so $k_n = \\alpha_{0n}/a$ and $\\omega_n = ck_n$. The ratio is $\\alpha_{02}/\\alpha_{01} = 5.5201/2.4048 \\approx 2.295$. Unlike a string, the overtones are not integer multiples: that is why a drum has no clear pitch.',
      trap: 'Expecting 2 as for a string: Bessel zeros are not evenly spaced near the origin.' },
    { id: 'sfn-034', type: 'nat', level: 4, exams: ['gate', 'net'], sub: 'Bessel orthogonality',
      q: 'Let $\\alpha = 2.4048$ be the first zero of $J_0$, with $J_1(\\alpha) = 0.5191$. Using $\\int_0^1xJ_0^2(\\alpha x)\\,dx = \\tfrac12J_1^2(\\alpha)$, find the integral to four decimal places: ______',
      answer: 0.1347, tol: 0.0005, calc: () => 0.5 * 0.5191 ** 2,
      sol: 'The norm formula for a zero $\\alpha$ of $J_n$ is $\\int_0^1xJ_n^2(\\alpha x)dx = \\frac12J_{n+1}^2(\\alpha)$. Here $\\frac12(0.5191)^2 = 0.1347$. This is the denominator when expanding a function on a disc in $J_0(\\alpha_kr)$.',
      trap: 'Squaring $J_0(\\alpha)$, which is zero by definition of $\\alpha$.' },
    { id: 'sfn-035', type: 'mcq', level: 4, exams: ['gate', 'net'], sub: 'associated Legendre',
      q: 'The associated Legendre function $P_\\ell^m(x) = (1 - x^2)^{m/2}\\dfrac{d^m}{dx^m}P_\\ell(x)$ (for $m \\ge 0$) is identically zero when',
      options: ['$m = \\ell$', '$m$ is odd', '$m > \\ell$', '$\\ell$ is odd'], answer: 2,
      sol: '$P_\\ell$ is a polynomial of degree $\\ell$, so its $m$th derivative vanishes for $m > \\ell$. That is why $m$ runs from $-\\ell$ to $\\ell$, giving $2\\ell + 1$ spherical harmonics $Y_\\ell^m$ for each $\\ell$. At $m = \\ell$ the function is $(2\\ell - 1)!!(1 - x^2)^{\\ell/2}$, not zero.',
      trap: '$m = \\ell$ is the last non-zero case, not the first zero one.' },
    { id: 'sfn-036', type: 'mcq', level: 4, exams: ['gate', 'net'], sub: 'gamma function',
      q: 'The value of $\\Gamma(-\\tfrac12)$ is',
      options: ['$-2\\sqrt\\pi$', '$\\tfrac12\\sqrt\\pi$', '$-\\tfrac12\\sqrt\\pi$', 'not defined (it is a pole)'], answer: 0,
      sol: 'Run the recurrence backwards: $\\Gamma(x) = \\Gamma(x + 1)/x$. So $\\Gamma(-\\tfrac12) = \\Gamma(\\tfrac12)/(-\\tfrac12) = -2\\sqrt\\pi \\approx -3.545$. Poles occur only at $0, -1, -2, \\ldots$',
      trap: 'Multiplying by $-\\tfrac12$ instead of dividing.' },
    { id: 'sfn-037', type: 'msq', level: 4, exams: ['gate', 'net'], sub: 'series solutions',
      q: 'Hermite\'s equation is $y\'\' - 2xy\' + 2\\nu y = 0$. With $y = \\sum a_kx^k$, which statements are true?',
      options: ['A polynomial solution exists only when $\\nu$ is a non-negative integer', '$x = 0$ is an ordinary point', '$a_{k+2} = \\dfrac{2(k - \\nu)}{(k + 2)(k + 1)}a_k$', '$x = 0$ is a regular singular point, so a Frobenius factor $x^s$ is needed'], answer: [0, 1, 2],
      sol: 'The coefficients $-2x$ and $2\\nu$ are analytic, so $x = 0$ is ordinary. Matching $x^k$: $(k + 2)(k + 1)a_{k+2} - 2ka_k + 2\\nu a_k = 0$, giving the recurrence. The series stops only if $k = \\nu$ for some $k$, so $\\nu$ must be a non-negative integer; otherwise $a_{k+2}/a_k \\to 2/k$ and $y$ grows like $e^{x^2}$, which would make the oscillator wavefunction $ye^{-x^2/2}$ blow up. That is energy quantisation.',
      trap: 'Ordinary point: no Frobenius exponent is needed.' },

    // ---------- level 5 ----------
    { id: 'sfn-038', type: 'nat', level: 5, exams: ['gate', 'net'], sub: 'Legendre polynomials',
      q: 'The value of $\\displaystyle\\int_{-1}^{1}(1 - x^2)[P_3\'(x)]^2\\,dx$ is ______ (to three decimal places).',
      answer: 3.429, tol: 0.003, calc: () => (2 * 3 * 4) / 7,
      sol: 'Integrate by parts (the boundary term has $1 - x^2 = 0$): $\\int(1 - x^2)P\'P\'dx = -\\int P_3\\frac{d}{dx}[(1 - x^2)P_3\']dx$. Legendre\'s equation says $\\frac{d}{dx}[(1 - x^2)P_n\'] = -n(n + 1)P_n$, so the integral is $n(n + 1)\\int P_n^2 = \\frac{2n(n + 1)}{2n + 1} = \\frac{24}{7} \\approx 3.429$.',
      trap: 'Trying to expand $P_3\'^2$ by brute force; the Sturm–Liouville form does it in one line.' },
    { id: 'sfn-039', type: 'nat', level: 5, exams: ['gate', 'net'], sub: 'Hermite polynomials',
      q: 'The value of $\\dfrac{1}{\\sqrt\\pi}\\displaystyle\\int_{-\\infty}^{\\infty}x^2[H_2(x)]^2e^{-x^2}\\,dx$ is ______.',
      answer: 20, tol: 0, calc: () => 16 * 15 / 8 - 16 * 3 / 4 + 4 * 1 / 2,
      sol: 'Use $xH_n = \\frac12H_{n+1} + nH_{n-1}$: $xH_2 = \\frac12H_3 + 2H_1$. Then $\\int(xH_2)^2e^{-x^2} = \\frac14\\cdot2^33!\\sqrt\\pi + 4\\cdot2\\cdot1!\\sqrt\\pi = (12 + 8)\\sqrt\\pi$. So the answer is 20. Direct check: $x^2H_2^2 = 16x^6 - 16x^4 + 4x^2$, and with $\\langle x^2\\rangle, \\langle x^4\\rangle, \\langle x^6\\rangle = \\frac12, \\frac34, \\frac{15}{8}$ (times $\\sqrt\\pi$): $30 - 12 + 2 = 20$ ✓. In the oscillator this is $\\langle2|\\hat x^2|2\\rangle$ in disguise.',
      trap: 'Forgetting the cross terms cancel by orthogonality only after the recurrence is used.' },
    { id: 'sfn-040', type: 'mcq', level: 5, exams: ['gate', 'net'], sub: 'generating function',
      q: 'For $0 < \\theta < \\pi$, the sum $\\sum_{n=0}^{\\infty}P_n(\\cos\\theta)$ equals',
      options: ['$\\dfrac{1}{1 - \\cos\\theta}$', '$\\dfrac{1}{2\\sin(\\theta/2)}$', '$\\dfrac{1}{2\\cos(\\theta/2)}$', '$\\dfrac{1}{\\sin\\theta}$'], answer: 1,
      sol: 'Set $t = 1$ in the generating function: $(2 - 2\\cos\\theta)^{-1/2} = (4\\sin^2\\tfrac\\theta2)^{-1/2} = \\frac{1}{2\\sin(\\theta/2)}$. Physically: $1/|\\mathbf r - \\mathbf r\'|$ for two points on the unit sphere separated by angle $\\theta$, whose distance is the chord $2\\sin(\\theta/2)$.',
      trap: 'Using $1 - \\cos\\theta = 2\\sin^2(\\theta/2)$ but forgetting the square root.' },
    { id: 'sfn-041', type: 'msq', level: 5, exams: ['gate', 'net'], sub: 'Bessel functions',
      q: 'Which statements about Bessel functions are true?',
      options: ['$J_{-n}(x) = (-1)^nJ_n(x)$ for integer $n$, so $J_n$ and $J_{-n}$ are then not independent', 'For non-integer $\\nu$, $J_\\nu$ and $J_{-\\nu}$ are linearly independent', 'For large $x$, $J_n(x) \\approx \\sqrt{\\dfrac{2}{\\pi x}}\\cos\\left(x - \\dfrac{n\\pi}{2} - \\dfrac\\pi4\\right)$', 'The positive zeros of $J_n$ and $J_{n+1}$ coincide'], answer: [0, 1, 2],
      sol: 'For integer $n$ the terms with $m < n$ in the series of $J_{-n}$ have $1/\\Gamma(\\text{negative integer}) = 0$, and the rest gives $(-1)^nJ_n$; that is why $Y_n$ is needed. For non-integer $\\nu$ the Wronskian $-\\frac{2\\sin\\nu\\pi}{\\pi x}$ is non-zero. The asymptotic form is standard. The zeros of $J_n$ and $J_{n+1}$ interlace (one lies between any two of the other); they never coincide except at 0.',
      trap: 'Interlacing is not coinciding.' },
    { id: 'sfn-042', type: 'nat', level: 5, exams: ['gate', 'net'], sub: 'Wronskian',
      q: 'The Wronskian $W = J_{1/2}J_{-1/2}\' - J_{-1/2}J_{1/2}\'$, with $J_{\\pm1/2}(x) = \\sqrt{2/\\pi x}\\,\\{\\sin x, \\cos x\\}$, evaluated at $x = 1$ is ______ (to three decimal places).',
      answer: -0.637, tol: 0.002, calc: () => -2 / Math.PI,
      sol: 'Write $f = \\sqrt{2/\\pi x}$, $J_{1/2} = f\\sin x$, $J_{-1/2} = f\\cos x$. Then $W = f\\sin x(f\'\\cos x - f\\sin x) - f\\cos x(f\'\\sin x + f\\cos x) = -f^2 = -\\frac{2}{\\pi x}$. At $x = 1$: $-0.637$. This matches the general $W[J_\\nu, J_{-\\nu}] = -\\frac{2\\sin\\nu\\pi}{\\pi x}$ with $\\nu = \\tfrac12$. The $1/x$ dependence is Abel\'s formula for $y\'\' + \\frac1xy\' + \\ldots$.',
      trap: 'Sign: the order $J_{1/2}J_{-1/2}\' - \\ldots$ makes it negative.' },
  ],
  gens: [
    { id: 'sfn-g01', type: 'nat', level: 2, exams: ['gate', 'net'], sub: 'orthogonality',
      make(r) {
        const m = int(r, 0, 2), n = m + int(r, 1, 3), a = int(r, 1, 4), b = int(r, 1, 4);
        const answer = round((2 * a * a) / (2 * m + 1) + (2 * b * b) / (2 * n + 1), 4);
        return { q: `Find $\\displaystyle\\int_{-1}^{1}\\big[${a === 1 ? '' : a}P_{${m}}(x) + ${b === 1 ? '' : b}P_{${n}}(x)\\big]^2dx$ (to four decimal places).`,
          answer, tol: Math.max(2e-4, answer * 0.002), m, n, a, b,
          sol: `Expand the square. The cross term $2\\cdot${a}\\cdot${b}\\int P_{${m}}P_{${n}}dx$ vanishes by orthogonality. With $\\int P_\\ell^2 = \\frac{2}{2\\ell + 1}$: $${a * a}\\cdot\\frac{2}{${2 * m + 1}} + ${b * b}\\cdot\\frac{2}{${2 * n + 1}} \\approx ${answer}$.`,
          trap: 'The squares do not have norm 1: $\\int P_\\ell^2 = 2/(2\\ell + 1)$.' };
      },
      verify: (p) => integ((x) => (p.a * P(p.m, x) + p.b * P(p.n, x)) ** 2, -1, 1, 40000) },
    { id: 'sfn-g02', type: 'nat', level: 3, exams: ['gate', 'net'], sub: 'Legendre expansions',
      make(r) {
        const k = int(r, 2, 4), l = choose(r, k === 2 ? [0, 2] : k === 3 ? [1, 3] : [0, 2, 4]);
        const table = { '2,0': 1 / 3, '2,2': 2 / 3, '3,1': 3 / 5, '3,3': 2 / 5, '4,0': 1 / 5, '4,2': 4 / 7, '4,4': 8 / 35 };
        const c = table[`${k},${l}`], answer = round(c, 4);
        return { q: `In the Legendre series $x^{${k}} = \\sum_\\ell c_\\ell P_\\ell(x)$, find $c_{${l}}$ (to four decimal places).`,
          answer, tol: 5e-4, k, l,
          sol: `$c_\\ell = \\frac{2\\ell + 1}{2}\\int_{-1}^{1}x^{${k}}P_\\ell(x)dx$. Only $\\ell$ with the same parity as ${k} and $\\ell \\le ${k}$ appear. Working the integral (or inverting $P_0, \\ldots, P_4$): $x^2 = \\frac13P_0 + \\frac23P_2$, $x^3 = \\frac35P_1 + \\frac25P_3$, $x^4 = \\frac15P_0 + \\frac47P_2 + \\frac{8}{35}P_4$. So $c_{${l}} \\approx ${answer}$. Check: the coefficients add to 1, because $P_\\ell(1) = 1$.`,
          trap: 'Forgetting the factor $(2\\ell + 1)/2$ that undoes the norm.' };
      },
      verify: (p) => ((2 * p.l + 1) / 2) * integ((x) => x ** p.k * P(p.l, x), -1, 1, 40000) },
    { id: 'sfn-g03', type: 'nat', level: 2, exams: ['gate', 'net'], sub: 'orthogonality',
      make(r) {
        const n = int(r, 1, 6), answer = 2 ** n * fact(n);
        return { q: `Find $\\dfrac{1}{\\sqrt\\pi}\\displaystyle\\int_{-\\infty}^{\\infty}[H_{${n}}(x)]^2e^{-x^2}dx$.`, answer, tol: 0, n,
          sol: `The Hermite norm is $2^nn!\\sqrt\\pi$, so the answer is $2^{${n}}\\cdot${n}! = ${2 ** n}\\cdot${fact(n)} = ${answer}$.`,
          trap: 'Hermite polynomials are orthogonal, not orthonormal.' };
      },
      verify: (p) => integ((x) => H(p.n, x) ** 2 * Math.exp(-x * x), -9, 9, 40000) / Math.sqrt(Math.PI) },
    { id: 'sfn-g04', type: 'mcq', level: 2, exams: ['gate', 'net'], sub: 'Legendre polynomials',
      make(r) {
        const n = int(r, 2, 5), x = choose(r, [0, 0.5, -0.5, 1, -1]);
        const v = round(P(n, x), 5), show = (t) => `$${round(t, 5)}$`;
        const o = mcqOptions(r, v, [-v, round(P(n - 1, x), 5), round(P(n + 1, x), 5), round(v / 2 + 0.25, 5), 1, 0], show);
        return { q: `Using $(\\ell + 1)P_{\\ell+1} = (2\\ell + 1)xP_\\ell - \\ell P_{\\ell-1}$ with $P_0 = 1$, $P_1 = x$, the value of $P_{${n}}(${x})$ is`, ...o,
          sol: `Step up from $P_0(${x}) = 1$ and $P_1(${x}) = ${x}$ with the recurrence, ${n - 1} times. The result is $P_{${n}}(${x}) = ${v}$. Checks: $P_n(1) = 1$, $P_n(-1) = (-1)^n$, and $P_n(0) = 0$ for odd $n$.`,
          trap: 'Mixing up $\\ell$ and $\\ell + 1$ in the recurrence coefficients.' };
      } },
    { id: 'sfn-g05', type: 'nat', level: 3, exams: ['gate', 'net'], sub: 'recurrences',
      make(r) {
        const n = int(r, 1, 3), x = choose(r, [1, 1.5, 2, 2.5, 3, 4]);
        const a = round(J(n - 1, x), 4), b = round(J(n, x), 4), answer = round((2 * n / x) * b - a, 4);
        return { q: `Given $J_{${n - 1}}(${x}) = ${a}$ and $J_{${n}}(${x}) = ${b}$, use a recurrence to find $J_{${n + 1}}(${x})$ (to four decimal places).`,
          answer, tol: 6e-4, n, x,
          sol: `$J_{n-1} + J_{n+1} = \\frac{2n}{x}J_n$ with $n = ${n}$: $J_{${n + 1}}(${x}) = \\frac{${2 * n}}{${x}}(${b}) - (${a}) \\approx ${answer}$.`,
          trap: 'The factor is $2n/x$ with $n$ the middle index, not $n + 1$.' };
      },
      verify: (p) => J(p.n + 1, p.x) },
    { id: 'sfn-g06', type: 'nat', level: 3, exams: ['gate', 'net', 'jam'], sub: 'gamma function',
      make(r) {
        const k = int(r, 0, 3), a = choose(r, [1, 2, 3, 0.5]);
        const answer = round(gamma(k + 0.5) / (2 * a ** (k + 0.5)), 4);
        return { q: `Find $\\displaystyle\\int_0^\\infty x^{${2 * k}}e^{-${a === 1 ? '' : a}x^2}dx$ (to four decimal places).`,
          answer, tol: Math.max(2e-4, answer * 0.003), k, a,
          sol: `Put $u = ${a}x^2$: the integral becomes $\\frac{1}{2\\cdot${a}^{${k} + 1/2}}\\int_0^\\infty u^{${k} - 1/2}e^{-u}du = \\frac{\\Gamma(${k} + \\frac12)}{2\\cdot${a}^{${k + 0.5}}}$, with $\\Gamma(\\tfrac12) = \\sqrt\\pi$ and $\\Gamma(x + 1) = x\\Gamma(x)$. Value $\\approx ${answer}$.`,
          trap: 'The argument of $\\Gamma$ is $k + \\tfrac12$, not $2k + 1$.' };
      },
      verify: (p) => integ((x) => x ** (2 * p.k) * Math.exp(-p.a * x * x), 0, 14, 40000) },
    { id: 'sfn-g07', type: 'mcq', level: 3, exams: ['gate', 'net'], sub: 'Frobenius method',
      make(r) {
        const s1 = int(r, -2, 2), s2 = s1 + choose(r, [0.5, 1, 1.5, 2, 3]);
        // indicial: s^2 - (s1+s2)s + s1 s2 = 0  <=>  s(s-1) + p0 s + q0 = 0 with p0 = 1 - (s1+s2), q0 = s1 s2
        const p0 = round(1 - (s1 + s2), 2), q0 = round(s1 * s2, 2);
        const show = (pr) => `$s = ${pr[0]}$ and $s = ${pr[1]}$`;
        const lo = Math.min(s1, s2), hi = Math.max(s1, s2);
        const o = mcqOptions(r, [lo, hi], [[-hi, -lo], [lo - 1, hi - 1], [lo + 1, hi + 1], [-lo, hi + 1]], show);
        const cf = (v) => (Math.abs(v) === 1 ? '' : Math.abs(v)), P0 = p0 === 0 ? '' : `${p0 < 0 ? '- ' : '+ '}${cf(p0)}xy'`, Q0 = q0 === 0 ? '' : ` ${sgn(q0)}`;
        return { q: `For $x^2y'' ${P0} + (x^2${Q0})y = 0$, the roots of the indicial equation at $x = 0$ are`, ...o,
          sol: `The point $x = 0$ is regular singular with $p_0 = ${p0}$ and $q_0 = ${q0}$ (the $x^2y$ term only affects higher powers). The indicial equation is $s(s - 1) + p_0s + q_0 = 0$, i.e. $s^2 ${sgn(round(p0 - 1, 2))}s ${sgn(q0)} = 0$, with roots $s = ${lo}$ and $s = ${hi}$.`,
          trap: 'Writing $s^2 + p_0s + q_0$: the $y\'\'$ term gives $s(s - 1)$, not $s^2$.' };
      } },
    { id: 'sfn-g08', type: 'nat', level: 2, exams: ['gate', 'net'], sub: 'Hermite polynomials',
      make(r) {
        const n = int(r, 2, 6), x = choose(r, [0, 1, -1, 0.5, 2]);
        const answer = round(H(n, x), 4);
        return { q: `Using $H_{n+1} = 2xH_n - 2nH_{n-1}$ with $H_0 = 1$, $H_1 = 2x$, find $H_{${n}}(${x})$.`,
          answer, tol: Math.max(1e-3, Math.abs(answer) * 1e-4), n, x,
          sol: `Step up from $H_0 = 1$, $H_1(${x}) = ${2 * x}$, using the recurrence at $x = ${x}$. After ${n - 1} steps, $H_{${n}}(${x}) = ${answer}$.`,
          trap: 'The coefficient of $H_{n-1}$ is $2n$ with the old index $n$.' };
      },
      verify: (p) => Hsum(p.n, p.x) },
    { id: 'sfn-g09', type: 'nat', level: 4, exams: ['gate', 'net'], sub: 'Bessel zeros',
      make(r) {
        const Z = { '0,1': 2.4048, '0,2': 5.5201, '1,1': 3.8317, '1,2': 7.0156, '2,1': 5.1356 };
        const key = choose(r, Object.keys(Z)), [m, n] = key.split(',').map(Number), alpha = Z[key];
        const a = choose(r, [0.1, 0.15, 0.2, 0.25, 0.3]), c = choose(r, [60, 80, 100, 120]);
        const answer = round((alpha * c) / (2 * Math.PI * a), 1);
        return { q: `A circular membrane of radius ${a} m, fixed at the rim, carries transverse waves at ${c} m/s. Find the frequency (in Hz) of the mode $${m === 0 ? 'J_0(kr)' : `J_{${m}}(kr)\\cos ${m === 1 ? '' : m}\\phi`}$ with ${n === 1 ? 'no' : 'one'} nodal circle inside the rim. Zeros: $j_{0,1} = 2.4048$, $j_{0,2} = 5.5201$, $j_{1,1} = 3.8317$, $j_{1,2} = 7.0156$, $j_{2,1} = 5.1356$.`,
          answer, unit: 'Hz', tol: Math.max(0.2, answer * 0.005), alpha, a, c,
          sol: `The rim condition is $J_{${m}}(ka) = 0$, so $ka = j_{${m},${n}} = ${alpha}$ (the ${n === 1 ? 'first' : 'second'} zero gives ${n === 1 ? 'no' : 'one'} interior nodal circle). Then $f = \\frac{ck}{2\\pi} = \\frac{${c}\\times${alpha}}{2\\pi\\times${a}} \\approx ${answer}$ Hz.`,
          trap: 'Using $\\omega$ instead of $f$: divide by $2\\pi$.' };
      },
      verify: (p) => (p.alpha * p.c) / (2 * Math.PI * p.a) },
    { id: 'sfn-g10', type: 'nat', level: 4, exams: ['gate', 'net'], sub: 'recurrences',
      make(r) {
        const n = int(r, 1, 5), up = r() < 0.5, m = up ? n + 1 : n - 1;
        const answer = round(up ? (2 * (n + 1)) / ((2 * n + 1) * (2 * n + 3)) : (2 * n) / ((2 * n - 1) * (2 * n + 1)), 4);
        return { q: `Find $\\displaystyle\\int_{-1}^{1}xP_{${n}}(x)P_{${m}}(x)\\,dx$ (to four decimal places).`, answer, tol: 3e-4, n, m,
          sol: `Use $xP_n = \\frac{(n + 1)P_{n+1} + nP_{n-1}}{2n + 1}$ with $n = ${n}$, then orthogonality: only the $P_{${m}}$ term survives, giving $\\frac{${up ? n + 1 : n}}{${2 * n + 1}}\\cdot\\frac{2}{${2 * m + 1}} \\approx ${answer}$.`,
          trap: 'The integral is not zero: multiplying by $x$ raises and lowers the degree by one.' };
      },
      verify: (p) => integ((x) => x * P(p.n, x) * P(p.m, x), -1, 1, 40000) },
    { id: 'sfn-g11', type: 'msq', level: 3, exams: ['gate', 'net'], sub: 'parity',
      make(r) {
        const n = int(r, 2, 9), odd = n % 2 === 1;
        const options = [`$P_{${n}}(0) = 0$`, `$H_{${n}}(0) = 0$`, `$P_{${n}}(-1) = ${odd ? -1 : 1}$`, `$\\int_{-1}^{1}P_{${n}}(x)\\,dx = \\dfrac{2}{${2 * n + 1}}$`];
        const answer = odd ? [0, 1, 2] : [2];
        return { q: `For $n = ${n}$, which statements are true?`, options, answer,
          sol: `$P_n(-x) = (-1)^nP_n(x)$ and $H_n(-x) = (-1)^nH_n(x)$. For ${odd ? 'odd' : 'even'} $n = ${n}$ the functions are ${odd ? 'odd, so both vanish at 0' : 'even, so neither vanishes at 0 in general'}. $P_n(-1) = (-1)^n = ${odd ? -1 : 1}$ always. The last integral is $\\int P_nP_0 = 0$ for $n \\ge 1$; $\\frac{2}{2n + 1}$ is the norm $\\int P_n^2$.`,
          trap: 'Confusing $\\int P_n$ (zero) with $\\int P_n^2$ (the norm).' };
      } },
    { id: 'sfn-g12', type: 'nat', level: 4, exams: ['gate', 'net'], sub: 'spherical Bessel',
      make(r) {
        const x = choose(r, [1, 1.5, 2, 2.5, 3, 4, 5]);
        const answer = round(Math.sqrt(2 / (Math.PI * x)) * (Math.sin(x) / x - Math.cos(x)), 4);
        return { q: `Using $J_{1/2}(x) = \\sqrt{\\frac{2}{\\pi x}}\\sin x$, $J_{-1/2}(x) = \\sqrt{\\frac{2}{\\pi x}}\\cos x$ and the recurrence $J_{\\nu-1} + J_{\\nu+1} = \\frac{2\\nu}{x}J_\\nu$, find $J_{3/2}(${x})$ (to four decimal places).`,
          answer, tol: 4e-4, x,
          sol: `With $\\nu = \\tfrac12$: $J_{3/2} = \\frac1xJ_{1/2} - J_{-1/2} = \\sqrt{\\frac{2}{\\pi x}}\\left(\\frac{\\sin x}{x} - \\cos x\\right)$. At $x = ${x}$ (radians): $\\approx ${answer}$.`,
          trap: 'Half-integer Bessel functions are elementary; they are the spherical Bessel functions in disguise, $j_\\ell(x) = \\sqrt{\\pi/2x}\\,J_{\\ell+1/2}(x)$.' };
      },
      verify: (p) => J(1.5, p.x) },
  ],
};
