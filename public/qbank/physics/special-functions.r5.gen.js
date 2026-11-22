// Round 5 extras for special-functions: original questions, written 2026-11-22.
import { int, choose, mcqOptions, round } from '../_util.js';
import { simpson } from './_more.js';
const R = String.raw;
const fact = (n) => (n <= 1 ? 1 : n * fact(n - 1));
// Lanczos approximation of the gamma function for x > 0
function gamma(x) {
  const g = 7, c = [0.99999999999980993, 676.5203681218851, -1259.1392167224028, 771.32342877765313, -176.61502916214059, 12.507343278686905, -0.13857109526572012, 9.9843695780195716e-6, 1.5056327351493116e-7];
  if (x < 0.5) return Math.PI / (Math.sin(Math.PI * x) * gamma(1 - x));
  x -= 1; let a = c[0]; const t = x + g + 0.5;
  for (let i = 1; i < g + 2; i++) a += c[i] / (x + i);
  return Math.sqrt(2 * Math.PI) * t ** (x + 0.5) * Math.exp(-t) * a;
}

export default {
  items: [
    { id: 'sfn-r5-01', type: 'mcq', level: 1, exams: ['jam'], sub: 'bessel functions',
      q: R`The value of the Bessel function $J_0(0)$ is`,
      options: [R`$0$`, R`$\tfrac12$`, R`$1$`, R`It is infinite`], answer: 2,
      sol: R`$J_0(x) = 1 - \frac{x^2}{4} + \frac{x^4}{64} - \dots$, so $J_0(0) = 1$. Every $J_n$ with $n\ge1$ starts with $x^n$ and vanishes at 0; it is $Y_0$, the second solution, that diverges there.`,
      trap: R`Mixing up $J_0$ (finite, equal to 1 at the origin) with the Neumann function $Y_0$ (logarithmically infinite).` },
    { id: 'sfn-r5-02', type: 'nat', level: 2, exams: ['jam'], sub: 'legendre polynomials',
      q: R`With $P_2(x) = \tfrac12(3x^2 - 1)$, the value of $P_2(1/2)$ is ______ (three decimal places).`,
      answer: -0.125, tol: 0.001, calc: () => 0.5 * (3 * 0.25 - 1),
      sol: R`$P_2(1/2) = \tfrac12\left(3\cdot\tfrac14 - 1\right) = \tfrac12\left(-\tfrac14\right) = -\tfrac18 = -0.125$. Negative values are normal: $P_2$ has zeros at $x = \pm1/\sqrt3\approx\pm0.577$ and is negative between them.`,
      trap: R`Dropping the factor $\tfrac12$ gives $-0.25$.` },
    { id: 'sfn-r5-03', type: 'mcq', level: 2, exams: ['jam'], sub: 'gamma function',
      q: R`The product $\Gamma\!\left(\tfrac12\right)\Gamma\!\left(\tfrac32\right)$ equals`,
      options: [R`$\pi$`, R`$\dfrac{\pi}{2}$`, R`$\dfrac{\sqrt\pi}{2}$`, R`$1$`], answer: 1,
      sol: R`$\Gamma(\tfrac12) = \sqrt\pi$ and $\Gamma(\tfrac32) = \tfrac12\Gamma(\tfrac12) = \tfrac{\sqrt\pi}{2}$. Product: $\sqrt\pi\cdot\tfrac{\sqrt\pi}2 = \tfrac\pi2$.`,
      trap: R`$\Gamma(x)\Gamma(1 - x) = \pi/\sin\pi x$ needs arguments adding to 1; here they add to 2, so the answer is not $\pi$.` },
    { id: 'sfn-r5-04', type: 'msq', level: 3, exams: ['jam', 'gate'], sub: 'legendre polynomials', format: 'statements',
      q: R`For the Legendre polynomials $P_n(x)$ with $n\ge1$, which statements are true?`,
      options: [R`$P_n(-x) = (-1)^nP_n(x)$`, R`$P_n$ has exactly $n$ distinct zeros, all inside $(-1, 1)$`, R`$\displaystyle\int_{-1}^{1}P_n(x)\,dx = 0$`, R`$|P_n(x)|$ can exceed 1 somewhere in $[-1, 1]$`], answer: [0, 1, 2],
      sol: R`$P_n$ contains only powers of the parity of $n$, so $P_n(-x) = (-1)^nP_n(x)$. As orthogonal polynomials on $[-1, 1]$, they have $n$ simple zeros inside the interval. $\int P_n\,dx = \int P_nP_0\,dx = 0$ for $n\ge1$ by orthogonality. And $|P_n(x)|\le1$ on $[-1, 1]$, with equality at the ends.`,
      trap: R`Large coefficients (like $\tfrac{35}{8}$ in $P_4$) suggest big values, but the terms cancel; $P_n$ never leaves $[-1, 1]$ there.` },
    { id: 'sfn-r5-05', type: 'nat', level: 3, exams: ['jam', 'gate'], sub: 'gamma function',
      q: R`The value of $\displaystyle\int_0^{\infty}x^3e^{-2x}\,dx$ is ______ (three decimal places).`,
      answer: 0.375, tol: 0.001, calc: () => 6 / 16,
      sol: R`Put $u = 2x$: $\int_0^\infty\left(\frac u2\right)^3e^{-u}\frac{du}2 = \frac{1}{16}\Gamma(4) = \frac{6}{16} = 0.375$. In general $\int_0^\infty x^ne^{-ax}dx = n!/a^{n+1}$.`,
      trap: R`Using $a^n$ instead of $a^{n+1}$ gives $6/8 = 0.75$.` },
    { id: 'sfn-r5-06', type: 'mcq', level: 3, exams: ['jam', 'gate'], sub: 'hermite polynomials',
      q: R`For the physicists' Hermite polynomials, the derivative $H_3'(x)$ equals`,
      options: [R`$3H_2(x)$`, R`$6xH_2(x)$`, R`$2H_2(x)$`, R`$6H_2(x)$`], answer: 3,
      sol: R`The rule is $H_n'(x) = 2nH_{n-1}(x)$. Check: $H_3 = 8x^3 - 12x$, so $H_3' = 24x^2 - 12 = 6(4x^2 - 2) = 6H_2$.`,
      trap: R`$H_n' = nH_{n-1}$ is the rule for the probabilists' $He_n$, not for $H_n$.` },
    { id: 'sfn-r5-07', type: 'nat', level: 4, exams: ['jam', 'gate'], sub: 'beta function',
      q: R`The value of $\displaystyle\int_0^{\pi/2}\sqrt{\tan\theta}\,d\theta$ is ______ (three decimal places).`,
      answer: 2.221, tol: 0.002, calc: () => Math.PI / Math.SQRT2,
      sol: R`Write $\sqrt{\tan\theta} = \sin^{1/2}\theta\cos^{-1/2}\theta$ and use $\int_0^{\pi/2}\sin^{2p-1}\theta\cos^{2q-1}\theta\,d\theta = \tfrac12B(p, q)$ with $p = \tfrac34$, $q = \tfrac14$. So the integral is $\tfrac12\Gamma(\tfrac34)\Gamma(\tfrac14)/\Gamma(1) = \tfrac12\cdot\frac{\pi}{\sin(\pi/4)} = \frac{\pi}{\sqrt2}\approx2.221$.`,
      trap: R`Matching the powers as $2p = \tfrac12$ (forgetting the "$-1$" in $2p - 1$) gives the wrong beta arguments.` },
    { id: 'sfn-r5-08', type: 'mcq', level: 4, exams: ['gate', 'net'], sub: 'spherical bessel',
      q: R`Given the spherical Bessel function $j_0(x) = \dfrac{\sin x}{x}$ and $j_1(x) = -j_0'(x)$, the function $j_1(x)$ is`,
      options: [R`$\dfrac{\cos x}{x}$`, R`$\dfrac{\sin x}{x^2} - \dfrac{\cos x}{x}$`, R`$\dfrac{\cos x}{x} - \dfrac{\sin x}{x^2}$`, R`$\dfrac{\sin x}{x^2}$`], answer: 1,
      sol: R`$j_0' = \frac{x\cos x - \sin x}{x^2} = \frac{\cos x}{x} - \frac{\sin x}{x^2}$, so $j_1 = -j_0' = \frac{\sin x}{x^2} - \frac{\cos x}{x}$. Check small $x$: $\frac{x - x^3/6}{x^2} - \frac{1 - x^2/2}{x} = \frac{x}{3} + \dots$, which vanishes at 0 like $x^1$, as $j_1$ must.`,
      trap: R`Leaving out the minus sign in $j_1 = -j_0'$ gives a function that starts at $-x/3$.` },
    { id: 'sfn-r5-09', type: 'msq', level: 5, exams: ['gate', 'net'], sub: 'orthogonality', format: 'statements',
      q: R`Which orthogonality statements are correct (each with its usual interval)?`,
      options: [R`Hermite $H_n$: weight $e^{-x^2}$ on $(-\infty, \infty)$`, R`Laguerre $L_n$: weight $e^{-x}$ on $[0, \infty)$`, R`Chebyshev $T_n$: weight $(1 - x^2)^{-1/2}$ on $[-1, 1]$`, R`$J_0(\alpha_mx)$, with $\alpha_m$ the zeros of $J_0$: weight 1 on $[0, 1]$`], answer: [0, 1, 2],
      sol: R`Each family is the eigenfunction set of a Sturm-Liouville problem, and the weight is the one in that problem. Hermite: $e^{-x^2}$ on the whole line. Laguerre: $e^{-x}$ on the half-line. Chebyshev: $1/\sqrt{1 - x^2}$ on $[-1, 1]$. The Bessel functions $J_0(\alpha_mx)$ come from the radial part of the Laplacian in a disc, where the area element brings a factor $x$: $\int_0^1xJ_0(\alpha_mx)J_0(\alpha_nx)\,dx = 0$ for $m\ne n$. With weight 1 the integral is not zero in general.`,
      trap: R`Forgetting the weight $x$ (from $r\,dr$ in polar coordinates) for Fourier-Bessel series.` },
    { id: 'sfn-r5-10', type: 'nat', level: 4, exams: ['jam', 'gate'], sub: 'gamma function',
      q: R`The value of $\displaystyle\int_0^{\infty}e^{-x^4}\,dx$ is ______ (three decimal places).`,
      answer: 0.906, tol: 0.002, calc: () => gamma(1.25),
      sol: R`Put $u = x^4$, so $x = u^{1/4}$ and $dx = \tfrac14u^{-3/4}du$: $\int_0^\infty e^{-u}\tfrac14u^{-3/4}du = \tfrac14\Gamma\!\left(\tfrac14\right) = \Gamma\!\left(\tfrac54\right)\approx0.906$. (With $\Gamma(\tfrac14)\approx3.6256$.)`,
      trap: R`Using $\Gamma(\tfrac14)$ without the factor $\tfrac14$ gives 3.63, far more than the integral of a function never above 1 that dies by $x\approx2$.` },
  ],
  gens: [
    { id: 'sfn-r5g1', type: 'nat', level: 2, exams: ['jam'], sub: 'gamma function',
      make(r) {
        const n = int(r, 1, 5), a = choose(r, [0.5, 1, 2, 3]);
        const v = fact(n) / a ** (n + 1);
        const dp = v >= 100 ? 1 : 4;
        return { q: R`Find $\displaystyle\int_0^{\infty}x^{${n}}e^{-${a === 1 ? '' : a}x}\,dx$ (${dp === 1 ? 'one decimal place' : 'four decimal places'}).`,
          answer: round(v, dp), tol: dp === 1 ? 0.1 : Math.max(0.0002, round(v * 0.001, 4)), n, a,
          sol: R`Substitute $u = ${a}x$: $\int_0^\infty\left(\frac{u}{${a}}\right)^{${n}}e^{-u}\frac{du}{${a}} = \frac{\Gamma(${n + 1})}{${a}^{${n + 1}}} = \frac{${fact(n)}}{${a ** (n + 1)}}\approx${round(v, dp)}$.`,
          trap: 'The power of $a$ is $n + 1$ (one extra from $dx = du/a$), and $\\Gamma(n + 1) = n!$, not $(n + 1)!$.' };
      },
      verify: (p) => simpson((x) => x ** p.n * Math.exp(-p.a * x), 0, 120 / p.a, 20000) },
    { id: 'sfn-r5g2', type: 'mcq', level: 2, exams: ['jam', 'gate'], sub: 'hermite polynomials',
      make(r) {
        const n = int(r, 2, 7);
        const o = mcqOptions(r, `$${2 * n}H_{${n - 1}}(x)$`, [`$${n}H_{${n - 1}}(x)$`, `$${2 * n}H_{${n + 1}}(x)$`, `$2xH_{${n}}(x)$`]);
        return { q: R`For the physicists' Hermite polynomials (generating function $e^{2xt - t^2}$), the derivative $H_{${n}}'(x)$ equals`, ...o,
          sol: R`Differentiate the generating function in $x$: $2t\,e^{2xt - t^2} = \sum_nH_n'(x)\frac{t^n}{n!}$. The left side is $\sum_m2H_m\frac{t^{m+1}}{m!}$; matching $t^n$ gives $\frac{H_n'}{n!} = \frac{2H_{n-1}}{(n - 1)!}$, i.e. $H_n' = 2nH_{n-1}$. For $n = ${n}$: $H_{${n}}' = ${2 * n}H_{${n - 1}}$.`,
          trap: 'Without the factor 2 ($nH_{n-1}$) is the rule for the probabilists\' polynomials $He_n$.' };
      } },
    { id: 'sfn-r5g3', type: 'nat', level: 4, exams: ['jam', 'gate'], sub: 'gamma function',
      make(r) {
        const p = int(r, 2, 6), c = choose(r, [1, 2, 3]);
        const v = c * gamma(1 + 1 / p);
        return { q: R`Find $\displaystyle\int_0^{\infty}${c === 1 ? '' : c}e^{-x^{${p}}}\,dx$ (three decimal places).`,
          answer: round(v, 3), tol: Math.max(0.002, round(v * 0.002, 3)), p, c,
          sol: R`Put $u = x^{${p}}$: $dx = \tfrac1${p}u^{1/${p} - 1}du$, so $\int_0^\infty e^{-x^{${p}}}dx = \tfrac1${p}\Gamma\!\left(\tfrac1${p}\right) = \Gamma\!\left(1 + \tfrac1${p}\right)\approx${round(gamma(1 + 1 / p), 4)}$.${c === 1 ? '' : ` Times ${c}: $${round(v, 3)}$.`}${p === 2 ? ' (For $p = 2$ this is $\\sqrt\\pi/2$.)' : ''}`,
          trap: 'Forgetting the $\\tfrac1p$ from the substitution gives $\\Gamma(1/p)$, which is $p$ times too big.' };
      },
      verify: (p) => p.c * simpson((x) => Math.exp(-(x ** p.p)), 0, 8, 8000) },
  ],
};
