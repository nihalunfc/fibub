// Round 4 extras for calculus-and-series: original questions, written 2026-11-22.
import { int, choose, round } from '../_util.js';
const R = String.raw;
const simpson = (f, a, b, n = 2000) => { const h = (b - a) / n; let s = f(a) + f(b); for (let i = 1; i < n; i++) s += f(a + i * h) * (i % 2 ? 4 : 2); return s * h / 3; };

export default {
  items: [
    { id: 'cal-r4-01', type: 'mcq', level: 1, exams: ['jam'], sub: 'differentiation',
      q: R`The derivative of $\ln(\sin x)$ (for $0 < x < \pi$) is`,
      options: [R`$\dfrac{1}{\sin x}$`, R`$\tan x$`, R`$\cot x$`, R`$-\cot x$`], answer: 2,
      sol: R`Chain rule: $\dfrac{d}{dx}\ln u = \dfrac{u'}{u}$ with $u = \sin x$, so the derivative is $\dfrac{\cos x}{\sin x} = \cot x$.`,
      trap: R`$1/\sin x$ forgets to multiply by the derivative of the inside.` },
    { id: 'cal-r4-02', type: 'nat', level: 2, exams: ['jam'], sub: 'even and odd functions',
      q: R`The value of $\displaystyle\int_{-2}^{2}\left(x^5 - 3x^3\sin^2x + 1\right)dx$ is ______.`,
      answer: 4, tol: 0, calc: () => 4,
      sol: R`$x^5$ is odd, and $x^3\sin^2x$ is odd (odd times even), so both integrate to zero over the symmetric interval. Only the constant is left: $\int_{-2}^{2}1\,dx = 4$.`,
      trap: R`$\sin^2x$ is even, so it does not change the oddness of $x^3$.` },
    { id: 'cal-r4-03', type: 'nat', level: 2, exams: ['jam'], sub: 'physics approximations',
      q: R`Air pressure falls with height as $p = p_0e^{-h/H}$ with $H = 8$ km. Using the first-order approximation $e^{-u} \approx 1 - u$, the pressure 100 m above the ground is lower than at the ground by about ______ %.`,
      answer: 1.25, tol: 0.01, unit: '%', calc: () => 100 * 0.1 / 8,
      sol: R`$u = h/H = 0.1/8 = 0.0125$, so $p \approx p_0(1 - 0.0125)$: a drop of $1.25\%$. (The exact value $1 - e^{-0.0125} = 1.242\%$ differs only at second order, $u^2/2 \approx 0.008\%$.)`,
      trap: R`Keep the units the same: 100 m is 0.1 km, not 100 km.` },
    { id: 'cal-r4-04', type: 'msq', level: 3, exams: ['jam'], sub: 'definite integrals', format: 'statements',
      q: R`Which of these improper integrals converge?`,
      options: [R`$\displaystyle\int_1^\infty\frac{dx}{x^{1.01}}$`, R`$\displaystyle\int_0^1\frac{dx}{\sqrt x}$`, R`$\displaystyle\int_0^1\frac{dx}{x}$`, R`$\displaystyle\int_0^\infty\frac{e^{-x}}{\sqrt x}\,dx$`], answer: [0, 1, 3],
      sol: R`At infinity $\int^\infty x^{-p}dx$ converges for $p > 1$: $p = 1.01$ converges (to 100). Near 0, $\int_0 x^{-p}dx$ converges for $p < 1$: $p = \tfrac12$ converges (to 2), $p = 1$ diverges like $\ln x$. The last is $\Gamma(\tfrac12) = \sqrt\pi$: the $x^{-1/2}$ near 0 is integrable and $e^{-x}$ kills the tail.`,
      trap: R`The test exponent flips: $p > 1$ is needed at infinity, $p < 1$ at zero.` },
    { id: 'cal-r4-05', type: 'mcq', level: 3, exams: ['jam'], sub: 'indeterminate forms',
      q: R`The value of $\displaystyle\lim_{x\to\infty}x\left(\frac\pi2 - \tan^{-1}x\right)$ is`,
      options: [R`$0$`, R`$1$`, R`$\dfrac\pi2$`, R`$\infty$`], answer: 1,
      sol: R`For $x > 0$, $\dfrac\pi2 - \tan^{-1}x = \tan^{-1}\dfrac1x \approx \dfrac1x - \dfrac1{3x^3}$. Multiplying by $x$ gives $1 - \dfrac1{3x^2} \to 1$. (Or L'Hôpital on $\dfrac{\pi/2 - \tan^{-1}x}{1/x}$: $\dfrac{-1/(1 + x^2)}{-1/x^2} \to 1$.)`,
      trap: R`"$\infty\times0$" is indeterminate; it is neither 0 nor $\infty$ automatically.` },
    { id: 'cal-r4-06', type: 'mcq', level: 3, exams: ['jam'], sub: 'geometric series',
      q: R`The sum $\displaystyle\sum_{n=1}^{\infty}\frac{1}{n(n + 2)}$ equals`,
      options: [R`$\dfrac34$`, R`$1$`, R`$\dfrac12$`, R`$\dfrac32$`], answer: 0,
      sol: R`Partial fractions: $\dfrac1{n(n + 2)} = \dfrac12\left(\dfrac1n - \dfrac1{n + 2}\right)$. In the sum every $1/m$ with $m \ge 3$ cancels, leaving $\dfrac12\left(1 + \dfrac12\right) = \dfrac34$.`,
      trap: R`Two terms survive the telescoping here ($1$ and $\tfrac12$), not just the first.` },
    { id: 'cal-r4-07', type: 'nat', level: 3, exams: ['jam'], sub: 'definite integrals',
      q: R`The value of $\displaystyle\int_0^{\pi/2}\sin^5x\,dx$ is ______ (to three decimal places).`,
      answer: 0.533, tol: 0.002, calc: () => 8 / 15,
      sol: R`Write $\sin^5x = (1 - \cos^2x)^2\sin x$ and put $u = \cos x$: $\displaystyle\int_0^1(1 - u^2)^2du = 1 - \tfrac23 + \tfrac15 = \tfrac{8}{15} = 0.533$. (Wallis: $\tfrac45\cdot\tfrac23 = \tfrac8{15}$ for odd powers, with no factor $\pi/2$.)`,
      trap: R`The factor $\pi/2$ in Wallis' formula belongs to even powers only.` },
    { id: 'cal-r4-08', type: 'mcq', level: 4, exams: ['jam', 'gate'], sub: 'convergence',
      q: R`The radius of convergence of $\displaystyle\sum_{n\ge1}\frac{n!}{n^n}x^n$ is`,
      options: [R`$1$`, R`$\dfrac1e$`, R`$\infty$`, R`$e$`], answer: 3,
      sol: R`Ratio of successive coefficients: $\dfrac{(n + 1)!/(n + 1)^{n+1}}{n!/n^n} = \dfrac{n^n}{(n + 1)^n} = \left(1 + \dfrac1n\right)^{-n} \to \dfrac1e$. The series converges for $|x|/e < 1$, so $R = e$. (Stirling agrees: $n!/n^n \approx \sqrt{2\pi n}\,e^{-n}$.)`,
      trap: R`$1/e$ is the limit of the coefficient ratio; the radius is its reciprocal.` },
    { id: 'cal-r4-09', type: 'msq', level: 4, exams: ['jam', 'gate'], sub: 'indeterminate forms', format: 'statements',
      q: R`For $f(x) = x^{1/x}$ with $x > 0$, which statements are true?`,
      options: [R`$f$ has its largest value at $x = e$`, R`$f(x) \to 1$ as $x\to\infty$`, R`$f(x) \to 0$ as $x\to0^+$`, R`$f$ increases for all $x > 0$`], answer: [0, 1, 2],
      sol: R`$\ln f = \dfrac{\ln x}{x}$, whose derivative $\dfrac{1 - \ln x}{x^2}$ is positive for $x < e$ and negative for $x > e$: the maximum is at $x = e$, $f(e) = e^{1/e} \approx 1.44$, and $f$ falls after it. As $x\to\infty$, $\ln x/x\to0$, so $f\to1$. As $x\to0^+$, $\ln x/x\to-\infty$, so $f\to0$.`,
      trap: R`Unlike $x^x$ (which tends to 1 at $0^+$), $x^{1/x}$ tends to 0 there.` },
    { id: 'cal-r4-10', type: 'nat', level: 5, exams: ['jam', 'gate'], sub: 'definite integrals',
      q: R`Differentiating under the integral sign with respect to $a$, find $\displaystyle\int_0^1\frac{x^3 - 1}{\ln x}\,dx =$ ______ (to three decimal places).`,
      answer: 1.386, tol: 0.002, calc: () => Math.log(4),
      sol: R`Let $I(a) = \displaystyle\int_0^1\frac{x^a - 1}{\ln x}dx$, so $I(0) = 0$. Since $\dfrac{\partial}{\partial a}x^a = x^a\ln x$, $I'(a) = \displaystyle\int_0^1x^a\,dx = \dfrac1{a + 1}$. Then $I(a) = \ln(1 + a)$ and $I(3) = \ln4 = 1.386$. The integrand is finite at both ends ($\to3$ as $x\to1$, $\to0$ as $x\to0$).`,
      trap: R`Fix the constant with $I(0) = 0$; without it the answer is undetermined.` },
  ],
  gens: [
    { id: 'cal-r4g1', type: 'nat', level: 3, exams: ['jam'], sub: 'definite integrals',
      make(r) {
        const n = int(r, 2, 9), fn = choose(r, ['sin', 'cos']);
        let num = 1, den = 1; for (let k = n; k >= 1; k -= 2) { den *= k; if (k - 1 >= 1) num *= k - 1; }
        const val = (num / den) * (n % 2 === 0 ? Math.PI / 2 : 1), answer = round(val, 4);
        const chain = []; for (let k = n; k >= 2; k -= 2) chain.push(`\\tfrac{${k - 1}}{${k}}`);
        return { q: R`Find $\displaystyle\int_0^{\pi/2}${fn === 'sin' ? '\\sin' : '\\cos'}^{${n}}x\,dx$ (to four decimal places).`,
          answer, tol: 0.0005, n,
          sol: R`Wallis' formula (the same for $\sin$ and $\cos$ on $[0, \pi/2]$): $${chain.join('\\cdot')}${n % 2 === 0 ? '\\cdot\\tfrac\\pi2' : ''} = ${answer}$. ${n % 2 === 0 ? 'For even powers the chain ends with the factor $\\pi/2$.' : 'For odd powers there is no factor $\\pi/2$.'}`,
          trap: 'Reduce the power by 2 at each step: $I_n = \\frac{n - 1}{n}I_{n-2}$.' };
      },
      verify: (p) => simpson((x) => Math.sin(x) ** p.n, 0, Math.PI / 2) },
    { id: 'cal-r4g2', type: 'nat', level: 5, exams: ['jam', 'gate'], sub: 'definite integrals',
      make(r) {
        const a = int(r, 1, 7), b = int(r, 0, a - 1);
        const answer = round(Math.log((1 + a) / (1 + b)), 4);
        return { q: R`Find $\displaystyle\int_0^1\frac{x^{${a}} - ${b === 0 ? '1' : `x^{${b}}`}}{\ln x}\,dx$ (to four decimal places).`,
          answer, tol: 0.0005, a, b,
          sol: R`With $I(s) = \displaystyle\int_0^1\frac{x^s - 1}{\ln x}dx$, $I'(s) = \int_0^1x^s\,dx = \dfrac1{s + 1}$ and $I(0) = 0$, so $I(s) = \ln(1 + s)$. The integral is $I(${a}) - I(${b}) = \ln\dfrac{${1 + a}}{${1 + b}} = ${answer}$.`,
          trap: 'Differentiate with respect to the exponent, not $x$.' };
      },
      verify: (p) => simpson((x) => (x <= 0 ? 0 : x >= 1 ? p.a - p.b : (x ** p.a - x ** p.b) / Math.log(x)), 0, 1) },
    { id: 'cal-r4g3', type: 'nat', level: 3, exams: ['jam'], sub: 'geometric series',
      make(r) {
        const k = int(r, 1, 6), c = int(r, 1, 4);
        let H = 0; for (let j = 1; j <= k; j++) H += 1 / j;
        const answer = round(c * H / k, 4);
        return { q: R`Find $\displaystyle\sum_{n=1}^{\infty}\frac{${c}}{n(n + ${k})}$ (to four decimal places).`,
          answer, tol: 0.0005, k, c,
          sol: R`$\dfrac{1}{n(n + ${k})} = \dfrac1{${k}}\left(\dfrac1n - \dfrac1{n + ${k}}\right)$. Telescoping leaves the first ${k} terms $1 + \dots + \tfrac1{${k}} = ${round(H, 4)}$, so the sum is $\dfrac{${c}}{${k}}\times${round(H, 4)} = ${answer}$.`,
          trap: 'With a gap of $k$, the first $k$ reciprocals survive the cancellation.' };
      },
      verify: (p) => { let s = 0; for (let n = 1; n <= 20000; n++) s += p.c / (n * (n + p.k)); return s + p.c / 20000; } },
  ],
};
