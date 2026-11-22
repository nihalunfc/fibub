// Extra question shapes for special-functions (templates sfn-m31..m35). Imported by special-functions.js.
import { int, choose, mcqOptions, shuffle } from '../_util.js';
import { msqOf, frac } from './_more.js';
import { matchOne } from './_odd.js';

const fact = (n) => (n <= 1 ? 1 : n * fact(n - 1));

export default [
  { id: 'sfn-m31', type: 'msq', level: 3, exams: ['gate', 'net'], sub: 'properties', format: 'statements',
    make(r) {
      const n = int(r, 2, 6), not = r() < 0.5, odd = n % 2 === 1;
      const m = msqOf(r, [
        [`$P_{${n}}(-x) = ${odd ? '-' : ''}P_{${n}}(x)$`, true, `$P_n$ has the parity of $n$: $P_n(-x) = (-1)^nP_n(x)$, and $(-1)^{${n}} = ${odd ? -1 : 1}$.`],
        [`$P_{${n}}(-1) = ${odd ? 1 : -1}$`, false, `$P_n(-1) = (-1)^n = ${odd ? -1 : 1}$.`],
        [`$P_{${n}}(0) = 0$`, odd, odd ? 'An odd polynomial vanishes at 0.' : `For even $n$, $P_n(0) = (-1)^{n/2}\\dfrac{(n - 1)!!}{n!!} \\ne 0$.`],
        [`$P_{${n}}$ has exactly ${n} distinct zeros, all in $(-1, 1)$`, true, 'Orthogonal polynomials of degree $n$ have $n$ simple real zeros inside the interval of orthogonality.'],
        [`$\\displaystyle\\int_{-1}^{1}P_{${n}}^2\\,dx = \\tfrac{2}{${2 * n + 1}}$`, true, 'The normalisation is $2/(2n + 1)$.'],
        [`$\\displaystyle\\int_{-1}^{1}P_{${n}}^2\\,dx = 1$`, false, `Legendre polynomials are orthogonal but not normalised: the integral is $2/(2n + 1) = ${frac(2, 2 * n + 1)}$.`],
        [`$H_{${n}}(0) = 0$`, odd, odd ? 'Hermite polynomials also have the parity of $n$, so odd ones vanish at 0.' : `For even $n$, $H_n(0) = (-1)^{n/2}\\dfrac{n!}{(n/2)!} \\ne 0$.`],
        [`the coefficient of $x^{${n}}$ in $H_{${n}}(x)$ is $${2 ** n}$`, true, `Physicists' Hermite polynomials have leading coefficient $2^n = ${2 ** n}$.`],
        [`$J_{${n}}(0) = 0$`, true, `$J_n(x) \\approx (x/2)^n/n!$ near 0, which vanishes for $n \\ge 1$.`],
        [`$J_{${n}}(0) = 1$`, false, 'Only $J_0(0) = 1$; every $J_n$ with $n \\ge 1$ vanishes at the origin.'],
      ], { not });
      return { q: `Which of the following statements are ${not ? '<b>NOT</b> correct' : 'correct'}? ($P_n$: Legendre, $H_n$: Hermite (physicists\'), $J_n$: Bessel.)`, ...m,
        trap: 'Parity decides values at 0; $P_n(1) = 1$ for all $n$ but $P_n(-1) = (-1)^n$.' };
    } },
  { id: 'sfn-m32', type: 'mcq', level: 2, exams: ['gate', 'net'], sub: 'which equation', format: 'match',
    make(r) {
      const l = int(r, 2, 5), nu = int(r, 1, 4);
      const L = { leg: 'Legendre polynomials', bes: 'Bessel functions', her: 'Hermite polynomials', lag: 'Laguerre polynomials', che: 'Chebyshev polynomials', airy: 'Airy functions' };
      const cas = choose(r, [
        [`(1 - x^2)y'' - 2xy' + ${l * (l + 1)}y = 0`, 'leg', `Legendre's equation with $\\ell(\\ell + 1) = ${l * (l + 1)}$, so $\\ell = ${l}$ and the polynomial solution is $P_{${l}}$. It arises from the angular part of Laplace's equation in spherical coordinates.`],
        [`x^2y'' + xy' + (x^2 - ${nu * nu})y = 0`, 'bes', `Bessel's equation of order $\\nu = ${nu}$ (from Laplace or Helmholtz in cylindrical coordinates).`],
        [`y'' - 2xy' + ${2 * l}y = 0`, 'her', `Hermite's equation with $2n = ${2 * l}$, so $H_{${l}}$ (the quantum oscillator).`],
        [`xy'' + (1 - x)y' + ${l}y = 0`, 'lag', `Laguerre's equation with $n = ${l}$ (the radial hydrogen problem).`],
        [`(1 - x^2)y'' - xy' + ${l * l}y = 0`, 'che', `Chebyshev's equation with $n^2 = ${l * l}$; $T_{${l}}(\\cos\\theta) = \\cos ${l}\\theta$.`],
        ['y\'\' - xy = 0', 'airy', 'Airy\'s equation: the Schrödinger equation in a linear potential (near a classical turning point).'],
      ]);
      return { q: `The equation $${cas[0]}$ has as its standard solutions the`, ...matchOne(r, L, cas),
        trap: 'Look at the coefficient of $y\'$: $-2x$ with $(1 - x^2)$ is Legendre, $-x$ with $(1 - x^2)$ is Chebyshev, $-2x$ alone is Hermite.' };
    } },
  { id: 'sfn-m33', type: 'mcq', level: 3, exams: ['gate', 'net'], sub: 'asymptotics', format: 'limiting case',
    make(r) {
      const nu = int(r, 2, 3), l = int(r, 1, 3);
      const cas = choose(r, [
        [`$J_{${nu}}(x)$ as $x \\to 0$`, `$\\dfrac{(x/2)^{${nu}}}{${nu}!}$`, [`$\\sqrt{\\dfrac{2}{\\pi x}}\\cos\\left(x - \\dfrac{${nu}\\pi}{2} - \\dfrac{\\pi}{4}\\right)$`, `$\\dfrac{${fact(nu)}}{(x/2)^{${nu}}}$`, '$\\dfrac{2}{\\pi}\\ln x$'], `The leading term of the power series $J_\\nu = \\sum_k \\dfrac{(-1)^k}{k!\\,\\Gamma(k + \\nu + 1)}(x/2)^{2k + \\nu}$ is $k = 0$: $(x/2)^{${nu}}/${nu}!$.`],
        [`$J_{${nu}}(x)$ as $x \\to \\infty$`, `$\\sqrt{\\dfrac{2}{\\pi x}}\\cos\\left(x - \\dfrac{${nu}\\pi}{2} - \\dfrac{\\pi}{4}\\right)$`, [`$\\dfrac{(x/2)^{${nu}}}{${nu}!}$`, '$\\dfrac{e^{x}}{\\sqrt{2\\pi x}}$', `$\\cos\\left(x - \\dfrac{${nu}\\pi}{2}\\right)$`], 'For large $x$ Bessel functions behave like damped cosines with amplitude $\\propto x^{-1/2}$ (energy spreading over a growing circle) and a phase shift $\\nu\\pi/2 + \\pi/4$.'],
        ['$Y_0(x)$ as $x \\to 0^+$', '$\\dfrac{2}{\\pi}\\ln x$ (diverging to $-\\infty$)', ['$1 - x^2/4$', '$x/2$', '$-\\dfrac{2}{\\pi x}$'], 'The second solution of order 0 has a logarithmic singularity, $Y_0 \\approx \\tfrac{2}{\\pi}[\\ln(x/2) + \\gamma]$; that is why it is dropped when the region contains the axis.'],
        [`$I_{${nu}}(x)$ (modified Bessel) as $x \\to \\infty$`, '$\\dfrac{e^{x}}{\\sqrt{2\\pi x}}$', ['$\\sqrt{\\dfrac{\\pi}{2x}}e^{-x}$', `$\\sqrt{\\dfrac{2}{\\pi x}}\\cos\\left(x - \\dfrac{${nu}\\pi}{2} - \\dfrac{\\pi}{4}\\right)$`, `$\\dfrac{(x/2)^{${nu}}}{${nu}!}$`], '$I_\\nu(x) = i^{-\\nu}J_\\nu(ix)$ grows exponentially: $I_\\nu \\approx e^{x}/\\sqrt{2\\pi x}$ for any order.'],
        [`$K_{${nu}}(x)$ (modified Bessel) as $x \\to \\infty$`, '$\\sqrt{\\dfrac{\\pi}{2x}}e^{-x}$', ['$\\dfrac{e^{x}}{\\sqrt{2\\pi x}}$', `$\\sqrt{\\dfrac{2}{\\pi x}}\\sin\\left(x - \\dfrac{${nu}\\pi}{2} - \\dfrac{\\pi}{4}\\right)$`, '$\\dfrac{2}{\\pi}\\ln x$'], '$K_\\nu$ is the decaying solution of the modified equation, $\\approx\\sqrt{\\pi/(2x)}\\,e^{-x}$, used for fields that die away outside a cylinder.'],
        [`the spherical Bessel function $j_{${l}}(x)$ as $x \\to \\infty$`, `$\\dfrac{\\sin(x - ${l === 1 ? '' : l}\\pi/2)}{x}$`, [`$\\dfrac{\\cos(x - ${l === 1 ? '' : l}\\pi/2)}{x}$`, `$\\dfrac{x^{${l}}}{${2 * l + 1}!!}$`, `$\\sqrt{\\dfrac{2}{\\pi x}}\\sin(x - ${l === 1 ? '' : l}\\pi/2)$`], `$j_0 = \\sin x/x$, and in general $j_\\ell \\approx \\sin(x - \\ell\\pi/2)/x$: a spherical wave falls off as $1/x$, and each unit of $\\ell$ adds a phase lag of $\\pi/2$.`],
      ]);
      const o = mcqOptions(r, cas[1], shuffle(r, cas[2]));
      return { q: `Which is the leading behaviour of ${cas[0]}?`, ...o, sol: cas[3],
        trap: 'Ordinary Bessel functions oscillate for large $x$; modified ones grow ($I$) or decay ($K$) exponentially.' };
    } },
  { id: 'sfn-m34', type: 'mcq', level: 3, exams: ['gate', 'net'], sub: 'beta function',
    make(r) {
      const m = int(r, 3, 5), n = int(r, 3, 6);
      const val = (p, q, s) => frac(p, q * s);
      const ans = frac(fact(m - 1) * fact(n - 1), fact(m + n - 1));
      const ws = [frac(fact(m) * fact(n), fact(m + n)), frac(fact(m - 1) * fact(n - 1), fact(m + n)), frac(1, m + n - 1), val(1, m, n)];
      const o = mcqOptions(r, `$${ans}$`, shuffle(r, ws.map((x) => `$${x}$`)));
      return { q: `The value of $\\displaystyle\\int_0^1 x^{${m - 1}}(1 - x)^{${n - 1}}\\,dx$ is`, ...o,
        sol: `This is the beta function $B(${m}, ${n}) = \\dfrac{\\Gamma(${m})\\Gamma(${n})}{\\Gamma(${m + n})} = \\dfrac{${m - 1}!\\,${n - 1}!}{${m + n - 1}!} = \\dfrac{${fact(m - 1) * fact(n - 1)}}{${fact(m + n - 1)}} = ${ans}$.`,
        trap: `The exponents are $m - 1$ and $n - 1$: here $B(${m}, ${n})$, not $B(${m - 1}, ${n - 1})$.` };
    } },
  { id: 'sfn-m35', type: 'mcq', level: 3, exams: ['gate', 'net'], sub: 'Bessel zeros', format: 'estimation',
    make(r) {
      const X = choose(r, [4, 7, 10, 13, 17, 20, 23, 26, 29, 32]);
      const ans = Math.floor(X / Math.PI + 0.25);
      const o = mcqOptions(r, ans, shuffle(r, [ans - 1, ans + 1, ans + 2, Math.round(X / Math.PI) === ans ? ans - 2 : Math.round(X / Math.PI)].filter((v) => v >= 0)));
      return { q: `How many zeros does the Bessel function $J_0(x)$ have in the interval $0 \\lt x \\lt ${X}$?`, ...o,
        sol: `For large $x$, $J_0(x) \\approx \\sqrt{2/(\\pi x)}\\cos(x - \\pi/4)$, so its zeros sit near $x_m = (m - \\tfrac14)\\pi$: 2.40, 5.52, 8.65, 11.79, 14.93, 18.07, 21.21, 24.35, 27.49, 30.63, ... (the first is 2.405). Counting those below ${X}: $m - \\tfrac14 \\lt ${X}/\\pi = ${(X / Math.PI).toFixed(2)}$, so ${ans} zero${ans === 1 ? '' : 's'}.`,
        trap: 'The zeros are spaced by about $\\pi$ but start at 2.405, not at 0 (unlike $\\sin x$).' };
    } },
];
