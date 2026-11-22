// Round 4 extras for special-functions: original questions, written 2026-11-22.
import { int, choose, round } from '../_util.js';
import { simpson } from './_more.js';
const R = String.raw;

const fact = (n) => (n <= 1 ? 1 : n * fact(n - 1));
const dfact = (n) => (n <= 1 ? 1 : n * dfact(n - 2));
/** Gamma(n/2) for a positive integer n. */
const gHalf = (n) => (n % 2 === 0 ? fact(n / 2 - 1) : (Math.sqrt(Math.PI) * dfact(n - 2)) / 2 ** ((n - 1) / 2));
/** Legendre P_n(x) from the explicit sum. */
const legendre = (n, x) => {
  let s = 0;
  for (let k = 0; 2 * k <= n; k++) s += ((-1) ** k * fact(2 * n - 2 * k)) / (2 ** n * fact(k) * fact(n - k) * fact(n - 2 * k)) * x ** (n - 2 * k);
  return s;
};

export default {
  items: [
    { id: 'sfn-r4-01', type: 'mcq', level: 1, exams: ['jam', 'gate'], sub: 'gamma function',
      q: R`The value of $\Gamma(5)$ is`,
      options: [R`$120$`, R`$24$`, R`$5$`, R`$4$`], answer: 1,
      sol: R`$\Gamma(n) = (n - 1)!$ for positive integers, so $\Gamma(5) = 4! = 24$.`,
      trap: R`$\Gamma(5)$ is $4!$, not $5! = 120$: the argument is shifted by one.` },
    { id: 'sfn-r4-02', type: 'mcq', level: 2, exams: ['jam', 'gate'], sub: 'Legendre polynomials',
      q: R`The Legendre polynomial $P_3(x)$ (normalised so that $P_3(1) = 1$) is`,
      options: [R`$\tfrac12(3x^3 - 5x)$`, R`$\tfrac12(5x^3 + 3x)$`, R`$\tfrac12(5x^3 - 3x)$`, R`$\tfrac18(35x^3 - 30x)$`], answer: 2,
      sol: R`From $(n + 1)P_{n+1} = (2n + 1)xP_n - nP_{n-1}$ with $n = 2$: $3P_3 = 5x\cdot\tfrac12(3x^2 - 1) - 2x = \tfrac{15x^3 - 5x - 4x}{2}$, so $P_3 = \tfrac12(5x^3 - 3x)$. Check: $P_3(1) = 1$, and it is odd, as $P_n$ has the parity of $n$. The other options fail $P(1) = 1$.`,
      trap: R`The last option mixes in the $P_4$ coefficients (35 and 30).` },
    { id: 'sfn-r4-03', type: 'nat', level: 2, exams: ['jam', 'gate'], sub: 'gamma function',
      q: R`The value of $\Gamma(3/2)$ is ______ (three decimal places).`,
      answer: 0.886, tol: 0.002, calc: () => Math.sqrt(Math.PI) / 2,
      sol: R`$\Gamma(x + 1) = x\Gamma(x)$ with $x = \tfrac12$: $\Gamma(3/2) = \tfrac12\Gamma(1/2) = \tfrac{\sqrt\pi}{2}\approx0.886$.`,
      trap: R`Using $\Gamma(1/2) = \pi$ instead of $\sqrt\pi$.` },
    { id: 'sfn-r4-04', type: 'mcq', level: 3, exams: ['jam', 'gate'], sub: 'Legendre polynomials',
      q: R`For every non-negative integer $n$, the value of $P_n(-1)$ is`,
      options: [R`$1$`, R`$0$`, R`$(-1)^{n+1}$`, R`$(-1)^n$`], answer: 3,
      sol: R`$P_n$ has the parity of $n$: $P_n(-x) = (-1)^nP_n(x)$. With $P_n(1) = 1$ this gives $P_n(-1) = (-1)^n$. (From the generating function at $x = -1$: $(1 + 2t + t^2)^{-1/2} = \frac{1}{1 + t} = \sum(-t)^n$.)`,
      trap: R`$P_n(0)$ vanishes for odd $n$; that is the value at 0, not at $-1$.` },
    { id: 'sfn-r4-05', type: 'nat', level: 3, exams: ['jam', 'gate'], sub: 'generating functions',
      q: R`The Hermite polynomials have generating function $e^{2xt - t^2} = \displaystyle\sum_{n\ge0}H_n(x)\frac{t^n}{n!}$. The value of $\displaystyle\sum_{n\ge0}H_n(0)\frac{(0.5)^n}{n!}$ is ______ (four decimal places).`,
      answer: 0.7788, tol: 0.0003, calc: () => Math.exp(-0.25),
      sol: R`Put $x = 0$ and $t = 0.5$ in the generating function: the sum is $e^{0 - 0.25} = e^{-1/4}\approx0.7788$. Term by term: $H_0(0) = 1$, $H_2(0) = -2$, $H_4(0) = 12$, ... give $1 - \tfrac{2}{2}(0.25) + \tfrac{12}{24}(0.0625) - \dots$, the series of $e^{-t^2}$.`,
      trap: R`Summing the series term by term is slow; the generating function gives it at once.` },
    { id: 'sfn-r4-06', type: 'msq', level: 3, exams: ['jam', 'gate'], sub: 'gamma function', format: 'statements',
      q: R`Which statements about the gamma function $\Gamma(x)$ for real $x$ are true?`,
      options: [R`$\Gamma(n + 1) = n!$ for non-negative integers $n$`, R`$\Gamma(x)$ has poles at $x = 0, -1, -2, \dots$`, R`$\Gamma(1/2) = \sqrt\pi$`, R`$\Gamma(x) > 0$ at every real $x$ where it is finite`], answer: [0, 1, 2],
      sol: R`$\Gamma(1) = 1$ and $\Gamma(x + 1) = x\Gamma(x)$ give the factorials. Running the recurrence backwards, $\Gamma(x) = \Gamma(x + 1)/x$ blows up at $0$ and then at every negative integer. $\Gamma(1/2) = \int_0^\infty t^{-1/2}e^{-t}dt = 2\int_0^\infty e^{-u^2}du = \sqrt\pi$. But $\Gamma(-\tfrac12) = \Gamma(\tfrac12)/(-\tfrac12) = -2\sqrt\pi < 0$: between $-1$ and 0 it is negative, and its sign alternates on each interval between poles.`,
      trap: R`$\Gamma$ is positive for $x > 0$ only.` },
    { id: 'sfn-r4-07', type: 'nat', level: 4, exams: ['gate', 'net'], sub: 'Bessel functions', format: 'integer',
      q: R`Using the expansion $e^{ix\sin\theta} = \displaystyle\sum_{n=-\infty}^{\infty}J_n(x)e^{in\theta}$, the value of $J_0(x)^2 + 2\displaystyle\sum_{n\ge1}J_n(x)^2$ for any real $x$ is ______.`,
      answer: 1, tol: 0, calc: () => 1,
      sol: R`The left side is a Fourier series in $\theta$ with coefficients $J_n(x)$. Parseval: $\frac{1}{2\pi}\int_0^{2\pi}|e^{ix\sin\theta}|^2d\theta = \sum_n|J_n(x)|^2$. The integrand is 1, so $\sum_nJ_n^2 = 1$. Since $J_{-n} = (-1)^nJ_n$, the negative $n$ repeat the positive ones: $J_0^2 + 2\sum_{n\ge1}J_n^2 = 1$. (So $|J_n(x)|\le1$ always.)`,
      trap: R`Forgetting the negative-$n$ terms gives a sum that is not constant.` },
    { id: 'sfn-r4-08', type: 'mcq', level: 4, exams: ['gate', 'net'], sub: 'asymptotics',
      q: R`For large positive $x$, the Bessel function $J_\nu(x)$ behaves as`,
      options: [R`$\sqrt{\dfrac{2}{\pi x}}\cos\left(x - \dfrac{\nu\pi}{2} - \dfrac\pi4\right)$`, R`$\sqrt{\dfrac{2}{\pi x}}\sin\left(x - \dfrac{\nu\pi}{2} - \dfrac\pi4\right)$`, R`$\dfrac1x\cos\left(x - \dfrac{\nu\pi}{2}\right)$`, R`$\sqrt{\dfrac{2}{\pi x}}\,e^{-x}$`], answer: 0,
      sol: R`For large $x$, Bessel's equation with $y = u/\sqrt x$ becomes $u'' + u\approx0$, so $J_\nu$ oscillates like $\cos(x - \delta)/\sqrt x$: the $1/\sqrt x$ keeps the energy flux of a cylindrical wave constant. The phase $\delta = \nu\pi/2 + \pi/4$ comes from matching; check with $J_{1/2} = \sqrt{2/(\pi x)}\sin x = \sqrt{2/(\pi x)}\cos(x - \pi/2)$, which is exactly the first option with $\nu = \tfrac12$. The sine form is the large-$x$ behaviour of $Y_\nu$; $e^{-x}$ belongs to the modified function $K_\nu$.`,
      trap: R`Decaying like $1/x$ is too fast; cylindrical waves fall off as $1/\sqrt x$.` },
    { id: 'sfn-r4-09', type: 'msq', level: 3, exams: ['jam', 'gate'], sub: 'spherical harmonics', format: 'statements',
      q: R`Which statements about the spherical harmonics $Y_\ell^m(\theta, \phi)$ are true?`,
      options: [R`$Y_0^0 = \dfrac{1}{\sqrt{4\pi}}$`, R`For a given $\ell$ there are $2\ell + 1$ of them`, R`$Y_\ell^m\propto e^{im\phi}$`, R`$Y_1^0\propto\sin\theta$`], answer: [0, 1, 2],
      sol: R`$Y_0^0$ is constant and normalised over the sphere: $|Y_0^0|^2\cdot4\pi = 1$. For each $\ell$, $m$ runs over $-\ell, \dots, \ell$: $2\ell + 1$ values. Each is $P_\ell^m(\cos\theta)e^{im\phi}$ up to a constant. $Y_1^0\propto P_1(\cos\theta) = \cos\theta$, not $\sin\theta$ (which appears in $Y_1^{\pm1}$).`,
      trap: R`Mixing up $Y_1^0\propto\cos\theta$ (the $p_z$ shape) with $Y_1^{\pm1}\propto\sin\theta\,e^{\pm i\phi}$.` },
    { id: 'sfn-r4-10', type: 'mcq', level: 5, exams: ['gate', 'net'], sub: 'Legendre polynomials',
      q: R`The derivative $P_n'(1)$ of the Legendre polynomial at $x = 1$ equals`,
      options: [R`$n^2$`, R`$1$`, R`$\dfrac{n(n + 1)}{2}$`, R`$\dfrac{n(n - 1)}{2}$`], answer: 2,
      sol: R`Put $x = 1$ in Legendre's equation $(1 - x^2)P'' - 2xP' + n(n + 1)P = 0$. The first term vanishes, leaving $-2P_n'(1) + n(n + 1)P_n(1) = 0$. With $P_n(1) = 1$: $P_n'(1) = n(n + 1)/2$. Check: $P_2 = \tfrac12(3x^2 - 1)$ gives $P_2'(1) = 3$.`,
      trap: R`Guessing from $P_n(1) = 1$ that the slope is also simple; the ODE at the endpoint gives it directly.` },
    { id: 'sfn-r4-11', type: 'nat', level: 4, exams: ['jam', 'gate'], sub: 'beta function',
      q: R`The value of $\displaystyle\int_0^1\sqrt{x(1 - x)}\,dx$ is ______ (four decimal places).`,
      answer: 0.3927, tol: 0.0003, calc: () => Math.PI / 8,
      sol: R`It is the beta function $B(\tfrac32, \tfrac32) = \frac{\Gamma(3/2)^2}{\Gamma(3)} = \frac{(\sqrt\pi/2)^2}{2} = \frac\pi8\approx0.3927$. Geometric check: $y = \sqrt{x(1 - x)}$ is the upper half of the circle of radius $\tfrac12$ centred at $(\tfrac12, 0)$, with area $\tfrac12\pi(\tfrac12)^2 = \pi/8$.`,
      trap: R`Using $\Gamma(3) = 3! = 6$ instead of $2! = 2$ gives $\pi/24$.` },
    { id: 'sfn-r4-12', type: 'nat', level: 5, exams: ['gate', 'net'], sub: 'associated Legendre functions',
      q: R`With $P_\ell^m(x) = (1 - x^2)^{m/2}\dfrac{d^m}{dx^m}P_\ell(x)$, the value of $\displaystyle\int_{-1}^{1}\left[P_2^1(x)\right]^2dx$ is ______ (one decimal place).`,
      answer: 2.4, tol: 0.01, calc: () => (2 / 5) * (fact(3) / fact(1)),
      sol: R`$P_2 = \tfrac12(3x^2 - 1)$, so $P_2' = 3x$ and $P_2^1 = 3x\sqrt{1 - x^2}$. Then $\int_{-1}^1 9x^2(1 - x^2)dx = 9\left(\tfrac23 - \tfrac25\right) = \tfrac{12}{5} = 2.4$. This matches the general norm $\frac{2}{2\ell + 1}\frac{(\ell + m)!}{(\ell - m)!} = \frac25\cdot\frac{3!}{1!}$.`,
      trap: R`Using the $m = 0$ norm $\frac{2}{2\ell + 1} = 0.4$ forgets the factorial ratio.` },
  ],
  gens: [
    { id: 'sfn-r4g1', type: 'nat', level: 3, exams: ['jam', 'gate'], sub: 'beta function',
      make(r) {
        const p = int(r, 1, 6), q2 = int(r, 0, 5);
        const v = (gHalf(p + 1) * gHalf(q2 + 1)) / (2 * gHalf(p + q2 + 2));
        const pw = (f, k) => (k === 0 ? '' : k === 1 ? `\\${f}\\theta` : `\\${f}^{${k}}\\theta`);
        return { q: R`Using the beta function, $\displaystyle\int_0^{\pi/2}${pw('sin', p)}${q2 ? '\\,' : ''}${pw('cos', q2)}\,d\theta$ = ______ (four decimal places).`,
          answer: round(v, 4), tol: 0.0003, p, q2,
          sol: R`$\int_0^{\pi/2}\sin^p\theta\cos^q\theta\,d\theta = \tfrac12B\left(\tfrac{p + 1}{2}, \tfrac{q + 1}{2}\right) = \frac{\Gamma\left(\frac{p + 1}{2}\right)\Gamma\left(\frac{q + 1}{2}\right)}{2\,\Gamma\left(\frac{p + q + 2}{2}\right)}$. Here $p = ${p}$, $q = ${q2}$: $\frac{\Gamma(${p + 1}/2)\,\Gamma(${q2 + 1}/2)}{2\,\Gamma(${p + q2 + 2}/2)} = \frac{${round(gHalf(p + 1), 4)}\times${round(gHalf(q2 + 1), 4)}}{2\times${round(gHalf(p + q2 + 2), 4)}}\approx${round(v, 4)}$. (Use $\Gamma(\tfrac12) = \sqrt\pi$ and $\Gamma(x + 1) = x\Gamma(x)$.)`,
          trap: 'Forgetting the factor $\\tfrac12$ in front of the beta function doubles the answer.' };
      },
      verify: (p) => simpson((t) => Math.sin(t) ** p.p * Math.cos(t) ** p.q2, 0, Math.PI / 2, 2000) },
    { id: 'sfn-r4g2', type: 'nat', level: 3, exams: ['jam', 'gate'], sub: 'Legendre polynomials',
      make(r) {
        const n = int(r, 3, 6), x = choose(r, [0.2, 0.3, 0.5, -0.4, 0.6, -0.5, 0.8]);
        const P = [1, x];
        for (let k = 1; k < n; k++) P.push(((2 * k + 1) * x * P[k] - k * P[k - 1]) / (k + 1));
        const rows = P.slice(2).map((v, i) => `P_${i + 2} = ${round(v, 5)}`).join(', ');
        return { q: R`Using $(n + 1)P_{n+1}(x) = (2n + 1)xP_n(x) - nP_{n-1}(x)$ with $P_0 = 1$ and $P_1 = x$, the value of $P_${n}(${x})$ is ______ (four decimal places).`,
          answer: round(P[n], 4), tol: 0.0002, n, x,
          sol: R`Step the recurrence at $x = ${x}$: $${rows}$. So $P_${n}(${x})\approx${round(P[n], 4)}$. (Check: $|P_n(x)|\le1$ on $[-1, 1]$.)`,
          trap: 'Using $(2n + 1)xP_n - nP_{n-1}$ without dividing by $n + 1$ lets the values grow past 1.' };
      },
      verify: (p) => legendre(p.n, p.x) },
    { id: 'sfn-r4g3', type: 'nat', level: 4, exams: ['gate', 'net'], sub: 'orthogonality',
      make(r) {
        const m = int(r, 0, 4), k = choose(r, [m, m + 2, m + 1, m - 1 < 0 ? m + 2 : m - 1, m + 4].slice(0, 5));
        const ok = k >= m && (k - m) % 2 === 0;
        const v = ok ? (2 * fact(k)) / (dfact(k - m) * dfact(k + m + 1)) : 0;
        return { q: R`The value of $\displaystyle\int_{-1}^{1}x^{${k}}P_{${m}}(x)\,dx$ is ______ (four decimal places).`,
          answer: round(v, 4), tol: 0.0002, m, k,
          sol: ok
            ? R`Since $k - m = ${k - m}$ is even and non-negative, the integral is not zero. The general result is $\int_{-1}^1x^kP_m(x)\,dx = \frac{2\,k!}{(k - m)!!\,(k + m + 1)!!}$ (from Rodrigues' formula and $m$ integrations by parts). Here: $\frac{2\cdot${k}!}{${k - m}!!\cdot${k + m + 1}!!} = \frac{${2 * fact(k)}}{${dfact(k - m) * dfact(k + m + 1)}}\approx${round(v, 4)}$.`
            : R`${k < m ? `$x^{${k}}$ is a polynomial of degree ${k} < ${m}, so it is a combination of $P_0, \\dots, P_{${k}}$, all orthogonal to $P_{${m}}$.` : `$x^{${k}}P_{${m}}(x)$ is an odd function (the parities of $x^{${k}}$ and $P_{${m}}$ differ), so its integral over $[-1, 1]$ vanishes.`} The value is 0.`,
          trap: 'Two quick zero tests come first: a power below $m$ is orthogonal to $P_m$, and mismatched parity integrates to zero.' };
      },
      verify: (p) => simpson((x) => x ** p.k * legendre(p.m, x), -1, 1, 2000) },
  ],
};
